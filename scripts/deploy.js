const hre = require("hardhat");

async function main() 
{
    
    const BuyMeToken = await hre.ethers.getContractFactory("BuyMeToken");
    const buyMeToken = await BuyMeToken.deploy();

    await buyMeToken.waitForDeployment();

    const address = await buyMeToken.getAddress();

    console.log("Contract deployed to: ", address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });