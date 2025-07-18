import { sp } from "@pnp/sp/presets/all";
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
      CCaseManagerId: data.CCaseManager?.id || null,
      Description: data.Description || "",
      CaseName: data.CaseName || "",
      Status: "Pending",
      CServiceTypeId: data?.CServiceType
        ? { results: data.CServiceType.map((val: any) => val.value) }
        : null,
    },
    appointment: {
      ACaseManagerId: data.ACaseManager?.id || null,
      AServiceTypeId: data?.AServiceType
        ? { results: data.AServiceType.map((val: any) => val.value) }
        : null,
      CaseNotes: data.CaseNotes,
      BillableType: data?.BillableType?.value || null,
      FromDateTime: new Date(data.FromDateTime) || null,
      ToDateTime: new Date(data.ToDateTime) || null,
    },
  };
};

export const handleSubmitData = async (formdata: CompleteCaseForm) => {
  const { clientDetails, caseDetails, appointment } = splitFormData(formdata);

  try {
    let clientId: number | any;

    // 🔹 If existing client, reuse selected client ID
    if (
      formdata.ClientType?.value === "Existing" &&
      formdata.ExistingClient?.value
    ) {
      clientId =
        formdata.ExistingClient?.value != null
          ? parseInt(String(formdata.ExistingClient.value))
          : null;
    } else {
      // 🔹 Add new ClientDetails
      const clientRes: any = await SpServices.SPAddItem({
        Listname: "ClientDetails",
        RequestJSON: clientDetails,
      });
      clientId = clientRes?.data?.ID;
    }

    // 🔹 Add to CaseDetails
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

    // 🔹 Create folder in CaseDocuments
    const folderResult = await sp.web
      .getFolderByServerRelativeUrl("CaseDocuments")
      .folders.add(caseFolderName);

    // 🔹 Set metadata on the folder itself (optional but fixes missing parent caseId)
    const folderItem = await folderResult.folder.listItemAllFields.get();
    await sp.web.lists
      .getByTitle("CaseDocuments")
      .items.getById(folderItem.Id)
      .update({
        caseId: caseId,
        Title: caseFolderName,
      });

    // 🔹 Upload attachments in parallel
    const attachments = formdata.attachments;
    if (attachments?.length) {
      await Promise.all(
        attachments.map(async (file) => {
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

    // // 🔹 Create folder in CaseDocuments
    // await sp.web
    //   .getFolderByServerRelativeUrl("CaseDocuments")
    //   .folders.add(caseFolderName);

    // // 🔹 Upload attachments
    // const attachments = formdata.attachments;
    // if (attachments?.length) {
    //   for (const file of attachments) {
    //     const fileAddResult = await sp.web
    //       .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
    //       .files.add(file.name, file.content, true);

    //     const item = await fileAddResult.file.getItem();
    //     await item.update({
    //       caseId: caseId,
    //       Title: file.name,
    //     });
    //   }
    // }

    // 🔹 Add to Appointments
    await SpServices.SPAddItem({
      Listname: "Appointments",
      RequestJSON: {
        ...appointment,
        CaseId: caseId,
      },
    });

    // alert("All data and documents submitted successfully!");
  } catch (err) {
    console.error("Submission Error:", err);
    alert("Error occurred while submitting data.");
  }
};

// export const handleSubmitData = async (formdata: CompleteCaseForm) => {
//   const { clientDetails, caseDetails, appointment } = await splitFormData(
//     formdata
//   );

//   try {
//     // 1. Add to ClientDetails
//     const clientItem = await sp.web.lists
//       .getByTitle("ClientDetails")
//       .items.add({
//         ...clientDetails,
//         // ServiceTypeId: {
//         //   results: clientDetails.ServiceTypeId,
//         // },
//       });
//     const clientId = clientItem.data.ID;

//     // 2. Add to CaseDetails
//     const caseItem = await sp.web.lists.getByTitle("CaseDetails").items.add({
//       ...caseDetails,
//       ClientId: clientId,
//     });

//     const caseId = caseItem.data.ID;
//     const caseFolderName = `Case-${caseId}-${caseDetails.CaseName}`.replace(
//       /\s+/g,
//       ""
//     );

//     // 3. Create folder in CaseDocuments
//     await sp.web
//       .getFolderByServerRelativeUrl("CaseDocuments")
//       .folders.add(caseFolderName);

//     // 4. Upload each attachment to the folder and tag with CaseId
//     const attachments = formdata.attachments;

//     if (attachments && attachments.length > 0) {
//       for (const file of attachments) {
//         const fileAddResult = await sp.web
//           .getFolderByServerRelativeUrl(`CaseDocuments/${caseFolderName}`)
//           .files.add(file.name, file.content, true); // file.content = Blob/File

//         // Get the associated list item
//         const item = await fileAddResult.file.getItem();

//         // Update the list item with metadata (caseId)
//         await item.update({
//           caseId: caseId, // <-- Make sure 'CaseId' is a valid column name
//           Title: file.name, // Optional: Set title to file name
//         });
//       }
//     }
//     // 5. Add to Appointments
//     await sp.web.lists.getByTitle("Appointments").items.add({
//       ...appointment,
//       CaseId: caseId || null,
//     });

//     alert("All data and documents submitted successfully!");
//   } catch (err) {
//     console.error("Submission Error:", err);
//     alert("Error occurred while submitting data.");
//   }
// };

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
    ServiceType: client.ServiceType
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
