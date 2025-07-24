/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { message } from "antd";
import * as React from "react"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../../../Components/Button/CustomButton";
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
import SelectField from "../../../Components/Formfields/Dropdown/CustomDropdown";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import ReusableModal from "../../../Components/Modal/CustomModal";
import Loader from "../../../Components/Spinner/Loader";
import CommonTable from "../../../Components/Table/CustomTable";
import { addRiskAssessment, getDiagnosticCode, getRiskAssessment, handleAddDiagnostic, updateRiskAssessment } from "../../../Service/AllCases/AllCaseService";
import { DiagnosticCode, IRiskAssessment } from "../../../Types/Type";
import styles from "../Case.module.scss"





export const initialFormData: DiagnosticCode = {
    ID: null,
    DCode: '',
    Description: '',
    Classification: { label: "", value: "" },
    BillableType: { label: "", value: "" },
    CaseId: null
};



const DiagnosticsCode = () => {
    // const { id } = useParams()

    // const [isopen, setIsopen] = useState<boolean>(false)
    // const [isEdit, setisEdit] = useState<boolean>(false)

    // const [DiagonsticCodes, setDiagonsticCodes] = useState<DiagnosticCode[]>([])
    // console.log("DiagonsticCodes: ", DiagonsticCodes);
    // const [formData, setFormData] = useState(initialFormData)
    // const [Diagnostcitems, SetDiagnostcitems] = useState<IRiskAssessment>({
    //     ID: null,
    //     PresentingProblem: "",
    //     ClientIntakeDate: "",
    //     DiagnosticsDate: "",
    //     Observations: "",
    //     PertinentHistory: "",
    //     FamilyPsychosocialAssessment: "",
    //     Strengths: "",
    //     RiskExplanation: "",
    //     ContractSafteyPlan: "",
    //     SafteyPlanExplanation: "",
    //     TentativeGoalsAndPlans: "",
    //     RiskIndicators: [],
    //     CaseId: null,
    // });

    // const [existingItemId, setExistingItemId] = useState<number | null>(null);

    // console.log("setFormData: ", setFormData);

    // const [formErrors, setFormErrors] = useState<DiagnosticCode | any>({});

    // const diagnosticTableColumns = [
    //     {
    //         title: "Diagnostic codes",
    //         dataIndex: "DCode",
    //         key: "DCode",
    //     },
    //     {
    //         title: "Classification",
    //         dataIndex: "Classification",
    //         key: "Classification",
    //         render: (_: any, item: any) => (




    //             <span>{item?.Classification?.value}</span>
    //         )
    //     },
    //     {
    //         title: "BillableType",
    //         dataIndex: "BillableType",
    //         key: "BillableType",
    //         render: (_: any, item: any) => (
    //             <span>{item?.BillableType?.value}</span>
    //         )
    //     },
    //     {
    //         title: "Description",
    //         dataIndex: "Description",
    //         key: "Description",
    //         ellipsis: true,
    //     },
    //     {
    //         title: "",
    //         dataIndex: "action",
    //         key: "action",
    //         render: (_: any, record: any) => (
    //             <span style={{ color: "green", cursor: "pointer" }} onClick={() => {


    //                 setFormData(record)
    //                 setisEdit(true)
    //                 setIsopen(true)

    //             }
    //             }>
    //                 ✏️
    //             </span>
    //         ),
    //     },
    // ];

    // const handleChange = <K extends keyof DiagnosticCode>(
    //     key: K,
    //     value: DiagnosticCode[K]
    // ) => {
    //     setFormData((prev) => ({ ...prev, [key]: value }));

    //     // Clear error if the field now has a value
    //     if (formErrors[key]) {
    //         setFormErrors((prev: DiagnosticCode) => {
    //             const updated = { ...prev };
    //             delete updated[key];
    //             return updated;
    //         });
    //     }
    // };
    // const validateForm = (formData: DiagnosticCode) => {
    //     const errors: Partial<Record<keyof DiagnosticCode, string>> = {};

    //     if (!formData.DCode.trim()) errors.DCode = 'Title is required';
    //     if (!formData.Description.trim()) errors.Description = 'Description is required';
    //     if (!formData.Classification) errors.Classification = 'Select Classification';
    //     if (!formData.BillableType) errors.BillableType = 'Select Billable Type';

    //     return errors;
    // };
    // const handleChangeDitem = async (field: keyof IRiskAssessment, value: any) => {
    //     SetDiagnostcitems(prev => ({ ...prev, [field]: value }));
    // }

    // const handleSubmit = async () => {
    //     const errors = validateForm(formData);
    //     setFormErrors(errors);
    //     if (Object.keys(errors).length > 0) return;
    //     await handleAddDiagnostic(
    //         formData,
    //         setFormData,
    //         setIsopen,
    //         initialFormData,
    //         Number(id),
    //         setDiagonsticCodes,
    //         DiagonsticCodes
    //     );


    //     // await handleAddDiagnostic(formData, setFormData, setIsopen, initialFormData, Number(id))

    // };

    // const handleDItems = async () => {
    //     //   const { isValid, errors } = validateRiskAssessment(formData);

    //     //   if (!isValid) {
    //     //     console.warn("Validation failed", errors);
    //     //     // Optionally display errors
    //     //     return;
    //     //   }

    //     try {
    //         if (existingItemId) {
    //             await updateRiskAssessment(existingItemId, Diagnostcitems);
    //             await init()
    //         } else {
    //             await addRiskAssessment(Diagnostcitems, Number(id));
    //             await init()

    //         }
    //     } catch (err) {
    //         console.error("Submit failed:", err);
    //     }
    // };

    // const init = async () => {
    //     let Diagnostcitems = await getDiagnosticCode(Number(id))
    //     const DItems = await getRiskAssessment(Number(id))
    //     Diagnostcitems && setDiagonsticCodes(Diagnostcitems)


    //     if (DItems) {
    //         SetDiagnostcitems(DItems);
    //         setExistingItemId(DItems.ID || null);
    //     } else {
    //         setExistingItemId(null);
    //     }
    // }
    // React.useEffect(() => {

    //     init()


    // }, [id])





    const { id } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false); // for loader

    const [diagnosticCodes, setDiagnosticCodes] = useState<DiagnosticCode[]>([]);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof DiagnosticCode, string>>>({});
    const [formData, setFormData] = useState<DiagnosticCode>(initialFormData);

    const [diagnosticItems, setdiagnosticItems] = useState<IRiskAssessment>({
        ID: null,
        PresentingProblem: "",
        ClientIntakeDate: null,
        DiagnosticsDate: null,
        Observations: "",
        PertinentHistory: "",
        FamilyPsychosocialAssessment: "",
        Strengths: "",
        RiskExplanation: "",
        ContractSafteyPlan: "",
        SafteyPlanExplanation: "",
        TentativeGoalsAndPlans: "",
        RiskIndicators: [],
        CaseId: null,
    });

    const [existingItemId, setExistingItemId] = useState<number | null>(null);

    // 📌 Table Columns
    const diagnosticTableColumns = [
        {
            title: "Diagnostic codes",
            dataIndex: "DCode",
            key: "DCode",
        },
        {
            title: "Classification",
            dataIndex: "Classification",
            key: "Classification",
            render: (_: any, item: any) => <span>{item?.Classification?.value}</span>,
        },
        {
            title: "BillableType",
            dataIndex: "BillableType",
            key: "BillableType",
            render: (_: any, item: any) => <span>{item?.BillableType?.value}</span>,
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
            ellipsis: true,
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: any) => (
                <span
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() => {
                        setFormData(record);
                        setIsEdit(true);
                        setIsOpen(true);
                    }}
                >
                    ✏️
                </span>
            ),
        },
    ];

    // 📥 Form field change
    const handleChange = <K extends keyof DiagnosticCode>(key: K, value: DiagnosticCode[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (formErrors[key]) {
            setFormErrors(prev => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        }
    };

    // 🛡️ Risk assessment field change
    const handleChangeDiagnosticItem = (field: keyof IRiskAssessment, value: any) => {
        setdiagnosticItems(prev => ({ ...prev, [field]: value }));
    };

    // ✅ Validation
    const validateForm = (data: DiagnosticCode) => {
        const errors: Partial<Record<keyof DiagnosticCode, string>> = {};
        if (!data.DCode.trim()) errors.DCode = "Title is required";
        if (!data.Description.trim()) errors.Description = "Description is required";
        if (!data.Classification?.value) errors.Classification = "Select Classification";
        if (!data.BillableType?.value) errors.BillableType = "Select Billable Type";
        return errors;
    };

    // 💾 Submit diagnostic code
    const handleSubmit = async () => {
        const errors = validateForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            setLoading(true);
            await handleAddDiagnostic(
                formData,
                setFormData,
                setIsOpen,
                initialFormData,
                Number(id),
                setDiagnosticCodes,
                diagnosticCodes
            );
            message.success("Diagnostic Code saved successfully!");
        } catch (err) {
            message.error("Failed to save Diagnostic Code");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 💾 Submit risk assessment
    const handleDiagnostic = async () => {
        try {
            setLoading(true);
            if (existingItemId) {
                await updateRiskAssessment(existingItemId, diagnosticItems);
                message.success("Diagnostic item updated");
            } else {
                await addRiskAssessment(diagnosticItems, Number(id));
                message.success("Diagnostic item added");
            }
            await init();
        } catch (err) {
            message.error("Failed to save Risk Assessment");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 Initial data load
    const init = async () => {
        try {
            setLoading(true);
            const diagnostics = await getDiagnosticCode(Number(id));
            const assessment = await getRiskAssessment(Number(id));

            if (diagnostics) setDiagnosticCodes(diagnostics);
            if (assessment) {
                setdiagnosticItems(assessment);
                setExistingItemId(assessment.ID || null);
            } else {
                setExistingItemId(null);
            }
        } catch (err) {
            message.error("Failed to load initial data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ⏳ useEffect for init
    useEffect(() => {
        if (id) init();
    }, [id]);


    return (

        <>
            {loading ? <Loader /> :
                <>

                    <div className={styles.pageWrapper}>

                        <div className={styles.scrollBody}>

                            <div className={styles.Diagonsticcontainer}>

                                <div>
                                    <CustomButton type="primary" label="Add Diagonstic" bgColor="#b78e1a" color="#fff" borderRadius={10} onClick={() => {

                                        setFormData(initialFormData)

                                        setIsOpen(true)
                                    }} />
                                </div>
                                <CommonTable
                                    columns={diagnosticTableColumns}
                                    data={diagnosticCodes}
                                    // data={DiagonsticCodes}
                                    onRowClick={(record) => console.log('Row clicked:', record)}
                                />

                                <div className={styles.row}>
                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Presenting Problem</p>
                                        <TextAreaField label="Client's initial explanation of the problem(s), duration and precipitant cause" rows={4} disableWrapper
                                            value={diagnosticItems.PresentingProblem}
                                            onChange={(val) => handleChangeDiagnosticItem("PresentingProblem", val)}

                                        />
                                    </div>

                                    <div className={styles.halfWidth}>
                                        <DatePickerField label="Client intake date" disableWrapper

                                            value={diagnosticItems.ClientIntakeDate ?? null}
                                            onChange={(val) => handleChangeDiagnosticItem("ClientIntakeDate", val)}

                                        />
                                        <DatePickerField label="Diagnostics date" disableWrapper
                                            value={diagnosticItems.DiagnosticsDate ?? null}
                                            onChange={(val) => handleChangeDiagnosticItem("DiagnosticsDate", val)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Observations</p>
                                        <TextAreaField label="Therapist’s observations of client’s presentation and family interactions:" rows={4} disableWrapper

                                            value={diagnosticItems.Observations}
                                            onChange={(val) => handleChangeDiagnosticItem("Observations", val)}


                                        />
                                    </div>
                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Pertinent History</p>
                                        <TextAreaField label="Any prior therapy (including family, social, psychological, and medical):" rows={4} disableWrapper
                                            value={diagnosticItems.PertinentHistory}
                                            onChange={(val) => handleChangeDiagnosticItem("PertinentHistory", val)}

                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>

                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Family Psychosocial/Assessment</p>
                                        <TextAreaField label="The family or psychosocial assessment:" rows={4} disableWrapper
                                            value={diagnosticItems.FamilyPsychosocialAssessment}
                                            onChange={(val) => handleChangeDiagnosticItem("FamilyPsychosocialAssessment", val)}

                                        />
                                    </div>

                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Strengths</p>
                                        <TextAreaField label="Client/family strengths (including support system(s)):" rows={4} disableWrapper value={diagnosticItems.Strengths}
                                            onChange={(val) => handleChangeDiagnosticItem("Strengths", val)}


                                        />
                                    </div>
                                </div>

                                {/* <div className={styles.row}>
                    <div className={styles.halfWidth}>
                        <p className={styles.subLabel}>Presenting Problem</p>
                        <TextAreaField label="Client's initial concern" rows={4} disableWrapper 

                        value={Diagnostcitems.Strengths}
                        onChange={(val)=>handleChangeDiagnosticItem("Strengths",val)}
                        
                        />
                    </div>
                    <div className={styles.halfWidth}>
                        <p className={styles.subLabel}>Presenting Problem</p>
                        <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                    </div>
                </div> */}

                                <div className={styles.row}>
                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Risk</p>
                                        <CheckpointGroup
                                            label="Evidence of potential or actual risk(S):select and explain"
                                            options={['Suicide', 'Violence', 'Physical abuse', 'Sexual abuse']}
                                            onChange={(val) => handleChangeDiagnosticItem("RiskIndicators", val)}
                                            value={diagnosticItems.RiskIndicators}
                                            multiple
                                            direction="vertical"
                                        />
                                    </div>
                                    <div className={styles.halfWidth}>
                                        <p className={styles.subLabel}>Contract Safety</p>
                                        <InputField label="Client made contract/saftey plan to conver risk?" disableWrapper
                                            value={diagnosticItems.ContractSafteyPlan}
                                            onChange={(val) => handleChangeDiagnosticItem("ContractSafteyPlan", val)}

                                        />
                                        <TextAreaField label="Explain" rows={3} disableWrapper
                                            value={diagnosticItems.SafteyPlanExplanation}
                                            onChange={(val) => handleChangeDiagnosticItem("SafteyPlanExplanation", val)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.halfWidth}>
                                        <TextAreaField label="Explanation" rows={3} disableWrapper
                                            value={diagnosticItems.RiskExplanation}
                                            onChange={(val) => handleChangeDiagnosticItem("RiskExplanation", val)}

                                        />
                                    </div>
                                    <div className={styles.halfWidth}>
                                        <TextAreaField label="Tentative client plan" rows={3} disableWrapper

                                            value={diagnosticItems.TentativeGoalsAndPlans}
                                            onChange={(val) => handleChangeDiagnosticItem("TentativeGoalsAndPlans", val)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <CustomButton
                                type="primary"
                                label="Submit"
                                bgColor="#b78e1a"
                                color="#fff"
                                borderRadius={4}
                                onClick={handleDiagnostic}
                            />
                        </div>
                    </div>
                    <>
                        <ReusableModal open={isOpen}
                            title={isEdit ? "Update Diagnostic" : "Add Diagnostic"}
                            width={600}


                            onOk={handleSubmit}
                            onCancel={() => {
                                setIsEdit(false)
                                setIsOpen(false)
                                setFormErrors({})

                                setFormData(initialFormData)
                            }}>

                            <div className={styles.formGrid}>
                                <div className={styles.leftColumn}>
                                    <InputField
                                        label="Title"
                                        value={formData.DCode}
                                        onChange={(val) => handleChange("DCode", val)}
                                        error={formErrors.DCode}
                                        required
                                    />
                                </div>
                                <div className={styles.leftColumn}>

                                    <SelectField
                                        label="Classification"
                                        options={["Primary", "Secondary", "Tertiary"].map((opt) => ({
                                            label: opt,
                                            value: opt,
                                        }))}
                                        value={formData.Classification}
                                        onChange={(val) => handleChange("Classification", val)}
                                        error={formErrors.Classification}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>

                                <div className={styles.leftColumn}>

                                    <SelectField
                                        label="Billable Type"
                                        options={[
                                            { label: "Billable", value: "Billable" },
                                            { label: "Non-billable", value: "Non-billable" },
                                        ]}
                                        value={formData.BillableType}
                                        onChange={(val) => handleChange("BillableType", val)}
                                        error={formErrors.BillableType}
                                        required
                                    />
                                </div>


                                <div className={styles.rightColumn}>
                                    <TextAreaField
                                        label="Description"
                                        value={formData.Description}
                                        onChange={(val) => handleChange("Description", val)}
                                        error={formErrors.Description}
                                        required
                                    />
                                </div>
                            </div>


                            {/* <>
                        <InputField
                            label="Title"
                            value={formData.DCode}
                            onChange={(val) => handleChange('DCode', val)}
                            error={formErrors.Title}
                            required
                        />

                        <TextAreaField
                            label="Description"
                            value={formData.Description}
                            onChange={(val) => handleChange('Description', val)}
                            error={formErrors.Description}
                            required
                        />

                        <SelectField
                            label="Classification"
                            options={['Primary', 'Secondary', 'Tertiary'].map((opt) => ({ label: opt, value: opt }))}
                            value={formData.Classification}
                            onChange={(val) => handleChange('Classification', val)}
                            error={formErrors.Classification}
                            required
                        />

                        <SelectField
                            label="Billable Type"
                            options={[
                                { label: 'Billable', value: 'Billable' },
                                { label: 'Non-billable', value: 'Non-billable' }
                            ]}
                            value={formData.BillableType}
                            onChange={(val) => handleChange('BillableType', val)}
                            error={formErrors.BillableType}
                            required
                        />



                    </> */}
                        </ReusableModal>

                    </>
                </>
            }
        </>
    )
}
export default DiagnosticsCode;