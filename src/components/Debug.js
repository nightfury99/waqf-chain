import React, { Component } from 'react';
import Web3 from 'web3';
import Apps from './App'

class Debug extends Component {
    constructor(props) {
        super(props);
        this.state = {
          account: this.props.account,
          //productCount: 0,
          products: this.props.location.products,
          loading: this.props.loading,
          debug: this.props.debug,
          koboi: '🤠'
        }
    }
    
    onChangeLink() {
        this.props.onLinking(this.state.debug);
    }

    render() {
        return (
            <div>
                <p>{console.log(this.state.products)}<span className="ec ec-nerd-face"></span></p>
            </div>        
        );
    }
}

export default Debug;
