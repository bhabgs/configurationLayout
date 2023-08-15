import { defineComponent, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import Holder from "@/component/holder";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { Switch } from "../../controlPoints/switch";
import { ThingIns } from "@/component/thing";
import { useThingValue } from "@/elements/hooks/useThingValue";
import * as api from "@/api/thingInstance";
import { message } from "ant-design-vue";

const cardCompInfo = useCardCompInfo({
  cname: "水炮",
  pageControlId: "inl-card-water-cannon",
  code: "pcCard",
  tags: [],
  cardType: "standard",
  thumbnail: "waterCannon.png",
});

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "水炮",
    label: "标题",
    state: "string",
    type: String,
  },
  speed: {
    default: 1,
    label: "默认速度",
    type: Number,
    state: "number",
  },
  activeTab: {
    default: "",
    label: "默认速度",
    type: String,
    state: "number",
    hide: true,
  },
});

const VideoCard = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardHead,
    cardBody,
  },
  props: Props,
  setup(props, ctx) {
    // 水泡速度
    const speed = ref(1);

    const tabValue = ref<ThingIns>({
      thingCode: "",
      id: "",
      name: "",
      code: "",
      thingName: "",
    });

    const pump = ref<ThingIns>({
      thingCode: "",
      id: "",
      name: "",
      code: "",
      thingName: "",
    });

    speed.value = props.speed;

    const pumpOpen = useThingValue(() => pump.value?.code, "TAP_OPEN");
    const pumpClose = useThingValue(() => pump.value?.code, "TAP_CLOSE");

    const pumpControl = async (state: boolean) => {
      if (!pump.value.code) return;
      const propertyCode = state ? "V_OPEN" : "V_CLOSE";
      const res = await api.setThingInstancePointData([
        {
          thingInstCode: pump.value.code,
          thingPropertyCode: propertyCode,
          value: "1",
        },
      ]);
      const actionName = state ? "开阀" : "关阀";
      if (res) {
        message.success(`${actionName}成功`);
      } else {
        message.error(`${actionName}失败`);
      }
    };

    return () => {
      return (
        <Defaultcardfrom
          onTabChange={(e: ThingIns & { extra?: ThingIns }) => {
            tabValue.value = e;
            pump.value = e.extra;
          }}
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
                    <div class="inl-card-water-cannon">
                      <div>
                        <div class="inl-card-water-cannon-f-i">
                          <a-space>
                            <a-button onClick={() => pumpControl(true)}>
                              开阀
                            </a-button>
                            <a-button onClick={() => pumpControl(false)}>
                              关阀
                            </a-button>
                            <span key={pumpOpen.value}>
                              {pumpOpen.value === "1" ? "开到位" : "非开位"}
                            </span>
                            <span key={pumpClose.value}>
                              {pumpClose.value === "1" ? "关到位" : "非关位"}
                            </span>
                          </a-space>
                          {/* <Switch
                          name="开阀/关阀："
                          icon="icon-danxuanxuanzhong"
                          thingInfo={{
                            things: [tabValue.value],
                            thingCode: tabValue.value.thingCode,
                          }}
                          title="开阀/关阀："
                        /> */}
                        </div>
                        <div class="inl-card-water-cannon-f-i">
                          <span>速度：</span>
                          <a-input-number
                            v-model:value={speed.value}
                            max={64}
                            min={1}
                          />
                        </div>
                      </div>

                      <Holder iu={tabValue.value.id} speed={speed.value} />
                    </div>
                  ),
                }}
              />
            ),
          }}
        />
      );
    };
  },
});

/**
 * 卡片定义
 */
export default cardDefComponent(VideoCard, cardCompInfo);
