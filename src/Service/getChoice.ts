// import { constants } from "../config/constants";
import SpServices from "./SPServices/SpServices";

// Type for dropdown option
type DropdownOption = { label: string; value: string };

// Get raw choice values from SharePoint
export const getChoiceData = async (
  Field: string,
  Listname: string
): Promise<string[]> => {
  try {
    const res: any = await SpServices.SPGetChoices({
      Listname: Listname,
      FieldName: Field,
    });
    return res?.Choices || [];
  } catch (err) {
    console.error("Error fetching choice data:", err);
    return [];
  }
};

// Function overloads
// export async function getChoiceDropdownOptions(
//   field: string,
//   Listname: string
// ): Promise<DropdownOption[]>;
// export async function getChoiceDropdownOptions(
//   fields: string[],
//   Listname: string
// ): Promise<Record<string, DropdownOption[]>>;

// Unified implementation
export async function getChoiceDropdownOptions(
  fields: string | string[],
  Listname: string
): Promise<DropdownOption[] | Record<string, DropdownOption[]>> {
  if (typeof fields === "string") {
    try {
      const choices = await getChoiceData(fields, Listname);
      return choices.map((item) => ({ label: item, value: item }));
    } catch (err) {
      console.error("Error in getChoiceDropdownOptions (single):", err);
      return [];
    }
  } else if (Array.isArray(fields)) {
    const result: Record<string, DropdownOption[]> = {};
    try {
      await Promise.all(
        fields.map(async (field) => {
          const choices = await getChoiceData(field, Listname);
          result[field] = choices.map((item) => ({ label: item, value: item }));
        })
      );
      return result;
    } catch (err) {
      console.error("Error in getChoiceDropdownOptions (multiple):", err);
      return {};
    }
  }

  // This return handles invalid inputs just in case
  return Array.isArray(fields) ? {} : [];
}
