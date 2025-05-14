import { ReportComponent } from "@report/ReportDesigner/types/component";
import { ReportDesignerState } from "@report/ReportDesigner/types/store";
import { create } from "zustand";

export const useReportDesignerStore = create<ReportDesignerState>(
  (set, get) => ({
    components: [],
    selectedIds: [],
    canvasConfig: {
      gridSize: 20,
      showGrid: true,
      snapToGrid: true,
      width: 1123, // A4横向
      height: 794,
      sizeType: "A4-landscape",
    },
    setComponents: (components: ReportComponent[]) => set({ components }),
    addComponent: (component: ReportComponent) =>
      set((state) => ({ components: [...state.components, component] })),
    updateComponent: (id: string, data: Partial<ReportComponent>) =>
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      })),
    removeComponent: (id: string) =>
      set((state) => ({
        components: state.components.filter((c) => c.id !== id),
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
      })),
    setSelectedIds: (ids: string[]) => {
      console.log("[store] setSelectedIds调用，参数:", ids);
      set({ selectedIds: ids });
      setTimeout(() => {
        console.log(
          "[store] setSelectedIds后，store.selectedIds:",
          get().selectedIds
        );
      }, 0);
    },
    setCanvasConfig: (config) =>
      set((state) => ({
        canvasConfig: { ...state.canvasConfig, ...config },
      })),
  })
);
