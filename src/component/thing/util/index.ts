import * as api from "@/api/thingInstance";
import { ThingIns, ThingPc } from "..";

export const exportFun = (resource: any, name: string) => {
  const blob = new Blob([resource], {
    type: "text/html;charset=UTF-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
// 多对多生成多条数据
export const getTableDataParams: (
  t: Array<ThingIns>,
  p: Array<ThingPc>
) => {
  reqData: Array<{ pc: string; iu: string }>;
  totalData: Array<{ pc: ThingPc; thing: ThingIns }>;
} = (things, pcs) => {
  const reqData = [];
  const totalData = [];
  for (let i of things) {
    for (let pc of pcs) {
      reqData.push({
        pc: pc.code,
        iu: i.id,
      });
      totalData.push({
        pc,
        thing: i,
      });
    }
  }
  return { reqData, totalData };
};
// 根据实例和属性获取表格数据
export const getTableDataByThingAndPc = (data: {
  things: Array<ThingIns>;
  pcs: Array<ThingPc>;
}) => {
  const { reqData, totalData } = getTableDataParams(data.things, data.pcs);
  return {
    totalData,
    async resData() {
      return await api.getDeviceList(reqData);
    },
  };
};
export const triggerModeList = [
  {
    code: "get",
    name: "GET时触发",
  },
  {
    code: "timer",
    name: "定时触发",
  },
  {
    code: "change",
    name: "数据变化时触发",
  },
];
