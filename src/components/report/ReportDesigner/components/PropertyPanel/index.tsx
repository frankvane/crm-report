import { Divider, Typography } from "antd";

import type { CanvasComponent } from "./index";
import React from "react";

const { Title } = Typography;

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | undefined;
  onChange: (key: string, value: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onChange,
}) => (
  <div
    style={{
      width: 320,
      background: "#fafafa",
      borderLeft: "1px solid #f0f0f0",
      padding: 0,
    }}
  >
    <div style={{ padding: 20 }}>
      <Title level={5} style={{ marginTop: 0 }}>
        属性面板
      </Title>
      <Divider style={{ margin: "8px 0" }} />
      {selectedComponent ? (
        <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ color: "#666", fontSize: 14 }}>组件名称：</label>
          <input
            type="text"
            value={selectedComponent.name}
            onChange={(e) => onChange("name", e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #d9d9d9",
              fontSize: 15,
            }}
          />
        </form>
      ) : (
        <div style={{ color: "#aaa" }}>请选择画布中的组件进行属性编辑</div>
      )}
    </div>
  </div>
);

export default PropertyPanel;
