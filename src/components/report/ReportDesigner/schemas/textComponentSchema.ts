import { JSONSchema7 } from "json-schema";

export const textComponentSchema: JSONSchema7 = {
  type: "object",
  properties: {
    name: { type: "string", title: "组件名称" },
    text: { type: "string", title: "文本内容" },
    fontSize: { type: "number", title: "字体大小", default: 14 },
    color: { type: "string", title: "字体颜色", default: "#222222" },
    fontWeight: {
      type: "string",
      title: "字体粗细",
      enum: ["normal", "bold", "bolder", "lighter"],
      default: "normal",
    },
    textAlign: {
      type: "string",
      title: "对齐方式",
      enum: ["left", "center", "right"],
      default: "left",
    },
    dataBinding: {
      type: "object",
      title: "数据绑定",
      properties: {
        source: { type: "string", title: "数据源" },
        field: { type: "string", title: "字段" },
        format: {
          type: "string",
          title: "格式化",
          enum: ["none", "currency", "date", "percent"],
          default: "none",
        },
        expression: { type: "string", title: "表达式" },
      },
    },
    mockData: { type: "string", title: "Mock数据（JSON）" },
    width: { type: "number", title: "宽度(px)", minimum: 20, default: 120 },
    height: { type: "number", title: "高度(px)", minimum: 20, default: 32 },
  },
};
