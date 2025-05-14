import { ReportComponent } from "../types/component";

export function getAlignUpdates(
  components: ReportComponent[],
  selectedIds: string[],
  type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
): Record<string, Partial<ReportComponent>> {
  const selectedComps = components.filter((c) => selectedIds.includes(c.id));
  if (selectedComps.length < 2) return {};
  const updates: Record<string, Partial<ReportComponent>> = {};
  if (["left", "right", "top", "bottom"].includes(type)) {
    if (type === "left") {
      const minX = Math.min(...selectedComps.map((c) => c.x));
      selectedComps.forEach((c) => (updates[c.id] = { x: minX }));
    } else if (type === "right") {
      const maxR = Math.max(...selectedComps.map((c) => c.x + c.width));
      selectedComps.forEach((c) => (updates[c.id] = { x: maxR - c.width }));
    } else if (type === "top") {
      const minY = Math.min(...selectedComps.map((c) => c.y));
      selectedComps.forEach((c) => (updates[c.id] = { y: minY }));
    } else if (type === "bottom") {
      const maxB = Math.max(...selectedComps.map((c) => c.y + c.height));
      selectedComps.forEach((c) => (updates[c.id] = { y: maxB - c.height }));
    }
  } else if (type === "hcenter") {
    const minX = Math.min(...selectedComps.map((c) => c.x));
    const maxR = Math.max(...selectedComps.map((c) => c.x + c.width));
    const center = (minX + maxR) / 2;
    selectedComps.forEach((c) => (updates[c.id] = { x: center - c.width / 2 }));
  } else if (type === "vcenter") {
    const minY = Math.min(...selectedComps.map((c) => c.y));
    const maxB = Math.max(...selectedComps.map((c) => c.y + c.height));
    const center = (minY + maxB) / 2;
    selectedComps.forEach(
      (c) => (updates[c.id] = { y: center - c.height / 2 })
    );
  }
  return updates;
}

export function getDistributeUpdates(
  components: ReportComponent[],
  selectedIds: string[],
  type: "horizontal" | "vertical"
): Record<string, Partial<ReportComponent>> {
  const selectedComps = components.filter((c) => selectedIds.includes(c.id));
  if (selectedComps.length < 3) return {};
  const updates: Record<string, Partial<ReportComponent>> = {};
  if (type === "horizontal") {
    const sorted = [...selectedComps].sort((a, b) => a.x - b.x);
    const minX = sorted[0].x;
    const maxR = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
    const totalWidth = sorted.reduce((sum, c) => sum + c.width, 0);
    const gap = (maxR - minX - totalWidth) / (sorted.length - 1);
    let curX = minX;
    sorted.forEach((c) => {
      updates[c.id] = { x: curX };
      curX += c.width + gap;
    });
  } else if (type === "vertical") {
    const sorted = [...selectedComps].sort((a, b) => a.y - b.y);
    const minY = sorted[0].y;
    const maxB = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
    const totalHeight = sorted.reduce((sum, c) => sum + c.height, 0);
    const gap = (maxB - minY - totalHeight) / (sorted.length - 1);
    let curY = minY;
    sorted.forEach((c) => {
      updates[c.id] = { y: curY };
      curY += c.height + gap;
    });
  }
  return updates;
}
