## getAlarmingCamera

> 获取当前正在报警设备关联的相机

#### 示例

```js
const stop = getAlarmingCamera({
  token: 'xxxx', // 调接口需要token
  delay: 3000, // 轮询间隔 默认5000毫秒
  /**
   * 当有新的报警时回调
   * @param cameraList 报警及相机列表
   * @param alarmList 报警信息
   */
  onChange(cameraList, alarmList) {
    console.log(cameraList, alarmList)
  }
  // 每次轮询后回调
  onPooling(cameraList, alarmList) {
    console.log(cameraList, alarmList)
  }
})
```

## findAlarmDeviceById

> 根据空间 id 查询，该空间下的报警设备信息

### 示例

```js
import {findAlarmDeviceById} from 'tp-lib';

const res = await findAlarmDeviceById(id: String, token?: String);
```

#### res info

| 参数名           | 描述         |
| ---------------- | ------------ |
| parentInstanceId | 父级实例 ID  |
| thingType        | 物模型类型   |
| instanceId       | 设备实例 ID  |
| instanceName     | 设备实例名称 |
| instanceCode     | 设备实例编码 |
| thingCode        | 物模型编码   |

## playOneWebRtcMt

> 传入相机 uuid 和 video dom 播放视频
> <font color="red">注意：video 一定要加 auto muted</font>

### 示例

```html
<video id="videoPlayer" autoplay muted></video>
```

```js
import { playOneWebRtcMt } from "tp-lib";

const res = await playOneWebRtcMt(uuid: string, domId: string, dom?: Document, token?: string);
```

#### param info

| 参数名 | 描述                         |
| ------ | ---------------------------- |
| uuid   | 摄像头 uuid                  |
| domId  | video 标签 id                |
| dom    | 可直接传入 dom 覆盖 id       |
| token  | 用于请求相机详情的服务 token |

## getDeviceList（获取设备详细信息）

```ts
import { getDeviceList } from "tp-lib";

getDeviceList(deviceIds: string[], token?: string).then(res => {
  log(res);
})
```

##  查询设备状态（物模型 V2）
``` ts

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
    /**
     * 属性长度
     */
    linkUrl: null;
    /**
     * 属性长度
     */
    listInfo: "";
    /**
     * 属性类型
     */
    listType: "";
    /**
     * 是否需要报警
     */
    needColorTrans: Boolean;
    /**
     * 是否需要跳转
     */
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
import {
  InjectDeviceCodeGetDetail,
  InjectDeviceCodeGetState,
  findRelationEntitiesPage
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

