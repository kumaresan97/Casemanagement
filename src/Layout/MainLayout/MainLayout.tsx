import * as  React from 'react';

import styles from './MainLayout.module.scss';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Header';
// import Topbar from '../Topbar/Header';

const MainLayout: React.FC = () => {
    const location = useLocation();

    // You can extend this to match more routes
    const hideSidebar = location.pathname.includes('/cases/new');
    return (
        <div className={styles.layout}>
            <Topbar />
            <div className={styles.body}>
                {!hideSidebar && <Sidebar />}
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
