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
}

export interface ComponentLibraryItem {
  type: string;
  name: string;
  icon: string;
}
