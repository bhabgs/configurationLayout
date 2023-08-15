import { createApp } from "vue";
import antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import lay from "./pages/layout";
import router from "./route";
import cards from "../dist/elements";
import customCards from "./customCards";
import "inl-ui/dist/style.css";
import "../dist/style.css";
import "./index.css";

import "inl-ui/dist/iconfont.js";

const app = createApp(lay);

app.use(router).use(antd).use(cards).use(customCards).mount('#inl-card');
