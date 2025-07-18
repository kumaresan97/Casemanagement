export interface ListName {
  ClientDetails: string;
  CaseDetails: string;
  Appointments: string;
  ServiceType: string;
  CaseNotes: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface PeoplePickerUser {
  id: string;
  name: string;
  email: string;
}

export interface CompleteCaseForm {
  // Text / Date fields
  FirstName: string;
  LastName: string;
  PreferredName: string;
  DateOfBirth: string;
  Age: string;
  ClientIDNumber: string;
  HomePhone: string;
  MobilePhone: string;
  WorkPhone: string;
  Email: string;
  Location: string;
  City: string;
  Address: string;
  State: string;
  EName: string;
  EMobilePhone: string;
  EEmail: string;
  Description: string;
  CaseNotes: string;
  FromDateTime: string;
  ToDateTime: string;
  Occupation: string;
  ServiceType: string[];
  CServiceType: string[];
  AServiceType: string[];
  Relationship: string;
  ContactDetails: SelectOption | null;
  ContactPreference: SelectOption | null;
  Refferal: SelectOption | null;
  clientId?: string | number | any;

  // AntD Select fields
  ClientType: SelectOption | null;
  // Pronouns: SelectOption | null;
  Pronouns: string;
  Gender: SelectOption | null;
  PreferredLanguage: SelectOption | null;
  Employment: string;
  Education: string;
  Income: string;
  MaritalStatus: SelectOption | null;
  HealthInsurance: SelectOption | null;
  Religion: SelectOption | null;
  BillableType: SelectOption | null;

  // Lookup fields (string or ID)
  Client: string; // lookup ID or object with id/title
  Case: string;
  attachments: AttachmentFile[] | undefined;

  CaseName: string;

  // People picker fields
  CaseManager: PeoplePickerUser | null;
  CCaseManager: PeoplePickerUser | null;
  ACaseManager: PeoplePickerUser | null;
  CaseManagerId?: number | any;
  ExistingClient?: SelectOption | null;
}

export interface cases {
  Id: number | string;
  Description: string;
  CaseName: string;
  CCaseManager: PeoplePickerUser | null;
  CCServiceType: SelectOption[] | null;
  ClientId?: number | null;
  Status?: string;
  Date?: string | Date;
  ClientDetails?: any;
  BillableType?: SelectOption | null;
}
interface AttachmentFile {
  name: string;
  content: File | Blob;
}

export interface CaseNoteItem {
  type: string;
  date: string;
  content: string;
  billable: boolean;
}

export interface GroupedNotes {
  month: string;
  items: CaseNoteItem[];
}

// case manager interfaces

export interface ICaseManagersDetails {
  UserId: number;
  UserEmail: string;
  UserName: string;
  CaseCount: number;
}

export interface IClientDetails {
  id: number;
  firstName: string;
  lastName: string;
  preferredName: string;
}
export interface IBillableInfoDetails {
  Id: number;
  Case: SelectOption;
  AppointmentSDateTime: string;
  AppointmentEDateTime: string;
  CreadedBy: PeoplePickerUser | null;
  ServiceTypes: SelectOption[];
  CaseManager: PeoplePickerUser | null;
  BillableType: SelectOption;
  Notes: string;
  Type: string;
  ClientDetails: IClientDetails;
  CreatedAt: string;
  CaseStatus: string;
}
export interface IAppointmentDetails {
  Id: number;
  Case: SelectOption;
  AppointmentSDateTime: string;
  AppointmentEDateTime: string;
  CreadedBy: PeoplePickerUser | null;
  ServiceTypes: SelectOption[];
  CaseManager: PeoplePickerUser | null;
  BillableType: SelectOption;
  Notes: string;
}
export interface IClientDetails {
  Id: number;
  FirstNanme: string;
  LastName: string;
  Gender: SelectOption;
  DateOfBirth: string;
  ServiceTypes: SelectOption[];
  ClientID: string;
  HomePhoneNo: string;
  MobilePhoneNo: string;
  WorkPhoneNo: string;
  EmailId: string;
  Location: string;
  City: string;
  State: string;
  Address: string;
  HealthInsurance: SelectOption;
  Referral: SelectOption;
  maritalStatus: SelectOption;
  Religion: string;
}
