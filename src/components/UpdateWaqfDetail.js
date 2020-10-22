import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
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
          this.setState({ targetFund: waqf.price });
          
          const waqfUpdate = await waqfchain.methods.updateWaqfEvents(this.props.match.params.id).call();
          this.setState({ products: waqf });
          this.setState({ closed: waqf.closed });
          
          waqfchain.getPastEvents('updateWaqf', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            events.forEach((val) => {
              let waqf_id = parseInt(val.returnValues.waqfId);
              const Waqf_Id = parseInt(this.props.match.params.id);
              if(Waqf_Id === waqf_id) {
                this.setState({
                  updateDetails: [...this.state.updateDetails, val.returnValues]
                });
              }
            });
            
            if(this.state.updateDetails.length !== 0) {
              this.setState({ updateEmpty: false });
            } else {
              this.setState({ updateEmpty: true });
            }

            if(this.state.updateDetails.length === 10) {
              this.setState({ disableButton: true });
            }else {
              this.setState({ disableButton: false });
            }
          });

          waqfchain.getPastEvents('SendWaqfCreated', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            let price = 0;
            let acc = 0;
  
            events.forEach(element => {
              let waqfId = parseInt(element.returnValues.waqfId);
              if(waqfId === parseInt(this.props.match.params.id)) {
                price += parseInt(element.returnValues.price);
                acc += 1;
                this.setState({
                  senderFund: [...this.state.senderFund, element.returnValues.price]
                });
                this.setState({
                  senderAddress: [...this.state.senderAddress, element.returnValues.senderAddress]
                });
              }

            });
            //console.log(this.state.senderAddress)
            this.setState({ totalAccount: acc });
            this.setState({ totalPrice: price });
  
            if(err) {
                console.log(err);
            }
          });

          waqfchain.getPastEvents("accountCreated", {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            this.state.senderAddress.forEach((addr) => {
              
              for(let i = 0; i < events.length; i++) {
                let sendAddr = events[i].returnValues.userAddress;
                if(sendAddr === addr) {
                  this.setState({
                    name: [...this.state.name, events[i].returnValues.name]
                  });
                  this.setState({
                    username: [...this.state.username, events[i].returnValues.username]
                  });
                }
              }
            });
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
          senderAddress: [],
          updateDetails: [],
          targetFund: 0,
          name: [],
          username: [],
          senderFund: [],
          totalAccount: 0,
          totalPrice: 0,
          disableButton: false,
          updateEmpty: true,
          loading: true,
          closed: true
        }
    }
    
    closeWaqf(waqfId) {
      this.setState({ loading: true });
      
      if(parseInt(this.state.totalPrice) >= parseInt(this.state.targetFund)) {
        var acc = localStorage.getItem("account");
        this.state.waqfchain.methods.closeWaqfStatus(waqfId).send({ from: acc })
        .once('receipt', (receipt) => {
          this.setState({ loading: false });
        }).catch((error) => {
          window.alert("cannot load your account, Please refresh the page!");
        });
      } else {
        window.alert("waqf event can be closed if it reached the limit!");
      }
      this.setState({ loading: false });
    }

    updatingWaqf(waqfId, data, date, location, moneyUsed) {
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      this.state.waqfchain.methods.updatingWaqf(waqfId, data, date, location, moneyUsed).send({ from: acc })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
      });
    }

    render() {
        const mystyle = {
          overflowY: "scroll",
          maxHeight: "600px"
        };
        let count_name = 0;
        return (
            <div className="col-md-12">
              
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              :
              <div>
                <div className="col-md-12 text-center wrapper fadeInDown">
                  <h1>{this.state.products.name}</h1>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-12">
                        <hr></hr>
                      </div>
                      <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                              <h4>{parseInt(this.state.targetFund)}</h4>
                            </div>
                            <div className="card-footer bg-info text-white text-center">
                                Targeted Fund
                            </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                              <h4>RM {this.state.totalPrice}</h4>
                            </div>

                            <div className="card-footer bg-dark text-white text-center">
                                Fund Collected
                            </div>
                            
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card">
                            <div className="card-body text-center">
                              <h4>{this.state.totalAccount}</h4>
                            </div>
                            <div className="card-footer bg-success text-white text-center">
                                Total Donor Transaction
                            </div>
                        </div>
                      </div>

                      <div className="col-md-3">
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
                    <br></br><br></br><br></br>
                    { this.state.products.closed
                      ? <div></div>
                      :
                      <p>Close waqf: <button type="button" className="btn btn-danger" name={this.state.products.id} onClick={(event) => {
                        this.closeWaqf(this.state.products.id);
                      }}>close
                      </button>
                      </p>
                    }
                    <hr></hr>
                    <h5>Waqf Status Preview</h5>
                    <br></br>
                    
                    {!this.state.updateEmpty
                    ? 
                    <div>
                      {this.state.updateDetails.map((value, key) => {
                        return(
                          <div className="col-md-12 shadow p-3 mb-5 bg-white rounded" key={key}>
                            Details: {value.data_1} <br></br>
                            Date: {value.date_1} <br></br>
                            Location: {value.location} <br></br>
                            Money Used: {value.moneyUsed}
                          </div>
                        );
                      })}
                    </div>
                    : 
                    <div>
                      <div className="alert alert-warning" role="alert">
                        There is no waqf update yet
                      </div>
                      <br></br>
                    </div>
                    }
                    <hr></hr>
                    {this.state.disableButton
                    ? <div className="alert alert-danger" role="alert">
                        You've reached the limit. Only 10 updates is allowed!
                      </div>
                    :
                    <div className="container">
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const date = event.target.dateofbirth.value;
                        const data = event.target.dataDetails.value;
                        const location = event.target.location.value;
                        const moneyUsed = event.target.moneyUsed.value;

                        this.updatingWaqf(parseInt(this.props.match.params.id),  data, date, location, moneyUsed);
                      }}>
                        <h5>Update Waqf Status</h5>
                        <br></br>
                        <div className="form-group">
                          <label htmlFor="exampleFormControlTextarea1">Detail</label>
                          <textarea className="form-control" name="dataDetails" id="exampleFormControlTextarea1" rows="4" placeholder="Update details..."></textarea>
                        </div>

                        <label htmlFor="dateofbirth">Date</label>
                        <input type="date" name="dateofbirth" id="dateofbirth"></input>
                        
                        <br></br><br></br>
                        <label>Location</label>
                        <input name="location" id="location"></input>

                        <br></br><br></br>
                        <label>Money Used</label>
                        RM <input type="number" name="moneyUsed" id="moneyUsed"></input>

                        <br></br><br></br>
                        <div>
                          <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i> Update</button>
                        </div>
                      </form>
                    </div>
                    }
                  </div>
                  
                  <div className="col-md-4">
                    <div className="card">
                    <div className="card-header text-white bg-secondary mb-3">
                      <h5>List of Donor</h5>
                    </div>
                    <div className="card-body" style={mystyle}>
                      <div className="list-group">
                        {this.state.username.map((value, key) => {
                          return(
                            <div className="list-group-item" key={key}>
                              {value}<br></br>
                              <small>{this.state.name[count_name]}</small><br></br>
                              <small>{this.state.senderAddress[count_name]}</small><br></br>
                              RM {parseInt(this.state.senderFund[count_name++])}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
                {/**######################################################################################################################################### */}
               
              </div>
            }
            <br></br><br></br><br></br><br></br>
          </div>     
        );
    }
}

export default UpdateWaqfDetail;
