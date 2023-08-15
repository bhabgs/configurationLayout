import * as monaco from "monaco-editor";

const actions: Array<monaco.editor.IActionDescriptor> = [
  {
    id: "altT",
    label: "altT",
    precondition: "isChrome == true",
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyT],
    run(editor, cb) {
      // const position = editor.getPosition();
      // editor.executeEdits("", [
      //   {
      //     range: new monaco.Range(
      //       position.lineNumber,
      //       position.column,
      //       position.lineNumber,
      //       position.column
      //     ),
      //     text: "insttextaaa",
      //     forceMoveMarkers: true,
      //   },
      // ]);
      console.log(editor);
    },
  },
  {
    id: "format",
    label: "format",
    precondition: "isChrome == true",
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyP],
    run(editor, ...args) {
      console.log(editor);
      editor.getAction("editor.action.formatDocument").run();
    },
  },
];

const command: Array<{ keybinding: number; run: Function; id: string }> = [
  {
    id: "altT",
    keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyT,
    run(editor, cb) {
      if (cb) cb();
    },
  },
  {
    id: "format",
    keybinding: monaco.KeyMod.Alt | monaco.KeyCode.KeyP,
    run(editor, ...args) {
      console.log(editor);
      editor.getAction("editor.action.formatDocument").run();
    },
  },
];

export default (
  editor: monaco.editor.IStandaloneCodeEditor,
  ctx,
  actionRunCallBack?: { altT?: (cb: Function) => void }
) => {
  for (const action of command) {
    editor.addCommand(
      action.keybinding,
      actionRunCallBack.altT
      //@ts-ignore
      // action.run.bind(this, editor, actionRunCallBack.altT)
    );
  }
};
