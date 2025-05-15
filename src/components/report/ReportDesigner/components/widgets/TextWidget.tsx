import { Input } from "antd";
import React from "react";

interface TextWidgetProps {
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: boolean;
  italic?: boolean;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}

const TextWidget: React.FC<TextWidgetProps> = ({
  text = "",
  fontSize = 16,
  color = "#222",
  fontWeight = false,
  italic = false,
  rotation = 0,
  opacity = 1,
  visible = true,
  locked = false,
  style = {},
  placeholder = "请输入内容",
  disabled = false,
}) => {
  if (!visible) return null;
  return (
    <Input
      value={text}
      placeholder={placeholder}
      disabled={disabled || locked}
      style={{
        fontSize,
        color,
        fontWeight: fontWeight ? "bold" : 400,
        fontStyle: italic ? "italic" : "normal",
        transform: `rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
      readOnly
    />
  );
};

export default TextWidget;
