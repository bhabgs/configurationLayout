// 事件的枚举类型
export enum InlCardEventCode {
  click = "点击事件",
  mousemove = "鼠标移动事件",
  mouseover = "鼠标移入事件",
  mouseout = "鼠标移出事件",
  mousedown = "鼠标按下事件",
  mouseup = "鼠标抬起事件",
  dblclick = "双击事件",
  keydown = "键盘按下事件",
  keypress = "键盘按键事件",
  keyup = "键盘抬起事件",
  focus = "获取焦点事件",
  blur = "失去焦点事件",
  change = "内容改变事件",
  input = "内容输入事件",
  submit = "提交事件",
  reset = "重置事件",
  select = "选中事件",
  contextmenu = "右键菜单事件",
  wheel = "滚轮事件",
  copy = "复制事件",
  cut = "剪切事件",
  paste = "粘贴事件",
  drag = "拖拽事件",
  dragstart = "拖拽开始事件",
  dragend = "拖拽结束事件",
  dragenter = "拖拽进入事件",
  dragleave = "拖拽离开事件",
  dragover = "拖拽悬停事件",
  drop = "拖拽放置事件",
  scroll = "滚动事件",
  resize = "窗口大小改变事件",
  error = "加载错误事件",
  load = "加载完成事件",
  unload = "页面关闭事件",
  hashchange = "hash改变事件",
  popstate = "历史记录改变事件",
  pageshow = "页面显示事件",
  pagehide = "页面隐藏事件",
  beforeunload = "页面关闭前事件",
}

// 脚本运行终端
enum term {
  server = "服务端",
  client = "客户端",
}

// 枚举转换成select的数据
export const InlCardEventCodeSelect = Object.keys(InlCardEventCode).map(
  (key) => {
    let k = key as keyof typeof InlCardEventCode;
    return {
      label: InlCardEventCode[k],
      value: k,
    };
  }
);
// 事件的数据类型
export interface InlCardEvent {
  id?: string; // 事件id
  pageId?: string; // 页面id
  pageControlId?: string; // 控制点id
  term: keyof typeof term; // 服务端还是客户端。。。
  events: Array<InlCardEventData>; // 事件
}

export interface InlCardEventData {
  code: keyof typeof InlCardEventCode; // 事件code
  params: Array<{ name: string; value: string }>; // 参数
  name: `${InlCardEventCode}`; // 事件名称
  script: string; // 脚本
  confirmTip: string; // 二次提示 自定义提示信息
  confirm: boolean; // 是否二次提示
}

// 根据事件的code创建默认的事件
export const createDefaultEventData = (
  code: keyof typeof InlCardEventCode
): InlCardEventData => {
  return {
    code,
    confirm: false,
    confirmTip: "",
    name: InlCardEventCodeSelect[code],
    params: [],
    script: "",
  };
};
// 根据事件的code创建默认的事件
export const createDefaultEvent = (terms: keyof typeof term): InlCardEvent => {
  return {
    term: terms, // 服务端还是客户端。。。
    events: [], // 事件
  };
};
