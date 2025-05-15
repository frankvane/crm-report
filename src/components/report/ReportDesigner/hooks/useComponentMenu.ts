import type { ReportComponent } from "@report/ReportDesigner/types/component";
import { useEffect } from "react";

interface UseComponentMenuParams {
  components: ReportComponent[];
  updateComponent: (id: string, data: Partial<ReportComponent>) => void;
  removeComponent: (id: string) => void;
  copyComponent: (id: string) => void;
  moveComponentZIndex: (
    id: string,
    type: "top" | "bottom" | "up" | "down"
  ) => void;
  setSelectedIds: (ids: string[]) => void;
}

export function useComponentMenu({
  components,
  updateComponent,
  removeComponent,
  copyComponent,
  moveComponentZIndex,
  setSelectedIds,
}: UseComponentMenuParams) {
  useEffect(() => {
    const handler = (e: Event) => {
      const { key, id } = (e as CustomEvent).detail;
      const comp = components.find((c) => c.id === id);
      if (!comp) return;
      switch (key) {
        case "top":
          moveComponentZIndex(id, "top");
          break;
        case "bottom":
          moveComponentZIndex(id, "bottom");
          break;
        case "up":
          moveComponentZIndex(id, "up");
          break;
        case "down":
          moveComponentZIndex(id, "down");
          break;
        case "delete":
          removeComponent(id);
          break;
        case "copy":
          copyComponent(id);
          break;
        case "lock":
          updateComponent(id, { locked: !comp.locked });
          break;
        case "visible":
          updateComponent(id, { visible: !comp.visible });
          break;
        default:
          break;
      }
      setSelectedIds([id]);
    };
    window.addEventListener("component-menu", handler);
    return () => window.removeEventListener("component-menu", handler);
  }, [
    components,
    updateComponent,
    removeComponent,
    copyComponent,
    moveComponentZIndex,
    setSelectedIds,
  ]);
}
