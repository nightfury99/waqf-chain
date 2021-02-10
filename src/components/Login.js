import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

class Login extends Component {
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
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        //window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        this.setState({ account: accounts[0] });
        
        const networkId = await web3.eth.net.getId();
        const networkData = WaqfChain.networks[networkId];
        // check if we are on developed network
        if(networkData) {
          const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
          this.setState({ waqfchain });
          const accountCount = await waqfchain.methods.accountCount().call();
          
          this.setState({ accountCount });
          // load waqf event
          for(var i = 1; i <= accountCount; i++) {
            const acc = await waqfchain.methods.createAccount(i).call();
            this.setState({
              accounts: [...this.state.accounts, acc]
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
          accounts: [],
          productCount: 0,
          accountCount: 0,
          products: [],
          loading: true,
          debug: 'RECEIVED'
        }   
    }

    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    checkCredentials(username, password) {
        this.setState({ loading: true });
        var realAccount = localStorage.getItem("account");
        let passed = 0;

        this.state.accounts.map((acc, key) => {
          if(username === 'admin' && password === acc.password && realAccount === acc.userAddress.toLowerCase()) {
            passed = 1;
            localStorage.setItem("key", "admin");
            //this.setCookie('username', acc.username, 1);
          }else if(username === acc.username.toString() && password === acc.password.toString() && realAccount === acc.userAddress.toLowerCase()) {
            console.log('cred found');
            localStorage.setItem("key", acc.username.toString());
            passed = 1;
            //this.setCookie('username', acc.username, 1);
          }
        });
        
        if(passed === 1) {
          window.location.replace("http://localhost:3000/");
        } else {
          Swal.fire(
            'Wrong',
            'Wrong username or password',
            'info'
          );
          //window.location.replace("http://localhost:3000/sign-in")
        }
    }

    render() {
        return (
          <div className="wrapper fadeInDown" id="login">
              <br></br><br></br><br></br>
            <div id="formContent">
              <h2 className="active"> Sign In </h2>
              <br></br><br></br>

              <div className="fadeIn first">
                {/* <img src="logo.png"  id="icon" alt="User Icon"/> */}
                {/* <img src="logo.png" className="img-fluid Login" alt="Responsive image"></img> */}
                <h1><span className="a">Waqf</span><span className="b">Home</span></h1>
              </div>
              <br></br>
              
              <form onSubmit={(event) => {
                event.preventDefault();
                const username = this.username.value;
                const password = this.password.value;
                if(username === "" || password === "") {
                  Swal.fire(
                    'Empty',
                    'Please fill all the forms',
                    'info'
                  );
                }else {
                  this.checkCredentials(username, password);
                }
              }}>
                <input type="text" id="username" className="fadeIn second" name="login" placeholder="username" ref={(input) => { this.username = input }} required></input>
                <input type="password" id="password" className="fadeIn third" name="login" placeholder="password" ref={(input) => { this.password = input }} required></input>
                <br></br>
                <br></br>
                <input type="submit" className="fadeIn fourth" value="Login"></input>
              </form>
          
              <div id="formFooter">
                <Link to={{
                    pathname: `sign-up`
                  }}>
                    <a className="underlineHover">Sign Up</a>
                </Link>
              </div>
            </div>
          </div>     
        );
    }
}

export default Login;
