import {
  PageType,
  platformList,
  resolutionRatioTemp,
  themeList,
} from "@/editor/pageEditor/data";
import usePageInfo from "@/editor/utils/hooks/usePageInfo";

export default () => {
  const { pageData, currentNode } = usePageInfo();
  // 渲染主题列表
  const renderThemeList = () => {
    let jsx: JSX.Element[] = [];
    for (let i in themeList) {
      jsx.push(<a-select-option value={i}>{themeList[i]}</a-select-option>);
    }
    return jsx;
  };

  // 渲染平台列表
  const renderTerminalList = () => {
    let jsx: JSX.Element[] = [];
    for (let i in platformList) {
      jsx.push(
        <a-select-option value={i}>{platformList[i].label}</a-select-option>
      );
    }
    return jsx;
  };

  // 渲染页面类型
  const renderPageType = () => {
    let jsx: JSX.Element[] = [];
    for (let i in PageType) {
      jsx.push(<a-select-option value={i}>{PageType[i]}</a-select-option>);
    }
    return jsx;
  };

  const isRootNode = () => {
    return currentNode.value.id === "0";
  };

  const render = () => {
    let jsx: JSX.Element[] = [];

    if (isRootNode()) {
      jsx.push(
        <>
          <div class="auxiliary-text">基础设置</div>
          <a-form-item label="页面名称">
            <a-input v-model={[pageData.name, "value"]} />
          </a-form-item>
          <a-form-item label="平台">
            <a-select
              onChange={(e) => {
                const { width, height } = resolutionRatioTemp[e];
                pageData.resolutionRatioW = width;
                pageData.resolutionRatioH = height;
              }}
              v-model={[pageData.clientType, "value"]}
            >
              {renderTerminalList()}
            </a-select>
          </a-form-item>

          <a-form-item label="页面类型">
            <a-select v-model={[pageData.pageType, "value"]}>
              {renderPageType()}
            </a-select>
          </a-form-item>
          <a-form-item label="分辨率" class="root_config_resolution">
            <a-input
              vSlots={{
                addonBefore() {
                  return <>宽度</>;
                },
                addonAfter() {
                  return <>px</>;
                },
              }}
              v-model={[pageData.resolutionRatioW, "value"]}
            />

            <a-input
              vSlots={{
                addonBefore() {
                  return <>高度</>;
                },
                addonAfter() {
                  return <>px</>;
                },
              }}
              v-model={[pageData.resolutionRatioH, "value"]}
            />
          </a-form-item>
          <a-form-item label="适应画布">
            <a-switch v-model:checked={pageData.adapter} />
          </a-form-item>
          <a-form-item label="版本信息">
            <a-input disabled v-model={[pageData.version, "value"]} />
          </a-form-item>

          <a-form-item label="主题">
            <a-select v-model={[pageData.theme, "value"]}>
              {renderThemeList()}
            </a-select>
          </a-form-item>
        </>
      );
    } else {
      jsx.push(
        <>
          <div class="auxiliary-text">基础设置</div>
          <a-form-item label="节点名称">
            <a-input v-model={[currentNode.value.name, "value"]} />
          </a-form-item>
        </>
      );
    }
    return jsx;
  };

  return render();
};
