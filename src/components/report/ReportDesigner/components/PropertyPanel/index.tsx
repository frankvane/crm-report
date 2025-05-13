import type { CanvasComponent } from "../../types/index";
import React from "react";
import { Tabs } from "antd";
import TextComponent from "../../../components/TextComponent";

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | undefined;
  onChange: (formData: Partial<CanvasComponent>) => void;
}

// JSONPlaceholder 数据源列表
const API_SOURCES = [
  { label: "Posts", value: "posts" },
  { label: "Comments", value: "comments" },
  { label: "Albums", value: "albums" },
  { label: "Photos", value: "photos" },
  { label: "Todos", value: "todos" },
  { label: "Users", value: "users" },
];

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onChange,
}) => {
  // 数据源状态
  const [currentDataSource, setCurrentDataSource] = React.useState<
    string | undefined
  >(selectedComponent?.dataBinding?.source);
  // 字段列表状态
  const [fields, setFields] = React.useState<string[]>([]);

  // 监听数据源变化，动态获取字段列表
  React.useEffect(() => {
    if (currentDataSource) {
      fetch(`https://jsonplaceholder.typicode.com/${currentDataSource}/1`)
        .then((res) => res.json())
        .then((data) => setFields(Object.keys(data || {})));
    } else {
      setFields([]);
    }
  }, [currentDataSource]);

  // 自动填充 mockData，随数据源和字段变化自动更新
  React.useEffect(() => {
    if (currentDataSource && selectedComponent) {
      fetch(`https://jsonplaceholder.typicode.com/${currentDataSource}/1`)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data === "object") {
            onChange({
              ...selectedComponent,
              mockData: JSON.stringify(data, null, 2),
            });
          }
        });
    }
    // eslint-disable-next-line
  }, [currentDataSource, selectedComponent?.dataBinding?.field]);

  if (!selectedComponent) {
    return (
      <div style={{ color: "#aaa", padding: 20 }}>
        请选择画布中的组件进行属性编辑
      </div>
    );
  }

  // 实时预览区块
  const preview = (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        background: "#f6f6f6",
        borderRadius: 6,
      }}
    >
      <div style={{ marginBottom: 6 }}>实时预览：</div>
      <TextComponent
        text={selectedComponent.text || ""}
        fontSize={selectedComponent.fontSize}
        color={selectedComponent.color}
        fontWeight={selectedComponent.fontWeight}
        textAlign={selectedComponent.textAlign}
        dataBinding={selectedComponent.dataBinding}
        mockData={
          selectedComponent.mockData
            ? JSON.parse(selectedComponent.mockData)
            : undefined
        }
      />
    </div>
  );

  // input样式复用
  const inputStyle = {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #d9d9d9",
    fontSize: 15,
  };

  // 基础属性表单内容
  const baseTab = {
    key: "base",
    label: "基础属性",
    children: (
      <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ color: "#666", fontSize: 14 }}>组件名称：</label>
        <input
          type="text"
          value={selectedComponent.name}
          onChange={(e) =>
            onChange({ ...selectedComponent, name: e.target.value })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>X 坐标：</label>
        <input
          type="number"
          value={selectedComponent.x}
          onChange={(e) =>
            onChange({ ...selectedComponent, x: Number(e.target.value) })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>Y 坐标：</label>
        <input
          type="number"
          value={selectedComponent.y}
          onChange={(e) =>
            onChange({ ...selectedComponent, y: Number(e.target.value) })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>宽度：</label>
        <input
          type="number"
          value={selectedComponent.width ?? 120}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              width: Number(e.target.value),
            })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>高度：</label>
        <input
          type="number"
          value={selectedComponent.height ?? 40}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              height: Number(e.target.value),
            })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>字体大小：</label>
        <input
          type="number"
          value={selectedComponent.fontSize || 14}
          min={10}
          max={100}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              fontSize: Number(e.target.value),
            })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>字体颜色：</label>
        <input
          type="color"
          value={selectedComponent.color || "#222222"}
          onChange={(e) =>
            onChange({ ...selectedComponent, color: e.target.value })
          }
          style={{
            width: 40,
            height: 32,
            border: "none",
            background: "none",
            padding: 0,
          }}
        />
        <label style={{ color: "#666", fontSize: 14 }}>字体粗细：</label>
        <select
          value={selectedComponent.fontWeight || "normal"}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              fontWeight: e.target.value as
                | "normal"
                | "bold"
                | "bolder"
                | "lighter",
            })
          }
          style={inputStyle}
        >
          <option value="normal">正常</option>
          <option value="bold">加粗</option>
          <option value="bolder">更粗</option>
          <option value="lighter">更细</option>
        </select>
        <label style={{ color: "#666", fontSize: 14 }}>对齐方式：</label>
        <select
          value={selectedComponent.textAlign || "left"}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              textAlign: e.target.value as "left" | "center" | "right",
            })
          }
          style={inputStyle}
        >
          <option value="left">左对齐</option>
          <option value="center">居中</option>
          <option value="right">右对齐</option>
        </select>
      </form>
    ),
  };

  // 数据属性表单内容
  const dataTab = {
    key: "data",
    label: "数据属性",
    children: (
      <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ color: "#666", fontSize: 14 }}>数据源：</label>
        <select
          value={selectedComponent.dataBinding?.source || ""}
          onChange={(e) => {
            setCurrentDataSource(e.target.value);
            onChange({
              ...selectedComponent,
              dataBinding: {
                ...selectedComponent.dataBinding,
                source: e.target.value,
                field: "", // 切换数据源时清空字段
              },
            });
          }}
          style={inputStyle}
        >
          <option value="">请选择数据源</option>
          {API_SOURCES.map((ds) => (
            <option key={ds.value} value={ds.value}>
              {ds.label}
            </option>
          ))}
        </select>
        <label style={{ color: "#666", fontSize: 14 }}>字段：</label>
        <select
          value={selectedComponent.dataBinding?.field || ""}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              dataBinding: {
                ...selectedComponent.dataBinding,
                field: e.target.value,
              },
            })
          }
          style={inputStyle}
        >
          <option value="">请选择字段</option>
          {fields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <label style={{ color: "#666", fontSize: 14 }}>格式化：</label>
        <select
          value={selectedComponent.dataBinding?.format || "none"}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              dataBinding: {
                ...selectedComponent.dataBinding,
                format: e.target.value as
                  | "none"
                  | "currency"
                  | "date"
                  | "percent",
              },
            })
          }
          style={inputStyle}
        >
          <option value="none">无</option>
          <option value="currency">金额</option>
          <option value="date">日期</option>
          <option value="percent">百分比</option>
        </select>
        <label style={{ color: "#666", fontSize: 14 }}>表达式：</label>
        <input
          type="text"
          value={selectedComponent.dataBinding?.expression || ""}
          onChange={(e) =>
            onChange({
              ...selectedComponent,
              dataBinding: {
                ...selectedComponent.dataBinding,
                expression: e.target.value,
              },
            })
          }
          style={inputStyle}
        />
        <label style={{ color: "#666", fontSize: 14 }}>Mock数据：</label>
        <textarea
          value={selectedComponent.mockData || ""}
          onChange={(e) =>
            onChange({ ...selectedComponent, mockData: e.target.value })
          }
          style={{
            width: "100%",
            minHeight: 60,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
            fontSize: 15,
            padding: 8,
          }}
        />
        {/* 实时预览区块 */}
        {preview}
      </form>
    ),
  };

  return (
    <div
      style={{
        width: 320,
        background: "#fafafa",
        borderLeft: "1px solid #f0f0f0",
        padding: 0,
      }}
    >
      <div style={{ padding: 20 }}>
        <Tabs defaultActiveKey="base" items={[baseTab, dataTab]} />
      </div>
    </div>
  );
};

export default PropertyPanel;
