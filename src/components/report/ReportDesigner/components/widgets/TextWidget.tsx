import { Input } from "antd";
import React from "react";

interface TextWidgetProps {
  value?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: boolean;
  italic?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}

const TextWidget: React.FC<TextWidgetProps> = ({
  value = "",
  fontSize = 16,
  color = "#222",
  fontWeight = false,
  italic = false,
  style = {},
  placeholder = "请输入内容",
  disabled = false,
}) => {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        fontSize,
        color,
        fontWeight: fontWeight ? "bold" : 400,
        fontStyle: italic ? "italic" : "normal",
        ...style,
        transform: style.transform,
        opacity: style.opacity,
      }}
      readOnly
    />
  );
};

export default TextWidget;
