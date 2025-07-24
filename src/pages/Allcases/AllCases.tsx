/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import { Avatar, message } from "antd";
import CommonTable from "../../Components/Table/CustomTable";
import PageHeader from "../../Components/pageHeader/Pageheader";
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getAllCases, searchFunction } from "../../Service/AllCases/AllCaseService";
import { cases, SelectOption } from "../../Types/Type";
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';


import { useNavigate } from 'react-router-dom';


import type { ColumnsType } from "antd/es/table";
import CustomTooltip from "../../Components/Tooltip/CustomTooltip";
import EllipsisTag from "../../Components/Tag/Customtag";
import Loader from "../../Components/Spinner/Loader";





const AllCases = () => {
    const [masterData, setMasterData] = useState<cases[]>([])
    const [allCase, setAllCase] = useState<cases[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("")

    const navigate = useNavigate();
    // const [searh, setSearch] = useState<string>("")


    const handleEdit = (record: cases) => {
        console.log("Edit:", record);
        navigate(`/AllCases/${record.Id}`);
    };

    // const handleDelete = (record: cases) => {
    //     console.log("Delete:", record);
    // };


    const columns: ColumnsType<cases> = [
        {
            title: "Case Name",
            dataIndex: "CaseName",
            key: "CaseName",
            width: 150,
            fixed: "left",
        },

        {
            title: "Service Type",
            dataIndex: "ServiceType",
            key: "ServiceType",
            width: 250,

            render: (types: SelectOption[]) =>
                types?.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            // justifyContent: "center", // ✅ center horizontally
                            flexWrap: "wrap",
                            gap: 4,
                        }}
                    >
                        {types.map((t) => (
                            <EllipsisTag key={t?.value} label={t?.label} />
                        ))}
                    </div>
                ) : (
                    "—"
                ),
        },

        {
            title: "Case Manager",
            dataIndex: "CaseManager",
            key: "CaseManager",
            width: 200,
            render: (manager) => {
                if (!manager) return "—";

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar
                            size="small"
                            src={`/_layouts/15/userphoto.aspx?size=S&username=${manager?.email ?? ''}`}
                        />
                        <CustomTooltip title={manager?.name ?? ''} width={120}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
                                {manager?.name ?? '—'}
                            </span>
                        </CustomTooltip>
                    </div>
                );
            },
        },

        {
            title: "Date",
            dataIndex: "Date",
            key: "Date",
            width: 200,
            ellipsis: true
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            width: 200,
            ellipsis: true,
            render: (Status: any) => {
                debugger;
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <EllipsisTag label={Status?.value} style={{
                            borderRadius: "20px",
                            textAlign: "center",
                            border: "none"

                        }} />
                    </div>

                );
            }
        },


        {
            title: "Actions",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (_: any, record: cases) => (
                <>
                    <CustomTooltip title="Edit" width={100} placement="top">
                        <EditIcon
                            onClick={() => handleEdit(record)}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: "#e3f2fd",
                                padding: "4px",
                                borderRadius: "6px",
                                marginRight: "8px",
                                fontSize: "24px",
                                '&:hover': {
                                    backgroundColor: "#bbdefb",
                                },
                            }}
                        />
                    </CustomTooltip>
                    {/* <CustomTooltip title="Delete">
                        <DeleteIcon
                            onClick={() => handleDelete(record)}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: "#ffebee",
                                padding: "4px",
                                borderRadius: "6px",
                                fontSize: "24px",
                                color: "#f44336",
                                '&:hover': {
                                    backgroundColor: "#ffcdd2",
                                },
                            }}
                        />
                    </CustomTooltip> */}
                </>
            ),
        }

    ];

    const handleSearch = (text: string) => {
        console.log(text, "text");
        setSearchText(text)

        const filtered = text
            ? searchFunction(text, masterData)
            : masterData; // reset to full list if cleared
        setAllCase(filtered);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllCases();
                setAllCase(res);
                setMasterData(res)
            } catch (error) {
                console.error("Failed to fetch cases:", error);
                message.error("Error loading case data.");
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    return loading ? <Loader /> : (

        <div style={{
            background: "#ffff",
            padding: "16px"
        }}>



            <PageHeader
                title="All Cases"
                showFilter={false}
                showSearch
                showRefresh={false}
                buttonTitle="Create case"
                buttonIcon={<PlusCircleOutlined />}
                onSearch={handleSearch}
                searchPlaceholder="Search"
                searchText={searchText}
                // onFilter={() => console.log('Filter clicked')}

                // onRefresh={() => console.log('Refresh clicked')}
                onButtonClick={() =>
                    navigate("/cases/new")
                }
            />

            <CommonTable<cases>
                columns={columns}
                data={allCase}
                // loading={loading}
                onRowClick={(record) => console.log("Row clicked:", record)}

            />
        </div>
    );
};

export default AllCases;
