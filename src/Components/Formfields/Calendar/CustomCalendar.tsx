import * as React from 'react';
import { DatePicker } from 'antd';
// import moment from 'moment';
// import './formField.scss';
import * as moment from 'moment';

interface FieldProps {
    label: string;
    required?: boolean;
    value?: string; // ISO or date string
    error?: string;
    onChange?: (value: string) => void;
    disableWrapper?: boolean;
    disabled?: boolean
}

const DatePickerField: React.FC<FieldProps> = ({ label, required, value, error, onChange, disableWrapper = false, disabled = false }) => {
    return (
        <div className={disableWrapper ? "" : "field-wrapper"}>
            <label className="label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            <DatePicker
                disabled={disabled}
                style={{ width: '100%' }}
                value={value ? moment(value) : null}
                onChange={(date, dateString) => onChange?.(dateString)}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default DatePickerField;
