import React, { Component } from 'react';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class CreateWaqf extends Component {
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
          window.alert('Non-ethereum briwser detected. You should try Metamask man!');
        }
      } 
    
      async loadBlockchainData() {
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        //window.ethereum.enable();
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
          debug: 'RECEIVED'
        }
        this.createWaqf = this.createWaqf.bind(this);
      }
    
      createWaqf(title, details, types, price) {
        this.setState({ loading: true });
        var acc = localStorage.getItem("account");
        this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: acc })
        .once('receipt', (receipt) => {
          this.setState({ loading: false });
        }).catch((error) => {
          window.alert('cannot load your address, please refresh again!');
        });
        
        /*
        const receipt = this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: this.state.account });
        let txHash = receipt.transactionHash;
        this.setState({ loading: false });
        */
      }
    

    render() {
        return (
            <div className="container">
                {/* <div className="col-md-12 text-center" style={{marginTop: "2%"}}>
                  <h1>Create Waqf Event</h1>
                </div> */}
                <div className="myChart updateInput" style={{
                  padding: "30px",
                  marginTop: "5%" 
                  }}>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        const price = parseInt(this.waqfPrice.value);
                        const waqf_title = this.waqfTitle.value;
                        const waqf_detail = this.waqfDetails.value;
                        const waqf_type = this.waqfTypes.value;
                        this.createWaqf(waqf_title, waqf_detail, waqf_type, price);
                    }}>
                        <div className="form-row col-md-12">
                            <div className="col-md-12" style={{paddingBottom: "10px"}}>
                              <h1>Create Waqf Event</h1>
                            </div>
                            <div className="form-group col-md-12">
                                <label>Title</label>
                                <input type="text" className="form-control" id="waqf_title" placeholder="Title" ref={(input) => { this.waqfTitle = input }}></input>
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label>Waqf Details</label>
                            <textarea className="form-control textArea" name="dataDetails" id="waqf_details" rows="4" placeholder="Details..." ref={(input) => { this.waqfDetails = input }}></textarea>
                        </div>
                        <div className="form-row col-md-12">
                          <div className="form-group col-md-6">
                            <label>Product Types</label>
                            <select defaultValue='DEFAULT' ref={(input) => { this.waqfTypes = input }} id="waqf_type" className="form-control">
                                <option value="DEFAULT" disabled>Choose</option>
                                <option value="Education">Education</option>
                                <option value="Foster">Foster</option>
                                <option value="Warzone">Warzone</option>
                                <option value="Welfare">Welfare</option>
                            </select>
                          </div>
                          <div className="form-group col-md-6">
                            <label>Waqf Target Price</label>
                            <input type="number" id="waqf_details" className="form-control" placeholder="Price" ref={(input) => { this.waqfPrice = input }}></input>
                          </div>
                            
                        </div>
                        <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" style={{margin: "10px 0 10px 0"}}><i className="fas fa-paper-plane"></i> Create</button>
                        </div>
                    </form>
                </div>                
            </div>
                    
        );
    }
}

export default CreateWaqf;
