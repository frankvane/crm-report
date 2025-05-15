// 属性面板组件

import { Input, InputNumber, Select, Switch, Tabs } from "antd";
import React, { useMemo } from "react";

import { getComponentSchema } from "@report/ReportDesigner/schemas";
import { useDataSourceStore } from "@report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

function renderField({ item, value, onChange }: any) {
  switch (item.type) {
    case "input":
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 180 }}
          disabled={item.disabled}
        />
      );
    case "number":
      return (
        <InputNumber
          value={value}
          onChange={onChange}
          style={{ width: 120 }}
          disabled={item.disabled}
        />
      );
    case "switch":
      return (
        <Switch
          checked={!!value}
          onChange={onChange}
          disabled={item.disabled}
        />
      );
    case "select":
      return (
        <Select
          value={value}
          onChange={onChange}
          style={{ width: 120 }}
          options={item.options || []}
          disabled={item.disabled}
        />
      );
    case "color":
      return (
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 40,
            height: 32,
            padding: 0,
            border: "none",
            background: "none",
          }}
          disabled={item.disabled}
        />
      );
    case "json":
      return (
        <Input.TextArea
          value={
            typeof value === "string" ? value : JSON.stringify(value, null, 2)
          }
          onChange={(e) => {
            const val = e.target.value;
            try {
              const parsed = JSON.parse(val);
              onChange(parsed);
            } catch {
              // 不更新，或可提示错误
            }
          }}
          autoSize={{ minRows: 4, maxRows: 16 }}
          style={{ width: 320 }}
          placeholder="请输入合法的 JSON 格式"
        />
      );
    case "text":
      return <Input value={value} disabled style={{ width: 180 }} />;
    default:
      return null;
  }
}

export default function PropertyPanel() {
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const components = useReportDesignerStore((s) => s.components);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);
  const dataSources = useDataSourceStore((s) => s.dataSources);

  const selected = useMemo(
    () => components.find((c) => selectedIds[0] === c.id),
    [components, selectedIds]
  );
  const schema = useMemo(
    () =>
      getComponentSchema(selected?.type || "") || {
        base: [],
        standard: [],
        dataBinding: [],
      },
    [selected]
  );
  const selectedDataSource = selected?.props?.dataBinding?.dataSource;
  const getFieldOptions = () => {
    if (!selectedDataSource) return [];
    const ds = dataSources.find((d) => d.key === selectedDataSource);
    return (ds?.fields || []).map((f) => ({ label: f, value: f }));
  };

  // 判断是否可旋转
  const isRotatable = !!selected?.rotatable;

  if (!selected) {
    return (
      <div
        style={{
          padding: 16,
          fontWeight: 600,
          color: "#388e3c",
          background: "#e8f5e9",
          border: "2px solid #388e3c",
          borderRadius: 6,
        }}
      >
        请选择画布上的组件
      </div>
    );
  }

  // 处理主属性（baseSchema）
  const handleBaseChange = (key: string, value: any) => {
    updateComponent(selected.id, { [key]: value });
  };
  // 处理标准属性（props）
  const handleStandardChange = (key: string, value: any) => {
    updateComponent(selected.id, {
      props: { ...selected.props, [key]: value },
    });
  };
  // 处理数据绑定属性（props.dataBinding）
  const handleDataBindingChange = (key: string, value: any) => {
    updateComponent(selected.id, {
      props: {
        ...selected.props,
        dataBinding: { ...selected.props.dataBinding, [key]: value },
      },
    });
  };

  return (
    <div style={{ padding: 16, overflowY: "auto", maxHeight: "100vh" }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>属性面板</div>
      <Tabs
        defaultActiveKey="base"
        size="small"
        style={{ background: "#fff" }}
        items={[
          {
            key: "base",
            label: "基础属性",
            children: (
              <div>
                {schema.base?.map((item: any) => {
                  // rotation 字段根据 rotatable 控制 disabled
                  const fieldItem =
                    item.key === "rotation"
                      ? { ...item, disabled: !isRotatable }
                      : item;
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
                      {renderField({
                        item: fieldItem,
                        value: (selected as any)[item.key],
                        onChange: (val: any) => handleBaseChange(item.key, val),
                      })}
                    </div>
                  );
                })}
              </div>
            ),
          },
          {
            key: "standard",
            label: "标准属性",
            children: (
              <div>
                {schema.standard?.map((item: any) => (
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
                    {renderField({
                      item,
                      value: selected.props?.[item.key],
                      onChange: (val: any) =>
                        handleStandardChange(item.key, val),
                    })}
                  </div>
                ))}
              </div>
            ),
          },
          {
            key: "dataBinding",
            label: "数据绑定",
            children: (
              <div>
                {schema.dataBinding?.map((item: any) => (
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
                    {renderField({
                      item:
                        item.key === "field"
                          ? { ...item, options: getFieldOptions() }
                          : item,
                      value: selected.props?.dataBinding?.[item.key],
                      onChange: (val: any) =>
                        handleDataBindingChange(item.key, val),
                    })}
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
