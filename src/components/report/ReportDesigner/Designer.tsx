import Canvas from "@report/ReportDesigner/components/Canvas/Canvas";
import ComponentLibrary from "@report/ReportDesigner/components/ComponentLibrary";
import { DndContext } from "@dnd-kit/core";
import { Layout } from "antd";
import PropertyPanel from "@report/ReportDesigner/components/PropertyPanel";
import React from "react";
import Toolbar from "@report/ReportDesigner/components/Toolbar";

const { Header, Sider, Content } = Layout;

// 主入口，三栏式布局骨架
const Designer: React.FC = () => (
  <DndContext>
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          background: "#fafafa",
          padding: 0,
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar />
      </Header>
      <Layout>
        <Sider
          width={220}
          style={{ background: "#f7f8fa", borderRight: "1px solid #eee" }}
        >
          <ComponentLibrary />
        </Sider>
        <Content style={{ background: "#fff", position: "relative" }}>
          <Canvas />
        </Content>
        <Sider
          width={300}
          style={{ background: "#fafbfc", borderLeft: "1px solid #eee" }}
        >
          <PropertyPanel />
        </Sider>
      </Layout>
    </Layout>
  </DndContext>
);

export default Designer;
