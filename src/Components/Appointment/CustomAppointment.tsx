import * as React from 'react';
import { CompleteCaseForm } from '../../Types/Type';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import PeoplePickerField from '../Formfields/PeoplePicker/CustomPeoplePicker';
import TextAreaField from '../Formfields/TextArea/CustomTextArea';

import styles from "../ClientDetail/ClientDetails.module.scss"
import DatePickerField from '../Formfields/Calendar/CustomCalendar';
interface Props {
    data: CompleteCaseForm;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    serviceType: any[];
    error?: Partial<Record<keyof CompleteCaseForm, string>>;
    context: any;
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
                    value={data.AServiceType}
                    onChange={(vals) => onChange('AServiceType', vals)}
                    required
                    error={error.AServiceType}
                    disabled={disabled}
                />
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <DatePickerField
                        label="From date and time"
                        value={data.FromDateTime}
                        onChange={(val) => onChange('FromDateTime', val)}
                        required
                        error={error.FromDateTime}
                        disabled={disabled}
                    />
                </div>
                <div className={styles.halfwidth}>
                    <          DatePickerField

                        label="To date and time"
                        value={data.ToDateTime}
                        onChange={(val) => onChange('ToDateTime', val)}
                        required
                        error={error.ToDateTime}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <PeoplePickerField
                        context={context}
                        label="Case manager"
                        onChange={(val: any) => onChange('ACaseManager', val[0])}
                        defaultUsers={data.ACaseManager?.email ? [data.ACaseManager.email] : []}
                        error={error.ACaseManager}
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

            <div>
                <TextAreaField
                    label="Case notes"
                    rows={5}
                    value={data.CaseNotes}
                    onChange={(val) => onChange('CaseNotes', val)}
                    required
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default AppointmentLayout;
