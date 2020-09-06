import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    const navStyle = {
      liststyle: 'none'
    }
    return (

        <nav className="navbar navbar-expand-md bg-dark navbar-dark">
	        <a className="navbar-brand" href="#">HIT eCOB</a>
	
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
	
	        <div className="collapse navbar-collapse" id="collapsibleNavbar">
		        <ul className="navbar-nav mr-auto text-white">
            
			        <li className="nav-item">
                <a className="nav-link">
                <Link style={navStyle} to={{
                  pathname: '/create-waqf', 
                  account: this.props.account, 
                  waqfchain: this.props.waqfchain,
                  loading: this.props.loading,
                  createWaqf: this.props.createWaqf,
                  products: this.props.products
                }}>
                  Create Waqf
                </Link>
                  </a>
			        </li>
            
            <Link to={{
                  pathname: '/waqf-events', 
                  account: this.props.account, 
                  waqfchain: this.props.waqfchain,
                  loading: this.props.loading,
                  createWaqf: this.props.createWaqf,
                  products: this.props.products
            }}>
              <li className="nav-item">
              <a className="nav-link">View Waqf</a>
			        </li>
            </Link>
		        </ul>
		        <ul className="navbar-nav text-white">
			        <li className="nav-item ml-auto">
                        <small>{ this.props.account }</small>
			        </li>
		        </ul>
	        </div>
        </nav>
    );
  }
}

export default Navbar;
