import React, { SVGProps, useEffect, useState } from "react";
import Image from "next/image";

const NFTCard = ({ url, stake }: { url: string; stake: boolean }) => {
  const [nft, setNft] = useState<{
    name: string;
    image: string;
    desc: string;
  }>({ name: "", image: "", desc: "" });

  useEffect(() => {
    if (url) {
      console.log(url);
      const getData = async () => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          console.log(data);
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

  //   getData();
  return (
    <div>
      {stake ? (
        <div>
          <section className="text-center max-w-fit border px-3  rounded-md border-[#ffffff82] shadow-lg mx-2 hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <Image src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button className="bg-[#524ffffb] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105">
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
            <button className="bg-[#ff0909] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105">
              Withdraw
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
