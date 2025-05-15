import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const labelSchema = {
  base: baseSchema,
  standard: [
    { key: "text", label: "文本内容", type: "input", default: "标签" },
    { key: "color", label: "字体颜色", type: "color", default: "#1976d2" },
    { key: "fontSize", label: "字号", type: "number", default: 16 },
    { key: "background", label: "背景色", type: "color", default: "#fff" },
    {
      key: "align",
      label: "对齐方式",
      type: "select",
      options: [
        { label: "左对齐", value: "left" },
        { label: "居中", value: "center" },
        { label: "右对齐", value: "right" },
      ],
      default: "left",
    },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    { key: "field", label: "字段", type: "select", options: [] },
    {
      key: "format",
      label: "格式化",
      type: "select",
      options: [
        { label: "数字", value: "number" },
        { label: "日期", value: "date" },
        { label: "百分比", value: "percent" },
        { label: "货币", value: "currency" },
        { label: "自定义", value: "custom" },
      ],
      default: "number",
    },
    {
      key: "customFormat",
      label: "自定义格式化",
      type: "textarea",
      default: "",
    },
    { key: "expression", label: "表达式", type: "textarea" },
    { key: "mock", label: "模拟数据", type: "json" },
    {
      key: "formatPattern",
      label: "格式字符串",
      type: "input",
      default: "",
    },
  ],
};

registerComponentSchema("label", labelSchema);
