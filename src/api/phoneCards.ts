import { Method } from "axios";
import { instance } from "./axios";

const apiData: {
  [key: string]: string;
} = {
  getAggQuery: `data/v1/history/aggQuery`, // 数仓统计数据查询
  getLast: `data/v1/history/last`, // 获取最后数据
  getScheduleInfoByDeptAndTime: `schedulePlan/v1/info/getPlanWorkGroupByDeptAndTime`, // 获取班组信息
};

const getData = async (method: Method = "post", key: string, data?: any) => {
  const res: any = await instance({
    method,
    url: apiData[key],
    ...(method === "post" ? { data } : { params: data }),
  });
  if (res.data) {
    return res.data;
  }
};

export default getData;
