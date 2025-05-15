import FieldRenderer from "./FieldRenderer";
import React from "react";

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
              onChange={(val: any) => handleDataBindingChange(item.key, val)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DataBindingPanel;
