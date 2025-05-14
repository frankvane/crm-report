import React from "react";

export interface LabelComponentProps {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  background?: string;
  width?: number;
  height?: number;
}

const LabelComponent: React.FC<LabelComponentProps> = ({
  text,
  color = "#333",
  fontSize = 14,
  fontWeight = "normal",
  background = "#f5f5f5",
  width,
  height,
}) => {
  return (
    <div
      style={{
        color,
        fontSize,
        fontWeight,
        background,
        width: width ? width : undefined,
        height: height ? height : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        padding: "4px 8px",
        boxSizing: "border-box",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {text}
    </div>
  );
};

export default LabelComponent;
