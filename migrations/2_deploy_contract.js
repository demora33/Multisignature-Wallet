const MultiSigWallet = artifacts.require("MultiSigWallet.sol");

// const owner =
const account1 = "0x269C310CA85D31Df0a33c2fA3ABb8d82CE55C504";
const account2 = "0xB84e7505d5f7666D97F5d2F85a0E69E236c04A0b";
const account3 = "0x23E5A169426b395AF7E24BEe2D3c7aCDf1cd7169";

module.exports = async function (deployer, _network, accounts) {
  // deployer.deploy(MultiSigWallet, [account1, account2, account3], 2);
  await deployer.deploy(
    MultiSigWallet,
    [accounts[0], accounts[1], accounts[2]],
    2
  );

  const wallet = await MultiSigWallet.deployed();
  await web3.eth.sendTransaction({
    from: accounts[3],
    to: wallet.address,
    value: 10000,
  });
};
