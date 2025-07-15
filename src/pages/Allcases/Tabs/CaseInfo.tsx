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
import { useSelector } from "react-redux";
const caseData = {
    Id: 101,
    CaseName: "Jerwin Clients",
    Date: "2016-09-18",
    BillableType: { label: "Billable", value: "Billable" },
    ServiceType: [
        { label: "H2025: Help with Employment or School", value: "H2025: Help with Employment or School" },
        { label: "H0043: Housing Related", value: "H0043: Housing Related" }
    ],
    CaseManager: {
        name: "Ronald",
        email: "ronald@example.com",
        id: 23
    },
    Description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
        "when an unknown printer took a galley."
};

const CaseInfo = () => {

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(caseData);
    console.log("setFormData: ", setFormData);
    const Context = useSelector((state: any) => state.data.value)


    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        console.log('Saving...', formData);
        // Call API here
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setFormData(caseData); // Reset form
        setIsEditMode(false);
    };
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

                                />
                            ) : <span>{formData?.CaseName}</span>}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.left}>Case Name</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <InputField
                                    value={formData?.Date}
                                    disableWrapper
                                    onChange={(val) => handleChange("Date", val)}
                                />
                            ) : (
                                <span>{formData?.Date || "—"}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.left}>Case Name</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <SelectField
                                    disableWrapper
                                    value={formData.BillableType}
                                    options={[
                                        { label: "Billable", value: "Billable" },
                                        { label: "Non-billable", value: "Non-billable" }
                                    ]}
                                    onChange={(val) => handleChange("BillableType", val)}
                                />
                            ) : (
                                <span>{formData?.BillableType.value || "—"}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.row}>
                        <div className={styles.left}>Description</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <SelectField
                                    disableWrapper
                                    multiple
                                    value={formData?.ServiceType}
                                    onChange={(val) => handleChange("ServiceType", val)}
                                    options={caseData.ServiceType}
                                // options={[
                                //     { label: "H2025", value: "H2025" },
                                //     { label: "H0043", value: "H0043" },
                                // ]}
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
                        <div className={styles.left}>Description</div>
                        <div className={styles.right}>
                            {isEditMode ? (
                                <PeoplePickerField

                                    context={Context}
                                    onChange={(val) => handleChange("CaseManager", val)}
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