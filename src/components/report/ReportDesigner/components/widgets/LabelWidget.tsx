import React from "react";

interface LabelWidgetProps {
  text?: string;
  color?: string;
  fontSize?: number;
  background?: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}

const LabelWidget: React.FC<LabelWidgetProps> = ({
  text = "标签",
  color = "#1976d2",
  fontSize = 16,
  background = "#fff",
  align = "left",
  style = {},
}) => {
  let justifyContent: React.CSSProperties["justifyContent"] = "flex-start";
  if (align === "center") justifyContent = "center";
  if (align === "right") justifyContent = "flex-end";

  return (
    <div
      style={{
        display: "flex",
        justifyContent,
        width: "100%",
        background,
        ...style,
        transform: style.transform,
        opacity: style.opacity,
      }}
    >
      <span
        style={{
          color,
          fontSize,
          padding: "2px 8px",
          borderRadius: 4,
          fontWeight: 500,
          background: "transparent",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default LabelWidget;
