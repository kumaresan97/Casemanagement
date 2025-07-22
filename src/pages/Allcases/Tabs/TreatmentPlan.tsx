/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from "react"
import styles from "../Case.module.scss"
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
import { useParams } from "react-router-dom";
import { addTreatmentPlan, getDiagnosticCode, loadDataByCaseId, updateTreatmentPlan } from "../../../Service/AllCases/AllCaseService";
import { DiagnosticCode, ITreatmentPlan } from "../../../Types/Type";
import { useState } from "react";
import CustomButton from "../../../Components/Button/CustomButton";
import Loader from "../../../Components/Spinner/Loader";
const TreatmentPlans = () => {

    const [diagnoses, setDiagnoses] = useState<DiagnosticCode[]>([])
    const [existingItemId, setExistingItemId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // renamed to camelCase

    const [formData, setFormData] = useState<ITreatmentPlan>({
        ID: null,
        BehavioralDefinition: "",
        TreatmentDuration: "",
        InitiationDate: "",
        ReferralService: "",
        AppointmentsFrequency: "",
        TreatmentModality: [],
        CaseId: null
    });

    const { id } = useParams()
    // const init = async () => {
    //     setisLoading(true)
    //     const TPlans = await loadDataByCaseId(Number(id))
    //     const Diagonstic = await getDiagnosticCode(Number(id))
    //     Diagonstic && setDiagnoses(Diagonstic)
    //     TPlans && setFormData(TPlans)
    //     if (TPlans) {
    //         setExistingItemId(TPlans.ID || null);

    //     }
    //     else {
    //         setExistingItemId(null);

    //     }
    //     setisLoading(false)

    // }

    // const handleChange = (field: keyof ITreatmentPlan, value: any) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [field]: value,
    //     }));
    // };

    // const handleSubmit = async () => {
    //     //   const { isValid, errors } = validateTreatmentPlan(formData);
    //     //   if (!isValid) {
    //     //     console.warn(errors);
    //     //     return;
    //     //   }
    //     setisLoading(true)

    //     if (existingItemId) {
    //         await updateTreatmentPlan(existingItemId, formData, setisLoading);
    //         await init()


    //     } else {
    //         await addTreatmentPlan(formData, Number(id), setisLoading);
    //         await init()

    //     }
    // };



    const init = async () => {
        try {
            setIsLoading(true);
            const TPlans = await loadDataByCaseId(Number(id));
            const Diagonstic = await getDiagnosticCode(Number(id));
            if (Diagonstic) setDiagnoses(Diagonstic);
            if (TPlans) {
                setFormData(TPlans);
                setExistingItemId(TPlans.ID || null);
            } else {
                setExistingItemId(null);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof ITreatmentPlan, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        // const { isValid, errors } = validateTreatmentPlan(formData);
        // if (!isValid) return;

        try {
            setIsLoading(true);

            if (existingItemId) {
                await updateTreatmentPlan(existingItemId, formData); // Remove setIsLoading from inside
            } else {
                await addTreatmentPlan(formData, Number(id));
            }

            await init(); // Refresh after submit
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        init()
    }, [])
    return (

        <>
            {isLoading ? <Loader></Loader> :

                <div className={styles.treatmentPlansWrapper}>
                    {/* Diagnostics Section */}
                    <div className={styles.diagnosisSection}>
                        <label className={styles.sectionLabel}>Diagnostics Impressions</label>
                        <div className={styles.diagnosisList}>
                            {diagnoses.map((diag, index) => (
                                <div key={index} className={styles.diagnosisItem}>
                                    {diag?.DCode}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.rowContainer}>

                        <div className={styles.columns}>
                            <TextAreaField label="Behavioral Definition" rows={4} disableWrapper
                                value={formData?.BehavioralDefinition}
                                onChange={(val) => {
                                    handleChange("BehavioralDefinition", val)

                                }}
                            />



                        </div>
                        <div className={styles.columns}>
                            <div style={{ display: "flex", flexDirection: "column" }}>


                                <InputField label="Expected Length of Treatment" disableWrapper

                                    value={formData?.TreatmentDuration}
                                    onChange={(val) => {
                                        handleChange("TreatmentDuration", val)

                                    }}
                                />
                                <DatePickerField label="Initiation Date" disableWrapper

                                    value={formData?.InitiationDate || ""}
                                    onChange={(val) => {
                                        handleChange("InitiationDate", val)

                                    }}

                                />

                            </div>









                        </div>
                        <div className={styles.columns}>

                            <CheckpointGroup
                                label="Treatment Modality"
                                options={["Suicide", "Violence", "Physical abuse", "Sexual abuse"]}
                                onChange={(val) => handleChange("TreatmentModality", val)}
                                multiple
                                value={formData.TreatmentModality}
                                direction="vertical"
                            />


                        </div>
                    </div>

                    <div className={styles.rowContainer}>


                        <div className={styles.columns}>

                            <TextAreaField label="Referral for Additional Services"
                                rows={4} disableWrapper

                                value={formData?.ReferralService}
                                onChange={(val) => {
                                    handleChange("ReferralService", val)

                                }}

                            />
                        </div>
                        <div className={styles.columns}>

                            <InputField label="Appointments Frequency" disableWrapper

                                value={formData?.AppointmentsFrequency}
                                onChange={(val) => {
                                    handleChange("AppointmentsFrequency", val)

                                }}

                            />

                        </div>
                    </div>
                    <div className={styles.footer}>
                        <CustomButton label="Submit" type="primary" onClick={handleSubmit} bgColor="#b78e1a" color="#fff" />

                    </div>








                </div>


            }
        </>
    )
}
export default TreatmentPlans;