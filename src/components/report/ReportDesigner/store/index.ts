import { ReportComponent } from "@report/ReportDesigner/types/component";
import { ReportDesignerState } from "@report/ReportDesigner/types/store";
import { create } from "zustand";

export const useReportDesignerStore = create<ReportDesignerState>((set) => ({
  components: [],
  selectedIds: [],
  canvasConfig: {
    gridSize: 20,
    showGrid: true,
    snapToGrid: true,
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
  setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),
  setCanvasConfig: (config) =>
    set((state) => ({
      canvasConfig: { ...state.canvasConfig, ...config },
    })),
}));
