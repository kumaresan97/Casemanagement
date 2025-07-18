/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react"
import { useState } from "react";
import styles from "../Case.module.scss"
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import SelectField from "../../../Components/Formfields/Dropdown/CustomDropdown";
import { Avatar, Button, Tag, } from "antd";
import PeoplePickerField from "../../../Components/Formfields/PeoplePicker/CustomPeoplePicker";
// import { useSelector } from "react-redux";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
// import PeoplePickerField from "../../../Components/Formfields/PeoplePicker/CustomPeoplePicker";
// import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import { setSelectedCase } from "../../../redux/feauture/dataSlicer";
import { getAllCases, UpdatecaseInfo } from "../../../Service/AllCases/AllCaseService";
import { useParams } from "react-router-dom";
import { cases } from "../../../Types/Type";
import moment from "moment";
import { Cases } from "../../../config/constants";


const CaseInfo = () => {

    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<cases>(Cases)
    const Context = useSelector((state: any) => state.data.value)
    const selectedCase = useSelector((state: any) => state.data.selectedCase);

    const dispatch = useDispatch();

    const fetchAndStoreCase = async (id: number) => {
        const result = await getAllCases(id);
        setFormData(result[0])
        console.log("result: ", result);
        if (result?.length > 0) {
            setFormData(result[0])

            dispatch?.(setSelectedCase(result[0]));
        }
    };
    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        UpdatecaseInfo(Number(id), formData)
        console.log('Saving...', formData);
        // Call API here
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setFormData(selectedCase)
        // setFormData(caseData); // Reset form
        setIsEditMode(false);
    };


    React.useEffect(() => {
        fetchAndStoreCase(Number(id))

    }, [id])




    return (


        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.leftSection}>
                    <div className={styles.row}>
                        <div className={styles.left}>Case Name</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <InputField value={formData?.CaseName}
                                    disableWrapper
                                    onChange={(val) => handleChange("CaseName", val)}

                                />
                            ) : <span>{formData?.CaseName}</span>}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.left}>Date</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <DatePickerField
                                    label=""
                                    value={moment(formData?.Date).format("MM/DD/YYYY")}
                                    disableWrapper
                                    onChange={(val) => handleChange("Date", val)}
                                />
                            ) : (
                                <span>{formData?.Date || "—"}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.left}>BillableType</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <SelectField
                                    disableWrapper
                                    value={formData?.BillableType}
                                    options={[
                                        { label: "Billable", value: "Billable" },
                                        { label: "Non-billable", value: "Non-billable" }
                                    ]}
                                    onChange={(val) => handleChange("BillableType", val)}
                                />
                            ) : (
                                <span>{formData?.BillableType?.value || null}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.row}>
                        <div className={styles.left}>ServiceType</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <SelectField
                                    disableWrapper
                                    multiple
                                    value={formData?.CCServiceType}
                                    onChange={(val) => handleChange("CCServiceType", val)}
                                    // options={caseData.ServiceType}
                                    options={[
                                        { label: "H2025", value: "H2025" },
                                        { label: "H0043", value: "H0043" },
                                    ]}
                                />
                            ) : Array.isArray(formData?.CCServiceType) &&
                                formData.CCServiceType.length > 0 ? (
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {formData.CCServiceType.map((s, idx) => (
                                        <Tag
                                            key={idx}
                                            color="gold"
                                            style={{
                                                maxWidth: 100, // or your desired width (e.g. 120)
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                display: 'inline-block',
                                            }}
                                            title={s.label} // shows full text on hover
                                        >
                                            {s.label}
                                        </Tag>
                                    ))}
                                </div>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.left}>CaseManager</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <PeoplePickerField

                                    defaultUsers={formData.CCaseManager?.email ? [formData.CCaseManager.email] : []}
                                    context={Context}
                                    onChange={(val) => handleChange("CCaseManager", val)}
                                />
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Avatar
                                        size="small"
                                        src={`/_layouts/15/userphoto.aspx?size=S&username=${formData?.CCaseManager?.email ?? ""}`}
                                    />
                                    <span>{formData?.CCaseManager?.name || "—"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.left}>Description</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <TextAreaField
                                    rows={4}
                                    disableWrapper
                                    value={formData?.Description}
                                    onChange={(val) => handleChange("Description", val)}
                                />
                            ) : (
                                <span>{formData?.Description || "—"}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div >
                {isEditMode ? (
                    <>
                        <Button type="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditMode(true)}>Edit</Button>
                )}
            </div>
        </div>





    );

}
export default CaseInfo;