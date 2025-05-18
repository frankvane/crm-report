import { Button, Drawer, Select } from "antd";
import React, { useState } from "react";

import FieldRenderer from "./FieldRenderer";

interface DataBindingPanelProps {
  schema: any;
  selected: any;
  dataSources: any[];
  handleDataBindingChange: (key: string, value: any) => void;
}

const DataBindingPanel: React.FC<DataBindingPanelProps> = ({
  schema,
  selected,
  dataSources,
  handleDataBindingChange,
}) => {
  // Drawer状态
  const [columnsDrawerOpen, setColumnsDrawerOpen] = useState(false);

  // 当前数据源
  const currentDataSourceKey = selected.props?.dataBinding?.dataSource;
  const currentDataSource = dataSources.find(
    (ds) => ds.key === currentDataSourceKey
  );

  // 数据节点选项
  const dataNodeOptions =
    currentDataSource?.dataNodes?.map((node: string) => ({
      label: node,
      value: node,
    })) || [];

  // 当前数据节点
  const currentDataNode = selected.props?.dataBinding?.dataNode;

  // 字段映射选项
  const tableFieldOptions = (
    currentDataSource?.dataNodeFields?.[currentDataNode] || []
  ).map((field: string) => ({
    label: field,
    value: field,
  }));

  // 字段映射schema和当前值
  const columnsSchema = schema.dataBinding?.find(
    (item: any) => item.key === "columns"
  );
  const columnsValue = selected.props?.dataBinding?.columns ?? [];

  // 变更处理
  const handleChange = (key: string, value: any) => {
    if (key === "dataSource") {
      handleDataBindingChange("all", {
        dataSource: value,
        dataNode: "",
        columns: [],
      });
      return;
    }
    if (key === "dataNode") {
      handleDataBindingChange("all", {
        dataSource: currentDataSourceKey,
        dataNode: value,
        columns: [],
      });
      return;
    }
    handleDataBindingChange(key, value);
  };

  return (
    <div>
      {/* 数据源下拉框 */}
      <div
        style={{
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 80 }}>数据源：</span>
        <Select
          style={{ minWidth: 220 }}
          value={currentDataSourceKey ?? ""}
          options={[
            { label: "请选择数据源", value: "" },
            ...dataSources.map((ds: any) => ({
              label: ds.name,
              value: ds.key,
            })),
          ]}
          onChange={(val) => handleChange("dataSource", val)}
        />
      </div>

      {/* 数据节点下拉框 */}
      {currentDataSourceKey && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 80 }}>数据节点：</span>
          <Select
            style={{ minWidth: 220 }}
            value={currentDataNode ?? ""}
            options={[
              { label: "请选择数据节点", value: "" },
              ...dataNodeOptions,
            ]}
            onChange={(val) => handleChange("dataNode", val)}
          />
        </div>
      )}

      {/* 字段映射编辑按钮和Drawer */}
      {currentDataSourceKey && currentDataNode && (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 80 }}>字段映射：</span>
          <Button size="small" onClick={() => setColumnsDrawerOpen(true)}>
            编辑
          </Button>
          <div style={{ flex: 1 }}>
            {/* 简要信息列表 */}
            {columnsValue && columnsValue.length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {columnsValue.map((col: any, idx: number) => (
                  <li
                    key={col.field ? `${col.field}_${idx}` : idx}
                    style={{ fontSize: 12, color: "#888" }}
                  >
                    {col.label || col.field || "-"}
                    {col.visible === false ? (
                      <span style={{ color: "#bbb", marginLeft: 4 }}>
                        [隐藏]
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <span style={{ color: "#bbb", fontSize: 12 }}>未配置字段</span>
            )}
          </div>
          <Drawer
            title="字段映射配置"
            placement="right"
            open={columnsDrawerOpen}
            onClose={() => setColumnsDrawerOpen(false)}
            width={900}
            destroyOnClose
            footer={null}
          >
            <FieldRenderer
              item={columnsSchema}
              value={columnsValue}
              onChange={(val: any) => handleChange("columns", val)}
              dataSourceFields={tableFieldOptions}
            />
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Button
                onClick={() => setColumnsDrawerOpen(false)}
                style={{ marginRight: 8 }}
              >
                关闭
              </Button>
            </div>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default DataBindingPanel;
