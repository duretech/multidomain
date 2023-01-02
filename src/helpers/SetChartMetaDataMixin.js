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
        if (["stack", "stack_bar"].includes(chartOptions.type)) {
          type = chartOptions.type === "stack_bar" ? "bar" : "column";
        }

        let oType = ["stack", "stack_bar"].includes(chartOptions.type)
          ? "stack"
          : "";
        let isStack = ["stack", "stack_bar"].includes(chartOptions.type);
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
              stacking: isStack ? "normal" : "",
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
          ? chartOptions.title.text
          : "";
        chartData.title.title = `${chartOptions.chartName}${chartSource}`;
        chartData.subtitle.text = chartOptions.subTitle.visible
          ? chartOptions.subTitle.text
          : "";
        if (type !== "packedbubble") {
          if (Array.isArray(chartData.xAxis)) {
            chartData.xAxis[0].title.text = chartOptions.xAxis.visible
              ? chartOptions.xAxis.text
              : "";
          } else {
            chartData.xAxis.title.text = chartOptions.xAxis.visible
              ? chartOptions.xAxis.text
              : "";
          }
          chartData.yAxis.title.text = chartOptions.yAxis.visible
            ? chartOptions.yAxis.text
            : "";
        }
        this.source = chartOptions.source;
      }
      return chartData;
    },
  },
};
