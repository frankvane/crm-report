import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const tableSchema = {
  base: baseSchema,
  standard: [
    { key: "columns", label: "表头配置", type: "json" },
    { key: "dataSource", label: "数据源", type: "json" },
  ],
  dataBinding: [],
};

registerComponentSchema("table", tableSchema);

export default tableSchema;
