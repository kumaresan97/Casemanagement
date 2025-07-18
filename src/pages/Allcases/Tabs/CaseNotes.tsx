/* eslint-disable @typescript-eslint/no-floating-promises */


import * as React from "react"
import { useState } from "react";
import styles from "../Case.module.scss"

import { Checkbox, Divider } from 'antd';
import NoteCard from "../../../Components/Notescard/CustomNotes";
import CustomEditor from "../../../Components/QuilEditor/CustomQuilEditor";
import { AddCaseNotes, getNotesGroupedByMonth } from "../../../Service/AllCases/AllCaseService";
import { useParams } from "react-router-dom";
import { GroupedNotes } from "../../../Types/Type";
// const dummyNotes: any[] = [
//     {
//         month: 'September, 2024',
//         items: [
//             {
//                 type: 'Appointment',
//                 date: 'Sep 10, 2024',
//                 content:
//                     'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
//                 billable: true,
//             },
//             {
//                 type: 'Notes',
//                 date: 'Sep 1, 2024',
//                 content: 'The Football Is Good For Training And Recreational Purposes',
//                 billable: true,
//             },
//         ],
//     },
//     {
//         month: 'August, 2024',
//         items: [
//             {
//                 type: 'Notes',
//                 date: 'Sep 1, 2024',
//                 content: 'Sample Notes for August...',
//                 billable: true,
//             },
//         ],
//     },
// ];


import { message } from 'antd';
import CustomButton from "../../../Components/Button/CustomButton";


const CaseNotes = () => {
    // const [editorContent, setEditorContent] = useState('');
    const { id } = useParams();
    console.log("id: ", id);
    const [caseNotes, AllCaseNotes] = useState<GroupedNotes[]>([]);

    const [isBillable, setIsBillable] = useState(false);
    const [notes, setNotes] = useState('');

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


    // const handleSubmit = async () => {
    //     if (!id) {
    //         console.error("Case ID is missing in URL.");
    //         return;
    //     }

    //     const caseId: number = Number(id); // parse with radix 10
    //     const billable = isBillable ? "Billable" : "Non-billable";

    //     await AddCaseNotes(notes, billable, caseId, "Notes");
    // };

    React.useEffect(() => {
        const loadData = async (): Promise<void> => {

            try {

                const data = await getNotesGroupedByMonth(Number(id)); // wait for the Promise to resolve
                console.log(data); // you get actual array like [{ month: ..., items: [...] }]
                AllCaseNotes(data);
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
                    {caseNotes.map((section, idx) => (
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
                        onClick={handleSubmit}
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
        </div>
    )
}
export default CaseNotes;