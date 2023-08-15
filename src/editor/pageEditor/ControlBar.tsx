import { defineComponent, inject, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { pageInfo } from "./data";
import Iconfont from "@/component/Iconfont";
import _ from "lodash-es";

export default defineComponent({
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    showLeft: {
      type: Boolean,
      default: true,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  emits: ["update:showLeft", "update:showRight", "toPreview"],
  setup(props, context) {
    const showLeft = useVModel(props, "showLeft", context.emit);
    const showRight = useVModel(props, "showRight", context.emit);
    const pageData: pageInfo = inject("pageData");

    /**z这代码不行，孙宇改 */
    const toSave: any = inject("toSave");

    const zoom: any = inject("zoom");

    const newName = ref();

    watch(
      () => pageData.name,
      (nval) => {
        newName.value = nval;
      },
      { immediate: true }
    );

    const editName = ref();

    const ok = () => {
      pageData.name = newName.value;
      cancel();
    };

    const cancel = () => {
      editName.value = false;
    };

    return () => (
      <div class="inl-card-ControlBar flex-center">
        <div class="pageNameBox flex-center">
          {editName.value ? (
            <div class="flex-center" style="gap:8px">
              <a-input
                v-model={[newName.value, "value"]}
                placeholder="请输入"
                size="small"
                allowClear
              ></a-input>

              <a-button type="primary" size="small" onClick={ok}>
                确定
              </a-button>
              <a-button size="small" onClick={cancel}>
                取消
              </a-button>
            </div>
          ) : (
            <div class="flex-center">
              <a-space>
                {pageData.name}

                <a-tooltip
                  v-slots={{
                    title: () => "编辑",
                  }}
                >
                  <Iconfont
                    icon="icon-icon_zengshangaicha_xiugai"
                    onClick={() => {
                      editName.value = true;
                    }}
                  />
                </a-tooltip>
              </a-space>
            </div>
          )}
        </div>

        <div class="center flex-center">
          <a-space>
            <a-tooltip
              v-slots={{
                title: () => "缩小",
              }}
            >
              <Iconfont
                icon="icon-icon_zengshangaicha_jianshao_jianhao"
                onClick={() => {
                  if (zoom.value > 0.1) {
                    zoom.value = (Math.ceil(zoom.value * 10) - 1) / 10;
                  }
                }}
              />
            </a-tooltip>

            <div class="zoom">{parseInt(zoom.value * 100 + "") + "%"}</div>

            <a-tooltip
              v-slots={{
                title: () => "放大",
              }}
            >
              <Iconfont
                icon="icon-icon_zengshangaicha_tianjia_jiahao"
                onClick={() => {
                  zoom.value = (Math.floor(zoom.value * 10) + 1) / 10;
                }}
              />
            </a-tooltip>
          </a-space>
        </div>

        <a-space size={16} class="flex">
          <a-tooltip
            v-slots={{
              title: () => "保存",
            }}
          >
            <Iconfont
              icon="icon-gongyituguanli_quanjucaozuo_baocun"
              onClick={_.throttle(toSave, 2000)}
            />
          </a-tooltip>

          {/* <a-tooltip
            v-slots={{
              title: () => (showLeft.value ? "收起左侧" : "展开左侧"),
            }}
          >
            <Iconfont
              icon="icon-gongyituguanli_quanjucaozuo_shouqizuoce"
              onClick={() => {
                showLeft.value = !showLeft.value;
              }}
            />
          </a-tooltip> */}

          <a-tooltip
            v-slots={{
              title: () => "预览",
            }}
          >
            <Iconfont
              icon="icon-gongyituguanli_quanjucaozuo_yulan"
              onClick={() => {
                context.emit("toPreview", pageData);
              }}
            />
          </a-tooltip>

          {/* <a-tooltip
            v-slots={{
              title: () => (showLeft.value ? "收起右侧" : "展开右侧"),
            }}
          >
            <Iconfont
              icon="icon-gongyituguanli_quanjucaozuo_shouqiyouce"
              onClick={() => {
                showRight.value = !showRight.value;
              }}
            />
          </a-tooltip> */}
        </a-space>
      </div>
    );
  },
});
