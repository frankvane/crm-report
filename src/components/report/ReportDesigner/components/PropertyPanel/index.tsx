// 属性面板组件

import React, { useMemo } from "react";
import {
  useComponentsStore,
  useSelectionStore,
} from "@report/ReportDesigner/store";

import BasePropertyPanel from "./BasePropertyPanel";
import DataBindingPanel from "./DataBindingPanel";
import StandardPropertyPanel from "./StandardPropertyPanel";
import { Tabs } from "antd";
import { getComponentSchema } from "@report/ReportDesigner/schemas";
import { useDataSourceStore } from "@report/ReportDesigner/store/dataSourceStore";
import { usePropertyChangeHandlers } from "./usePropertyChangeHandlers";

export default function PropertyPanel() {
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const components = useComponentsStore((s) => s.components);
  const dataSources = useDataSourceStore((s) => s.dataSources);

  const selected = useMemo(
    () => components.find((c) => selectedIds[0] === c.id),
    [components, selectedIds]
  );
  const schema = useMemo(
    () =>
      getComponentSchema(selected?.type || "") || {
        base: [],
        standard: [],
        dataBinding: [],
      },
    [selected]
  );

  // 判断是否可旋转
  const isRotatable = !!selected?.rotatable;

  const { handleBaseChange, handleStandardChange, handleDataBindingChange } =
    usePropertyChangeHandlers(selected);

  if (!selected) {
    return (
      <div
        style={{
          padding: 16,
          fontWeight: 600,
          color: "#388e3c",
          background: "#e8f5e9",
          border: "2px solid #388e3c",
          borderRadius: 6,
        }}
      >
        请选择画布上的组件
      </div>
    );
  }

  return (
    <div style={{ padding: 16, overflowY: "auto", maxHeight: "100vh" }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>属性面板</div>
      <Tabs
        defaultActiveKey="base"
        size="small"
        style={{ background: "#fff" }}
        items={[
          {
            key: "base",
            label: "基础属性",
            children: (
              <BasePropertyPanel
                schema={schema}
                selected={selected}
                isRotatable={isRotatable}
                handleBaseChange={handleBaseChange}
              />
            ),
          },
          {
            key: "standard",
            label: "标准属性",
            children: (
              <StandardPropertyPanel
                schema={schema}
                selected={selected}
                handleStandardChange={handleStandardChange}
              />
            ),
          },
          {
            key: "dataBinding",
            label: "数据绑定",
            children: (
              <DataBindingPanel
                schema={schema}
                selected={selected}
                dataSources={dataSources}
                handleDataBindingChange={handleDataBindingChange}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
