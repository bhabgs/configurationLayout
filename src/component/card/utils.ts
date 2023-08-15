import { PropOptions } from "ant-design-vue/lib/_util/type";
import { PropType } from "vue";
import _ from "lodash";

import { CardPropTypes } from "./cardUtils";

export type cardDefaultPropType = PropType<any> | true | null | any;

/**
 * @description: 卡片组件的props
 */
export type defaultDictionary =
  | Array<{
      name: string;
      id: string;
    }>
  | Array<{
      label: string;
      value: string;
    }>
  | {};
export interface cardDefaultProps<T = CardPropTypes, D = defaultDictionary>
  extends PropOptions {
  type: cardDefaultPropType; // 类型
  default: cardDefaultPropType | string; // 默认值
  label: string; // 标签
  state: T; // 状态
  code?: string; // 字段
  hide?: boolean; // 是否隐藏
  value?: any; // 值
  description?: string; // 描述
  dataDictionary?: D;
  controlInstId?: string; // 事件实例id
  customProp?: any;
}

/**
 * @description: 卡片组件的props
 */
export type cardTabgsLib = {
  name: string;
  key: string;
};
