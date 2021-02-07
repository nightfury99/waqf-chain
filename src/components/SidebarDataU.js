import React from 'react';
// import * as FaIcons from "react-icons/fa";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';

export const SidebarDataU = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "View",
        path: "/waqf-events",
        icon: <BiIcons.BiDonateHeart />,
        cName: "nav-text"
    },
    {
        title: "Register",
        path: "/sign-up",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text"
    },
    {
        title: "Login",
        path: "/sign-in",
        icon: <RiIcons.RiLoginBoxFill />,
        cName: "nav-text"
    }
]
