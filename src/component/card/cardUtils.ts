import { PropType } from "vue";
import { themeListType } from "@/editor/pageEditor/data";
import _ from "lodash";
import { editorState } from "@/editor/pageEditor/content/stage/type";
import { TabItem } from "../tabs";
import { cardDefaultProps } from "./utils";
import { cardCompInfo } from "@/elements/utils";

// 卡片的数据类型 用于渲染卡片属性
export type CardPropTypes =
  /**
   * 字符串
   */
  | "string"
  /**
   * 数字
   */
  | "number"
  /**
   * 物模型
   */
  | "thing"
  /**
   * 物模型
   */
  | "flowSelect"
  /**
   * 布尔类型
   */
  | "boolean"
  /**
   * jsx
   */
  | "jsx"
  /**
   * 富文本
   */
  | "richText"
  /**
   * tabs 标签页
   */
  | "tabs"
  /**
   * 单选
   */
  | "radio"
  /**
   * checkBox
   */
  | "checkBox"
  /**
   * 二次确认
   */
  | "confirm"
  /**
   * 事件
   */
  | "event"
  /**
   * 视频选择弹窗
   */
  | "VideoSelect"
  /**
   * 表格
   */
  | "table"
  /**
   * 下拉选项
   */
  | "select"
  /**
   * 文字样式
   */
  | "textStyle"
  /**
   * 图标选择
   */
  | "icon"
  /**
   * 图标选择
   */
  | "script"
  /**
   * 代码
   */
  | "code";

/**
 * @description: 默认的卡片组件的props
 */
const defaultProps = {
  title: {
    type: String,
    default: "",
    label: "标题",
    state: "string",
  },
  code: {
    type: String,
    default: "",
    label: "代码片段",
    state: "code",
    hide: true,
  },
  isMock: {
    type: Boolean,
    default: false,
    label: "mock数据",
    state: "boolean",
  },
  theme: {
    type: String as PropType<themeListType>,
    default: "system",
    label: "主题",
    state: "string",
    hide: true,
  },
  state: {
    type: String as PropType<editorState>,
    default: "preview",
    /**
     * 是否是编辑 预览 生产
     */
    label: "状态",
    state: "string",
    hide: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
    label: "显示头部",
    state: "boolean",
  },
  showTitle: {
    type: Boolean,
    default: true,
    label: "显示标题",
    state: "boolean",
  },
  padding: {
    type: String,
    default: "0px",
    label: "内间距",
    state: "string",
  },
  tabs: {
    type: Array as PropType<Array<TabItem>>,
    default: [],
    label: "选项卡",
    state: "tabs",
  },
};

// 创建卡片组件的props
export const createCardProps: <T>(
  props: Record<keyof T, cardDefaultProps>,
  unUse?: boolean
) => Record<string, cardDefaultProps> = (props, unUse) => {
  if (unUse) {
    return props;
  }
  const def = _.cloneDeep(defaultProps) as Record<
    keyof typeof defaultProps,
    cardDefaultProps
  >;

  return {
    ...def,
    ...props,
  };
};

// 创建卡片组件
export const cardDefComponent: (
  com: any,
  b: Omit<cardCompInfo, "comp">
) => cardCompInfo = (a, b) => {
  const ab: cardCompInfo = {
    comp: a,
    cname: b.cname,
    pageControlId: b.pageControlId,
    code: b.code || "pcCard",
    tags: b.tags || [],
    cardType: b.cardType || "standard",
    thumbnail: b.thumbnail,
  };
  return ab;
};
