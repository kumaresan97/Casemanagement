/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable  @typescript-eslint/no-empty-function */
/* eslint-disable  @typescript-eslint/no-use-before-define */



import * as React from "react"
import { useEffect, useRef, useState } from "react";
import styles from "../Case.module.scss"

import { Checkbox, Divider } from 'antd';
import NoteCard from "../../../Components/Notescard/CustomNotes";
import CustomEditor from "../../../Components/QuilEditor/CustomQuilEditor";
import { AddCaseNotes, addNewAppointment, getAllCases, getNotesGroupedByMonth } from "../../../Service/AllCases/AllCaseService";
import { useParams } from "react-router-dom";
import { GroupedNotes, PeoplePickerUser, SelectOption } from "../../../Types/Type";

import RefreshIcon from '@mui/icons-material/Refresh';




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
import DatePickerField from "../../../Components/Formfields/Calendar/CustomCalendar";
import Loader from "../../../Components/Spinner/Loader";

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
    const [loading, setLoading] = useState<boolean>(false);
    const addButtonRef = useRef<HTMLButtonElement>(null);


    const [caseNotes, setAllCaseNotes] = useState<GroupedNotes[]>([]);
    const [MastercaseNotes, setMasterCaseNotes] = useState<GroupedNotes[]>([]);

    const [isBillable, setIsBillable] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');
    const [isopen, setIsopen] = useState<boolean>(false)
    const [serviceType, setServiceType] = useState<SelectOption[]>([])
    // const [selectedDate, setSelectedDate] = useState<Date | any>(null);
    const [filters, setFilters] = useState({
        BillableType: null as { label: string, value: string } | null,
        Date: null as string | null,
    });


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

    // const handleSubmit = async () => {
    //     if (!id) {
    //         message.error("Case ID is missing in URL.");
    //         return;
    //     }

    //     const caseId = Number(id);
    //     const billable = isBillable ? "Billable" : "Non-billable";

    //     try {
    //         await AddCaseNotes(notes, billable, caseId, "Notes");

    //         const updatedData = await getNotesGroupedByMonth(caseId);
    //         console.log("updatedData: ", updatedData);
    //         setAllCaseNotes(updatedData);
    //         setMasterCaseNotes(updatedData);
    //         debugger;
    //         message.success("Notes added successfully.");
    //         setNotes(""); // Clear input
    //         setIsBillable(false); // Reset checkbox
    //     } catch (error) {
    //         console.error("Error adding note:", error);
    //         message.error("Failed to add note.");
    //     }
    // };

    // Add simple note (non-appointment note)
    const handleSubmit = async () => {
        if (!id) {
            message.error("Case ID is missing in URL.");
            return;
        }

        const caseId = Number(id);
        const billable = isBillable ? "Billable" : "Non-billable";

        try {
            setLoading(true);
            await AddCaseNotes(notes, billable, caseId, "Notes");
            const updatedData = await getNotesGroupedByMonth(caseId);
            setAllCaseNotes(updatedData);
            setMasterCaseNotes(updatedData);
            setNotes("");
            setIsBillable(false);
            message.success("Notes added successfully.");
        } catch (error) {
            console.error("Error adding note:", error);
            message.error("Failed to add note.");
        } finally {
            setLoading(false);
        }
    };
    // const handleDateChange = (selectedDate: string | null) => {
    //     if (!selectedDate) {
    //         setAllCaseNotes(MastercaseNotes); // Reset to original
    //         return;
    //     }

    //     const filtered = MastercaseNotes
    //         .map((group) => {
    //             const filteredItems = group.items.filter((item) =>
    //                 moment(item.date).format("DD/MM/YYYY") === selectedDate
    //             );
    //             return {
    //                 ...group,
    //                 items: filteredItems,
    //             };
    //         })
    //         .filter((group) => group.items.length > 0); // Remove empty groups

    //     setAllCaseNotes(filtered);
    // };



    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    // const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    const validateForm = (formData: IAppointmentDetails) => {
        const errors: Partial<Record<keyof IAppointmentDetails, string>> = {};

        const isValidFormat = (dateStr: string) => moment(dateStr, DATE_FORMAT, true).isValid();
        // const getTimePart = (dateStr: string) => moment(dateStr).format('HH:mm');

        // Validate ServiceTypes
        if (!formData.ServiceType?.length) errors.ServiceType = 'Required';

        // FromDateTime
        if (!formData.FromDateTime) {
            errors.FromDateTime = 'Required';
        } else if (!isValidFormat(formData.FromDateTime)) {
            errors.FromDateTime = 'Invalid format';
        }
        //  else if (getTimePart(formData.FromDateTime) === '00:00') {
        //     errors.FromDateTime = 'Please select a valid time and minutes';
        // }

        // ToDateTime
        if (!formData.ToDateTime) {
            errors.ToDateTime = 'Required';
        } else if (!isValidFormat(formData.ToDateTime)) {
            errors.ToDateTime = 'Invalid format';
        }
        //  else if (getTimePart(formData.ToDateTime) === '00:00') {
        //     errors.ToDateTime = 'Please select a valid time and minutes';
        // }

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

    const handleAddData = async () => {
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            await addNewAppointment(formData, setFormData, setIsopen, initialFormData)
            const updatedData = await getNotesGroupedByMonth(Number(id));
            console.log("updatedData: ", updatedData);
            setAllCaseNotes(updatedData);
            setMasterCaseNotes(updatedData);

        }

    }

    // React.useEffect(() => {
    //     const loadData = async (): Promise<void> => {

    //         try {

    //             const data = await getNotesGroupedByMonth(Number(id)); // wait for the Promise to resolve
    //             console.log(data);
    //             const Type = await getServicetype(constants.Listnames.ServiceType)
    //             const existing = await getAllCases(Number(id))
    //             console.log("existing: ", existing);
    //             let existingdata = {
    //                 ...formData, ServiceType: existing[0].ServiceType,
    //                 CaseManager: existing[0].CaseManager,
    //             }
    //             setServiceType(Type)// you get actual array like [{ month: ..., items: [...] }]
    //             setAllCaseNotes(data);
    //             setMasterCaseNotes(data);

    //             if (existing) {
    //                 setFormData(existingdata)
    //                 initialFormDataRef.current = existingdata; // update reference for cancel

    //                 // setFormData((prev) => ({
    //                 //     ...prev,
    //                 //     ServiceType: existing[0].ServiceType,
    //                 //     CaseManager: existing[0].CaseManager,
    //                 // }));
    //             }


    //         }
    //         catch (error) {
    //             console.error("Failed to load notes", error);
    //         }
    //         // save in state
    //     };

    //     loadData();
    // }, [id]);

    const handleFilterChange = (field: "BillableType" | "Date", value: string | null) => {
        const updatedFilters = { ...filters, [field]: value };
        setFilters(updatedFilters);

        applyFilters(updatedFilters);
    };
    const applyFilters = (filterState: typeof filters) => {
        const { BillableType, Date } = filterState;
        debugger;

        let filteredData = MastercaseNotes;

        if (Date) {
            filteredData = filteredData
                .map((group) => {
                    const filteredItems = group.items.filter((item) =>
                        moment(item.date).format("DD/MM/YYYY") === Date
                    );
                    return { ...group, items: filteredItems };
                })
                .filter((group) => group.items.length > 0);
        }

        if (BillableType?.value) {
            const isBillable = BillableType?.value === 'Billable';

            filteredData = filteredData
                .map((group) => {
                    const filteredItems = group.items.filter((item) =>
                        item.billable === isBillable
                    );
                    return { ...group, items: filteredItems };
                })
                .filter((group) => group.items.length > 0);
        }

        setAllCaseNotes(filteredData);
    };

    const handleClearFilters = () => {
        setFilters({
            BillableType: null,
            Date: null,
        });
        setAllCaseNotes(MastercaseNotes); // Reset to original data
    };



    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const [notesData, types, existing] = await Promise.all([
                    getNotesGroupedByMonth(Number(id)),
                    getServicetype(constants.Listnames.ServiceType),
                    getAllCases(Number(id)),
                ]);

                setAllCaseNotes(notesData);
                setMasterCaseNotes(notesData);
                setServiceType(types);

                if (existing?.[0]) {
                    const existingData = {
                        ...formData,
                        ServiceType: existing[0].ServiceType,
                        CaseManager: existing[0].CaseManager,
                    };
                    setFormData(existingData);
                    initialFormDataRef.current = existingData;
                }
            } catch (error) {
                console.error("Failed to load notes", error);
                message.error("Failed to fetch case notes");
            } finally {
                setLoading(false);
                addButtonRef.current?.focus();

            }
        };

        loadData();
    }, [id]);

    useEffect(() => {
        if (!loading) {
            // Optional timeout helps ensure DOM is ready
            setTimeout(() => {
                addButtonRef.current?.focus();
            }, 0);
        }
    }, [loading]);

    return loading ? <Loader /> : (
        <div>
            <div className={styles.caseNotesContainer}>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", }}>
                    {/* <h5>All notes & Appointments</h5> */}
                    <div style={{ width: "250px" }}>

                        <SelectField
                            placeholder="Billable Type"
                            value={filters.BillableType}
                            options={[
                                { label: 'Billable', value: 'Billable' },
                                { label: 'Non-billable', value: 'Non-billable' },
                            ]}
                            onChange={(val) => handleFilterChange('BillableType', val)}


                        />
                    </div>

                    <div style={{ width: "250px" }}>


                        <DatePickerField

                            value={filters.Date}
                            placeholder="Filter on date"

                            onChange={async (val: any) => {
                                console.log(val);

                                handleFilterChange('Date', val)


                            }} />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "32px",
                            width: "32px",
                            cursor: "pointer",
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                        onClick={handleClearFilters}
                        title="Clear Filters"
                    >
                        <RefreshIcon sx={{ width: 22, height: 22 }} />
                    </div>





                </div>



                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {caseNotes && caseNotes.length > 0 && caseNotes.some(section => section.items.length > 0) ? (
                        caseNotes.map((section, idx) => (
                            <div key={idx}>
                                <h5>{section.month}</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {section.items.map((item: any, i: number) => (
                                        <NoteCard key={i} {...item} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", padding: "1rem", color: "#888", minHeight: "80px", fontStyle: "italic", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            No appointment or case notes found.
                        </div>
                    )}
                </div>




                <Divider />

                <div className={styles.newNoteHeader}>
                    <h5>Notes</h5>
                    <CustomButton label="Add appointment" type="primary"
                        // loading={loading}
                        // onClick={handleSubmit}

                        ref={addButtonRef}
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
                    setFormErrors({})
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
                                    minDate={moment().format("YYYY-MM-DD HH:mm:ss")}
                                />
                            </div>
                            <div style={{ width: "50%" }}>
                                <CustomCalendarDateTime
                                    label="To date & time"
                                    value={formData.ToDateTime}
                                    onChange={(val) => handleChange('ToDateTime', val)}
                                    error={formErrors.ToDateTime}
                                    required

                                    minDate={formData.FromDateTime}
                                    maxDate={moment(formData.FromDateTime)
                                        .endOf("day")
                                        .format("YYYY-MM-DD HH:mm:ss")}

                                    disabled={formData.FromDateTime === "" ? true : false}

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


                        </div>
                    </div>
                </ReusableModal>



            </>
        </div>
    )
}
export default CaseNotes;