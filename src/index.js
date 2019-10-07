const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const { INFURA_URL } = require("./constants");

require("dotenv").config(); // import env

const PROVIDER = `${INFURA_URL}${process.env.INFURA_RINKEBY_KEY}`;

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));

// 我的 public account
const addressFrom = "0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3";
const privateKey = process.env.PRIVATE_KEY;

async function main() {
  console.log("hello compound nodejs");
}

main();
