import * as monaco from "monaco-editor";
import { loadGrammars } from "monaco-volar";
import component from "../component";
import Loadlanguage from "../language";
import { afterReady, getOrCreateModel } from "../language/vue";

/**
 * @description 初始化编辑器
 * @param domId 编辑器挂载的domId
 * @param defaultVal 默认值
 * @param theme 主题
 * @param options 配置项
 */
let n = 0;
export default async (
  element: HTMLElement,
  defaultVal: string,
  language: string,
  options: any
) => {
  let codeEditor: monaco.editor.IStandaloneCodeEditor;

  if (language === "vue") {
    const [, , theme] = await Loadlanguage.loadVueLanguage();
    const model = getOrCreateModel(
      monaco.Uri.parse("file:///bbq.vue"),
      "vue",
      defaultVal
    );
    codeEditor = monaco.editor.create(element, {
      theme: theme.dark,
      model,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      ariaContainerElement: element,
      minimap: {
        enabled: true,
      },
      language, //: "javascript",
      inlineSuggest: {
        enabled: false,
      },
      "semanticHighlighting.enabled": true,
      ...options,
    });
    afterReady(codeEditor);
    loadGrammars(monaco, codeEditor);
  } else {
    codeEditor = monaco.editor.create(element, {
      theme: "vs-dark",
      value: defaultVal,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      ariaContainerElement: element,
      minimap: {
        enabled: true,
      },
      language, //: "javascript",
      inlineSuggest: {
        enabled: false,
      },
      "semanticHighlighting.enabled": true,
      ...options,
    });
  }
  component();

  console.log("load code editor success", n++);
  return codeEditor;
};
