import React, { Component } from 'react';
import Web3 from 'web3';
import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class UpdateWaqfDetail extends Component {
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
        // check if we are on developed network
        if(networkData) {
          const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
          this.setState({ waqfchain });
          const productCount = await waqfchain.methods.productCount().call();
          this.setState({ productCount });
          // load waqf event
          const waqf = await waqfchain.methods.waqfEvents(this.props.match.params.id).call();
          this.setState({ products: waqf });
          this.setState({ closed: waqf.closed });
          waqfchain.getPastEvents('SendWaqfCreated', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            let price = 0;
            let acc = 0;
            for(let i = 0; i < events.length; i++) {
                let waqfId = parseInt(events[i].returnValues.waqfId);
                if(waqfId == this.props.match.params.id) {
                    price = price + parseInt(events[i].returnValues.price);
                    acc = acc + 1;
                }
            }
            this.setState({ totalAccount: acc });
            this.setState({ totalPrice: price });
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
          account: this.props.location.account,
          products: [],
          totalAccount: 0,
          totalPrice: 0,
          loading: true,
          closed: true
        }
    }
    
    closeWaqf(waqfId) {
      this.setState({ loading: true });
      
      this.state.waqfchain.methods.closeWaqfStatus(waqfId).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
      });
      
    }


    render() {
        return (
            <div className="container">
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              :
              <div>
                <div className="col-md-12 text-center wrapper fadeInDown">
                    <h1>{this.state.products.name}</h1>
                  </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <hr></hr>
                      </div>
                      <div className="col-md-4">
                      <div className="card">
                          <div className="card-body text-center">
                            <h4>RM {this.state.totalPrice}</h4>
                          </div>

                          <div className="card-footer bg-dark text-white text-center">
                              Total Donation
                          </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                          <div className="card-body text-center">
                            <h4>{this.state.totalAccount}</h4>
                          </div>
                          <div className="card-footer bg-success text-white text-center">
                              Total Donor Transaction
                          </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card">
                          <div className="card-body text-center">
                            {this.state.closed
                              ? <h4>Closed</h4>
                              : <h4>Active</h4>
                            }
                          </div>

                          <div className="card-footer bg-warning text-black text-center">
                              Waqf status
                          </div>
                      </div>
                    </div>
                    
                    </div>
                  </div>
                </div>
                <br></br>  
                { this.state.products.closed
                  ? <div></div>
                  :
                  <p>Close waqf: <button type="button" className="btn btn-danger" name={this.state.products.id} onClick={(event) => {
                    this.closeWaqf(this.state.products.id);
                  }}>close
                  </button>
                  </p>
                }
                <div className="wrapper fadeInDown"></div>
                </div>
            }
            </div>     
        );
    }
}

export default UpdateWaqfDetail;
