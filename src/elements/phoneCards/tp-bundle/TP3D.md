##  查询设备状态（物模型 V2）
``` ts


type InsTance = {
  /**
   * 设备详情组
   */
  detailGroupList: Array<detailGroupList>;
  functionCode: "WEB";
  listPropertyList: any;
  /**
   * 物模型Code
   */
  thingCode: string;
  thingInstId: string;
  thingInstName: string;
  thingInstPhoto: string;
  thingName: string;
  /**
   * 设备实例
   */
  thingInstEntity: {
    catalogCode: string | null;
    code: string;
    createTime: string;
    createUser: string | null;
    id: string;
    name: string;
    photo: string;
    thingCode: string;
    updateTime: string;
    updateUser: string;
  };
};

type detailGroupList = {
  /**
   * 设备详情组名称
   */
  groupName: string;
  /**
   * 设备详情组类型
   */
  groupType: string;
  /**
   * 设备详情组属性列表
   */
  thingPropertyValueVoList: Array<{
    alarmAvailable: Boolean;
    alarmId: string;
    colorTrans: string;
    colspan: number;
    displayType: string;
    displayValue: string;
    eventEnable: Boolean;
    /**
     * 属性label名称
     */
    label: string;
    linkUrl: null;
    listInfo: "";
    listType: "";
    /**
     * 是否需要颜色转换
     */
    needColorTrans: Boolean;
    needLink: Boolean;
    pointCode: null;
    pointCode2: null;
    /**
     * 属性类型
     */
    propertyType: string;
    /**
     * 刷新频率
     */
    refresh: null;
    /**
     * 关联属性code
     */
    relationThingCode: null;
    /**
     * 是否必填
     */
    selectRequest: Boolean;
    /**
     * 属性排序
     */
    sort: number;
    /**
     * 属性code
     */
    thingPropertyCode: string;
    /**
     * 属性id
     */
    thingPropertyId: string;
    /**
     * 属性实例id
     */
    thingPropertyInstId: null;
    /**
     * 属性名称
     */
    thingPropertyName: string;
    /**
     * 属性单位
     */
    unit: null;
    /**
     * 属性值
     */
    value: string | null;
  }>;
};

// 以下是tp 使用代码
import {
  InjectDeviceCodeGetDetail,
  InjectDeviceCodeGetState
} from "./tp-bundle/index.es.js";
  // 根据设备Code 注入查询设备详情方法（负责首次查询多个设备的详细信息，获取pointCode，value） -- 全量
  const getDeviceDetail = await InjectDeviceCodeGetDetail(["3304", "666"]);
  // 查询设备详情（根据pointCode 更新数据）-- 全量
  const deviceDetail = await getDeviceDetail();
  deviceDetail as InsTance;

  // 根据设备code注入设备状态查询方法负 （责首次查询多个设备的状态，获取pointCode，value） 
  const state = await InjectDeviceCodeGetState(["3304"]);
  // 返回设备的状态
  const getState = await state();
  getState = {
    code1: {
      pointCode: '',
      value: ''
    },
    ...,
  }
  // 获取设备关联的摄像头 Array<string>
  const camids = await findRelationEntitiesPage(deviceDetail['3304'])


```