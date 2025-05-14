// 单个组件的拖拽/渲染

import React, { useRef } from "react";

import { useDraggable } from "@dnd-kit/core";

// 示例：Label组件渲染（可根据实际注册表扩展）
function LabelComponent({ text }: { text: string }) {
  return <span>{text}</span>;
}

interface ComponentItemProps {
  comp: any;
  isSelected: boolean;
  onSelect: () => void;
  onResize: (w: number, h: number) => void;
}

export default function ComponentItem({
  comp,
  isSelected,
  onSelect,
  onResize,
}: ComponentItemProps) {
  console.log("[ComponentItem] 渲染", comp.id, "isSelected:", isSelected);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: comp.id });
  const resizing = useRef(false);
  const start = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // 缩放事件
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizing.current = true;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      width: comp.width,
      height: comp.height,
    };
    document.addEventListener("mousemove", handleResizing);
    document.addEventListener("mouseup", handleResizeMouseUp);
  };
  const handleResizing = (e: MouseEvent) => {
    if (!resizing.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const newWidth = Math.max(20, start.current.width + dx);
    const newHeight = Math.max(20, start.current.height + dy);
    onResize(newWidth, newHeight);
  };
  const handleResizeMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleResizing);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // 选中
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resizing.current) {
      console.log(
        "[ComponentItem] handleClick 组件id:",
        comp.id,
        "isSelected:",
        isSelected
      );
      onSelect();
    } else {
      console.log("[ComponentItem] handleClick 忽略(正在缩放)", comp.id);
    }
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: comp.x + (transform?.x || 0),
    top: comp.y + (transform?.y || 0),
    width: comp.width,
    height: comp.height,
    background: "#fff",
    border: isSelected ? "2.5px solid #ff9800" : "1px solid #1976d2",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    color: "#1976d2",
    boxShadow: isSelected ? "0 0 0 3px #ffe0b2" : "0 2px 8px #1976d233",
    cursor: isDragging ? "grabbing" : "move",
    userSelect: "none",
    zIndex: isSelected ? 10 : 1,
    transition: "box-shadow 0.2s, border 0.2s",
    opacity: isDragging ? 0.7 : 1,
    overflow: "visible",
  };

  // 根据类型渲染具体组件
  let content = null;
  if (comp.type === "label") {
    content = <LabelComponent {...comp.props} />;
  } else {
    content = <span>未知组件类型: {comp.type}</span>;
  }

  console.log(
    "[ComponentItem] render return",
    comp.id,
    "isSelected:",
    isSelected
  );
  return (
    <div
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      onClick={handleClick}
      onPointerDown={() => {
        console.log(
          "[ComponentItem] onPointerDown",
          comp.id,
          "isSelected:",
          isSelected
        );
      }}
      onMouseDown={() => {
        console.log(
          "[ComponentItem] onMouseDown",
          comp.id,
          "isSelected:",
          isSelected
        );
      }}
      onPointerUp={() => {
        console.log(
          "[ComponentItem] onPointerUp",
          comp.id,
          "isSelected:",
          isSelected
        );
      }}
    >
      {/* 拖拽手柄（左上角） */}
      <div
        {...listeners}
        {...attributes}
        style={{
          position: "absolute",
          left: -10,
          top: -10,
          width: 18,
          height: 18,
          background: "#1976d2",
          borderRadius: 4,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 12,
          userSelect: "none",
          boxShadow: "0 2px 8px #1976d233",
        }}
        onClick={(e) => e.stopPropagation()} // 防止拖拽手柄点击影响选中
        title="拖拽移动"
      >
        ≡
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        {content}
        {/* 右下角缩放手柄 */}
        {isSelected && (
          <div
            onMouseDown={handleResizeMouseDown}
            style={{
              position: "absolute",
              right: -10,
              bottom: -10,
              width: 18,
              height: 18,
              background: "#fff",
              border: "2.5px solid #ff9800",
              borderRadius: 4,
              cursor: "nwse-resize",
              zIndex: 99,
              boxShadow: "0 2px 8px #1976d233",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "#ff9800",
                borderRadius: 2,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
