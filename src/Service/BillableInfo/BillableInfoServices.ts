import * as moment from "moment";
import { constants } from "../../config/constants";
import { cases, IBillableInfoDetails } from "../../Types/Type";
import { fetchCaseDeatils } from "../Appointments/AppointmentsServices";
import SpServices from "../SPServices/SpServices";

export const fetchBillableDetails = async (
  setMasterBIDetails: any,
  setBIDetails: any
) => {
  try {
    const caseDetailsList = await fetchCaseDeatils();
    const tempAppointmentsDetails: cases[] = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseNotes,
      //   Select:
      //     "*,ACaseManager/Title,ACaseManager/EMail,ACaseManager/Id,Case/Id,Case/CaseName,AServiceType/Id,AServiceType/Title,Author/Title,Author/EMail,Author/Id",
      //   Expand: "ACaseManager,Case,AServiceType,Author",
      Select: "*,Case/Id,Case/CaseName,Author/Title,Author/EMail,Author/Id",
      Expand: "Case,Author",
    });
    console.log("tempAppointmentsDetails", tempAppointmentsDetails);
    const bindAppointmentDetails: IBillableInfoDetails[] =
      tempAppointmentsDetails.map((appointment: any) => {
        const caseDetails = caseDetailsList?.find(
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
          ServiceTypes: caseDetails?.ServiceType ?? [],
          CaseManager: caseDetails?.CaseManager ?? null,
          BillableType: {
            value: appointment?.BillableType,
            label: appointment?.BillableType,
          },
          Notes: appointment?.CaseNotes || "",
          Type: appointment?.Types || "",
          ClientDetails: caseDetails?.ClientDetails || {},
          CreatedAt: appointment?.Created
            ? moment(appointment?.Created).format("DD/MM/YYYY")
            : "",
          CaseStatus: caseDetails?.Status || "",
        };
      });
    setMasterBIDetails(bindAppointmentDetails);
    setBIDetails(bindAppointmentDetails);
  } catch (err) {
    console.log("Error : ", err);
  }
};
