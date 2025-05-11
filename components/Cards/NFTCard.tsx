import React, { useEffect, useState } from "react";
import Image from "next/image";
import NFTAbi from "@/ABIs/BuidlNFT.json";
import StakingAbi from "@/ABIs/Staking.json";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const NFTCard = ({
  url,
  stake,
  tokenId,
}: {
  url: string;
  stake: boolean;
  tokenId: number;
}) => {
  const { address } = useAccount();
  const [nft, setNft] = useState<{
    name: string;
    image: string;
    desc: string;
    tokenID?: number;
  }>({ name: "", image: "", desc: "", tokenID: tokenId });

  const [isProcessing, setIsProcessing] = useState(false);

  // Get approval status
  const { data: isApproved } = useReadContract({
    address: NFTAbi.address as `0x${string}`,
    abi: NFTAbi.abi,
    functionName: "isApprovedForAll",
    args: address ? [address, StakingAbi.address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Set up write contract hook
  const { writeContract } = useWriteContract();

  // Handle staking NFT
  const stakeNft = async () => {
    setIsProcessing(true);
    try {
      // First check if we need to approve
      if (!isApproved) {
        await writeContract({
          address: NFTAbi.address as `0x${string}`,
          abi: NFTAbi.abi,
          functionName: "setApprovalForAll",
          args: [StakingAbi.address as `0x${string}`, true],
        });

        // Wait a bit for the approval to be processed
        setTimeout(async () => {
          try {
            await writeContract({
              address: StakingAbi.address as `0x${string}`,
              abi: StakingAbi.abi,
              functionName: "stakeNFT",
              args: [BigInt(nft.tokenID || 0)],
            });
            window.alert("NFT Stake Successful");
          } catch (err) {
            console.log("Error staking NFT:", err);
          } finally {
            setIsProcessing(false);
          }
        }, 2000);
      } else {
        // If already approved, stake the NFT
        await writeContract({
          address: StakingAbi.address as `0x${string}`,
          abi: StakingAbi.abi,
          functionName: "stakeNFT",
          args: [BigInt(nft.tokenID || 0)],
        });
        window.alert("NFT Stake Successful");
        setIsProcessing(false);
      }
    } catch (err) {
      console.log("Error staking NFT:", err);
      setIsProcessing(false);
    }
  };

  // Handle unstaking NFT
  const unStakeNft = async () => {
    setIsProcessing(true);
    try {
      await writeContract({
        address: StakingAbi.address as `0x${string}`,
        abi: StakingAbi.abi,
        functionName: "unStakeNFT",
        args: [BigInt(nft.tokenID || 0)],
      });

      // Wait a bit for the unstaking to be processed
      setTimeout(async () => {
        try {
          await writeContract({
            address: NFTAbi.address as `0x${string}`,
            abi: NFTAbi.abi,
            functionName: "setApprovalForAll",
            args: [StakingAbi.address as `0x${string}`, false],
          });
          window.alert("NFT Unstake Successful");
        } catch (err) {
          console.log("Error removing approval:", err);
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
    } catch (err) {
      console.log("Error unstaking NFT:", err);
      setIsProcessing(false);
    }
  };

  // Fetch NFT metadata from URL
  useEffect(() => {
    if (url) {
      const getData = async () => {
        try {
          const res = await fetch(url);
          const data = await res.json();

          setNft({
            name: data.name,
            image: data.image,
            desc: data.description,
            tokenID: tokenId,
          });
        } catch (err) {
          console.log("Error fetching NFT metadata:", err);
        }
      };
      getData();
    }
  }, [tokenId, url]);

  return (
    <div>
      {stake ? (
        <div>
          <section className="text-center max-w-fit border px-3 rounded-md border-[#ffffff82] shadow-lg mx-2 hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <Image src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#524ffffb] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={stakeNft}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Stake"}
            </button>
          </section>
        </div>
      ) : (
        <div>
          <section className="text-center max-w-fit border px-3 rounded-md border-[#ffffff82] shadow-lg hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <Image src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#ff0909] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={unStakeNft}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Withdraw"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
