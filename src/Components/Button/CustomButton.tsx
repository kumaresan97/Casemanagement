import React from "react";
import { Button, ButtonProps } from "antd";
// import styles from "./CustomButton.module.scss";

interface CustomButtonProps extends ButtonProps {
    label: string;
    bgColor?: string;
    textColor?: string;
    borderRadius?: string | number;
    width?: string | number;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    type?: "primary" | "default" | "dashed" | "link" | "text";
}

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    bgColor,
    textColor,
    borderRadius,
    width,
    icon,
    style = {},
    className = "",
    type = "default",
    ...rest
}) => {
    const buttonStyle: React.CSSProperties = {
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: borderRadius,
        width: width,
        ...style,
    };

    return (
        <Button
            icon={icon}
            type={type}
            style={buttonStyle}
            //   className={`${styles.customBtn} ${className}`}
            {...rest}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
