<template>
  <div class="mdgridviewpage-bg link-module">
    <div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
      <a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
    </div>
    <div id="page-content-wrapper">
      <Header
        :headerConditions="{
          home: true,
          profile: false,
          pageTitle: true,
          dashboardLogo: true,
        }"
        @langChange="langChange"
        :pageHeader="dynamicModule ? dynamicModule.moduleName : ''"
        @activateTour="activateTour"
      >
        <template v-slot:admin>
          <button
            type="button"
            class="btn btn-primary black-btn"
            @click.prevent.stop="exportPPT"
            style="border: 2px solid #fff"
          >
          <span class="">
            <img
              :src="require('@/assets/images/icons/generateReport.svg')"
              class="img-fluid mt-xl-n1"
            /> </span
          > <span class="mx-1"> {{ $t("exportbtn") }} </span>
          </button>
        </template>
      </Header>
    </div>
    <div
      class="row mx-0 dynamic-modules-section"
      v-if="dynamicModule && dynamicModule.moduleElements"
    >
      <div class="col-12" style="padding: 0 30px">
        <gridLayout
          :lowerOrg="lowerOrg"
          :excludedHeight="120"
          :alertData="alertData"
          :isDynamicModule="true"
          :updatedGridLayout="{
            isResizable: false,
            isDraggable: false,
          }"
          :sendFilters="sendFilters"
          configKey="moduleElements"
          @setExportArr="setExportArr"
          :layout.sync="dynamicModule"
        />
      </div>
    </div>
    <toolbarComponent
      @location="getLocation"
      :globalPeriodData="globalPeriodData"
      @closeToolbar="closeToolbar"
      :showToolbarOnTablet="showToolbarOnTablet"
      @lowerOrg="getIsLowerOrg"
      v-if="globalPeriodData"
    />
  </div>
</template>

<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import toolbarComponent from "@/components/DynamicModule/ToolbarComponent";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    toolbarComponent,
    gridLayout: () =>
      import(
        /*webpackChunkName: 'GridLayoutComponent'*/ "@/components/ReportTemplate/GridLayoutComponent"
      ),
  },
  mixins: [LanguageChangeMixin, EmitTourCallbackMixin],
  data() {
    return {
      dynamicModule: null,
      showToolbarOnTablet: false,
      globalPeriodData: null,
      sendLocation: null,
      sendFilters: null,
      lowerOrg: null,
      exportArr: [],
      locationList: [],
      alertData: [],
    };
  },
  methods: {
    flattenLocationList(array) {
      var result = [];
      array.forEach((a) => {
        result.push(a);
        if (Array.isArray(a.children)) {
          let children = a.children.map((c) => ({
            ...c,
            parentID: a.id,
          }));
          result = result.concat(this.flattenLocationList(children));
        }
      });
      return result;
    },
    async exportPPT() {
      let location = [],
        period = [];
      if (this.locationList.length > 0) {
        let flatLocations = await this.flattenLocationList(this.locationList);
        if (this.sendFilters && this.sendFilters.location) {
          flatLocations.forEach((l) => {
            if (this.sendFilters.location.includes(l.id.split("/")[1])) {
              location.push(l.label);
            }
          });
        } else {
          location.push(this.$i8n.t("defLoc"));
        }

        if (this.sendFilters && this.sendFilters.period) {
          this.sendFilters.period.forEach((p) => {
            period.push(p.split("April")[0]);
          });
        } else {
          period.push(this.$i18n.t("defPer"));
        }
      } else {
        location.push(this.$i8n.t("defLoc"));
        period.push(this.$i18n.t("defPer"));
      }
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<div><input id="fileName" class="swal2-input" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="' +
          this.dynamicModule.moduleName +
          '"/></div>' +
          '<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">' +
          this.$i18n.t("legends") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">' +
          this.$i18n.t("values") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">' +
          this.$i18n.t("x_axis") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">' +
          this.$i18n.t("y_axis") +
          "</label></div></div>",
        focusConfirm: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
        preConfirm: () => {
          return [
            document.getElementById("fileName").value,
            document.getElementById("showLegends").checked
              ? document.getElementById("showLegends").value
              : "",
            document.getElementById("showValues").checked
              ? document.getElementById("showValues").value
              : "",
            document.getElementById("showXAxis").checked
              ? document.getElementById("showXAxis").value
              : "",
            document.getElementById("showYAxis").checked
              ? document.getElementById("showYAxis").value
              : "",
          ];
        },
      });

      if (formValues) {
        import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
          (pptxgen) => {
            let pptx = new pptxgen.default();
            pptx.layout = "LAYOUT_WIDE";
            pptx.author = "Avenir Generic Tool";
            pptx.company = "Dure Technologies";
            pptx.subject = this.dynamicModule.moduleName;
            pptx.title = this.dynamicModule.moduleName;

            pptx.defineSlideMaster({
              title: "MASTER_SLIDE",
              background: { color: "FFFFFF" },
              objects: [
                {
                  text: {
                    text: this.dynamicModule.moduleName,
                    options: {
                      y: "2%",
                      fontSize: 30,
                      align: "center",
                      w: "100%",
                      underline: true,
                    },
                  },
                },
                {
                  line: {
                    align: "center",
                    x: 4.2,
                    y: "90%",
                    w: 5,
                    h: 0,
                    line: "0088CC",
                    lineSize: 1,
                  },
                },
                {
                  line: {
                    align: "center",
                    x: 5.2,
                    y: "91%",
                    w: 3,
                    h: 0,
                    line: "0088CC",
                    lineSize: 1,
                  },
                },
                {
                  text: {
                    text:
                      this.$i18n.t("location") + " :- " + location.join(", "),
                    options: {
                      x: 0.5,
                      y: "95%",
                      w: "60%",
                      bold: true,
                      fontSize: 12,
                    },
                  },
                },
                {
                  text: {
                    text: this.$i18n.t("period") + " :- " + period.join(", "),
                    options: {
                      x: 0.5,
                      y: "98%",
                      w: "60%",
                      bold: true,
                      fontSize: 12,
                    },
                  },
                },
                {
                  text: {
                    text: this.$moment(new Date()).format("llll"),
                    options: {
                      x: 8.5,
                      y: "98%",
                      w: "30%",
                      align: "right",
                      fontSize: 12,
                      bold: true,
                    },
                  },
                },
              ],
              // slideNumber: { x:0.5, y:'1%'}
            });

            let slide = pptx.addSlide("MASTER_SLIDE");
            let exportArr = [];
            exportArr = this.exportArr;
            if (exportArr && exportArr.length) {
              let reA = /[^a-zA-Z]/g;
              let reN = /[^0-9]/g;

              exportArr.sort((a, b) => {
                let aA = a.cardKey.replace(reA, ""),
                  bA = b.cardKey.replace(reA, "");
                if (aA === bA) {
                  let aN = parseInt(a.cardKey.replace(reN, ""), 10);
                  let bN = parseInt(b.cardKey.replace(reN, ""), 10);
                  return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                  return aA > bA ? 1 : -1;
                }
              });

              for (let index = 0; index < exportArr.length; index++) {
                const element = exportArr[index];
                slide = pptx.addSlide("MASTER_SLIDE");
                slide.addText(element.title.title, {
                  x: 0.5,
                  y: 0.6,
                  w: "90%",
                  fontSize: 18,
                  bold: true,
                  underline: true,
                  breakLine: true,
                });

                let options = {
                  x: 0.5,
                  y: 1,
                  w: "90%",
                  h: "75%",
                  showValue: formValues[2] === "show" ? true : false,
                  showLegend: formValues[1] === "show" ? true : false,
                  legendPos: "b",
                  barGapWidthPct: 50,
                  showCatAxisTitle:
                    formValues[3] !== "show"
                      ? false
                      : element.xAxis &&
                        element.xAxis.title &&
                        element.xAxis.title.text
                      ? true
                      : false,
                  catAxisTitle:
                    element.xAxis &&
                    element.xAxis.title &&
                    element.xAxis.title.text
                      ? element.xAxis.title.text
                      : "",
                  showValAxisTitle:
                    formValues[4] !== "show"
                      ? false
                      : element.yAxis &&
                        element.yAxis.title &&
                        element.yAxis.title.text
                      ? true
                      : false,
                  valAxisTitle:
                    element.yAxis &&
                    element.yAxis.title &&
                    element.yAxis.title.text
                      ? element.yAxis.title.text
                      : "",
                };

                let type = element.chart.type;
                let isStacked = false;
                if (
                  element.plotOptions &&
                  (element.plotOptions[element.chart.type] ||
                    element.plotOptions.series)
                ) {
                  if (
                    element.plotOptions[element.chart.type] &&
                    typeof element.plotOptions[element.chart.type].stacking !==
                      "undefined"
                  ) {
                    if (
                      element.plotOptions[element.chart.type].stacking ===
                      "normal"
                    ) {
                      isStacked = true;
                    }
                  }
                  if (
                    element.plotOptions.series &&
                    typeof element.plotOptions.series.stacking !== "undefined"
                  ) {
                    if (element.plotOptions.series.stacking === "normal") {
                      isStacked = true;
                    }
                  }
                }

                if (element.isDualAxes) {
                  let primarySeries = [],
                    linkedSeries = [],
                    linkedByStack = {};
                  element.series.forEach((s) => {
                    if (typeof s.linkedTo === "undefined") {
                      primarySeries.push(s);
                    } else {
                      linkedSeries.push(s);
                    }
                  });

                  linkedSeries.forEach((l) => {
                    if (linkedByStack[l.stack]) {
                      linkedByStack[l.stack].push(l);
                    } else {
                      linkedByStack[l.stack] = [l];
                    }
                  });
                  let primaryChartData = [],
                    primaryChartColors = [];

                  primarySeries.forEach((e) => {
                    if (e.color) {
                      primaryChartColors.push(e.color.split("#")[1]);
                    } else {
                      primaryChartColors.push(
                        (0xffffffff - Math.random() * 0xffffffff)
                          .toString(16)
                          .substr(0, 6)
                      );
                    }
                    let name = `${e.name} (${e.stack})`,
                      labels = [],
                      values = [];
                    if (e.data && e.data.length) {
                      e.data.forEach((ed) => {
                        let y = ed.y !== null ? ed.y : 0;
                        labels.push(ed.name);
                        values.push(y);
                      });
                    }
                    primaryChartData.push({
                      name,
                      labels,
                      values,
                    });
                  });

                  let chartTypes = [
                    {
                      type:
                        type == "line"
                          ? pptx.ChartType.line
                          : type == "area"
                          ? pptx.ChartType.area
                          : pptx.charts.BAR,
                      data: primaryChartData,
                      options: {
                        barGrouping: isStacked ? "standard" : "standard",
                        chartColors: primaryChartColors,
                      },
                    },
                  ];

                  Object.keys(linkedByStack).forEach((s) => {
                    let linkedChartColors = [],
                      linkedChartData = [];

                    linkedByStack[s].forEach((e) => {
                      if (e.color) {
                        linkedChartColors.push(e.color.split("#")[1]);
                      } else {
                        linkedChartColors.push(
                          (0xffffffff - Math.random() * 0xffffffff)
                            .toString(16)
                            .substr(0, 6)
                        );
                      }
                      let name = `${e.name} (${e.stack})`,
                        labels = [],
                        values = [];
                      if (e.data && e.data.length) {
                        e.data.forEach((ed) => {
                          let y = ed.y !== null ? ed.y : 0;
                          labels.push(ed.name);
                          values.push(y);
                        });
                      }
                      linkedChartData.push({
                        name,
                        labels,
                        values,
                      });
                    });

                    chartTypes.push({
                      type:
                        type == "line"
                          ? pptx.ChartType.line
                          : type == "area"
                          ? pptx.ChartType.area
                          : pptx.charts.BAR,
                      data: linkedChartData,
                      options: {
                        barGrouping: isStacked ? "standard" : "standard",
                        chartColors: linkedChartColors,
                        showLegend: false,
                      },
                    });
                  });
                  slide.addChart(chartTypes, options);
                } else {
                  let chartData = [],
                    chartColors = [];
                  element.series.forEach((e) => {
                    if (e.color) {
                      chartColors.push(e.color.split("#")[1]);
                    } else {
                      chartColors.push(
                        ((Math.random() * 0xffffff) << 0).toString(16)
                      );
                    }

                    let name = e.name,
                      labels = [],
                      values = [];
                    if (e.data && e.data.length) {
                      e.data.forEach((ed) => {
                        labels.push(ed.name);
                        values.push(ed.y);
                      });
                    }
                    chartData.push({
                      name:
                        typeof e.stack !== "undefined" && e.stack !== ""
                          ? `${name} (${e.stack})`
                          : name,
                      labels: labels,
                      values: values,
                    });
                  });

                  options.chartColors = chartColors;

                  if (type == "line") {
                    type = pptx.ChartType.line;
                  } else if (type == "area") {
                    type = pptx.ChartType.area;
                  } else {
                    type = pptx.ChartType.bar;
                    options["barDir"] = "col";
                    options["barGrouping"] = isStacked ? "stacked" : "standard";
                  }
                  if (chartData.length > 0) {
                    slide.addChart(type, chartData, options);
                  } else {
                    slide.addText(this.$i18n.t("no_data_to_display"), {
                      x: 0.5,
                      y: "50%",
                      w: "90%",
                      fontSize: 18,
                      bold: true,
                      breakLine: true,
                      align: "center",
                    });
                  }
                }
              }
            }
            pptx.writeFile(formValues[0]);
            console.log("File exported...");
          }
        );
      }
    },
    setExportArr(obj) {
      let findIndex = this.exportArr.findIndex(
        (e) => e.chartID === obj.chartID
      );
      if (findIndex >= 0) {
        this.exportArr[findIndex] = obj;
      } else {
        this.exportArr.push(obj);
      }
    },
    getIsLowerOrg(lowerOrg) {
      this.lowerOrg = lowerOrg;
    },
    getLocation(period, periodType, location, locationList) {
      this.sendFilters = {
        location: location,
        periodType: periodType,
        period: period.sort(),
      };
      this.locationList = locationList;
      if (period) {
        // this.goto('topDiv')
        // this.setLocationPeriod(period, location, locationList)
      }
    },
    setLocationPeriod(period, location) {
      this.sendLocation = location;
    },
    closeToolbar() {
      this.showToolbarOnTablet = false;
    },
    getAlertsData() {
      let key = this.generateKey("dynamicModules"),
        key2 = this.generateKey("alertRules");

      service
        .getSavedConfig(key2, false, "", true)
        .then((response) => {
          this.alertData = response.data;
        })
        .then(() => {
          this.getDynamicModule(key);
        })
        .catch(() => {
          console.log("No alerts defined for this application...");
          this.getDynamicModule(key);
        });
    },
    getDynamicModule(key) {
      let response = service.getSavedConfig(key, false, "", true);
      response
        .then((response) => {
          let data = response.data.find(
            (dM) => dM.id === this.$route.query.moduleId
          );
          this.dynamicModule = {
            ...data,
          };
          document.title = this.dynamicModule.moduleName;
          this.$store.state.loading = false;
        })
        .catch(() => {
          this.$store.state.loading = false;
          console.log("Failed to fetch the dynamic module...");
        });
    },
  },
  created() {
    this.$store.state.loading = true;
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
    this.getAlertsData();
  },
};
</script>

<style lang="scss" scoped>
.mdgridviewpage-bg {
  background-size: cover;
  background-position: center;
  min-height: calc(100vh - 65px);
  padding: 0 0 50px 0;
 // background-color: #3471ce;
  overflow: hidden;
}
.dashboardchart-container {
  height: calc(100vh - 145px);
  padding: 20px 40px;
  overflow: hidden;
  overflow-y: scroll;
}
</style>