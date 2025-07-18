import { cases, CompleteCaseForm, ListName } from "../Types/Type";

export namespace constants {
  export const Listnames: ListName = {
    ClientDetails: "ClientDetails",
    CaseDetails: "CaseDetails",
    Appointments: "Appointments",
    ServiceType: "ServiceType",
    CaseNotes: "CaseNotes",
  };
}

export const initialFormData: CompleteCaseForm = {
  // Strings
  FirstName: "",
  LastName: "",
  PreferredName: "",
  DateOfBirth: "",
  Age: "",
  ClientIDNumber: "",
  HomePhone: "",
  MobilePhone: "",
  WorkPhone: "",
  Email: "",
  Location: "",
  City: "",
  Address: "",
  State: "",
  EName: "",
  EMobilePhone: "",
  EEmail: "",
  Description: "",
  CaseNotes: "",
  FromDateTime: "",
  ToDateTime: "",
  Occupation: "",
  ServiceType: [],
  CServiceType: [],
  AServiceType: [],
  Relationship: "",
  ContactDetails: { label: "", value: "" } || null,
  ContactPreference: { label: "", value: "" } || null,
  Refferal: { label: "", value: "" },
  CaseName: "",

  // Selects
  ClientType: { label: "New", value: "New" } || null,
  // Pronouns: null,
  Pronouns: "",
  Gender: { label: "", value: "" } || null,
  PreferredLanguage: { label: "", value: "" } || null,
  Employment: "",
  Education: "",
  Income: "",
  MaritalStatus: { label: "", value: "" } || null,
  HealthInsurance: { label: "", value: "" } || null,
  Religion: { label: "", value: "" } || null,
  BillableType: { label: "", value: "" } || null,
  ExistingClient: { label: "", value: "" } || null,
  clientId: null,

  // Lookups
  Client: "",
  Case: "",
  attachments: [],

  // People
  CaseManager: null,
  CCaseManager: null,
  ACaseManager: null,
};

export const Cases: cases = {
  Id: "",
  Description: "",
  CaseName: "",
  CCaseManager: {
    id: "",
    name: "",
    email: "",
  },
  CCServiceType: [{ label: "", value: "" }],
  ClientId: null,
  Status: "",
  Date: "",
  BillableType: { label: "", value: "" },
};
