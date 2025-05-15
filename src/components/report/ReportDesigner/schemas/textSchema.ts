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
    { key: "format", label: "格式化", type: "input" },
    { key: "expression", label: "表达式", type: "input" },
    { key: "mock", label: "模拟数据", type: "input" },
  ],
};

registerComponentSchema("text", textSchema);
