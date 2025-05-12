import { ComponentConfig, ReportLayout } from "../types/report";

// 生成唯一ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// 计算组件位置（暂未实现，保留参数以便后续扩展）
export const calculatePosition = (
  _layout: ReportLayout[],
  _newComponent: ReportLayout
): { x: number; y: number } => {
  return { x: 0, y: 0 };
};

// 验证组件配置（暂未实现，保留参数以便后续扩展）
export const validateConfig = (_config: ComponentConfig): boolean => {
  return true;
};

// 格式化日期
export const formatDate = (date: Date): string => {
  return date.toISOString();
};
