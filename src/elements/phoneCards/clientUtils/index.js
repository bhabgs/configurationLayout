import * as G2 from '@antv/g2';

var createId = (() => {
  // 创建唯一id
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
      v = c === "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
});

/**
 * pointCode 参数结构
 */
const DEVICESTATE = "DEVICE_STATE";
// 属性分类
var propertyType;
(function (propertyType) {
  /**
   * unknown
   * */
  propertyType["NONE"] = "NONE";
  /**
   * 物实例属性
   * */
  propertyType["ATTRIBUTE"] = "ATTRIBUTE";
  /**
   * 静态属性
   * */
  propertyType["PROPERTY"] = "PROPERTY";
  /**
   * 动态属性
   * */
  propertyType["METRIC"] = "METRIC";
  /**
   * 动作下发
   * */
  propertyType["ACTION"] = "ACTION";
  /**
   * 下发参数
   * */
  propertyType["PARAMETER"] = "PARAMETER";
  /**
   * 报警属性
   * */
  propertyType["ALARM"] = "ALARM";
  /**
   * 逻辑属性
   * */
  propertyType["LOGIC"] = "LOGIC";
  /**
   * 关系属性
   */
  propertyType["RELATION"] = "RELATION";
  /**
   * 设定参数
   */
  propertyType["SETTING"] = "SETTING";
})(propertyType || (propertyType = {}));
// 把对象转换成url参数
const paramsToString = obj => {
  let arr = [];
  for (let objKey in obj) {
    arr.push(objKey + "=" + obj[objKey]);
  }
  return arr.join("&");
};
// 初始化请求头
const resetHeader = token => {
  const reqToken = token ?? sessionStorage.getItem("token");
  if (!reqToken) {
    throw new Error("没有token，不能获取");
  }
  const headers = {
    token: reqToken,
    "Content-Type": "application/json;charset=utf-8"
  };
  return headers;
};
// 过滤无用属性根据eventEnable
const filterDataByEventEnable = data => {
  for (let i of data.detailGroupList) {
    i.thingPropertyValueVoList = i.thingPropertyValueVoList.filter(item => item.eventEnable);
  }
  return data;
};
// 把数据转换成pointCode格式
const dataToPointCode = (data, pcs) => {
  const pointCodeRecord = {};
  for (let i in data) {
    pointCodeRecord[i] = {};
    if (!data[i]) continue;
    const thingEntity = data[i].thingEntity;
    for (let j of data[i].detailGroupList) {
      for (let k of j.thingPropertyValueVoList) {
        const setItem = () => {
          return {
            ...k,
            thingEntity,
            thingCode: data[i].thingCode,
            thingInstId: data[i].thingInstId
          };
        };
        if (pcs && pcs.length > 0) {
          if (pcs.includes(k.thingPropertyCode)) {
            pointCodeRecord[i][k.thingPropertyCode] = setItem();
          }
        } else {
          pointCodeRecord[i][k.thingPropertyCode] = setItem();
        }
        if (k.thingPropertyCode === DEVICESTATE) ;
      }
    }
  }
  return pointCodeRecord;
};
/**
 * @description  根据PC 过滤物实例属性信息
 * @param res 元数据 Record<string, thingInstanceDetail>
 * @param pcs 设备实例属性code
 */
const filterThingInstanceDetailByPc = async (res, pcs) => dataToPointCode(res, pcs);

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEVICESTATE: DEVICESTATE,
    createId: createId,
    dataToPointCode: dataToPointCode,
    filterDataByEventEnable: filterDataByEventEnable,
    filterThingInstanceDetailByPc: filterThingInstanceDetailByPc,
    paramsToString: paramsToString,
    get propertyType () { return propertyType; },
    resetHeader: resetHeader
});

const getHistoryData = async params => {
  const resPromise = await fetch("/api/mtip/thing/v2/thingInst/queryHistoryData", {
    method: "POST",
    headers: resetHeader(undefined),
    body: JSON.stringify(params)
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
const getThingInstanceDetailByCode = async (codes, params) => {
  const resPromise = await fetch("/api/mtip/thing/v2/thingInst/findByCodeList?" + paramsToString(params), {
    method: "POST",
    headers: resetHeader(params.token),
    body: JSON.stringify(codes)
  });
  return resPromise;
};
const getThingInstanceDetailByUuid = async (codes, params) => {
  const resPromise = await fetch("/api/mtip/thing/v2/thingInst/findByInstanceIdList?" + paramsToString(params), {
    method: "POST",
    headers: resetHeader(params.token),
    body: JSON.stringify(codes)
  });
  return resPromise;
};
const getThingInstancePointData = async arr => {
  const resPromise = await fetch("/api/mtip/thing/v2/thingClient/getPropertiesValueByCode", {
    method: "POST",
    headers: resetHeader(undefined),
    body: JSON.stringify(arr)
  });
  const res = await resPromise.json();
  return res.data;
};

/**
 * @description 获取设备实例详细信息
 * @param codes
 * @param params
 * @param Markers
 * @param ff
 * @returns
 */
const getThingInstanceDetail = async (codes, params, Markers, ff) => {
  let resPromise;
  if (Markers === "id") {
    resPromise = await getThingInstanceDetailByUuid(codes, params);
  } else {
    resPromise = await getThingInstanceDetailByCode(codes, params);
  }
  const refhCodes = {};
  const res = await resPromise.json();
  if (!res.data) return refhCodes;
  for (let i of codes) {
    refhCodes[i] = null;
    for (let instance of res.data) {
      if (instance.thingInstCode === i) {
        refhCodes[i] = !ff ? instance : filterDataByEventEnable(instance);
      }
    }
  }
  return refhCodes;
};
/**
 * @description  根据设备状态获取设备状态图片
 */
const getThingStateImg = (v, d) => {
  switch (v) {
    case "0":
      return d.thingEntity.img2dPoweroff;
    case "1":
      return d.thingEntity.img2dRun;
    case "2":
      return d.thingEntity.img2dAlarm;
    case "3":
      return d.thingEntity.img2dPoweron;
    case 0:
      return d.thingEntity.img2dPoweroff;
    case 1:
      return d.thingEntity.img2dRun;
    case 2:
      return d.thingEntity.img2dAlarm;
    case 3:
      return d.thingEntity.img2dPoweron;
    default:
      return d.thingEntity.img2dPoweroff;
  }
};
/**
 * @description 创建查询设备详情方法
 * @param codes
 * @param params
 * @param Markers
 * @param ff  是否过滤无用属性根据eventEnable
 * @returns
 */
const createGetThingInstanceDetail = async (codes, params, Markers, ff) => {
  const data = await getThingInstanceDetail(codes, params, Markers, ff);
  const pointData = dataToPointCode(data || {});
  let firstLoading = false;
  return async proptypeCodes => {
    // 标记一下首次用 第一次加载数据，防止重复调用查询
    if (!firstLoading) {
      firstLoading = true;
      return pointData;
    }
    // 记录所有的pointCode
    const pointCodes = [];
    // 遍历所有的数据，获取pointCode
    for (let i in pointData) {
      for (let n in pointData[i]) {
        const item = pointData[i][n];
        if (proptypeCodes.indexOf(item.thingPropertyCode) !== -1) {
          pointCodes.push({
            thingCode: item.thingCode,
            thingInstCode: i,
            thingPropertyCode: n,
            thingInstId: item.thingInstId
          });
        }
      }
    }
    const thingInstancePointData = await getThingInstancePointData(pointCodes);
    for (let item of thingInstancePointData || []) {
      const {
        thingInstCode,
        thingPropertyCode
      } = item;
      const propertyItem = pointData[thingInstCode][thingPropertyCode];
      if (pointData[thingInstCode] && propertyItem) {
        // 过滤相关图片
        if (thingPropertyCode === DEVICESTATE) {
          const stateImg = getThingStateImg(item.value, propertyItem);
          propertyItem.stateImg = stateImg;
        }
        propertyItem.value = item.value;
      }
    }
    return pointData;
  };
};

/**
 * @description 创建历史数据查询任务
 * @param codes 设备实例code
 * @param pcs 设备实例属性code
 * @param params 请求参数
 * @returns (* @param startTime 开始时间，@param endTime 结束时间， @param downsample 间隔时间Downsample) => 历史数据
 */
const createGetHistoryData = async (codes, pcs, params) => {
  const data = await getThingInstanceDetail(codes, params, "code");
  const instanceData = dataToPointCode(data, pcs);
  // 组装成无模型历史数据接口可用数据
  const requestPrePointVoList = [];
  for (let i in instanceData) {
    for (let j in instanceData[i]) {
      if (instanceData[i][j].pointCode) {
        requestPrePointVoList.push({
          pointCode: instanceData[i][j].pointCode,
          thingPropertyId: instanceData[i][j].thingPropertyId,
          thingPropertyInstId: instanceData[i][j].thingPropertyInstId
        });
      }
    }
  }
  return async (startTime, endTime, downsample) => {
    const historyData = await getHistoryData({
      requestPrePointVoList,
      startTime,
      endTime,
      downsample
    });
    // 根据
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

/**
 * @description 创建设备状态查询 任务
 * @param code 设备实例code
 */
const createGetThingInstanceStatus = async code => {
  const params = [];
  for (let i of code) {
    params.push({
      thingInstCode: i,
      thingPropertyCode: DEVICESTATE
    });
  }
  const instanceDetail = await getThingInstancePointData(params);
  return instanceDetail;
};

var thing = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEVICESTATE: DEVICESTATE,
    createGetHistoryData: createGetHistoryData,
    createGetThingInstanceDetail: createGetThingInstanceDetail,
    createGetThingInstanceStatus: createGetThingInstanceStatus,
    createId: createId,
    dataToPointCode: dataToPointCode,
    filterDataByEventEnable: filterDataByEventEnable,
    filterThingInstanceDetailByPc: filterThingInstanceDetailByPc,
    getThingInstanceDetail: getThingInstanceDetail,
    getThingStateImg: getThingStateImg,
    paramsToString: paramsToString,
    get propertyType () { return propertyType; },
    resetHeader: resetHeader
});

const clientUtils = {
  http: {},
  G2,
  thing,
  utils
};

export { clientUtils as default };
