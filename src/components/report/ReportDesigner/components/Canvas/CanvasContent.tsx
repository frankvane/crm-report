import ComponentItem from "./ComponentItem";
import React from "react";

interface CanvasContentProps {
  components: any[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  isSelecting: boolean;
  selectRect: { x: number; y: number; w: number; h: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  onResize: (id: string, w: number, h: number) => void;
}

const CanvasContent: React.FC<CanvasContentProps> = ({
  components,
  selectedIds,
  setSelectedIds,
  isSelecting,
  selectRect,
  handleMouseDown,
  onResize,
}) => {
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
