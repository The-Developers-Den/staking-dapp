import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import TokenAbi from "@/ABIs/BuidlNFT.json";
import { useAccount, useSigner, useContract } from "wagmi";
import { ethers } from "ethers";

const Mint: NextPage = () => {
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const tokenContract = useContract({
    address: TokenAbi.address,
    abi: TokenAbi.abi,
    signerOrProvider: signer,
  });
  console.log(tokenContract);
  const getToken = async () => {
    try {
      const tx = await tokenContract?.mintToken(
        address,
        ethers.utils.parseEther("10")
      );
      console.log(tx);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {address && (
        <button
          className="p-3 bg-[#1b12c4] text-[#f3f1f1] text-lg rounded-xl mx-[50%] min-w-[150px] my-5 hover:scale-105 font-medium"
          onClick={getToken}
        >
          Get 10 BT
        </button>
      )}
    </div>
  );
};

export default Mint;
