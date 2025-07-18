/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import styles from "./CaseManagers.module.scss";
import PageHeader from "../../Components/pageHeader/Pageheader";
import { useEffect, useState } from "react";
import { fetchCaseDetailsbyManagers } from "../../Service/CaseManagers/CaseManagersServices";
import { ICaseManagersDetails } from "../../Types/Type";

const CashManagers: React.FC = () => {
  const [masterCMDetails, setMasterCMDetails] = useState<
    ICaseManagersDetails[]
  >([]);
  const [tempCMDetails, setTempCMDetails] = useState<ICaseManagersDetails[]>(
    []
  );
  console.log("masterCMDetails", masterCMDetails);
  console.log("tempCMDetails", tempCMDetails);

  useEffect(() => {
    fetchCaseDetailsbyManagers(setMasterCMDetails, setTempCMDetails);
  }, []);

  const handleSearch = (searchText: string) => {
    console.log("searchText", searchText);

    const lowerSearch = searchText.toLowerCase();

    const filteredData = masterCMDetails.filter(
      (item: ICaseManagersDetails) => {
        const matchUserName =
          item?.UserName?.toLowerCase()?.includes(lowerSearch);
        const matchActiveCount = item?.CaseCount?.toString()
          ?.toLowerCase()
          ?.includes(lowerSearch);

        return matchUserName || matchActiveCount;
      }
    );
    setTempCMDetails(filteredData);
  };

  return (
    <div className={styles.cashManager_Container}>
      <PageHeader
        title="Case Managers"
        showFilter={false}
        showSearch
        showRefresh
        buttonTitle=""
        buttonIcon=""
        onSearch={handleSearch}
        onFilter={() => console.log("Filter clicked")}
        onRefresh={() => console.log("Refresh clicked")}
      />
      <div className={styles.cardGrid}>
        {tempCMDetails?.map((manager: ICaseManagersDetails) => {
          const badgeColor =
            manager.CaseCount > 7
              ? "red"
              : manager.CaseCount > 3
              ? "yellow"
              : "green";

          return (
            <div className={styles.managerCard} key={manager.UserEmail}>
              <div className={styles.header}>
                <img
                  src={`/_layouts/15/userphoto.aspx?size=S&username=${manager?.UserEmail}`}
                  className={styles.avatar}
                  alt={manager.UserName}
                />
                <span
                  className={`${styles.statusDot} ${
                    styles[badgeColor as keyof typeof styles]
                  }`}
                ></span>
              </div>
              <div>
                <div className={styles.content}>
                  <div className={styles.name}>{manager?.UserName}</div>
                  <div className={styles.caseText}>
                    Active cases{" "}
                    <span
                      className={`${styles.caseCount} ${
                        styles[badgeColor as keyof typeof styles]
                      }`}
                    >
                      {String(manager?.CaseCount).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <button className={styles.viewBtn}>view</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CashManagers;
