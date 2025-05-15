import FieldRenderer from "./FieldRenderer";
import React from "react";

interface StandardPropertyPanelProps {
  schema: any;
  selected: any;
  handleStandardChange: (key: string, value: any) => void;
}

const StandardPropertyPanel: React.FC<StandardPropertyPanelProps> = ({
  schema,
  selected,
  handleStandardChange,
}) => {
  return (
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
  );
};

export default StandardPropertyPanel;
