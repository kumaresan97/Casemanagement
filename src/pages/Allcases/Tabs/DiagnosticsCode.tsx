import * as React from "react"
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
import InputField from "../../../Components/Formfields/Textfield/CustomTextfield";
import CommonTable from "../../../Components/Table/CustomTable";
import styles from "../Case.module.scss"
export const diagnosticTableColumns = [
    {
        title: "Diagnostic codes",
        dataIndex: "code",
        key: "code",
    },
    {
        title: "Classification",
        dataIndex: "classification",
        key: "classification",
    },
    {
        title: "Billable/Non billable",
        dataIndex: "billable",
        key: "billable",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
    },
    {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_: any, record: any) => (
            <span style={{ color: "green", cursor: "pointer" }} onClick={() => console.log(record)}>
                ✏️
            </span>
        ),
    },
];

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


const DiagnosticsCode = () => {
    return (
        // <div>


        //     <CommonTable
        //         columns={diagnosticTableColumns}
        //         data={diagnosticDummyData}
        //         // loading={loading}
        //         onRowClick={(record) => console.log("Row clicked:", record)}

        //     />

        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>

        //         <div style={{ width: "50%" }}>
        //             <DatePickerField label="Client intake time" />
        //             <DatePickerField label="Diagonstic time" />
        //         </div>
        //     </div>

        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //     </div>

        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //     </div>

        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //         <div style={{ width: "50%" }}>
        //             <p>Presenting Problem</p>
        //             <TextAreaField label="Clients initial kjkjkkjhjjhjhjhjhjjjhjjhjjh" rows={4} />
        //         </div>
        //     </div>



        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>
        //             <p>risk</p>


        //             <CheckpointGroup
        //                 label="Treatment Modality"
        //                 options={["Suicide", "Violence", "Physical abuse", "Sexual abuse"]}
        //                 onChange={(val) => console.log(val, "val")}
        //                 multiple
        //                 direction="vertical"
        //             />


        //         </div>
        //         <div style={{ width: "50%" }}>
        //             <p>Contract safety</p>
        //             <p>Contract safety</p>

        //             <InputField label="Client made contract? risk" />
        //             <TextAreaField rows={3} />

        //         </div>

        //     </div>


        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <div style={{ width: "50%" }}>

        //             <TextAreaField rows={3} label="explanation" /></div>
        //         <div style={{ width: "50%" }}>

        //             <TextAreaField rows={3} label="tentative client plan" /></div>

        //     </div>
        // </div>


        <div className={styles.Diagonsticcontainer}>
            <CommonTable
                columns={diagnosticTableColumns}
                data={diagnosticDummyData}
                onRowClick={(record) => console.log('Row clicked:', record)}
            />

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>

                <div className={styles.halfWidth}>
                    <DatePickerField label="Client intake time" disableWrapper />
                    <DatePickerField label="Diagnostic time" disableWrapper />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Presenting Problem</p>
                    <TextAreaField label="Client's initial concern" rows={4} disableWrapper />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Risk</p>
                    <CheckpointGroup
                        label="Treatment Modality"
                        options={['Suicide', 'Violence', 'Physical abuse', 'Sexual abuse']}
                        onChange={(val) => console.log(val, 'val')}
                        multiple
                        direction="vertical"
                    />
                </div>
                <div className={styles.halfWidth}>
                    <p className={styles.subLabel}>Contract Safety</p>
                    <InputField label="Client made contract?" disableWrapper />
                    <TextAreaField label="Explain contract" rows={3} disableWrapper />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.halfWidth}>
                    <TextAreaField label="Explanation" rows={3} disableWrapper />
                </div>
                <div className={styles.halfWidth}>
                    <TextAreaField label="Tentative client plan" rows={3} disableWrapper />
                </div>
            </div>
        </div>
    )
}
export default DiagnosticsCode;