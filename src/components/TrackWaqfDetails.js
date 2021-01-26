import React, { Component } from 'react';
import Web3 from 'web3';
//import './login.css';
import WaqfChain from '../abis/WaqfChain.json';
import './login.css';
class TrackWaqfDetails extends Component {
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
        if(networkData) {
          const waqfchain = web3.eth.Contract(WaqfChain.abi, networkData.address);
          this.setState({ waqfchain });
          const productCount = await waqfchain.methods.productCount().call();
          this.setState({ productCount });
          // load waqf event
          const waqf = await waqfchain.methods.waqfEvents(this.props.match.params.id).call();
          const waqfUpdate = await waqfchain.methods.updateWaqfEvents(this.props.match.params.id).call();
          this.setState({ products: waqf });
          this.setState({ WaqfUpdate: waqfUpdate });
          this.setState({ loading: false });
          
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
          });

        } else {
          window.alert('WaqfChain contract is not deployed to detected network');
        }
      }
      
    constructor(props) {
        super(props);
        this.state = {
          account: this.props.location.account,
          products: [],
          updateDetails: [],
          totalAccount: 0,
          totalPrice: 0,
          loading: true,
          WaqfUpdate: [],
          manageBool: false,
          developBool: false,
          completedBool: false,
          image: ["/img2.png", "/img3.png", "/img4.png", "/img5.png", "/img6.png", "/img7.png", "/img8.png"],
          imgClass: ["rounded img-fluid img1", "rounded img-fluid img2", "rounded img-fluid img3", "rounded img-fluid img4", "rounded img-fluid img5", "rounded img-fluid img6", "rounded img-fluid img7", "rounded img-fluid img8", "rounded img-fluid img9", "rounded img-fluid img10"]
        }
    }
    
    closeWaqf(waqfId) {
      this.setState({ loading: true });
      
      this.state.waqfchain.methods.closeWaqfStatus(waqfId).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      }).catch((error) => {
        window.alert("cannot load your account, Please refresh the page!");
      });
    }


    render() {
      let i = 0;
        return (
            <div className="container">
              <br></br><br></br><br></br>
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              :
              <div>
                <div className="text-center">
                  <h1>Donated Waqf Event</h1>
                  <h3 style={{color: "#3c3c41"}}>Check your waqf progress</h3>
                </div>
                <br></br><br></br>

                <div className="col-md-12 myChartTrack" style={{backgroundColor: "#ecedf1"}}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <img src="/img1.png" alt="..." className="rounded img-fluid img0"></img>
                        </div>
                        <div className="col-md-8" style={{padding: "20px 10px 0 10px", marginTop: "auto", marginBottom: "auto"}}>
                          <div className="">
                            <h4>Waiting and Processing</h4>
                          </div>
                          <p>Your waqf is processing and waiting for charity to full</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                { this.state.updateDetails.map((value, key) => {
                  return(
                    <div className="col-md-12 myChartTrack" key={key} style={{backgroundColor: "#ecedf1"}}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <img src={this.state.image[i]} alt="..." className={this.state.imgClass[i++]}></img>
                            </div>
                            <div className="col-md-8" style={{padding: "20px 10px 0 10px"}}>
                              <div className="test">
                              <p>Details: {value.data_1}</p>
                              </div>
                              <p>Date: {value.date_1}</p>
                              <p>Location: {value.location}</p>
                              <p>Used: RM {value.moneyUsed}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    // <div key={key}>
                    //   <br></br><br></br>
                    //   <div class="col-md-12 shadow p-3 mb-5 bg-white rounded">
                    //     <div className="row">
                    //       <div className="col-md-4">
                    //         <div className="row-mb-4">
                    //           <div className="col-md-8 p-2">
                    //             <img src={this.state.image[i++]} className="trying" alt="..." class="rounded img-fluid"></img>
                    //           </div>
                    //         </div>
                    //       </div>
                    //       <div className="col-md-8">
                    //         <h5>{value.data_1}</h5>
                    //         <br></br>
                    //         <p>Date: {value.date_1}</p>
                    //         <p>Location: {value.location}</p>
                    //         <p>Used: RM {value.moneyUsed}</p>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>
                  );
                })}
              </div>
            }
            <br></br><br></br><br></br><br></br>
            </div>     
        );
    }
}

export default TrackWaqfDetails;
