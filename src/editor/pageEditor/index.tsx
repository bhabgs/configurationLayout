import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  provide,
  onUnmounted,
  PropType,
} from "vue";
import _ from "lodash";
import { Splitpanes, Pane } from "splitpanes";
import html2canvas from "html2canvas";
import EditorBodyContent from "./content";
import ControlBar from "./ControlBar";
import RightPane from "./rightPane";
import { pageInfo, inlCardTreeItem, themeListType } from "./data";
import { cardThemeFun, checkDev, createEditorTemplateJson } from "./util";
import selfCards from "../../elements";
import { cardCompInfo } from "@/elements/utils";
import LeftPane from "./leftPane";
import InlPageStage from "./content/stage";
import { base64ToBlob } from "../utils";
import { message } from "ant-design-vue";

const inlPageEditorProps = {
  id: {
    type: String,
    default: "",
  },
  appId: {
    type: String,
    required: true,
  },
  pageInfo: {
    type: Object as PropType<pageInfo>,
    default: null,
  },
  state: {
    type: String as PropType<"editor" | "preview">,
  },
  customCards: {
    type: Object as PropType<Record<string, cardCompInfo>>,
    default: {},
  },
  saveCallback: {
    type: Object,
    default: null,
  },
};

const InlPageEditor = defineComponent({
  props: inlPageEditorProps,
  components: { RightPane },
  emits: ["saveCallback", "preview"],
  setup(props, context) {
    console.log(selfCards.cards);
    // 集成卡片
    const cards = { ...selfCards.cards, ...props.customCards };

    const showLeft = ref(true); // 显示左侧树
    const showRight = ref(true); // 显示右侧树
    const zoom = ref<number>(1); // 缩放比例

    const pageData = reactive<pageInfo>(
      createEditorTemplateJson(
        props.pageInfo?.clientType || "pc",
        props.pageInfo
      )
    ); // 初始化pageData

    // 初始化当前选中节点
    const currentNode = ref<inlCardTreeItem>(null);
    currentNode.value = pageData;

    // 注入相关数据方便子组件使用
    provide("appId", props.appId);
    provide("pageData", pageData);
    provide("currentNode", currentNode);
    provide("cards", cards);
    provide("zoom", zoom);

    onMounted(() => {
      checkDev();
    });

    onUnmounted(() => {
      localStorage.removeItem("isDev");
    });

    // 设置主题
    const theme = ref<themeListType>("light");
    watch(
      () => pageData.theme,
      () => {
        theme.value = pageData.theme;
      },
      { immediate: true, deep: true }
    );

    cardThemeFun.set(pageData.theme, theme);

    // 保存配置
    const toSave = async () => {
      let canvas;
      // 待开发image
      try {
        canvas = await html2canvas(document.getElementById("inl-page-editor"), {
          allowTaint: true,
        });
      } catch (e) {
        message.error("缩略图生成失败");
      }

      context.emit("saveCallback", {
        pageData,
        img: canvas && base64ToBlob(canvas.toDataURL("image/png", 0.3)),
      });
    };

    provide("toSave", toSave);

    context.expose(pageData);
    return () => (
      <div class="inl-page-editor" id="inl-page-editor">
        <Splitpanes class="inl-page-editor-body">
          <Pane
            size={10}
            style={{
              overflow: "hidden",
              display: "flex",
            }}
          >
            <LeftPane cards={cards} showLeft={showLeft.value} />
          </Pane>
          <Pane
            size={65}
            minSize={50}
            style={{
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div class="inl-page-editor-body-center flex flex1">
              <ControlBar
                class="inl-page-editor-header"
                v-models={[
                  [showLeft.value, "showLeft"],
                  [showRight.value, "showRight"],
                ]}
                onToPreview={() => {
                  context.emit("preview", pageData);
                }}
              />

              <EditorBodyContent
                width={pageData.resolutionRatioW}
                height={pageData.resolutionRatioH}
              />
            </div>
          </Pane>

          <Pane size={15}>
            <RightPane
              class={["inl-page-editor-body-right", !showRight.value && "hide"]}
            />
          </Pane>
        </Splitpanes>
      </div>
    );
  },
});

export { InlPageEditor, InlPageStage };
