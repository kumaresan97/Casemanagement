import * as React from "react";
import { DatePicker } from "antd";
import * as moment from "moment";

interface FieldProps {
  label: string;
  required?: boolean;
  value?: string; // ISO or date string
  minDate?: string; // ISO or date string
  maxDate?: string; // ISO or date string
  error?: string;
  onChange?: (value: string) => void;
  disableWrapper?: boolean;
  disabled?: boolean;
}

const CustomCalendarDateTime: React.FC<FieldProps> = ({
  label,
  required,
  value,
  minDate,
  maxDate,
  error,
  onChange,
  disableWrapper = false,
  disabled = false,
}) => {
  const minDateTime = moment(minDate, "YYYY-MM-DD HH:mm:ss");
  const maxDateTime = moment(maxDate, "YYYY-MM-DD HH:mm:ss");

  const disabledTime = (current: moment.Moment | null) => {
    if (!current) return {};

    const isSameMin = minDateTime && current.isSame(minDateTime, "day");
    const isSameMax = maxDateTime && current.isSame(maxDateTime, "day");

    const disabledHours = () => {
      const hours: number[] = [];
      for (let i = 0; i < 24; i++) {
        if (
          (isSameMin && i < minDateTime!.hour()) ||
          (isSameMax && i > maxDateTime!.hour())
        ) {
          hours.push(i);
        }
      }
      return hours;
    };

    const disabledMinutes = (selectedHour: number) => {
      const minutes: number[] = [];
      if (isSameMin && selectedHour === minDateTime!.hour()) {
        for (let i = 0; i < minDateTime!.minute(); i++) {
          minutes.push(i);
        }
      }
      if (isSameMax && selectedHour === maxDateTime!.hour()) {
        for (let i = maxDateTime!.minute() + 1; i < 60; i++) {
          minutes.push(i);
        }
      }
      return minutes;
    };

    const disabledSeconds = (selectedHour: number, selectedMinute: number) => {
      const seconds: number[] = [];
      if (
        isSameMin &&
        selectedHour === minDateTime!.hour() &&
        selectedMinute === minDateTime!.minute()
      ) {
        for (let i = 0; i < minDateTime!.second(); i++) {
          seconds.push(i);
        }
      }
      if (
        isSameMax &&
        selectedHour === maxDateTime!.hour() &&
        selectedMinute === maxDateTime!.minute()
      ) {
        for (let i = maxDateTime!.second() + 1; i < 60; i++) {
          seconds.push(i);
        }
      }
      return seconds;
    };

    return {
      disabledHours,
      disabledMinutes,
      disabledSeconds,
    };
  };
  return (
    <div className={disableWrapper ? "" : "field-wrapper"}>
      <label className="label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <DatePicker
        format="YYYY-MM-DD HH:mm:ss"
        disabled={disabled}
        style={{ width: "100%" }}
        showTime={{
          defaultValue: moment("00:00:00", "HH:mm:ss"),
          showNow: false,
        }}
        value={value ? moment(value) : null}
        onChange={(date, dateString) => onChange?.(dateString)}
        disabledDate={(current) => {
          if (!current) return false;
          if (minDateTime && maxDateTime) {
            return (
              current.isBefore(minDateTime, "day") ||
              current.isAfter(maxDateTime, "day")
            );
          } else if (minDateTime) {
            return current.isBefore(minDateTime, "day");
          } else if (maxDateTime) {
            return current.isAfter(maxDateTime, "day");
          }
          return false;
        }}
        disabledTime={disabledTime}
      />
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div style={{ height: "23px" }}></div>
      )}
    </div>
  );
};

export default CustomCalendarDateTime;
