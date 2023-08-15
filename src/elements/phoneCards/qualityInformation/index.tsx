import { defineComponent, onMounted, reactive, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import defaultcardfrom from "@/component/card";
import QualityInformationChart from "./qualityInformationChart";
import { usePoolingReq, useZoomAdaptation } from "inl-ui/dist/hooks";
import getData from "@/api/phoneCards";
import { getThingPropertyValue, objItfc } from "./util";
import cofigData, { getType } from "./config";
import dayjs from "dayjs";
import { InjectDeveiceCodeGetDetailByPc } from "../tp-bundle/index.es.js";
import utils from "../clientUtils/index.js";
import _ from "lodash";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "质量信息",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "质量信息",
  pageControlId: "inl-card-qualityInformation",
  code: "pcCard",
  tags: [],
});

const QualityInformation = defineComponent({
  name: cardCompInfo.cname,
  props: Props,
  components: {
    QualityInformationChart,
    cardBody,
    cardHead,
    defaultcardfrom,
  },
  setup(props, ctx) {
    const chartList = ref<Array<objItfc>>([]);
    const formData = reactive<objItfc>({});

    onMounted(async () => {
      const getDeviceDetail = await utils.thing.createGetThingInstanceDetail(
        ["701_ASH"],
        {
          requestType: null,
          thingCode: "PASSIVE_ASH_MONITOR",
          functionCode: "web",
        },
        "code"
      );
      const getHistory = await utils.thing.createGetHistoryData(
        ["701_ASH"],
        ["AD"],
        {
          requestType: null,
          thingCode: "PASSIVE_ASH_MONITOR",
          functionCode: "web",
        }
      );
      usePoolingReq(
        async () => {
          if (getDeviceDetail) {
            const res = await getDeviceDetail(["AD"]);

            formData["AD"] = res["AD"];
          }
          if (getHistory) {
            const res = await getHistory(
              `${dayjs().subtract(1, "hour").valueOf()}`,
              `${dayjs().valueOf()}`,
              {
                timeUnit: "MINUTE",
                timeNum: 10,
                aggregator: "FIRST",
              }
            );
            const historyDataList = res["701_ASH"]?.AD?.historyDataList;
            chartList.value =
              historyDataList?.map((item: any) => ({
                time: dayjs(item.saveTime).valueOf(),
                value: parseFloat(item.formatValue),
                type: "精煤灰分",
              })) || [];
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
                  <div class="qualityInformation">
                    <div class="qualityInformation-valueInfo">
                      <div class="qualityInformation-valueInfo-item clean_coal">
                        <div class="qualityInformation-valueInfo-item-title">
                          精煤实时灰分：
                        </div>
                        <div class="qualityInformation-valueInfo-item-value">
                          <span>
                            {_.get(formData, ["701_ASH", "AD", "value"])}
                          </span>
                          <span>%</span>
                        </div>
                      </div>
                      {/* <div class="qualityInformation-valueInfo-item middling_coal">
                        <div class="qualityInformation-valueInfo-item-title">
                          中煤实时灰分：
                        </div>
                        <div class="qualityInformation-valueInfo-item-value">
                          <span>{middlingCoal.value || 0}</span>
                          <span>%</span>
                        </div>
                      </div> */}
                    </div>
                    <QualityInformationChart
                      data={chartList.value}
                    ></QualityInformationChart>
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
export default cardDefComponent(QualityInformation, cardCompInfo);
