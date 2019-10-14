## about this DEMO
- nodejs 去串「Compound（contract）」把「某一種token」「借/收」出去

共執行了 3 個步驟  
1. `mint` `cETH`
    - so we can use them `borrow` on `compound`
2. `enter markets` for both ETH and DAI tokens
    - In order to **supply** `collateral` or `borrow` in a market, it must be entered first
3. `borrow` 5 `DAI`

### 其他說明
- 採用 testnet `rinkeby`
- `mint` 的測試是用 `ETH` 去 mint `cETH`
  - 如果要 mint 其他 token，應該是用其他 contract 的 `abi`、`token address` (compound 官網都有 data 跟 address)去操作 contract 就行了

#### 關於 `uniswap`
`uniswap` 的功能可以直接兌換 `cDAI`

原本設想流程爲
- `uniswap` 將 `ETH` 兌換成任意一種 token (如 `DAI`)
- 接著用 `compound` 將 `DAI` 借出去為 cToken (`cDAI`) 生利息

但 `uniswap` 好像就能做到 `ETH` -> `cDAI`

相比較
- `ETH` -> `DAI` -> `cDAI`
- `ETH` -> `cDAI`

直接用 `uniswap` 可能就**少一次交易**  
而 `uniswap` 又說可以支援任何 `erc20`  
所以說 `compound` 目前所有支援的 token
- `ETH(Ether)`
- `DAI(Dai)`
- `USDC(USD Coin)`
- `REP(Augur)`
- `ZRX(0x)`
- `BAT(Basic Attention Token)`
- `WBTC(Wrapped BTC)`

說不定都能直接走 `uniswap` 就好！！  
但關於這點，我沒有查到更多資訊  
目前只看到 `uniswap` **單單有支援 `cDAI`**，其他的 token 都沒看到  
或者後續有需要的話，是自己去建立某一個 cToken 的 `exchange contract` 來使用  
此議題先想到這邊了，不再研究。

### ref document:
- https://compound.finance/developers
- https://medium.com/quiknode/building-applications-on-compound-finance-cf2640514f4f
  - source code: https://github.com/buddies2705/CompoundFinance

### 執行方法
#### downlaod repo and install  
```
git clone https://github.com/flameddd/compound_nodejs.git
cd compound_nodejs
npm install
```

#### 申請 infura（有了就不用申請了）
- https://infura.io/dashboard
- 建立屬於自己的 project
- 記下 `PROJECT ID`

#### 建立環境變數 
- 根目錄底下建立 `.env` 檔案（可以複製 `.env.template` 出來改檔名）
- 填上 `INFURA_RINKEBY_KEY`（上面提到的 PROJECTID）
- 填上 `拿來測試用的 account 的私鑰`  

（`.env` 不會被 git 紀錄，也不會被 commit 出去）

#### 填上 `account address`
- 修改 `src/index.js` 檔案的 **Line 19** 行，填上測試用 `account address`

### 執行
```
npm start
```

### Screenshots
![image](/imgs/screenshot_001.png)
