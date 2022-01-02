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

    const auctionFactory = await ethers.getContractFactory('PullPaymentAuction');
    auctionContract = await auctionFactory.deploy();
    await auctionContract.deployed();

    auctionContract = await auctionContract.connect(bidder);

    const bidTxn = await auctionContract.bid({ value: nextBidAmount() });
    await bidTxn.wait();
  });

  describe('EXPLOIT FIXED', function () {
    //
    // TEST THAT EXPLOIT HAS BEEN FIXED - NO NEED TO CHANGE ANYTHING HERE
    //

    let auctionBlockerAttackerContract;

    before(async function () {
      const auctionBlockerAttackerContractFactory =
        await ethers.getContractFactory('PullPaymentAuctionBlockerAttacker', attacker);
      auctionBlockerAttackerContract =
        await auctionBlockerAttackerContractFactory.deploy(auctionContract.address);
      await auctionBlockerAttackerContract.deployed();

      const blockAuctionTxn = await auctionBlockerAttackerContract.blockAuction(
        { value: nextBidAmount() }
      );
      await blockAuctionTxn.wait();
    });

    it('attacker should be able to block the auction from receiving new bids', async function () {
      await expect(auctionContract.bid({ value: nextBidAmount() })).to.not.be.reverted;
    });

    it('attacker should be able withdraw amount higher than the attacker bid', async function () {
      await expect(auctionContract.bid({ value: nextBidAmount() })).to.not.be.reverted;
    });
  });
});
