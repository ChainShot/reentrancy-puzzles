const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

describe('Auction', function () {
  const provider = waffle.provider;

  const bidderBidAmount = ethers.utils.parseEther('99');
  const auctionBlockerAttackerBidAmount = ethers.utils.parseEther('100');
  const postBlockedAuctionBidAmount = ethers.utils.parseEther('101');

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

    const bidTxn = await auctionContract.bid({ value: bidderBidAmount });
    await bidTxn.wait();

    expect((await provider.getBalance(auctionContract.address)).eq(bidderBidAmount)).to.be.true;
  });

  describe('EXPLOIT', function () {
    let auctionBlockerAttackerContract;

    before(async function () {
      //
      // CHALLENGE: SETUP AND EXECUTE THE EXPLOIT HERE
      //
    });

    it('attacker should be able to block the auction from receiving new bids', async function () {
      //
      // ASSERTING AUCTION IS BLOCKED - NO NEED TO CHANGE ANYTHING HERE
      //
      await expect(
        auctionContract.bid({ value: postBlockedAuctionBidAmount })
      ).to.be.revertedWith('Bahahaha! Attacker has blocked the auction!');
    });
  });
});
