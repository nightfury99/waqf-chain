import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';

class Logout extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }
    
    async loadWeb3() {
        if(window.ethereum) {
          await window.ethereum.enable();
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
          window.alert('Non-ethereum browser detected. You should try Metamask man!');
        }
    } 
    
    async loadBlockchainData() {
        // const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        //window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        this.setState({ account: accounts[0] });
        
        const networkId = await web3.eth.net.getId();
        const networkData = WaqfChain.networks[networkId];
        // check if we are on developed network
        if(networkData) {
          const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
          this.setState({ waqfchain });
          const accountCount = await waqfchain.methods.accountCount().call();
          this.setState({ accountCount });
          // load waqf event
          for(var i = 1; i <= accountCount; i++) {
            const acc = await waqfchain.methods.createAccount(i).call();
            this.setState({
              accounts: [...this.state.accounts, acc]
            });
          }
          //console.log(this.state.accounts);
          this.setState({ loading: false });
          
        } else {
          window.alert('WaqfChain contract is not deployed to detected network');
        }
    }
      
    constructor(props) {
        super(props);
        this.state = {
          account: '',
          accounts: [],
          productCount: 0,
          accountCount: 0,
          products: [],
          loading: true,
          debug: 'RECEIVED'
        }   
    }

    setCookie() {
        const cname = "username";
        const cvalue = "";
        //document.cookie = cname + "=" + cvalue + ";";
        localStorage.setItem("key", "");
    }

    goToHome() {
        window.location.replace("http://localhost:3000/");
    }

    render() {
        return (
            <div className="wrapper fadeInDown">
                { this.setCookie() }
            {   this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Logging out...</p></div> 
                : <div id="loader" className="text-center"><p className="text-center">Logged Out...</p></div>
            }
            {this.goToHome()}
          </div>     
        );
    }
}

export default Logout;
