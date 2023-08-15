import { useVModel } from "@vueuse/core";
import { defineComponent } from "vue";

export default defineComponent({
  name: "booleanSwitch",
  emits: ["update:value"],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    return () => <a-switch v-model={[value.value, "checked"]} />;
  },
});
