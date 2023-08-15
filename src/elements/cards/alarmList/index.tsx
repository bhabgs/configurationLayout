import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useCardCompInfo } from "@/elements/utils";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import dayjs from "dayjs";
import * as api from "@/api/alarm";
import { useIntervalFn } from "@vueuse/core";
import {
  ExclamationCircleFilled,
  DoubleRightOutlined,
} from "@ant-design/icons-vue";

function buildReqParam(
  timeRange: string,
  alarmState: string | null,
  limit: number
) {
  const param: any = {};
  param.endTime = dayjs().endOf("day");
  switch (timeRange) {
    case "today":
      param.startTime = dayjs().startOf("day");
      break;
    case "week":
      param.startTime = dayjs().add(-1, "week");
      break;
    case "month":
      param.startTime = dayjs().add(-1, "month");
      break;
    default:
      break;
  }
  param.alarmState = alarmState === "all" ? null : alarmState;
  param.pageNum = 1;
  param.pageSize = limit ?? 999;
  return param;
}

function mapColor(level) {
  const mapping = {
    1: "#d9615e",
    2: "#ed963c",
    3: "#f4c547",
    4: "#4b7ff7",
  };
  return mapping[level];
}

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    type: String,
    default: "报警列表",
    label: "标题",
    state: "string",
  },
  limitCount: {
    type: Number,
    default: 10,
    label: "展示条数",
    state: "number",
  },
  timeRange: {
    type: String,
    default: "today",
    label: "时间范围",
    state: "select",
    dataDictionary: [
      { id: "today", name: "今天" },
      { id: "week", name: "近一周" },
      { id: "month", name: "近一个月" },
    ],
  },
  alarmState: {
    type: String,
    default: "ALARMING",
    label: "报警状态",
    state: "select",
    dataDictionary: [
      { id: "ALARMING", name: "报警中" },
      { id: "CLEAR_ALARM", name: "已消警" },
      { id: "all", name: "全部" },
    ],
  },
  poolingTime: {
    type: Number,
    default: 5000,
    label: "轮询时间",
    state: "number",
  },
  jumpUrl: {
    type: String,
    default: "",
    label: "详情url",
    state: "string",
  },
});

/**
 * 卡片信息
 */

const cardCompInfo = useCardCompInfo({
  cname: "报警列表",
  pageControlId: "inl-card-alarm-list",
  code: "pcCard",
  tags: [],
  cardType: "standard",
  thumbnail: "alarmList.png",
});

/**
 *  卡片主体
 */

const AlarmList = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardHead,
    cardBody,
  },
  props: Props,
  setup(props, ctx) {
    const router = useRouter();

    /**
     * 卡片主体
     */
    const alarmList = ref([]);
    const getAlarmList = async () => {
      const param = buildReqParam(
        props.timeRange,
        props.alarmState,
        props.limitCount
      );
      const { data } = await api.getAlarmLogList(param);
      alarmList.value = data.records;
    };
    useIntervalFn(getAlarmList, props.poolingTime || 5000, {
      immediateCallback: true,
    });

    const handelJump = () => {
      router.push(props.jumpUrl);
    };

    return () => (
      <Defaultcardfrom
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
                customCardBody: () => {
                  const list = alarmList.value;

                  return (
                    <div class="inl-card-alarm-list">
                      {props.title && (
                        <div class="title">
                          {props.title}
                          {props.jumpUrl && (
                            <a-button type="link" onClick={handelJump}>
                              更多
                              <DoubleRightOutlined />
                            </a-button>
                          )}
                        </div>
                      )}
                      <div class="list">
                        {list.length ? (
                          list.map((l) => (
                            <div class="list-item">
                              <div class="list-item-title">
                                <ExclamationCircleFilled
                                  style={{ color: mapColor(l.level) }}
                                />
                                {l.name}
                              </div>
                              <div class="description">
                                {l.firstAlarmTime &&
                                  dayjs(l.firstAlarmTime).format(
                                    "MM-DD HH:mm:ss"
                                  )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <a-empty></a-empty>
                        )}
                      </div>
                    </div>
                  );
                },
              }}
            />
          ),
          cardHead: () => <cardHead title={props.title} />,
        }}
      />
    );
  },
});

/**
 * 卡片定义
 */
export default cardDefComponent(AlarmList, cardCompInfo);
