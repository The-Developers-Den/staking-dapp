import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import NFTAbi from "@/ABIs/BuidlNFT.json";
import { useAccount, useSigner, useContract } from "wagmi";

const Mint: NextPage = () => {
  //   const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const nftContract = useContract({
    address: NFTAbi.address,
    abi: NFTAbi.abi,
    signerOrProvider: signer,
  });

  const mintNFT = async () => {
    try {
      const tx = await nftContract?.safeMint(
        address,
        "https://bafkreibl3ntsvrilgz5kicqsq27zb26a3tpym3wx3kwxuerg6mpf5ge674.ipfs.nftstorage.link/"
      );
      console.log(tx);
      //   router.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {address && (
        <button
          className="p-3 bg-[#ff1] text-black text-lg rounded-xl mx-[50%] min-w-[150px] my-5 hover:scale-105 font-medium"
          onClick={mintNFT}
        >
          Mint NFT
        </button>
      )}
    </div>
  );
};

export default Mint;
