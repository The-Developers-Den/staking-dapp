import React from "react";
import NFTCard from "../Cards/NFTCard";

const UnstakedNft = () => {
  const nfts = [
    "https://bafkreih73g4bdfee55w7izme3ryt6imjuh2nykdnxxpwe6eepdqrrkjcjm.ipfs.nftstorage.link/",
    "https://bafkreidmg7cxmxvk4ezfma537c7rtgt4imoixugyhof7bxm5gcdtwcehna.ipfs.nftstorage.link/",
    "https://bafkreih5iqfy6ei6xppvckkydsxcva627h2g43qemv5y4yc3ru6x4gwhwq.ipfs.nftstorage.link/",
  ];
  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your Staked NFTs</h2>
      <div className="flex mx-auto my-7">
        {nfts.map((nft, id) => (
          <NFTCard key={id} url={nft} stake={true} />
        ))}
      </div>
    </div>
  );
};

export default UnstakedNft;
