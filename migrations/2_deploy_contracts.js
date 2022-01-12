const Dai = artifacts.require('Dai.sol');
const BondToken = artifacts.require("BondToken.sol");
const BondMarket = artifacts.require("BondMarket.sol");

const ethers = require('ethers');

module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(Dai);
  await deployer.deploy(BondToken);

  const bondToken = await BondToken.deployed();
  const dai = await Dai.deployed();

  await deployer.deploy(BondMarket,bondToken.address,dai.address);
  const bondMarket = await BondMarket.deployed();

  console.log(`BondToken: ${bondToken.address}`);
  console.log(`dai: ${dai.address}`);
  console.log(`BondMarket: ${bondMarket.address}`);

  await dai.mint(accounts[0],ethers.utils.parseUnits('200',18));
  await dai.mint(accounts[1],ethers.utils.parseUnits('110.67',18));  // 110 ETH

  await bondMarket.issueBond( ethers.utils.formatBytes32String('HSBC Holdings'),
                              ethers.utils.parseEther('126.25'),
                              ethers.utils.parseEther('5.375'),
                              365, 2169,
                              ethers.utils.parseEther('1000'), {from: accounts[1]} );
  await bondMarket.issueBond( ethers.utils.formatBytes32String('UK Treasury Bond'),
                              ethers.utils.parseEther('5000'),
                              ethers.utils.parseEther('4.25'),
                              182, 3652,
                              ethers.utils.parseEther('5000'), {from: accounts[1]} );

  await bondToken.setApprovalForAll(bondMarket.address, true, {from: accounts[1]} );

};
