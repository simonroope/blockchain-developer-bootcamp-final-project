# Design Patterns

## Inter-Contract Execution
* The BondMarket interacts with the BondToken NFT contract that is used to tokenise Fixed Income Bonds in the form of NFTs and stores data about the NFT lifetime attributes.
* The BondMarket contract also executes ERC20 contracts to make transactions for the sale and receipt of NFT Bond Tokens, in the form of payments too and from bond holder EOA addresses.

## Access Control Design Patterns
* The BondToken inherits from OpenZeppelin contracts and interfaces, for example ERC721Enumerable and ERC721URIStorage. Also implemented is custom extension ERC721Pausable.
* BondMarket contract inherits the OpenZeppelin AccessControl for the implementation of role-based user access control.