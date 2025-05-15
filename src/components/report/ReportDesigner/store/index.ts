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
            // 自动生成 name
            if (!component.name) {
              const type = component.type || "Component";
              const sameType = state.components.filter((c) => c.type === type);
              // 匹配类似 Text1、Text2 的 name，找最大序号
              const maxIndex = sameType.reduce((max, c) => {
                const match =
                  c.name && c.name.match(new RegExp(`^${type}(\\d+)$`));
                return match ? Math.max(max, parseInt(match[1], 10)) : max;
              }, 0);
              component.name = `${type}${maxIndex + 1}`;
            }
            const maxZ =
              state.components.length > 0
                ? Math.max(...state.components.map((c) => c.zindex ?? 1))
                : 0;
            component.zindex = maxZ + 1;
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
          if (ids.length === 0) {
            console.trace("[store] setSelectedIds([]) 被调用");
          }
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
        moveComponentZIndex: (
          id: string,
          type: "top" | "bottom" | "up" | "down"
        ) =>
          set((state) => {
            const comps = state.components;
            const idx = comps.findIndex((c) => c.id === id);
            if (idx === -1) return;
            const comp = comps[idx];
            // 取所有zindex，升序
            const sorted = comps
              .slice()
              .sort((a, b) => (a.zindex ?? 1) - (b.zindex ?? 1));
            const zList = sorted.map((c) => c.zindex ?? 1);
            let newZ = comp.zindex ?? 1;
            if (type === "top") {
              newZ = Math.max(...zList) + 1;
            } else if (type === "bottom") {
              newZ = Math.min(...zList) - 1;
            } else if (type === "up") {
              // 找到比自己大且最近的zindex
              const above = sorted.find(
                (c) => (c.zindex ?? 1) > (comp.zindex ?? 1)
              );
              if (above) {
                // 交换zindex
                const tmp = above.zindex;
                above.zindex = comp.zindex;
                newZ = tmp;
              }
            } else if (type === "down") {
              // 找到比自己小且最近的zindex
              const below = [...sorted]
                .reverse()
                .find((c) => (c.zindex ?? 1) < (comp.zindex ?? 1));
              if (below) {
                const tmp = below.zindex;
                below.zindex = comp.zindex;
                newZ = tmp;
              }
            }
            comp.zindex = newZ;
            // 保证zindex唯一且递增
            const uniq = Array.from(
              new Set(comps.map((c) => c.zindex ?? 1))
            ).sort((a, b) => a - b);
            uniq.forEach((z, i) => {
              comps
                .filter((c) => c.zindex === z)
                .forEach((c) => (c.zindex = i + 1));
            });
          }),
        copyComponent: (id: string) =>
          set((state) => {
            const comp = state.components.find((c) => c.id === id);
            if (!comp) return;
            const newComp = { ...comp, id: `${comp.id}_copy_${Date.now()}` };
            state.components.push(newComp);
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
