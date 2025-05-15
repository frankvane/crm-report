// 画布主组件

// 方案二：全局变量标记本次是否刚刚框选/多选
let justSelectedByBox = false;

import { getAlignUpdates, getDistributeUpdates } from "../../utils/align";

import BatchToolbar from "./BatchToolbar";
import CanvasContent from "./CanvasContent";
import Grid from "./Grid";
import Ruler from "./Ruler";
import styles from "./Canvas.module.css";
import { useBatchActions } from "../../hooks/useBatchActions";
import { useCanvasDnd } from "../../hooks/useCanvasDnd";
import { useComponentMenu } from "../../hooks/useComponentMenu";
import { useDroppable } from "@dnd-kit/core";
import { useReportDesignerStore } from "@report/ReportDesigner/store";
import { useSelectionBox } from "../../hooks/useSelectionBox";

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const addComponent = useReportDesignerStore((s) => s.addComponent);
  const components = useReportDesignerStore((s) => s.components);
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const setSelectedIds = useReportDesignerStore((s) => s.setSelectedIds);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);
  const batchUpdateComponent = useReportDesignerStore(
    (s) => s.batchUpdateComponent
  );
  const batchRemoveComponent = useReportDesignerStore(
    (s) => s.batchRemoveComponent
  );
  const batchLockComponent = useReportDesignerStore(
    (s) => s.batchLockComponent
  );
  const batchVisibleComponent = useReportDesignerStore(
    (s) => s.batchVisibleComponent
  );
  const removeComponent = useReportDesignerStore((s) => s.removeComponent);
  const copyComponent = useReportDesignerStore((s) => s.copyComponent);
  const moveComponentZIndex = useReportDesignerStore(
    (s) => s.moveComponentZIndex
  );

  // 框选相关
  const { selectRect, isSelecting, handleMouseDown } = useSelectionBox(
    components,
    (...args) => {
      setSelectedIds(...args);
      // 只要是框选/单选/点空白，handleMouseUp 都会调用 setSelectedIds
      // 这里标记本次是由 selection box 触发
      justSelectedByBox = true;
      setTimeout(() => {
        justSelectedByBox = false;
      }, 0);
    }
  );

  // 批量操作相关
  const batchActions = useBatchActions(
    components,
    selectedIds,
    batchRemoveComponent,
    batchLockComponent,
    batchVisibleComponent,
    batchUpdateComponent,
    setSelectedIds,
    getAlignUpdates,
    getDistributeUpdates
  );

  // 拖拽相关
  useCanvasDnd({
    components,
    canvasConfig,
    addComponent,
    setSelectedIds,
    updateComponent,
  });

  // 右键菜单事件
  useComponentMenu({
    components,
    updateComponent,
    removeComponent,
    copyComponent,
    moveComponentZIndex,
    setSelectedIds,
  });

  return (
    <>
      <BatchToolbar
        selectedCount={selectedIds.length}
        canDistribute={selectedIds.length >= 3}
        onDeleteSelected={batchActions.handleDeleteSelected}
        onBatchLock={batchActions.handleBatchLock}
        onBatchVisible={batchActions.handleBatchVisible}
        onShowAll={batchActions.handleShowAll}
        onAlign={batchActions.handleAlign}
        onDistribute={batchActions.handleDistribute}
        onBatchResizable={(resizable) => {
          selectedIds.forEach((id) => updateComponent(id, { resizable }));
        }}
        onBatchRotatable={(rotatable) => {
          selectedIds.forEach((id) => updateComponent(id, { rotatable }));
        }}
        onBatchRotation={(rotation) => {
          selectedIds.forEach((id) => updateComponent(id, { rotation }));
        }}
        onBatchOpacity={(opacity) => {
          selectedIds.forEach((id) => updateComponent(id, { opacity }));
        }}
      />
      <div
        ref={setNodeRef}
        id="report-canvas-main"
        className={
          isOver
            ? `${styles.canvasMain} ${styles.canvasMainOver}`
            : styles.canvasMain
        }
        onClick={() => {
          if (justSelectedByBox) return;
          setSelectedIds([]);
        }}
      >
        {/* 标尺 */}
        <Ruler canvasConfig={canvasConfig} />
        {/* 网格 */}
        <Grid canvasConfig={canvasConfig} />
        {/* 画布内容区（标准结构，支持框选和组件交互） */}
        <CanvasContent
          components={components}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          isSelecting={isSelecting}
          selectRect={selectRect}
          handleMouseDown={handleMouseDown}
          onResize={(id, w, h) => updateComponent(id, { width: w, height: h })}
          onMove={(id, x, y) => updateComponent(id, { x, y })}
        />
      </div>
    </>
  );
}
