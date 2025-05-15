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
  return (
    <span
      style={{
        display: "inline-block",
        color,
        fontSize,
        background,
        textAlign: align,
        padding: "2px 8px",
        borderRadius: 4,
        fontWeight: 500,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export default LabelWidget;
