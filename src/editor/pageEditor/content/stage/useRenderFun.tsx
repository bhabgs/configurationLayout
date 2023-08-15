import {
  resolveComponent,
  defineComponent,
  PropType,
  watch,
  ref,
  provide,
} from "vue";
import { BaseConfig, inlCardTreeItem, pageInfo } from "../../data";
import { editorState } from "./type";
import { formatProps } from "../../util";
import { onDrop } from "./event";
import { backgroundType } from "@/editor/pageEditor/data";
import usePageInfo from "@/editor/utils/hooks/usePageInfo";
import { toReactive } from "@vueuse/core";
import { getIframeParams } from "../../util/childPage";
import _ from "lodash";

// 渲染背景
export const renderBackground = (baseConfig) => {
  const { background, backgroundType } = baseConfig;
  if (backgroundType === "color") return background;
  if (backgroundType === "image")
    return `center / 100% 100% no-repeat url(${background}) `;
  if (backgroundType === "gradient") return background;
};
// 特殊背景处理
export const renderSpecialBackground = (bct: backgroundType, val: string) => {
  const bctRender: Record<backgroundType, (v: string) => JSX.Element> = {
    color: (v) => null,
    tupu(v) {
      const url = v || "https://www.hightopo.com/demo/tjmt-lhxmc3/";
      return (
        <iframe class="inl-card-background-iframe" frameborder="0" src={url} />
      );
    },
    // gradient: (v) => <div></div>,
    image: (v) => null,
    flowChart: (v) => {
      const url = `/#${v}?onlyPage=1`;
      const urlWithToken = getIframeParams(url);
      return (
        <iframe
          class="inl-card-background-iframe"
          frameborder="0"
          src={urlWithToken}
        />
      );
    },
  };

  if (!bct || !val) return "";

  return bctRender[bct](val);
};

// 渲染页面配置组件
export const renderCardByState = (
  com: any,
  opt: {
    card: inlCardTreeItem;
    state: editorState;
  }
) => {
  const { card, state } = opt;

  const style = computedLayStyle(card.styleJson, []);
  let linkNameUse, uProps;

  // 是否有控件
  if (card.pageControlId !== "page") {
    linkNameUse = card.pageControlId;
    uProps = formatProps(card.config);
  }
  const originConfig = _.cloneDeep(card);
  let cardContent: JSX.Element;
  // 预览布局
  if (state === "preview-layout") cardContent = <div></div>;

  // 预览状态
  if (state !== "editor") {
    cardContent = (
      <com
        {...uProps}
        originConfig={originConfig}
        state={state}
        style={style}
      />
    );
  }

  // 编辑状态
  const { currentNode } = usePageInfo();

  cardContent = (
    <com
      {...uProps}
      originConfig={originConfig}
      class={["card-content"]}
      state={state}
    />
  );
  return (
    <div
      class={[
        "card",
        currentNode?.value?.id === card.id ? "card-active" : "",
        linkNameUse && "showCard",
      ]}
      style={style}
      onClick={() => {
        if (currentNode) {
          currentNode.value = card;
        }
      }}
      onDrop={async (e) => {
        await onDrop(e, card);
        currentNode.value = card;
      }}
      onDragover={(e) => {
        e.preventDefault();
      }}
      onDragenter={(e: any) => {
        if (e.target.classList.value.includes("card")) {
          e.target.classList.add("dragActive");
        }
      }}
      onDragleave={(e: any) => {
        if (e.target.classList.value.includes("card")) {
          e.target.classList.remove("dragActive");
        }
      }}
    >
      {renderSpecialBackground(
        card.styleJson.backgroundType,
        card.styleJson.background
      )}
      {cardContent}
    </div>
  );
};

// 渲染原子组
const RenderGroup = (card: inlCardTreeItem, state: editorState) => {
  if (card.layout === "tabs") return RenderTab(card, state);
  const style = computedLayStyle(card.styleJson, card.children);
  return (
    <div class="inl-card-list-box" style={{ ...style }}>
      {renderSpecialBackground(
        card.styleJson.backgroundType,
        card.styleJson.background
      )}
      {card.children.map((item) => RenderItem(item, state))}
    </div>
  );
};

// 渲染原子
const RenderItem = (card: inlCardTreeItem, state: editorState) => {
  if (card.children?.length > 0) {
    return RenderGroup(card, state);
  } else {
    let ln: any = <div>{state === "editor" ? card.name : ""}</div>;
    if (card.pageControlId !== "page") {
      ln = resolveComponent(card.pageControlId);
    }
    return renderCardByState(ln, { state, card });
  }
};

// 渲染tab布局情况
const RenderTab = (card: inlCardTreeItem, state: editorState) => {
  const style = computedLayStyle(card.styleJson, card.children, true);
  return (
    <div class="inl-card-list-box inl-card-list-tabs-box" style={{ ...style }}>
      {renderSpecialBackground(
        card.styleJson.backgroundType,
        card.styleJson.background
      )}
      <a-tabs animated class="inl-card-layout-tab">
        {card.children.map((item, key) => {
          return (
            <a-tab-pane key={key} tab={item.name}>
              {RenderItem(item, state)}
            </a-tab-pane>
          );
        })}
      </a-tabs>
    </div>
  );
};

// 计算样式信息
const computedLayStyle = (
  baseConfig: BaseConfig,
  children: Array<inlCardTreeItem>,
  unComputedGride?: boolean
) => {
  let style = {
    gridTemplateColumns: "",
    gridTemplateRows: "",
    gap: "",
    background: "",
    boxShadow: "",
    borderRadius: null,
    border: "",
    padding: "",
    margin: "",
    overflow: "",
  };
  if (!baseConfig) return style;

  const {
    rowGap,
    colGap,
    colNum,
    rowNum,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    overflow = "visible",
  } = baseConfig;
  if (unComputedGride) {
    return {
      gridTemplateColumns: "",
      gridTemplateRows: "",
      gap: "",
      background: renderBackground(baseConfig),
      boxShadow: baseConfig.boxShadow,
      borderRadius: `${baseConfig.borderRadius}px`,
      border: `${baseConfig.borderWidth}px solid ${baseConfig.borderColor}`,
      padding: `${paddingTop || 0}px ${paddingRight || 0}px ${
        paddingBottom || 0
      }px ${paddingLeft || 0}px`,
      margin: `${marginTop || 0}px ${marginRight || 0}px ${
        marginBottom || 0
      }px ${marginLeft || 0}px`,
      overflow,
    };
  }
  // grid 布局的样式信息
  style = {
    gridTemplateColumns: "",
    gridTemplateRows: "",
    gap: (colGap || 0) + "px " + (rowGap || 0) + "px",
    background: renderBackground(baseConfig),
    boxShadow: baseConfig.boxShadow,
    borderRadius: `${baseConfig.borderRadius}px`,
    border: `${baseConfig.borderWidth}px solid ${baseConfig.borderColor}`,
    padding: `${paddingTop || 0}px ${paddingRight || 0}px ${
      paddingBottom || 0
    }px ${paddingLeft || 0}px`,
    margin: `${marginTop || 0}px ${marginRight || 0}px ${marginBottom || 0}px ${
      marginLeft || 0
    }px`,
    overflow,
  };

  // 设置列的网格分布
  for (let i = 0; i < colNum; i++) {
    style.gridTemplateColumns += "1fr ";
  }
  // 设置行的网格分布
  for (let i = 0; i < rowNum; i++) {
    style.gridTemplateRows += "1fr ";
  }

  for (let i = 0; i < children.length; i++) {
    const item = children[i];
    const { width, height } = item.styleJson;

    // 列宽
    if (i < colNum * rowNum && (width || height)) {
      const { col, row } = computedPosition(i + 1, colNum);
      const gridTemplateColumns = style.gridTemplateColumns.split(" ");
      const gridTemplateRows = style.gridTemplateRows.split(" ");

      if (width) {
        gridTemplateColumns[col] = width + "px";
      }
      if (height) {
        gridTemplateRows[row] = height + "px";
      }
      style.gridTemplateColumns = gridTemplateColumns.join(" ");
      style.gridTemplateRows = gridTemplateRows.join(" ");
    }
  }

  return style;
};
/**
 *
 * @param n 表示要计算位置的整数
 * @param m  表示矩阵的总元素个数
 * @param nCols 表示矩阵的列数
 * @returns
 */
const computedPosition = (n: number, nCols: number) => {
  const row = Math.floor((n - 1) / nCols);
  const col = (n - 1) % nCols;
  return { row, col };
};

// 渲染布局
const renderFun = (cardVal: inlCardTreeItem, state: editorState) => {
  // 如果是tab布局
  if (cardVal.layout === "tabs") {
    return RenderTab(cardVal, state);
  } else {
    if (cardVal.children.length < 1) {
      return RenderItem(cardVal, state);
    } else {
      return cardVal.children.map((item) => RenderItem(item, state));
    }
  }
};

// 渲染布局结构
export const RenderLayout = defineComponent({
  name: "renderLayout",
  props: {
    state: {
      type: String as PropType<editorState>,
      default: "editor",
    },
    pageInfo: {
      type: Object as PropType<pageInfo>,
      default: {},
    },
  },
  setup(props) {
    // 页面信息
    const pageDataInfo = ref<pageInfo>({} as pageInfo);
    provide("pageData", toReactive(pageDataInfo));

    // 适配器信息
    if (props.state === "editor") {
      pageDataInfo.value = usePageInfo().pageData;
    } else {
      pageDataInfo.value = props.pageInfo;
    }

    // 样式类名
    const className = ref("");

    watch(
      () => [
        pageDataInfo.value.adapter,
        pageDataInfo.value.pageType,
        props.state,
        pageDataInfo.value.layout,
        pageDataInfo.value.clientType,
      ],
      () => {
        className.value = `inl-page-editor-stage ${
          pageDataInfo.value.adapter ? "inl-page-editor-stage-adapter" : null
        } inl-page-editor-stage-${props.state} inl-page-editor-stage-${
          pageDataInfo.value.pageType
        } inl-page-editor-stage-${
          pageDataInfo.value.clientType
        } inl-page-editor-stage-${pageDataInfo.value.layout}`;
      },
      {
        immediate: true,
      }
    );

    let styleA = ref({
      height: "100%",
      width: "100%",
      fontSize: "14px",
    });

    if (!pageDataInfo.value.adapter) {
      styleA.value.height = pageDataInfo.value.resolutionRatioH + "px";
      styleA.value.width = pageDataInfo.value.resolutionRatioW + "px";
    }

    // 监听页面信息变化
    watch(
      () => [
        pageDataInfo.value.styleJson,
        pageDataInfo.value.children,
        pageDataInfo.value.layout,
      ],
      () => {
        const style = computedLayStyle(
          pageDataInfo.value.styleJson,
          pageDataInfo.value.children,
          pageDataInfo.value.layout === "tabs" ? true : false
        );
        styleA.value = {
          ...styleA.value,
          ...style,
        };
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return () => (
      <div class={className.value} style={styleA.value}>
        {!["color", "image"].includes(
          pageDataInfo.value.styleJson?.backgroundType
        )
          ? renderSpecialBackground(
              pageDataInfo.value.styleJson?.backgroundType,
              pageDataInfo.value.styleJson?.background
            )
          : ""}

        {renderFun(pageDataInfo.value, props.state)}
      </div>
    );
  },
});
