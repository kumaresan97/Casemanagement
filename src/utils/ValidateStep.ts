import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidSelect,
  isValidPeoplePicker,
  isValidFileArray,
  isValidFormat,
  getTimePart,
} from "./validators";

// interface Step {
//   requiredFields: string[];
// }

// export const validateStep = (
//   stepIndex: number,
//   steps: Step[],
//   formData: Record<string, any>
// ): { valid: boolean; fieldErrors: Partial<Record<string, string>> } => {
//   const step = steps[stepIndex];
//   const fieldErrors: Partial<Record<string, string>> = {};

//   step.requiredFields.forEach((field) => {
//     const value = formData[field];

//     if (!isNonEmpty(value)) {
//       fieldErrors[field] = `${field} is required`;
//       return;
//     }

//     if (field.toLowerCase().includes("email") && !isValidEmail(value)) {
//       fieldErrors[field] = `Invalid email format`;
//     }

//     if (field.toLowerCase().includes("phone") && !isValidPhone(value)) {
//       fieldErrors[field] = `Invalid phone number`;
//     }

//     if (
//       [
//         "Gender",
//         "ClientType",
//         "PreferredLanguage",
//         "BillableType",
//         "ExistingClient",
//       ].includes(field) &&
//       !isValidSelect(value)
//     ) {
//       fieldErrors[field] = `${field} is required`;
//     }

//     if (
//       ["CaseManager", "CCaseManager", "ACaseManager"].includes(field) &&
//       !isValidPeoplePicker(value)
//     ) {
//       fieldErrors[field] = `${field} must be selected`;
//     }

//     if (field === "attachments" && !isValidFileArray(value)) {
//       fieldErrors[field] = `Please attach at least one file`;
//     }
//   });

//   return {
//     valid: Object.keys(fieldErrors).length === 0,
//     fieldErrors,
//   };
// };

import moment from "moment";

interface Step {
  requiredFields: string[];
}

export const validateStep = (
  stepIndex: number,
  steps: Step[],
  formData: Record<string, any>
): { valid: boolean; fieldErrors: Partial<Record<string, string>> } => {
  const step = steps[stepIndex];
  const fieldErrors: Partial<Record<string, string>> = {};

  step.requiredFields.forEach((field) => {
    const value = formData[field];

    // Common required field check
    if (!isNonEmpty(value)) {
      fieldErrors[field] = `${field} is required`;
      return;
    }

    // Email validation
    if (field.toLowerCase().includes("email") && !isValidEmail(value)) {
      fieldErrors[field] = `Invalid email format`;
    }

    // Phone validation
    if (field.toLowerCase().includes("phone") && !isValidPhone(value)) {
      fieldErrors[field] = `Invalid phone number`;
    }

    // Select field validation
    if (
      [
        "Gender",
        "ClientType",
        "PreferredLanguage",
        "BillableType",
        "ExistingClient",
      ].includes(field) &&
      !isValidSelect(value)
    ) {
      fieldErrors[field] = `${field} is required`;
    }

    // People Picker validation
    if (["CaseManager"].includes(field) && !isValidPeoplePicker(value)) {
      fieldErrors[field] = `${field} must be selected`;
    }

    // Attachment validation
    if (field === "attachments" && !isValidFileArray(value)) {
      fieldErrors[field] = `Please attach at least one file`;
    }

    // FromDateTime validation
    if (field === "FromDateTime") {
      if (!isValidFormat(value)) {
        fieldErrors[field] = "Invalid format";
      } else if (getTimePart(value) === "00:00") {
        fieldErrors[field] = "Please select a valid time and minutes";
      }
    }

    // ToDateTime validation
    if (field === "ToDateTime") {
      if (!isValidFormat(value)) {
        fieldErrors[field] = "Invalid format";
      } else if (getTimePart(value) === "00:00") {
        fieldErrors[field] = "Please select a valid time and minutes";
      }

      // Compare FromDateTime and ToDateTime only if both exist
      if (
        formData.FromDateTime &&
        value &&
        moment(formData.FromDateTime).isSameOrAfter(moment(value))
      ) {
        fieldErrors[field] = "End time must be after start time";
      }
    }
  });

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};
