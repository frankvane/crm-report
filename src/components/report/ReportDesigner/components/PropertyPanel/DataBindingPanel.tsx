import { Button, Drawer, Select } from "antd";
import React, { useState } from "react";

import FieldRenderer from "./FieldRenderer";

interface DataBindingPanelProps {
  schema: any;
  selected: any; // Assuming selected object includes 'type' property
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

  // 获取组件类型
  const componentType = selected?.type;

  // 当前数据源
  const currentDataSourceKey = selected.props?.dataBinding?.dataSource;
  const currentDataSource = dataSources.find(
    (ds) => ds.key === currentDataSourceKey
  );

  // 数据节点选项 (仅用于 table 组件)
  const dataNodeOptions =
    currentDataSource?.dataNodes?.map((node: string) => ({
      label: node,
      value: node,
    })) || [];

  // 当前数据节点 (仅用于 table 组件的数据节点绑定)
  const currentDataNode = selected.props?.dataBinding?.dataNode;

  // 所有可用字段选项（用于 table 组件的 FieldRenderer 中的字段选择，来自数据节点）
  const allFieldsOptionsForTableRenderer = (
    currentDataSource?.dataNodeFields?.[currentDataNode] || []
  ).map((field: string) => ({
    label: field,
    value: field,
  }));

  // 顶层字段选项（用于非 table 组件的 fields 选择，来自数据源 fields）
  const topLevelFieldsOptions = (currentDataSource?.fields || []).map(
    (field: string) => ({
      label: field,
      value: field,
    })
  );

  // 字段映射schema和当前值 (table组件使用)
  const columnsSchema = schema.dataBinding?.find(
    (item: any) => item.key === "columns"
  );
  const columnsValue = selected.props?.dataBinding?.columns ?? [];

  // 单个字段schema和当前值 (非table组件使用)
  const fieldSchema = schema.dataBinding?.find(
    (item: any) => item.key === "field"
  );
  const fieldValue = selected.props?.dataBinding?.field ?? undefined;

  // 变更处理
  const handleChange = (key: string, value: any) => {
    if (key === "dataSource") {
      // 切换数据源时，清空相关的绑定字段/列和数据节点
      const update: any = { dataSource: value };
      if (componentType === "table") {
        update.dataNode = "";
        update.columns = [];
      } else {
        // 非table组件清空绑定的 field
        update.field = undefined;
      }
      handleDataBindingChange("all", update);
      return;
    }

    if (key === "dataNode") {
      // 切换数据节点时，清空 columns (仅 table 组件)
      if (componentType === "table") {
        handleDataBindingChange("all", {
          dataSource: currentDataSourceKey,
          dataNode: value,
          columns: [],
        });
      }
      // 非table组件不处理dataNode变更
      return;
    }

    // 处理 columns (table) 或 field (非table) 的更新
    handleDataBindingChange(key, value);
  };

  return (
    <div>
      {/* 数据源下拉框 - 任何组件类型都需要选择数据源 */}
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

      {/* 根据组件类型渲染不同的绑定配置 */}
      {currentDataSourceKey && (
        <>
          {componentType === "table" ? (
            /* table 组件的 数据节点 和 字段映射配置 */
            <>
              {/* 数据节点下拉框 (仅 table 组件)*/}
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

              {/* 字段映射编辑按钮和Drawer (仅 table 组件, 且选择了数据节点)*/}
              {currentDataNode && columnsSchema && (
                <div
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ width: 80 }}>字段映射：</span>
                  <Button
                    size="small"
                    onClick={() => setColumnsDrawerOpen(true)}
                  >
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
                      dataSourceFields={allFieldsOptionsForTableRenderer} // 字段选项使用 table 的
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
            </>
          ) : (
            /* 非 table 组件的 绑定字段 配置 */
            fieldSchema && (
              <div
                style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ width: 80 }}>绑定字段：</span>
                <Select
                  style={{ minWidth: 220 }}
                  value={fieldValue ?? undefined}
                  options={[
                    { label: "请选择字段", value: undefined },
                    ...topLevelFieldsOptions, // 字段选项使用非 table 的顶层字段
                  ]}
                  onChange={(val) => handleChange("field", val)}
                />
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default DataBindingPanel;
