import { componentRegistry, registerComponent } from "../../componentRegistry";

// 使用 import.meta.glob 扫描 widgets 目录下所有 .tsx 文件
// eager: true 表示直接导入模块，而不是返回一个加载函数
const modules = import.meta.glob("./*.tsx", { eager: true }) as Record<
  string,
  any
>;

// 遍历所有导入的模块，查找并注册 WidgetMeta
for (const path in modules) {
  const module = modules[path];
  // 假设每个 Widget 文件都导出了一个以 Meta 结尾的元数据对象
  for (const exportName in module) {
    if (exportName.endsWith("Meta")) {
      const widgetMeta = module[exportName];
      // 再次检查 widgetMeta 是否符合 IReportComponent 类型结构
      if (
        widgetMeta &&
        typeof widgetMeta.type === "string" &&
        widgetMeta.Component
      ) {
        // 确认 icon 也是必须的字段
        if (widgetMeta.icon !== undefined) {
          registerComponent(widgetMeta);
        } else {
          console.warn(
            `Widget module at ${path} exports ${exportName} missing icon property.`
          );
        }
      } else {
        console.warn(
          `Widget module at ${path} exports ${exportName} not a valid widget meta object.`
        );
      }
    }
  }
}

console.log(
  "Widgets registered automatically:",
  Object.keys(componentRegistry)
);
