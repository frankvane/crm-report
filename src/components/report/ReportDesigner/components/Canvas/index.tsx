import {
  alignComponents,
  batchLock,
  batchVisible,
  distributeComponents,
} from "./batchActions";

import BatchToolbar from "./BatchToolbar";
import type { CanvasComponent } from "../../types";
import { ComponentRenderer } from "./ComponentRenderer";
import ContextMenu from "../ContextMenu";
import GridLines from "./GridLines";
import { GuideLines } from "./GuideLines";
import React from "react";
import Ruler from "./Ruler";
import { useCanvasDrag } from "../../hooks";
import { useContextMenu } from "./useContextMenu";
import { useSelectionBox } from "./useSelectionBox";

interface CanvasProps {
  components: CanvasComponent[];
  onDrop: (type: string, x: number, y: number) => void;
  onComponentMove: (id: string, x: number, y: number) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  width: number;
  height: number;
  handleDelete: (id: string) => void;
  handleCopy: (id: string) => void;
  handleMoveToTop: (id: string) => void;
  handleMoveToBottom: (id: string) => void;
  handleToggleLock: (id: string) => void;
  handleToggleVisible: (id: string) => void;
  handlePropertyChange: (formData: Partial<CanvasComponent>) => void;
}

const SNAP_THRESHOLD = 8; // px 吸附阈值
const COMPONENT_WIDTH = 120;
const COMPONENT_HEIGHT = 40;
const RULER_STEP = 40;
const RULER_SIZE = 24;

// 定义辅助线类型
interface GuideLines {
  x?: number;
  y?: number;
  xHighlight?: boolean;
  yHighlight?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  onDrop,
  onComponentMove,
  selectedIds,
  setSelectedIds,
  width,
  height,
  handleDelete,
  handleCopy,
  handleMoveToTop,
  handleMoveToBottom,
  handleToggleLock,
  handleToggleVisible,
  handlePropertyChange,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const {
    canvasRef,
    guideLines,
    handleDrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasDrag({
    components,
    selectedIds,
    onDrop,
    onComponentMove,
    COMPONENT_WIDTH,
    COMPONENT_HEIGHT,
    SNAP_THRESHOLD,
    RULER_SIZE,
    contentRef,
  });

  const typedGuideLines = guideLines as GuideLines | null;

  // 组件 refs 映射
  const compRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // 使用 useContextMenu Hook 管理右键菜单逻辑
  const { contextMenu, closeContextMenu, handleContextMenu, menuItems } =
    useContextMenu({
      components,
      setSelectedIds,
      handleDelete,
      handleCopy,
      handleMoveToTop,
      handleMoveToBottom,
      handleToggleLock,
      handleToggleVisible,
    });

  // 显示全部隐藏组件
  const handleShowAll = () => {
    components.forEach((comp) => {
      if (comp.visible === false && handleToggleVisible) {
        handleToggleVisible(comp.id);
      }
    });
    closeContextMenu();
  };

  // 使用 useSelectionBox Hook 管理框选逻辑
  const {
    selectionBox,
    handleSelectionMouseDown,
    handleSelectionMouseMove,
    handleSelectionMouseUp,
  } = useSelectionBox({
    contentRef,
    components,
    setSelectedIds,
    COMPONENT_WIDTH,
    COMPONENT_HEIGHT,
  });

  // 批量操作：删除选中
  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => handleDelete(id));
    setSelectedIds([]);
    closeContextMenu();
  };

  // 批量操作事件（调用工具函数）
  const handleAlign = (
    type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
  ) => {
    alignComponents(
      components,
      selectedIds,
      type,
      onComponentMove,
      COMPONENT_WIDTH,
      COMPONENT_HEIGHT
    );
  };
  const handleDistribute = (type: "horizontal" | "vertical") => {
    distributeComponents(components, selectedIds, type, onComponentMove);
  };
  const handleBatchLock = (locked: boolean) => {
    batchLock(components, selectedIds, locked, handleToggleLock);
  };
  const handleBatchVisible = (visible: boolean) => {
    batchVisible(components, selectedIds, visible, handleToggleVisible);
  };

  // 吸附线状态（缩放专用）
  const [resizeGuideLines, setResizeGuideLines] =
    React.useState<GuideLines | null>(null);

  // 属性变更：用于缩放、属性面板等
  const handlePropertyChangeInternal = (formData: Partial<CanvasComponent>) => {
    if (!selectedIds.length) return;
    const id = selectedIds[0];
    if (!id) return;

    // 直接调用 props 传递下来的 handlePropertyChange，带上 id
    handlePropertyChange({ id, ...formData });
  };

  // 全局Delete键监听，支持快捷删除
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIds.length > 0) {
        handleDeleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          position: "relative",
          width: width,
          margin: "0 auto",
        }}
      >
        {/* 批量工具栏 居中在画布上方 */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
          }}
        >
          <BatchToolbar
            selectedCount={selectedIds.length}
            canDistribute={selectedIds.length >= 3}
            onShowAll={handleShowAll}
            onDeleteSelected={handleDeleteSelected}
            onAlign={handleAlign}
            onDistribute={handleDistribute}
            onBatchLock={handleBatchLock}
            onBatchVisible={handleBatchVisible}
          />
        </div>
        {/* 画布内容区整体偏移，预留刻度尺空间 */}
        <div
          ref={canvasRef}
          style={{
            position: "relative",
            width: width,
            height: height,
            background: "#fff",
            border: "2px solid #bfbfbf",
            borderRadius: 12,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* 顶部刻度尺 */}
          <div
            style={{
              position: "absolute",
              left: RULER_SIZE,
              top: 0,
              width: width - RULER_SIZE,
              height: RULER_SIZE,
              zIndex: 1000,
            }}
          >
            <Ruler
              length={width - RULER_SIZE}
              step={RULER_STEP}
              direction="horizontal"
            />
          </div>
          {/* 左侧刻度尺 */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: RULER_SIZE,
              width: RULER_SIZE,
              height: height - RULER_SIZE,
              zIndex: 1000,
            }}
          >
            <Ruler
              length={height - RULER_SIZE}
              step={RULER_STEP}
              direction="vertical"
            />
          </div>
          {/* 内容区整体偏移，预留刻度尺空间 */}
          <div
            ref={contentRef}
            style={{
              position: "absolute",
              left: RULER_SIZE,
              top: RULER_SIZE,
              width: width - RULER_SIZE,
              height: height - RULER_SIZE,
              userSelect: selectionBox.active ? "none" : undefined,
            }}
            onMouseDown={handleSelectionMouseDown}
            onMouseMove={handleSelectionMouseMove}
            onMouseUp={handleSelectionMouseUp}
          >
            {/* 网格虚线辅助线 */}
            <GridLines
              width={width - RULER_SIZE}
              height={height - RULER_SIZE}
              step={RULER_STEP}
            />
            {/* 辅助线渲染 */}
            <GuideLines
              x={resizeGuideLines?.x ?? typedGuideLines?.x}
              y={resizeGuideLines?.y ?? typedGuideLines?.y}
              xHighlight={
                resizeGuideLines?.xHighlight ?? typedGuideLines?.xHighlight
              }
              yHighlight={
                resizeGuideLines?.yHighlight ?? typedGuideLines?.yHighlight
              }
            />
            <ComponentRenderer
              components={components}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              compRefs={compRefs}
              handleMouseDown={handleMouseDown}
              handleContextMenu={handleContextMenu}
              COMPONENT_WIDTH={COMPONENT_WIDTH}
              COMPONENT_HEIGHT={COMPONENT_HEIGHT}
              handlePropertyChange={handlePropertyChangeInternal}
              // 新增吸附相关参数
              canvasWidth={width - RULER_SIZE}
              canvasHeight={height - RULER_SIZE}
              allComponents={components}
              snapThreshold={SNAP_THRESHOLD}
              setResizeGuideLines={setResizeGuideLines}
            />
            {/* 右键菜单渲染 */}
            <ContextMenu
              visible={contextMenu.visible}
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={closeContextMenu}
              menuItems={menuItems}
            />
            {/* 框选选区渲染 */}
            {selectionBox.active && (
              <div
                style={{
                  position: "absolute",
                  left: Math.min(selectionBox.startX, selectionBox.endX),
                  top: Math.min(selectionBox.startY, selectionBox.endY),
                  width: Math.abs(selectionBox.endX - selectionBox.startX),
                  height: Math.abs(selectionBox.endY - selectionBox.startY),
                  background: "rgba(24,144,255,0.08)",
                  border: "1.5px dashed #1890ff",
                  zIndex: 99999,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
