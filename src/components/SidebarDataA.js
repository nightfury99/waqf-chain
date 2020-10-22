import React from 'react';
import * as HiIcons from "react-icons/hi";
import * as AiIcons from 'react-icons/ai';
import * as biIcons from 'react-icons/bi';

export const SidebarDataA = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "Create",
        path: "/create-waqf",
        icon: <HiIcons.HiDocumentAdd />,
        cName: "nav-text"
    },
    {
        title: "Update",
        path: "/update-waqf",
        icon: <HiIcons.HiDocument />,
        cName: "nav-text"
    },
    {
        title: "View",
        path: "/waqf-events",
        icon: <biIcons.BiDonateHeart />,
        cName: "nav-text"
    },
    {
        title: "Logout",
        path: "/sign-out",
        icon: <biIcons.BiLogOut />,
        cName: "nav-text"
    }   
]
