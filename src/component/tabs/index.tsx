// 引入vue
import { defineComponent, PropType, ref } from "vue";
// 定义 TabItem 类型
export type TabItem = {
  name: string | number;
  id: string;
  disabled?: boolean;
};

// 创建 tabs 的 props
export const tabsProps = {
  tabs: {
    type: Array as PropType<TabItem[]>,
    default: () => [],
  },
  // 选项卡的类型
  type: {
    type: String as PropType<"card" | "border-card">,
    default: "card",
  },
  // 选项卡的大小
  size: {
    type: String as PropType<"large" | "small" | "default">,
    default: "small",
  },
  // 选项卡的激活索引
  active: {
    type: String,
  },
  // 选项卡的方向
  direction: {
    type: String as PropType<"horizontal" | "vertical">,
    default: "horizontal",
  },

  // 选项卡状态
  state: {
    type: String as PropType<"editable-card" | "line">,
    default: "editor",
  },

  // 选项卡位置
  position: {
    type: String as PropType<"top" | "right" | "bottom" | "left">,
    default: "top",
  },
};

// 创建card默认组件
const Tabs = defineComponent({
  name: "Tabs",
  emits: ["update:active", "removeItem", "addItem", "change"],
  props: tabsProps,
  setup(props, ctx) {
    const active = ref();
    if (props.tabs.length > 0) {
      active.value = props.tabs[0].id;
      ctx.emit("change", props.tabs[0]);
    }
    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === "add") {
        ctx.emit("addItem", targetKey);
      } else {
        ctx.emit("removeItem", targetKey);
      }
    };

    return () => (
      <>
        <a-tabs
          class="inl-card-tabs"
          v-model:activeKey={active.value}
          tab-position={props.position}
          type={props.state}
          size={props.size}
          onEdit={onEdit}
          onChange={(e) => {
            for (let i of props.tabs) {
              if (i.id == e) {
                ctx.emit("change", i);
              }
            }
          }}
        >
          {props.tabs.map((it) => {
            return <a-tab-pane key={it.id} tab={it.name}></a-tab-pane>;
          })}
        </a-tabs>
      </>
    );
  },
});

export default Tabs;
