import { defineComponent, onMounted, ref } from "vue";
import CardHeaderSmall from "./components/cardHeaderSmall";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import defaultcardfrom from "@/component/card";
import cyclonePng from "../../../assets/imgs/cyclone.png";
import flotationMachinePng from "../../../assets/imgs/flotationMachine.svg";
import flotationMachine3Png from "../../../assets/imgs/flotationMachine3.svg";
import pressureFilterPressPng from "../../../assets/imgs/pressureFilterPress.svg";
import quickOpeningFilterPressPng from "../../../assets/imgs/quickOpeningFilterPress.svg";
import { getRunningState, getThingPropertyValue, objItfc } from "./util";
import {
  bucketPositionInformations,
  thingInstanceCodes,
  thingPropertyCodes,
} from "./config";
import { usePoolingReq } from "inl-ui/dist/hooks";
import { limitDecimal } from "inl-ui/dist/utils";
import utils from "../clientUtils/index.js";
import _ from "lodash";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "主洗系统",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "主洗系统",
  pageControlId: "inl-card-mainWashingSystem",
  code: "pcCard",
  tags: [],
});

const MainWashingSystem = defineComponent({
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
    const bucketPositionInformation = ref<Array<objItfc>>([]);
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
            bucketPositionInformation.value = bucketPositionInformations.map(
              (item) => ({
                ...item,
                value: limitDecimal(res[item.code as string]?.["LEVEL"]?.value),
                percentage: limitDecimal(
                  res[item.code as string]?.["M_PERCENT"]?.value
                ),
                unit: res[item.code as string]?.["LEVEL"]?.unit,
              })
            );
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
                  <div class="mainWashingSystem">
                    <div class="mainWashingSystem-item">
                      <CardHeaderSmall title="重介系统"></CardHeaderSmall>
                      <div class="mainWashingSystem-item-body denseMedium">
                        <div class="mainWashingSystem-item-body-top">
                          <div class="mainWashingSystem-item-body-top-left">
                            <div class="imgBox">
                              <img src={cyclonePng} alt="" />
                            </div>
                          </div>
                          <div class="mainWashingSystem-item-body-top-right">
                            <span class="denseMedium-item-name">
                              原煤重介旋流器
                            </span>
                            <div class="valueInfo">
                              <div class="denseMedium-item-value">
                                <span class="label">
                                  给定密度(
                                  {_.get(deviceDetail.value, [
                                    "303X",
                                    "DENSITY_SET",
                                    "unit",
                                  ])}
                                  ))：
                                </span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "303X",
                                    "DENSITY_SET",
                                    "value",
                                  ])}
                                </span>
                              </div>
                              <div class="denseMedium-item-value">
                                <span class="label">
                                  测量密度(
                                  {_.get(deviceDetail.value, [
                                    "303X",
                                    "DENSITY",
                                    "unit",
                                  ])}
                                  )：
                                </span>
                                <span class="value">
                                  {_.get(deviceDetail.value, [
                                    "303X",
                                    "DENSITY",
                                    "value",
                                  ])}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="mainWashingSystem-item-body-bottom">
                          <div class="denseMedium-item-value">
                            <span class="label">
                              累计处理量(
                              {_.get(deviceDetail.value, [
                                "301X",
                                "WEIGHT_TOTAL",
                                "unit",
                              ])}
                              )：
                            </span>
                            <span class="value">
                              {_.get(deviceDetail.value, [
                                "301X",
                                "WEIGHT_TOTAL",
                                "value",
                              ])}
                            </span>
                          </div>
                          <div class="denseMedium-item-value">
                            <span class="label">
                              瞬时带煤量(
                              {_.get(deviceDetail.value, [
                                "301X",
                                "COAL_CAP",
                                "unit",
                              ])}
                              )：
                            </span>
                            <span class="value">
                              {_.get(deviceDetail.value, [
                                "301X",
                                "COAL_CAP",
                                "value",
                              ])}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mainWashingSystem-item">
                      <CardHeaderSmall title="浮选系统"></CardHeaderSmall>
                      <div class="mainWashingSystem-item-body flotation">
                        <div class="flotation-item">
                          <div class="flotation-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "402",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || flotationMachine3Png
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="flotation-item-right">
                            <span class="flotation-item-name">B402浮选机</span>
                            <div class="valueInfo">
                              <div class="flotation-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "402",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "402",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              {/* <div class="flotation-item-value">
                                <span class="label">液位(%)：</span>
                                <span class="value">8.47</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div class="flotation-item">
                          <div class="flotation-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "403",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || flotationMachine3Png
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="flotation-item-right">
                            <span class="flotation-item-name">B403浮选机</span>
                            <div class="valueInfo">
                              <div class="flotation-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "403",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "403",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).name
                                  }
                                </span>
                              </div>
                              {/* <div class="flotation-item-value">
                                <span class="label">液位(%)：</span>
                                <span class="value">8.47</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div class="flotation-item">
                          <div class="flotation-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "422",
                                    "DEVICE_STATE",
                                    "stateImg",
                                  ]) as string) || flotationMachinePng
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="flotation-item-right">
                            <span class="flotation-item-name">B422浮选机</span>
                            <div class="valueInfo">
                              <span class="label">运行状态：</span>
                              <span
                                class="value"
                                style={{
                                  color: getRunningState(
                                    _.get(deviceDetail.value, [
                                      "422",
                                      "DEVICE_STATE",
                                      "value",
                                    ]) as string
                                  ).color,
                                }}
                              >
                                {
                                  getRunningState(
                                    _.get(deviceDetail.value, [
                                      "422",
                                      "DEVICE_STATE",
                                      "value",
                                    ]) as string
                                  ).name
                                }
                              </span>
                              {/* <div class="flotation-item-value">
                                <span class="label">底流浓度(g/L)：</span>
                                <span class="value">8.47</span>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mainWashingSystem-item bucketPositionInformation">
                      <CardHeaderSmall title="桶位信息"></CardHeaderSmall>
                      <div class="mainWashingSystem-item-body">
                        {bucketPositionInformation.value.map((item) => (
                          <div class="bucketPositionInformation-item">
                            <div class="title">
                              <span>{item.name}</span>
                            </div>
                            <div class="progress">
                              <a-progress
                                percent={item.percentage}
                                showInfo={false}
                                trailColor="rgba(255,255,255,0.1)"
                                strokeColor={{
                                  "0%": "#1ACAD7",
                                  "100%": "#1ACAD7",
                                }}
                              />
                              <span>
                                {item.value}
                                {item.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div class="mainWashingSystem-item">
                      <CardHeaderSmall title="精煤压滤"></CardHeaderSmall>
                      <div class="mainWashingSystem-item-body filterPress">
                        <div class="filterPress-item">
                          <div class="filterPress-item-left">
                            <div class="imgBox">
                              <img
                                src={
                                  (_.get(deviceDetail.value, [
                                    "422X",
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
                              422X精煤快开压滤机
                            </span>
                            <div class="valueInfo">
                              <div class="filterPress-item-state">
                                <span class="label">运行状态：</span>
                                <span
                                  class="value"
                                  style={{
                                    color: getRunningState(
                                      _.get(deviceDetail.value, [
                                        "422X",
                                        "DEVICE_STATE",
                                        "value",
                                      ]) as string
                                    ).color,
                                  }}
                                >
                                  {
                                    getRunningState(
                                      _.get(deviceDetail.value, [
                                        "422X",
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
                                    "422X",
                                    "PLATE_CNT_JAVA",
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
export default cardDefComponent(MainWashingSystem, cardCompInfo);
