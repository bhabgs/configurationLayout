import { cardCompInfo } from "@/elements/utils";
import { inlCardTreeItem } from "../../data";
import { getCardObj } from "../../util";
import _ from "lodash";

// 使用卡片
export const useCard = (currentNode, cardobj) => {
  const { linkName, cname, comp } = cardobj;
  currentNode.cardName = cname;
  currentNode.linkName = linkName;
  currentNode.config = _.cloneDeep(comp.props);
};

// 元素拖入卡片事件
export const onDrop = (e: DragEvent, card: inlCardTreeItem) => {
  e.preventDefault();
  const cardobj = getCardObj(e) as cardCompInfo;
  const reset = () => {
    card.name = cardobj.cname;
    card.config = cardobj.config as any;
    card.pageControlId = cardobj.pageControlId;
  };
  if (!card.config) {
    reset();
  }
  if (card.config && card.pageControlId !== cardobj.pageControlId) {
    reset();
  }

  // 用户自定义组件
  if (card.pageControlId === "inl-card-custom") {
    reset();
  }
};
