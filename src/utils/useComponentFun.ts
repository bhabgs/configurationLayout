import { cardCompInfo } from "@/elements/utils";
import { App } from "vue";

export default (cards: Array<cardCompInfo>, version?: string) => {
  const components: Record<string, cardCompInfo> = {};
  for (let i of cards) {
    const tags = i.tags;
    if (i.code === "pcCard") {
      components[i.pageControlId] = {
        comp: i.comp,
        cname: i.cname,
        pageControlId: i.pageControlId,
        tags,
        isCustomCard: i.isCustomCard,
        code: i.code || "pcCard",
        thumbnail: i.thumbnail,
      };
    }
  }
  return {
    install(app: App) {
      for (let i of cards) {
        app.component(i.pageControlId, i.comp);
      }
    },
    cards: components,
    version: version || "0.0.1",
  };
};
