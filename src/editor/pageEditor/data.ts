import { cardDefaultProps } from "@/component/card/utils";
import { editorState } from "./content/stage/type";

// 背景
export const backgroundTypeList = {
  tupu: "图扑",
  flowChart: "设备流程图",
  image: "自定义图片",
  color: "自定义颜色",
  // gradient: "渐变色",
};
export type backgroundType = keyof typeof backgroundTypeList;

// 图片裁剪
export const imageFitList = {
  fill: "拉伸",
  cover: "填充",
  contain: "保持宽高比",
};
export type imageFit = keyof typeof imageFitList;

// 主题
export const themeList = {
  system: "跟随系统",
  STBlue: "科技蓝",
  dark: "暗色系",
  light: "浅色系",
};
export type themeListType = keyof typeof themeList;

// 平台
export const platformList = {
  pc: { label: "电脑", icon: "icon-wulianpingtai_webduan" },
  phone: { label: "手机", icon: "icon-wulianpingtai_shoujiduanyingyong" },
  pad: { label: "平板", icon: "icon-wulianpingtai_padduan" },
  custom: { label: "自定义分辨率", icon: "icon-icon_zengshangaicha_xiugai" },
};
export type platformListType = keyof typeof platformList;

// 分辨率模板
export const resolutionRatioTemp: Record<
  platformListType,
  { width: number; height: number }
> = {
  pc: { width: 1920, height: 1080 },
  phone: { width: 360, height: 640 },
  pad: { width: 1024, height: 768 },
  custom: { width: 1920, height: 1080 },
};

// 布局方案
export const layoutList = {
  custom: "网格布局",
  vertical: "垂直布局",
  tabs: "标签页布局",
};
export type layoutListType = keyof typeof layoutList;
export interface BaseConfig {
  template?: string; // 布局模板
  backgroundType: backgroundType; // 背景类型
  background: string; // 背景颜色
  backgroundFit?: string; // 图片背景裁剪方式
  boxShadow?: string; // 阴影配置
  borderRadius?: number; // 圆角
  borderWidth?: number; // 边框宽度
  borderColor?: string; // 边框颜色
  paddingTop?: number; // 内边距
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number; // 外边距
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  overflow?: string; // 超出显示
  width?: number; // 宽度
  height?: number; // 高度
  colNum?: number; // 列数
  colGap?: number; // 列间距
  rowNum?: number; // 行数
  rowGap?: number; // 行间距
}
// 单个卡片
export interface inlCardTreeItem {
  id?: string; // id
  name: string; // 名称
  pageId?: string; // 页面id
  pageControlId?: string; // 控件id
  parentId?: string; // 父级id
  layout: layoutListType; // 布局
  sort?: number; // 排序
  description?: string; // 描述
  datasourceType?: string; // 数据源类型
  datasourceContent?: string; // 数据源内容
  children?: Array<inlCardTreeItem>; // 子级
  styleJson: BaseConfig; // 样式
  value?: any; // 值
  code: "card" | "form-item" | "form-card"; // 类型
  config?: {
    [key: string]: cardDefaultProps;
  }; // 卡片配置
}

// 页面配置
export interface pageInfo extends inlCardTreeItem {
  clientType: platformListType; // 使用平台
  pageType: keyof typeof PageType; // 页面类型
  resolutionRatioW: number; // 分辨率宽
  resolutionRatioH: number; // 分辨率高
  version: string; // 卡片版本
  theme: themeListType; // 主题
  appId: string; // 应用id
  thumbnail?: string; // 缩略图
  releaseStatus?: editorState; // 发布状态
  adapter: boolean; // 是否适配
  globalConfig: {
    script?: string; // 脚本
    style?: string; // 样式
  }; // 全局配置
}

// 通用组背景颜色
export const groupBackground = "#dadada";

// 树节点模板
export const nodeTemplate: inlCardTreeItem = {
  name: "Node",
  pageControlId: "page",
  code: "card",
  id: "1",
  children: [],
  sort: 0,
  layout: "custom", // 布局
  pageId: "1",
  styleJson: {
    template: null, // 布局模板
    backgroundType: "color",
    background: "none", // 背景颜色
    width: null, // 宽度
    height: null, // 高度
    colNum: 1, // 列数
    colGap: null, // 列间距
    rowNum: 1, // 行数
    rowGap: null, // 行间距
    borderColor: "#000000", // 边框颜色
  },
};

export const PageType = { form: "表单页面", bigScreen: "大屏页面" };

// 创建默认模板
export const defaultPageInfo: pageInfo = {
  id: "0",
  pageId: "1",
  code: "card",
  pageControlId: "page",
  sort: 0,
  appId: "testAppId",
  name: "页面名称",
  clientType: "pc", // 使用平台
  pageType: "bigScreen", // 页面类型
  resolutionRatioW: 1920, // 分辨率宽
  resolutionRatioH: 1080, // 分辨率高
  version: "1.0.0", // 卡片版本
  theme: "system", // 主题
  children: [], // 树结构
  layout: "custom",
  adapter: true,
  globalConfig: {
    script: "",
    style: "",
  },
  styleJson: {
    template: "",
    backgroundType: "color",
    background: groupBackground,
    width: null,
    height: null,
    colNum: 1,
    colGap: null,
    rowNum: 1,
    rowGap: null,
    borderColor: "#000000", // 边框颜色
  }, // 基础配置
};

export interface dictionaries {
  label: string;
  valList: Array<{ label: string; value: string }>;
}
