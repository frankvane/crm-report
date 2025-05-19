let justSelectedByBox = false;

import React, { useEffect, useRef } from "react";
import { getAlignUpdates, getDistributeUpdates } from "../../utils";
import {
  useCanvasStore,
  useComponentsStore,
  useSelectionStore,
} from "@report/ReportDesigner/store";

import BatchToolbar from "./BatchToolbar";
import CanvasContent from "./CanvasContent";
import Grid from "./Grid";
import type { ReportComponent } from "@report/ReportDesigner/types/component";
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
  const undo = useComponentsStore((s) => s.undo);
  const redo = useComponentsStore((s) => s.redo);

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

  // 剪贴板，存储复制的组件数据
  const clipboardRef = useRef<ReportComponent[] | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      // Ctrl+Z 撤销
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      // Ctrl+Y 重做
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      // Delete/Backspace 删除
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        e.preventDefault();
        batchRemoveComponent(selectedIds);
        return;
      }
      // Ctrl+C 复制
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          const copied = components.filter((c) => selectedIds.includes(c.id));
          clipboardRef.current = JSON.parse(JSON.stringify(copied));
        }
        return;
      }
      // Ctrl+V 粘贴
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (clipboardRef.current && clipboardRef.current.length > 0) {
          e.preventDefault();
          const pasted: ReportComponent[] = clipboardRef.current.map((comp) => {
            // 生成新id，位置偏移
            const newId = `${comp.id}_paste_${Date.now()}_${Math.floor(
              Math.random() * 10000
            )}`;
            return {
              ...comp,
              id: newId,
              x: (comp.x || 0) + 30,
              y: (comp.y || 0) + 30,
              name: undefined, // 让store自动生成name
            };
          });
          pasted.forEach((comp) => addComponent(comp));
          // 粘贴后选中新组件
          setTimeout(() => {
            setSelectedIds(pasted.map((c) => c.id));
          }, 0);
        }
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    components,
    selectedIds,
    batchRemoveComponent,
    addComponent,
    setSelectedIds,
    undo,
    redo,
  ]);

  return (
    <>
      {/* 新增的容器 div */}
      <div
        style={{
          display: "flex",
          flexDirection: "column", // 垂直堆叠
          alignItems: "center", // 水平居中（相对于此容器）
          width: "100%", // 填充父容器宽度
          height: "100%", // 填充父容器高度
          margin: "auto",
        }}
      >
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
            onResize={(id, w, h) =>
              updateComponent(id, { width: w, height: h })
            }
            onMove={(id, x, y) => updateComponent(id, { x, y })}
          />
        </div>
      </div>
    </>
  );
}
