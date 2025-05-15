import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import DataSourceManager from "@/pages/DataSourceManager";
import React from "react";
import ReportDesignerPage from "@/pages/ReportDesigner";

// 其它页面import可按需添加

const Home: React.FC = () => (
  <div style={{ padding: 40 }}>
    <h2>报表平台 DEMO</h2>
    <div style={{ marginTop: 24, display: "flex", gap: 24 }}>
      <Link to="/report-designer">进入报表设计器</Link>
      <Link to="/data-source-manager">进入数据源管理</Link>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-source-manager" element={<DataSourceManager />} />
        <Route path="/report-designer" element={<ReportDesignerPage />} />
        {/* 其它页面路由 */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
