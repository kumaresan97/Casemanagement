// import * as React from 'react';
// import { Radio } from 'antd';

// interface Option {
//     label: string;
//     value: any;
// }

// interface RadioBoxGroupProps {
//     label: string;
//     required?: boolean;
//     value: any;
//     error?: string;
//     onChange?: (value: any) => void;
//     options: Option[];
// }

// const RadioBoxGroup: React.FC<RadioBoxGroupProps> = ({
//     label,
//     required,
//     value,
//     error,
//     onChange,
//     options,
// }) =>
//      {
//     const handleChange = (e: any) => {
//         const selectedValue = e.target.value;
//         const selectedOption = options.find(opt => opt.value === selectedValue);
//         if (selectedOption) {
//             onChange?.(selectedOption); // Send full { label, value }
//         }
//     };
// }

//     return (
//         <div className="field-wrapper">
//             <label className="label">
//                 {label}
//                 {required && <span className="required-star">*</span>}
//             </label>

//             <Radio.Group
//                 value={value}
//                 onChange={handleChange}
//                 className="radio-box-group"
//             >
//                 {options.map((opt) => (
//                     <div
//                         key={opt.value}
//                         className={`radio-box-option ${value === opt.value ? 'selected' : ''}`}
//                     >
//                         <Radio value={opt.value}>{opt.label}</Radio>
//                     </div>
//                 ))}
//             </Radio.Group>

//             {error && <div className="error-message">{error}</div>}
//         </div>
//     );
// };

// export default RadioBoxGroup;

import * as React from "react";
import { Radio } from "antd";

interface Option {
  label: string;
  value: any;
}

interface RadioBoxGroupProps {
  label: string;
  required?: boolean;
  value: Option | any; // can be raw value or object {label, value}
  error?: string;
  onChange?: (value: Option) => void;
  options: Option[];
  disabled?: boolean;
}

const RadioBoxGroup: React.FC<RadioBoxGroupProps> = ({
  label,
  required,
  value,
  error,
  onChange,
  options,
  disabled,
}) => {
  const handleChange = (e: any) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    if (selectedOption) {
      onChange?.(selectedOption); // Pass full object { label, value }
    }
  };

  // Extract value if it's an object {label, value}
  const selectedValue =
    typeof value === "object" && value !== null ? value.value : value;

  return (
    <div className="field-wrapper">
      <label className="label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>

      <Radio.Group
        value={selectedValue}
        onChange={handleChange}
        className="radio-box-group"
        disabled={disabled}
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            className={`radio-box-option ${
              selectedValue === opt.value ? "selected" : ""
            }`}
          >
            <Radio value={opt.value}>{opt.label}</Radio>
          </div>
        ))}
      </Radio.Group>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RadioBoxGroup;
