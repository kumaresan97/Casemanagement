import * as React from 'react';
import { DatePicker } from 'antd';
// import moment from 'moment';
// import './formField.scss';
import * as moment from 'moment';

interface FieldProps {
    label?: string;
    required?: boolean;
    value?: string | Date | undefined | null; // ISO or date string
    error?: string;
    onChange?: (value: string) => void;
    disableWrapper?: boolean;
    disabled?: boolean;
    showtime?: boolean;
    placeholder?: string;
    isheight?: boolean;

}

const DatePickerField: React.FC<FieldProps> = ({ label, required, value, error, onChange, disableWrapper = false, disabled = false, showtime = true,
    placeholder, isheight = true
}) => {


    return (
        <div className={disableWrapper ? "" : "field-wrapper"}>
            {label && <label className="label">
                {label} {required && <span className="required-star">*</span>}
            </label>}
            <DatePicker
                disabled={disabled}
                // showTime
                style={{ width: '100%' }}

                value={value ? moment(value, "DD/MM/YYYY") : null}
                onChange={(date, dateString) => onChange?.(dateString)}
                format="DD/MM/YYYY"
                placeholder={placeholder ?? ""}

            />
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                isheight && <div style={{ height: "23px" }}></div>
            )}
            {/* {error && <div className="error-message">{error}</div>} */}
        </div>
    );
};

export default DatePickerField;
