import { Draft, produce } from "immer";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 对齐类型
export type AlignType =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "hcenter"
  | "vcenter";
export type DistributeType = "horizontal" | "vertical";

// 组件类型定义，基础属性+props模式
export interface ReportDesignerComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;
  visible?: boolean;
  props: Record<string, any>; // 组件专属属性
}

interface ReportDesignerStoreState {
  components: ReportDesignerComponent[];
  selectedIds: string[];
  setComponents: (comps: ReportDesignerComponent[]) => void;
  setSelectedIds: (ids: string[]) => void;
  addComponent: (comp: ReportDesignerComponent) => void;
  updateComponent: (
    id: string,
    patch: Partial<ReportDesignerComponent> & { props?: Record<string, any> }
  ) => void;
  deleteComponent: (id: string) => void;
  batchUpdate: (
    ids: string[],
    patch: Partial<ReportDesignerComponent> & { props?: Record<string, any> }
  ) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  moveToTop: (id: string) => void;
  moveToBottom: (id: string) => void;
  toggleLock: (id: string) => void;
  toggleVisible: (id: string) => void;
  batchAlign: (type: AlignType) => void;
  batchDistribute: (type: DistributeType) => void;
  batchLock: (locked: boolean) => void;
  batchVisible: (visible: boolean) => void;
}

export const useReportDesignerStore = create<ReportDesignerStoreState>()(
  devtools(
    (set, get) => ({
      components: [],
      selectedIds: [],
      setComponents: (comps: ReportDesignerComponent[]) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components = comps;
          })
        ),
      setSelectedIds: (ids: string[]) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.selectedIds = ids;
          })
        ),
      addComponent: (comp) => {
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components.push(comp);
          })
        );
      },
      updateComponent: (
        id: string,
        patch: Partial<ReportDesignerComponent> & {
          props?: Record<string, any>;
        }
      ) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            console.log("[store] updateComponent", id, patch);
            const comp = draft.components.find((c) => c.id === id);
            if (!comp) {
              console.error("updateComponent: 未找到目标组件", { id, patch });
              return;
            }
            // 只合并非 props 的顶层属性
            Object.entries(patch).forEach(([key, value]) => {
              if (key !== "props") {
                (comp as any)[key] = value;
              }
            });
            // 合并props属性
            if (patch.props && typeof patch.props === "object") {
              const oldProps =
                comp.props && typeof comp.props === "object" ? comp.props : {};
              comp.props = { ...oldProps, ...patch.props };
            }
          })
        ),
      deleteComponent: (id: string) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components = draft.components.filter((c) => c.id !== id);
            draft.selectedIds = draft.selectedIds.filter((sid) => sid !== id);
          })
        ),
      batchUpdate: (
        ids: string[],
        patch: Partial<ReportDesignerComponent> & {
          props?: Record<string, any>;
        }
      ) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components.forEach((c) => {
              if (ids.includes(c.id)) {
                Object.entries(patch).forEach(([key, value]) => {
                  if (key !== "props") {
                    (c as any)[key] = value;
                  }
                });
                if (patch.props && typeof patch.props === "object") {
                  const oldProps =
                    c.props && typeof c.props === "object" ? c.props : {};
                  c.props = { ...oldProps, ...patch.props };
                }
              }
            });
          })
        ),
      moveComponent: (id: string, x: number, y: number) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            console.log("[store] moveComponent", id, x, y);
            const comp = draft.components.find((c) => c.id === id);
            if (comp) {
              comp.x = x;
              comp.y = y;
            }
          })
        ),
      moveToTop: (id: string) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const idx = draft.components.findIndex((c) => c.id === id);
            if (idx === -1) return;
            const [comp] = draft.components.splice(idx, 1);
            draft.components.push(comp);
          })
        ),
      moveToBottom: (id: string) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const idx = draft.components.findIndex((c) => c.id === id);
            if (idx === -1) return;
            const [comp] = draft.components.splice(idx, 1);
            draft.components.unshift(comp);
          })
        ),
      toggleLock: (id: string) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const comp = draft.components.find((c) => c.id === id);
            if (comp) {
              comp.locked = !comp.locked;
            }
          })
        ),
      toggleVisible: (id: string) =>
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const comp = draft.components.find((c) => c.id === id);
            if (comp) {
              comp.visible = !comp.visible;
            }
          })
        ),
      // 批量对齐
      batchAlign: (type) => {
        const { selectedIds } = get();
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const selectedComps = draft.components.filter((c) =>
              selectedIds.includes(c.id)
            );
            if (selectedComps.length < 2) return;
            let value: number = 0;
            switch (type) {
              case "left":
                value = Math.min(...selectedComps.map((c) => c.props?.x ?? 0));
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.x = value;
                });
                break;
              case "right":
                value = Math.max(
                  ...selectedComps.map(
                    (c) => (c.props?.x ?? 0) + (c.props?.width ?? 120)
                  )
                );
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.x = value - (c.props.width ?? 120);
                });
                break;
              case "top":
                value = Math.min(...selectedComps.map((c) => c.props?.y ?? 0));
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.y = value;
                });
                break;
              case "bottom":
                value = Math.max(
                  ...selectedComps.map(
                    (c) => (c.props?.y ?? 0) + (c.props?.height ?? 40)
                  )
                );
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.y = value - (c.props.height ?? 40);
                });
                break;
              case "hcenter":
                value = Math.round(
                  (Math.min(...selectedComps.map((c) => c.props?.x ?? 0)) +
                    Math.max(
                      ...selectedComps.map(
                        (c) => (c.props?.x ?? 0) + (c.props?.width ?? 120)
                      )
                    )) /
                    2
                );
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.x = value - Math.round((c.props.width ?? 120) / 2);
                });
                break;
              case "vcenter":
                value = Math.round(
                  (Math.min(...selectedComps.map((c) => c.props?.y ?? 0)) +
                    Math.max(
                      ...selectedComps.map(
                        (c) => (c.props?.y ?? 0) + (c.props?.height ?? 40)
                      )
                    )) /
                    2
                );
                selectedComps.forEach((c) => {
                  if (!c.props) c.props = {};
                  c.props.y = value - Math.round((c.props.height ?? 40) / 2);
                });
                break;
            }
          })
        );
      },
      // 批量分布
      batchDistribute: (type) => {
        const { selectedIds } = get();
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            const selectedComps = draft.components.filter((c) =>
              selectedIds.includes(c.id)
            );
            if (selectedComps.length < 3) return;
            if (type === "horizontal") {
              const sorted = [...selectedComps].sort(
                (a, b) => (a.props?.x ?? 0) - (b.props?.x ?? 0)
              );
              const left = sorted[0].props?.x ?? 0;
              const right = sorted[sorted.length - 1].props?.x ?? 0;
              const gap = (right - left) / (sorted.length - 1);
              sorted.forEach((c, i) => {
                if (!c.props) c.props = {};
                c.props.x = Math.round(left + i * gap);
              });
            } else if (type === "vertical") {
              const sorted = [...selectedComps].sort(
                (a, b) => (a.props?.y ?? 0) - (b.props?.y ?? 0)
              );
              const top = sorted[0].props?.y ?? 0;
              const bottom = sorted[sorted.length - 1].props?.y ?? 0;
              const gap = (bottom - top) / (sorted.length - 1);
              sorted.forEach((c, i) => {
                if (!c.props) c.props = {};
                c.props.y = Math.round(top + i * gap);
              });
            }
          })
        );
      },
      // 批量锁定
      batchLock: (locked) => {
        const { selectedIds } = get();
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components.forEach((c) => {
              if (selectedIds.includes(c.id)) {
                if (!c.props) c.props = {};
                c.props.locked = locked;
              }
            });
          })
        );
      },
      // 批量显示/隐藏
      batchVisible: (visible) => {
        const { selectedIds } = get();
        set(
          produce((draft: Draft<ReportDesignerStoreState>) => {
            draft.components.forEach((c) => {
              if (selectedIds.includes(c.id)) {
                if (!c.props) c.props = {};
                c.props.visible = visible;
              }
            });
          })
        );
      },
    }),
    { name: "reportDesignerStore" }
  )
);
