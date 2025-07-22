import * as React from 'react';
import styles from "../ClientDetail/ClientDetails.module.scss"
import { CompleteCaseForm } from '../../Types/Type';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import FileUpload from '../Formfields/FileUpload/CustomFileUpload';
import PeoplePickerField from '../Formfields/PeoplePicker/CustomPeoplePicker';
import TextAreaField from '../Formfields/TextArea/CustomTextArea';
import InputField from '../Formfields/Textfield/CustomTextfield';


interface Props {
    data: CompleteCaseForm;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    error?: Partial<Record<keyof CompleteCaseForm, string>>;
    serviceType: any[];
    context: any; // Redux context or SharePoint context for PeoplePicker
    disabled?: boolean;
}

const CaseNotesLayout: React.FC<Props> = ({
    data,
    onChange,
    error = {},
    serviceType,
    context,
    disabled = false
}) => {
    return (
        <div>
            <p style={{ margin: "10px 0px", color: "#cccccc", fontSize: "14px" }}>Case appointment detail</p>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <InputField
                        label="Case name"
                        value={data.CaseName}
                        onChange={(val) => onChange("CaseName", val)}
                        required
                        error={error.CaseName}
                        disabled={disabled}
                    />
                </div>
                <div className={styles.halfwidth}>
                    <PeoplePickerField
                        context={context}
                        label="Case manager"
                        required
                        error={error.CaseManager}
                        disabled={disabled}
                        defaultUsers={data.CaseManager?.email ? [data.CaseManager.email] : []}
                        onChange={(val: any) => onChange("CaseManager", val[0])}
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
                    disabled={disabled}
                />
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <FileUpload
                        value={data.attachments}
                        onFilesSelected={(e: any) => onChange("attachments", e)}
                        label="Attachments"
                    />
                </div>
                <div className={styles.halfwidth}>
                    <SelectField
                        multiple
                        label="Default service type"
                        value={data.ServiceType}
                        options={serviceType}
                        onChange={(vals) => onChange("ServiceType", vals)}
                        error={error.ServiceType}
                        required
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default CaseNotesLayout;
