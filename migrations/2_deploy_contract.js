const MultiSigWallet = artifacts.require("MultiSigWallet.sol");

module.exports = async function (deployer, _network, accounts) {
  console.log("accounts", accounts);
  await deployer.deploy(
    MultiSigWallet,
    [accounts[0], accounts[1], accounts[2]],
    2
  );

  const wallet = await MultiSigWallet.deployed();

  await web3.eth.sendTransaction({
    from: accounts[0],
    to: wallet.address,
    value: 20000000000000000,
  });
};
