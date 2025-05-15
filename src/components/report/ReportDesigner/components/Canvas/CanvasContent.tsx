import React, { useRef, useState } from "react";

import ComponentItem from "./ComponentItem";

interface CanvasContentProps {
  components: any[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  isSelecting: boolean;
  selectRect: { x: number; y: number; w: number; h: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  onResize: (id: string, w: number, h: number) => void;
  onMove: (id: string, x: number, y: number) => void;
}

const CanvasContent: React.FC<CanvasContentProps> = ({
  components,
  selectedIds,
  setSelectedIds,
  isSelecting,
  selectRect,
  handleMouseDown,
  onResize,
  onMove,
}) => {
  // 多选包裹框拖动状态
  const [, forceUpdate] = useState({}); // 用于强制刷新
  const isGroupDraggingRef = useRef(false);
  const groupDragStart = useRef<{ x: number; y: number } | null>(null);
  const groupDragOrigin = useRef<Record<string, { x: number; y: number }>>({});

  // 拖动中
  const handleGroupDragging = React.useCallback(
    (e: PointerEvent) => {
      if (!isGroupDraggingRef.current || !groupDragStart.current) return;
      const dx = e.clientX - groupDragStart.current.x;
      const dy = e.clientY - groupDragStart.current.y;
      console.log("[GroupDrag] Dragging", { dx, dy });
      const updates: Record<string, { x: number; y: number }> = {};
      Object.entries(groupDragOrigin.current).forEach(([id, pos]) => {
        updates[id] = { x: pos.x + dx, y: pos.y + dy };
      });
      Object.entries(updates).forEach(([id, data]) => {
        console.log("[GroupDrag] Update", id, data);
        onMove(id, data.x, data.y);
      });
    },
    [onMove]
  );

  // 拖动结束
  const handleGroupPointerUp = React.useCallback(() => {
    console.log("[GroupDrag] PointerUp");
    isGroupDraggingRef.current = false;
    groupDragStart.current = null;
    groupDragOrigin.current = {};
    document.removeEventListener("pointermove", handleGroupDragging);
    document.removeEventListener("pointerup", handleGroupPointerUp);
    forceUpdate({}); // 强制刷新
  }, [handleGroupDragging]);

  // 计算多选包裹框
  let groupBox = null;
  if (selectedIds.length > 1) {
    const selectedComps = components.filter((c) => selectedIds.includes(c.id));
    const minX = Math.min(...selectedComps.map((c) => c.x));
    const minY = Math.min(...selectedComps.map((c) => c.y));
    const maxX = Math.max(...selectedComps.map((c) => c.x + c.width));
    const maxY = Math.max(...selectedComps.map((c) => c.y + c.height));
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    // 拖动手柄事件
    const handleGroupPointerDown = (e: React.PointerEvent) => {
      console.log("[GroupDrag] PointerDown", e.clientX, e.clientY);
      e.stopPropagation();
      e.preventDefault();
      isGroupDraggingRef.current = true;
      groupDragStart.current = { x: e.clientX, y: e.clientY };
      const origin: Record<string, { x: number; y: number }> = {};
      selectedComps.forEach((c) => {
        origin[c.id] = { x: c.x, y: c.y };
      });
      groupDragOrigin.current = origin;
      document.addEventListener("pointermove", handleGroupDragging);
      document.addEventListener("pointerup", handleGroupPointerUp);
    };
    groupBox = (
      <div
        style={{
          position: "absolute",
          left: minX,
          top: minY,
          width: boxW,
          height: boxH,
          border: "2px dashed #1976d2",
          background: "rgba(25, 118, 210, 0.04)",
          zIndex: 999,
          pointerEvents: "auto",
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            position: "absolute",
            right: -14,
            top: -14,
            width: 24,
            height: 24,
            background: "#e53935",
            borderRadius: 6,
            color: "#fff",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
            zIndex: 1000,
            pointerEvents: "auto",
            boxShadow: "0 2px 8px #e5393522",
            border: "2px solid #fff",
          }}
          onPointerDown={handleGroupPointerDown}
          title="拖动选中组件组"
        >
          ≡
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        width: "100%",
        height: "100%",
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
      {/* 多选包裹框 */}
      {groupBox}
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
        {components.length === 0 && <div>拖拽左侧组件到此处</div>}
        {components.map((comp) => (
          <ComponentItem
            key={comp.id}
            comp={comp}
            isSelected={selectedIds.includes(comp.id)}
            onSelect={() => setSelectedIds([comp.id])}
            onResize={(w: number, h: number) => onResize(comp.id, w, h)}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasContent;
