/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { message, Tabs } from 'antd';
import styles from "./CustomTab.module.scss"
import { useLocation, useNavigate, Outlet, useParams } from 'react-router-dom';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import { getChoiceDropdownOptions } from '../../Service/getChoice';
import { Cases, constants } from '../../config/constants';
import { cases, SelectOption } from '../../Types/Type';
import { getAllCases, UpdatecaseInfo } from '../../Service/AllCases/AllCaseService';
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
    const { id } = useParams()
    console.log("id: ", id);

    const [StatusOption, setStatusOption] = React.useState<SelectOption[]>([])
    const [SelectStatus, setSelectStatus] = React.useState<SelectOption>({ label: "", value: "" })
    const [selectCases, setSelectCases] = React.useState<cases>(Cases)

    // Extract the current tab key from the URL
    const pathParts = location.pathname.split('/');
    console.log("pathParts: ", pathParts);
    const activeKey = pathParts[pathParts.length - 1];

    const handleTabChange = (key: string) => {
        const id = pathParts[2]; // e.g., AllCases/:id/case-info
        navigate(`/AllCases/${id}/${key}`);
    };
    const init = async () => {
        const Status = await getChoiceDropdownOptions("Status", constants.Listnames.CaseDetails);
        const SelectCases = await getAllCases(Number(id))

        if (Status) { setStatusOption(Status) }

        if (SelectCases) {
            setSelectStatus(SelectCases[0]?.Status ?? { label: "", value: "" });
            setSelectCases(SelectCases[0])

        }
        console.log("Status: ", Status);

    }


    React.useEffect(() => {
        console.log("render again and again for tab")
        init()
    }, [])

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
                    <p>{selectCases.CaseName ?? null}</p>
                </div>
                <div style={{ width: "250px" }}>
                    <SelectField options={StatusOption}
                        value={SelectStatus}
                        onChange={async (val) => {
                            setSelectStatus(val)


                            if (selectCases?.Id) {

                                await UpdatecaseInfo(Number(selectCases?.Id), val?.value, true)
                                message.success("status updated successfully")


                            }

                        }} />
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
