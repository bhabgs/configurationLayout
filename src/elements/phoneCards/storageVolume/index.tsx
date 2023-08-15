import { defineComponent, onMounted, ref } from "vue";
import { limitDecimal } from "inl-ui/dist/utils";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import defaultcardfrom from "@/component/card";
import WarehouseItem from "./components/warehouseItem";
import { usePoolingReq } from "inl-ui/dist/hooks";
import { objItfc } from "../qualityInformation/util";
import utils from "../clientUtils/index.js";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "仓储信息",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "仓储信息",
  pageControlId: "inl-card-storageVolume",
  code: "pcCard",
  tags: [],
});

const StorageVolume = defineComponent({
  name: cardCompInfo.cname,
  props: Props,
  components: {
    cardBody,
    cardHead,
    defaultcardfrom,
  },
  setup(props, ctx) {
    const warehouseList = ref<any>([
      {
        name: "精煤1",
        code: "700A",
        maxHeight: 21,
        position: "0",
      },
      {
        name: "精煤2",
        code: "700B",
        maxHeight: 21,
        position: "0",
      },
      {
        name: "矸石",
        code: "900A",
        maxHeight: 4,
        position: "0",
      },
    ]);
    onMounted(async () => {
      // 根据设备Code 注入查询设备详情方法（负责首次查询多个设备的详细信息，获取pointCode，value） -- 全量
      const getData = await utils.thing.createGetThingInstanceDetail(
        ["700A", "700B", "900A"],
        {
          requestType: null,
          thingCode: "ROUND_BUNKER",
          functionCode: "web",
        },
        "code"
      );
      usePoolingReq(
        async () => {
          if (getData) {
            const res = await getData(["M_HEIGHT", "M_PERCENT"]);
            warehouseList.value = warehouseList.value.map((item: objItfc) => {
              return {
                ...item,
                position: res[item.code as string]?.["M_HEIGHT"]?.value || 0,
                percentage: res[item.code as string]?.["M_PERCENT"]?.value || 0,
              };
            });
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
                  <div class="warehouseStatistics">
                    {warehouseList.value?.map((item: objItfc) => (
                      <WarehouseItem
                        warehouseName={item.name as string}
                        max={0}
                        min={0}
                        percentage={limitDecimal(item.percentage, 0)}
                        height={limitDecimal(item.position)}
                      ></WarehouseItem>
                    ))}
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
export default cardDefComponent(StorageVolume, cardCompInfo);
