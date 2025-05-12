import React, { useEffect } from "react";

import type { CanvasComponent } from "../../types";
import GridLines from "./GridLines";
import Ruler from "./Ruler";
import { useCanvasDrag } from "../../hooks";

interface CanvasProps {
  components: CanvasComponent[];
  onDrop: (type: string, x: number, y: number) => void;
  onComponentMove: (id: string, x: number, y: number) => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  width: number;
  height: number;
  handleDelete: (id: string) => void;
}

const SNAP_THRESHOLD = 8; // px 吸附阈值
const COMPONENT_WIDTH = 120;
const COMPONENT_HEIGHT = 40;
const RULER_STEP = 40;
const RULER_SIZE = 24;

// 定义辅助线类型
interface GuideLines {
  x?: number;
  y?: number;
  xHighlight?: boolean;
  yHighlight?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  onDrop,
  onComponentMove,
  selectedId,
  setSelectedId,
  width,
  height,
  handleDelete,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const {
    canvasRef,
    guideLines,
    handleDrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasDrag({
    components,
    onDrop,
    onComponentMove,
    COMPONENT_WIDTH,
    COMPONENT_HEIGHT,
    SNAP_THRESHOLD,
    RULER_SIZE,
    contentRef,
  });

  const typedGuideLines = guideLines as GuideLines | null;

  // 组件 refs 映射
  const compRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // 键盘Delete删除选中组件
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedId && (e.key === "Delete" || e.key === "Backspace")) {
        handleDelete(selectedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, handleDelete]);

  return (
    <div
      ref={canvasRef}
      style={{
        flex: 1,
        padding: "32px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minWidth: 0,
        minHeight: 0,
        background: "#f5f6fa",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          background: "#fff",
          border: "2px solid #bfbfbf",
          borderRadius: 12,
        }}
      >
        {/* 顶部刻度尺 */}
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
            step={RULER_STEP}
            direction="horizontal"
          />
        </div>
        {/* 左侧刻度尺 */}
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
            step={RULER_STEP}
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
          }}
        >
          {/* 网格虚线辅助线 */}
          <GridLines
            width={width - RULER_SIZE}
            height={height - RULER_SIZE}
            step={RULER_STEP}
          />
          {/* 辅助线渲染 */}
          {typedGuideLines?.x !== undefined && (
            <div
              style={{
                position: "absolute",
                left: typedGuideLines.x,
                top: 0,
                width: 1,
                height: "100%",
                borderLeft: typedGuideLines.xHighlight
                  ? "2px solid #0050b3"
                  : "2px solid #ccc",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
          )}
          {typedGuideLines?.y !== undefined && (
            <div
              style={{
                position: "absolute",
                top: typedGuideLines.y,
                left: 0,
                height: 1,
                width: "100%",
                borderTop: typedGuideLines.yHighlight
                  ? "2px solid #0050b3"
                  : "2px solid #ccc",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
          )}
          {components.map((comp) => {
            // 绑定 ref 到 compRefs
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
                  border:
                    comp.id === selectedId
                      ? "2px solid #1890ff"
                      : "1px solid #e5e5e5",
                  borderRadius: 6,
                  background: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 16,
                  color: "#333",
                  cursor: "move",
                  zIndex: comp.id === selectedId ? 10 : 1,
                }}
                onMouseDown={(e) =>
                  compRefs.current[comp.id] !== null &&
                  compRefs.current[comp.id] !== undefined
                    ? handleMouseDown(
                        comp.id,
                        e,
                        compRefs.current[comp.id] as HTMLDivElement
                      )
                    : handleMouseDown(comp.id, e)
                }
                onClick={() => setSelectedId(comp.id)}
              >
                <span style={{ marginLeft: 8 }}>{comp.icon}</span>
                {comp.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
