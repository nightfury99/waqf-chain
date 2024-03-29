import React, { Component } from 'react';
import Web3 from 'web3';
//import './App.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from 'react-router-dom';

class CreateWaqf extends Component {
    async componentWillMount() {
        await this.debugging();
        await this.loadBlockchainData();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    } 

    async debugging() {
    }

    async loadBlockchainData() {
        // const WEB3 = window.web3;
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
          const productCount = await waqfchain.methods.productCount().call();
          this.setState({ productCount });
          // load waqf event
          for(var i = 1; i <= productCount; i++) {
            const waqf = await waqfchain.methods.waqfEvents(i).call();
            this.setState({
              products: [...this.state.products, waqf]
            });
          }

          waqfchain.getPastEvents('SendWaqfCreated', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            let price = 0;
            let acc = 0;
            
            for(let j = 1; j <= parseInt(productCount); j++) {
                events.forEach(element => {
                    let waqfId = parseInt(element.returnValues.waqfId);
                    if(waqfId === j) {
                        price = price + parseInt(element.returnValues.price);
                        acc = acc + 1;
                    }
                });

                this.setState({
                    totalPrice: [...this.state.totalPrice, price]
                });
                price = 0;
            }
            
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
          totalPrice: [],
          products: [],
          koboi: '🤠',
          search: ''
        }
    }

    checkLogin() {
        // const allCookie = document.cookie;
        // let huhu = allCookie.split('=');
        //const cook = huhu[1];
        var lastname = localStorage.getItem("key");
        if(lastname !== '') {
          return true;
        } else {
          return false;
        }
      }
    
    updateSearch(event) {
        this.setState({
            search: event.target.value.substr(0, 20)
        })
    }

    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        let i = 0;
        let filteredSearch = this.state.products.filter(
            (product) => {
                return product.name.toLowerCase().indexOf(this.state.search) !== -1;
            }
        );
        return (
            <div className="container">
                <div className="col-md-12 text-center" style={{padding: "10px", marginTop: "20px", color: "#5c5c5c", border: "none"}}>
                    <h1>Waqf Event</h1>
                </div>

                <div className="col-md-12 text-center searchBar">
                    <input 
                        type="text" 
                        placeholder="Search waqf project"
                        value={this.state.search} 
                        onChange={this.updateSearch.bind(this)}
                        className="searchbar"/>
                    <label for="check"><i className="fas fa-search"></i></label>
                </div>
                
                <div className="card-list">
                    {filteredSearch.map((val, key) => {
                        let j = (parseInt(this.state.totalPrice[i]) / val.price * 100).toFixed(1);
                        let m = j;
                        if(j >= 100) {
                            j = 100;
                        } else if(j <= 3) {
                            m = 3;
                        }

                        return(
                            <div key={key} className="col-md-12 myChart" style={{padding: "10px 10px 30px 10px", marginBottom: "50px"}}>
                                <div className="col-md-12" style={{padding: "10px"}}>
                                    <h5>{val.name}</h5>
                                </div>
                                <div className="col-md-12" style={{marginLeft: "15px"}}>
                                    <p>{val.product_type}</p>
                                </div>
                                <div className="col-md-12" style={{marginLeft: "15px"}}>
                                    <p>Target Fund: RM {val.price.toString()}</p>
                                </div>

                                {/* <div className="col-md-12" style={{marginLeft: "15px"}}>
                                    <p>Collected Fund: RM {this.state.totalPrice[i++]}</p>
                                </div> */}
                                {}
                                <div className="col-md-12" style={{marginLeft: "0px", fontSize: "13px"}}>
                                    <p><span style={{fontWeight: "800"}}>RM {this.state.totalPrice[i++]}</span> was raised from RM {val.price.toString()}</p>
                                </div>
                                
                                <div className="progress" style={{marginLeft: "30px"}}>
                                    <div className="progress-bar progress-bar-striped bg-info" role="progressbar" style={{width: m+"%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">{j}%</div>
                                </div>

                                { this.checkLogin()
                                ?
                                <div className="col-md-12" style={{marginLeft: "15px", marginTop: "10px"}}>
                                    <Link to={{
                                        pathname: `/waqf-events/${val.id}`,
                                        Id: val.id,
                                        account: this.props.location.account
                                        }}>
                                            <button className="btn btn-secondary rounded-pill"><i className="fas fa-eye"></i> View</button>
                                            {/* 004275 */}
                                    </Link>
                                </div>
                                : <></>
                                }
                                
                            </div>
                        );
                    })}
                </div>
            </div>
                 
        );
    }
}

export default CreateWaqf;
