// 组件注册表
export const componentRegistry: Record<string, IReportComponent> = {};

export interface IReportComponent {
  type: string;
  displayName: string;
  icon: React.ReactNode;
  Component: React.ComponentType<any>;
}

export function registerComponent(component: IReportComponent) {
  if (componentRegistry[component.type]) {
    console.warn(`组件类型 ${component.type} 已注册，自动覆盖`);
  }
  componentRegistry[component.type] = component;
}
