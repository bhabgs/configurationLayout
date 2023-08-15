// 默认动画函数
export const cardAnimateDefault = (opt: {
  callBack: () => void;
  speed: number;
}) => {
  const { callBack, speed } = opt;
  let anim;
  const an = () => {
    anim = setTimeout(() => {
      callBack();
      an();
    }, speed);
  };
  an();
  return {
    stop() {
      clearTimeout(anim);
    },
    start() {
      an();
    },
  };
};
