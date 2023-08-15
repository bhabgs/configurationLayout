import { message } from "ant-design-vue";

/**
 *
 * @param obj1
 * @param obj2
 * @returns Boolean
 */
export const diffPageInfo: (obj1: Object, obj2: Object) => boolean = (
  obj1,
  obj2
) => {
  const o1 = obj1 instanceof Object;
  const o2 = obj2 instanceof Object;
  // 判断是不是对象
  if (!o1 || !o2) {
    return obj1 === obj2;
  }
  // 判断两个对象的keys数量是否相同
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let o in obj1) {
    if (!obj2.hasOwnProperty(o)) return false;
  }
  return true;
};

// 生成8位id不重复
export const generateUUID: () => string = () => {
  const prefix = Date.now().toString().slice(-3);
  const suffix = Math.floor(Math.random() * 100000)
    .toString()
    .slice(-5);
  return prefix + suffix;
};

// 消息提醒加埋点
export const inlMessage: (
  msg: string,
  type: "error" | "success",
  devMessage?: string
) => void = (msg, type, devMessage) => {
  // 埋点
  const location = window.location;
  const params = {
    href: location.href,
    type,
    msg: devMessage || msg,
    time: new Date().getTime(),
  };

  if (type === "error") {
    console.error(params);
  }
  // axios.post('/api/message', params);

  // 提醒
  message[type](msg);
};
