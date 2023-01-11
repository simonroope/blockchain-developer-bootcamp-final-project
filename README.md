# blockchain-developer-bootcamp-final-project

## Project Idea
To create decentralised fixed income bonds, each represented as an NFT. 


### What Is a Bond?
A bond is a fixed income instrument that represents a loan made by an investor to a borrower (typically corporate or government). A bond can be thought of as an I.O.U between the lender and borrower that includes the details of the loan and its payments. Bonds are used by companies, municipalities, states, and sovereign governments to finance projects and operations. Owners of bonds are debt holders, or creditors, of the issuer.
The market price of a bond depends on a number of factors: the credit quality of the issuer, the length of time until expiration, and the coupon rate compared to the general interest rate environment at the time. 


### Why decentralise?
* The most common process for issuing bonds is through underwriting. When a bond issue is underwritten, one or more securities firms or banks, form a syndicate, buy the entire issue of bonds from the issuer and resell them to investors. Decentralisation will not limit access and will allow all market participants to issue and buy assets and at more competitive rates.
* Bonds can be bought and sold in the “secondary market” after they are issued. Most are traded over-the-counter (OTC) between large broker-dealers acting on their clients' or their own behalf. A decentralised market place will broaden bond ownership and enhance bond liquidity.


### Attributes of a Bond
* Issuer:
* Issue date:
* Issue price: is the price at which the bond issuer originally sells the bonds.
* Coupon rate: is the rate of interest the bond issuer will pay on the face value of the bond, expressed as a percentage.
* Coupon dates: are the dates on which the bond issuer will make interest payments. Payments can be made in any interval, but the standard is semiannual payments.
* Maturity date: is the date on which the bond will mature and the bond issuer will pay the bondholder the face value of the bond.
* Face value: is the money amount the bond will be worth at maturity.

### Workflow
* Create bonds: mint NFT
* Issue bond: transfer NFT from issuer to investor in exchange for issue price amount. 
* Make coupon payments: pay borrower interest on specified dates.
* Bond defaults: the bond issuer fails to make coupon payments within the specified period.
* Bond matures: principal amount is paid back in full by issuer to bond holder.


### Factors for consideration
* Bond rating: Ratings agencies assign bond ratings to bonds and bond issuers, based on their creditworthiness. Over its duration, the credit rating of a bond may change and this historical change needs to be recorded on-chain. This information is key for a bond's inclusion in collateralised debt obligations.   
* Bond currency: can trades and interest payments be made in multiple cryptocurrencies, inc stablecoins?




# Final Project : Issue, Buy and Sell Fixed Income Bonds

## Deployed version url
https://final-project-sroope.netlify.app

## Project description
This Dapp is an exchange to issue, buy and sell Fixed Income Bonds. Users are able to issue Bonds (with attributes of their choice) and list them for sale. The currency to trade bonds is Dai (MockDai on testnets).  

The contracts are deployed and verified on the Goerli testnet at:
* MockDai: 0x575fb509b5504CB8CE5c0639E60C3d2ac3a7D2Ae
* BondToken: 0xa9e6Cd2a8a26BDC2738B9E9FCB37e318636C5bf2
* BondMarket: 0x9541DE6a55BAe8494eeDC58C5387F61fb9810D71

## How to run this project locally
To run the DApp in a local environment, the following dependencies are required:

* Node v16.19.0
    * download Node: https://nodejs.org/en/download/
* Truffle v5.7.2
    * Truffle: npm i -g truffle
    * HDWallet provider: npm i @truffle/hdwallet-provider
    * Ganache-cli: npm i ganache-cli
    * Open-zeppelin contracts and libraries: npm i @openzeppelin/contracts
    * Open-zeppelin test helpers: npm i @openzeppelin/test-helpers

* Web3:
    * Web3 Connector: npm i @web3-react/core @web3-react/injected-connector
    * ethers: npm i ethers

* Front End:
    * React: npm i -g react
    * Bootstrap: npm i bootstrap
    * React-bootstrap: npm i react-bootstrap
    * node-sass: npm i node-sass
    * dayjs: npm i dayjs

* Utils .env file: npm i dotenv

Install metamask wallet in your browser.

Clone the repository https://github.com/simonroope/blockchain-developer-bootcamp-final-project.git

Run cd blockchain-developer-bootcamp-final-project-master which is the root directory

Run `npm install` to install all the dependencies in the package.json file (Truffle build and smart contract dependencies)

Run local testnet on port 8545 with an Ethereum client, e.g. Ganache

Deploy the smart contracts to the local testnet: `truffle migrate --network develop`

Run Truffle tests in main directory: `truffle test --network develop`  BondMarket.js conducts 14 unit tests.

The frontend must access the locally deployed Dai contract. In the Javascript file that creates the Dai contract instance change the address that references the Dai contract to be the locally deployed Dai address.
* In `localproject/client/src/hooks/useCToken.js line 18` change
`const daiAddress = '0xdCF691A9A6f6b4141f8a9780F322BB5A4f0f6192';`
to
`const daiAddress = '0x????????? Local Dai Address ????????????';`

Launch the user interface via port: 3000 by running the following command `npm run start` in the client subfolder of the root directory.

Access the user interface via http://localhost:3000

Connect your Metamask wallet and start interacting with the app.

**You may also choose to interact with the Bond contract via [Etherscan Goerli](https://goerli.etherscan.io/address/0x9541DE6a55BAe8494eeDC58C5387F61fb9810D71)**

## Directory structure
* client: Project's React frontend.
* contracts: Smart contracts that are deployed in the Goerli testnet.
* migrations: Migration files for deploying contracts in contracts directory.
* test: Tests for smart contracts.

Environment variables (not needed for running project locally): GOERLI_RPC_URL='' & GOERLI_WALLET_SEED=''

## Simple workflow
* Enter service web site
* Login with Metamask
* Deposit Dai into the account's wallet. Dai is the currency used to purchase bonds. The deposit request will mint and then approve the token spend by the main contract, so two transaction signatures are required.
* Buy a bond from the list of bonds available. Sufficient funds (Dai) need to have beed deposited.
* Issue a new bond.
* Approve the sale (i.e. token transfer) of the bond, by the main contract, to a prospective buyer.
* Switch user account, deposit sufficient Dai into this account's wallet and buy the newly created bond. 

## Screencast link
https://www.loom.com/share/22c3ee9c88ef40db9595984027b64779

## Ethereum account (for NFT certification)
0x60540eF74555419AfaeF0FE62de6c5d9C92f51B8