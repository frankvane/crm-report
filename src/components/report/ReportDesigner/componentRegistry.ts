// 组件注册中心，支持动态注册和获取组件元信息

import React from "react";

export interface ComponentMeta {
  type: string; // 组件类型，如 label、text
  displayName: string; // 组件显示名
  icon?: string; // 组件图标
  defaultBaseProps: Record<string, any>; // 基础属性默认值
  defaultCustomProps: Record<string, any>; // 特有属性默认值
  render: React.FC<any>; // 渲染组件
  propsSchema: any; // 属性schema
}

const registry: Record<string, ComponentMeta> = {};

export function registerComponent(meta: ComponentMeta) {
  if (!meta.type) throw new Error("组件type不能为空");
  registry[meta.type] = meta;
}

export function getComponentMeta(type: string): ComponentMeta | undefined {
  return registry[type];
}

export function getAllComponentMetas(): ComponentMeta[] {
  return Object.values(registry);
}
