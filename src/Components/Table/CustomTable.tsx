import * as  React from "react";
import { Table, Empty } from "antd";
// import type { TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface CommonTableProps<T> {
    columns: ColumnsType<T>;
    data: T[];
    loading?: boolean;
    title?: string;
    onRowClick?: (record: T) => void;
}

const CommonTable = <T extends object>({
    columns,
    data,
    loading = false,
    title,
    onRowClick,
}: CommonTableProps<T>) => {
    return (
        <Table<T>
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={
                data?.length > 10
                    ? { pageSize: 10, position: ["bottomCenter"] }
                    : false
            }
            // pagination={{ pageSize: 10, position: ["bottomCenter"] }}

            title={title ? () => <h3>{title}</h3> : undefined}
            locale={{ emptyText: <Empty description="No records found" /> }}
            scroll={{ x: "max-content" }} // enables horizontal scroll
            onRow={(record) => ({
                onClick: () => onRowClick?.(record),
                style: { cursor: "pointer" },
            })}
        />
    );
};

export default CommonTable;
