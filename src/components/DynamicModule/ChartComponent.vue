<template>
  <b-overlay :show="showLoader" rounded="sm" :opacity="0.3">
    <fullscreen v-model="chartFull" ref="fullscreen" class="fullContainer">
      <div
        class="card position-relative summary-highchart-body border-0 fullContent"
      >
        <!-- <loader v-if="showLoader" class="cardLoader" /> -->
        <div class="card-header p-10px" style="height: 55px">
          <div class="row no-gutters">
            <div
              class="col-lg-9 col-md-9 p-t-4px"
              :class="{ 'col-lg-12 col-md-12': chartFull }"
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ chart && chart.name ? chart.name : "" }}
            </div>
            <div class="col-lg-3 col-md-3 position-relative" v-if="!chartFull">
              <ChartOptions
                :sorting="sorting"
                :title="chart.name"
                @dataSort="dataSort"
                @showTable="showTable"
                :defaultSort="defaultSort"
                @exportChart="exportChart"
                :chartKey="'addedChart' + chartData.id"
                fullScreenKey="chart"
                :trendTable="table"
                @toggleFullscreen="toggleFullscreen"
                v-if="chart && chart.series.length > 0"
              />
            </div>
          </div>
        </div>
        <div class="card-body py-0">
          <div
            class="align-items-center d-flex justify-content-end"
            style="height: 45px"
          >
            <b-dropdown
              size="sm"
              :text="alertLabel"
              class=""
              v-if="chart && chart.series.length > 0 && indAlertList.length > 0"
            >
              <template v-for="(alert, ind) in indAlertList">
                <b-dropdown-item
                  href="javascript:void(0)"
                  @click.prevent.stop="getAlertSeries('reset')"
                  v-if="ind === 0"
                  :key="'alertItem' + ind"
                  >{{ $t("resetChart") }}</b-dropdown-item
                >
                <b-dropdown-divider
                  v-if="ind === 0"
                  :key="'alertItemDivider' + ind"
                ></b-dropdown-divider>
                <b-dropdown-item
                  href="javascript:void(0)"
                  @click.prevent.stop="getAlertSeries(alert.value)"
                  :key="'alertItem' + ind"
                  ><i
                    class="fa fa-circle mr-2"
                    :style="{ color: alert.color }"
                  ></i
                  >{{ alert.text }}</b-dropdown-item
                >
              </template>
            </b-dropdown>
          </div>
          <div>
            <template v-if="viewType === 'chart'">
              <highcharts :options="chart" :ref="'addedChart' + chartData.id" />
            </template>
            <template v-else>
              <div class="chartHeight text-center">
                <b-table
                  head-variant="light"
                  sticky-header
                  class="mb-0"
                  :bordered="true"
                  hover
                  show-empty
                  :items="table.items"
                  :fields="table.fields"
                  :empty-text="$t('no_data_to_display')"
                  :style="{ 'max-height': tableHeight + 'px !important' }"
                  v-if="chart && chart.series.length > 0"
                >
                  <template v-slot:cell()="{ value }">
                    <span :style="`color: ${getColor(value)}`">
                      {{ value }}
                    </span>
                  </template>
                </b-table>
              </div>
            </template>
            <div class="text-right small" style="height: 20px">
              {{ $t("source") }}:
              <b>{{ chart.source ? chart.source : $t("NA") }}</b>
            </div>
          </div>
        </div>
      </div>
    </fullscreen>
  </b-overlay>
</template>

<script>
import IA from "../Interactive/interactive.js";
import service from "@/service";
import { basicChartConfig } from "@/config/basicChartConfig";
import { chartExport } from "@/components/Common/commonFunctions";
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
  props: ["chartData", "sendFilters", "alertData", "lowerOrg", "cardKey"],
  components: {
    ChartOptions: () =>
      import(
        /* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
      ),
  },
  mixins: [FullScreenMixin],
  data() {
    return {
      chart: JSON.parse(JSON.stringify(basicChartConfig.column)),
      viewType: "chart",
      defaultSort: "A-Z",
      drilldown: false,
      download: false,
      location: null,
      period: null,
      showLoader: false,
      table: {},
      tableOriginal: {},
      indicatorsColors: [],
      alertSelected: null,
      indAlertList: [],
      isPercentageChart: false,
      isDrilldownAdded: false,
      alertLabel: "Select Alert",
      pType: "",
      sorting: ["0-1", "1-0"],
      outlierColor: null,
      chartFull: false,
    };
  },
  watch: {
    sendFilters(newVal) {
      if (newVal) {
        this.location = newVal.location;
        this.period = newVal.period;
        this.pType = newVal.periodType;
        this.setData();
      }
    },
  },
  computed: {
    tableHeight() {
      let height =
        this.chartData && this.chartData.chartData
          ? this.chartData.chartData.chart.height
          : 300;
      return height;
    },
  },
  methods: {
    showTable(val, key) {
      this.viewType = val;
    },
    getColor(value) {
      return value.toString().includes(this.$i18n.t("alert"))
        ? this.outlierColor
          ? this.outlierColor
          : "#dc3545"
        : "";
    },
    getAlertSeries(alertSelected) {
      let series = this.chart.series;
      this.showLoader = true;
      let tableCond = null;
      if (alertSelected === "reset") {
        this.alertLabel = this.$i18n.t("selectAlert");
        this.chart.series = series.map((s) => {
          return {
            ...s,
            data: s.data.map((d) => {
              return {
                ...d,
                color: s.color,
              };
            }),
          };
        });
        this.$nextTick(() => (this.showLoader = false));
      } else {
        let alertData = this.alertData.find((a) => a.alertID === alertSelected);
        tableCond = alertData;
        this.alertLabel = alertData.alertName;
        this.chart.series = series.map((s) => {
          if (
            s.static_name.toLowerCase() ===
            alertData.targetIndicatorName.toLowerCase()
          ) {
            return {
              ...s,
              data: s.data.map((d) => {
                let condition = false;
                if (alertData.operator === "===") {
                  condition = d.y === alertData.thresholdValue;
                }
                if (alertData.operator === "!==") {
                  condition = d.y !== alertData.thresholdValue;
                }
                if (alertData.operator === ">") {
                  condition = d.y > alertData.thresholdValue;
                }
                if (alertData.operator === ">=") {
                  condition = d.y >= alertData.thresholdValue;
                }
                if (alertData.operator === "<") {
                  condition = d.y < alertData.thresholdValue;
                }
                if (alertData.operator === "<=") {
                  condition = d.y <= alertData.thresholdValue;
                }
                if (condition) {
                  return {
                    ...d,
                    color: alertData.color,
                  };
                } else {
                  return {
                    ...d,
                    color: s.color,
                  };
                }
              }),
            };
          } else {
            return {
              ...s,
              data: s.data.map((d) => {
                return {
                  ...d,
                  color: s.color,
                };
              }),
            };
          }
        });
        this.$nextTick(() => (this.showLoader = false));
      }
      this.$nextTick(() => this.redrawTable(tableCond));
    },
    redrawTable(tableCond) {
      this.table.items = [];
      this.outlierColor = null;
      if (tableCond) {
        let updatedData = [];
        this.tableOriginal.items.forEach((t) => {
          let condition = false;
          if (tableCond.operator === "===") {
            condition =
              t[tableCond.targetIndicatorName] === tableCond.thresholdValue;
          }
          if (tableCond.operator === "!==") {
            condition =
              t[tableCond.targetIndicatorName] !== tableCond.thresholdValue;
          }
          if (tableCond.operator === ">") {
            condition =
              t[tableCond.targetIndicatorName] > tableCond.thresholdValue;
          }
          if (tableCond.operator === ">=") {
            condition =
              t[tableCond.targetIndicatorName] >= tableCond.thresholdValue;
          }
          if (tableCond.operator === "<") {
            condition =
              t[tableCond.targetIndicatorName] < tableCond.thresholdValue;
          }
          if (tableCond.operator === "<=") {
            condition =
              t[tableCond.targetIndicatorName] <= tableCond.thresholdValue;
          }
          if (condition) {
            this.outlierColor = tableCond.color;
            updatedData.push({
              ...t,
              [tableCond.targetIndicatorName]: t[tableCond.targetIndicatorName]
                ? `${t[tableCond.targetIndicatorName]} (${this.$i18n.t(
                    "alert"
                  )} ${tableCond.operator} ${tableCond.thresholdValue})`
                : "",
            });
          } else {
            updatedData.push(t);
          }
        });
        this.table.items = updatedData;
      } else {
        this.table = this.tableOriginal;
      }
    },
    changeViewType(type) {
      this.viewType = type;
    },
    dataSort(sort) {
      this.chart.series.map((d) => ({
        ...d,
        data: d.data.sort((a, b) => {
          let valueA = 0,
            valueB = 0;

          if (sort === "0-1" || sort === "1-0") {
            valueA = a.y;
            valueB = b.y;
          }

          if (sort === "JAN-DEC" || sort === "DEC-JAN") {
            valueA = new Date(a.pe).getTime();
            valueB = new Date(b.pe).getTime();
          }

          if (sort === "A-Z" || sort === "Z-A") {
            valueA = a.name;
            valueB = b.name;
          }

          let comparison = 0;
          if (sort == "0-1" || sort === "A-Z" || sort === "JAN-DEC") {
            if (valueA > valueB) {
              comparison = 1;
            } else if (valueA < valueB) {
              comparison = -1;
            }
          } else if (sort == "1-0" || sort === "Z-A" || sort === "DEC-JAN") {
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
    exportChart(type, chartRef) {
      let chart = this.$refs[chartRef].chart;
      let max = chart.options.xAxis[0].max,
        yMin = chart.yAxis[0].min,
        yMax = chart.yAxis[0].max;
      if (!this.drilldown) {
        chart.options.xAxis[0].max = null;
        chart.options.xAxis[0].min = 0;
      } else {
        chart.yAxis[0].setExtremes(yMin, yMax);
      }

      chartExport(type, chart);
      setTimeout(() => {
        if (!this.drilldown) {
          chart.options.xAxis[0].max = max;
        }
      }, 100);
    },
    setData() {
      this.showLoader = true;
      let chartData = JSON.parse(JSON.stringify(this.chartData));
      if (chartData.categoryLayout.length) {
        if (chartData.categoryLayout[0].id === "pe") {
          this.sorting.push("JAN-DEC");
          this.sorting.push("DEC-JAN");
        } else {
          this.sorting.push("A-Z");
          this.sorting.push("Z-A");
        }
      } else {
        this.sorting = null;
      }
      this.chart.series = [];
      let de = chartData.selectedData.map((sd) => sd.id).join(";");
      this.isPercentageChart = chartData.isPercentageChart;
      let isDrilldown = chartData.selectedDrilldownData.filter(
        (s) => typeof s.drilldownDetails !== "undefined"
      );
      this.isDrilldownAdded = isDrilldown.length > 0 ? true : false;
      if (typeof chartData.chartType !== "undefined") {
        this.viewType = chartData.chartType === "table" ? "table" : "chart";
      }
      let items = [];
      let fields = [];

      this.chart.title.title = this.chart.name;

      let period = "";
      if (this.period && this.period.length > 0) {
        if (
          this.pType === "financialYear" ||
          this.pType === "financialYearJuly" ||
          this.pType === "quarterly"
        ) {
          period = this.period.join(";");
        }
        // if(this.pType === 'quarterly') {
        //   period = this.period.join(';')
        // }
        if (this.pType === "monthly") {
          let p = this.$moment(this.period[0], "YYYY-MM").format("YYYYMM"),
            pStart = this.$moment(this.period[0], "YYYY-MM")
              .add(1, "months")
              .format("YYYYMM"),
            pEnd = this.$moment(this.period[1], "YYYY-MM").format("YYYYMM");
          while (pStart <= pEnd) {
            p = `${p};${pStart}`;
            pStart = this.$moment(pStart, "YYYY-MM")
              .add(1, "months")
              .format("YYYYMM");
          }
          period = p;
        }
        if (this.pType === "yearly") {
          let p = this.period[0],
            pStart = this.period[0] * 1 + 1,
            pEnd = this.period[1];
          while (pStart <= pEnd) {
            p = `${p};${pStart}`;
            pStart += 1;
          }
          period = p;
        }
      } else {
        period = chartData.selectedPeriod.map((p) => p.id).join(";");
      }

      let facilities = chartData.selectedFacility.length
        ? chartData.selectedFacility.map((f) => f.id).join(";")
        : "";

      // if (facilities) {
      //   facilities = chartData.facilityDimension.id + ":" + facilities;
      // }

      let location =
        this.location && this.location.length > 0
          ? this.location.join(";")
          : this.lowerOrg
          ? this.lowerOrg
          : chartData.selectedOrg.join(";");

      let dimensions = [],
        filters = [],
        series = chartData.seriesLayout[0].id,
        xAxis =
          chartData.categoryLayout.length > 0
            ? chartData.categoryLayout[0].id
            : "",
        isDualAxes = chartData.categoryLayout.length > 1 ? true : false,
        dualAxesCategory = "";
      if (isDualAxes) {
        dualAxesCategory = chartData.categoryLayout[1].id;
      }
      let tableHeaders = [];
      chartData.seriesLayout.forEach((s) => {
        let tableHeader =
          s.id === "dx"
            ? this.$i18n.t("data")
            : s.id === "pe"
            ? this.$i18n.t("period")
            : s.id === "ou"
            ? this.$i18n.t("orgUnits")
            : chartData.facilityDimension &&
              s.id === chartData.facilityDimension.id
            ? this.$i18n.t("facilityType")
            : this.$i18n.t("assignedCategory");
        if (this.chart.chart.type === "pie") {
          tableHeaders.push({ id: s.id, header: tableHeader });
          tableHeaders.push({ id: "value", header: "Value" });
          fields.push({
            key: tableHeader,
            sortable: true,
            variant: "secondary",
          });
          fields.push({
            key: "Value",
            sortable: true,
          });
        }
        dimensions.push(
          `${s.id}:${
            s.id === "dx"
              ? de
              : s.id === "pe"
              ? period
              : s.id === "ou"
              ? location
              : chartData.facilityDimension &&
                s.id === chartData.facilityDimension.id
              ? facilities
              : ""
          }`
        );
      });

      chartData.categoryLayout.forEach((c) => {
        let tableHeader =
          c.id === "dx"
            ? this.$i18n.t("data")
            : c.id === "pe"
            ? this.$i18n.t("period")
            : c.id === "ou"
            ? this.$i18n.t("orgUnits")
            : chartData.facilityDimension &&
              c.id === chartData.facilityDimension.id
            ? this.$i18n.t("facilityType")
            : this.$i18n.t("assignedCategory");
        tableHeaders.push({ id: c.id, header: tableHeader });
        fields.push({
          key: tableHeader,
          sortable: true,
          variant: "secondary",
        });
        dimensions.push(
          `${c.id}:${
            c.id === "dx"
              ? de
              : c.id === "pe"
              ? period
              : c.id === "ou"
              ? location
              : chartData.facilityDimension &&
                c.id === chartData.facilityDimension.id
              ? facilities
              : ""
          }`
        );
      });
      if (chartData.filterLayout.length > 0) {
        chartData.filterLayout.forEach((f) => {
          filters.push(
            `${f.id}:${
              f.id === "dx"
                ? de
                : f.id === "pe"
                ? period
                : f.id === "ou"
                ? location
                : chartData.facilityDimension &&
                  f.id === chartData.facilityDimension.id
                ? facilities
                : ""
            }`
          );
        });
      }
      this.table = {
        items,
        fields,
      };
      let drillDownObj = {};
      let drillDownDX = [];
      if (this.isDrilldownAdded) {
        this.chart.subtitle.text = this.$i18n.t("drillDownText");
        let isDrilldown = chartData.selectedDrilldownData.filter(
          (s) => typeof s.drilldownDetails !== "undefined"
        );
        isDrilldown.forEach((s) => {
          drillDownObj[s.id] = s.drilldownDetails.selectedData.map((s) => s.id);
          s.drilldownDetails.selectedData.map((s) => drillDownDX.push(s.id));
        });
        dimensions = dimensions.map((d) => {
          if (d.split(":")[0] === "dx") {
            let allDX = d
              .split(":")[1]
              .split(";")
              .concat(drillDownDX)
              .join(";");
            let id = d.split(":")[0];
            return `${id}:${allDX}`;
          } else {
            return d;
          }
        });
        filters = filters.map((d) => {
          if (d.split(":")[0] === "dx") {
            let allDX = d
              .split(":")[1]
              .split(";")
              .concat(drillDownDX)
              .join(";");
            let id = d.split(":")[0];
            return `${id}:${allDX}`;
          } else {
            return d;
          }
        });
      }

      let data = service.getInteractiveData(dimensions, filters);
      data
        .then((response) => {
          let { items, fields, chartOptions } = IA.generateChart(
            response,
            this.chart,
            this.table.items,
            this.table.fields,
            this.chart.chart.type,
            series,
            xAxis,
            isDualAxes,
            dualAxesCategory,
            tableHeaders,
            drillDownObj,
            drillDownDX,
            this.isDrilldownAdded,
            chartData.facilityDimension,
            this.pType
          );
          let finalData = {
            ...chartOptions,
            series: chartOptions.series.map((s) => {
              let findInd = this.indicatorsColors.find(
                (c) => c.static_name === s.static_name
              );
              if (findInd) {
                return {
                  ...s,
                  color: findInd.color,
                  name: findInd.name,
                };
              } else {
                return s;
              }
            }),
          };
          this.chart = finalData;
          this.$emit("setExportArr", {
            ...this.chart,
            chartID: chartData.id,
            cardKey: this.cardKey,
            isDualAxes: isDualAxes,
          });
          if (this.isPercentageChart) {
            this.chart.plotOptions.series.stacking = "percent";
            this.chart.yAxis.labels = {
              format: "{value} %",
            };
          }

          this.chart.tooltip.pointFormat = `<tr><td>${
            isDualAxes ? "{series.userOptions.stack}:" : ""
          } </td></tr>
        <tr><td style="color:{series.color};padding:0">{series.name}: </td>
        <td style="padding:0"><b>${
          this.isPercentageChart
            ? "{point.y} ({point.percentage:.0f}%)"
            : "{point.y}"
        }</b></td></tr>`;

          this.table = {
            items,
            fields,
          };
          this.tableOriginal = {
            items,
            fields,
          };
          this.showLoader = false;
        })
        .catch((res) => {
          this.showLoader = false;
          this.sweetAlert({
            title: this.$i18n.t("error"),
            text: res.response.data.message,
          });
        });
    },
  },
  created() {
    let chartData = JSON.parse(JSON.stringify(this.chartData.chartData));
    this.indicatorsColors = chartData.series.map((s) => ({
      color: s.color,
      static_name: s.static_name,
      name: s.name,
    }));
    let { width, ...chartDetails } = chartData.chart;
    chartData = {
      ...chartData,
      series: [],
      name: this.chartData.name,
      source: this.chartData.source,
      chart: { ...chartDetails },
    };
    this.chart = chartData;
    if (this.sendFilters) {
      this.location = this.sendFilters.location;
      this.period = this.sendFilters.period;
      this.pType = this.sendFilters.periodType;
    }
    this.setData();
    if (this.$i18n.locale === "fr") {
      this.alertLabel = this.$i18n.t("selectAlert");
    }
    this.chartData.selectedData.forEach((s) => {
      let alert = this.alertData.filter((a) => a.targetIndicator === s.id);
      if (alert.length > 0) {
        alert.forEach((a) => {
          this.indAlertList.push({
            value: a.alertID,
            text: a.alertName,
            color: a.color,
          });
        });
      }
    });
  },
};
</script>
