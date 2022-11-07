const hre = require("hardhat");

async function main() {
  // signer1 is my wallet address who deployed the contract , all tokens will be transferred initially to this address
  [signer1] = await hre.ethers.getSigners();

  // this signer2 is my second wallet address hardcoded here 
  const signer2 = "0x512b1121c0985DD40ecAddAc48e66f41373a6648";

  // deploy bank contract
  const Bank = await hre.ethers.getContractFactory("Bank", signer1);
  const bankContract = await Bank.deploy();
  await bankContract.deployed();
  console.log(`Bank contract deployed to ${bankContract.address} by ${signer1.address}`);

  // deploy matic contract
  const Matic = await hre.ethers.getContractFactory("Matic", signer2);
  const matic = await Matic.deploy();
  await matic.deployed();
  console.log(`Matic contract deployed to ${matic.address} by ${signer2}`);

  // deploy Shib contract
  const Shib = await hre.ethers.getContractFactory("Shib", signer2);
  const shib = await Shib.deploy();
  await shib.deployed();
  console.log(`Shib contract deployed to ${shib.address} by ${signer2}`);

  // deploy usdc contract
  const Usdt = await hre.ethers.getContractFactory("Usdt", signer2);
  const usdt = await Usdt.deploy();
  await usdt.deployed();
  console.log(`Usdt contract deployed to ${usdt.address} by ${signer2}`);

  // whiteList the three tokens while deploying using whitelistToken function
  // this function takes symbol and tokenAddress

  // WhiteList the MAtic tokens whitelistToken function
  await bankContract.whitelistToken(ethers.utils.formatBytes32String("Matic"), matic.address);

  // WhiteList the Shib tokens whitelistToken function
  await bankContract.whitelistToken(ethers.utils.formatBytes32String("Shib"), shib.address);

  // WhiteList the usdt tokens whitelistToken function
  await bankContract.whitelistToken(ethers.utils.formatBytes32String("Usdt"), usdt.address);

  // WhiteList the Eth tokens whitelistToken function using generated random address
  await bankContract.whitelistToken(ethers.utils.formatBytes32String("Eth"), "0x09B5DC75789389d1627879bA194874F459364859");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
