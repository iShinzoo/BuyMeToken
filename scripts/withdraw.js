const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {

  const contractAddress="0xB72E17d82F505976569F6E513D5a60E9fa35a417";
  const contractABI = abi.abi;

  const provider = new hre.ethers.providers.AlchemyProvider("sepolia", process.env.SEPOLIA_KEY);

  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const buyMeToken = new hre.ethers.Contract(contractAddress, contractABI, signer);

  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeToken.address);
  console.log("current balance of contract: ", await getBalance(provider, buyMeToken.address), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeToken.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });