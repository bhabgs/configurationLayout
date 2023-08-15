import { cardDefaultProps } from "..";

const cardTypeEnum = {
  form: "表单",
  custom: "自定义",
  aboutThing: "关于物",
  standard: "标准卡片",
};

export const cardCode = {
  pcCard: "pc端卡片",
  controlItem: "控制点",
  phoneCard: "移动端卡片",
};
export interface cardCompInfo {
  comp: any;
  cname: string;
  pageControlId: string;
  isCustomCard?: boolean;
  tags?: Array<string>;
  config?: Array<cardDefaultProps>;
  code: keyof typeof cardCode;
  cardType?: keyof typeof cardTypeEnum;
  thumbnail?: string;
}
export const useCardCompInfo = (opt: Omit<cardCompInfo, "comp">) => opt;
