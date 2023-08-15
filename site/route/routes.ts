import { RouteRecordRaw } from "vue-router";
import Index from "../pages/index";
import cardEditor from "../pages/cardEditor";

/**
 * 静态路由
 */

const routers: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    component: Index,
    // redirect: '/intelligentCentralizedControl',
  },
  {
    path: "/cardEditor",
    name: "cardEditor",
    component: cardEditor,
    // redirect: '/intelligentCentralizedControl',
  },
];

export default routers;
