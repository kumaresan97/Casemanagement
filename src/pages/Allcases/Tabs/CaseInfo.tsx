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
import { cases, SelectOption } from "../../../Types/Type";
import moment from "moment";
import { Cases, constants } from "../../../config/constants";
import { validateStep } from "../../../utils/ValidateStep";
import CustomButton from "../../../Components/Button/CustomButton";
import { getServicetype } from "../../../Service/getServicetype";


const CaseInfo = () => {

    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<cases>(Cases)
    const Context = useSelector((state: any) => state.data.value)
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof cases, string>>>({});
    const selectedCase = useSelector((state: any) => state.data.selectedCase);
    const [serviceType, setServiceType] = useState<SelectOption[]>([])

    const dispatch = useDispatch();

    const fetchAndStoreCase = async (id: number) => {
        const serviceType = await getServicetype(constants.Listnames.ServiceType)

        const result = await getAllCases(id);
        // setFormData(result[0])
        console.log("result: ", result);
        setServiceType(serviceType)
        if (result?.length > 0) {
            setFormData(result[0])

            dispatch?.(setSelectedCase(result[0]));
        }
    };
    const handleChange = <K extends keyof cases>(

        key: K,
        value: cases[K]
    ) => {
        // const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
        debugger;
        setFormErrors((prevErrors) => {
            const updated = { ...prevErrors };
            delete updated[key];
            return updated;
        });
    };


    const steps = [
        {
            title: 'Client Details',
            component: "",
            requiredFields: ['CaseName', 'ServiceType', 'CaseManager', 'Description', 'Date'],
        },]

    const handleSave = async () => {
        const { valid, fieldErrors } = validateStep(0, steps, formData);
        console.log("fieldErrors: ", fieldErrors);


        if (!valid) {
            setFormErrors(fieldErrors);
            return;
        }


        await UpdatecaseInfo(Number(id), formData)
        dispatch?.(setSelectedCase(formData));

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

            <div className={styles.header}>
                {!isEditMode && (
                    <Button onClick={() => setIsEditMode(true)}>Edit</Button>
                )}
            </div>
            <div className={styles.wrapper}>
                <div className={styles.leftSection} style={{ gap: isEditMode ? 0 : 15 }}>
                    <div className={styles.row}>
                        <div className={styles.left}>Case Name</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <InputField value={formData?.CaseName}
                                    disableWrapper
                                    onChange={(val) => handleChange("CaseName", val)}
                                    error={formErrors.CaseName}

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
                                    error={formErrors.Date}

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
                                    error={formErrors.BillableType}

                                />
                            ) : (
                                <span>{formData?.BillableType?.value || null}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection} style={{ gap: isEditMode ? 0 : 15 }}>
                    <div className={styles.row}>
                        <div className={styles.left}>ServiceType</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <SelectField
                                    disableWrapper
                                    multiple
                                    value={formData?.ServiceType}
                                    onChange={(val) => handleChange("ServiceType", val)}
                                    options={serviceType}
                                    // options={[
                                    //     { label: "H2025", value: "H2025" },
                                    //     { label: "H0043", value: "H0043" },
                                    // ]}
                                    error={formErrors.ServiceType}

                                />
                            ) : Array.isArray(formData?.ServiceType) &&
                                formData.ServiceType.length > 0 ? (
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {formData.ServiceType.map((s, idx) => (
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

                                    defaultUsers={formData.CaseManager?.email ? [formData.CaseManager.email] : []}
                                    context={Context}
                                    onChange={(val: any) => handleChange("CaseManager", val[0])}
                                    error={formErrors.CaseManager}

                                />
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Avatar
                                        size="small"
                                        src={`/_layouts/15/userphoto.aspx?size=S&username=${formData?.CaseManager?.email ?? ""}`}
                                    />
                                    <span>{formData?.CaseManager?.name || "—"}</span>
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
                                    error={formErrors.Description}

                                />
                            ) : (
                                <span>{formData?.Description || "—"}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isEditMode && (
                <div className={styles.footer}>
                    <CustomButton type="primary" label="Save" onClick={handleSave} bgColor="#b78e1a" />

                    <CustomButton label="Cancel" onClick={handleCancel} />

                    {/* <Button onClick={handleCancel}>Cancel</Button> */}
                </div>
            )}

        </div>





    );

}
export default CaseInfo;