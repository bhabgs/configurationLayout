import { RequestPointParams } from "@/clientUtils/api/thing.api";
import { resetHeader } from "../clientUtils/utils/index";
import { getInstance } from "./axios";

let instance = getInstance({});

/* 物实例管理 */

/**
 * 获取物实例全部列表-分页
 */
export const indInstList = (data: any) =>
  instance.post("/mtip/thing/v2/thingInst/findPage?functionCode=web", data);

/**
 * 获取物模型tree--findTree
 */
export const listTree = (root_thing_code?: string) =>
  instance.get(
    `/mtip/thing/v2/thing/findTree?root_thing_code=${
      root_thing_code || "THING_ROOT"
    }`
  );

//根据thingCode查询list
export const findPropByCode = (thingCode: string) =>
  instance.get(
    `/mtip/thing/v2/thing/findThingPropertiesByThingCode?thingCode=${thingCode}`
  );

//下发信号
export const setData = (iu, pc, val) =>
  instance.post("/mtip/thing/v2/thingClient/setPropertiesValueById", [
    {
      thingInstId: iu,
      thingPropertyCode: pc,
      value: val,
    },
  ]);

// 批量获取设备信息
export interface getDeviceListParams {
  iu: string;
  pc: string;
}
export const getDeviceList: (
  param: Array<getDeviceListParams>,
  token?: string
) => Promise<
  Array<{
    iu: string;
    pc: string;
    v: string;
    t: number;
    s: number;
    asf: number;
    code: string;
    corpId: string;
    ctx: string;
    dt: string;
    ec: string;
  }>
> = async (param) => {
  const res = await instance.post("/thing/v1/metric/data/getDataList", param);
  return res.data;
};

// 获取阀门状态
export const getValveState: (p: string) => Promise<boolean> = async (iu) => {
  const res = await instance.post("/thing/v1/metric/data/getDataList", [
    {
      iu,
      pc: "TAP_OPEN",
    },
  ]);
  let state: boolean = false;

  if (res.data.length > 0) {
    state = res.data[0].v || false;
  }
  return state;
};

// 根据pointCode 更新数据
export const updateDataByPointCode = async (
  params: Array<{
    pointCode: string;
    value?: string;
  }>
) => {
  return await instance.post(
    "/mtip/thing/v2/thingInst/reloadPropertiesValue",
    params
  );
};

// 保存appcener page
export const savePage = async (params) => {
  const res = await instance.post("/appCenter/v1/savePage", params);
};

// 查询 page
export const findPageById = async (id: string) => {
  const res = await instance.post("/appCenter/v1/getInstByPageId/" + id);
};

// 动态表格 - 根据实例和属性返回表格信息
export const getTableData = async (params: {
  thingCode: string;
  instanceIdList: string[];
  propertyCodeList: string[];
}) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInstAdapter/getTableInfoByInstanceListAndPrpertyCodeList",
    params
  );
  return res.data;
};

// 根据实例信息和属性信息获取pointCode
export const getPointCode = async (params: {
  thingCode: string;
  instanceIdList: string[];
  propertyCodeList: string[];
}) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInstAdapter/getPointCodeByInstanceListAndPrpertyCodeList",
    params
  );
  return res.data;
};

// 通过IU+PC查询点地址和点数据
export const getPointData = async (params: {
  instanceIdList: string[];
  propertyCodeList: string[];
  thingCode: string;
}): Promise<
  Array<{
    instanceId: string;
    propertyIdAndPointInfo: Record<
      string,
      { pointCode: string | null; value: string | boolean }
    >;
  }>
> => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInstAdapter/getPrePointCodeAndValueByIuPC",
    params
  );
  return res.data;
};

// 下发PLC数据值
export const setPLCData = async (params: { pointCode: string; value: any }) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInst/downloadPropertyValue",
    params
  );
  return res.data;
};

// 批量下发PLC数据值
export const setPLCDataList = async (
  params: {
    pointCode: string;
    value: any;
  }[]
) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInst/downloadPropertiesValue",
    params
  );
  return res.data;
};

// 获取PLC数据值
export const getPLCData = async (params: { pointCode: string }) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInst/reloadPropertyValue",
    params
  );
  return res.data;
};

// 批量获取PLC数据值
export const getPLCDataList = async (params: { pointCode: string }[]) => {
  const res = await instance.post(
    "/mtip/thing/v2/thingInst/reloadPropertiesValue",
    params
  );
  return res.data;
};

/**
 * 获取物实例的属性的值 可以查询多个
 */
export const getThingPropertyValue = async (
  data: GetThingPropertyValueParam | GetThingPropertyValueParam[]
) => {
  const reqData = Array.isArray(data) ? data : [data];
  const { data: res } = await instance.post(
    "/mtip/thing/v2/thingClient/getPropertiesValueById",
    reqData
  );
  return Array.isArray(data) ? res : res?.[0];
};

// 事件下发
export const sendEvent = async (params: {
  id: string;
  pageId: string;
  pageControlId: string;
  eventCode: string;
  param?: unknown;
}) => await instance.post("/appCenter/v1/eventInvoke", params);

type GetThingPropertyValueParam = {
  thingCode: string; // 物模型code
  thingInstCode: string; // 物实例code
  thingInstId: string; // 物实例id
  thingInstPropertyCode: string; // 物属性code
};

export const getThingInstancePointData = async (
  arr: Array<RequestPointParams>
): Promise<
  Array<{
    displayValue: string;
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

export const setThingInstancePointData = async (
  arr: Array<RequestPointParams>
) => {
  const resPromise = await fetch(
    "/api/mtip/thing/v2/thingClient/setPropertiesValueById",
    {
      method: "POST",
      headers: resetHeader(undefined),
      body: JSON.stringify(arr),
    }
  );

  const res = await resPromise.json();
  return res.data;
};
