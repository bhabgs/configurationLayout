import { Ref, VNode, nextTick, ref, watch } from "vue";
import _ from "lodash";
import {
  backgroundType,
  backgroundTypeList,
  inlCardTreeItem,
  layoutList,
  nodeTemplate,
} from "../../../data";
import rootConfig from "./rootConfig";
import usePageInfo from "@/editor/utils/hooks/usePageInfo";
import BoxShadow from "@/editor/utils/renderPropsConfig/boxShadow";
import ImageUpload from "@/editor/utils/renderPropsConfig/imageUpload";
import ColorChoose from "@/component/ColorPicker";

const backgroundTypeSelect = Object.keys(backgroundTypeList).map((key) => ({
  label: backgroundTypeList[key],
  value: key,
}));

export default () => {
  // 注入相关数据方便子组件使用
  const { pageData, currentNode } = usePageInfo();

  // 缓存变换前的节点
  const cacheNodeInfo: Ref = ref([]);
  // 设置布局树
  const settingLayoutTree = () => {
    const { colNum, rowNum } = currentNode.value.styleJson;
    currentNode.value.children = [];
    currentNode.value.config = null;
    currentNode.value.pageControlId = "page";
    for (let i = 0; i < colNum * rowNum; i++) {
      const cnode = cacheNodeInfo.value[i]
        ? _.cloneDeep(
            Object.assign(_.cloneDeep(nodeTemplate), cacheNodeInfo.value[i])
          )
        : _.cloneDeep(nodeTemplate);
      currentNode.value.children.push({
        ...cnode,
        id: _.uniqueId() + new Date().getTime(),
        sort: i,
        pageId: pageData.pageId,
      });
    }
  };

  // 重置卡片
  const resetCard = () => {
    currentNode.value.pageControlId = "page";
  };

  // 监听当前节点的列数和行数变化
  watch(
    () => [
      currentNode.value.styleJson.colNum,
      currentNode.value.styleJson.rowNum,
      currentNode.value.id,
    ],
    (nval, oldV) => {
      if (nval[2] === oldV[2]) {
        cacheNodeInfo.value = _.cloneDeep(currentNode.value.children);
        nextTick(() => {
          settingLayoutTree();
        });
      }
    }
  );

  // 渲染布局模板
  const renderLayoutType = () => {
    let jsx: JSX.Element[] = [];
    for (let i in layoutList) {
      jsx.push(<a-select-option value={i}>{layoutList[i]}</a-select-option>);
    }
    return jsx;
  };

  // 是否是根节点
  const isRootNode = () => {
    return currentNode.value.id === "0";
  };

  // 根据布局方式渲染控制项
  const renderLayoutConfig = () => {
    let isFormPage = pageData.pageType === "form";

    return (
      <>
        {currentNode.value.pageControlId !== "page" ? (
          <a-form-item label=" " class="layout_config">
            <a-popconfirm
              title="清空卡片或布局，请慎重操作。"
              ok-text="是"
              cancel-text="否"
              onConfirm={() => {
                resetCard();
              }}
            >
              <a-button>重置卡片</a-button>
            </a-popconfirm>
          </a-form-item>
        ) : null}

        <a-form-item label="网格设置" class="layout_config">
          <a-input-number
            min={1}
            vSlots={{
              addonBefore() {
                return <>行</>;
              },
              addonAfter() {
                return <>row</>;
              },
            }}
            v-model={[currentNode.value.styleJson.rowNum, "value"]}
          />
          <a-input-number
            min={0}
            vSlots={{
              addonBefore() {
                return <>行间距</>;
              },
              addonAfter() {
                return <>px</>;
              },
            }}
            v-model={[currentNode.value.styleJson.colGap, "value"]}
          />
          <a-input-number
            disabled={isFormPage}
            min={1}
            vSlots={{
              addonBefore() {
                return <>列</>;
              },
              addonAfter() {
                return <>col</>;
              },
            }}
            v-model={[currentNode.value.styleJson.colNum, "value"]}
          />
          <a-input-number
            min={0}
            disabled={isFormPage}
            vSlots={{
              addonBefore() {
                return <>列间距</>;
              },
              addonAfter() {
                return <>px</>;
              },
            }}
            v-model={[currentNode.value.styleJson.rowGap, "value"]}
          />
        </a-form-item>
        <a-form-item label="宽高设置" class="layout_config">
          <a-input-number
            min={0}
            vSlots={{
              addonBefore() {
                return <>宽度</>;
              },
              addonAfter() {
                return <>px</>;
              },
            }}
            v-model={[currentNode.value.styleJson.width, "value"]}
          />
          <a-input-number
            min={0}
            vSlots={{
              addonBefore() {
                return <>高度</>;
              },
              addonAfter() {
                return <>px</>;
              },
            }}
            v-model={[currentNode.value.styleJson.height, "value"]}
          />
        </a-form-item>
      </>
    );
  };

  const renderMargin = (type: "margin" | "padding") => {
    let res: VNode[] = [];
    const directions = [
      { type: "Top", label: "上" },
      { type: "Right", label: "右" },
      { type: "Bottom", label: "下" },
      { type: "Left", label: "左" },
    ];
    directions.forEach((d) => {
      res.push(
        <a-input-number
          addonBefore={d.label}
          addonAfter="px"
          v-model:value={currentNode.value.styleJson[`${type}${d.type}`]}
        ></a-input-number>
      );
    });
    return res;
  };

  const renderBackgroundCpn = (type: backgroundType) => {
    if (type === "color") {
      return (
        <a-form-item label="背景色">
          <ColorChoose v-model:color={currentNode.value.styleJson.background} />
        </a-form-item>
      );
    } else if (type === "image") {
      return (
        <>
          <a-form-item label="背景图片">
            <ImageUpload
              v-model:value={currentNode.value.styleJson.background}
            />
          </a-form-item>
        </>
      );
    } else {
      return (
        <a-form-item label="背景">
          <a-input
            v-model:value={currentNode.value.styleJson.background}
          ></a-input>
        </a-form-item>
      );
    }
  };

  return () => (
    <>
      {rootConfig()}
      <div class="auxiliary-text">背景设置</div>
      <a-form-item label="背景类型">
        <a-select
          options={backgroundTypeSelect}
          v-model:value={currentNode.value.styleJson.backgroundType}
        ></a-select>
      </a-form-item>
      {renderBackgroundCpn(currentNode.value.styleJson.backgroundType)}
      <a-form-item label="阴影设置">
        <BoxShadow v-model:value={currentNode.value.styleJson.boxShadow} />
      </a-form-item>
      <div class="auxiliary-text">布局配置</div>
      <a-form-item label="布局方式">
        <a-select v-model={[currentNode.value.layout, "value"]}>
          {renderLayoutType()}
        </a-select>
      </a-form-item>
      {renderLayoutConfig()}
      <a-form-item label="外边距" class="layout_config">
        {renderMargin("margin")}
      </a-form-item>
      <a-form-item label="内边距" class="layout_config">
        {renderMargin("padding")}
      </a-form-item>
      <a-form-item label="边框" class="layout_config">
        <a-input-number
          addonBefore="宽度"
          addonAfter="px"
          v-model:value={currentNode.value.styleJson.borderWidth}
        ></a-input-number>
        <a-input
          type="color"
          addonBefore="颜色"
          v-model:value={currentNode.value.styleJson.borderColor}
        ></a-input>
      </a-form-item>
      <a-form-item label="圆角">
        <a-input-number
          addonAfter="px"
          v-model:value={currentNode.value.styleJson.borderRadius}
        ></a-input-number>
      </a-form-item>
      <a-form-item label="超出显示">
        <a-select v-model:value={currentNode.value.styleJson.overflow}>
          <a-select-option value="visible">显示</a-select-option>
          <a-select-option value="hidden">隐藏</a-select-option>
          <a-select-option value="auto">滚动</a-select-option>
        </a-select>
      </a-form-item>
    </>
  );
};
