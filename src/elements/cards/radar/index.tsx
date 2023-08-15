import {
  defineComponent,
  nextTick,
  onUnmounted,
  watch,
  ref,
  onMounted,
  VNode,
} from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import createws from "./createws";
import renderThree from "./renderThree";

/**
 * 卡片属性
 */
const Props = createCardProps({
  url: {
    type: String,
    default: "",
    label: "请求地址",
    state: "string",
  },
  title: {
    type: String,
    default: "雷达图",
    label: "标题",
    state: "string",
  },
});

/**
 * 卡片信息
 */

const cardCompInfo = useCardCompInfo({
  cname: "雷达图",
  pageControlId: "inl-card-radar",
  code: "pcCard",
  tags: [],
  cardType: "standard",
  thumbnail: "radar.png",
});

/**
 *  卡片主体
 */

const FlowChartCard = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardHead,
    cardBody,
  },
  props: Props,
  setup(props, ctx) {
    const cardBodyRef = ref<HTMLElement>();
    /**
     * 卡片主体
     */
    // 创建three渲染
    let rt;
    // 创建ws链接
    const ws = createws();
    const createLink = () => {
      ws.create({
        url: props.url,
        callback: (data) => {
          if (rt) {
            rt.refresh(data);
          }
        },
      });
    };

    // 变化时创建链接
    watch(
      () => props.url,
      () => {
        ws.close();
        nextTick(() => {
          createLink();
        });
      },
      { immediate: true }
    );

    onMounted(() => {
      rt = renderThree(cardBodyRef.value);
    });

    // 卸载时关闭链接
    onUnmounted(() => {
      ws.close();
    });
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
                  return (
                    <div
                      style={{ height: "100%", width: "100%" }}
                      ref={cardBodyRef}
                    ></div>
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
export default cardDefComponent(FlowChartCard, cardCompInfo);
