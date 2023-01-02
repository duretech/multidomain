  <template>
  <div class="tab-content" id="benchmarking-sub-tabContent">
    <div
      class="tab-pane fade"
      :class="[activeTab === 'total' ? 'show active' : '']"
      id="benchmarking-comclient"
      role="tabpanel"
      aria-labelledby="benchmarking-comclient-tab"
    >
      <div class="row">
        <div
          class="col-12"
          v-if="
            !chartOptions[0].disableChart &&
            locationName &&
            oComparingEMURegConf &&
            oComparingEMURegConf.series.length > 0
          "
        >
          <chartTableToggleComp
            :title="chartOptions[0].chartName"
            :chartData="oComparingEMURegConf"
            source="DHIS 2"
            chartRef="oComparingEMURegConf"
            sortMenu="type2"
            :chartInfo="chartOptions[0].chartInfo"
            :cid="chartOptions[0].cid"
            :excludeHigherRegion="exclude"
            :excludeSeries="true"
            :higherRegionName="locationName"
            :originalData="oComparingEMURegConfOriginalData"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>

        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[1].disableChart &&
            oEMUTrend &&
            oEMUTrend.series.length > 0
          "
        >
          <chartTableToggleComp
            :title="chartOptions[1].chartName"
            :chartData="oEMUTrend"
            source="DHIS 2"
            chartRef="oEMUTrend"
            sortMenu="type3"
            :chartInfo="chartOptions[1].chartInfo"
            :cid="chartOptions[1].cid"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[2].disableChart &&
            locationName &&
            avgEMUMonthlyGrowth &&
            avgEMUMonthlyGrowth.series.length > 0
          "
        >
          <chartTableToggleComp
            :title="chartOptions[2].chartName"
            :chartData="avgEMUMonthlyGrowth"
            source="DHIS 2"
            chartRef="avgEMUMonthlyGrowth"
            sortMenu="type2"
            :chartInfo="chartOptions[2].chartInfo"
            :cid="chartOptions[2].cid"
            :excludeHigherRegion="exclude"
            :higherRegionName="locationName"
            :originalData="avgEMUMonthlyGrowthOriginalData"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>
      </div>
    </div>
    <div
      class="tab-pane fade"
      :class="[activeTab !== 'total' ? 'show active' : '']"
      id="benchmarking-comfacilities"
      role="tabpanel"
      aria-labelledby="benchmarking-comfacilities-tab"
    >
      <div class="row">
        <div
          class="col-12"
          v-if="
            !chartOptions[3].disableChart &&
            emuMethodMix &&
            emuMethodMix.series.length > 0 &&
            locationName &&
            activeTab !== 'total'
          "
        >
          <chartTableToggleComp
            :title="chartOptions[3].chartName"
            :chartData="emuMethodMix"
            source="DHIS 2"
            chartRef="oMostCommonMethodMix"
            :chartInfo="chartOptions[3].chartInfo"
            :cid="chartOptions[3].cid"
            :excludeHigherRegion="exclude"
            :higherRegionName="locationName"
            :originalData="emuMethodMixOriginalData"
            ref="bubbleChart"
            :period="period"
            :defaultLocationID="defaultLocationID"
            :locationName="locationName"
            :defaultLevelID="defaultLevelID"
            :subLevelID="subLevelID"
            :periodLength="periodLength"
            :mapObj="mapObj"
            :resetCurrentLevel="resetCurrentLevel"
            :locationChanged="locationChanged"
            :toolbarLevelID="toolbarLevelID"
            :toolbarLocationID="toolbarLocationID"
            :facilityLevelID="facilityLevelID"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[4].disableChart &&
            locationName &&
            compMethods &&
            compMethods.series.length > 0
          "
        >
          <chartTableToggleComp
            :title="chartOptions[4].chartName"
            :chartData="compMethods"
            source="DHIS 2"
            chartRef="compMethods"
            :chartInfo="chartOptions[4].chartInfo"
            :cid="chartOptions[4].cid"
            :excludeHigherRegion="exclude"
            :higherRegionName="locationName"
            :originalData="compMethodsOriginalData"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mb-5 mt-4"
          v-if="
            Object.keys(matrixData).length != 0 && !chartOptions[5].disableChart
          "
        >
          <highchartTable
            :data="matrixData"
            :period="period"
            :periodType="periodType"
            :min="-5"
            :max="5"
            :title="chartOptions[5].chartName"
            type="EMU"
            :chartInfo="chartOptions[5].chartInfo"
            :cid="chartOptions[5].cid"
            ref="trendMatrixTable"
            :matrixData="matrixDataBool"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import oChartConfig from "./geographicalchartconfig";
import chartTableToggleComp from "../programPriorities/chartTableToggleComp.vue";
import highchartTable from "./highcharttable";
import geoCalc from "./geoCalc";
import { translateDate } from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
export default {
  props: [
    "rawEMUData",
    "emuModuleData",
    "period",
    "chartOptions",
    "location",
    "defaultLocationID",
    "locationName",
    "dataType",
    "defaultLevelID",
    "subLevelID",
    "periodLength",
    "mapObj",
    "resetCurrentLevel",
    "locationChanged",
    "toolbarLevelID",
    "toolbarLocationID",
    "facilityLevelID",
    "activeTab",
    "periodType",
    "calsType",
    "reportChartData",
  ],
  mixins: [getCIDMixin],
  components: {
    chartTableToggleComp,
    highchartTable,
  },
  watch: {
    calsType(newVal) {
      this.$store.state.loading = true;
      this.exclude = false;
      if (newVal) {
        this.oComparingEMURegConf.series = [];
        this.oEMUTrend.series = [];
        this.avgEMUMonthlyGrowth.series = [];
        this.emuMethodMix.series = [];
        this.compMethods.series = [];
        this.matrixData = {};
        this.$nextTick(() => {
          if (this.periodType === "yearly") {
            this.getPopulation();
          } else {
            this.getMonthlyData();
          }
        });
      }
    },
  },
  data() {
    return {
      oComparingEMURegConf: { ...oChartConfig.comparingEMUChartConfig },
      oComparingEMURegConfOriginalData: null,
      oComparingAnnualEMURegConf: { ...oChartConfig.comparingEMUChartConfig },
      oComparingAnnualEMURegConfOriginalData: null,
      oEMUTrend: { ...oChartConfig.emuTrend },
      avgEMUMonthlyGrowth: { ...oChartConfig.avgEMUMonthlyGrowth },
      avgEMUMonthlyGrowthOriginalData: null,
      emuMethodMix: { ...oChartConfig.emuMethodMix },
      emuMethodMixOriginalData: null,
      compMethods: { ...oChartConfig.avgEMUMethodMix },
      compMethodsOriginalData: null,
      matrixData: {},
      exportArr: [],
      bubbleChartHeader: "",
      trendMatrixTableHeader: "",
      population: null,
      matrixDataBool: false,
      exclude: false,
    };
  },
  methods: {
    async exportPPT(map) {
      this.$store.state.loading = true;
      let bubbleChart = null;
      if (this.$refs.bubbleChart) {
        bubbleChart = await this.$refs.bubbleChart.getScreenShot();
      }
      let trendMatrixTable = await this.$refs.trendMatrixTable.getTableData();
      if (trendMatrixTable.data.length) {
        this.exportArr.push({
          cardKey: "key6",
          title: { title: this.trendMatrixTableHeader },
          min: -5,
          max: 5,
          ...trendMatrixTable,
        });
      }
      this.$store.state.loading = false;
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<div><input id="fileName" class="swal2-input" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="Geograpgical Progress"/></div>' +
          '<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">' +
          this.$i18n.t("legends") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">' +
          this.$i18n.t("values") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">' +
          this.$i18n.t("x-axis") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">' +
          this.$i18n.t("y-axis") +
          "</label></div></div>",
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
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
        let period = translateDate({
          rawDate: this.period,
          periodType: this.periodType,
        });
        geoCalc.exportPPT(
          this.exportArr,
          formValues,
          map,
          {
            cardKey: "key4",
            header: this.bubbleChartHeader,
            screenShot: bubbleChart,
          },
          this.locationName,
          period,
          this.dataType,
          this.$moment
        );
      }
    },
    getCalTypeSeries(methodSeriesObj, categories) {
      let oFinalAgrEMU = {};
      if (this.calsType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];

          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = [];
          }
          for (let j = 0; j < methodSeriesObj[i].length; j++) {
            let sName = methodSeriesObj[i][j].name,
              nIndex = categories.indexOf(sName);
            oFinalAgrEMU[sMethod][nIndex] =
              (oFinalAgrEMU[sMethod][nIndex] || 0) +
              methodSeriesObj[i][j].value;
          }
        }

        // for(let i in methodSeriesObj){
        //     let aSplit = i.split('__'),
        //     sMethod = aSplit[1]
        //     if(sMethod != [this.$i18n.t('IUD')]){
        //         sMethod = this.capitalize(sMethod)
        //     }
        //     if(!oFinalAgrEMU[sMethod]){
        //         oFinalAgrEMU[sMethod] = [];
        //     }
        //     for(let j in methodSeriesObj[i]){
        //         oFinalAgrEMU[sMethod][j] = (oFinalAgrEMU[sMethod][j] || 0) + methodSeriesObj[i][j];
        //         oFinalAgrEMU[sMethod][j] = oFinalAgrEMU[sMethod][j].toFixed(6) * 1
        //     }

        // }
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
    },
    getMonthlyData() {
      this.comparingEMU();
      this.emuTrend();
      this.avgEMUGroth();
      this.comparingMethods();
      this.emuMatrix();
    },
    capitalize(string) {
      return string
        ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
        : "";
    },
    getPopulation() {
      let pe = this.period;
      if (this.periodType === "monthly") {
        pe = this.period.split(" ")[1];
      }
      let key3 = this.generateKey("dqrModule");
      let namespace = this.reportChartData ? this.reportChartData.selectedDashboard : "";
      let alevel = [this.defaultLevelID, this.defaultLevelID + 1];
      service.getSavedConfig(key3, false, namespace).then((dqrModule) => {
        let id =
          dqrModule.data["emu"]["Background_Data"]["backgroundIndicators"][0][
            "subIndicators"
          ][0]["selectedDE"][0]["id"];
        service
          .getIndicatorData(id, alevel, this.defaultLocationID, pe)
          .then((pop) => {
            this.population = pop.data;
            this.comparingEMU();
            this.emuTrend();
            this.avgEMUGroth();
            this.comparingMethods();
            this.emuMatrix();

            this.$store.state.loading = false;
          });
      });
    },
    comparingEMU() {
      let children = this.rawEMUData,
        emuModule = { ...this.emuModuleData },
        parentName = this.locationName,
        loc = this.location,
        period = this.period;

      let categories = [],
        series = [],
        catIds = [];
      let totalSeriesObj = {
          name: this.$i18n.t("total-EMU"),
          data: [],
          visible: true,
        },
        methodSeriesObj = {},
        methodColorsObj = {};
      categories.push(parentName);
      catIds.push(loc);
      let dataKey = {};
      if (this.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = JSON.parse(JSON.stringify(emuModule.compEMU));
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey = typeof emuModule.totalEMU === 'string' ? JSON.parse(emuModule.totalEMU) : emuModule.totalEMU;
      }

      Object.keys(dataKey).forEach((ids) => {
        children.children.forEach((child) => {
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
            if (this.periodType === "yearly") {
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
                      if (this.calsType == "aggregate") {
                        let mName =
                          y[this.$i18n.t("methods")];
                        if (mName != [this.$i18n.t("IUD")]) {
                          mName = this.capitalize(mName);
                        }
                        methodColorsObj[mName] = emuColors[mName];
                      } else {
                        methodColorsObj[
                          y[this.$i18n.t("sub_method")]
                        ] =
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
              let emuTrend = typeof emuModule.emuTrend === 'string' ? JSON.parse(emuModule.emuTrend) : emuModule.emuTrend;
              let tindex = emuTrend[ids]["saveCategories"].indexOf(period);
              //    let revCategories = emuModule.emuTrend[ids]['saveCategories'].reverse()

              //    let tindex = revCategories.indexOf(period)
              dataKey[ids]["saveData"].forEach((data) => {
                if (data.name == this.$i18n.t("EMU")) {
                  // if(ids == 'HfVjCurKxh2'){
                  // }
                  totalSeriesObj.data.push(data["data"][index]);
                }
              });

              emuTrend[ids]["saveData"].forEach((data) => {
                let newName = data.trans_name + "__" + data.mName;
                if (!methodSeriesObj[newName]) {
                  methodSeriesObj[newName] = [];
                }
                if (this.calsType == "aggregate") {
                  methodColorsObj[data.mName] = data.color;
                } else {
                  methodColorsObj[data.trans_name] = data.color;
                }
                // if(ids == 'HfVjCurKxh2'){
                // }
                methodSeriesObj[newName].push({
                  name: categories[i],
                  value: data.data[tindex],
                });
              });
            }
          }
          //idObj[ids] = methodSeriesObj
        });
      });
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};

      if (this.calsType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = this.capitalize(sMethod);
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
      series.push(totalSeriesObj);
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
      this.oComparingEMURegConf.source = dataKey[loc]
        ? dataKey[loc].source
        : "";
      this.oComparingEMURegConf.tableData = [];
      let newSeriesAr = [],
        newCategories = [];

      Object.keys(series).forEach((s) => {
        let tabObj = {},
          serObj = { name: "", data: [], visible: "", color: "" },
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
        if (
          series[s]["name"] ==
          this.$i18n.t("total-EMU")
        ) {
          serObj.visible = true;
          parSeries.visible = true;
        } else {
          serObj.visible = false;
          parSeries.visible = false;
        }
        tabObj[this.$i18n.t("method")] =
          series[s]["name"];

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
            tabObj[categories[i]] = d ? d : "";
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
            tabObj[categories[i]] = d ? d : "";
          });
        }

        this.oComparingEMURegConf.tableData.push(tabObj);

        newSeriesAr.push(serObj);
        newSeriesAr.push(parSeries);
      });
      let source = dataKey[loc] ? dataKey[loc].source : "";

      this.commonMethodUsed(series, categories, source, catIds); // let min = 0, max = 0
      // newSeriesAr.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min) {
      //       min = innerMin
      //     }
      //     if(innerMax > max) {
      //       max = innerMax
      //     }
      // })
      // this.oComparingEMURegConf.yAxis.min = min > 0 ? 0 : min
      // this.oComparingEMURegConf.yAxis.max = max
      let noCatSeries = newSeriesAr.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({ name: newCategories[i], y: d })),
      }));


      this.oComparingEMURegConf.series = noCatSeries;
      this.oComparingEMURegConfOriginalData = noCatSeries;
      this.oComparingEMURegConf.xAxis.min = 0;
      this.oComparingEMURegConf.xAxis.max =
        noCatSeries[0].data.length > 11 && !this.reportChartData
          ? 11
          : noCatSeries[0].data.length - 1;
      // this.oComparingEMURegConf.xAxis.categories = newCategories;
      this.oComparingEMURegConf.yAxis.title.text =
        this.chartOptions[0].yAxis.text;
      this.oComparingEMURegConf.title.title =
        this.chartOptions[0].chartName +
        ": " +
        this.oComparingEMURegConf.source;
      if (this.oComparingEMURegConf.series.length) {
        this.exportArr.push({ cardKey: "key1", ...this.oComparingEMURegConf });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[0].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[0].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[0].cid)
        this.$emit("setReportChart", {
          chartObj: this.oComparingEMURegConf,
          chartName: this.chartOptions[0].chartName,
          cid: [cid],
        });
      }
    },
    emuTrend() {
      let emuModule = { ...this.emuModuleData },
        loc = this.location,
        period = this.period;
      let categories = [],
        series = [];
      let totalSeriesObj = {
          name: this.$i18n.t("total-EMU"),
          data: [],
          visible: true,
        },
        methodSeriesObj = {},
        methodColorsObj = {};

      let dataKey = {};
      if (this.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = emuModule.compEMU;
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey = typeof emuModule.totalEMU === "string" ? JSON.parse(emuModule.totalEMU): emuModule.totalEMU
      }

      if (dataKey[loc] != null && dataKey[loc] != undefined) {
        if (this.periodType === "yearly") {
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
                  if (this.calsType == "aggregate") {
                    let mName =
                      y[this.$i18n.t("methods")];
                    if (mName != [this.$i18n.t("IUD")]) {
                      mName = this.capitalize(mName);
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
          let emuModuleData =  typeof emuModule.emuTrend === 'string' ? JSON.parse(emuModule.emuTrend):emuModule.emuTrend

          let tindex = emuModuleData[loc]["saveCategories"].indexOf(period);
          tindex = tindex < 0 ? 0 : tindex;
          let tfirstIndex = tindex + 23;
          tfirstIndex = tfirstIndex < 0 ? 0 : tfirstIndex;
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
            if (this.calsType == "aggregate") {
              methodColorsObj[data.mName] = data.color;
            } else {
              methodColorsObj[data.trans_name] = data.color;
            }
            if (tindex == 0) {
              methodSeriesObj[newName] = data.data.slice(tindex, tfirstIndex);
            } else {
              methodSeriesObj[newName] = data.data.slice(
                tindex - 1,
                tfirstIndex
              );
            }
          });
        }
      }
      delete methodSeriesObj[""];
      let oFinalAgrEMU = {};
      if (this.calsType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = this.capitalize(sMethod);
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
      series.push(totalSeriesObj);
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

      this.oEMUTrend.tableData = [];
      Object.keys(series).forEach((s) => {
        let tabObj = {};
        tabObj[this.$i18n.t("method")] =
          series[s]["name"];
        series[s]["data"].forEach((d, i) => {
          let cat = categories[i] ? categories[i].toString() + " " : "";
          tabObj[cat] = d ? d : "";
        });
        this.oEMUTrend.tableData.push(tabObj);
      });
      // let min = 0, max = 0
      // series.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min) {
      //       min = innerMin
      //     }
      //     if(innerMax > max) {
      //       max = innerMax
      //     }
      // })
      // this.oEMUTrend.yAxis.min = min > 0 ? 0 : min
      // this.oEMUTrend.yAxis.max = max
      let source = dataKey[loc] ? dataKey[loc].source : "";
      this.oEMUTrend.source = source;
      let noCatSeries = series.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({
          name: categories[i],
          pe: this.$moment(categories[i], "MMM YYYY").format("YYYYMM"),
          y: d,
        })),
      }));
      this.oEMUTrend.series = noCatSeries;
      // this.oEMUTrend.xAxis.categories = categories;
      this.oEMUTrend.yAxis.title.text = this.chartOptions[1].yAxis.text;
      this.oEMUTrend.title.title =
        this.chartOptions[1].chartName +
        ": " +
        this.oComparingEMURegConf.source;
      if (this.oEMUTrend.series.length) {
        this.exportArr.push({ cardKey: "key2", ...this.oEMUTrend });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[1].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[1].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[1].cid)
        this.$emit("setReportChart", {
          chartObj: this.oEMUTrend,
          chartName: this.chartOptions[1].chartName,
          cid: [cid],
        });
      }
    },
    avgEMUGroth() {
      let children = this.rawEMUData,
        emuModule = { ...this.emuModuleData },
        parentName = this.locationName,
        loc = this.location,
        period = this.period;

      let dataKey = {};
      if (this.periodType === "yearly") {
        if (emuModule.compEMU) {
          dataKey = emuModule.compEMU;
          dataKey = JSON.parse(dataKey);
        }
      } else {
        dataKey = typeof emuModule.totalEMU === 'string'? JSON.parse(emuModule.totalEMU): emuModule.totalEMU
      }

      let categories = [],
        series = [],
        catIds = [];
      let totalSeriesObj = {
          name: this.$i18n.t("total-EMU"),
          data: [],
          visible: true,
        },
        methodSeriesObj = {},
        methodColorsObj = {};
      categories.push(parentName);
      catIds.push(loc);

      Object.keys(dataKey).forEach((ids) => {
        children.children.forEach((child) => {
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
            if (this.periodType === "yearly") {
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
                      if (this.calsType == "aggregate") {
                        let mName =
                          y[this.$i18n.t("methods")];
                        if (mName != [this.$i18n.t("IUD")]) {
                          mName = this.capitalize(mName);
                        }
                        methodColorsObj[mName] = emuColors[mName];
                      } else {
                        methodColorsObj[
                          y[this.$i18n.t("sub_method")]
                        ] =
                          emuColors[y[this.$i18n.t("sub_method")]];
                      }
                      Object.keys(y).forEach((yr) => {
                        if (!methodSeriesObj[newName]) {
                          methodSeriesObj[newName] = [];
                        }
                        if (
                          yr != [this.$i18n.t("sub_method")] &&
                          yr !=
                            [this.$i18n.t("methods")] &&
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
              let emuTrend = typeof emuModule.emuTrend === 'string'
                ? JSON.parse(emuModule.emuTrend)
                : emuModule.emuTrend;
              let tindex = emuTrend[ids]["saveCategories"].indexOf(period);
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
                if (this.calsType == "aggregate") {
                  methodColorsObj[data.mName] = data.color;
                } else {
                  methodColorsObj[data.trans_name] = data.color;
                }
                methodSeriesObj[newName].push({
                  name: categories[i],
                  value:
                    (
                      (data["data"][tindex] - data["data"][tindex + 12]) /
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
      if (this.calsType == "aggregate") {
        // for(let i in methodSeriesObj){
        //     let aSplit = i.split('__'),
        //     sMethod = aSplit[1]
        //     if(sMethod != [this.$i18n.t('IUD')]){
        //         sMethod = this.capitalize(sMethod)
        //     }
        //     if(!oFinalAgrEMU[sMethod]){
        //         oFinalAgrEMU[sMethod] = [];
        //     }
        //     for(let j in methodSeriesObj[i]){
        //         oFinalAgrEMU[sMethod][j] = (oFinalAgrEMU[sMethod][j] || 0) + methodSeriesObj[i][j];
        //         oFinalAgrEMU[sMethod][j] = oFinalAgrEMU[sMethod][j].toFixed(6) * 1
        //     }

        // }
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = this.capitalize(sMethod);
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
          // for(let j in methodSeriesObj[i]){
          //     oFinalAgrEMU[sMethod][j] = methodSeriesObj[i][j];
          // }
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
      series.push(totalSeriesObj);
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

      this.avgEMUMonthlyGrowth.tableData = [];
      Object.keys(series).forEach((s) => {
        let tabObj = {};
        tabObj[this.$i18n.t("method")] =
          series[s]["name"];
        series[s]["data"].forEach((d, i) => {
          tabObj[categories[i]] = d ? d : "";
        });
        this.avgEMUMonthlyGrowth.tableData.push(tabObj);
      });
      // let min = 0, max = 0
      // series.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min) {
      //       min = innerMin
      //     }
      //     if(innerMax > max) {
      //       max = innerMax
      //     }
      // })
      // this.avgEMUMonthlyGrowth.yAxis.min = min > 0 ? 0 : min
      // this.avgEMUMonthlyGrowth.yAxis.max = max
      this.avgEMUMonthlyGrowth.source = dataKey[loc] ? dataKey[loc].source : "";

      let noCatSeries = series.map((s) => ({
        ...s,
        data: s.data.map((d, i) => ({ name: categories[i], y: d })),
      }));
      this.avgEMUMonthlyGrowth.series = noCatSeries;
      this.avgEMUMonthlyGrowthOriginalData = noCatSeries;
      this.avgEMUMonthlyGrowth.xAxis.min = 0;
      this.avgEMUMonthlyGrowth.xAxis.max =
        noCatSeries[0].data.length > 11 && !this.reportChartData
          ? 11
          : noCatSeries[0].data.length - 1;
      // this.avgEMUMonthlyGrowth.xAxis.categories = categories;
      this.avgEMUMonthlyGrowth.yAxis.title.text =
        this.chartOptions[2].yAxis.text;
      this.avgEMUMonthlyGrowth.title.title =
        this.chartOptions[2].chartName +
        ": " +
        this.oComparingEMURegConf.source;
      if (this.avgEMUMonthlyGrowth.series.length) {
        this.exportArr.push({ cardKey: "key3", ...this.avgEMUMonthlyGrowth });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[2].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[2].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[2].cid)
        this.$emit("setReportChart", {
          chartObj: this.avgEMUMonthlyGrowth,
          chartName: this.chartOptions[2].chartName,
          cid: [cid],
        });
      }
    },
    commonMethodUsed(series, categories, source, catIds) {
      let newSeries = [];
      series.forEach((s) => {
        if (
          s.name.toLowerCase() !==
          this.$i18n
            .t("total-EMU")
            .toLowerCase()
        ) {
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
      this.emuMethodMix.source = source;
      this.emuMethodMix.series = fSer;
      this.emuMethodMixOriginalData = fSer;
      this.emuMethodMix.tableData = [];
      this.bubbleChartHeader =
        this.chartOptions[3].chartName +
        ": " +
        this.oComparingEMURegConf.source;
      let tabObj = {};
      Object.keys(ser).forEach((s) => {
        ser[s].data.forEach((d) => {
          tabObj[this.$i18n.t("region")] = d.name;
          tabObj[this.$i18n.t("method")] =
            ser[s].name;
          tabObj[this.$i18n.t("value")] = d.value
            ? d.value
            : "";
          let newObj = { ...tabObj };
          this.emuMethodMix.tableData.push(newObj);
        });
      });
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[3].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[3].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[3].cid)
        this.$emit("setReportChart", {
          chartObj: this.emuMethodMix,
          chartName: this.chartOptions[3].chartName,
          cid: [cid],
        });
      }
    },
    comparingMethods() {
      let children = this.rawEMUData,
        emuModule = { ...this.emuModuleData },
        parentName = this.locationName,
        loc = this.location,
        period = this.period,
        so = "";

      let dataKey = {};
      if (this.periodType === "yearly") {
        dataKey = JSON.parse(JSON.stringify(emuModule.methodTable));
        dataKey = JSON.parse(dataKey);
        so =
          emuModule.compEMU && JSON.parse(emuModule.compEMU)[loc]
            ? JSON.parse(emuModule.compEMU)[loc].source
            : "";
      } else {
        dataKey = typeof emuModule.emuTrend === 'string' ? JSON.parse(emuModule.emuTrend) : emuModule.emuTrend;
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
        children.children.forEach((child) => {
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
            if (this.periodType === "yearly") {

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
                    if (this.calsType == "aggregate") {
                      newName =
                        y[this.$i18n.t("sub_method")] +
                        "__" +
                        y[this.$i18n.t("methods")];
                      let mName =
                        y[this.$i18n.t("methods")];
                      if (mName != [this.$i18n.t("IUD")]) {
                        mName = this.capitalize(mName);
                      }
                      methodColorsObj[mName] = emuColors[mName];
                    } else {
                      newName = y[this.$i18n.t("sub_method")];
                      methodColorsObj[
                        y[this.$i18n.t("sub_method")]
                      ] = emuColors[y[this.$i18n.t("sub_method")]];
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
              if (
                this.calsType == "aggregate" &&
                dataKey[ids]["agreData"]
              ) {
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
      if (this.periodType === "yearly" && this.calsType == "aggregate") {
        for (let i in methodSeriesObj) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (sMethod != [this.$i18n.t("IUD")]) {
            sMethod = this.capitalize(sMethod);
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

      this.compMethods.tableData = [];
      series.forEach((s) => {
        let tabObj = {};
        tabObj[this.$i18n.t("method")] = s.name;
        s.data.forEach((d) => {
          tabObj[d.name] = d.y ? d.y : "";
        });
        this.compMethods.tableData.push(tabObj);
      });
      this.compMethods.source = so;
      // let noCatSeries = series.map(s => ({
      //   ...s,
      //   data: s.data.map((d,i) => ({"name": categories[i], "y": d}))
      // }))
      this.compMethods.series = series.reverse();
      this.compMethodsOriginalData = series;
      this.compMethods.xAxis.min = 0;
      this.compMethods.xAxis.max =
        series.length && series[0].data.length > 11 && !this.reportChartData
          ? 11
          : series.length
          ? series[0].data.length - 1
          : 0;
      // this.compMethods.xAxis.categories = categories;
      this.compMethods.yAxis.title.text = this.chartOptions[4].yAxis.text;
      this.compMethods.title.title =
        this.chartOptions[4].chartName + ": " + this.compMethods.source;
      if (this.compMethods.series.length) {
        this.exportArr.push({ cardKey: "key5", ...this.compMethods });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[4].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[4].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[4].cid)
        this.$emit("setReportChart", {
          chartObj: this.compMethods,
          chartName: this.chartOptions[4].chartName,
          cid: [cid],
        });
      }
    },
    emuMatrix() {
      let children = this.rawEMUData,
        emuModule = { ...this.emuModuleData },
        parentName = this.locationName,
        loc = this.location,
        so = "";
      let dataKey = {};
      if (this.periodType === "yearly") {
        dataKey = JSON.parse(JSON.stringify(emuModule.methodTable));
        dataKey = JSON.parse(dataKey);
        so =
          emuModule.compEMU && JSON.parse(emuModule.compEMU)[loc]
            ? JSON.parse(emuModule.compEMU)[loc].source
            : "";
      } else {
        so = emuModule.totalEMU[loc] ? emuModule.totalEMU[loc].source : "";
        dataKey = typeof emuModule.totalEMU === 'string' ? JSON.parse(emuModule.totalEMU) : emuModule.totalEMU;
      }
      let methodSeriesObj = {},
        categories = [],
        catIds = [],
        dataObj = {};
      categories.push(parentName);
      catIds.push(loc);
      Object.keys(dataKey).forEach((ids) => {
        children.children.forEach((child) => {
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
            if (this.periodType === "yearly") {
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
              let emuSave = typeof emuModule.emuTrend === 'string'
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
          if (this.calsType == "aggregate") {
            let aSplit = i.split("__"),
              sMethod = aSplit[1];
            if (sMethod != [this.$i18n.t("IUD")]) {
              sMethod = this.capitalize(sMethod);
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
      this.trendMatrixTableHeader =
        this.chartOptions[5].chartName + ": " + this.compMethods.source;
      this.$store.state.loading = false;
    },
    showAlert() {
      this.$swal({
        title: this.$i18n.t("error"),
        text: this.$i18n.t("somethingwentwrong"),
      });
    },
  },
  created() {
    if (this.periodType === "yearly") {
      this.getPopulation();
    } else {
      this.getMonthlyData();
    }
  },
};
</script>
