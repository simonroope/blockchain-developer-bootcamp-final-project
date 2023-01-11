const Dai = artifacts.require('Dai');
const BondToken = artifacts.require('BondToken');
const BondMarket = artifacts.require('BondMarket');

const { time, expectRevert, BN } = require('@openzeppelin/test-helpers');
const ethers = require('ethers');

contract("BondMarket", function (accounts) {

  const [owner, alice, bob, carlos] = accounts;

  let dai, bondToken, bondMarket, bondNameHex;

  beforeEach(async () => {
   
    dai = await Dai.new();
    bondToken = await BondToken.new(); 
    bondMarket = await BondMarket.new(bondToken.address, dai.address);

    await dai.mint(owner,ethers.utils.parseUnits('200',18));
    await dai.mint(alice,ethers.utils.parseEther('100'));
    await dai.mint(bob,ethers.utils.parseEther('50'));

    dai.approve( bondMarket.address, ethers.utils.parseEther('100'), {from: bob} ); 

    bondNameHex = ethers.utils.formatBytes32String('Bond 1');

    await dai.mint(accounts[0],ethers.utils.parseUnits('200',18));     // BigNumber in wei
    await dai.mint(accounts[1],ethers.utils.parseUnits('110.67',18));  // 110 ETH
    await dai.mint(accounts[2],ethers.utils.parseEther('22.58'));

  // INPUT:
  //   parseUnits("1.0", "ether"); == parseUnits("1.0") = parseUnits("1.0", 18) = parseEther('1.0') ==> { BigNumber: "1000000000000000000" } -- BigNumber in wei
  //   ethers.utils.formatBytes32String(to bytes) //string to bytes
  // QUERY:
  //   { BigNumber: "1000000000000000000" } ==> formatUnits(value, "ether") = formatEther(value) ==> 1.0
  //   ethers.utils.parseBytes32String(from bytes) // bytes to string

  }); 

  it("Dai Stablecoin is deployed", async () => {

      const symbol = await dai.symbol();

      assert.notEqual(dai.address, '');
      assert.notEqual(dai.address, 0x0);
      assert.notEqual(dai.address, null);
      assert.notEqual(dai.address, undefined);

      assert.equal(symbol, 'DAI');
  }); 
 
  it("BondToken is deployed", async () => {

      const symbol = await bondToken.symbol();

      assert.notEqual(bondToken.address, '');
      assert.notEqual(bondToken.address, 0x0);
      assert.notEqual(bondToken.address, null);
      assert.notEqual(bondToken.address, undefined);

      assert.equal(symbol, 'FIB');
  });  

  it("BondMarket is deployed", async () => {

      assert.notEqual(bondMarket.address, '');
      assert.notEqual(bondMarket.address, 0x0)
      assert.notEqual(bondMarket.address, null);
      assert.notEqual(bondMarket.address, undefined);
  });  

  it("BondToken ERC721 can be minted", async() => {

    const mintedBondToken = await bondToken.mint(alice,'Token Metadata');

    assert.equal(mintedBondToken.logs[0].args.tokenId.toNumber(),0);

  });

  it("Bond can be issued", async() => {

    // IssueBond: _name _salePrice, _couponRate, _couponInterval, _daysToMaturity, _faceValue
    let issuedBond = await bondMarket.issueBond( bondNameHex, ethers.utils.parseEther('5'), 25, 50, 365, ethers.utils.parseEther('10'), {from: alice} ); 

    let bondOwner = await bondToken.ownerOf(0);
    let bonds = await bondMarket.getBonds();

    // alice is issuer/holder
    assert.equal(alice, bondOwner);
    assert(alice == bondOwner);
    assert(alice == issuedBond.logs[0].args.issuer);
    assert(alice == bonds[0].issuer);

  })

  it("Two bonds can be issued", async() => {

    // IssueBond: _name _salePrice, _couponRate, _couponInterval, _daysToMaturity, _faceValue
    const issuedBond1 = await bondMarket.issueBond( bondNameHex, ethers.utils.parseEther('5'), 25, 50, 365, ethers.utils.parseEther('10'), {from: alice} ); 
    const issuedBond2 = await bondMarket.issueBond( ethers.utils.formatBytes32String('Bond 2'),
                                                    ethers.utils.parseEther('5'),
                                                    25, 50, 365,
                                                    ethers.utils.parseEther('10'), {from: bob} ); 
    
    const bondOwner0 = await bondToken.ownerOf(0);
    const bondOwner1 = await bondToken.ownerOf(1);

    assert.equal(alice, bondOwner0);
    assert.equal(bob, bondOwner1);

  })

  it('Bond can be offered for sale', async () => {

    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('5'),25,50,365,ethers.utils.parseEther('10'), {from: alice} );
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    // SellBond to Bob: _bondId, _buyer, _salePrice
    await bondMarket.sellBond(0, bob, ethers.utils.parseEther('5'), {from: alice} );

    let bondOwner = await bondToken.ownerOf(0);

    assert.equal(bob,bondOwner);

    await bondMarket.offerBondForSale ( 0, ethers.utils.parseEther('10'), {from: bob} );

    let bond = await bondMarket.getBond(0);

    assert.equal(bond.forSale,true);
    assert.equal(bond.salePrice,ethers.utils.parseEther('10'));

  });

  it('Issued Bond can be bought - pull', async () => {

    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('5'),25,50,365,ethers.utils.parseEther('10'), {from: alice} );
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    const oneBond = await bondMarket.getBond(0);
    const allBonds = await bondMarket.getBonds();

    let aliceBalPreSale, bobBalPreSale;
    ( [ aliceBalPreSale, bobBalPreSale ] = await Promise.all( [ dai.balanceOf(alice), dai.balanceOf(bob) ]));

    const aliceBondOwner = await bondToken.ownerOf(0);

    // BuyBond ( _bondId, _salePrice )
    await bondMarket.buyBond ( 0, ethers.utils.parseEther('5'), {from: bob} );

    ( [ aliceBalPostSale, bobBalPostSale ] = await Promise.all( [ dai.balanceOf(alice), dai.balanceOf(bob) ]));

    let bondOwner = await bondToken.ownerOf(0);

    assert.equal(bob,bondOwner);
    assert.equal((Number(aliceBalPreSale) + Number(bobBalPreSale)),(Number(aliceBalPostSale) + Number(bobBalPostSale)));

  });

  it('Issued Bond can be sold - push', async () => {

    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('5'),25,50,365,ethers.utils.parseEther('10'), {from: alice} ); 
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    let aliceBalPreSale, bobBalPreSale;
    ( [ aliceBalPreSale, bobBalPreSale ] = await Promise.all( [ dai.balanceOf(alice), dai.balanceOf(bob) ]));
    
    // SellBond: _bondId, _buyer, _salePrice 
    await bondMarket.sellBond(0, bob, ethers.utils.parseEther('5'), {from: alice} );

    ( [ aliceBalPostSale, bobBalPostSale ] = await Promise.all( [ dai.balanceOf(alice), dai.balanceOf(bob) ]));

    let bondOwner = await bondToken.ownerOf(0);

    assert.equal(bob,bondOwner);
    assert.equal((Number(aliceBalPreSale) + Number(bobBalPreSale)),(Number(aliceBalPostSale) + Number(bobBalPostSale)));

  });

  it('Bond is not for sale', async () => {

    dai.mint(carlos,10);
    dai.approve( bondMarket.address, ethers.utils.parseEther('10'), {from: carlos} );

    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('5'),25,50,365,ethers.utils.parseEther('10'), {from: alice} );
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    // SellBond - Alice to Bob: _bondId, _buyer, _salePrice
    await bondMarket.sellBond(0, bob, ethers.utils.parseEther('5'), {from: alice} );

    let bondOwner = await bondToken.ownerOf(0);

    assert.equal(bob,bondOwner);

    await bondToken.setApprovalForAll(bondMarket.address, true, {from: bob} );

    // SellBond - Bob to Carlos: _bondId, _buyer, _salePrice. Not offered for sale.
    await expectRevert ( bondMarket.sellBond(0, carlos, ethers.utils.parseEther('5'), {from: bob} ),'Bond is not for sale' );

  });

  it('Insufficient balance to buy Bond', async () => {

    // IssueBond: _name _salePrice, _couponRate, _couponInterval, _daysToMaturity, _faceValue
    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('75'),30,50,365,ethers.utils.parseEther('10'), {from: alice} ); 
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    // assert.isAbove((ethers.utils.parseEther('75'), bobBal);
    await expectRevert ( bondMarket.buyBond ( 0, ethers.utils.parseEther('75'), {from: bob} ),'Insufficient funds to buy Bond' );

  });

  it('Bond is not approved for transfer', async () => {

    // require(isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved"); 

    await bondMarket.issueBond( bondNameHex, ethers.utils.parseEther('35'), 30, 50, 365, ethers.utils.parseEther('10'), {from: alice} ); 

    //Either approval function will suffice
    //await bondToken.approve(bondMarket.address,0, {from: alice});
    //await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    const isApprovedOO = await bondToken.isApprovedOrOwner(bondMarket.address,0);
    const isApprovedFA = await bondToken.isApprovedForAll(alice,bondMarket.address);

    assert.equal(isApprovedFA,false);
    assert.equal(isApprovedOO,false);

    await expectRevert ( bondMarket.buyBond(0, ethers.utils.parseEther('35'), {from: bob} ),'ERC721: caller is not token owner or approved.' );

  });

  it('Bond cannot be sold if not holder', async () => {

    await bondMarket.issueBond( bondNameHex,ethers.utils.parseEther('5'),25,50,365,ethers.utils.parseEther('10'), {from:alice} ); 
    await bondToken.setApprovalForAll(bondMarket.address, true, {from: alice} );

    // SellBond: _bondId, _buyer, _salePrice 
    await expectRevert ( bondMarket.sellBond(0, bob, ethers.utils.parseEther('5'), {from: carlos} ),'Not Bond holder' );

  });

  it('Bond does not exist', async () => {

    // SellBond: _bondId, _buyer, _salePrice
    await expectRevert ( bondMarket.sellBond(2, bob, ethers.utils.parseEther('5'), {from: alice} ),'Bond does not exist' );

  });

})
