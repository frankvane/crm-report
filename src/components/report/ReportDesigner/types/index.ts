export * from "./index";

export interface CanvasComponent {
  id: string;
  type: string;
  name: string;
  icon: string;
  // 分组属性
  baseProps?: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    locked?: boolean;
    visible?: boolean;
    id?: string;
  };
  commonProps?: {
    text?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: "normal" | "bold" | "bolder" | "lighter";
    textAlign?: "left" | "center" | "right";
  };
  dataProps?: {
    source?: string;
    field?: string;
    format?: "none" | "currency" | "date" | "percent";
    expression?: string;
    mockData?: string;
  };
  // 兼容老数据结构
  [key: string]: unknown;
}

export interface ComponentLibraryItem {
  type: string;
  name: string;
  icon: string;
}
