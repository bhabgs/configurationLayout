import {
  RequestPointParams,
  getThingInstancePointData,
} from "../../api/thing.api";
import { DEVICESTATE } from "../../utils";

export interface DeviceStateData {
  displayValue: string | number | boolean;
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
export const getThingInstanceStatus = async (
  code: Array<string>
): Promise<Record<string, DeviceStateData>> => {
  const params: Array<RequestPointParams> = [];
  const res: Record<string, DeviceStateData> = {};
  for (let i of code) {
    params.push({
      thingInstCode: i,
      thingPropertyCode: DEVICESTATE,
    });
  }
  const instanceDetail = await getThingInstancePointData(params);

  for (let i of instanceDetail) {
    res[i.thingInstCode] = i;
  }
  return res;
};
