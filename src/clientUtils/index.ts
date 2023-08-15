import _ from "lodash";
import dayjs from "dayjs";
import * as G2 from "@antv/g2";
import * as vueUse from "@vueuse/core";
import * as inl from "inl-ui";
import * as utils from "./utils";
import app from "./app";
import three from "./three";
import { onMounted } from "vue";

const clientUtils = {
  http: {},
  G2,
  app,
  tools: {
    inl,
    ...utils,
    _,
    vueUse,
    dayjs,
    onMounted,
    three,
  },
};

export default clientUtils;
