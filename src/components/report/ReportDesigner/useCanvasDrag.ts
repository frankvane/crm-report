import { useRef, useState } from "react";

import type { CanvasComponent } from "./types";
import { getSnapAndGuides } from "./utils";

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
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    setDraggingId(id);
    setDragOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const comp = components.find((c) => c.id === draggingId);
    if (!comp) return;
    const rawX = e.clientX - rect.left - RULER_SIZE - dragOffset.x;
    const rawY = e.clientY - rect.top - RULER_SIZE - dragOffset.y;
    const { snapX, snapY, guide } = getSnapAndGuides(
      rawX,
      rawY,
      draggingId,
      components,
      width,
      height,
      SNAP_THRESHOLD,
      COMPONENT_WIDTH,
      COMPONENT_HEIGHT,
      RULER_SIZE
    );
    setGuideLines(guide);
    onComponentMove(draggingId, snapX, snapY);
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
