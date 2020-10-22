import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class UpdateWaqf extends Component {
    async componentWillMount() {
        await this.debugging();
        await this.loadBlockchainData();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    } 

    async debugging() {
        /*
        this.setState({ debug: 'changed' });
        console.log(this.state.debug);*/
    }

    async loadBlockchainData() {
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider);
        // Load account
        //window.ethereum.enable();
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
          koboi: '🤠'
        }
    }
    
    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    checkStatus(value) {
        if(value === "true") {
            return true;
        }else {
            return false;
        }
    }

    render() {
        let no = 1;
        let num = 0;
        return (
            <div className="col-md-12">
                <br></br>
                <div className="col-md-12 text-center">
                    <h1>Update Waqf Project.</h1>
                </div>
                <br></br><br></br>
                <div className="col-md-12">
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                        {/* <div className="card-header">
                            <h5><span className="fa fa-list"></span> Waqf Project Dashboard</h5>
                        </div> */}

                        <div className="card-body table-responsive">
                            <table className="table table-hover table-fluid dataTable">
                                <thead className="thead-dark">
                                    <tr>
                                    <th scope="col" className="text-center">No</th>
                                    <th scope="col">Waqf Project</th>
                                    <th scope="col" className="text-center">Target Fund</th>
                                    <th scope="col" className="text-center">Collected Fund</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="text-center" width="10%">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.products.map((product, key) => {
                                        return(
                                            <tr key={key}>
                                                <th scope="row" className="text-center">{no++}</th>
                                                <td>{product.name}</td>
                                                <td className="text-center">RM {parseInt(product.price)}</td>
                                                <td className="text-center">RM {parseInt(this.state.totalPrice[num++])}</td>
                                                {this.checkStatus(JSON.stringify(product.closed))
                                                ? <td>Closed</td>
                                                : <td>Active</td>
                                                }
                                                <td className="text-center">
                                                <Link to={{
                                                    pathname: `update-waqf/${product.id}`
                                                }}>
                                                    <button className="btn btn-outline-info"><i className="fas fa-pen"></i> Update</button>
                                                </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        
                    </div>
                </div>
                <div className="wrapper fadeInDown"></div>
            </div>     
        );
    }
}

export default UpdateWaqf;
