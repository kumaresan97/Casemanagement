/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import * as React from 'react';
import styles from "./Headerstyle.module.scss";
const Logo = require("../../assets/png/Logo.png")
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector } from 'react-redux';


const Topbar: React.FC = () => {


    const currentUserDetails = useSelector(
        (state: any) => state?.data?.currentUserDetails
    );
    console.log("currentUserDetails", currentUserDetails); return (
        // <div className={styles.topbar}>
        //     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        //         <img src={Logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
        //         <span style={{ fontSize: "16px", fontWeight: "500" }}>Mystis cares</span>

        //     </div>


        // </div>


        <div className={styles.topbar}>
            <div className={styles.left}>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <h2 className={styles.title}>Mysti's cares</h2>
            </div>

            {/* <div className={styles.right}>
                <div className={styles.notification}>
                    <NotificationsIcon />
                    <span className={styles.dot} />
                </div>

                <div className={styles.profile}>
                    <div className={styles.info}>
                        <span className={styles.name}>Veronica</span>
                        <span className={styles.role}>Eligibility specialist</span>
                    </div>
                    <img
                        src={Logo}
                        alt="User"
                        className={styles.avatar}
                    />
                    <KeyboardArrowDownIcon />
                </div>
            </div> */}
        </div>
    );
};

export default Topbar;
