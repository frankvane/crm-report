import React from "react";

export interface TextComponentProps {
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold" | "bolder" | "lighter";
  textAlign?: "left" | "center" | "right";
  dataBinding?: {
    source?: string;
    field?: string;
    format?: "none" | "currency" | "date" | "percent";
    expression?: string;
  };
  mockData?: object;
  width?: number;
  height?: number;
}

function formatValue(value: unknown, format?: string) {
  if (format === "currency") {
    return Number(value).toLocaleString("zh-CN", {
      style: "currency",
      currency: "CNY",
    });
  }
  if (format === "date") {
    return new Date(String(value)).toLocaleDateString();
  }
  if (format === "percent") {
    return (Number(value) * 100).toFixed(2) + "%";
  }
  return value;
}

function renderText({
  text,
  dataBinding,
  mockData,
}: Pick<TextComponentProps, "text" | "dataBinding" | "mockData">) {
  const data: Record<string, unknown> =
    (mockData as Record<string, unknown>) || {};
  if (dataBinding && mockData) {
    // 1. 表达式优先
    if (dataBinding.expression) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          ...Object.keys(data),
          `return ${dataBinding.expression}`
        );
        const result = fn(...Object.values(data));
        return formatValue(result, dataBinding.format);
      } catch {
        return "表达式错误";
      }
    }
    // 2. 字段绑定
    if (dataBinding.field && data[dataBinding.field as string] !== undefined) {
      return formatValue(data[dataBinding.field as string], dataBinding.format);
    }
    // 3. 占位符替换
    if (text) {
      return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        data[key] !== undefined ? String(data[key]) : ""
      );
    }
  }
  // 4. 仅占位符替换
  if (text && mockData) {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
      data[key] !== undefined ? String(data[key]) : ""
    );
  }
  // 5. 静态文本
  return String(text);
}

const TextComponent: React.FC<TextComponentProps> = ({
  text,
  fontSize = 14,
  color = "#222",
  fontWeight = "normal",
  textAlign = "left",
  dataBinding,
  mockData,
  width,
  height,
}) => {
  return (
    <div
      style={{
        fontSize,
        color,
        fontWeight,
        textAlign,
        width: width ? width : undefined,
        height: height ? height : undefined,
        overflow: "hidden",
        whiteSpace: "pre-line",
      }}
    >
      {String(renderText({ text, dataBinding, mockData }))}
    </div>
  );
};

export default TextComponent;
