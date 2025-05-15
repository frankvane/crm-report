import FieldRenderer from "./FieldRenderer";
import React from "react";

interface BasePropertyPanelProps {
  schema: any;
  selected: any;
  isRotatable: boolean;
  handleBaseChange: (key: string, value: any) => void;
}

const BasePropertyPanel: React.FC<BasePropertyPanelProps> = ({
  schema,
  selected,
  isRotatable,
  handleBaseChange,
}) => {
  return (
    <div>
      {schema.base?.map((item: any) => {
        const fieldItem =
          item.key === "rotation" ? { ...item, disabled: !isRotatable } : item;
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
  );
};

export default BasePropertyPanel;
