/* eslint-disable  @typescript-eslint/no-floating-promises */

import { sp } from "@pnp/sp/presets/all";
import { message } from "antd";
import { constants } from "../../config/constants";
import { CompleteCaseForm, SelectOption } from "../../Types/Type";
import SpServices from "./SpServices";

const splitFormData = (data: CompleteCaseForm) => {
  return {
    clientDetails: {
      ClientType: data.ClientType?.value || "",
      Pronouns: "",
      FirstName: data.FirstName || "",
      LastName: data.LastName || "",
      PreferredName: data.PreferredName || "",
      Gender: data?.Gender?.value || "",
      DateOfBirth: data.DateOfBirth || null,
      Age: data.Age || "",
      ClientIDNumber: data.ClientIDNumber,
      PreferredLanguage: data.PreferredLanguage?.value || null,
      Employment: data?.Employment || "",
      Education: data?.Education || "",
      Income: data?.Income || "",
      MaritalStatus: data?.MaritalStatus?.value || null,
      HealthInsurance: data?.HealthInsurance?.value || null,
      Religion: data?.Religion?.value || null,
      HomePhone: data?.HomePhone || "",
      MobilePhone: data?.MobilePhone || "",
      WorkPhone: data?.WorkPhone || "",
      Email: data.Email || "",
      Location: data.Location || "",
      City: data.City || "",
      Address: data.Address || "",
      State: data.State || "",
      EName: data.EName || "",
      EMobilePhone: data.EMobilePhone || "",
      EEmail: data.EEmail || "",
      Refferal: data.Refferal?.value || null,
      Relationship: data.Relationship || "",

      ContactPreference: data.ContactPreference?.value || null,
      ContactDetails: data.ContactDetails?.value || null,
      ServiceTypeId: data?.ServiceType
        ? { results: data.ServiceType.map((val: any) => val.value) }
        : null,
    },
    caseDetails: {
      CaseManagerId: data.CaseManager?.id || null,
      Description: data.Description || "",
      CaseName: data.CaseName || "",
      Status: "Pending",
      ServiceTypeId: data?.ServiceType
        ? { results: data.ServiceType.map((val: any) => val.value) }
        : null,
    },
    appointment: {
      // ACaseManagerId: data.ACaseManager?.id || null,
      // AServiceTypeId: data?.AServiceType
      //   ? { results: data.AServiceType.map((val: any) => val.value) }
      //   : null,
      Types: "Appointment",
      CaseNotes: data.CaseNotes,
      BillableType: data?.BillableType?.value || null,
      FromDateTime: new Date(data.FromDateTime) || null,
      ToDateTime: new Date(data.ToDateTime) || null,
    },
  };
};

// export const handleSubmitData = async (formdata: CompleteCaseForm) => {
//   const { clientDetails, caseDetails, appointment } = splitFormData(formdata);

//   try {
//     let clientId: number | any;

//     // 🔹 If existing client, reuse selected client ID
//     if (
//       formdata.ClientType?.value === "Existing" &&
//       formdata.ExistingClient?.value
//     ) {
//       clientId =
//         formdata.ExistingClient?.value != null
//           ? parseInt(String(formdata.ExistingClient.value))
//           : null;
//     } else {
//       // 🔹 Add new ClientDetails
//       const clientRes: any = await SpServices.SPAddItem({
//         Listname: "ClientDetails",
//         RequestJSON: clientDetails,
//       });
//       clientId = clientRes?.data?.ID;
//     }

//     // 🔹 Add to CaseDetails
//     const caseRes: any = await SpServices.SPAddItem({
//       Listname: "CaseDetails",
//       RequestJSON: {
//         ...caseDetails,
//         ClientId: clientId,
//       },
//     });

//     const caseId = caseRes?.data?.ID;
//     const caseFolderName = `Case-${caseId}-${caseDetails.CaseName}`.replace(
//       /\s+/g,
//       ""
//     );

//     // 🔹 Create folder in CaseDocuments
//     const folderResult = await sp.web
//       .getFolderByServerRelativeUrl("CaseDocuments")
//       .folders.add(caseFolderName);

//     // 🔹 Set metadata on the folder itself (optional but fixes missing parent caseId)
//     const folderItem = await folderResult.folder.listItemAllFields.get();
//     await sp.web.lists
//       .getByTitle("CaseDocuments")
//       .items.getById(folderItem.Id)
//       .update({
//         caseId: caseId,
//         Title: caseFolderName,
//       });

//     // 🔹 Upload attachments in parallel
//     const attachments = formdata.attachments;
//     if (attachments?.length) {
//       await Promise.all(
//         attachments.map(async (file) => {
//           const fileAddResult = await sp.web
//             .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
//             .files.add(file.name, file.content, true);

//           const item = await fileAddResult.file.getItem();
//           await item.update({
//             caseId: caseId,
//             Title: file.name,
//           });
//         })
//       );
//     }

//     // // 🔹 Create folder in CaseDocuments
//     // await sp.web
//     //   .getFolderByServerRelativeUrl("CaseDocuments")
//     //   .folders.add(caseFolderName);

//     // // 🔹 Upload attachments
//     // const attachments = formdata.attachments;
//     // if (attachments?.length) {
//     //   for (const file of attachments) {
//     //     const fileAddResult = await sp.web
//     //       .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
//     //       .files.add(file.name, file.content, true);

//     //     const item = await fileAddResult.file.getItem();
//     //     await item.update({
//     //       caseId: caseId,
//     //       Title: file.name,
//     //     });
//     //   }
//     // }

//     // 🔹 Add to Appointments
//     await SpServices.SPAddItem({
//       Listname: constants.Listnames.CaseNotes,
//       RequestJSON: {
//         ...appointment,
//         CaseId: caseId,
//       },
//     });

//     // alert("All data and documents submitted successfully!");
//   } catch (err) {
//     console.error("Submission Error:", err);
//     alert("Error occurred while submitting data.");
//   }
// };

export const handleSubmitData = async (
  formdata: CompleteCaseForm,
  currentStep: number
) => {
  const { clientDetails, caseDetails, appointment } = splitFormData(formdata);

  try {
    let clientId: number | any;
    debugger;
    // STEP 2 Logic: Save Client and Case Details
    // if (currentStep === 1) {
    if (
      formdata.ClientType?.value === "Existing" &&
      formdata.ExistingClient?.value
    ) {
      clientId =
        formdata.ExistingClient?.value != null
          ? parseInt(String(formdata.ExistingClient.value))
          : null;
    } else {
      const clientRes: any = await SpServices.SPAddItem({
        Listname: "ClientDetails",
        RequestJSON: clientDetails,
      });
      clientId = clientRes?.data?.ID;
    }

    const caseRes: any = await SpServices.SPAddItem({
      Listname: "CaseDetails",
      RequestJSON: {
        ...caseDetails,
        ClientId: clientId,
      },
    });

    const caseId = caseRes?.data?.ID;
    const caseFolderName = `Case-${caseId}-${caseDetails.CaseName}`.replace(
      /\s+/g,
      ""
    );

    const folderResult = await sp.web
      .getFolderByServerRelativeUrl("CaseDocuments")
      .folders.add(caseFolderName);

    const folderItem = await folderResult.folder.listItemAllFields.get();
    await sp.web.lists
      .getByTitle("CaseDocuments")
      .items.getById(folderItem.Id)
      .update({
        caseId: caseId,
        Title: caseFolderName,
      });

    if (formdata.attachments?.length) {
      await Promise.all(
        formdata.attachments.map(async (file) => {
          const fileAddResult = await sp.web
            .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
            .files.add(file.name, file.content, true);

          const item = await fileAddResult.file.getItem();
          await item.update({
            caseId: caseId,
            Title: file.name,
          });
        })
      );
    }

    // 🔁 Store caseId in localStorage or context to reuse in Step 3
    localStorage.setItem("currentCaseId", String(caseId));
    // }

    // STEP 3 Logic: Save Case Notes
    if (currentStep === 2) {
      const storedCaseId = localStorage.getItem("currentCaseId");

      if (!storedCaseId) {
        alert("Missing Case ID. Please complete Step 2 first.");
        return;
      }

      await SpServices.SPAddItem({
        Listname: constants.Listnames.CaseNotes,
        RequestJSON: {
          ...appointment,
          CaseId: parseInt(storedCaseId),
        },
      });
    }
  } catch (err) {
    console.error("Submission Error:", err);
    message.error("Error occurred while submitting data.");
  }
};

export const fetchExistingClient = async (
  listTitle: string
): Promise<SelectOption[]> => {
  try {
    const result = await SpServices.SPReadItems({
      Listname: listTitle,
      Select: "* ,FirstName,ID,LastName,ClientIDNumber",
      Topcount: 100,
      Orderby: "Created",
      Orderbydecorasc: false,
    });

    const mapped = result.map((item: any) => ({
      label: item.FirstName,
      value: item.ID,
    }));

    return mapped.length > 0 ? mapped : [];
  } catch (error) {
    console.error(`Error fetching from ${listTitle}:`, error);
    return [];
  }
};

export const fetchClientDetails = async (
  clientId: string,
  setFormData: any,
  Existing: any
) => {
  const client = await sp.web.lists
    .getByTitle(constants.Listnames.ClientDetails)
    .items.getById(Number(clientId))
    .select("*,ServiceType/ID,ServiceType/Title")
    .expand("ServiceType")
    .get();

  const clientDetails = {
    ClientType: { label: "Existing", value: "Existing" },
    Pronouns: client.Pronouns || "",
    FirstName: client.FirstName || "",
    LastName: client.LastName || "",
    PreferredName: client.PreferredName || "",
    Gender: client?.Gender || "",
    DateOfBirth: client.DateOfBirth || null,
    Age: client.Age || "",
    ClientIDNumber: client.ClientIDNumber || "",
    PreferredLanguage: client.PreferredLanguage || null,
    Employment: client?.Employment || "",
    Education: client?.Education || "",
    Income: client?.Income || "",
    MaritalStatus: client?.MaritalStatus || null,
    HealthInsurance: client?.HealthInsurance || null,
    Religion: client?.Religion || null,
    HomePhone: client?.HomePhone || "",
    MobilePhone: client?.MobilePhone || "",
    WorkPhone: client?.WorkPhone || "",
    Email: client.Email || "",
    Location: client.Location || "",
    City: client.City || "",
    Address: client.Address || "",
    State: client.State || "",
    EName: client.EName || "",
    EMobilePhone: client.EMobilePhone || "",
    EEmail: client.EEmail || "",
    ContactDetails: client.ContactDetails || null,
    ContactPreference: client.ContactPreference || null,
    Refferal: client.Refferal || null,
    ExistingClient: Existing || null,
    Occupation: client.Occupation || "",
    DefaultServiceType: client.ServiceType
      ? client.ServiceType.map((item: any) => ({
          label: item.Title,
          value: item.ID,
        }))
      : [],
  };

  setFormData((prev: any) => ({
    ...prev,
    ...clientDetails,
  }));
};
