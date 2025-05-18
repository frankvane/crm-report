// 工具栏组件

import {
  Button,
  Input,
  InputNumber,
  List,
  Modal,
  Select,
  Switch,
  message,
} from "antd";
import {
  FolderOpenOutlined,
  PlusOutlined,
  PrinterOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import React, { useRef, useState } from "react";
import {
  useCanvasStore,
  useComponentsStore,
  useDataSourceStore,
} from "@report/ReportDesigner/store";

import PrintPreview from "../PrintPreview";
import PrintPreviewModal from "../PrintPreviewModal";
import { defaultConfig } from "@report/ReportDesigner/store/canvasStore";
import { initialDataSources } from "@report/ReportDesigner/store/dataSourceStore";

const CANVAS_SIZES = [
  { label: "A4横向", value: "A4-landscape", width: 1123, height: 794 },
  { label: "A4纵向", value: "A4-portrait", width: 794, height: 1123 },
  { label: "16:9", value: "16-9", width: 1280, height: 720 },
  { label: "4:3", value: "4-3", width: 1024, height: 768 },
];

export default function Toolbar() {
  const canvasConfig = useCanvasStore((s) => s.canvasConfig);
  const setCanvasConfig = useCanvasStore((s) => s.setCanvasConfig);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportList, setReportList] = useState<{ name: string; data: any }[]>(
    []
  );
  const inputRef = useRef<any>(null);

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

  const setComponents = useComponentsStore((s) => s.setComponents);
  const setDataSources = (dataSources: any[]) => {
    useDataSourceStore.setState({ dataSources });
  };

  const handleSaveReport = () => {
    setSaveModalVisible(true);
    setReportName("");
    const list = JSON.parse(localStorage.getItem("reportDesignList") || "[]");
    setReportList(list);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const doSaveReport = () => {
    if (!reportName.trim()) {
      message.warning("请输入报表名称");
      return;
    }
    const reportData = {
      components: useComponentsStore.getState().components,
      canvasConfig: useCanvasStore.getState().canvasConfig,
      dataSources: useDataSourceStore.getState().dataSources,
    };
    const list = JSON.parse(localStorage.getItem("reportDesignList") || "[]");
    const idx = list.findIndex((item: any) => item.name === reportName);
    if (idx > -1) {
      Modal.confirm({
        title: "报表已存在，是否覆盖？",
        onOk: () => {
          list[idx].data = reportData;
          localStorage.setItem("reportDesignList", JSON.stringify(list));
          setSaveModalVisible(false);
          message.success("报表已覆盖保存");
        },
      });
      return;
    }
    list.push({ name: reportName, data: reportData });
    localStorage.setItem("reportDesignList", JSON.stringify(list));
    setSaveModalVisible(false);
    message.success("报表已保存");
  };

  const handleOpenReport = () => {
    setOpenModalVisible(true);
    const list = JSON.parse(localStorage.getItem("reportDesignList") || "[]");
    setReportList(list);
  };

  const doOpenReport = (item: { name: string; data: any }) => {
    setComponents(item.data.components || []);
    setCanvasConfig(item.data.canvasConfig || {});
    setDataSources(item.data.dataSources || []);
    setOpenModalVisible(false);
    message.success(`已打开报表：${item.name}`);
  };

  // 新建报表
  const handleNewReport = () => {
    Modal.confirm({
      title: "新建报表",
      content: "确定要新建报表吗？当前内容将被清空，无法恢复。",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setComponents([]);
        setCanvasConfig({ ...defaultConfig });
        setDataSources([...initialDataSources]);
        message.success("已新建空白报表");
      },
    });
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

        <div style={{ flex: 1 }} />
        {/* 新建按钮 */}
        <Button
          icon={<PlusOutlined />}
          onClick={handleNewReport}
          style={{ marginRight: 8 }}
        >
          新建
        </Button>
        {/* 保存按钮 */}
        <Button
          icon={<SaveOutlined />}
          onClick={handleSaveReport}
          style={{ marginLeft: 8 }}
        >
          保存
        </Button>
        <Button
          icon={<FolderOpenOutlined />}
          onClick={handleOpenReport}
          style={{ marginLeft: 8 }}
        >
          打开
        </Button>
        {/* 打印预览按钮 */}
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
      <Modal
        title="保存报表"
        open={saveModalVisible}
        onOk={doSaveReport}
        onCancel={() => setSaveModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Input
          ref={inputRef}
          placeholder="请输入报表名称"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          onPressEnter={doSaveReport}
        />
        {reportList.length > 0 && (
          <div style={{ marginTop: 12, color: "#888", fontSize: 12 }}>
            已有报表：{reportList.map((r) => r.name).join("、")}
          </div>
        )}
      </Modal>
      <Modal
        title="打开报表"
        open={openModalVisible}
        onCancel={() => setOpenModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={reportList}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => doOpenReport(item)}
            >
              {item.name}
            </List.Item>
          )}
          locale={{ emptyText: "暂无已保存报表" }}
        />
      </Modal>
    </>
  );
}
