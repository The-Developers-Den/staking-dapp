import React from "react";
import NFTCard from "../Cards/NFTCard";

const StakedNft = () => {
  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your Staked NFTs</h2>
      <div className="mx-auto my-7">
        <NFTCard
          url={
            "https://bafkreihsmppirgyrxdx6zaf56kkseltkc7d3wlqannwpirexovclwzkili.ipfs.nftstorage.link/"
          }
          stake={false}
        />
      </div>
    </div>
  );
};

export default StakedNft;
