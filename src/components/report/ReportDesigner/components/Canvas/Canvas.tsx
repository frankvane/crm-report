// 画布主组件

import React, { useCallback, useRef, useState } from "react";
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

  // 多选拖动相关状态
  const [isGroupDragging, setIsGroupDragging] = useState(false);
  const groupDragStart = useRef<{ x: number; y: number } | null>(null);
  const groupDragOrigin = useRef<Record<string, { x: number; y: number }>>({});

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

  // 多选拖动手柄事件
  const handleGroupDragPointerDown = (e: React.PointerEvent) => {
    if (selectedIds.length < 2) return; // 只在多选时生效
    e.stopPropagation();
    e.preventDefault();
    setIsGroupDragging(true);
    groupDragStart.current = { x: e.clientX, y: e.clientY };
    // 记录所有选中组件的初始位置
    const origin: Record<string, { x: number; y: number }> = {};
    components.forEach((c) => {
      if (selectedIds.includes(c.id)) {
        origin[c.id] = { x: c.x, y: c.y };
      }
    });
    groupDragOrigin.current = origin;
    document.addEventListener("pointermove", handleGroupDragging);
    document.addEventListener("pointerup", handleGroupDragPointerUp);
  };

  // 多选拖动中
  const handleGroupDragging = (e: PointerEvent) => {
    if (!isGroupDragging || !groupDragStart.current) return;
    const dx = e.clientX - groupDragStart.current.x;
    const dy = e.clientY - groupDragStart.current.y;
    const updates: Record<string, Partial<ReportComponent>> = {};
    Object.entries(groupDragOrigin.current).forEach(([id, pos]) => {
      let newX = pos.x + dx;
      let newY = pos.y + dy;
      if (canvasConfig.allowSnapToGrid) {
        const grid = canvasConfig.gridSize;
        newX = Math.round(newX / grid) * grid;
        newY = Math.round(newY / grid) * grid;
      }
      updates[id] = { x: newX, y: newY };
    });
    Object.entries(updates).forEach(([id, data]) => updateComponent(id, data));
  };

  // 多选拖动结束
  const handleGroupDragPointerUp = () => {
    setIsGroupDragging(false);
    groupDragStart.current = null;
    groupDragOrigin.current = {};
    document.removeEventListener("pointermove", handleGroupDragging);
    document.removeEventListener("pointerup", handleGroupDragPointerUp);
  };

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
          onGroupDragPointerDown={handleGroupDragPointerDown}
        />
      </div>
    </>
  );
}
