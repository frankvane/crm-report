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
          let newX = comp.x + delta.x;
          let newY = comp.y + delta.y;
          if (canvasConfig.allowSnapToGrid) {
            const grid = canvasConfig.gridSize;
            newX = Math.round(newX / grid) * grid;
            newY = Math.round(newY / grid) * grid;
          }
          updateComponent(comp.id, {
            x: newX,
            y: newY,
          });
        }
      }
    },
  });

  // 标尺渲染
  const renderRuler = () => {
    if (!canvasConfig.showRuler) return null;
    const { width, height, gridSize } = canvasConfig;
    // 顶部标尺
    const topTicks = [];
    for (let x = 0; x <= width; x += gridSize) {
      topTicks.push(
        <div
          key={x}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: 16,
            background: "#bdbdbd",
          }}
        />
      );
      if (x % (gridSize * 5) === 0) {
        topTicks.push(
          <div
            key={x + "-label"}
            style={{
              position: "absolute",
              left: x + 2,
              top: 0,
              fontSize: 10,
              color: "#888",
              userSelect: "none",
            }}
          >
            {x}
          </div>
        );
      }
    }
    // 左侧标尺
    const leftTicks = [];
    for (let y = 0; y <= height; y += gridSize) {
      leftTicks.push(
        <div
          key={y}
          style={{
            position: "absolute",
            top: y,
            left: 0,
            width: 16,
            height: 1,
            background: "#bdbdbd",
          }}
        />
      );
      if (y % (gridSize * 5) === 0) {
        leftTicks.push(
          <div
            key={y + "-label"}
            style={{
              position: "absolute",
              top: y + 2,
              left: 0,
              fontSize: 10,
              color: "#888",
              userSelect: "none",
            }}
          >
            {y}
          </div>
        );
      }
    }
    return (
      <>
        {/* 顶部标尺 */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 0,
            width: width,
            height: 16,
            background: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
            zIndex: 20,
          }}
        >
          {topTicks}
        </div>
        {/* 左侧标尺 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 16,
            width: 16,
            height: height,
            background: "#f5f5f5",
            borderRight: "1px solid #e0e0e0",
            zIndex: 20,
          }}
        >
          {leftTicks}
        </div>
      </>
    );
  };

  // 网格渲染
  const renderGrid = () => {
    if (!canvasConfig.showGrid) return null;
    const { width, height, gridSize } = canvasConfig;
    const lines: React.ReactNode[] = [];
    // 竖线
    for (let x = gridSize; x < width; x += gridSize) {
      lines.push(
        <div
          key={"v-" + x}
          style={{
            position: "absolute",
            left: x + 16, // 预留左侧标尺宽度
            top: 16,
            width: 1,
            height: height,
            background: "#e0e0e0",
            zIndex: 5,
          }}
        />
      );
    }
    // 横线
    for (let y = gridSize; y < height; y += gridSize) {
      lines.push(
        <div
          key={"h-" + y}
          style={{
            position: "absolute",
            top: y + 16, // 预留顶部标尺高度
            left: 16,
            width: width,
            height: 1,
            background: "#e0e0e0",
            zIndex: 5,
          }}
        />
      );
    }
    return <>{lines}</>;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: canvasConfig.height + 16,
        minWidth: canvasConfig.width + 16,
        width: canvasConfig.width + 16,
        height: canvasConfig.height + 16,
        padding: 0,
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
      {/* 标尺 */}
      {renderRuler()}
      {/* 网格 */}
      {renderGrid()}
      {/* 画布内容区 */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          width: canvasConfig.width,
          height: canvasConfig.height,
        }}
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
    </div>
  );
}
