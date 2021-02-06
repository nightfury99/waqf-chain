//import logo from '../logo.png';
import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import CreateWaqf from './CreateWaqf';
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from 'react-router-dom';
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
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    //const accounts = await web3.eth.accounts;
    
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
                        {/* <Route path="/sign-in" component={Login} /> */}
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
                    <Route path="/" exact component={HomePageLogin} />
                    <Route path="/waqf-events" exact component={WaqfEvents} />
                    <Route path="/sign-up" component={Register} />
                    <Route path="/sign-in" component={Login} />
                    <Route path="/debug" component={Debug} />
                    <Route component={error} />
                  </Switch>
              }
        </Router>
      </>
    );
  }
}

const HomePageLogin = () => (
  <div className="col-md-12 home-wrap">
    <div className="col-md-12">
      <div className="col-md-12">
        <div className="col-md-12">
          <div className="col-md-12">
            
            <div className="row">
              <div className="col-md-6 front-font fadeInDown">
                <br></br><br></br><br></br>
                <div className="fadeIn first">
                  <h1>Donate Waqf.</h1>
                  <h1>Track Waqf</h1>
                </div>
                <br></br>
                <h5 className="fadeIn second">Giving is just not about make a donation, it is about making<br></br> difference. Your kindness today could save a life tommorow</h5>
                <br></br>
                <div>
                  {/* <button type="button" className="btn btn-info rounded-pill"><i class="fab fa-bitcoin"></i> Join Us</button> */}
                  <Link to={{
                    pathname: `sign-up`
                  }}>
                    <button className="front-btn-1 fadeIn third"><i className="fab fa-bitcoin"></i> Join Us</button>
                  </Link>
                </div>
              </div>
              <div className="col-md-6 front-charity">
                <img src="8.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>


            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center front-font-2">
                  <br></br><br></br><br></br><br></br><br></br>
                  <h2>Waqf Blockchain Features</h2>
                  <br></br><br></br>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-1" src="card-1.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Online Donation</h2>
                    </div>      
                    <div className="text">
                      <span>All transaction and donation can be transfered online</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-2" src="card-2.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Blockchain</h2>
                    </div>      
                    <div className="text">
                      <span>This website is powered by blockchain technology and everything is encrypted and recorded publicly</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-3" src="card-3.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Track Waqf</h2>
                    </div>      
                    <div className="text">
                      <span>Track every waqf progress that you have been donated</span>
                    </div>
                  </div>
                </div>  
              </div>
            </div>

            <br></br><br></br><br></br><br></br><br></br><br></br>
            <div className="col-md-12 text-center waqftype-font">
              <h4>DO NOT FORGET TO READ ABOUT WAQF TYPE</h4>
              <h1>Five Types of Waqf</h1>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="warzone.jpg" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 warzone-font">
                <h2>Warzone</h2>
                <p>Start helping person who needs more food, shelter out there. They are waiting for you</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 education-font">
                <h2>Education</h2>
                <p>Contribute for student studies and comfort such as book, Al-Quran, chair and table</p>
              </div>
              <div className="col-md-6">
                <img src="as.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="humanitarian.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 humanitarian-font">
                <h2>Humanitarian</h2>
                <p>Every orphan deserves to get perfect love. Make them happy by giving their essentials.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 welfare-font">
                <h2>Welfare</h2>
                <p>Start helping person who needs more food, shelter out there. They are waiting for you</p>
              </div>
              <div className="col-md-6">
                <img src="welfare.jpg" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="medical.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 medical-font">
                <h2>Medical</h2>
                <p>Our donations aim to increase access to medicine and medical supplies for those who cannot afford them.</p>
              </div>
            </div>

            <br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        </div>
      </div>
    </div>
    {/* <div className="col-md-12 text-center wrapper fadeInDown">
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br>
      <h1>This is Waqf HomePage</h1>
    </div> */}
    <footer className="page-footer font-small footer-custom">
      <div className="footer-copyright text-center py-3">© 2020 Copyright by Ahmad Shauqi:
        <p>WaqfHome.com</p>
      </div>
    </footer>
  </div>
);

const HomePage = () => (
  <div className="col-md-12 home-wrap">
    <div className="col-md-12">
      <div className="col-md-12">
        <div className="col-md-12">
          <div className="col-md-12">
            
            <div className="row">
              <div className="col-md-6 front-font fadeInDown">
                <br></br><br></br><br></br>
                <div className="fadeIn first">
                  <h1>Donate Waqf.</h1>
                  <h1>Track Waqf</h1>
                </div>
                <br></br>
                <h5 className="fadeIn second">Giving is just not about make a donation, it is about making<br></br> difference. Your kindness today could save a life tommorow</h5>
                <br></br>
                <div>
                  {/* <button type="button" className="btn btn-info rounded-pill"><i class="fab fa-bitcoin"></i> Join Us</button> */}
                  
                </div>
              </div>
              <div className="col-md-6 front-charity">
                <img src="8.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>


            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center front-font-2">
                  <br></br><br></br><br></br><br></br><br></br>
                  <h2>Waqf Blockchain Features</h2>
                  <br></br><br></br>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-1" src="card-1.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Online Donation</h2>
                    </div>      
                    <div className="text">
                      <span>All transaction and donation can be transfered online</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-2" src="card-2.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Blockchain</h2>
                    </div>      
                    <div className="text">
                      <span>This website is powered by blockchain technology and everything is encrypted and recorded publicly</span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 hem">
                  <div className="box-part text-center">
                    <img className="card-img-top card-img-3" src="card-3.svg" alt="Card Images"></img>      
                    <div className="title-card">
                      <h2>Track Waqf</h2>
                    </div>      
                    <div className="text">
                      <span>Track every waqf progress that you have been donated</span>
                    </div>
                  </div>
                </div>  
              </div>
            </div>

            <br></br><br></br><br></br><br></br><br></br><br></br>
            <div className="col-md-12 text-center waqftype-font">
              <h4>DO NOT FORGET TO READ ABOUT WAQF TYPE</h4>
              <h1>Five Types of Waqf</h1>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="warzone.jpg" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 warzone-font">
                <h2>Warzone</h2>
                <p>Start helping person who needs more food, shelter out there. They are waiting for you</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 education-font">
                <h2>Education</h2>
                <p>Contribute for student studies and comfort such as book, Al-Quran, chair and table</p>
              </div>
              <div className="col-md-6">
                <img src="as.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="humanitarian.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 humanitarian-font">
                <h2>Humanitarian</h2>
                <p>Every orphan deserves to get perfect love. Make them happy by giving their essentials.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 welfare-font">
                <h2>Welfare</h2>
                <p>Start helping person who needs more food, shelter out there. They are waiting for you</p>
              </div>
              <div className="col-md-6">
                <img src="welfare.jpg" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <img src="medical.png" className="img-fluid front-charity-img" alt="Responsive image"></img>
              </div>
              <div className="col-md-6 medical-font">
                <h2>Medical</h2>
                <p>Our donations aim to increase access to medicine and medical supplies for those who cannot afford them.</p>
              </div>
            </div>

            <br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        </div>
      </div>
    </div>
    {/* <div className="col-md-12 text-center wrapper fadeInDown">
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br><br></br><br></br>
      <h1>This is Waqf HomePage</h1>
    </div> */}
    <footer className="page-footer font-small footer-custom">
      <div className="footer-copyright text-center py-3">© 2020 Copyright by Ahmad Shauqi:
        <p>WaqfHome.com</p>
      </div>
    </footer>
  </div>
);

export default App;
