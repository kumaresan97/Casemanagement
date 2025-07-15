import { sp } from "@pnp/sp/presets/all";

export const getServicetype = async (
  listTitle: string,
  labelField: string = "Title" // default to Title column
): Promise<{ label: string; value: number }[]> => {
  try {
    const items = await sp.web.lists
      .getByTitle(listTitle)
      .items.select("ID", labelField)
      .get();

    return items.map((item) => ({
      label: item[labelField],
      value: item.ID,
    }));
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return [];
  }
};
