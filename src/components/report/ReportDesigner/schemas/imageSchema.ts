import { baseSchema } from "./baseSchema";
import { registerComponentSchema } from "./schemaRegistry";

const imageSchema = {
  base: baseSchema,
  standard: [
    { key: "src", label: "图片地址", type: "input" },
    { key: "width", label: "宽度", type: "number" },
    { key: "height", label: "高度", type: "number" },
    { key: "alt", label: "替代文本", type: "input" },
  ],
  dataBinding: [],
};

registerComponentSchema("image", imageSchema);

export default imageSchema;
