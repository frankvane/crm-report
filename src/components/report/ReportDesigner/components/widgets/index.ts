import { ImageWidgetMeta } from "./ImageWidget";
import { LabelWidgetMeta } from "./LabelWidget";
import { QRCodeWidgetMeta } from "./QRCodeWidget";
import { TableWidgetMeta } from "./TableWidget";
import { registerComponent } from "../../componentRegistry";

[TableWidgetMeta, LabelWidgetMeta, ImageWidgetMeta, QRCodeWidgetMeta].forEach(
  registerComponent
);
