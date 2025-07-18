import * as React from "react";
import { Input } from "antd";

interface FieldProps {
  label?: string;
  required?: boolean;
  value?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  disableWrapper?: boolean;
}

const InputField: React.FC<FieldProps> = ({
  label,
  required,
  value,
  error,
  onChange,
  disabled,
  readOnly,
  disableWrapper,
}) => {
  const content = (
    <>
      {label && (
        <label className="label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
      />
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div style={{ height: "23px" }}></div>
      )}
    </>
  );
  //     return (
  //         <div className="field-wrapper">
  //             {label &&
  //                 <label className="label">
  //                     {label} {required && <span className="required-star">*</span>}
  //                 </label>
  //             }
  //             <Input value={value} onChange={e => onChange?.(e.target.value)} disabled={disabled} />
  //             {error && <div className="error-message">{error}</div>}
  //         </div>
  //     );
  // };

  return disableWrapper ? (
    <> {content}</> // No "field-wrapper"
  ) : (
    <div className="field-wrapper">{content}</div>
  );
};

export default InputField;
