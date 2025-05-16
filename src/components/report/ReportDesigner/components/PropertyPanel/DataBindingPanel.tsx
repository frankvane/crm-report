import { Button, Drawer, Select } from "antd";
import React, { useEffect, useState } from "react";

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
      handleDataBindingChange("dataNode", "");
      return;
    }
    handleDataBindingChange(key, value);
  };

  // ========== 新增：递归提取所有可用数组节点 ==========
  function extractArrayNodes(obj: any, path = ""): any[] {
    let nodes: any[] = [];
    for (const key in obj) {
      if (
        Array.isArray(obj[key]) &&
        obj[key].length > 0 &&
        typeof obj[key][0] === "object"
      ) {
        const nodePath = path ? `${path}.${key}` : key;
        nodes.push({
          label: nodePath,
          value: nodePath,
          sample: obj[key][0],
        });
        // 递归嵌套
        nodes = nodes.concat(
          extractArrayNodes(
            obj[key][0],
            path ? `${path}.${key}[0]` : `${key}[0]`
          )
        );
      }
    }
    return nodes;
  }
  // ========== END ==========

  // 获取当前数据源
  const currentDataSourceKey = selected.props?.dataBinding?.dataSource;
  const currentDataSource = dataSources.find(
    (ds) => ds.key === currentDataSourceKey
  );
  const data = currentDataSource?.data || [];
  const type = selected.type || selected.props?.type;

  // 自动选中第一个数据源（仅在 dataSource 未设置时）
  React.useEffect(() => {
    if (!currentDataSourceKey && dataSources.length > 0) {
      handleDataBindingChange("dataSource", dataSources[0].key);
    }
    // eslint-disable-next-line
  }, [currentDataSourceKey, dataSources.length]);

  // 只取第一条数据的字段，适用于label/text/image等
  const mergedMock: Record<string, any> =
    Array.isArray(data) && data.length > 0
      ? (data[0] as Record<string, any>)
      : {};

  // 普通控件字段选项（一级字段）
  const simpleFieldOptions = Object.keys(mergedMock)
    .filter((k) => typeof mergedMock[k] !== "object")
    .map((k) => ({ label: k, value: k }));

  // ========== 修改：表格字段选项由当前节点决定 ==========
  let tableFieldOptions: { label: string; value: string }[] = [];
  let arrayNodes: any[] = [];
  let selectedNodePath = "";
  let currentNodeSample = {};
  if (["table", "list", "chart"].includes(type)) {
    // 合并所有元素，适合表格/列表
    function mergeObjects(arr: any[]) {
      if (!Array.isArray(arr) || arr.length === 0) return {};
      return arr.reduce(
        (acc, item) => ({ ...acc, ...item }),
        {} as Record<string, any>
      );
    }
    const mergedForArray = mergeObjects(data);
    arrayNodes = extractArrayNodes(mergedForArray);
    selectedNodePath =
      selected.props?.dataBinding?.dataNode || arrayNodes[0]?.value || "";
    const currentNode = arrayNodes.find((n) => n.value === selectedNodePath);
    currentNodeSample = currentNode?.sample || {};
    if (
      selectedNodePath &&
      currentNodeSample &&
      typeof currentNodeSample === "object"
    ) {
      tableFieldOptions = Object.keys(currentNodeSample).map((k) => ({
        label: k,
        value: k,
      }));
    }
  }
  // ========== END ==========

  // 自动选中第一个数据节点（体验优化）
  useEffect(() => {
    if (
      selected.props?.dataBinding?.dataSource &&
      !selected.props?.dataBinding?.dataNode &&
      arrayNodes.length > 0
    ) {
      handleDataBindingChange("dataNode", arrayNodes[0].value);
    }
    // eslint-disable-next-line
  }, [selected.props?.dataBinding?.dataSource, arrayNodes.length]);

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
        // 优化：只要有可用节点，所有数据源类型控件都显示 dataNode 下拉框
        if (item.key === "dataNode") {
          if (arrayNodes.length === 0) return null;
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
              <Select
                style={{ minWidth: 220 }}
                value={selectedNodePath}
                options={arrayNodes}
                onChange={(val) => {
                  handleDataBindingChange("dataNode", val);
                  // 节点切换时重置 columns
                  handleDataBindingChange("columns", []);
                }}
              />
            </div>
          );
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
                {/* 新增：数据节点选择下拉框（Drawer 内部也可切换） */}
                {arrayNodes.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>数据节点：</span>
                    <Select
                      style={{ minWidth: 220 }}
                      value={selectedNodePath}
                      options={arrayNodes}
                      onChange={(val) => {
                        handleDataBindingChange("dataNode", val);
                        handleDataBindingChange("columns", []);
                      }}
                    />
                  </div>
                )}
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
          fieldItem = { ...item, options: simpleFieldOptions };
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
                item.type === "columns" ? tableFieldOptions : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default DataBindingPanel;
