export * from "./index";

export interface CanvasComponent {
  id: string;
  type: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  locked?: boolean;
  visible?: boolean;
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: "normal" | "bold" | "bolder" | "lighter";
  textAlign?: "left" | "center" | "right";
  dataBinding?: {
    source?: string;
    field?: string;
    format?: "none" | "currency" | "date" | "percent";
    expression?: string;
  };
  mockData?: string;
  width?: number;
  height?: number;
}

export interface ComponentLibraryItem {
  type: string;
  name: string;
  icon: string;
}
