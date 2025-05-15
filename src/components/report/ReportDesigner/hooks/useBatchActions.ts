import type { ReportComponent } from "@report/ReportDesigner/types/component";

export function useBatchActions(
  components: ReportComponent[],
  selectedIds: string[],
  batchRemoveComponent: (ids: string[]) => void,
  batchLockComponent: (ids: string[], locked: boolean) => void,
  batchVisibleComponent: (ids: string[], visible: boolean) => void,
  batchUpdateComponent: (ids: string[], data: Partial<ReportComponent>) => void,
  setSelectedIds: (ids: string[]) => void,
  getAlignUpdates: (
    components: ReportComponent[],
    selectedIds: string[],
    type: "top" | "bottom" | "left" | "right" | "hcenter" | "vcenter"
  ) => Record<string, Partial<ReportComponent>>,
  getDistributeUpdates: (
    components: ReportComponent[],
    selectedIds: string[],
    type: "horizontal" | "vertical"
  ) => Record<string, Partial<ReportComponent>>
) {
  // 批量删除
  const handleDeleteSelected = () => {
    batchRemoveComponent(selectedIds);
  };
  // 批量锁定
  const handleBatchLock = (locked: boolean) => {
    batchLockComponent(selectedIds, locked);
  };
  // 批量显示/隐藏
  const handleBatchVisible = (visible: boolean) => {
    batchVisibleComponent(selectedIds, visible);
  };
  // 显示全部
  const handleShowAll = () => {
    batchVisibleComponent(
      components.map((c) => c.id),
      true
    );
  };
  // 批量对齐
  const handleAlign = (
    type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
  ) => {
    if (selectedIds.length < 2) return;
    const updates = getAlignUpdates(components, selectedIds, type);
    Object.entries(updates).forEach(([id, data]) =>
      batchUpdateComponent([id], data as Partial<ReportComponent>)
    );
  };
  // 批量分布
  const handleDistribute = (type: "horizontal" | "vertical") => {
    if (selectedIds.length < 3) return;
    const updates = getDistributeUpdates(components, selectedIds, type);
    Object.entries(updates).forEach(([id, data]) =>
      batchUpdateComponent([id], data as Partial<ReportComponent>)
    );
  };
  return {
    handleDeleteSelected,
    handleBatchLock,
    handleBatchVisible,
    handleShowAll,
    handleAlign,
    handleDistribute,
  };
}
