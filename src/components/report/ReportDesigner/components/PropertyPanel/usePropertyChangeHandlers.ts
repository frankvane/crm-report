import { useCallback } from "react";
import { useComponentsStore } from "@report/ReportDesigner/store";

export function usePropertyChangeHandlers(selected: any) {
  const updateComponent = useComponentsStore((s) => s.updateComponent);

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
      if (key === "all") {
        // 批量更新 dataSource/columns/dataNode
        updateComponent(selected.id, {
          props: {
            ...selected.props,
            dataBinding: {
              ...selected.props.dataBinding,
              ...value,
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
