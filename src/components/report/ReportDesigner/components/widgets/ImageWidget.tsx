import { Image } from "antd";
import React from "react";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@/components/report/ReportDesigner/store";

interface ImageWidgetProps {
  componentId?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  style?: React.CSSProperties;
  dataBinding?: {
    dataSource?: string;
    field?: string;
  };
  user?: any;
  data?: any;
}

const ImageWidget: React.FC<ImageWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useReportDesignerStore((s) => s.components);
  const comp = props.componentId
    ? allComponents.find((c) => c.id === props.componentId)
    : undefined;
  const effectiveProps = comp ? { ...props, ...comp.props } : props;

  const {
    width = 120,
    height = 40,
    alt = "图片",
    style = {},
    dataBinding,
    user,
    data,
  } = effectiveProps;

  // 获取全局数据源
  const dataSources = useDataSourceStore((s) => s.dataSources);

  let src = "https://via.placeholder.com/120x40?text=图片";
  // 优先使用 props.user 或 props.data
  if (user && dataBinding?.field) {
    const val = user[dataBinding.field];
    if (typeof val === "string" && val.trim()) {
      src = val;
    }
  } else if (data && dataBinding?.field) {
    const val = data[dataBinding.field];
    if (typeof val === "string" && val.trim()) {
      src = val;
    }
  } else if (dataBinding?.dataSource && dataBinding?.field) {
    // 回退到 store 数据源
    const ds = dataSources.find((d) => d.key === dataBinding.dataSource);
    if (ds && ds.sample) {
      const val = ds.sample[dataBinding.field];
      if (typeof val === "string" && val.trim()) {
        src = val;
      }
    }
  }

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
