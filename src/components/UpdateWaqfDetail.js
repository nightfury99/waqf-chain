import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

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
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        this.setState({ account: accounts[0] });
        
        const networkId = await web3.eth.net.getId();
        const networkData = WaqfChain.networks[networkId];
        // check if we are on developed network
        if(isNaN(this.props.match.params.id)) {
          window.location.replace("http://localhost:3000/error");
        }
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
                      <div className="col-md-3 myChartWU">
                        <h5>Targeted Fund</h5>
                        <h4 style={{color:"green"}}>RM {parseInt(this.state.targetFund)}</h4>
                      </div>

                      <div className="col-md-3 myChartWU">
                        <h5>Fund Collected</h5>
                        <h4 style={{color:"#353b48"}}>RM {this.state.totalPrice}</h4>
                      </div>

                      <div className="col-md-3 myChartWU">
                        <h5>Waqf Status</h5>
                        <h4 style={{color:"#e84118"}}>
                        {this.state.closed
                          ? <>Closed</>
                          : <>Active</>
                        }
                        </h4>
                      </div>

                      <div className="col-md-3 myChartWU">
                        <h5>Total Donor Transaction</h5>
                        <h4 style={{color:"#fa983a"}}>{this.state.totalAccount}</h4>
                      </div>

                      <div className="col-md-3">
                        <br></br>
                      </div>

                      <div className="col-md-3 myChartWU" style={{backgroundColor:"#dc3546", marginLeft: "15px"}}>
                        <h5 style={{color: "white"}}>Close Waqf Project</h5>
                        {this.state.products.closed
                        ? <button type="button" className="btn btn-outline-light rounded-pill" disabled>closed</button>
                        : <button type="button" className="btn btn-outline-light rounded-pill" name={this.state.products.id} onClick={(event) => {
                          this.closeWaqf(this.state.products.id);
                        }}>close
                        </button>
                        }
                        
                      </div>
                    </div>
                    
                    <hr></hr>
                    <h4 style={{fontWeight: "700", color: "#3c3c41"}}>Waqf Status Preview</h4>
                    <br></br>
                    
                    {!this.state.updateEmpty
                    ? 
                    <div>
                      <SimpleBar style={{maxHeight: 600 }}>
                        {/* shadow p-3 mb-5 bg-white rounded */}
                        {this.state.updateDetails.map((value, key) => {
                          return(
                            <div className="col-md-12 waqfPreview" key={key}>
                              Details: {value.data_1} <br></br>
                              <small>Date: {value.date_1}</small> <br></br>
                              <small>Location: {value.location}</small> <br></br>
                              Money Used: RM {value.moneyUsed}
                            </div>
                          );
                        })}
                      </SimpleBar>
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
                    <div className="container myChart" style={{padding: "30px"}}>
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const date = event.target.dateofbirth.value;
                        const data = event.target.dataDetails.value;
                        const location = event.target.location.value;
                        const moneyUsed = event.target.moneyUsed.value;

                        this.updatingWaqf(parseInt(this.props.match.params.id),  data, date, location, moneyUsed);
                      }}>
                        <h1 style={{fontWeight: "700", color: "#3c3c41", padding: "20px 20px 20px 0"}}>Update Waqf Status</h1>
                        <br></br>
                        <div className="form-group">
                          <label htmlFor="exampleFormControlTextarea1">Detail</label>
                          <textarea className="form-control textArea" name="dataDetails" id="exampleFormControlTextarea1" rows="4" placeholder="Update details..."></textarea>
                        </div>
                        <div className="col-md-12 updateInput">
                          <div className="row">
                            <div className="col-md-6">
                              <label>Money Used</label>
                              <input type="number" name="moneyUsed" id="moneyUsed" placeholder="MYR"></input>
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="dateofbirth">Date</label>
                              <input type="date" name="dateofbirth" id="dateofbirth"></input>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <label>Location</label>
                              <input name="location" id="location" placeholder="Location..."></input>
                            </div>
                          </div>
                        </div>

                        <br></br><br></br>
                        <div className="" style={{paddingBottom: "10px"}}>
                          <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i> Update</button>
                        </div>
                      </form>
                    </div>
                    }
                  </div>
                  
                  <div className="col-md-4 scrollPart">
                    <h5>List of Donor</h5>
                    <SimpleBar style={{maxHeight: 600 }}>
                      {this.state.username.length === 0
                      ? <>
                        <div className="alert alert-danger" role="alert">
                          There is no transaction yet, hence no info about donor.
                        </div>
                      </>
                      : <>
                        {this.state.username.map((value, key) => {
                          return(
                            <div className="myChartScrollWU" key={key}>
                              {value}<br></br>
                              <small>{this.state.name[count_name]}</small><br></br>
                              <small>{this.state.senderAddress[count_name]}</small><br></br>
                              RM {parseInt(this.state.senderFund[count_name++])}
                            </div>
                          );
                        })}
                      </>
                      }
                    </SimpleBar>
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
