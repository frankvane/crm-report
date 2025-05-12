import ComponentLibrary, { ComponentLibraryItem } from "./ComponentLibrary";
import { Layout, Typography } from "antd";
import React, { useState } from "react";

import Canvas from "./Canvas";
import PropertyPanel from "./PropertyPanel";
import Toolbar from "./Toolbar";
import { generateId } from "../../../utils/reportUtils";

const { Header } = Layout;
const { Title } = Typography;

const componentList: ComponentLibraryItem[] = [
  { type: "table", name: "表格", icon: "📋" },
  { type: "chart", name: "图表", icon: "📊" },
  { type: "text", name: "文本", icon: "🔤" },
];

export interface CanvasComponent {
  id: string;
  type: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

// 画布尺寸模板
const CANVAS_TEMPLATES = [
  { label: "A4 (纵向)", width: 794, height: 1123 },
  { label: "A4 (横向)", width: 1123, height: 794 },
  { label: "16:9", width: 1280, height: 720 },
];

const ReportDesigner: React.FC = () => {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
    []
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState(CANVAS_TEMPLATES[0]);

  // 拖拽新组件到画布
  const handleDrop = (type: string, x: number, y: number) => {
    const comp = componentList.find((c) => c.type === type);
    if (!comp) return;
    const newId = generateId();
    setCanvasComponents((prev) => [...prev, { ...comp, id: newId, x, y }]);
    setSelectedId(newId);
  };
  // 画布内组件拖动
  const handleComponentMove = (id: string, x: number, y: number) => {
    setCanvasComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, x, y } : comp))
    );
  };
  // 属性面板变更
  const handlePropertyChange = (key: string, value: string) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === selectedId ? { ...comp, [key]: value } : comp
      )
    );
  };
  const selectedComponent = canvasComponents.find((c) => c.id === selectedId);

  // 组件库拖拽
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: string
  ) => {
    e.dataTransfer.setData("type", type);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "#f5f6fa",
      }}
    >
      <Header
        style={{
          background: "#fff",
          padding: "0 32px",
          boxShadow: "0 2px 8px #f0f1f2",
          height: 64,
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          flex: "0 0 64px",
        }}
      >
        <Title level={4} style={{ margin: 0, flex: 1 }}>
          报表设计器
        </Title>
        <select
          value={canvasSize.label}
          onChange={(e) => {
            const t = CANVAS_TEMPLATES.find((t) => t.label === e.target.value);
            if (t) setCanvasSize(t);
          }}
          style={{
            marginRight: 16,
            padding: "4px 12px",
            fontSize: 15,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
          }}
        >
          {CANVAS_TEMPLATES.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>
        <Toolbar />
      </Header>
      <div style={{ flex: 1, display: "flex", minHeight: 0, height: 0 }}>
        <ComponentLibrary
          components={componentList}
          onDragStart={handleDragStart}
        />
        <Canvas
          components={canvasComponents}
          onDrop={handleDrop}
          onComponentMove={handleComponentMove}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          width={canvasSize.width}
          height={canvasSize.height}
        />
        <PropertyPanel
          selectedComponent={selectedComponent}
          onChange={handlePropertyChange}
        />
      </div>
    </div>
  );
};

export default ReportDesigner;
