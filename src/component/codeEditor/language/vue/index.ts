import { Uri, editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { loadTheme } from "monaco-volar";
import { loadOnigasm, setupMonacoEnv } from "./env";
export function getOrCreateModel(
  uri: Uri,
  lang: string | undefined,
  value: string
) {
  const model = editor.getModel(uri);
  if (model) {
    model.setValue(value);
    return model;
  }
  return editor.createModel(value, lang, uri);
}
export const afterReady = (editorInstance) => {
  const t = (editorInstance as any)._themeService._theme;
  t.getTokenStyleMetadata = (
    type: string,
    modifiers: string[],
    _language: string
  ) => {
    const _readonly = modifiers.includes("readonly");
    switch (type) {
      case "function":
      case "method":
        return { foreground: 12 };
      case "class":
        return { foreground: 11 };
      case "variable":
      case "property":
        return { foreground: _readonly ? 21 : 9 };
      default:
        return { foreground: 0 };
    }
  };
};

export default () =>
  Promise.all([setupMonacoEnv(), loadOnigasm(), loadTheme(monaco.editor)]);
