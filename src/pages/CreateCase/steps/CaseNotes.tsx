// import * as React from 'react';
// import TextField from '../../../Components/Formfields/Textfield/CustomTextfield';
// import styles from "./Case.module.scss"
// import FileUpload from '../../../Components/Formfields/FileUpload/CustomFileUpload';
// import PeoplePickerField from '../../../Components/Formfields/PeoplePicker/CustomPeoplePicker';
// import { useSelector } from 'react-redux';
// import { CompleteCaseForm } from '../../../Types/Type';
// import SelectField from '../../../Components/Formfields/Dropdown/CustomDropdown';
// import TextAreaField from '../../../Components/Formfields/TextArea/CustomTextArea';



// type Props = {
//     data: CompleteCaseForm;
//     onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
//     serviceType: any
//     setFormdata?: any
//     error?: any
// }


// const CaseNotes: React.FC<Props> = ({ data, onChange, serviceType }) => {


//     const state = useSelector((state: any) => state.data.value)

//     return (
//         <div>
//             <p style={{ color: "#000", fontSize: "16px" }}>Case Detail</p>
//             <p style={{ margin: "10px 0px", color: "#cccccc", fontSize: "14px" }}>case appointment detail</p>
//             <div className={styles.container}>
//                 <div style={{
//                     width: "50%"
//                 }}>
//                     <TextField
//                         label="Case name"
//                         value={data.CaseName}
//                         onChange={(val) => onChange("CaseName", val)}
//                         required />
//                 </div>
//                 <div style={{
//                     width: "50%"
//                 }}>
//                     <PeoplePickerField context={state} label="Case manager"
//                         defaultUsers={data.CCaseManager?.email ? [data.CCaseManager.email] : []}

//                         onChange={(val: any) => onChange("CCaseManager", val[0])} />

//                 </div>
//             </div>
//             <div style={{
//                 width: "100%"
//             }}>

//                 <TextAreaField
//                     label="Description"
//                     value={data.Description}
//                     onChange={(val) => onChange("Description", val)}
//                     required

//                 />
//             </div>

//             <div style={{ display: "flex", gap: "10px", width: "100%" }}>
//                 <div style={{
//                     width: "50%",
//                 }}>

//                     <FileUpload
//                         value={data?.attachments}

//                         onFilesSelected={(e: any) => onChange("attachments", e)} label="attachments" />
//                 </div>
//                 <div style={{
//                     width: "50%"
//                 }}>

//                     <SelectField multiple label={"Default service type"} options={serviceType} required value={data.CServiceType} onChange={(vals) => onChange("CServiceType", vals)} />


//                 </div>
//             </div>

//         </div>
//     );
// };

// export default CaseNotes;


import * as React from 'react';
import { Skeleton } from 'antd';
import TextField from '../../../Components/Formfields/Textfield/CustomTextfield';
import styles from "./Case.module.scss"
import FileUpload from '../../../Components/Formfields/FileUpload/CustomFileUpload';
import PeoplePickerField from '../../../Components/Formfields/PeoplePicker/CustomPeoplePicker';
import { useSelector } from 'react-redux';
import { CompleteCaseForm } from '../../../Types/Type';
import SelectField from '../../../Components/Formfields/Dropdown/CustomDropdown';
import TextAreaField from '../../../Components/Formfields/TextArea/CustomTextArea';


type Props = {
    data: CompleteCaseForm;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    serviceType: any
    setFormdata?: any
    error?: any
}

const CaseNotes: React.FC<Props> = ({ data, onChange, serviceType, error }) => {
    const state = useSelector((state: any) => state.data.value)
    const [isLoading, setIsLoading] = React.useState(false)
    console.log("setIsLoading: ", setIsLoading);

    if (isLoading) {
        return (
            <div>
                <Skeleton title paragraph={{ rows: 1 }} />
                <Skeleton.Input style={{ width: '100%', marginBottom: 20 }} active />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Skeleton.Input style={{ width: '50%' }} active />
                    <Skeleton.Input style={{ width: '50%' }} active />
                </div>
                <Skeleton.Input style={{ width: '100%', height: 80, marginTop: 20 }} active />
                <div style={{ display: 'flex', gap: '10px', marginTop: 20 }}>
                    <Skeleton.Input style={{ width: '50%' }} active />
                    <Skeleton.Input style={{ width: '50%' }} active />
                </div>
            </div>
        );
    }

    return (
        <div>
            <p style={{ margin: "10px 0px", color: "#cccccc", fontSize: "14px" }}>Case appointment detail</p>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <TextField
                        label="Case name"
                        value={data.CaseName}
                        onChange={(val) => onChange("CaseName", val)}
                        required
                        error={error.CaseName}

                    />
                </div>
                <div className={styles.halfwidth}>
                    <PeoplePickerField
                        context={state}
                        label="Case manager"
                        required
                        error={error.CCaseManager}

                        defaultUsers={data.CCaseManager?.email ? [data.CCaseManager.email] : []}
                        onChange={(val: any) => onChange("CCaseManager", val[0])}
                    />
                </div>
            </div>

            <div style={{ width: "100%" }}>
                <TextAreaField
                    rows={5}
                    label="Description"
                    value={data.Description}
                    onChange={(val) => onChange("Description", val)}
                    required
                    error={error.Description}
                />
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <FileUpload
                        value={data?.attachments}
                        onFilesSelected={(e: any) => onChange("attachments", e)}
                        label="Attachments"
                    />
                </div>
                <div className={styles.halfwidth}>
                    <SelectField
                        multiple
                        error={error.CServiceType}
                        label="Default service type"
                        options={serviceType}
                        required
                        value={data.CServiceType}
                        onChange={(vals) => onChange("CServiceType", vals)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CaseNotes;
