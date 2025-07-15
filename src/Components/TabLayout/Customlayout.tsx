import * as React from 'react';
import { Tabs } from 'antd';
import styles from "./Tabs.module.scss"
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import SelectField from '../Formfields/Dropdown/CustomDropdown';

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

        <div className={styles.layoutContainer}>
            <div className={styles.header}>
                <h2>{title}</h2>
                <SelectField />

            </div>
            <Tabs
                activeKey={activeKey}
                onChange={handleTabChange}
                items={tabs.map(tab => ({
                    key: tab.key,
                    label: tab.label,
                }))}
            />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>

        // <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: 8 }}>
        //     {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
        //     <Tabs
        //         activeKey={activeKey}
        //         onChange={handleTabChange}
        //         items={tabs.map(tab => ({
        //             key: tab.key,
        //             label: tab.label,
        //         }))}
        //     />
        //     <div style={{ marginTop: 24 }}>
        //         <Outlet />
        //     </div>
        // </div>
    );
};

export default CommonTabLayout;
