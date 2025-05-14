import { CanvasComponent, ComponentLibraryItem } from "../types/index";

import { nanoid } from "nanoid";
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
    const newId = nanoid();
    let schemaProps = {};
    if (type === "text") {
      schemaProps = {
        text: "文本内容",
        fontSize: 14,
        color: "#222222",
        fontWeight: "normal",
        textAlign: "left",
        dataBinding: {
          source: "",
          field: "",
          format: "none",
          expression: "",
        },
      };
    }
    // 丢弃 comp.id 字段，防止污染
    const compWithoutId = { ...comp };
    if ("id" in compWithoutId) void delete compWithoutId.id;
    setCanvasComponents((prev) => [
      ...prev,
      {
        ...compWithoutId,
        ...schemaProps,
        x,
        y,
        locked: false,
        visible: true,
        id: newId, // 一定要放最后，确保唯一id
      },
    ]);
    setSelectedId(newId);
  };
  // 画布内组件拖动
  const handleComponentMove = (id: string, x: number, y: number) => {
    setCanvasComponents((prev) => {
      const next = prev.map((comp) =>
        comp.id === id ? { ...comp, x, y } : comp
      );
      return next;
    });
  };
  // 属性面板变更
  const handlePropertyChange = (formData: Partial<CanvasComponent>) => {
    const { id, ...rest } = formData;
    console.log("【useCanvasComponents】属性变更目标id", id, rest);
    if (!id) return;
    setCanvasComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === id) {
          console.log("【useCanvasComponents】更新组件", id, rest);
          return { ...comp, ...rest };
        }
        return comp;
      })
    );
  };
  // 删除组件
  const handleDelete = (id: string) => {
    setCanvasComponents((prev) => prev.filter((comp) => comp.id !== id));
    setSelectedId(null);
  };
  // 复制组件
  const handleCopy = (id: string) => {
    setCanvasComponents((prev) => {
      const comp = prev.find((c) => c.id === id);
      if (!comp) return prev;
      const newId = nanoid();
      // 新组件偏移20像素，避免重叠
      return [
        ...prev,
        {
          ...comp,
          x: comp.x + 20,
          y: comp.y + 20,
          locked: false,
          visible: true,
          id: newId,
        },
      ];
    });
  };
  // 置顶
  const handleMoveToTop = (id: string) => {
    setCanvasComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const comp = prev[idx];
      const rest = prev.filter((c) => c.id !== id);
      return [...rest, comp];
    });
  };
  // 置底
  const handleMoveToBottom = (id: string) => {
    setCanvasComponents((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const comp = prev[idx];
      const rest = prev.filter((c) => c.id !== id);
      return [comp, ...rest];
    });
  };
  // 锁定/解锁
  const handleToggleLock = (id: string) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, locked: !comp.locked } : comp
      )
    );
  };
  // 隐藏/显示
  const handleToggleVisible = (id: string) => {
    setCanvasComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, visible: !comp.visible } : comp
      )
    );
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
    handleCopy,
    handleMoveToTop,
    handleMoveToBottom,
    handleToggleLock,
    handleToggleVisible,
    selectedComponent,
  };
}
