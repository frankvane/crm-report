import { Image } from "antd";
import React from "react";

interface ImageWidgetProps {
  src?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  style?: React.CSSProperties;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({
  src = "https://via.placeholder.com/120x40?text=图片",
  width = 120,
  height = 40,
  alt = "图片",
  style = {},
}) => {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      style={{ ...style, objectFit: "contain", borderRadius: 4 }}
      preview={false}
      fallback="https://via.placeholder.com/120x40?text=图片"
    />
  );
};

export default ImageWidget;
