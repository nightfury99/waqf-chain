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
          const waqfUpdate = await waqfchain.methods.updateWaqfEvents(this.props.match.params.id).call();
          this.setState({ products: waqf });
          this.setState({ closed: waqf.closed });
          this.setState({ manage: waqfUpdate.manageData });
          this.setState({ develop: waqfUpdate.developData });
          this.setState({ completed: waqfUpdate.completedData });
          this.setState({ manageD: waqfUpdate.manageDate });
          this.setState({ developD: waqfUpdate.developDate });
          this.setState({ completedD: waqfUpdate.completedDate });
          

          if(waqfUpdate.manageData != '') {
            this.setState({manageData: true});
          }

          if(waqfUpdate.developData != '') {
            this.setState({developData: true});
          }

          if(waqfUpdate.completedData != '') {
            this.setState({completedData: true});
          }

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
          closed: true,
          manageData: false,
          developData: false,
          completedData: false,
          manage: '',
          develop: '',
          completed: '',
          manageD: '',
          developD: '',
          completedD: ''
        }
    }
    
    closeWaqf(waqfId) {
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      this.state.waqfchain.methods.closeWaqfStatus(waqfId).send({ from: acc })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
      });
    }

    updateManage(waqfId, data, date) {
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      this.state.waqfchain.methods.updateWaqfManage(waqfId, data, date).send({ from: acc })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
      });
    }

    updateDevelop(waqfId, data, date) {
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      this.state.waqfchain.methods.updateWaqfDevelop(waqfId, data, date).send({ from: acc })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
        console.log(error);
      });
    }

    updateCompleted(waqfId, data, date) {
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      this.state.waqfchain.methods.updateWaqfCompleted(waqfId, data, date).send({ from: acc })
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
                <hr></hr>
          {/**######################################################################################################################################### */}
                { this.state.manageData
                  ? 
                  <form>
                    <h4>Update Manage</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" placeholder={this.state.manage} disabled></textarea>
                    </div>
                    <label htmlFor="dateofbirth">Date</label>
                    <input name="dateofbirth" id="dateofbirth" placeholder={this.state.manageD} disabled></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary" disabled><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                  :
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    const date = document.getElementById("dateofbirth").value;
                    const data = document.getElementById("exampleFormControlTextarea1").value;
                    
                    this.updateManage(parseInt(this.props.match.params.id),  data, date);
                  }}>
                    <h4>Update Manage</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" placeholder="Update details..." ref={(input) => { this.waqfData = input }}></textarea>
                    </div>
                    <label htmlFor="dateofbirth">Date</label>
                    <input type="date" name="dateofbirth" id="dateofbirth"></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                }
                <hr></hr>
                <br></br><br></br>
                { this.state.developData
                  ? 
                  <form>
                    <h4>Update Develop</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" placeholder={this.state.develop} disabled></textarea>
                    </div>
                    <label htmlFor="dateofbirth">Date</label>
                    <input name="dateofbirth" id="dateofbirth" placeholder={this.state.developD} disabled></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary" disabled><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                  :
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    const date = event.target.dateofbirth.value;
                    const data = event.target.dataDetails.value;
                    
                    this.updateDevelop(parseInt(this.props.match.params.id),  data, date);
                  }}>
                    <h4>Update Develop</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" name="dataDetails" rows="4" placeholder="Update details..." ref={(input) => { this.waqfData = input }}></textarea>
                    </div>
                    <label htmlFor="dateofbirth" ref={(input) => { this.waqfDate = input }}>Date</label>
                    <input type="date" name="dateofbirth" id="dateofbirth"></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                }
                <hr></hr>
                <br></br><br></br>
                { this.state.completedData
                  ? 
                  <form>
                    <h4>Update complete</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" placeholder={this.state.completed} disabled></textarea>
                    </div>
                    <label htmlFor="dateofbirth">Date</label>
                    <input name="dateofbirth" id="dateofbirth" placeholder={this.state.completedD} disabled></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary" disabled><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                  :
                  <form onSubmit={(event) => {
                    event.preventDefault();
                    const date = event.target.dateofbirth.value;
                    const data = event.target.dataDetails.value;
                    
                    this.updateCompleted(parseInt(this.props.match.params.id),  data, date);
                  }}>
                    <h4>Update Completed</h4>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Detail</label>
                      <textarea className="form-control" name="dataDetails" id="exampleFormControlTextarea1" rows="4" placeholder="Update details..."></textarea>
                    </div>
                    <label htmlFor="dateofbirth">Date</label>
                    <input type="date" name="dateofbirth" id="dateofbirth"></input>
                    <br></br><br></br>
                    <div>
                      <button type="submit" className="btn btn-primary"><i className="fas fa-paper-plane"></i> Update</button>
                    </div>
                  </form>
                }
              </div>
            }
            <br></br><br></br><br></br><br></br>
            </div>     
        );
    }
}

export default UpdateWaqfDetail;
