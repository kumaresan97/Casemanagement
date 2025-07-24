/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useEffect, useState } from "react";
import PageHeader from "../../Components/pageHeader/Pageheader";
import styles from "./Clients.module.scss";
import {
  addNewClientDetails,
  fetchClientsDetails,
  fetchServiceTypes,
  updateClientDetails,
  validateClientForm,
} from "../../Service/Clients/ClientsServices";
import InputField from "../../Components/Formfields/Textfield/CustomTextfield";
import DatePickerField from "../../Components/Formfields/Calendar/CustomCalendar";
import SelectField from "../../Components/Formfields/Dropdown/CustomDropdown";
import CustomTooltip from "../../Components/Tooltip/CustomTooltip";
import { PlusCircleOutlined } from "@ant-design/icons";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonTable from "../../Components/Table/CustomTable";
import { Button } from "antd";
import RadioBoxGroup from "../../Components/Formfields/RadioButton/CustomRadioButton";
import TextAreaField from "../../Components/Formfields/TextArea/CustomTextArea";
import { IMasterClientDetails, SelectOption } from "../../Types/Type";
import { getChoiceDropdownOptions } from "../../Service/getChoice";
import { constants } from "../../config/constants";
const clientDetails: IMasterClientDetails = {
  Id: 0,
  FirstName: "",
  LastName: "",
  PreferredName: "",
  Pronouns: "",
  Age: "",
  Gender: {
    value: "",
    label: "",
  },
  DateOfBirth: "",
  ServiceTypes: [],
  ClientID: "",
  PreferredLanguage: {
    value: "",
    label: "",
  },
  Employment: "",
  Income: "",
  HomePhoneNo: "",
  MobilePhoneNo: "",
  WorkPhoneNo: "",
  EmailId: "",
  Location: "",
  Education: "",
  Occupation: "",
  ContactPreference: {
    value: "",
    label: "",
  },
  ContactDetails: {
    value: "",
    label: "",
  },
  City: "",
  State: "",
  Address: "",
  EmergencyName: "",
  EmergencyPhoneNo: "",
  Relationship: "",
  EmergencyEmailId: "",
  HealthInsurance: {
    value: "",
    label: "",
  },
  Referral: {
    value: "",
    label: "",
  },
  MaritalStatus: {
    value: "",
    label: "",
  },
  Religion: {
    value: "",
    label: "",
  },
};

const Clients: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isClientNewForm, setIsClientNewForm] = useState<string>("");
  const [responseState, setResponseState] = useState<{
    key: string;
    errorMessage: string;
  }>({
    key: "",
    errorMessage: "",
  });
  const [formData, setFormData] = useState<IMasterClientDetails>(clientDetails);
  const [masterClients, setMasterClients] = useState<IMasterClientDetails[]>(
    []
  );
  const [tempClients, setTempClients] = useState<IMasterClientDetails[]>([]);
  const [serviceTypesOptions, setServiceTypesOptions] = useState<
    SelectOption[]
  >([]);
  const [searchText, setSearchText] = useState<string>("");
  const [getChoiceData, setGetChoiceData] = useState<any>([]);

  const onButtonClick = () => {
    setIsClientNewForm("New");
    setFormData(clientDetails);
  };
  console.log("formData", formData);
  console.log("masterClients", masterClients);
  console.log("getChoiceData", getChoiceData);

  const fetchChoices = async () => {
    const allOptions = await getChoiceDropdownOptions(
      [
        "PreferredLanguage",
        "Refferal",
        "Religion",
        "MaritalStatus",
        "HealthInsurance",
        "Gender",
        "ContactPreference",
        "ContactDetails",
      ],
      constants.Listnames.ClientDetails
    );
    setGetChoiceData(allOptions);
    console.log("options: ", allOptions);
  };

  useEffect(() => {
    fetchChoices();
    fetchServiceTypes(setServiceTypesOptions);
    fetchClientsDetails(setMasterClients, setTempClients, setLoading);
  }, []);

  const column: any[] = [
    {
      title: "Client ID",
      dataIndex: "ClientID",
      key: "ClientID",
      render: (text: string) => (
        <a style={{ color: "#B78E1A", fontWeight: 500 }}>{text}</a>
      ),
    },
    {
      title: "Client name",
      dataIndex: "FirstName",
      key: "FirstName",
      render: (text: string, client: IMasterClientDetails) => (
        <a style={{ color: "#B78E1A", fontWeight: 500 }}>
          {client?.FirstName} {client?.LastName}
        </a>
      ),
    },
    {
      title: "Mobile No",
      dataIndex: "MobilePhoneNo",
      key: "MobilePhoneNo",
    },
    {
      title: "E Mail",
      dataIndex: "EmailId",
      key: "EmailId",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      // render: (status: string) => (
      //   <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      // ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <CustomTooltip title="Edit">
            <EditIcon
              sx={{
                cursor: "pointer",
                color: "#CFA21E ",
                width: "20px",
                height: "20px",
              }}
              onClick={() => {
                setIsClientNewForm("Edit");
                setFormData(record);
              }}
            />
          </CustomTooltip>
          <CustomTooltip title="View">
            <VisibilityIcon
              sx={{
                cursor: "pointer",
                color: "#ADADAD",
                width: "20px",
                height: "20px",
              }}
              onClick={() => {
                setIsClientNewForm("View");
                setFormData(record);
              }}
            />
          </CustomTooltip>
        </div>
      ),
    },
  ];

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    setLoading(true);
    const lowerSearch = searchText.toLowerCase();
    const filteredData = masterClients.filter((item: IMasterClientDetails) => {
      const matchClientName = `${item?.FirstName} ${item?.LastName}`
        ?.toLowerCase()
        ?.includes(lowerSearch);
      const matchClientId =
        item?.ClientID?.toLowerCase()?.includes(lowerSearch);
      const matchMailId = item?.EmailId?.toLowerCase()?.includes(lowerSearch);
      return matchClientName || matchClientId || matchMailId;
    });
    setTempClients(filteredData);
    setLoading(false);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    //   setResponseState((prev) => {
    //     return { ...prev, key: "", errorMessage: "" };
    //   });
  };

  const handleCancel = () => {
    setIsClientNewForm("");
  };

  const submitClientDetails = () => {
    const result = validateClientForm(formData);
    debugger;
    if (result.isValid) {
      setResponseState({ key: "", errorMessage: "" });
      if (isClientNewForm === "New") {
        addNewClientDetails(
          formData,
          setMasterClients,
          setTempClients,
          setIsClientNewForm,
          setLoading
        );
      } else {
        updateClientDetails(
          formData,
          setMasterClients,
          setTempClients,
          setIsClientNewForm,
          setLoading
        );
      }
    } else {
      setResponseState({
        key: result.error?.key,
        errorMessage: result.error?.errorMessage,
      });
    }
  };

  return isClientNewForm === "" ? (
    <div className={styles.clients_Container}>
      <PageHeader
        title="Clients"
        showFilter={false}
        showSearch
        showRefresh={false}
        buttonTitle="Create Client"
        buttonIcon={<PlusCircleOutlined />}
        onSearch={handleSearch}
        searchText={searchText}
        searchPlaceholder="Search"
        // onFilter={() => console.log("Filter clicked")}
        // onRefresh={() => console.log("Refresh clicked")}
        onButtonClick={onButtonClick}
      />
      <CommonTable columns={column} data={tempClients} loading={loading} />
    </div>
  ) : (
    <div className={styles.clients_Container}>
      <PageHeader
        title={`${
          isClientNewForm === "New"
            ? "Create Client"
            : isClientNewForm === "Edit"
            ? "Edit Client"
            : "View Client"
        }`}
        showFilter={false}
        showSearch={false}
        showRefresh={false}
        buttonTitle=""
        buttonIcon=""
      />
      <div className={styles.client_form_wrapper}>
        <div className={styles.Client_form_section}>
          <div className={styles.client_form_sec_title}>Basic Details</div>
          <div className={styles.client_form_grid}>
            <div className={styles.margin_right}>
              <InputField
                label="Pronouns"
                value={formData?.Pronouns}
                onChange={(val) => handleChange("Pronouns", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="First Name"
                value={formData?.FirstName}
                onChange={(val) => handleChange("FirstName", val)}
                required
                readOnly={isClientNewForm === "View"}
                error={
                  responseState?.key === "FirstName" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Last Name"
                value={formData?.LastName}
                onChange={(val) => handleChange("LastName", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "LastName" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div>
              <InputField
                label="Preferred name"
                value={formData?.PreferredName}
                onChange={(val) => handleChange("PreferredName", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "PreferredName" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <DatePickerField
                value={formData.DateOfBirth}
                label="Date of birth"
                onChange={(val) => handleChange("DateOfBirth", val)}
                disabled={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Age"
                value={formData?.Age}
                onChange={(val) => handleChange("Age", val)}
                required
                readOnly={isClientNewForm === "View"}
                error={
                  responseState?.key === "Age" && responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <RadioBoxGroup
                label="Gender"
                value={formData.Gender}
                onChange={(val) => handleChange("Gender", val)}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "others", value: "others" },
                ]}
                disabled={isClientNewForm === "View"}
              />
            </div>

            <div>
              <SelectField
                label="Default Service Type"
                disableWrapper
                multiple
                value={formData?.ServiceTypes}
                onChange={(val) => handleChange("ServiceTypes", val)}
                //   options={caseData.ServiceType}
                options={serviceTypesOptions}
                required
                disabled={isClientNewForm === "View"}
                error={
                  responseState?.key === "ServiceTypes" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Client ID number"
                value={formData?.ClientID}
                onChange={(val) => handleChange("ClientID", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <SelectField
                label="Preferred language"
                value={formData?.PreferredLanguage}
                disabled={isClientNewForm === "View"}
                options={getChoiceData?.PreferredLanguage || []}
                onChange={(val) => handleChange("PreferredLanguage", val)}
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Employment"
                value={formData?.Employment}
                onChange={(val) => handleChange("Employment", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Income"
                value={formData?.Income}
                onChange={(val) => handleChange("Income", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Education"
                value={formData?.Education}
                onChange={(val) => handleChange("Education", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Occupation"
                value={formData?.Occupation}
                onChange={(val) => handleChange("Occupation", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
          </div>
          <div className={styles.client_form_sec_title}>Contact Details</div>
          <div className={styles.client_form_grid}>
            <div className={styles.margin_right}>
              <InputField
                label="Home Phone"
                value={formData?.HomePhoneNo}
                onChange={(val) => handleChange("HomePhoneNo", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Mobile Phone"
                value={formData?.MobilePhoneNo}
                onChange={(val) => handleChange("MobilePhoneNo", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "MobilePhoneNo" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Work Phone"
                value={formData?.WorkPhoneNo}
                onChange={(val) => handleChange("WorkPhoneNo", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Email"
                value={formData?.EmailId}
                onChange={(val) => handleChange("EmailId", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "EmailId" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <SelectField
                label="Contact preference"
                value={formData?.ContactPreference}
                options={getChoiceData.ContactPreference}
                disabled={isClientNewForm === "View"}
                onChange={(val) => handleChange("ContactPreference", val)}
              />
            </div>
            <div>
              <SelectField
                label="Contact Details"
                value={formData?.ContactDetails}
                options={getChoiceData.ContactDetails}
                disabled={isClientNewForm === "View"}
                onChange={(val) => handleChange("ContactDetails", val)}
              />
            </div>
          </div>
          <div className={styles.client_form_sec_title}>Address Details</div>
          <div className={styles.client_form_grid}>
            <div className={styles.margin_right}>
              <InputField
                label="Location"
                value={formData?.Location}
                onChange={(val) => handleChange("Location", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="City"
                value={formData?.City}
                onChange={(val) => handleChange("City", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="State"
                value={formData?.State}
                onChange={(val) => handleChange("State", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <TextAreaField
                label="Address"
                value={formData?.Address}
                onChange={(val) => handleChange("Address", val)}
                readOnly={isClientNewForm === "View"}
                rows={2}
              />
            </div>
          </div>
          <div className={styles.client_form_sec_title}>Emergency Contacts</div>
          <div className={styles.client_form_grid}>
            <div className={styles.margin_right}>
              <InputField
                label="Name"
                value={formData?.EmergencyName}
                onChange={(val) => handleChange("EmergencyName", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Mobile phone"
                value={formData?.EmergencyPhoneNo}
                onChange={(val) => handleChange("EmergencyPhoneNo", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "EmergencyPhoneNo" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div className={styles.margin_right}>
              <InputField
                label="Relationship"
                value={formData?.Relationship}
                onChange={(val) => handleChange("Relationship", val)}
                readOnly={isClientNewForm === "View"}
              />
            </div>
            <div>
              <InputField
                label="Email"
                value={formData?.EmergencyEmailId}
                onChange={(val) => handleChange("EmergencyEmailId", val)}
                readOnly={isClientNewForm === "View"}
                required
                error={
                  responseState?.key === "EmergencyEmailId" &&
                  responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
          </div>
          <div className={styles.client_form_sec_title}>Other Details</div>
          <div className={styles.client_form_grid}>
            <div className={styles.margin_right}>
              <SelectField
                label="Health insurance"
                disableWrapper
                value={formData?.HealthInsurance}
                onChange={(val) => handleChange("HealthInsurance", val)}
                //   options={caseData.ServiceType}
                options={[
                  { label: "No insurance", value: "No insurance" },
                  { label: "Govt", value: "Govt" },
                  { label: "Private", value: "Private" },
                ]}
                disabled={isClientNewForm === "View"}
              />
            </div>
            <div>
              <SelectField
                label="Referral"
                disableWrapper
                value={formData?.Referral}
                onChange={(val) => handleChange("Referral", val)}
                //   options={caseData.ServiceType}
                options={[{ label: "ALTSA", value: "ALTSA" }]}
                disabled={isClientNewForm === "View"}
              />
            </div>
            <div className={styles.margin_right}>
              <SelectField
                label="Marital Status"
                disableWrapper
                value={formData?.MaritalStatus}
                onChange={(val) => handleChange("MaritalStatus", val)}
                //   options={caseData.ServiceType}
                options={getChoiceData.MaritalStatus}
                disabled={isClientNewForm === "View"}
              />
            </div>
            <div>
              <SelectField
                label="Religion"
                disableWrapper
                value={formData?.Religion}
                onChange={(val) => handleChange("Religion", val)}
                //   options={caseData.ServiceType}
                options={[
                  { label: "Hindu", value: "Hindu" },
                  { label: "Christian", value: "Christian" },
                  { label: "Muslim", value: "Muslim" },
                ]}
                disabled={isClientNewForm === "View"}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <button
            className={styles.calcelBtn}
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <Button
            type="primary"
            onClick={() => submitClientDetails()}
            className={styles.btn}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
