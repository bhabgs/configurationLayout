import { defineComponent, computed } from "vue";
import { formatMoney } from "inl-ui/dist/utils";
import warehouseBG from "../../../../assets/imgs/warehouseBG.png";

export default defineComponent({
  name: "WarehouseItem", // 组件名称
  props: {
    warehouseName: {
      type: String,
      default: "--",
    },
    max: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    heavy: {
      type: Number,
      default: 0,
    },
    sourceName: {
      type: String,
      default: "--",
    },
  },
  setup(props, ctx) {
    const getHeight = computed(() => `${props.percentage}%`);
    return () => (
      <div class="warehouse-item">
        <div class="warehouse-item-title">
          <div>{props.warehouseName}</div>
        </div>
        <div class="warehouse-item-body">
          <div class="warehouse-item-body-box">
            <img src={warehouseBG} alt="" />
            {props.percentage ? (
              <div
                class="warehouse-item-body-box-value"
                style={{
                  height: getHeight.value,
                  background:
                    "linear-gradient(180deg, #12FBF7 0%, rgba(4,171,207,0) 100%, rgba(4,171,207,0) 100%)",
                }}
              ></div>
            ) : null}
          </div>
        </div>
        <div class="warehouse-item-value">
          <div class="warehouse-item-value-height" style={{ fontSize: "14px" }}>
            {props.height}m
          </div>
        </div>
      </div>
    );
  },
});
