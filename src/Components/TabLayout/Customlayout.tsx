/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { Tabs } from 'antd';
import styles from "./CustomTab.module.scss"
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
const Backicon = require("../../assets/png/backicon.png")
interface TabItem {
    key: string;
    label: string;
}

interface CommonTabLayoutProps {
    title?: string;
    basePath: string; // e.g., /AllCases/:id
    tabs: TabItem[];
}

const CommonTabLayout: React.FC<CommonTabLayoutProps> = ({ title, basePath, tabs }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the current tab key from the URL
    const pathParts = location.pathname.split('/');
    const activeKey = pathParts[pathParts.length - 1];

    const handleTabChange = (key: string) => {
        const id = pathParts[2]; // e.g., AllCases/:id/case-info
        navigate(`/AllCases/${id}/${key}`);
    };

    return (

        // <div className={styles.layoutContainer}>
        //     <div className={styles.header}>
        //         <h2>{title}</h2>
        //         <SelectField />

        //     </div>
        //     <Tabs
        //         activeKey={activeKey}
        //         onChange={handleTabChange}
        //         items={tabs.map(tab => ({
        //             key: tab.key,
        //             label: tab.label,
        //         }))}
        //     />
        //     <div className={styles.content}>
        //         <Outlet />
        //     </div>
        // </div>
        <div className={styles.layoutContainer}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <img src={Backicon} alt="backicon" className={styles.backIcon} onClick={() => {
                        navigate("/AllCases")
                    }} />
                    {/* <LeftOutlined className={styles.backIcon} /> */}
                    <p>{title}</p>
                </div>
                <div style={{ width: "250px" }}>
                    <SelectField />
                </div>



            </div>

            <div className={styles.tabsWrapper}>
                <Tabs
                    // className={styles.tabs}
                    activeKey={activeKey}
                    onChange={handleTabChange}
                    items={tabs.map(tab => ({
                        key: tab.key,
                        label: tab.label,
                    }))}
                />
            </div>

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>

    );
};

export default CommonTabLayout;
