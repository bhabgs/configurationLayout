import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { useCardCompInfo } from "@/elements/utils";
import defaultcardfrom from "@/component/card";
import LabelBox from "./components/labelBox";
import { usePoolingReq, useZoomAdaptation } from "inl-ui/dist/hooks";
import { thingInstanceCodes, thingPropertyCodes } from "./config";
import { limitDecimal } from "inl-ui/dist/utils";
import { getThingPropertyValue, objItfc } from "./util";
import utils from "../clientUtils/index.js";
import _ from "lodash";

/**
 * 卡片属性
 */
const Props = createCardProps({
  title: {
    default: "产品信息",
    label: "标题",
    state: "string",
    type: String,
  },
});

/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "产品信息",
  pageControlId: "inl-card-productYield",
  code: "pcCard",
  tags: [],
});

const ProductYield = defineComponent({
  name: cardCompInfo.cname,
  props: Props,
  components: {
    cardBody,
    cardHead,
    defaultcardfrom,
    LabelBox,
  },
  setup(props, ctx) {
    const getDeviceDetail = ref<Function>();
    const formData = reactive<objItfc>({});
    const getCleanCoalYield = computed(() => {
      const COAL_CAP__701 = parseFloat(
        _.get(formData, ["701", "COAL_CAP", "value"]) as string
      );
      const COAL_CAP__301X = parseFloat(
        _.get(formData, ["301X", "COAL_CAP", "value"]) as string
      );
      if (COAL_CAP__701 && COAL_CAP__301X) {
        return limitDecimal((COAL_CAP__701 / COAL_CAP__301X) * 100, 0);
      } else {
        return 0;
      }
    });
    onMounted(async () => {
      const getData = await utils.thing.createGetThingInstanceDetail(
        thingInstanceCodes,
        {
          requestType: null,
          thingCode: "BELT",
          functionCode: "web",
        },
        "code"
      );
      usePoolingReq(
        async () => {
          if (getData) {
            const res = await getData(thingPropertyCodes);
            for (const key of res) {
              formData[key] = res[key];
            }
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
                  <div class="productYield">
                    <div class="productYield-right">
                      <div class="productYield-right-item raw_coal">
                        <LabelBox type="raw_coal">
                          原煤入洗量(
                          {_.get(formData, ["301X", "COAL_CAP", "unit"])})
                        </LabelBox>
                        <div class="value">
                          {_.get(formData, ["301X", "COAL_CAP", "value"])}
                        </div>
                      </div>
                      <div class="productYield-right-item product_coal">
                        <LabelBox type="product_coal">
                          产品煤产量(
                          {_.get(formData, ["701", "COAL_CAP", "unit"])})
                        </LabelBox>
                        <div class="value">
                          {_.get(formData, ["701", "COAL_CAP", "value"])}
                        </div>
                      </div>
                      <div class="productYield-right-item clean_coal">
                        <LabelBox type="clean_coal">精煤产率(%)</LabelBox>
                        <div class="value">{getCleanCoalYield.value || 0}</div>
                      </div>
                      <div class="productYield-right-item middling_coal">
                        <LabelBox type="middling_coal">
                          中煤量(
                          {_.get(formData, ["702", "COAL_CAP", "unit"])}
                          ))
                        </LabelBox>
                        <div class="value">
                          {_.get(formData, ["702", "COAL_CAP", "value"])}
                        </div>
                      </div>
                    </div>
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
export default cardDefComponent(ProductYield, cardCompInfo);
