import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from 'react-icons/ai';
import { SidebarDataA } from './SidebarDataA';
import { SidebarDataU } from './SidebarDataU';
import { SidebarDataR } from './SidebarDataR';
import { IconContext } from 'react-icons/lib';

function Sidebar() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    var acc = localStorage.getItem("account");

    const checkLogin = () => {
        const allCookie = document.cookie;
        let huhu = allCookie.split('=');
        const cook = huhu[1];
        
        var lastname = localStorage.getItem("key");
        if(lastname != '') {
          return true;
        } else {
          return false;
        }
    }

    const checkAdmin = () => {
        const allCookie = document.cookie;
        let huhu = allCookie.split('=');
        const cook = huhu[1];
        var lastname = localStorage.getItem("key");
        if(lastname === 'admin') {
          return true;
        } else {
          return false;
        }
      }
    return (
        <>
        <IconContext.Provider value={{ color: "#fff" }}>
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
                <div className="text-white">
                    {acc}
                </div>
            </div>  
            <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                <ul className="nav-menu-items" onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {checkLogin()
                        ? <>
                        {checkAdmin()
                            ? <>
                                {SidebarDataA.map((item, key) => {
                                    return(
                                        <li key={key} className={item.cName}>
                                            <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}        
                            </>
                            : <>
                                {SidebarDataR.map((item, key) => {
                                    return(
                                        <li key={key} className={item.cName}>
                                            <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </>
                        }
                        </>
                        : <>
                        {SidebarDataU.map((item, key) => {
                            return(
                                <li key={key} className={item.cName}>
                                    <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        </>
                    }
                    
                </ul>
            </nav>
        </IconContext.Provider>
        </>
    )
}

export default Sidebar
