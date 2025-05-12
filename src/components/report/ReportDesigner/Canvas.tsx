import React, { useRef, useState } from "react";

import type { CanvasComponent } from "./index";

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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [guideLines, setGuideLines] = useState<{
    x?: number;
    y?: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 计算吸附和辅助线
  function getSnapAndGuides(x: number, y: number, movingId: string) {
    let snapX = x;
    let snapY = y;
    const guide: { x?: number; y?: number } = {};
    // 画布边缘吸附
    if (Math.abs(x) < SNAP_THRESHOLD) {
      snapX = 0;
      guide.x = 0;
    }
    if (Math.abs(y) < SNAP_THRESHOLD) {
      snapY = 0;
      guide.y = 0;
    }
    if (Math.abs(x + COMPONENT_WIDTH - (width - RULER_SIZE)) < SNAP_THRESHOLD) {
      snapX = width - RULER_SIZE - COMPONENT_WIDTH;
      guide.x = width - RULER_SIZE - COMPONENT_WIDTH + COMPONENT_WIDTH / 2;
    }
    if (
      Math.abs(y + COMPONENT_HEIGHT - (height - RULER_SIZE)) < SNAP_THRESHOLD
    ) {
      snapY = height - RULER_SIZE - COMPONENT_HEIGHT;
      guide.y = height - RULER_SIZE - COMPONENT_HEIGHT + COMPONENT_HEIGHT / 2;
    }
    // 与其他组件吸附
    for (const comp of components) {
      if (comp.id === movingId) continue;
      if (Math.abs(x - comp.x) < SNAP_THRESHOLD) {
        snapX = comp.x;
        guide.x = comp.x;
      }
      if (Math.abs(y - comp.y) < SNAP_THRESHOLD) {
        snapY = comp.y;
        guide.y = comp.y;
      }
      if (
        Math.abs(x + COMPONENT_WIDTH - (comp.x + COMPONENT_WIDTH)) <
        SNAP_THRESHOLD
      ) {
        snapX = comp.x + COMPONENT_WIDTH - COMPONENT_WIDTH;
        guide.x = comp.x + COMPONENT_WIDTH / 2;
      }
      if (
        Math.abs(y + COMPONENT_HEIGHT - (comp.y + COMPONENT_HEIGHT)) <
        SNAP_THRESHOLD
      ) {
        snapY = comp.y + COMPONENT_HEIGHT - COMPONENT_HEIGHT;
        guide.y = comp.y + COMPONENT_HEIGHT / 2;
      }
      if (
        Math.abs(x + COMPONENT_WIDTH / 2 - (comp.x + COMPONENT_WIDTH / 2)) <
        SNAP_THRESHOLD
      ) {
        snapX = comp.x;
        guide.x = comp.x + COMPONENT_WIDTH / 2;
      }
      if (
        Math.abs(y + COMPONENT_HEIGHT / 2 - (comp.y + COMPONENT_HEIGHT / 2)) <
        SNAP_THRESHOLD
      ) {
        snapY = comp.y;
        guide.y = comp.y + COMPONENT_HEIGHT / 2;
      }
    }
    return { snapX, snapY, guide };
  }

  // 拖拽新组件到画布
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (!type) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - RULER_SIZE - COMPONENT_WIDTH / 2;
    const y = e.clientY - rect.top - RULER_SIZE - COMPONENT_HEIGHT / 2;
    onDrop(type, x, y);
  };

  // 画布内组件拖拽
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    setDraggingId(id);
    setDragOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const comp = components.find((c) => c.id === draggingId);
    if (!comp) return;
    const rawX = e.clientX - rect.left - RULER_SIZE - dragOffset.x;
    const rawY = e.clientY - rect.top - RULER_SIZE - dragOffset.y;
    const { snapX, snapY, guide } = getSnapAndGuides(rawX, rawY, draggingId);
    setGuideLines(guide);
    onComponentMove(draggingId, snapX, snapY);
  };
  const handleMouseUp = () => {
    setDraggingId(null);
    setGuideLines(null);
  };

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
            background: "#e6f7ff",
            zIndex: 1000,
            display: "flex",
          }}
        >
          {Array.from({
            length: Math.ceil((width - RULER_SIZE) / RULER_STEP),
          }).map((_, i) => (
            <div
              key={i}
              style={{
                width: RULER_STEP,
                height: RULER_SIZE,
                borderRight: "1px solid #1890ff",
                color: "#1890ff",
                fontSize: 12,
                textAlign: "center",
                lineHeight: `${RULER_SIZE}px`,
                background: i % 2 === 0 ? "#e6f7ff" : "#bae7ff",
                zIndex: 1000,
              }}
            >
              {i * RULER_STEP}
            </div>
          ))}
        </div>
        {/* 左侧刻度尺 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: RULER_SIZE,
            width: RULER_SIZE,
            height: height - RULER_SIZE,
            background: "#e6f7ff",
            zIndex: 1000,
          }}
        >
          {Array.from({
            length: Math.floor((height - RULER_SIZE) / RULER_STEP),
          }).map((_, i) => (
            <div
              key={i}
              style={{
                height: RULER_STEP,
                width: RULER_SIZE,
                borderBottom: "1px solid #1890ff",
                color: "#1890ff",
                fontSize: 12,
                textAlign: "center",
                lineHeight: `${RULER_STEP}px`,
                background: i % 2 === 0 ? "#e6f7ff" : "#bae7ff",
                zIndex: 1000,
              }}
            >
              {i * RULER_STEP}
            </div>
          ))}
        </div>
        {/* 内容区整体偏移，预留刻度尺空间 */}
        <div
          style={{
            position: "absolute",
            left: RULER_SIZE,
            top: RULER_SIZE,
            width: width - RULER_SIZE,
            height: height - RULER_SIZE,
          }}
        >
          {/* 虚线辅助线（纵向） */}
          {Array.from({
            length: Math.floor((width - RULER_SIZE) / RULER_STEP) - 1,
          }).map((_, i) => (
            <div
              key={"v-" + i}
              style={{
                position: "absolute",
                left: (i + 1) * RULER_STEP,
                top: 0,
                width: 1,
                height: "100%",
                borderLeft: "1px dashed #1890ff33",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          ))}
          {/* 虚线辅助线（横向） */}
          {Array.from({
            length: Math.floor((height - RULER_SIZE) / RULER_STEP) - 1,
          }).map((_, i) => (
            <div
              key={"h-" + i}
              style={{
                position: "absolute",
                top: (i + 1) * RULER_STEP,
                left: 0,
                height: 1,
                width: "100%",
                borderTop: "1px dashed #1890ff33",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
          ))}
          {/* 辅助线渲染 */}
          {guideLines?.x !== undefined && (
            <div
              style={{
                position: "absolute",
                left: guideLines.x,
                top: 0,
                width: 1,
                height: "100%",
                borderLeft: "2px solid #1890ff",
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
                borderTop: "2px solid #1890ff",
                zIndex: 9999,
                pointerEvents: "none",
              }}
            />
          )}
          {components.map((comp) => (
            <div
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
              onMouseDown={(e) => handleMouseDown(comp.id, e)}
              onClick={() => setSelectedId(comp.id)}
            >
              <span style={{ marginLeft: 8 }}>{comp.icon}</span>
              {comp.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
