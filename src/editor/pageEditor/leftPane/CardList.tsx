import { defineComponent, PropType, resolveComponent, ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { formatProps, setCardObj } from "../util";
import { cardCompInfo } from "@/elements/utils";
import { getAllCard } from "@/api/appCenter";

const cardListProps = {
  cards: {
    type: Object as PropType<Record<string, cardCompInfo>>,
    default: {},
  },
};
export default defineComponent({
  name: "卡片列表",
  props: cardListProps,
  setup(props, context) {
    // 获取所有卡片实例
    const cardList = ref<cardCompInfo[]>([]);
    const getCardList = () => {
      getAllCard({
        // clientType: "pc",
        availiable: null,
      }).then((res) => {
        for (let i of res) {
          cardList.value.push({
            cname: i.name,
            pageControlId: i.cardCode,
            tags: [],
            code: "pcCard",
            thumbnail: i.thumbnail,
            comp: {
              props: i.config,
            },
          });
        }
      });
    };

    getCardList();
    // 拖拽开始
    const dragStart = (event, cardObj) => {
      setCardObj(event, cardObj);
    };

    const dragging = (event) => {};

    // 渲染卡片列表
    const renderCardList = () => {
      const arr = {
        standard: [],
        custom: [],
      };

      // 内部卡片
      for (let i in props.cards) {
        if (searchValue.value) {
          const tags = (props.cards[i].tags || []).join("");
          if (
            props.cards[i].cname.indexOf(searchValue.value) >= 0 ||
            tags.indexOf(searchValue.value) >= 0
          ) {
            // 如果是定制卡片，不显示
            if (props.cards[i].cname !== "定制卡片") {
              arr.standard.push(setCardItem(props.cards[i], false));
            }
          }
        } else {
          // 如果是定制卡片，不显示
          if (props.cards[i].cname !== "定制卡片") {
            arr.standard.push(setCardItem(props.cards[i], false));
          }
        }
      }

      // 定制卡片
      for (let i of cardList.value) {
        if (searchValue.value) {
          const tags = (i.tags || []).join("");
          if (
            i.cname.indexOf(searchValue.value) >= 0 ||
            tags.indexOf(searchValue.value) >= 0
          ) {
            arr.custom.push(setCardItem(i, true));
          }
        } else {
          arr.custom.push(setCardItem(i, true));
        }
      }
      return arr;
    };

    // 设置卡片
    const setCardItem = (a: cardCompInfo, isCustom = false) => {
      let { pageControlId, cname, thumbnail } = a;
      const ln = resolveComponent(pageControlId);
      const uProps = formatProps(a.comp?.props || a.config);

      let cardBanner = <ln {...uProps} />;
      if (thumbnail) {
        if (!isCustom) {
          thumbnail = `/micro-assets/cardThumbnail/${thumbnail}`;
        }
        cardBanner = <img class="thumbnail" src={thumbnail} alt="缩略图" />;
      }

      return (
        <div
          class="card flex"
          key={pageControlId}
          onDragstart={(event) => {
            dragStart(event, a);
          }}
          onDrag={dragging}
          draggable="true"
        >
          {cardBanner}
          <div class="title">{cname}</div>
        </div>
      );
    };

    const searchValue = ref<string>("");

    const activeKey = ref();

    return () => (
      <div class="CardList flex">
        <div class="top">
          <a-input
            class="search"
            placeholder="输入卡片名称"
            allowClear
            suffix={<SearchOutlined />}
            v-model={[searchValue.value, "value", ["trim"]]}
          />

          {/* <div class="tagBox flex">{renderTags()}</div> */}
        </div>

        <div class="cardBox flex flex1">
          <a-collapse v-model:activeKey={activeKey.value} ghost>
            <a-collapse-panel key="1" header="标准卡片">
              {renderCardList().standard}
            </a-collapse-panel>
            <a-collapse-panel key="2" header="用户自定义卡片">
              {renderCardList().custom}
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    );
  },
});
