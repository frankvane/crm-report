// 画布主组件

import React, { useCallback, useRef, useState } from "react";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";

import BatchToolbar from "./BatchToolbar";
import ComponentItem from "./ComponentItem";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useReportDesignerStore((s) => s.addComponent);
  const components = useReportDesignerStore((s) => s.components);
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const setSelectedIds = useReportDesignerStore((s) => s.setSelectedIds);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);
  const batchUpdateComponent = useReportDesignerStore(
    (s) => s.batchUpdateComponent
  );
  const batchRemoveComponent = useReportDesignerStore(
    (s) => s.batchRemoveComponent
  );
  const batchLockComponent = useReportDesignerStore(
    (s) => s.batchLockComponent
  );
  const batchVisibleComponent = useReportDesignerStore(
    (s) => s.batchVisibleComponent
  );

  // 框选相关
  const [selectRect, setSelectRect] = useState<null | {
    x: number;
    y: number;
    w: number;
    h: number;
  }>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // 用useRef保存最新的组件数据，避免闭包
  const componentsRef = useRef(components);
  componentsRef.current = components;
  const setSelectedIdsRef = useRef(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  // 新增：最近一次操作类型标志位
  const lastActionRef = useRef<string>("");

  // 用useCallback确保引用稳定
  const handleMouseMove = useCallback((e: MouseEvent) => {
    lastActionRef.current = "select"; // 标记为框选
    console.log("[框选] handleMouseMove");
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const x = Math.min(dragStart.current.x, curX);
    const y = Math.min(dragStart.current.y, curY);
    const w = Math.abs(curX - dragStart.current.x);
    const h = Math.abs(curY - dragStart.current.y);
    setSelectRect({ x, y, w, h });
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    lastActionRef.current = "select"; // 标记为框选
    e.stopPropagation(); // 防止冒泡导致选中状态被清空
    console.log("[框选] handleMouseUp");
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const offsetLeft = 16; // 标尺宽度
    const offsetTop = 16; // 标尺高度
    const endX = e.clientX - rect.left - offsetLeft;
    const endY = e.clientY - rect.top - offsetTop;
    const startX = dragStart.current.x - offsetLeft;
    const startY = dragStart.current.y - offsetTop;
    const x1 = Math.min(startX, endX);
    const y1 = Math.min(startY, endY);
    const x2 = Math.max(startX, endX);
    const y2 = Math.max(startY, endY);
    console.log(`[框选] 区域: x1=${x1}, y1=${y1}, x2=${x2}, y2=${y2}`);
    // 输出所有组件的坐标和尺寸
    componentsRef.current.forEach((c) => {
      console.log(
        `[框选] 组件: id=${c.id}, x=${c.x}, y=${c.y}, w=${c.width}, h=${c.height}`
      );
    });
    // 计算与选择框相交的组件
    const selected = componentsRef.current.filter((c) => {
      const cx1 = c.x;
      const cy1 = c.y;
      const cx2 = c.x + c.width;
      const cy2 = c.y + c.height;
      return cx1 < x2 && cx2 > x1 && cy1 < y2 && cy2 > y1;
    });
    console.log(
      "[框选] 命中的组件id:",
      selected.map((c) => c.id)
    );
    setSelectedIdsRef.current(selected.map((c) => c.id));
    setSelectRect(null);
    dragStart.current = null;
    setIsSelecting(false); // 框选结束，恢复
    document.removeEventListener("mousemove", handleMouseMoveRef.current!);
    document.removeEventListener("mouseup", handleMouseUpRef.current!);
  }, []);

  // 用useRef保存最新的回调，确保解绑时引用一致
  const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const handleMouseUpRef = useRef<((e: MouseEvent) => void) | null>(null);
  handleMouseMoveRef.current = handleMouseMove;
  handleMouseUpRef.current = handleMouseUp;

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

  // 鼠标按下开始框选
  const handleMouseDown = (e: React.MouseEvent) => {
    lastActionRef.current = "select"; // 标记为框选
    console.log("[框选] handleMouseDown", e.button);
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    dragStart.current = { x: startX, y: startY };
    setSelectRect({ x: startX, y: startY, w: 0, h: 0 });
    setIsSelecting(true);
    document.addEventListener("mousemove", handleMouseMoveRef.current!);
    document.addEventListener("mouseup", handleMouseUpRef.current!);
    console.log("[框选] 已绑定document mousemove/mouseup");
  };

  // 批量操作实现
  const handleDeleteSelected = () => {
    batchRemoveComponent(selectedIds);
  };
  const handleBatchLock = (locked: boolean) => {
    batchLockComponent(selectedIds, locked);
  };
  const handleBatchVisible = (visible: boolean) => {
    batchVisibleComponent(selectedIds, visible);
  };
  const handleShowAll = () => {
    batchVisibleComponent(
      components.map((c) => c.id),
      true
    );
  };
  // 批量对齐
  const handleAlign = (
    type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
  ) => {
    if (selectedIds.length < 2) return;
    const selectedComps = components.filter((c) => selectedIds.includes(c.id));
    if (selectedComps.length < 2) return;
    const updates: Record<string, Partial<(typeof selectedComps)[0]>> = {};
    if (["left", "right", "top", "bottom"].includes(type)) {
      if (type === "left") {
        const minX = Math.min(...selectedComps.map((c) => c.x));
        selectedComps.forEach((c) => (updates[c.id] = { x: minX }));
      } else if (type === "right") {
        const maxR = Math.max(...selectedComps.map((c) => c.x + c.width));
        selectedComps.forEach((c) => (updates[c.id] = { x: maxR - c.width }));
      } else if (type === "top") {
        const minY = Math.min(...selectedComps.map((c) => c.y));
        selectedComps.forEach((c) => (updates[c.id] = { y: minY }));
      } else if (type === "bottom") {
        const maxB = Math.max(...selectedComps.map((c) => c.y + c.height));
        selectedComps.forEach((c) => (updates[c.id] = { y: maxB - c.height }));
      }
    } else if (type === "hcenter") {
      const minX = Math.min(...selectedComps.map((c) => c.x));
      const maxR = Math.max(...selectedComps.map((c) => c.x + c.width));
      const center = (minX + maxR) / 2;
      selectedComps.forEach(
        (c) => (updates[c.id] = { x: center - c.width / 2 })
      );
    } else if (type === "vcenter") {
      const minY = Math.min(...selectedComps.map((c) => c.y));
      const maxB = Math.max(...selectedComps.map((c) => c.y + c.height));
      const center = (minY + maxB) / 2;
      selectedComps.forEach(
        (c) => (updates[c.id] = { y: center - c.height / 2 })
      );
    }
    Object.entries(updates).forEach(([id, data]) =>
      batchUpdateComponent([id], data)
    );
  };
  // 批量分布
  const handleDistribute = (type: "horizontal" | "vertical") => {
    if (selectedIds.length < 3) return;
    const selectedComps = components.filter((c) => selectedIds.includes(c.id));
    if (selectedComps.length < 3) return;
    if (type === "horizontal") {
      const sorted = [...selectedComps].sort((a, b) => a.x - b.x);
      const minX = sorted[0].x;
      const maxR =
        sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
      const totalWidth = sorted.reduce((sum, c) => sum + c.width, 0);
      const gap = (maxR - minX - totalWidth) / (sorted.length - 1);
      let curX = minX;
      sorted.forEach((c) => {
        batchUpdateComponent([c.id], { x: curX });
        curX += c.width + gap;
      });
    } else if (type === "vertical") {
      const sorted = [...selectedComps].sort((a, b) => a.y - b.y);
      const minY = sorted[0].y;
      const maxB =
        sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
      const totalHeight = sorted.reduce((sum, c) => sum + c.height, 0);
      const gap = (maxB - minY - totalHeight) / (sorted.length - 1);
      let curY = minY;
      sorted.forEach((c) => {
        batchUpdateComponent([c.id], { y: curY });
        curY += c.height + gap;
      });
    }
  };

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
      id="report-canvas-main"
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
      onClick={() => {
        if (lastActionRef.current === "select") {
          lastActionRef.current = ""; // 框选后不清空，并重置
          return;
        }
        setSelectedIds([]);
      }}
    >
      {/* 标尺 */}
      {renderRuler()}
      {/* 网格 */}
      {renderGrid()}
      {/* 画布内容区（标准结构，支持框选和组件交互） */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          width: canvasConfig.width,
          height: canvasConfig.height,
          userSelect: selectRect ? "none" : undefined,
          zIndex: 10,
          background: "transparent",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* 框选可视化 */}
        {selectRect && (
          <div
            style={{
              position: "absolute",
              left: selectRect.x,
              top: selectRect.y,
              width: selectRect.w,
              height: selectRect.h,
              border: "1.5px dashed #1976d2",
              background: "rgba(25, 118, 210, 0.08)",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        )}
        {/* 组件容器，pointerEvents受isSelecting控制 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: isSelecting ? "none" : "auto",
            zIndex: 20,
          }}
        >
          {/* 批量操作工具栏 */}
          {selectedIds.length > 1 && (
            <div
              style={{ position: "absolute", left: 24, top: 12, zIndex: 2000 }}
            >
              <BatchToolbar
                selectedCount={selectedIds.length}
                canDistribute={selectedIds.length >= 3}
                onDeleteSelected={handleDeleteSelected}
                onBatchLock={handleBatchLock}
                onBatchVisible={handleBatchVisible}
                onShowAll={handleShowAll}
                onAlign={handleAlign}
                onDistribute={handleDistribute}
              />
            </div>
          )}
          {components.length === 0 && <div>拖拽左侧组件到此处</div>}
          {components.map((comp) => (
            <ComponentItem
              key={comp.id}
              comp={comp}
              isSelected={selectedIds.includes(comp.id)}
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
    </div>
  );
}
