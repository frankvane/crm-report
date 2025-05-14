// 文本组件 schema，rjsf 扁平化三段式
export const basePropsSchema = {
  type: "object",
  properties: {
    id: { type: "string", title: "唯一标识", readOnly: true },
    x: { type: "number", title: "X 坐标" },
    y: { type: "number", title: "Y 坐标" },
    width: { type: "number", title: "宽度" },
    height: { type: "number", title: "高度" },
    locked: { type: "boolean", title: "锁定" },
    visible: { type: "boolean", title: "可见", default: true },
  },
};

export const commonPropsSchema = {
  type: "object",
  properties: {
    text: { type: "string", title: "文本内容" },
    fontSize: { type: "number", title: "字号", default: 16 },
    color: { type: "string", title: "颜色", default: "#222" },
    fontWeight: {
      type: "string",
      title: "加粗",
      enum: ["normal", "bold", "bolder", "lighter"],
      default: "normal",
    },
    textAlign: {
      type: "string",
      title: "对齐方式",
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
};

export const dataPropsSchema = {
  type: "object",
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
    mockData: { type: "object", title: "Mock数据" },
  },
};

export default {
  basePropsSchema,
  commonPropsSchema,
  dataPropsSchema,
};
