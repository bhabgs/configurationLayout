export const EDITORSTATE = {
  preview: "预览",
  editor: "编辑",
  production: "生产",
  "preview-layout": "布局预览",
};

export type editorState = keyof typeof EDITORSTATE;
