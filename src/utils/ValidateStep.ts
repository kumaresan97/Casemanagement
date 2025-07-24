import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidSelect,
  isValidPeoplePicker,
  isValidFileArray,
  isValidFormat,
  // getTimePart,
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

export const fieldLabels: Record<string, string> = {
  // Text / Date fields
  FirstName: "First name",
  LastName: "Last name",
  PreferredName: "Preferred name",
  DateOfBirth: "Date of birth",
  Age: "Age",
  ClientIDNumber: "Client ID number",
  HomePhone: "Home phone",
  MobilePhone: "Mobile phone",
  WorkPhone: "Work phone",
  Email: "Email",
  Location: "Location",
  City: "City",
  Address: "Address",
  State: "State",
  EName: "Emergency contact name",
  EMobilePhone: "Mobile phone",
  EEmail: "Email",
  Description: "Description",
  CaseNotes: "Case notes",
  FromDateTime: "Start date and time",
  ToDateTime: "End date and time",
  Occupation: "Occupation",
  DefaultServiceType: "Default service type",
  ServiceType: "Service type",
  Relationship: "Relationship",
  ContactDetails: "Contact details",
  ContactPreference: "Contact preference",
  Refferal: "Referral source",
  clientId: "Client ID",

  // AntD Select fields
  ClientType: "Client type",
  Pronouns: "Pronouns",
  Gender: "Gender",
  PreferredLanguage: "Preferred language",
  Employment: "Employment",
  Education: "Education",
  Income: "Income",
  MaritalStatus: "Marital status",
  HealthInsurance: "Health insurance",
  Religion: "Religion",
  BillableType: "Billable type",

  // Lookup / others
  Client: "Client",
  Case: "Case",
  attachments: "Attachments",
  CaseName: "Case name",

  // People picker
  CaseManager: "Case manager",
  CaseManagerId: "Case manager",
  ExistingClient: "Existing client",
};

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
      // fieldErrors[field] = `${field} is required`;
      fieldErrors[field] = `${fieldLabels[field] || field} is required`;
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
      // fieldErrors[field] = `${field} is required`;
      fieldErrors[field] = `${fieldLabels[field] || field} is required`;
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
      }
      //  else if (getTimePart(value) === "00:00") {
      //   fieldErrors[field] = "Please select a valid time and minutes";
      // }
    }

    // ToDateTime validation
    if (field === "ToDateTime") {
      if (!isValidFormat(value)) {
        fieldErrors[field] = "Invalid format";
      }

      // else if (getTimePart(value) === "00:00") {
      //   fieldErrors[field] = "Please select a valid time and minutes";
      // }

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
