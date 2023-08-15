import {
  RequestParams,
  filterDataByEventEnableFun,
  thingInstanceDetail,
  dataToPointCode,
  DEVICESTATE,
  getThingStateImg,
} from "../../utils";
import {
  RequestPointParams,
  getThingInstanceDetailByCode,
  getThingInstanceDetailByUuid,
  getThingInstancePointData,
} from "../../api/thing.api";

/**
 * @description 获取设备实例详细信息
 * @param codes 设备实例code
 * @param params 请求参数
 * @param Markers 标记是通过id还是code查询
 * @param filterDataByEventEnable 是否过滤无用属性根据eventEnable
 * @returns
 */
export const getThingInstanceDetail: (
  codes: Array<string>,
  params: RequestParams,
  Markers: "id" | "code",
  filterDataByEventEnable?: boolean
) => Promise<Record<string, thingInstanceDetail>> = async (
  codes,
  params,
  Markers,
  ff
) => {
  let resPromise: Response;
  if (Markers === "id") {
    resPromise = await getThingInstanceDetailByUuid(codes, params);
  } else {
    resPromise = await getThingInstanceDetailByCode(codes, params);
  }
  const refhCodes: Record<string, thingInstanceDetail | null> = {};
  const res = (await resPromise.json()) as { data: thingInstanceDetail[] };
  if (!res.data) return refhCodes;
  for (let i of codes) {
    refhCodes[i] = null;
    for (let instance of res.data) {
      if (instance.thingInstCode === i) {
        refhCodes[i] = !ff ? instance : filterDataByEventEnableFun(instance);
      }
    }
  }
  return refhCodes;
};

/**
 * @description 创建查询设备详情方法
 * @param codes 设备实例code
 * @param params 请求参数
 * @param proptypeCodes 需要查询的属性code
 * @param Markers 标记是通过id还是code查询
 * @param filterDataByEventEnable  是否过滤无用属性根据eventEnable
 * @returns
 */
export const createGetThingInstanceDetail: (opt: {
  codes: Array<string>;
  params: RequestParams;
  markers: "id" | "code";
  proptypeCodes?: Array<string>;
  filterDataByEventEnable?: boolean;
}) => any = async (opt) => {
  // 导出数据
  const { codes, params, markers, filterDataByEventEnable, proptypeCodes } =
    opt;

  // 获取设备实例详细信息
  const data = await getThingInstanceDetail(
    codes,
    params,
    markers,
    filterDataByEventEnable
  );

  // 转换数据
  const pointData = dataToPointCode(data || {}, proptypeCodes || []);

  // 首次加载
  let firstLoading = false;

  // 返回查询方法
  return async () => {
    // 标记一下首次用 第一次加载数据，防止重复调用查询
    if (!firstLoading) {
      firstLoading = true;
      return pointData;
    }
    // 记录所有的pointCode
    const pointCodes: Array<RequestPointParams> = [];
    // 遍历所有的数据，获取pointCode
    for (let i in pointData) {
      for (let n in pointData[i]) {
        const item = pointData[i][n];
        pointCodes.push({
          thingCode: item.thingCode,
          thingInstCode: i,
          thingPropertyCode: n,
          thingInstId: item.thingInstId,
        });
      }
    }

    const thingInstancePointData = await getThingInstancePointData(pointCodes);

    for (let item of thingInstancePointData || []) {
      const { thingInstCode, thingPropertyCode } = item;
      const propertyItem = pointData[thingInstCode][thingPropertyCode];

      if (pointData[thingInstCode] && propertyItem) {
        // 过滤相关图片
        if (thingPropertyCode === DEVICESTATE) {
          const stateImg = getThingStateImg(
            item.value,
            propertyItem.thingEntity
          );
          propertyItem.stateImg = stateImg;
        }

        // 原始值
        propertyItem.value = item.value;

        // 使用值
        propertyItem.displayValue = item.displayValue;
      }
    }

    return pointData;
  };
};
