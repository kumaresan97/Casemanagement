import React from 'react';
import CommonTable from '../../Components/Table/CustomTable';
import { PlusCircleOutlined } from '@ant-design/icons';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomTooltip from '../../Components/Tooltip/CustomTooltip';
import PageHeader from '../../Components/pageHeader/Pageheader';
const column: any[] = [
    {
        title: 'Client ID',
        dataIndex: 'clientId',
        key: 'clientId',
        render: (text: string) => (
            <a style={{ color: '#B78E1A', fontWeight: 500 }}>{text}</a>
        ),
    },
    {
        title: 'Client name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mobile No',
        dataIndex: 'mobile',
        key: 'mobile',
    },
    {
        title: 'E Mail',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        // render: (status: string) => (
        //   <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
        // ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
            <div style={{ display: 'flex', gap: '12px' }}>
                <CustomTooltip title="Edit">
                    <EditIcon
                        sx={{ cursor: 'pointer', color: '#CFA21E ', width: "20px", height: "20px" }}
                        onClick={() => console.log(record)
                        }
                    />
                </CustomTooltip>
                <CustomTooltip title="View">
                    <VisibilityIcon
                        sx={{ cursor: 'pointer', color: '#ADADAD', width: "20px", height: "20px" }}
                        onClick={() => console.log(record)}
                    />
                </CustomTooltip>
            </div>
        ),
    }
]

export const dummyClients: any[] = [
    {
        clientId: 'AA00373',
        name: 'Arlene McCoy',
        mobile: '(303) 555-0105',
        email: 'tranthuy@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00372',
        name: 'Cody Fisher',
        mobile: '(208) 555-0112',
        email: 'binhan@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00371',
        name: 'Brooklyn Simmons',
        mobile: '(207) 555-0119',
        email: 'thuhang@gmail.com',
        status: 'Inactive',
    },
    {
        clientId: 'AA00370',
        name: 'Darrell Steward',
        mobile: '(319) 555-0115',
        email: 'ckctm12@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00369',
        name: 'Courtney Henry',
        mobile: '(308) 555-0121',
        email: 'thuhang@gmail.com',
        status: 'Inactive',
    },
    {
        clientId: 'AA00368',
        name: 'Esther Howard',
        mobile: '(603) 555-0123',
        email: 'vuhait@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00367',
        name: 'Darlene Robertson',
        mobile: '(907) 555-0101',
        email: 'nvt.isst@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00366',
        name: 'Jacob Jones',
        mobile: '(702) 555-0122',
        email: 'tienlap@gmail.com',
        status: 'Active',
    },
    {
        clientId: 'AA00365',
        name: 'Devon Lane',
        mobile: '(671) 555-0110',
        email: 'binhan@gmail.com',
        status: 'Inactive',
    },
    {
        clientId: 'AA00364',
        name: 'Guy Hawkins',
        mobile: '(505) 555-0125',
        email: 'trungkien@gamail.com',
        status: 'Active',
    }
]

const Client: React.FC = () => {
    // const handleEdit = (record: any) => {
    //     console.log('Edit', record);
    // };

    // const handleView = (record: any) => {
    //     console.log('View', record);
    // };

    return (
        <>
            <PageHeader
                title="Clients"
                showFilter
                showSearch
                showRefresh
                buttonTitle="Create Client"
                searchPlaceholder='Search by client name'
                buttonIcon={<PlusCircleOutlined />}
                // onSearch={handleSearch}
                onFilter={() => console.log('Filter clicked')}
                // onSearch={(val) => {
                //     // setSearchText(val);

                //     const filtered = searchFunction(val, masterData);
                //     setAllCase(filtered);

                // }}
                onRefresh={() => console.log('Refresh clicked')}
            // onButtonClick={() =>
            //     navigate("/cases/new")
            // }
            />
            <CommonTable
                columns={column}
                data={dummyClients}

            />
        </>
    )
};

export default Client;
