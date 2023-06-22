export default {
  data() {
    return {
      indicatorConfig: {
        indicator: {
          name: this.$i18n.t("default"),
          color: "#000000",
          disable: false,
          subIndicator: [],
          static_name: "",
        },
      },
      subIndicatorConfig: {
        name: this.$i18n.t("default"),
        selectedDE: [],
        color: "#000000",
        type: "indicator",
        static_name: "",
      },
      chartSettingConfig: {
        chartOptions: {
          cid: "",
          disable: false,
          chartName: this.$i18n.t("default"),
          chartInfo: "",
          type: "column",
          source: "",
          title: {
            text: "",
            visible: false,
          },
          subTitle: {
            text: "",
            visible: false,
          },
          tooltip: {
            color: "#fff",
            shared: true,
            useHTML: true,
          },
          xAxis: {
            text: "",
            visible: false,
          },
          yAxis: {
            text: "",
            visible: false,
          },
          dataLabels: false,
          color: "#000000",
          isSingleSource: true,
          isSavedData: false,
          dataMapping: [],
          dataMapping2: [],
          percentageIndicator: false,
          chartCategory: "REGIONAL",
          seasonalPeriod: 2,
          benchmarks: [],
          benchmarkInLegend: false,
          seasonalColors: [],
          chartDrillDown: false,
          drillCalculation: "DEFAULT",
          drillYTitle: "",
          drillPointBenchmark: false,
          chartDataSum: true,
          chartDataSum2: true,
          sumLegend: "",
          sumLegend2: "",
          generateOutliers: false,
          generateSummary: false,
          priorityIndicator: false,
          chartCalculation: "DEFAULT",
          generateTotal: false,
          totalLegend: "",
          totalColor: "#000000",
          totalPosition: "FIRST",
          generateFlag: false,
          compareFlag: false,
          priorityFlagIndicator: null,
        },
      },
      mapSettingConfig: {
        chartOptions: {
          cid: "",
          disable: false,
          chartName: this.$i18n.t("default"),
          chartInfo: "",
          source: "",
          type: "map",
          levels: [],
          isSingleSource: true,
          isSavedData: false,
          dataMapping: [],
          percentageIndicator: false,
        },
      },
      backgroundData: {
        CT: {
          substantialChange: 5,
        },
        IC: {
          standardDeviation: 2,
        },
        CC: {
          r2Max: 1,
          minOutlier: 20,
          wastageFactor: 20,
          qualityThreshold: 33,
          outliersColor: "#FF0000",
          idleTrendColor: "#FFFFFF",
          linearTrendColor: "#FFFFFF",
          qualityThresholdColor: "#FFFFFF",
        },
      },
    };
  },
};
