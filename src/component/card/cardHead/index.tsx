import { defineComponent } from "vue";
import Tabs from "@/component/tabs";
import { createCardProps } from "../cardUtils";

const Props = createCardProps({});
export default defineComponent({
  props: Props,
  emits: ["tabChange"],
  setup(props, ctx) {
    const isArray = (arr) => {
      return Object.prototype.toString.call(arr) === "[object Array]";
    };
    return () => (
      <div class="inl-card-cardHead">
        {props.showTitle ? (
          <div>
            <>
              <div class="opt-lay">
                <div class="light"></div>
                <div class="head-icon"></div>
              </div>

              <div class="inl-card-cardHead-cardName">{props.title}</div>
            </>
          </div>
        ) : null}
        {props.tabs.length > 0 && isArray(props.tabs) ? (
          <Tabs
            state="line"
            tabs={props.tabs}
            onChange={(e) => {
              console.log(e);
              ctx.emit("tabChange", e);
            }}
          />
        ) : null}
      </div>
    );
  },
});
