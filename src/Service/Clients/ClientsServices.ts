import { constants } from "../../config/constants";
import { IMasterClientDetails } from "../../Types/Type";
import SpServices from "../SPServices/SpServices";

export const fetchServiceTypes = async (setServiceTypesOptions: any) => {
  try {
    const servicesResponse: any[] = await SpServices.SPReadItems({
      Listname: constants.Listnames.ServiceType,
    });
    console.log("servicesResponse", servicesResponse);
    const tempServicesList = servicesResponse?.map((service) => {
      return {
        label: service.Title,
        value: service.Id,
      };
    });
    setServiceTypesOptions(tempServicesList);
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const fetchClientsDetails = async (
  setMasterClients: any,
  setTempClients: any,
  setLoading: any
) => {
  try {
    setLoading(true);
    const clientsResponse: any[] = await SpServices.SPReadItems({
      Listname: constants.Listnames.ClientDetails,
      Select: "*,ServiceType/Id,ServiceType/Title",
      Expand: "ServiceType",
      Orderby: "Created",
      Orderbydecorasc: false,
    });
    console.log("clientsResponse", clientsResponse);

    const bindClientsDetails: IMasterClientDetails[] = clientsResponse.map(
      (client) => {
        return {
          Id: client.Id,
          FirstName: client.FirstName,
          LastName: client.LastName,

          PreferredName: client.PreferredName,
          Pronouns: client.Pronouns,
          Age: client.Age,

          Gender: {
            label: client.Gender || "",
            value: client.Gender || "",
          },
          DateOfBirth: client.DateOfBirth || "",
          ServiceTypes:
            client.ServiceType?.map((service: any) => ({
              label: service.Title,
              value: service.Id,
            })) || [],
          ClientID: client.ClientIDNumber || "",

          PreferredLanguage: {
            label: client.PreferredLanguage || "",
            value: client.PreferredLanguage || "",
          },
          Employment: client?.Employment || "",
          Income: client?.Income || "",
          HomePhoneNo: client.HomePhone || "",
          MobilePhoneNo: client.MobilePhone || "",
          WorkPhoneNo: client.WorkPhone || "",
          EmailId: client.Email || "",
          Location: client.Location || "",
          Education: client.Education || "",
          Occupation: client.Occupation || "",
          ContactPreference: {
            label: client.ContactPreference || "",
            value: client.ContactPreference || "",
          },
          ContactDetails: {
            label: client.ContactDetails || "",
            value: client.ContactDetails || "",
          },
          EmergencyName: client.EName || "",
          EmergencyPhoneNo: client.EMobilePhone || "",
          Relationship: client.Relationship || "",
          EmergencyEmailId: client.EEmail || "",
          Address: client.Address || "",
          City: client.City || "",
          State: client.State || "",
          HealthInsurance: {
            label: client.HealthInsurance || "",
            value: client.HealthInsurance || "",
          },
          Referral: {
            label: client.Refferal || "",
            value: client.Refferal || "",
          },
          MaritalStatus: {
            label: client.MaritalStatus || "",
            value: client.MaritalStatus || "",
          },
          Religion: {
            label: client.Religion || "",
            value: client.Religion || "",
          },
          Status: client.Status || "",
        };
      }
    );

    setMasterClients(bindClientsDetails);
    setTempClients(bindClientsDetails);
    setLoading(false);
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const addNewClientDetails = async (
  formatData: IMasterClientDetails,
  setMasterClients: any,
  setTempClients: any,
  setPopupControl: any,
  setLoading: any
) => {
  debugger;
  try {
    setLoading(true);
    const payloadJson = {
      Status: "Active",
      FirstName: formatData?.FirstName,
      LastName: formatData?.LastName,
      PreferredName: formatData?.PreferredName,
      Pronouns: formatData?.Pronouns,
      Gender: formatData?.Gender?.value,
      DateOfBirth: new Date(formatData?.DateOfBirth),
      Age: formatData?.Age,
      PreferredLanguage: formatData?.PreferredLanguage?.value,
      Employment: formatData?.Employment,
      Education: formatData?.Education,
      Income: formatData?.Income,

      ServiceTypeId: formatData?.ServiceTypes
        ? { results: formatData?.ServiceTypes.map((val: any) => val.value) }
        : null,
      ClientIDNumber: formatData?.ClientID,
      HomePhone: formatData?.HomePhoneNo,
      MobilePhone: formatData?.MobilePhoneNo,
      WorkPhone: formatData?.WorkPhoneNo,
      Email: formatData?.EmailId,
      Location: formatData?.Location,
      ContactPreference: formatData?.ContactPreference?.value,
      Address: formatData?.Address,
      City: formatData?.City,
      State: formatData?.State,
      EName: formatData?.EmergencyName,
      EMobilePhone: formatData?.EmergencyPhoneNo,
      EEmail: formatData?.EmergencyEmailId,
      ContactDetails: formatData?.ContactDetails?.value,
      Relationship: formatData?.Relationship,
      Occupation: formatData?.Occupation,
      HealthInsurance: formatData?.HealthInsurance?.value,
      Refferal: formatData?.Referral?.value,
      MaritalStatus: formatData?.MaritalStatus?.value,
      Religion: formatData?.Religion?.value,
    };
    await SpServices.SPAddItem({
      Listname: constants.Listnames.ClientDetails,
      RequestJSON: payloadJson,
    }).then((res: any) => {
      console.log("Add Client response", res);

      const newAppointmentDetails: IMasterClientDetails = {
        ...formatData,
        Id: res.data?.Id,
        Status: "Active",
      };

      setMasterClients((prev: any) => {
        const updated = [...prev, newAppointmentDetails];
        return updated.sort((a, b) => b.Id - a.Id); // sort by Id DESC
      });

      setTempClients((prev: any) => {
        const updated = [...prev, newAppointmentDetails];
        return updated.sort((a, b) => b.Id - a.Id); // sort by Id DESC
      });
      // setMasterClients((prev: any) => {
      //   return [...prev, newAppointmentDetails];
      // });
      // setTempClients((prev: any) => {
      //   return [...prev, newAppointmentDetails];
      // });
      setPopupControl("");
      setLoading(false);
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const updateClientDetails = async (
  formatData: IMasterClientDetails,
  setMasterClients: any,
  setTempClients: any,
  setPopupControl: any,
  setLoading: any
) => {
  debugger;
  try {
    setLoading(true);
    const payloadJson = {
      FirstName: formatData?.FirstName,
      LastName: formatData?.LastName,
      PreferredName: formatData?.PreferredName,
      Pronouns: formatData?.Pronouns,
      Gender: formatData?.Gender?.value,
      DateOfBirth: new Date(formatData?.DateOfBirth),
      Age: formatData?.Age,
      PreferredLanguage: formatData?.PreferredLanguage?.value,
      Employment: formatData?.Employment,
      Education: formatData?.Education,
      Income: formatData?.Income,

      ServiceTypeId: formatData?.ServiceTypes
        ? { results: formatData?.ServiceTypes.map((val: any) => val.value) }
        : null,
      ClientIDNumber: formatData?.ClientID,
      HomePhone: formatData?.HomePhoneNo,
      MobilePhone: formatData?.MobilePhoneNo,
      WorkPhone: formatData?.WorkPhoneNo,
      Email: formatData?.EmailId,
      Location: formatData?.Location,
      ContactPreference: formatData?.ContactPreference?.value,
      Address: formatData?.Address,
      City: formatData?.City,
      State: formatData?.State,
      EName: formatData?.EmergencyName,
      EMobilePhone: formatData?.EmergencyPhoneNo,
      EEmail: formatData?.EmergencyEmailId,
      ContactDetails: formatData?.ContactDetails?.value,
      Relationship: formatData?.Relationship,
      Occupation: formatData?.Occupation,
      HealthInsurance: formatData?.HealthInsurance?.value,
      Refferal: formatData?.Referral?.value,
      MaritalStatus: formatData?.MaritalStatus?.value,
      Religion: formatData?.Religion?.value,
    };
    await SpServices.SPUpdateItem({
      Listname: constants.Listnames.ClientDetails,
      ID: formatData?.Id,
      RequestJSON: payloadJson,
    }).then((res: any) => {
      console.log("Add Client response", res);
      setMasterClients((prev: any) => {
        return prev.map((item: any) =>
          item.Id === formatData?.Id ? { ...item, ...formatData } : item
        );
      });

      setTempClients((prev: any) => {
        return prev.map((item: any) =>
          item.Id === formatData?.Id ? { ...item, ...formatData } : item
        );
      });
      setPopupControl("");
      setLoading(false);
    });
  } catch (err) {
    console.log("Error : ", err);
  }
};

export const validateClientForm = (formData: any): any => {
  if (!formData.FirstName) {
    return {
      isValid: false,
      error: { key: "FirstName", errorMessage: "Please enter first name." },
    };
  }
  if (!formData.LastName) {
    return {
      isValid: false,
      error: { key: "LastName", errorMessage: "Please enter last name." },
    };
  }
  if (!formData.PreferredName) {
    return {
      isValid: false,
      error: {
        key: "PreferredName",
        errorMessage: "Please enter preferred name.",
      },
    };
  }
  if (!formData.Age) {
    return {
      isValid: false,
      error: {
        key: "Age",
        errorMessage: "Please enter age.",
      },
    };
  }
  if (formData.ServiceTypes?.length === 0) {
    return {
      isValid: false,
      error: {
        key: "ServiceTypes",
        errorMessage: "Please select service type.",
      },
    };
  }
  if (!formData?.MobilePhoneNo) {
    return {
      isValid: false,
      error: {
        key: "MobilePhoneNo",
        errorMessage: "Please enter mobile number.",
      },
    };
  }
  if (!formData?.EmailId) {
    return {
      isValid: false,
      error: {
        key: "EmailId",
        errorMessage: "Please enter email id.",
      },
    };
  }
  if (!formData?.EmergencyPhoneNo) {
    return {
      isValid: false,
      error: {
        key: "EmergencyPhoneNo",
        errorMessage: "Please enter emergencey phone number.",
      },
    };
  }
  if (!formData?.EmergencyEmailId) {
    return {
      isValid: false,
      error: {
        key: "EmergencyEmailId",
        errorMessage: "Please enter emergencey email id.",
      },
    };
  }

  return { isValid: true };
};
