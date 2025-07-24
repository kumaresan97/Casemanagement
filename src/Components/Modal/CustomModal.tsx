// import * as React from "react";
// import { Modal, } from "antd";
// import CustomButton from "../Button/CustomButton";

// interface ReusableModalProps {
//     open: boolean;
//     title?: React.ReactNode;
//     onOk?: () => void;
//     onCancel?: () => void;
//     okText?: string;
//     cancelText?: string;
//     showFooter?: boolean;
//     customFooter?: React.ReactNode; // NEW
//     width?: number;
//     children: React.ReactNode;
//     isLoading?: boolean;
// }

// const ReusableModal: React.FC<ReusableModalProps> = ({
//     open,
//     title,
//     onOk,
//     onCancel,
//     okText = "Submit",
//     cancelText = "Cancel",
//     showFooter = true,
//     customFooter,
//     width = 600,
//     children,
//     isLoading = false,
// }) => {
//     const defaultFooter = (
//         <>
//             {cancelText && <CustomButton onClick={onCancel} label={cancelText} type="default" />}
//             {okText && (

//                 <CustomButton onClick={onOk} label={okText} bgColor={"#b78e1a"} color={"#fff"} type={"primary"} />
//                 // <Button type="primary" onClick={onOk} loading={isLoading}>
//                 //     {okText}
//                 // </Button>
//             )}
//         </>
//     );

//     return (
//         <Modal
//             open={open}
//             title={title}
//             onCancel={onCancel}
//             footer={showFooter ? (customFooter ?? defaultFooter) : null}
//             width={width}
//             destroyOnClose
//         >
//             {children}
//         </Modal>
//     );
// };

// export default ReusableModal;



import * as React from "react";
import { Modal } from "antd";
import CustomButton from "../Button/CustomButton";

interface ReusableModalProps {
    open: boolean;
    title?: React.ReactNode;
    onOk?: () => void;           // Primary button action
    onCancel?: () => void;       // Close modal (X or cancel button)
    okText?: string;
    cancelText?: string;
    showFooter?: boolean;
    customFooter?: React.ReactNode;
    width?: number;
    children: React.ReactNode;
    isLoading?: boolean;
    padding?: string;
    onCancelClick?: () => void; // ✅ NEW - optional separate handler for Cancel button (Submit Case)
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    open,
    title,
    onOk,
    onCancel,
    onCancelClick, // ✅ used only for cancel button
    okText = "Submit",
    cancelText = "Cancel",
    showFooter = true,
    customFooter,
    width = 600,
    children,
    isLoading = false,
    padding = "24px"
}) => {
    const defaultFooter = (
        <>
            {cancelText && (
                <CustomButton
                    onClick={onCancelClick || onCancel} // ✅ prioritize onCancelClick
                    label={cancelText}
                    type="default"
                />
            )}
            {okText && (
                <CustomButton
                    onClick={onOk}
                    label={okText}
                    bgColor={"#b78e1a"}
                    color={"#fff"}
                    type="primary"
                    loading={isLoading}
                />
            )}
        </>
    );

    return (
        <Modal
            open={open}
            title={title}
            onCancel={onCancel} // ✅ "X" button — only closes modal
            footer={showFooter ? (customFooter ?? defaultFooter) : null}
            width={width}
            bodyStyle={{
                padding: padding ?? "24px"
            }}
            destroyOnClose
        >
            {children}
        </Modal>
    );
};

export default ReusableModal;

