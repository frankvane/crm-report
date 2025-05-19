import { devtools, persist } from "zustand/middleware";

import { ReportComponent } from "@report/ReportDesigner/types/component";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ComponentsState {
  components: ReportComponent[];
  history: {
    undoStack: ReportComponent[][];
    redoStack: ReportComponent[][];
  };
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  setComponents: (components: ReportComponent[]) => void;
  addComponent: (component: ReportComponent) => void;
  updateComponent: (id: string, data: Partial<ReportComponent>) => void;
  removeComponent: (id: string) => void;
  batchUpdateComponent: (ids: string[], data: Partial<ReportComponent>) => void;
  batchRemoveComponent: (ids: string[]) => void;
  batchLockComponent: (ids: string[], locked: boolean) => void;
  batchVisibleComponent: (ids: string[], visible: boolean) => void;
  copyComponent: (id: string) => void;
  moveComponentZIndex: (
    id: string,
    type: "top" | "bottom" | "up" | "down"
  ) => void;
}

export const useComponentsStore = create<ComponentsState>()(
  persist(
    devtools(
      immer<ComponentsState>((set, get) => ({
        components: [],
        history: {
          undoStack: [],
          redoStack: [],
        },
        takeSnapshot: () => {
          const { components } = get();
          const snapshot = JSON.parse(JSON.stringify(components));
          set((state) => {
            state.history.undoStack.push(snapshot);
            state.history.redoStack = [];
          });
        },
        undo: () => {
          const { history } = get();
          if (history.undoStack.length === 0) return;
          set((state) => {
            const prev = state.history.undoStack.pop();
            if (prev) {
              state.history.redoStack.push(
                JSON.parse(JSON.stringify(state.components))
              );
              state.components = prev;
            }
          });
        },
        redo: () => {
          const { history } = get();
          if (history.redoStack.length === 0) return;
          set((state) => {
            const next = state.history.redoStack.pop();
            if (next) {
              state.history.undoStack.push(
                JSON.parse(JSON.stringify(state.components))
              );
              state.components = next;
            }
          });
        },
        setComponents: (components) => {
          get().takeSnapshot();
          set({ components });
        },
        addComponent: (component) => {
          get().takeSnapshot();
          set((state) => {
            if (!component.name) {
              const type = component.type || "Component";
              const sameType = state.components.filter((c) => c.type === type);
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
          });
        },
        updateComponent: (id, data) => {
          get().takeSnapshot();
          set((state) => {
            const idx = state.components.findIndex((c) => c.id === id);
            if (idx !== -1) {
              state.components[idx] = { ...state.components[idx], ...data };
            }
          });
        },
        removeComponent: (id) => {
          get().takeSnapshot();
          set((state) => {
            state.components = state.components.filter((c) => c.id !== id);
          });
        },
        batchUpdateComponent: (ids, data) => {
          get().takeSnapshot();
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) Object.assign(c, data);
            });
          });
        },
        batchRemoveComponent: (ids) => {
          get().takeSnapshot();
          set((state) => {
            state.components = state.components.filter(
              (c) => !ids.includes(c.id)
            );
          });
        },
        batchLockComponent: (ids, locked) => {
          get().takeSnapshot();
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) c.locked = locked;
            });
          });
        },
        batchVisibleComponent: (ids, visible) => {
          get().takeSnapshot();
          set((state) => {
            state.components.forEach((c) => {
              if (ids.includes(c.id)) c.visible = visible;
            });
          });
        },
        copyComponent: (id) => {
          get().takeSnapshot();
          set((state) => {
            const comp = state.components.find((c) => c.id === id);
            if (!comp) return;
            const newComp = { ...comp, id: `${comp.id}_copy_${Date.now()}` };
            state.components.push(newComp);
          });
        },
        moveComponentZIndex: (id, type) => {
          get().takeSnapshot();
          set((state) => {
            const comps = state.components;
            const idx = comps.findIndex((c) => c.id === id);
            if (idx === -1) return;
            const comp = comps[idx];
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
              const above = sorted.find(
                (c) => (c.zindex ?? 1) > (comp.zindex ?? 1)
              );
              if (above) {
                const tmp = above.zindex;
                above.zindex = comp.zindex;
                newZ = tmp;
              }
            } else if (type === "down") {
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
            const uniq = Array.from(
              new Set(comps.map((c) => c.zindex ?? 1))
            ).sort((a, b) => a - b);
            uniq.forEach((z, i) => {
              comps
                .filter((c) => c.zindex === z)
                .forEach((c) => (c.zindex = i + 1));
            });
          });
        },
      }))
    ),
    {
      name: "components-storage",
    }
  )
);
