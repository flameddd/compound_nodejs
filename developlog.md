## 探索方向
- nodejs 去串「Compound（contract）」把「某一種token」「借/收」出去
- 看起來可以用 uniswap 直接交換 cToken

### ref
- https://medium.com/quiknode/building-applications-on-compound-finance-cf2640514f4f
- https://compound.finance/developers

### 20191007
１５：４３ 第一次開工 compound 專案  

```
Compound v2 is running smoothly on the Ethereum mainnet, and now supports Ether, 0x, Augur, Basic Attention Token, Dai, and USDC.
```

那有沒有 testnet？
- https://compound.finance/developers

這邊有各 net 的 address  
１６：１８ uniswap 可以直接兌換 cDIA 耶  
- https://rinkeby.etherscan.io/token/0x6d7f0754ffeb405d23c51ce938289d4835be3b14


好像要先了解一些名詞才行

#### Collateral
- 要從 `protocol`「借」的話，「帳號」需要有足夠的「`collateral`」  

#### Exponential Math
透過「a system of exponential math」讓「fractional quantities」的計算夠精準、準確  
Exponential.sol
- https://github.com/compound-finance/compound-money-market/blob/master/contracts/Exponential.sol

#### Gas Costs
- gas 依據 market and user 浮動
- 每一次計算，都會觸發 `checking account liquidity`。根據 `entered markets` 的次數而增加 gas costs。

這張表大略給一些方向  

| Function | Typical Gas Cost |
| ------ | ------ |
|Mint|< 90K|
|Redeem, Transfer|< 250K if borrowing, otherwise < 90K|
|Borrow|< 300K|
|Repay Borrow|< 90K|
|Liquidate Borrow|< 400K|

### 20191008
繼續開工  
繼續看點基本知識  

１４：３６ 擔保、清算人... 很金融的名詞  

#### cToken! 感覺就很關鍵
- 每一種 `Compound Protocol` 所支持的 asset 現在都整合了 `cToken smart contract`
- 也就是相容 `EIP-20`（protocol 能呈現供給結算）
- User 透過 `minting tokens(cTokens)` 提供給 `protocal`，精準的增加 User 底下的相關資產


cTokens
- `cTokens` 是主要用來跟 `Compound Protocol` 的方法
- 每一個 money market 會建立自己的 `cToken contract`
- 每當 user 操作 mints, redeems, borrows, repays a borrow, liquidates a borrow, or transfers cTokens 時，都會用到 `cToken contract`

現在有兩種 `cTokens`
- `CErc20`
  - `CErc20` wraps an underlying `ERC-20` asset
- `CEther`
  - `CEther` simply wraps Ether itself
- 都 expose `EIP-20` 的 interface

１５：０９ 看來是會依據不同的操作，用到不同的 cToken  
接著看另一篇實作 blog 吧  
１５：２２ 很一陣子沒看到爛 code/repo 了＠＠  

cToken：是 `compound` 上用於實際資產的 ERC20 token  
因此，如果要使用 `ZRX`， `compound` 將它們包裝到 `cToken` 中並使其成為 `cZRX`  
每個資產都有單獨的 contract。因此，要創建借貸，需要這些 `cToken`  

範例將用 `DAI` 並將 `ETH` 作為抵押  

１５：３４ 範例要做的事情
1. We need to have a `cToken contract` for `ETH` and `DAI`
  - which are `cETH` and `cDAI`
2. We will also need `Comptroller contract`
  - which `manages the risk` associated with the Compound Protocol v2


It is responsible for determining when accounts are underwater and can be liquidated. 

It determines how much collateral can be seized in exchange for liquidating an underwater account. 

We need to `mint` some `cETH` so we can use them `borrow` on `compound`. The `compound protocol` **only recognizes** these `minted tokens`.


１５：５１ 後續的東西看起來要看 code  
比較好一起理解，code 不多  
先整理吧  

１６：４１ 整理 code 中  
衝刺一下，今天整理個大概  執行一次看看  

１６：４７ 看來肯定是不行，因為我改寫範例的寫法  哪邊需要簽名我還不知道  
１７：０２ INFURA 好像不支援這種 sing raw tracsaction 的樣子  
下次研究比較好的做法，希望是跟 uniswap 那邊寫法一樣，比較清楚  
今天先這樣吧  

### 20191012
１５：１２ 開工  
１６：４３ 卡了很久 應該是 infura 不接受 raw transaction  
終於看到一篇 blog 的範例應該有機會....  
來試試看  
- https://medium.com/coinmonks/deploying-ethereum-dapp-rest-api-on-aws-lambda-using-node-js-web3-beta-and-infura-513cc92a9de5

１７：１１ 好像成功了  
這邊能看到我的 transaction
- https://rinkeby.etherscan.io/token/0xd6801a1dffcd0a410336ef88def4320d6df1883e
  - https://rinkeby.etherscan.io/tx/0x09cdbce06968351551bec48a273a6b9463709688ce92fe725763f09d424e278a

我拿到 95.52613778 cETH cToken。  

１７：１６ 繼續第二步驟  
１７：２７ step2 執行～  

１７：２９ step2 好像也成功了，至少 status === true
- https://rinkeby.etherscan.io/tx/0x745944ec47131c8ed8fc088f33f8432b65b18cd4b5f4cc7c5a2a5159354da4b6

１７：４３ step3 也成功了？  
- https://rinkeby.etherscan.io/tx/0xce0d34d5cf1d4bef0a7a2f580f477130b03b93acddb60cdde237235da07f9194

好像有拿到，但數字很小？看不出來？  
- 0.000000000000000005 DAI


１７：５２ 看來是成功了  
終於還是找到解法了  
- Borrow Balance Current為： 2.5e-17

下次再來想原理，流程，跟 readme 吧  
最少在兩天就能結束掉這部分  
先去吃東西  

### 20191014
１５：１７ 今天主要是
- 整理 readme
- 弄清楚思緒
- 想清楚跟 uniswap 的關係

科普一下 DAI 是什麼
```
Maker是什麽？

從Maker的第一個產品Dai開始解釋，並非Maker是誰？
Dai是一種穩定幣(stablecoin)。穩定幣的概念非常簡單和比特幣和以太幣一樣是區塊鏈上的一種Token。

但和比特幣或以太幣不一樣的是
- Dai沒有波動性。“有什麽東西沒有波動性的？波動性是相對的！”
- Dai是與美元掛鉤的相對穩定的資產
- 1Dai 等於 1 USD。Dai將成為第一個消費級穩定幣。

MakerDAO: DAI
2017年誕生，網絡有DAI和MKR兩種幣，提供交易和放貸服務。收ETH作抵押，借給用戶DAI，並有機制保障1 DAI=1美金，另發行MKR用於支付服務費和投票參與決策。
```

MakerDAO: MKR
- DAI和MKR都是基於Ethereum平台開發的Token。

MakerDAO提供兩大服務
- 交易所：讓"用戶和用戶"兌換ETH和DAI和MKR和其它Token。
- 放貸合約：讓"用戶和合約"兌換ETH和DAI。把一筆ETH抵押在名為Collateralized Debt Position的智能合約，就能借到DAI；將相同數量的DAI歸還、支付以MKR計算的服務費，就能拿回原先那筆ETH。並且這份放貸合約可轉移給別的用戶。


１５：３２ 重新想一下，我做了什麼
1. `mint` `cETH` so we can use them `borrow` on `compound`. 
2. enable markets for both ETH and DAI tokens using the Comptroller Contract.
3. borrow 5 "DAI"

這個最後的是成功 `borrow 5 DAI` 了  

但我要的是 land 出去才對吧？  

```
Mint
The mint function transfers an asset into the money market, which begins accumulating interest based on the current supply rate for the asset. The number of tokens minted is the amount of underlying asset being provided divided by the current exchange rate
```

Mint 出去就有 `interest` 了嗎？？？  
只能針對 ether？  

１５：５１ 不同的 token，就操作不同的 contract 就好  
應該是這樣  
拿不同的 address + abi 去連結 and 操作就好  


１５：５９ 什麼叫做 enter markets?
```
Enter Markets
Enter into a list of markets - it is not an error to enter the same market more than once. In order to supply collateral or borrow in a market, it must be entered first.
```

為了要支持 market(money market) `collateral(抵押)` 跟 `borrow(借)`，首先需要先 `enter market`  

１６：０７ 開始來思考 uniswap 的關係？  
Compound 支持的有
- `ETH(Ether)`
- `DAI(Dai)`
- `USDC(USD Coin)`
- `REP(Augur)`
- `ZRX(0x)`
- `BAT(Basic Attention Token)`
- `WBTC(Wrapped BTC)`

uniswap 能支持所有的 erc20 才對  
所以基本上不需要 compound 做 token to cToken 這對才對  

１６：２４
cDAI: 0xf5dce57282a584d2746faf1593d3121fcac444dc  

１６：３０ 算了  我把結論寫一寫  
後續不研究了  
不該繼續 deplay 我自己的事情