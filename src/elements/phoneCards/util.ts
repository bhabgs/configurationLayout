import _ from "lodash";
import { cardDefaultProps } from "../../component/card/utils";

// 表单项默认props
const defaultControlItemProps = {
  title: {
    type: String,
    default: "标题",
    label: "标题",
    state: "string",
  },
  placeholder: {
    type: String,
    default: "请输入",
    label: "暗提示",
    state: "string",
  },
  showLabel: {
    type: Boolean,
    default: true,
    label: "显示标签",
    state: "boolean",
  },
  py: {
    type: String,
    default: "center",
    label: "上下位置",
    state: "radio",
    dataDictionary: [
      {
        name: "中",
        id: "center",
      },
      {
        id: "top",
        name: "上",
      },
      {
        id: "bottom",
        name: "下",
      },
    ],
  },
  px: {
    type: String,
    default: "center",
    label: "上下位置",
    state: "radio",
    dataDictionary: [
      {
        name: "中",
        id: "center",
      },
      {
        id: "left",
        name: "左侧",
      },
      {
        id: "right",
        name: "右侧",
      },
    ],
  },
  cpx: {
    type: String,
    default: "center",
    label: "内容位置",
    state: "radio",
    dataDictionary: [
      {
        name: "中",
        id: "center",
      },
      {
        id: "top",
        name: "左",
      },
      {
        id: "bottom",
        name: "右",
      },
    ],
  },
  jianju: {
    type: Array,
    default: [0, 0, 0, 0],
    label: "间距",
    state: "numbers",
    dataDictionary: [
      {
        name: "左上",
        id: "1",
      },
      {
        id: "2",
        name: "左下",
      },
      {
        id: "3",
        name: "右上",
      },
      {
        id: "4",
        name: "右下",
      },
    ],
  },
};

// 创建控制点配置Props
export const createControlItemProps = <T>(
  b: Record<keyof T, cardDefaultProps>,
  name: string,
  icon: string
) => {
  const def = _.cloneDeep(defaultControlItemProps) as Record<
    keyof typeof defaultControlItemProps,
    cardDefaultProps
  >;
  return {
    ...def,
    icon: {
      type: String,
      default: icon,
      label: "图标",
      hide: true,
      state: "string",
    },
    name: {
      type: String,
      default: name,
      label: "标题",
      hide: true,
      state: "string",
    },
    ...b,
  };
};
