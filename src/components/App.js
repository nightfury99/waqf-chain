//import logo from '../logo.png';
import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import CreateWaqf from './CreateWaqf';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import Debug from './Debug';
import WaqfEvents from './WaqfEvents';
import WaqfDetails from './WaqfDetails';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import UpdateWaqf from './UpdateWaqf';
import UpdateWaqfDetail from './UpdateWaqfDetail';
import TrackWaqf from './TrackWaqf';
import TrackWaqfDetails from './TrackWaqfDetails';
import error from "./Error";
import Sidebar from './Sidebar';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.checkLogin();
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
    //window.ethereum.enable();
    const accounts = await WEB3.eth.accounts;
    this.setState({ account: accounts[0] });
    localStorage.setItem("account", accounts[0]);
    
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
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      debug: 'RECEIVED'
    }
    this.createWaqf = this.createWaqf.bind(this);
    this.createAccountz = this.createAccountz.bind(this);
  }

  createAccountz(name, username, email, password) {
    this.setState({ loading: true });
    var acc = localStorage.getItem("account");
    this.state.waqfchain.methods.createAccounts(name, username, email, password).send({ from: acc })
    .once('receipt', (receipt) => {
      this.setState({ laoding: false });
    });
  }

  createWaqf(title, details, types, price) {
    this.setState({ loading: true });
    var acc = localStorage.getItem("account");
    this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: acc })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    });
    
    /*
    const receipt = this.state.waqfchain.methods.createProduct(title, details, types, price).send({ from: this.state.account });
    let txHash = receipt.transactionHash;
    this.setState({ loading: false });
    */
  }

  checkLogin() {
    const allCookie = document.cookie;
    let huhu = allCookie.split('=');
    //const cook = huhu[1];
    var lastname = localStorage.getItem("key");
    if(lastname != '') {
      return true;
    } else {
      return false;
    }
  }

  checkAdmin() {
    const allCookie = document.cookie;
    let huhu = allCookie.split('=');
    //const cook = huhu[1];
    var lastname = localStorage.getItem("key");
    if(lastname === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  onChangedLink(newDebug) {
    this.setState({
      debug: newDebug
    });
  }

  debugging() {
    this.setState({ loading: true });
  }

  render() {
    return (
      <>
        <link href="https://emoji-css.afeld.me/emoji.css" rel="stylesheet"></link>
        <link rel='stylesheet' href='https://unpkg.com/emoji.css/dist/emoji.min.css'></link>
        <Router>
          <Sidebar/>
        {/* <Navbar
          debug={this.state.debug} 
          onLinking={this.onChangedLink.bind(this)}
          account={this.state.account} 
          waqfchain={this.state.waqfchain} 
          loading={this.state.loading}
          createWaqf={this.createWaqf}
          products={this.state.products}
          createAccountz={this.createAccountz}
        /> */}
        
        { this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : this.checkLogin() 
                  ? this.checkAdmin() 
                    ? <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/debug" component={Debug}/>
                        <Route path="/waqf-events" exact component={WaqfEvents}/>
                        <Route path="/waqf-events/:id" component={WaqfDetails}/>
                        <Route path="/create-waqf" component={CreateWaqf}/>
                        <Route path="/sign-in" component={Login} />
                        <Route path="/sign-out" component={Logout} />
                        <Route path="/update-waqf" exact component={UpdateWaqf} />
                        <Route path="/update-waqf/:id" component={UpdateWaqfDetail} />
                        <Route path="/track-waqf/:id" component={TrackWaqfDetails} />
                        <Route component={error} />
                      </Switch>
                    : <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/debug" component={Debug}/>
                        <Route path="/waqf-events" exact component={WaqfEvents}/>
                        <Route path="/waqf-events/:id" component={WaqfDetails}/>
                        <Route path="/track-waqf" exact component={TrackWaqf} />
                        <Route path="/track-waqf/:id" component={TrackWaqfDetails} />
                        <Route path="/sign-out" component={Logout} />
                        <Route component={error} />
                      </Switch>
                  : 
                  <Switch>
                    <Route path="/" exact component={HomePage}/>
                    <Route path="/waqf-events" exact component={WaqfEvents}/>
                    <Route path="/sign-up" component={Register}/>
                    <Route path="/sign-in" component={Login}/>
                    <Route path="/debug" component={Debug} />
                    <Route component={error} />
                  </Switch>
              }
        </Router>
      </>
    );
  }
}

const HomePage = () => (
  <div className="col-md-12 home-wrap">
    <div className="col-md-12">
      <div className="col-md-12">
        <div className="col-md-12">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 front-font">
                <br></br><br></br><br></br>
                <h1>Donate Waqf.</h1>
                <h1>Track Waqf</h1>
                <br></br>
                <h5>Giving is just about make a donation, it is about making<br></br> difference. Your kindness today could save a life tommorow</h5>
                <br></br>
                <div>
                  {/* <button type="button" className="btn btn-info rounded-pill"><i class="fab fa-bitcoin"></i> Join Us</button> */}
                  <button className="front-btn-1"><i className="fab fa-bitcoin"></i> Join Us</button>
                </div>
              </div>
              <div className="col-md-6 front-charity">
                <img src="Charity_1.png" className="img-fluid" alt="Responsive image"></img>
              </div>
            </div>


            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center front-font-2">
                  <br></br><br></br><br></br><br></br><br></br>
                  <h2>Waqf Blockchain Features</h2>
                  <br></br><br></br>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div class="box-part text-center">
                    <img className="card-img-top card-img-1" src="card-1.svg" alt="Card Images"></img>      
                    <div class="title-card">
                      <h2>Online Donation</h2>
                    </div>      
                    <div class="text">
                      <span>All transaction and donation can be transfered online</span>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div class="box-part text-center">
                    <img className="card-img-top card-img-2" src="card-2.svg" alt="Card Images"></img>      
                    <div class="title-card">
                      <h2>Blockchain</h2>
                    </div>      
                    <div class="text">
                      <span>This website is powered by blockchain technology and everything is encrypted and recorded publicly</span>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div class="box-part text-center">
                    <img className="card-img-top card-img-3" src="card-3.svg" alt="Card Images"></img>      
                    <div class="title-card">
                      <h2>Track Waqf</h2>
                    </div>      
                    <div class="text">
                      <span>Track every waqf progress that you have been donated</span>
                    </div>
                  </div>
                </div>  
              </div>
            </div>


            {/* <div className="row">
              <div className="container"> 
                <div className="col-md-12 text-center front-font-2">
                  <br></br><br></br><br></br><br></br><br></br>
                  <h2>Waqf Blockchain Features</h2>
                  <br></br><br></br>
                </div>
                <div className="card-deck">
                  <div className="card shadow p-3 mb-5 bg-white rounded">
                    <img className="card-img-top card-img-1" src="card-1.svg" alt="Card Images"></img>
                    <div className="card-body">
                      <h2 className="card-title text-center">Online Donation</h2>
                      <p className="card-text text-center">All transaction and donation can be transfered online</p>
                    </div>
                  </div>
                  <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                    <img className="card-img-top card-img-2" src="card-2.svg" alt="Card Images"></img>
                    <div className="card-body">
                    <h2 className="card-title text-center">Blockchain</h2>
                      <p className="card-text text-center">This website is powered by blockchain technology and everything is encrypted and recorded publicly</p>
                    </div>
                  </div>
                  <div className="card shadow-sm p-3 mb-5 bg-white rounded">
                    <img className="card-img-top card-img-3" src="card-3.svg" alt="Card Images"></img>
                    <div className="card-body">
                    <h2 className="card-title text-center">Track Waqf</h2>
                      <p className="card-text text-center">Track every waqf progress that you have been donated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <br></br><br></br><br></br>
          </div>
        </div>
      </div>
    </div>
    {/* <div className="col-md-12 text-center wrapper fadeInDown">
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br>
      <h1>This is Waqf HomePage</h1>
    </div> */}
  </div>
);

export default App;
