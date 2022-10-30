// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Bank {
    address public owner;

    // array of token symbols of type bytes32.
    bytes32[] public whitelistedSymbols;

    // mapping token symbol to address where that token contract is deployed.
    mapping(bytes32 => address) public whitelistedTokens;

    // mapping user's address to token deposited by them
    // address->user ko address .. bytes32-->token Symbol user deposited.. uint256-->no of token/amount deposited.
    mapping(address => mapping(bytes32 => uint256)) public balances;

    // constructor runs only once while deploying the contract
    constructor() {
        owner = msg.sender; //here msg.sender is the one who deploy the contract
    }

    // Owner can white list any token and that token can be used in this app.
    function whitelistToken(bytes32 symbol, address tokenAddress) external {
        require(
            msg.sender == owner,
            "You are not authorized , Only owner can access it"
        );

        // taking the symobl as params passed by owner and pushing it into whitelistedSymbols array.
        whitelistedSymbols.push(symbol);

        // and mapping that symbols and tokenAddress params into whitelistedTokens.
        whitelistedTokens[symbol] = tokenAddress;
    }

    // get all whiteListed token symbols
    function getWhitelistedSymbols() external view returns (bytes32[] memory) {
        return whitelistedSymbols;
    }

    // get whiteListed token address(token contract address) fron its symbol
    function getWhitelistedTokenAddress(bytes32 symbol)
        external
        view
        returns (address)
    {
        return whitelistedTokens[symbol];
    }

    // this function allows to receive the ethereum sent to this contract
    receive() external payable {
        balances[msg.sender]["Eth"] += msg.value;
    }

    // withdraw the amount user has deposited in past
    function withdrawEther(uint256 amount) external {
        // get that balance user has deposited and iheck if it sufficient or not the user wants to withdraw
        require(balances[msg.sender]["Eth"] >= amount, "Insufficient funds");

        // if sufficient then subtract from the balances of user deposited.
        balances[msg.sender]["Eth"] -= amount;

        // send that amount to users account
        payable(msg.sender).call{value: amount};
    }

    // deposit ERC20 tokens
    function depositTokens(uint256 amount, bytes32 symbol) external {
        // increase the deposit amount of that user
        balances[msg.sender][symbol] += amount;

        // get the contract address of that token and call a function on ERC20 token
        // to request transfering this amount of token to this contract.
        IERC20(whitelistedTokens[symbol]).transferFrom(
            msg.sender,
            address(this),
            amount
        );
    }

    // withdraw the tokens
    function withdrawTokens(uint256 amount, bytes32 symbol) external {
        //check the deposited balance of the user
        require(balances[msg.sender][symbol] >= amount, "Insufficient funds");

        // if sufficient balance subtract the requested amount
        balances[msg.sender][symbol] -= amount;

        // transfer that request amount to user address from our contract to wallet
        IERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
    }

    // get  balances deposited of  of user according to symbol
    function getTokenBalance(bytes32 symbol) external view returns (uint256) {
        return balances[msg.sender][symbol];
    }
}
