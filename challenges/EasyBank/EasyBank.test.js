const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

describe('EasyBank', function () {
  const provider = waffle.provider;

  const depositAmount = ethers.utils.parseEther('100');

  let deployer, thief, victim;
  let easyBankContract;

  before(async function () {
    //
    // SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE
    //

    [deployer, thief, victim] = await ethers.getSigners();

    const EasyBankContractFactory = await ethers.getContractFactory('EasyBank');
    easyBankContract = await EasyBankContractFactory.deploy();
    await easyBankContract.deployed();

    easyBankContract = await easyBankContract.connect(victim);

    const depositTxn = await easyBankContract.deposit({ value: depositAmount });
    await depositTxn.wait();

    expect((await provider.getBalance(easyBankContract.address)).eq(depositAmount)).to.be.true;
  });

  describe('EXPLOIT', function() {
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
      
      const EasyThiefContractFactory = await ethers.getContractFactory('EasyThief', thief);
      thiefContract = await EasyThiefContractFactory.deploy(easyBankContract.address);
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
