import { platformListType } from "..";
import { getInstance } from "./axios";

let instance = getInstance({});
// 事件下发
export const sendEvent = async (params: {
  id: string;
  pageId: string;
  pageControlId: string;
  eventCode: string;
  param?: unknown;
}) => await instance.post("/appCenter/v1/eventInvoke", params);

// 获取所有实例化卡片
export const getAllCard = async (opt: {
  availiable?: string;
  clientType?: platformListType;
}) => {
  const { availiable } = opt;
  const { data } = await instance.get(
    "/appCenter/v1/getControlInstItemsNoPage" + `?availiable=${availiable}` // &clientType=${clientType}
  );
  return data;
};

// 下发弹窗信号
export const sendDialog = async (params: {
  pageId: string;
  code: string;
  result: boolean;
}) => await instance.post("/appCenter/v1/dialogResult", params);
