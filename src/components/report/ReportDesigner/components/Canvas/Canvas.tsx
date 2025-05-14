// 画布主组件

import { useDndMonitor, useDroppable } from "@dnd-kit/core";

import React from "react";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useReportDesignerStore((s) => s.addComponent);
  const components = useReportDesignerStore((s) => s.components);
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const setSelectedIds = useReportDesignerStore((s) => s.setSelectedIds);

  // 监听拖拽结束，落盘添加组件
  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
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
      {components.map((comp) => {
        const selected = selectedIds.includes(comp.id);
        return (
          <div
            key={comp.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIds([comp.id]);
            }}
            style={{
              position: "absolute",
              left: comp.x,
              top: comp.y,
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
              cursor: "pointer",
              userSelect: "none",
              zIndex: selected ? 10 : 1,
              transition: "all 0.2s",
            }}
          >
            {comp.props.text}
          </div>
        );
      })}
    </div>
  );
}
