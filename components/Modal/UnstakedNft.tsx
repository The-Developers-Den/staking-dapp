import React, { useEffect, useState } from "react";
import NFTCard from "../Cards/NFTCard";
import { useAccount, useReadContract } from "wagmi";
import NFT from "@/ABIs/BuidlNFT.json";

// Define your contract config with hardcoded ABI
const nftContractConfig = {
  address: NFT.address as `0x${string}`, // Replace with your actual address
  abi: [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "owner", type: "address" }],
      outputs: [{ name: "balance", type: "uint256" }],
    },
    {
      name: "tokenOfOwnerByIndex",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "owner", type: "address" },
        { name: "index", type: "uint256" },
      ],
      outputs: [{ name: "tokenId", type: "uint256" }],
    },
    {
      name: "tokenURI",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "uri", type: "string" }],
    },
  ],
} as const;

const UnstakedNft = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<{ tokenId: number; url: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Get NFT balance
  const { data: balanceData } = useReadContract({
    ...nftContractConfig,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Convert balance to a number
  const balance = balanceData ? Number(balanceData) : 0;

  // Get token ID at current index
  const { data: tokenIdData } = useReadContract({
    ...nftContractConfig,
    functionName: "tokenOfOwnerByIndex",
    args:
      address && currentIndex < balance
        ? [address, BigInt(currentIndex)]
        : undefined,
    query: {
      enabled: !!address && currentIndex < balance,
    },
  });

  // Convert token ID to number
  const tokenId = tokenIdData ? Number(tokenIdData) : undefined;

  // Get token URI for current token ID
  const { data: tokenURI } = useReadContract({
    ...nftContractConfig,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  // When we get a token URI, add it to our NFTs array and increment the index
  useEffect(() => {
    if (tokenId !== undefined && tokenURI) {
      // Add this NFT to our collection
      setNfts((prev) => {
        // Check if we already have this token ID to avoid duplicates
        if (!prev.some((nft) => nft.tokenId === tokenId)) {
          return [...prev, { tokenId, url: tokenURI as string }];
        }
        return prev;
      });

      // Move to next index
      setCurrentIndex((prev) => prev + 1);
    }
  }, [tokenId, tokenURI]);

  // Reset the process when address or balance changes
  useEffect(() => {
    setNfts([]);
    setCurrentIndex(0);
  }, [address, balanceData]);

  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your NFTs</h2>
      <div className="flex flex-wrap mx-auto my-7">
        {nfts.length > 0
          ? nfts.map((nft, id) => (
              <NFTCard
                key={id}
                url={nft.url}
                stake={true}
                tokenId={nft.tokenId}
              />
            ))
          : balance === 0 && (
              <section className="border p-5 rounded-lg shadow-lg">
                <h1 className="my-5 text-lg">No NFTs Found</h1>
              </section>
            )}
        {/* Show loading indicator while fetching */}
        {currentIndex < balance && nfts.length === 0 && (
          <section className="border p-5 rounded-lg shadow-lg">
            <h1 className="my-5 text-lg">Loading NFTs...</h1>
          </section>
        )}
      </div>
    </div>
  );
};

export default UnstakedNft;
