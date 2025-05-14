export interface ReportComponent {
  id: string;
  type: string; // 组件类型
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
  visible: boolean;
  zindex: number;
  props: Record<string, any>;
  parentId?: string | null;
  children?: string[];
  name?: string;
  groupId?: string | null;
  selected?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  rotatable?: boolean;
  rotation?: number;
  opacity?: number;
  style?: Record<string, any>;
  createdAt?: number | string;
  updatedAt?: number | string;
  meta?: Record<string, any>;
}
