import *  as React from 'react';
import styles from './Loader.module.scss';

interface CustomLoaderProps {
    message?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ message = "Loading..." }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.pulse}></div>
                <p className={styles.message}>{message}</p>
            </div>
        </div>
    );
};

export default CustomLoader;
