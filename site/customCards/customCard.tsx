import {
  cardBox,
  createCardProps,
  cardDefComponent,
  CardHead,
  CardBody,
} from "../../dist";
import { defineComponent } from "vue";

const controlId = "inl-card-cdc";
const componentDetail = {
  cname: "asdas超哥dasd",
  controlId,
  tags: [],
  code: "card",
};
const props = createCardProps({
  title: {
    type: String,
    default: "vvvv",
    label: "卡片标题",
    state: "string",
  },
});
const customCard = defineComponent({
  props,
  components: {
    cardBox,
    CardHead,
    CardBody,
  },
  setup(props, ctx) {
    return () => (
      <cardBox
        vSlots={{
          cardBody: () => (
            <CardBody
              vSlots={{
                customCardBody: () => <>asd</>,
              }}
            />
          ),
          cardHead: () => <CardHead title={props.title} />,
        }}
      />
    );
  },
});

export default cardDefComponent(customCard, componentDetail);
