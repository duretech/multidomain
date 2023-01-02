<template>
  <div class="analytic-charts">
    <HighChartTable
      :max="5"
      :min="-5"
      :cid="cID"
      :type="matrixType"
      :data="matrixData"
      :methodSeq="methodSeq"
      :chartName="chartName"
      :chartInfo="chartInfo"
      ref="trendMatrixTable"
      :dataFetched="dataFetched"
      :matrixData="matrixDataBool"
      :locationPeriod="locationPeriod"
      v-if="isMatrix && Object.keys(matrixData).length != 0"
    />
    <HighChartComponent
      v-else
      :r2="r2"
      :cID="cID"
      :source="source"
      :chartData="cObj"
      :drillSD="drillSD"
      :sorting="sorting"
      :outliers="outliers"
      class="border-bottom"
      :chartType="chartType"
      :showLabels="showLabels"
      :dataFetched="dataFetched"
      :chartConfigData="chartData"
      :drillPointBenchmark="drillPointBenchmark"
    />
  </div>
</template>
<script>
import service from "@/service";
import chunk from "lodash/chunk";
import {
  capitalize,
  getDateRange,
  generateChart,
  subtractNDate,
  translateDate,
  formatSingleDate,
  formatSeasonalPeriod,
} from "@/components/Common/commonFunctions";
import SummaryDataMixin from "@/helpers/SummaryDataMixin";
import basicChartConfig from "@/config/basicChartConfig.js";
import standardDeviation from "ml-array-standard-deviation";
import HighChartTable from "@/components/Analytical/HighChartTable";
import SetChartMetaDataMixin from "@/helpers/SetChartMetaDataMixin";
import externalChartConfig from "@/components/DQR/externalChartConfig.js";
import oChartConfig from "@/components/FPDashboard/analytical/geographical/geographicalchartconfig";
import HighChartComponent from "@/components/Highcharts/HighChartComponentDynamic";

export default {
  props: [
    "subTab",
    "emuData",
    "childArr",
    "chartData",
    "summaryList",
    "locationPeriod",
    "reportChartData",
    "scorecardLocation",
  ],
  mixins: [SummaryDataMixin, SetChartMetaDataMixin],
  components: {
    HighChartTable,
    HighChartComponent,
  },
  data() {
    return {
      r2: -1,
      source: null,
      chartInfo: "",
      chartName: "",
      outliers: null,
      drillSD: false,
      matrixData: {},
      methodSeq: null,
      periodLength: 1,
      showLabels: false,
      dataFetched: false,
      emuMethodData: null,
      calType: "aggregate",
      matrixDataBool: false,
      drillPointBenchmark: false,
      cObj: JSON.parse(JSON.stringify(basicChartConfig)),
    };
  },
  computed: {
    matrixType() {
      let type = "EMU";
      if (
        ["OTHER_MATRIX_TABLE"].includes(
          this.chartData.chartOptions.chartCalculation
        )
      ) {
        type = "Source";
      }
      return type;
    },
    isMatrix() {
      let isMatrix = false;
      if (
        this.$route.name === "AnalyticalDashboard" &&
        ["MATRIX_TABLE", "OTHER_MATRIX_TABLE"].includes(
          this.chartData.chartOptions.chartCalculation
        )
      ) {
        isMatrix = true;
      }
      return isMatrix;
    },
    selectedDate() {
      return translateDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        monthlyFormat: "MMM YYYY",
      });
    },
    chartType() {
      return this.chartData.chartOptions.chartCategory === "regional"
        ? "regional"
        : "period";
    },
    cID() {
      return this.chartData.chartOptions.cid;
    },
    sorting() {
      return ["seasonal", "regional"].includes(
        this.chartData.chartOptions.chartCategory
      )
        ? "type4"
        : "type3";
    },
  },
  watch: {
    summaryList: {
      handler(newValue) {
        let isFound = newValue.find(
          (s) =>
            s.chartConfigData &&
            s.chartConfigData.id === this.chartData.chartOptions.id &&
            s.isCompare &&
            s.compareData &&
            !s.compareDone
        );
        if (isFound) {
          this.sdSummary({
            cData: this.chartData.chartOptions,
            methodData: this.emuMethodData,
            compareData: isFound.compareData,
          });
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler(newValue, oldValue) {
        if (
          oldValue &&
          (newValue.location !== oldValue.location ||
            newValue.periodType !== oldValue.periodType ||
            newValue.period !== oldValue.period)
        ) {
          this.dataFetched = false;
          this.cObj = JSON.parse(JSON.stringify(basicChartConfig));
          if (this.chartData.chartOptions.isSavedData) {
            if (!this.emuData[this.locationPeriod.periodType]) {
              this.getEMUChart();
            }
          } else {
            this.setValues();
          }
        }
      },
      deep: true,
    },
    emuData: {
      handler() {
        if (this.chartData.chartOptions.isSavedData) {
          this.dataFetched = false;
          this.getEMUChart();
        }
      },
      deep: true,
    },
  },
  methods: {
    setBenchmarks({ benchmarkValue, chartData, chartOptions }) {
      let plotLines = [],
        allBenchmarks = this.$store.getters.getGlobalFactors().allBenchmarks;
      chartOptions.benchmarks.forEach((b) => {
        let isFound = allBenchmarks.benchmarks.find((a) => b.includes(a.id));
        if (isFound) {
          let obj = {
            ...isFound.plotLine,
            id: `${isFound.id}_${isFound.plotLineType}`,
            name: isFound.displayName,
          };
          if (b.includes("national")) {
            obj.value = benchmarkValue;
          }
          if (chartOptions.benchmarkInLegend) {
            const _this = this;
            chartData.series.push({
              ...obj,
              type: "line",
              data: [obj.value],
              marker: {
                enabled: false,
              },
              isBenchmark: true,
              events: {
                // Event for showing/hiding plot line
                legendItemClick: function (e) {
                  _this.$swal({
                    title: "No action available on benchmarks",
                  });
                  return false;
                  // if (this.visible) {
                  // 	this.chart.xAxis[0].removePlotLine(plotLineId);
                  // } else {
                  // 	this.chart.xAxis[0].addPlotLine(plotLineOptions);
                  // }
                },
              },
            });
          }
          plotLines.push(obj);
        }
      });
      if (plotLines.length) {
        chartData.yAxis.plotLines = plotLines;
      }
      return chartData;
    },
    updateOutliersList({ name, value, header, outliers, method = "default" }) {
      if (!outliers[method]) {
        outliers = {
          [method]: [
            {
              header,
              outlierList: [],
            },
          ],
        };
      }
      let isMIndex = outliers[method].findIndex((m) => m.header === header);
      if (isMIndex >= 0) {
        let isFound = outliers[method][isMIndex].outlierList.findIndex(
          (o) => o.name === name
        );
        if (isFound >= 0) {
          outliers[method][isMIndex].outlierList[isFound].outliers.push(value);
        } else {
          outliers[method][isMIndex].outlierList.push({
            name: name,
            outliers: [value],
          });
        }
      } else {
        outliers[method].push({
          header,
          outlierList: [],
        });
      }
      return outliers;
    },
    findOutliers({
      cObj,
      type,
      header,
      isMethods = false,
      substantialChange = 0,
      benchmarkValue = null,
      standardDeviationValue = null,
      currentPeriod = null,
    }) {
      const getAvg = (d) => {
        let data = d.map((d) => d.y);
        let nLen = data.length;
        let nSum = data.reduce((a, b) => a + b, 0);
        let avg = nLen ? nSum / nLen : 0;
        return {
          data,
          avg,
        };
      };
      const getHighLow = (c, m = "default") => {
        let { data, avg } = getAvg(c.data);
        let stdDev = standardDeviation(data);
        let low = avg * 1 - standardDeviationValue * stdDev;
        let high = avg * 1 + standardDeviationValue * stdDev;
        let updatedData = c.data.map((d) => {
          d.label = d.y > high ? "High" : d.y < low ? "Low" : "";
          d.color = d.y > high ? "#55BF3B" : d.y < low ? "#DF5353" : "";
          if (d.label) {
            if (d.pe === currentPeriod) {
              isOutlier = true;
            }
            outliers = this.updateOutliersList({
              header,
              outliers,
              name: c.name,
              value: d.name,
              method: m,
            });
          }
          return d;
        });
        return {
          high,
          low,
          avg,
          stdDev,
          updatedData,
        };
      };
      const getUpdatedData = (data, m = "default") => {
        let updatedM = data.map((c) => {
          let { high, low, avg, stdDev, updatedData } = getHighLow(c, m);
          return {
            ...c,
            data: updatedData,
            stdDev,
            low,
            high,
            avg,
            standardDeviationValue,
          };
        });
        return updatedM;
      };
      const setOutliers = (data, s, m = "default") => {
        let updatedData = data.map((d) => {
          if (d.y < benchmarkValue) {
            d.color = "#FE8081";
            let obj = {
              header,
              outliers,
              name: s,
              value: `${d.name} (${d.y}%)`,
            };
            if (m !== "default") {
              obj.method = m;
            }
            outliers = this.updateOutliersList(obj);
          }
          return d;
        });
        return updatedData;
      };
      let outliers = {},
        isOutlier = false;

      if (type === "-CT-") {
        if (isMethods) {
          cObj.methodSeries = cObj.methodSeries.map((m) => {
            let updatedM = m.data.map((s) => {
              return {
                ...s,
                data: setOutliers(s.data, s.name, m.name),
              };
            });
            return {
              ...m,
              data: updatedM,
            };
          });
        } else {
          cObj.series = cObj.series.map((s) => {
            if (substantialChange) {
              let { avg } = getAvg(s.data);
              let substantialChangeAvg = avg.toFixed(2);
              s.data.map((d) => {
                if (avg - d.y * 1 < -substantialChange) {
                  outliers = this.updateOutliersList({
                    header: `${this.$i18n.t("rr_text2", {
                      substantialChange: substantialChange,
                      substantialChangeAvg: substantialChangeAvg
                        ? `(${substantialChangeAvg})%`
                        : "",
                    })}`,
                    outliers,
                    name: s.name,
                    value: `${d.name} (${(avg - d.y * 1).toFixed(2)}%)`,
                  });
                }
              });
            }
            return {
              ...s,
              data: setOutliers(s.data, s.name),
            };
          });
        }
      }

      if (type === "-IC-") {
        if (isMethods) {
          cObj.methodSeries = cObj.methodSeries.map((m) => {
            let updatedM = getUpdatedData(m.data, m.name);
            return {
              ...m,
              data: updatedM,
            };
          });
        } else {
          cObj.series = getUpdatedData(cObj.series);
          if (
            cObj.drilldown &&
            cObj.drilldown.series &&
            cObj.drilldown.series.length
          ) {
            let locData = this.getLocationData({
              series: cObj.drilldown.series,
            });
            locData = getUpdatedData(locData);
            cObj.drilldown.series = cObj.drilldown.series.map((s) => {
              let updatedData = s.data.map((d) => {
                let isFound = locData.find((l) => l.id === d.locationID);
                if (isFound) {
                  let isDataFound = isFound.data.find((d) => d.name === s.name);
                  if (isDataFound && isDataFound.color !== "") {
                    d.color = "#DF5353";
                    d.outlier = true;
                  }
                  return {
                    ...d,
                    lowd: isFound.low,
                    highd: isFound.high,
                    standardDeviationValue: isFound.standardDeviationValue,
                  };
                } else {
                  return d;
                }
              });
              return {
                ...s,
                data: updatedData,
              };
            });
          }
        }
      }
      return { oSeries: cObj, outliers, isOutlier };
    },
    getLocationData({ series, key = "locationID" }) {
      let locData = [];
      series.forEach((s) => {
        s.data.forEach((d) => {
          let isFound = locData.findIndex((l) => l.id === d[key]);
          if (isFound >= 0) {
            locData[isFound] = {
              ...locData[isFound],
              data: locData[isFound].data.concat({
                name: s.name,
                y: d.y || 0,
              }),
            };
          } else {
            locData.push({
              id: d[key],
              name: d.name,
              data: [
                {
                  name: s.name,
                  y: d.y || 0,
                },
              ],
            });
          }
        });
      });
      return locData;
    },
    generateOutliers({
      cObj,
      cData,
      bValue,
      currentPeriod,
      substantialChange,
      standardDeviationValue,
    }) {
      if (
        this.subTab.group.includes("-CT-") &&
        !["seasonal", "regional"].includes(cData.chartCategory)
      ) {
        let outObj = {
            cObj: cObj,
            type: "-CT-",
            benchmarkValue: bValue,
          },
          headerKey = "rr_text1";
        if (cData.chartCategory === "trend") {
          outObj.substantialChange = substantialChange;
          this.drillPointBenchmark = cData.drillPointBenchmark || false;
        }
        if (cData.chartCategory === "regionalTrend") {
          headerKey = "rr_text12";
          outObj.isMethods = !cData.chartDataSum ? true : false;
        }
        outObj.header = `${this.$i18n.t(headerKey, {
          option: this.subTab.group.includes("onTimeRR")
            ? this.$i18n.t("rr_text1_opt2")
            : this.$i18n.t("rr_text1_opt1"),
        })} ${bValue}%`;
        let { oSeries, outliers } = this.findOutliers(outObj);
        cObj = oSeries;
        this.outliers = outliers;
      }
      let outlier = false;
      if (
        this.subTab.group.includes("-IC-") &&
        !["seasonal", "regional"].includes(cData.chartCategory)
      ) {
        let outObj = {
          cObj: cObj,
          type: "-IC-",
          currentPeriod,
          standardDeviationValue,
          header: this.$i18n.t("aggRegionBound", {
            standardDeviation: standardDeviationValue,
          }),
        };
        if (cData.chartCategory === "trend") {
          this.drillSD = true;
        }
        if (cData.chartCategory === "regionalTrend") {
          outObj.isMethods = !cData.chartDataSum ? true : false;
        }
        let { oSeries, outliers, isOutlier } = this.findOutliers(outObj);

        cObj = oSeries;
        outlier = isOutlier;
        this.outliers = outliers;
        this.showLabels = true;
      }
      return { oSeries: cObj, outlier };
    },
    getBenchmarkValue({ cObj }) {
      let bValue = 80;
      if (cObj.yAxis.plotLines && cObj.yAxis.plotLines.length) {
        bValue = cObj.yAxis.plotLines[0].value;
      }
      return bValue;
    },
    generateTotal({ chartData, chartOptions }) {
      let key = chartOptions.chartCategory === "regional" ? "locationID" : "pe";
      let locData = this.getLocationData({
        series: chartData.series,
        key,
      });
      locData = locData.map((s) => {
        let y = 0;
        s.data.forEach((d) => {
          y = y + d.y;
        });
        y = (y * 1).toFixed(0) * 1;
        return {
          [key]: s.id,
          name: s.name,
          y,
          originalY: y,
        };
      });
      let obj = {
        name: chartOptions.totalLegend,
        color: chartOptions.totalColor,
        data: locData,
      };
      if (chartOptions.totalPosition === "FIRST") {
        chartData.series.unshift(obj);
      } else {
        chartData.series.push(obj);
      }
      return chartData;
    },
    getChunk({ periodArr, periodType }) {
      let chunks = null;
      if (periodType === "monthly") {
        chunks = chunk(periodArr, 12);
      }
      if (periodType === "quarterly") {
        chunks = chunk(periodArr, 4);
      }
      if (periodType === "yearly" || periodType === "financialYear") {
        chunks = chunk(periodArr, 1);
      }
      return chunks;
    },
    getCharts({
      de,
      cData,
      levels,
      period,
      catArray,
      location,
      periodArr,
      prevPeriod,
      isBenchmark,
      currentPeriod,
    }) {
      // For Completeness and Timeliness
      let substantialChange =
        this.subTab?.backgroundData?.substantialChange || 5;
      // For Internal Consistency
      let standardDeviationValue =
        this.subTab?.backgroundData?.standardDeviation || 2;
      // For Internal Consistency Correlation
      let r2Max = this.subTab?.backgroundData?.r2Max
        ? this.subTab.backgroundData.r2Max * 1
        : 1;
      let minOutlier = this.subTab?.backgroundData?.minOutlier || 20;
      let wastageFactor = this.subTab?.backgroundData?.wastageFactor || 20;
      let qualityThreshold = this.subTab?.backgroundData?.qualityThreshold
        ? (this.subTab.backgroundData.qualityThreshold * 1) / 100
        : 33 / 100;

      if (de) {
        service
          .getIndicatorData(de, levels, location, period)
          .then(async (response) => {
            if (response.data.rows.length) {
              let periods =
                cData.chartCategory === "seasonal"
                  ? this.getChunk({
                      periodArr,
                      periodType: this.locationPeriod.periodType,
                    })
                  : periodArr;
              let obj = this.cObj;
              if (
                cData.chartCalculation === "DEFAULT" &&
                cData.type === "scatter"
              ) {
                obj = JSON.parse(JSON.stringify(externalChartConfig.method));
              }
              if (
                !cData.isSingleSource &&
                cData.chartCalculation === "SOURCE_DIFF"
              ) {
                obj = JSON.parse(JSON.stringify(externalChartConfig.outlier));
              }
              if (
                !cData.isSingleSource &&
                cData.chartCalculation === "SOURCE_AVG"
              ) {
                obj = JSON.parse(JSON.stringify(externalChartConfig.average));
              }
              if (
                cData.chartCalculation === "DEFAULT" &&
                cData.type === "packedbubble"
              ) {
                obj = JSON.parse(JSON.stringify(oChartConfig.methodMix));
              }
              if (
                ["OTHER_MATRIX_TABLE", "OTHER_MATRIX_TABLE_CYP"].includes(
                  cData.chartCalculation
                )
              ) {
                obj = {};
              }
              let { cObj, benchmarkValue, r2 } = generateChart({
                cData,
                catArray,
                response,
                location,
                cObj: obj,
                minOutlier,
                prevPeriod,
                isBenchmark,
                currentPeriod,
                wastageFactor,
                qualityThreshold,
                periodArr: periods,
                childArr: this.childArr,
                periodLength: this.periodLength,
                backgroundData: this.subTab.backgroundData,
                periodType: this.locationPeriod.periodType,
                locationName: this.locationPeriod.locationName,
              });
              this.r2 = r2;
              if (!this.scorecardLocation) {
                if (
                  ["OTHER_MATRIX_TABLE", "OTHER_MATRIX_TABLE_CYP"].includes(
                    cData.chartCalculation
                  )
                ) {
                  this.methodSeq = cObj.methodSeq;
                  this.chartName = cData.chartName;
                  this.chartInfo = cData.chartInfo;
                  this.matrixData = cObj;
                } else {
                  if (
                    (isBenchmark ||
                      (cData.benchmarks && cData.benchmarks.length)) &&
                    cData.type !== "packedbubble"
                  ) {
                    cObj = this.setBenchmarks({
                      benchmarkValue,
                      chartData: cObj,
                      chartOptions: cData,
                    });
                  }

                  let bValue = null,
                    isOutlier = false;
                  if (
                    this.$route.name === "DQRDashboard" &&
                    !this.reportChartData
                  ) {
                    bValue = this.getBenchmarkValue({
                      cObj,
                    });

                    if (cData.generateOutliers) {
                      let { oSeries, outlier } = this.generateOutliers({
                        cObj,
                        cData,
                        bValue,
                        currentPeriod,
                        substantialChange,
                        standardDeviationValue,
                      });
                      cObj = oSeries;
                      isOutlier = outlier;
                    }
                  }
                  cObj = this.setMetaData({
                    chartData: cObj,
                    chartOptions: cData,
                  });

                  if (cData.generateTotal) {
                    cObj = this.generateTotal({
                      chartData: cObj,
                      chartOptions: cData,
                    });
                  }
                  this.cObj = cObj;
                  if (
                    ["STOCK_OUT", "AVAILABILITY"].includes(
                      cData.chartCalculation
                    ) &&
                    cData.chartCategory === "regional"
                  ) {
                    let child = await service.getChildOrganisation(location);
                    if (
                      child.data &&
                      child.data.children &&
                      child.data.children.length
                    ) {
                      let promises = [];
                      child.data.children.forEach((locationID) => {
                        promises.push(
                          service.getIndicatorData(
                            de,
                            levels,
                            locationID.id,
                            period
                          )
                        );
                      });
                      Promise.allSettled(promises).then((results) => {
                        results.forEach((response, i) => {
                          if (response.status === "fulfilled") {
                            let { cObj } = generateChart({
                              cData,
                              catArray,
                              response: response.value,
                              location: child.data.children[i].id,
                              cObj: this.cObj,
                              minOutlier,
                              prevPeriod,
                              isBenchmark,
                              currentPeriod,
                              wastageFactor,
                              qualityThreshold,
                              periodArr: periods,
                              childArr: this.childArr,
                              periodLength: this.periodLength,
                              backgroundData: this.subTab.backgroundData,
                              periodType: this.locationPeriod.periodType,
                              locationName: child.data.children[i].name,
                            });
                            this.cObj = cObj;
                            if (i === child.data.children.length - 1) {
                              this.dataFetched = true;
                            }
                          }
                        });
                      });
                    } else {
                      this.dataFetched = true;
                    }
                  }

                  if (cData.generateSummary && !this.reportChartData) {
                    if (this.$route.name === "SummaryDashboard") {
                      if (
                        this.subTab.summary &&
                        !this.subTab.summary.disable &&
                        this.subTab.summary.primaryChart ===
                          this.chartData.chartOptions.id
                      ) {
                        this.sdSummary({
                          cData,
                        });
                      }
                    } else if (this.$route.name === "DQRDashboard") {
                      this.dqrSummary({
                        r2Max,
                        bValue,
                        isOutlier,
                        currentPeriod,
                        standardDeviationValue,
                      });
                    } else {
                      this.analyticalSummary({
                        cData,
                        location,
                      });
                    }
                  }
                  //To show secondary chart in view more section of summary dashboard
                  if (
                    this.subTab.summary &&
                    !this.subTab.summary.disable &&
                    this.subTab.summary.secondaryChart ===
                      this.chartData.chartOptions.id &&
                    !this.reportChartData
                  ) {
                    this.$emit("summaryChartData", {
                      cId: cData.id,
                      id: this.subTab.id,
                      chartData: this.cObj,
                      chartConfigData: cData,
                      chartCategory: cData.chartCategory,
                    });
                  }
                  if (this.reportChartData) {
                    this.$emit("setReportChart", {
                      cId: cData.id,
                      id: this.subTab.id,
                      chartData: this.cObj,
                      chartConfigData: cData,
                      chartCategory: cData.chartCategory,
                    });
                  }
                }
              }
              if (
                !(
                  ["STOCK_OUT", "AVAILABILITY"].includes(
                    cData.chartCalculation
                  ) && cData.chartCategory === "regional"
                )
              ) {
                this.dataFetched = true;
              }
            } else {
              // errorMsg: "No Data to Display",
              this.cObj = this.setMetaData({
                chartData: this.cObj,
                chartOptions: cData,
              });
              this.dataFetched = true;
            }
          })
          .catch(() => {
            this.dataFetched = true;
            // errorMsg: "Error in fetching data",
          });
      } else {
        this.dataFetched = true;
        // errorMsg: "Mapping not available",
      }
    },
    dqrSummary({
      r2Max,
      bValue,
      isOutlier,
      currentPeriod,
      standardDeviationValue,
    }) {
      if (this.subTab.group.includes("-CT-")) {
        let s =
          this.cObj.series.length &&
          this.cObj.series[0].data.find((obj) => obj.pe == currentPeriod);
        let hoverText = this.$i18n.t("rr_hover", {
          date: this.selectedDate ? "(" + this.selectedDate + ")" : "",
          plotLines: bValue ? "(" + bValue + "%)" : "",
        });
        if (s) {
          let obj = {
            errorMsg: "",
            id: this.subTab.id,
            score: s.y > bValue * 1 ? 1 : 0,
          };
          if (this.scorecardLocation) {
            obj["scorecardLocation"] = this.scorecardLocation;
          } else {
            obj["hoverText"] = hoverText;
          }

          this.$emit("summaryData", obj);
        } else {
          let obj = {
            score: null,
            id: this.subTab.id,
            errorMsg: "Data not available for selected period",
          };
          if (this.scorecardLocation) {
            obj["scorecardLocation"] = this.scorecardLocation;
          } else {
            obj["hoverText"] = hoverText;
          }
          this.$emit("summaryData", obj);
        }
      } else if (this.subTab.group.includes("-CC-")) {
        let factor = "<sup>2</sup>";
        let hoverText = this.$i18n.t("icc_hover", {
          r2Max,
          factor,
        });
        let obj = {
          errorMsg: this.r2 >= 0 ? "" : `Error in R${factor} calculation`,
          id: this.subTab.id,
          score: this.r2 >= 0 ? (this.r2 > r2Max ? 1 : 0) : null,
        };
        if (this.scorecardLocation) {
          obj["scorecardLocation"] = this.scorecardLocation;
        } else {
          obj["hoverText"] = hoverText;
        }
        this.$emit("summaryData", obj);
      } else {
        let hoverText = this.$i18n.t("ic_hover", {
          date: this.selectedDate ? "(" + this.selectedDate + ")" : "",
          standardDeviation: standardDeviationValue,
        });
        let obj = {
          errorMsg: "",
          id: this.subTab.id,
          score: isOutlier ? 0 : 1,
        };
        if (this.scorecardLocation) {
          obj["scorecardLocation"] = this.scorecardLocation;
        } else {
          obj["hoverText"] = hoverText;
        }
        this.$emit("summaryData", obj);
      }
    },
    getSummaryText({
      indicatorName,
      compLastMn,
      compLastYr,
      prevForDate,
      prevYrForDate,
      currForDate,
      currValue,
      prevValue,
      prevYrValue,
      methodIncreased,
      methodDecreased,
      compareIndicator,
      compareIndicatorName,
      compareTracer,
      methodAvailability,
      lastRegions,
    }) {
      let found = [], // an array to collect the strings that are found
        rxp = /{([^}]+)}/g,
        summaryText = this.subTab.summary
          ? this.subTab.summary.summaryText
          : null,
        curMatch;

      if (summaryText) {
        while ((curMatch = rxp.exec(summaryText))) {
          found.push(curMatch[1]);
        }
        let calculatedValues = {};
        found.forEach((f) => {
          switch (f) {
            case "INDICATOR_NAME":
              calculatedValues[f] = indicatorName;
              break;
            case "COMPARE_LAST_MONTH":
              calculatedValues[f] = compLastMn;
              break;
            case "COMPARE_LAST_YEAR":
              calculatedValues[f] = compLastYr;
              break;
            case "CURRENT_PERIOD":
              calculatedValues[f] = currForDate;
              break;
            case "CURRENT_PERIOD_VALUE":
              calculatedValues[f] = currValue;
              break;
            case "LAST_PERIOD":
              calculatedValues[f] = prevForDate;
              break;
            case "LAST_PERIOD_VALUE":
              calculatedValues[f] = prevValue;
              break;
            case "LAST_YEAR_PERIOD":
              calculatedValues[f] = prevYrForDate;
              break;
            case "LAST_YEAR_PERIOD_VALUE":
              calculatedValues[f] = prevYrValue;
              break;
            case "METHOD_INCREASED":
              calculatedValues[f] = methodIncreased;
              break;
            case "METHOD_DECREASED":
              calculatedValues[f] = methodDecreased;
              break;
            case "COMPARE_OTHER_INDICATOR":
              calculatedValues[f] = compareIndicator;
              break;
            case "COMPARE_OTHER_INDICATOR_NAME":
              calculatedValues[f] = compareIndicatorName;
              break;
            case "COMPARE_TRACER_METHOD":
              calculatedValues[f] = compareTracer;
              break;
            case "METHOD_AVAILABILITY":
              calculatedValues[f] = methodAvailability;
              break;
            case "LAST_REGIONS":
              calculatedValues[f] = lastRegions;
              break;
          }
        });
        found.forEach((f) => {
          summaryText = summaryText.replace(
            `{${f}}`,
            `<b>${calculatedValues[f]}</b>`
          );
        });
      }
      return { summaryText };
    },
    getBenchmark(currValue) {
      let benchmarkValue =
          this.subTab.summary && this.subTab.summary.benchmarkValue !== ""
            ? this.subTab.summary.benchmarkValue * 1
            : null,
        performanceBenchmarking = "N/A";
      let percentage = this.subTab.summary
        ? this.subTab.summary.percentageIndicator
        : true; //kept default percentage to true, need to add admin setting for this
      if (benchmarkValue && benchmarkValue >= 0) {
        performanceBenchmarking =
          currValue * 1 > benchmarkValue
            ? "High"
            : currValue * 1 < benchmarkValue
            ? "Low"
            : currValue * 1 === benchmarkValue
            ? "Equal"
            : "N/A";
        benchmarkValue = percentage ? `${benchmarkValue}%` : benchmarkValue;
      }
      return { benchmarkValue, percentage, performanceBenchmarking };
    },
    getTracer(prevValue) {
      let hValue = this.$i18n.t("high_V1"),
        hRange = this.$i18n.t("stockOutCondition1");
      if (prevValue && prevValue.toFixed(1) > 5) {
        hValue = this.$i18n.t("moderate_V1");
        hRange = this.$i18n.t("stockOutCondition2");
      } else {
        hValue = this.$i18n.t("low_V1");
        hRange = this.$i18n.t("stockOutCondition3");
      }
      return {
        compareTracer: hValue,
        methodAvailability: hRange,
      };
    },
    getLastRegions(data, currDate) {
      let lastRegions = "";
      let isFound = data.find((d) => d.pe == currDate);
      if (isFound && isFound.drilldown) {
        let isDrillFound = this.cObj.drilldown.series.find(
          (ds) => ds.id === isFound.drilldown
        );
        if (isDrillFound) {
          let sortedReportingData = isDrillFound.data
            .sort(function (a, b) {
              return a.originalY - b.originalY;
            })
            .slice(0, 5);

          sortedReportingData.forEach((p, ind) => {
            if (ind === 0) {
              lastRegions += `${p.name}`;
            } else if (ind === sortedReportingData.length - 1) {
              lastRegions += `, ${this.$i18n.t("and")} ${p.name}`;
            } else {
              lastRegions += `, ${p.name}`;
            }
          });
        }
      }
      return { lastRegions };
    },
    sdSummary({ cData, methodData = null, compareData = null }) {
      let {
        currDate,
        currForDate,
        prevDate,
        prevForDate,
        prevYrDate,
        prevYrForDate,
      } = this.getPeriods();
      let details = [];
      let methodIncreased = "",
        methodDecreased = "";

      if (methodData) {
        let emuMethodData = methodData.saveData;
        let emuMonthlyPeriod = methodData.saveCategories;
        let currentPeriodIndex = emuMonthlyPeriod.indexOf(currForDate);
        let currentMonthLastYearIndex = emuMonthlyPeriod.indexOf(prevYrForDate);

        if (currentPeriodIndex && currentMonthLastYearIndex) {
          let methodValueInc = null,
            methodValueDesc = null;
          for (let i in emuMethodData) {
            let methodDiff =
              emuMethodData[i].data[currentPeriodIndex] -
              emuMethodData[i].data[currentMonthLastYearIndex];
            if (methodDiff > methodValueInc) {
              methodValueInc = Number(methodDiff.toFixed(2));
              methodIncreased = emuMethodData[i].name;
            } else if (methodDiff < methodValueDesc) {
              methodValueDesc = Number(methodDiff.toFixed(2));
              methodDecreased = emuMethodData[i].name;
            }
          }
        }
      }
      this.cObj.series.forEach((s) => {
        if (
          cData.chartDataSum ||
          this.subTab.summary.priorityIndicator === s.static_name
        ) {
          let { currValue, prevValue, prevYrValue } = this.getValue(
            s.data,
            currDate,
            prevDate,
            prevYrDate
          );
          let compareIndicator = "",
            compareIndicatorName = "";
          if (compareData) {
            compareIndicatorName = compareData[0].indicatorName;
            compareIndicator = this.$i18n.t("similar_to_V3");

            let diff = 0.0;
            diff = (
              currValue -
              compareData[0].currValue.split("%")[0] * 1
            ).toFixed(1);
            if (diff > 5) {
              compareIndicator = this.$i18n.t("higher_than_V3");
            } else if (diff < -5) {
              compareIndicator = this.$i18n.t("lower_than_V3");
            }
          }
          let { compareTracer, methodAvailability } = this.getTracer(prevValue);
          let { lastRegions } = this.getLastRegions(s.data, currDate);

          let { benchmarkValue, percentage, performanceBenchmarking } =
            this.getBenchmark(currValue);

          let d = [prevYrValue, prevValue, currValue];

          let { change } = this.getPercentChange(d[2], d[1], percentage);

          let { change: lastChange } = this.getPercentChange(
            d[2],
            d[0],
            percentage
          );

          let { compare: compLastMn, color: colorLastMn } =
            this.getRangeColor(change);

          let { compare: compLastYr, color: colorLastYr } =
            this.getRangeColor(lastChange);

          let indicatorName = s.name;

          //Add % sign in case it is percentage indicator
          change = change ? `${change}%` : change;
          lastChange = lastChange ? `${lastChange}%` : lastChange;
          currValue = percentage && currValue ? `${currValue}%` : currValue;
          prevValue = percentage && prevValue ? `${prevValue}%` : prevValue;
          prevYrValue =
            percentage && prevYrValue ? `${prevYrValue}%` : prevYrValue;

          let { summaryText } = this.getSummaryText({
            indicatorName,
            compLastMn,
            compLastYr,
            prevForDate,
            prevYrForDate,
            currForDate,
            currValue,
            prevValue,
            prevYrValue,
            methodIncreased,
            methodDecreased,
            compareIndicator,
            compareIndicatorName,
            compareTracer,
            methodAvailability,
            lastRegions,
          });

          details.push({
            change,
            currValue,
            prevValue,
            lastChange,
            compLastYr,
            compLastMn,
            colorLastMn,
            colorLastYr,
            summaryText,
            currForDate,
            prevForDate,
            prevYrValue,
            prevYrForDate,
            indicatorName,
            benchmarkValue,
            performanceBenchmarking,
          });
        }
      });
      this.$emit("summaryChartData", {
        id: this.subTab.id,
        chartData: this.cObj,
        chartConfigData: cData,
        summaryDetails: details,
        chartCategory: cData.chartCategory,
        compareDone: compareData ? true : false,
      });
    },
    analyticalSummary({ cData, location }) {
      let { currDate, currForDate, prevDate, prevForDate } = this.getPeriods();
      let details = [];
      if (cData.chartCalculation === "PERIOD_DIFF") {
        this.cObj.series.forEach((s) => {
          let aBenchmark = 0,
            bBenchmark = 0,
            aColor = null,
            bColor = null;
          let nationalValue = s.data.find((d) => d.locationID === location);
          if (nationalValue) {
            nationalValue = nationalValue.y * 1;
          } else {
            nationalValue = 0;
          }
          s.data.forEach((d) => {
            if (nationalValue > 0) {
              aColor = "green";
              bColor = "orange";
              if (d.y * 1 < 0) {
                bBenchmark++;
              }
              if (d.y * 1 > 0) {
                aBenchmark++;
              }
            }
            if (nationalValue < 0) {
              aColor = "orange";
              bColor = "green";
              if (d.y * 1 < 0) {
                aBenchmark++;
              }
              if (d.y * 1 > 0) {
                bBenchmark++;
              }
            }
          });

          let indicatorName = s.name;
          let priorityFlagIndicator = null;
          if (
            cData.generateFlag &&
            ((cData.priorityFlagIndicator &&
              !cData.chartDataSum &&
              indicatorName.includes(cData.priorityFlagIndicator)) ||
              (cData.chartDataSum && indicatorName.includes(cData.sumLegend)))
          ) {
            priorityFlagIndicator = indicatorName;
          }
          details.push({
            aColor,
            bColor,
            aBenchmark,
            bBenchmark,
            indicatorName,
            priorityFlagIndicator,
          });
        });
      } else {
        let percentage = cData.percentageIndicator || true;
        this.cObj.series.forEach((s) => {
          let pe = formatSeasonalPeriod({
            rawData: currDate,
            periodType: this.locationPeriod.periodType,
            type: "YYYY",
          });
          if (
            cData.chartCategory !== "seasonal" ||
            (cData.chartCategory === "seasonal" && s.name.includes(pe))
          ) {
            let { currValue, prevValue } = this.getValue(
              s.data,
              currDate,
              prevDate
            );

            let d = [prevValue, currValue];

            let { change } = this.getPercentChange(d[1], d[0], percentage);

            let { color } = this.getRangeColor(change);

            let indicatorName = s.name;
            let benchmark = null;

            if (cData.benchmarks && cData.benchmarks.length) {
              let allBenchmarks =
                this.$store.getters.getGlobalFactors().allBenchmarks;
              cData.benchmarks.forEach((b) => {
                if (!b.includes("national")) {
                  let isFound = allBenchmarks.benchmarks.find((a) =>
                    b.includes(a.id)
                  );
                  if (isFound) {
                    benchmark = isFound.plotLine.value;
                  }
                }
              });
            }
            let priorityFlagIndicator = null;
            if (
              (cData.compareFlag || cData.generateFlag) &&
              ((cData.priorityFlagIndicator &&
                !cData.chartDataSum &&
                indicatorName.includes(cData.priorityFlagIndicator)) ||
                (cData.chartDataSum && indicatorName.includes(cData.sumLegend)))
            ) {
              priorityFlagIndicator = indicatorName;
            }
            details.push({
              color,
              currForDate,
              prevForDate,
              indicatorName,
              change: change ? `${change}%` : change,
              benchmark: benchmark ? `${benchmark}%` : benchmark,
              currValue: percentage && currValue ? `${currValue}%` : currValue,
              prevValue: percentage && prevValue ? `${prevValue}%` : prevValue,
              dataFetched: true,
              priorityFlagIndicator,
            });
          }
        });
      }
      let obj = {
        id: this.subTab.id,
        summaryDetails: details,
        cid: this.chartData.chartOptions.cid,
        chartCalculation: cData.chartCalculation,
        priorityIndicator: cData.priorityIndicator,
      };
      if (cData.compareFlag) {
        obj["compareFlag"] = true;
      }
      if (cData.compareFlag || cData.generateFlag) {
        if (cData.priorityFlagIndicator && !cData.chartDataSum) {
          obj["priorityFlagIndicator"] = cData.priorityFlagIndicator;
        }
        if (cData.chartDataSum && cData.sumLegend) {
          obj["priorityFlagIndicator"] = cData.sumLegend;
        }
      }
      if (cData.generateFlag) {
        obj["generateFlag"] = true;
      }
      this.$emit("summaryData", obj);
    },
    getMapping() {
      let catArray = [],
        de = [],
        rMapping = [],
        rMapping2 = [];
      let namespace = "";
      if (this.reportChartData) {
        namespace = this.reportChartData.selectedDashboard;
      }
      let gSetting = this.$store.getters.getGlobalFactors(namespace),
        cData = this.chartData.chartOptions;
      if (
        gSetting.globalMappings &&
        gSetting.globalMappings.mappings &&
        gSetting.globalMappings.mappings.length
      ) {
        const allMappings = [].concat(
          ...gSetting.globalMappings.mappings.map(
            ({ mapping }) => mapping || []
          )
        );
        rMapping = allMappings.filter((m) =>
          cData.dataMapping.includes(m.indicator.static_name)
        );
        if (!cData.isSingleSource) {
          rMapping2 = allMappings.filter((m) =>
            cData.dataMapping2.includes(m.indicator.static_name)
          );
        }
      }
      if (!cData.isSingleSource) {
        let color = cData.color,
          name = cData.sumLegend
            ? cData.sumLegend
            : cData.xAxis.visible
            ? cData.xAxis.text
              ? cData.xAxis.text
              : "Source 1"
            : "Source 1";
        let mapObj = {
          name,
          static_name: name,
          color,
          dx: [],
          cyp: {},
          visible: true,
        };
        if (rMapping.length) {
          rMapping.forEach((m) =>
            m.indicator.subIndicator.forEach((subEle) => {
              subEle.selectedDE.forEach((s) => {
                mapObj.cyp[s.id] = [
                  "CYP",
                  "OTHER_AVERAGE_CYP",
                  "OTHER_MATRIX_TABLE_CYP",
                ].includes(cData.chartCalculation)
                  ? subEle.cyp || 1
                  : 1;
                de.push(s.id);
                mapObj.dx.push(s.id);
                mapObj.visible = !m.indicator.disable;
              });
            })
          );
        }
        catArray.push(mapObj);
        let color1 = cData.color,
          name1 = cData.sumLegend2
            ? cData.sumLegend2
            : cData.yAxis.visible
            ? cData.yAxis.text
              ? cData.yAxis.text
              : "Source 2"
            : "Source 2";
        let mapObj1 = {
          name: name1,
          static_name: name1,
          color: color1,
          dx: [],
          cyp: {},
          visible: true,
        };
        if (rMapping2.length) {
          rMapping2.forEach((m) =>
            m.indicator.subIndicator.forEach((subEle) => {
              subEle.selectedDE.forEach((s) => {
                mapObj1.cyp[s.id] = [
                  "CYP",
                  "OTHER_AVERAGE_CYP",
                  "OTHER_MATRIX_TABLE_CYP",
                ].includes(cData.chartCalculation)
                  ? subEle.cyp || 1
                  : 1;
                de.push(s.id);
                mapObj1.dx.push(s.id);
                mapObj1.visible = !m.indicator.disable;
              });
            })
          );
        }
        catArray.push(mapObj1);
      } else {
        if (rMapping.length) {
          if (cData.chartDataSum || cData.type === "scatter") {
            let color = cData.color,
              name = cData.sumLegend;
            if (cData.chartCategory === "seasonal") {
              color = [cData.color, ...cData.seasonalColors];
            }
            let mapObj = {
              name,
              static_name: name,
              color,
              dx: [],
              cyp: {},
              visible: true,
            };
            rMapping.forEach((m) =>
              m.indicator.subIndicator.forEach((subEle) => {
                subEle.selectedDE.forEach((s) => {
                  mapObj.cyp[s.id] = [
                    "CYP",
                    "OTHER_AVERAGE_CYP",
                    "OTHER_MATRIX_TABLE_CYP",
                  ].includes(cData.chartCalculation)
                    ? subEle.cyp || 1
                    : 1;
                  de.push(s.id);
                  mapObj.dx.push(s.id);
                  mapObj.visible = !m.indicator.disable;
                });
              })
            );
            catArray.push(mapObj);
          } else {
            rMapping.forEach((element) => {
              let color = element.indicator.color;
              if (cData.chartCategory === "seasonal") {
                color = [element.indicator.color, ...cData.seasonalColors];
              }
              let mapObj = {
                name: element.indicator.name,
                static_name: element.indicator.static_name,
                color: color,
                visible: !element.indicator.disable,
                dx: [],
                cyp: {},
              };
              element.indicator.subIndicator.forEach((subEle) => {
                subEle.selectedDE.forEach((s) => {
                  mapObj.cyp[s.id] = [
                    "CYP",
                    "OTHER_AVERAGE_CYP",
                    "OTHER_MATRIX_TABLE_CYP",
                  ].includes(cData.chartCalculation)
                    ? subEle.cyp || 1
                    : 1;
                  de.push(s.id);
                  mapObj.dx.push(s.id);
                });
              });
              catArray.push(mapObj);
            });
          }
        }
      }
      de = de.join(";");
      return {
        de,
        catArray,
      };
    },
    async setValues() {
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let levels = [];
      let { de, catArray } = this.getMapping();
      let cData = this.chartData.chartOptions;
      if (cData.chartCategory === "seasonal") {
        if (this.locationPeriod.periodType === "monthly") {
          this.periodLength =
            new Date(this.locationPeriod.period).getMonth() * 1 +
            1 +
            cData.seasonalPeriod * 12;
        }
        if (this.locationPeriod.periodType === "quarterly") {
          this.periodLength = 4 + cData.seasonalPeriod * 4;
        }
        if (
          this.locationPeriod.periodType === "yearly" ||
          this.locationPeriod.periodType === "financialYear"
        ) {
          this.periodLength = 1 + cData.seasonalPeriod * 1;
        }
      }
      if (
        cData.chartCategory === "trend" ||
        cData.chartCategory === "regionalTrend"
      ) {
        this.periodLength = 13;
        if (this.subTab.group.includes("-IC-")) {
          this.periodLength = 36;
        }
      }
      if (cData.chartCategory === "regional") {
        if (
          cData.chartCalculation === "PERIOD_DIFF" ||
          ["OTHER_AVERAGE", "OTHER_AVERAGE_CYP"].includes(
            cData.chartCalculation
          ) ||
          (["OTHER_MATRIX_TABLE", "OTHER_MATRIX_TABLE_CYP"].includes(
            cData.chartCalculation
          ) &&
            this.locationPeriod.periodType !== "monthly")
        ) {
          this.periodLength = 2;
        }
        if (
          ["OTHER_MATRIX_TABLE", "OTHER_MATRIX_TABLE_CYP"].includes(
            cData.chartCalculation
          ) &&
          this.locationPeriod.periodType === "monthly"
        ) {
          this.periodLength = 12;
        }
        if (cData.type === "scatter" && cData.isSingleSource) {
          this.periodLength = 4;
        }
      }
      let isBenchmark = false;
      let facilityLevelID = subLevelID;
      if (["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)) {
        let levels = this.$store.getters.getOrgLevels;
        let facility = levels.find((o) =>
          o.displayName.toLowerCase().includes("facility")
        );
        if (facility) {
          facilityLevelID = facility.level;
        } else {
          let facilityLevels = levels.map((o) => o.level);
          facilityLevelID = Math.max(...facilityLevels);
        }
      }
      if (cData.chartDrillDown) {
        levels = ["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)
          ? [facilityLevelID]
          : [levelID, subLevelID];
      } else if (["seasonal", "trend"].includes(cData.chartCategory)) {
        levels = ["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)
          ? [facilityLevelID]
          : [levelID];
      } else {
        if (cData.benchmarks && cData.benchmarks.length) {
          let isB = cData.benchmarks.find((b) => b.includes("national"));
          if (isB) {
            isBenchmark = true;
          }
        }
        levels = ["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)
          ? [facilityLevelID]
          : cData.chartCalculation === "PERIOD_DIFF" || isBenchmark
          ? [levelID, subLevelID]
          : [subLevelID];
      }
      let period = getDateRange({
        sendPeriod: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        periodLength: this.periodLength,
      });
      let periodArr = period;
      period = period.reverse().join(";");
      let currentPeriod = formatSingleDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      let prevPeriod = subtractNDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      this.getCharts({
        de,
        cData,
        levels,
        period,
        catArray,
        location,
        periodArr,
        prevPeriod,
        isBenchmark,
        currentPeriod,
      });
    },
    async getSummaryEMUChart(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/")[1],
        locID = [],
        locIDLabels = [];

      await service.getChildOrganisation(locationID).then((response) => {
        service.renameKeys({ ...response.data })?.children?.forEach((l) => {
          locID.push(l.id.split("/")[1]);
          locIDLabels.push({
            id: l.id.split("/")[1],
            label: l.label,
          });
        });
      });
      let emuData = null,
        emuDataKey = null;
      let emuMethodDataKey = null;
      let emuSourceKey = null;

      if (this.locationPeriod.periodType === "monthly") {
        emuDataKey = "totalEMU";
        emuMethodDataKey = "methodTrend";
      }

      if (this.locationPeriod.periodType === "yearly") {
        emuDataKey = "compEMU";
        emuMethodDataKey = "usersTrend";
      }
      let eData =
        typeof emuResponse[emuDataKey] === "string"
          ? JSON.parse(emuResponse[emuDataKey])
          : emuResponse[emuDataKey];
      emuData = eData[locationID];
      if (emuData) {
        if (this.locationPeriod.periodType === "yearly") {
          if (emuData.source === this.$i18n.t("emu_output_5")) {
            emuSourceKey = "commoditiesToClients";
          } else if (emuData.source === this.$i18n.t("emu_output_6")) {
            emuSourceKey = "commoditiesToFacilities";
          } else if (emuData.source === this.$i18n.t("emu_output_8")) {
            emuSourceKey = "fp_users";
          } else if (emuData.source === this.$i18n.t("emu_output_7")) {
            emuSourceKey = "fp_visits";
          } else {
            emuSourceKey = "commoditiesToClients";
          }
        }
        let eMethodData =
          typeof emuResponse[emuMethodDataKey] === "string"
            ? JSON.parse(emuResponse[emuMethodDataKey])
            : emuResponse[emuMethodDataKey];
        this.emuMethodData = emuSourceKey
          ? eMethodData[locationID][emuSourceKey]
          : eMethodData[locationID];
        let emuObj = null,
          sourceKey = null,
          innerDataKey = null,
          chartSource = null;
        if (this.locationPeriod.periodType === "monthly") {
          chartSource = emuData.source;
          sourceKey = this.$i18n.t("EMU");
          innerDataKey = "saveData";
        }
        if (this.locationPeriod.periodType === "yearly") {
          if (this.$i18n.locale === "fr") {
            sourceKey = emuData.source
              ? emuData.source
              : "EUM : Produits aux clients";
          } else {
            sourceKey = emuData.source
              ? emuData.source
              : "EMU :Commodities to clients";
          }
          chartSource = sourceKey.split(":")[1];
          innerDataKey = "data";
        }
        // return;
        // this.compareKey = sourceKey;
        chartSource = ": " + chartSource;
        emuObj = emuData[innerDataKey].find((e) => e.name === sourceKey);
        if (emuObj) {
          let dataArr = [];

          let formattedCatArray = [];
          if (this.locationPeriod.periodType === "monthly") {
            emuData.saveCategories.forEach((c) =>
              formattedCatArray.push(
                this.$moment(c, "MMM YYYY").format("YYYYMM")
              )
            );
          }
          if (this.locationPeriod.periodType === "yearly") {
            formattedCatArray = emuData.categories;
          }
          let pe = getDateRange({
            sendPeriod: this.locationPeriod.period,
            periodType: this.locationPeriod.periodType,
            periodLength: cData.chartCategory === "trend" ? 24 : 1,
          });
          pe = pe.reverse();
          let drilldown = {
            drillUpButton: {
              position: {
                align: "left",
                x: 0,
                y: 0,
              },
            },
            series: [],
          };
          pe.forEach((p, i) => {
            let formattedDate = translateDate({
              rawDate: p,
              periodType: this.locationPeriod.periodType,
            });
            if (formattedCatArray.includes(p)) {
              let catIndex = formattedCatArray.indexOf(p);
              if (cData.chartCategory === "trend") {
                let prevPeriod = subtractNDate({
                  rawDate: p,
                  periodType: this.locationPeriod.periodType,
                });
                let prevDate = translateDate({
                  rawDate: prevPeriod,
                  periodType: this.locationPeriod.periodType,
                });
                let drillText =
                  cData.drillCalculation === "PERIOD_DIFF"
                    ? i === 0
                      ? `${emuObj.name} ( ${formattedDate} )`
                      : `${emuObj.name} ( ${formattedDate} - ${prevDate} )`
                    : formattedDate;
                let prevCatIndex = formattedCatArray.indexOf(pe[i - 1]);
                dataArr.push({
                  pe: p,
                  name: formattedDate,
                  y: emuObj.data[catIndex],
                  drilldown: cData.chartDrillDown ? drillText : null,
                });
                if (cData.chartDrillDown) {
                  let drillObj = {
                    name: drillText,
                    id: drillText,
                    type: "column",
                    data: [],
                  };

                  Object.keys(eData).forEach((locKey) => {
                    if (locID.includes(locKey)) {
                      let innerData =
                        eData[locKey] &&
                        eData[locKey][innerDataKey] &&
                        eData[locKey][innerDataKey].length > 0
                          ? eData[locKey][innerDataKey].find(
                              (e) => e.name === sourceKey
                            )
                          : null;
                      let locName = locIDLabels.find(
                        (l) => l.id === locKey
                      ).label;
                      if (innerData) {
                        let currValue = innerData.data[catIndex] * 1 || null;
                        let prevValue =
                          innerData.data[prevCatIndex] * 1 || null;
                        let y =
                          cData.drillCalculation === "PERIOD_DIFF"
                            ? (currValue - prevValue).toFixed(1) * 1
                            : currValue;
                        let color =
                          cData.drillCalculation === "PERIOD_DIFF"
                            ? y > 0
                              ? "#5BD282"
                              : "#FE8081"
                            : cData.color;
                        drillObj.data.push({
                          y,
                          color,
                          name: locName,
                          locationID: locKey,
                          originalY: currValue,
                        });
                      } else {
                        console.log("EMU not found for location ", locName);
                      }
                    }
                  });
                  drilldown.series.push(drillObj);
                }
              }
              if (cData.chartCategory === "regional") {
                let formattedDate = formatSingleDate({
                  rawDate: p,
                  periodType: this.locationPeriod.periodType,
                });
                Object.keys(eData).forEach((locKey) => {
                  if (locID.includes(locKey)) {
                    let innerData =
                      eData[locKey] &&
                      eData[locKey][innerDataKey] &&
                      eData[locKey][innerDataKey].length > 0
                        ? eData[locKey][innerDataKey].find(
                            (e) => e.name === sourceKey
                          )
                        : null;
                    let locName = locIDLabels.find(
                      (l) => l.id === locKey
                    ).label;
                    if (innerData) {
                      let currValue = innerData.data[catIndex] * 1 || null;
                      if (p === formattedDate && currValue) {
                        dataArr.push({
                          name: locName,
                          locationID: locKey,
                          y: currValue ? currValue : 0,
                        });
                      }
                    } else {
                      console.log("EMU not found for location ", locName);
                    }
                  }
                });
              }
            } else {
              dataArr.push({
                name: formattedDate,
                y: null,
                pe: p,
                drilldown: null,
              });
            }
          });

          this.cObj.series = [
            {
              name: emuObj.name,
              color: cData.color,
              data: dataArr,
            },
          ];
          if (cData.chartCategory === "trend" && cData.chartDrillDown) {
            this.cObj.drilldown = drilldown;
          }

          this.cObj = this.setMetaData({
            chartSource,
            chartData: this.cObj,
            chartOptions: cData,
          });
          if (cData.generateSummary && !this.reportChartData) {
            if (this.$route.name === "SummaryDashboard") {
              if (
                this.subTab.summary &&
                !this.subTab.summary.disable &&
                this.subTab.summary.primaryChart === cData.id
              ) {
                this.sdSummary({
                  cData,
                  methodData: this.emuMethodData,
                });
              }
            }
          }
          if (
            this.subTab.summary &&
            !this.subTab.summary.disable &&
            this.subTab.summary.secondaryChart === cData.id &&
            !this.reportChartData
          ) {
            this.$emit("summaryChartData", {
              cId: cData.id,
              id: this.subTab.id,
              chartData: this.cObj,
              chartConfigData: cData,
              chartCategory: cData.chartCategory,
            });
          }
          if (this.reportChartData) {
            this.$emit("setReportChart", {
              cId: cData.id,
              id: this.subTab.id,
              chartData: this.cObj,
              chartConfigData: cData,
              chartCategory: cData.chartCategory,
            });
          }
          this.dataFetched = true;
        } else {
          this.dataFetched = true;
        }
      } else {
        this.dataFetched = true;
      }
    },
    async getEMUNationalChart(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/");
      let children = await service.getChildOrganisation(locationID[1]),
        emuModule = { ...emuResponse },
        parentName = this.locationPeriod.locationName,
        loc = locationID[1],
        period = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        });

      let categories = [],
        series = [],
        catIds = [];
      let totalLegend = cData.totalLegend || this.$i18n.t("total-EMU");
      let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: cData.totalColor || null,
        },
        methodSeriesObj = {},
        methodColorsObj = {};
      categories.push(parentName);
      catIds.push(loc);
      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = JSON.parse(JSON.stringify(emuModule.compEMU));
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey =
          typeof emuModule.totalEMU === "string"
            ? JSON.parse(emuModule.totalEMU)
            : emuModule.totalEMU;
      }

      Object.keys(dataKey).forEach((ids) => {
        children.data.children.forEach((child) => {
          if (child.id == ids && dataKey[ids] != null) {
            if (categories.indexOf(child.name) == -1) {
              categories.push(child.name);
              catIds.push(child.id);
            }
          }
        });
      });

      let idArr = [];
      catIds.forEach((cat, i) => {
        Object.keys(dataKey).forEach((ids) => {
          if (cat == ids && dataKey[ids] != null) {
            idArr.push(ids);
            if (this.locationPeriod.periodType === "yearly") {
              let index = dataKey[ids]["categories"].indexOf(period);
              dataKey[ids]["data"].forEach((data) => {
                if (data.name == dataKey[ids]["source"]) {
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });
              let methodTable = JSON.parse(
                JSON.stringify(emuModule.methodTable)
              );
              methodTable = JSON.parse(methodTable);
              if (methodTable[ids]) {
                methodTable[ids] = methodTable[ids].slice(
                  0,
                  methodTable[ids].length - 2
                );
                let newName = "",
                  emuColors = emuModule.emuColors
                    ? emuModule.emuColors
                    : JSON.parse(localStorage.getItem("emuColors")),
                  val = 0;

                this.population.rows.forEach((row) => {
                  if (row[2] == ids) {
                    methodTable[ids].forEach((y) => {
                      newName =
                        y[this.$i18n.t("sub_method")] +
                        "__" +
                        y[this.$i18n.t("methods")];
                      if (this.calType == "aggregate") {
                        let mName = y[this.$i18n.t("methods")];
                        if (mName != [this.$i18n.t("IUD")]) {
                          mName = capitalize(mName);
                        }
                        methodColorsObj[mName] = emuColors[mName];
                      } else {
                        methodColorsObj[y[this.$i18n.t("sub_method")]] =
                          emuColors[y[this.$i18n.t("sub_method")]];
                      }
                      //methodColorsObj[newName] = emuColors[y[this.$i18n.t('sub_method')]]
                      Object.keys(y).forEach((yr) => {
                        if (yr == period) {
                          y[yr] = y[yr].split(",").join("");
                          val = ((y[yr] / Number(row[3])) * 100).toFixed(2) * 1;
                        }
                        if (!methodSeriesObj[newName]) {
                          methodSeriesObj[newName] = [];
                        }
                      });
                      methodSeriesObj[newName].push({
                        name: categories[i],
                        value: val,
                      });
                    });
                  }
                });
              }
            } else {
              let index = dataKey[ids]["saveCategories"].indexOf(period);
              let emuTrend =
                typeof emuModule.emuTrend === "string"
                  ? JSON.parse(emuModule.emuTrend)
                  : emuModule.emuTrend;
              let tIndex = emuTrend[ids]["saveCategories"].indexOf(period);
              dataKey[ids]["saveData"].forEach((data) => {
                if (data.name == this.$i18n.t("EMU")) {
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });

              emuTrend[ids]["saveData"].forEach((data) => {
                let newName = data.trans_name + "__" + data.mName;
                if (!methodSeriesObj[newName]) {
                  methodSeriesObj[newName] = [];
                }
                if (this.calType == "aggregate") {
                  methodColorsObj[data.mName] = data.color;
                } else {
                  methodColorsObj[data.trans_name] = data.color;
                }
                methodSeriesObj[newName].push({
                  name: categories[i],
                  value: data.data[tIndex],
                });
              });
            }
          }
          //idObj[ids] = methodSeriesObj
        });
      });
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};

      if (this.calType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = capitalize(sMethod);
          }
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
            categories.forEach((cat, i) => {
              oFinalAgrEMU[sMethod][i] = 0;
            });
          }

          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex] + methodSeriesObj[i][j].value;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      } else {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[0];
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          categories.forEach((cat, i) => {
            oFinalAgrEMU[sMethod][i] = 0;
          });
          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] = methodSeriesObj[i][j].value
              ? methodSeriesObj[i][j].value
              : 0;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      }

      Object.keys(oFinalAgrEMU).forEach((key) => {
        if (key) {
          series.push({
            name: key,
            data: oFinalAgrEMU[key],
            visible: false,
            color: methodColorsObj[key],
            ids: idArr,
          });
        }
      });
      if (cData.generateTotal) {
        if (cData.totalPosition === "FIRST") {
          series.unshift(totalSeriesObj);
        } else {
          series.push(totalSeriesObj);
        }
      }
      this.cObj.source = dataKey[loc] ? ": " + dataKey[loc].source : "";
      let newSeriesAr = [],
        newCategories = [];

      Object.keys(series).forEach((s) => {
        let serObj = {
            name: "",
            data: [],
            visible: "",
            color: "",
            type: cData.type,
          },
          parSeries = {
            name: "",
            data: [],
            visible: "",
            type: "line",
            color: "",
          };
        serObj["name"] = series[s]["name"];
        serObj["color"] = parSeries["color"] = series[s]["color"];
        parSeries["name"] = series[s]["name"] + " " + parentName;
        if (series[s]["name"] == totalLegend) {
          serObj.visible = true;
          parSeries.visible = true;
        } else {
          serObj.visible = false;
          parSeries.visible = false;
        }

        if (series[s]["data"].length > 1) {
          series[s]["data"].forEach((d, i) => {
            if (i == 0) {
              if (categories.length > 1) {
                for (let j = 0; j < categories.length - 1; j++) {
                  parSeries.data.push(d);
                }
              } else {
                parSeries.data.push(d);
                if (newCategories.indexOf(categories[i]) == -1) {
                  newCategories.push(categories[i]);
                }
              }
            } else {
              serObj.data.push(d);
              if (newCategories.indexOf(categories[i]) == -1) {
                newCategories.push(categories[i]);
              }
            }
          });
        } else {
          series[s]["data"].forEach((d, i) => {
            if (i == 0) {
              if (categories.length > 1) {
                for (let j = 0; j < categories.length - 1; j++) {
                  parSeries.data.push(d);
                }
              } else {
                parSeries.data.push(d);
                if (newCategories.indexOf(categories[i]) == -1) {
                  newCategories.push(categories[i]);
                }
              }
              serObj.data.push(null);
            }
          });
        }

        newSeriesAr.push(serObj);
        newSeriesAr.push(parSeries);
      });

      //this.commonMethodUsed(series, categories, this.cObj.source, catIds); // let min = 0, max = 0

      let noCatSeries = newSeriesAr.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({ name: newCategories[i], y: d })),
      }));

      this.cObj.series = noCatSeries;
      this.cObj = this.setMetaData({
        chartData: this.cObj,
        chartOptions: cData,
        chartSource: this.cObj.source,
      });
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          cId: cData.id,
          id: this.subTab.id,
          chartData: this.cObj,
          chartConfigData: cData,
          chartCategory: cData.chartCategory,
        });
      }
      this.dataFetched = true;
    },
    getEMUTrendChart(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/");
      let emuModule = { ...emuResponse },
        loc = locationID[1],
        period = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        });
      let categories = [],
        series = [];
      let totalLegend = cData.totalLegend || this.$i18n.t("total-EMU");
      let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: cData.totalColor || null,
        },
        methodSeriesObj = {},
        methodColorsObj = {};

      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = emuModule.compEMU;
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey =
          typeof emuModule.totalEMU === "string"
            ? JSON.parse(emuModule.totalEMU)
            : emuModule.totalEMU;
      }

      if (dataKey[loc] != null && dataKey[loc] != undefined) {
        if (this.locationPeriod.periodType === "yearly") {
          categories = dataKey[loc]["categories"];
          dataKey[loc]["data"].forEach((data) => {
            if (data.name == dataKey[loc]["source"]) {
              totalSeriesObj.data = data["data"];
            }
          });
          let methodTable = emuModule.methodTable
            ? JSON.parse(JSON.stringify(emuModule.methodTable))
            : null;
          methodTable = JSON.parse(methodTable);
          if (methodTable[loc]) {
            methodTable[loc] = methodTable[loc].slice(
              0,
              methodTable[loc].length - 2
            );
            let newName = "",
              emuColors = emuModule.emuColors
                ? emuModule.emuColors
                : JSON.parse(localStorage.getItem("emuColors"));

            this.population.rows.forEach((row) => {
              if (row[2] == loc) {
                methodTable[loc].forEach((y) => {
                  let val = null;
                  newName =
                    y[this.$i18n.t("sub_method")] +
                    "__" +
                    y[this.$i18n.t("methods")];
                  if (this.calType == "aggregate") {
                    let mName = y[this.$i18n.t("methods")];
                    if (mName != [this.$i18n.t("IUD")]) {
                      mName = capitalize(mName);
                    }
                    methodColorsObj[mName] = emuColors[mName];
                  } else {
                    methodColorsObj[y[this.$i18n.t("sub_method")]] =
                      emuColors[y[this.$i18n.t("sub_method")]];
                  }
                  categories.forEach((cat) => {
                    Object.keys(y).forEach((yr) => {
                      if (!methodSeriesObj[newName]) {
                        methodSeriesObj[newName] = [];
                      }
                      if (
                        yr != [this.$i18n.t("sub_method")] &&
                        yr != [this.$i18n.t("methods")]
                      ) {
                        if (cat == yr) {
                          val = y[yr].split(",").join("");
                          val =
                            ((Number(val) / Number(row[3])) * 100).toFixed(2) *
                            1;
                        }
                      }
                    });
                    methodSeriesObj[newName].push(val);
                  });
                });
              }
            });
          }
        } else {
          let index = dataKey[loc]["saveCategories"].indexOf(period);
          let firstIndex = index - 23;
          firstIndex = firstIndex < 0 ? 0 : firstIndex;
          let emuModuleData =
            typeof emuModule.emuTrend === "string"
              ? JSON.parse(emuModule.emuTrend)
              : emuModule.emuTrend;

          let tIndex = emuModuleData[loc]["saveCategories"].indexOf(period);
          tIndex = tIndex < 0 ? 0 : tIndex;
          let tFirstIndex = tIndex + 23;
          tFirstIndex = tFirstIndex < 0 ? 0 : tFirstIndex;
          categories = dataKey[loc]["saveCategories"].slice(
            firstIndex,
            index + 1
          );

          dataKey[loc]["saveData"].forEach((data) => {
            if (data.name == this.$i18n.t("EMU")) {
              totalSeriesObj.data = data["data"].slice(firstIndex, index + 1);
            }
          });

          emuModuleData[loc]["saveData"].forEach((data) => {
            let newName = data.trans_name + "__" + data.mName;
            if (!methodSeriesObj[newName]) {
              methodSeriesObj[newName] = [];
            }
            if (this.calType == "aggregate") {
              methodColorsObj[data.mName] = data.color;
            } else {
              methodColorsObj[data.trans_name] = data.color;
            }
            if (tIndex == 0) {
              methodSeriesObj[newName] = data.data.slice(tIndex, tFirstIndex);
            } else {
              methodSeriesObj[newName] = data.data.slice(
                tIndex - 1,
                tFirstIndex
              );
            }
          });
        }
      }
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};
      if (this.calType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = capitalize(sMethod);
          }
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          for (let j in methodSeriesObj[i]) {
            oFinalAgrEMU[sMethod][j] =
              (oFinalAgrEMU[sMethod][j] || 0) + methodSeriesObj[i][j];
            oFinalAgrEMU[sMethod][j] = oFinalAgrEMU[sMethod][j].toFixed(6) * 1;
          }
        }
      } else {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[0];
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          for (let j in methodSeriesObj[i]) {
            oFinalAgrEMU[sMethod][j] = methodSeriesObj[i][j];
          }
        }
      }
      Object.keys(oFinalAgrEMU).forEach((key) => {
        if (key) {
          series.push({
            name: key,
            data: oFinalAgrEMU[key],
            visible: false,
            color: methodColorsObj[key],
          });
        }
      });
      if (cData.generateTotal) {
        if (cData.totalPosition === "FIRST") {
          series.unshift(totalSeriesObj);
        } else {
          series.push(totalSeriesObj);
        }
      }

      let source = dataKey[loc] ? ": " + dataKey[loc].source : "";
      this.cObj.source = source;
      let noCatSeries = series.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({
          name: categories[i],
          pe: this.$moment(categories[i], "MMM YYYY").format("YYYYMM"),
          y: d,
        })),
      }));
      this.cObj.series = noCatSeries;
      this.cObj = this.setMetaData({
        chartData: this.cObj,
        chartOptions: cData,
        chartSource: this.cObj.source,
      });
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          cId: cData.id,
          id: this.subTab.id,
          chartData: this.cObj,
          chartConfigData: cData,
          chartCategory: cData.chartCategory,
        });
      }
      this.dataFetched = true;
    },
    async getEMUAverageChart(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/");
      let children = await service.getChildOrganisation(locationID[1]),
        emuModule = { ...emuResponse },
        parentName = this.locationPeriod.locationName,
        loc = locationID[1],
        period = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        });

      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = emuModule.compEMU;
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey =
          typeof emuModule.totalEMU === "string"
            ? JSON.parse(emuModule.totalEMU)
            : emuModule.totalEMU;
      }

      let categories = [],
        series = [],
        catIds = [];
      let totalLegend = cData.totalLegend || this.$i18n.t("total-EMU");
      let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: cData.totalColor || null,
        },
        methodSeriesObj = {},
        methodColorsObj = {};
      categories.push(parentName);
      catIds.push(loc);

      Object.keys(dataKey).forEach((ids) => {
        children.data.children.forEach((child) => {
          if (child.id == ids && dataKey[ids] != null) {
            if (
              categories.indexOf(child.name) == -1 ||
              categories.indexOf(loc) == -1
            ) {
              categories.push(child.name);
              catIds.push(child.id);
            }
          }
        });
      });

      catIds.forEach((cat, i) => {
        Object.keys(dataKey).forEach((ids) => {
          if (cat == ids && dataKey[ids] != null) {
            if (this.locationPeriod.periodType === "yearly") {
              let index = dataKey[ids]["categories"].indexOf(period);
              dataKey[ids]["data"].forEach((data) => {
                if (data.name == dataKey[ids]["source"]) {
                  //totalSeriesObj.data.push(((data['data'][index] - data['data'][index-1])/12).toFixed(6)*1)
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });

              let methodTable = emuModule.methodTable
                ? JSON.parse(JSON.stringify(emuModule.methodTable))
                : null;
              methodTable = JSON.parse(methodTable);
              if (methodTable[ids]) {
                methodTable[ids] = methodTable[ids].slice(
                  0,
                  methodTable[ids].length - 2
                );
                let newName = "",
                  emuColors = emuModule.emuColors
                    ? emuModule.emuColors
                    : JSON.parse(localStorage.getItem("emuColors")),
                  val = 0;

                this.population.rows.forEach((row) => {
                  if (row[2] == ids) {
                    methodTable[ids].forEach((y) => {
                      newName =
                        y[this.$i18n.t("sub_method")] +
                        "__" +
                        y[this.$i18n.t("methods")];
                      if (this.calType == "aggregate") {
                        let mName = y[this.$i18n.t("methods")];
                        if (mName != [this.$i18n.t("IUD")]) {
                          mName = capitalize(mName);
                        }
                        methodColorsObj[mName] = emuColors[mName];
                      } else {
                        methodColorsObj[y[this.$i18n.t("sub_method")]] =
                          emuColors[y[this.$i18n.t("sub_method")]];
                      }
                      Object.keys(y).forEach((yr) => {
                        if (!methodSeriesObj[newName]) {
                          methodSeriesObj[newName] = [];
                        }
                        if (
                          yr != [this.$i18n.t("sub_method")] &&
                          yr != [this.$i18n.t("methods")] &&
                          yr == period
                        ) {
                          val = y[yr].split(",").join("");
                          val =
                            ((Number(val) / Number(row[3])) * 100).toFixed(2) *
                            1;
                        }
                      });
                      methodSeriesObj[newName].push({
                        name: categories[i],
                        value: val,
                      });
                    });
                  }
                });
              }
            } else {
              let index = dataKey[ids]["saveCategories"].indexOf(period);
              let emuTrend =
                typeof emuModule.emuTrend === "string"
                  ? JSON.parse(emuModule.emuTrend)
                  : emuModule.emuTrend;
              let tIndex = emuTrend[ids]["saveCategories"].indexOf(period);
              dataKey[ids]["saveData"].forEach((data) => {
                if (data.name == this.$i18n.t("EMU")) {
                  totalSeriesObj.data.push(
                    (
                      (data["data"][index] - data["data"][index - 12]) /
                      12
                    ).toFixed(6) * 1
                  );
                }
              });
              emuTrend[ids]["saveData"].forEach((data) => {
                let newName = data.trans_name + "__" + data.mName;

                if (!methodSeriesObj[newName]) {
                  methodSeriesObj[newName] = [];
                }
                if (this.calType == "aggregate") {
                  methodColorsObj[data.mName] = data.color;
                } else {
                  methodColorsObj[data.trans_name] = data.color;
                }
                methodSeriesObj[newName].push({
                  name: categories[i],
                  value:
                    (
                      (data["data"][tIndex] - data["data"][tIndex - 12]) /
                      12
                    ).toFixed(6) * 1,
                });
              });
            }
          }
        });
      });
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};
      if (this.calType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = capitalize(sMethod);
          }
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
            categories.forEach((cat, i) => {
              oFinalAgrEMU[sMethod][i] = 0;
            });
          }

          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] =
              (oFinalAgrEMU[sMethod][nIndex] || 0) +
              methodSeriesObj[i][j].value;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      } else {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[0];
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          categories.forEach((cat, i) => {
            oFinalAgrEMU[sMethod][i] = 0;
          });
          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] = methodSeriesObj[i][j].value;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      }
      Object.keys(oFinalAgrEMU).forEach((key) => {
        if (key) {
          series.push({
            name: key,
            data: oFinalAgrEMU[key],
            visible: false,
            color: methodColorsObj[key],
          });
        }
      });
      if (cData.generateTotal) {
        if (cData.totalPosition === "FIRST") {
          series.unshift(totalSeriesObj);
        } else {
          series.push(totalSeriesObj);
        }
      }
      this.cObj.source = dataKey[loc] ? ": " + dataKey[loc].source : "";

      let noCatSeries = series.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({ name: categories[i], y: d })),
      }));
      this.cObj.series = noCatSeries;
      this.cObj = this.setMetaData({
        chartData: this.cObj,
        chartOptions: cData,
        chartSource: this.cObj.source,
      });
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          cId: cData.id,
          id: this.subTab.id,
          chartData: this.cObj,
          chartConfigData: cData,
          chartCategory: cData.chartCategory,
        });
      }

      this.dataFetched = true;
    },
    async getEMUBubbleChart(cData, emuResponse) {
      this.cObj = { ...oChartConfig.emuMethodMix };
      let locationID = this.locationPeriod.location.split("/");
      let children = await service.getChildOrganisation(locationID[1]),
        emuModule = { ...emuResponse },
        parentName = this.locationPeriod.locationName,
        loc = locationID[1],
        period = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        });

      let categories = [],
        series = [],
        catIds = [];
      let totalLegend = cData.totalLegend || this.$i18n.t("total-EMU");
      let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: cData.totalColor || null,
        },
        methodSeriesObj = {},
        methodColorsObj = {};
      categories.push(parentName);
      catIds.push(loc);
      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = JSON.parse(JSON.stringify(emuModule.compEMU));
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey =
          typeof emuModule.totalEMU === "string"
            ? JSON.parse(emuModule.totalEMU)
            : emuModule.totalEMU;
      }

      Object.keys(dataKey).forEach((ids) => {
        children.data.children.forEach((child) => {
          if (child.id == ids && dataKey[ids] != null) {
            if (categories.indexOf(child.name) == -1) {
              categories.push(child.name);
              catIds.push(child.id);
            }
          }
        });
      });

      let idArr = [];
      catIds.forEach((cat, i) => {
        Object.keys(dataKey).forEach((ids) => {
          if (cat == ids && dataKey[ids] != null) {
            idArr.push(ids);
            if (this.locationPeriod.periodType === "yearly") {
              let index = dataKey[ids]["categories"].indexOf(period);
              dataKey[ids]["data"].forEach((data) => {
                if (data.name == dataKey[ids]["source"]) {
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });
              let methodTable = JSON.parse(
                JSON.stringify(emuModule.methodTable)
              );
              methodTable = JSON.parse(methodTable);
              if (methodTable[ids]) {
                methodTable[ids] = methodTable[ids].slice(
                  0,
                  methodTable[ids].length - 2
                );
                let newName = "",
                  emuColors = emuModule.emuColors
                    ? emuModule.emuColors
                    : JSON.parse(localStorage.getItem("emuColors")),
                  val = 0;

                this.population.rows.forEach((row) => {
                  if (row[2] == ids) {
                    methodTable[ids].forEach((y) => {
                      newName =
                        y[this.$i18n.t("sub_method")] +
                        "__" +
                        y[this.$i18n.t("methods")];
                      if (this.calType == "aggregate") {
                        let mName = y[this.$i18n.t("methods")];
                        if (mName != [this.$i18n.t("IUD")]) {
                          mName = capitalize(mName);
                        }
                        methodColorsObj[mName] = emuColors[mName];
                      } else {
                        methodColorsObj[y[this.$i18n.t("sub_method")]] =
                          emuColors[y[this.$i18n.t("sub_method")]];
                      }
                      //methodColorsObj[newName] = emuColors[y[this.$i18n.t('sub_method')]]
                      Object.keys(y).forEach((yr) => {
                        if (yr == period) {
                          y[yr] = y[yr].split(",").join("");
                          val = ((y[yr] / Number(row[3])) * 100).toFixed(2) * 1;
                        }
                        if (!methodSeriesObj[newName]) {
                          methodSeriesObj[newName] = [];
                        }
                      });
                      methodSeriesObj[newName].push({
                        name: categories[i],
                        value: val,
                      });
                    });
                  }
                });
              }
            } else {
              let index = dataKey[ids]["saveCategories"].indexOf(period);
              let emuTrend =
                typeof emuModule.emuTrend === "string"
                  ? JSON.parse(emuModule.emuTrend)
                  : emuModule.emuTrend;
              let tIndex = emuTrend[ids]["saveCategories"].indexOf(period);
              dataKey[ids]["saveData"].forEach((data) => {
                if (data.name == this.$i18n.t("EMU")) {
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });

              emuTrend[ids]["saveData"].forEach((data) => {
                let newName = data.trans_name + "__" + data.mName;
                if (!methodSeriesObj[newName]) {
                  methodSeriesObj[newName] = [];
                }
                if (this.calType == "aggregate") {
                  methodColorsObj[data.mName] = data.color;
                } else {
                  methodColorsObj[data.trans_name] = data.color;
                }
                methodSeriesObj[newName].push({
                  name: categories[i],
                  value: data.data[tIndex],
                });
              });
            }
          }
          //idObj[ids] = methodSeriesObj
        });
      });
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};

      if (this.calType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = capitalize(sMethod);
          }
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
            categories.forEach((cat, i) => {
              oFinalAgrEMU[sMethod][i] = 0;
            });
          }

          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex] + methodSeriesObj[i][j].value;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      } else {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[0];
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          categories.forEach((cat, i) => {
            oFinalAgrEMU[sMethod][i] = 0;
          });
          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] = methodSeriesObj[i][j].value
              ? methodSeriesObj[i][j].value
              : 0;
            oFinalAgrEMU[sMethod][nIndex] =
              oFinalAgrEMU[sMethod][nIndex].toFixed(6) * 1;
          }
        }
      }

      Object.keys(oFinalAgrEMU).forEach((key) => {
        if (key) {
          series.push({
            name: key,
            data: oFinalAgrEMU[key],
            visible: false,
            color: methodColorsObj[key],
            ids: idArr,
          });
        }
      });
      if (cData.generateTotal) {
        if (cData.totalPosition === "FIRST") {
          series.unshift(totalSeriesObj);
        } else {
          series.push(totalSeriesObj);
        }
      }
      this.cObj.source = dataKey[loc] ? ": " + dataKey[loc].source : "";
      let newSeriesAr = [],
        newCategories = [];

      Object.keys(series).forEach((s) => {
        let serObj = {
            name: "",
            data: [],
            visible: "",
            color: "",
            type: cData.type,
          },
          parSeries = {
            name: "",
            data: [],
            visible: "",
            type: "line",
            color: "",
          };
        serObj["name"] = series[s]["name"];
        serObj["color"] = parSeries["color"] = series[s]["color"];
        parSeries["name"] = series[s]["name"] + " " + parentName;
        if (series[s]["name"] == totalLegend) {
          serObj.visible = true;
          parSeries.visible = true;
        } else {
          serObj.visible = false;
          parSeries.visible = false;
        }

        if (series[s]["data"].length > 1) {
          series[s]["data"].forEach((d, i) => {
            if (i == 0) {
              if (categories.length > 1) {
                for (let j = 0; j < categories.length - 1; j++) {
                  parSeries.data.push(d);
                }
              } else {
                parSeries.data.push(d);
                if (newCategories.indexOf(categories[i]) == -1) {
                  newCategories.push(categories[i]);
                }
              }
            } else {
              serObj.data.push(d);
              if (newCategories.indexOf(categories[i]) == -1) {
                newCategories.push(categories[i]);
              }
            }
          });
        } else {
          series[s]["data"].forEach((d, i) => {
            if (i == 0) {
              if (categories.length > 1) {
                for (let j = 0; j < categories.length - 1; j++) {
                  parSeries.data.push(d);
                }
              } else {
                parSeries.data.push(d);
                if (newCategories.indexOf(categories[i]) == -1) {
                  newCategories.push(categories[i]);
                }
              }
              serObj.data.push(null);
            }
          });
        }

        newSeriesAr.push(serObj);
        newSeriesAr.push(parSeries);
      });
      let newSeries = [];
      series.forEach((s) => {
        if (s.name.toLowerCase() !== totalLegend.toLowerCase()) {
          newSeries.push({
            ...s,
            data: s.data.map((d) => ({ name: s.name, value: d })),
          });
        }
      });
      series = newSeries;
      let cat = categories;
      let ser = [];
      if (series.length > 0) {
        cat.forEach((c, i) => {
          let high = 0,
            name = "",
            color = null,
            id = "";
          series.forEach((s) => {
            if (s.data[i] && s.data[i].value && high < s.data[i].value) {
              high = s.data[i].value;
              name = s.data[i].name;
              if (s.color) {
                color = s.color;
              }
              //id = s.ids[i]
            }
            id = catIds[i];
          });

          let dataItem = { name: c, value: high, id: id };
          let sItem = {
            name,
            data: [dataItem],
            color: color,
          };
          if (ser.length) {
            let sData = ser.find((s) => s.name === name);
            if (sData) {
              sData.data = [...sData.data, dataItem];
            } else {
              ser.push(sItem);
            }
          } else {
            ser.push(sItem);
          }
        });
      }
      let fSer = ser.filter((obj) => obj.name != "");
      this.cObj.series = fSer;
      this.cObj.tableData = [];
      this.cObj.title.title = cData.chartName + ": " + this.cObj.source;
      let tabObj = {};
      Object.keys(ser).forEach((s) => {
        ser[s].data.forEach((d) => {
          tabObj[this.$i18n.t("region")] = d.name;
          tabObj[this.$i18n.t("method")] = ser[s].name;
          tabObj[this.$i18n.t("value")] = d.value ? d.value : "";
          let newObj = { ...tabObj };
          this.cObj.tableData.push(newObj);
        });
      });
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          cId: cData.id,
          id: this.subTab.id,
          chartData: this.cObj,
          chartConfigData: cData,
          chartCategory: cData.chartCategory,
        });
      }
      this.dataFetched = true;
    },
    async getEMUMethodMixChart(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/");
      let children = await service.getChildOrganisation(locationID[1]),
        emuModule = { ...emuResponse },
        parentName = this.locationPeriod.locationName,
        loc = locationID[1],
        period = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        }),
        so = "";

      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        dataKey = JSON.parse(JSON.stringify(emuModule.methodTable));
        dataKey = JSON.parse(dataKey);
        so =
          emuModule.compEMU && JSON.parse(emuModule.compEMU)[loc]
            ? JSON.parse(emuModule.compEMU)[loc].source
            : "";
      } else {
        dataKey =
          typeof emuModule.emuTrend === "string"
            ? JSON.parse(emuModule.emuTrend)
            : emuModule.emuTrend;
        so = dataKey[loc] ? dataKey[loc].source : "";
      }

      let categories = [],
        series = [],
        catIds = [],
        methodSeriesObj = {},
        methodColorsObj = {},
        sumVal = {};
      categories.push(parentName);
      catIds.push(loc);

      Object.keys(dataKey).forEach((ids) => {
        children.data.children.forEach((child) => {
          if (child.id == ids && dataKey[ids] != null) {
            if (
              categories.indexOf(child.name) == -1 ||
              categories.indexOf(loc) == -1
            ) {
              categories.push(child.name);
              catIds.push(child.id);
            }
          }
        });
      });
      catIds.forEach((cat, catIndex) => {
        Object.keys(dataKey).forEach((ids) => {
          if (cat == ids && dataKey[ids] != null) {
            if (this.locationPeriod.periodType === "yearly") {
              dataKey[ids] = dataKey[ids].slice(0, dataKey[ids].length - 2);
              sumVal[ids] = 0;

              this.population.rows.forEach((row) => {
                if (row[2] == ids) {
                  dataKey[ids].forEach((y) => {
                    Object.keys(y).forEach((yr) => {
                      if (yr == period && ids == row[2]) {
                        y[yr] = y[yr].split(",").join("");
                        y[yr] = ((y[yr] / Number(row[3])) * 100).toFixed(2) * 1;
                        sumVal[ids] += y[yr];
                      }
                    });
                  });
                  let newName = "",
                    emuColors = emuModule.emuColors
                      ? emuModule.emuColors
                      : JSON.parse(localStorage.getItem("emuColors")),
                    val = 0;
                  dataKey[ids].forEach((y) => {
                    if (this.calType == "aggregate") {
                      newName =
                        y[this.$i18n.t("sub_method")] +
                        "__" +
                        y[this.$i18n.t("methods")];
                      let mName = y[this.$i18n.t("methods")];
                      if (mName != [this.$i18n.t("IUD")]) {
                        mName = capitalize(mName);
                      }
                      methodColorsObj[mName] = emuColors[mName];
                    } else {
                      newName = y[this.$i18n.t("sub_method")];
                      methodColorsObj[y[this.$i18n.t("sub_method")]] =
                        emuColors[y[this.$i18n.t("sub_method")]];
                    }
                    Object.keys(y).forEach((yr) => {
                      if (yr == period) {
                        val = y[yr];
                      }

                      if (!methodSeriesObj[newName]) {
                        methodSeriesObj[newName] = [];
                      }
                    });
                    let calval =
                      val > 0 && sumVal[ids] > 0
                        ? ((val / sumVal[ids]) * 100).toFixed(2) * 1
                        : 0;

                    methodSeriesObj[newName].push({
                      name: categories[catIndex],
                      y: calval,
                    });
                  });
                }
              });
            } else {
              let index = dataKey[ids]["saveCategories"].indexOf(period);
              //saveAgreData
              if (this.calType == "aggregate" && dataKey[ids]["agreData"]) {
                sumVal[ids] = 0;
                dataKey[ids]["agreData"].forEach((data) => {
                  let dataArr = data.data.reverse();
                  let datVal = dataArr[index] ? dataArr[index] : 0;
                  sumVal[ids] += datVal;
                });
                dataKey[ids]["agreData"].forEach((data) => {
                  let newName = data.name;

                  if (!methodSeriesObj[newName]) {
                    methodSeriesObj[newName] = [];
                  }
                  methodColorsObj[data.name] = data.color;
                  let datVal = data.data[index] ? data.data[index] : 0;

                  methodSeriesObj[newName].push({
                    name: categories[catIndex],
                    y: ((datVal / sumVal[ids]) * 100).toFixed(2) * 1,
                  });
                });
              } else {
                sumVal[ids] = 0;
                dataKey[ids]["saveData"].forEach((data) => {
                  sumVal[ids] += data.data[index];
                });
                dataKey[ids]["saveData"].forEach((data) => {
                  let newName = data.trans_name;

                  if (!methodSeriesObj[newName]) {
                    methodSeriesObj[newName] = [];
                  }

                  methodColorsObj[data.trans_name] = data.color;
                  let datVal = data.data[index] ? data.data[index] : 0;
                  methodSeriesObj[newName].push({
                    name: categories[catIndex],
                    y: ((datVal / sumVal[ids]) * 100).toFixed(2) * 1,
                  });
                });
              }
            }
          }
        });
      });
      delete methodSeriesObj[""];

      let oFinal = {};
      if (
        this.locationPeriod.periodType === "yearly" &&
        this.calType == "aggregate"
      ) {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = capitalize(sMethod);
          }
          if (!oFinal[sMethod]) {
            oFinal[sMethod] = categories.map((e) => {
              return { name: e, y: 0 };
            });
          }
          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinal[sMethod][nIndex].y =
              (oFinal[sMethod][nIndex].y || 0) + methodSeriesObj[i][j].y;
            oFinal[sMethod][nIndex].y =
              oFinal[sMethod][nIndex].y.toFixed(6) * 1;
          }
        }

        Object.keys(oFinal).forEach((key) => {
          series.push({
            name: key,
            data: oFinal[key],
            color: methodColorsObj[key],
          });
        });
      } else {
        Object.keys(methodSeriesObj).forEach((key) => {
          if (key) {
            series.push({
              name: key,
              data: methodSeriesObj[key],
              color: methodColorsObj[key],
            });
          }
        });
      }

      this.cObj.tableData = [];
      series.forEach((s) => {
        let tabObj = {};
        tabObj[this.$i18n.t("method")] = s.name;
        s.data.forEach((d) => {
          tabObj[d.name] = d.y ? d.y : "";
        });
        this.cObj.tableData.push(tabObj);
      });
      this.cObj.source = so;
      this.cObj.series = series.reverse();
      this.cObj = this.setMetaData({
        chartData: this.cObj,
        chartOptions: cData,
        chartSource: this.cObj.source,
      });
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          cId: cData.id,
          id: this.subTab.id,
          chartData: this.cObj,
          chartConfigData: cData,
          chartCategory: cData.chartCategory,
        });
      }

      this.dataFetched = true;
    },
    async getEMUMatrixTable(cData, emuResponse) {
      let locationID = this.locationPeriod.location.split("/");
      let children = await service.getChildOrganisation(locationID[1]),
        emuModule = { ...emuResponse },
        parentName = this.locationPeriod.locationName,
        loc = locationID[1],
        so = "";

      let dataKey = {};
      if (this.locationPeriod.periodType === "yearly") {
        dataKey = JSON.parse(JSON.stringify(emuModule.methodTable));
        dataKey = JSON.parse(dataKey);
        so =
          emuModule.compEMU && JSON.parse(emuModule.compEMU)[loc]
            ? JSON.parse(emuModule.compEMU)[loc].source
            : "";
      } else {
        so = emuModule.totalEMU[loc] ? emuModule.totalEMU[loc].source : "";
        dataKey =
          typeof emuModule.totalEMU === "string"
            ? JSON.parse(emuModule.totalEMU)
            : emuModule.totalEMU;
      }
      let methodSeriesObj = {},
        categories = [],
        catIds = [],
        dataObj = {};
      categories.push(parentName);
      catIds.push(loc);
      Object.keys(dataKey).forEach((ids) => {
        children.data.children.forEach((child) => {
          if (child.id == ids && dataKey[ids] != null) {
            if (
              categories.indexOf(child.name) == -1 ||
              categories.indexOf(loc) == -1
            ) {
              categories.push(child.name);
              catIds.push(child.id);
            }
          }
        });
      });

      catIds.forEach((cat) => {
        Object.keys(dataKey).forEach((ids) => {
          if (cat == ids && dataKey[ids] != null) {
            if (this.locationPeriod.periodType === "yearly") {
              dataKey[ids] = dataKey[ids].slice(0, dataKey[ids].length - 2);

              if (!dataObj[ids]) {
                dataObj[ids] = {};
              }
              dataKey[ids].forEach((id) => {
                let method =
                  id[this.$i18n.t("sub_method")] +
                  "__" +
                  id[this.$i18n.t("methods")];
                if (!dataObj[ids][method]) {
                  dataObj[ids][method] = {};
                }
                Object.keys(id).forEach((key) => {
                  if (
                    key != [this.$i18n.t("sub_method")] &&
                    key != [this.$i18n.t("methods")]
                  ) {
                    this.population.rows.forEach((row) => {
                      if (row[2] == ids) {
                        id[key] = id[key].split(",").join("");
                        id[key] =
                          ((Number(id[key]) / Number(row[3])) * 100).toFixed(
                            2
                          ) * 1;
                        //if(key == period){
                        //dataObj[ids][method][key] = (id[key]/Number(row[3])*100).toFixed(2) * 1
                        dataObj[ids][method][key] = id[key];
                        // }
                      }
                    });
                  }
                });
              });
            } else {
              if (!dataObj[ids]) {
                dataObj[ids] = {};
              }
              let emuSave =
                typeof emuModule.emuTrend === "string"
                  ? JSON.parse(emuModule.emuTrend)
                  : emuModule.emuTrend;
              emuSave[ids]["saveData"].forEach((data) => {
                if (!dataObj[ids][data.trans_name + "__" + data.mName]) {
                  dataObj[ids][data.trans_name + "__" + data.mName] = {};
                }
                data.data.forEach((d, i) => {
                  let month = emuSave[ids]["saveCategories"][i];
                  dataObj[ids][data.trans_name + "__" + data.mName][month] = d;
                });
              });
            }
          }
        });
      });

      let oFinal = {};

      Object.keys(dataObj).forEach((loc) => {
        let oFinalAgrEMU = {};
        for (let i in dataObj[loc]) {
          if (this.calType == "aggregate") {
            let aSplit = i.split("__"),
              sMethod = aSplit[1];
            if (sMethod != [this.$i18n.t("IUD")]) {
              sMethod = capitalize(sMethod);
            }
            if (!oFinalAgrEMU[sMethod]) {
              oFinalAgrEMU[sMethod] = [];
            }
            for (let j in dataObj[loc][i]) {
              oFinalAgrEMU[sMethod][j] =
                (oFinalAgrEMU[sMethod][j] || 0) + dataObj[loc][i][j];
              oFinalAgrEMU[sMethod][j] =
                oFinalAgrEMU[sMethod][j].toFixed(6) * 1;
            }
            this.matrixDataBool = true;
          } else {
            let aSplit = i.split("__"),
              sMethod = aSplit[0];
            oFinalAgrEMU[sMethod] = dataObj[loc][i];
            this.matrixDataBool = false;
          }
        }
        oFinal[loc] = oFinalAgrEMU;
      });

      Object.keys(oFinal).forEach((key, i) => {
        if (!methodSeriesObj[categories[i]]) {
          methodSeriesObj[categories[i]] = oFinal[key];
        }
      });
      let seriesObj = {};
      Object.keys(methodSeriesObj).forEach((location) => {
        Object.keys(methodSeriesObj[location]).forEach((method) => {
          if (!seriesObj[method]) {
            seriesObj[method] = {};
          }
          seriesObj[method][location] = methodSeriesObj[location][method];
        });
      });
      this.matrixData.source = so;
      this.matrixData["categories"] = categories;
      this.matrixData["avgAnnualGrowthData"] = seriesObj;
      this.chartName = cData.chartName;
      this.chartInfo = cData.chartInfo;
      this.dataFetched = true;
    },
    getEMUChart() {
      let emuResponse = JSON.parse(JSON.stringify(this.emuData));
      emuResponse = emuResponse[this.locationPeriod.periodType];
      if (emuResponse) {
        let cData = this.chartData.chartOptions;
        if (cData) {
          if (
            this.$route.name === "AnalyticalDashboard" &&
            cData.chartCalculation === "EMU_NATIONAL"
          ) {
            this.getEMUNationalChart(cData, emuResponse);
          } else if (
            this.$route.name === "AnalyticalDashboard" &&
            cData.chartCalculation === "DEFAULT"
          ) {
            if (cData.type === "packedbubble") {
              this.getEMUBubbleChart(cData, emuResponse);
            } else if (cData.type === "stack_bar") {
              this.getEMUMethodMixChart(cData, emuResponse);
            } else {
              this.getEMUTrendChart(cData, emuResponse);
            }
          } else if (
            this.$route.name === "AnalyticalDashboard" &&
            cData.chartCalculation === "EMU_AVERAGE"
          ) {
            this.getEMUAverageChart(cData, emuResponse);
          } else if (
            this.$route.name === "AnalyticalDashboard" &&
            cData.chartCalculation === "MATRIX_TABLE"
          ) {
            this.getEMUMatrixTable(cData, emuResponse);
          } else {
            this.getSummaryEMUChart(cData, emuResponse);
          }
        } else {
          this.dataFetched = true;
        }
      } else {
        this.dataFetched = true;
      }
    },
  },
  created() {
    if (!this.chartData.chartOptions.isSavedData) {
      this.setValues();
    } else {
      //Useful when user changes tab and comes back
      if (this.emuData) {
        this.dataFetched = false;
        this.getEMUChart();
      }
    }
  },
};
</script>
