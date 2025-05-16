import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const textSchema = {
  base: baseSchema,
  standard: [
    { key: "text", label: "文本内容", type: "input" },
    { key: "fontSize", label: "字号", type: "number" },
    { key: "color", label: "字体颜色", type: "color" },
    { key: "fontWeight", label: "加粗", type: "switch" },
    { key: "italic", label: "斜体", type: "switch" },
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

registerComponentSchema("text", textSchema);
