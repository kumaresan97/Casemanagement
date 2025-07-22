import * as moment from "moment";
import { constants } from "../../config/constants";
import { cases } from "../../Types/Type";
import SpServices from "../SPServices/SpServices";

export const fetchCaseDeatils = async () => {
  try {
    const caseResponse = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseDetails,
      Select:
        "*,CaseManager/Title,CaseManager/EMail,CaseManager/Id,ServiceType/Title,ServiceType/ID,Client/ID,Client/FirstName,Client/LastName,Client/PreferredName",
      Expand: "CaseManager,ServiceType,Client",
    });
    const tempCaseDetails: cases[] = caseResponse?.map(
      (val: any): cases => ({
        Id: val.Id,
        Description: val.Description || "",
        CaseName: val.CaseName || "",
        CaseManager: val?.CaseManager
          ? {
              id: val.CaseManager.Id || val.CaseManager.id,
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
        ClientId: val.Client?.ID ?? null,
        Status: val?.Status ?? "",
        Date: moment(val?.Created).format("MM/DD/YYYY") || "",
        ClientDetails: {
          id: val.Client?.ID,
          firstName: val.Client?.FirstName,
          lastName: val.Client?.LastName,
          preferredName: val.Client?.PreferredName,
        },
      })
    );
    return tempCaseDetails;
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const fetchAppointmentDetails = async (
  setMasterAppointments: any,
  setTempAppointments: any
) => {
  try {
    const caseDetailsList = await fetchCaseDeatils();
    const tempAppointmentsDetails = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseNotes,
      //   Select:
      //     "*,ACaseManager/Title,ACaseManager/EMail,ACaseManager/Id,Case/Id,Case/CaseName,AServiceType/Id,AServiceType/Title,Author/Title,Author/EMail,Author/Id",
      //   Expand: "ACaseManager,Case,AServiceType,Author",
      Select: "*,Case/Id,Case/CaseName,Author/Title,Author/EMail,Author/Id",
      Expand: "Case,Author",
      Filter: [
        {
          FilterKey: "Types",
          Operator: "eq",
          FilterValue: "Appointment",
        },
        {
          FilterKey: "IsDeleted",
          Operator: "ne",
          FilterValue: 1,
        },
      ],
    });
    console.log("tempAppointmentsDetails", tempAppointmentsDetails);
    const bindAppointmentDetails = tempAppointmentsDetails.map(
      (appointment: any) => {
        const appointmentCaseDetails = caseDetailsList?.find(
          (caseItem: cases) => caseItem.Id === appointment?.Case?.Id
        );
        return {
          Id: appointment?.Id,
          Case: {
            value: appointment?.Case?.Id,
            label: appointment?.Case?.CaseName,
          },
          AppointmentSDateTime: appointment?.FromDateTime,
          AppointmentEDateTime: appointment?.ToDateTime,
          CreadedBy: appointment?.Author
            ? {
                id: appointment?.Author.Id,
                email: appointment?.Author.EMail,
                name: appointment?.Author.Title,
              }
            : null,
          ServiceTypes: appointmentCaseDetails?.ServiceType,
          CaseManager: appointmentCaseDetails?.CaseManager,
          BillableType: {
            value: appointment?.BillableType,
            label: appointment?.BillableType,
          },
          Notes: appointment?.CaseNotes || "",
        };
      }
    );
    setMasterAppointments(bindAppointmentDetails);
    setTempAppointments(bindAppointmentDetails);
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const addNewAppointment = async (
  formatData: any,
  setMasterAppointments: any,
  setTempAppointments: any,
  currentUserDetails: any,
  setPopupControl: any,
  setToastMessage: any
) => {
  debugger;
  try {
    const payloadJson = {
      Types: "Appointment",
      CaseId: formatData?.Case?.value,
      CaseNotes: formatData?.Notes,
      FromDateTime: new Date(formatData?.AppointmentSDateTime),
      ToDateTime: new Date(formatData?.AppointmentEDateTime),
      BillableType: formatData?.BillableType?.value,
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
      console.log("Add apointment response", res);

      const newAppointmentDetails = {
        Id: res?.data?.Id,
        Case: formatData?.Case,
        AppointmentSDateTime: payloadJson?.FromDateTime,
        AppointmentEDateTime: payloadJson?.ToDateTime,
        CreadedBy: currentUserDetails,
        ServiceTypes: formatData?.ServiceTypes,
        CaseManager: formatData?.CaseManager,
        BillableType: formatData?.BillableType,
        Notes: formatData?.Notes || "",
      };
      setMasterAppointments((prev: any) => {
        return [...prev, newAppointmentDetails];
      });
      setTempAppointments((prev: any) => {
        return [...prev, newAppointmentDetails];
      });
      setPopupControl(false);
      setToastMessage({
        IsShow: true,
        Type: "success",
        Message: "New appointment added successfully!",
      });
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const updateAppointment = async (
  formatData: any,
  setMasterAppointments: any,
  setTempAppointments: any,
  setPopupControl: any,
  setToastMessage: any
) => {
  debugger;
  try {
    const payloadJson = {
      CaseId: formatData?.Case?.value,
      CaseNotes: formatData?.Notes,
      FromDateTime: new Date(formatData?.AppointmentSDateTime),
      ToDateTime: new Date(formatData?.AppointmentEDateTime),
      BillableType: formatData?.BillableType?.value,
      //   ACaseManagerId: formatData?.CaseManager?.id,
      //   AServiceTypeId:
      //     formatData?.ServiceTypes?.length > 0
      //       ? { results: formatData.ServiceTypes.map((val: any) => val.value) }
      //       : null,
    };
    await SpServices.SPUpdateItem({
      Listname: constants.Listnames.CaseNotes,
      ID: formatData?.Id,
      RequestJSON: payloadJson,
    }).then((res: any) => {
      console.log("Add apointment response", res);

      const updateAppointmentDetails = {
        Id: formatData?.Id,
        Case: formatData?.Case,
        AppointmentSDateTime: payloadJson?.FromDateTime,
        AppointmentEDateTime: payloadJson?.ToDateTime,
        ServiceTypes: formatData?.ServiceTypes,
        CaseManager: formatData?.CaseManager,
        BillableType: formatData?.BillableType,
        Notes: formatData?.Notes || "",
      };
      setMasterAppointments((prev: any) => {
        return prev.map((item: any) =>
          item.Id === formatData?.Id
            ? { ...item, ...updateAppointmentDetails }
            : item
        );
      });

      setTempAppointments((prev: any) => {
        return prev.map((item: any) =>
          item.Id === formatData?.Id
            ? { ...item, ...updateAppointmentDetails }
            : item
        );
      });
      setPopupControl(false);
      setToastMessage({
        IsShow: true,
        Type: "success",
        Message: "Appointment updated successfully!",
      });
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const deleteAppointment = async (
  apptId: number,
  setMasterAppointments: any,
  setTempAppointments: any,
  setPopupControl: any,
  setApptId: any,
  setToastMessage: any
) => {
  try {
    await SpServices.SPUpdateItem({
      Listname: constants.Listnames.CaseNotes,
      ID: apptId,
      RequestJSON: { IsDeleted: true },
    }).then((response) => {
      setMasterAppointments((prev: any) => {
        return prev.filter((item: any) => item.Id !== apptId);
      });
      setTempAppointments((prev: any) => {
        return prev.filter((item: any) => item.Id !== apptId);
      });
      setPopupControl(false);
      setApptId(0);
      setToastMessage({
        IsShow: true,
        Type: "success",
        Message: "Appointment deleted successfully!",
      });
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

// validation function

export const validateAppointmentForm = (formData: any): any => {
  // 1. Case
  if (!formData.Case || !formData.Case.value) {
    return {
      isValid: false,
      error: { key: "Case", errorMessage: "Case deatils is required." },
    };
  }

  // 2. AppointmentSDateTime
  if (formData.AppointmentSDateTime === "") {
    return {
      isValid: false,
      error: {
        key: "AppointmentSDateTime",
        errorMessage: "Form date & time is required.",
      },
    };
  } else if (
    !formData.AppointmentSDateTime ||
    !moment(
      formData.AppointmentSDateTime,
      "YYYY-MM-DD HH:mm:ss",
      true
    ).isValid()
  ) {
    return {
      isValid: false,
      error: {
        key: "AppointmentSDateTime",
        errorMessage: "Form date & time is invalid.",
      },
    };
  }

  // 3. AppointmentEDateTime
  if (formData.AppointmentEDateTime === "") {
    return {
      isValid: false,
      error: {
        key: "AppointmentEDateTime",
        errorMessage: "To date & time is required.",
      },
    };
  } else if (
    !formData.AppointmentEDateTime ||
    !moment(
      formData.AppointmentEDateTime,
      "YYYY-MM-DD HH:mm:ss",
      true
    ).isValid()
  ) {
    return {
      isValid: false,
      error: {
        key: "AppointmentEDateTime",
        errorMessage: "To date & time is invalid.",
      },
    };
  }

  // 4. AppointmentSDateTime < AppointmentEDateTime
  const start = moment(formData.AppointmentSDateTime, "YYYY-MM-DD HH:mm:ss");
  const end = moment(formData.AppointmentEDateTime, "YYYY-MM-DD HH:mm:ss");
  if (end.isSameOrBefore(start)) {
    return {
      isValid: false,
      error: {
        key: "AppointmentEDateTime",
        errorMessage: "End DateTime must be after Start DateTime.",
      },
    };
  }

  // 5. CaseManager
  if (
    !formData.CaseManager ||
    !formData.CaseManager.id ||
    !formData.CaseManager.email ||
    !formData.CaseManager.name
  ) {
    return {
      isValid: false,
      error: { key: "CaseManager", errorMessage: "Case Manager is required." },
    };
  }

  // 6. BillableType
  if (
    !formData.BillableType?.label ||
    formData?.BillableType?.label?.trim() === ""
  ) {
    return {
      isValid: false,
      error: {
        key: "BillableType",
        errorMessage: "Billable Type is required.",
      },
    };
  }

  // ✅ All valid
  return { isValid: true };
};
