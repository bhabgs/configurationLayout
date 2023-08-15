import { Chart } from "@antv/g2";

export default (el, data) => {
  const chart = new Chart({
    container: el,
    autoFit: true,
    renderer: "svg",
  });

  chart.data(data);
  chart.scale("year", {
    type: "linear",
  });
  chart.scale("value", {
    nice: true,
  });

  chart.axis("value", {
    grid: {
      line: {
        style: {
          stroke: "rgba(255,255,255,0.2)",
          lineDash: [3, 2],
        },
      },
    },
    label: {
      style: {
        fill: "#9EACC6",
      },
    },
  });

  chart.legend({
    position: "top",
    itemName: {
      style: {
        fill: "#DBE0EA",
      },
    },
    marker: {
      symbol: "hyphen",
    },
  });

  chart.axis("year", {
    line: null,
    grid: null,
    label: {
      style: {
        fill: "#C8CCD2",
      },
    },
  });

  chart.tooltip({
    showCrosshairs: true,
    shared: true,
  });

  chart.line().adjust("stack").position("year*value").color("country");
  chart.point().adjust("stack").position("year*value").color("country").size(2);

  chart.interaction("element-highlight");

  chart.render();
  return chart;
};
