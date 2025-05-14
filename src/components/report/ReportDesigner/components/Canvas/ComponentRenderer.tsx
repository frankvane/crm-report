import type { CanvasComponent } from "@/components/report/ReportDesigner/types";
// import LabelComponent from "@/components/report/components/LabelComponent";
import React from "react";
import { ResizableWrapper } from "@/components/report/ReportDesigner/components/Canvas/ResizableWrapper";
// import TextComponent from "@/components/report/components/TextComponent";
import { getComponentMeta } from "@/components/report/ReportDesigner/componentRegistry";
import { useReportDesignerStore } from "@/store/reportDesignerStore";

interface ComponentRendererProps {
  compRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  handleMouseDown: (
    id: string,
    e: React.MouseEvent,
    el?: HTMLDivElement
  ) => void;
  handleContextMenu: (e: React.MouseEvent, compId: string) => void;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
  handlePropertyChange: (formData: Partial<CanvasComponent>) => void;
  canvasWidth: number;
  canvasHeight: number;
  allComponents: CanvasComponent[];
  snapThreshold: number;
  setResizeGuideLines: (
    guide: {
      x?: number;
      y?: number;
      xHighlight?: boolean;
      yHighlight?: boolean;
    } | null
  ) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  compRefs,
  handleMouseDown,
  handleContextMenu,
  COMPONENT_WIDTH,
  COMPONENT_HEIGHT,
  handlePropertyChange,
  canvasWidth,
  canvasHeight,
  allComponents,
  snapThreshold,
  setResizeGuideLines,
}) => {
  const components = useReportDesignerStore((state: any) => state.components);
  const selectedIds = useReportDesignerStore((state: any) => state.selectedIds);
  const setSelectedIds = useReportDesignerStore(
    (state: any) => state.setSelectedIds
  );

  console.log("[ComponentRenderer] 当前components:", components);
  console.log("[ComponentRenderer] 当前selectedIds:", selectedIds);

  return (
    <>
      {components.map((comp: CanvasComponent, idx: number) => {
        if (!comp) {
          console.error("comp is undefined at idx:", idx);
          return null;
        }
        const props = (comp.props ?? {}) as Record<string, unknown>;
        if (props?.visible === false) return null;
        const width =
          typeof props.width === "number" ? props.width : COMPONENT_WIDTH;
        const height =
          typeof props.height === "number" ? props.height : COMPONENT_HEIGHT;
        const x = typeof props.x === "number" ? props.x : 0;
        const y = typeof props.y === "number" ? props.y : 0;
        const locked = !!props.locked;
        const meta = getComponentMeta(comp.type);
        const Comp =
          meta?.render ||
          (() => <div style={{ color: "red" }}>未知组件类型: {comp.type}</div>);

        if (selectedIds.length === 1 && selectedIds[0] === comp.id) {
          console.log(`[ComponentRenderer] 渲染可缩放组件:`, comp.id, props);
          return (
            <ResizableWrapper
              key={comp.id}
              baseProps={{ width, height, x, y, locked }}
              selected={true}
              onResize={(rect) => {
                console.log(`[ComponentRenderer] onResize`, comp.id, rect);
                handlePropertyChange({ props: { ...rect } });
              }}
              allComponents={allComponents}
              selfId={comp.id}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              snapThreshold={snapThreshold}
              onGuideChange={setResizeGuideLines}
              handleDragStart={(e) => {
                console.log(`[ComponentRenderer] handleDragStart`, comp.id, e);
                handleMouseDown(
                  comp.id,
                  e,
                  compRefs.current[comp.id] as HTMLDivElement
                );
              }}
              onContextMenu={(e) => {
                console.log(`[ComponentRenderer] onContextMenu`, comp.id, e);
                handleContextMenu(e, comp.id);
              }}
            >
              <Comp {...props} />
            </ResizableWrapper>
          );
        }

        // 多选或未选中，普通渲染
        return (
          <div
            ref={(el) => {
              compRefs.current[comp.id] = el;
            }}
            key={comp.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width,
              height,
              border: selectedIds.includes(comp.id)
                ? "2px solid #1890ff"
                : "1px solid #e5e5e5",
              borderRadius: 6,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              color: "#333",
              cursor: locked ? "not-allowed" : "move",
              zIndex: 100 + idx,
              opacity: locked ? 0.5 : 1,
              pointerEvents: "auto",
            }}
            onMouseDown={
              locked
                ? undefined
                : (e) => {
                    console.log(
                      `[ComponentRenderer] 普通onMouseDown`,
                      comp.id,
                      e
                    );
                    if (compRefs.current[comp.id]) {
                      handleMouseDown(
                        comp.id,
                        e,
                        compRefs.current[comp.id] as HTMLDivElement
                      );
                    } else {
                      handleMouseDown(comp.id, e);
                    }
                  }
            }
            onClick={(e) => {
              console.log(
                `[ComponentRenderer] onClick`,
                comp.id,
                e,
                selectedIds
              );
              if (e.shiftKey || e.ctrlKey) {
                if (selectedIds.includes(comp.id)) {
                  setSelectedIds(
                    selectedIds.filter((id: string) => id !== comp.id)
                  );
                } else {
                  setSelectedIds([...selectedIds, comp.id]);
                }
              } else {
                setSelectedIds([comp.id]);
              }
            }}
            onContextMenu={(e) => {
              console.log(`[ComponentRenderer] 普通onContextMenu`, comp.id, e);
              handleContextMenu(e, comp.id);
            }}
          >
            <Comp {...props} />
          </div>
        );
      })}
    </>
  );
};

console.log("ComponentRenderer render end");
