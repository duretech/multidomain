export default {
  methods: {
    setMetaData({ chartData, chartOptions, chartSource = "" }) {
      if (chartOptions) {
        let type = chartOptions.type;
        if (chartData.chart.type === "lowmedhigh") {
          type = chartData.chart.type;
        }
        if (["cluster_bar"].includes(chartOptions.type)) {
          type = "bar";
        }
        if (chartOptions.type.includes("stack")) {
          type = chartOptions.type.includes("bar") ? "bar" : "column";
        }

        let oType = chartOptions.type.includes("stack")
          ? chartOptions.type
          : "";
        let isStack = chartOptions.type.includes("stack"),
          isPercent = chartOptions.type.includes("percent");
        let height = type === "packedbubble" ? chartData.chart.height : null;
        chartData = {
          ...chartData,
          chart: { ...chartData.chart, height, type, oType },
        };
        let plotOptions = null;
        if (chartData.plotOptions && type !== "packedbubble") {
          plotOptions = {
            ...chartData.plotOptions,
            series: {
              ...chartData.plotOptions.series,
              stacking: isStack ? (isPercent ? "percent" : "normal") : "",
              dataLabels: {
                enabled: chartOptions.dataLabels,
              },
              grouping: ["cluster_bar"].includes(chartOptions.type)
                ? false
                : true,
            },
          };
        }
        if (plotOptions) {
          chartData = {
            ...chartData,
            plotOptions,
          };
        }
        chartData.title.text = chartOptions.title.visible
          ? chartOptions.title.text[this.$i18n.locale]
          : "";
        chartData.title.title = `${
          chartOptions.chartName[this.$i18n.locale]
        }${chartSource}`;
        chartData.subtitle.text = chartOptions.subTitle.visible
          ? chartOptions.subTitle.text[this.$i18n.locale]
          : "";
        if (type !== "packedbubble") {
          if (Array.isArray(chartData.xAxis)) {
            chartData.xAxis[0].title.text = chartOptions.xAxis.visible
              ? chartOptions.xAxis.text[this.$i18n.locale]
              : "";
          } else {
            chartData.xAxis.title.text = chartOptions.xAxis.visible
              ? chartOptions.xAxis.text[this.$i18n.locale]
              : "";
          }
          chartData.yAxis.title.text = chartOptions.yAxis.visible
            ? chartOptions.yAxis.text[this.$i18n.locale]
            : "";
        }
        this.source = chartOptions.source[this.$i18n.locale];
        if (isPercent) {
          chartData.tooltip.pointFormat =
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>';
        }
      }
      return chartData;
    },
  },
};
