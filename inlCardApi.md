# 卡片中心接口文档
``` ts
// 背景配置
export const backgroundTypeList = {
  tupu: "图扑",
  flowChart: "设备流程图",
  image: "自定义图片",
  color: "自定义颜色",
};
export type backgroundType = keyof typeof backgroundTypeList;

// 主题配置
export const themeList = {
  system: "跟随系统",
  STBlue: "科技蓝",
  dark: "暗色系",
  light: "浅色系",
};
export type themeListType = keyof typeof themeList;

// 平台配置
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
};
export type layoutListType = keyof typeof layoutList;



```

## 一、页面管理
``` ts
// 单个卡片信息
export interface inlCardItemInfo{
  title: string; // 名称
  children: Array<inlCardItemInfo>;
  background: string; // 背景颜色 | 背景图url | ht链接
  width: number; // 宽度
  height: number; // 高度
  colNum: number; // 列数
  colGap: number; // 列间距
  rowNum: number; // 行数
  rowGap: number; // 行间距
  linkName: string; // 组件引用名称
  cardName: string; // 卡片名称
  config?: Record<string, cardDefaultProps>; // 卡片配置
}

// 页面配置
export interface CardPageInfo<T = Array<inlCardItemInfo>> {
  pageName: string; // 页面名称
  backgroundType: backgroundType; // 背景类型
  background: string; // 背景值
  terminal: platformListType; // 使用平台
  resolutionRatioW: number; // 分辨率宽
  resolutionRatioH: number; // 分辨率高
  version: string; // 卡片版本
  theme: themeListType; // 主题
  layoutTree: T;
  id: string;
}
```
### 1.1 新增页面
``` ts
const reqData: CardPageInfo;
```

### 1.2删除页面
``` ts
const reqData: Pick<CardPageInfo, 'id'>;
```

### 1.3修改页面
``` ts
const reqData: CardPageInfo;
```

### 1.4查询页面
``` ts

interface resData  extends CardPageInfo{
    createUser: string,
    createDt: string,
    updateUser: string,
    updateDt: string,
}
// 列表查询
const resData: Array<Omit<resData, 'layoutTree'>>;

// 单个详细信息查询
const resData: resData;
```
## 二、布局管理
> 布局管理，修改布局待定
### 2.1新增布局
``` ts
const reqData: CardPageInfo<Array<Omit<inlCardItemInfo, 'linkName' | 'cardName' | 'config'>>>;
```

### 2.2删除布局
``` ts
const reqData: Pick<CardPageInfo, 'id'>;
```

### 2.3查询布局
``` ts
 interface resData extends CardPageInfo<Array<Omit<inlCardItemInfo, 'linkName' | 'cardName' | 'config'>>>{
    createUser: string,
    createDt: string,
    updateUser: string,
    updateDt: string,
}
// 列表查询
const resData: Array<resData>;

// 单个详细信息查询
const resData: resData;
```

## 卡片管理
> 目前全部放到卡片组件库进行管理，包括标签部分


## 问题列表
1. 如何定制自定义卡片
