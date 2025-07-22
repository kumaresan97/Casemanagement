/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import styles from "./BillingInfo.module.scss";
import PageHeader from "../../Components/pageHeader/Pageheader";
import { useEffect, useState } from "react";
import { fetchBillableDetails } from "../../Service/BillableInfo/BillableInfoServices";
import { IBillableInfoDetails } from "../../Types/Type";
import CommonTable from "../../Components/Table/CustomTable";
import type { ColumnsType } from "antd/es/table";
import CustomTooltip from "../../Components/Tooltip/CustomTooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EllipsisTag from "../../Components/Tag/Customtag";
import { Avatar } from "antd";
import * as moment from "moment";
import CustomEditor from "../../Components/QuilEditor/CustomQuilEditor";

const BillingInfo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [masterBIDetails, setMasterBIDetails] = useState<
    IBillableInfoDetails[]
  >([]);
  const [tempBIDetails, setBIDetails] = useState<IBillableInfoDetails[]>([]);
  const [billableInfoDetails, setBillableInfoDetails] =
    useState<IBillableInfoDetails>({} as IBillableInfoDetails);

  console.log("masterBIDetails", masterBIDetails);
  console.log("tempBIDetails", tempBIDetails);
  console.log("billableInfoDetails", billableInfoDetails);

  const columns: ColumnsType<IBillableInfoDetails> = [
    {
      title: "Date",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Case Name",
      dataIndex: "CaseName",
      key: "CaseName",
      width: "20%",
      fixed: "left",
      render: (text: string, record: IBillableInfoDetails) => (
        <CustomTooltip title={record?.Case?.label} width={150}>
          <span>{record?.Case?.label}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Client name",
      dataIndex: "ClientDetails",
      key: "ClientDetails",
      width: "20%",
      fixed: "left",
      render: (text: string, record: IBillableInfoDetails) => (
        <CustomTooltip
          title={`${record?.ClientDetails?.firstName}${record?.ClientDetails?.lastName}`}
          width={150}
        >
          <span>
            {record?.ClientDetails?.firstName} {record?.ClientDetails?.lastName}
          </span>
        </CustomTooltip>
      ),
    },
    {
      title: "Billable type",
      dataIndex: "BillableType",
      key: "BillableType",
      width: "20%",
      fixed: "left",
      render: (text: string, record: IBillableInfoDetails) => (
        <CustomTooltip title={record?.BillableType?.label} width={150}>
          <span>{record?.BillableType?.label ?? "—"}</span>
        </CustomTooltip>
      ),
    },
    {
      title: "Appointments",
      dataIndex: "Type",
      key: "Type",
      width: "15%",
      fixed: "left",
      render: (text: string, record: IBillableInfoDetails) => (
        <div>
          <span>{record?.Type === "Appointment" ? "Yes" : "No"}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      fixed: "right",
      render: (_: any, record: IBillableInfoDetails) => (
        <>
          <CustomTooltip title="View" width={100} placement="top">
            <VisibilityIcon
              onClick={() => {
                setShowDetails(true);
                setBillableInfoDetails(record);
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
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchBillableDetails(setMasterBIDetails, setBIDetails);
    setLoading(false);
  }, []);

  const handleSearch = (searchText: string) => {
    console.log("searchText", searchText);

    const lowerSearch = searchText.toLowerCase();

    const filteredData = masterBIDetails.filter(
      (item: IBillableInfoDetails) => {
        const matchCaseLabel = item?.Case?.label
          ?.toLowerCase()
          ?.includes(lowerSearch);
        const matchClientFirst = item?.ClientDetails?.firstName
          ?.toLowerCase()
          ?.includes(lowerSearch);
        const matchClientLast = item?.ClientDetails?.lastName
          ?.toLowerCase()
          ?.includes(lowerSearch);
        const matchCreatedAt =
          item?.CreatedAt?.toLowerCase()?.includes(lowerSearch);
        // const matchBillable = item?.BillableType?.label
        //   ?.toLowerCase()
        //   ?.includes(lowerSearch);
        const matchAppointment = (
          item?.Type === "Appointment" ? "yes" : "no"
        ).includes(lowerSearch);

        return (
          matchCaseLabel ||
          matchClientFirst ||
          matchClientLast ||
          matchCreatedAt ||
          // matchBillable ||
          matchAppointment
        );
      }
    );
    setBIDetails(filteredData);
  };

  return !showDetails ? (
    <div className={styles.billing_info_Container}>
      <PageHeader
        title="Billing Info"
        showFilter
        showSearch
        showRefresh
        buttonTitle=""
        buttonIcon=""
        onSearch={handleSearch}
        onFilter={() => console.log("Filter clicked")}
        onRefresh={() => console.log("Refresh clicked")}
      />
      <CommonTable<IBillableInfoDetails>
        columns={columns}
        data={tempBIDetails}
        loading={loading}
        onRowClick={(record) => console.log("Row clicked:", record)}
      />
    </div>
  ) : (
    <div className={styles.billing_info_Container}>
      <PageHeader
        title={`Billing details for ${billableInfoDetails?.Case?.label}`}
        showFilter={false}
        showSearch={false}
        showRefresh={false}
        buttonTitle=""
        buttonIcon=""
      />
      <div className={styles.billable_info_wrapper}>
        <div className={styles.billable_info_sec_title}>Basic Details</div>
        <div className={styles.billing_info_grid}>
          <div>
            <p className={styles.billable_info_label}>Case Name</p>
            <p className={styles.billable_info_text}>
              {billableInfoDetails?.Case?.label}
            </p>
          </div>
          <div>
            <p className={styles.billable_info_label}>Client Name</p>
            <p className={styles.billable_info_text}>
              {billableInfoDetails?.ClientDetails?.firstName}{" "}
              {billableInfoDetails?.ClientDetails?.lastName}
            </p>
          </div>
          <div>
            <p className={styles.billable_info_label}>Current Status</p>
            <EllipsisTag label={billableInfoDetails?.CaseStatus} />
          </div>
          <div>
            <p className={styles.billable_info_label}>Case Manager</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                size="small"
                src={`/_layouts/15/userphoto.aspx?size=S&username=${
                  billableInfoDetails?.CaseManager?.email ?? ""
                }`}
              />
              <CustomTooltip
                title={billableInfoDetails?.CaseManager?.name ?? ""}
                width={120}
              >
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 120,
                  }}
                >
                  {billableInfoDetails?.CaseManager?.name ?? "—"}
                </span>
              </CustomTooltip>
            </div>
          </div>
          <div>
            <p className={styles.billable_info_label}>Billable Type</p>
            <p className={styles.billable_info_text}>
              {billableInfoDetails?.BillableType?.label}
            </p>
          </div>
          <div>
            <p className={styles.billable_info_label}>Appointment</p>
            <p className={styles.billable_info_text}>
              {billableInfoDetails?.Type === "Appointment" ? "Yes" : "No"}
            </p>
          </div>
          {billableInfoDetails?.Type === "Appointment" && (
            <div>
              <p className={styles.billable_info_label}>From Date & Time</p>
              <p className={styles.billable_info_text}>
                {moment(billableInfoDetails?.AppointmentSDateTime).format(
                  "DD-MM-YYYY hh:mm:ss A"
                )}
              </p>
            </div>
          )}
          {billableInfoDetails?.Type === "Appointment" && (
            <div>
              <p className={styles.billable_info_label}>To Date & Time</p>
              <p className={styles.billable_info_text}>
                {moment(billableInfoDetails?.AppointmentEDateTime).format(
                  "DD-MM-YYYY hh:mm:ss A"
                )}
              </p>
            </div>
          )}
          <div>
            <p className={styles.billable_info_label}>Case Created By</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                size="small"
                src={`/_layouts/15/userphoto.aspx?size=S&username=${
                  billableInfoDetails?.CreadedBy?.email ?? ""
                }`}
              />
              <CustomTooltip
                title={billableInfoDetails?.CreadedBy?.name ?? ""}
                width={120}
              >
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 120,
                  }}
                >
                  {billableInfoDetails?.CreadedBy?.name ?? "—"}
                </span>
              </CustomTooltip>
            </div>
          </div>
          <div>
            <p className={styles.billable_info_label}>Created At</p>
            <p className={styles.billable_info_text}>
              {billableInfoDetails?.CreatedAt}
            </p>
          </div>
        </div>
        <div className={styles.billable_info_sec_title}>Notes</div>
        <div>
          {/* <p>{billableInfoDetails?.Notes || "—"}</p>
           */}
          <CustomEditor
            value={billableInfoDetails?.Notes}
            onChange={(val) => {
              console.log(val);
            }}
            readOnly
          />
        </div>
        <div className={styles.close_btn}>
          <button type="button" onClick={() => setShowDetails(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
