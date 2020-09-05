//import logo from '../logo.png';
import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import Navbar from './Navbar';
import CreateWaqf from './CreateWaqf';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //await this.debugging();
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
      this.setState({ waqfchain });
      const productCount = await waqfchain.methods.productCount().call();
      this.setState({ productCount });
      // load waqf event
      for(var i = 1; i <= productCount; i++) {
        const waqf = await waqfchain.methods.waqfEvents(i).call();
        this.setState({
          products: [...this.state.products, waqf]
        });
      }
      this.setState({ loading: false });
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
      loading: true,
      debug: 'normal'
    }
    this.createWaqf = this.createWaqf.bind(this);
  }

  createWaqf(title, details, types, price) {
    this.setState({ loading: true });
    
    this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    });
    
    /*
    const receipt = this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: this.state.account });
    let txHash = receipt.transactionHash;
    this.setState({ loading: false });
    */
  }

  onChangedLink(newDebug) {
    this.setState({
      debug: newDebug
    });
  }

  debugging() {
    this.setState({ loading: true });
  }

  render() {
    return (
      <div>
        <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
        <link rel='stylesheet' href='https://unpkg.com/emoji.css/dist/emoji.min.css'></link>
        <Navbar account={this.state.account} />
        
        { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <CreateWaqf 
                  waqfchain={this.state.waqfchain} 
                  loading={this.state.loading} 
                  account={this.state.account} 
                  debug={this.state.debug} 
                  onLinking={this.onChangedLink.bind(this)}
                  createWaqf={this.createWaqf}
                  products={this.state.products}
                /> 
              }              
      </div>
    );
  }
}

export default App;
