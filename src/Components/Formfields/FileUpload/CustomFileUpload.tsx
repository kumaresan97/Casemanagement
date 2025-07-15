// FileUpload.tsx
import * as React from 'react';
import { useState, useRef } from 'react';
import styles from './CustomFileUpload.module.scss';

// interface IFileUploadProps {
//     label?: string;
//     onFilesSelected: (files: File[]) => void;
// }
interface IFileUploadProps {
    label?: string;
    value?: { name: string; content: File | Blob }[];  // <-- NEW

    onFilesSelected: (files: { name: string; content: File | Blob }[]) => void;
}

const FileUpload: React.FC<IFileUploadProps> = ({ onFilesSelected, label, value }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ name: string; content: File | Blob }[]>([]);

    // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null); // To trigger file input click

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Set dropEffect to indicate a copy operation
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const newFiles = files.map(file => ({ name: file.name, content: file }));
            const updatedFiles = [...selectedFiles, ...newFiles];

            setSelectedFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newFiles = files.map(file => ({ name: file.name, content: file }));
            const updatedFiles = [...selectedFiles, ...newFiles];

            setSelectedFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }
    };

    const handleClearFile = (indexToRemove: number) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };


    // const handleDrop = (e: React.DragEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setIsDragging(false);

    //     const files = Array.from(e.dataTransfer.files);
    //     if (files && files.length > 0) {
    //         setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    //         onFilesSelected([...selectedFiles, ...files]); // Notify parent component
    //     }
    // };

    // const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = Array.from(e.target.files || []);
    //     if (files && files.length > 0) {
    //         setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    //         onFilesSelected([...selectedFiles, ...files]); // Notify parent component
    //     }
    // };

    // const handleClearFile = (indexToRemove: number) => {
    //     const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    //     setSelectedFiles(updatedFiles);
    //     onFilesSelected(updatedFiles); // Notify parent component
    // };

    const handleBrowseFiles = () => {
        fileInputRef.current?.click(); // Programmatically click the hidden file input
    };
    React.useEffect(() => {
        if (value && value.length > 0) {
            setSelectedFiles(value);
        }
    }, [value]);

    return (
        <>
            <label style={{ fontSize: "12px", fontWeight: "500", marginBottom: "4px", display: "inline-block" }}>{label}</label>
            <div
                className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseFiles} // Allow clicking to open file dialog
            >
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }} // Hide the default file input
                />
                <div className={styles.dropZone}>
                    {selectedFiles.length === 0 ? (
                        <>
                            <p className={styles.instructionText}>
                                Drag and drop files here or click to browse
                            </p>
                            <p className={styles.fileTypesText}>
                                (e.g., .pdf, .docx, .xlsx, .jpg, .png)
                            </p>
                        </>
                    ) : (
                        <div className={styles.fileList}>
                            {selectedFiles.map((file, index) => (
                                <div key={file.name + index} className={styles.fileItem}>
                                    <span>{file.name}</span>
                                    <span
                                        className={styles.clearIcon}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent re-triggering file input click
                                            handleClearFile(index);
                                        }}
                                    >
                                        &times; {/* HTML entity for multiplication sign, often used as clear icon */}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FileUpload;