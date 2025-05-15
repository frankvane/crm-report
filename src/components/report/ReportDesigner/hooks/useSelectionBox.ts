import { useCallback, useRef, useState } from "react";

import type { ReportComponent } from "@report/ReportDesigner/types/component";

export function useSelectionBox(
  components: ReportComponent[],
  setSelectedIds: (ids: string[]) => void
) {
  const [selectRect, setSelectRect] = useState<null | {
    x: number;
    y: number;
    w: number;
    h: number;
  }>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isSelectingRef = useRef(false);
  const selectThresholdWRef = useRef(5);
  const selectThresholdHRef = useRef(5);
  const componentsRef = useRef<ReportComponent[]>(components);
  componentsRef.current = components;
  const setSelectedIdsRef = useRef<(ids: string[]) => void>(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const dx = Math.abs(curX - dragStart.current.x);
    const dy = Math.abs(curY - dragStart.current.y);
    if (
      !isSelectingRef.current &&
      dx > selectThresholdWRef.current &&
      dy > selectThresholdHRef.current
    ) {
      isSelectingRef.current = true;
      setIsSelecting(true);
    }
    if (isSelectingRef.current) {
      const x = Math.min(dragStart.current.x, curX);
      const y = Math.min(dragStart.current.y, curY);
      const w = Math.abs(curX - dragStart.current.x);
      const h = Math.abs(curY - dragStart.current.y);
      setSelectRect({ x, y, w, h });
    }
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (!dragStart.current) return;
    const canvas = document.getElementById("report-canvas-main");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const offsetLeft = 16;
    const offsetTop = 16;
    const endX = e.clientX - rect.left - offsetLeft;
    const endY = e.clientY - rect.top - offsetTop;
    const startX = dragStart.current.x - offsetLeft;
    const startY = dragStart.current.y - offsetTop;
    const x1 = Math.min(startX, endX);
    const y1 = Math.min(startY, endY);
    const x2 = Math.max(startX, endX);
    const y2 = Math.max(startY, endY);
    if (isSelectingRef.current) {
      const selected = componentsRef.current.filter((c: ReportComponent) => {
        const cx1 = c.x;
        const cy1 = c.y;
        const cx2 = c.x + c.width;
        const cy2 = c.y + c.height;
        return cx1 < x2 && cx2 > x1 && cy1 < y2 && cy2 > y1;
      });
      setSelectedIdsRef.current(selected.map((c: ReportComponent) => c.id));
    } else {
      const mouseX = endX;
      const mouseY = endY;
      const hit = componentsRef.current.find(
        (c: ReportComponent) =>
          mouseX >= c.x &&
          mouseX <= c.x + c.width &&
          mouseY >= c.y &&
          mouseY <= c.y + c.height
      );
      setSelectedIdsRef.current(hit ? [hit.id] : []);
    }
    setSelectRect(null);
    dragStart.current = null;
    setIsSelecting(false);
    isSelectingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMoveRef.current!);
    document.removeEventListener("mouseup", handleMouseUpRef.current!);
  }, []);

  const handleMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const handleMouseUpRef = useRef<((e: MouseEvent) => void) | null>(null);
  handleMouseMoveRef.current = handleMouseMove;
  handleMouseUpRef.current = handleMouseUp;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    dragStart.current = { x: startX, y: startY };
    setSelectRect(null);
    setIsSelecting(false);
    isSelectingRef.current = false;
    if (components.length > 0) {
      selectThresholdWRef.current = Math.max(
        5,
        Math.min(...components.map((c: ReportComponent) => c.width))
      );
      selectThresholdHRef.current = Math.max(
        5,
        Math.min(...components.map((c: ReportComponent) => c.height))
      );
    } else {
      selectThresholdWRef.current = 5;
      selectThresholdHRef.current = 5;
    }
    document.addEventListener("mousemove", handleMouseMoveRef.current!);
    document.addEventListener("mouseup", handleMouseUpRef.current!);
  };

  return {
    selectRect,
    isSelecting,
    handleMouseDown,
  };
}
