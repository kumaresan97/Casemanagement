import * as React from "react";
import CustomButton from "../Button/CustomButton";

interface FooterActionsProps {
  onClose?: () => void;
  onSubmit: () => void;
}

const CustomFooterBtn: React.FC<FooterActionsProps> = ({ onSubmit, onClose }): JSX.Element => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
      <CustomButton label="Close" onClick={onClose} type="default" />
      <CustomButton label="Submit" onClick={onSubmit} type="primary" bgColor="#b78e1a" />
    </div>
  );
};

export default CustomFooterBtn;
