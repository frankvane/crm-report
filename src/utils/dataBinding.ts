import { formatValue } from "./format";

/**
 * 通用数据绑定渲染函数
 * @param value 原始值（如 text、cell value 等）
 * @param dataBinding 数据绑定配置（包含 format、expression、sample 等）
 * @param row 当前行数据（表格等场景）
 * @param index 当前索引（表格等场景）
 */
export function getDisplayValue({
  value,
  dataBinding,
  row,
  index,
}: {
  value: any;
  dataBinding?: {
    format?: string;
    expression?: string;
    sample?: any;
    [key: string]: any;
  };
  row?: any;
  index?: number;
}) {
  let displayValue = value ?? dataBinding?.sample;
  // 1. 表达式优先
  if (dataBinding?.expression) {
    try {
      displayValue = new Function(
        "value",
        "row",
        "index",
        `return ${dataBinding.expression}`
      )(displayValue, row, index);
    } catch {
      displayValue = "表达式错误";
    }
  }
  // 2. 格式化
  else if (dataBinding?.format) {
    displayValue = formatValue(displayValue, dataBinding.format);
  }
  // 3. 模拟数据兜底
  else if (displayValue === undefined && dataBinding?.sample !== undefined) {
    displayValue = dataBinding.sample;
  }
  return displayValue;
}
