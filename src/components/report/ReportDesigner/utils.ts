import { CanvasComponent } from "./types";

export function getSnapAndGuides(
  x: number,
  y: number,
  movingId: string,
  components: CanvasComponent[],
  width: number,
  height: number,
  SNAP_THRESHOLD: number,
  COMPONENT_WIDTH: number,
  COMPONENT_HEIGHT: number,
  RULER_SIZE: number
) {
  let snapX = x;
  let snapY = y;
  const guide: { x?: number; y?: number } = {};
  // 画布边缘吸附
  if (Math.abs(x) < SNAP_THRESHOLD) {
    snapX = 0;
    guide.x = 0;
  }
  if (Math.abs(y) < SNAP_THRESHOLD) {
    snapY = 0;
    guide.y = 0;
  }
  if (Math.abs(x + COMPONENT_WIDTH - (width - RULER_SIZE)) < SNAP_THRESHOLD) {
    snapX = width - RULER_SIZE - COMPONENT_WIDTH;
    guide.x = width - RULER_SIZE - COMPONENT_WIDTH + COMPONENT_WIDTH / 2;
  }
  if (Math.abs(y + COMPONENT_HEIGHT - (height - RULER_SIZE)) < SNAP_THRESHOLD) {
    snapY = height - RULER_SIZE - COMPONENT_HEIGHT;
    guide.y = height - RULER_SIZE - COMPONENT_HEIGHT + COMPONENT_HEIGHT / 2;
  }
  // 与其他组件吸附
  for (const comp of components) {
    if (comp.id === movingId) continue;
    if (Math.abs(x - comp.x) < SNAP_THRESHOLD) {
      snapX = comp.x;
      guide.x = comp.x;
    }
    if (Math.abs(y - comp.y) < SNAP_THRESHOLD) {
      snapY = comp.y;
      guide.y = comp.y;
    }
    if (
      Math.abs(x + COMPONENT_WIDTH - (comp.x + COMPONENT_WIDTH)) <
      SNAP_THRESHOLD
    ) {
      snapX = comp.x + COMPONENT_WIDTH - COMPONENT_WIDTH;
      guide.x = comp.x + COMPONENT_WIDTH / 2;
    }
    if (
      Math.abs(y + COMPONENT_HEIGHT - (comp.y + COMPONENT_HEIGHT)) <
      SNAP_THRESHOLD
    ) {
      snapY = comp.y + COMPONENT_HEIGHT - COMPONENT_HEIGHT;
      guide.y = comp.y + COMPONENT_HEIGHT / 2;
    }
    if (
      Math.abs(x + COMPONENT_WIDTH / 2 - (comp.x + COMPONENT_WIDTH / 2)) <
      SNAP_THRESHOLD
    ) {
      snapX = comp.x;
      guide.x = comp.x + COMPONENT_WIDTH / 2;
    }
    if (
      Math.abs(y + COMPONENT_HEIGHT / 2 - (comp.y + COMPONENT_HEIGHT / 2)) <
      SNAP_THRESHOLD
    ) {
      snapY = comp.y;
      guide.y = comp.y + COMPONENT_HEIGHT / 2;
    }
  }
  return { snapX, snapY, guide };
}
