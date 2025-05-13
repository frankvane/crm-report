import { useEffect, useState } from "react";

import type { CanvasComponent } from "../../types";

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

  // 全局 mouseup 监听，保证鼠标释放时能正确结束框选
  useEffect(() => {
    if (!selectionBox.active) return;
    const handleUp = (e: MouseEvent) => {
      if (!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      // 鼠标松开时的点，转为contentRef内坐标
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleSelectionMouseUp(x, y);
    };
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [selectionBox.active]);

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
    // 先更新选区
    setSelectionBox((prev) => ({ ...prev, endX: x, endY: y }));

    // 用最新的 startX/startY 和当前 x/y 计算选区
    const minX = Math.min(selectionBox.startX, x);
    const maxX = Math.max(selectionBox.startX, x);
    const minY = Math.min(selectionBox.startY, y);
    const maxY = Math.max(selectionBox.startY, y);
    const selected = components
      .filter((comp) => {
        if (comp.visible === false) return false;
        const compLeft = comp.x;
        const compTop = comp.y;
        const compRight = comp.x + (comp.width ?? COMPONENT_WIDTH);
        const compBottom = comp.y + (comp.height ?? COMPONENT_HEIGHT);
        // 只要有部分区域在框选区内就算命中
        const isIntersect =
          compLeft < maxX &&
          compRight > minX &&
          compTop < maxY &&
          compBottom > minY;
        return isIntersect;
      })
      .map((comp) => comp.id);
    if (e.shiftKey || e.ctrlKey) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selected])));
    } else {
      setSelectedIds(selected);
    }
  };

  // 框选结束，x/y为鼠标松开时相对于contentRef的坐标
  const handleSelectionMouseUp = (x?: number, y?: number) => {
    if (!selectionBox.active) return;
    // 如果没传x/y，默认用selectionBox.endX/endY
    const endX = typeof x === "number" ? x : selectionBox.endX;
    const endY = typeof y === "number" ? y : selectionBox.endY;
    const minX = Math.min(selectionBox.startX, endX);
    const maxX = Math.max(selectionBox.startX, endX);
    const minY = Math.min(selectionBox.startY, endY);
    const maxY = Math.max(selectionBox.startY, endY);
    const selected = components
      .filter((comp) => {
        if (comp.visible === false) return false;
        const compLeft = comp.x;
        const compTop = comp.y;
        const compRight = comp.x + (comp.width ?? COMPONENT_WIDTH);
        const compBottom = comp.y + (comp.height ?? COMPONENT_HEIGHT);
        // 只要有部分区域在框选区内就算命中
        const isIntersect =
          compLeft < maxX &&
          compRight > minX &&
          compTop < maxY &&
          compBottom > minY;
        return isIntersect;
      })
      .map((comp) => comp.id);
    if (
      window.event &&
      ((window.event as MouseEvent).shiftKey ||
        (window.event as MouseEvent).ctrlKey)
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
