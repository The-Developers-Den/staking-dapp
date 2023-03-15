import React, { SVGProps, useEffect, useState } from "react";
import Image from "next/image";
import NFTAbi from "@/ABIs/BuidlNFT.json";
import StakingAbi from "@/ABIs/Staking.json";
import { useAccount, useContract, useSigner } from "wagmi";

const NFTCard = ({ url, stake }: { url: string; stake: boolean }) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const stakingContract = useContract({
    address: StakingAbi.address,
    abi: StakingAbi.abi,
    signerOrProvider: signer,
  });
  const nftContract = useContract({
    address: NFTAbi.address,
    abi: NFTAbi.abi,
    signerOrProvider: signer,
  });

  const [nft, setNft] = useState<{
    name: string;
    image: string;
    desc: string;
    tokenID?: number;
  }>({ name: "", image: "", desc: "", tokenID: 2 });
  const stakeNft = async () => {
    try {
      const approve = await nftContract?.isApprovedForAll(
        address,
        StakingAbi.address
      );
      console.log(approve);
      if (!approve) {
        const tx = await nftContract?.setApprovalForAll(
          StakingAbi.address,
          true
        );
        console.log(tx);
      }
      const tx = await stakingContract?.stakeNFT(1);
      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };
  const unStakeNft = async () => {
    try {
      const tx = await stakingContract?.unStakeNFT(1);
      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };
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
          });
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    }
  }, [url]);

  return (
    <div>
      {stake ? (
        <div>
          <section className="text-center max-w-fit border px-3  rounded-md border-[#ffffff82] shadow-lg mx-2 hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <Image src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#524ffffb] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={stakeNft}
            >
              Stake
            </button>
          </section>
        </div>
      ) : (
        <div>
          <section className="text-center max-w-fit border px-3  rounded-md border-[#ffffff82] shadow-lg hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <Image src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#ff0909] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={unStakeNft}
            >
              Withdraw
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
