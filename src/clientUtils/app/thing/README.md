# 物模型相关方法代码
> `import {} from 'clientUtils'` 内 `clientUtils` 为存放工具代码位置

## 一、物模型

## 二、物实例

### 2.1 物实例详情
> 物实例详情接口会返回，物实例的所有信息以及对应物模型的信息

``` ts
// 导出 物模型方法
import { thing } from 'clientUtils';

const getData = async () => {
    const get = await thing.getThingInstanceDetail({
        codes: [codes], 
        params:{
            requestType: null,
            thingCode: null,
            functionCode: "web"
        }, 
        markers: 'code', 
    false
    });

    const thingInstanceDetail = await get();
    // 继续调用 get 方法，将会持续查询 设备 proptypeCodes 的值
    setInterval(() => {
        get().then(res => {
            console.log(res)
        })
    }, 3000)
}
```
#### `thing.getThingInstanceDetail(codes: Array<string>,params: RequestParams,markers: "id" | "code",filterDataByEventEnable?: boolean)` 参数说明


| 参数名                  | 默认值                                   | 范围                      | 描述       |
| ----------------------- | ---------------------------------------- | ------------------------- | ---------- |
| codes                   | []                                       | Array<string>             | 物实例code |
| params                  | [RequestParams](#requestparams-参数说明) | `functionCode<web, topo>` | 查询表单   |
| markers                 | code                                     | `id,code`                 | 查询方案   |
| filterDataByEventEnable |

#### `RequestParams` 参数说明
  
| 参数名       | 默认值    | 范围        | 描述                            |
| ------------ | --------- | ----------- | ------------------------------- |
| token        | undefined | string      | 系统用户token（平台外使用必传） |
| requestType  | null      | string      | 请求类型                        |
| thingCode    | null      | string      | 物模型code                      |
| functionCode | web       | `web、topo` | 查询                            |
## 设备状态
> 查询设备状态
>

```ts
// 导出 物模型方法
import { thing } from 'clientUtils';
const states = await thing.getThingInstanceStatus(code: Array<string>);

```

* `code` 参数说明


| 参数名 | 默认值 | 范围            | 描述            |
| ------ | ------ | --------------- | --------------- |
| code   | []     | `Array<string>` | 物实例code list |


## 历史数据