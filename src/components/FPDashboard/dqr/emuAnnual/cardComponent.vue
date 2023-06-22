<template>
  <div>
    <loader v-if="showLoader" />
    <fullscreen
      v-model="inputChartsFull"
      ref="fullscreen"
      class="fullContainer emu-dqr"
    >
      <div class="card fullContent">
        <div class="card-header px-2 py-0 text-decoration-none">
          <div class="row no-gutters">
            <div
              class="col-lg-9 col-md-9 p-t-4px"
              :class="{ 'col-lg-12 col-md-12': bShowIcons || inputChartsFull }"
            >
              <div class="cardTitleSection text-wrap fs-19-1920">
                <i
                  class="fa fa-info-circle cursor-pointer chart-info mr-2 ml-2"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: chartdata.chartInfo,
                    title: chartdata.title,
                    html: true,
                  }"
                ></i>
                <p class="title_p fs-19-1920 m-0">{{ chartdata.title }}</p>
              </div>
            </div>
            <div
              class="col-lg-3 col-md-3 position-relative"
              v-if="!bShowIcons && !inputChartsFull"
            >
              <ChartOptions
                :sorting="sorting"
                @dataSort="dataSort"
                :defaultSort="defaultSort"
                @showTable="showTable"
                @exportChart="exportChart"
                :cID="chartdata.cid"
                chartKey="inputCharts"
                :trendTable="chartdata.tableData"
                :title="chartdata.title"
                @toggleFullscreen="toggleFullscreen"
              />
            </div>
          </div>
        </div>
        <div class="row mb-3 mx-0" v-if="!bShowIcons">
          <div class="col-lg-12 col-md-12">
            <ChartFilters
              :style="{
                visibility:
                  (period && viewType == 'chart') || ddOptions
                    ? 'visible'
                    : 'hidden',
              }"
              :cObj="chartOptions"
              :ddValue="ddValue"
              :ddOptions="ddOptions"
              :plotType="chartPlotType"
              :plotOptions="chartTypeOptions"
              @changePlotType="changePlotType"
              @handleFilterChange="handleFilterChange"
            />
          </div>
        </div>
        <div class="card-body pb-0 h-410px overflow-hidden">
          <div class="row">
            <div class="col-12" v-if="viewType == 'chart'">
              <highcharts
                :options="chartOptions"
                ref="inputCharts"
              ></highcharts>
            </div>
            <div class="col-12" v-else>
              <!-- <b-table hover :items="items" :fields="fields" head-variant="light" sticky-header :bordered=true style="max-height: 400px !important"></b-table> -->
              <div v-if="chartdata.tableData">
                <b-table
                  v-if="ddOptions"
                  sticky-header
                  striped
                  hover
                  :fields="chartdata.fields"
                  :items="chartdata.tableData"
                  style="margin-top: 40px; overflow-y: auto; max-height: 390px"
                ></b-table>
                <b-table
                  class="table-responsive_output"
                  v-else
                  sticky-header
                  striped
                  hover
                  :fields="chartdata.fields"
                  :items="chartdata.tableData"
                  style="overflow-y: auto; max-height: 390px"
                ></b-table>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer text-right" v-if="!bShowIcons">
          <!-- <p class="m-0">{{$t('source')}}: <span>{{chartdata.source}}</span></p> -->
        </div>
      </div>
    </fullscreen>
  </div>
</template>

<script>
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
  props: [
    "chartdata",
    "ddOptions",
    "bShowIcons",
    "period",
    "canComment",
    "loggedInUserId",
    "chartComp",
    "emuType",
    "defaultSort",
    "sorting",
    "inDQR",
  ],
  mixins: [FullScreenMixin],
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
  mounted() {
    // console.log(this.$refs.download)
  },
  beforeDestroy() {
    //document.removeEventListener('click',this.close, 'indes')
  },
  data() {
    return {
      state: false,
      activeIcon: "chart",
      ddValue: this.ddOptions ? 0 : null,

      chartOptions: this.reInitilaizeData(this.chartdata),
      chartPlotType: "column",
      viewType: "chart",
      fields: [],
      items: [],
      commentText: "",
      commentList: [],
      cID: "",
      showLoader: false,
      chartTypeOptions: [
        {
          value: "column",
          text: this.$i18n.t("column"),
        },
        {
          value: "area",
          text: this.$i18n.t("area"),
        },
        {
          value: "line",
          text: this.$i18n.t("line"),
        },
      ],
      exportData: this.chartdata.tableData,
      sortType: this.defaultSort,
      cData: "",
      inputChartsFull: false,
    };
  },
  computed: {},
  methods: {
    handleFilterChange(newValue) {
      this.$emit("handleFilterChange", newValue);
    },
    errorAlert() {
      this.sweetAlert({
        title: this.$i18n.t("error"),
      });
    },
    formatTableData() {
      if (this.chartdata.tableData != undefined) {
        this.fields.push(this.$i18n.t("period"));
        this.chartdata.tableData.forEach((data, i) => {
          Object.keys(data).forEach((key) => {
            if (key == "Method" && this.fields.indexOf(key) == -1) {
              this.fields.push(data[key]);
            }
            if (key != "Method") {
              //console.log(this.fields[i + 1], i + 1);
              this.items.push({
                [this.$i18n.t("period")]: key,
                [this.fields[i + 1]]: data[key],
              });
            }
          });
        });
        //console.log(this.fields, this.items);
      }
    },
    reInitilaizeData(p_chartData) {
      if (p_chartData.tableData) {
        this.exportData = p_chartData.tableData;
      }
      //console.log(p_chartData.tableData)
      //   console.log(p_chartData, this.emuType);
      if (p_chartData.cid != undefined) {
        this.cID = p_chartData.cid;
      }
      let chartNewData =
        p_chartData.type === "bar"
          ? {
              chart: {
                type: p_chartData.type ? p_chartData.type : "bar",
                zoomType: "x",
                events: {},
                backgroundColor: "#212934",
              },
              title: {
                text: "",
                title: "",
              },
              xAxis: {
                lineColor: "#302f52",
                categories: p_chartData.categories,
                max: p_chartData.max,
                min: 0,
                labels: {
                  rotation: -45,
                  enabled: true,
                  style: {
                    color: "#dad7d7",
                    fontSize: "10px",
                  },
                },
                title: {
                  text: "",
                  style: {
                    color: "#d6d6d6 ",
                    fontSize: "10px",
                  },
                },
                scrollbar: {
                  enabled: true,
                  width: 100,
                  barBorderRadius: 7,
                  barBorderWidth: 0,
                  buttonBorderWidth: 0,
                  buttonArrowColor: "#2f2e46",
                  buttonBorderRadius: 7,
                  rifleColor: "#98989896",
                  trackBackgroundColor: "#2f2e46",
                  trackBorderWidth: 0,
                  trackBorderColor: "silver",
                  trackBorderRadius: 7,
                  minWidth: 1,
                  barBackgroundColor: "#12122a",
                  buttonBackgroundColor: "#12122a",
                  buttonsEnabled: true,
                },
              },
              yAxis: {
                // min: 0,
                title: {
                  text: p_chartData.yTitle,
                  style: {
                    color: "#dad7d7",
                    fontSize: "12px",
                  },
                },
                labels: {
                  style: {
                    color: "#dad7d7",
                  },
                },
                gridLineColor: "#12122a",
                plotLines: [],
              },
              legend: {
                reversed: true,
                backgroundColor: "transparent",
                itemStyle: {
                  color: "#dad7d7",
                  fontSize: "12px",
                  fontWeight: "300",
                },
                itemHoverStyle: {
                  color: "#dad7d7",
                },
              },
              plotOptions: {
                series: {
                  stacking: "normal",
                },
              },
              exporting: {
                enabled: false,
                allowHTML: true,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true,
                      },
                    },
                  },
                  title: {
                    useHTML: true,
                    text: "",
                    style: {
                      color: "#dad7d7",
                    },
                  },
                  xAxis: [
                    {
                      lineColor: "#302f52",
                      labels: {
                        style: {
                          color: "#dad7d7",
                          fontSize: "10px",
                        },
                      },
                      scrollbar: {
                        enabled: false,
                      },
                    },
                  ],
                  drilldown: {
                    activeAxisLabelStyle: {
                      color: "#dad7d7",
                      textDecoration: "none",
                    },
                  },
                },
              },
              credits: {
                enabled: false,
              },
              tooltip: {
                shared: true,
                useHTML: true,
              },
              series: p_chartData.data,
            }
          : p_chartData.type === "pie"
          ? {
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie",
                backgroundColor: "#212934",
              },
              title: {
                text: p_chartData.xTitle,
                title: "",
              },
              tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
                shared: true,
                useHTML: true,
              },
              legend: {
                backgroundColor: "transparent",
                itemStyle: {
                  color: "#dad7d7",
                  fontSize: "12px",
                  fontWeight: "300",
                },
                itemHoverStyle: {
                  color: "#dad7d7",
                },
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: "pointer",
                  dataLabels: {
                    enabled: p_chartData.dataLable
                      ? p_chartData.dataLable
                      : false,
                    format:
                      "<b>{point.name}</b>: <br/> {point.percentage:.1f} %",
                    style: {
                      width: "100px",
                    },
                  },
                  showInLegend: false,
                },
              },
              exporting: {
                enabled: false,
                allowHTML: true,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    pie: {
                      dataLabels: {
                        enabled: true,
                      },
                    },
                  },
                  title: {
                    useHTML: true,
                    text: "",
                    style: {
                      color: "#dad7d7",
                    },
                  },
                },
              },
              credits: {
                enabled: false,
              },
              series: p_chartData.data,
              labels: p_chartData.labels,
            }
          : {
              chart: {
                type:
                  p_chartData.type === "stacked" ? "column" : p_chartData.type,
                zoomType: "x",
                events: {},
                backgroundColor: "#212934",
              },
              title: {
                text: "",
                title: "",
              },
              xAxis: {
                lineColor: "#302f52",
                categories: p_chartData.categories,
                crosshair: true,
                title: {
                  text: p_chartData.xTitle,
                  style: {
                    color: "#d6d6d6 ",
                    fontSize: "10px",
                  },
                },
                labels: {
                  rotation: -45,
                  enabled: true,
                  style: {
                    color: "#dad7d7",
                    fontSize: "10px",
                  },
                },
                max: p_chartData.max || p_chartData.categories.length - 1,
                scrollbar: {
                  enabled: true,
                  width: 100,
                  barBorderRadius: 7,
                  barBorderWidth: 0,
                  buttonBorderWidth: 0,
                  buttonArrowColor: "#2f2e46",
                  buttonBorderRadius: 7,
                  rifleColor: "#98989896",
                  trackBackgroundColor: "#2f2e46",
                  trackBorderWidth: 0,
                  trackBorderColor: "silver",
                  trackBorderRadius: 7,
                  minWidth: 1,
                  barBackgroundColor: "#12122a",
                  buttonBackgroundColor: "#12122a",
                  buttonsEnabled: true,
                },
              },
              yAxis: {
                min: 0,
                title: {
                  text: p_chartData.yTitle,
                  style: {
                    color: "#dad7d7",
                    fontSize: "12px",
                  },
                },
                labels: {
                  style: {
                    color: "#dad7d7",
                  },
                },
                gridLineColor: "#12122a",
                plotLines: [],
              },
              legend: {
                enabled: true,
                backgroundColor: "transparent",
                itemStyle: {
                  color: "#dad7d7",
                  fontSize: "12px",
                  fontWeight: "300",
                },
                itemHoverStyle: {
                  color: "#dad7d7",
                },
              },
              plotOptions:
                p_chartData.type === "stacked"
                  ? {
                      series: {
                        stacking: "normal",
                        dataLabels: {
                          enabled: false,
                        },
                      },
                    }
                  : {
                      series: {
                        connectNulls: true,
                      },
                    },
              exporting: {
                enabled: false,
                allowHTML: true,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true,
                      },
                    },
                  },
                  title: {
                    useHTML: true,
                    text: "",
                    style: {
                      color: "#dad7d7",
                    },
                  },
                  xAxis: [
                    {
                      lineColor: "#302f52",
                      labels: {
                        style: {
                          color: "#dad7d7",
                          fontSize: "10px",
                        },
                      },
                      scrollbar: {
                        enabled: false,
                      },
                    },
                  ],
                  drilldown: {
                    activeAxisLabelStyle: {
                      color: "#dad7d7",
                      textDecoration: "none",
                    },
                  },
                },
              },
              credits: {
                enabled: false,
              },
              tooltip: {
                shared: true,
                useHTML: true,
              },
              series: p_chartData.data,
            };
      //console.log(this.chartdata.title)
      if (this.chartComp == "repotingRate") {
        chartNewData.yAxis.plotLines = [
          {
            color: "#ff0000",
            width: 2,
            value: 80,
            zIndex: 5,
            label: {
              text: "80%",
              align: "right",
              style: {
                color: "black",
                fontWeight: "bold",
              },
            },
          },
        ];
      }
      let _this = this;
      if (this.inDQR) {
        chartNewData.chart.events = {
          ...chartNewData.chart.events,
          load: function () {
            if (this.series.length && this.series[0].data.length) {
              let catLen = this.series[0].data.length - 1;
              if (catLen > 11) {
                this.xAxis[0].setExtremes(catLen - 11, catLen);
              }
            }
          },
          selection: function (e) {
            if (!e.xAxis) {
              // if (_this.setExtreme) {
              let catLen = this.options.series[0].data.length - 1;
              if (catLen > 11) {
                setTimeout(() => {
                  this.xAxis[0].setExtremes(catLen - 11, catLen);
                }, 0);
              }
              // }
              _this.download = false;
            } else {
              _this.download = true;
            }
          },
        };
      }
      let min1 = 0,
        max1 = 0;
      //   console.log(chartNewData.series)
      if (chartNewData.series && chartNewData.series.length > 0) {
        chartNewData.series.forEach((d) => {
          // let innerDataArr = d.data.map(dInner => dInner.y)
          let innerMin = Math.min(...d.data);
          let innerMax = Math.max(...d.data);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
      }

      if (
        chartNewData.chart.type != "pie" &&
        chartNewData.plotOptions &&
        chartNewData.plotOptions.series &&
        chartNewData.plotOptions.series.stacking !== "normal"
      ) {
        chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
        chartNewData.yAxis.max = max1;
      }
      return chartNewData;
    },
    changePlotType(plotValue) {
      this.chartPlotType = plotValue.toLowerCase();
    },
    dataSort(sort) {
      this.sortType = sort;
      let chartOptions = this.chartOptions;
      let aCats = chartOptions.xAxis.categories,
        i,
        aSeries = chartOptions.series,
        nLen = aSeries.length,
        aFinalData = [];
      //console.log({ aCats, aSeries });

      for (i = 0; i < nLen; i++) {
        let nCats = aCats.length,
          j,
          aData = aSeries[i].data;
        let aTemp = [];
        for (j = 0; j < nCats; j++) {
          let sPlace = aCats[j],
            nVal = aData[j] || aData[j] == 0 ? aData[j] : null;
          aTemp.push([sPlace, nVal]);
        }
        aFinalData.push(aTemp);
      }
      let nArrLen = aFinalData.length,
        k;
      for (k = 0; k < nArrLen; k++) {
        if (sort == "0-1") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            return a[1] - b[1];
          });
        } else if (sort == "1-0") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            return b[1] - a[1];
          });
        } else if (sort == "A-Z") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            if (a[0][0] < b[0][0]) {
              return -1;
            }
            if (a[0][0] > b[0][0]) {
              return 1;
            }
            return 0;
          });
        } else if (sort == "Z-A") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            if (b[0][0] < a[0][0]) {
              return -1;
            }
            if (b[0][0] > a[0][0]) {
              return 1;
            }
            return 0;
          });
        } else if (sort == "JAN-DEC") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            let time1 = new Date(a[0]).getTime();
            let time2 = new Date(b[0]).getTime();
            //  a[0] = new Date(a[0]).getTime();
            //   b[0] = new Date(b[0]).getTime();
            if (time1 < time2) {
              return -1;
            }
            if (time1 > time2) {
              return 1;
            }
            return 0;
          });
        } else if (sort == "DEC-JAN") {
          aFinalData[k] = aFinalData[k].sort((a, b) => {
            let time1 = new Date(a[0]).getTime();
            let time2 = new Date(b[0]).getTime();
            //  a[0] = new Date(a[0]).getTime();
            //   b[0] = new Date(b[0]).getTime();
            if (time2 < time1) {
              return -1;
            }
            if (time2 > time1) {
              return 1;
            }
            return 0;
          });
        }
      }

      let nFinalLen = aFinalData.length,
        j,
        bFlag = true,
        aCategories = [],
        aSeriesData = [];
      for (j = 0; j < nFinalLen; j++) {
        let k,
          nkLen = aFinalData[j].length,
          aInnerSer = { name: aSeries[j].name, data: [] };
        for (k = 0; k < nkLen; k++) {
          if (bFlag) {
            aCategories.push(aFinalData[j][k][0]);
          }
          aInnerSer.data.push(aFinalData[j][k][1]);
        }
        bFlag = false;
        aSeriesData.push(aInnerSer);
      }
      this.chartOptions.categories = [];
      this.$nextTick(() => {
        this.chartOptions.xAxis.categories = aCategories;
        this.chartOptions.series = aSeriesData;
        //console.log(this.chartOptions);
      });

      //console.log(this.chartOptions);
      //return { aCategories, aSeriesData };
    },
    showTable(val) {
      this.viewType = val;
    },
    exportChart(type) {
      var chart = this.$refs.inputCharts.chart;
      let max = chart.options.xAxis[0].max
        ? chart.options.xAxis[0].max
        : chart.options.series[0].data.length;
      let catLen = chart.options.series[0].data.length - 1;

      //chart.xAxis[0].setExtremes(0, catLen);
      setTimeout(() => {
        chart.options.xAxis[0].max = max;
        if (max >= 11) {
          chart.xAxis[0].setExtremes(catLen - 11, catLen);
        }
      }, 100);
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
    },
  },
  watch: {
    chartdata(newVal) {
      this.chartOptions = this.reInitilaizeData(newVal);
      this.chartPlotType = "column";
    },
    chartPlotType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
  },
};
</script>
<style scoped lang="scss">
.card-comp-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-holder {
  position: absolute;
  z-index: 10;
  right: 1.25rem;
  width: 100%;
}
.typeDropdown {
  font-size: 0.75rem;
  padding: 2px 25px 2px 5px;
  height: auto;
  margin-top: 4px;
}
.b-table-sticky-header {
  overflow-y: auto;
  max-height: 400px;
}
.fa-custom-sort-date-asc,
.fa-custom-sort-date-desc {
  position: relative;
  width: 35px;
}

.fa-custom-sort-date-asc::before,
.fa-custom-sort-date-desc::before {
  content: "\f175";
  position: relative;
  right: 14px;
}

.fa-custom-sort-date-asc::after,
.fa-custom-sort-date-desc::after {
  position: absolute;
  width: 18px;
  top: 0;
  right: 8px;
  font-size: 0.625rem;
  line-height: 9px;
  font-family: "courier new", monospace;
  font-weight: bold;
}

.fa-custom-sort-date-asc::after {
  content: "JAN\a DEC";
  white-space: pre-line;
}
.fa-custom-sort-date-desc::after {
  content: "DEC\aJAN";
  white-space: pre;
}
</style>
