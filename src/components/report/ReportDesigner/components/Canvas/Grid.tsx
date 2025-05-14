import React from "react";

interface GridProps {
  canvasConfig: {
    width: number;
    height: number;
    gridSize: number;
    showGrid?: boolean;
  };
}

const Grid: React.FC<GridProps> = ({ canvasConfig }) => {
  if (!canvasConfig.showGrid) return null;
  const { width, height, gridSize } = canvasConfig;
  const lines: React.ReactNode[] = [];
  // 竖线
  for (let x = gridSize; x < width; x += gridSize) {
    lines.push(
      <div
        key={"v-" + x}
        style={{
          position: "absolute",
          left: x + 16, // 预留左侧标尺宽度
          top: 16,
          width: 1,
          height: height,
          background: "#e0e0e0",
          zIndex: 5,
        }}
      />
    );
  }
  // 横线
  for (let y = gridSize; y < height; y += gridSize) {
    lines.push(
      <div
        key={"h-" + y}
        style={{
          position: "absolute",
          top: y + 16, // 预留顶部标尺高度
          left: 16,
          width: width,
          height: 1,
          background: "#e0e0e0",
          zIndex: 5,
        }}
      />
    );
  }
  return <>{lines}</>;
};

export default Grid;
