import { getInstance } from "@/api/axios";

let instance = getInstance({});

/**
 * 获取报警列表
 */
export const getAlarmLogList = (data) =>
  instance.post("/alarmlite/v1/record/list", data);
