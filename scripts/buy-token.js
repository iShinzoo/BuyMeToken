const { ethers } = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.formatEther(balanceBigInt); // Use ethers.formatEther directly
}

async function printBalances(addresses) {
  for (let i = 0; i < addresses.length; i++) {
    console.log(`Address ${i} balance: ${await getBalance(addresses[i])}`);
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  const [owner, tipper, tipper1, tipper2] = await ethers.getSigners();

  const BuyMeToken = await ethers.getContractFactory("BuyMeToken");
  const buyMeToken = await BuyMeToken.deploy();

  // Wait for the contract to be fully deployed
  await buyMeToken.waitForDeployment();

  // Get the deployed contract address
  const address = await buyMeToken.getAddress();
  console.log("Contract deployed to: ", address);

  const addresses = [owner.address, tipper.address, address]; // Use the resolved address

  console.log("== start ==");
  await printBalances(addresses);

  const tip = { value: ethers.parseEther("1") }; // Use ethers.parseEther directly
  await buyMeToken.connect(tipper).buyToken("Krishna", "you are the best", tip);
  await buyMeToken.connect(tipper1).buyToken("KK", "you are the op", tip);
  await buyMeToken.connect(tipper2).buyToken("Krsna", "you are the beast", tip);

  console.log("== bought token ==");
  await printBalances(addresses);

  await buyMeToken.connect(owner).withdrawTips();

  console.log("== withdraw tips ==");
  await printBalances(addresses);

  console.log("== memos ==");
  const memos = await buyMeToken.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });