import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Link } from 'react-router-dom';

class Register extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
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
        // const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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
          
          waqfchain.getPastEvents('accountCreated', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            events.forEach(element => {
              // let waqfId = parseInt(element.returnValues.waqfId);
              
              this.setState({
                registerUsername: [...this.state.registerUsername, element.returnValues.username]
              });
              
            });
            
            // this.setState({ totalAccount: acc });
            // this.setState({ totalPrice: price });
  
            if(err) {
                // console.log(err);
            }
          });
          
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
          registerUsername: [],
          loading: true,
          debug: 'RECEIVED'
        }
        this.createAccountz = this.createAccountz.bind(this);
      }
      
    createAccountz(name, username, email, password) {
        if(name === "" || username === "" || email === "" || password === "") {
          window.alert("please fill");
        } else {
          var duplicate = false;
          var acc = localStorage.getItem("account");
          this.setState({ loading: true });
          this.state.registerUsername.forEach(el => {
            if(el === username) {
              duplicate = true;
            }
          });

          if(duplicate) {
            window.alert("Username has been taken!");
          }else {
            this.state.waqfchain.methods.createAccounts(name, username, email, password).send({ from: acc })
            .once('receipt', (receipt) => {
              this.setState({ loading: false });
            });
          }
        }
        
        //this.state.account
      }

    render() {
        return (
            <div className="wrapper fadeInDown" id="login">
            <div id="formContent">
              <h2 className="active"> Sign Up </h2>
              <br></br>
              <br></br>
              <div className="fadeIn first">
                {/* <img src="1.png"  id="icon" alt="User Icon" /> */}
                <h1><span className="a">Waqf</span><span className="b">Home</span></h1>
              </div>
              <br></br>
              
              <form onSubmit={(event) => {
                event.preventDefault();
                const name = this.accName.value;
                const username = this.accUsername.value;
                const email = this.accEmail.value;
                const password = this.accPassword.value;
                this.createAccountz(name, username, email, password);
              }}>
                <input type="text" id="login" className="fadeIn second" name="login" placeholder="Name" ref={(input) => { this.accName = input }}></input>
                <input type="text" id="username" className="fadeIn second" name="login" placeholder="username" ref={(input) => { this.accUsername = input }}></input>
                <input type="email" id="username" className="fadeIn second" name="login" placeholder="email" ref={(input) => { this.accEmail = input }}></input>
                <input type="password" id="password" className="fadeIn third" name="login" placeholder="password" ref={(input) => { this.accPassword = input }}></input>
                <br></br>
                <br></br>
                <input type="submit" className="fadeIn fourth" value="Register"></input>
              </form>
          
              <div id="formFooter">
                <Link to={{
                  pathname: `sign-in`
                }}>
                  <a className="underlineHover">Sign In</a>
                </Link>
                
              </div>
          
            </div>
          </div>     
        );
    }
}

export default Register;
