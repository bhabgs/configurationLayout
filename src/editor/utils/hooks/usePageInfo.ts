import { inlCardTreeItem, pageInfo } from "@/editor/pageEditor/data";
import { Ref, inject } from "vue";

export default () => {
  const pageData = inject<pageInfo>("pageData");
  const currentNode = inject<Ref<inlCardTreeItem>>("currentNode");
  return { pageData, currentNode };
};
