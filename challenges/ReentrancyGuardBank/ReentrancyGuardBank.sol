//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract ReentrancyGuardBank {
    //
    // CHALLENGE: IMPLEMENT THE REENTRANCY GUARD MODIFIER
    //
    bool internal locked;

    modifier nonReentrant() {
        require(!locked, "Reentrant function call not allowed");
        locked = true;
        _;
        locked = false;
    }


    mapping (address => uint) private userBalances;

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
    }

    //
    // CHALLENGE: FIX THE CODE BELOW USING THE REENTRANCY GUARD
    //
    function withdraw() external nonReentrant {
        uint userBalance = userBalances[msg.sender];

        require(userBalance > 0, "User balance insufficient for withdrawal");

        // calls msg.sender's receive() or fallback() function
        (bool success, bytes memory payload) = msg.sender.call{value: userBalance}("");
        require(success, string(payload));
        
        userBalances[msg.sender] = 0;
    }
}
