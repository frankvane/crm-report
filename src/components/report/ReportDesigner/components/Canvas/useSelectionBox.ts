import type { CanvasComponent } from "../../types";
import { useState } from "react";

interface SelectionBoxState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
}

interface UseSelectionBoxProps {
  contentRef: React.RefObject<HTMLDivElement>;
  components: CanvasComponent[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
}

export function useSelectionBox({
  contentRef,
  components,
  setSelectedIds,
  COMPONENT_WIDTH,
  COMPONENT_HEIGHT,
}: UseSelectionBoxProps) {
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    active: false,
  });

  // 框选开始
  const handleSelectionMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.target !== contentRef.current) return;
    const rect = contentRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelectionBox({ startX: x, startY: y, endX: x, endY: y, active: true });
  };

  // 框选移动
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
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selected])));
    } else {
      setSelectedIds(selected);
    }
  };

  // 框选结束
  const handleSelectionMouseUp = (e?: React.MouseEvent) => {
    if (!selectionBox.active) return;
    const minX = Math.min(selectionBox.startX, selectionBox.endX);
    const maxX = Math.max(selectionBox.startX, selectionBox.endX);
    const minY = Math.min(selectionBox.startY, selectionBox.endY);
    const maxY = Math.max(selectionBox.startY, selectionBox.endY);
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
    if (
      (e && (e.shiftKey || e.ctrlKey)) ||
      (window.event &&
        ((window.event as MouseEvent).shiftKey ||
          (window.event as MouseEvent).ctrlKey))
    ) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selected])));
    } else {
      setSelectedIds(selected);
    }
    setSelectionBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
  };

  return {
    selectionBox,
    handleSelectionMouseDown,
    handleSelectionMouseMove,
    handleSelectionMouseUp,
    setSelectionBox,
  };
}
