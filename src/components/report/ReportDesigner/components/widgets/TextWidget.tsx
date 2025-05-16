import React from "react";
import dayjs from "dayjs";
import { formatLabelValue } from "@report/ReportDesigner/utils/formatLabelValue";
import numeral from "numeral";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@/components/report/ReportDesigner/store";

interface TextWidgetProps {
  componentId?: string;
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: boolean;
  italic?: boolean;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  dataBinding?: {
    dataSource?: string;
    field?: string;
    format?: string;
    formatPattern?: string;
    customFormat?: string;
    expression?: string;
    mock?: string;
  };
}

const TextWidget: React.FC<TextWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useReportDesignerStore((s) => s.components);
  const comp = props.componentId
    ? allComponents.find((c) => c.id === props.componentId)
    : undefined;
  const effectiveProps = comp ? { ...props, ...comp.props } : props;

  const {
    text = "",
    fontSize = 16,
    color = "#222",
    fontWeight = false,
    italic = false,
    rotation = 0,
    opacity = 1,
    visible = true,
    style = {},
    placeholder = "请输入内容",
    dataBinding,
  } = effectiveProps;

  const dataSources = useDataSourceStore((s) => s.dataSources);
  let displayText = text || placeholder;
  if (dataBinding?.dataSource && dataBinding?.field) {
    const ds = dataSources.find((d) => d.key === dataBinding.dataSource);
    if (ds && ds.sample) {
      displayText = ds.sample[dataBinding.field] ?? displayText;
    }
  }
  displayText = formatLabelValue(displayText, dataBinding, numeral, dayjs);

  if (!visible) return null;
  return (
    <div
      style={{
        fontSize,
        color,
        fontWeight: fontWeight ? "bold" : 400,
        fontStyle: italic ? "italic" : "normal",
        transform: `rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
    >
      {displayText}
    </div>
  );
};

export default TextWidget;
