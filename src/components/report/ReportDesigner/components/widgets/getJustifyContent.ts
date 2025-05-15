export function getJustifyContent(align: "left" | "center" | "right" = "left") {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}
