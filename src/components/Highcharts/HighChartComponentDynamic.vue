<template>
  <div>
    <fullscreen v-model="cObjFull" ref="fullscreen" class="fullContainer">
      <b-card
        class="summary-highchart-body p-0 border-0 rounded-0 fullContent"
        :key="updateDOM"
      >
        <b-card-header
          class="summary-highchart1-header pt-0 border-0 rounded-0"
        >
          <b-row>
            <b-col sm="9" class="p-0" :class="{ 'col-sm-12': cObjFull }"
              ><h5 class="summary-chart-title pl-0 mb-0 fs-17-1920">
                {{ cObj.title.title || "Chart Name" }}
              </h5></b-col
            >
            <b-col sm="3" class="position-relative" v-if="!cObjFull">
              <ChartOptions
                :cID="cID"
                :sorting="sorting"
                :trendTable="items"
                @dataSort="dataSort"
                fullScreenKey="cObj"
                :drillDown="drillDown"
                @showTable="showTable"
                @exportChart="exportChart"
                @toggleFullscreen="toggleFullscreen"
                v-if="cObj.series.length && !isHideOption"
              />
            </b-col>
          </b-row>
        </b-card-header>
        <b-card-body class="chart-body">
          <b-row>
            <b-col
              :class="[
                outliersArr && outliersArr.length ? 'col-sm-9' : 'col-sm-12',
              ]"
            >
              <b-row
                class="pb-2 mx-0"
                :class="{ hidden: showTables || drillDown }"
                v-if="cObj.series.length > 0 && !cObjFull"
              >
                <b-col sm="12" class="p-0">
                  <ChartFilters
                    :plotType="plotType"
                    :plotOptions="plotOptions(plotType)"
                    :allMethods="allMethods"
                    :selectedMethod="selectedMethod"
                    @changePlotType="changePlotType"
                    @getSelectedMethod="getSelectedMethod"
                  />
                </b-col>
              </b-row>
              <div
                :class="{
                  'align-items-center d-flex justify-content-center h-400px':
                    cObj.series.length === 0,
                }"
                v-if="!showTables"
              >
                <highcharts
                  class="maincharts"
                  v-if="dataFetched"
                  :options="cObj"
                  ref="barCharts"
                ></highcharts>
                <b-spinner type="grow" label="Spinning" v-else></b-spinner>
              </div>
              <div class="tables" v-if="showTables">
                <b-table :items="items" bordered sticky-header="385px">
                </b-table>
              </div>
            </b-col>
            <b-col
              sm="3"
              v-if="outliersArr && outliersArr.length"
              class="border-left h-400px overflow-auto"
            >
              <!-- add slice() to avoid mutating the array and getting infinite update error -->
              <div
                v-for="(outlier, i) in outliersArr.slice().reverse()"
                :key="'outliers' + i"
              >
                <div class="pb-2 f-s-0-9375rem">
                  <strong
                    ><u>{{ outlier.header }}</u></strong
                  >
                </div>
                <template v-if="drillICOutliers.length">
                  <div v-for="(o, i) in drillICOutliers" :key="i">
                    <div>
                      <strong>{{ o.name }}</strong>
                    </div>
                    <h6 class="d-inline-block" v-if="o.outliers.length > 0">
                      <b-badge
                        variant="secondary"
                        class="m-1 shadow-sm selection-pills"
                        v-for="(o, i) in o.outliers"
                        :key="i"
                        >{{ o }}</b-badge
                      >
                    </h6>
                    <div class="my-3 text-center" v-else>NA</div>
                  </div>
                </template>
                <template v-else>
                  <div v-if="outlier.outlierList.length > 0">
                    <div v-for="(o, i) in outlier.outlierList" :key="i">
                      <div>
                        <strong>{{ o.name }}</strong>
                      </div>
                      <h6 class="d-inline-block" v-if="o.outliers.length > 0">
                        <b-badge
                          variant="secondary"
                          class="m-1 shadow-sm selection-pills"
                          v-for="(o, i) in o.outliers.slice().reverse()"
                          :key="i"
                          >{{ o }}</b-badge
                        >
                      </h6>
                      <div class="my-3 text-center" v-else>NA</div>
                    </div>
                  </div>
                  <div class="my-3 text-center" v-else>NA</div>
                </template>
              </div>
              <div v-if="drillPointBenchmark">
                <div class="pb-2 f-s-0-9375rem">
                  <strong
                    ><u>{{ $t("rr_text3") }}</u></strong
                  >
                </div>
                <div v-if="nationalRegionReportingTrendOutlier.length > 0">
                  <div
                    class="text-center"
                    v-if="
                      nationalRegionReportingTrendOutlier[0] ===
                      $t('noRegionsFound')
                    "
                  >
                    {{ nationalRegionReportingTrendOutlier[0] }}
                  </div>
                  <h6 class="d-inline-block" v-else>
                    <b-badge
                      variant="secondary"
                      class="m-1 shadow-sm selection-pills"
                      v-for="(o, i) in nationalRegionReportingTrendOutlier"
                      :key="i"
                      >{{ o }}</b-badge
                    >
                  </h6>
                </div>
                <div class="my-3 text-center" v-else>
                  <i class="mr-2 fa fa-arrow-left"></i
                  >{{
                    $t("rr_text4", {
                      lineType: $t(`${cObj.chart.type}`),
                    })
                  }}
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row v-if="source">
            <b-col sm="12" class="small text-right">
              {{ $t("source") }}: {{ source }}
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </fullscreen>
  </div>
</template>

<script>
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
  components: {
    ChartOptions: () =>
      import(
        /* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
      ),
    ChartFilters: () =>
      import(
        /* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
      ),
  },
  mixins: [FullScreenMixin],
  props: [
    "r2",
    "cID",
    "source",
    "drillSD",
    "sorting",
    "outliers",
    "chartType",
    "chartData",
    "showLabels",
    "dataFetched",
    "isHideOption",
    "chartConfigData",
    "drillPointBenchmark",
  ],
  data() {
    return {
      items: [],
      updateDOM: 0,
      chartName: "",
      plotType: null,
      cObjFull: false,
      drillDown: false,
      showTables: false,
      drillICOutliers: [],
      selectedMethod: null,
      nationalRegionReportingTrendOutlier: [],
      cObj: JSON.parse(JSON.stringify(this.chartData)),
    };
  },
  computed: {
    allMethods() {
      return this.chartData.methodSeries && this.chartData.methodSeries.length
        ? this.chartData.methodSeries.map((m) => ({
            text: m.name,
            value: m.name,
          }))
        : null;
    },
    outliersArr() {
      let key = this.selectedMethod ? this.selectedMethod : "default";
      return this.outliers && this.outliers[key] ? this.outliers[key] : [];
    },
    plotOptions: function () {
      return function (type) {
        let options = [],
          types = ["column", "line", "spline", "stack", "area"];
        if (types.includes(type)) {
          options = [
            {
              value: "column",
              text: this.$i18n.t("column"),
            },
            {
              value: "stack",
              text: this.$i18n.t("stack"),
            },
            {
              value: "line",
              text: this.$i18n.t("line"),
            },
            {
              value: "spline",
              text: this.$i18n.t("spline"),
            },
            {
              value: "area",
              text: this.$i18n.t("area"),
            },
          ];
        }
        return options;
      };
    },
  },
  watch: {
    chartData: {
      handler(newValue) {
        this.cObj = newValue;
        this.plotType = this.cObj.chart.oType
          ? this.cObj.chart.oType
          : this.cObj.chart.type;
        this.addEvents();
      },
      deep: true,
    },
    allMethods(newValue) {
      this.selectedMethod = newValue.length ? newValue[0].value : null;
    },
    selectedMethod(newValue) {
      let isFound = this.cObj.methodSeries.findIndex(
        (m) => m.name === newValue
      );
      if (isFound >= 0) {
        this.cObj.series = this.cObj.methodSeries[isFound].data;
        this.$nextTick(() => {
          this.updateDOM++;
        });
      }
    },
    showLabels(newValue) {
      if (newValue) {
        this.applyLabels();
      }
    },
    r2(newValue) {
      if (newValue >= 0) {
        this.setR2();
      }
    },
  },
  methods: {
    changePlotType(value) {
      if (value === "stack") {
        this.cObj.chart.type = "column";
        this.cObj.plotOptions.series.stacking = "normal";
      } else {
        this.cObj.plotOptions.series.stacking = "";
        this.cObj.chart.type = value.toLowerCase();
        if (value.toLowerCase() !== "line") {
          this.cObj.yAxis.min = null;
        } else {
          this.cObj.yAxis.min = 0;
        }
      }
    },
    getSelectedMethod(val) {
      this.selectedMethod = val;
    },
    dataSort(sortType) {
      this.cObj.series.map((d) => ({
        ...d,
        data: d.data.sort((a, b) => {
          let valueA = 0;
          let valueB = 0;
          let comparison = 0;

          if (sortType === "0-1" || sortType === "1-0") {
            valueA = a.y;
            valueB = b.y;
          }

          if (sortType === "JAN-DEC" || sortType === "DEC-JAN") {
            valueA = a.pe
              ? new Date(a.pe).getTime()
              : new Date(a.name).getTime();
            valueB = b.pe
              ? new Date(b.pe).getTime()
              : new Date(b.name).getTime();
          }

          if (sortType === "A-Z" || sortType === "Z-A") {
            valueA = a.name;
            valueB = b.name;
          }

          if (
            sortType == "0-1" ||
            sortType === "A-Z" ||
            sortType === "JAN-DEC"
          ) {
            if (valueA > valueB) {
              comparison = 1;
            } else if (valueA < valueB) {
              comparison = -1;
            }
          } else if (
            sortType == "1-0" ||
            sortType === "Z-A" ||
            sortType === "DEC-JAN"
          ) {
            if (valueA > valueB) {
              comparison = -1;
            } else if (valueA < valueB) {
              comparison = 1;
            }
          }
          return comparison;
        }),
      }));
    },
    showTable(val) {
      let tableData = [];
      if (
        this.chartData &&
        this.chartData.tableData &&
        this.chartData.tableData.length
      ) {
        tableData = this.chartData.tableData;
      } else {
        let tableKey = this.chartType.includes("period")
          ? "Period"
          : "Location";
        this.cObj.series.forEach((s) => {
          if (!s.isBenchmark) {
            s.data.forEach((d) => {
              let itemFoundIndex = tableData.findIndex(
                (t) => t[tableKey] === d.name
              );
              if (itemFoundIndex >= 0) {
                tableData[itemFoundIndex] = {
                  ...tableData[itemFoundIndex],
                  [s.name]:
                    this.cObj.chart.type === "scatter"
                      ? `X: ${d.x}, Y: ${d.y}`
                      : d.y,
                };
              } else {
                tableData.push({
                  [tableKey]: d.name,
                  [s.name]:
                    this.cObj.chart.type === "scatter"
                      ? `X: ${d.x}, Y: ${d.y}`
                      : d.y,
                });
              }
            });
          }
        });
      }
      this.items = tableData;
      this.$nextTick(() => {
        this.showTables = val === "table";
      });
    },
    exportChart(type) {
      let chart = this.$refs.barCharts.chart;
      let catLen = chart.options.series[0].data.length - 1;
      chart.options.xAxis[0].min = 0;

      if (type == "jpg") {
        chart.exportChart({
          type: "image/jpeg",
          filename: "overview-chart",
        });
      } else if (type == "png") {
        chart.exportChart({
          type: "image/png",
          filename: "overview-chart",
        });
      } else if (type == "pdf") {
        chart.exportChart({
          type: "application/pdf",
          filename: "overview-chart",
        });
      }
      setTimeout(() => {
        chart.options.xAxis[0].max = null;
        if (this.derivedChart) {
          chart.xAxis[0].setExtremes(catLen - 11, catLen);
        }
      }, 100);
    },
    addEvents() {
      let _this = this;
      this.cObj = {
        ...this.cObj,
        chart: {
          ...this.cObj.chart,
          events: {
            ...this.cObj.chart.events,
            drillup: function (e) {
              _this.drillDown = false;
              if (_this.chartConfigData.chartOptions.yAxis.visible) {
                this.yAxis[0].setTitle({
                  text: _this.chartConfigData.chartOptions.yAxis.text,
                });
              }
              if (_this.drillPointBenchmark) {
                this.yAxis[0].removePlotLine("p1");
                _this.nationalRegionReportingTrendOutlier = [];
              }
              if (_this.drillSD) {
                _this.drillICOutliers = [];
              }
            },
            drilldown: function (e) {
              _this.drillDown = true;
              this.yAxis[0].setTitle({
                text: _this.chartConfigData.chartOptions.drillYTitle || "",
              });
              if (_this.drillPointBenchmark) {
                let y = 0;
                this.options.series[0].data.forEach((d) => {
                  if (d.name === e.seriesOptions.name) {
                    y = d.y;
                  }
                });
                let outlier = [];
                e.seriesOptions.data.forEach((s) => {
                  if (s.y < y) {
                    outlier.push(`${s.name} (${s.y}%)`);
                  }
                });
                if (outlier.length) {
                  _this.nationalRegionReportingTrendOutlier = outlier;
                } else {
                  _this.nationalRegionReportingTrendOutlier = [
                    _this.$i18n.t("noRegionsFound"),
                  ];
                }
                this.yAxis[0].addPlotLine({
                  id: "p1",
                  value: y,
                  percValue: undefined,
                  valueType: "percentage",
                  color: "#0000ff",
                  width: 2,
                  zIndex: 5,
                  dashStyle: "solid",
                  label: {
                    enabled: true,
                    text: `${this.options.series[0].name} (${e.seriesOptions.name}): ${y}%`,
                    textVisible: "",
                    align: "center",
                    style: {
                      color: "#f6f6f6",
                      fontWeight: 700,
                      fontSize: "16px",
                    },
                  },
                });
              }
              if (_this.drillSD) {
                let minus2SD = [],
                  plus2SD = [],
                  mainSeries = {
                    name: e.seriesOptions.name,
                    type: e.seriesOptions.type,
                    data: [],
                    visible: true,
                    color: "#7cb5ec",
                  },
                  standardDeviation = null;
                // oDrillDownSeries.series
                _this.drillICOutliers = [
                  {
                    name: e.seriesOptions.name,
                    outliers: [],
                  },
                ];
                e.seriesOptions.data.forEach((d) => {
                  standardDeviation = d.standardDeviationValue;
                  if (d.outlier) {
                    _this.drillICOutliers[0].outliers.push(d.name);
                  }
                  let dLow = null,
                    dHigh = null,
                    dY = null;
                  if (d.lowd) {
                    dLow = d.lowd.toFixed(1) * 1;
                  }
                  if (d.highd) {
                    dHigh = d.highd.toFixed(1) * 1;
                  }
                  if (d.y) {
                    dY = d.y.toFixed(1) * 1;
                  }
                  minus2SD.push({
                    name: d.name,
                    y: dLow,
                  });
                  plus2SD.push({
                    name: d.name,
                    y: dHigh,
                  });
                  mainSeries.data.push({
                    name: d.name,
                    y: dY,
                    color: d.color,
                    locationID: d.locationID,
                  });
                });
                let obj1 = {
                    name: _this.$i18n.t("min2SD", {
                      standardDeviation,
                    }),
                    data: minus2SD,
                    type: "line",
                    visible: true,
                    marker: {
                      symbol: "square",
                    },
                    lineWidth: 0,
                    states: {
                      hover: {
                        // enabled: false,
                        lineWidth: 0,
                        lineWidthPlus: 0,
                      },
                    },
                    color: "#fcb241",
                  },
                  obj2 = {
                    name: _this.$i18n.t("max2SD", {
                      standardDeviation,
                    }),
                    data: plus2SD,
                    type: "line",
                    visible: true,
                    marker: {
                      symbol: "square",
                    },
                    lineWidth: 0,
                    states: {
                      hover: {
                        // enabled: false,
                        lineWidth: 0,
                        lineWidthPlus: 0,
                      },
                    },
                    color: "#2f7ed8",
                  };

                this.addSingleSeriesAsDrilldown(e.point, mainSeries);
                this.addSingleSeriesAsDrilldown(e.point, obj1);
                this.addSingleSeriesAsDrilldown(e.point, obj2);
                this.applyDrilldown();
              }
            },
          },
        },
      };
    },
    applyLabels() {
      this.cObj.plotOptions = {
        ...this.cObj.plotOptions,
        series: {
          ...this.cObj.plotOptions.series,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.point.label;
            },
          },
        },
      };
    },
    setR2() {
      let _this = this;
      this.cObj.chart.events = {
        ...this.cObj.chart.events,
        load: function () {
          var chart = this;
          chart.renderer
            .html(
              `R<sup>2</sup> : ${_this.r2}`,
              chart.plotWidth - 30,
              chart.plotHeight - 40
            )
            .css({
              fontSize: "13px",
              color: "#FFFFFF",
              fontWeight: 600,
              backgroundColor: "#f1f1f14d",
              padding: "10px",
              border: "1px solid #c4c4c4",
              borderRadius: "4px",
            })
            .add();
        },
      };
    },
  },
  created() {
    let height =
      this.cObj.chart.type === "packedbubble" ? this.cObj.chart.height : null;
    this.cObj = {
      ...this.cObj,
      chart: {
        ...this.cObj.chart,
        height,
      },
    };

    this.plotType = this.cObj.chart.oType
      ? this.cObj.chart.oType
      : this.cObj.chart.type;
    if (this.r2 >= 0) {
      this.setR2();
    }
    if (this.showLabels) {
      this.applyLabels();
    }
    this.addEvents();
  },
};
</script>

<style scoped></style>
