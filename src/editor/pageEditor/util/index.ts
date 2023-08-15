import _ from "lodash";
import { inject, provide, Ref } from "vue";
import {
  defaultPageInfo,
  pageInfo,
  platformListType,
  themeListType,
} from "../data";

// 对象转下拉框数组
export const objToArray = (obj) => {
  var arr = [];
  for (let i in obj) {
    if (typeof obj[i] === "object") {
      arr.push({
        label: obj[i].label,
        value: i,
        obj: obj[i],
      });
    } else {
      arr.push({
        label: obj[i],
        value: i,
      });
    }
  }
  return arr;
};

// 获取树结构
export const getTreeSructure = (tree) => {
  let result = [];

  const fn = (array) => {
    if (array.length > 0) {
      result = array.map((item) => {
        const { colNum, rowNum } = item;
        const ele = _.cloneDeep(item);
        if (colNum * rowNum > 1) {
          ele.title = "布局";
        } else {
          ele.title = "卡片";
        }

        // 清空部分属性
        ele.cardName = null;
        ele.linkName = null;
        ele.config = null;
        ele.key = null;

        if (item.children && item.children.length > 0) {
          ele.children = fn(item.children);
        }

        return ele;
      });

      return result;
    }
  };

  return fn(tree);
};

// 获取卡片数据
export const getCardObj = (e: DragEvent) => {
  let cardData = e.dataTransfer.getData("cardObj");
  let json;
  try {
    json = JSON.parse(cardData);
  } catch (error) {
    json = null;
  }

  if (json.comp) {
    json.config = {};
    for (let i in json.comp.props) {
      const item = json.comp.props[i];
      json.config[i] = {
        ...item,
        value: item?.value || item.default,
      };
    }
  }
  delete json.comp;
  return json;
};
// 插入卡片数据
export const setCardObj = (e: DragEvent, obj: any) => {
  e.dataTransfer.setData("cardObj", JSON.stringify(obj));
};

// 使用模板树结构
export const useTreeSructure = (node, template) => {
  node.width = template.width;
  node.height = template.height;

  node.colNum = template.colNum;
  node.colGap = template.colGap;
  node.rowNum = template.rowNum;
  node.rowGap = template.rowGap;

  let children = [];
  const fn = (array, parentKey) => {
    if (array.length > 0) {
      children = array.map((item, idx) => {
        const ele = _.cloneDeep(item);
        const key = `${parentKey}_${idx}`;

        ele.title = `${ele.title}${key}`;
        ele.key = key;

        if (item.children && item.children.length > 0) {
          ele.children = fn(item.children, ele.key);
        }

        return ele;
      });

      return children;
    }
  };

  fn(template.children, node.key);

  node.children = children;
};

// 获取url参数
export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
};

// 保存url参数isDev
export const checkDev = () => {
  const isDev = getQueryVariable("isDev");
  if (isDev) {
    localStorage.setItem("isDev", "true");
  }
};

// 设置全局主题
export const cardThemeFun = {
  set(theme: themeListType, th: Ref<themeListType>) {
    return provide("card-theme", th);
  },
  get() {
    return inject<Ref<themeListType>>("card-theme") || { value: "system" };
  },
  computedTheme(th: themeListType) {
    let theme: themeListType = th;
    if (th === "system") {
      const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
      if (themeMedia.matches) {
        theme = "light";
      } else {
        theme = "dark";
      }
    }
    return theme;
  },
};

export const createEditorTemplateJson: (
  type: platformListType,
  info?: pageInfo
) => pageInfo = (type, info) => {
  // 深拷贝一份
  let udPageInfo = _.cloneDeep(defaultPageInfo) as pageInfo;
  const dd = {} as pageInfo;

  for (let i in info) {
    if (info[i]) dd[i] = info[i];
  }
  return Object.assign(udPageInfo, dd);
};

// 格式化props
export const formatProps = (props) => {
  let newProps = {};
  for (let i in props) {
    if (props[i] !== undefined) {
      newProps[i] = props[i].value;
    }
  }

  return newProps;
};

export const unCode = (str: string) => {
  const code = window.atob(str);
  return decodeURIComponent(code);
};
export const enCode = (str: string) => {
  const code = encodeURIComponent(str);
  return window.btoa(code);
};
