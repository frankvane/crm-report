import { IReportComponent } from "../../componentRegistry";
import { Image } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import React from "react";
import { useComponentsStore } from "@/components/report/ReportDesigner/store";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";

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
  bindingData?: any;
}

const svgPlaceholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg width='120' height='40' xmlns='http://www.w3.org/2000/svg'>
      <rect width='120' height='40' fill='#c8c8c8' stroke='#c8c8c8'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#767676' font-size='16'>图片</text>
    </svg>
  `);

const ImageWidget: React.FC<ImageWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useComponentsStore((s) => s.components);
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
  } = effectiveProps;

  // 获取全局数据源
  const dataSources = useDataSourceStore((s) => s.dataSources);

  let src = svgPlaceholder;
  // 优先使用 props.bindingData
  if (props.bindingData) {
    if (typeof props.bindingData === "string" && props.bindingData.trim()) {
      src = props.bindingData;
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
      fallback={svgPlaceholder}
    />
  );
};

export const ImageWidgetMeta: IReportComponent = {
  type: "image",
  displayName: "图片",
  Component: ImageWidget,
  icon: <PictureOutlined />,
};

export default ImageWidget;
