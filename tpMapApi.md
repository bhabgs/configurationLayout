# 拓扑图接口
> 属性和事件的存储和使用规则
> 
> <b>属性：</b> 
> > 物实例的属性是根据图自身存储，每次拖入新的物实例会查询出当前实例默认展示的属性，同时也可以进行编辑并同步到该实例的物模型模板上修改默认展示的属性（不同步则保存到当前图）。所以我们只需要同步(编辑)到物模型模板和根据物模型查询模板这两个接口即可 (#五，#六)。
> 
> <b>事件：</b> 
> > 事件因为需要跨图处理，所以不能将事件的展示属性保存到当前图，需要提供根据实例id保存（编辑）事件展示属性列表和根据实例id查询的接口。同时也需要同步到物模型（<b>逻辑与属性相同</b>）。
> >
> >优先级排列:
> >
> >1. 实例返回事件属性
> >2. 模板返回的事件属性 
``` ts
// 基础返回数据结构
interface DEFAULTRESDATA<T> {
    code: string,
    ctime: Date.Time,
    data: T,
    message: string,
    requestId: string
}

// 主题
type THEME = 'dark' | 'light';

// 流程图编码
type FUNCTIONCODE = 'processMap' | 'equipmentMap';

// 料流类型
interface categoryItemInfo{
  label: string;
  value: string;
  lightColor: string;
  darkColor: string;
}
// 料流类型
export const CATEGORY: Record<keyof typeof CATEGORY, categoryItemInfo> = {
  RAW_COAL:{
    label: "原煤",
    value: "RAW_COAL",
    lightColor: "#EA5858",
    darkColor: "#EA5858",
  },
  CLEAN_COAL:{
    label: "精煤",
    value: "CLEAN_COAL",
    lightColor: "#22CC83",
    darkColor: "#22CC83",
  },
  REJECT:{
    label: "矸石",
    value: "REJECT",
    lightColor: "#6554C0",
    darkColor: "#6554C0",
    // darkColor: "#232863",
  },
 SLURRY: {
    label: "煤泥水",
    value: "SLURRY",
    lightColor: "#A52337",
    darkColor: "#A52337",
    // darkColor: "#371A3A",
  },
  DILUTE_MEDIUM:{
    label: "稀介",
    value: "DILUTE_MEDIUM",
    lightColor: "#9095A2",
    darkColor: "#9095A2",
    // darkColor: "#495471",
  },
  CORRECT_MEDIUM:{
    label: "合介",
    value: "CORRECT_MEDIUM",
    lightColor: "#354052",
    darkColor: "#354052",
    // darkColor: "#212F51",
  },
  MIDDLINGS:{
    label: "中煤",
    value: "MIDDLINGS",
    lightColor: "#FF9214",
    darkColor: "#FF9214",
    // darkColor: "#523B2E",
  },
  SLIME:{
    label: "煤泥",
    value: "SLIME",
    lightColor: "#729918",
    darkColor: "#729918",
    // darkColor: "#273D30",
  },
  CLARIFIED_WATER:{
    label: "清水",
    value: "CLARIFIED_WATER",
    lightColor: "#1CDDEB",
    darkColor: "#1CDDEB",
    // darkColor: "#175070",
  },
  AIR:{
    label: "空气",
    value: "AIR",
    lightColor: "#D439D4",
    darkColor: "#D439D4",
    // darkColor: "#452069",
  },
}

```
## 一、拓扑图列表接口 `get`
> 拓扑图列表查询

``` ts
interface RESDATA {
    createDt: string, // 创建时间
    updateDt: string, // 更新时间
    functionCode: FUNCTIONCODE, // 流程图编码
    cropId: string, // 企业ID
    id: string, // 拓扑图ID
    image: string, // url 调用通用图片上传
    theme: THEME, // 主题
    title: string, // 拓扑图名称
}
const resData: DEFAULTRESDATA<Array<RESDATA>>;
```

## 二、拓扑图查询接口 `get`
> 查询单个拓扑图详细信息


``` ts
interface RESDATA {
    createDt: string, // 创建时间
    updateDt: string, // 更新时间
    functionCode: FUNCTIONCODE, // 流程图编码
    cropId: string, // 企业ID
    id: string, // 拓扑图ID
    info: json; // 流程图的大JSON
    image: string, // 缩略图 --  调用通用图片上传
    theme: THEME, // 主题
    title: string, // 拓扑图名称
}
const resData: DEFAULTRESDATA<Array<RESDATA>>;
```
## 三、拓扑图保存接口 `post`
> 保存单个拓扑图

``` ts
interface LINEINFO {
    mapId: string; // 图的id
    aThingCode: string; // 上游模型code
    aInstanceId: string; // 上游模型实例id
    aInstanceName: string; // 上游实例名称
    zThingCode: string; // 下游模型code
    zInstanceId: string; // 下游模型实例id
    zInstanceName: string; // 下游实例名称
    category: keyof typeof CATEGORY; // 料流类型
}

interface REQDATA {
    id: string; // map id 前端生成
    info: json; // 流程图的大JSON
    image: string; // 缩略图 --  调用通用图片上传 使用path 不使用base64
    theme: THEME; // 主题
    title: string; // 拓扑图名称
    lines: Array<lineInfo> // 上下游关系list
}

const reqData: DEFAULTRESDATA<REQDATA>;

```

## 四、拓扑图删除接口 `post`
> 删除拓扑图，支持多个删除

``` ts
interface REQDATA {
    mapIds: Array<string>; // 拓扑图的id
}

const reqData: DEFAULTRESDATA<REQDATA>;

```

## 五、拓扑图 物模型属性同步和物模型样式同步接口 `post`
> 物模型相关，新增/编辑

``` ts
// 每个属性文字的详细信息
interface PROPTYPEITEMINFO {
    type: string; // 文字类型
    code: string; // 属性Code
    v: string; // 属性code 默认值
    label?: string; // 属性名称
    position?: { // 坐标信息 基于物实例
        x: number;
        y: number;
    },
}

interface REQDATA {
    code: string; // 物实例CODE
    styleAttrs: { // 物模型
        scaleX: number; // x轴缩放
        scaleY: number;// y轴缩放
        width: number; // 物模型宽度
        height: number; // 物模型高度
        componentName?: string; // 如果是组件，会有相应的组件名称
        draggable?: boolean; // 是否允许拖动
    }, 
    propertyList: Array<PROPTYPEITEMINFO>
}

const reqData: DEFAULTRESDATA<REQDATA>;
```

## 六、拓扑图属性和物模型样式同步查询接口 `get`
``` ts
interface RESDATA {
    code: string; // 物实例CODE
    styleAttrs: { // 物模型
        scaleX: number; // x轴缩放
        scaleY: number;// y轴缩放
        width: number; // 物模型宽度
        height: number; // 物模型高度
        componentName?: string; // 如果是组件，会有相应的组件名称
        draggable?: boolean; // 是否允许拖动
    }, 
    propertyList: Array<PROPTYPEITEMINFO> // 同上 ## 5
}

const resData: DEFAULTRESDATA<RESDATA>;
```
## 七、拓扑图事件保存接口（新增/编辑）`post`
> 针对当前实例保存
``` ts
interface REQDATA {
    instanceId?: string; // 物模型id
    propertyList: Array<string>; // 属性code array
    visible: boolean; // 是否相应弹窗事件
}
const reqData: DEFAULTRESDATA<REQDATA>;

```

## 八、拓扑图事件查询接口 `get`
> 针对当前实例查询，方便跨图查询
``` ts
interface RESDATA {
    instanceId?: string; // 物模型id
    propertyList: Array<string>; // 属性code array
    visible: boolean; // 是否相应弹窗事件
}
const resData: DEFAULTRESDATA<RESDATA>;

```

## 九、拓扑图事件同步接口（物模型相关，新增/编辑） `post`
> 根据物模型保存到模板，方便处理默认规则
``` ts
interface REQDATA {
    code?: string; // 物模型编码
    propertyList: Array<string>; // 属性code array
    visible: boolean; // 是否相应弹窗事件
}
const reqData: DEFAULTRESDATA<REQDATA>;

```

## 十、拓扑图事件同步查询接口 `get`
> 根据物模型读取事件模板
``` ts
interface RESDATA {
    code?: string; // 物模型id
    propertyList: Array<string>; // 属性code array
    visible: boolean; // 是否相应弹窗事件
}
const resData: DEFAULTRESDATA<RESDATA>;

```

## 十一、获取料流字典 `get`
> 料流字典存到数据库，不在前端管理
``` ts
const resData:DEFAULTRESDATA <Record<string, categoryItemInfo>>
```