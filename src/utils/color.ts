export interface IColorObj {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * 255颜色值转16进制颜色值
 * @param n 255颜色值
 * @returns hex 16进制颜色值
 */
export const toHex = (n: number) => `${n > 15 ? "" : 0}${n.toString(16)}`;

/**
 * 颜色对象转化为16进制颜色字符串
 * @param colorObj 颜色对象
 */
export const toHexString = (colorObj: IColorObj) => {
  const { r, g, b, a = 1 } = colorObj;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${
    a === 1 ? "" : toHex(Math.floor(a * 255))
  }`;
};
