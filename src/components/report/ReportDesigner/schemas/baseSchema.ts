// 基础属性 schema，所有组件通用
export const baseSchema = [
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
  { key: "resizable", label: "可缩放", type: "switch" },
  { key: "rotatable", label: "可旋转", type: "switch" },
  { key: "rotation", label: "旋转角度", type: "number" },
  { key: "opacity", label: "透明度", type: "number" },
];
