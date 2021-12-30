//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EasyBank {
    mapping (address => uint) private userBalances;

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint userBalance = userBalances[msg.sender];

        require(userBalance > 0);

        // calls msg.sender's receive() or fallback() function
        (bool success, ) = msg.sender.call{value: userBalance}("");
        require(success);
        
        userBalances[msg.sender] = 0;
    }
}
