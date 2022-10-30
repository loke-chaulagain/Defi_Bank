require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_GOERLI_API_KEY,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
};
