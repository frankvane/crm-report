import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const tableSchema = {
  base: baseSchema,
  standard: [
    { key: "columns", label: "表头配置", type: "json" },
    { key: "dataSource", label: "数据源", type: "json" },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    { key: "field", label: "字段", type: "select", options: [] },
    { key: "format", label: "格式化", type: "input" },
    { key: "expression", label: "表达式", type: "input" },
    { key: "mock", label: "模拟数据", type: "input" },
  ],
};

registerComponentSchema("table", tableSchema);

export default tableSchema;
