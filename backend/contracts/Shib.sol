// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Shib is ERC20 {
  constructor() ERC20('SHIB', 'LokiShib') {
    _mint(msg.sender, 5000 * 10**18);
  }
}