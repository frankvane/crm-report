import type { CanvasComponent } from "../../types/index";
import { Form } from "@rjsf/antd";
import React from "react";
import { textComponentSchema } from "../../schemas/textComponentSchema";
import validator from "@rjsf/validator-ajv8";

interface PropertyPanelProps {
  selectedComponent: CanvasComponent | undefined;
  onChange: (formData: Partial<CanvasComponent>) => void;
}

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

  // 这里只处理 text 类型，后续可根据 type 动态切换 schema
  const schema = textComponentSchema;

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
          uiSchema={{
            color: { "ui:widget": "color" },
            fontSize: { "ui:widget": "updown" },
            mockData: { "ui:widget": "textarea" },
          }}
        />
      </div>
    </div>
  );
};

export default PropertyPanel;
