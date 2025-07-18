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
import { getCaseDocuments, uploadFilesToLibrary } from "../../../Service/AllCases/AllCaseService";
import CustomButton from "../../../Components/Button/CustomButton";




const Documents = () => {

    const selectedCase = useSelector((state: any) => state.data.selectedCase);

    // Use it
    console.log("Selected Case:", selectedCase);
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [documentsData, setDocumentsData] = useState<any[]>([]);
    let caseFolderName = `Case-${selectedCase.Id}-${selectedCase.CaseName}`.replace(
        /\s+/g,
        ""
    );
    const loadDocuments = async () => {
        const data = await getCaseDocuments(caseFolderName);
        setDocumentsData(data);
    };


    const handleUploadClick = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setFileList([]);
    };
    const handleSubmit = async () => {
        const uploadList: any = fileList.map(file => ({
            name: file.name,
            originFileObj: file.originFileObj,
        }));
        // const caseFolderName = `Case-${selectedCase.Id}-${selectedCase.CaseName}`.replace(
        //     /\s+/g,
        //     ""
        // );

        await uploadFilesToLibrary(uploadList, `CaseDocuments/${caseFolderName}`); message.success("Files uploaded successfully!");
        await loadDocuments()
        setFileList([]); // Clear files
        setVisible(false);  // Close modal
    };


    // const documentsData = [
    //     {
    //         key: "1",
    //         name: "Casenotes.pdf",
    //         date: "12/05/2025",
    //         status: "Pending",
    //     },
    //     {
    //         key: "2",
    //         name: "Eligibility.pdf",
    //         date: "12/05/2025",
    //         status: "Pending",
    //     },
    //     {
    //         key: "3",
    //         name: "Diagnostics.pdf",
    //         date: "12/05/2025",
    //         status: "Pending",
    //     },
    // ];
    const documentsColumns = [
        {
            title: <input type="checkbox" />, // header checkbox
            dataIndex: "checkbox",
            key: "checkbox",
            render: () => <input type="checkbox" />,
            width: 50,
        },
        {
            title: "Document name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => (
                <span >
                    {text}
                </span>
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: () => (
                <div >
                    <EyeOutlined style={{ marginRight: 10, color: "#000" }} />
                    <DownloadOutlined style={{ color: "#f0b400" }} />
                </div>
            ),
        },
    ];

    useEffect(() => {


        loadDocuments();
    }, []);
    return (
        <div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <p>Documents</p>
                <CustomButton label="Upload" bgColor="#cfa21e" color="#fff" type="primary" borderRadius={4} onClick={handleUploadClick}
                    style={{ border: "none" }}
                />

                {/* <Button type="primary" onClick={handleUploadClick}>Upload</Button> */}
            </div>


            <CommonTable columns={documentsColumns}
                data={documentsData}

            />

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
                            onClick={handleSubmit}
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