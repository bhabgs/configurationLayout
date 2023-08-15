import stageMove, { inlCardPoint } from "./stageMove";
import wheel from "./wheel";

export default (
  dom: HTMLElement,
  stage: HTMLElement,
  cb: {
    wheel: (zoom: number) => void;
    move: (a: inlCardPoint, b: inlCardPoint, c: inlCardPoint) => void;
    moveEnd: () => void;
  }
) => {
  wheel(dom, stage, cb.wheel);
  stageMove(dom, stage, cb.move, cb.moveEnd);
};
