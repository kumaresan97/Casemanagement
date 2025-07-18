// import * as React from "react";
// import { Checkbox } from "antd";

// // const { Title } = Typography;

// interface CheckpointGroupProps {
//     label?: string;
//     options: string[];
//     value?: string | string[];
//     onChange: (val: string | string[]) => void;
//     multiple?: boolean;
//     direction?: "horizontal" | "vertical";
//     className?: string;
//     required?: boolean;
// }

// const CheckpointGroup: React.FC<CheckpointGroupProps> = ({
//     label,
//     options,
//     value,
//     onChange,
//     multiple = true,
//     direction = "vertical",
//     className,
//     required
// }) => {
//     const handleSingleSelect = (option: string) => {
//         if (value === option) {
//             onChange(""); // unselect if clicked again
//         } else {
//             onChange(option);
//         }
//     };

//     const handleMultiSelect = (checkedValues: any) => {
//         onChange(checkedValues);
//     };

//     const isChecked = (option: string): boolean => {
//         if (multiple) {
//             return Array.isArray(value) && value.includes(option);
//         }
//         return value === option;
//     };

//     return (
//         <div className={className}>
//             <label className="label">
//                 {label} {required && <span className="required-star">*</span>}
//             </label>
//             <div
//                 style={{
//                     display: "flex",
//                     flexDirection: direction === "vertical" ? "column" : "row",
//                     gap: "0.5rem",
//                 }}
//             >
//                 {multiple
//                     ? (
//                         <Checkbox.Group
//                             options={options}
//                             value={value as string[]}
//                             onChange={handleMultiSelect}
//                         />
//                     )
//                     : (
//                         options.map((option) => (
//                             <Checkbox
//                                 key={option}
//                                 checked={isChecked(option)}
//                                 onChange={() => handleSingleSelect(option)}
//                             >
//                                 {option}
//                             </Checkbox>
//                         ))
//                     )}
//             </div>
//         </div>
//     );
// };

// export default CheckpointGroup;

import * as  React from "react";
import { Checkbox } from "antd";
// import "./CheckpointGroup.module.scss";

interface CheckpointGroupProps {
    label?: string;
    required?: boolean;
    options: string[];
    value?: string | string[]; // single or multiple selection
    onChange: (val: string | string[]) => void;
    multiple?: boolean;
    direction?: "horizontal" | "vertical";
    className?: string;
}

const CheckpointGroup: React.FC<CheckpointGroupProps> = ({
    label,
    required,
    options,
    value,
    onChange,
    multiple = true,
    direction = "vertical",
    className,
}) => {
    const isChecked = (option: string) => {
        return multiple
            ? Array.isArray(value) && value.includes(option)
            : value === option;
    };

    const handleChange = (option: string) => {
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            const updated = current.includes(option)
                ? current.filter((v) => v !== option)
                : [...current, option];
            onChange(updated);
        } else {
            onChange(value === option ? "" : option); // toggle
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="label" style={{ fontWeight: 600 }}>
                    {label}
                    {required && <span className="required-star" style={{ color: "red" }}> *</span>}
                </label>
            )}

            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    flexDirection: direction === "vertical" ? "column" : "row",
                    gap: "0.5rem",
                    marginTop: 6,
                }}
            >
                {options.map((option) => (
                    <Checkbox
                        key={option}
                        checked={isChecked(option)}
                        onChange={() => handleChange(option)}
                    >
                        {option}
                    </Checkbox>
                ))}
            </div>
        </div>
    );
};

export default CheckpointGroup;

