import { PropType, defineComponent, ref } from "vue";
import { useVModel } from "@vueuse/core";
import ColorChoose from "@/component/ColorPicker";

export type TextStyle = {
  fontSize: number;
  color?: string;
  fontWeight?: number;
  italic?: boolean;
  textAlign?: "left" | "center" | "right";
};

export let fontWeightList = [];
for (let i = 300; i < 1000; i += 100) {
  fontWeightList.push({ label: i, value: i });
}

export const alignList = [
  { label: "左", value: "left" },
  { label: "中", value: "center" },
  { label: "右", value: "right" },
];

export default defineComponent({
  name: "TextStyle",
  emits: ["update:value"],
  props: {
    value: {
      type: Object as PropType<TextStyle>,
      default: false,
    },
  },
  setup(props, context) {
    const modelValue = useVModel(props, "value", context.emit);
    const visible = ref(false);
    props.value;

    const handleConfirm = () => {
      visible.value = false;
    };

    return () => (
      <>
        <a-button onClick={() => (visible.value = true)}>编辑</a-button>
        <a-modal
          title="字体样式"
          cancelButtonProps={{ style: { display: "none" } }}
          maskClosable={false}
          onOk={handleConfirm}
          v-model:visible={visible.value}
        >
          <a-form
            model={modelValue.value}
            labelCol={{ style: { width: "6em" } }}
          >
            <a-form-item label="字体大小" name="fontSize">
              <a-input-number
                style={{ width: "100%" }}
                placeholder="请输入"
                controls={false}
                v-model:value={modelValue.value.fontSize}
              ></a-input-number>
            </a-form-item>
            <a-form-item label="颜色" name="color">
              <ColorChoose v-model:color={modelValue.value.color}></ColorChoose>
            </a-form-item>
            <a-form-item label="字重" name="fontWeight">
              <a-select
                placeholder="请选择"
                options={fontWeightList}
                v-model:value={modelValue.value.fontWeight}
              ></a-select>
            </a-form-item>
            <a-form-item label="斜体" name="italic">
              <a-switch v-model:checked={modelValue.value.italic}></a-switch>
            </a-form-item>
            <a-form-item label="对齐" name="textAlign">
              <a-select
                placeholder="请选择"
                options={alignList}
                v-model:value={modelValue.value.textAlign}
              ></a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </>
    );
  },
});
