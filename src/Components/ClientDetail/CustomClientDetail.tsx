



import React from 'react';
import { CompleteCaseForm } from '../../Types/Type';
import DatePickerField from '../Formfields/Calendar/CustomCalendar';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import RadioBoxGroup from '../Formfields/RadioButton/CustomRadioButton';
import TextAreaField from '../Formfields/TextArea/CustomTextArea';
import InputField from '../Formfields/Textfield/CustomTextfield';
import styles from './ClientDetails.module.scss';


interface Props {
    data: CompleteCaseForm;
    onChange: <K extends keyof CompleteCaseForm>(key: K, value: CompleteCaseForm[K]) => void;
    error?: Partial<Record<keyof CompleteCaseForm, string>>;
    disabled?: boolean;
    existingClients?: { label: string; value: string | number }[];
    getChoiceData: any;
    serviceType: any[];
    onClientTypeChange?: (val: any) => void;
    onExistingClientSelect?: (val: any) => void;
    setFormdata?: (val: any) => void;
    fetchClientDetails?: (id: any, setForm: any, val: any) => Promise<void>;
    initialFormData?: any;
}

const ClientDetailsLayout: React.FC<Props> = ({
    data,
    onChange,
    error = {},
    disabled = false,
    existingClients = [],
    getChoiceData,
    serviceType,
    // setFormdata = () => { },
    // fetchClientDetails = async () => { },
    // initialFormData = {},
    onExistingClientSelect,
    onClientTypeChange
}) => {
    return (
        <div>
            {/* <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>client name</p> */}

            <div className={styles.formrow}>
                <div className={data.ClientType?.value === 'Existing' ? styles.thirdwidth : styles.halfwidth}>
                    <RadioBoxGroup
                        label="Client Type"
                        value={data.ClientType}
                        onChange={(val: any) => {

                            onClientTypeChange?.(val); // ✅ parent handles reset/form update

                            // if (val.value === 'New') setFormdata(() => initialFormData);

                            // onChange('ClientType', val);
                        }}
                        options={[
                            { label: 'New', value: 'New' },
                            { label: 'Existing', value: 'Existing' },
                        ]}
                    />
                </div>

                <div className={data.ClientType?.value === 'Existing' ? styles.thirdwidth : styles.halfwidth}>
                    <InputField
                        label="Pronouns"
                        value={data.Pronouns}
                        disabled={disabled}
                        onChange={(val) => onChange('Pronouns', val)}
                    />
                </div>

                {data.ClientType?.value === 'Existing' && (
                    <div className={styles.thirdwidth}>
                        <SelectField
                            label="Select Existing Client"
                            options={existingClients}
                            value={data.ExistingClient}
                            error={error.ExistingClient}
                            onChange={async (val: any) => {

                                onExistingClientSelect?.(val); // ✅ parent handles fetch and setFormdata

                                // onChange('ExistingClient', val);
                                // await fetchClientDetails(val?.value, setFormdata, val);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Remaining fields structured as reusable row blocks */}
            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <InputField label="First name" required value={data.FirstName} onChange={(val) => onChange('FirstName', val)} disabled={disabled} error={error.FirstName} />
                </div>
                <div className={styles.halfwidth}>
                    <InputField label="Last name" required value={data.LastName} onChange={(val) => onChange('LastName', val)} disabled={disabled} error={error.LastName} />
                </div>
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <InputField label="Preferred name" required value={data.PreferredName} onChange={(val) => onChange('PreferredName', val)} disabled={disabled} error={error.PreferredName} />
                </div>
                <div className={styles.halfwidth}>
                    <SelectField label="Gender" value={data.Gender} options={getChoiceData?.Gender || []} onChange={(val) => onChange('Gender', val)} disabled={disabled} />
                </div>
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <DatePickerField label="Date of birth" value={data.DateOfBirth} onChange={(val) => onChange('DateOfBirth', val)} disabled={disabled} />
                </div>
                <div className={styles.halfwidth}>
                    <InputField label="Age" value={data.Age} onChange={(val) => onChange('Age', val)} disabled={disabled} />
                </div>
            </div>

            <div className={styles.formrow}>
                <div className={styles.halfwidth}>
                    <SelectField multiple label="Default service type" options={serviceType} required value={data.DefaultServiceType} onChange={(val) => onChange('DefaultServiceType', val)} disabled={disabled} error={error.DefaultServiceType} />
                </div>
                <div className={styles.halfwidth}>
                    <InputField label="Client Id number" value={data.ClientIDNumber} onChange={(val) => onChange('ClientIDNumber', val)} disabled={disabled} />
                </div>
            </div>



            <div className={styles.formrow}>

                <div className={styles.halfwidth}>
                    <SelectField
                        label="Preferred language"
                        value={data.PreferredLanguage}
                        disabled={disabled}

                        options={getChoiceData?.PreferredLanguage || []}
                        // options={[
                        //     { label: 'male', value: 'male' },
                        //     { label: 'female', value: 'female' },

                        // ]}
                        onChange={(val) => onChange("PreferredLanguage", val)}
                    />                </div>
                <div className={styles.halfwidth}>
                    <InputField label="Employment" value={data.Employment}
                        onChange={(val) => onChange("Employment", val)}
                        disabled={disabled}


                    />
                </div>
            </div>
            <div className={styles.formrow}>

                <div className={styles.halfwidth}>
                    <InputField label="Income" value={data.Income}
                        onChange={(val) => onChange("Income", val)}
                        disabled={disabled}


                    />               </div>
                <div className={styles.halfwidth}>
                    <InputField label="Education" value={data.Education}
                        onChange={(val) => onChange("Education", val)}
                        disabled={disabled}


                    />
                </div>
            </div>
            <div className={styles.formrow}>

                <div className={styles.halfwidth}>

                    <InputField label="Occupation" value={data.Occupation}
                        onChange={(val) => onChange("Occupation", val)}
                        disabled={disabled}


                    />
                </div>
                <div className={styles.halfwidth}>
                    <SelectField
                        label="Marital Status"
                        value={data.MaritalStatus}
                        disabled={disabled}
                        options={getChoiceData?.MaritalStatus || []}
                        // options={[
                        //     { label: 'male', value: 'male' },
                        //     { label: 'female', value: 'female' },

                        // ]}
                        onChange={(val) => onChange("MaritalStatus", val)}
                    />
                </div>
            </div>


            <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>contacts</p>



            <div>

                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="Home phone" value={data.HomePhone} onChange={(val) => onChange("HomePhone", val)} disabled={disabled} />
                    </div>
                    <div className={styles.halfwidth}>
                        <InputField label="Mobile phone" required value={data.MobilePhone} onChange={(val) => onChange("MobilePhone", val)} disabled={disabled}

                            error={error.MobilePhone}

                        />

                    </div>
                </div>
                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="Work phone" value={data.WorkPhone} onChange={(val) => onChange("WorkPhone", val)} disabled={disabled} />
                    </div>
                    <div className={styles.halfwidth}>
                        <InputField label="Email" required value={data.Email} onChange={(val) => { onChange("Email", val) }} disabled={disabled}
                            error={error.Email}

                        />

                    </div>
                </div>

                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <SelectField
                            label="Contact preference"
                            value={data.ContactPreference}
                            options={getChoiceData.ContactPreference}
                            disabled={disabled}

                            onChange={(val) => onChange("ContactPreference", val)}
                        />                </div>
                    <div className={styles.halfwidth}>
                        <SelectField
                            label="Contact Details"
                            value={data.ContactDetails}
                            options={getChoiceData.ContactDetails}
                            disabled={disabled}

                            onChange={(val) => onChange("ContactDetails", val)}
                        />
                    </div>
                </div>


            </div>



            <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>Address</p>

            <div>

                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="Location" value={data.Location} onChange={(val) => onChange("Location", val)} disabled={disabled} />
                    </div>
                    <div className={styles.halfwidth}>
                        <InputField label="City" value={data.City} onChange={(val) => onChange("City", val)} disabled={disabled} />

                    </div>
                </div>
                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="State" value={data.State} onChange={(val) => onChange("State", val)} disabled={disabled} />
                    </div>
                    <div className={styles.halfwidth}>
                        <TextAreaField label="Address"
                            disabled={disabled} value={data.Address}
                            onChange={(val) => onChange("Address", val)}

                        />

                    </div>
                </div>

            </div>

            <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>Emergency Contacts</p>

            <>
                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="Name"
                            value={data.EName}
                            onChange={(val) => onChange("EName", val)}
                            disabled={disabled}

                        />
                    </div>
                    <div className={styles.halfwidth}>
                        <InputField label="Mobile phone"
                            value={data.EMobilePhone}
                            error={error.EMobilePhone}
                            required

                            disabled={disabled}
                            onChange={(val) => onChange("EMobilePhone", val)}

                        />

                    </div>
                </div>
                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <InputField label="Relationship"
                            value={data.Relationship}
                            disabled={disabled}
                            onChange={(val) => onChange("Relationship", val)}


                        />
                    </div>
                    <div className={styles.halfwidth}>
                        <InputField label="Email"
                            value={data.EEmail}
                            disabled={disabled}
                            error={error.EEmail}
                            required

                            onChange={(val) => onChange("EEmail", val)}

                        />

                    </div>
                </div>
            </>

            <p style={{
                margin: "10px 0px",
                color: "#cccccc",
                fontSize: "13px"
            }}>Others</p>

            <>


                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <SelectField
                            label="Health Insurance"
                            value={data.HealthInsurance}
                            options={getChoiceData?.HealthInsurance || []}
                            disabled={disabled}
                            // options={[
                            //     { label: 'male', value: 'male' },
                            //     { label: 'female', value: 'female' },

                            // ]}
                            onChange={(val) => onChange("HealthInsurance", val)}
                        />                </div>
                    <div className={styles.halfwidth}>
                        <SelectField
                            label="referal"
                            value={data.Refferal}
                            options={getChoiceData.Refferal}
                            disabled={disabled}

                            onChange={(val) => onChange("Refferal", val)}
                        />
                    </div>
                </div>


                <div className={styles.formrow}>

                    <div className={styles.halfwidth}>
                        <SelectField
                            label="Marital Status"
                            value={data.MaritalStatus}
                            disabled={disabled}
                            options={getChoiceData?.MaritalStatus || []}
                            // options={[
                            //     { label: 'male', value: 'male' },
                            //     { label: 'female', value: 'female' },

                            // ]}
                            onChange={(val) => onChange("MaritalStatus", val)}
                        />                </div>
                    <div className={styles.halfwidth}>
                        <SelectField
                            label="Religion"
                            value={data.Religion}
                            options={getChoiceData?.Religion || []}
                            disabled={disabled}
                            // options={[
                            //     { label: 'male', value: 'male' },
                            //     { label: 'female', value: 'female' },

                            // ]}
                            onChange={(val) => onChange("Religion", val)}
                        />
                    </div>
                </div>
            </>

            {/* Continue this same structure for all other sections: contact, address, emergency, others */}
            {/* Extract repeated row logic into reusable components for scalability if needed */}
        </div>
    );
};

export default ClientDetailsLayout;

