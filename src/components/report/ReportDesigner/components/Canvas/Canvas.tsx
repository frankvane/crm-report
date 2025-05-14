// 画布主组件

import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";

import React from "react";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

function DraggableCanvasItem({ comp, selected, onSelect }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: comp.id });
  const style: React.CSSProperties = {
    position: "absolute",
    left: comp.x + (transform?.x || 0),
    top: comp.y + (transform?.y || 0),
    width: comp.width,
    height: comp.height,
    background: "#fff",
    border: selected ? "2.5px solid #ff9800" : "1px solid #1976d2",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    color: "#1976d2",
    boxShadow: selected ? "0 0 0 3px #ffe0b2" : "0 2px 8px #1976d233",
    cursor: isDragging ? "grabbing" : "move",
    userSelect: "none",
    zIndex: selected ? 10 : 1,
    transition: "box-shadow 0.2s, border 0.2s",
    opacity: isDragging ? 0.7 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {comp.props.text}
    </div>
  );
}

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useReportDesignerStore((s) => s.addComponent);
  const components = useReportDesignerStore((s) => s.components);
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const setSelectedIds = useReportDesignerStore((s) => s.setSelectedIds);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);

  // 监听拖拽结束，落盘添加组件或更新位置
  useDndMonitor({
    onDragEnd(event) {
      const { active, over, delta } = event;
      // 画布外拖拽落盘
      if (over?.id === "canvas" && active.data?.current?.type) {
        const type = active.data.current.type;
        const id = `${type}_${Date.now()}`;
        addComponent({
          id,
          type,
          x: 40 + Math.random() * 200,
          y: 40 + Math.random() * 100,
          width: 120,
          height: 40,
          locked: false,
          visible: true,
          zindex: 1,
          props: { text: type === "label" ? "新标签" : "新文本" },
        });
        setSelectedIds([id]);
      }
      // 画布内拖动，更新x/y
      if (
        active.id &&
        typeof active.id === "string" &&
        components.some((c) => c.id === active.id) &&
        delta
      ) {
        const comp = components.find((c) => c.id === active.id);
        if (comp) {
          updateComponent(comp.id, {
            x: comp.x + delta.x,
            y: comp.y + delta.y,
          });
        }
      }
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 300,
        padding: 16,
        fontWeight: 600,
        color: isOver ? "#fff" : "#1976d2",
        background: isOver ? "#1976d2" : "#e3f2fd",
        border: "2px solid #1976d2",
        borderRadius: 6,
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {components.length === 0 && <div>拖拽左侧组件到此处</div>}
      {components.map((comp) => (
        <DraggableCanvasItem
          key={comp.id}
          comp={comp}
          selected={selectedIds.includes(comp.id)}
          onSelect={() => setSelectedIds([comp.id])}
        />
      ))}
    </div>
  );
}
