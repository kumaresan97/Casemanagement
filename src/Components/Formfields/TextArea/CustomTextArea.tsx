import * as React from "react";
import { Input } from "antd";

interface FieldProps {
  label?: string;
  required?: boolean;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disableWrapper?: boolean;
  disabled?: boolean;
}

const TextAreaField: React.FC<FieldProps> = ({
  label,
  required,
  value,
  rows,
  error,
  disableWrapper,
  onChange,
  disabled,
}) => {
  return (
    <div className={disableWrapper ? "" : "field-wrapper"}>
      {label && (
        <label className="label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <Input.TextArea
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div style={{ height: "23px" }}></div>
      )}
    </div>
  );
};

export default TextAreaField;
