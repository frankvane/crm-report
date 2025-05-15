import React from "react";
// @ts-expect-error: dayjs 没有类型声明文件，需忽略类型检查
import dayjs from "dayjs";
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
  // 格式化逻辑增强
  const format = dataBinding?.format;
  const pattern = dataBinding?.formatPattern;
  if (displayText !== undefined && displayText !== null) {
    if (format === "number" && pattern && !isNaN(Number(displayText))) {
      displayText = numeral(displayText).format(pattern);
    } else if (format === "percent") {
      // 百分比格式化，优先用 numeral 支持的百分比格式，否则手动处理
      if (pattern && pattern.includes("%")) {
        displayText = numeral(displayText).format(pattern);
      } else {
        const num = Number(displayText);
        if (!isNaN(num)) {
          displayText =
            (num * 100).toFixed(
              pattern ? parseInt(pattern.replace(/[^0-9]/g, "")) || 0 : 2
            ) + "%";
        }
      }
    } else if (format === "currency") {
      // 货币格式化，默认人民币符号，可根据 pattern 定制
      const symbol = pattern && pattern.includes("$") ? "$" : "￥";
      if (pattern) {
        displayText =
          symbol + numeral(displayText).format(pattern.replace(/^[￥$]/, ""));
      } else {
        displayText = symbol + numeral(displayText).format("0,0.00");
      }
    } else if (format === "date" && pattern) {
      // 日期格式化，需 dayjs 支持
      displayText = dayjs(displayText).format(pattern);
    }
  }
  let justifyContent: React.CSSProperties["justifyContent"] = "flex-start";
  if (align === "center") justifyContent = "center";
  if (align === "right") justifyContent = "flex-end";

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
