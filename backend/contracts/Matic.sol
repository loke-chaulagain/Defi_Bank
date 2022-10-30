// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

// using standard ERC20 ,only overriding some part
contract Matic is ERC20 {
    //MATIC-->custom symbol // LokiMatic-->custon name
  constructor() ERC20('MATIC', 'LokiMatic') {
    //when this is minted the owner gets the 5thiusand these token 
    _mint(msg.sender, 5000 * 10**18);
  }
}