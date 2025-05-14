import { ReportComponent } from "@report/ReportDesigner/types/component";
import { ReportDesignerState } from "@report/ReportDesigner/types/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const useReportDesignerStore = create(
  devtools(
    persist(
      immer<ReportDesignerState>((set, get) => ({
        components: [],
        selectedIds: [],
        canvasConfig: {
          gridSize: 20,
          showGrid: true,
          showRuler: true,
          rulerUnit: "px",
          allowSnapToGrid: true,
          snapToGrid: true,
          width: 1123, // A4横向
          height: 794,
          sizeType: "A4-landscape",
        },
        setComponents: (components: ReportComponent[]) =>
          set((state) => {
            state.components = components;
          }),
        addComponent: (component: ReportComponent) =>
          set((state) => {
            state.components.push(component);
          }),
        updateComponent: (id: string, data: Partial<ReportComponent>) =>
          set((state) => {
            const comp = state.components.find((c) => c.id === id);
            if (comp) Object.assign(comp, data);
          }),
        removeComponent: (id: string) =>
          set((state) => {
            state.components = state.components.filter((c) => c.id !== id);
            state.selectedIds = state.selectedIds.filter((sid) => sid !== id);
          }),
        setSelectedIds: (ids: string[]) => {
          console.log("[store] setSelectedIds调用，参数:", ids);
          set((state) => {
            state.selectedIds = ids;
          });
          setTimeout(() => {
            console.log(
              "[store] setSelectedIds后，store.selectedIds:",
              get().selectedIds
            );
          }, 0);
        },
        setCanvasConfig: (config) =>
          set((state) => {
            state.canvasConfig = { ...state.canvasConfig, ...config };
          }),
        batchUpdateComponent: (ids: string[], data: Partial<ReportComponent>) =>
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) Object.assign(c, data);
            });
          }),
        batchRemoveComponent: (ids: string[]) =>
          set((state) => {
            state.components = state.components.filter(
              (c) => !ids.includes(c.id)
            );
            state.selectedIds = state.selectedIds.filter(
              (sid) => !ids.includes(sid)
            );
          }),
        batchLockComponent: (ids: string[], locked: boolean) =>
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) c.locked = locked;
            });
          }),
        batchVisibleComponent: (ids: string[], visible: boolean) =>
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) c.visible = visible;
            });
          }),
      })),
      {
        name: "report-designer-store",
        partialize: (state) => ({
          components: state.components,
          canvasConfig: state.canvasConfig,
        }),
      }
    ),
    { name: "ReportDesignerStore" }
  )
);
