import {
  basePropsSchema as labelBasePropsSchema,
  commonPropsSchema as labelCommonPropsSchema,
} from "../../schemas/labelComponentSchema";
import {
  basePropsSchema as textBasePropsSchema,
  commonPropsSchema as textCommonPropsSchema,
} from "../../schemas/textComponentSchema";

import React from "react";
import { registerComponent } from "../../componentRegistry";

export interface ComponentLibraryItem {
  type: string;
  name: string;
  icon: string;
}

interface ComponentLibraryProps {
  components: ComponentLibraryItem[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  components,
  onDragStart,
}) => {
  return (
    <div
      style={{
        width: 80,
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        padding: "16px 0",
      }}
    >
      {components.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
            cursor: "grab",
            userSelect: "none",
          }}
        >
          <span style={{ fontSize: 28 }}>{item.icon}</span>
          <span style={{ fontSize: 13, color: "#333", marginTop: 4 }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// 占位渲染组件
const LabelComponent: React.FC<any> = (props) => (
  <div style={{ border: "1px dashed #aaa", padding: 4 }}>
    {props.text || "标签"}
  </div>
);
const TextComponent: React.FC<any> = (props) => (
  <div style={{ border: "1px solid #aaa", padding: 4 }}>
    {props.text || "文本"}
  </div>
);

// 注册 label 组件
registerComponent({
  type: "label",
  displayName: "标签",
  icon: "🏷️",
  defaultBaseProps: {
    name: "标签",
    x: 0,
    y: 0,
    width: 100,
    height: 30,
    locked: false,
    visible: true,
  },
  defaultCustomProps: {
    text: "标签内容",
    color: "#333",
    fontSize: 14,
    fontWeight: "normal",
    background: "",
  },
  render: LabelComponent,
  propsSchema: {
    ...labelBasePropsSchema,
    properties: {
      ...labelBasePropsSchema.properties,
      ...labelCommonPropsSchema.properties,
    },
  },
});

// 注册 text 组件
registerComponent({
  type: "text",
  displayName: "文本",
  icon: "🔤",
  defaultBaseProps: {
    name: "文本",
    x: 0,
    y: 0,
    width: 120,
    height: 32,
    locked: false,
    visible: true,
  },
  defaultCustomProps: {
    text: "文本内容",
    color: "#222",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
  },
  render: TextComponent,
  propsSchema: {
    ...textBasePropsSchema,
    properties: {
      ...textBasePropsSchema.properties,
      ...textCommonPropsSchema.properties,
    },
  },
});

export default ComponentLibrary;
