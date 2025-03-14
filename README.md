# BuyMeToken

A decentralized platform where supporters can send you tokens as appreciation, similar to "buy me a coffee" but with crypto tokens. Built with Next.js for the frontend and Hardhat for smart contracts, deployed on Vercel and Sepolia Network respectively.

- [Preview Link](https://buy-me-token.vercel.app/)
#### Make sure to Star the Repository ⭐️


![/public/screenshot.png](https://github.com/iShinzoo/BuyMeToken/blob/main/BuyMeMock.png)

## Features

- Connect Web3 wallet (MetaMask, WalletConnect, etc.)
- Send ERC-20 tokens to creator's wallet
- Display transaction history
- Responsive UI
- Real-time transaction notifications
- Network verification (Sepolia only)

## Tech Stack

**Frontend:**
- Next.js (React)
- Ethers.js
- Tailwind CSS

**Smart Contracts:**
- Solidity
- Hardhat
- Sepolia Testnet

**Deployment:**
- Vercel (Frontend)
- Alchemy/Infura (Blockchain Connection)
- Sepolia Ethereum Testnet

## Prerequisites

- Node.js (v18+)
- MetaMask (or other Ethereum wallet)
- Sepolia ETH (for testing)
- Alchemy/Infura account (for RPC URL)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/buymetoken.git
   cd buymetoken
   ```

2. **Install dependencies**
   ``` bash
   # Frontend
   cd client
   npm install

   # Smart Contracts
   cd ../hardhat
   npm install
   ```

## 🤝 Contributing
   - We welcome contributions! Check out our [CONTRIBUTING.md](https://github.com/iShinzoo/BuyMeToken/blob/main/CONTRIBUTING.md) for guidelines.

## Acknowledgements
* Inspired by BuyMeCoffee
* Built with contributions from the Open Source community
* Ethereum Foundation for Sepolia testnet
* Hardhat documentation
* Vercel for deployment hosting
