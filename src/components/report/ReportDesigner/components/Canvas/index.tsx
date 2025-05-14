import BatchToolbar from "./BatchToolbar";
import GridLines from "./GridLines";
import GuideLines from "./GuideLines";
import React from "react";
import { ResizableWrapper } from "./ResizableWrapper";
import Ruler from "./Ruler";
import SelectionBox from "./SelectionBox";
import { useContextMenu } from "./useContextMenu";
import { useReportDesignerStore } from "@/store/reportDesignerStore";
import { useSelectionBox } from "./useSelectionBox";

const RULER_SIZE = 24;
const COMPONENT_WIDTH = 120;
const COMPONENT_HEIGHT = 40;

// 1. 添加props类型声明
interface CanvasProps {
  width: number;
  height: number;
  onDrop: (type: string, x: number, y: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, onDrop }) => {
  // store
  const components = useReportDesignerStore((state) => state.components);
  const selectedIds = useReportDesignerStore((state) => state.selectedIds);
  const setSelectedIds = useReportDesignerStore(
    (state) => state.setSelectedIds
  );
  const updateComponent = useReportDesignerStore(
    (state) => state.updateComponent
  );
  const deleteComponent = useReportDesignerStore(
    (state) => state.deleteComponent
  );
  const batchAlign = useReportDesignerStore((state) => state.batchAlign);
  const batchDistribute = useReportDesignerStore(
    (state) => state.batchDistribute
  );
  const batchLock = useReportDesignerStore((state) => state.batchLock);
  const batchVisible = useReportDesignerStore((state) => state.batchVisible);
  const batchUpdate = useReportDesignerStore((state) => state.batchUpdate);

  // refs
  const contentRef = React.useRef<HTMLDivElement>(null);

  // 框选逻辑
  const {
    selectionBox,
    handleSelectionMouseDown,
    handleSelectionMouseMove,
    handleSelectionMouseUp,
  } = useSelectionBox({
    contentRef,
    components: components as any,
    setSelectedIds: (ids: string[]) => setSelectedIds(ids),
    COMPONENT_WIDTH,
    COMPONENT_HEIGHT,
  });

  // 右键菜单
  const { closeContextMenu } = useContextMenu({
    components: components as any,
    setSelectedIds: setSelectedIds as unknown as React.Dispatch<
      React.SetStateAction<string[]>
    >,
    handleDelete: deleteComponent,
    handleCopy: () => {},
    handleMoveToTop: () => {},
    handleMoveToBottom: () => {},
    handleToggleLock: () => {},
    handleToggleVisible: () => {},
  });

  // 吸附线状态（可扩展）
  const [guideLines] = React.useState<any>(null);

  // 处理拖拽释放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    // 计算相对画布的坐标
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (type) {
      onDrop(type, x, y);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "#f5f6fa",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: width,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* 工具栏，常规流式布局 */}
        <BatchToolbar
          selectedCount={selectedIds.length}
          canDistribute={selectedIds.length >= 3}
          onShowAll={() => {
            // 可见性批量操作，修正为 props.visible
            const hiddenIds = components
              .filter((comp) => comp.props?.visible === false)
              .map((comp) => comp.id);
            if (hiddenIds.length > 0) {
              if (typeof batchUpdate === "function") {
                batchUpdate(hiddenIds, { props: { visible: true } });
              } else {
                hiddenIds.forEach((id) =>
                  updateComponent(id, { props: { visible: true } })
                );
              }
            }
            closeContextMenu();
          }}
          onDeleteSelected={() => {
            selectedIds.forEach((id) => deleteComponent(id));
            setSelectedIds([]);
            closeContextMenu();
          }}
          onAlign={batchAlign}
          onDistribute={batchDistribute}
          onBatchLock={batchLock}
          onBatchVisible={batchVisible}
        />
        {/* 画布内容区 */}
        <div
          style={{
            position: "relative",
            width: width,
            height: height,
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* 标尺 */}
          <div
            style={{
              position: "absolute",
              left: RULER_SIZE,
              top: 0,
              width: width - RULER_SIZE,
              height: RULER_SIZE,
              zIndex: 1000,
            }}
          >
            <Ruler
              length={width - RULER_SIZE}
              step={40}
              direction="horizontal"
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: RULER_SIZE,
              width: RULER_SIZE,
              height: height - RULER_SIZE,
              zIndex: 1000,
            }}
          >
            <Ruler
              length={height - RULER_SIZE}
              step={40}
              direction="vertical"
            />
          </div>
          {/* 内容区整体偏移，预留刻度尺空间 */}
          <div
            ref={contentRef}
            style={{
              position: "absolute",
              left: RULER_SIZE,
              top: RULER_SIZE,
              width: width - RULER_SIZE,
              height: height - RULER_SIZE,
              userSelect: selectionBox.active ? "none" : undefined,
              background: "#fff",
              borderRadius: 12,
              border: "2px solid #bfbfbf",
            }}
            onMouseDown={handleSelectionMouseDown as any}
            onMouseMove={handleSelectionMouseMove as any}
            onMouseUp={handleSelectionMouseUp as any}
          >
            {/* 网格背景 */}
            <GridLines
              width={width - RULER_SIZE}
              height={height - RULER_SIZE}
              step={40}
            />
            {/* 辅助线 */}
            <GuideLines {...(guideLines || {})} />
            {/* 组件渲染（直接map，不用ComponentRenderer） */}
            {components.map((comp) => {
              // 优先从props读取属性
              const x = comp.props?.x ?? comp.x ?? 0;
              const y = comp.props?.y ?? comp.y ?? 0;
              const width = comp.props?.width ?? comp.width ?? 120;
              const height = comp.props?.height ?? comp.height ?? 40;
              const locked = comp.props?.locked ?? comp.locked ?? false;
              const visible = comp.props?.visible ?? comp.visible ?? true;
              if (!visible) return null;
              return (
                <ResizableWrapper
                  key={comp.id}
                  baseProps={{ width, height, x, y, locked }}
                  onResize={({ width, height, x, y }) => {
                    updateComponent(comp.id, {
                      props: { width, height, x, y },
                    });
                  }}
                  selected={selectedIds.includes(comp.id)}
                >
                  {/* 直接渲染具体组件内容 */}
                  {comp.type === "text" ? (
                    <div
                      style={{
                        fontSize: comp.props?.fontSize || 16,
                        color: comp.props?.color || "#333",
                        fontWeight: comp.props?.fontWeight || "normal",
                        textAlign: comp.props?.textAlign || "left",
                        width,
                        height,
                        overflow: "hidden",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {comp.props?.text || "文本内容"}
                    </div>
                  ) : comp.type === "label" ? (
                    <div
                      style={{
                        border: "1px dashed #aaa",
                        padding: 4,
                      }}
                    >
                      {comp.props?.text || "标签"}
                    </div>
                  ) : (
                    <div style={{ color: "red" }}>
                      未知组件类型: {comp.type}
                    </div>
                  )}
                </ResizableWrapper>
              );
            })}
            {/* 框选区域渲染 */}
            {selectionBox.active && (
              <SelectionBox selectionBox={selectionBox} />
            )}
          </div>
          {/* 右键菜单渲染，可根据 contextMenu 逻辑实现 */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
