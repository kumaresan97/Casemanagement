/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */



import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SelectField from "../../../Components/Formfields/Dropdown/CustomDropdown";
import CheckpointGroup from "../../../Components/Formfields/Checkbox/CustomCheckbox";
import TextAreaField from "../../../Components/Formfields/TextArea/CustomTextArea";
// import CustomButton from "../../../Components/Button/CustomButton";
import styles from "../Case.module.scss"
import CustomFooterBtn from "../../../Components/FooterBtn/CustomFooterBtn";
import { createEligibilityEntry, fetchEligibilityCheckpoints, fetchEligibilityConfigs, fetchExistingEligibility, recycleEligibilityEntry, updateEligibilityEntry } from "../../../Service/AllCases/AllCaseService";
import { message } from "antd";
import Loader from "../../../Components/Spinner/Loader";


// const Eligibility = () => {
//     const { id } = useParams();
//     const [configList, setConfigList] = useState<any[]>([]);
//     const [selectedEligibility, setSelectedEligibility] = useState<any | null>(null);
//     const [checkpointOptions, setCheckpointOptions] = useState<any[]>([]);
//     const [selectedCheckpoints, setSelectedCheckpoints] = useState<number[]>([]);
//     const [descriptionHtml, setDescriptionHtml] = useState<string>("");
//     const [status, setStatus] = useState<any | null>(null);
//     const [comments, setComments] = useState<string>("");
//     const [existingEntryId, setExistingEntryId] = useState<number | null>(null);
//     const [existingEligibilityId, setExistingEligibilityId] = useState<number | null>(null);





//     const loadCheckpoints = async (eligibility: string) => {
//         const related = await sp.web.lists
//             .getByTitle("EligibilityConfig")
//             .items.select("Id", "Eligibility", "CriteriaPoints", "Description")
//             .filter(`Eligibility eq '${eligibility.trim()}'`)
//             .get();
//         console.log("related: ", related);

//         setCheckpointOptions(related);
//         setDescriptionHtml(related[0]?.Description || "");
//     };

//     const handleEligibilityChange = async (value: any) => {
//         setSelectedEligibility(value);
//         // setSelectedCheckpoints([]);
//         // setDescriptionHtml("");
//         await loadCheckpoints(value.value);
//     };


//     const handleSave = async () => {
//         if (!selectedEligibility) return;

//         const selectedConfig = configList.find(c => c.Eligibility === selectedEligibility.value);

//         if (!selectedConfig) {
//             alert("Eligibility configuration not found.");
//             return;
//         }

//         // Check if it's a change in eligibility
//         const isChanged = selectedConfig.Id !== existingEligibilityId;

//         // Delete old entry only if eligibility changed
//         if (existingEntryId && isChanged) {
//             await sp.web.lists.getByTitle("Eligibility").items.getById(existingEntryId).recycle();
//         }

//         // Add new only if no existing or eligibility changed
//         if (!existingEntryId || isChanged) {
//             await sp.web.lists.getByTitle("Eligibility").items.add({
//                 Title: "Eligibility Entry",
//                 CaseId: Number(id),
//                 EligibilityId: selectedConfig.Id,
//                 EligibilityCheckPointsId: selectedCheckpoints?.length
//                     ? { results: selectedCheckpoints.map((val: any) => Number(val)) }
//                     : null,
//                 Status: status.value || "",
//                 Comments: comments,
//             });

//             alert("Eligibility saved successfully!");
//         } else {
//             // Eligibility is same – update the existing entry
//             await sp.web.lists.getByTitle("Eligibility").items.getById(existingEntryId).update({
//                 EligibilityCheckPointsId: selectedCheckpoints?.length
//                     ? { results: selectedCheckpoints.map((val: any) => Number(val)) }
//                     : null,
//                 Status: status.value,
//                 Comments: comments,
//             });

//             alert("Eligibility updated successfully!");
//         }
//     };



//     useEffect(() => {
//         const loadConfigs = async () => {
//             const configs = await sp.web.lists
//                 .getByTitle("EligibilityConfig")
//                 .items.select("Id", "Eligibility", "CriteriaPoints", "Description", "MarkAsMain")
//                 .get();

//             setConfigList(configs);

//             // Try default selection
//             const supportive = configs.find(c => c.Eligibility === "Supportive Housing");
//             const markAsMain = configs.find(c => c.MarkAsMain === "Yes");

//             const defaultConfig = supportive || markAsMain || configs[0];

//             if (defaultConfig) {
//                 // setSelectedEligibility(defaultConfig.Eligibility);
//                 const data = {
//                     label: defaultConfig.Eligibility,
//                     value: defaultConfig.Eligibility
//                 }
//                 setSelectedEligibility(data)
//                 await loadCheckpoints(defaultConfig.Eligibility);
//                 setDescriptionHtml(defaultConfig.Description || "");
//             }
//         };

//         loadConfigs();
//     }, []);
//     useEffect(() => {
//         const loadExistingEligibility = async () => {
//             if (!id || configList.length === 0) return;

//             const results = await sp.web.lists
//                 .getByTitle("Eligibility")
//                 .items.select("Id", "Status", "Comments", "EligibilityCheckPoints/ID", "Eligibility/ID", "Case/Id")
//                 .expand("Eligibility", "EligibilityCheckPoints", "Case")
//                 .filter(`CaseId eq ${Number(id)}`)
//                 .top(1)
//                 .get();
//             console.log("results: ", results);

//             if (results.length > 0) {
//                 const item = results[0];
//                 const eligibilityId = item.Eligibility?.ID;

//                 const configItem = configList.find(cfg => cfg.Id === eligibilityId);
//                 const eligName = configItem?.Eligibility || "";
//                 const Checkpoints = {
//                     label: configItem?.Eligibility || "",
//                     value: configItem?.Eligibility || ""
//                 }

//                 setSelectedEligibility(Checkpoints);
//                 setStatus({ label: item.Status, value: item.Status });
//                 setComments(item.Comments || "");
//                 setSelectedCheckpoints(item.EligibilityCheckPoints?.map((cp: any) => cp.ID) || []);
//                 setExistingEntryId(item.Id);
//                 setExistingEligibilityId(item.Eligibility?.ID || null);


//                 await loadCheckpoints(eligName);
//             } else {
//                 // No existing entry, select default
//                 const defaultItem = configList.find(c => c.MarkAsMain === true);
//                 if (defaultItem) {
//                     const eligiblity = {
//                         label: defaultItem.Eligibility,
//                         value: defaultItem.Eligibility
//                     }
//                     setSelectedEligibility(eligiblity);
//                     setDescriptionHtml(defaultItem.Description || "");
//                     await loadCheckpoints(defaultItem.Eligibility);
//                 }
//             }
//         };

//         loadExistingEligibility();
//     }, [id, configList]);


//     return (
//         <div >
//             <div style={{ width: "200px" }}>


//                 <SelectField
//                     label="Select Eligibility"

//                     value={selectedEligibility}
//                     options={configList
//                         .filter((val) => val?.MarkAsMain === true)
//                         .map((c) => ({
//                             label: c.Eligibility,
//                             value: c.Eligibility
//                         }))}
//                     onChange={(val) => handleEligibilityChange(val)}
//                 />
//             </div>

//             {selectedEligibility && (
//                 <>


//                     <CheckpointGroup
//                         label="Treatment Modality"
//                         options={checkpointOptions.map(cp => cp.CriteriaPoints)} // ['Suicide', 'Violence', ...]
//                         value={checkpointOptions
//                             .filter(cp => selectedCheckpoints.includes(cp.Id))
//                             .map(cp => cp.CriteriaPoints)} // ['Suicide', 'Violence']
//                         onChange={(selectedCriteriaPoints) => {
//                             const selectedIds = checkpointOptions
//                                 .filter(cp => (selectedCriteriaPoints as string[]).includes(cp.CriteriaPoints))
//                                 .map(cp => cp.Id);
//                             setSelectedCheckpoints(selectedIds);
//                         }}
//                         multiple
//                         direction="vertical"
//                     />


//                     <h4 style={{ marginTop: 16 }}>Description</h4>
//                     <div

//                         dangerouslySetInnerHTML={{ __html: descriptionHtml }}
//                     />

//                     <div style={{ marginTop: 16, width: "220px" }}>


//                         <SelectField label="Status" onChange={val => setStatus(val)} value={status} options={[
//                             {
//                                 label: "Eligible", value: "Eligible"
//                             },
//                             {
//                                 label: "Ineligible", value: "Ineligible"
//                             }
//                         ]} />
//                     </div>

//                     <div style={{ marginTop: 16 }}>
//                         <TextAreaField
//                             label="Comments"
//                             rows={4}
//                             value={comments}
//                             onChange={(val) => setComments(val)}
//                         />
//                     </div>



//                     <CustomButton label="Save" type="primary" bgColor="#b78e1a" color="#fff" onClick={handleSave} style={{ border: "1px solid #b78e1a  !important" }} />
//                 </>
//             )}
//         </div>
//     );
// };

// export default Eligibility;



interface IConfig {
    Id: number;
    Eligibility: string;
    CriteriaPoints: string;
    Description: string;
    MarkAsMain?: string | boolean;
}

// interface IEligibilityItem {
//     Id: number;
//     Eligibility: { ID: number };
//     EligibilityCheckPoints: { ID: number }[];
//     Status: string;
//     Comments: string;
//     Case: { Id: number };
// }

interface IFormData {
    eligibility?: { label: string; value: string };
    checkpoints: number[];
    status?: { label: string; value: string };
    comments: string;
}

const Eligibility = () => {
    // const { id } = useParams();
    // const [configList, setConfigList] = useState<IConfig[]>([]);
    // const [checkpointOptions, setCheckpointOptions] = useState<IConfig[]>([]);
    // const [descriptionHtml, setDescriptionHtml] = useState("");
    // const [formData, setFormData] = useState<IFormData>({
    //     eligibility: undefined,
    //     checkpoints: [],
    //     status: undefined,
    //     comments: "",
    // });
    // const [existingIds, setExistingIds] = useState<{
    //     entryId: number | null;
    //     eligibilityId: number | null;
    // }>({ entryId: null, eligibilityId: null });

    // const handleChange = <K extends keyof IFormData>(key: K, value: IFormData[K]) => {
    //     setFormData((prev) => ({ ...prev, [key]: value }));
    // };

    // const loadCheckpoints = async (eligibility: string) => {
    //     const related = await sp.web.lists
    //         .getByTitle("EligibilityConfig")
    //         .items.select("Id", "Eligibility", "CriteriaPoints", "Description")
    //         .filter(`Eligibility eq '${eligibility.trim()}'`)
    //         .get();

    //     setCheckpointOptions(related);
    //     setDescriptionHtml(related[0]?.Description || "");
    // };

    // const handleEligibilityChange = async (val: any) => {
    //     handleChange("eligibility", val);
    //     handleChange("checkpoints", []);
    //     await loadCheckpoints(val.value);
    // };



    // const loadConfigs = async () => {
    //     const configs = await sp.web.lists
    //         .getByTitle("EligibilityConfig")
    //         .items.select("Id", "Eligibility", "CriteriaPoints", "Description", "MarkAsMain")
    //         .get();

    //     setConfigList(configs);

    //     const defaultConfig =
    //         configs.find(c => c.Eligibility === "Supportive Housing") ||
    //         configs.find(c => c.MarkAsMain === "Yes") ||
    //         configs[0];

    //     if (defaultConfig) {
    //         const eligibility = { label: defaultConfig.Eligibility, value: defaultConfig.Eligibility };
    //         handleChange("eligibility", eligibility);
    //         setDescriptionHtml(defaultConfig.Description || "");
    //         await loadCheckpoints(defaultConfig.Eligibility);
    //     }
    // };

    // const loadExistingEligibility = async () => {
    //     if (!id || configList.length === 0) return;

    //     const results: IEligibilityItem[] = await sp.web.lists
    //         .getByTitle("Eligibility")
    //         .items.select("Id", "Status", "Comments", "EligibilityCheckPoints/ID", "Eligibility/ID", "Case/Id")
    //         .expand("Eligibility", "EligibilityCheckPoints", "Case")
    //         .filter(`CaseId eq ${Number(id)}`)
    //         .top(1)
    //         .get();

    //     if (results.length > 0) {
    //         const item = results[0];
    //         const eligibilityId = item.Eligibility?.ID;
    //         const configItem = configList.find(cfg => cfg.Id === eligibilityId);

    //         if (configItem) {
    //             const eligibility = { label: configItem.Eligibility, value: configItem.Eligibility };

    //             setFormData({
    //                 eligibility,
    //                 status: { label: item.Status, value: item.Status },
    //                 comments: item.Comments || "",
    //                 checkpoints: item.EligibilityCheckPoints?.map(cp => cp.ID) || [],
    //             });

    //             setExistingIds({
    //                 entryId: item.Id,
    //                 eligibilityId: item.Eligibility?.ID || null,
    //             });

    //             await loadCheckpoints(configItem.Eligibility);
    //         }
    //     }
    // };

    // const handleSave = async () => {
    //     const selected = configList.find(c => c.Eligibility === formData.eligibility?.value);
    //     if (!selected) return alert("Eligibility configuration not found.");

    //     const isChanged = selected.Id !== existingIds.eligibilityId;
    //     const { entryId } = existingIds;

    //     const payload = {
    //         Title: "Eligibility Entry",
    //         CaseId: Number(id),
    //         EligibilityId: selected.Id,
    //         EligibilityCheckPointsId: formData.checkpoints.length
    //             ? { results: formData.checkpoints }
    //             : null,
    //         Status: formData.status?.value || "",
    //         Comments: formData.comments || "",
    //     };

    //     if (entryId && isChanged) {
    //         await sp.web.lists.getByTitle("Eligibility").items.getById(entryId).recycle();
    //     }

    //     if (!entryId || isChanged) {
    //         await sp.web.lists.getByTitle("Eligibility").items.add(payload);
    //         await loadConfigs();

    //         alert("Eligibility saved successfully!");
    //     } else {
    //         await sp.web.lists.getByTitle("Eligibility").items.getById(entryId).update({
    //             EligibilityCheckPointsId: payload.EligibilityCheckPointsId,
    //             Status: payload.Status,
    //             Comments: payload.Comments,
    //         });
    //         await loadConfigs();

    //         alert("Eligibility updated successfully!");
    //     }
    // };

    // useEffect(() => {
    //     loadConfigs();
    // }, []);

    // useEffect(() => {
    //     loadExistingEligibility();
    // }, [configList]);



    const { id } = useParams();
    const [configList, setConfigList] = useState<IConfig[]>([]);
    const [checkpointOptions, setCheckpointOptions] = useState<IConfig[]>([]);
    const [descriptionHtml, setDescriptionHtml] = useState("");
    const [formData, setFormData] = useState<IFormData>({
        eligibility: undefined,
        checkpoints: [],
        status: undefined,
        comments: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const [existingIds, setExistingIds] = useState({
        entryId: null as number | null,
        eligibilityId: null as number | null,
    });

    const handleChange = <K extends keyof IFormData>(key: K, value: IFormData[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleEligibilityChange = async (val: any) => {
        handleChange("eligibility", val);
        handleChange("checkpoints", []);
        const checkpoints = await fetchEligibilityCheckpoints(val.value);
        setCheckpointOptions(checkpoints);
        setDescriptionHtml(checkpoints[0]?.Description || "");
    };

    const loadConfigs = async () => {
        setIsLoading(true);
        try {
            const configs = await fetchEligibilityConfigs();
            setConfigList(configs);

            const defaultConfig =
                configs.find(c => c.Eligibility === "Supportive Housing") ||
                configs.find(c => c.MarkAsMain === true) ||
                configs[0];

            if (defaultConfig) {
                const eligibility = { label: defaultConfig.Eligibility, value: defaultConfig.Eligibility };
                handleChange("eligibility", eligibility);
                setDescriptionHtml(defaultConfig.Description || "");
                const checkpoints = await fetchEligibilityCheckpoints(defaultConfig.Eligibility);
                setCheckpointOptions(checkpoints);
            }
        } catch (err) {
            console.log(err, "failed to eligiblity config");

            message.error("Failed to load eligibility configs");
        } finally {
            setIsLoading(false);
        }
    };

    const loadExisting = async () => {
        if (!id || configList.length === 0) return;
        setIsLoading(true);

        try {
            const result = await fetchExistingEligibility(Number(id));
            if (!result) return;

            const configItem = configList.find(cfg => cfg.Id === result.Eligibility?.ID);
            if (!configItem) return;

            const eligibility = { label: configItem.Eligibility, value: configItem.Eligibility };
            handleChange("eligibility", eligibility);
            handleChange("status", { label: result.Status, value: result.Status });
            handleChange("comments", result.Comments || "");
            handleChange("checkpoints", result.EligibilityCheckPoints?.map((cp: any) => cp.ID) || []);

            setExistingIds({
                entryId: result.Id,
                eligibilityId: configItem.Id,
            });

            const checkpoints = await fetchEligibilityCheckpoints(configItem.Eligibility);
            setCheckpointOptions(checkpoints);
            setDescriptionHtml(configItem.Description || "");
        } catch (err) {
            console.log("Failed to load existing eligibility: ", err);
            message.error("Failed to load existing eligibility");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        const selected = configList.find(c => c.Eligibility === formData.eligibility?.value);
        if (!selected) return message.warning("Eligibility configuration not found");

        const isChanged = selected.Id !== existingIds.eligibilityId;
        const { entryId } = existingIds;

        const payload = {
            Title: "Eligibility Entry",
            CaseId: Number(id),
            EligibilityId: selected.Id,
            EligibilityCheckPointsId: formData.checkpoints.length
                ? { results: formData.checkpoints }
                : null,
            Status: formData.status?.value || "",
            Comments: formData.comments || "",
        };

        setIsLoading(true);
        try {
            if (entryId && isChanged) {
                await recycleEligibilityEntry(entryId);
                await createEligibilityEntry(payload);
                message.success("Eligibility changed and saved successfully");
            } else if (!entryId) {
                await createEligibilityEntry(payload);
                message.success("Eligibility saved successfully");
            } else {
                await updateEligibilityEntry(entryId, payload);
                message.success("Eligibility updated successfully");
            }

            await loadConfigs();
        } catch (err) {
            message.error("Failed to save eligibility");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConfigs();
    }, []);

    useEffect(() => {
        loadExisting();
    }, [configList]);




    const eligibilityOptions = configList
        .filter(val => val?.MarkAsMain === true)
        .map(c => ({ label: c.Eligibility, value: c.Eligibility }));

    const selectedCriteriaPoints = checkpointOptions
        .filter(cp => formData.checkpoints.includes(cp.Id))
        .map(cp => cp.CriteriaPoints);

    return (
        <div>

            {isLoading ? <Loader></Loader> :
                <>
                    <div className={styles.EligibleHeader}>

                        <div className={styles.Eligiblebox}>
                            <SelectField
                                label="Select Eligibility"
                                value={formData.eligibility}
                                options={eligibilityOptions}
                                onChange={handleEligibilityChange}
                            />
                        </div>

                        <p className={styles.EligibleTag}>{"Eligible"}</p>

                    </div>

                    {formData.eligibility && (

                        <>
                            <div className={styles.checkboxContainer}>
                                <p className={styles.Checkboxheader}>Each box must be met for eligibility in the Supportive Housing Program</p>
                                <CheckpointGroup
                                    // label="Treatment Modality"
                                    options={checkpointOptions.map(cp => cp.CriteriaPoints)}
                                    value={selectedCriteriaPoints}
                                    onChange={(selectedPoints) => {
                                        const ids = checkpointOptions
                                            .filter(cp => (selectedPoints as string[]).includes(cp.CriteriaPoints))
                                            .map(cp => cp.Id);
                                        handleChange("checkpoints", ids);
                                    }}
                                    multiple
                                    direction="vertical"
                                />
                            </div>


                            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />

                            <div style={{ marginTop: 16, width: "220px" }}>
                                <SelectField
                                    label="Status"
                                    onChange={val => handleChange("status", val)}
                                    value={formData.status}
                                    options={[
                                        { label: "Eligible", value: "Eligible" },
                                        { label: "Ineligible", value: "Ineligible" }
                                    ]}
                                />
                            </div>

                            <div style={{ marginTop: 16 }}>
                                <TextAreaField
                                    label="Comments"
                                    rows={4}
                                    value={formData.comments}
                                    onChange={(val) => handleChange("comments", val)}
                                />
                            </div>



                            <CustomFooterBtn onSubmit={handleSave} />

                            {/* <CustomButton
                        label="Save"
                        type="primary"
                        bgColor="#b78e1a"
                        color="#fff"
                        onClick={handleSave}
                        style={{ border: "1px solid #b78e1a !important" }}
                    /> */}
                        </>
                    )}
                </>
            }
        </div>
    );
};

export default Eligibility;