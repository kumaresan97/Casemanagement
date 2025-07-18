/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";
import { constants } from "../../config/constants";
import { CaseNoteItem, cases, GroupedNotes } from "../../Types/Type";
import SpServices from "../SPServices/SpServices";

// export const getAllCases = async (): Promise<cases[]> => {
//   try {
//     const res = await SpServices.SPReadItems({
//       Listname: constants.Listnames.CaseDetails,
//       Select:
//         "*,CCaseManager/Title,CCaseManager/EMail,CCaseManager/ID,CServiceType/Title,CServiceType/ID,Client/ID",
//       Expand: "CCaseManager,CServiceType,Client",
//     });
//     console.log("res: ", res);

//     const data = res?.map(
//       (val: any): cases => ({
//         Id: val.Id,
//         Description: val.Description || "",
//         CaseName: val.CaseName || "",
//         CCaseManager: val?.CCaseManager
//           ? {
//               id: val.CCaseManager.ID || val.CCaseManager.iD,
//               email: val.CCaseManager.EMail || val.CCaseManager.email,
//               name: val.CCaseManager.Title || val.CCaseManager.name,
//             }
//           : null,
//         CCServiceType: Array.isArray(val.CServiceType)
//           ? val.CServiceType.map((s: any) => ({
//               value: s.ID || s.value,
//               label: s.Title || s.label,
//             }))
//           : [],
//         ClientId: val.Client?.ID ?? null,
//         Status: val?.Status ?? "",
//         Date: moment(val?.Created).format("MM/DD/YYYY") || "",
//       })
//     );

//     return data;
//   } catch (error) {
//     console.error("Error in getAllCases:", error);
//     return [];
//   }
// };
export const searchFunction = (text: string, data: cases[]): cases[] => {
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

export const getAllCases = async (id?: number): Promise<cases[]> => {
  try {
    const filters = id
      ? [
          {
            FilterKey: "Id",
            Operator: "eq",
            FilterValue: id,
          },
        ]
      : [];

    const res = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseDetails,
      Select:
        "*,CCaseManager/Title,CCaseManager/EMail,CCaseManager/ID,CServiceType/Title,CServiceType/ID,Client/ID",
      Expand: "CCaseManager,CServiceType,Client",
      Filter: filters,
    });

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
        BillableType: { label: "Billable", value: "Billable" },
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

export const AddCaseNotes = async (
  text: string,
  billabe: string,
  caseId: number,
  type: string
) => {
  try {
    await SpServices.SPAddItem({
      Listname: constants.Listnames.CaseNotes,
      RequestJSON: {
        BillableType: billabe,
        CaseId: caseId,
        Types: type,
        CaseNotes: text,
      },
    });
  } catch (err) {
    alert(err);
  }
};

// adjust path

export const getNotesGroupedByMonth = async (
  caseId: number
): Promise<GroupedNotes[]> => {
  if (!caseId) return [];

  try {
    // const items = await sp.web.lists
    //   .getByTitle("CaseNotes")
    //   .items.select("Id", "Case/Id", "CaseNotes", "BillableType", "Types", "Created")
    //   .expand("Case")
    //   .filter(`Case/Id eq ${caseId}`)
    //   .top(5000)();
    const items = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseNotes,
      Select: "*,Case/ID",
      Expand: "Case",
      Filter: [
        {
          FilterKey: "CaseId",
          Operator: "eq",
          FilterValue: caseId,
        },
      ],
      Topcount: 5000,
    });

    const groupedMap = new Map<string, CaseNoteItem[]>();

    items?.forEach((item) => {
      const createdDate = item?.Created ? new Date(item.Created) : null;
      if (!createdDate || !item.CaseNotes) return; // skip incomplete items

      const monthKey = moment(createdDate).format("MMMM, yyyy");
      const displayDate = moment(createdDate).format("MMM d, yyyy");

      const note: CaseNoteItem = {
        type: item.Types || "General",
        date: displayDate,
        content: item.CaseNotes || "",
        billable: item.BillableType?.toLowerCase() === "billable",
      };

      if (!groupedMap.has(monthKey)) {
        groupedMap.set(monthKey, []);
      }
      groupedMap.get(monthKey)?.push(note);
    });

    // Convert map to array format
    const groupedNotes: GroupedNotes[] = Array.from(groupedMap.entries()).map(
      ([month, items]) => ({
        month,
        items,
      })
    );

    return groupedNotes;
  } catch (error) {
    console.error("Error fetching case notes:", error);
    return [];
  }
};

interface UploadItem {
  name: string;
  originFileObj: File;
}

export const uploadFilesToLibrary = async (
  files: UploadItem[],
  folderPath: string // e.g., "CaseDocuments/Case12"
) => {
  try {
    for (const file of files) {
      await sp.web
        .getFolderByServerRelativeUrl(folderPath)
        .files.add(file.name, file.originFileObj, true); // Overwrite true
    }

    console.log("All files uploaded successfully.");
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

export const getCaseDocuments = async (caseFolderName: string) => {
  try {
    const files = await sp.web
      .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
      .files.select("Name", "TimeLastModified", "ServerRelativeUrl")();

    return files.map((file, index) => ({
      key: index.toString(),
      name: file.Name,
      date: new Date(file.TimeLastModified).toLocaleDateString(),
      status: "Available", // dummy or based on logic
      url: file.ServerRelativeUrl,
    }));
  } catch (error) {
    console.error("Error fetching case documents:", error);
    return [];
  }
};

export const UpdatecaseInfo = async (id: number, data: cases) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: constants.Listnames.CaseDetails,
      ID: id,
      RequestJSON: {
        Title: data.CaseName,
        CCaseManagerId: data.CCaseManager?.id,
        Date: data.Date,
        CServiceTypeId: data?.CCServiceType
          ? { results: data.CCServiceType.map((val: any) => val.value) }
          : null,
        Description: data.Description,
        ClientId: data.ClientId,
        Status: "Pending",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
