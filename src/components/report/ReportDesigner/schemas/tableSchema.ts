import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const tableSchema = {
  base: baseSchema,
  standard: [
    // 只放结构/样式相关属性
    { key: "pagination", label: "分页", type: "switch" },
    { key: "bordered", label: "边框", type: "switch" },
    {
      key: "size",
      label: "尺寸",
      type: "select",
      options: [
        { label: "中等", value: "middle" },
        { label: "紧凑", value: "small" },
        // 不再提供 default，保持与antd一致
      ],
      // 说明：不选时为undefined，等同于antd的默认尺寸
    },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    {
      key: "columns",
      label: "字段映射",
      type: "columns", // 自定义类型，专为表格字段配置设计
      itemSchema: [
        { key: "field", label: "字段", type: "select", options: [] },
        { key: "label", label: "列名", type: "input" },
        {
          key: "format",
          label: "格式化",
          type: "select",
          options: [
            { label: "无", value: "" },
            { label: "数字", value: "number" },
            { label: "百分比", value: "percent" },
            { label: "货币", value: "currency" },
            { label: "日期", value: "date" },
            { label: "自定义", value: "custom" },
          ],
        },
        { key: "expression", label: "表达式", type: "input" },
        { key: "width", label: "宽度", type: "number" },
        {
          key: "align",
          label: "对齐",
          type: "select",
          options: [
            { label: "左", value: "left" },
            { label: "中", value: "center" },
            { label: "右", value: "right" },
          ],
        },
        { key: "visible", label: "显示", type: "switch" },
      ],
    },
  ],
};

registerComponentSchema("table", tableSchema);

export default tableSchema;
