import { defineComponent } from "vue";
import { createControlItemProps } from "./util";

const props = createControlItemProps(
  {
    pointName: {
      type: String,
      default: "",
      label: "控制点名称",
      state: "string",
    },
  },
  "卡片控制点Body",
  "controlPointBody"
);

export default defineComponent({
  name: "controlPointBody",
  props,
  setup(p, ctx) {
    const { Body } = ctx.slots;
    return () => (
      <div
        class={[
          "inl-card-control-item",
          `inl-card-control-item-${p.px}`,
          `inl-card-control-item-${p.py}`,
        ]}
      >
        {p.showLabel && <label>{p.title}：</label>}
        {Body?.()}
      </div>
    );
  },
});
