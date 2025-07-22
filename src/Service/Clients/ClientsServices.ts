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
    });
    console.log("clientsResponse", clientsResponse);

    const bindClientsDetails: IMasterClientDetails[] = clientsResponse.map(
      (client) => {
        return {
          Id: client.Id,
          FirstName: client.FirstName,
          LastName: client.LastName,
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
          HomePhoneNo: client.HomePhone || "",
          MobilePhoneNo: client.MobilePhone || "",
          WorkPhoneNo: client.WorkPhone || "",
          EmailId: client.Email || "",
          Location: client.Location || "",
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
      Gender: formatData?.Gender?.value,
      DateOfBirth: new Date(formatData?.DateOfBirth),
      ServiceTypeId: formatData?.ServiceTypes
        ? { results: formatData?.ServiceTypes.map((val: any) => val.value) }
        : null,
      ClientIDNumber: formatData?.ClientID,
      HomePhone: formatData?.HomePhoneNo,
      MobilePhone: formatData?.MobilePhoneNo,
      WorkPhone: formatData?.WorkPhoneNo,
      Email: formatData?.EmailId,
      Location: formatData?.Location,
      Address: formatData?.Address,
      City: formatData?.City,
      State: formatData?.State,
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
        return [...prev, newAppointmentDetails];
      });
      setTempClients((prev: any) => {
        return [...prev, newAppointmentDetails];
      });
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
      Status: "Active",
      FirstName: formatData?.FirstName,
      LastName: formatData?.LastName,
      Gender: formatData?.Gender?.value,
      DateOfBirth: new Date(formatData?.DateOfBirth),
      ServiceTypeId: formatData?.ServiceTypes
        ? { results: formatData?.ServiceTypes.map((val: any) => val.value) }
        : null,
      ClientIDNumber: formatData?.ClientID,
      HomePhone: formatData?.HomePhoneNo,
      MobilePhone: formatData?.MobilePhoneNo,
      WorkPhone: formatData?.WorkPhoneNo,
      Email: formatData?.EmailId,
      Location: formatData?.Location,
      Address: formatData?.Address,
      City: formatData?.City,
      State: formatData?.State,
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
