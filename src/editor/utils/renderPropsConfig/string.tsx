import { useVModel } from "@vueuse/core";
import { defineComponent } from "vue";

export default defineComponent({
  name: "booleanSwitch",
  emits: ["update:value"],
  props: {
    value: {
      type: String,
      default: false,
    },
    type: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    return () => (
      <>
        {!props.type ? (
          <a-input
            placeholder="请输入"
            v-model={[value.value, "value"]}
            allowClear
          />
        ) : (
          <a-textarea
            v-model={[value.value, "value"]}
            placeholder="请输入内容"
            allow-clear
          />
        )}
      </>
    );
  },
});
