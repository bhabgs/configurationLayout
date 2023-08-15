# inl-card 使用文档

## 编辑引用

## 用户自定义卡片

`main.ts`
``` ts
import { createApp } from "vue";
// 引入inl-cards
import cards from "inl-card-v2/cards";
import "inl-card-v2/style.css";
import "inl-card-v2/iconfont.js";
// 项目主页
import main from "./index";
// 用户自定义卡片
import customCards from "./customCards";
import "./index.css";

const app = createApp(main);
// 把自带卡片和自定义卡片同时注册进去
app.use(customCards).use(cards).mount("#inl-card");
```

> `customCards（文件夹）`
> > `index.ts`
>
``` ts
import { App } from "vue";
import { cardCompInfo } from "inl-card-v2";
import cc from "./customCard";

const comp = [cc];
const components: Record<string, cardCompInfo> = {};
for (let i of comp) {
  components[i.linkName] = {
    comp: i.comp,
    cname: i.cname,
    linkName: i.linkName,
    tags: i.tags,
  };
}
export default {
  install(app: App) {
    for (let i of comp) {
      app.component(i.linkName, i.comp);
    }
  },
  cards: components,
  version: "0.0.1",
};
```
> > 
> > `customCard.tsx`
> >
``` ts
import { defineComponent } from "vue";
// 引入相关类型和默认组件
import {
  cardBox,
  createCardProps,
  cardDefComponent,
  cardTags,
  cardHead,
  cardBody,
} from "inl-card-v2";

const linkName = "inl-card-cdc";
const componentDetail = {
  cname: "用户自定义卡片一",
  linkName,
  tags: [cardTags.anquan],
};
const props = createCardProps({});
const customCard = defineComponent({
  props,
  components: {
    cardBox,
    cardHead,
    cardBody,
  },
  setup(props, ctx) {
    return () => (
      <cardBox
        vSlots={{
            // 卡片身体部分
          cardBody: () => (
            <cardBody
              vSlots={{
                customCardBody: () => <>asd</>,
              }}
            />
          ),
            // 卡片头部
          cardHead: () => <cardHead title={componentDetail.cname} />,
        }}
      />
    );
  },
});

export default cardDefComponent(customCard, componentDetail);

```


`index.tsx`
``` ts
import { defineComponent } from "vue";
import { cardEditor } from "inl-card-v2";
import customCards from "./customCards";
const components: Record<string, any> = {
  cardEditor,
};

export default defineComponent({
  components,
  setup() {
    const save = () => {
      console.info("保存回调");
    };

    return () => (
      <>
        <cardEditor
          onSaveCallback={save}
          customCards={customCards.cards}
          currentRecord={{
            id: "479278807188275200",
            createUser: "2",
            createDt: "2023-04-03T05:22:52.000+00:00",
            updateUser: "2",
            updateDt: "2023-04-03T05:53:34.000+00:00",
            pageName: "页面名称77",
            pageDetail: 'pagejson'
          }}
        />
      </>
    );
  },
});

```

## 预览引用
``` tsx
import {productionComponent, cardEditor, PageInfo} from 'inl-card-v2';
import {defineComponent} from 'vue';

// componentProps
const props = {
    pageInfo: {
        type: Object as PropType<pageInfo>,
    },
    customCards: {
        type: Object as PropType<Record<string, cardCompInfo>>,
        default: {},
    },
}
// use
export default defineComponent({
    components: {
        defineComponent
    },
    setup() {
        const pageInfo: PageInfo;
        return <>
                <defineComponent customCards={} pageInfo={pageInfo} />
            </>
    }
})
```

### 通过IU+PC查询点地址和点数据(接口一)
> 用于应用中心的动态表格和状态属性首次查询。
``` ts
export const getPointData = async (params: {
  instanceIdList: string[];
  propertyCodeList: string[];
  thingCode?: string; // 只查询同一类物模型
}): Promise<
  Array<{
    instanceId: string;
    propertyIdAndPointInfo: Record<
      string,
      { pointCode: string | null; value: string | boolean }
    >;
  }>
> => {
  return await instance.post(
    "/mtip/thing/v2/thingInstAdapter/getPrePointCodeAndValueByIuPC",
    params
  );
};
```
