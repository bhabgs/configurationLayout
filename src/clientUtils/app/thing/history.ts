import { getHistoryData } from "../../api/thing.api";
import {
  RequestParams,
  dataToPointCode,
  requestPrePointVoList,
  Downsample,
} from "../../utils";
import { getThingInstanceDetail } from "./thingDetail";

export type historyDataList = {
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
export const createGetHistoryData = async (
  codes: Array<string>,
  pcs: Array<string>,
  params: RequestParams
) => {
  const data = await getThingInstanceDetail(codes, params, "code");

  const instanceData = dataToPointCode(data, pcs);
  // 组装成无模型历史数据接口可用数据
  const requestPrePointVoList: Array<requestPrePointVoList> = [];
  for (let i in instanceData) {
    for (let j in instanceData[i]) {
      if (instanceData[i][j].pointCode) {
        requestPrePointVoList.push({
          pointCode: instanceData[i][j].pointCode,
          thingPropertyId: instanceData[i][j].thingPropertyId,
          thingPropertyInstId: instanceData[i][j].thingPropertyInstId,
        });
      }
    }
  }

  return async (startTime: string, endTime: string, downsample: Downsample) => {
    const historyData = await getHistoryData({
      requestPrePointVoList,
      startTime,
      endTime,
      downsample,
    });
    for (let i of historyData) {
      for (let j in instanceData) {
        for (let k in instanceData[j]) {
          instanceData[j][k].historyDataList = i.historyDataList || [];
        }
      }
    }
    return instanceData;
  };
};
