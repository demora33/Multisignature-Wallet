import Web3 from "web3";
import MultiSigWallet from "./contracts/MultiSigWallet.json";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
      }
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          console.log("Connected Account", account);
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      } else {
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:9545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });
};

// const getWeb3 = () =>
//   new Promise(async (resolve, reject) => {
//     let provider = await detectEthereumProvider();
//     if (provider) {
//       await provider.request({ method: "eth_requestAccounts" });
//       try {
//         const web3 = new Web3(window.ethereum);
//         resolve(web3);
//       } catch (error) {
//         reject(error);
//       }
//     }
//     reject("Install Metamask");
//   });

const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MultiSigWallet.networks[networkId];
  console.log("networkId", networkId);
  console.log("deployedNetwork", deployedNetwork);

  const contract = new web3.eth.Contract(
    MultiSigWallet.abi,
    deployedNetwork && deployedNetwork.address
  );
  return contract;
};

export { getWeb3, getWallet };
