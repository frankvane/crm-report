import type { ColumnsType } from "antd/es/table";
import React from "react";
import { Table } from "antd";

interface TableWidgetProps {
  columns?: ColumnsType<any>;
  dataSource?: any[];
  style?: React.CSSProperties;
}

const defaultColumns: ColumnsType<any> = [
  { title: "姓名", dataIndex: "name", key: "name" },
  { title: "年龄", dataIndex: "age", key: "age" },
  { title: "地址", dataIndex: "address", key: "address" },
];

const defaultData = [
  { key: 1, name: "张三", age: 28, address: "北京" },
  { key: 2, name: "李四", age: 32, address: "上海" },
];

const TableWidget: React.FC<TableWidgetProps> = ({
  columns = defaultColumns,
  dataSource = defaultData,
  style = {},
}) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      size="small"
      style={{ width: "100%", ...style, borderRadius: 4 }}
      scroll={{ x: true }}
    />
  );
};

export default TableWidget;
