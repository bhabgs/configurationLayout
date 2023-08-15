import { PropType, defineComponent, onMounted, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import defaultcardfrom from "@/component/card";
import { getType, objItfc } from "./util";
import { formatDuring } from "inl-ui/dist/utils";
import ProgressBar from "./components/progressBar";
import Chronoscope from "./components/chronoscope";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import { usePoolingReq, useZoomAdaptation } from "inl-ui/dist/hooks";
import getData from "@/api/phoneCards";
import cofigData, { getCurrentState, getTypeByCode } from "./config";
import dayjs from "dayjs";
import { InjectDeveiceCodeGetDetailByPc } from "../tp-bundle/index.es.js";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "生产台时",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "生产台时",
  pageControlId: "inl-card-productionBenchHours",
  code: "pcCard",
  tags: [],
});

const ProductionBenchHours = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardBody,
    cardHead,
    defaultcardfrom,
    ProgressBar,
    Chronoscope,
  },
  props: Props,
  setup(props, ctx) {
    const getDeviceDetail = ref<Function>();
    const dataInfo = ref<{
      time: {
        error: number;
        stop: number;
        run: number;
      };
      currentState: string;
      startTime: number;
    }>({
      time: {
        error: 0,
        stop: 0,
        run: 0,
      },
      currentState: "",
      startTime: 0,
    });
    const scheduleInfoByDeptAndTime = ref<objItfc>({});

    const getAggQuery = async () => {
      const codes = cofigData.map((item) => ({
        code: item.code,
      }));
      const res = await getData("post", "getAggQuery", {
        startTime: dayjs(
          scheduleInfoByDeptAndTime.value.shiftStartTime as string
        ).format("YYYYMMDD"),
        endTime: dayjs(scheduleInfoByDeptAndTime.value.shiftEndTime as string)
          .subtract(1, "minute")
          .format("YYYYMMDD"),
        query: codes,
        downsample: {
          timeUnit: "DAY",
        },
      });
      const resData = (res as Array<objItfc>).flatMap((item) => item);

      for (const item of resData) {
        const type = getTypeByCode(item as objItfc);
        (dataInfo.value.time as objItfc)[type] =
          parseFloat((item as objItfc).v as string) * 60;
      }
    };
    const getLast = async () => {
      const res = await getData("post", "getLast", {
        endTime: dayjs().format("YYYYMMDDHHmm"),
        query: [{ code: "product_system__STATE" }],
      });
      const resData = (res as Array<objItfc>).flatMap((item) => item);
      for (const item of resData) {
        const { dt, v } = item as objItfc;
        if (
          (dt as number) <
          dayjs(
            scheduleInfoByDeptAndTime.value.shiftStartTime as string
          ).valueOf()
        ) {
          dataInfo.value.startTime = dayjs(
            scheduleInfoByDeptAndTime.value.shiftStartTime as string
          ).valueOf();
        } else {
          dataInfo.value.startTime = dt as number;
        }
        dataInfo.value.currentState = getCurrentState(v as string);
      }
    };
    const getScheduleInfoByDeptAndTime = async () => {
      const res = await getData("post", "getScheduleInfoByDeptAndTime", {
        deptId: "494920276836712448",
        queryRule: "DAY",
        jobPostId: "494873727700140032",
        dateTime: dayjs().valueOf(),
      });
      const [{ shiftStartTime }, { shiftEndTime }] = res;
      scheduleInfoByDeptAndTime.value = {
        shiftStartTime,
        shiftEndTime,
      };
    };
    onMounted(async () => {
      await getScheduleInfoByDeptAndTime();
      usePoolingReq(
        async () => {
          getLast();
          getAggQuery();
        },
        () => props.isInterval,
        props.intervalNum
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
                  <div class="productionBenchHours">
                    <div
                      class={[
                        "productionBenchHours-top",
                        dataInfo.value.currentState,
                      ]}
                    >
                      <div class="state">
                        <div class="title">当前状态</div>
                        <div class="body">
                          <div class="stateName">
                            {
                              getType(dataInfo.value.currentState as string)
                                .title
                            }
                          </div>
                        </div>
                      </div>
                      <div class="currentDuration">
                        <div class="title">当前时长</div>
                        <div class="body">
                          <Chronoscope
                            startTime={dataInfo.value.startTime as number}
                          ></Chronoscope>
                        </div>
                      </div>
                      <div class="accumulatedDuration">
                        <div class="title">累计时长</div>
                        <div>
                          <div class="accumulatedDuration-item error">
                            <span>故障</span>
                            <span>{`${
                              formatDuring(
                                dataInfo.value.time.error,
                                "hour",
                                1,
                                false
                              ).hours
                            }h${
                              formatDuring(dataInfo.value.time.error, "hour")
                                .minutes
                            }min`}</span>
                          </div>
                          <div class="accumulatedDuration-item stop">
                            <span>待机</span>
                            <span>{`${
                              formatDuring(
                                dataInfo.value.time.stop,
                                "hour",
                                1,
                                false
                              ).hours
                            }h${
                              formatDuring(dataInfo.value.time.stop, "hour")
                                .minutes
                            }min`}</span>
                          </div>
                          <div class="accumulatedDuration-item run">
                            <span>运行</span>
                            <span>{`${
                              formatDuring(
                                dataInfo.value.time.run,
                                "hour",
                                1,
                                false
                              ).hours
                            }h${
                              formatDuring(dataInfo.value.time.run, "hour")
                                .minutes
                            }min`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ProgressBar data={dataInfo.value}></ProgressBar>
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
export default cardDefComponent(ProductionBenchHours, cardCompInfo);
