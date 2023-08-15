import { defineComponent, onMounted, ref } from "vue";
import CardHeaderSmall from "./components/cardHeaderSmall";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import defaultcardfrom from "@/component/card";
import thickenerPng from "../../../assets/imgs/thickener.svg";
import quickOpeningFilterPressPng from "../../../assets/imgs/quickOpeningFilterPress.svg";
import { getRunningState, getThingPropertyValue, objItfc } from "./util";
import { InjectDeveiceCodeGetDetailByPc } from "../tp-bundle/index.es.js";
import { thingInstanceCodes, thingPropertyCodes } from "./config";
import { usePoolingReq } from "inl-ui/dist/hooks";
import utils from "../clientUtils/index.js";
import _ from "lodash";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "辅助系统",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "辅助系统",
  pageControlId: "inl-card-auxiliarySystem",
  code: "pcCard",
  tags: [],
});

const AuxiliarySystem = defineComponent({
  name: cardCompInfo.cname,
  props: Props,
  components: {
    cardBody,
    cardHead,
    defaultcardfrom,
    CardHeaderSmall,
  },
  setup(props, ctx) {
    const getDeviceDetail = ref<Function>();
    const deviceDetail = ref<objItfc>({});

    onMounted(async () => {
      // 根据设备Code 注入查询设备详情方法（负责首次查询多个设备的详细信息，获取pointCode，value） -- 全量
      const getDeviceDetail = await utils.thing.createGetThingInstanceDetail(
        thingInstanceCodes,
        {
          requestType: null,
          thingCode: null,
          functionCode: "web",
        },
        "code"
      );
      usePoolingReq(
        async () => {
          if (getDeviceDetail) {
            const res = await getDeviceDetail(thingPropertyCodes);
            deviceDetail.value = res;
          }
        },
        () => true,
        10000
      );
    });
    return () => (
      <defaultcardfrom
        {...props}
        vSlots={{
          cardBody: () => (
            <cardBody
              {...props}
              vSlots={{
                /**
                 * @description 自定义卡片主体
                 * @returns JSX.Element 渲染结果
                 */
                customCardBody: () => (
                  <div class="auxiliarySystem">
                    <div class="auxiliarySystem-item">
                      <CardHeaderSmall title="浓缩系统"></CardHeaderSmall>
                      <div class="auxiliarySystem-item-body concentrate">
                        <div class="concentrate-item">
                          <div class="concentrate-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "601",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || thickenerPng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="concentrate-item-right">
                            <span class="concentrate-item-name">601浓缩机</span>
                            <div class="valueInfo">
                              <div class="concentrate-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "601",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "601",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              <div class="concentrate-item-value">
                                <span class="label">
                                  底流浓度(
                                  {_.get(deviceDetail.value, [
                                    "601",
                                    "R_CONCENTRATION",
                                    "unit",
                                  ])}
                                  )：
                                </span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "601",
                                    "R_CONCENTRATION",
                                    "value",
                                  ])}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="concentrate-item">
                          <div class="concentrate-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "602",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || thickenerPng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="concentrate-item-right">
                            <span class="concentrate-item-name">602浓缩机</span>
                            <div class="valueInfo">
                              <div class="concentrate-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "602",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "602",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              <div class="concentrate-item-value">
                                <span class="label">
                                  底流浓度(
                                  {_.get(deviceDetail.value, [
                                    "602",
                                    "R_CONCENTRATION",
                                    "unit",
                                  ])}
                                  )：
                                </span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "602",
                                    "R_CONCENTRATION",
                                    "value",
                                  ])?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="auxiliarySystem-item">
                      <CardHeaderSmall title="压滤系统"></CardHeaderSmall>
                      <div class="auxiliarySystem-item-body filterPress">
                        <div class="filterPress-item">
                          <div class="filterPress-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "854",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || quickOpeningFilterPressPng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="filterPress-item-right">
                            <span class="filterPress-item-name">
                              854中煤压滤机
                            </span>
                            <div class="valueInfo">
                              <div class="filterPress-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "854",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "854",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              <div class="filterPress-item-value">
                                <span class="label">日处理板数：</span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "854",
                                    "PLATE_TOTLE_CNT",
                                    "value",
                                  ])?.toFixed(0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="filterPress-item">
                          <div class="filterPress-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "835",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || quickOpeningFilterPressPng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="filterPress-item-right">
                            <span class="filterPress-item-name">
                              835中煤压滤机
                            </span>
                            <div class="valueInfo">
                              <div class="filterPress-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "835",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "835",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              <div class="filterPress-item-value">
                                <span class="label">日处理板数：</span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "835",
                                    "PLATE_TOTLE_CNT",
                                    "value",
                                  ])?.toFixed(0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="filterPress-item">
                          <div class="filterPress-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "624X",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || quickOpeningFilterPressPng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="filterPress-item-right">
                            <span class="filterPress-item-name">
                              624X尾煤压滤机
                            </span>
                            <div class="valueInfo">
                              <div class="filterPress-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "624X",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "624X",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              <div class="filterPress-item-value">
                                <span class="label">日处理板数：</span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "624X",
                                    "PLATE_TOTLE_CNT",
                                    "value",
                                  ])?.toFixed(0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              }}
            />
          ),
        }}
      />
    );
  },
});

/**
 * 卡片定义
 */
export default cardDefComponent(AuxiliarySystem, cardCompInfo);
