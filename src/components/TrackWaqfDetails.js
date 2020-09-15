import React, { Component } from 'react';
import Web3 from 'web3';
import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import './login.css';
class TrackWaqfDetails extends Component {
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
          const waqfUpdate = await waqfchain.methods.updateWaqfEvents(this.props.match.params.id).call();
          this.setState({ products: waqf });
          this.setState({ WaqfUpdate: waqfUpdate });
          this.setState({ loading: false });
          
          if(waqfUpdate.manageData != '') {
            this.setState({ manageBool: true });
          }
          if(waqfUpdate.developData != '') {
            this.setState({ developBool: true });
          }

          if(waqfUpdate.completedData != '') {
            this.setState({ completedBool: true });
          }

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
          WaqfUpdate: [],
          manageBool: false,
          developBool: false,
          completedBool: false
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
              <br></br><br></br><br></br>
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              :
              <div>
                <div className="text-center">
                  <h1>Donated Waqf Event</h1>
                  <h3>Check your waqf progress</h3>
                </div>
                <br></br><br></br>
                <div class="col-md-12 shadow p-3 mb-5 bg-white rounded">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row-mb-4">
                        <div className="col-md-8 p-2">
                          <img src="/img1.png" className="trying" alt="..." class="rounded img-fluid"></img>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h4>Waiting and Processing</h4>
                      <br></br>
                      <p>Your waqf is processing and waiting for charity to full</p>
                    </div>
                  </div>
                </div>

                <br></br><br></br>
                {this.state.manageBool
                  ? 
                  <div class="col-md-12 shadow p-3 mb-5 bg-white rounded">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row-mb-4">
                        <div className="col-md-8 p-2">
                          <img src="/img2.png" className="trying" alt="..." class="rounded img-fluid"></img>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h4>Managing Asset</h4>
                      <br></br>
                      <p>{this.state.WaqfUpdate.manageData}</p>
                      <p>{this.state.WaqfUpdate.manageDate}</p>
                    </div>
                  </div>
                </div>
                : <div></div>
                }

                <br></br><br></br>
                {this.state.developBool
                  ?
                  <div class="col-md-12 shadow p-3 mb-5 bg-white rounded">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row-mb-4">
                        <div className="col-md-8 p-2">
                          <img src="/img3.png" className="trying" alt="..." class="rounded img-fluid"></img>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h4>Developing Asset</h4>
                      <br></br>
                      <p>{this.state.WaqfUpdate.developData}</p>
                      <p>{this.state.WaqfUpdate.developDate}</p>
                    </div>
                  </div>
                </div>
                : <div></div>
                }

                <br></br><br></br>
                {this.state.completedBool
                  ?
                  <div class="col-md-12 shadow p-3 mb-5 bg-white rounded">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="row-mb-4">
                        <div className="col-md-8 p-2">
                          <img src="/img3.png" className="trying" alt="..." class="rounded img-fluid"></img>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h4>Project Completed</h4>
                      <br></br>
                      <p>{this.state.WaqfUpdate.developData}</p>
                      <p>{this.state.WaqfUpdate.developDate}</p>
                    </div>
                  </div>
                </div>
                : <div></div>
                }
              </div>
            }
            <br></br><br></br><br></br><br></br>
            </div>     
        );
    }
}

export default TrackWaqfDetails;
