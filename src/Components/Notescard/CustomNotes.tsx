import * as React from "react";
import styles from "./Notescard.module.scss"
import { Email as EmailIcon } from "@mui/icons-material";
import moment from "moment";

interface NoteCardProps {
    type: "Appointment" | "Notes";
    date: string;
    content: string;
    billable?: boolean;
}
debugger;
const NoteCard: React.FC<NoteCardProps> = ({ type, date, content, billable }) => {
    return (
        <div className={styles.noteCard}>
            <div className={styles.noteHeader}>
                <div className={styles.left}>
                    <EmailIcon className={styles.icon} />
                    <span>
                        {type ?? ""} on {date && moment(date).format('LL')}

                    </span>
                </div>
                {/* {billable && <span className={styles.billable}>Billable</span>} */}
                <span className={styles.billable}>{billable ? "Billable" : "Non-billable"}</span>
            </div>

            <div
                className={styles.noteBody}
                dangerouslySetInnerHTML={{ __html: content || "" }}
            />

            {/* <div className={styles.noteBody}>
                <p>{content}</p>
            </div> */}
        </div>
    );
};

export default NoteCard;
