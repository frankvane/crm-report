import FieldRenderer from "./FieldRenderer";
import React from "react";

export function getPropertyTabsConfig({
  schema,
  selected,
  dataSources,
  fieldOptions,
  isRotatable,
  handleBaseChange,
  handleStandardChange,
  handleDataBindingChange,
}: any) {
  return [
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
                <FieldRenderer
                  item={fieldItem}
                  value={(selected as any)[item.key] ?? item.default}
                  onChange={(val: any) => handleBaseChange(item.key, val)}
                />
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
              <FieldRenderer
                item={item}
                value={selected.props?.[item.key] ?? item.default}
                onChange={(val: any) => handleStandardChange(item.key, val)}
              />
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
                  value={
                    selected.props?.dataBinding?.[item.key] ?? item.default
                  }
                  onChange={(val: any) =>
                    handleDataBindingChange(item.key, val)
                  }
                />
              </div>
            );
          })}
        </div>
      ),
    },
  ];
}
