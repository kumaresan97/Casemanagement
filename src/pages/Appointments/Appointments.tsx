/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./Appointments.module.scss";
import PageHeader from "../../Components/pageHeader/Pageheader";
import { useEffect, useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import { Button, Card, Modal } from "antd";
import { cases, IAppointmentDetails } from "../../Types/Type";

import "./Appointments.css";
import {
  addNewAppointment,
  deleteAppointment,
  fetchAppointmentDetails,
  fetchCaseDeatils,
  updateAppointment,
  validateAppointmentForm,
} from "../../Service/Appointments/AppointmentsServices";
import * as dayjs from "dayjs";
import CustomTooltip from "../../Components/Tooltip/CustomTooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../assets/css/style.css";
import SelectField from "../../Components/Formfields/Dropdown/CustomDropdown";
import CustomCalendarDateTime from "../../Components/Formfields/CalendarDateTime/CustomCalendarDateTime";
import InputField from "../../Components/Formfields/Textfield/CustomTextfield";
// import TextAreaField from "../../Components/Formfields/TextArea/CustomTextArea";
import * as moment from "moment";
import { useSelector } from "react-redux";
import CustomEditor from "../../Components/QuilEditor/CustomQuilEditor";
import CustomMessage from "../../Components/Message/Message";

const toastDetails = {
  IsShow: false,
  Type: "",
  Message: "",
};

const appointmentDetails = {
  Id: 0,
  Case: {
    value: null as number | null,
    label: "",
  },
  ServiceTypes: [] as any[], // Explicitly type as any[]
  AppointmentSDateTime: "",
  AppointmentEDateTime: "",
  CaseManager: {
    id: 0,
    email: "",
    name: "",
  },
  BillableType: {
    value: "",
    label: "",
  },
  Notes:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
    "when an unknown printer took a galley.",
};

const Appointments: React.FC = () => {
  const currentUserDetails = useSelector(
    (state: any) => state?.data?.currentUserDetails
  );
  console.log("currentUserDetails", currentUserDetails);

  const [toastMessage, setToastMessage] = useState(toastDetails);
  const [formData, setFormData] = useState(appointmentDetails);
  const [responseState, setResponseState] = useState<{
    key: string;
    errorMessage: string;
  }>({
    key: "",
    errorMessage: "",
  });
  const [caseDetails, setCaseDetails] = useState<cases[]>([]);
  const [caseDetailsOptions, setCaseDetailsOptions] = useState<any[]>([]);
  const [masterAppointments, setMasterAppointments] = useState<
    IAppointmentDetails[]
  >([]);
  const [tempAppointments, setTempAppointments] = useState<
    IAppointmentDetails[]
  >([]);
  const [upComingAppointments, setUpComingAppointments] = useState<
    IAppointmentDetails[]
  >([]);
  const [popupControl, setPopupControl] = useState<boolean>(false);
  const [delPopupControl, setDelPopupControl] = useState<boolean>(false);
  const [deleteApptId, setDeleteApptId] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("")

  console.log("masterAppointments", masterAppointments);
  console.log("tempAppointments", tempAppointments);
  console.log("upComingAppointments", upComingAppointments);
  console.log("popupControl", popupControl);
  console.log("caseDetails", caseDetails);
  console.log("formData", formData);
  console.log("deleteApptId", deleteApptId);

  const onButtonClick = () => {
    setPopupControl(true);
    setFormData(appointmentDetails);
  };

  const bindTodayAppointments = async () => {
    const today = dayjs().format("YYYY-MM-DD");
    const upcomingAppointments = tempAppointments
      .filter((item) => {
        const appointmentDate = dayjs(item.AppointmentSDateTime).format(
          "YYYY-MM-DD"
        );
        return appointmentDate === today;
      })
      .sort((a, b) => {
        return (
          new Date(a.AppointmentSDateTime).getTime() -
          new Date(b.AppointmentSDateTime).getTime()
        );
      });
    setUpComingAppointments(upcomingAppointments);
  };
  const bindCaseDeatilsOptions = async () => {
    const tempOptions = caseDetails.map((item) => {
      return {
        value: item?.Id,
        label: item?.CaseName,
      };
    });
    setCaseDetailsOptions(tempOptions);
  };

  const fetchAndSetCaseDetails = async () => {
    const caseDetailsList: cases[] = (await fetchCaseDeatils()) ?? [];
    setCaseDetails(caseDetailsList);
  };

  useEffect(() => {
    console.log("rendered");
    fetchAppointmentDetails(setMasterAppointments, setTempAppointments);
    fetchAndSetCaseDetails();
  }, []);
  useEffect(() => {
    console.log("rendered");
    bindTodayAppointments();
  }, [tempAppointments]);
  useEffect(() => {
    console.log("rendered");
    bindCaseDeatilsOptions();
  }, [caseDetails]);

  const handleSearch = (searchText: string) => {
    console.log("searchText", searchText);
    setSearchText(searchText)
    const lowerSearch = searchText.toLowerCase();

    const filteredData = masterAppointments.filter(
      (item: IAppointmentDetails) => {
        const matchCaseLabel = item?.Case?.label
          ?.toLowerCase()
          ?.includes(lowerSearch);
        const matchCreatedAt = item?.CreadedBy?.name
          ?.toLowerCase()
          ?.includes(lowerSearch);
        // const matchBillable = item?.BillableType?.label
        //   ?.toLowerCase()
        //   ?.includes(lowerSearch);
        const filtered = item?.ServiceTypes?.filter((option) =>
          option.label.toLowerCase().includes(lowerSearch)
        );

        return matchCaseLabel || matchCreatedAt || filtered?.length > 0;
      }
    );
    setTempAppointments(filteredData);
  };

  const mappedEvents = tempAppointments?.map((item: any) => ({
    id: item?.Id,
    title: item?.Case?.label,
    start: item?.AppointmentSDateTime,
    end: item?.AppointmentEDateTime,
    extendedProps: {
      createdBy: item?.CreadedBy?.name,
      type: item?.ServiceTypes,
      caseId: item?.Case?.value,
      caseManagerId: item?.CaseManager?.id,
      caseManagerEmail: item?.CaseManager?.email,
      caseManagerName: item?.CaseManager?.name,
      billableType: item?.BillableType?.value,
      caseNotes: item?.Notes,
    },
  }));

  function renderEventContent(arg: any) {
    const { event } = arg;
    const { title, extendedProps } = event;
    // const type = extendedProps.type;
    const createdBy = extendedProps.createdBy;
    const start = formatDate(event.start, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "local",
      locale: "en-US",
    });

    const end = formatDate(event.end, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "local",
      locale: "en-US",
    });

    // const truncate = (str: string, maxLength: number): string => {
    //   if (!str) return "";
    //   return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
    // };

    return (
      <div className="custom-event-wrapper">
        <div className="event-title-text" title={title}>
          {title}
        </div>
        <div className="event-time-text">
          {start}
          {" - "}
          {end}
        </div>
        <div className="event-creater-text">{createdBy}</div>
      </div>
    );
  }

  const handleEventClick = (
    info: import("@fullcalendar/core").EventClickArg
  ) => {
    const selectedEvent = info.event;

    const eventStart = moment(selectedEvent?.start);

    // Only proceed if the event start is after the current date/time


    document.querySelectorAll(".fc-popover-close").forEach((btn: any) => btn.click());

    // Optional: prevent default navigation if it's a link
    info.jsEvent.preventDefault();
    if (eventStart.isAfter(moment())) {
      setFormData({
        ...formData,
        Id: parseFloat(selectedEvent?.id),
        Case: {
          value: selectedEvent?.extendedProps?.caseId,
          label: selectedEvent?.title,
        },
        AppointmentSDateTime: eventStart.format("YYYY-MM-DD HH:mm:ss"),
        AppointmentEDateTime: moment(selectedEvent?.end).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        ServiceTypes: selectedEvent?.extendedProps?.type,
        CaseManager: {
          id: selectedEvent?.extendedProps?.caseManagerId,
          email: selectedEvent?.extendedProps?.caseManagerEmail,
          name: selectedEvent?.extendedProps?.caseManagerName,
        },
        BillableType: {
          value: selectedEvent?.extendedProps?.billableType,
          label: selectedEvent?.extendedProps?.billableType,
        },
        Notes: selectedEvent?.extendedProps?.caseNotes,
      });
      setPopupControl(true);
    }
  };

  const handleDateClick = (arg: { date: Date }) => {
    const clickedDate = dayjs(arg.date).format("YYYY-MM-DD");

    const matchedEvents = tempAppointments.filter(
      (event) =>
        dayjs(event.AppointmentSDateTime).format("YYYY-MM-DD") === clickedDate
    );

    console.log("Events for clicked date:", clickedDate, matchedEvents);
    setUpComingAppointments(matchedEvents);

    // Optional: set in state and show in modal
  };

  const handleOk = () => {
    setTimeout(() => {
      setPopupControl(false);
      setDelPopupControl(false);
      setDeleteApptId(0);
    }, 3000);
  };

  const handleCancel = () => {
    setPopupControl(false);
    setDelPopupControl(false);
    setDeleteApptId(0);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (key === "Case") {
      const filteredDetails = caseDetails?.filter((item) => {
        return item?.Id === value?.value && item?.CaseName === value?.label;
      });
      setFormData((prev: any) => ({
        ...prev,
        CaseManager: filteredDetails[0]?.CaseManager,
        ServiceTypes: filteredDetails[0]?.ServiceType,
      }));
    }
    setResponseState((prev) => {
      return { ...prev, key: "", errorMessage: "" };
    });
  };

  const submitAppointMentForm = () => {
    const result = validateAppointmentForm(formData);

    if (result.isValid) {
      setResponseState({ key: "", errorMessage: "" });
      if (formData.Id === 0 || formData.Id === null) {
        addNewAppointment(
          formData,
          setMasterAppointments,
          setTempAppointments,
          currentUserDetails,
          setPopupControl,
          setToastMessage
        );
      } else {
        updateAppointment(
          formData,
          setMasterAppointments,
          setTempAppointments,
          setPopupControl,
          setToastMessage
        );
      }
    } else {
      setResponseState({
        key: result.error?.key,
        errorMessage: result.error?.errorMessage,
      });
    }
  };

  const deleteAppointmentFunction = () => {
    deleteAppointment(
      deleteApptId,
      setMasterAppointments,
      setTempAppointments,
      setDelPopupControl,
      setDeleteApptId,
      setToastMessage
    );
  };

  const getAppointmentStatus = (
    startDateTime: string,
    endDateTime: string
  ): "completed" | "inprogress" | "upcoming" => {
    const now = dayjs();
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);

    if (now.isBefore(start)) {
      return "upcoming";
    } else if (now.isAfter(end)) {
      return "completed";
    } else {
      return "inprogress";
    }
  };

  return (
    <div className={styles.appointments_Container}>
      <CustomMessage
        IsShow={toastMessage?.IsShow}
        Type={toastMessage?.Type}
        Message={toastMessage?.Message}
        setToast={setToastMessage}
      />
      <PageHeader
        title="Appointments"
        showFilter={false}
        showSearch
        showRefresh={false}
        searchPlaceholder="Search"
        searchText={searchText}
        buttonTitle="Add appointment"
        buttonIcon={<PlusCircleOutlined />}
        onSearch={handleSearch}
        // onFilter={() => console.log("Filter clicked")}
        // onRefresh={() => console.log("Refresh clicked")}
        onButtonClick={onButtonClick}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          // borderTop: "1px solid #d6d6d6",
          paddingTop: "8px",
        }}
      >
        <div style={{ width: "75%" }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={mappedEvents}
            dayMaxEventRows={2}
            eventMaxStack={2}
            moreLinkClick="popover"
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
        <div
          className="upcoming-appointments-wrapper"
          style={{ width: "25%", padding: "0px 0px 0px 15px" }}
        >
          <h3 style={{ margin: "0px", padding: "5px 0px 10px 0px" }}>
            Appointments
          </h3>
          <div
            className={styles.upcoming_appointment_container}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {upComingAppointments?.length === 0 && (
              <div style={{ textAlign: "center", color: "gray" }}>
                No appointments
              </div>
            )}
            {upComingAppointments.map((appt) => {
              const start = dayjs(appt.AppointmentSDateTime);
              const end = dayjs(appt.AppointmentEDateTime);
              const status = getAppointmentStatus(
                appt.AppointmentSDateTime,
                appt.AppointmentEDateTime
              );
              return (
                <Card
                  key={appt.Id}
                  style={{
                    border: "none",
                    // borderLeft: "3px solid #cfa21e",
                    // borderRadius: "0px 10px 10px 0px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        width: 50,
                        // border: "1px solid #bec7e9",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          backgroundColor: "#7d77ea",
                          color: "#fff",
                          borderRadius: "5px 5px 0px 0px",
                        }}
                      >
                        {start.format("DD")}
                      </div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#7d77ea",
                          backgroundColor: "#f8f1dd",
                          borderRadius: "0px 0px 5px 5px",
                        }}
                      >
                        {start.format("ddd")}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#93741b",
                          fontSize: "14px",
                        }}
                      >
                        {appt?.Case?.label}
                      </div>
                      {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      ></div> */}
                      <div
                        style={{
                          fontWeight: 600,
                          marginTop: 4,
                          fontSize: "13px",
                        }}
                      >
                        {appt.ServiceTypes?.map((type: any) => type?.label)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ color: "gray", marginTop: 2, fontSize: "12px" }}
                    >
                      {start.format("hh:mm A")} to {end.format("hh:mm A")}
                    </span>
                    {status === "upcoming" ? (
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <CustomTooltip title="Edit" width={100} placement="top">
                          <EditIcon
                            onClick={() => {
                              setFormData({
                                ...formData,
                                Id: Number(appt?.Id),
                                Case: {
                                  value: Number(appt?.Case?.value),
                                  label: appt?.Case?.label,
                                },
                                AppointmentSDateTime: moment(
                                  appt?.AppointmentSDateTime
                                ).format("YYYY-MM-DD HH:mm:ss"),
                                AppointmentEDateTime: moment(
                                  appt?.AppointmentEDateTime
                                ).format("YYYY-MM-DD HH:mm:ss"),
                                ServiceTypes: appt?.ServiceTypes,
                                CaseManager: appt?.CaseManager
                                  ? {
                                    id: Number(appt?.CaseManager?.id),
                                    email: appt?.CaseManager?.email ?? "",
                                    name: appt?.CaseManager?.name ?? "",
                                  }
                                  : { id: 0, email: "", name: "" },
                                BillableType: {
                                  value: String(appt?.BillableType?.value),
                                  label: String(appt?.BillableType?.value),
                                },
                                Notes: appt?.Notes ?? "",
                              });
                              setPopupControl(true);
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#e3f2fd",
                              padding: "4px",
                              borderRadius: "6px",
                              marginRight: "8px",
                              fontSize: "24px",
                              "&:hover": {
                                backgroundColor: "#bbdefb",
                              },
                            }}
                          />
                        </CustomTooltip>
                        <CustomTooltip title="Delete">
                          <DeleteIcon
                            onClick={() => {
                              setDelPopupControl(true);
                              setDeleteApptId(Number(appt?.Id));
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#ffebee",
                              padding: "4px",
                              borderRadius: "6px",
                              fontSize: "24px",
                              color: "#f44336",
                              "&:hover": {
                                backgroundColor: "#ffcdd2",
                              },
                            }}
                          />
                        </CustomTooltip>
                      </div>
                    ) : status === "inprogress" ? (
                      <div className={styles.inprogress_pill}>In progress</div>
                    ) : (
                      <div className={styles.completed_pill}>Completed</div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        open={popupControl}
        width={"70%"}
        title="Appointment Details"
        // title={[
        //   <div>
        //     <h3>Appointment Details</h3>
        //   </div>,
        // ]}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className={styles.calcelBtn}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <Button
              type="primary"
              onClick={() => submitAppointMentForm()}
              className={styles.btn}
            >
              Submit
            </Button>
          </div>,
        ]}
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
          className="appointtment-form"
        >
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <div style={{ width: "49%" }}>
              <SelectField
                label="Case details"
                disableWrapper
                value={formData.Case}
                options={caseDetailsOptions}
                onChange={(val) => handleChange("Case", val)}
                required
                disabled={formData?.Id !== 0 || formData?.Id === null}
                error={
                  responseState?.key === "Case" && responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
          </div>
          {formData?.ServiceTypes?.length > 0 && (
            <div>
              <label>Service Types</label>
              <div style={{ margin: "5px 0px 23px 0px" }}>
                {formData?.ServiceTypes?.map((item: any, index: number) => {
                  return (
                    <span className={styles.service_pill} key={index}>
                      {item?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <div style={{ width: "50%" }}>
              <CustomCalendarDateTime
                label="Start date & time"
                disableWrapper
                value={formData.AppointmentSDateTime}
                minDate={moment().format("YYYY-MM-DD HH:mm:ss")}
                onChange={(val) => {
                  handleChange("AppointmentSDateTime", val);
                  // handleChange("AppointmentEDateTime", val);
                }}
                required
                error={
                  responseState?.key === "AppointmentSDateTime" &&
                    responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
            <div style={{ width: "50%" }}>
              <CustomCalendarDateTime
                label="Start date & time"
                disableWrapper
                value={formData.AppointmentEDateTime}
                minDate={formData.AppointmentSDateTime}
                maxDate={moment(formData.AppointmentSDateTime)
                  .endOf("day")
                  .format("YYYY-MM-DD HH:mm:ss")}
                onChange={(val) => handleChange("AppointmentEDateTime", val)}
                required
                disabled={formData.AppointmentSDateTime === "" ? true : false}
                error={
                  responseState?.key === "AppointmentEDateTime" &&
                    responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
          </div>
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <div style={{ width: "50%" }}>
              <InputField
                label="Case manager"
                value={formData?.CaseManager?.name}
                disableWrapper
                // onChange={(val) => handleChange("Date", val)}
                readOnly
                required
              />
            </div>
            <div style={{ width: "50%" }}>
              <SelectField
                label="Billable Type"
                disableWrapper
                value={formData.BillableType}
                options={[
                  { label: "Billable", value: "Billable" },
                  { label: "Non-billable", value: "Non-billable" },
                ]}
                onChange={(val) => handleChange("BillableType", val)}
                required
                error={
                  responseState?.key === "BillableType" &&
                    responseState?.errorMessage
                    ? responseState?.errorMessage
                    : ""
                }
              />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            {/* <TextAreaField
              label="Case notes"
              rows={3}
              value={formData?.Notes}
              onChange={(val) => handleChange("Notes", val)}
            /> */}
            <CustomEditor
              value={formData.Notes}
              onChange={(val) => handleChange("Notes", val)}
              label="Notes"
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={delPopupControl}
        width={"30%"}
        title="Appointment Details"
        // title={[
        //   <div>
        //     <h3>Appointment Details</h3>
        //   </div>,
        // ]}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className={styles.calcelBtn}
              type="button"
              onClick={handleCancel}
            >
              No
            </button>
            <Button
              type="primary"
              onClick={() => deleteAppointmentFunction()}
              className={styles.btn}
            >
              Yes
            </Button>
          </div>,
        ]}
      >
        Are you sure want to delte the appointment?
      </Modal>
    </div>
  );
};

export default Appointments;
