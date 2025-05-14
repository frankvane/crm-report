import type { CanvasComponent } from "../../types";
import React from "react";
import { useRef } from "react";
import { useResizable } from "./useResizable";

const anchors = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function getAnchorStyle(anchor: string, width: number, height: number) {
  const size = 10;
  const half = size / 2;
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: "#fff",
    border: "2px solid #1890ff",
    borderRadius: 4,
    zIndex: 10,
    cursor: `${anchor}-resize`,
    boxSizing: "border-box",
  };
  switch (anchor) {
    case "nw":
      style.left = -half;
      style.top = -half;
      break;
    case "n":
      style.left = width / 2 - half;
      style.top = -half;
      break;
    case "ne":
      style.left = width - half;
      style.top = -half;
      break;
    case "e":
      style.left = width - half;
      style.top = height / 2 - half;
      break;
    case "se":
      style.left = width - half;
      style.top = height - half;
      break;
    case "s":
      style.left = width / 2 - half;
      style.top = height - half;
      break;
    case "sw":
      style.left = -half;
      style.top = height - half;
      break;
    case "w":
      style.left = -half;
      style.top = height / 2 - half;
      break;
  }
  return style;
}

interface ResizableWrapperProps {
  baseProps: {
    width: number;
    height: number;
    x: number;
    y: number;
    locked?: boolean;
  };
  onResize: (rect: {
    width: number;
    height: number;
    x: number;
    y: number;
  }) => void;
  selected: boolean;
  children: React.ReactNode;
  allComponents?: CanvasComponent[];
  selfId?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  snapThreshold?: number;
  onGuideChange?: (
    guide: {
      x?: number;
      y?: number;
      xHighlight?: boolean;
      yHighlight?: boolean;
    } | null
  ) => void;
  handleDragStart?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function useDraggable({
  x,
  y,
  onDrag,
  locked,
}: {
  x: number;
  y: number;
  onDrag: (pos: { x: number; y: number }) => void;
  locked?: boolean;
}) {
  const start = useRef({ x: 0, y: 0, left: 0, top: 0 });
  function handleDragMouseDown(e: React.MouseEvent) {
    if (locked) return;
    // 只允许左键
    if (e.button !== 0) return;
    e.stopPropagation();
    start.current = { x: e.clientX, y: e.clientY, left: x, top: y };
    window.addEventListener("mousemove", handleDragMouseMove);
    window.addEventListener("mouseup", handleDragMouseUp);
  }
  function handleDragMouseMove(e: MouseEvent) {
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    const newX = start.current.left + deltaX;
    const newY = start.current.top + deltaY;
    onDrag({ x: newX, y: newY });
  }
  function handleDragMouseUp() {
    window.removeEventListener("mousemove", handleDragMouseMove);
    window.removeEventListener("mouseup", handleDragMouseUp);
  }
  return { handleDragMouseDown };
}

export const ResizableWrapper: React.FC<ResizableWrapperProps> = (props) => {
  // 兜底，保证 baseProps 一定有值
  const baseProps = props.baseProps ?? {
    width: 120,
    height: 40,
    x: 0,
    y: 0,
    locked: false,
  };
  const { width, height, x, y, locked } = baseProps;
  const { handleMouseDown } = useResizable({
    width,
    height,
    x,
    y,
    onResize: props.onResize,
    allComponents: props.allComponents,
    selfId: props.selfId,
    canvasWidth: props.canvasWidth,
    canvasHeight: props.canvasHeight,
    snapThreshold: props.snapThreshold,
    onGuideChange: props.onGuideChange,
  });
  const { handleDragMouseDown } = useDraggable({
    x,
    y,
    locked,
    onDrag: (pos) => {
      // 只更新位置，不改变宽高
      props.onResize({ width, height, x: pos.x, y: pos.y });
    },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        border: props.selected ? "2px solid #1890ff" : "1px solid #e5e5e5",
        borderRadius: 6,
        background: "#fafafa",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 16,
        color: "#333",
        cursor: locked ? "not-allowed" : "move",
        zIndex: props.selected ? 1000 : 1,
        opacity: locked ? 0.5 : 1,
        pointerEvents: "auto",
        boxSizing: "border-box",
      }}
      onMouseDown={
        locked
          ? undefined
          : (e) => {
              if ((e.target as HTMLElement).classList.contains("resize-anchor"))
                return;
              // 先处理拖拽移动
              handleDragMouseDown(e);
              // 兼容原有 handleDragStart
              console.log("[ResizableWrapper] handleDragStart", e);
              props.handleDragStart?.(e);
            }
      }
      onContextMenu={(e) => {
        console.log("[ResizableWrapper] onContextMenu", e);
        props.onContextMenu?.(e);
      }}
    >
      {props.children}
      {props.selected &&
        !locked &&
        anchors.map((anchor) => (
          <div
            key={anchor}
            className="resize-anchor"
            style={getAnchorStyle(anchor, width, height)}
            onMouseDown={(e) => {
              console.log(
                "[ResizableWrapper] resize-anchor onMouseDown",
                anchor,
                e
              );
              handleMouseDown(e, anchor);
            }}
          />
        ))}
    </div>
  );
};
