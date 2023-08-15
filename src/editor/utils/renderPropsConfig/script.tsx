import { PropType, computed, defineComponent, ref, watch } from "vue";
import EditorCommon from "@/component/editorCommon";
import { useVModel } from "@vueuse/core";

// 属性名 => 中文描述
export type ParamType = Record<string, string>;

/**
 * 脚本
 */
const Script = defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
    params: {
      type: Object as PropType<ParamType>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const code = useVModel(props, "value", emit);
    const codeTemp = ref("");

    watch(code, (val) => (codeTemp.value = val), { immediate: true });

    const paramList = computed(() => {
      return Object.entries(props.params);
    });

    const onOk = () => {
      visible.value = false;
      code.value = codeTemp.value;
    };

    const onClose = () => {
      codeTemp.value = code.value;
    };

    return () => {
      const params = paramList.value.map(([key, desc]) => (
        <li>
          <span>{key}:</span>
          <span>{desc}</span>
        </li>
      ));

      return (
        <div class="script">
          <a-button type="primary" onClick={() => (visible.value = true)}>
            编辑脚本
          </a-button>

          <a-modal
            title="脚本"
            width={800}
            onOk={onOk}
            afterClose={onClose}
            v-model:visible={visible.value}
          >
            <div>脚本参数</div>
            <ul class="param-list">{params}</ul>
            <EditorCommon
              language="javascript"
              height={500}
              v-model:value={codeTemp.value}
            />
          </a-modal>
        </div>
      );
    };
  },
});

export default Script;
