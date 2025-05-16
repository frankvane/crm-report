import type { ReportComponent } from "@report/ReportDesigner/types/component";
import { useDndMonitor } from "@dnd-kit/core";

interface UseCanvasDndParams {
  components: ReportComponent[];
  canvasConfig: { allowSnapToGrid: boolean; gridSize: number };
  addComponent: (comp: ReportComponent) => void;
  setSelectedIds: (ids: string[]) => void;
  updateComponent: (id: string, data: Partial<ReportComponent>) => void;
}

export function useCanvasDnd({
  components,
  canvasConfig,
  addComponent,
  setSelectedIds,
  updateComponent,
}: UseCanvasDndParams) {
  useDndMonitor({
    onDragEnd(event) {
      const { active, over, delta } = event;
      // 画布外拖拽落盘
      if (over?.id === "canvas" && active.data?.current?.type) {
        const type = active.data.current.type;
        const id = `${type}_${Date.now()}`;
        let props: any = {};
        if (type === "label") {
          props = { text: "新标签" };
        } else if (type === "text") {
          props = { text: "新文本" };
        } else if (type === "image") {
          props = { src: "" };
        } else if (type === "table") {
          props = {
            dataBinding: {
              dataSource: "users",
              dataNode: "orders",
              columns: [],
            },
          };
        }
        addComponent({
          id,
          type,
          x: 40 + Math.random() * 200,
          y: 40 + Math.random() * 100,
          width: 120,
          height: 40,
          locked: false,
          visible: true,
          zindex: 1,
          props,
          resizable: true,
          rotatable: false,
          rotation: 0,
          opacity: 1,
        });
        setSelectedIds([id]);
      }
      // 画布内拖动，更新x/y
      if (
        active.id &&
        typeof active.id === "string" &&
        components.some((c) => c.id === active.id) &&
        delta
      ) {
        const comp = components.find((c) => c.id === active.id);
        if (comp) {
          let newX = comp.x + delta.x;
          let newY = comp.y + delta.y;
          if (canvasConfig.allowSnapToGrid) {
            const grid = canvasConfig.gridSize;
            newX = Math.round(newX / grid) * grid;
            newY = Math.round(newY / grid) * grid;
          }
          updateComponent(comp.id, {
            x: newX,
            y: newY,
          });
        }
      }
    },
  });
}
