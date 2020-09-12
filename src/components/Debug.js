import React, { Component } from 'react';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';


class Debug extends Component {
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
        const accounts = await WEB3.eth.accounts;
        this.setState({ account: accounts[0] });
        
        const networkId = await web3.eth.net.getId();
        const networkData = WaqfChain.networks[networkId];
        // check if we are on developed network
        if(networkData) {
            const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
            this.setState({ waqfchain });
            const accountCount = await waqfchain.methods.accountCount().call();
            this.setState({ accountCount });
            // load logs event
            
            waqfchain.getPastEvents('SendWaqfCreated', {
                fromBlock: 0,
                toBlock: 'latest'
            }, (err, events) => {
                //console.log(events[0].returnValues.name.toString());
                for(let i = 0; i < events.length; i++) {
                    console.log(events[i]);
                }
            });
            

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
    render() {
        return (
            <div className="container">
                <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                <div className="col-md-12 text-center">
                    <p><span className="ec ec-nerd-face"></span></p>
                </div>        
            </div>
        );
    }
}

export default Debug;
