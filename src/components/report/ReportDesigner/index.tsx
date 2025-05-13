import ComponentLibrary, {
  ComponentLibraryItem,
} from "./components/ComponentLibrary";
import { Layout, Typography } from "antd";
import React, { useState } from "react";

import { CANVAS_TEMPLATES } from "./constants";
import Canvas from "./components/Canvas";
import PropertyPanel from "./components/PropertyPanel";
import Toolbar from "./components/Toolbar";
import { useCanvasComponents } from "./hooks/useCanvasComponents";

const { Header } = Layout;
const { Title } = Typography;

const componentList: ComponentLibraryItem[] = [
  { type: "table", name: "表格", icon: "📋" },
  { type: "chart", name: "图表", icon: "📊" },
  { type: "text", name: "文本", icon: "🔤" },
];

const ReportDesigner: React.FC = () => {
  const {
    canvasComponents,
    handleDrop,
    handleComponentMove,
    handlePropertyChange,
    selectedComponent,
    handleDelete,
    handleCopy,
    handleMoveToTop,
    handleMoveToBottom,
    handleToggleLock,
    handleToggleVisible,
  } = useCanvasComponents(componentList);
  const [canvasSize, setCanvasSize] = useState(CANVAS_TEMPLATES[0]);

  // 新增多选状态
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

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
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f5f6fa",
        overflow: "hidden",
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
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          minWidth: 0,
          height: 0,
        }}
      >
        <ComponentLibrary
          components={componentList}
          onDragStart={handleDragStart}
        />
        <Canvas
          components={canvasComponents}
          onDrop={handleDrop}
          onComponentMove={handleComponentMove}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          width={canvasSize.width}
          height={canvasSize.height}
          handleDelete={handleDelete}
          handleCopy={handleCopy}
          handleMoveToTop={handleMoveToTop}
          handleMoveToBottom={handleMoveToBottom}
          handleToggleLock={handleToggleLock}
          handleToggleVisible={handleToggleVisible}
          handlePropertyChange={handlePropertyChange}
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
