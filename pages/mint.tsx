import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import NFTAbi from "@/ABIs/BuidlNFT.json";
import { useAccount, useWriteContract } from "wagmi";

const Mint: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  // Use writeContract hook for minting
  const { writeContract } = useWriteContract();

  const mintNFT = async () => {
    if (!address) return;

    setIsMinting(true);
    try {
      // Use the writeContract hook to mint the NFT
      await writeContract({
        address: NFTAbi.address as `0x${string}`,
        abi: NFTAbi.abi,
        functionName: "safeMint",
        args: [
          address,
          "https://bafkreih73g4bdfee55w7izme3ryt6imjuh2nykdnxxpwe6eepdqrrkjcjm.ipfs.nftstorage.link/",
        ],
      });
    } catch (err) {
      console.log("Error minting NFT:", err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      {address && (
        <button
          className="p-3 bg-[#ff1] text-black text-lg rounded-xl mx-[50%] min-w-[150px] my-5 hover:scale-105 font-medium"
          onClick={mintNFT}
          disabled={isMinting}
        >
          {isMinting ? "Minting..." : "Mint NFT"}
        </button>
      )}
    </div>
  );
};

export default Mint;
