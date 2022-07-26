import { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import Web3 from "web3";
import { loadcontract } from "./utils/loadcontract";

function App() {

  const [web3Api, setWeb3Api]=useState({
    provider:null,
    web3:null,
    contract:null,
  });

  const [account , setAccount]=useState(null);
  const [smartcontractbalance, setBalance]=useState(null);
  const [metamaskbalance, setMetamaskBalance]=useState(null);
  const [reload,shouldReload]=useState(false);

  const reloadEffect=()=>shouldReload(!reload);

  useEffect(()=>{
    const loadProvider=async()=>{
      const provider=await detectEthereumProvider();
      const contract= await loadcontract("Funder",provider);
      if(provider)
      {
          provider.request({method:"eth_requestAccounts"});
          setWeb3Api({
          web3:new Web3(provider),
          provider,
          contract,
        })
      }
      else{
        console.error("Please install MetaMask!");
      }
      // let provider=null;
      // if(window.ethereum){
      //   provider=window.ethereum;
      //   try{
      //     await provider.enable();
      //   }catch{
      //     console.error("User is not alowed");
      //   }        
      // }
      // else if(window.web3){
      //   provider=window.web3.currentProvider;
      // }else if(!process.env.production){
      //   provider=new Web3.providers.HttProvider("http://localhost:7545");
      // }
      // setWeb3Api({
      //   web3:new Web3(provider),
      //   provider,
      // })
    }
    loadProvider();
  },[]);

  useEffect(()=>{
    const loadBalance =async()=>{
      const {contract,web3}=web3Api;
      const balance=await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance,"ether"));
    };
    web3Api.contract && loadBalance();
  },[web3Api,reload]);


  useEffect(()=>{
    const loadMetaBalance =async()=>{
      const {web3}=web3Api;
      const accounts=await web3.eth.getAccounts();
      const balanceOfMetaMask=await web3.eth.getBalance(accounts[0]);
      setMetamaskBalance(web3.utils.fromWei(balanceOfMetaMask,"ether"));
    };
    web3Api.contract && loadMetaBalance();
  },[web3Api,reload]);

  const transferFund=async()=>{
    const {contract,web3}=web3Api;
    await contract.transfer({
      from:account,
      value:web3.utils.toWei("2","ether"),
    });
    reloadEffect();
  };

  const withdrawFund=async()=>{
    const {contract,web3}=web3Api;
    const withdrawAmount=web3.utils.toWei("2","ether");
    await contract.withdraw(withdrawAmount,{
      from:account,
    });
    reloadEffect();
  };

  useEffect(()=>{
    const getAccount=async()=>{
      const accounts=await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount()
  },[web3Api.web3])

  // console.log(web3Api.web3);

  return (

    <div class="card text-center">
    <div class="card-header">Funding</div>
    <div class="card-body">
      <h5 class="card-title">Smart Contract Balance: {smartcontractbalance} ETH </h5>
      <h5 class="card-title">MetaMask Account Balance: {metamaskbalance} ETH </h5>
      <p class="card-text">Account : {account ? account : "Not connected"}</p>
      {/*<button type="button" class="btn btn-success"
        onClick={async () => {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log(accounts);
        }}>
      Connect to metamask
      </button>*/}
      &nbsp;
      <button type="button" class="btn btn-success " onClick={transferFund}>
        Transfer
      </button>
      &nbsp;
      <button type="button" class="btn btn-primary " onClick={withdrawFund}>
        Withdraw
      </button>
    </div>
    <div class="card-footer text-muted">Thanks to Code Eater from Divyyesh</div>
  </div>  
  );
}

export default App;
