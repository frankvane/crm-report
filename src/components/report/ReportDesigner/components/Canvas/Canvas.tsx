// 画布主组件

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAlignUpdates, getDistributeUpdates } from "../../utils/align";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";

import BatchToolbar from "./BatchToolbar";
import CanvasContent from "./CanvasContent";
import Grid from "./Grid";
import type { ReportComponent } from "../../types/component";
import Ruler from "./Ruler";
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
  const removeComponent = useReportDesignerStore((s) => s.removeComponent);
  const copyComponent = useReportDesignerStore((s) => s.copyComponent);
  const moveComponentZIndex = useReportDesignerStore(
    (s) => s.moveComponentZIndex
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
  const isSelectingRef = useRef(false);
  const selectThresholdWRef = useRef(5);
  const selectThresholdHRef = useRef(5);

  // 用useRef保存最新的组件数据，避免闭包
  const componentsRef = useRef(components);
  componentsRef.current = components;
  const setSelectedIdsRef = useRef(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  // 新增：最近一次操作类型标志位
  const lastActionRef = useRef<string>("");

  // 鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const dx = Math.abs(curX - dragStart.current.x);
    const dy = Math.abs(curY - dragStart.current.y);
    if (
      !isSelectingRef.current &&
      dx > selectThresholdWRef.current &&
      dy > selectThresholdHRef.current
    ) {
      isSelectingRef.current = true;
      setIsSelecting(true);
    }
    if (isSelectingRef.current) {
      const x = Math.min(dragStart.current.x, curX);
      const y = Math.min(dragStart.current.y, curY);
      const w = Math.abs(curX - dragStart.current.x);
      const h = Math.abs(curY - dragStart.current.y);
      setSelectRect({ x, y, w, h });
    }
  }, []);

  // 鼠标抬起
  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const offsetLeft = 16;
    const offsetTop = 16;
    const endX = e.clientX - rect.left - offsetLeft;
    const endY = e.clientY - rect.top - offsetTop;
    const startX = dragStart.current.x - offsetLeft;
    const startY = dragStart.current.y - offsetTop;
    const x1 = Math.min(startX, endX);
    const y1 = Math.min(startY, endY);
    const x2 = Math.max(startX, endX);
    const y2 = Math.max(startY, endY);
    if (isSelectingRef.current) {
      // 框选逻辑
      const selected = componentsRef.current.filter((c) => {
        const cx1 = c.x;
        const cy1 = c.y;
        const cx2 = c.x + c.width;
        const cy2 = c.y + c.height;
        return cx1 < x2 && cx2 > x1 && cy1 < y2 && cy2 > y1;
      });
      setSelectedIdsRef.current(selected.map((c) => c.id));
    } else {
      // 单击逻辑
      const mouseX = endX;
      const mouseY = endY;
      const hit = componentsRef.current.find(
        (c) =>
          mouseX >= c.x &&
          mouseX <= c.x + c.width &&
          mouseY >= c.y &&
          mouseY <= c.y + c.height
      );
      setSelectedIdsRef.current(hit ? [hit.id] : []);
    }
    setSelectRect(null);
    dragStart.current = null;
    setIsSelecting(false);
    isSelectingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMoveRef.current!);
    document.removeEventListener("mouseup", handleMouseUpRef.current!);
  }, []);

  // 鼠标按下开始框选/单选
  const handleMouseDown = (e: React.MouseEvent) => {
    lastActionRef.current = "select";
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    dragStart.current = { x: startX, y: startY };
    setSelectRect(null);
    setIsSelecting(false);
    isSelectingRef.current = false;
    // 计算动态阈值（最小组件宽高）
    if (components.length > 0) {
      selectThresholdWRef.current = Math.max(
        5,
        Math.min(...components.map((c) => c.width))
      );
      selectThresholdHRef.current = Math.max(
        5,
        Math.min(...components.map((c) => c.height))
      );
    } else {
      selectThresholdWRef.current = 5;
      selectThresholdHRef.current = 5;
    }
    document.addEventListener("mousemove", handleMouseMoveRef.current!);
    document.addEventListener("mouseup", handleMouseUpRef.current!);
  };

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
    const updates = getAlignUpdates(components, selectedIds, type);
    Object.entries(updates).forEach(([id, data]) =>
      batchUpdateComponent([id], data as Partial<ReportComponent>)
    );
  };
  // 批量分布
  const handleDistribute = (type: "horizontal" | "vertical") => {
    if (selectedIds.length < 3) return;
    const updates = getDistributeUpdates(components, selectedIds, type);
    Object.entries(updates).forEach(([id, data]) =>
      batchUpdateComponent([id], data as Partial<ReportComponent>)
    );
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const { key, id } = (e as CustomEvent).detail;
      const comp = components.find((c) => c.id === id);
      if (!comp) return;
      switch (key) {
        case "top":
          moveComponentZIndex(id, "top");
          break;
        case "bottom":
          moveComponentZIndex(id, "bottom");
          break;
        case "up":
          moveComponentZIndex(id, "up");
          break;
        case "down":
          moveComponentZIndex(id, "down");
          break;
        case "delete":
          removeComponent(id);
          break;
        case "copy":
          copyComponent(id);
          break;
        case "lock":
          updateComponent(id, { locked: !comp.locked });
          break;
        case "visible":
          updateComponent(id, { visible: !comp.visible });
          break;
        default:
          break;
      }
    };
    window.addEventListener("component-menu", handler);
    return () => window.removeEventListener("component-menu", handler);
  }, [
    components,
    updateComponent,
    removeComponent,
    copyComponent,
    moveComponentZIndex,
  ]);

  return (
    <>
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
        <Ruler canvasConfig={canvasConfig} />
        {/* 网格 */}
        <Grid canvasConfig={canvasConfig} />
        {/* 画布内容区（标准结构，支持框选和组件交互） */}
        <CanvasContent
          components={components}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isSelecting={isSelecting}
          selectRect={selectRect}
          handleMouseDown={handleMouseDown}
          onResize={(id, w, h) => updateComponent(id, { width: w, height: h })}
          onMove={(id, x, y) => updateComponent(id, { x, y })}
        />
      </div>
    </>
  );
}
