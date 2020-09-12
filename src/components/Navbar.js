import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  async componentWillMount() {

  }

  checkLogin() {
    //const username = getCookie('username');
    const allCookie = document.cookie;
    let huhu = allCookie.split('=');
    const cook = huhu[1];
    
    if(cook != '') {
      return true;
    } else {
      return false;
    }
  }

  checkAdmin() {
    const allCookie = document.cookie;
    let huhu = allCookie.split('=');
    const cook = huhu[1];
    if(cook === 'admin') {
      return true;
    } else {
      return false;
    }
  }

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
            
            { (this.checkAdmin() && this.checkLogin())   // ADMIN
              ? <Link to={{
                pathname: '/create-waqf', 
                account: this.props.account, 
                waqfchain: this.props.waqfchain,
                loading: this.props.loading,
                createWaqf: this.props.createWaqf,
                products: this.props.products
              }}>
                <li className="nav-item">
                <a className="nav-link">Create Waqf</a>
                </li>
              </Link>
          : <div></div>
            }
            {(!this.checkLogin() && !this.checkAdmin())  // NORMAL USER
              ? <Link to={{
                  pathname: '/sign-up', 
                  account: this.props.account, 
                  waqfchain: this.props.waqfchain,
                  loading: this.props.loading,
                  createAccountz: this.props.createAccountz
                }}>
                  <li className="nav-item">
                  <a className="nav-link">Register</a>
                  </li>
                </Link>
              : <div></div>
            }

            {(!this.checkLogin() && !this.checkAdmin())  // NORMAL USER
              ? 
                <Link to={{
                  pathname: '/sign-in', 
                  account: this.props.account
                }}>
                  <li className="nav-item">
                  <a className="nav-link">Login</a>
                  </li>
                </Link>

              : <div></div>
            }

            {this.checkLogin()
              ? <Link to={{
                pathname: '/sign-out', 
                account: this.props.account
              }}>
                <li className="nav-item">
                <a className="nav-link">Logout</a>
                </li>
              </Link>
            : <div></div>
            }
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
