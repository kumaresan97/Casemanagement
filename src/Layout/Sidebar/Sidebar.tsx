/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
// import { Menu } from 'primereact/menu';
import { useLocation, useNavigate } from 'react-router-dom';
// import { Button } from 'primereact/button';
import styles from './Sidebar.module.scss';
import { useState } from 'react';
import CustomTooltip from '../../Components/Tooltip/CustomTooltip';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const arrowRight = require("../../assets/png/caret-right.png")
const arrowLeft = require("../../assets/png/caret-left.png")
const Sidebar = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    interface MenuItem {
        type?: "item" | "title";
        label: string;
        path?: string;
        icon?: React.ReactElement | string; // Accepts JSX like <HomeIcon />
        command?: () => void;
    }

    const menuItems: MenuItem[] = [
        {
            type: "item",
            label: 'Dashboard', icon: <HomeIcon />, path: '/', command: () => navigate('/')
        },
        {
            type: "title",
            label: "Manage Cases",
        },
        {
            type: "item",
            label: 'Create Case', icon: <AddCircleIcon />, path: '/cases/new', command: () => navigate('/cases/new')
        },
        {
            type: "item",
            label: 'All Cases', icon: <ContentCopyIcon />, path: '/AllCases', command: () => navigate('/AllCases')
        },
        {
            type: "item",
            label: 'Clients', icon: <PeopleIcon />, path: '/clients', command: () => navigate('/clients')
        },
        {
            type: "item",
            label: 'Case Manager', icon: <PersonIcon />, path: '/case-manager', command: () => navigate('/case-manager')
        },
        {
            type: "item",
            label: 'Billing Info', icon: <CreditCardIcon />, path: '/billing', command: () => navigate('/billing')
        },
        {
            type: "item",
            label: 'Appointment', icon: <CalendarTodayIcon />, path: '/appointment', command: () => navigate('/appointment')
        },
    ];
    // const menuItems = [
    //     {
    //         type: "item",
    //         label: 'Dashboard', icon: 'pi pi-home', path: '/', command: () => navigate('/')
    //     },
    //     {
    //         type: "title",
    //         label: "Manage Cases",
    //     },
    //     {
    //         type: "item",
    //         label: 'Create Case', icon: 'pi pi-plus-circle', path: '/cases/new', command: () => navigate('/cases/new')
    //     },
    //     { label: 'All Cases', icon: 'pi pi-copy', path: '/AllCases', command: () => navigate('/AllCases') },
    //     {
    //         type: "item",
    //         label: 'Clients', icon: 'pi pi-users', path: '/clients', command: () => navigate('/clients')
    //     },
    //     {
    //         type: "item",
    //         label: 'Case Manager', icon: 'pi pi-user', path: '/case-manager', command: () => navigate('/case-manager')
    //     },
    //     {
    //         type: "item",
    //         label: 'Billing Info', icon: 'pi pi-credit-card', path: '/billing', command: () => navigate('/billing')
    //     },
    //     {
    //         type: "item",
    //         label: 'Appointment', icon: 'pi pi-calendar', path: '/appointment', command: () => navigate('/appointment')
    //     },
    // ];

    return (


        <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>


            <div className={styles.sidebarheader}>
                {!collapsed && <h3>Menu</h3>}
                <div
                    className={`${styles.toggleIcon} ${collapsed ? styles.collapsed : ''}`}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <img src={arrowRight}
                        style={{ width: "20px", height: "20px" }}



                    /> : <img src={arrowLeft}
                        style={{ width: "20px", height: "20px" }}



                    />}
                </div>
            </div>
            <div className={styles.sidebarmenu}>
                {menuItems.map((item, index) => {
                    if (item.type === "title") {
                        return !collapsed ? (
                            <div key={index} className={styles.sectionTitle}>
                                {item.label}
                            </div>
                        ) : null; // ⛔️ hide title if collapsed
                    }

                    const isActive = location.pathname === item.path;

                    const content = (
                        <div
                            key={index}
                            // style={{
                            //     padding: !collapsed ? "8px 8px 8px 8px" : 0
                            // }}
                            className={`${styles.sidebaritem} ${isActive ? styles.active : ""}`}
                            onClick={item.command}
                        >
                            <span className={styles.icon}>
                                {typeof item.icon === 'string' ? <i className={item.icon}></i> : item.icon}
                            </span>

                            <span className={styles.label}>{item.label}</span>
                            {/* 
                            {typeof item.icon === 'string' ? <i className={styles.icon}></i> : item.icon}

                            {/* <span className={item.icon}></span> */}
                            {/* {!collapsed && <span>{item.label}</span>}  */}
                        </div>
                    );

                    return collapsed ? (
                        <CustomTooltip key={index} title={item.label} placement="right">
                            {content}
                        </CustomTooltip>
                    ) : (
                        content
                    );
                })}
            </div>





            {/* <div className={styles.sidebarmenu}>
                {menuItems.map((item: any, index: number) => {
                    const isActive = location.pathname === item.path;

                    const content = (
                        <div
                            key={index}
                            className={`${styles.sidebaritem} ${isActive ? styles.active : ''}`}
                            onClick={item.command}
                        >
                            <i className={item.icon}></i>
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    );

                    return collapsed ? (
                        <CustomTooltip key={index} title={item.label} placement="right">
                            {content}
                        </CustomTooltip>
                    ) : (
                        content
                    );
                })}
            </div> */}



        </div>

    );
};

export default Sidebar;
