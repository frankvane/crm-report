import { useEffect, useState } from "react";

import type { CanvasComponent } from "@/components/report/ReportDesigner/types";

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
  setSelectedIds: (ids: string[]) => void;
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
    console.log("框选开始", e);
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
    const minX = Math.min(selectionBox.startX, x);
    const maxX = Math.max(selectionBox.startX, x);
    const minY = Math.min(selectionBox.startY, y);
    const maxY = Math.max(selectionBox.startY, y);
    console.log("选区:", { minX, maxX, minY, maxY });
    console.log("当前 components:", components);
    components.forEach((comp) => {
      const x = comp.props?.x ?? comp.x ?? 0;
      const y = comp.props?.y ?? comp.y ?? 0;
      const width = comp.props?.width ?? comp.width ?? COMPONENT_WIDTH;
      const height = comp.props?.height ?? comp.height ?? COMPONENT_HEIGHT;
      const visible = comp.props?.visible ?? comp.visible ?? true;
      console.log(
        "组件",
        comp.id,
        "x:",
        x,
        "y:",
        y,
        "width:",
        width,
        "height:",
        height,
        "visible:",
        visible
      );
    });
    const selected = components
      .filter((comp) => {
        const x = comp.props?.x ?? comp.x ?? 0;
        const y = comp.props?.y ?? comp.y ?? 0;
        const width = comp.props?.width ?? comp.width ?? COMPONENT_WIDTH;
        const height = comp.props?.height ?? comp.height ?? COMPONENT_HEIGHT;
        const visible = comp.props?.visible ?? comp.visible ?? true;
        if (!visible) return false;
        const compLeft = x;
        const compTop = y;
        const compRight = x + width;
        const compBottom = y + height;
        const isIntersect =
          compLeft < maxX &&
          compRight > minX &&
          compTop < maxY &&
          compBottom > minY;
        return isIntersect;
      })
      .map((comp) => comp.id);
    console.log("框选移动，当前选中：", selected);
    setSelectedIds(selected);
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
        const x = comp.props?.x ?? comp.x ?? 0;
        const y = comp.props?.y ?? comp.y ?? 0;
        const width = comp.props?.width ?? comp.width ?? COMPONENT_WIDTH;
        const height = comp.props?.height ?? comp.height ?? COMPONENT_HEIGHT;
        const visible = comp.props?.visible ?? comp.visible ?? true;
        if (!visible) return false;
        const compLeft = x;
        const compTop = y;
        const compRight = x + width;
        const compBottom = y + height;
        const isIntersect =
          compLeft < maxX &&
          compRight > minX &&
          compTop < maxY &&
          compBottom > minY;
        return isIntersect;
      })
      .map((comp) => comp.id);
    console.log("框选结束，最终选中：", selected);
    setSelectedIds(selected);
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
