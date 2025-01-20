const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);    
}

async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Balance of ${address} is ${await getBalance(address)}`);
        idx++;
    }   
}

async function printMemos(memos){
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
    }
}

async function main() { 

    const [owner, tipper, tipper1, tipper2] = await hre.ethers.getSigners();

    const BuyMeAToken = await hre.ethers.getContractFactory("BuyMeAToken");
    const buyMeAToken = await BuyMeAToken.deploy();

    await buyMeAToken.deployed();
    console.log("Contract deployed to:", buyMeAToken.address);

    const addresses = [owner.address, tipper.address, buyMeAToken.address];

    console.log("== start ==");
    await printBalances(addresses);

    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeAToken.connect(tipper).buyToken("Krishna","you are the best", tip); 
    await buyMeAToken.connect(tipper1).buyToken("KK","you are the op", tip); 
    await buyMeAToken.connect(tipper2).buyToken("Krsna","you are the beast", tip); 

    console.log("== bought token ==");
    await printBalances(addresses);

    await buyMeAToken.connect(owner).withdrawTips();

    console.log("== withdraw tips =="); 
    await printBalances(addresses);

    console.log("== memos ==");
    const memos = await buyMeAToken.getMemos();
    printMemos(memos);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });