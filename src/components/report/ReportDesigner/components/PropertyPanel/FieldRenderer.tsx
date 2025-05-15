import { Input, InputNumber, Select, Switch } from "antd";

import React from "react";

export default function FieldRenderer({ item, value, onChange }: any) {
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
    case "textarea":
      return (
        <Input.TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 8 }}
          style={{ width: 320 }}
          disabled={item.disabled}
          placeholder={item.placeholder}
        />
      );
    case "text":
      return <Input value={value} disabled style={{ width: 180 }} />;
    default:
      return null;
  }
}
