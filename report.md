非常明白你的需求！你希望对现有“报表设计器”项目进行**系统性、细致、全面的功能与架构梳理**，为后续0-1重构打下坚实基础。  
下面我将从**业务功能、技术架构、模块划分、数据流、核心交互、可扩展性、遗留问题与优化建议**等多个维度，进行全方位梳理。

---

# 一、业务功能全景梳理

## 1. 主要业务目标

- 提供一个可视化的报表设计平台，支持用户通过拖拽、编辑、组合组件，快速搭建个性化报表页面。
- 兼容主流低代码设计器的核心能力，满足实际业务场景的灵活扩展。

## 2. 已实现/规划的核心功能

| 功能模块       | 说明                                               |
| ---------- | ------------------------------------------------ |
| 组件库        | 左侧面板，展示可用的业务组件（如标签、文本），支持拖拽到画布。                  |
| 画布（Canvas） | 主编辑区，支持组件拖拽落盘、移动、缩放、排序、批量操作、辅助线、吸附、网格线、标尺等。      |
| 组件渲染       | 仅允许自定义的 LabelComponent、TextComponent，props 结构灵活。 |
| 组件选中/多选    | 支持单选、高亮、框选、批量选中。                                 |
| 组件操作       | 拖动、缩放、批量拖动、批量操作工具栏、层级调整、锁定/显示/隐藏、删除、复制等。         |
| 辅助线/吸附     | 拖动时自动吸附到网格或其他组件边缘，提升对齐效率。                        |
| 标尺/网格线     | 画布支持标尺、网格线，辅助布局。                                 |
| 右键菜单       | 支持常用操作（删除、复制、置顶、置底、锁定/解锁、显示/隐藏等）。                |
| 属性面板       | 选中组件后，右侧展示属性编辑面板（可扩展）。                           |
| 状态管理       | 全局 store（zustand），统一管理组件树、选中状态、批量操作等。            |
| 拖拽交互       | 全面采用 dnd-kit，极简、现代、可维护。                          |
| 事件与扩展      | 预留事件机制，便于后续扩展（如自定义事件、联动等）。                       |

---

# 二、技术架构与模块划分

## 1. 技术选型

- **前端框架**：React + TypeScript
- **拖拽交互**：dnd-kit（DndContext、useDraggable、useDroppable、SortableContext、modifiers）
- **状态管理**：zustand
- **UI/样式**：自定义样式，部分可集成 Ant Design（如属性面板、弹窗等）
- **构建工具**：Vite
- **类型管理**：TypeScript，props 结构宽松（Record<string, any>）

## 2. 目录结构建议（参考最佳实践）

```
src/
  components/
    report/
      ReportDesigner/
        Designer.tsx           // 主入口，DndContext 容器
        index.tsx              // 页面集成入口
        componentRegistry.ts   // 业务组件注册表
        components/
          Canvas/
            Canvas.tsx         // 画布主组件
            ComponentItem.tsx  // 单个组件的拖拽/渲染
            useContextMenu.ts  // 右键菜单 hook
          PropertyPanel/
            index.tsx          // 属性面板
          ContextMenu/
            index.tsx          // 右键菜单
          Toolbar/
            index.tsx          // 工具栏
          ComponentLibrary/
            index.tsx          // 组件库
        hooks/
          useCanvasComponents.ts // 画布组件相关 hook
        constants/
        types/
        utils/
```

## 3. 主要模块职责

- **Designer.tsx**：顶层容器，负责拖拽、吸附、排序、批量操作等主交互逻辑。
- **Canvas.tsx**：画布区，负责组件渲染、布局、辅助线、网格线等。
- **ComponentItem.tsx**：单个业务组件的拖拽、渲染、选中高亮。
- **ComponentLibrary**：左侧组件库，支持拖拽。
- **PropertyPanel**：右侧属性面板，动态渲染选中组件的属性表单。
- **ContextMenu**：右键菜单，支持常用操作。
- **Toolbar**：顶部/批量操作工具栏，包括各种对齐、锁定、隐藏等。
- **zustand store**：全局状态管理，组件树、选中、批量操作等。

---

### 工具栏功能描述

1. **显示全部**
   
   - 显示所有被隐藏的元素（`<EyeOutlined />`）。

2. **删除选中**
   
   - 删除当前选中的元素，只有在选中元素大于0时才可使用（`<DeleteOutlined />`）。

3. **对齐功能**
   
   - **左对齐**：将选中的元素水平对齐到最左侧（`<AlignLeftOutlined />`）。
   
   - **右对齐**：将选中的元素水平对齐到最右侧（`<AlignRightOutlined />`）。
   
   - **顶部对齐**：将选中的元素垂直对齐到最上面（`<VerticalAlignTopOutlined />`）。
   
   - **底部对齐**：将选中的元素垂直对齐到底部（`<VerticalAlignBottomOutlined />`）。
   
   - **水平居中**：将选中的元素在水平方向上居中对齐（`<AlignCenterOutlined />`）。
   
   - **垂直居中**：将选中的元素在垂直方向上居中对齐（`<ColumnWidthOutlined />`）。

4. **分布功能**
   
   - **水平分布**：在水平方向上均匀分布选中的元素（`<ColumnWidthOutlined />`）。
   
   - **垂直分布**：在垂直方向上均匀分布选中的元素（`<ColumnHeightOutlined />`）。

5. **批量锁定与解锁**
   
   - **批量锁定**：将选中的元素锁定，禁止其被修改或拖动（`<LockOutlined />`）。
   
   - **批量解锁**：解锁选中的元素，允许修改或拖动（`<UnlockOutlined />`）。

6. **批量隐藏与显示**
   
   - **批量隐藏**：将选中的元素隐藏（`<EyeInvisibleOutlined />`）。
   
   - **批量显示**：显示被隐藏的选中元素（`<EyeOutlined />`）。

7. 画布控制
   
   - 网格大小控制
   
   - 是否吸附网格
   
   ```jsx
   import {
     DndContext,
     DragOverlay,
     PointerSensor,
     useDraggable,
     useSensor,
     useSensors,
   } from "@dnd-kit/core";
   import React, { useState } from "react";
   
   import { CSS } from "@dnd-kit/utilities";
   import { restrictToParentElement } from "@dnd-kit/modifiers";
   
   // 可拖动方块组件
   function DraggableBox({ id, position, size }) {
     const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
   
     return (
       <div
         ref={setNodeRef}
         style={{
           position: "absolute",
           left: position.x,
           top: position.y,
           width: size,
           height: size,
           backgroundColor: "#4caf50",
           borderRadius: 4,
           transform: CSS.Translate.toString(transform),
           cursor: "grab",
         }}
         {...listeners}
         {...attributes}
       />
     );
   }
   
   function App() {
     const [gridSize, setGridSize] = useState(30);
     const [strictMode, setStrictMode] = useState(true);
     const [position, setPosition] = useState({ x: 60, y: 60 });
     const [isDragging, setIsDragging] = useState(false);
   
     const boxSize = gridSize * 2;
   
     const sensors = useSensors(
       useSensor(PointerSensor, {
         activationConstraint: { distance: 8 },
       })
     );
   
     const handleDragStart = () => {
       setIsDragging(true);
     };
   
     const handleDragEnd = (event) => {
       const { delta } = event;
   
       if (strictMode) {
         setPosition((prev) => {
           const nextX = prev.x + delta.x;
           const nextY = prev.y + delta.y;
           const snappedX = Math.round(nextX / gridSize) * gridSize;
           const snappedY = Math.round(nextY / gridSize) * gridSize;
   
           return {
             x: Math.max(0, Math.min(snappedX, 400 - boxSize)),
             y: Math.max(0, Math.min(snappedY, 300 - boxSize)),
           };
         });
       } else {
         setPosition((prev) => ({
           x: Math.max(0, Math.min(prev.x + delta.x, 400 - boxSize)),
           y: Math.max(0, Math.min(prev.y + delta.y, 300 - boxSize)),
         }));
       }
   
       setIsDragging(false);
     };
   
     return (
       <>
         <div style={{ padding: 20 }}>
           <label>
             Grid Size: {gridSize}px{" "}
             <input
               type="range"
               min="10"
               max="50"
               value={gridSize}
               onChange={(e) => setGridSize(Number(e.target.value))}
             />
           </label>
           <label style={{ marginLeft: 20 }}>
             <input
               type="checkbox"
               checked={strictMode}
               onChange={(e) => setStrictMode(e.target.checked)}
             />
             Strict Snap to Grid
           </label>
         </div>
   
         <DndContext
           sensors={sensors}
           modifiers={[restrictToParentElement]}
           onDragStart={handleDragStart}
           onDragEnd={handleDragEnd}
         >
           <div
             style={{
               width: 400,
               height: 300,
               position: "relative",
               border: "2px solid #333",
               margin: "20px auto",
               backgroundColor: "#f0f0f0",
               backgroundImage: `
                 linear-gradient(to right, #ccc 1px, transparent 1px),
                 linear-gradient(to bottom, #ccc 1px, transparent 1px)
               `,
               backgroundSize: `${gridSize}px ${gridSize}px`,
               overflow: "hidden",
             }}
           >
             <DraggableBox id="box" position={position} size={boxSize} />
             <DragOverlay>
               {isDragging && (
                 <div
                   style={{
                     width: boxSize,
                     height: boxSize,
                     backgroundColor: "#4caf50",
                     borderRadius: 4,
                     opacity: 0.8,
                   }}
                 />
               )}
             </DragOverlay>
           </div>
         </DndContext>
       </>
     );
   }
   
   export default App;
   
   ```
   
   
   
   

# 三、数据流与状态管理

## 1. 组件树结构

```ts
interface ReportComponent {
  id: string;
  type: string; // 支持更多类型
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
  visible: boolean;
  zindex: number;
  props: Record<string, any>;
  parentId?: string | null;
  children?: string[];
  name?: string;
  groupId?: string | null;
  selected?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  rotatable?: boolean;
  rotation?: number;
  opacity?: number;
  style?: Record<string, any>;
  createdAt?: number | string;
  updatedAt?: number | string;
  meta?: Record<string, any>;
}
```

- 所有组件信息存储于全局 store，便于统一管理和批量操作。

## 2. 状态管理（zustand）

- 组件列表（components）
- 选中组件（selectedIds）
- 批量操作状态
- 画布配置（如 gridSize、辅助线开关等）

---

# 四、核心交互与功能实现

## 1. 拖拽与吸附

- 组件库拖拽到画布，自动生成新组件并落盘。
- 画布内组件支持拖动、排序、批量拖动。
- 拖动时自动吸附到网格或其他组件边缘（辅助线）。

## 2. 选中与批量操作

- 单选/多选/框选，支持批量拖动、批量对齐、批量删除等。
- 选中组件高亮，支持 shift/ctrl 多选。

## 3. 层级与显示控制

- 支持组件层级调整（置顶/置底/上移/下移）。
- 支持锁定、显示/隐藏组件。

## 4. 右键菜单与快捷操作

- 右键弹出菜单，支持常用操作（删除、复制、锁定、显示/隐藏、层级调整等）。

## 5. 属性面板

- 选中组件后，右侧动态渲染属性表单，支持实时编辑 props。

## 6. 辅助线、网格线、标尺

- 画布支持辅助线、网格线、标尺，提升布局效率。

---

# 五、可扩展性与最佳实践

## 1. 组件注册与动态渲染

- 通过 componentRegistry 统一注册业务组件，渲染时动态 import 并 props 透传，便于后续扩展新组件。

## 2. 类型与兼容性

- 组件 props 结构宽松，兼容不同业务属性，便于后续扩展。

## 3. 事件机制

- 预留事件机制，支持自定义事件、组件间联动等高级功能。

## 4. 代码组织

- 遵循单一职责、KISS、DRY、SOLID 原则，所有模块职责清晰，便于维护和扩展。

---

# 六、遗留问题与优化建议

1. **类型宽松但需规范**：虽然 props 采用 Record<string, any>，但建议为每个业务组件 props 定义类型接口，提升可维护性。
2. **属性面板可扩展**：引入 schema 驱动的属性面板，支持更多组件和属性类型。
3. **性能优化**：大规模组件渲染时可引入虚拟化、分层渲染等技术。

---

# 七、重构建议与0-1搭建路线

1. **先搭建基础架构**：Designer 容器 + Canvas 画布 + 组件库 + 状态管理
2. **实现核心交互**：拖拽落盘、组件渲染、选中/多选、拖动/排序
3. **补全主流能力**：辅助线、吸附、批量操作、层级调整、锁定/显示/隐藏、右键菜单
4. **完善属性面板**：动态渲染、实时编辑

---

## 总结

- 以上为报表设计器项目的系统性、细致、全面梳理。
- 你可以据此进行0-1重构，确保架构清晰、功能完备、易于扩展。
- 如需详细的模块设计文档、代码模板、重构分步计划，或某一功能的详细实现方案，请随时告知！

**准备好重构时，建议先确定目录结构和核心数据结构，再逐步实现主干功能。**  
如需“重构起步模板”或“详细开发计划”，请直接说明！


