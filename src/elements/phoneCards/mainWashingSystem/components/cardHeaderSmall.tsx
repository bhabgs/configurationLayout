import { defineComponent, ref, PropType } from "vue";

export interface ITabItem {
  name: string;
  id: any;
}

/**
 * 卡片头(小) 左侧带橙色点
 */
const CardHeaderSmall = defineComponent({
  emits: ["tabChange"],
  props: {
    title: {
      type: String,
    },
    tabList: {
      type: Array as PropType<ITabItem[]>,
    },
  },
  setup(props, { emit, slots }) {
    const activeTab = ref(props.tabList?.[0]?.id);

    const handleSwitchTab = (index: number) => {
      const id = props.tabList![index].id;
      if (id !== activeTab.value) {
        emit("tabChange", props.tabList![index]);
        activeTab.value = id;
      }
    };

    return () => (
      <div class="card-header-small">
        <div class="title">{props.title}</div>
        <div class="right">
          {props.tabList ? (
            <div class="tab-container">
              {props.tabList.map((item, index) => (
                <div
                  class={["tab-item", activeTab.value === item.id && "active"]}
                  key={item.id}
                  onClick={() => handleSwitchTab(index)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          ) : (
            slots.extra?.()
          )}
        </div>
      </div>
    );
  },
});

export default CardHeaderSmall;
