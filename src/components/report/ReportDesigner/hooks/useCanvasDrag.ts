import { useRef, useState } from "react";

import type { CanvasComponent } from "../types";
import { getSnapAndGuides } from "../utils";

interface UseCanvasDragProps {
  components: CanvasComponent[];
  width: number;
  height: number;
  onDrop: (type: string, x: number, y: number) => void;
  onComponentMove: (id: string, x: number, y: number) => void;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
  SNAP_THRESHOLD: number;
  RULER_SIZE: number;
  contentRef: React.RefObject<HTMLDivElement>;
}

export function useCanvasDrag({
  components,
  width,
  height,
  onDrop,
  onComponentMove,
  COMPONENT_WIDTH,
  COMPONENT_HEIGHT,
  SNAP_THRESHOLD,
  RULER_SIZE,
  contentRef,
}: UseCanvasDragProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [guideLines, setGuideLines] = useState<{
    x?: number;
    y?: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 拖拽新组件到画布
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (!type) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - RULER_SIZE - COMPONENT_WIDTH / 2;
    const y = e.clientY - rect.top - RULER_SIZE - COMPONENT_HEIGHT / 2;
    onDrop(type, x, y);
  };

  // 画布内组件拖拽
  const handleMouseDown = (
    id: string,
    e: React.MouseEvent,
    domOrRef?: HTMLDivElement | React.RefObject<HTMLDivElement>
  ) => {
    setDraggingId(id);
    let dom: HTMLDivElement | null = null;
    if (domOrRef) {
      if (typeof (domOrRef as any).current !== "undefined") {
        dom = (domOrRef as React.RefObject<HTMLDivElement>).current;
      } else {
        dom = domOrRef as HTMLDivElement;
      }
    }
    if (dom && contentRef.current) {
      const contentRect = contentRef.current.getBoundingClientRect();
      const compRect = dom.getBoundingClientRect();
      // 鼠标在内容区的坐标
      const mouseX = e.clientX - contentRect.left;
      const mouseY = e.clientY - contentRect.top;
      // 组件左上角在内容区的坐标
      const compX = compRect.left - contentRect.left;
      const compY = compRect.top - contentRect.top;
      const offsetX = mouseX - compX;
      const offsetY = mouseY - compY;
      setDragOffset({ x: offsetX, y: offsetY });
      return;
    }
    // fallback
    const target = e.target as HTMLElement;
    const compRect = target.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const offsetX = mouseX - compRect.left;
    const offsetY = mouseY - compRect.top;
    setDragOffset({ x: offsetX, y: offsetY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    if (!contentRef.current) return;
    const contentRect = contentRef.current.getBoundingClientRect();
    // 鼠标在内容区的绝对坐标
    const mouseX = e.clientX - contentRect.left;
    const mouseY = e.clientY - contentRect.top;
    // 组件左上角 = 鼠标绝对坐标 - offset
    const rawX = mouseX - dragOffset.x;
    const rawY = mouseY - dragOffset.y;
    setGuideLines(null);
    onComponentMove(draggingId, rawX, rawY);
  };
  const handleMouseUp = () => {
    setDraggingId(null);
    setGuideLines(null);
  };

  return {
    canvasRef,
    guideLines,
    handleDrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
