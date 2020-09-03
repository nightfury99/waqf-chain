import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import Navbar from './Navbar';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //console.log(window.web3);
  }

  async loadWeb3() {
    if(window.ethereum) {
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-ethereum briwser detected. You should try Metamask man!');
    }
  } 

  async loadBlockchainData() {
    const WEB3 = window.web3;
    const web3 = new Web3(Web3.givenProvider);
    // Load account
    const accounts = await WEB3.eth.accounts;
    this.setState({ account: accounts[0] });
    
    const networkId = await web3.eth.net.getId();
    const networkData = WaqfChain.networks[networkId];
    // check if we are on developed network
    if(networkData) {
      const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
    } else {
      window.alert('WaqfChain contract is not deployed to detected network');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                
                <h1>{this.props.account}</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
