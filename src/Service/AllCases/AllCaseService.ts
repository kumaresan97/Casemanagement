import * as moment from "moment";
import { constants } from "../../config/constants";
import { cases } from "../../Types/Type";
import SpServices from "../SPServices/SpServices";

export const getAllCases = async (): Promise<cases[]> => {
  try {
    const res = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseDetails,
      Select:
        "*,CCaseManager/Title,CCaseManager/EMail,CCaseManager/ID,CServiceType/Title,CServiceType/ID,Client/ID",
      Expand: "CCaseManager,CServiceType,Client",
    });
    console.log("res: ", res);

    const data = res?.map(
      (val: any): cases => ({
        Id: val.Id,
        Description: val.Description || "",
        CaseName: val.CaseName || "",
        CCaseManager: val?.CCaseManager
          ? {
              id: val.CCaseManager.ID || val.CCaseManager.iD,
              email: val.CCaseManager.EMail || val.CCaseManager.email,
              name: val.CCaseManager.Title || val.CCaseManager.name,
            }
          : null,
        CCServiceType: Array.isArray(val.CServiceType)
          ? val.CServiceType.map((s: any) => ({
              value: s.ID || s.value,
              label: s.Title || s.label,
            }))
          : [],
        ClientId: val.Client?.ID ?? null,
        Status: val?.Status ?? "",
        Date: moment(val?.Created).format("MM/DD/YYYY") || "",
      })
    );

    return data;
  } catch (error) {
    console.error("Error in getAllCases:", error);
    return [];
  }
};
export const searchFunction = (text: string, data: cases[]): cases[] => {
  debugger;
  const lower = text.toLowerCase();

  return data.filter((item: cases) =>
    [
      item.CaseName,
      item.Description,
      item.Status,
      item.CCaseManager?.name,
      item.CCaseManager?.email,
      item.Date,
    ]
      .filter(Boolean)
      .some((field: any) => field?.toLowerCase().includes(lower))
  );
};
