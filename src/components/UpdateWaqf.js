import React, { Component } from 'react';
import Web3 from 'web3';
import WaqfChain from '../abis/WaqfChain.json';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Chart from "react-apexcharts";
import Active from "./chart/Active";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import TypeChart from './chart/Type';
import LineChart from'./chart/Line';

class UpdateWaqf extends Component {
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
        var active = 0;
        var closed = 0;
        var ed = 0;
        var fo = 0 
        var wa = 0 
        var we = 0;
        //var closed = 0;
        const waqf_types = ["Education", "Foster", "Warzone", "Welfare"];
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
            if(waqf.product_type === "Education") {
                ed += 1;
            } else if(waqf.product_type === "Foster"){
                fo += 1;
            } else if(waqf.product_type === "Warzone"){
                wa += 1;
            } else if(waqf.product_type === "Welfare") {
                we += 1;
            }

            this.setState({
              products: [...this.state.products, waqf]
            });
            if(waqf.closed) {
              closed += 1;
            }
          }
          
          closed = (closed / productCount) * 100;
          active = 100 - closed;
          this.setState({ active: active });
          this.setState({ closed: closed });
          this.setState({ ed: ed });
          this.setState({ fo: fo });
          this.setState({ wa: wa });
          this.setState({ we: we });
        

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
          productCount: 0,
          totalPrice: [],
          products: [],
          koboi: '🤠',
          active: 0,
          closed: 0,
          wa: 0,
          we: 0,
          fo: 0,
          ed: 0
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

        const mystyle = {
            height: "250px"
        };
        const mystyles = {
            top: "0",
            width: "300px",
            height: "50px"
        };
        return (
            <div className="col-md-12">
                <br></br>
                <div className="col-md-12 text-center">
                    <h3>Update Waqf Project.</h3>
                </div>
                <div className="row">
                    {/* <div className="col-md-4">
                        
                    </div> */}
                    <div className="col-md-8">
                        <div className="col-md-12">
                            <div className="row">
                                <div className=" myChart" style={mystyle}>
                                    <h5>Active</h5>
                                <Active active={this.state.active} />
                                </div>
                                <div className="myChart" style={mystyle}>
                                    <h5>Closed</h5>
                                <Active active={this.state.closed} />
                                </div>
                                <div className="myChart">
                                    <h5>{parseInt(this.state.productCount)} Waqf Project</h5>
                                    <TypeChart
                                        ed={this.state.ed}
                                        fo={this.state.fo}
                                        wa={this.state.wa}
                                        we={this.state.we}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="myChartS">
                            {/* <h5>Active</h5> */}
                            <LineChart active={this.state.active} />
                        </div>
                    </div>
                </div>
                <div className="myChartUT">
                    <h4>Update Project</h4>
                </div>
                <div className="col-md-12 div-neu">
                    <SimpleBar style={{maxHeight: 300 }}>
                        <table className="content-table">
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th>Waqf Project</th>
                                    <th className="text-center">Target Fund</th>
                                    <th className="text-center">Collected Fund</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">View</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.products.map((product, key) => {
                                return(
                                    <tr key={key}>
                                        <td className="text-center">{no++}</td>
                                        <td>{product.name}</td>
                                        <td className="text-center">RM {parseInt(product.price)}</td>
                                        <td className="text-center">RM {parseInt(this.state.totalPrice[num++])}</td>
                                        {this.checkStatus(JSON.stringify(product.closed))
                                        ? <td className="text-center">Closed</td>
                                        : <td className="text-center">Active</td>
                                        }
                                        <td className="text-center">
                                        <Link to={{
                                            pathname: `update-waqf/${product.id}`
                                        }}>
                                            <button className="btn btn-outline-info btn-sm rounded-pill"><i className="fas fa-pen"></i> Update</button>
                                        </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </SimpleBar>
                </div>
                <div className="wrapper fadeInDown"></div>
            </div>     
        );
    }
}

export default UpdateWaqf;
