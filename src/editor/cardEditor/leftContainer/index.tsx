import { Ref, defineComponent, inject, ref } from "vue";
import { Pane } from "splitpanes";
import Config from "./config";
import CodeEditor from "./codeEditor";
const props = {
  code: {
    type: String,
    default: "",
  },
};

export default defineComponent({
  name: "CardEditorStage",
  props,
  setup(p, ctx) {
    const activeKey = ref("1");

    const disabled = inject<Ref<boolean>>("disabled");

    return () => (
      <Pane maxSize={70} class={["inl-card-editor-box-leftcontainer"]}>
        <a-tabs
          v-model:activeKey={activeKey.value}
          type="card"
          disabled={disabled.value}
        >
          <a-tab-pane key="1" tab="代码编辑">
            <CodeEditor />
          </a-tab-pane>
          <a-tab-pane key="2" tab="组件配置">
            <Config />
          </a-tab-pane>
        </a-tabs>
      </Pane>
    );
  },
});
