export function formatLabelValue(
  value: any,
  dataBinding: any,
  numeral: any,
  dayjs: any
) {
  let displayText = value;
  const format = dataBinding?.format;
  const pattern = dataBinding?.formatPattern;
  if (displayText !== undefined && displayText !== null) {
    if (format === "number" && pattern && !isNaN(Number(displayText))) {
      displayText = numeral(displayText).format(pattern);
    } else if (format === "percent") {
      if (pattern && pattern.includes("%")) {
        displayText = numeral(displayText).format(pattern);
      } else {
        const num = Number(displayText);
        if (!isNaN(num)) {
          displayText =
            (num * 100).toFixed(
              pattern ? parseInt(pattern.replace(/[^0-9]/g, "")) || 0 : 2
            ) + "%";
        }
      }
    } else if (format === "currency") {
      const symbol = pattern && pattern.includes("$") ? "$" : "￥";
      if (pattern) {
        displayText =
          symbol + numeral(displayText).format(pattern.replace(/^[￥$]/, ""));
      } else {
        displayText = symbol + numeral(displayText).format("0,0.00");
      }
    } else if (format === "date" && pattern) {
      displayText = dayjs(displayText).format(pattern);
    } else if (format === "custom" && dataBinding?.customFormat) {
      try {
        const custom = dataBinding.customFormat.trim();
        let fn;
        if (custom.startsWith("function") || custom.startsWith("value =>")) {
          // eslint-disable-next-line no-eval
          fn = eval("(" + custom + ")");
        } else {
          // eslint-disable-next-line no-new-func
          fn = new Function("value", "return " + custom + ";");
        }
        displayText = fn(displayText);
      } catch {
        // 格式化失败，显示原始内容
      }
    }
  }
  return displayText;
}
