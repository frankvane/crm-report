import { Button, Modal, Table, message } from "antd";

import React from "react";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";

const DataSourceManager: React.FC = () => {
  const dataSources = useDataSourceStore((s) => s.dataSources);
  const removeDataSource = useDataSourceStore((s) => s.removeDataSource);

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "确认删除该数据源？",
      content: "删除后不可恢复，且相关绑定会失效。",
      onOk: () => {
        removeDataSource(key);
        message.success("删除成功");
      },
    });
  };

  const columns = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "唯一标识", dataIndex: "key", key: "key" },
    { title: "API地址", dataIndex: "url", key: "url" },
    {
      title: "字段数",
      dataIndex: "fields",
      key: "fields",
      render: (fields: string[]) => fields.length,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <>
          {/* 预览字段、编辑、删除等操作按钮 */}
          {/* <Button size="small" type="link">预览字段</Button> */}
          {/* <Button size="small" type="link">编辑</Button> */}
          <Button
            size="small"
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
        数据源管理
      </div>
      {/* 后续可加"新增数据源"按钮 */}
      <Table
        rowKey="key"
        columns={columns}
        dataSource={dataSources}
        bordered
        pagination={false}
        size="middle"
      />
    </div>
  );
};

export default DataSourceManager;
