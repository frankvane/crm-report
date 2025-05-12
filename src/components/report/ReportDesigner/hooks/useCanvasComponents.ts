import { CanvasComponent, ComponentLibraryItem } from "../types/index";

import { generateId } from "../../../../utils/reportUtils";
import { useState } from "react";

export function useCanvasComponents(componentList: ComponentLibraryItem[]) {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
    []
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 拖拽新组件到画布
  const handleDrop = (type: string, x: number, y: number) => {
    const comp = componentList.find((c) => c.type === type);
    if (!comp) return;
    const newId = generateId();

    setCanvasComponents((prev) => [...prev, { ...comp, id: newId, x, y }]);
    setSelectedId(newId);
  };
  // 画布内组件拖动
  const handleComponentMove = (id: string, x: number, y: number) => {
    setCanvasComponents((prev) => {
      const next = prev.map((comp) =>
        comp.id === id ? { ...comp, x, y } : comp
      );
      const moved = next.find((comp) => comp.id === id);
      return next;
    });
  };
  // 属性面板变更
  const handlePropertyChange = (key: string, value: string) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === selectedId ? { ...comp, [key]: value } : comp
      )
    );
  };
  // 删除组件
  const handleDelete = (id: string) => {
    setCanvasComponents((prev) => prev.filter((comp) => comp.id !== id));
    setSelectedId(null);
  };
  const selectedComponent = canvasComponents.find((c) => c.id === selectedId);

  return {
    canvasComponents,
    setCanvasComponents,
    selectedId,
    setSelectedId,
    handleDrop,
    handleComponentMove,
    handlePropertyChange,
    handleDelete,
    selectedComponent,
  };
}
