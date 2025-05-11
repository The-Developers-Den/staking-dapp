import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My Staking Dapp",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [
    {
      ...sepolia,
      rpcUrls: {
        default: {
          http: [process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? ""],
        },
      },
    },
  ],
});
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact">
              <Navbar />
              <Component {...pageProps} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ) : (
        <div className="flex justify-center text-2xl my-[50%]">Loading</div>
      )}
    </>
  );
}
