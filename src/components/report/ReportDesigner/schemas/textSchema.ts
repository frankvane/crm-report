import { registerComponentSchema } from "./schemaRegistry";

const textSchema = {
  base: [
    { key: "id", label: "ID", type: "text", disabled: true },
    { key: "type", label: "类型", type: "text", disabled: true },
    { key: "name", label: "名称", type: "input" },
    { key: "x", label: "X 坐标", type: "number" },
    { key: "y", label: "Y 坐标", type: "number" },
    { key: "width", label: "宽度", type: "number" },
    { key: "height", label: "高度", type: "number" },
    { key: "locked", label: "锁定", type: "switch" },
    { key: "visible", label: "显示", type: "switch" },
    { key: "zindex", label: "层级", type: "number" },
    { key: "groupId", label: "分组ID", type: "input" },
    { key: "draggable", label: "可拖动", type: "switch" },
    { key: "resizable", label: "可缩放", type: "switch" },
    { key: "rotatable", label: "可旋转", type: "switch" },
    { key: "rotation", label: "旋转角度", type: "number" },
    { key: "opacity", label: "透明度", type: "number" },
    { key: "createdAt", label: "创建时间", type: "text", disabled: true },
    { key: "updatedAt", label: "更新时间", type: "text", disabled: true },
  ],
  standard: [
    { key: "text", label: "文本内容", type: "input" },
    { key: "fontSize", label: "字号", type: "number" },
    { key: "color", label: "字体颜色", type: "color" },
    { key: "fontWeight", label: "加粗", type: "switch" },
    { key: "italic", label: "斜体", type: "switch" },
  ],
  dataBinding: [
    { key: "dataSource", label: "数据源", type: "select", options: [] },
    { key: "field", label: "字段", type: "input" },
    { key: "format", label: "格式化", type: "input" },
    { key: "expression", label: "表达式", type: "input" },
    { key: "mock", label: "模拟数据", type: "input" },
  ],
};

registerComponentSchema("text", textSchema);
