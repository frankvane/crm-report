import { useRef, useState } from "react";

import type { CanvasComponent } from "../types";
import { getSnapAndGuides } from "../utils";

export interface UseCanvasDragProps {
  components: CanvasComponent[];
  selectedIds: string[];
  onDrop: (id: string, x: number, y: number) => void;
  onComponentMove: (id: string, x: number, y: number) => void;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
  SNAP_THRESHOLD: number;
  RULER_SIZE: number;
  contentRef: React.RefObject<HTMLDivElement>;
}

export function useCanvasDrag({
  components,
  selectedIds,
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

  // 多选拖动：记录所有选中组件的初始坐标
  const multiDragInitPos = useRef<{ [id: string]: { x: number; y: number } }>(
    {}
  );
  const dragStartMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 拖拽新组件到画布
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (!type) return;
    const contentRect = contentRef.current?.getBoundingClientRect();
    if (!contentRect) return;
    // 鼠标相对内容区左上角的坐标
    const x = e.clientX - contentRect.left;
    const y = e.clientY - contentRect.top;
    // 用内容区宽高裁剪，防止超出
    const contentWidth = contentRef.current.offsetWidth;
    const contentHeight = contentRef.current.offsetHeight;
    const clampedX = Math.max(0, Math.min(x, contentWidth - COMPONENT_WIDTH));
    const clampedY = Math.max(0, Math.min(y, contentHeight - COMPONENT_HEIGHT));
    onDrop(type, clampedX, clampedY);
    // 新组件落地后，彻底清除拖拽相关状态
    setDraggingId(null);
    setGuideLines(null);
    setDragOffset({ x: 0, y: 0 });
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
      if (
        typeof (domOrRef as unknown as { current?: unknown }).current !==
        "undefined"
      ) {
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
      let offsetX = mouseX - compX;
      let offsetY = mouseY - compY;
      if (Math.abs(offsetX) < 1 && Math.abs(offsetY) < 1) {
        offsetX = 0;
        offsetY = 0;
      }
      setDragOffset({ x: offsetX, y: offsetY });

      // 多选拖动：记录所有选中组件的初始坐标和鼠标起点
      if (selectedIds.includes(id)) {
        const initPos: { [id: string]: { x: number; y: number } } = {};
        selectedIds.forEach((sid) => {
          const comp = components.find((c) => c.id === sid);
          if (comp) initPos[sid] = { x: comp.x, y: comp.y };
        });
        multiDragInitPos.current = initPos;
        dragStartMouse.current = { x: mouseX, y: mouseY };
      } else {
        multiDragInitPos.current = {};
      }
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
    multiDragInitPos.current = {};
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    if (!contentRef.current) return;
    const contentRect = contentRef.current.getBoundingClientRect();
    const mouseX = e.clientX - contentRect.left;
    const mouseY = e.clientY - contentRect.top;

    // 多选拖动
    if (
      selectedIds.includes(draggingId) &&
      Object.keys(multiDragInitPos.current).length > 0
    ) {
      const dxRaw = mouseX - dragStartMouse.current.x;
      const dyRaw = mouseY - dragStartMouse.current.y;
      const contentWidth = contentRef.current!.offsetWidth;
      const contentHeight = contentRef.current!.offsetHeight;
      // 计算所有组件理论新坐标
      let minLeft = Infinity,
        maxRight = -Infinity,
        minTop = Infinity,
        maxBottom = -Infinity;
      selectedIds.forEach((sid) => {
        const init = multiDragInitPos.current[sid];
        if (!init) return;
        const nx = init.x + dxRaw;
        const ny = init.y + dyRaw;
        minLeft = Math.min(minLeft, nx);
        maxRight = Math.max(maxRight, nx + COMPONENT_WIDTH);
        minTop = Math.min(minTop, ny);
        maxBottom = Math.max(maxBottom, ny + COMPONENT_HEIGHT);
      });
      // 计算允许的 dx/dy 修正量
      let dx = dxRaw,
        dy = dyRaw;
      if (minLeft < 0) dx -= minLeft;
      if (maxRight > contentWidth) dx -= maxRight - contentWidth;
      if (minTop < 0) dy -= minTop;
      if (maxBottom > contentHeight) dy -= maxBottom - contentHeight;
      selectedIds.forEach((sid) => {
        const init = multiDragInitPos.current[sid];
        if (!init) return;
        const nx = init.x + dx;
        const ny = init.y + dy;
        onComponentMove(sid, nx, ny);
      });
      setGuideLines(null);
      return;
    }

    // 单选拖动
    // 组件左上角 = 鼠标绝对坐标 - offset
    const rawX = mouseX - dragOffset.x;
    const rawY = mouseY - dragOffset.y;
    // 吸附逻辑
    const contentWidth = contentRef.current.offsetWidth;
    const contentHeight = contentRef.current.offsetHeight;
    const { snapX, snapY, guide } = getSnapAndGuides(
      rawX,
      rawY,
      draggingId,
      components,
      contentWidth,
      contentHeight,
      SNAP_THRESHOLD,
      COMPONENT_WIDTH,
      COMPONENT_HEIGHT,
      0, // 内容区内坐标，RULER_SIZE=0
      40 // gridStep
    );
    setGuideLines(guide);
    // x/y 轴分别独立吸附
    const finalX = guide.xHighlight ? snapX : rawX;
    const finalY = guide.yHighlight ? snapY : rawY;
    // 边界裁剪
    const maxX = contentWidth - COMPONENT_WIDTH;
    const maxY = contentHeight - COMPONENT_HEIGHT;
    const clampedX = Math.max(0, Math.min(finalX, maxX));
    const clampedY = Math.max(0, Math.min(finalY, maxY));
    onComponentMove(draggingId, clampedX, clampedY);
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
