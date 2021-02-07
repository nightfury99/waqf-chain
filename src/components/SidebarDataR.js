import React from 'react';
// import * as FaIcons from "react-icons/fa";
import * as AiIcons from 'react-icons/ai';
import * as biIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';


export const SidebarDataR = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "View",
        path: "/waqf-events",
        icon: <biIcons.BiDonateHeart />,
        cName: "nav-text"
    },
    {
        title: "Track",
        path: "/track-waqf",
        icon: <HiIcons.HiLocationMarker />,
        cName: "nav-text"
    },
    {
        title: "Logout",
        path: "/sign-out",
        icon: <biIcons.BiLogOut />,
        cName: "nav-text"
    }
]
