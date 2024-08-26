// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";


contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    mapping (address => mapping (address => uint)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
        
    }


    // Deposit token

    function depositToken(address _tokenAddress, uint256 _amount)   public {

        // transfer tokens to exchange
        require(Token(
            _tokenAddress
        ).transferFrom(
            msg.sender,
            address(this),
            _amount
        ), 'failed to deposit tokens');
        
        // manage deposit - update balance
        tokens[_tokenAddress][msg.sender] += _amount;
        // emit event
        emit Deposit(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);
    }

    // withdraw token
    // transfer tokens to the user

    function withdrawToken(address _tokenAddress, uint256 _amount)  public {
        Token(_tokenAddress).transfer(msg.sender, _amount);

        // manage withdraw - update balance
        tokens[_tokenAddress][msg.sender] -= _amount;

        // emit event
        emit Withdraw(_tokenAddress, msg.sender, _amount, tokens[_tokenAddress][msg.sender]);

    }


    // Check Balance

    function balanceOf(address _token_address, address _user) public view  returns (uint256) {
        return tokens[_token_address][_user];
    }


}