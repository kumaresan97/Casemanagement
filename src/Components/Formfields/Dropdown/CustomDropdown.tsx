


// import * as React from 'react';
// import { Select } from 'antd';

// interface Option {
//     label: string;
//     value: any;
// }


// interface FieldProps {
//     label: string;
//     required?: boolean;
//     value?: any;
//     error?: string;
//     onChange?: (value: any) => void;
//     options?: Option[];
//     multiple?: boolean; // ✅ add support for multi-select
//     placeholder?: string;
//     disabled?: boolean;
// }

// const SelectField: React.FC<FieldProps> = ({
//     label,
//     required,
//     value,
//     error,
//     onChange,
//     options = [],
//     multiple = false,
//     placeholder = "Select",
//     disabled = false
// }) => {
//     return (
//         <div className="field-wrapper">
//             <label className="label">
//                 {label} {required && <span className="required-star">*</span>}
//             </label>
//             <Select
//                 mode={multiple ? "multiple" : undefined}
//                 value={value}
//                 onChange={onChange}
//                 options={options}
//                 placeholder={placeholder}
//                 style={{ width: '100%' }}
//                 disabled={disabled}
//             />
//             {error && <div className="error-message">{error}</div>}
//         </div>
//     );
// };

// export default SelectField;




// import * as React from 'react';
// import { Select } from 'antd';

// interface Option {
//     label: string;
//     value: any;
// }

// interface FieldProps {
//     label: string;
//     required?: boolean;
//     value?: any;
//     error?: string;
//     onChange?: (value: any) => void;
//     options?: Option[];
//     multiple?: boolean;
//     placeholder?: string;
//     disabled?: boolean;
// }

// const SelectField: React.FC<FieldProps> = ({
//     label,
//     required,
//     value,
//     error,
//     onChange,
//     options = [],
//     multiple = false,
//     placeholder = 'Select',
//     disabled = false,
// }) => {
//     const handleChange = (val: any) => {
//         if (multiple) {
//             const selectedOptions = options.filter((opt) => val.includes(opt.value));
//             onChange?.(selectedOptions);
//         } else {
//             const selectedOption = options.find((opt) => opt.value === val);
//             onChange?.(selectedOption);
//         }
//     };

//     // Ensure correct formatting of value for AntD Select
//     const selectValue = multiple
//         ? (value || []).map((v: any) => v?.value ?? v)
//         : value?.value ?? value;

//     return (
//         <div className="field-wrapper">
//             <label className="label">
//                 {label} {required && <span className="required-star">*</span>}
//             </label>
//             <Select
//                 mode={multiple ? 'multiple' : undefined}
//                 value={selectValue}
//                 onChange={handleChange}
//                 options={options}
//                 placeholder={placeholder}
//                 style={{ width: '100%' }}
//                 disabled={disabled}
//             />
//             {error && <div className="error-message">{error}</div>}
//         </div>
//     );
// };

// export default SelectField;



import * as React from 'react';
import { Select } from 'antd';

interface Option {
    label: string;
    value: any;
}

interface FieldProps {
    label?: string;
    required?: boolean;
    value?: any;
    error?: string;
    onChange?: (value: any) => void;
    options?: Option[];
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
    disableWrapper?: boolean;
}

const SelectField: React.FC<FieldProps> = ({
    label,
    required,
    value,
    error,
    onChange,
    options = [],
    multiple = false,
    placeholder = 'Select',
    disabled = false,
    disableWrapper = false
}) => {
    const handleChange = (val: any) => {
        if (multiple) {
            const selected = options.filter((opt) => val.includes(opt.value));
            onChange?.(selected); // return array of full objects
        } else {
            const selected = options.find((opt) => opt.value === val);
            onChange?.(selected || null); // return full object
        }
    };

    // Convert value back to just value(s) for Select component
    const selectValue = multiple
        ? Array.isArray(value) ? value.map((v: any) => v?.value) : []
        : value?.value ?? undefined;

    return (
        <div className={disableWrapper ? "" : "field-wrapper"}>
            {label &&
                <label className="label">
                    {label} {required && <span className="required-star">*</span>}
                </label>
            }
            <Select
                mode={multiple ? 'multiple' : undefined}
                value={selectValue}
                onChange={handleChange}
                options={options}
                placeholder={placeholder}
                style={{ width: '100%' }}
                disabled={disabled}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default SelectField;



