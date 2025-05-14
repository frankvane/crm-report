// 属性面板组件

import { Input, InputNumber, Select, Switch } from "antd";

import React from "react";
import { getComponentSchema } from "@report/ReportDesigner/schemas";
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

  const selected = components.find((c) => selectedIds[0] === c.id);

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

  const schema = getComponentSchema(selected.type) || {
    base: [],
    standard: [],
    dataBinding: [],
  };

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
      {/* 基础属性 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 6 }}>基础属性</div>
        {schema.base?.map((item: any) => (
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
              value: selected[item.key],
              onChange: (val: any) => handleBaseChange(item.key, val),
            })}
          </div>
        ))}
      </div>
      {/* 标准属性 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 500, marginBottom: 6 }}>标准属性</div>
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
              onChange: (val: any) => handleStandardChange(item.key, val),
            })}
          </div>
        ))}
      </div>
      {/* 数据绑定属性 */}
      <div>
        <div style={{ fontWeight: 500, marginBottom: 6 }}>数据绑定</div>
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
              item,
              value: selected.props?.dataBinding?.[item.key],
              onChange: (val: any) => handleDataBindingChange(item.key, val),
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
