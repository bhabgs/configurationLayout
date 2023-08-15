const scaleBy = 1.07;
export default (
  dom: HTMLElement,
  stage: HTMLElement,
  cb: (zoom: number) => void
) => {
  const wheelTodo = (e: WheelEvent) => {
    if (e.shiftKey) {
      const zoom = stage.style.getPropertyValue("zoom") as unknown as number;
      const newScale = e.deltaY < 0 ? zoom * scaleBy : zoom / scaleBy;
      cb(newScale);
    }
  };

  dom.addEventListener("mouseenter", () => {
    window.addEventListener("wheel", wheelTodo);
  });
  dom.addEventListener("mouseleave", () => {
    window.removeEventListener("wheel", wheelTodo);
  });
};
