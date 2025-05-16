// 工具栏组件

import { Button, InputNumber, Select, Switch } from "antd";
import React, { useState } from "react";

import PrintPreview from "../PrintPreview";
import PrintPreviewModal from "../PrintPreviewModal";
import { PrinterOutlined } from "@ant-design/icons";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

const CANVAS_SIZES = [
  { label: "A4横向", value: "A4-landscape", width: 1123, height: 794 },
  { label: "A4纵向", value: "A4-portrait", width: 794, height: 1123 },
  { label: "16:9", value: "16-9", width: 1280, height: 720 },
  { label: "4:3", value: "4-3", width: 1024, height: 768 },
];

export default function Toolbar() {
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);
  const setCanvasConfig = useReportDesignerStore((s) => s.setCanvasConfig);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleSizeChange = (value: string) => {
    const size = CANVAS_SIZES.find((s) => s.value === value);
    if (size) {
      setCanvasConfig({
        width: size.width,
        height: size.height,
        sizeType: size.value,
      });
    }
  };

  const handleGridSwitch = (checked: boolean) => {
    setCanvasConfig({ showGrid: checked });
  };

  const handleRulerSwitch = (checked: boolean) => {
    setCanvasConfig({ showRuler: checked });
  };

  const handleGridSizeChange = (value: number | null) => {
    if (typeof value === "number") {
      setCanvasConfig({ gridSize: value });
    }
  };

  const handleSnapSwitch = (checked: boolean) => {
    setCanvasConfig({ allowSnapToGrid: checked });
  };

  return (
    <>
      <div
        style={{
          padding: 12,
          fontWeight: 600,
          color: "#f57c00",
          background: "#fff3e0",
          border: "2px solid #f57c00",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span>工具栏</span>
        <span style={{ fontWeight: 400, color: "#888" }}>| 画布尺寸：</span>
        <Select
          value={canvasConfig.sizeType}
          style={{ width: 140 }}
          onChange={handleSizeChange}
          options={CANVAS_SIZES.map((s) => ({
            label: s.label,
            value: s.value,
          }))}
        />
        <span style={{ fontWeight: 400, color: "#888" }}>| 网格：</span>
        <Switch
          checked={canvasConfig.showGrid}
          onChange={handleGridSwitch}
          size="small"
        />
        <span style={{ fontWeight: 400, color: "#888" }}>间距</span>
        <InputNumber
          min={5}
          max={200}
          step={1}
          value={canvasConfig.gridSize}
          onChange={handleGridSizeChange}
          style={{ width: 60 }}
          size="small"
        />
        <span style={{ fontWeight: 400, color: "#888" }}>| 标尺：</span>
        <Switch
          checked={canvasConfig.showRuler}
          onChange={handleRulerSwitch}
          size="small"
        />
        <span style={{ fontWeight: 400, color: "#888" }}>| 吸附网格：</span>
        <Switch
          checked={canvasConfig.allowSnapToGrid}
          onChange={handleSnapSwitch}
          size="small"
        />
        {/* 打印预览按钮 */}
        <div style={{ flex: 1 }} />
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => setPreviewVisible(true)}
        >
          打印预览
        </Button>
      </div>
      <PrintPreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      >
        <PrintPreview />
      </PrintPreviewModal>
    </>
  );
}
