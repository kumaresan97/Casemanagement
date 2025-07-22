/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as React from "react"
import { useState } from "react";
import { useParams } from "react-router-dom";
import CustomButton from "../../../Components/Button/CustomButton";
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
import SelectField from "../../../Components/Formfields/Dropdown/CustomDropdown";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import ReusableModal from "../../../Components/Modal/CustomModal";
import CommonTable from "../../../Components/Table/CustomTable";
import { addRiskAssessment, getDiagnosticCode, getRiskAssessment, handleAddDiagnostic, updateRiskAssessment } from "../../../Service/AllCases/AllCaseService";
import { DiagnosticCode, IRiskAssessment } from "../../../Types/Type";
import styles from "../Case.module.scss"


export const diagnosticDummyData = [
    {
        key: "1",
        code: "V60.9 (Z59.9) Unspecified Housing",
        classification: "Primary",
        billable: "Billable",
        description: "Client’s mom lives with physical disability...",
    },
    {
        key: "2",
        code: "V60.2 (Z59.6) Low Income",
        classification: "Secondary",
        billable: "Billable",
        description: "Client’s mom lives with physical disability...",
    },
    {
        key: "3",
        code: "V65.42 (Z71.41) Alcohol abuse",
        classification: "Tertiary",
        billable: "Billable",
        description: "Client’s mom lives with physical disability...",
    },
];


export const initialFormData: DiagnosticCode = {
    ID: null,
    DCode: '',
    Description: '',
    Classification: { label: "", value: "" },
    BillableType: { label: "", value: "" },
    CaseId: null
};



const DiagnosticsCode = () => {
    const [isopen, setIsopen] = useState<boolean>(false)
    const [DiagonsticCodes, setDiagonsticCodes] = useState<DiagnosticCode[]>([])
    console.log("DiagonsticCodes: ", DiagonsticCodes);
    const [formData, setFormData] = useState(initialFormData)
    const [isEdit, setisEdit] = useState<boolean>(false)
    // const[Diagnostcitems,SetDiagnostcitems]=useState()
    const [Diagnostcitems, SetDiagnostcitems] = useState<IRiskAssessment>({
        ID: null,
        PresentingProblem: "",
        ClientIntakeDate: "",
        DiagnosticsDate: "",
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

    console.log("setFormData: ", setFormData);
    const { id } = useParams()

    const [formErrors, setFormErrors] = useState<DiagnosticCode | any>({});

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
            render: (_: any, item: any) => (




                <span>{item?.Classification?.value}</span>
            )
        },
        {
            title: "BillableType",
            dataIndex: "BillableType",
            key: "BillableType",
            render: (_: any, item: any) => (
                <span>{item?.BillableType?.value}</span>
            )
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
                <span style={{ color: "green", cursor: "pointer" }} onClick={() => {


                    setFormData(record)
                    setisEdit(true)
                    setIsopen(true)

                }
                }>
                    ✏️
                </span>
            ),
        },
    ];

    const handleChange = <K extends keyof DiagnosticCode>(
        key: K,
        value: DiagnosticCode[K]
    ) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        // Clear error if the field now has a value
        if (formErrors[key]) {
            setFormErrors((prev: DiagnosticCode) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        }
    };
    const validateForm = (formData: DiagnosticCode) => {
        const errors: Partial<Record<keyof DiagnosticCode, string>> = {};

        if (!formData.DCode.trim()) errors.DCode = 'Title is required';
        if (!formData.Description.trim()) errors.Description = 'Description is required';
        if (!formData.Classification) errors.Classification = 'Select Classification';
        if (!formData.BillableType) errors.BillableType = 'Select Billable Type';

        return errors;
    };
    const handleChangeDitem = async (field: keyof IRiskAssessment, value: any) => {
        SetDiagnostcitems(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async () => {
        const errors = validateForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        await handleAddDiagnostic(
            formData,
            setFormData,
            setIsopen,
            initialFormData,
            Number(id),
            setDiagonsticCodes,
            DiagonsticCodes
        );


        // await handleAddDiagnostic(formData, setFormData, setIsopen, initialFormData, Number(id))

    };

    const handleDItems = async () => {
        //   const { isValid, errors } = validateRiskAssessment(formData);

        //   if (!isValid) {
        //     console.warn("Validation failed", errors);
        //     // Optionally display errors
        //     return;
        //   }

        try {
            if (existingItemId) {
                await updateRiskAssessment(existingItemId, Diagnostcitems);
                await init()
            } else {
                await addRiskAssessment(Diagnostcitems, Number(id));
                await init()

            }
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const init = async () => {
        let Diagnostcitems = await getDiagnosticCode(Number(id))
        const DItems = await getRiskAssessment(Number(id))
        Diagnostcitems && setDiagonsticCodes(Diagnostcitems)


        if (DItems) {
            SetDiagnostcitems(DItems);
            setExistingItemId(DItems.ID || null);
        } else {
            setExistingItemId(null);
        }
    }
    React.useEffect(() => {

        init()


    }, [id])


    return (

        <>

            <div className={styles.pageWrapper}>

                <div className={styles.scrollBody}>

                    <div className={styles.Diagonsticcontainer}>

                        <div>
                            <CustomButton type="primary" label="Add Diagonstic" bgColor="#b78e1a" color="#fff" borderRadius={10} onClick={() => {

                                setFormData(initialFormData)

                                setIsopen(true)
                            }} />
                        </div>
                        <CommonTable
                            columns={diagnosticTableColumns}
                            data={DiagonsticCodes}
                            onRowClick={(record) => console.log('Row clicked:', record)}
                        />

                        <div className={styles.row}>
                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Presenting Problem</p>
                                <TextAreaField label="Client's initial explanation of the problem(s), duration and precipitant cause" rows={4} disableWrapper
                                    value={Diagnostcitems.PresentingProblem}
                                    onChange={(val) => handleChangeDitem("PresentingProblem", val)}

                                />
                            </div>

                            <div className={styles.halfWidth}>
                                <DatePickerField label="Client intake time" disableWrapper

                                    value={Diagnostcitems.ClientIntakeDate}
                                    onChange={(val) => handleChangeDitem("ClientIntakeDate", val)}

                                />
                                <DatePickerField label="Diagnostic time" disableWrapper
                                    value={Diagnostcitems.DiagnosticsDate}
                                    onChange={(val) => handleChangeDitem("DiagnosticsDate", val)}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Observations</p>
                                <TextAreaField label="Therapist’s observations of client’s presentation and family interactions:" rows={4} disableWrapper

                                    value={Diagnostcitems.Observations}
                                    onChange={(val) => handleChangeDitem("Observations", val)}


                                />
                            </div>
                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Pertinent History</p>
                                <TextAreaField label="Any prior therapy (including family, social, psychological, and medical):" rows={4} disableWrapper
                                    value={Diagnostcitems.PertinentHistory}
                                    onChange={(val) => handleChangeDitem("PertinentHistory", val)}

                                />
                            </div>
                        </div>

                        <div className={styles.row}>

                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Family Psychosocial/Assessment</p>
                                <TextAreaField label="The family or psychosocial assessment:" rows={4} disableWrapper
                                    value={Diagnostcitems.FamilyPsychosocialAssessment}
                                    onChange={(val) => handleChangeDitem("FamilyPsychosocialAssessment", val)}

                                />
                            </div>

                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Strengths</p>
                                <TextAreaField label="Client/family strengths (including support system(s)):" rows={4} disableWrapper value={Diagnostcitems.Strengths}
                                    onChange={(val) => handleChangeDitem("Strengths", val)}


                                />
                            </div>
                        </div>

                        {/* <div className={styles.row}>
                    <div className={styles.halfWidth}>
                        <p className={styles.subLabel}>Presenting Problem</p>
                        <TextAreaField label="Client's initial concern" rows={4} disableWrapper 

                        value={Diagnostcitems.Strengths}
                        onChange={(val)=>handleChangeDitem("Strengths",val)}
                        
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
                                    onChange={(val) => handleChangeDitem("RiskIndicators", val)}
                                    value={Diagnostcitems.RiskIndicators}
                                    multiple
                                    direction="vertical"
                                />
                            </div>
                            <div className={styles.halfWidth}>
                                <p className={styles.subLabel}>Contract Safety</p>
                                <InputField label="Client made contract/saftey plan to conver risk?" disableWrapper
                                    value={Diagnostcitems.ContractSafteyPlan}
                                    onChange={(val) => handleChangeDitem("ContractSafteyPlan", val)}

                                />
                                <TextAreaField label="Explain" rows={3} disableWrapper
                                    value={Diagnostcitems.SafteyPlanExplanation}
                                    onChange={(val) => handleChangeDitem("SafteyPlanExplanation", val)}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.halfWidth}>
                                <TextAreaField label="Explanation" rows={3} disableWrapper
                                    value={Diagnostcitems.RiskExplanation}
                                    onChange={(val) => handleChangeDitem("RiskExplanation", val)}

                                />
                            </div>
                            <div className={styles.halfWidth}>
                                <TextAreaField label="Tentative client plan" rows={3} disableWrapper

                                    value={Diagnostcitems.TentativeGoalsAndPlans}
                                    onChange={(val) => handleChangeDitem("TentativeGoalsAndPlans", val)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <CustomButton
                        type="primary"
                        label="Save"
                        bgColor="#b78e1a"
                        color="#fff"
                        borderRadius={10}
                        onClick={handleDItems}
                    />
                </div>
            </div>
            <>
                <ReusableModal open={isopen}
                    title={isEdit ? "Update Diagnostic" : "Add Diagnostic"}
                    width={600}


                    onOk={handleSubmit}
                    onCancel={() => {
                        setisEdit(false)
                        setIsopen(false)
                        setFormData(initialFormData)
                    }}>

                    <div className={styles.formGrid}>
                        <div className={styles.leftColumn}>
                            <InputField
                                label="Title"
                                value={formData.DCode}
                                onChange={(val) => handleChange("DCode", val)}
                                error={formErrors.Title}
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
    )
}
export default DiagnosticsCode;