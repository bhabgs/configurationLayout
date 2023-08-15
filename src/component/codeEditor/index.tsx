import { defineComponent, onMounted, ref } from "vue";
import * as monaco from "monaco-editor";
import { generateIdSix } from "@/editor/utils";
import { useVModel } from "@vueuse/core";
import "./resetEditor";
import addCommand from "./command";
import initEditor from "./initEditor";

import Thing, { PointCode, ThingIns, ThingPc } from "../thing";

const script = `<script lang="ts" setup>
  import { ref } from 'vue'
  const msg = ref('Hello World!')
</script>
<template>
  <h1>{{ msg }}</h1>
</template>
`;

const props = {
  value: {
    type: String,
    default: script,
  },
  language: {
    type: String,
    default: "vue",
  },
  theme: {
    type: String,
    default: "vs-dark", //"vs-code-theme-converted-dark",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
};

export function debounce(fn: Function, n = 100) {
  let handle: any;
  return (...args: any[]) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, n);
  };
}

export default defineComponent({
  props,
  emits: ["update:value", "change"],
  setup(p, ctx) {
    const id = "inl-card-editor-" + generateIdSix();
    const value = useVModel(p, "value", ctx.emit);
    const showThing = ref(false);
    const element = ref<HTMLElement>();
    let editor: monaco.editor.IStandaloneCodeEditor;

    // 创建编辑器
    const createEditor = async () => {
      editor = await initEditor(
        element.value,
        value.value,
        p.language,
        p.options
      );
    };

    // 初始化编辑器
    onMounted(async () => {
      await createEditor();
      editor.onDidChangeModelContent(
        debounce((val: string) => {
          value.value = editor.getValue();
          ctx.emit("change", value.value);
        }, 300)
      );

      // 添加命令
      addCommand(editor, ctx, {
        altT(cb) {
          showThing.value = true;
        },
      });
    });

    // 导出编辑器查询方法
    ctx.expose({
      getCode() {
        return editor.getValue();
      },
    });

    return () => (
      <>
        <Thing
          v-model:showThing={showThing.value}
          multiple={true}
          hasThingProps={true}
          onSaveThing={(
            thingList: Array<ThingIns>,
            pcs: Array<ThingPc>,
            pointCodes: Array<Record<string, PointCode>>,
            thingCode: string
          ) => {
            const position = editor.getPosition();
            editor.executeEdits("", [
              {
                range: new monaco.Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column
                ),
                text: `thingList: ${JSON.stringify(
                  thingList
                )}, pcs: ${JSON.stringify(pcs)}, pointCodes: ${JSON.stringify(
                  pointCodes
                )}, thingCode: ${JSON.stringify(thingCode)}`,
                forceMoveMarkers: true,
              },
            ]);
          }}
        />
        <div id={id} ref={element} class={["inl-card-editor"]}></div>
      </>
    );
  },
});
