import { cardAnimateDefault } from "@/utils/cardAnimate";
import { Ref } from "vue";

export default (dom: Ref<Element>) => {
  const { clientHeight, scrollHeight } = dom.value;

  let moveScrollTop = 0;
  const animate = cardAnimateDefault({
    callBack() {
      const { scrollTop } = dom.value;
      if (scrollHeight - scrollTop <= clientHeight) {
        moveScrollTop = 0;
      } else {
        moveScrollTop = dom.value.scrollTop + 1;
      }

      dom.value.scrollTo(0, moveScrollTop);
    },
    speed: 20,
  });
  dom.value.addEventListener("mouseenter", () => {
    animate.stop();
  });
  dom.value.addEventListener("mouseleave", () => {
    animate.start();
  });
};
