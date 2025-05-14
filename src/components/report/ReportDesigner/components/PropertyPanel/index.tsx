// 属性面板组件

import { Input } from "antd";
import React from "react";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

export default function PropertyPanel() {
  const selectedIds = useReportDesignerStore((s) => s.selectedIds);
  const components = useReportDesignerStore((s) => s.components);
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);

  const selected = components.find((c) => selectedIds[0] === c.id);

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
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>属性面板</div>
      <div style={{ marginBottom: 8 }}>类型：{selected.type}</div>
      <div style={{ marginBottom: 8 }}>
        <span>文本内容：</span>
        <Input
          value={selected.props.text}
          onChange={(e) =>
            updateComponent(selected.id, {
              props: { ...selected.props, text: e.target.value },
            })
          }
          style={{ width: 180 }}
        />
      </div>
      {/* 可扩展更多属性 */}
    </div>
  );
}
