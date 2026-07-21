require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",

  networks: {
    scai: {
      url: process.env.RPC_URL,
      chainId: 34,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};