import * as React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from "./QuilEditor.module.scss"

interface CustomEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    label?: string;
    required?: boolean;
    error?: string;
}

const CustomEditor: React.FC<CustomEditorProps> = ({
    value,
    onChange,
    placeholder = 'Write something...',
    readOnly = false,
    label,
    required,
    error
}) => {
    return (
        <div className={styles.editorWrapper}>

            {label && <label className="label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            }
            <ReactQuill
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                theme="snow"
            // className={styles.editor}
            />

            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div style={{ height: "23px" }}></div>
            )}
        </div>
    );
};

export default CustomEditor;
