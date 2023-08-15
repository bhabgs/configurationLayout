import * as monaco from "monaco-editor";
import themeJson from "./monacoTheme";

export default () => {
  monaco.editor.defineTheme("myTheme", themeJson as any);
  monaco.editor.setTheme("myTheme");
};
