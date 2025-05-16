import { Button, Drawer } from "antd";
import React, { useState } from "react";

import FieldRenderer from "./FieldRenderer";

interface DataBindingPanelProps {
  schema: any;
  selected: any;
  dataSources: any[];
  fieldOptions: any[];
  handleDataBindingChange: (key: string, value: any) => void;
}

const DataBindingPanel: React.FC<DataBindingPanelProps> = ({
  schema,
  selected,
  dataSources,
  fieldOptions,
  handleDataBindingChange,
}) => {
  // 字段映射抽屉状态
  const [columnsDrawerOpen, setColumnsDrawerOpen] = useState(false);
  // 当前 columns 值
  const columnsValue = selected.props?.dataBinding?.columns ?? [];
  // columns schema
  const columnsSchema = schema.dataBinding?.find(
    (item: any) => item.key === "columns"
  );

  // 封装变更处理，dataSource 变更时重置 columns
  const handleChange = (key: string, value: any) => {
    if (key === "dataSource") {
      // 先重置字段映射，再切换数据源，避免状态覆盖
      handleDataBindingChange("columns", []);
      handleDataBindingChange("dataSource", value);
      return;
    }
    handleDataBindingChange(key, value);
  };

  return (
    <div>
      {schema.dataBinding?.map((item: any) => {
        // 只在 format 为 custom 时显示 customFormat 字段
        if (item.key === "customFormat") {
          if (selected.props?.dataBinding?.format !== "custom") return null;
        }
        // 只在 format 不为 custom 时显示 formatPattern 字段
        if (item.key === "formatPattern") {
          if (
            !selected.props?.dataBinding?.format ||
            selected.props?.dataBinding?.format === "custom"
          )
            return null;
        }
        // 字段映射（columns）特殊处理
        if (item.key === "columns") {
          return (
            <div
              key={item.key}
              style={{
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 80 }}>{item.label}：</span>
              <Button size="small" onClick={() => setColumnsDrawerOpen(true)}>
                编辑
              </Button>
              <div style={{ flex: 1 }}>
                {/* 简要信息列表 */}
                {columnsValue && columnsValue.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {columnsValue.map((col: any) => (
                      <li
                        key={
                          typeof col.field === "string" ||
                          typeof col.field === "number"
                            ? col.field
                            : col.field?.label || col.field?.value || ""
                        }
                        style={{ fontSize: 12, color: "#888" }}
                      >
                        {typeof col.label === "string" ||
                        typeof col.label === "number"
                          ? col.label
                          : col.label?.label || col.label?.value || ""}
                        （
                        {typeof col.field === "string" ||
                        typeof col.field === "number"
                          ? col.field
                          : col.field?.label || col.field?.value || ""}
                        ）
                        {col.visible === false ? (
                          <span style={{ color: "#bbb", marginLeft: 4 }}>
                            [隐藏]
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: "#bbb", fontSize: 12 }}>
                    未配置字段
                  </span>
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
                  dataSourceFields={fieldOptions}
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
          );
        }
        // 其他字段正常渲染
        let fieldItem = item;
        if (item.key === "dataSource") {
          fieldItem = {
            ...item,
            options: dataSources.map((ds: any) => ({
              label: ds.name,
              value: ds.key,
            })),
          };
        }
        if (item.key === "field") {
          fieldItem = { ...item, options: fieldOptions };
        }
        return (
          <div
            key={item.key}
            style={{
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 80 }}>{item.label}：</span>
            <FieldRenderer
              item={fieldItem}
              value={selected.props?.dataBinding?.[item.key] ?? item.default}
              onChange={(val: any) => handleChange(item.key, val)}
              dataSourceFields={
                item.type === "columns" ? fieldOptions : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default DataBindingPanel;
