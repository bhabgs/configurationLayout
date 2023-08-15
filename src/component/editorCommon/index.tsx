import { defineComponent, nextTick, onMounted, ref, watch } from "vue";
import * as monaco from "monaco-editor";
import { useVModel, watchOnce } from "@vueuse/core";
import { registerGroovyLanguageForMonaco } from "./groovyDefination";

export const supportLanguages = ["javascript", "groovy"];

/**
 * 通用编辑器(事件脚本)
 */
const EditorCommon = defineComponent({
  props: {
    language: {
      type: String,
      default: "javascript",
      validator(val: string) {
        return supportLanguages.includes(val);
      },
    },
    height: {
      type: Number,
      default: 500,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const editorRef = ref();
    let editor: monaco.editor.IStandaloneCodeEditor;
    const code = useVModel(props, "value", emit);
    let isBlocked = false;

    onMounted(() => {
      editor = monaco.editor.create(editorRef.value, {
        language: props.language,
        theme: "vs-dark",
        automaticLayout: true,
        ariaContainerElement: document.createElement("div"),
      });
      setTimeout(() => {
        editor.getModel()?.setValue(code.value);
      });
      editor.onDidChangeModelContent(() => {
        const model = editor.getModel();
        if (model) {
          code.value = model.getValue();
        }
      });

      if (props.language === "groovy") {
        registerGroovyLanguageForMonaco();
      }
      if (props.readonly) {
        editor.updateOptions({ readOnly: props.readonly });
      }

      editor.onDidChangeModelContent(() => {
        const model = editor.getModel();
        if (model) {
          isBlocked = true;
          code.value = model.getValue();
          nextTick(() => (isBlocked = false));
        }
      });
    });

    watch(
      () => props.value,
      (val) => {
        if (!isBlocked) {
          editor.setValue(val);
        }
      }
    );

    watch(
      () => props.readonly,
      (val) => {
        editor.updateOptions({
          readOnly: val,
        });
      }
    );

    return () => (
      <div class="editor-common">
        <div ref={editorRef} style={{ height: `${props.height}px` }}></div>
      </div>
    );
  },
});

export default EditorCommon;
