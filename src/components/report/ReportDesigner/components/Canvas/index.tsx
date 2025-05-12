import ContextMenu, { MenuItem } from "../ContextMenu";
import React, { useEffect, useState } from "react";

import type { CanvasComponent } from "../../types";
import ChartComponent from "../../../components/ChartComponent";
import GridLines from "./GridLines";
import Ruler from "./Ruler";
import TableComponent from "../../../components/TableComponent";
import TextComponent from "../../../components/TextComponent";
import { useCanvasDrag } from "../../hooks";

interface CanvasProps {
  components: CanvasComponent[];
  onDrop: (type: string, x: number, y: number) => void;
  onComponentMove: (id: string, x: number, y: number) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  width: number;
  height: number;
  handleDelete: (id: string) => void;
  handleCopy: (id: string) => void;
  handleMoveToTop: (id: string) => void;
  handleMoveToBottom: (id: string) => void;
  handleToggleLock: (id: string) => void;
  handleToggleVisible: (id: string) => void;
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

// 组件类型到实际组件的映射
const componentMap: Record<string, React.FC> = {
  text: TextComponent,
  table: TableComponent,
  chart: ChartComponent,
};

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

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    compId: string | null;
  }>({ visible: false, x: 0, y: 0, compId: null });

  // 右键菜单关闭
  const closeContextMenu = () =>
    setContextMenu({ visible: false, x: 0, y: 0, compId: null });

  // 右键菜单操作
  const handleContextMenu = (e: React.MouseEvent, compId: string) => {
    e.preventDefault();
    setSelectedIds([compId]);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, compId });
  };

  // 右键菜单操作项
  const handleMenuCopy = () => {
    if (contextMenu.compId) handleCopy(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuMoveToTop = () => {
    if (contextMenu.compId) handleMoveToTop(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuMoveToBottom = () => {
    if (contextMenu.compId) handleMoveToBottom(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuToggleLock = () => {
    if (contextMenu.compId) handleToggleLock(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuToggleVisible = () => {
    if (contextMenu.compId) handleToggleVisible(contextMenu.compId);
    closeContextMenu();
  };

  // 右键菜单删除
  const handleMenuDelete = () => {
    if (contextMenu.compId) handleDelete(contextMenu.compId);
    closeContextMenu();
  };

  // 点击空白处关闭菜单
  React.useEffect(() => {
    if (!contextMenu.visible) return;
    const onClick = () => closeContextMenu();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [contextMenu.visible]);

  // 键盘Delete批量删除选中组件
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        selectedIds.length > 0 &&
        (e.key === "Delete" || e.key === "Backspace")
      ) {
        selectedIds.forEach((id) => handleDelete(id));
        setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIds, handleDelete, setSelectedIds]);

  // 右键菜单项生成
  const menuItems: MenuItem[] = [];
  if (contextMenu.compId) {
    menuItems.push(
      { label: "删除", onClick: handleMenuDelete },
      { label: "复制", onClick: handleMenuCopy },
      { label: "置顶", onClick: handleMenuMoveToTop },
      { label: "置底", onClick: handleMenuMoveToBottom },
      {
        label: (() => {
          const comp = components.find((c) => c.id === contextMenu.compId);
          return comp?.locked ? "解锁" : "锁定";
        })(),
        onClick: handleMenuToggleLock,
      },
      {
        label: (() => {
          const comp = components.find((c) => c.id === contextMenu.compId);
          return comp?.visible === false ? "显示" : "隐藏";
        })(),
        onClick: handleMenuToggleVisible,
      }
    );
  }

  // 显示全部隐藏组件
  const handleShowAll = () => {
    components.forEach((comp) => {
      if (comp.visible === false && handleToggleVisible) {
        handleToggleVisible(comp.id);
      }
    });
    closeContextMenu();
  };

  // 框选选区状态
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    active: boolean;
  }>({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });

  // 框选开始
  const handleSelectionMouseDown = (e: React.MouseEvent) => {
    // 只允许在空白区域左键框选
    if (e.button !== 0 || e.target !== contentRef.current) return;
    const rect = contentRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectionBox({ startX: x, startY: y, endX: x, endY: y, active: true });
  };

  // 框选移动（实时高亮叠加）
  const handleSelectionMouseMove = (e: React.MouseEvent) => {
    if (!selectionBox.active) return;
    const rect = contentRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectionBox((prev) => ({ ...prev, endX: x, endY: y }));

    // 实时计算选区内组件
    const minX = Math.min(selectionBox.startX, x);
    const maxX = Math.max(selectionBox.startX, x);
    const minY = Math.min(selectionBox.startY, y);
    const maxY = Math.max(selectionBox.startY, y);
    const selected = components
      .filter((comp) => {
        if (comp.visible === false) return false;
        const compLeft = comp.x;
        const compTop = comp.y;
        const compRight = comp.x + COMPONENT_WIDTH;
        const compBottom = comp.y + COMPONENT_HEIGHT;
        return (
          compRight > minX &&
          compLeft < maxX &&
          compBottom > minY &&
          compTop < maxY
        );
      })
      .map((comp) => comp.id);
    if (e.shiftKey || e.ctrlKey) {
      // 合并高亮（拖动过程中实时合并）
      setSelectedIds((prev: string[]) =>
        Array.from(new Set([...prev, ...selected]))
      );
    } else {
      setSelectedIds(selected);
    }
  };

  // 框选结束（支持shift/ctrl合并选中）
  const handleSelectionMouseUp = (e?: React.MouseEvent) => {
    if (!selectionBox.active) return;
    // 计算选区范围
    const minX = Math.min(selectionBox.startX, selectionBox.endX);
    const maxX = Math.max(selectionBox.startX, selectionBox.endX);
    const minY = Math.min(selectionBox.startY, selectionBox.endY);
    const maxY = Math.max(selectionBox.startY, selectionBox.endY);
    // 判断哪些组件被覆盖
    const selected = components
      .filter((comp) => {
        if (comp.visible === false) return false;
        const compLeft = comp.x;
        const compTop = comp.y;
        const compRight = comp.x + COMPONENT_WIDTH;
        const compBottom = comp.y + COMPONENT_HEIGHT;
        return (
          compRight > minX &&
          compLeft < maxX &&
          compBottom > minY &&
          compTop < maxY
        );
      })
      .map((comp) => comp.id);
    // shift/ctrl 合并选中
    if (
      (e && (e.shiftKey || e.ctrlKey)) ||
      (window.event &&
        ((window.event as MouseEvent).shiftKey ||
          (window.event as MouseEvent).ctrlKey))
    ) {
      // 合并去重
      setSelectedIds(Array.from(new Set([...selectedIds, ...selected])));
    } else {
      setSelectedIds(selected);
    }
    setSelectionBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
  };

  // 批量操作：删除选中
  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => handleDelete(id));
    setSelectedIds([]);
    closeContextMenu();
  };

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
      {/* 工具条 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 24px 0 24px",
          height: 48,
          background: "#fff",
          borderBottom: "1px solid #e5e5e5",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          zIndex: 10001,
        }}
      >
        <button
          style={{
            padding: "4px 16px",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
            background: "#f5f6fa",
            cursor: "pointer",
          }}
          onClick={handleShowAll}
        >
          显示全部
        </button>
        <button
          style={{
            padding: "4px 16px",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
            background: selectedIds.length > 0 ? "#f5f6fa" : "#f0f0f0",
            color: selectedIds.length > 0 ? undefined : "#bbb",
            cursor: selectedIds.length > 0 ? "pointer" : "not-allowed",
          }}
          onClick={selectedIds.length > 0 ? handleDeleteSelected : undefined}
          disabled={selectedIds.length === 0}
        >
          {selectedIds.length > 0
            ? `删除选中(${selectedIds.length})`
            : "删除选中"}
        </button>
        {/* 预留：后续可添加更多批量操作按钮 */}
      </div>
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          padding: "32px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minWidth: 0,
          minHeight: 0,
          background: "#f5f6fa",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{
            position: "relative",
            width: width,
            height: height,
            background: "#fff",
            border: "2px solid #bfbfbf",
            borderRadius: 12,
          }}
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
            {typedGuideLines?.x !== undefined && (
              <div
                style={{
                  position: "absolute",
                  left: typedGuideLines.x,
                  top: 0,
                  width: 1,
                  height: "100%",
                  borderLeft: typedGuideLines.xHighlight
                    ? "2px solid #0050b3"
                    : "2px solid #ccc",
                  zIndex: 9999,
                  pointerEvents: "none",
                }}
              />
            )}
            {typedGuideLines?.y !== undefined && (
              <div
                style={{
                  position: "absolute",
                  top: typedGuideLines.y,
                  left: 0,
                  height: 1,
                  width: "100%",
                  borderTop: typedGuideLines.yHighlight
                    ? "2px solid #0050b3"
                    : "2px solid #ccc",
                  zIndex: 9999,
                  pointerEvents: "none",
                }}
              />
            )}
            {components.map((comp, idx) => {
              if (comp.visible === false) return null;
              const Comp =
                componentMap[comp.type] ||
                (() => (
                  <div style={{ color: "red" }}>未知组件类型: {comp.type}</div>
                ));
              return (
                <div
                  ref={(el) => {
                    compRefs.current[comp.id] = el;
                  }}
                  key={comp.id}
                  style={{
                    position: "absolute",
                    left: comp.x,
                    top: comp.y,
                    width: COMPONENT_WIDTH,
                    height: COMPONENT_HEIGHT,
                    border: selectedIds.includes(comp.id)
                      ? "2px solid #1890ff"
                      : "1px solid #e5e5e5",
                    borderRadius: 6,
                    background: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 16,
                    color: "#333",
                    cursor: comp.locked ? "not-allowed" : "move",
                    zIndex: 100 + idx,
                    opacity: comp.locked ? 0.5 : 1,
                    pointerEvents: "auto",
                  }}
                  onMouseDown={
                    comp.locked
                      ? undefined
                      : (e) =>
                          compRefs.current[comp.id] !== null &&
                          compRefs.current[comp.id] !== undefined
                            ? handleMouseDown(
                                comp.id,
                                e,
                                compRefs.current[comp.id] as HTMLDivElement
                              )
                            : handleMouseDown(comp.id, e)
                  }
                  onClick={(e) => {
                    if (e.shiftKey || e.ctrlKey) {
                      // shift/ctrl 多选/反选
                      if (selectedIds.includes(comp.id)) {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== comp.id)
                        );
                      } else {
                        setSelectedIds([...selectedIds, comp.id]);
                      }
                    } else {
                      setSelectedIds([comp.id]);
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, comp.id)}
                >
                  <Comp />
                </div>
              );
            })}
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
