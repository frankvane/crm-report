import { Divider, Layout, Typography } from "antd";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import React, { useState } from "react";

import Toolbar from "./Toolbar";
import { generateId } from "../../../utils/reportUtils";

const { Header } = Layout;
const { Title } = Typography;

const componentList = [
  { type: "table", name: "表格", icon: "📋" },
  { type: "chart", name: "图表", icon: "📊" },
  { type: "text", name: "文本", icon: "🔤" },
];

// 画布尺寸模板
const CANVAS_TEMPLATES = [
  { label: "A4 (纵向)", width: 794, height: 1123 }, // px, 72dpi
  { label: "A4 (横向)", width: 1123, height: 794 },
  { label: "16:9", width: 1280, height: 720 },
];

const DraggableComponent: React.FC<{
  type: string;
  name: string;
  icon: string;
}> = ({ type, name, icon }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${type}`,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        border: "1px solid #e5e5e5",
        borderRadius: 6,
        background: isDragging ? "#e6f7ff" : "#fafafa",
        cursor: "grab",
        fontSize: 16,
        opacity: isDragging ? 0.5 : 1,
        transition: "box-shadow 0.2s",
      }}
    >
      <span style={{ marginRight: 8 }}>{icon}</span>
      {name}
    </div>
  );
};

const ReportDesigner: React.FC = () => {
  const [canvasComponents, setCanvasComponents] = useState<
    {
      id: string;
      type: string;
      name: string;
      icon: string;
      x: number;
      y: number;
    }[]
  >([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState(CANVAS_TEMPLATES[0]);

  // 拖拽添加组件到画布（自由布局，初始位置居中）
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (
      over &&
      over.id === "canvas" &&
      active.id.toString().startsWith("lib-")
    ) {
      const type = active.id.toString().replace("lib-", "");
      const comp = componentList.find((c) => c.type === type);
      if (comp) {
        const newId = generateId();
        setCanvasComponents((prev) => [
          ...prev,
          {
            ...comp,
            id: newId,
            x: Math.round(canvasSize.width / 2 - 60),
            y: Math.round(canvasSize.height / 2 - 20),
          },
        ]);
        setSelectedId(newId);
      }
    }
  };

  // 拖动画布内组件
  const handleComponentDrag = (id: string, dx: number, dy: number) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? {
              ...comp,
              x: Math.max(0, Math.min(canvasSize.width - 120, comp.x + dx)),
              y: Math.max(0, Math.min(canvasSize.height - 40, comp.y + dy)),
            }
          : comp
      )
    );
  };

  // 处理属性面板表单变更
  const handlePropertyChange = (key: string, value: string) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === selectedId ? { ...comp, [key]: value } : comp
      )
    );
  };

  // 获取选中组件
  const selectedComponent = canvasComponents.find((c) => c.id === selectedId);

  // 画布内组件可拖动（dnd-kit实现）
  const DraggableOnCanvas: React.FC<{
    comp: {
      id: string;
      type: string;
      name: string;
      icon: string;
      x: number;
      y: number;
    };
    selected: boolean;
    onClick: () => void;
  }> = ({ comp, selected, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: comp.id,
        data: { comp },
      });
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...(listeners as DraggableSyntheticListeners)}
        onClick={onClick}
        style={{
          position: "absolute",
          left: comp.x + (transform ? transform.x : 0),
          top: comp.y + (transform ? transform.y : 0),
          width: 120,
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: selected ? "2px solid #1890ff" : "1px solid #e5e5e5",
          boxShadow: selected ? "0 0 0 2px #bae7ff" : undefined,
          borderRadius: 6,
          background: isDragging ? "#e6f7ff" : "#fafafa",
          fontSize: 16,
          color: "#333",
          cursor: isDragging ? "grabbing" : "move",
          transition: "border 0.2s, box-shadow 0.2s, background 0.2s",
          zIndex: selected ? 10 : 1,
          userSelect: "none",
        }}
      >
        <span style={{ marginLeft: 8 }}>{comp.icon}</span>
        {comp.name}组件
      </div>
    );
  };

  // 画布区域 droppable
  const CanvasDroppable: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
    return (
      <div
        ref={setNodeRef}
        style={{
          position: "relative",
          width: canvasSize.width,
          height: canvasSize.height,
          background: isOver ? "#e6f7ff" : "#fff",
          border: isOver ? "2px solid #1890ff" : "2px solid #bfbfbf",
          borderRadius: 12,
          boxShadow: "0 2px 8px #f0f1f2",
          margin: "0 auto",
          overflow: "hidden",
          transition: "border 0.2s, background 0.2s",
        }}
        id="canvas"
      >
        {/* 刻度尺（简化版，仅顶部和左侧） */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 24,
            background: "linear-gradient(to right, #f5f6fa 80%, transparent)",
            zIndex: 2,
            display: "flex",
          }}
        >
          {Array.from({ length: Math.ceil(canvasSize.width / 40) }).map(
            (_, i) => (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 24,
                  borderRight: "1px solid #eee",
                  color: "#bbb",
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: "24px",
                }}
              >
                {i * 40}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 24,
            height: "100%",
            background: "linear-gradient(to bottom, #f5f6fa 80%, transparent)",
            zIndex: 2,
          }}
        >
          {Array.from({ length: Math.ceil(canvasSize.height / 40) }).map(
            (_, i) => (
              <div
                key={i}
                style={{
                  height: 40,
                  width: 24,
                  borderBottom: "1px solid #eee",
                  color: "#bbb",
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: "40px",
                }}
              >
                {i * 40}
              </div>
            )
          )}
        </div>
        {children}
      </div>
    );
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
      {/* 顶部工具栏和模板选择 */}
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
      <DndContext
        onDragEnd={(event) => {
          const { active, delta, over } = event;
          // 拖拽添加新组件
          if (
            over &&
            over.id === "canvas" &&
            active.id.toString().startsWith("lib-")
          ) {
            const type = active.id.toString().replace("lib-", "");
            const comp = componentList.find((c) => c.type === type);
            if (comp) {
              const newId = generateId();
              setCanvasComponents((prev) => [
                ...prev,
                {
                  ...comp,
                  id: newId,
                  x: Math.round(canvasSize.width / 2 - 60),
                  y: Math.round(canvasSize.height / 2 - 20),
                },
              ]);
              setSelectedId(newId);
            }
            return;
          }
          // 拖动画布内组件
          if (active.id && !active.id.toString().startsWith("lib-")) {
            setCanvasComponents((prev) =>
              prev.map((comp) =>
                comp.id === active.id
                  ? {
                      ...comp,
                      x: Math.max(
                        0,
                        Math.min(canvasSize.width - 120, comp.x + delta.x)
                      ),
                      y: Math.max(
                        0,
                        Math.min(canvasSize.height - 40, comp.y + delta.y)
                      ),
                    }
                  : comp
              )
            );
          }
        }}
        collisionDetection={closestCenter}
      >
        <div style={{ flex: 1, display: "flex", minHeight: 0, height: 0 }}>
          {/* 左侧组件库 */}
          <div
            style={{
              width: 220,
              background: "#fff",
              borderRight: "1px solid #f0f0f0",
              padding: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              color: "#222",
            }}
          >
            <div
              style={{
                padding: 20,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title level={5} style={{ marginTop: 0, color: "#222" }}>
                组件库
              </Title>
              <Divider style={{ margin: "8px 0" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                  overflowY: "auto",
                }}
                className="designer-scrollbar"
              >
                {componentList.map((item) => (
                  <DraggableComponent key={item.type} {...item} />
                ))}
              </div>
            </div>
          </div>
          {/* 中间画布区域自由布局 */}
          <div
            style={{
              flex: 1,
              padding: "32px 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              minWidth: 0,
              minHeight: 0,
              overflow: "auto",
              background: "#f5f6fa",
            }}
            className="designer-scrollbar"
          >
            <CanvasDroppable>
              {canvasComponents.map((comp) => (
                <DraggableOnCanvas
                  key={comp.id}
                  comp={comp}
                  selected={comp.id === selectedId}
                  onClick={() => setSelectedId(comp.id)}
                />
              ))}
            </CanvasDroppable>
          </div>
          {/* 右侧属性面板 */}
          <div
            style={{
              width: 320,
              background: "#fafafa",
              borderLeft: "1px solid #f0f0f0",
              padding: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: 20,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title level={5} style={{ marginTop: 0 }}>
                属性面板
              </Title>
              <Divider style={{ margin: "8px 0" }} />
              {selectedComponent ? (
                <form
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <label style={{ color: "#666", fontSize: 14 }}>
                    组件名称：
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.name}
                    onChange={(e) =>
                      handlePropertyChange("name", e.target.value)
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #d9d9d9",
                      fontSize: 15,
                    }}
                  />
                  {/* 可扩展更多属性 */}
                </form>
              ) : (
                <div style={{ color: "#aaa", flex: 1, overflowY: "auto" }}>
                  请选择画布中的组件进行属性编辑
                </div>
              )}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default ReportDesigner;
