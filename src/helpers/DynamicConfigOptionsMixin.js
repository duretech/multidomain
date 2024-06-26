import { getColor } from "@/components/Common/commonFunctions";

export default {
  data() {
    return {
      indicatorConfig: {
        indicator: {
          name: this.$i18n.t("default"),
          color: getColor(),
          disable: false,
          subIndicator: [],
          static_name: "",
        },
      },
      subIndicatorConfig: {
        name: this.$i18n.t("default"),
        selectedDE: [],
        color: getColor(),
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
          color: getColor(),
          isSingleSource: true,
          isSavedData: false,
          dataMapping: [],
          dataMapping2: [],
          percentageIndicator: false,
          chartCategory: "REGIONAL",
          seasonalPeriod: 2,
          isBenchMark:false,
          benchmarks: [],
          benchmarkInLegend: false,
          seasonalColors: [],
          chartDrillDown: false,
          drillCalculation: "DEFAULT",
          drillYTitle: "",
          drillPointBenchmark: false,
          chartDataSum: false, //bydefault false as causing error in method charts in analytical
          chartDataSum2: false,
          sumLegend: "",
          sumLegend2: "",
          generateOutliers: false,
          generateSummary: false,
          cngSumEq: "#e8bb69",
          cngSumPos: "#5ab276",
          cngSumNeg: "#d97276",
          priorityIndicator: false,
          chartCalculation: "DEFAULT",
          generateTotal: false,
          totalLegend: "",
          totalColor: getColor(),
          totalPosition: "FIRST",
          generateFlag: false,
          compareFlag: false,
          priorityFlagIndicator: null,
          chartDefaultView: "chart",
          cngPtPos: "#5ab276",
          cngPtNeg: "#d97276",
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
