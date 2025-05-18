// 画布主组件

// 方案二：全局变量标记本次是否刚刚框选/多选
let justSelectedByBox = false;

import React, { useEffect } from "react";
import { getAlignUpdates, getDistributeUpdates } from "../../utils/align";
import {
  useCanvasStore,
  useComponentsStore,
  useSelectionStore,
} from "@report/ReportDesigner/store";

import BatchToolbar from "./BatchToolbar";
import CanvasContent from "./CanvasContent";
import Grid from "./Grid";
import Ruler from "./Ruler";
import { useBatchActions } from "../../hooks/useBatchActions";
import { useCanvasDnd } from "../../hooks/useCanvasDnd";
import { useComponentMenu } from "../../hooks/useComponentMenu";
import { useDroppable } from "@dnd-kit/core";
import { useSelectionBox } from "../../hooks/useSelectionBox";

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useComponentsStore((s) => s.addComponent);
  const components = useComponentsStore((s) => s.components);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const setSelectedIds = useSelectionStore((s) => s.setSelectedIds);
  const updateComponent = useComponentsStore((s) => s.updateComponent);
  const canvasConfig = useCanvasStore((s) => s.canvasConfig);
  const batchUpdateComponent = useComponentsStore(
    (s) => s.batchUpdateComponent
  );
  const batchRemoveComponent = useComponentsStore(
    (s) => s.batchRemoveComponent
  );
  const batchLockComponent = useComponentsStore((s) => s.batchLockComponent);
  const batchVisibleComponent = useComponentsStore(
    (s) => s.batchVisibleComponent
  );
  const removeComponent = useComponentsStore((s) => s.removeComponent);
  const copyComponent = useComponentsStore((s) => s.copyComponent);
  const moveComponentZIndex = useComponentsStore((s) => s.moveComponentZIndex);

  // 框选相关
  const { selectRect, isSelecting, handleMouseDown } = useSelectionBox(
    components,
    (...args) => {
      setSelectedIds(...args);
      // 只要是框选/单选/点空白，handleMouseUp 都会调用 setSelectedIds
      // 这里标记本次是由 selection box 触发
      justSelectedByBox = true;
      setTimeout(() => {
        justSelectedByBox = false;
      }, 0);
    }
  );

  // 批量操作相关
  const batchActions = useBatchActions(
    components,
    selectedIds,
    batchRemoveComponent,
    batchLockComponent,
    batchVisibleComponent,
    batchUpdateComponent,
    setSelectedIds,
    getAlignUpdates,
    getDistributeUpdates
  );

  // 拖拽相关
  useCanvasDnd({
    components,
    canvasConfig,
    addComponent,
    setSelectedIds,
    updateComponent,
  });

  // 右键菜单事件
  useComponentMenu({
    components,
    updateComponent,
    removeComponent,
    copyComponent,
    moveComponentZIndex,
    setSelectedIds,
  });

  // 计算所有选中组件是否都可旋转
  const allRotatable =
    selectedIds.length > 0 &&
    selectedIds.every((id) => {
      const comp = components.find((c) => c.id === id);
      return comp && comp.rotatable;
    });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        e.preventDefault();
        batchRemoveComponent(selectedIds);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, batchRemoveComponent]);

  return (
    <>
      <BatchToolbar
        selectedCount={selectedIds.length}
        canDistribute={selectedIds.length >= 3}
        allRotatable={allRotatable}
        onDeleteSelected={batchActions.handleDeleteSelected}
        onBatchLock={batchActions.handleBatchLock}
        onBatchVisible={batchActions.handleBatchVisible}
        onShowAll={batchActions.handleShowAll}
        onAlign={batchActions.handleAlign}
        onDistribute={batchActions.handleDistribute}
        onBatchResizable={(resizable) => {
          selectedIds.forEach((id) => updateComponent(id, { resizable }));
        }}
        onBatchRotatable={(rotatable) => {
          selectedIds.forEach((id) => updateComponent(id, { rotatable }));
        }}
        onBatchRotation={(rotation) => {
          selectedIds.forEach((id) => updateComponent(id, { rotation }));
        }}
        onBatchOpacity={(opacity) => {
          selectedIds.forEach((id) => updateComponent(id, { opacity }));
        }}
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
          if (justSelectedByBox) return;
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
