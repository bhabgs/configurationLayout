import { historyDataList } from "../app/thing/history";
import {
  Downsample,
  RequestParams,
  paramsToString,
  requestPrePointVoList,
  resetHeader,
} from "../utils";

/**
 * @description 查询历史数据 (设备属性)
 * @param params
 * @returns 历史数据
 */
export interface getHistoryDataParams {
  requestPrePointVoList: Array<requestPrePointVoList>; // 设备属性code
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  downsample: Downsample; // 间隔时间
}
export const getHistoryData: (params: getHistoryDataParams) => Promise<
  Array<{
    historyDataList: Array<historyDataList>;
    instanceCode: null;
    pointCode: string;
    propertyCode: null;
    thingPropertyInstId: string;
  }>
> = async (params) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingInst/queryHistoryData",
    {
      method: "POST",
      headers: resetHeader(undefined),
      body: JSON.stringify(params),
    }
  );
  const res = await resPromise.json();
  return res.data;
};

/**
 * @description 报警历史数据查询
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param instanceUuidList Array<string> 设备实例uuid
 */
export const getAlarmHistoryData = async (
  startTime: string,
  endTime: string,
  instanceUuidList: Array<string>
) => {
  const resPromise = await fetch("/api/alarmlite/v1/record/list/withoutPage", {
    method: "POST",
    headers: resetHeader(undefined),
    body: JSON.stringify({
      startTime,
      endTime,
      instanceUuidList,
    }),
  });
  const res = await resPromise.json();
  return res.data;
};

/**
 * @description 获取设备实例详细信息查询任务
 * @param codes 设备实例code
 * @param params 请求参数
 * @param filterDataByEventEnable 是否过滤无用属性根据eventEnable
 * @returns thingInstanceDetail 设备实例详细信息
 */
export const getThingInstanceDetailByCode: (
  codes: Array<string>,
  params: RequestParams
) => Promise<Response> = async (codes, params) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingInst/findByCodeList?" + paramsToString(params),
    {
      method: "POST",
      headers: resetHeader(params.token),
      body: JSON.stringify(codes),
    }
  );
  return resPromise;
};

/**
 * @description 创根据id查询设备实例详细信息
 * @param codes
 * @param params
 * @returns
 */
export const getThingInstanceDetailByUuid: (
  codes: Array<string>,
  params: RequestParams,
  filterDataByEventEnable?: boolean
) => Promise<Response> = async (codes, params) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingInst/findByInstanceIdList?" +
      paramsToString(params),
    {
      method: "POST",
      headers: resetHeader(params.token),
      body: JSON.stringify(codes),
    }
  );
  return resPromise;
};

/**
 * @description 通过 模型Code+实例Code+属性Code 查询点位数据信息
 * @param params
 */
export interface RequestPointParams {
  thingCode?: string;
  thingInstCode: string;
  thingInstId?: string;
  thingPropertyCode: string;
  value?: string;
}
export const getThingInstancePointData = async (
  arr: Array<RequestPointParams>
): Promise<
  Array<{
    displayValue: string | boolean | number;
    thingCode: string;
    thingInstCode: string;
    thingInstId: string;
    thingPropertyCode: string;
    unit: string;
    value: string;
  }>
> => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingClient/getPropertiesValueByCode",
    {
      method: "POST",
      headers: resetHeader(undefined),
      body: JSON.stringify(arr),
    }
  );

  const res = await resPromise.json();
  return res.data;
};

/**
 * @description 通过 模型Code+实例Code+属性Code 下发信号
 * @param params
 */
export const setThingInstancePointData = async (
  arr: Array<RequestPointParams>
) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingClient/downloadPropertiesValue",
    {
      method: "POST",
      headers: resetHeader(undefined),
      body: JSON.stringify(arr),
    }
  );

  const res = await resPromise.json();
  return res.data;
};
/**
 * @description 根据pointCode更新数据（批量）
 * @param pointCodes
 */
export const updateDataByPointCode = async (
  pointCodes: Array<{ pointCode: string; value: any }>,
  token?: string
) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingInst/reloadPropertiesValue",
    {
      method: "POST",
      headers: resetHeader(token),
      body: JSON.stringify(pointCodes),
    }
  );

  const res = await resPromise.json();
  return res;
};

/**
 * @description 查询逻辑属性和报警属性的时时值
 */
export interface RequestLogicPropertyList {
  thingCode: string;
  thingInstCode: string;
  thingInstId: string;
  thingPropertyCode: string;
  value: any;
}
export interface RequestAlarmPropertyList {}
export const getThingInstanceLogicAndAlarm = async (
  requestAlarmPropertyList: Array<RequestAlarmPropertyList>,
  requestLogicPropertyList: Array<RequestLogicPropertyList>
) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingInst/reloadLogicAndAlarm",
    {
      method: "POST",
      headers: resetHeader(undefined),
      body: JSON.stringify([
        ...requestAlarmPropertyList,
        ...requestLogicPropertyList,
      ]),
    }
  );

  const res = await resPromise.json();
  return res;
};
