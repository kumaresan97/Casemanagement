/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import StatCard from '../../Components/Card/Customcard';
const Totalcase: any = require("../../assets/png/Totalcase.png");
const Resolved: any = require("../../assets/png/Resolved.png")
// const Client = require("../../assets/png/Clients.png")
// const Week = require("../../assets/png/Week.png")
// const Opencase = require("../../assets/png/Opencase.png")

const Dashboard: React.FC = () => {
    return (

        <>
            <h3>Dashboard</h3>

            <p style={{
                color: "#ccc", fontSize: "14px", marginBottom: "8px", fontWeight: "500"
            }}>Good morning ,Veronical</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <StatCard
                    title="Total Cases"
                    value={54}
                    icon={<img src={Totalcase} alt="cases" />}
                />
                <StatCard
                    title="Clients"
                    value={20}
                    icon={<img src={Resolved} alt="clients" />}
                />
            </div>
        </>
    );
}
export default Dashboard