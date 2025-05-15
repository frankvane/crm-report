/**
 * 通用格式化函数
 * @param value 原始值
 * @param format 格式化类型（如 'number', 'date', 'percent', 'currency', 'custom:xxx' 等）
 */
export function formatValue(value: any, format?: string): any {
  if (!format) return value;
  if (value === undefined || value === null) return "";
  switch (format) {
    case "number":
      return Number(value).toLocaleString();
    case "percent":
      return (Number(value) * 100).toFixed(2) + "%";
    case "currency":
      return "￥" + Number(value).toFixed(2);
    case "date":
      // 简单日期格式化，实际可用 dayjs/moment 等库
      return new Date(value).toLocaleDateString();
    default:
      // 支持自定义格式，如 custom:prefix-xxx
      if (format.startsWith("custom:")) {
        return format.replace("custom:", "").replace("{value}", value);
      }
      return value;
  }
}
