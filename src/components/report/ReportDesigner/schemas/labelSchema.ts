import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const labelSchema = {
  base: baseSchema,
  standard: [
    { key: "text", label: "文本内容", type: "input" },
    { key: "color", label: "字体颜色", type: "color" },
    { key: "fontSize", label: "字号", type: "number" },
    { key: "background", label: "背景色", type: "color" },
    {
      key: "align",
      label: "对齐方式",
      type: "select",
      options: [
        { label: "左对齐", value: "left" },
        { label: "居中", value: "center" },
        { label: "右对齐", value: "right" },
      ],
    },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    { key: "field", label: "字段", type: "input" },
    { key: "format", label: "格式化", type: "input" },
    { key: "expression", label: "表达式", type: "input" },
    { key: "mock", label: "模拟数据", type: "input" },
  ],
};

registerComponentSchema("label", labelSchema);
