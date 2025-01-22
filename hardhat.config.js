require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true 
    }
  },
  networks: {
    sepolia: {
      url: process.env.URL,
      accounts: [process.env.PRIVATE_KEY],  
    },
  },
  paths: {
    sources: "./contracts",
  }
};