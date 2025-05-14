// 画布主组件

import { useDndMonitor, useDroppable } from "@dnd-kit/core";

import ComponentItem from "./ComponentItem";
import React from "react";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useReportDesignerStore((s) => s.addComponent);
  const components = useReportDesignerStore((s) => s.components);
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const setSelectedIds = useReportDesignerStore((s) => s.setSelectedIds);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);

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
        minHeight: canvasConfig.height,
        minWidth: canvasConfig.width,
        width: canvasConfig.width,
        height: canvasConfig.height,
        padding: 16,
        fontWeight: 600,
        color: isOver ? "#fff" : "#1976d2",
        background: isOver ? "#1976d2" : "#e3f2fd",
        border: "2px solid #1976d2",
        borderRadius: 6,
        transition: "all 0.2s",
        position: "relative",
        overflow: "visible",
      }}
      onClick={() => setSelectedIds([])}
    >
      {components.length === 0 && <div>拖拽左侧组件到此处</div>}
      {components.map((comp) => (
        <ComponentItem
          key={comp.id}
          comp={comp}
          isSelected={selectedIds.length === 1 && selectedIds[0] === comp.id}
          onSelect={() => {
            console.log(
              "[Canvas] onSelect 组件id:",
              comp.id,
              "当前selectedIds:",
              selectedIds
            );
            setSelectedIds([comp.id]);
          }}
          onResize={(w: number, h: number) =>
            updateComponent(comp.id, { width: w, height: h })
          }
        />
      ))}
    </div>
  );
}
