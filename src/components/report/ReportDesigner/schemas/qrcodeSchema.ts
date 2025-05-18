import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const qrcodeSchema = {
  base: baseSchema,
  standard: [
    { key: "qrValue", label: "值", type: "input" },
    { key: "size", label: "大小", type: "number" },
    { key: "color", label: "颜色", type: "color" },
    { key: "bgColor", label: "背景色", type: "color" },
    { key: "bordered", label: "边框", type: "switch" },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    { key: "field", label: "字段", type: "select", options: [] },
  ],
};

registerComponentSchema("qrcode", qrcodeSchema);
