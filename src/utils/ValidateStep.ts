import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidSelect,
  isValidPeoplePicker,
  isValidFileArray,
} from "./validators";

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

    if (!isNonEmpty(value)) {
      fieldErrors[field] = `${field} is required`;
      return;
    }

    if (field.toLowerCase().includes("email") && !isValidEmail(value)) {
      fieldErrors[field] = `Invalid email format`;
    }

    if (field.toLowerCase().includes("phone") && !isValidPhone(value)) {
      fieldErrors[field] = `Invalid phone number`;
    }

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

    if (
      ["CaseManager", "CCaseManager", "ACaseManager"].includes(field) &&
      !isValidPeoplePicker(value)
    ) {
      fieldErrors[field] = `${field} must be selected`;
    }

    if (field === "attachments" && !isValidFileArray(value)) {
      fieldErrors[field] = `Please attach at least one file`;
    }
  });

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};
