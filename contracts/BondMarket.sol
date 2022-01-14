// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './BondToken.sol';

/// @author Simon Roope
/// @title  Fixed Income Bond NFT market place.
/// @notice The contract used to issue, trade, make coupon and maturity payments of Fixed Income Bonds.

contract BondMarket is AccessControl {
 
  IERC20 public dai;           /// @dev TODO: extend to use multiple currencies.
  BondToken public bondToken;  /// @dev Each bond has unique tokenId.

  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  bytes32 public constant RATING_ROLE = keccak256("RATING_ROLE");

  Bond[] public allBonds; 
  BondTransaction[] public allBondTransactions;
  BondRating[] public allBondRatings;

  mapping(uint => Bond) public bonds;                            // bondId => Bond
  mapping(uint => BondTransaction[]) public bondTransactions;    // bondId => BondTransaction 
  mapping(uint => BondRating[]) public bondRatings;              // bondId => BondRating

  struct Bond {
    uint bondId;
    address issuer;      /// @dev issuer of bond, who pays coupons and face value on maturity.
    uint issueDate;
    bytes32 name;
    uint salePrice;      /// @dev price at which the bond issuer originally sells the bond.
    uint couponRate;     /// @dev rate of interest the bond issuer will pay on the face value of the bond, expressed as %.
    uint couponInterval; /// @dev interval between coupon payments, i.e. dates issuer will make interest payments. Biannually
    uint maturityDate;   /// @dev date bond will mature and the bond issuer will pay the bondholder the face value of the bond.
    uint faceValue;      /// @dev value of bond at maturity, stated when issued and paid by issuer to current bondholder on maturity.  
    bool forSale;        /// @dev is bond for sale.
    address holder;      /// @dev current holder of bond and recipient of coupon.
  }

  struct BondTransaction {
    address from;
    address to;
    uint transPrice;
    uint transDate;
  }

  struct BondRating {
    bytes32 rating;
    uint ratingDate;
  }

  event BondIssued(address indexed issuer, uint indexed bondId, uint issueDate, bytes32 _name, uint issuePrice,
                   uint couponRate, uint couponInterval, uint maturityDate, uint faceValue );
  event BondSold (uint indexed bondId, address from, address to, uint salePrice );
  event CouponPaid ( uint indexed bondId, address from, address to, uint couponAmount );
  event BondMatured ( uint indexed bondId, address from, address to, uint maturityDate, uint faceValue );
  event RatingChanged( uint indexed bondId, bytes32 toRating, uint ratingDate );

  modifier isIssuer (uint _bondId ) {
    require (bonds[_bondId].issuer == msg.sender, 'Not Bond issuer');
    _;
  }

  modifier isHolder (uint _bondId ) {
    require (bonds[_bondId].holder == msg.sender, 'Not Bond holder');
    _;
  }

  modifier bondExists (uint _bondId ) {
    require (bonds[_bondId].issuer != address(0), 'Bond does not exist');
    _;
  }

  modifier checkPayment( uint256 _amount) {
    require(dai.allowance(msg.sender, address(this)) >= _amount, "allowance missing for token transfer");
    require(dai.balanceOf(msg.sender) >= _amount, "not enough token balance");
    _;
  }

  error InsufficientBalance(uint salePrice, uint balance);


  constructor ( address _bondTokenAddress, address _daiAddress ) {

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    dai = IERC20(_daiAddress);
    bondToken = BondToken(_bondTokenAddress); 

  }

  function issueBond ( bytes32 _name,
                       uint _salePrice,
                       uint _couponRate,
                       uint _couponInterval,
                       uint _daysToMaturity,
                       uint _faceValue ) public {

    /// @notice Mint Bond NFT to Issuer
    /// @dev TODO: Create metadata tokenURI for upload to IPFS. Metadata is owner's certificate of ownership.  

    string memory bondCertificate = 'tokenURI - IPFS';
    uint bondId = bondToken.mint(msg.sender, bondCertificate);

    uint maturityDate = block.timestamp + (_daysToMaturity * 1 days);

    Bond memory newBond = Bond( bondId, msg.sender, block.timestamp, _name,
                               _salePrice, _couponRate, _couponInterval, maturityDate,
                               _faceValue, true, msg.sender ); 

    bonds[bondId] = newBond;
    allBonds.push(newBond);

    /// @dev TODO: Add Bond Rating

    emit BondIssued ( msg.sender, bondId, newBond.issueDate, newBond.name, newBond.salePrice, 
                      newBond.couponRate, newBond.couponInterval, newBond.maturityDate, newBond.faceValue );

  }

  
  function getBond(uint _bondId) public view returns ( Bond memory ) {
    return bonds[_bondId];

    /// @notice Retun a single bond 
    /// @dev or returns (address issuer) return(bonds[bondId].issuer);
    /// @dev or returns (address issuer) Bond storage bnd = bonds[bondId]; issuer = bnd.issuer; return issuer;
    /// @dev or returns (Bond memory) return bonds[_bondId];
  }


  function getBonds() public view returns ( Bond[] memory ) {
    /// @notice Retun all bonds 
    return allBonds; 
  }


  function offerBondForSale ( uint _bondId, uint _salePrice ) public bondExists(_bondId) isHolder(_bondId) {

    /// @notice Offer the bond for sale, at a specified price 
    /// @dev TODO: grant approval for token transfer to this contract.

    bonds[_bondId].salePrice = _salePrice;
    bonds[_bondId].forSale = true;

    allBonds[_bondId].salePrice = _salePrice;
    allBonds[_bondId].forSale = true;

  }


  function sellBond ( uint _bondId, address _buyer, uint _salePrice ) public bondExists(_bondId) isHolder(_bondId) {
  
    /// @notice First and all subsequent sales of a bond. Push.
    /// @dev Sale price, in ETH, set by current owner. 
    /// TODO: Multiple currencies and transactions on Exchange. AMM

    require(_buyer != address(0), 'buyer is the address zero');
    require(_buyer != address(this),'buyer is contract');

    require (bonds[_bondId].forSale == true, 'Bond is not for sale');
    require (bonds[_bondId].salePrice == _salePrice, 'Incorrect Sale Price');
    require (dai.balanceOf(_buyer) >= _salePrice, 'Insufficient funds to buy Bond');
    
    address seller = bonds[_bondId].holder;
    bonds[_bondId].holder = _buyer;
    bonds[_bondId].forSale = false;

    allBonds[_bondId].holder = _buyer;
    allBonds[_bondId].forSale = false;

    dai.transferFrom(_buyer, seller, _salePrice);    

    /// @dev Transfer NFT ownership.
    /// @dev TODO: Incorporate delegatecall for approval when minted
    bondToken.safeTransferFrom(seller, _buyer, _bondId);

    emit BondSold(_bondId, seller, _buyer, _salePrice);   // bondId, from, to, price
  }


  function buyBond ( uint _bondId, uint _salePrice ) public bondExists(_bondId) {

    /// @notice Purchase a bond at listed price. Pull.
    require (bonds[_bondId].forSale == true, 'Bond is not for sale');
    require (bonds[_bondId].salePrice == _salePrice, 'Incorrect Sale Price');

    require (dai.balanceOf(msg.sender) >= _salePrice, 'Insufficient funds to buy Bond');

    address seller = bonds[_bondId].holder;
    bonds[_bondId].holder = msg.sender;
    bonds[_bondId].forSale = false;

    allBonds[_bondId].holder = msg.sender;
    allBonds[_bondId].forSale = false;

    dai.transferFrom(msg.sender, seller, _salePrice);   

    /// @dev Transfer NFT ownership.
    /// @dev TODO: Incorporate delegatecall for approval when minted
    bondToken.safeTransferFrom(seller, msg.sender, _bondId);

    address bondOwner = bondToken.ownerOf(_bondId);
    assert (bondOwner == msg.sender);

    emit BondSold(_bondId, seller, msg.sender, _salePrice);   // bondId, from, to, price
  }


  function payCoupon ( uint _bondId ) public payable bondExists(_bondId) isIssuer(_bondId) {

    /// @notice Pay the coupon rate to the current holder.
    /// @dev Payment is made every x days (i.e coupon interval)
    /// @dev Function to be executed by scheduler 
    /// @dev Calculate coupon amount
    uint couponAmount = bonds[_bondId].couponRate * bonds[_bondId].faceValue;

    /// @dev Owner has sufficient funds or bond defaults.
    require(bonds[_bondId].issuer.balance >= couponAmount,'Insufficient funds to pay coupon');

    /// @dev TODO: Issuer defaults and no payment is made.

    /// @dev Pay Coupon.
    address issuer = bonds[_bondId].issuer;
    address holder = bonds[_bondId].holder;
    dai.transferFrom(issuer, holder, couponAmount);

    emit CouponPaid ( _bondId, issuer, holder, couponAmount );   // from, to
  }


  function bondMatures ( uint _bondId ) public payable isIssuer(_bondId) {

    /// @notice The bond matures and the maturity value is paid to the current holder.
    /// @dev TODO: Link to scheduler e.g. Chainlink 

    require(block.timestamp > bonds[_bondId].maturityDate,'Maturity date has not been reached');

    uint maturityAmount = bonds[_bondId].faceValue;
    uint maturityDate = bonds[_bondId].maturityDate;

    address issuer = bonds[_bondId].issuer;
    address holder = bonds[_bondId].holder;

    /// @dev Transfer to be approved first
    dai.transferFrom(issuer, holder, maturityAmount);

    /// @dev Take bond out of circulation
    /// @dev TODO: tbc if NFT is soft delete or burnt. Incorporate removeBond() below. 
    delete bonds[_bondId];
    delete allBonds[_bondId];  // or allBonds.splice(bondId,1);

    emit BondMatured ( _bondId, issuer, holder, maturityDate, maturityAmount ); 
  }


  function changeRating ( uint _bondId, bytes32 _toRating ) public onlyRole(RATING_ROLE) {
  
    /// @notice The bond rating is changed.
    /// @dev This function can only be performed by authorised users. 
    bondRatings[_bondId][0].rating = _toRating;
    bondRatings[_bondId][0].ratingDate = block.timestamp;

    emit RatingChanged( _bondId, _toRating, block.timestamp );
  }   


  function removeBond(uint _bondId) public onlyRole(BURNER_ROLE) {

    /// @notice Remove a bond listing
    /// @dev Only the contract owner can call this function

    /// TODO: remove a bond listing entirely; _burn & delete
    /// _burn token
    /// delete bonds[_bondId];
  }


  function bondHierarchy ( uint _bondId, uint _parentBondId ) public {
    /// @notice Create bond hierarchy for collaterialised debt.
    /// @dev TODO
  }

}
