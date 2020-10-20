import React, { Component } from 'react';
import Web3 from 'web3';
import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class TrackWaqf extends Component {
    async componentWillMount() {
        await this.debugging();
        await this.loadBlockchainData();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    }

    async debugging() {
    }

    async loadBlockchainData() {
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        window.ethereum.enable();
        const accounts = await WEB3.eth.accounts;
        this.setState({ account: accounts[0] });
        
        const networkId = await web3.eth.net.getId();
        const networkData = WaqfChain.networks[networkId];
        var acc = localStorage.getItem("account");
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
            // load logs event
        
            waqfchain.getPastEvents('SendWaqfCreated', {
                fromBlock: 0,
                toBlock: 'latest'
            }, (err, events) => {
                for(let i = 0; i < events.length; i++) {
                    let waqfAddress = events[i].returnValues.senderAddress;
                    if(waqfAddress.toLowerCase() === acc){
                        this.setState({ 
                            IdWaqf: [...this.state.IdWaqf, events[i].returnValues.waqfId]
                        });
                    }
                }
                //const uniqueNames = Array.from(new Set(this.state.waqfId));
                this.state.IdWaqf.forEach((value) => {
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
            <div className="card">
                { this.state.loading
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                    :
                    <div>
                        <h1 className="card-header text-center">My Event <span class="ec ec-dizzy-face"></span></h1>
                        <div className="card-body">
                            <div className="col-md-12">
                                <div className="column">
                                {this.state.waqfProducts.map((product, key) => {
                                    return(
                                        <div key={key}>
                                            <br></br><br></br>
                                            <div className="card">
                                                <h4 className="card-header text-left">
                                                    <Link to={{
                                                        pathname: `/track-waqf/${product.id}`,
                                                        Id: product.id,
                                                        account: this.props.location.account
                                                        }}>{product.name}
                                                    </Link>
                                                </h4>
                                                <div className="card-body">
                                                    <p>{product.details}</p>
                                                    <p>{product.product_type}</p>
                                                    <p>RM {product.price.toString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default TrackWaqf;
