<template>
  <fullscreen v-model="inputChartsFull" ref="fullscreen" class="fullContainer">
    <div class="position-relative fullContent">
      <loader v-if="showLoader" />
      <div class="card" v-if="chartdata">
        <div
          class="card-header px-2 py-1 text-decoration-none"
          :class="{ 'bg-transparent color-black border': noOptions }"
        >
          <div class="row no-gutters" :class="{ 'text-center': noOptions }">
            <div
              class="col-lg-9 col-md-9 p-t-4px"
              :class="{ 'col-lg-12 col-md-12': noOptions || inputChartsFull }"
            >
              <div class="cardTitleSection text-wrap fs-19-1920">
                <i
                  class="fa fa-info-circle color-white cursor-pointer chart-info mr-2 ml-2"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: chartdata.chartInfo,
                    title: showSource
                      ? cardTitle
                        ? `${cardTitle}: ${chartdata.source}`
                        : `${chartdata.title}: ${chartdata.source}`
                      : cardTitle
                      ? cardTitle
                      : chartdata.title,
                    html: true,
                  }"
                ></i>
                <p class="title_p fs-19-1920 m-0">
                  {{ cardTitle ? cardTitle : chartdata.title
                  }}{{ showSource ? `: ${chartdata.source}` : "" }}
                </p>
              </div>
            </div>
            <div
              class="col-lg-3 col-md-3 position-relative"
              v-if="!noOptions && !inputChartsFull"
            >
              <ChartOptions
                :sorting="sorting"
                @dataSort="dataSort"
                :defaultSort="defaultSort"
                :drillDown="drilldown"
                @showTable="showTable"
                @exportChart="exportChart"
                :cID="chartdata.cid"
                chartKey="inputCharts"
                :trendTable="items"
                @toggleFullscreen="toggleFullscreen"
                :title="
                  showSource
                    ? cardTitle
                      ? `${cardTitle}: ${chartdata.source}`
                      : `${chartdata.title}: ${chartdata.source}`
                    : cardTitle
                    ? cardTitle
                    : chartdata.title
                "
              />
            </div>
          </div>
        </div>
        <div class="row mb-3 mx-0" v-if="!noOptions">
          <div class="col-lg-12 col-md-12">
            <ChartFilters
              :style="{
                visibility:
                  period && !drilldown && viewType == 'chart'
                    ? 'visible'
                    : 'hidden',
              }"
              :cObj="chartOptions"
              :plotOptions="chartTypeOptions"
              :plotType="chartPlotType"
              @changePlotType="changePlotType"
            />
            <!-- <div class="float-right ml-2 dave2d" v-if="!drilldown && viewType == 'chart' && aggregate && chartdata.agreData">
						<b-form-select class="typeDropdown" v-model="calsType" :options="calTypeOptions"></b-form-select>
					</div> -->
          </div>
        </div>
        <div class="card-body pb-0 h-410px">
          <template v-if="chartOptions && viewType == 'chart'">
            <highcharts
              v-if="chartOptions.series && chartOptions.series.length"
              :options="chartOptions"
              ref="inputCharts"
              :redraw="true"
            ></highcharts>
            <div class="text-center no-data" v-else>
              {{ $t("no_data_to_display") }}
            </div>
          </template>
          <div class="row" v-else>
            <div class="col-12">
              <b-table
                hover
                :items="items"
                :fields="fields"
                head-variant="light"
                sticky-header
                :bordered="true"
                style="max-height: 400px !important"
                :sort-compare="sortDate"
              ></b-table>
            </div>
          </div>
        </div>
        <div class="card-footer text-right" v-if="!bShowIcons">
          <!-- <p class="m-0">Source: <span>{{chartdata.source}}</span></p> -->
          <p class="m-0 source-line">{{ $t("source") }}: <span>DHIS2</span></p>
        </div>
      </div>
    </div>
  </fullscreen>
</template>

<script>
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
  props: [
    "caltype",
    "signOffActive",
    "chartdata",
    "ddOptions",
    "handleFilterChange",
    "bShowIcons",
    "period",
    "filter",
    "methodSelected",
    "cardTitle",
    "yAxis",
    "noOptions",
    "canComment",
    "loggedInUserId",
    "showSource",
    "inMD",
    "defaultSort",
    "sorting",
    "layoutChanged",
    "aggregate",
    "chartName",
    "setExtreme",
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
  data() {
    return {
      methodFilter: this.filter,
      //selected: this.methodSelected,
      selected: this.methodSelected,
      options: this.chartdata.filter,

      chartOptions: {},
      chartPlotType: "column",
      // chartTypeOptions: [
      //   {
      //     value: "column",
      //     text: this.$i18n.t("column"),
      //   },
      //   {
      //     value: "area",
      //     text: this.$i18n.t("area"),
      //   },
      // ],
      chartTypeOptions: [],
      calsType: this.caltype,
      calTypeOptions: [
        {
          value: "aggregate",
          text: this.$i18n.t("method_aggregate"),
        },
        {
          value: "method",
          text: this.$i18n.t("method_detial"),
        },
      ],
      viewType: "chart",
      fields: [],
      items: [],
      exportData: [],
      newFields: [],
      cID: "",
      showLoader: false,
      yMax: "",
      drilldown: false,
      download: false,
      cData: "",
      inputChartsFull: false,
    };
  },
  computed: {},
  watch: {
    caltype(newVal) {
      this.calsType = newVal;
    },
    chartdata(newVal) {
      this.chartOptions = this.reInitilaizeData(newVal);
    },
    chartPlotType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
    calsType(newValue) {
      this.chartOptions.series = [];
      this.chartOptions.tableData = [];
      this.items = [];
      this.fields = [];
      this.$nextTick(() => {
        if (newValue == "method" && this.chartName) {
          if (this.chartName == "monthSpecific") {
            // this.chartdata.max = this.chartdata.methodCategories.length - 1
            this.chartdata.categories = this.chartdata.methodCategories;
          }
          this.chartOptions = this.reInitilaizeData(this.chartdata);
          // this.chartdata.data = this.chartdata.methodData
          // this.chartdata.tableData = this.chartdata.methodTableData
        } else if (newValue == "aggregate" && this.chartName) {
          if (this.chartName == "monthSpecific") {
            // this.chartdata.max = this.chartdata.agreCategories.length - 1
            // this.chartdata.categories = this.chartdata.agreCategories;
            this.chartOptions = this.reInitilaizeData(
              this.chartdata,
              "agreData",
              "agreTableData",
              "agreCategories"
            );
          }
          // this.chartdata.data = this.chartdata.agreData
          // this.chartdata.tableData = this.chartdata.agreTableData
          else {
            this.chartOptions = this.reInitilaizeData(
              this.chartdata,
              "agreData",
              "agreTableData"
              // "agreCategories"
            );
          }
          // "agreCategories"
        }
      });

      if (this.chartName == "monthSpecific") {
        // var chart = this.$refs.inputCharts.chart;
        // let max = chart.options.xAxis[0].max;
        // let catLen = chart.options.series[0].data.length - 1;
        // chart.options.xAxis[0].max = null
        // chart.options.xAxis[0].min = 0
        // if (catLen > 11 && this.setExtreme && this.calsType === "method") {
        //   chart.xAxis[0].setExtremes(0, catLen);
        // }
        // this.$refs.inputCharts.chart.redraw();
        //  var chart = this.$refs.inputCharts.chart;
        //   let max = chart.options.xAxis[0].max;
        //   let catLen = chart.options.series[0].data.length - 1;
        //   if (catLen > 11) {
        //     chart.xAxis[0].setExtremes(0, catLen);
        //   }
      }
    },
    methodSelected(newV) {
      this.selected = newV;
    },
    selected() {
      this.items = [];
      this.chartOptions = this.reInitilaizeData(this.chartdata);
    },
    layoutChanged() {
      let ser = this.chartOptions.series;
      this.showLoader = true;
      this.chartOptions.series = [];
      setTimeout(() => {
        this.chartOptions.series = ser;
        this.showLoader = false;
      }, 100);
    },
  },
  methods: {
    changePlotType(plotValue) {
      this.chartPlotType = plotValue.toLowerCase();
    },
    errorAlert() {
      this.sweetAlert({
        title: this.$i18n.t("error"),
      });
    },
    sortDate(a, b, key) {
      if (key !== "Period") {
        // `key` is not the field that is a date.
        // Let b-table handle the sorting for other columns
        // returning null or false will tell b-table to fall back to it's
        // internal sort compare routine for fields keys other than `myDateField`
        return null; // or false
      }
      let aDate = this.$moment(a[key], "MMM YYYY");
      let bDate = this.$moment(b[key], "MMM YYYY");
      if (aDate.isValid && bDate.isValid) {
        if (aDate < bDate) {
          return -1;
        } else if (aDate > bDate) {
          return 1;
        } else {
          return 0;
        }
      }
      return null;
    },
    fullScreen() {
      this.cData = JSON.parse(JSON.stringify(this.chartOptions));
      this.cData.xAxis.max = null;
      let _this = this;
      this.cData.chart.events = {
        drillup: function (e) {
          this.yAxis[0].options.min = 0;
          // this.yAxis[0].options.max = _this.yMax
          this.xAxis[0].options.max = null;
          this.options.chart.zoomType = "x";
        },
        drilldown: function (e) {
          this.yAxis[0].options.min = null;
          this.yAxis[0].options.max = null;
          this.xAxis[0].options.max = null;
          this.options.chart.zoomType = "";
          e.target.options.plotOptions = {
            ...e.target.options.plotOptions,
            series: {
              ...e.target.options.plotOptions.series,
              cursor: "",
            },
          };
        },
      };
      let isDrilldown =
        this.cData.drilldown && this.cData.drilldown.series.length > 0
          ? true
          : false;

      if (this.cData.plotOptions) {
        this.cData.plotOptions = {
          series: {
            ...this.cData.plotOptions.series,
            events: {
              legendItemClick: function () {},
            },
            showInLegend: true,
            cursor: isDrilldown ? "pointer" : "",
          },
        };
      }
    },
    reInitilaizeData(
      p_chartData,
      dataKey = "data",
      dataTableKey = "tableData",
      categories = "categories"
    ) {
      if (p_chartData.cid) {
        this.cID = p_chartData.cid;
      }
      let aData = p_chartData[dataKey],
        drilldown = p_chartData.drilldown
          ? {
              ...p_chartData.drilldown,
              drillUpButton: {
                position: {
                  align: "left",
                  x: 0,
                  y: 0,
                },
              },
            }
          : { series: [] },
        tableData = p_chartData[dataTableKey];
      if (this.filter) {
        aData = aData.filter((ele) => {
          if (ele["name"]) {
            return ele["name"].indexOf(this.selected) > -1;
          }
        });
        tableData = tableData.filter((ele) => {
          if (ele["trans_name"]) {
            return ele["trans_name"].indexOf(this.selected) > -1;
          } else {
            return ele["name"].indexOf(this.selected) > -1;
          }
        });

        if (tableData[0]) {
          this.newFields = [];
          this.exportData = tableData[0]["data"];
          tableData[0]["data"].forEach((key) => {
            Object.keys(key).forEach((field) => {
              if (this.newFields.indexOf(field) == -1) {
                this.newFields.push(field);
                if (
                  field == this.$i18n.t("period") ||
                  field == this.$i18n.t("value")
                ) {
                  this.fields.push({ key: field, sortable: true });
                } else {
                  this.fields.push(field);
                }
              }
            });
            this.items.push(key);
          });
        }

        // if(p_chartData.title == 'New vs Continuing Users'){
        //     aData.forEach((ele,ind) => {
        //         if(ele.type === 'line'){
        //             ele['yAxis'] = 1;
        //         }
        //     })
        // }
      } else {
        if (tableData != undefined && tableData[0]) {
          this.newFields = [];
          if (tableData[0] != undefined) {
            this.exportData = tableData[0]["data"];
            tableData[0]["data"].forEach((key) => {
              Object.keys(key).forEach((field) => {
                if (this.newFields.indexOf(field) == -1) {
                  this.newFields.push(field);
                  if (
                    field == this.$i18n.t("period") ||
                    field == this.$i18n.t("location") ||
                    field == this.$i18n.t("value")
                  ) {
                    this.fields.push({ key: field, sortable: true });
                  } else {
                    this.fields.push(field);
                  }
                }
              });
              this.items.push(key);
            });
          }
        }
      }
      let maxLen = null;
      if (
        aData.length > 0 &&
        aData[0] != undefined &&
        aData[0].data.length > 11
      ) {
        maxLen = p_chartData.max ? p_chartData.max : 11;
      } else if (aData.length > 0 && aData[0] != undefined) {
        maxLen = aData[0].data.length - 1;
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
                // categories: p_chartData.categories,
                lineColor: "#302f52",
                max: maxLen,
                labels: {
                  rotation: -45,
                  enabled: true,
                  style: {
                    color: "#dad7d7",
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
                min: 0,
                title: {
                  text: p_chartData.yTitle,
                  style: {
                    color: "#d6d6d6 ",
                    fontSize: "10px",
                  },
                },
                labels: {
                  style: {
                    color: "#dad7d7",
                  },
                },
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
              series: aData,
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
                    enabled: false,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                  },
                  showInLegend: true,
                },
              },
              exporting: {
                enabled: false,
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
                },
              },
              credits: {
                enabled: false,
              },
              series: aData,
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
                // categories: p_chartData.categories,
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
                max: maxLen,
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
                // stackLabels: {
                //     style: {
                //         color: 'black'
                //     },
                //     enabled: true,
                //     y: -10,
                //     format: '{total}%'
                // },
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
                      column: {
                        stacking: "normal",
                        dataLabels: {
                          enabled: false,
                        },
                      },
                    }
                  : {
                      series: {
                        stacking: "",
                        // pointWidth: 20,
                      },
                    },
              exporting: {
                enabled: false,
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
              series: aData,
            };

      if (drilldown.series.length) {
        chartNewData.drilldown = drilldown;
        chartNewData.xAxis.type = "category";

        chartNewData.plotOptions = {
          series: {
            ...chartNewData.plotOptions.series,
            cursor: "pointer",
          },
        };
      }

      if (!this.inMD) {
        chartNewData.xAxis.categories = p_chartData[categories];
      } else {
        chartNewData.xAxis.type = "category";
      }

      let _this = this;
      //if(this.chartdata.title != 'Month EMU by Method'){
      if (this.inMD) {
        chartNewData.chart.events = {
          ...chartNewData.chart.events,
          load: function () {
            if (
              this.series.length &&
              this.series[0].data.length &&
              _this.setExtreme
            ) {
              let catLen = this.series[0].data.length - 1;
              if (catLen > 11) {
                this.xAxis[0].setExtremes(catLen - 11, catLen);
              }
            }
          },
          selection: function (e) {
            if (!e.xAxis) {
              if (_this.setExtreme) {
                let catLen = this.options.series[0].data.length - 1;
                if (catLen > 11) {
                  setTimeout(() => {
                    this.xAxis[0].setExtremes(catLen - 11, catLen);
                  }, 0);
                }
              }
              _this.download = false;
            } else {
              _this.download = true;
            }
          },
          drillup: function (e) {
            _this.drilldown = false;
            // this.yAxis[0].options.min = 0;
            // this.yAxis[0].options.max = this.yMax;
            this.xAxis[0].options.max = p_chartData.max;
            this.options.chart.zoomType = "x";
            this.yAxis[0].update({
              min: 0,
              max: this.ymax,
            });
            this.yAxis[0].setTitle({
              text: _this.$i18n.t("EMU") + " (%)",
            });
            delete e.target.options.plotOptions.point;
          },
          drilldown: function (e) {
            _this.drilldown = true;
            this.xAxis[0].options.max =
              e.seriesOptions.data.length - 1 > 11
                ? 11
                : e.seriesOptions.data.length - 1;
            this.yAxis[0].update({
              min: null,
              max: null,
            });
            this.yAxis[0].setTitle({
              text:
                _this.$i18n.t("changeIn") + " " + _this.$i18n.t("EMU") + " (%)",
            });

            this.options.chart.zoomType = "";
            e.target.options.plotOptions = {
              ...e.target.options.plotOptions,
              series: {
                ...e.target.options.plotOptions.series,
                point: {
                  events: {
                    click: function () {
                      if (this.series) {
                        _this.changeLocation(this.locationID);
                      }
                    },
                  },
                },
              },
            };
          },
        };
        let min1 = 0,
          max1 = 0;
        chartNewData.series.forEach((d) => {
          let innerDataArr = this.inMD
            ? d.data.map((dInner) => dInner.y)
            : d.data;
          let innerMin = Math.min(...innerDataArr);
          let innerMax = Math.max(...innerDataArr);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
        if (
          chartNewData.plotOptions &&
          chartNewData.plotOptions.series &&
          chartNewData.plotOptions.series.stacking !== "normal"
        ) {
          chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
          chartNewData.yAxis.max = max1;
          this.yMax = max1;
        }
      } else {
        let min1 = 0,
          max1 = 0;
        chartNewData.series.forEach((d) => {
          let innerDataArr = this.inMD
            ? d.data.map((dInner) => dInner.y)
            : d.data;
          let innerMin = Math.min(...innerDataArr);
          let innerMax = Math.max(...innerDataArr);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
        if (
          chartNewData.plotOptions &&
          chartNewData.plotOptions.series &&
          chartNewData.plotOptions.series.stacking !== "normal"
        ) {
          chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
          chartNewData.yAxis.max = max1;
          this.yMax = max1;
        }

        chartNewData.chart.events = {
          ...chartNewData.chart.events,
          load: function () {
            if (
              this.series.length &&
              this.series[0].data.length &&
              this.series[0].data.length > 11
            ) {
              let catLen = this.series[0].data.length - 1;
              if (catLen > 11) {
                if (_this.chartName === "monthSpecific") {
                  if (_this.calsType === "method") {
                    this.xAxis[0].setExtremes(catLen - 11, catLen);
                  }
                } else {
                  this.xAxis[0].setExtremes(catLen - 11, catLen);
                }
              }
            }
          },
          selection: function (e) {
            if (!e.xAxis) {
              if (this.series[0].data.length > 11) {
                let catLen = this.options.series[0].data.length - 1;
                setTimeout(() => {
                  this.xAxis[0].setExtremes(catLen - 11, catLen);
                }, 0);
              }
              _this.download = false;
            } else {
              _this.download = true;
            }
          },
        };
      }
      return chartNewData;
    },
    changeLocation(locationID) {
      this.drilldown = false;
      this.$emit("drilldownLocation", locationID);
    },
    updateChartData() {
      this.items = [];
      this.chartOptions = this.reInitilaizeData(this.chartdata);
    },
    dataSort(sort) {
      if (this.inMD) {
        this.chartOptions.series.map((d) => ({
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
      } else {
        // let aTemp = this.chartdata.categories;
        // if (aTemp.length > 1) {
        //   let aDate = null,
        //     bDate = null;

        //   if (sort == "JAN-DEC" || sort == "DEC-JAN") {
        //     aDate = this.$moment(aTemp[0], "MMM YYYY").format("MMYYYY");
        //     bDate = this.$moment(aTemp[1], "MMM YYYY").format("MMYYYY");
        //   } else {
        //     aDate = aTemp[0];
        //     bDate = aTemp[1];
        //   }
        //   // let aDate = this.$moment(aTemp[0], "MMM YYYY").format("MMYYYY")
        //   if (
        //     (aDate < bDate && (sort == "DEC-JAN" || sort == "Z-A")) ||
        //     (aDate > bDate && (sort == "JAN-DEC" || sort == "A-Z"))
        //   ) {
        //     let i,
        //       aData = this.chartdata.data,
        //       nLen = aData.length;
        //     for (i = 0; i < nLen; i++) {
        //       aData[i].data.reverse();
        //     }
        //     aTemp.reverse();
        //   }
        // }
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
      }
    },
    showTable(val) {
      this.viewType = val;
    },
    exportChart(type) {
      var chart = this.$refs.inputCharts.chart;
      let max = chart.options.xAxis[0].max,
        yMin = chart.yAxis[0].min,
        yMax = chart.yAxis[0].max;
      let catLen = chart.options.series[0].data.length - 1;
      if (!this.drilldown) {
        chart.options.xAxis[0].max = null;
        chart.options.xAxis[0].min = 0;
        if (catLen > 11 && this.setExtreme) {
          chart.xAxis[0].setExtremes(0, catLen);
        }
      } else {
        chart.yAxis[0].setExtremes(yMin, yMax);
      }
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
        if (!this.drilldown) {
          chart.options.xAxis[0].max = max;
          if (catLen > 11 && this.setExtreme) {
            chart.xAxis[0].setExtremes(catLen - 11, catLen);
          }
        }
      }, 100);
    },
  },
  mounted() {
    if (this.yAxis) {
      this.chartdata.yTitle = this.yAxis;
    }
    if (this.calsType == "aggregate" && this.chartName) {
      this.chartOptions = this.reInitilaizeData(
        this.chartdata,
        "agreData",
        "agreTableData"
      );
      // ("agreCategories");
    } else {
      this.chartOptions = this.reInitilaizeData(this.chartdata);
    }
  },
};
</script>
<style scoped lang="scss">
.no-data {
  height: 410px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
