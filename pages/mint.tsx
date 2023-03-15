import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import NFTAbi from "@/ABIs/BuidlNFT.json";
import { useAccount, useSigner, useContract } from "wagmi";

const Mint: NextPage = () => {
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const nftContract = useContract({
    address: NFTAbi.address,
    abi: NFTAbi.abi,
    signerOrProvider: signer,
  });
  const mintNFT = async () => {
    try {
      const tx = await nftContract?.mintNFT(address);
      console.log(tx);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return <div>Mint</div>;
};

export default Mint;
