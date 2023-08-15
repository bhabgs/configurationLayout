import * as G2 from '@antv/g2';

declare const _default: () => string;

/**
 * pointCode 参数结构
 */
declare const DEVICESTATE = "DEVICE_STATE";
interface POINTCODE extends thingPropertyValueVoList {
    value: string;
    unit: string;
    groupName?: string;
    historyDataList?: Array<any>;
    thingEntity?: ThingEntity;
    thingCode?: string;
    thingInstId?: string;
    stateImg?: string;
}
interface thingPropertyValueVoList {
    alarmAvailable: Boolean;
    alarmId: string;
    colorTrans: string;
    colspan: number;
    displayType: string;
    displayValue: string;
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
declare enum propertyType {
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
    SETTING = "SETTING"
}
type detailGroupList = {
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
interface ThingEntity {
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
interface thingInstanceDetail {
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
}
interface RequestParams {
    token?: string;
    requestType: string | null;
    thingCode: string | null;
    functionCode: "web" | "topo";
}
declare const paramsToString: (obj: Record<string, any>) => any;
declare const resetHeader: (token: string | undefined) => {
    token: string;
    "Content-Type": string;
};
declare const filterDataByEventEnable: (data: thingInstanceDetail) => thingInstanceDetail;
declare const dataToPointCode: (data: Record<string, thingInstanceDetail>, pcs?: Array<string>) => Record<string, Record<string, POINTCODE>>;
/**
 * @description 查询历史数据
 * @param params 请求参数
 */
type requestPrePointVoList = {
    pointCode: string;
    thingPropertyId: string | null;
    thingPropertyInstId: string | null;
};
type Downsample = {
    timeNum: number;
    timeUnit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
    aggregator: "AVG" | "MIN" | "MAX" | "SUM" | "COUNT" | "FIRST" | "LAST" | "AVGALL" | "INTERP";
};
/**
 * @description  根据PC 过滤物实例属性信息
 * @param res 元数据 Record<string, thingInstanceDetail>
 * @param pcs 设备实例属性code
 */
declare const filterThingInstanceDetailByPc: (res: Record<string, thingInstanceDetail>, pcs: Array<string>) => Promise<Record<string, Record<string, POINTCODE>>>;

declare const utils_DEVICESTATE: typeof DEVICESTATE;
type utils_Downsample = Downsample;
type utils_POINTCODE = POINTCODE;
type utils_RequestParams = RequestParams;
type utils_ThingEntity = ThingEntity;
declare const utils_dataToPointCode: typeof dataToPointCode;
type utils_detailGroupList = detailGroupList;
declare const utils_filterDataByEventEnable: typeof filterDataByEventEnable;
declare const utils_filterThingInstanceDetailByPc: typeof filterThingInstanceDetailByPc;
declare const utils_paramsToString: typeof paramsToString;
type utils_propertyType = propertyType;
declare const utils_propertyType: typeof propertyType;
type utils_requestPrePointVoList = requestPrePointVoList;
declare const utils_resetHeader: typeof resetHeader;
type utils_thingInstanceDetail = thingInstanceDetail;
type utils_thingPropertyValueVoList = thingPropertyValueVoList;
declare namespace utils {
  export {
    utils_DEVICESTATE as DEVICESTATE,
    utils_Downsample as Downsample,
    utils_POINTCODE as POINTCODE,
    utils_RequestParams as RequestParams,
    utils_ThingEntity as ThingEntity,
    _default as createId,
    utils_dataToPointCode as dataToPointCode,
    utils_detailGroupList as detailGroupList,
    utils_filterDataByEventEnable as filterDataByEventEnable,
    utils_filterThingInstanceDetailByPc as filterThingInstanceDetailByPc,
    utils_paramsToString as paramsToString,
    utils_propertyType as propertyType,
    utils_requestPrePointVoList as requestPrePointVoList,
    utils_resetHeader as resetHeader,
    utils_thingInstanceDetail as thingInstanceDetail,
    utils_thingPropertyValueVoList as thingPropertyValueVoList,
  };
}

type historyDataList = {
    alarmFlag: boolean;
    formatValue: string;
    lastScanTIme: string;
    lastValue: number;
    originValue: number;
    prePointCode: string;
    saveTime: string;
    scanTIme: string;
    state: number;
};
/**
 * @description 创建历史数据查询任务
 * @param codes 设备实例code
 * @param pcs 设备实例属性code
 * @param params 请求参数
 * @returns (* @param startTime 开始时间，@param endTime 结束时间， @param downsample 间隔时间Downsample) => 历史数据
 */
declare const createGetHistoryData: (codes: Array<string>, pcs: Array<string>, params: RequestParams) => Promise<(startTime: string, endTime: string, downsample: Downsample) => Promise<Record<string, Record<string, POINTCODE>>>>;

interface DeviceStateData {
    displayValue: string;
    thingCode: string;
    thingInstCode: string;
    thingInstId: string;
    thingPropertyCode: string;
    unit: string;
    value: string;
    stateImg?: string;
}
/**
 * @description 创建设备状态查询 任务
 * @param code 设备实例code
 */
declare const createGetThingInstanceStatus: (code: Array<string>) => Promise<Array<DeviceStateData>>;

/**
 * @description 获取设备实例详细信息
 * @param codes
 * @param params
 * @param Markers
 * @param ff
 * @returns
 */
declare const getThingInstanceDetail: (codes: Array<string>, params: RequestParams, Markers: "id" | "code", filterDataByEventEnable?: boolean) => Promise<Record<string, thingInstanceDetail>>;
/**
 * @description  根据设备状态获取设备状态图片
 */
declare const getThingStateImg: (v: string | number, d: POINTCODE) => string;
/**
 * @description 创建查询设备详情方法
 * @param codes
 * @param params
 * @param Markers
 * @param ff  是否过滤无用属性根据eventEnable
 * @returns
 */
declare const createGetThingInstanceDetail: (codes: Array<string>, params: RequestParams, Markers: "id" | "code", ff?: boolean) => any;

declare const thing_DEVICESTATE: typeof DEVICESTATE;
type thing_DeviceStateData = DeviceStateData;
type thing_Downsample = Downsample;
type thing_POINTCODE = POINTCODE;
type thing_RequestParams = RequestParams;
type thing_ThingEntity = ThingEntity;
declare const thing_createGetHistoryData: typeof createGetHistoryData;
declare const thing_createGetThingInstanceDetail: typeof createGetThingInstanceDetail;
declare const thing_createGetThingInstanceStatus: typeof createGetThingInstanceStatus;
declare const thing_dataToPointCode: typeof dataToPointCode;
type thing_detailGroupList = detailGroupList;
declare const thing_filterDataByEventEnable: typeof filterDataByEventEnable;
declare const thing_filterThingInstanceDetailByPc: typeof filterThingInstanceDetailByPc;
declare const thing_getThingInstanceDetail: typeof getThingInstanceDetail;
declare const thing_getThingStateImg: typeof getThingStateImg;
type thing_historyDataList = historyDataList;
declare const thing_paramsToString: typeof paramsToString;
type thing_propertyType = propertyType;
declare const thing_propertyType: typeof propertyType;
type thing_requestPrePointVoList = requestPrePointVoList;
declare const thing_resetHeader: typeof resetHeader;
type thing_thingInstanceDetail = thingInstanceDetail;
type thing_thingPropertyValueVoList = thingPropertyValueVoList;
declare namespace thing {
  export {
    thing_DEVICESTATE as DEVICESTATE,
    thing_DeviceStateData as DeviceStateData,
    thing_Downsample as Downsample,
    thing_POINTCODE as POINTCODE,
    thing_RequestParams as RequestParams,
    thing_ThingEntity as ThingEntity,
    thing_createGetHistoryData as createGetHistoryData,
    thing_createGetThingInstanceDetail as createGetThingInstanceDetail,
    thing_createGetThingInstanceStatus as createGetThingInstanceStatus,
    _default as createId,
    thing_dataToPointCode as dataToPointCode,
    thing_detailGroupList as detailGroupList,
    thing_filterDataByEventEnable as filterDataByEventEnable,
    thing_filterThingInstanceDetailByPc as filterThingInstanceDetailByPc,
    thing_getThingInstanceDetail as getThingInstanceDetail,
    thing_getThingStateImg as getThingStateImg,
    thing_historyDataList as historyDataList,
    thing_paramsToString as paramsToString,
    thing_propertyType as propertyType,
    thing_requestPrePointVoList as requestPrePointVoList,
    thing_resetHeader as resetHeader,
    thing_thingInstanceDetail as thingInstanceDetail,
    thing_thingPropertyValueVoList as thingPropertyValueVoList,
  };
}

declare const clientUtils: {
    http: {};
    G2: typeof G2;
    thing: typeof thing;
    utils: typeof utils;
};

export { clientUtils as default };
