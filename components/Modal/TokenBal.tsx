import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther, formatUnits } from "viem";
import StakingAbi from "@/ABIs/Staking.json";
import Token from "@/ABIs/BuidlToken.json";

// First, define your contract configs
const tokenContractConfig = {
  address: Token.address as `0x${string}`, // Replace with your actual token address
  abi: [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "owner", type: "address" }],
      outputs: [{ name: "balance", type: "uint256" }],
    },
  ],
} as const;

const stakingContractConfig = {
  address: StakingAbi.address as `0x${string}`, // Replace with your actual staking contract address
  abi: [
    {
      name: "calculateReward",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "staker", type: "address" }],
      outputs: [{ name: "reward", type: "uint256" }],
    },
  ],
} as const;

const TokenBal = () => {
  const { address } = useAccount();

  // Use the useReadContract hook to get the balance
  const { data: tokenBalance } = useReadContract({
    ...tokenContractConfig,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    },
  });

  // Use the useReadContract hook to get the reward
  const { data: rewardBalance } = useReadContract({
    ...stakingContractConfig,
    functionName: "calculateReward",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    },
  });

  // Format the values for display
  const formattedTokenBal = tokenBalance ? formatEther(tokenBalance) : "0";
  const formattedRewardBal = rewardBalance
    ? formatUnits(rewardBalance, 18)
    : "0";

  return (
    <div className="flex flex-col text-center justify-center ">
      <h2 className="mt-5 text-2xl">Your Tokens</h2>
      <div className="flex mx-auto my-5">
        <section className="border p-5 rounded-lg m-2">
          <h2>Rewards</h2>
          {formattedRewardBal + " BT"}
        </section>
        <section className="border p-5 rounded-lg m-2">
          <h2>Balance</h2>
          {formattedTokenBal + " BT"}
        </section>
      </div>
    </div>
  );
};

export default TokenBal;
