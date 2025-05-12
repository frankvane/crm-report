import type { CanvasComponent } from "../../types";
import GridLines from "./GridLines";
import React from "react";
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
}

const SNAP_THRESHOLD = 8; // px 吸附阈值
const COMPONENT_WIDTH = 120;
const COMPONENT_HEIGHT = 40;
const RULER_STEP = 40;
const RULER_SIZE = 24;

const Canvas: React.FC<CanvasProps> = ({
  components,
  onDrop,
  onComponentMove,
  selectedId,
  setSelectedId,
  width,
  height,
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
    width,
    height,
    onDrop,
    onComponentMove,
    COMPONENT_WIDTH,
    COMPONENT_HEIGHT,
    SNAP_THRESHOLD,
    RULER_SIZE,
    contentRef,
  });

  // 组件 refs 映射
  const compRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

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
        overflow: "auto",
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
          {guideLines?.x !== undefined && (
            <div
              style={{
                position: "absolute",
                left: guideLines.x,
                top: 0,
                width: 1,
                height: "100%",
                borderLeft: "2px solid #001529",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
          )}
          {guideLines?.y !== undefined && (
            <div
              style={{
                position: "absolute",
                top: guideLines.y,
                left: 0,
                height: 1,
                width: "100%",
                borderTop: "2px solid #001529",
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
                  handleMouseDown(comp.id, e, compRefs.current[comp.id])
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
