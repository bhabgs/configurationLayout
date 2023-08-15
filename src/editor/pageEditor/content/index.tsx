import {
  defineComponent,
  onMounted,
  ref,
  inject,
  Ref,
  withModifiers,
  watch,
} from "vue";
import computedZoom from "./computedZoom";
import event from "./event";
import Stage from "./stage";

import { inlCardTreeItem, pageInfo } from "../data";

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 1920,
    },
    height: {
      type: Number,
      default: 1080,
    },
  },
  setup(props, ctx) {
    const pageData = inject<pageInfo>("pageData");
    const currentNode = inject<Ref<inlCardTreeItem>>("currentNode");
    const zoom: any = inject("zoom");

    const style = ref<{
      zoom: number;
      offx: number;
      offy: number;
    }>({
      zoom: 1,
      offx: 0,
      offy: 0,
    });
    const dom = ref<HTMLElement>();
    const stageDom = ref<HTMLElement>();

    const changeZoom = () => {
      const { offsetHeight, offsetWidth } = dom.value;
      const { zoomv, offx, offy } = computedZoom(
        { w: offsetWidth, h: offsetHeight },
        { w: pageData.resolutionRatioW, h: pageData.resolutionRatioH }
      );

      zoom.value = zoomv;

      style.value.offx = offx;
      style.value.offy = offy;
    };

    onMounted(() => {
      let ox = style.value.offx + "";
      let oy = style.value.offy + "";
      event(dom.value, stageDom.value, {
        wheel: (zm) => {
          zoom.value = zm;
        },
        move(a, b, c) {
          style.value.offx = Number(ox) - c.x / zoom.value;
          style.value.offy = Number(oy) - c.y / zoom.value;
        },
        moveEnd() {
          ox = style.value.offx + "";
          oy = style.value.offy + "";
        },
      });

      setTimeout(() => {
        changeZoom();
      }, 500);
    });

    // 切换平台和分辨率是计算缩放比例
    watch(
      () => [
        pageData.clientType,
        pageData.resolutionRatioH,
        pageData.resolutionRatioW,
      ],
      () => {
        changeZoom();
      },
      {
        deep: true,
      }
    );

    return () => (
      <div
        ref={dom}
        class="inl-page-editor-body-content"
        id="pageInfo"
        onClick={withModifiers(() => {
          currentNode.value = pageData;
        }, ["self"])}
      >
        <div
          class="inl-page-editor-stage-box"
          ref={stageDom}
          style={{
            width: props.width + "px",
            height: props.height + "px",
            zoom: zoom.value,
            transform: `translate(${style.value.offx}px, ${style.value.offy}px)`,
            // transform: `matrix(${style.value.zoom}, 0, 0, ${style.value.zoom}, ${style.value.offx}, ${style.value.offy})`, // ${style.value.offx}, ${style.value.offy}
          }}
        >
          <Stage state={"editor"} />
        </div>

        <div id="card-editor-mask" class="mask"></div>
      </div>
    );
  },
});
