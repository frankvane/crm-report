import { ReportComponent } from "@report/ReportDesigner/types/component";

export interface ReportDesignerState {
  components: ReportComponent[]; // 组件列表
  selectedIds: string[]; // 当前选中组件ID
  canvasConfig: {
    gridSize: number;
    showGrid: boolean;
    showRuler: boolean;
    rulerUnit: "px" | "mm";
    allowSnapToGrid: boolean;
    snapToGrid: boolean;
    width: number; // 画布宽度
    height: number; // 画布高度
    sizeType: string; // 画布尺寸类型
    // ...其他画布配置
  };
  setComponents: (components: ReportComponent[]) => void;
  addComponent: (component: ReportComponent) => void;
  updateComponent: (id: string, data: Partial<ReportComponent>) => void;
  removeComponent: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  setCanvasConfig: (
    config: Partial<{
      gridSize: number;
      showGrid: boolean;
      showRuler: boolean;
      rulerUnit: "px" | "mm";
      allowSnapToGrid: boolean;
      snapToGrid: boolean;
      width: number;
      height: number;
      sizeType: string;
    }>
  ) => void;
  // ...其他全局状态，如批量操作、历史记录等
}
