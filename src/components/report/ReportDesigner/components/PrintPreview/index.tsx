import {
  useCanvasStore,
  useComponentsStore,
} from "@report/ReportDesigner/store";

import React from "react";
import { componentRegistry } from "../../componentRegistry";
import { useDataSourceStore } from "@report/ReportDesigner/store/dataSourceStore";

// 临时设定 Table 组件的子数据分页大小 (后续应从组件配置或画布配置中获取)
const TABLE_PAGE_SIZE = 5; // 示例：每页显示 5 条订单

export default function PrintPreview() {
  const components = useComponentsStore((s) => s.components);
  const canvasConfig = useCanvasStore((s) => s.canvasConfig);
  const dataSources = useDataSourceStore((s) => s.dataSources);

  // 临时指定主数据源 Key (后续可能需要从画布配置中获取)
  const mainDataSourceKey = "users"; // 示例：指定用户数据源为主数据

  // 获取主数据源及其数据
  const mainDataSource = dataSources.find((ds) => ds.key === mainDataSourceKey);
  const mainData = mainDataSource?.data || [];

  // 如果没有数据，则不渲染任何页面
  if (mainData.length === 0) {
    return <div>没有可用的数据用于预览</div>;
  }

  // 存储所有生成的页面
  const allPages: JSX.Element[] = [];

  // 遍历主数据源的每一条记录 (例如：每个用户)
  mainData.forEach((mainDataContext, mainDataIndex) => {
    // 查找当前主数据记录下需要分页的子数据 (例如：orders, favoritesList)
    // 这里简化处理，只考虑绑定到 mainDataSourceKey 且有 dataNode 的 table 组件
    const paginatedTables = components.filter(
      (comp) =>
        comp.type === "table" &&
        comp.props?.dataBinding?.dataSource === mainDataSourceKey &&
        comp.props?.dataBinding?.dataNode
    );

    let maxSubPages = 1; // 至少需要 1 页来显示主数据信息

    // 计算当前主数据记录下，需要最多子分页的那个 Table 所需的总页数
    paginatedTables.forEach((tableComp) => {
      const dataNodeKey = tableComp.props.dataBinding.dataNode;
      const subData = mainDataContext[dataNodeKey];
      if (Array.isArray(subData)) {
        const subPages = Math.ceil(subData.length / TABLE_PAGE_SIZE) || 1;
        maxSubPages = Math.max(maxSubPages, subPages);
      }
    });

    // 为当前主数据记录生成 maxSubPages 页
    for (let subPageIndex = 0; subPageIndex < maxSubPages; subPageIndex++) {
      const pageKey = `user-${mainDataIndex}-page-${subPageIndex}`;

      const pageElement = (
        <div
          key={pageKey}
          style={{
            width: canvasConfig.width,
            height: canvasConfig.height,
            background: "#fff",
            margin: "0 auto 32px auto",
            position: "relative",
            overflow: "hidden",
            pageBreakAfter: "always", // 打印时强制分页
            boxShadow: "0 0 8px #ccc",
          }}
        >
          {components
            .filter((c) => c.visible !== false) // 过滤掉隐藏的组件
            .map((comp) => {
              const Comp = componentRegistry[comp.type]?.Component;
              if (!Comp) return null;

              // 根据组件的 dataBinding 和当前页面数据上下文提取数据
              let bindingData = null;
              const dataBinding = comp.props?.dataBinding;

              if (dataBinding) {
                // 确保有数据绑定
                const { dataSource, dataNode, field } = dataBinding;

                // 检查组件绑定的数据源是否是当前主数据源
                if (dataSource === mainDataSourceKey) {
                  if (comp.type === "table" && dataNode) {
                    // Table 组件：从当前主数据记录的子数据中提取当前页的数据片段
                    const fullSubData = mainDataContext[dataNode];
                    if (Array.isArray(fullSubData)) {
                      bindingData = fullSubData.slice(
                        subPageIndex * TABLE_PAGE_SIZE,
                        (subPageIndex + 1) * TABLE_PAGE_SIZE
                      );
                    } else {
                      bindingData = []; // 如果子数据不是数组，给空数组
                    }
                    // TODO: 根据 columns 进一步处理 table 的数据
                  } else if (field) {
                    // 非 Table 组件：从当前主数据记录中提取字段值
                    bindingData = mainDataContext[field];
                    // TODO: 如果需要，处理更复杂的 field 路径
                  }
                } else {
                  // TODO: 处理绑定到其他数据源的情况 (目前不处理，显示空数据)
                  // console.warn(...);
                }
              } else {
                // 如果没有数据绑定，或者数据源不对，bindingData 保持 null
                // 或者可以根据组件类型给一个默认空数据
                console.warn(
                  `Component ${comp.id} has no data binding or invalid data source.`
                );
              }

              // 将提取的数据传递给组件
              return (
                <div
                  key={`${comp.id}-${pageKey}`} // 组件 Key，结合页面 Key 确保唯一性
                  style={{
                    position: "absolute",
                    left: comp.x,
                    top: comp.y,
                    width: comp.width,
                    height: comp.height,
                    pointerEvents: "none",
                  }}
                >
                  {comp.type === "table" ? (
                    <Comp componentId={comp.id} dataSource={bindingData} />
                  ) : (
                    <Comp componentId={comp.id} bindingData={bindingData} />
                  )}
                </div>
              );
            })}
        </div>
      );
      allPages.push(pageElement);
    }
  });

  // 返回所有生成的页面
  return <div>{allPages}</div>;
}
