import React from "react";

interface RulerProps {
  length: number; // 刻度总长度（px）
  step?: number; // 步长（px）
  direction?: "horizontal" | "vertical";
  offset?: number; // 起始偏移
  style?: React.CSSProperties;
}

const Ruler: React.FC<RulerProps> = ({
  length,
  step = 40,
  direction = "horizontal",
  offset = 0,
  style,
}) => {
  const count = Math.floor(length / step);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        ...style,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={
            direction === "horizontal"
              ? {
                  width: step,
                  height: "100%",
                  borderRight: "1px solid #eee",
                  color: "#1890ff",
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: "24px",
                  background: i % 2 === 0 ? "#e6f7ff" : "#bae7ff",
                  zIndex: 1000,
                  userSelect: "none",
                }
              : {
                  height: step,
                  width: "100%",
                  borderBottom: "1px solid #eee",
                  color: "#1890ff",
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: `${step}px`,
                  background: i % 2 === 0 ? "#e6f7ff" : "#bae7ff",
                  zIndex: 1000,
                  userSelect: "none",
                }
          }
        >
          {i * step + offset}
        </div>
      ))}
    </div>
  );
};

export default Ruler;
