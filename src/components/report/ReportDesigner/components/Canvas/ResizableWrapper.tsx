import React, { useState } from "react";

import type { CanvasComponent } from "../../types";
import { useResizable } from "./useResizable";

const anchors = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function getAnchorStyle(anchor: string, width: number, height: number) {
  const size = 8;
  const half = size / 2;
  const pos: Record<string, React.CSSProperties> = {
    nw: { left: -half, top: -half, cursor: "nwse-resize" },
    n: { left: width / 2 - half, top: -half, cursor: "ns-resize" },
    ne: { left: width - half, top: -half, cursor: "nesw-resize" },
    e: { left: width - half, top: height / 2 - half, cursor: "ew-resize" },
    se: { left: width - half, top: height - half, cursor: "nwse-resize" },
    s: { left: width / 2 - half, top: height - half, cursor: "ns-resize" },
    sw: { left: -half, top: height - half, cursor: "nesw-resize" },
    w: { left: -half, top: height / 2 - half, cursor: "ew-resize" },
  };
  return {
    position: "absolute" as const,
    width: size,
    height: size,
    background: "#1890ff",
    borderRadius: "50%",
    border: "2px solid #fff",
    zIndex: 10,
    ...pos[anchor],
  };
}

interface ResizableWrapperProps {
  width: number;
  height: number;
  x: number;
  y: number;
  onResize: (rect: {
    width: number;
    height: number;
    x: number;
    y: number;
  }) => void;
  selected: boolean;
  locked?: boolean;
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

export const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  width,
  height,
  x,
  y,
  onResize,
  selected,
  locked,
  children,
  allComponents,
  selfId,
  canvasWidth,
  canvasHeight,
  snapThreshold,
  onGuideChange,
  handleDragStart,
  onContextMenu,
}) => {
  const { handleMouseDown } = useResizable({
    width,
    height,
    x,
    y,
    onResize,
    allComponents,
    selfId,
    canvasWidth,
    canvasHeight,
    snapThreshold,
    onGuideChange,
  });
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        boxSizing: "border-box",
        cursor: locked ? "not-allowed" : "move",
        boxShadow: hover ? "0 2px 8px rgba(0, 0, 0, 0.2)" : undefined,
        transition: "box-shadow 0.18s",
        pointerEvents: "auto",
        opacity: locked ? 0.5 : 1,
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).classList.contains("resize-anchor"))
          return;
        if (!locked) handleDragStart?.(e);
      }}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      {!locked &&
        selected &&
        anchors.map((anchor) => (
          <div
            key={anchor}
            className="resize-anchor"
            style={getAnchorStyle(anchor, width, height)}
            onMouseDown={(e) => handleMouseDown(e, anchor)}
          />
        ))}
    </div>
  );
};
