const MultiSigWallet = artifacts.require("MultiSigWallet.sol");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("MultiSigWallet", (accounts) => {
  let wallet;
  let owner = accounts[0];

  let approver1 = accounts[1];
  let approver2 = accounts[2];
  let approver3 = accounts[3];

  let receiver1 = accounts[4];
  let receiver2 = accounts[5];

  beforeEach(async () => {
    wallet = await MultiSigWallet.new([approver1, approver2, approver3], 2);
    await web3.eth.sendTransaction({
      from: owner,
      to: wallet.address,
      value: 1000,
    });
  });

  it("should have correct approvers and quorum", async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    assert(approvers.length === 3);
    assert(approvers[0] === approver1);
    assert(approvers[1] === approver2);
    assert(approvers[2] === approver3);
    assert(quorum.toNumber() === 2);
  });

  it("Approved account should create a transfer", async () => {
    await wallet.createTransfer(100, receiver1, { from: approver1 });
    const transfers = await wallet.getTransfers();
    assert(transfers.length === 1);
    assert(transfers[0].id === "0");
    assert(transfers[0].amount === "100");
    assert(transfers[0].to === receiver1);
    assert(transfers[0].approvals === "0");
    assert(transfers[0].isSent === false);
  });

  // it("should NOT create transfers if sender is not approved", async () => {
  //   await expectRevert(
  //     wallet.createTransfer(100, accounts[5], { from: accounts[4] }),
  //     "only approver allowed"
  //   );
  // });

  it("should increment approvals", async () => {
    await wallet.createTransfer(100, receiver2, { from: approver1 });
    await wallet.approveTransfer(0, { from: approver2 });
    const transfers = await wallet.getTransfers();
    const balance = await web3.eth.getBalance(wallet.address);
    assert(transfers[0].approvals === "1");
    assert(transfers[0].isSent === false);
    assert(balance === "1000");
  });

  it("should send transfer if quorum reached", async () => {
    const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(receiver1));
    await wallet.createTransfer(500, receiver1, { from: approver1 });
    await wallet.approveTransfer(0, { from: approver2 });
    await wallet.approveTransfer(0, { from: approver3 });
    const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(receiver1));
    assert(balanceAfter.sub(balanceBefore).toNumber() === 500);
  });

  // it("should NOT approve transfer if sender is not approved", async () => {
  //   await wallet.createTransfer(100, receiver1, { from: approver1 });
  //   await expectRevert(
  //     wallet.approveTransfer(0, { from: receiver2 }),
  //     "only approver allowed"
  //   );
  // });

  // it("should NOT approve transfer is transfer is already sent", async () => {
  //   await wallet.createTransfer(100, receiver1, { from: approver1 });
  //   await wallet.approveTransfer(0, { from: approver2 });
  //   await wallet.approveTransfer(0, { from: approver3 });
  //   await expectRevert(
  //     wallet.approveTransfer(0, { from: approver1 }),
  //     "transfer has already been sent"
  //   );
  // });

  // it("should NOT approve transfer twice", async () => {
  //   await wallet.createTransfer(100, receiver1, { from: approver1 });
  //   await wallet.approveTransfer(0, { from: approver2 });
  //   await expectRevert(
  //     wallet.approveTransfer(0, { from: approver2 }),
  //     "cannot approve transfer twice"
  //   );
  // });
});
