import { constants } from "../../config/constants";
import SpServices from "../SPServices/SpServices";

export const fetchCaseDetailsbyManagers = async (
  setMasterCMDetails: any,
  setTempCMDetails: any
) => {
  try {
    const tempCaseDetails = await SpServices.SPReadItems({
      Listname: constants.Listnames.CaseDetails,
      Select: "*,CaseManager/Title,CaseManager/EMail,CaseManager/Id",
      Expand: "CaseManager",
      Filter: [
        {
          FilterKey: "Status",
          Operator: "eq",
          FilterValue: "Pending",
        },
      ],
    }).then();
    const managerCounts: {
      [email: string]: { count: number; title: string; id: number };
    } = {};

    tempCaseDetails.forEach((caseDetails: any) => {
      const email = caseDetails?.CaseManager?.EMail?.toLowerCase();
      const title = caseDetails?.CaseManager?.Title;
      const id = caseDetails?.CaseManager?.Id;

      if (email) {
        if (!managerCounts[email]) {
          managerCounts[email] = { count: 1, title, id };
        } else {
          managerCounts[email].count += 1;
        }
      }
    });

    console.log("Manager Record Counts:", managerCounts);
    const managerCountsArray = Object.entries(managerCounts).map(
      ([email, data]) => ({
        UserId: data.id,
        UserEmail: email,
        UserName: data.title,
        CaseCount: data.count,
      })
    );
    console.log("managerCountsArray", managerCountsArray);

    setMasterCMDetails(managerCountsArray);
    setTempCMDetails(managerCountsArray);
  } catch (err) {
    console.log("Error : ", err);
  }
};
