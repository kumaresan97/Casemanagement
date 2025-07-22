import * as React from "react";
import { Modal, Button } from "antd";

interface ReusableModalProps {
    open: boolean;
    title?: React.ReactNode;
    onOk?: () => void;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
    showFooter?: boolean;
    customFooter?: React.ReactNode; // NEW
    width?: number;
    children: React.ReactNode;
    isLoading?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    open,
    title,
    onOk,
    onCancel,
    okText = "OK",
    cancelText = "Cancel",
    showFooter = true,
    customFooter,
    width = 600,
    children,
    isLoading = false,
}) => {
    const defaultFooter = (
        <>
            {cancelText && <Button onClick={onCancel}>{cancelText}</Button>}
            {okText && (
                <Button type="primary" onClick={onOk} loading={isLoading}>
                    {okText}
                </Button>
            )}
        </>
    );

    return (
        <Modal
            open={open}
            title={title}
            onCancel={onCancel}
            footer={showFooter ? (customFooter ?? defaultFooter) : null}
            width={width}
            destroyOnClose
        >
            {children}
        </Modal>
    );
};

export default ReusableModal;
