import ComponentLibrary, {
  ComponentLibraryItem,
} from "./components/ComponentLibrary";
import { Layout, Typography } from "antd";

import { CANVAS_TEMPLATES } from "./constants";
import Canvas from "./components/Canvas";
import PropertyPanel from "./components/PropertyPanel";
import React from "react";
import Toolbar from "./components/Toolbar";
import { getComponentMeta } from "./componentRegistry";
import { useReportDesignerStore } from "@/store/reportDesignerStore";

const { Header } = Layout;
const { Title } = Typography;

const componentList: ComponentLibraryItem[] = [
  { type: "label", name: "标签", icon: "🏷️" },
  { type: "text", name: "文本", icon: "🔤" },
];

const ReportDesigner: React.FC = () => {
  // 只用zustand hooks获取全局状态
  const addComponent = useReportDesignerStore((state) => state.addComponent);
  const setSelectedIds = useReportDesignerStore(
    (state) => state.setSelectedIds
  );
  const [canvasSize, setCanvasSize] = React.useState(CANVAS_TEMPLATES[0]);

  // 拖拽新增组件
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: string
  ) => {
    e.dataTransfer.setData("type", type);
  };

  const handleDrop = (type: string, x: number, y: number) => {
    const meta = getComponentMeta(type);
    if (!meta) return;
    // 生成唯一id
    const id = `${type}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    addComponent({
      id,
      type: meta.type,
      name: meta.displayName || meta.type,
      icon: meta.icon || "",
      props: {
        ...meta.defaultBaseProps,
        ...meta.defaultCustomProps,
        x,
        y,
      },
    });
    setSelectedIds([id]);
  };

  // 组件移动
  const moveComponent = useReportDesignerStore((state) => state.moveComponent);
  const handleComponentMove = (id: string, x: number, y: number) => {
    moveComponent(id, x, y);
  };

  // 层级、锁定、显示等操作直接用zustand，不再传递

  return (
    <Layout style={{ height: "100vh", background: "#f5f6fa" }}>
      <Header
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <Title level={5} style={{ margin: 0, flex: 1 }}>
          报表设计器
        </Title>
        <select
          value={canvasSize.label}
          onChange={(e) => {
            const t = CANVAS_TEMPLATES.find((t) => t.label === e.target.value);
            if (t) setCanvasSize(t);
          }}
          style={{
            marginRight: 16,
            padding: "4px 12px",
            fontSize: 15,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
          }}
        >
          {CANVAS_TEMPLATES.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>
        <Toolbar />
      </Header>
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          minWidth: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        {/* 左侧栏 */}
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <ComponentLibrary
            components={componentList}
            onDragStart={handleDragStart}
          />
        </div>
        {/* 中间画布区 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            background: "#f5f6fa",
            height: canvasSize.height, // 保证外层高度与画布一致
          }}
        >
          <div
            style={{
              position: "relative",
              width: canvasSize.width,
              height: canvasSize.height, // 画布外层div高度与画布一致
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Canvas
              width={canvasSize.width}
              height={canvasSize.height}
              onDrop={handleDrop}
              onComponentMove={handleComponentMove}
            />
          </div>
        </div>
        {/* 右侧属性栏 */}
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <PropertyPanel />
        </div>
      </div>
    </Layout>
  );
};

export default ReportDesigner;
