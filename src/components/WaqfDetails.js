import React, { Component } from 'react';
import Web3 from 'web3';
//import './App.css';
import WaqfChain from '../abis/WaqfChain.json';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class WaqfDetails extends Component {
    async componentWillMount() {
        await this.loadBlockchainData();
        await this.debugging();
        //await this.onChangeLink.bind(this);
        window.web3 = new Web3(window.web3.currentProvider);
    } 

    async debugging() {
        const WEB3 = window.web3;
        const web3 = new Web3(Web3.givenProvider); 
    }

    async loadBlockchainData() {
      const WEB3 = window.web3;
      const web3 = new Web3(Web3.givenProvider);
      // Load account
      //swindow.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.setState({ account: accounts[0] });
      
      const networkId = await web3.eth.net.getId();
      const networkData = WaqfChain.networks[networkId];
      let accept = true;
      
      if(isNaN(this.props.match.params.id)) {
        accept = false;
        window.location.replace("http://localhost:3000/error");
      }
      this.setState({ accept: accept });
      // check if we are on developed network
      if(accept) {
        if(networkData) {
          const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
          this.setState({ waqfchain });
          const productCount = await waqfchain.methods.productCount().call();
          this.setState({ productCount });
          // load waqf event
          // for(var i = 1; i <= productCount; i++) {
          //   const waqf = await waqfchain.methods.waqfEvents(i).call();
          //   this.setState({
          //     products: [...this.state.products, waqf]
          //   });
          // }
          
          const waqf = await waqfchain.methods.waqfEvents(parseInt(this.props.match.params.id)).call();
          this.setState({ products: waqf });
  
          waqfchain.getPastEvents('SendWaqfCreated', {
            fromBlock: 0,
            toBlock: 'latest'
          }, (err, events) => {
            let price = 0;
            let acc = 0;
  
            events.forEach(element => {
              let waqfId = parseInt(element.returnValues.waqfId);
              if(waqfId === parseInt(this.props.match.params.id)) {
                this.setState({
                  senderPrice: [...this.state.senderPrice, element.returnValues.price]
                });
                price = price + parseInt(element.returnValues.price);
                acc = acc + 1;
              }
            });
            
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
    }

    sendWaqf(id, price, prices) { 
      this.setState({ loading: true });
      var acc = localStorage.getItem("account");
      const price_wei = window.web3.utils.toWei(price.toString(), 'Ether');
     
      this.state.waqfchain.methods.sendWaqf(id, prices).send({ from: acc, value: price_wei})
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert('cannot load your address, please refresh again!');
      });
    }
    
    constructor(props) {
      super(props);
      this.state = {
        account: this.props.location.account,
        //productCount: 0,
        products: [],
        totalAccount: 0,
        totalPrice: 0,
        senderPrice: [],
        hem: [],
        koboi: '🤠',
        accept: false
      }
  }

    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        return(
          <div className="row">
            <div className="col-md-8">
              <div className="container myChartWaqfEvent" style={{margin: "70px 30px 0px 30px", color: "#3c3c41"}}>
                <div className="col-md-12" style={{padding: "40px 40px 0 40px"}}>
                  <h3>{this.state.products.name}</h3>
                </div>
                <div className="updateInput" style={{
                  padding: "30px",
                  marginTop: "1%" 
                  }}>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        let price = parseInt(this.price.value);
                        let ether = price * 0.00066;
                        this.sendWaqf(this.state.products.id, ether, price);
                    }}>
                        <div className="form-row col-md-12">
                            <div className="form-group col-md-12">
                                <p>Details</p>
                                {this.state.products.details}
                            </div>
                        </div>
                        
                        <div className="form-row col-md-12">
                          <div className="form-group col-md-4">
                            <p>Product Types</p>
                            {this.state.products.product_type}
                          </div>
                          <div className="form-group col-md-4">
                            <p>Waqf Target Price</p>
                            RM {parseInt(this.state.products.price)}
                          </div>
                          <div className="form-group col-md-4">
                            <p>Fund Collected</p>
                            RM {this.state.totalPrice}
                          </div>

                          <div className="col-md-4">
                            <p>DONATE</p>
                            <input type="number" className="form-control" id="waqf_title" placeholder="price" ref={(input) => { this.price = input }} style={{marginLeft:"0"}}></input>
                          </div>

                        </div>
                        <div className="col-md-12">
                          <button type="submit" className="btn btn-primary" style={{margin: "30px 0 10px 0"}}><i className="fas fa-hand-holding-usd"></i> Donate</button>
                        </div>
                    </form>
                </div>
              </div>
            </div>
            <div className="col-md-4 scrollPart2">
              <h5>List of Donor</h5>
              <SimpleBar style={{maxHeight: 600 }}>
                {this.state.senderPrice.length === 0
                ? <>
                  <div className="alert alert-danger" role="alert">
                    There is no transaction yet, hence no info about donor.
                  </div>
                </>
                : <>
                  {this.state.senderPrice.map((value, key) => {
                    return(
                      <div className="myChartScrollWU" key={key}>
                        Anonymous<br></br>
                        {/* <small>{this.state.name[count_name]}</small><br></br>
                        <small>{this.state.senderAddress[count_name]}</small><br></br> */}
                        RM {parseInt(value)}
                      </div>
                    );
                  })}
                </>
                }
              </SimpleBar>
            </div>
          </div>
        );
    }
}

export default WaqfDetails;
