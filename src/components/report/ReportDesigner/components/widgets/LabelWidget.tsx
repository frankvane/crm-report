import {
  formatLabelValue,
  getJustifyContent,
} from "@report/ReportDesigner/utils";

import React from "react";
import dayjs from "dayjs";
import numeral from "numeral";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@/components/report/ReportDesigner/store";

interface LabelWidgetProps {
  componentId?: string;
  text?: string;
  color?: string;
  fontSize?: number;
  background?: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
  dataBinding?: {
    dataSource?: string;
    field?: string;
    format?: string;
    formatPattern?: string;
    customFormat?: string;
    [key: string]: any;
  };
  user?: any;
  data?: any;
}

const LabelWidget: React.FC<LabelWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useReportDesignerStore((s) => s.components);
  const comp = props.componentId
    ? allComponents.find((c) => c.id === props.componentId)
    : undefined;
  const effectiveProps = comp ? { ...props, ...comp.props } : props;

  const {
    text = "标签",
    color = "#1976d2",
    fontSize = 16,
    background = "#fff",
    align = "left",
    style = {},
    dataBinding,
  } = effectiveProps;

  const dataSources = useDataSourceStore((s) => s.dataSources);
  let displayText = text;
  if (effectiveProps.user && dataBinding?.field) {
    displayText = effectiveProps.user[dataBinding.field] ?? text;
  } else if (effectiveProps.data && dataBinding?.field) {
    displayText = effectiveProps.data[dataBinding.field] ?? text;
  } else if (dataBinding?.dataSource && dataBinding?.field) {
    const ds = dataSources.find((d) => d.key === dataBinding.dataSource);
    if (ds && ds.sample) {
      displayText = ds.sample[dataBinding.field] ?? text;
    }
  }
  displayText = formatLabelValue(displayText, dataBinding, numeral, dayjs);

  const justifyContent = getJustifyContent(align);

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
        {displayText}
      </span>
    </div>
  );
};

export default LabelWidget;
