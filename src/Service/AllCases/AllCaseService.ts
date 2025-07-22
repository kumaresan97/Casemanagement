/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";
import { constants } from "../../config/constants";
import {
  CaseNoteItem,
  cases,
  DiagnosticCode,
  GroupedNotes,
  ICaseDocument,
  IRiskAssessment,
  ITreatmentPlan,
} from "../../Types/Type";
import SpServices from "../SPServices/SpServices";

export const searchFunction = (text: string, data: cases[]): cases[] => {
  const lower = text.toLowerCase();

  return data.filter((item: cases) =>
    [
      item.CaseName,
      item.Description,
      item.Status,
      item.CaseManager?.name,
      item.CaseManager?.email,
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
        "*,CaseManager/Title,CaseManager/EMail,CaseManager/ID,ServiceType/Title,ServiceType/ID,Client/ID",
      Expand: "CaseManager,ServiceType,Client",
      Filter: filters,
    });

    const data = res?.map(
      (val: any): cases => ({
        Id: val.Id,
        Description: val.Description || "",
        CaseName: val.CaseName || "",
        CaseManager: val?.CaseManager
          ? {
              id: val.CaseManager.ID || val.CaseManager.ID,
              email: val.CaseManager.EMail || val.CaseManager.email,
              name: val.CaseManager.Title || val.CaseManager.name,
            }
          : null,
        ServiceType: Array.isArray(val.ServiceType)
          ? val.ServiceType.map((s: any) => ({
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
//casenotes

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

export const addNewAppointment = async (
  formData: any,
  setFormData: any,
  setIsopen: any,
  initialFormData: any
) => {
  debugger;
  try {
    const payloadJson = {
      Types: "Appointment",
      CaseId: formData?.Case?.value,
      CaseNotes: formData?.Notes,
      FromDateTime: new Date(formData?.FromDateTime),
      ToDateTime: new Date(formData?.ToDateTime),
      BillableType: formData?.BillableType?.value,
      //   ACaseManagerId: formatData?.CaseManager?.id,
      //   AServiceTypeId:
      //     formatData?.ServiceTypes?.length > 0
      //       ? { results: formatData.ServiceTypes.map((val: any) => val.value) }
      //       : null,
    };
    await SpServices.SPAddItem({
      Listname: constants.Listnames.CaseNotes,
      RequestJSON: payloadJson,
    }).then((res: any) => {
      setIsopen(false);
      setFormData(initialFormData);
    });
  } catch (err) {
    setIsopen(false);
    console.log("Error : ", err);
  }
};

//documents

interface UploadItem {
  name: string;
  originFileObj: File;
}

export const uploadFilesToLibrary = async (
  files: UploadItem[],
  folderPath: string
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

export const getCaseDocuments = async (
  caseFolderName: string
): Promise<ICaseDocument[]> => {
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

// case info

export const UpdatecaseInfo = async (id: number, data: cases) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: constants.Listnames.CaseDetails,
      ID: id,
      RequestJSON: {
        Title: data.CaseName,
        CaseManagerId: data.CaseManager?.id,
        // Date: moment(data.Date) || null,
        ServiceTypeId: data?.ServiceType
          ? { results: data.ServiceType.map((val: any) => val.value) }
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

//Diagnostic

export const getDiagnosticCode = async (id: number) => {
  try {
    const items = await SpServices.SPReadItems({
      Listname: constants.Listnames.Diagnostics,
      Select: "*,Case/ID,Case/Title",
      Expand: "Case",
      Filter: [
        {
          FilterKey: "CaseId",
          Operator: "eq",
          FilterValue: id,
        },
      ],
    });
    debugger;

    const formatted = items.map((item: any) => ({
      ID: item.Id,
      DCode: item.Title || "",
      Description: item.Description || "",
      Classification: item.Classification
        ? { label: item.Classification, value: item.Classification }
        : null,
      BillableType: item.BillableType
        ? { label: item.BillableType, value: item.BillableType }
        : null,
      CaseId: item.Case ? item.Case.ID : null,
    }));

    return formatted;
  } catch (error) {
    console.error("Failed to load DiagnosticCode items:", error);
    return [];
  }
};

export const handleAddDiagnostic = async (
  formData: DiagnosticCode,
  setFormData: React.Dispatch<React.SetStateAction<DiagnosticCode>>,
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>,
  initialFormData: DiagnosticCode,
  caseId: number,
  setDiagonsticCodes: React.Dispatch<React.SetStateAction<DiagnosticCode[]>>,
  DiagonsticCodes: DiagnosticCode[]
) => {
  const payload = {
    Title: formData.DCode,
    Description: formData.Description,
    Classification: formData.Classification?.value || "",
    BillableType: formData.BillableType?.value || "",
    CaseId: caseId || formData.CaseId || null,
  };

  try {
    if (formData.ID) {
      // Edit mode
      await SpServices.SPUpdateItem({
        Listname: constants.Listnames.Diagnostics,
        ID: formData.ID,
        RequestJSON: payload,
      });

      // Update item in the state
      const updatedList = DiagonsticCodes.map((item) =>
        item.ID === formData.ID ? { ...formData } : item
      );
      setDiagonsticCodes(updatedList);
    } else {
      // Add mode
      const response = await SpServices.SPAddItem({
        Listname: constants.Listnames.Diagnostics,
        RequestJSON: payload,
      });

      // Add new item to the state
      setDiagonsticCodes((prev) => [
        ...prev,
        { ...formData, ID: response.data.ID || response.data.Id },
      ]);
    }

    setFormData(initialFormData);
    setIsopen(false);
  } catch (error) {
    console.error("Submit failed:", error);
  }
};

// export const handleAddDiagnostic = async (
//   formData: DiagnosticCode,
//   setFormData: any,
//   setIsopen: any,
//   initialFormData: DiagnosticCode,
//   caseId: number
// ) => {

//   const payload = {
//     Title: formData.DCode,
//     Description: formData.Description,
//     Classification: formData.Classification?.value || "",
//     BillableType: formData.BillableType?.value || "",
//     CaseId: caseId || formData.CaseId || null,
//   };

//   try {
//     if (formData.ID) {
//       // Edit mode
//       await SpServices.SPUpdateItem({
//         Listname: constants.Listnames.Diagnostics,
//         ID: formData.ID,
//         RequestJSON: payload,
//       });

//     } else {
//       // Add mode
//       await SpServices.SPAddItem({
//         Listname: constants.Listnames.Diagnostics,
//         RequestJSON: payload,
//       });
//     }

//     setFormData(initialFormData);
//     setIsopen(false);
//     // Optionally reset or notify success
//   } catch (error) {
//     console.error("Submit failed:", error);
//   }
// };

export const getRiskAssessment = async (
  caseId: number
): Promise<IRiskAssessment | null> => {
  try {
    const items = await SpServices.SPReadItems({
      Listname: "DiagnosticsCodes",
      Select: "*,Case/ID,Case/Title",
      Expand: "Case",
      Filter: [
        {
          FilterKey: "CaseId",
          Operator: "eq",
          FilterValue: caseId,
        },
      ],
      Topcount: 1, // ensure only one item is retrieved
    });

    if (!items.length) return null;

    const item = items[0];

    const formatted: IRiskAssessment = {
      ID: item.Id || null,
      PresentingProblem: item.PresentingProblem || "",
      ClientIntakeDate: item.ClientIntakeDate || "",
      DiagnosticsDate: item.DiagnosticsDate || "",
      Observations: item.Observations || "",
      PertinentHistory: item.PertinentHistory || "",
      FamilyPsychosocialAssessment: item.FamilyPsychosocialAssessment || "",
      Strengths: item.Strengths || "",
      RiskExplanation: item.RiskExplanation || "",
      ContractSafteyPlan: item.ContractSafteyPlan || "",
      SafteyPlanExplanation: item.SafteyPlanExplanation || "",
      TentativeGoalsAndPlans: item.TentativeGoalsAndPlans || "",
      RiskIndicators: item.RiskIndicators ? item.RiskIndicators : [],
      CaseId: item.Case ? item.Case.ID : null,
    };

    return formatted;
  } catch (error) {
    console.error("Failed to load Risk Assessment:", error);
    return null;
  }
};

export const addRiskAssessment = async (
  formData: IRiskAssessment,
  id: number
) => {
  try {
    const response = await SpServices.SPAddItem({
      Listname: "DiagnosticsCodes", // Replace with your actual list name
      RequestJSON: {
        ...formData,
        CaseId: id || formData.CaseId, // for lookup
        RiskIndicators: {
          results: formData.RiskIndicators || [],
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding risk assessment:", error);
    throw error;
  }
};

export const updateRiskAssessment = async (
  id: number,
  formData: IRiskAssessment
) => {
  try {
    const response = await SpServices.SPUpdateItem({
      Listname: "DiagnosticsCodes",
      ID: id,
      RequestJSON: {
        ...formData,
        CaseId: formData.CaseId,
        RiskIndicators: {
          results: formData.RiskIndicators || [],
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating risk assessment:", error);
    throw error;
  }
};

//TreatmentPlans
export const loadDataByCaseId = async (caseId: number) => {
  const items = await sp.web.lists
    .getByTitle("TreatmentPlans")
    .items.filter(`Case/Id eq ${caseId}`)
    .select(
      "ID",
      "BehavioralDefinition",
      "TreatmentDuration",
      "InitiationDate",
      "ReferralService",
      "AppointmentsFrequency",
      "TreatmentModality",
      "Case/Id"
    )
    .expand("Case")
    .top(1)
    .get();

  if (items.length > 0) {
    const existing = items[0];
    console.log("existing: ", existing);

    let data = {
      ID: existing.ID,
      BehavioralDefinition: existing.BehavioralDefinition,
      TreatmentDuration: existing.TreatmentDuration,
      InitiationDate: existing.InitiationDate,
      ReferralService: existing.ReferralService,
      AppointmentsFrequency: existing.AppointmentsFrequency,
      TreatmentModality: existing.TreatmentModality ?? [],
      CaseId: existing.Case?.Id,
    };
    return data;
  }
  //   setFormData({
  //     BehavioralDefinition: existing.BehavioralDefinition,
  //     TreatmentDuration: existing.TreatmentDuration,
  //     InitiationDate: existing.InitiationDate,
  //     ReferralService: existing.ReferralService,
  //     AppointmentsFrequency: existing.AppointmentsFrequency,
  //     TreatmentModality: existing.TreatmentModality?.split(',') ?? [],
  //     CaseId: existing.Case?.Id,
  //   });
  // }
};
export const updateTreatmentPlan = async (
  id: number,
  data: ITreatmentPlan,
  setisLoading: any
) => {
  try {
    const payload = {
      ...data,
      CaseId: data.CaseId,
      TreatmentModality: {
        results: data.TreatmentModality || [],
      },
    };

    const result = await SpServices.SPUpdateItem({
      Listname: "TreatmentPlans",
      ID: id,
      RequestJSON: payload,
    });
    alert("updated");
    setisLoading(false);

    return result;
  } catch (error) {
    setisLoading(false);

    console.error("Error updating treatment plan:", error);
    throw error;
  }
};

export const addTreatmentPlan = async (
  data: ITreatmentPlan,
  id: number,
  setisLoading: any
) => {
  try {
    const payload = {
      ...data,
      CaseId: id || data.CaseId,
      TreatmentModality: {
        results: data.TreatmentModality || [],
      },
    };

    const result = await SpServices.SPAddItem({
      Listname: "TreatmentPlans",
      RequestJSON: payload,
    });
    alert("added");
    setisLoading(false);
    return result;
  } catch (error) {
    setisLoading(false);

    console.error("Error adding treatment plan:", error);
    throw error;
  }
};
export const validateTreatmentPlan = (
  data: ITreatmentPlan
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.BehavioralDefinition)
    errors.BehavioralDefinition = "Behavioral definition is required.";
  if (!data.InitiationDate)
    errors.InitiationDate = "Initiation date is required.";
  if (!data.TreatmentModality.length)
    errors.TreatmentModality = "Select at least one treatment modality.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
