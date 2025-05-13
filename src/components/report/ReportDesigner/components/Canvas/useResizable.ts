import type { CanvasComponent } from "../../types";
import { getSnapAndGuides } from "../../utils";
import { useRef } from "react";

export interface UseResizableProps {
  width: number;
  height: number;
  x: number;
  y: number;
  minWidth?: number;
  minHeight?: number;
  onResize: (rect: {
    width: number;
    height: number;
    x: number;
    y: number;
  }) => void;
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
}

export function useResizable({
  width,
  height,
  x,
  y,
  minWidth = 20,
  minHeight = 20,
  onResize,
  allComponents,
  selfId,
  canvasWidth,
  canvasHeight,
  snapThreshold = 8,
  onGuideChange,
}: UseResizableProps) {
  const start = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    anchor: "",
  });

  function handleMouseDown(e: React.MouseEvent, anchor: string) {
    e.stopPropagation();
    start.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height,
      left: x,
      top: y,
      anchor,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const deltaX = e.clientX - start.current.x;
    const deltaY = e.clientY - start.current.y;
    let newWidth = start.current.width;
    let newHeight = start.current.height;
    let newX = start.current.left;
    let newY = start.current.top;
    const anchor = start.current.anchor;
    if (anchor.includes("e"))
      newWidth = Math.max(start.current.width + deltaX, minWidth);
    if (anchor.includes("s"))
      newHeight = Math.max(start.current.height + deltaY, minHeight);
    if (anchor.includes("w")) {
      newWidth = Math.max(start.current.width - deltaX, minWidth);
      newX = start.current.left + deltaX;
    }
    if (anchor.includes("n")) {
      newHeight = Math.max(start.current.height - deltaY, minHeight);
      newY = start.current.top + deltaY;
    }
    // 限制最大宽高，防止拉伸出画布
    if (typeof canvasWidth === "number") {
      newWidth = Math.min(newWidth, canvasWidth - newX);
    }
    if (typeof canvasHeight === "number") {
      newHeight = Math.min(newHeight, canvasHeight - newY);
    }
    // 吸附逻辑
    let snapResult = null;
    if (
      allComponents &&
      typeof selfId === "string" &&
      typeof canvasWidth === "number" &&
      typeof canvasHeight === "number"
    ) {
      snapResult = getSnapAndGuides(
        newX,
        newY,
        selfId,
        allComponents,
        canvasWidth,
        canvasHeight,
        snapThreshold,
        newWidth,
        newHeight,
        0 // RULER_SIZE
      );
      if (snapResult) {
        if (snapResult.snapX !== undefined) newX = snapResult.snapX;
        if (snapResult.snapY !== undefined) newY = snapResult.snapY;
        if (onGuideChange) onGuideChange(snapResult.guide);
      }
    } else {
      if (onGuideChange) onGuideChange(null);
    }
    onResize({ width: newWidth, height: newHeight, x: newX, y: newY });
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    if (onGuideChange) onGuideChange(null);
  }

  return { handleMouseDown };
}
