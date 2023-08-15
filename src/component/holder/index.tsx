import * as api from "@/api/thingInstance";
import { defineComponent, watch } from "vue";
import { message } from "ant-design-vue";
import img from "../../assets/imgs/holder.png";

export default defineComponent({
  cname: "云台",
  name: "holder",
  props: {
    iu: String,
    speed: {
      type: Number,
      default: 1,
    },
  },
  setup(props, ctx) {
    // 控制云台
    const controlHolder = (e, v) => {
      const position = e.target.getAttribute("title");
      if (!position) return;
      if (props.iu && position) {
        // const val = v === true ? "1" : "0";
        if (v) {
          const val = String(props.speed || 1);
          api.setData(props.iu, position, val);
        } else {
          // 下发两遍stop 防止停不住
          handleStop();
          handleStop();
        }
      } else {
        message.error("请确保设备存在且已绑定云台控制");
      }
    };

    const handleStop = () => {
      return api.setData(props.iu, "STOP", "1");
    };

    return () => (
      <>
        <div
          class="inl-card-holder"
          onMouseup={(e) => {
            controlHolder(e, false);
          }}
          onMousedown={(e) => {
            controlHolder(e, true);
          }}
          style={{
            backgroundImage: `url(${img})`,
          }}
        >
          <div title=""></div>
          <div title="UP"></div>
          <div title=""></div>
          <div title="LEFT"></div>
          <div class="inl-card-holder-center" onClick={handleStop}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div title="RIGHT"></div>
          <div title=""></div>
          <div title="DOWN"></div>
          <div title=""></div>
        </div>
        <span class={"inl-card-holder-title"}>云台控制</span>
      </>
    );
  },
});
