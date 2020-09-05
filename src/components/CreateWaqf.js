import React, { Component } from 'react';
import Web3 from 'web3';
import Apps from './App'

class CreateWaqf extends Component {
    async componentWillMount() {
        await this.debugging();
        await this.onChangeLink.bind(this);
    }

    async debugging() {
        console.log(this.props.debug);
        this.setState({ debug: 'changed' });
        console.log(this.state.debug);
    }
/*
    createWaqf(title, details, types, price) {
        this.setState({ loading: true });
        this.props.waqfchain.methods.createProduct(title, details, types, price).send({ from: this.state.account })
        .once('receipt', (receipt) => {
            this.setState({ loading: false });
        });
    }
*/  
    constructor(props) {
        super(props);
        this.state = {
          account: this.props.account,
          //productCount: 0,
          //products: [],
          loading: this.props.loading,
          debug: this.props.debug
        }
    }
    
    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        return (
            <div className="card">
                <div className="card-header text-center">
                    <h1 className="card-title">Create Waqf Event</h1>
                </div>
                
                <div className="card-body">
                    <form onSubmit={(event) => {
                        const price = this.waqfPrice.value * 0.00061;
                        alert(price);
                        const prices = window.web3.utils.toWei(this.waqfPrice.value.toString(), 'Ether');
                        //this.props.CreateWaqf(this.waqfTitle.value, this.waqfDetails.value, this.waqfTypes.value, this.waqfPrice.value);
                    }}>
                        <div className="form-row col-md-12">
                            <div className="form-group col-md-6">
                                <label>Title</label>
                                <input type="text" className="form-control" id="waqf_title" placeholder="Title" ref={(input) => { this.waqfName = input }}></input>
                            </div>
                            <div className="form-group col-md-6">
                                <label>Product Types</label>
                                <select defaultValue='DEFAULT' ref={(input) => { this.waqfTypes = input }} id="waqf_type" className="form-control">
                                    <option value="DEFAULT" disabled>Choose</option>
                                    <option value="Education">Education</option>
                                    <option value="Foster">Foster</option>
                                    <option value="Warzone">Warzone</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label>Waqf Details</label>
                            <input type="text" className="form-control" id="waqf_details" placeholder="Details" ref={(input) => { this.waqfDetails = input }}></input>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Waqf Target Price</label>
                            <input type="text" className="form-control" id="waqf_details" placeholder="Price" ref={(input) => { this.waqfPrice = input }}></input>
                        </div>
                        <div className="col-md-12">
                        <button type="submit" className="btn btn-primary">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
            
        );
    }
}

export default CreateWaqf;
