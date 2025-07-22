/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable  @typescript-eslint/no-empty-function */



import * as React from "react"
import { useRef, useState } from "react";
import styles from "../Case.module.scss"

import { Checkbox, Divider } from 'antd';
import NoteCard from "../../../Components/Notescard/CustomNotes";
import CustomEditor from "../../../Components/QuilEditor/CustomQuilEditor";
import { AddCaseNotes, addNewAppointment, getAllCases, getNotesGroupedByMonth } from "../../../Service/AllCases/AllCaseService";
import { useParams } from "react-router-dom";
import { GroupedNotes, PeoplePickerUser, SelectOption } from "../../../Types/Type";



import { message } from 'antd';
import CustomButton from "../../../Components/Button/CustomButton";
import ReusableModal from "../../../Components/Modal/CustomModal";
import { useSelector } from "react-redux";
import PeoplePickerField from "../../../Components/Formfields/PeoplePicker/CustomPeoplePicker";
import SelectField from "../../../Components/Formfields/Dropdown/CustomDropdown";
import moment from "moment";
import CustomCalendarDateTime from "../../../Components/Formfields/CalendarDateTime/CustomCalendarDateTime";
import { getServicetype } from "../../../Service/getServicetype";
import { constants } from "../../../config/constants";

interface IAppointmentDetails {
    Id?: number;
    Case: SelectOption;
    FromDateTime: string;
    ToDateTime: string;
    ServiceType: SelectOption[] | null;
    CaseManager: PeoplePickerUser | null;
    BillableType: SelectOption;
    Notes: string;
}

const CaseNotes = () => {
    // const [editorContent, setEditorContent] = useState('');
    const { id } = useParams();
    console.log("id: ", id);
    const [caseNotes, AllCaseNotes] = useState<GroupedNotes[]>([]);

    const [isBillable, setIsBillable] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');
    const [isopen, setIsopen] = useState<boolean>(false)
    const [serviceType, setServiceType] = useState<SelectOption[]>([])
    const context = useSelector((state: any) => state.data.value)
    const data = useSelector((state: any) => state.data.selectedCase)
    console.log("data: ", data);
    const initialFormData: IAppointmentDetails = {

        Id: 0,
        Case: { label: '', value: Number(id) },
        FromDateTime: '',
        ToDateTime: '',
        ServiceType: null,
        CaseManager: null,
        BillableType: { label: '', value: '' },
        Notes: '',


    }

    const [formData, setFormData] = useState<IAppointmentDetails>(
        initialFormData

    );
    const initialFormDataRef = useRef(formData); // store initial values


    const [formErrors, setFormErrors] = useState<Partial<Record<keyof IAppointmentDetails, string>>>({});

    const handleChange = <K extends keyof IAppointmentDetails>(key: K, value: IAppointmentDetails[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        // Clear error on change
        if (formErrors[key]) {
            setFormErrors((prev) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
            });
        }
    };

    const handleSubmit = async () => {
        if (!id) {
            message.error("Case ID is missing in URL.");
            return;
        }

        const caseId = Number(id);
        const billable = isBillable ? "Billable" : "Non-billable";

        try {
            await AddCaseNotes(notes, billable, caseId, "Notes");

            const updatedData = await getNotesGroupedByMonth(caseId);
            console.log("updatedData: ", updatedData);
            AllCaseNotes(updatedData);
            debugger;
            message.success("Notes added successfully.");
            setNotes(""); // Clear input
            setIsBillable(false); // Reset checkbox
        } catch (error) {
            console.error("Error adding note:", error);
            message.error("Failed to add note.");
        }
    };



    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    // const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    const validateForm = (formData: IAppointmentDetails) => {
        const errors: Partial<Record<keyof IAppointmentDetails, string>> = {};

        const isValidFormat = (dateStr: string) => moment(dateStr, DATE_FORMAT, true).isValid();
        const getTimePart = (dateStr: string) => moment(dateStr).format('HH:mm');

        // Validate ServiceTypes
        if (!formData.ServiceType?.length) errors.ServiceType = 'Required';

        // FromDateTime
        if (!formData.FromDateTime) {
            errors.FromDateTime = 'Required';
        } else if (!isValidFormat(formData.FromDateTime)) {
            errors.FromDateTime = 'Invalid format';
        } else if (getTimePart(formData.FromDateTime) === '00:00') {
            errors.FromDateTime = 'Please select a valid time and minutes';
        }

        // ToDateTime
        if (!formData.ToDateTime) {
            errors.ToDateTime = 'Required';
        } else if (!isValidFormat(formData.ToDateTime)) {
            errors.ToDateTime = 'Invalid format';
        } else if (getTimePart(formData.ToDateTime) === '00:00') {
            errors.ToDateTime = 'Please select a valid time and minutes';
        }

        // From must be before To
        if (
            formData.FromDateTime &&
            formData.ToDateTime &&
            moment(formData.FromDateTime).isSameOrAfter(moment(formData.ToDateTime))
        ) {
            errors.ToDateTime = 'End time must be after start time';
        }

        // Other required fields
        if (!formData.CaseManager) errors.CaseManager = 'Required';
        if (!formData.BillableType?.value) errors.BillableType = 'Required';
        // if (!formData.Notes?.trim()) errors.Notes = 'Required';

        return errors;
    };



    const isNotesEmpty = (value: string) => {
        const text = value.replace(/<(.|\n)*?>/g, '').trim(); // remove all HTML tags
        return text === '';
    };

    const handleAddData = () => {
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            addNewAppointment(formData, setFormData, setIsopen, initialFormData)
            alert("success")
        }

    }

    React.useEffect(() => {
        const loadData = async (): Promise<void> => {

            try {

                const data = await getNotesGroupedByMonth(Number(id)); // wait for the Promise to resolve
                console.log(data);
                const Type = await getServicetype(constants.Listnames.ServiceType)
                const existing = await getAllCases(Number(id))
                console.log("existing: ", existing);
                let existingdata = {
                    ...formData, ServiceType: existing[0].ServiceType,
                    CaseManager: existing[0].CaseManager,
                }
                setServiceType(Type)// you get actual array like [{ month: ..., items: [...] }]
                AllCaseNotes(data);

                if (existing) {
                    setFormData(existingdata)
                    initialFormDataRef.current = existingdata; // update reference for cancel

                    // setFormData((prev) => ({
                    //     ...prev,
                    //     ServiceType: existing[0].ServiceType,
                    //     CaseManager: existing[0].CaseManager,
                    // }));
                }


            }
            catch (error) {
                console.error("Failed to load notes", error);
            }
            // save in state
        };

        loadData();
    }, [id]);
    return (
        <div>
            <div className={styles.caseNotesContainer}>
                <h4>All notes & Appointments</h4>


                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {caseNotes?.map((section, idx) => (
                        <div key={idx}>
                            <h5>{section.month}</h5>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {section.items.map((item: any, i: number) => (
                                    <NoteCard key={i} {...item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>



                <Divider />

                <div className={styles.newNoteHeader}>
                    <h4>Notes</h4>
                    <CustomButton label="Add appointment" type="primary"
                        // loading={loading}
                        // onClick={handleSubmit}
                        onClick={() => {
                            setIsopen(true)
                        }}
                        bgColor="#cfa21e"
                        borderRadius={4}
                        color="#fff"
                        width={140}
                        style={{ border: "none" }}


                    />
                    {/* <Button type="primary" size="small">Add appointment</Button> */}
                </div>

                <div className={styles.wrapper}>
                    <CustomEditor value={notes} onChange={setNotes} />

                    <div className={styles.actions}>
                        <Checkbox
                            checked={isBillable}
                            onChange={(e) => setIsBillable(e.target.checked)}
                        >
                            Billable
                        </Checkbox>
                        <CustomButton label="submit" type="primary"
                            // loading={loading}
                            disabled={isNotesEmpty(notes)}

                            onClick={handleSubmit}
                            bgColor="#cfa21e"
                            borderRadius={4}
                            color="#fff"
                            style={{ border: "none" }}


                        />
                        {/* <Button type="primary" onClick={handleSubmit} disabled={!notes}>Submit</Button> */}
                    </div>
                </div>



            </div>
            <>

                <ReusableModal open={isopen} onCancel={() => {
                    setIsopen(false)
                    setFormData(initialFormDataRef.current); // reset to original


                }} onOk={handleAddData} width={700} >
                    <div style={{ width: "100%" }}>

                        {/* Service Types - Full Width */}
                        <div style={{ width: "100%" }}>
                            <SelectField
                                label="Service Types"
                                multiple
                                value={formData.ServiceType}
                                options={serviceType}
                                onChange={(val) => handleChange('ServiceType', val)}
                                error={formErrors.ServiceType}
                                required
                                disabled={true}
                            />
                        </div>

                        {/* From and To DateTime - Half Width Each */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "50%" }}>
                                <CustomCalendarDateTime
                                    label="From date & time"
                                    disableWrapper
                                    value={formData.FromDateTime}
                                    onChange={(val) => handleChange('FromDateTime', val)}
                                    error={formErrors.FromDateTime}
                                    required
                                />
                            </div>
                            <div style={{ width: "50%" }}>
                                <CustomCalendarDateTime
                                    label="To date & time"
                                    value={formData.ToDateTime}
                                    onChange={(val) => handleChange('ToDateTime', val)}
                                    error={formErrors.ToDateTime}
                                    required
                                />
                            </div>
                        </div>

                        {/* Case Manager and Billing Type - Half Width Each */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "50%" }}>
                                <PeoplePickerField
                                    label="Case Manager"
                                    context={context}
                                    defaultUsers={formData.CaseManager?.email ? [formData.CaseManager.email] : []}
                                    onChange={(val) => handleChange('CaseManager', val[0])}
                                    error={formErrors.CaseManager}
                                    required
                                    disabled={true}

                                />
                            </div>
                            <div style={{ width: "50%" }}>
                                <SelectField
                                    label="Billable Type"
                                    value={formData.BillableType}
                                    options={[
                                        { label: 'Billable', value: 'Billable' },
                                        { label: 'Non-billable', value: 'Non-billable' },
                                    ]}
                                    onChange={(val) => handleChange('BillableType', val)}
                                    error={formErrors.BillableType}
                                    required
                                />
                            </div>
                        </div>

                        {/* Notes - Full Width */}
                        <div className="form-row full-width">

                            <CustomEditor value={formData.Notes} onChange={(val) => handleChange('Notes', val)}
                                label="Notes"
                            />

                            {/* <TextAreaField
                                label="Notes"
                                value={formData.Notes}
                                onChange={(val) => handleChange('Notes', val)}
                                rows={4}
                                error={formErrors.Notes}
                                required
                            /> */}
                        </div>
                    </div>
                </ReusableModal>


                {/* <ReusableModal open={isopen} onCancel={() => setIsopen(false)} onOk={handleAddData}>


                    <div>
                        <SelectField
                            label="Service Types"
                            multiple
                            value={formData.ServiceTypes}
                            options={serviceType}
                            onChange={(val) => handleChange('ServiceTypes', val)}
                            error={formErrors.ServiceTypes}
                            required
                        />

                        <div >
                            <CustomCalendarDateTime
                                label="From date & time"
                                disableWrapper
                                value={formData.FromDateTime}
                                onChange={(val) => handleChange('FromDateTime', val)}
                                error={formErrors.FromDateTime}
                                required
                            />
                            <CustomCalendarDateTime
                                label="To date & time"
                                value={formData.ToDateTime}
                                onChange={(val) => handleChange('ToDateTime', val)}
                                error={formErrors.ToDateTime}
                                required
                            />
                        </div>

                        <PeoplePickerField
                            label="Case Manager"
                            context={context}
                            defaultUsers={formData.CaseManager?.email ? [formData.CaseManager.email] : []}
                            onChange={(val) => handleChange('CaseManager', val[0])}
                            error={formErrors.CaseManager}
                            required
                        />

                        <SelectField
                            label="Billable Type"
                            value={formData.BillableType}
                            options={[
                                { label: 'Billable', value: 'Billable' },
                                { label: 'Non-billable', value: 'Non-billable' },
                            ]}
                            onChange={(val) => handleChange('BillableType', val)}
                            error={formErrors.BillableType}
                            required
                        />

                        <TextAreaField
                            label="Notes"
                            value={formData.Notes}
                            onChange={(val) => handleChange('Notes', val)}
                            rows={4}
                            required
                        />
                    </div>



                </ReusableModal> */}
            </>
        </div>
    )
}
export default CaseNotes;