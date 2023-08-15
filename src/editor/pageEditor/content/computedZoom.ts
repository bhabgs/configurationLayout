type InlCardRect = {
  h: number;
  w: number;
};
const bl = 0.8;

/**
 *
 * @param a a元素大小
 * @param b b元素大小
 * @returns number(zoom)
 */
export const computedZoomByBl: (a: number, b: number) => number = (a, b) => {
  let zoom: number = a / b;
  return zoom;
};

/**
 * bw 父级别元素
 * sw 当前元素宽高
 */
export default (bw: InlCardRect, sw: InlCardRect, cbl?: number) => {
  const cbln = cbl || bl;
  const mh = bw.h * cbln;
  const mw = bw.w * cbln;
  const zw = computedZoomByBl(mw, sw.w);
  const zh = computedZoomByBl(mh, sw.h);
  const zoomv = Math.min(zw, zh);
  return {
    zoomv,
    offx: (bw.w - zoomv * sw.w) / 2 / zoomv,
    offy: (bw.h - zoomv * sw.h) / 2 / zoomv,
  };
};
