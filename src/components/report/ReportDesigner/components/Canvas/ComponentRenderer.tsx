import type { CanvasComponent } from "../../types";
import ChartComponent from "../../../components/ChartComponent";
import React from "react";
import TableComponent from "../../../components/TableComponent";
import TextComponent from "../../../components/TextComponent";

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
}

const componentMap: Record<string, React.FC<any>> = {
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
}) => {
  return (
    <>
      {components.map((comp, idx) => {
        if (comp.visible === false) return null;
        const Comp =
          componentMap[comp.type] ||
          (() => <div style={{ color: "red" }}>未知组件类型: {comp.type}</div>);
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
              width: COMPONENT_WIDTH,
              height: COMPONENT_HEIGHT,
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
                  setSelectedIds(selectedIds.filter((id) => id !== comp.id));
                } else {
                  setSelectedIds([...selectedIds, comp.id]);
                }
              } else {
                setSelectedIds([comp.id]);
              }
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
