export interface inlCardPoint {
  x: number;
  y: number;
}

export default (
  dom: HTMLElement,
  stage: HTMLElement,
  mouseMoveCallBack: (
    a: inlCardPoint,
    b: inlCardPoint,
    c: inlCardPoint
  ) => void,
  moveEnd: () => void
) => {
  let space = false;
  let isMouseDown = false;
  const startPoint = {
    x: 0,
    y: 0,
  };
  // 遮罩的显示隐藏
  const maskDom = document.getElementById("card-editor-mask");
  const setMaskDomZindex = (state: boolean) => {
    if (state) {
      maskDom.style.setProperty("z-index", "99");
    } else {
      maskDom.style.setProperty("z-index", "-1");
    }
  };

  // 鼠标拖动事件
  const mouseMoveEvent = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const endPoint = { x: offsetX, y: offsetY };
    const movePoint = {
      x: startPoint.x - offsetX,
      y: startPoint.y - offsetY,
    };
    mouseMoveCallBack(startPoint, endPoint, movePoint);
  };
  const mouseMove = (state: boolean) => {
    if (state && isMouseDown) {
      maskDom.addEventListener("mousemove", mouseMoveEvent);
    } else {
      maskDom.removeEventListener("mousemove", mouseMoveEvent);
    }
  };

  // 按住画布事件
  const mouseDown = (e: MouseEvent) => {
    isMouseDown = true;
    const { offsetX, offsetY } = e;
    startPoint.x = offsetX;
    startPoint.y = offsetY;
    mouseMove(true);
  };
  maskDom.addEventListener("mousedown", mouseDown);

  maskDom.addEventListener("mouseup", (e) => {
    const { offsetX, offsetY } = e;
    isMouseDown = false;
    mouseMove(false);
    moveEnd();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !space) {
      space = true;
      setMaskDomZindex(true);
      mouseMove(true);
    }
  });

  window.addEventListener("keyup", (e) => {
    space = false;
    isMouseDown = false;
    setMaskDomZindex(false);
    mouseMove(false);
    moveEnd();
  });
};
