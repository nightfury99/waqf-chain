import React, { Component } from 'react';
import Web3 from 'web3';
import Apps from './App';
import './App.css';
import WaqfChain from '../abis/WaqfChain.json';

class WaqfDetails extends Component {
    async componentWillMount() {
        await this.loadBlockchainData();
        await this.debugging();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    } 

    async debugging() {
        /*
        this.setState({ debug: 'changed' });
        console.log(this.state.debug);*/
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider); 
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
          hem: [],
          koboi: '🤠'
        }
    }

    sendWaqf(id, price, prices) {
      this.setState({ loading: true });
      const price_wei = window.web3.utils.toWei(price.toString(), 'Ether');
     
      this.state.waqfchain.methods.sendWaqf(id, prices).send({ from: this.state.account, value: price_wei})
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
    }
    
    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        return(
          <div>
            <br></br><br></br>
            {this.state.products.map((product, key) => {
              if(parseInt(product.id)==this.props.match.params.id) { 
                return(
                  <div className="container" key={key} >
                    <div className="card">
                      <div className="card-header text-center">
                        <h1>{product.name}</h1>
                      </div>
                    
                      <div className="card-body">
                        <h4>name:</h4>
                        <p>{product.name}</p>

                        <h4>Details:</h4>
                        <p>{product.details}</p>

                        <h4>Type:</h4>
                        <p>{product.product_type}</p>

                        <h4>Target Price:</h4>
                        <p>RM {parseInt(product.price)}</p>

                        <form onSubmit={(event) => {
                          event.preventDefault();
                          let price = parseInt(this.price.value);
                          let ether = price * 0.00066;
                          this.sendWaqf(parseInt(product.id), ether, price);
                        }}>
                          <div className="form-col col-md-12">
                            <label>DONATE: </label>
                            <input type="text" className="form-control" id="waqf_title" placeholder="price" ref={(input) => { this.price = input }}></input>
                          </div>
                          <hr></hr><br></br>
                          <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-primary">Donate</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            

            
          </div>
        );
    }
}

export default WaqfDetails;
