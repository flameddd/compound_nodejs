const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const { INFURA_URL } = require("./constants");
const { cETH_ABI, DAI_ABI, TROLL_ABI } = require('./abi');

require("dotenv").config(); // import env

const PROVIDER = `${INFURA_URL}${process.env.INFURA_RINKEBY_KEY}`;

// Compound cETH contract address on testnet "rinkeby"
// ref: https://compound.finance/developers#networks testnet "rinkeby"
const RINKEBY_cETH_ADDRESS = "0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e";
const RINKEBY_cDAI_ADDRESS = "0x6d7f0754ffeb405d23c51ce938289d4835be3b14";
const RINKEBY_COMPTROLLER_ADDRESS = "0x2eaa9d77ae4d8f9cdd9faacd44016e746485bddb"

const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));

// 我的 public account
const addressFrom = "0xcBAB04d00E2eB9354f7b66BBc2c0D76B43Ed02d3";
const privateKey = process.env.PRIVATE_KEY;

async function sendSignedTransaction(txData) {
  const transaction = new EthereumTx(txData, {
    chain: "rinkeby",
    hardfork: "byzantium"
  });
  transaction.sign(new Buffer.from(privateKey, "hex"));
  const serializedTx = transaction.serialize().toString("hex");

  return await web3.eth
    .sendSignedTransaction(`0x${serializedTx}`)
    .on("error", console.error)
    .then(console.log);
}

async function mint_cETH() {
  const cETHContract = new web3.eth.Contract(cETH_ABI, RINKEBY_cETH_ADDRESS);

  cETHContract.methods
    .supplyRatePerBlock()
    .call()
    .then((result) => {
      console.log(`目前 Supply Rate PerBlock 為: ${result / 1e18}`);
    })
    .catch(console.error);

  const rawTrans = await cETHContract.methods.mint()
  const encodedABI = rawTrans.encodeABI();
  const txCount = await web3.eth.getTransactionCount(addressFrom);

  const gas = await rawTrans.estimateGas()
  const gasPrice = await web3.eth.getGasPrice()

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(gas * 4),
    gasPrice: web3.utils.toHex(Number(gasPrice) * 2),
    from: addressFrom,
    to: RINKEBY_cETH_ADDRESS,
    value: 2000000000000000000,  // 2 Ether
    data: encodedABI
  }

  // Minting cETH for 2 Ether. The mint function transfers an asset into the money market, which begins accumulating interest based on the current Supply Rate for the asset.
  await sendSignedTransaction(txData);
}

async function enterMarkets() {
  const trollContract = new web3.eth.Contract(
    TROLL_ABI,
    RINKEBY_COMPTROLLER_ADDRESS
  );

  const rawTrans = await trollContract.methods.enterMarkets([
    RINKEBY_cETH_ADDRESS,
    RINKEBY_cDAI_ADDRESS,
  ])

  const encodedABI = rawTrans.encodeABI();
  const txCount = await web3.eth.getTransactionCount(addressFrom);

  const gas = await rawTrans.estimateGas()
  const gasPrice = await web3.eth.getGasPrice()

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(gas * 4),
    gasPrice: web3.utils.toHex(Number(gasPrice) * 2),
    from: addressFrom,
    to: RINKEBY_COMPTROLLER_ADDRESS,
    data: encodedABI
  }

  await sendSignedTransaction(txData);
}

async function borrowToken() {

  const cDAIContract = new web3.eth.Contract(DAI_ABI, RINKEBY_cDAI_ADDRESS);

  const rawTrans = await cDAIContract.methods.borrow(5)
  const encodedABI = rawTrans.encodeABI();
  const txCount = await web3.eth.getTransactionCount(addressFrom);
  const gas = await rawTrans.estimateGas({ from: addressFrom })
  const gasPrice = await web3.eth.getGasPrice()

  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(gas * 4),
    gasPrice: web3.utils.toHex(Number(gasPrice) * 2),
    from: addressFrom,
    to: RINKEBY_cDAI_ADDRESS,
    data: encodedABI
  }

  await sendSignedTransaction(txData);

  const balanceCurrent = cDAIContract.methods.borrowBalanceCurrent(addressFrom)
  const borrowBalanceCurrent = await balanceCurrent.call()
  console.log(`Borrow Balance Current為： ${Number(borrowBalanceCurrent) / 1E18}`)
}  

async function main() {
  try {
    console.log("step1: mint cETH (so we can use them `borrow` on `compound`)")
    await mint_cETH()
    
    console.log("step2: enter markets for both ETH and DAI tokens using the Comptroller Contract")
    await enterMarkets()

    console.log("step3: borrow 5 `DAI`")
    await borrowToken()

  } catch (error) {
    console.log("error: ")
    console.error(error)
  }
}

main();
