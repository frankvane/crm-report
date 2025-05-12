// 报表模板类型定义
export interface ReportTemplate {
  id: string;
  name: string;
  layout: ReportLayout[];
  config: ReportConfig;
  createTime: string;
  updateTime: string;
}

// 布局项类型定义
export interface ReportLayout {
  id: string;
  type: "table" | "chart" | "text";
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: ComponentConfig;
  data?: any;
}

// 组件配置类型定义
export interface ComponentConfig {
  style?: React.CSSProperties;
  dataSource?: DataSource;
  [key: string]: any;
}

// 数据源类型定义
export interface DataSource {
  type: "static" | "api" | "variable";
  value: any;
  mapping?: Record<string, string>;
}

// 报表配置类型定义
export interface ReportConfig {
  pageSize: "A4" | "A3" | "custom";
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 组件类型定义
export interface ReportComponent {
  id: string;
  type: string;
  name: string;
  icon: string;
  defaultConfig: ComponentConfig;
}

// 历史记录项类型定义
export interface HistoryItem {
  type: "add" | "update" | "delete" | "move";
  component: ReportLayout;
  timestamp: number;
}
