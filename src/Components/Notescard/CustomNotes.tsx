import * as React from "react";
import styles from "./Notescard.module.scss"
import { Email as EmailIcon } from "@mui/icons-material";

interface NoteCardProps {
    type: "Appointment" | "Notes";
    date: string;
    content: string;
    billable?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ type, date, content, billable }) => {
    return (
        <div className={styles.noteCard}>
            <div className={styles.noteHeader}>
                <div className={styles.left}>
                    <EmailIcon className={styles.icon} />
                    <span>
                        {type} on {date}
                    </span>
                </div>
                {billable && <span className={styles.billable}>Billable</span>}
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
