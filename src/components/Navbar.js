import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (

        <nav className="navbar navbar-expand-md bg-dark navbar-dark">
	        <a className="navbar-brand" href="#">HIT eCOB</a>
	
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
	
	        <div className="collapse navbar-collapse" id="collapsibleNavbar">
		        <ul className="navbar-nav mr-auto">
			        <li className="nav-item">
                        <a className="nav-link <?= $active ?>" href="<?= PORTAL?><?= $menu->url ?>">
                            <span className="<?= $menu->icon ?>"></span>
                        </a>
			        </li>
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
