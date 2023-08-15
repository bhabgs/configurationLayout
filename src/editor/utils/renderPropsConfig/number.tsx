import { useVModel } from "@vueuse/core";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "numberinput",
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
    dic: {
      type: Array as PropType<Array<{ id: string; name: string }>>,
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    const jsx = props.dic.map((item, index) => {
      return (
        <a-input-number
          placeholder={item.name}
          v-model={[value.value[index], "value"]}
          style="width: 100%"
        ></a-input-number>
      );
    });
    return () => (
      <>
        {props.type ? (
          <a-input-number
            placeholder="请输入"
            v-model={[value.value, "value"]}
            style="width: 100%"
          />
        ) : (
          { jsx }
        )}
      </>
    );
  },
});
