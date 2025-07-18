import * as React from "react"
import styles from "../Case.module.scss"
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
const TreatmentPlans = () => {
    const diagnoses = [
        "V60.9 (Z59.9) Unspecified Housing",
        "V60.2 (Z59.6) Low Income",
        "V65.42 (Z71.41) Alcohol abuse"
    ];
    return (
        <div className={styles.treatmentPlansWrapper}>
            {/* Diagnostics Section */}
            <div className={styles.diagnosisSection}>
                <label className={styles.sectionLabel}>Diagnostics Impressions</label>
                <div className={styles.diagnosisList}>
                    {diagnoses.map((diag, index) => (
                        <div key={index} className={styles.diagnosisItem}>
                            {diag}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.rowContainer}>

                <div className={styles.columns}>
                    <TextAreaField label="Behavioral Definition" rows={4} disableWrapper />



                </div>
                <div className={styles.columns}>
                    <div style={{ display: "flex", flexDirection: "column" }}>


                        <InputField label="Expected Length of Treatment" disableWrapper />
                        <DatePickerField label="Initiation Date" disableWrapper />

                    </div>









                </div>
                <div className={styles.columns}>

                    <CheckpointGroup
                        label="Treatment Modality"
                        options={["Suicide", "Violence", "Physical abuse", "Sexual abuse"]}
                        onChange={(val) => console.log(val, "val")}
                        multiple
                        direction="vertical"
                    />


                </div>
            </div>

            <div className={styles.rowContainer}>


                <div className={styles.columns}>

                    <TextAreaField label="Referral for Additional Services"
                        rows={4} disableWrapper />
                </div>
                <div className={styles.columns}>

                    <InputField label="Appointments Frequency" disableWrapper />

                </div>
            </div>





        </div>
    )
}
export default TreatmentPlans;