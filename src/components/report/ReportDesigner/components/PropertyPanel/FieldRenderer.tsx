import { Button, Input, InputNumber, Select, Space, Switch, Table } from "antd";

import React from "react";

function ColumnsField({
  value = [],
  onChange,
  itemSchema,
  dataSourceFields = [],
}: any) {
  // value: columns数组
  // itemSchema: 每列的schema
  // dataSourceFields: 字段下拉选项

  // 处理字段变更
  const handleFieldChange = (rowIdx: number, key: string, fieldValue: any) => {
    const newValue = value.map((row: any, idx: number) =>
      idx === rowIdx
        ? {
            ...row,
            [key]:
              key === "label"
                ? typeof fieldValue === "string"
                  ? fieldValue
                  : fieldValue?.label || fieldValue?.value || ""
                : fieldValue,
          }
        : row
    );
    onChange(newValue);
  };

  // 新增一行
  const handleAdd = () => {
    const emptyRow: any = {};
    itemSchema.forEach((item: any) => {
      if (item.type === "switch") emptyRow[item.key] = true;
      else emptyRow[item.key] = undefined;
    });
    onChange([...(value || []), emptyRow]);
  };

  // 删除一行
  const handleDelete = (rowIdx: number) => {
    const newValue = value.filter((_: any, idx: number) => idx !== rowIdx);
    onChange(newValue);
  };

  // 渲染每个单元格
  const renderCell = (item: any, row: any, rowIdx: number) => {
    const commonProps = {
      value: row[item.key],
      onChange: (val: any) => handleFieldChange(rowIdx, item.key, val),
      item,
    };
    if (item.type === "input")
      return (
        <Input
          value={
            typeof row[item.key] === "string" ||
            typeof row[item.key] === "number"
              ? row[item.key]
              : row[item.key]?.label || row[item.key]?.value || ""
          }
          onChange={(e) => handleFieldChange(rowIdx, item.key, e.target.value)}
        />
      );
    if (item.type === "number") return <InputNumber {...commonProps} />;
    if (item.type === "switch")
      return (
        <Switch
          checked={!!row[item.key]}
          onChange={(val) => handleFieldChange(rowIdx, item.key, val)}
        />
      );
    if (item.type === "select") {
      const options =
        item.key === "field" && dataSourceFields.length > 0
          ? dataSourceFields
          : item.options || [];
      return (
        <Select {...commonProps} options={options} style={{ minWidth: 80 }} />
      );
    }
    return <Input {...commonProps} />;
  };

  // 构造表格列
  const tableColumns = [
    ...itemSchema.map((item: any) => ({
      title: item.label,
      dataIndex: item.key,
      key: item.key,
      render: (_: any, row: any, rowIdx: number) =>
        renderCell(item, row, rowIdx),
    })),
    {
      title: "操作",
      key: "actions",
      render: (_: any, _row: any, rowIdx: number) => (
        <Button danger size="small" onClick={() => handleDelete(rowIdx)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={tableColumns}
        dataSource={value.map((row: any, idx: number) => ({
          ...row,
          _rowKey: idx,
        }))}
        rowKey="_rowKey"
        pagination={false}
        size="small"
        bordered
      />
      <Space style={{ marginTop: 8 }}>
        <Button type="dashed" onClick={handleAdd} size="small">
          添加字段
        </Button>
      </Space>
    </div>
  );
}

export default function FieldRenderer({
  item,
  value,
  onChange,
  dataSourceFields,
}: any) {
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
    case "columns":
      return (
        <ColumnsField
          value={value}
          onChange={onChange}
          itemSchema={item.itemSchema}
          dataSourceFields={dataSourceFields}
        />
      );
    default:
      return null;
  }
}
