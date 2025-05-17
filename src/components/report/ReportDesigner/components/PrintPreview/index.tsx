import ImageWidget from "../widgets/ImageWidget";
import LabelWidget from "../widgets/LabelWidget";
import React from "react";
import TableWidget from "../widgets/TableWidget";
import TextWidget from "../widgets/TextWidget";
import { useDataSourceStore } from "@report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

// 如有其它控件类型可继续引入

const widgetMap: Record<string, any> = {
  label: LabelWidget,
  text: TextWidget,
  image: ImageWidget,
  table: TableWidget,
  // ...其它类型
};

export default function PrintPreview() {
  const components = useReportDesignerStore((s) => s.components);
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);
  const dataSources = useDataSourceStore((s) => s.dataSources);
  // 只取第一个用户（如张三）
  const usersDS = dataSources.find((ds) => ds.key === "users");
  const users = usersDS?.data || [];

  // 多用户分页，每个用户的订单也分页
  const pages = users.flatMap((user, userIdx) => {
    const orders = user?.orders || [];
    const orderPageSize = 5;
    const orderTotalPages = Math.ceil(orders.length / orderPageSize) || 1;
    return Array.from({ length: orderTotalPages }, (_, i) => {
      const pageOrders = orders.slice(
        i * orderPageSize,
        (i + 1) * orderPageSize
      );
      return (
        <div
          key={`user${userIdx}-page${i}`}
          style={{
            width: canvasConfig.width,
            height: canvasConfig.height,
            background: "#fff",
            margin: "0 auto 32px auto",
            position: "relative",
            overflow: "hidden",
            pageBreakAfter: "always",
            boxShadow: "0 0 8px #ccc",
          }}
        >
          {components
            .filter((c) => c.visible !== false)
            .map((comp) => {
              const Comp = widgetMap[comp.type];
              if (!Comp) return null;
              if (comp.type === "table") {
                return (
                  <div
                    key={`${comp.id}-user${userIdx}-page${i}`}
                    style={{
                      position: "absolute",
                      left: comp.x,
                      top: comp.y,
                      width: comp.width,
                      height: comp.height,
                      pointerEvents: "none",
                    }}
                  >
                    <Comp componentId={comp.id} dataSource={pageOrders} />
                  </div>
                );
              }
              return (
                <div
                  key={`${comp.id}-user${userIdx}-page${i}`}
                  style={{
                    position: "absolute",
                    left: comp.x,
                    top: comp.y,
                    width: comp.width,
                    height: comp.height,
                    pointerEvents: "none",
                  }}
                >
                  <Comp componentId={comp.id} user={user} />
                </div>
              );
            })}
        </div>
      );
    });
  });

  return <div>{pages}</div>;
}
