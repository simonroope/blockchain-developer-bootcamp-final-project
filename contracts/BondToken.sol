// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// @author Simon Roope
// @title  Fixed Income Bond NFT -- interface
// @description The contract used to tokenise Fixed Income Bonds.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BondToken is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, AccessControl, ERC721Burnable {

    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Fixed Income Bond Token", "FIB") {

      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
    }

    /*
    * Function used to mint a new NFT.
    * Contract address & uint256 tokenId must be globally unique.
    *
    * _issuer: Issuer's wallet address who will receive the NFT.
    * _hash: IPFS hash associated with the content we are creating the NFT for.
    * _metadata: Link to bond certificate. Includes the issuer name, price, coupon rate & dates and maturity date.
    */

    function mint(address _issuer, string memory _metadata) public returns (uint) {

      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(_issuer, tokenId);
      _setTokenURI(tokenId, _metadata);
      
      return tokenId;
    }

    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
      _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
      _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool) {
      bool isAppr = _isApprovedOrOwner(spender, tokenId);

      return isAppr;
    }


    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
