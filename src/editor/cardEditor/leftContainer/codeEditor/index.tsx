import { Ref, defineComponent, inject } from "vue";
import CodeEditor from "@/component/codeEditor";

const props = {
  code: {
    type: String,
    default: "",
  },
};

export default defineComponent({
  props,
  setup(p, ctx) {
    const codeVal = inject<Ref>("testCode");
    const options = inject<Ref>("editorOptions");
    return () => (
      <CodeEditor
        language="vue"
        options={options}
        v-model:value={codeVal.value}
      />
    );
  },
});
