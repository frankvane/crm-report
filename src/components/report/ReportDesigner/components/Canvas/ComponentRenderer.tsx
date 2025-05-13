import TextComponent, {
  TextComponentProps,
} from "../../../components/TextComponent";

import type { CanvasComponent } from "../../types";
import ChartComponent from "../../../components/ChartComponent";
import React from "react";
import { ResizableWrapper } from "./ResizableWrapper";
import TableComponent from "../../../components/TableComponent";

interface ComponentRendererProps {
  components: CanvasComponent[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
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

// 定义各类型组件的 props
type ComponentMapType = {
  text: React.FC<TextComponentProps>;
  table: React.FC<object>;
  chart: React.FC<object>;
};

const componentMap: ComponentMapType = {
  text: TextComponent,
  table: TableComponent,
  chart: ChartComponent,
};

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  components,
  selectedIds,
  setSelectedIds,
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
  return (
    <>
      {(() => {
        console.log(
          "components:",
          components.map((c) => ({ id: c.id, visible: c.visible }))
        );
        console.log("selectedIds:", selectedIds);
        return null;
      })()}
      {components.map((comp, idx) => {
        if (comp.visible === false) return null;
        const Comp =
          (componentMap as Record<string, React.FC<unknown>>)[comp.type] ||
          (() => <div style={{ color: "red" }}>未知组件类型: {comp.type}</div>);

        // 只在单选时渲染可缩放
        if (selectedIds.length === 1 && selectedIds[0] === comp.id) {
          return (
            <ResizableWrapper
              key={comp.id}
              width={comp.width ?? COMPONENT_WIDTH}
              height={comp.height ?? COMPONENT_HEIGHT}
              x={comp.x}
              y={comp.y}
              selected={true}
              locked={comp.locked}
              onResize={(rect) => handlePropertyChange({ ...rect })}
              allComponents={allComponents}
              selfId={comp.id}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              snapThreshold={snapThreshold}
              onGuideChange={setResizeGuideLines}
              handleDragStart={(e) =>
                handleMouseDown(
                  comp.id,
                  e,
                  compRefs.current[comp.id] as HTMLDivElement
                )
              }
              onContextMenu={(e) => handleContextMenu(e, comp.id)}
            >
              {comp.type === "text" ? (
                <TextComponent
                  text={comp.text || ""}
                  fontSize={comp.fontSize}
                  color={comp.color}
                  fontWeight={comp.fontWeight}
                  textAlign={comp.textAlign}
                  dataBinding={comp.dataBinding}
                  mockData={(() => {
                    try {
                      return comp.mockData
                        ? JSON.parse(comp.mockData)
                        : undefined;
                    } catch {
                      return undefined;
                    }
                  })()}
                />
              ) : (
                <Comp />
              )}
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
              left: comp.x,
              top: comp.y,
              width: comp.width ?? COMPONENT_WIDTH,
              height: comp.height ?? COMPONENT_HEIGHT,
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
              cursor: comp.locked ? "not-allowed" : "move",
              zIndex: 100 + idx,
              opacity: comp.locked ? 0.5 : 1,
              pointerEvents: "auto",
            }}
            onMouseDown={
              comp.locked
                ? undefined
                : (e) =>
                    compRefs.current[comp.id] !== null &&
                    compRefs.current[comp.id] !== undefined
                      ? handleMouseDown(
                          comp.id,
                          e,
                          compRefs.current[comp.id] as HTMLDivElement
                        )
                      : handleMouseDown(comp.id, e)
            }
            onClick={(e) => {
              if (e.shiftKey || e.ctrlKey) {
                // shift/ctrl 多选/反选
                if (selectedIds.includes(comp.id)) {
                  setSelectedIds((prev) => prev.filter((id) => id !== comp.id));
                } else {
                  setSelectedIds((prev) => [...prev, comp.id]);
                }
              } else {
                setSelectedIds(() => [comp.id]);
              }
              setTimeout(() => {
                console.log("after click, selectedIds:", selectedIds);
              }, 0);
            }}
            onContextMenu={(e) => handleContextMenu(e, comp.id)}
          >
            {comp.type === "text" ? (
              <TextComponent
                text={comp.text || ""}
                fontSize={comp.fontSize}
                color={comp.color}
                fontWeight={comp.fontWeight}
                textAlign={comp.textAlign}
                dataBinding={comp.dataBinding}
                mockData={(() => {
                  try {
                    return comp.mockData
                      ? JSON.parse(comp.mockData)
                      : undefined;
                  } catch {
                    return undefined;
                  }
                })()}
              />
            ) : (
              <Comp />
            )}
          </div>
        );
      })}
    </>
  );
};
