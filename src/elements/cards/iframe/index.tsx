import { computed, defineComponent, inject, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { pageInfo } from "@/editor/pageEditor/data";

/**
 * 卡片属性
 */
const Props = createCardProps({
  url: {
    type: String,
    default: "",
    label: "页面地址",
    state: "string",
  },
  state: {
    type: String,
    default: "product",
    label: "状态",
    state: "string",
    hide: true,
  },
  title: {
    type: String,
    default: "iframe页面",
    label: "标题",
    state: "string",
  },
});

/**
 * 卡片信息
 */

const cardCompInfo = useCardCompInfo({
  cname: "iframe组件",
  pageControlId: "inl-card-iframe",
  code: "pcCard",
  tags: [],
  cardType: "standard",
  thumbnail: "iframe.png",
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
    /**
     * 卡片主体
     */
    const url = computed(() => {
      if (!props.url) return "";
      const pageData = inject<pageInfo>("pageData");
      const token = sessionStorage.getItem("token");
      const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
      const appId = pageData?.appId;

      if (props.url.indexOf("http") >= 0) {
        const urlObj = new URL(props.url);
        urlObj.searchParams.append("token", token);
        urlObj.searchParams.append("userId", userinfo.userId);
        urlObj.searchParams.append("appId", pageData?.appId);
        return urlObj.href;
      } else {
        const res =
          "/#" +
          props.url +
          (props.url.includes("?") ? "&" : "?") +
          "onlyPage=1&token=" +
          token +
          "&userId=" +
          userinfo.userId +
          "&appId=" +
          appId;
        return res;
      }
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
                  return url.value ? (
                    <iframe width="100%" height="100%" src={url.value} />
                  ) : (
                    ""
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
