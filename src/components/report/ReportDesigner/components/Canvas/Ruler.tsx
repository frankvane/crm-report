import React from "react";

interface RulerProps {
  canvasConfig: {
    width: number;
    height: number;
    gridSize: number;
    showRuler?: boolean;
  };
}

const Ruler: React.FC<RulerProps> = ({ canvasConfig }) => {
  if (!canvasConfig.showRuler) return null;
  const { width, height, gridSize } = canvasConfig;
  // 顶部标尺
  const topTicks = [];
  for (let x = 0; x <= width; x += gridSize) {
    topTicks.push(
      <div
        key={x}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 1,
          height: 16,
          background: "#bdbdbd",
        }}
      />
    );
    if (x % (gridSize * 5) === 0) {
      topTicks.push(
        <div
          key={x + "-label"}
          style={{
            position: "absolute",
            left: x + 2,
            top: 0,
            fontSize: 10,
            color: "#888",
            userSelect: "none",
          }}
        >
          {x}
        </div>
      );
    }
  }
  // 左侧标尺
  const leftTicks = [];
  for (let y = 0; y <= height; y += gridSize) {
    leftTicks.push(
      <div
        key={y}
        style={{
          position: "absolute",
          top: y,
          left: 0,
          width: 16,
          height: 1,
          background: "#bdbdbd",
        }}
      />
    );
    if (y % (gridSize * 5) === 0) {
      leftTicks.push(
        <div
          key={y + "-label"}
          style={{
            position: "absolute",
            top: y + 2,
            left: 0,
            fontSize: 10,
            color: "#888",
            userSelect: "none",
          }}
        >
          {y}
        </div>
      );
    }
  }
  return (
    <>
      {/* 顶部标尺 */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 0,
          width: width,
          height: 16,
          background: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          zIndex: 20,
        }}
      >
        {topTicks}
      </div>
      {/* 左侧标尺 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 16,
          width: 16,
          height: height,
          background: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
          zIndex: 20,
        }}
      >
        {leftTicks}
      </div>
    </>
  );
};

export default Ruler;
