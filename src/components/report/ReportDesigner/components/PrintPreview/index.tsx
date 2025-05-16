import React, { useState } from "react";

import ImageWidget from "../widgets/ImageWidget";
import LabelWidget from "../widgets/LabelWidget";
import { Pagination } from "antd";
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
  // 假设主数据源为"users"
  const usersDS = dataSources.find((ds) => ds.key === "users");
  const users = usersDS?.data || [];
  const [current, setCurrent] = useState(1);
  const pageSize = 1; // 每页1个用户，可扩展
  const total = users.length;
  const currentUser = users[(current - 1) * pageSize];

  // 只渲染当前用户的所有控件
  return (
    <div
      style={{
        width: canvasConfig.width,
        height: canvasConfig.height,
        background: "#fff",
        position: "relative",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {currentUser &&
        components
          .filter((c) => c.visible !== false)
          .map((comp) => {
            const Comp = widgetMap[comp.type];
            if (!Comp) return null;
            // 如果是TableWidget，自动传递当前用户orders作为dataSource
            if (comp.type === "table") {
              return (
                <div
                  key={comp.id}
                  style={{
                    position: "absolute",
                    left: comp.x,
                    top: comp.y,
                    width: comp.width,
                    height: comp.height,
                    pointerEvents: "none",
                  }}
                >
                  <Comp
                    componentId={comp.id}
                    dataSource={currentUser.orders || []}
                  />
                </div>
              );
            }
            // 其它控件保持原props
            return (
              <div
                key={comp.id}
                style={{
                  position: "absolute",
                  left: comp.x,
                  top: comp.y,
                  width: comp.width,
                  height: comp.height,
                  pointerEvents: "none",
                }}
              >
                <Comp componentId={comp.id} user={currentUser} />
              </div>
            );
          })}
      {/* 分页控件 */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={setCurrent}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
