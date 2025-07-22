import moment from "moment";

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPhone = (value: string): boolean =>
  /^[0-9+\-\s()]{7,15}$/.test(value);

export const isNonEmpty = (value: any): boolean =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  !(Array.isArray(value) && value.length === 0);

// export const isValidSelect = (val: any): boolean => {
//   return val && typeof val === "object" && val.value?.length > 0;
// };

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const isValidFormat = (dateStr: string) =>
  moment(dateStr, DATE_FORMAT, true).isValid();

export const getTimePart = (dateStr: string) => moment(dateStr).format("HH:mm");

export const isValidSelect = (val: any): boolean => {
  if (!val || typeof val !== "object") return false;

  const v = val.value;

  if (typeof v === "string") {
    return v.trim().length > 0;
  }

  if (typeof v === "number") {
    return true; // any number is valid, including 0
  }

  return false;
};

export const isValidPeoplePicker = (value: any): boolean =>
  typeof value === "object" && value !== null && "id" in value;

export const isValidFileArray = (value: any): boolean =>
  Array.isArray(value) && value.length > 0;
