import { useVModel } from "@vueuse/core";
import { PropType, defineComponent } from "vue";

export default defineComponent({
  name: "pointSelect",
  emits: ["update:value"],
  props: {
    value: {
      type: String,
      default: false,
    },
    dataDictionary: {
      type: Array as PropType<Array<{ id: string; name: string }>>,
      default: [],
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    return () => (
      <a-select v-model:value={value.value}>
        {(props.dataDictionary || []).map((item) => (
          <a-select-option value={item.id}>{item.name}</a-select-option>
        ))}
      </a-select>
    );
  },
});
