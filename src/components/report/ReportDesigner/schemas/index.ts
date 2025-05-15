// 只需导入所有schema文件，确保注册生效

import "./labelSchema";
import "./textSchema";

// 其它组件schema...

export * from "./schemaRegistry";

export * from "./baseSchema";
export * from "./labelSchema";
export * from "./textSchema";
export * from "./imageSchema";
export * from "./tableSchema";
