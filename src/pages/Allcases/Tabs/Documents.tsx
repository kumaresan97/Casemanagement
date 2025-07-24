/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react"
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import CommonTable from "../../../Components/Table/CustomTable";
// import { Button } from "antd";
import { Button, message, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllCases, getCaseDocuments, uploadFilesToLibrary } from "../../../Service/AllCases/AllCaseService";
import CustomButton from "../../../Components/Button/CustomButton";
import CustomTooltip from "../../../Components/Tooltip/CustomTooltip";
import { ColumnsType } from "antd/es/table";
import { ICaseDocument } from "../../../Types/Type";
import Loader from "../../../Components/Spinner/Loader";
import { useParams } from "react-router-dom";



let caseFolderName: string
const Documents = () => {
    const { id } = useParams();

    const selectedCase = useSelector((state: any) => state.data.selectedCase);

    // Use it
    console.log("Selected Case:", selectedCase);
    const [visible, setVisible] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [documentsData, setDocumentsData] = useState<ICaseDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // let caseFolderName = `Case-${selectedCase.Id}-${selectedCase.CaseName}`.replace(
    //     /\s+/g,
    //     ""
    // );
    // const loadDocuments = async () => {
    //     const data = await getCaseDocuments(caseFolderName);
    //     console.log("Documents: ", data);

    //     setDocumentsData(data);
    // };


    // const handleUploadClick = () => {
    //     setVisible(true);
    // };

    // const handleCancel = () => {
    //     setVisible(false);
    //     setFileList([]);
    // };
    // const handleSubmit = async () => {
    //     const uploadList: any = fileList.map(file => ({
    //         name: file.name,
    //         originFileObj: file.originFileObj,
    //     }));


    //     await uploadFilesToLibrary(uploadList, `CaseDocuments/${caseFolderName}`); message.success("Files uploaded successfully!");
    //     await loadDocuments()
    //     setFileList([]); // Clear files
    //     setVisible(false);  // Close modal
    // };



    // Load documents from SharePoint folder
    const loadDocuments = async () => {
        setLoading(true);
        try {
            const folder = await getAllCases(Number(id))

            caseFolderName = `Case-${folder[0].Id}-${folder[0].CaseName}`.replace(
                /\s+/g,
                ""
            );


            const data = await getCaseDocuments(caseFolderName);
            setDocumentsData(data);
        } catch (error) {
            message.error("Failed to load documents.");
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false);
        }
    };

    // Open Upload Modal
    const handleUploadClick = () => {
        setVisible(true);
    };

    // Cancel Upload Modal
    const handleCancel = () => {
        setVisible(false);
        setFileList([]);
    };

    // Submit selected files
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const uploadList: any = fileList.map(file => ({
                name: file.name,
                originFileObj: file.originFileObj,
            }));

            await uploadFilesToLibrary(uploadList, `CaseDocuments/${caseFolderName}`);
            message.success("Files uploaded successfully!");

            await loadDocuments(); // Reload documents
            setVisible(false);     // Close modal
            setFileList([]);       // Clear files
        } catch (error) {
            message.error("Failed to upload files.");
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };


    const documentsColumns: ColumnsType<ICaseDocument> = [


        {
            title: "Document name",
            dataIndex: "name",
            key: "name",
            width: 150,
            fixed: "left",

            ellipsis: true, // enables built-in ellipsis
            render: (text: string) => (
                <CustomTooltip title={text} >
                    <span
                        style={{
                            display: "inline-block",
                            // maxWidth: "100%",
                            maxWidth: 150,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {text}
                    </span>
                </CustomTooltip>
            ),
        },

        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 250
        },


        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 150,
            render: (_: any, record: any) => (
                <div>
                    <a
                        href={record.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: 10 }}
                    >
                        <EyeOutlined style={{ color: "#b78e1a" }} />
                    </a>
                    <a
                        href={record.url}
                        download
                    >
                        <DownloadOutlined style={{ color: "#b78e1a" }} />
                    </a>
                </div>
            ),
        }


    ];

    useEffect(() => {


        loadDocuments();
    }, []);
    return (
        <div>
            {loading ? <Loader /> :

                <>


                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <p>Documents</p>
                        <CustomButton label="Upload" bgColor="#cfa21e" color="#fff" type="primary" borderRadius={4} onClick={handleUploadClick}
                            style={{ border: "none" }}
                        />

                        {/* <Button type="primary" onClick={handleUploadClick}>Upload</Button> */}
                    </div>


                    <CommonTable<ICaseDocument>
                        columns={documentsColumns}
                        data={documentsData}

                    />

                </>
            }

            <Modal
                title="Upload Documents"
                open={visible}
                onCancel={handleCancel}
                footer={[
                    <>

                        <CustomButton label="cancel" onClick={handleCancel} bgColor="#adadad"
                            borderRadius={4}
                            color="#fff"
                            style={{ border: "none" }}
                        />
                        <CustomButton label="submit" type="primary"
                            // loading={loading}
                            onClick={() => { handleSubmit() }}
                            bgColor="#cfa21e"
                            borderRadius={4}
                            color="#fff"
                            style={{ border: "none" }}


                            disabled={fileList.length === 0} />
                        {/* <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        // loading={loading}
                        onClick={handleSubmit}
                        disabled={fileList.length === 0}
                    >
                        Submit
                    </Button>, */}
                    </>
                ]}
            >
                <Upload
                    multiple
                    beforeUpload={() => false} // Prevent auto upload
                    fileList={fileList}
                    onChange={({ fileList }) => {
                        console.log(fileList, "filelist");

                        setFileList(fileList)
                    }}
                    onRemove={(file) => {
                        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                    }}
                >
                    <Button icon={<UploadOutlined />}>Select Files</Button>
                </Upload>
            </Modal>


        </div>
    )
}
export default Documents;