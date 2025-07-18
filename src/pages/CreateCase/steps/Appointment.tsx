import * as React from 'react';

import { CompleteCaseForm } from '../../../Types/Type';

import { useSelector } from 'react-redux';
import AppointmentLayout from '../../../Components/Appointment/CustomAppointment';
// import { CaseFormData } from '../types';

// interface Props {
//     data: any;
//     onChange: (data: Partial<any>) => void;
// }
type Props = {
    data: CompleteCaseForm;
    setFormdata?: any;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    serviceType: any;
    error?: any;
    setFormErrors?: any
}

const Appointment: React.FC<Props> = ({ data, onChange, serviceType, error }) => {
    const Context = useSelector((state: any) => state.data.value)

    return (
        <div>



            <AppointmentLayout
                data={data}
                onChange={onChange}
                serviceType={serviceType}
                error={error}
                context={Context}
            />
            {/* <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>Appoinment detail</p>

            <div>
                <SelectField multiple label={"service type"} options={serviceType} required value={data.AServiceType} onChange={(vals) => onChange("AServiceType", vals)}
                    error={error.AServiceType}

                />

            </div>
            <div className={styles.formrow}>

                <div className={styles.halfwidth}>
                    <CalendarField label="From date and time"
                        value={data.FromDateTime}
                        onChange={(val) => onChange("FromDateTime", val)}
                        required
                        error={error.FromDateTime}

                    />
                </div>
                <div className={styles.halfwidth}>
                    <CalendarField label="To date and time"
                        value={data.ToDateTime}
                        onChange={(val) => onChange("ToDateTime", val)}
                        required
                        error={error.ToDateTime}

                    />
                </div>
            </div>

            <div className={styles.formrow}>

                <div className={styles.halfwidth}>
                    <PeoplePickerField context={Context} label="case manager" onChange={(val: any) => onChange("ACaseManager", val[0])}
                        defaultUsers={data.ACaseManager?.email ? [data.ACaseManager.email] : []}
                        error={error.ACaseManager}
                        required

                    />



                </div>
                <div className={styles.halfwidth}>
                    <SelectField
                        label="Billable type"
                        error={error.BillableType}
                        required
                        value={data?.BillableType}
                        options={[
                            { label: "Billable", value: "Billable" },
                            { label: "Non-billable", value: "Non-billable" }
                        ]}
                        onChange={(val) => onChange("BillableType", val)}
                    />

                </div>
            </div>

            <div>
                <TextAreaField label="Case notes"
                    rows={5}
                    value={data?.CaseNotes}
                    onChange={(val) => onChange("CaseNotes", val)}
                    required
                />
            </div> */}
        </div>
    );
};

export default Appointment;
