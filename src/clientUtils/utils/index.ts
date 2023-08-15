import createId from "./createId";

export { createId };

/**
 * pointCode 参数结构
 */

export const DEVICESTATE = "DEVICE_STATE";

export interface POINTCODE extends thingPropertyValueVoList {
  value: string;
  unit: string;
  groupName?: string;
  historyDataList?: Array<any>;
  thingEntity?: ThingEntity;
  thingCode?: string;
  thingInstId?: string;
  stateImg?: string;
}

export interface thingPropertyValueVoList {
  alarmAvailable: Boolean;
  alarmId: string;
  colorTrans: string;
  colspan: number;
  displayType: string;
  displayValue: string | number | boolean;
  eventEnable: Boolean;
  /**
   * 属性label名称
   */
  label: string;
  /**
   * 属性长度
   */
  linkUrl: null;
  /**
   * 属性长度
   */
  listInfo: "";
  /**
   * 属性类型
   */
  listType: "";
  /**
   * 是否需要报警
   */
  needColorTrans: Boolean;
  /**
   * 是否需要跳转
   */
  needLink: Boolean;
  pointCode: null;
  pointCode2: null;
  /**
   * 属性类型
   */
  propertyType: keyof typeof propertyType;
  /**
   * 刷新频率
   */
  refresh: null;
  /**
   * 关联属性code
   */
  relationThingCode: null;
  /**
   * 是否必填
   */
  selectRequest: Boolean;
  /**
   * 属性排序
   */
  sort: number;
  /**
   * 属性code
   */
  thingPropertyCode: string;
  /**
   * 属性id
   */
  thingPropertyId: string;
  /**
   * 属性实例id
   */
  thingPropertyInstId: null;
  /**
   * 属性名称
   */
  thingPropertyName: string;
  /**
   * 属性单位
   */
  unit: string;
  /**
   * 属性值
   */
  value: string | null;
}

// 属性分类
export enum propertyType {
  /**
   * unknown
   * */
  NONE = "NONE",
  /**
   * 物实例属性
   * */
  ATTRIBUTE = "ATTRIBUTE",
  /**
   * 静态属性
   * */
  PROPERTY = "PROPERTY",
  /**
   * 动态属性
   * */
  METRIC = "METRIC",
  /**
   * 动作下发
   * */
  ACTION = "ACTION",
  /**
   * 下发参数
   * */
  PARAMETER = "PARAMETER",
  /**
   * 报警属性
   * */
  ALARM = "ALARM",
  /**
   * 逻辑属性
   * */
  LOGIC = "LOGIC",
  /**
   * 关系属性
   */
  RELATION = "RELATION",
  /**
   * 设定参数
   */
  SETTING = "SETTING",
}

export type detailGroupList = {
  /**
   * 设备详情组名称
   */
  groupName: string;
  /**
   * 设备详情组类型
   */
  groupType: string;
  /**
   * 设备详情组属性列表
   */
  thingPropertyValueVoList: Array<thingPropertyValueVoList>;
};

/**
 * 物模型 详情
 */
export interface ThingEntity {
  catalogCode: string;
  catalogName: string;
  children: null;
  code: string;
  createTime: string;
  createUser: null;
  id: string;
  img2dAlarm: string;
  img2dPoweroff: string;
  img2dPoweron: string;
  img2dRun: string;
  img25dAlarm: string;
  img25dPoweroff: string;
  img25dPoweron: string;
  img25dRun: string;
  industryCode: string;
  industryName: string;
  name: string;
  parentCode: string;
  parentId: string;
  photo: string;
  remark: string;
  sort: number;
  tableName: string;
  thingKind: string;
  thingType: string;
  updateTime: string;
  updateUser: string;
  validEnable: true;
}

/**
 * 设备实例详情
 */
export interface thingInstanceDetail {
  /**
   * 设备详情组
   */
  detailGroupList: Array<detailGroupList>;
  functionCode: "WEB";
  listPropertyList: any;
  thingInstCode: string;
  /**
   * 物模型Code
   */
  thingEntity: ThingEntity;
  thingCode: string;
  thingInstId: string;
  thingInstName: string;
  thingInstPhoto: string;
  thingName: string;
  stateImg: string;
  /**
   * 设备实例
   */
}

export interface RequestParams {
  token?: string;
  requestType: string | null;
  thingCode: string | null;
  functionCode: "web" | "topo" | "3dTopo";
}

// 把对象转换成url参数
export const paramsToString = (obj: Record<string, any>) => {
  let arr = [] as any;
  for (let objKey in obj) {
    arr.push(objKey + "=" + obj[objKey]);
  }
  return arr.join("&");
};

// 初始化请求头
export const resetHeader = (token: string | undefined) => {
  const reqToken = token ?? sessionStorage.getItem("token");
  if (!reqToken) {
    throw new Error("没有token，不能获取");
  }
  const headers = {
    token: reqToken,
    "Content-Type": "application/json;charset=utf-8",
  };
  return headers;
};

// 过滤无用属性根据eventEnable
export const filterDataByEventEnableFun = (data: thingInstanceDetail) => {
  for (let i of data.detailGroupList) {
    i.thingPropertyValueVoList = i.thingPropertyValueVoList.filter(
      (item) => item.eventEnable
    );
  }
  return data;
};

// 把数据转换成pointCode格式
export const dataToPointCode = (
  data: Record<string, thingInstanceDetail>,
  pcs?: Array<string>
) => {
  const pointCodeRecord: Record<string, Record<string, POINTCODE>> = {};

  for (let i in data) {
    pointCodeRecord[i] = {};
    if (!data[i]) continue;
    const thingEntity = data[i].thingEntity;
    let stateImg = thingEntity.img25dPoweroff;

    for (let j of data[i].detailGroupList) {
      for (let k of j.thingPropertyValueVoList) {
        const setItem = () => {
          if (k.thingPropertyCode === DEVICESTATE) {
            stateImg = getThingStateImg(k.value, thingEntity);
          }
          return {
            ...k,
            thingEntity,
            thingCode: data[i].thingCode,
            thingInstId: data[i].thingInstId,
            stateImg,
          };
        };
        if (pcs && pcs.length > 0) {
          if (pcs.includes(k.thingPropertyCode)) {
            pointCodeRecord[i][k.thingPropertyCode] = setItem();
          }
        } else {
          pointCodeRecord[i][k.thingPropertyCode] = setItem();
        }
      }
    }
  }

  return pointCodeRecord;
};

/**
 * @description 查询历史数据
 * @param params 请求参数
 */
export type requestPrePointVoList = {
  pointCode: string;
  thingPropertyId: string | null;
  thingPropertyInstId: string | null;
};

// 历史数据查询时间范围参数
export type Downsample = {
  timeNum: number;
  timeUnit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  aggregator:
    | "AVG"
    | "MIN"
    | "MAX"
    | "SUM"
    | "COUNT"
    | "FIRST"
    | "LAST"
    | "AVGALL"
    | "INTERP";
};

/**
 * @description  根据设备状态获取设备状态图片
 */
export const getThingStateImg = (v: string | number, d: ThingEntity) => {
  switch (v) {
    case "0":
      return d.img2dPoweroff;
    case "1":
      return d.img2dRun;
    case "2":
      return d.img2dAlarm;
    case "3":
      return d.img2dPoweron;
    case 0:
      return d.img2dPoweroff;
    case 1:
      return d.img2dRun;
    case 2:
      return d.img2dAlarm;
    case 3:
      return d.img2dPoweron;
    default:
      return d.img2dPoweroff;
  }
};

/**
 * @description  根据PC 过滤物实例属性信息
 * @param res 元数据 Record<string, thingInstanceDetail>
 * @param pcs 设备实例属性code
 */
export const filterThingInstanceDetailByPc = async (
  res: Record<string, thingInstanceDetail>,
  pcs: Array<string>
) => dataToPointCode(res, pcs);
