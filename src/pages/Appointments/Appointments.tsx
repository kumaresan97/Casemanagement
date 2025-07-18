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
import { formatDate } from "@fullcalendar/core";
import { Button, Card, Modal } from "antd";
import { cases, IAppointmentDetails } from "../../Types/Type";

import "./Appointments.css";
import {
  addNewAppointment,
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
import TextAreaField from "../../Components/Formfields/TextArea/CustomTextArea";
import * as moment from "moment";
import { useSelector } from "react-redux";

const appointmentDetails = {
  Id: 0,
  Case: {
    value: null,
    label: "",
  },
  ServiceTypes: [],
  AppointmentSDateTime: "",
  AppointmentEDateTime: "",
  CaseManager: {
    id: null,
    email: "",
    name: "",
  },
  BillableType: {
    value: null,
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
  const [upComingAppointments, setUpComingAppointments] = useState<any[]>([]);
  const [popupControl, setPopupControl] = useState<boolean>(false);
  console.log("masterAppointments", masterAppointments);
  console.log("tempAppointments", tempAppointments);
  console.log("upComingAppointments", upComingAppointments);
  console.log("popupControl", popupControl);
  console.log("caseDetails", caseDetails);
  console.log("formData", formData);

  const onButtonClick = () => {
    setPopupControl(true);
    setFormData(appointmentDetails);
  };

  const bindUpcomingAppointments = async () => {
    const upcomingAppointments = tempAppointments
      .filter((item) => {
        const appointmentStart = new Date(item.AppointmentSDateTime);
        const now = new Date();
        return appointmentStart >= now;
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
    bindUpcomingAppointments();
  }, [tempAppointments]);
  useEffect(() => {
    console.log("rendered");
    bindCaseDeatilsOptions();
  }, [caseDetails]);

  const handleSearch = (searchText: string) => {
    console.log("searchText", searchText);

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

  const handleOk = () => {
    setTimeout(() => {
      setPopupControl(false);
    }, 3000);
  };

  const handleCancel = () => {
    setPopupControl(false);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (key === "Case") {
      const filteredDetails = caseDetails?.filter((item) => {
        return item?.Id === value?.value && item?.CaseName === value?.label;
      });
      setFormData((prev: any) => ({
        ...prev,
        CaseManager: filteredDetails[0]?.CCaseManager,
        ServiceTypes: filteredDetails[0]?.CCServiceType,
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
          setPopupControl
        );
      } else {
        updateAppointment(
          formData,
          setMasterAppointments,
          setTempAppointments,
          setPopupControl
        );
      }
    } else {
      setResponseState({
        key: result.error?.key,
        errorMessage: result.error?.errorMessage,
      });
    }
  };

  return (
    <div className={styles.appointments_Container}>
      <PageHeader
        title="Appointments"
        showFilter
        showSearch
        showRefresh
        buttonTitle="Add appointment"
        buttonIcon={<PlusCircleOutlined />}
        onSearch={handleSearch}
        onFilter={() => console.log("Filter clicked")}
        onRefresh={() => console.log("Refresh clicked")}
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
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={mappedEvents}
            dayMaxEventRows={2}
            eventMaxStack={2}
            moreLinkClick="popover"
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />
        </div>
        <div
          className="upcoming-appointments-wrapper"
          style={{ width: "25%", padding: "0px 0px 0px 15px" }}
        >
          <h3 style={{ margin: "0px", padding: "5px 0px 10px 0px" }}>
            Upcoming Appointments
          </h3>
          <div
            className={styles.upcoming_appointment_container}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {upComingAppointments?.length === 0 && (
              <div style={{ textAlign: "center", color: "gray" }}>
                No upcoming appointments
              </div>
            )}
            {upComingAppointments.map((appt) => {
              const start = dayjs(appt.AppointmentSDateTime);
              const end = dayjs(appt.AppointmentEDateTime);
              return (
                <Card
                  key={appt.Id}
                  style={{
                    border: "none",
                    borderLeft: "3px solid #cfa21e",
                    borderRadius: "0px 10px 10px 0px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ textAlign: "center", width: 50 }}>
                      <div style={{ fontSize: 20, fontWeight: 600 }}>
                        {start.format("DD")}
                      </div>
                      <div style={{ color: "#1890ff", fontWeight: 500 }}>
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
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <CustomTooltip title="Edit" width={100} placement="top">
                        <EditIcon
                          onClick={() => console.log("Edit")}
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
                          onClick={() => console.log("Delete")}
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
            <TextAreaField
              label="Case notes"
              rows={3}
              value={formData?.Notes}
              onChange={(val) => handleChange("Notes", val)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;
