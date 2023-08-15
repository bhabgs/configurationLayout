import { emmetHTML } from "emmet-monaco-es";
import * as monaco from "monaco-editor";

export default () => {
  emmetHTML(monaco, ["html", "php"]);
};
