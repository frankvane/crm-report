import Canvas from "@report/ReportDesigner/components/Canvas/Canvas";
import ComponentLibrary from "@report/ReportDesigner/components/ComponentLibrary";
import PropertyPanel from "@report/ReportDesigner/components/PropertyPanel";
import React from "react";
import Toolbar from "@report/ReportDesigner/components/Toolbar";

// 主入口，三栏式布局骨架
const Designer: React.FC = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 顶部工具栏 */}
      <div
        style={{
          height: 48,
          borderBottom: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <Toolbar />
      </div>
      {/* 主体区域 */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* 左侧组件库 */}
        <div
          style={{
            width: 220,
            borderRight: "1px solid #eee",
            background: "#f7f8fa",
            overflow: "auto",
          }}
        >
          <ComponentLibrary />
        </div>
        {/* 中间画布区 */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Canvas />
        </div>
        {/* 右侧属性面板 */}
        <div
          style={{
            width: 300,
            borderLeft: "1px solid #eee",
            background: "#fafbfc",
            overflow: "auto",
          }}
        >
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};

export default Designer;
