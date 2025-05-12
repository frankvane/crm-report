import React from "react";

interface GridLinesProps {
  width: number;
  height: number;
  step?: number;
  offset?: number;
}

const GridLines: React.FC<GridLinesProps> = ({
  width,
  height,
  step = 40,
  offset = 0,
}) => {
  const vCount = Math.floor((width - offset) / step) - 1;
  const hCount = Math.floor((height - offset) / step) - 1;
  return (
    <>
      {/* 纵向虚线 */}
      {Array.from({ length: vCount }).map((_, i) => (
        <div
          key={"v-" + i}
          style={{
            position: "absolute",
            left: (i + 1) * step,
            top: 0,
            width: 1,
            height: "100%",
            borderLeft: "1px dashed #1890ff33",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}
      {/* 横向虚线 */}
      {Array.from({ length: hCount }).map((_, i) => (
        <div
          key={"h-" + i}
          style={{
            position: "absolute",
            top: (i + 1) * step,
            left: 0,
            height: 1,
            width: "100%",
            borderTop: "1px dashed #1890ff33",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
};

export default GridLines;
