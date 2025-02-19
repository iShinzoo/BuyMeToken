import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'd1907ce9b4565853d18b3413ce5f7ad2',
  chains: [sepolia],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
      <RainbowKitProvider modalSize="compact"
          theme={darkTheme({
            accentColor: '#4f46e5',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          coolMode
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
  </WagmiProvider>
  );
}
