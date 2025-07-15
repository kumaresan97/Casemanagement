import * as React from 'react';
import { Card } from 'antd';
import styles from "./Customcard.module.scss";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor }) => {
    return (
        <Card className={styles.statCard} bordered={false} bodyStyle={{ padding: '1.2rem' }}>


            <div className={styles.inner}>
                <div className={styles.content}>
                    <div className={styles.value}>{value}</div>
                    <div className={styles.title}>{title}</div>
                </div>
                <div className={styles.icon}>{icon}</div>



            </div>
            {/* <div className={styles.inner} style={{ backgroundColor: bgColor || '#fffbe6' }}>
                <div className={styles.icon}>{icon}</div>
                <div className={styles.content}>
                    <div className={styles.value}>{value}</div>
                    <div className={styles.title}>{title}</div>
                </div>
            </div> */}
        </Card>
    );
};

export default StatCard;
