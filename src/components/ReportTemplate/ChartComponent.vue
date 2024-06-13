<template>
  <b-overlay :show="showLoader" rounded="sm" :opacity="0.3">
    <div class="position-relative">
      <!-- <loader class="cardLoader" v-if="showLoader" /> -->
      <div class="card-header px-1 py-0" style="height: 55px">
        <div class="row no-gutters">
          <div
            class="col-lg-12 col-md-12 p-t-4px"
            style="overflow: hidden; text-overflow: ellipsis"
          >
            {{ chartName }}
          </div>
        </div>
      </div>
      <div class="card-body py-0" :style="{ height: chartHeight + 'px' }">
        <div>
          <template v-if="viewType === 'chart'">
            <highcharts
              :options="cObj"
              v-if="cObj.series.length"
              ref="addedChart"
            />
            <div
              class="text-center d-flex justify-content-center align-items-center noDataInfo"
              v-if="errorText"
            >
              {{ errorText }}
            </div>
          </template>
        </div>
      </div>
      <SummaryDashboard
        v-if="isSummaryChart"
        :reportPeriod="sendPeriod"
        :reportLocationValue="locationValue"
        :reportDefaultLevelID="defaultLevelID"
        :reportDefaultLocationID="defaultLocationID"
        :reportSubLevelID="subLevelID"
        :reportPeriodType="periodType"
        :reportChartData="chartData"
        :reportConfigData="reportConfigData"
        @setReportChart="setReportChart"
        @setLocationPeriod="setLocationPeriod"
      />
      <AnalyticalDashboard
        v-if="isAnalyticalChart"
        :reportPeriod="sendPeriod"
        :reportLocationValue="locationValue"
        :reportDefaultLevelID="defaultLevelID"
        :reportDefaultLocationID="defaultLocationID"
        :reportSubLevelID="subLevelID"
        :reportPeriodType="periodType"
        :reportChartData="chartData"
        :reportConfigData="reportConfigData"
        @setReportChart="setReportChart"
        @setLocationPeriod="setLocationPeriod"
      />
      <DQRDashboard
        v-if="isDQRChart"
        :reportPeriod="sendPeriod"
        :reportLocationValue="locationValue"
        :reportDefaultLevelID="defaultLevelID"
        :reportDefaultLocationID="defaultLocationID"
        :reportSubLevelID="subLevelID"
        :reportPeriodType="periodType"
        :reportChartData="chartData"
        :reportConfigData="reportConfigData"
        @setReportChart="setReportChart"
        @setLocationPeriod="setLocationPeriod"
      />
    </div>
  </b-overlay>
</template>
<script>
import { basicChartConfig } from "@/config/basicChartConfig";
import {
  translateAlphatoNum,
  translateDate,
} from "@/components/Common/commonFunctions";

export default {
  props: [
    "chartData",
    "otherChartObj",
    "selectedLocation",
    "configData",
    "updateFrequencyType",
    "basePeriod",
  ],
  components: {
    SummaryDashboard: () =>
      import(/*webpackChunkName: 'summaryDashboard'*/ "@/pages/SummaryDashboard"),
    AnalyticalDashboard: () =>
      import(/*webpackChunkName: 'AnalyticalDashboard'*/ "@/pages/Analytical"),
    DQRDashboard: () =>
      import(/*webpackChunkName: 'DQRDashboard'*/ "@/pages/Dqr"),
  },
  data() {
    return {
      cObj: JSON.parse(JSON.stringify(basicChartConfig.column)),
      viewType: "chart",
      sendPeriod: null,
      chartName: "",
      applicationFinalYear: null,
      showLoader: true,
      isSummaryChart: false,
      isAnalyticalChart: false,
      isDQRChart: false,
      defaultLevelID: null,
      locationValue: null,
      defaultLocationID: null,
      subLevelID: null,
      periodType: null,
      errorText: "",
      isChartSet: false,
      reportConfigData: null,
    };
  },
  watch: {
    configData: {
      handler: function (newValue) {
        this.cObj = JSON.parse(JSON.stringify(basicChartConfig.column));
        this.setPeriod(this.chartData?.periodType || "monthly");
        this.isChartSet = false;
        this.showLoader = true;
        let c = this.chartData;
        let selectedDashboard = c.selectedDashboard.split("-");
        let permissions = {
          dashboards: [],
          modules: [],
        };
        if (
          this.$store.getters.getIsAdmin ||
          this.$store.getters.getAppSettings.bypassUser
        ) {
          permissions.dashboards =
            this.$store.getters.getAppSettings.modulesList;
        } else {
          permissions = this.$store.getters.getUserPermissions;
        }
        if (
          c.selectedModule.includes("interactive") &&
          newValue[`interactive/${c.selectedDashboard}`]
        ) {
          if (newValue[`interactive/${c.selectedDashboard}`] === "error") {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText = this.$i18n.t("errorInData");
          } else {
            this.getInteractiveCharts(
              c,
              newValue[`interactive/${c.selectedDashboard}`]
            );
          }
        }
        if (
          c.selectedModule.includes("dqrModule") &&
          c.selectedCategory === "emu" &&
          newValue[`dqrModule/${c.selectedDashboard}`] &&
          newValue.emu
        ) {
          if (
            newValue[`dqrModule/${c.selectedDashboard}`] === "error" ||
            newValue.emu === "error" ||
            !permissions.dashboards.includes(selectedDashboard[0])
          ) {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText =
              newValue[`dqrModule/${c.selectedDashboard}`] === "error" ||
              newValue.emu === "error"
                ? this.$i18n.t("errorInData")
                : "Not authorized to view this chart";
          } else {
            this.getEMUAnnualCharts(
              c,
              newValue[`dqrModule/${c.selectedDashboard}`],
              newValue.emu
            );
          }
        }
        if (
          c.selectedModule.includes("dqrModule") &&
          c.selectedCategory === "emu_monthly" &&
          newValue[`dqrModule/${c.selectedDashboard}`] &&
          newValue.emu_monthly
        ) {
          if (
            newValue[`dqrModule/${c.selectedDashboard}`] === "error" ||
            newValue.emu_monthly === "error" ||
            !permissions.dashboards.includes(selectedDashboard[0])
          ) {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText =
              newValue[`dqrModule/${c.selectedDashboard}`] === "error" ||
              newValue.emu_monthly === "error"
                ? this.$i18n.t("errorInData")
                : "Not authorized to view this chart";
          } else {
            this.getEMUMonthlyCharts(
              c,
              newValue[`dqrModule/${c.selectedDashboard}`],
              newValue.emu_monthly
            );
          }
        }
        if (
          c.selectedModule.includes("summaryDashboard") &&
          newValue[`summaryDashboard/${c.selectedDashboard}`]
        ) {
          this.isSummaryChart = false;
          if (
            newValue[`summaryDashboard/${c.selectedDashboard}`] === "error" ||
            !permissions.dashboards.includes(selectedDashboard[0]) ||
            (!this.$store.getters.getIsAdmin &&
              !permissions.modules.includes(
                `summary_dashboard-${selectedDashboard[0]}`
              ) &&
              !this.$store.getters.getAppSettings.bypassUser)
          ) {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText =
              newValue[`summaryDashboard/${c.selectedDashboard}`] === "error"
                ? this.$i18n.t("errorInData")
                : "Not authorized to view this chart";
          } else {
            if (c.canCallAPI) {
              this.reportConfigData =
                newValue[`summaryDashboard/${c.selectedDashboard}`];
              this.getSummaryCharts(c);
            }
          }
        }
        if (
          c.selectedModule.includes("analyticalDashboard") &&
          newValue[`analyticalDashboard/${c.selectedDashboard}`]
        ) {
          this.isAnalyticalChart = false;
          if (
            newValue[`analyticalDashboard/${c.selectedDashboard}`] ===
              "error" ||
            !permissions.dashboards.includes(selectedDashboard[0]) ||
            (!this.$store.getters.getIsAdmin &&
              !permissions.modules.includes(
                `analytical_dashboard-${selectedDashboard[0]}`
              ) &&
              !this.$store.getters.getAppSettings.bypassUser)
          ) {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText =
              newValue[`analyticalDashboard/${c.selectedDashboard}`] === "error"
                ? this.$i18n.t("errorInData")
                : "Not authorized to view this chart";
          } else {
            if (c.canCallAPI) {
              this.reportConfigData =
                newValue[`analyticalDashboard/${c.selectedDashboard}`];
              this.getAnalyticalCharts(c);
            }
          }
        }
        if (
          c.selectedModule.includes("dqrDashboard") &&
          newValue[`dqrDashboard/${c.selectedDashboard}`]
        ) {
          this.isDQRChart = false;
          if (
            newValue[`dqrDashboard/${c.selectedDashboard}`] === "error" ||
            !permissions.dashboards.includes(selectedDashboard[0]) ||
            (!this.$store.getters.getIsAdmin &&
              !permissions.modules.includes(`DQR-${selectedDashboard[0]}`) &&
              !this.$store.getters.getAppSettings.bypassUser)
          ) {
            this.showLoader = false;
            this.chartName = c.name;
            this.errorText =
              newValue[`dqrDashboard/${c.selectedDashboard}`] === "error"
                ? this.$i18n.t("errorInData")
                : "Not authorized to view this chart";
          } else {
            if (c.canCallAPI) {
              this.reportConfigData =
                newValue[`dqrDashboard/${c.selectedDashboard}`];
              this.getDQRCharts(c);
            }
          }
        }
      },
      deep: true,
    },
    otherChartObj: {
      handler: function (newValue) {
        if (newValue.length) {
          let isFound = newValue.find((c) =>
            c.cid.includes(this.chartData.cid)
          );
          if (isFound && !this.isChartSet) {
            this.setReportChart(isFound, false);
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    chartHeight() {
      let height =
        this.chartData && this.chartData.chartData
          ? this.chartData.chartData.chart.height
          : 300;
      return height;
    },
  },
  methods: {
    setReportChart(obj, canEmit = true) {
      if (canEmit) {
        this.$emit("getOtherChartObj", obj);
      } else {
        if (obj.chartObj) {
          this.cObj = obj.chartObj;
          this.cObj.chart.height = this.chartHeight;
          if (obj.chartObj.series.length === 0) {
            this.errorText = obj.errorText ?? this.$i18n.t("chartDisabled");
          }
        } else {
          this.errorText = this.$i18n.t("chartDisabled");
        }
        this.showLoader = false;
        if (obj.chartName) {
          this.chartName = obj.chartName;
        }
        if (obj.showLabels) {
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
        }
        if (obj.r2 >= 0) {
          this.cObj.chart.events = {
            ...this.cObj.chart.events,
            load: function () {
              var chart = this;
              chart.renderer
                .html(
                  `R<sup>2</sup> : ${obj.r2}`,
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
        }
        this.isChartSet = true;
      }
    },
    setLocationPeriod(value){
      console.log("hi" , value)
      this.$emit("setLocationPeriod", value);
    },
    setLocationDetails(chart) {
      let selectedLocation = this.selectedLocation.split("/");
      this.defaultLevelID = selectedLocation[0];
      this.defaultLocationID = selectedLocation[1];
      this.subLevelID = selectedLocation[0] * 1 + 1;
      this.locationValue = this.selectedLocation;
      this.periodType = chart.periodType;
    },
    getSummaryCharts(chart) {
      this.setLocationDetails(chart);
      this.$nextTick(() => {
        this.isSummaryChart = true;
      });
    },
    getAnalyticalCharts(chart) {
      this.setLocationDetails(chart);
      this.$nextTick(() => {
        this.isAnalyticalChart = true;
      });
    },
    getDQRCharts(chart) {
      this.setLocationDetails(chart);
      console.log(chart, "Watcher for getDQRCharts");
      this.$nextTick(() => {
        this.isDQRChart = true;
      });
    },
    getInteractiveCharts(chart, configData) {
      let isFound = configData.find((c) => chart.cid.split("/")[1] === c.id);
      if (isFound) {
        let updatedChart = {
          ...isFound.chartData,
        };
        this.cObj = updatedChart;
      } else {
        this.errorText = "Chart is deleted from Favorites";
      }
      this.chartName = chart.name;
      this.showLoader = false;
    },
    getEMUMonthlyCharts(chart, configData, savedData) {
      let k = chart.selectedModule.split("-"),
        chartSettings = null,
        selectedLocation = this.selectedLocation.split("/")[1];
      let autoSaveEMU = configData.emu_monthly.Background_Data.autoSaveEMU;
      let foundChart = configData.emu_monthly[autoSaveEMU].derivedCharts.find(
        (c) => c.chartOptions.cid === chart.cid.split("/")[1]
      );
      if (foundChart) {
        chartSettings = foundChart.chartOptions;
      }

      if (k[2] === "emu_monthly" && chartSettings) {
        let emuChart = null;
        Object.keys(savedData).forEach((key) => {
          let parsedObj =
            typeof savedData[key] == "string"
              ? JSON.parse(savedData[key])
              : savedData[key];
          if (
            parsedObj[selectedLocation] &&
            parsedObj[selectedLocation].cid === chart.cid.split("/")[1]
          ) {
            emuChart = parsedObj[selectedLocation];
          }
        });
        if (emuChart && chartSettings) {
          let updatedChartData = [];
          if (emuChart.isPeriodChart) {
            let pe = [];
            let formatedCatArray = [];
            for (let i = 23; i >= 0; i--) {
              if (i === 0) {
                pe.push(this.sendPeriod);
              } else {
                pe.push(
                  this.$moment(this.sendPeriod, "YYYYMM")
                    .subtract(i, "months")
                    .format("YYYYMM")
                );
              }
            }
            emuChart.saveCategories.forEach((c) => {
              formatedCatArray.push(translateAlphatoNum(c));
            });

            emuChart.saveData.forEach((c) => {
              let innerObj = {
                name: c.trans_name ? c.trans_name : c.name,
                color: c.color,
                data: [],
              };

              pe.forEach((p) => {
                let formatedDate = translateDate({ rawDate: p });
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);

                  innerObj.data.push({
                    name: formatedDate,
                    y: c.data[catIndex],
                  });
                } else {
                  innerObj.data.push({
                    name: formatedDate,
                    y: null,
                  });
                }
              });
              updatedChartData.push(innerObj);
            });
          } else {
            emuChart.data.forEach((c) => {
              let innerObj = {
                name: c.trans_name ? c.trans_name : c.name,
                data: [],
                color: c.color,
              };

              emuChart.categories.forEach((cat, i) => {
                innerObj.data.push({
                  name: cat,
                  y: c.data[i],
                });
              });
              updatedChartData.push(innerObj);
            });
          }
          this.cObj.series = updatedChartData;
          this.cObj.chart.type = emuChart.reportChartType
            ? emuChart.reportChartType === "stacked" ||
              emuChart.reportChartType === "column_stack"
              ? "column"
              : emuChart.reportChartType
            : "line";
          if (
            emuChart.reportChartType === "stacked" ||
            emuChart.reportChartType === "column_stack"
          ) {
            this.cObj.plotOptions.series.stacking = "normal";
          }
          this.chartName =
            chartSettings.chartName[this.$i18n.locale] ||
            chartSettings.chartName;
          this.cObj.title.text = chartSettings.title.visible
            ? chartSettings.title.text[this.$i18n.locale] ||
              chartSettings.title.text
            : "";
          this.cObj.subtitle.text = chartSettings.subTitle.visible
            ? chartSettings.subTitle.text[this.$i18n.locale] ||
              chartSettings.subTitle.text
            : "";
          this.cObj.xAxis.title.text = chartSettings.xAxis.visible
            ? chartSettings.xAxis.text[this.$i18n.locale] ||
              chartSettings.xAxis.text
            : "";
          this.cObj.yAxis.title.text = chartSettings.yAxis.visible
            ? chartSettings.yAxis.text[this.$i18n.locale] ||
              chartSettings.yAxis.text
            : "";
          this.showLoader = false;
        }
      }
    },
    getEMUAnnualCharts(chart, configData, savedData) {
      let k = chart.selectedModule.split("-"),
        chartSettings = null,
        key = this.generateKey(k[0]),
        selectedLocation = this.selectedLocation.split("/")[1];
      let foundChart = configData.emu.Output.derivedCharts.find(
        (c) => c.chartOptions.cid === chart.cid.split("/")[1]
      );
      if (foundChart) {
        chartSettings = foundChart.chartOptions;
      }
      if (k[2] === "emu" && chartSettings) {
        let emuChart = null,
          chartIndex = 0;
        Object.keys(savedData).forEach((key, i) => {
          let parsedObj =
            typeof savedData[key] == "string"
              ? JSON.parse(savedData[key])
              : savedData[key];
          if (
            parsedObj[selectedLocation] &&
            parsedObj[selectedLocation].cid === chart.cid.split("/")[1]
          ) {
            emuChart = parsedObj[selectedLocation];
            chartIndex = i;
          }
        });
        if (emuChart && chartSettings) {
          let updatedChartData = [];
          let pe = [];
          let formatedCatArray = [];
          let toolbarDate = this.$moment(this.sendPeriod, "YYYY").format(
            "YYYY"
          );
          let yearDiff = toolbarDate - this.applicationFinalYear;
          for (let i = yearDiff; i >= 0; i--) {
            if (i === 0) {
              pe.push(this.$moment(this.sendPeriod, "YYYY").format("YYYY"));
            } else {
              pe.push(
                this.$moment(this.sendPeriod, "YYYY")
                  .subtract(i, "year")
                  .format("YYYY")
              );
            }
          }
          formatedCatArray = emuChart.categories;
          emuChart.data.forEach((c) => {
            let innerObj = {
              name: c.trans_name ? c.trans_name : c.name,
              data: [],
              color: c.color,
            };
            pe.forEach((p) => {
              let formatedDate = this.$moment(p, "YYYY").format("YYYY");
              if (formatedCatArray.includes(p)) {
                let catIndex = formatedCatArray.indexOf(p);

                innerObj.data.push({
                  name: formatedDate,
                  y: c.data[catIndex],
                });
              } else {
                innerObj.data.push({
                  name: formatedDate,
                  y: null,
                });
              }
            });
            updatedChartData.push(innerObj);
          });
          this.cObj.series = updatedChartData;
          this.cObj.chart.type = chartIndex === 0 ? "line" : "bar";
          if (chartIndex === 2) {
            this.cObj.plotOptions.series.stacking = "normal";
          }
          this.cObj.yAxis.min = null;
          this.chartName =
            chartSettings.chartName[this.$i18n.locale] ||
            chartSettings.chartName;
          this.cObj.title.text = chartSettings.title.visible
            ? chartSettings.title.text[this.$i18n.locale] ||
              chartSettings.title.text
            : "";
          this.cObj.subtitle.text = chartSettings.subTitle.visible
            ? chartSettings.subTitle.text[this.$i18n.locale] ||
              chartSettings.subTitle.text
            : "";
          this.cObj.xAxis.title.text = chartSettings.xAxis.visible
            ? chartSettings.xAxis.text[this.$i18n.locale] ||
              chartSettings.xAxis.text
            : "";
          this.cObj.yAxis.title.text = chartSettings.yAxis.visible
            ? chartSettings.yAxis.text[this.$i18n.locale] ||
              chartSettings.yAxis.text
            : "";
          this.showLoader = false;
        }
      }
    },
    setPeriod(newVal) {
      let namespace = "";
      if (!this.$store.getters.getIsMultiProgram) {
        let m = this.$store.getters.getAppSettings.modulesList[0];
        namespace = `${m}-dashboard`;
      }
      let period =
          this.$store.getters.getGlobalFactors(namespace).period.Period,
        periodObj = {
          defaultPeriod: null,
          calculatedPeriod: null,
        };
      let d = new Date();
      let currentDate = this.$moment(d, "YYYYMM")
        .subtract(period.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      let currentFinalDate = this.$moment(currentDate, "YYYYMM")
        .subtract(period.backtrackedYearLimit * 1, "years")
        .format("YYYY-MM");
      let currentYear = this.$moment(currentDate, "YYYY").format("YYYY");
      this.applicationFinalYear = this.$moment(currentFinalDate, "YYYY").format(
        "YYYY"
      );
      let currYear = new Date().getFullYear(),
        currentMonth = new Date().getMonth() + 1;
      let currentQuarter = Math.ceil(currentMonth / 3);
      let quarterLimit = currentYear * 1 === currYear * 1 ? currentQuarter : 4;

      let calculatedPeriod = {
        monthly: currentDate,
        yearly: currentYear,
        financialYear: `${currentYear - 1}`,
        financialYearJuly: `${currentYear - 1}July`,
        financialYearOct: `${currentYear - 1}Oct`,
        quarterly: `${currentYear}Q${quarterLimit}`,
      };
      periodObj.defaultPeriod = JSON.parse(JSON.stringify(calculatedPeriod));
      if (this.updateFrequencyType === "monthly") {
        let limitPeriod = this.$moment(
          calculatedPeriod[this.updateFrequencyType],
          "YYYYMM"
        )
          .subtract(this.basePeriod, "months")
          .format("YYYY-MM");
        let currYear = new Date(limitPeriod).getFullYear(),
          currentMonth = new Date(limitPeriod).getMonth() + 1;
        let currentQuarter = Math.ceil(currentMonth / 3);
        let lastMonths = {
          Q1: "3",
          Q2: "6",
          Q3: "9",
          Q4: "12",
        };

        let updatedMonthly = limitPeriod;

        let updatedYearly = "";
        if (limitPeriod == `${currYear}-12`) {
          updatedYearly = currYear;
        } else {
          updatedYearly = currYear - 1;
        }

        let updatedFinancialYear = "",
          lastMonthOfFY = `${currYear}-03`;
        if (limitPeriod == lastMonthOfFY) {
          updatedFinancialYear = currYear - 1;
        } else if (
          new Date(limitPeriod).getTime() > new Date(lastMonthOfFY).getTime()
        ) {
          updatedFinancialYear = currYear - 1;
        } else if (
          new Date(limitPeriod).getTime() < new Date(lastMonthOfFY).getTime()
        ) {
          updatedFinancialYear = currYear - 2;
        }

        let updatedFinancialYearJuly = "",
          lastMonthOfFYJuly = `${currYear}-06`;
        if (limitPeriod == lastMonthOfFYJuly) {
          updatedFinancialYearJuly = `${currYear - 1}July`;
        } else if (
          new Date(limitPeriod).getTime() >
          new Date(lastMonthOfFYJuly).getTime()
        ) {
          updatedFinancialYearJuly = `${currYear - 1}July`;
        } else if (
          new Date(limitPeriod).getTime() <
          new Date(lastMonthOfFYJuly).getTime()
        ) {
          updatedFinancialYearJuly = `${currYear - 2}July`;
        }
        let updatedFinancialYearOct = "",
          lastMonthOfFYOct = `${currYear}-09`;
        if (limitPeriod == lastMonthOfFYOct) {
          updatedFinancialYearOct = `${currYear - 1}Oct`;
        } else if (
          new Date(limitPeriod).getTime() > new Date(lastMonthOfFYOct).getTime()
        ) {
          updatedFinancialYearOct = `${currYear - 1}Oct`;
        } else if (
          new Date(limitPeriod).getTime() < new Date(lastMonthOfFYOct).getTime()
        ) {
          updatedFinancialYearOct = `${currYear - 2}Oct`;
        }
        let updatedQuarterly = "";
        if (currentMonth == lastMonths[`Q${currentQuarter}`]) {
          updatedQuarterly = `${currYear}Q${currentQuarter}`;
        } else {
          updatedQuarterly = this.$moment(
            `${currYear}Q${currentQuarter}`,
            "YYYY[Q]Q"
          )
            .subtract(1, "Q")
            .format("YYYY[Q]Q");
        }
        calculatedPeriod = {
          monthly: updatedMonthly,
          yearly: updatedYearly.toString(),
          financialYear: updatedFinancialYear.toString(),
          financialYearJuly: updatedFinancialYearJuly,
          financialYearOct: updatedFinancialYearOct,
          quarterly: updatedQuarterly,
        };
      }

      if (this.updateFrequencyType === "yearly") {
        let limitPeriod = this.$moment(
          calculatedPeriod[this.updateFrequencyType],
          "YYYY"
        )
          .subtract(this.basePeriod, "years")
          .format("YYYY");
        let currYear = limitPeriod;
        let currentQuarter = 4;

        let updatedMonthly = `${currYear}-12`;

        let updatedYearly = currYear;

        let updatedFinancialYear = currYear - 1;

        let updatedFinancialYearJuly = `${currYear - 1}July`;
        let updatedFinancialYearOct = `${currYear - 1}Oct`;

        let updatedQuarterly = `${currYear}Q${currentQuarter}`;
        calculatedPeriod = {
          monthly: updatedMonthly,
          yearly: updatedYearly.toString(),
          financialYear: updatedFinancialYear.toString(),
          financialYearJuly: updatedFinancialYearJuly,
          financialYearOct: updatedFinancialYearOct,
          quarterly: updatedQuarterly,
        };
      }
      if (
        this.updateFrequencyType === "financialYear" ||
        this.updateFrequencyType === "financialYearJuly" ||
        this.updateFrequencyType === "financialYearOct"
      ) {
        let year =
          this.updateFrequencyType === "financialYear"
            ? calculatedPeriod[this.updateFrequencyType]
            : this.updateFrequencyType === "financialYearJuly"
            ? calculatedPeriod[this.updateFrequencyType].split("July")[0]
            : calculatedPeriod[this.updateFrequencyType].split("Oct")[0];
        let limitPeriod = this.$moment(year, "YYYY")
          .subtract(this.basePeriod, "years")
          .format("YYYY");
        let currYear = limitPeriod;
        let currentQuarter =
          this.updateFrequencyType === "financialYear"
            ? 1
            : this.updateFrequencyType === "financialYearJuly"
            ? 2
            : 3;
        let lastMonths = {
          Q1: "3",
          Q2: "6",
          Q3: "9",
          Q4: "12",
        };
        let findMonth =
          lastMonths[`Q${currentQuarter}`] < 10
            ? "0" + lastMonths[`Q${currentQuarter}`]
            : lastMonths[`Q${currentQuarter}`];
        let updatedMonthly = `${currYear * 1 + 1}-${findMonth}`;

        let updatedYearly = currYear;

        let updatedFinancialYear =
          this.updateFrequencyType === "financialYear"
            ? currYear
            : this.updateFrequencyType === "financialYearJuly"
            ? `${currYear}July`
            : `${currYear}Oct`;

        let updatedFinancialYearJuly =
          this.updateFrequencyType === "financialYear"
            ? currYear
            : this.updateFrequencyType === "financialYearJuly"
            ? `${currYear}July`
            : `${currYear}Oct`;
        let updatedFinancialYearOct =
          this.updateFrequencyType === "financialYear"
            ? currYear
            : this.updateFrequencyType === "financialYearJuly"
            ? `${currYear}July`
            : `${currYear}Oct`;
        let updatedQuarterly = `${currYear * 1 + 1}Q${currentQuarter}`;
        calculatedPeriod = {
          monthly: updatedMonthly,
          yearly: updatedYearly.toString(),
          financialYear: updatedFinancialYear.toString(),
          financialYearJuly: updatedFinancialYearJuly,
          financialYearOct: updatedFinancialYearOct,
          quarterly: updatedQuarterly,
        };
      }
      if (this.updateFrequencyType === "quarterly") {
        let limitPeriod = this.$moment(
          calculatedPeriod[this.updateFrequencyType],
          "YYYY[Q]Q"
        )
          .subtract(this.basePeriod, "Q")
          .format("YYYY[Q]Q");
        let currYear = limitPeriod.split("Q")[0];
        let currentQuarter = limitPeriod.split("Q")[1];
        let lastMonths = {
          Q1: "3",
          Q2: "6",
          Q3: "9",
          Q4: "12",
        };
        let findMonth =
          lastMonths[`Q${currentQuarter}`] < 10
            ? "0" + lastMonths[`Q${currentQuarter}`]
            : lastMonths[`Q${currentQuarter}`];
        let updatedMonthly = `${currYear}-${findMonth}`;

        let updatedYearly = "";
        if (`${currYear}-${findMonth}` === `${currYear}-12`) {
          updatedYearly = currYear;
        } else {
          updatedYearly = currYear - 1;
        }

        let updatedFinancialYear = "",
          lastMonthOfFY = `${currYear}-03`;
        if (`${currYear}-${findMonth}` == lastMonthOfFY) {
          updatedFinancialYear = currYear - 1;
        } else if (
          new Date(`${currYear}-${findMonth}`).getTime() >
          new Date(lastMonthOfFY).getTime()
        ) {
          updatedFinancialYear = currYear - 1;
        } else if (
          new Date(`${currYear}-${findMonth}`).getTime() <
          new Date(lastMonthOfFY).getTime()
        ) {
          updatedFinancialYear = currYear - 2;
        }

        let updatedFinancialYearJuly = "",
          lastMonthOfFYJuly = `${currYear}-06`;
        if (`${currYear}-${findMonth}` == lastMonthOfFYJuly) {
          updatedFinancialYearJuly = `${currYear - 1}July`;
        } else if (
          new Date(`${currYear}-${findMonth}`).getTime() >
          new Date(lastMonthOfFYJuly).getTime()
        ) {
          updatedFinancialYearJuly = `${currYear - 1}July`;
        } else if (
          new Date(`${currYear}-${findMonth}`).getTime() <
          new Date(lastMonthOfFYJuly).getTime()
        ) {
          updatedFinancialYearJuly = `${currYear - 2}July`;
        }

        let updatedQuarterly = limitPeriod;
        calculatedPeriod = {
          monthly: updatedMonthly,
          yearly: updatedYearly.toString(),
          financialYear: updatedFinancialYear.toString(),
          financialYearJuly: updatedFinancialYearJuly,
          quarterly: updatedQuarterly,
        };
      }
      if (this.$store.getters.getAppSettings.calendar == "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");

        let dateQ = new Date(calculatedPeriod.quarterly.slice(0, 4));
        let restQ = calculatedPeriod.quarterly.slice(4);
        let dateA = new Date(calculatedPeriod.yearly.slice(0, 4));
        let dateM = new Date(calculatedPeriod.monthly.slice(0, 4));
        let dateF = new Date(calculatedPeriod.financialYear.slice(0, 4));
        let nepaliDateQ = adToBs(
          `${
            dateQ.getFullYear() +
            "-" +
            (dateQ.getMonth() + 1) +
            "-" +
            dateQ.getDate()
          }`
        );
        let nepaliDateA = adToBs(
          `${
            dateA.getFullYear() +
            "-" +
            (dateA.getMonth() + 1) +
            "-" +
            dateA.getDate()
          }`
        );
        let nepaliDateM = adToBs(
          `${
            dateM.getFullYear() +
            "-" +
            (dateM.getMonth() + 1) +
            "-" +
            dateM.getDate()
          }`
        );
        let nepaliDateF = adToBs(
          `${
            dateF.getFullYear() +
            "-" +
            (dateF.getMonth() + 1) +
            "-" +
            dateF.getDate()
          }`
        );

        nepaliDateQ = translateDate({
          rawDate: `${new Date(nepaliDateQ).getFullYear() + restQ}`,
        });

        nepaliDateA = translateDate({
          rawDate: `${new Date(nepaliDateA).getFullYear()}`,
        });

        nepaliDateM = translateDate({
          rawDate:
            `${new Date(nepaliDateM).getFullYear()}` +
            "-" +
            `${
              new Date(nepaliDateM).getMonth() < 10
                ? "0" + new Date(nepaliDateM).getMonth()
                : new Date(nepaliDateM).getMonth()
            }`,
        });

        
        nepaliDateF = translateDate({
          rawDate: `${new Date(nepaliDateF).getFullYear()}`,
        });

        calculatedPeriod["yearly"] = nepaliDateA;
        calculatedPeriod["quarterly"] = nepaliDateQ;
        calculatedPeriod["monthly"] = nepaliDateM;
        calculatedPeriod["financialYear"] = nepaliDateF;
      }
      periodObj.calculatedPeriod = JSON.parse(JSON.stringify(calculatedPeriod));
      this.sendPeriod = calculatedPeriod[newVal];
      this.$emit("getPeriod", periodObj);
    },
  },
  created() {
    this.chartName =
      this.chartData && this.chartData.chartName
        ? this.chartData.chartName
        : "";
    this.setPeriod(this.chartData?.periodType || "monthly");
  },
};
</script>
