import { defineComponent, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import ColorChoose from "@/component/ColorPicker";

export default defineComponent({
  name: "boxShadow",
  emits: ["update:value"],
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    const form = ref({
      inset: false,
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      spread: 0,
      color: "",
    });

    const buildForm = () => {
      if (value.value) {
        const values = value.value.split(" ");
        if (values[0] === "inset") {
          form.value.inset = true;
          values.unshift();
        }
        form.value.offsetX = parseInt(values[0]);
        form.value.offsetY = parseInt(values[1]);
        form.value.blur = parseInt(values[2]);
        form.value.spread = parseInt(values[3]);
        form.value.color = values[4];
      }
    };
    watch(value, buildForm, { immediate: true });

    watch(
      form,
      () => {
        value.value = `${form.value.inset ? "inset " : ""}${
          form.value.offsetX
        }px ${form.value.offsetY}px ${form.value.blur}px ${
          form.value.spread
        }px ${form.value.color}`;
      },
      { deep: true }
    );

    const visible = ref(false);

    return () => (
      <>
        <a-button onClick={() => (visible.value = true)}>编辑</a-button>
        <a-modal
          title="配置阴影"
          maskClosable={false}
          cancelButtonProps={{ style: { display: "none" } }}
          onOk={() => (visible.value = false)}
          v-model:visible={visible.value}
        >
          <a-form model={form.value} labelCol={{ style: { width: "6em" } }}>
            <a-form-item label="内部" name="inset">
              <a-switch v-model:checked={form.value.inset}></a-switch>
            </a-form-item>
            <a-form-item label="横向偏移" name="offsetX">
              <a-input-number
                addonAfter="px"
                v-model:value={form.value.offsetX}
              ></a-input-number>
            </a-form-item>
            <a-form-item label="纵向偏移" name="offsetY">
              <a-input-number
                addonAfter="px"
                v-model:value={form.value.offsetY}
              ></a-input-number>
            </a-form-item>
            <a-form-item label="模糊" name="blur">
              <a-input-number
                addonAfter="px"
                v-model:value={form.value.blur}
              ></a-input-number>
            </a-form-item>
            <a-form-item label="延伸" name="spread">
              <a-input-number
                addonAfter="px"
                v-model:value={form.value.spread}
              ></a-input-number>
            </a-form-item>
            <a-form-item label="颜色" name="color">
              <ColorChoose v-model:color={form.value.color} />
            </a-form-item>
          </a-form>
        </a-modal>
      </>
    );
  },
});
