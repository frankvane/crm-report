import React from "react";
import dayjs from "dayjs";
import { formatLabelValue } from "./formatLabelValue";
import { getJustifyContent } from "./getJustifyContent";
// @ts-expect-error: numeral 没有类型声明文件，需忽略类型检查
import numeral from "numeral";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";

interface LabelWidgetProps {
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
}

const LabelWidget: React.FC<LabelWidgetProps> = ({
  text = "标签",
  color = "#1976d2",
  fontSize = 16,
  background = "#fff",
  align = "left",
  style = {},
  dataBinding,
}) => {
  const dataSources = useDataSourceStore((s) => s.dataSources);
  let displayText = text;
  if (dataBinding?.dataSource && dataBinding?.field) {
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
