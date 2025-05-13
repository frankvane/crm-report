import type { CanvasComponent } from "../../types/index";
import { Form } from "@rjsf/antd";
import React from "react";
import TextComponent from "../../../components/TextComponent";
import { textComponentSchema } from "../../schemas/textComponentSchema";
import validator from "@rjsf/validator-ajv8";

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | undefined;
  onChange: (formData: Partial<CanvasComponent>) => void;
}

// 自定义表达式字段 Widget，渲染实时预览区块
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

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onChange,
}) => {
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
      <div style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>
        实时预览：
      </div>
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
          onChange={(e) => onChange(e.formData as Partial<CanvasComponent>)}
          validator={validator}
          formContext={{ preview }}
          uiSchema={{
            color: { "ui:widget": "color" },
            fontSize: { "ui:widget": "updown" },
            mockData: { "ui:widget": "textarea" },
            dataBinding: {
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
