import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {WagmiProvider, http, createConfig} from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {metaMask} from 'wagmi/connectors'



const queryClient = new QueryClient()

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask()
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WagmiProvider>
      </BrowserRouter>
  </StrictMode>,
)
