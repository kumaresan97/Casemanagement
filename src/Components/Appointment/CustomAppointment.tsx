import * as React from 'react';
import { CompleteCaseForm } from '../../Types/Type';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import PeoplePickerField from '../Formfields/PeoplePicker/CustomPeoplePicker';
// import TextAreaField from '../Formfields/TextArea/CustomTextArea';

import styles from "../ClientDetail/ClientDetails.module.scss"
import CustomCalendarDateTime from '../Formfields/CalendarDateTime/CustomCalendarDateTime';
import CustomEditor from '../QuilEditor/CustomQuilEditor';
interface Props {
    data: CompleteCaseForm;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    serviceType: any[];
    error?: Partial<Record<keyof CompleteCaseForm, string>>;
    context?: any;
    disabled?: boolean;
}

const AppointmentLayout: React.FC<Props> = ({
    data,
    onChange,
    serviceType,
    error = {},
    context,
    disabled = false,
}) => {
    return (
        <div>
            <p style={{ margin: '10px 0px', color: '#cccccc', fontSize: '13px' }}>Appointment detail</p>

            <div>
                <SelectField
                    multiple
                    label="Service type"
                    options={serviceType}
                    value={data.ServiceType}
                    // onChange={(vals) => onChange('AServiceType', vals)}
                    required
                    error={error.ServiceType}
                    disabled={disabled}
                />
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>

                    <CustomCalendarDateTime
                        label="From date & time"
                        disableWrapper
                        value={data.FromDateTime}
                        onChange={(val) => onChange('FromDateTime', val)}
                        error={error.FromDateTime}
                        required
                    />
                    {/* <DatePickerField
                        label="From date and time"
                        value={data.FromDateTime}
                        onChange={(val) => onChange('FromDateTime', val)}
                        required
                        error={error.FromDateTime}
                        disabled={disabled}
                    /> */}
                </div>
                <div className={styles.halfwidth}>

                    <CustomCalendarDateTime
                        label="To date & time"
                        value={data.ToDateTime}
                        onChange={(val) => onChange('ToDateTime', val)}
                        error={error.ToDateTime}
                        required
                    />
                    {/* <          DatePickerField

                        label="To date and time"
                        value={data.ToDateTime}
                        onChange={(val) => onChange('ToDateTime', val)}
                        required
                        error={error.ToDateTime}
                        disabled={disabled}
                    /> */}
                </div>
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <PeoplePickerField
                        context={context}
                        label="Case manager"
                        // onChange={(val: any) => onChange('ACaseManager', val[0])}
                        defaultUsers={data.CaseManager?.email ? [data.CaseManager.email] : []}
                        error={error.CaseManager}
                        required
                        disabled={disabled}
                    />
                </div>
                <div className={styles.halfwidth}>
                    <SelectField
                        label="Billable type"
                        value={data.BillableType}
                        onChange={(val) => onChange('BillableType', val)}
                        options={[
                            { label: 'Billable', value: 'Billable' },
                            { label: 'Non-billable', value: 'Non-billable' },
                        ]}
                        error={error.BillableType}
                        required
                        disabled={disabled}
                    />
                </div>
            </div>

            <div style={{ width: "100%" }}>
                {/* <TextAreaField
                    label="Case notes"
                    rows={5}
                    value={data.CaseNotes}
                    onChange={(val) => onChange('CaseNotes', val)}
                    required
                    disabled={disabled}
                /> */}

                <CustomEditor value={data.CaseNotes} onChange={(val) => onChange('CaseNotes', val)} />

            </div>
        </div>
    );
};

export default AppointmentLayout;
