import React, { useEffect } from "react";
import NFTCard from "../Cards/NFTCard";
import { useAccount, useReadContract, useWalletClient } from "wagmi";
import { formatUnits } from "viem";
import StakingAbi from "@/ABIs/Staking.json";
import NFT from "@/ABIs/BuidlNFT.json";
// Define your contract configs with hardcoded ABIs
const stakingContractConfig = {
  address: StakingAbi.address as `0x${string}`, // Replace with your actual address
  abi: [
    {
      name: "stakeTokenId",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "staker", type: "address" }],
      outputs: [{ name: "tokenId", type: "uint256" }],
    },
    {
      name: "calculateReward",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "staker", type: "address" }],
      outputs: [{ name: "reward", type: "uint256" }],
    },
  ],
} as const;

const nftContractConfig = {
  address: NFT.address as `0x${string}`, // Replace with your actual address
  abi: [
    {
      name: "tokenURI",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "tokenId", type: "uint256" }],
      outputs: [{ name: "uri", type: "string" }],
    },
  ],
} as const;

const StakedNft = () => {
  const { address } = useAccount();

  // Use the useReadContract hook to get the staked token ID
  const { data: stakedTokenId } = useReadContract({
    ...stakingContractConfig,
    functionName: "stakeTokenId",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Use the useReadContract hook to get the reward
  const { data: rewardBalance } = useReadContract({
    ...stakingContractConfig,
    functionName: "calculateReward",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const isStaked = stakedTokenId?.toString().length != 0;

  // Convert tokenId to number for display and fetch tokenURI
  const tokenId = isStaked ? Number(stakedTokenId) : undefined;
  console.log(tokenId, stakedTokenId);

  // Use useReadContract to get the token URI
  const { data: tokenURI } = useReadContract({
    ...nftContractConfig,
    functionName: "tokenURI",
    args: [BigInt(0)],
    query: {
      enabled: isStaked,
    },
  });
  console.log({ tokenURI, tokenId });

  const formattedRewardBal = rewardBalance
    ? formatUnits(rewardBalance, 18)
    : "0";

  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your Staked NFTs</h2>
      <div className="mx-auto my-7">
        {tokenURI && formattedRewardBal !== "0" && isStaked ? (
          <NFTCard
            url={tokenURI as string}
            stake={false}
            tokenId={tokenId ?? 0}
          />
        ) : (
          <section className="border p-5 rounded-lg shadow-lg">
            <h1 className="my-5 text-lg">No NFTs Staked!</h1>
          </section>
        )}
      </div>
    </div>
  );
};

export default StakedNft;
