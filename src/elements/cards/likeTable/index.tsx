import { defineComponent, onMounted, ref, PropType } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import InlCardTable from "@/component/table";
import _ from "lodash-es";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    type: String,
    default: "表格卡片",
    label: "标题",
    state: "string",
  },
  time: {
    type: Number,
    default: 0,
    label: "轮训间隔",
    state: "number",
  },
  things: {
    type: Object,
    default: { th: [], tb: [] },
    label: "编辑表格",
    state: "table",
    dataDictionary: {
      hasThingProps: true,
      multiple: true,
    },
  },
});

/**
 * 卡片信息
 * cname 卡片中文名称
 * controlId 卡片英文名称
 * tags 卡片标签
 */

const cardCompInfo = useCardCompInfo({
  cname: "表格卡片",
  pageControlId: "inl-card-like-table",
  tags: [],
  code: "pcCard",
  cardType: "standard",
  thumbnail: "table.png",
});

/**
 * 卡片主体
 */
const TextCard = defineComponent({
  name: cardCompInfo.cname,
  components: { cardHead, cardBody, InlCardTable },
  props: Props,
  setup(props, context) {
    /**
     * @description 获取数据，调用数据逻辑为，是否含有pointCode， 是否轮训， 如果不存在pointCode，那么将不更新数据
     */
    const getData = async () => {};

    onMounted(() => {
      getData();
    });
    // 监听表头变化
    return () => (
      <Defaultcardfrom
        onTabChange={(e) => {
          console.log(e);
        }}
        {...props}
        vSlots={{
          cardBody: () => (
            <cardBody
              {...props}
              vSlots={{
                customCardBody: () => (
                  <InlCardTable
                    th={props.things.th}
                    tb={props.things.tb}
                    animate={props.state === "production" ? true : false}
                  ></InlCardTable>
                ),
              }}
            />
          ),
        }}
      />
    );
  },
});

export default cardDefComponent(TextCard, cardCompInfo);
