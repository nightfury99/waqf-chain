import React, { Component } from 'react';
import Web3 from 'web3';
import Apps from './App';
import './App.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class CreateWaqf extends Component {
    async componentWillMount() {
        await this.debugging();
        await this.loadBlockchainData();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    } 

    async debugging() {
        /*
        this.setState({ debug: 'changed' });
        console.log(this.state.debug);*/
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
          account: this.props.location.account,
          //productCount: 0,
          products: [],
          koboi: '🤠'
        }
    }
    
    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        return (
            <div className="card">
                <h1 className="card-header text-center">Waqf Event {this.state.koboi}</h1>
                <div className="card-body">
                    <div className="col-md-12">
                        {this.state.products.map((product, key) => {
                            return(
                                <div className="card" key={key}>
                                    <h4 className="card-header text-left"><Link to={{
                                        pathname: `/waqf-events/${product.id}`,
                                        Id: `${product.id}`,
                                        Products: this.state.products
                                        }}>{product.name}</Link></h4>
                                    <div className="card-body">
                                        <p>{product.details}</p>
                                        <p>{product.product_type}</p>
                                        <p>RM {product.price.toString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
                 
        );
    }
}

export default CreateWaqf;
