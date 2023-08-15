import { inlCardTreeItem, pageInfo } from "../data";

/**
 * 获取节点的父节点
 * @param info 页面数据
 * @param node 要查询的节点
 * @returns 父节点
 */
export function getNodeParent(
  info: inlCardTreeItem,
  node: inlCardTreeItem
): inlCardTreeItem | undefined {
  if (Array.isArray(info.children)) {
    for (const c of info.children) {
      if (c.id === node.id) {
        return info;
      }
      const cRes = getNodeParent(c, node);
      if (cRes) {
        return c;
      }
    }
  }
}

/**
 * 移除节点
 * @param parent 父节点
 * @param child 子节点
 */
export function removeChild(parent: inlCardTreeItem, child: inlCardTreeItem) {
  const cIdx = parent.children.findIndex((c) => c.id === child.id);
  if (cIdx !== -1) {
    parent.children.splice(cIdx, 1);
    parent.children.forEach((c, index) => {
      c.sort = index;
    });
    if (parent.styleJson.colNum !== 1 && parent.styleJson.rowNum !== 1) {
      return true;
    }
    if (parent.styleJson.colNum === 1) {
      parent.styleJson.rowNum--;
    } else if (parent.styleJson.rowNum === 1) {
      parent.styleJson.colNum--;
    }
    return true;
  }
  return false;
}
