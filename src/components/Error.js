import React, { Component } from 'react';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Link } from 'react-router-dom';


class Error extends Component {
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
        // const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
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
            const productCount = await waqfchain.methods.productCount().call();
            this.setState({ productCount });
            // load waqf event
            for(var i = 1; i <= productCount; i++) {
                const waqf = await waqfchain.methods.waqfEvents(i).call();
                this.setState({
                    products: [...this.state.products, waqf]
                });
            }
            // load logs event
            
            waqfchain.getPastEvents('SendWaqfCreated', {
                fromBlock: 0,
                toBlock: 'latest'
            }, (err, events) => {
                //console.log(events[0].returnValues.name.toString());
                for(let i = 0; i < events.length; i++) {
                    let waqfAddress = events[i].returnValues.senderAddress;
                    if(waqfAddress.toLowerCase() === this.state.account){
                        this.setState({ 
                            IdWaqf: [...this.state.IdWaqf, events[i].returnValues.id]
                        });
                    }
                }
                //const uniqueNames = Array.from(new Set(this.state.waqfId));
                this.state.IdWaqf.forEach((value) => {
                    console.log();
                    for(let i = 0; i < this.state.products.length; i++) {
                        if(parseInt(value) === parseInt(this.state.products[i].id)) {
                            this.setState({ 
                                waqfProducts: [...this.state.waqfProducts, this.state.products[i]]
                            });
                        }
                    }    
                });
                
                if(err) {
                    console.log(err);
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
          IdWaqf: [],
          waqfProducts: []
        }   
    }
    render() {
        return (
            <div className="container">
                <br></br>
                <div className="col-md-12 text-center fadeIn first">
                    <img src="error_404.svg" className="img-fluid Login" alt="Responsive image"></img>
                </div>
                <br></br>
                <div className="text-center">
                 <Link to={{
                    pathname: `/`
                  }}>
                    <button className="error-btn fadeIn second">return home</button>
                  </Link>
                </div>
            </div>
        );
    }
}

export default Error;
