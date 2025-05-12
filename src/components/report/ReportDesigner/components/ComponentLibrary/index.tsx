import { Divider, Typography } from "antd";

import React from "react";

const { Title } = Typography;

export interface ComponentLibraryItem {
  type: string;
  name: string;
  icon: string;
}

interface ComponentLibraryProps {
  components: ComponentLibraryItem[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
}

const transparentImg =
  "data:image/svg+xml;base64," +
  btoa('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>');

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  components,
  onDragStart,
}) => (
  <div
    style={{
      width: 220,
      background: "#fff",
      borderRight: "1px solid #f0f0f0",
      padding: 0,
      color: "#222",
      fontFamily: "inherit",
    }}
  >
    <div style={{ padding: 20 }}>
      <Title level={5} style={{ marginTop: 0, color: "#222" }}>
        组件库
      </Title>
      <Divider style={{ margin: "8px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {components.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              const img = new window.Image();
              img.src = transparentImg;
              e.dataTransfer.setDragImage(img, 0, 0);
              onDragStart(e, item.type);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              border: "1px solid #e5e5e5",
              borderRadius: 6,
              background: "#fafafa",
              cursor: "grab",
              fontSize: 16,
              color: "#222",
              transition: "background 0.2s, box-shadow 0.2s",
              userSelect: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f0f5ff")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#fafafa")}
          >
            <span style={{ marginRight: 8 }}>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ComponentLibrary;
