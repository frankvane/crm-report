import type { CanvasComponent } from "../../types/index";
import { Form } from "@rjsf/antd";
import React from "react";
import TextComponent from "../../../components/TextComponent";
import { textComponentSchema } from "../../schemas/textComponentSchema";
import validator from "@rjsf/validator-ajv8";

// JSONPlaceholder 数据源列表
const API_SOURCES = [
  { label: "Posts", value: "posts" },
  { label: "Comments", value: "comments" },
  { label: "Albums", value: "albums" },
  { label: "Photos", value: "photos" },
  { label: "Todos", value: "todos" },
  { label: "Users", value: "users" },
];

// 数据源下拉 Widget
const DataSourceWidget = (props: any) => (
  <select
    value={props.value || ""}
    onChange={(e) => props.onChange(e.target.value)}
    style={{
      width: "100%",
      padding: 6,
      borderRadius: 4,
      border: "1px solid #d9d9d9",
    }}
  >
    <option value="">请选择数据源</option>
    {API_SOURCES.map((ds) => (
      <option key={ds.value} value={ds.value}>
        {ds.label}
      </option>
    ))}
  </select>
);

// 字段下拉 Widget（自动请求接口获取字段）
const FieldWidget = (props: any) => {
  const dataSource = props.formContext?.currentDataSource;
  const [fields, setFields] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (dataSource) {
      fetch(`https://jsonplaceholder.typicode.com/${dataSource}/1`)
        .then((res) => res.json())
        .then((data) => setFields(Object.keys(data || {})));
    } else {
      setFields([]);
    }
  }, [dataSource]);

  return (
    <select
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 6,
        borderRadius: 4,
        border: "1px solid #d9d9d9",
      }}
    >
      <option value="">请选择字段</option>
      {fields.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
};

// 表达式字段 Widget（带实时预览）
const ExpressionWidget = (props: any) => {
  return (
    <>
      <input
        type="text"
        value={props.value || ""}
        onChange={(e) => props.onChange(e.target.value)}
        style={{
          width: "100%",
          padding: 6,
          borderRadius: 4,
          border: "1px solid #d9d9d9",
        }}
      />
      {/* 只在表达式字段下方渲染预览 */}
      {props.options && props.options.preview}
    </>
  );
};

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | undefined;
  onChange: (formData: Partial<CanvasComponent>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onChange,
}) => {
  const [currentDataSource, setCurrentDataSource] = React.useState<
    string | undefined
  >(selectedComponent?.dataBinding?.source);

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

  const schema = textComponentSchema;

  // 解析 mockData 字符串为对象
  let mockDataObj: Record<string, unknown> | undefined = undefined;
  if (selectedComponent.mockData) {
    try {
      mockDataObj = JSON.parse(selectedComponent.mockData);
    } catch {
      mockDataObj = undefined;
    }
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
        mockData={mockDataObj}
      />
    </div>
  );

  // 处理表单变更，联动数据源和字段
  const handleFormChange = (formData: Partial<CanvasComponent>) => {
    if (formData.dataBinding?.source !== currentDataSource) {
      setCurrentDataSource(formData.dataBinding?.source);
    }
    onChange(formData);
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
        <Form
          schema={schema}
          formData={selectedComponent}
          onChange={(e) =>
            handleFormChange(e.formData as Partial<CanvasComponent>)
          }
          validator={validator}
          formContext={{ preview, currentDataSource }}
          uiSchema={{
            color: { "ui:widget": "color" },
            fontSize: { "ui:widget": "updown" },
            mockData: { "ui:widget": "textarea" },
            dataBinding: {
              source: { "ui:widget": DataSourceWidget },
              field: { "ui:widget": FieldWidget },
              expression: {
                "ui:widget": ExpressionWidget,
                "ui:options": { preview },
              },
            },
            "ui:options": { submitButtonOptions: { norender: true } },
          }}
          showErrorList={false}
        />
      </div>
    </div>
  );
};

export default PropertyPanel;
