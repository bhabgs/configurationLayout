import { defineComponent, PropType, ref } from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import { VideoBox } from "inl-ui/dist/video";
import "inl-ui/dist/video/style.css";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { TabItem } from "@/component/tabs";

/**
 * 卡片属性
 */
const Props = createCardProps({
  camera: {
    type: Array,
    default: [],
    label: "相机",
    state: "VideoSelect",
    dataDictionary: {
      hasThingProps: false,
      multiple: false,
    },
  },
  state: {
    type: String,
    default: "product",
    label: "状态",
    state: "string",
    hide: true,
  },
  tabs: {
    type: Array as PropType<Array<TabItem>>,
    default: [],
    label: "选项卡",
    state: "VideoSelect",
    dataDictionary: {
      multiple: true,
    },
  },
});
/**
 * 卡片信息
 */
const cardCompInfo = useCardCompInfo({
  cname: "视频",
  pageControlId: "inl-card-video",
  code: "pcCard",
  tags: [],
  cardType: "standard",
  thumbnail: "video.png",
});
/**
 *  卡片主体
 */
const VideoCard = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardHead,
    cardBody,
    VideoBox,
  },
  props: Props,
  setup(props, ctx) {
    /**
     * @description 渲染视频
     * @param type 类型
     * @returns JSX.Element 渲染结果
     */
    const tabValue = ref<any>();

    const renderVideo = (type?: string) => {
      const v = tabValue.value
        ? tabValue.value.uuid
        : props.camera && props.camera.length > 0
        ? props.camera[0]?.uuid
        : null;
      return v ? <VideoBox camera={v}></VideoBox> : null;
    };

    /**
     * 卡片主体
     */
    return () => (
      <Defaultcardfrom
        {...props}
        onTabChange={(e) => {
          tabValue.value = e;
        }}
        vSlots={{
          cardBody: () => (
            <cardBody
              {...props}
              vSlots={{
                /**
                 * @description 自定义卡片主体
                 * @returns JSX.Element 渲染结果
                 */
                customCardBody: () => {
                  switch (props.state) {
                    case "production":
                      return renderVideo();
                    case "preview":
                      return renderVideo();
                    case "editor":
                      // return renderImg("editor");
                      return renderVideo();
                  }
                },
              }}
            />
          ),
        }}
      />
    );
  },
});

/**
 * 卡片定义
 */
export default cardDefComponent(VideoCard, cardCompInfo);
