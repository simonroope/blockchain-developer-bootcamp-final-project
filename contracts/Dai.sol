// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// Mock Dai

contract Dai is ERC20 {
  constructor() ERC20('DAI', 'DAI') {}

  function mint(address to, uint amount) external {
    _mint(to, amount);
  }

  function thisAddress() external view returns ( address ) {
    return address(this);
  }
  
  function senderAddress() external view returns ( address ) {
    return address(msg.sender);
  }
}
