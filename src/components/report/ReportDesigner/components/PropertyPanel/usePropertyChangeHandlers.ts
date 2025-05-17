import { useCallback } from "react";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

export function usePropertyChangeHandlers(selected: any) {
  const updateComponent = useReportDesignerStore((s) => s.updateComponent);

  // 处理主属性（baseSchema）
  const handleBaseChange = useCallback(
    (key: string, value: any) => {
      if (!selected) return;
      updateComponent(selected.id, { [key]: value });
    },
    [selected, updateComponent]
  );

  // 处理标准属性（props）
  const handleStandardChange = useCallback(
    (key: string, value: any) => {
      if (!selected) return;
      updateComponent(selected.id, {
        props: { ...selected.props, [key]: value },
      });
    },
    [selected, updateComponent]
  );

  // 处理数据绑定属性（props.dataBinding）
  const handleDataBindingChange = useCallback(
    (key: string, value: any) => {
      if (!selected) return;
      console.log("[handleDataBindingChange]", key, value, selected);
      if (key === "dataNodeAndColumns") {
        updateComponent(selected.id, {
          props: {
            ...selected.props,
            dataBinding: {
              ...selected.props.dataBinding,
              dataNode: value.dataNode,
              columns: value.columns,
            },
          },
        });
        return;
      }
      updateComponent(selected.id, {
        props: {
          ...selected.props,
          dataBinding: { ...selected.props.dataBinding, [key]: value },
        },
      });
    },
    [selected, updateComponent]
  );

  return { handleBaseChange, handleStandardChange, handleDataBindingChange };
}
