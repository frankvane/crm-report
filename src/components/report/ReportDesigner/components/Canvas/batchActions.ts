// 批量操作工具函数

import type { CanvasComponent } from "../../types";

export function alignComponents(
  components: CanvasComponent[],
  selectedIds: string[],
  type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter",
  move: (id: string, x: number, y: number) => void,
  width: number,
  height: number
) {
  const selectedComps = components.filter((c) => selectedIds.includes(c.id));
  if (selectedComps.length < 2) return;
  if (type === "left") {
    const minX = Math.min(...selectedComps.map((c) => c.x));
    selectedComps.forEach((c) => move(c.id, minX, c.y));
  } else if (type === "right") {
    const maxX = Math.max(...selectedComps.map((c) => c.x + width));
    selectedComps.forEach((c) => move(c.id, maxX - width, c.y));
  } else if (type === "top") {
    const minY = Math.min(...selectedComps.map((c) => c.y));
    selectedComps.forEach((c) => move(c.id, c.x, minY));
  } else if (type === "bottom") {
    const maxY = Math.max(...selectedComps.map((c) => c.y + height));
    selectedComps.forEach((c) => move(c.id, c.x, maxY - height));
  } else if (type === "hcenter") {
    const center = Math.round(
      selectedComps.reduce((sum, c) => sum + c.x + width / 2, 0) /
        selectedComps.length
    );
    selectedComps.forEach((c) => move(c.id, center - width / 2, c.y));
  } else if (type === "vcenter") {
    const center = Math.round(
      selectedComps.reduce((sum, c) => sum + c.y + height / 2, 0) /
        selectedComps.length
    );
    selectedComps.forEach((c) => move(c.id, c.x, center - height / 2));
  }
}

export function distributeComponents(
  components: CanvasComponent[],
  selectedIds: string[],
  type: "horizontal" | "vertical",
  move: (id: string, x: number, y: number) => void
) {
  const selectedComps = components
    .filter((c) => selectedIds.includes(c.id))
    .sort((a, b) => (type === "horizontal" ? a.x - b.x : a.y - b.y));
  if (selectedComps.length < 3) return;
  if (type === "horizontal") {
    const left = selectedComps[0].x;
    const right = selectedComps[selectedComps.length - 1].x;
    const gap = (right - left) / (selectedComps.length - 1);
    selectedComps.forEach((c, i) =>
      move(c.id, Math.round(left + i * gap), c.y)
    );
  } else {
    const top = selectedComps[0].y;
    const bottom = selectedComps[selectedComps.length - 1].y;
    const gap = (bottom - top) / (selectedComps.length - 1);
    selectedComps.forEach((c, i) => move(c.id, c.x, Math.round(top + i * gap)));
  }
}

export function batchLock(
  components: CanvasComponent[],
  selectedIds: string[],
  locked: boolean,
  toggleLock: (id: string) => void
) {
  selectedIds.forEach((id) => {
    const comp = components.find((c) => c.id === id);
    if (comp && !!comp.locked !== locked) {
      toggleLock(id);
    }
  });
}

export function batchVisible(
  components: CanvasComponent[],
  selectedIds: string[],
  visible: boolean,
  toggleVisible: (id: string) => void
) {
  selectedIds.forEach((id) => {
    const comp = components.find((c) => c.id === id);
    if (comp && !!comp.visible !== visible) {
      toggleVisible(id);
    }
  });
}
