import * as React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from "./QuilEditor.module.scss"

interface CustomEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
    value,
    onChange,
    placeholder = 'Write something...',
    readOnly = false,
}) => {
    return (
        <div className={styles.editorWrapper}>
            <ReactQuill
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                theme="snow"
            // className={styles.editor}
            />
        </div>
    );
};

export default CustomEditor;
