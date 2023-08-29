<template>
  <div style="display: none">
    <div class="container-fluid m-t-28px px-0">
      <div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
        <a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <b-tabs v-if="Object.keys(categoryData).length">
            <template v-for="(catData, key, index) in categoryData">
              <b-tab
                @click="getRecentActiveTab(key)"
                :title="getSource(key)"
                :key="key"
                v-if="
                  [
                    'User',
                    'Commodities_Facilities',
                    'Visits',
                    'Commodities_Client',
                  ].includes(key) &&
                  catData.dataOnContraceptive == 'Yes' &&
                  population
                "
              >
                <div class="mt-3">
                <TabSummary
                  v-if="
                    catData &&
                    catData['categoryInfo'] &&
                    (typeof catData['categoryInfo'] == 'object'
                      ? catData['categoryInfo'][$i18n.locale] != ''
                      : catData['categoryInfo'])
                  "
                  :content="
                    typeof catData == 'object'
                      ? catData['categoryInfo'][$i18n.locale]
                      : catData['categoryInfo']
                  "
                    :contKey="'input' + key"
                  />
                </div>
                <benchMarkingInpOutp
                  :data="catData"
                  :dhsColor="dhsColor"
                  :totalEMUColor="totalEMUColor"
                  :source="getSource(key)"
                  :population="population"
                  :location="value[0]"
                  @methodFilter="methodFilterVal"
                  :method="methodSelected"
                  @activeTabName="getActiveTab"
                  :signOffActive="signOffActive"
                  :exportPosition="index + 1"
                  @sendEMUCharts="getEMUCharts"
                  :ref="key"
                  :contName="key"
                  :dqrResponse="dqrResponse"
                  :globalResponse="globalResponse"
                  :caltype="caltype"
                  @emittingEMU="saveEMUAuto"
                  @errorOccured="errorOccured"
              /></b-tab>
            </template>
          </b-tabs>
          <div class="text-center" v-else>
            <b-spinner type="grow" label="Spinning"></b-spinner>
          </div>
        </div>
      </div>
    </div>

    <toolbarComponent
      v-if="value && emuMethods && defaultMethod"
      :locKey="locKey"
      :recentActiveTab="recentActiveTab"
      :defaultMethod="defaultMethod"
      :locationValue="value[0]"
      @location="getLocation"
      @emuMethod="getMethod"
      :methods="emuMethods"
      @closeToolbar="closeToolbar"
      :showToolbarOnTablet="showToolbarOnTablet"
      @calsType="getCalType"
      :calType="caltype"
    />
  </div>
</template>

<script>
import benchMarkingInpOutp from "./benchMarkingInpOutp";
import service from "@/service";
import dataM from "./../monthly/dataMassaging";
import toolbarComponent from "./toolbarComponent.vue";
import { decompress } from "compress-json";
import NepaliDate from "nepali-date-converter";
import { translateDate } from "@/components/Common/commonFunctions";
export default {
  components: {
    benchMarkingInpOutp,
    toolbarComponent,
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
  },
  props: [
    "locationVal",
    "signOffActive",
    "dqrResponse",
    "globalResponse",
    "tabName",
    "dhsColor",
    "totalEMUColor",
  ],
  mounted() {
    this.getActiveTab("input");
    this.$gtag.event("tab_view", {
      value: this.tabName,
    });
  },
  created() {
    this.getConfigAccess(true);
  },
  updated() {},
  methods: {
    getSource(key) {
      let aSource = {
        Commodities_Client: this.$i18n.t("commodities_Distributed_to_Clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t(
          "commodities_Distributed_to_Facilities"
        ),
        User: this.$i18n.t("fp_users"),
      };
      return aSource[key];
    },
    saveEMUAuto(val) {
      // //console.log(val);
      this.$emit("saveEMUAuto", val);
    },
    errorOccured(val) {
      if (val) this.$emit("errorOccured", val);
    },
    getCalType(val) {
      this.caltype = val;
    },

    getEMUCharts(exportArr = []) {
      let newExport = JSON.parse(JSON.stringify(exportArr));
      newExport = newExport.map((obj) => {
        if (
          obj.cardKey === "key1" ||
          obj.cardKey === "key2" ||
          obj.cardKey === "key8" ||
          obj.cardKey === "key9" ||
          obj.cardKey === "key15" ||
          obj.cardKey === "key16" ||
          obj.cardKey === "key22" ||
          obj.cardKey === "key23"
        ) {
          return {
            ...obj,
            data: obj.data.filter((ele) =>
              ele.name.includes(this.methodSelected)
            ),
          };
        } else {
          return obj;
        }
      });
      newExport.forEach((obj) => {
        let isObj = this.exportArr.find((e) => e.cardKey === obj.cardKey);
        if (isObj) {
          let foundIndex = this.exportArr.findIndex(
            (e) => e.cardKey === obj.cardKey
          );
          this.exportArr[foundIndex] = obj;
        } else {
          this.exportArr.push(obj);
        }
      });
    },
    async exportPPT() {
      this.showLoader = true;
      let locationName = null;
      await service
        .getIndividualOrganisation(this.locationVal.split("/")[1])
        .then((key) => {
          locationName = key.data.name;
        });
      this.showLoader = false;
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<div><input id="fileName" class="swal2-input" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="EMU Monthly" tabindex="-1"/></div>' +
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
        let period = translateDate(this.period);
        import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
          (pptxgen) => {
            let pptx = new pptxgen.default();
            pptx.layout = "LAYOUT_WIDE";
            pptx.author = "Avenir Generic Tool";
            pptx.company = "Dure Technologies";
            pptx.subject = this.$i18n.t("emu_monthly");
            pptx.title = this.$i18n.t("emu_monthly");

            pptx.defineSlideMaster({
              title: "MASTER_SLIDE",
              bkgd: "FFFFFF",
              objects: [
                {
                  text: {
                    text: this.$i18n.t("emu_monthly"),
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
                    y: "94%",
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
                    y: "95%",
                    w: 3,
                    h: 0,
                    line: "0088CC",
                    lineSize: 1,
                  },
                },
                {
                  text: {
                    text: this.$i18n.t("location") + " :- " + locationName,
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
                    text: this.$i18n.t("period") + " :- " + period,
                    options: {
                      x: 0.5,
                      y: "97%",
                      w: "60%",
                      bold: true,
                      fontSize: 12,
                    },
                  },
                },
                {
                  text: {
                    text: this.$i18n.t("method") + " :- " + this.methodSelected,
                    options: {
                      x: 0.5,
                      y: "99%",
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
                      y: "99%",
                      w: "30%",
                      align: "right",
                      fontSize: 12,
                      bold: true,
                    },
                  },
                },
              ],
            });

            let slide = null;

            if (this.exportArr && this.exportArr.length) {
              let reA = /[^a-zA-Z]/g;
              let reN = /[^0-9]/g;

              this.exportArr.sort((a, b) => {
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

              for (let index = 0; index < this.exportArr.length; index++) {
                const element = this.exportArr[index];

                slide = pptx.addSlide("MASTER_SLIDE");
                slide.addText(element.source + " - " + element.title, {
                  x: 0.5,
                  y: 0.6,
                  w: "90%",
                  fontSize: 18,
                  bold: true,
                  underline: true,
                  breakLine: true,
                });
                let chartData = [],
                  chartColors = [];

                if (
                  element.cardKey != "key7" &&
                  element.cardKey != "key14" &&
                  element.cardKey != "key21" &&
                  element.cardKey != "key28"
                ) {
                  if (element.data.length > 0) {
                    element.data.forEach((e) => {
                      if (e.color) {
                        chartColors.push(e.color.split("#")[1]);
                      } else {
                        chartColors.push(
                          (0xffffffff - Math.random() * 0xffffffff)
                            .toString(16)
                            .substr(0, 6)
                        );
                      }
                      let name = e.name,
                        labels = element.categories,
                        values = e.data;

                      chartData.push({
                        name,
                        labels,
                        values,
                      });
                    });

                    let type = element.type;

                    let options = {
                      x: 0.5,
                      y: 1,
                      w: "90%",
                      h: "75%",
                      showValue: formValues[2] === "show" ? true : false,
                      showLegend: formValues[1] === "show" ? true : false,
                      legendPos: "b",
                      barGapWidthPct: 50,
                      chartColors,
                      showCatAxisTitle:
                        formValues[3] !== "show"
                          ? false
                          : element.xTitle
                          ? true
                          : false,
                      catAxisTitle: element.xTitle ? element.xTitle : "",
                      showValAxisTitle:
                        formValues[4] !== "show"
                          ? false
                          : element.yTitle
                          ? true
                          : false,
                      valAxisTitle: element.yTitle ? element.yTitle : "",
                    };

                    if (type == "line") {
                      type = pptx.ChartType.line;
                    } else if (type == "area") {
                      type = pptx.ChartType.area;
                    } else if (type == "scatter") {
                      type = pptx.ChartType.scatter;
                      options["lineSize"] = 0;
                    } else if (type == "stacked") {
                      type = pptx.ChartType.bar;
                      options["barDir"] = "col";
                      options["barGrouping"] = "stacked";
                    } else {
                      type = pptx.ChartType.bar;
                      if (
                        element.plotOptions &&
                        element.plotOptions.series &&
                        element.plotOptions.series.stacking === "normal"
                      ) {
                        options["barDir"] = "col";
                        options["barGrouping"] = "stacked";
                      }
                    }
                    slide.addChart(type, chartData, options);
                  } else {
                    slide.addText(this.$i18n.t("no_data_to_display"), {
                      x: 5.5,
                      y: 3.6,
                      w: "90%",
                      fontSize: 18,
                      bold: true,
                      underline: false,
                      breakLine: true,
                    });
                  }
                } else {
                  let tableHeader = element.headers,
                    rows = [];

                  rows.push(tableHeader);
                  if (element.data.length > 0) {
                    element.data.forEach((item) => {
                      let innerRow = [];
                      item.forEach((itemInner) => {
                        innerRow.push({ text: itemInner });
                      });
                      rows.push(innerRow);
                    });
                  } else {
                    let innerRow = [
                      {
                        text: this.$i18n.t("no_data_to_display"),
                        align: "center",
                      },
                    ];
                    rows.push(innerRow);
                  }
                  pptx.addSection({ title: "Tables: Auto-Paging" });
                  slide.addTable(rows, {
                    x: 0.5,
                    y: 1,
                    w: 12.3,
                    rowH: 0.5,
                    fill: "F5F5F5",
                    border: { pt: 1, color: "FFFFFF" },
                    align: "center",
                    valign: "middle",
                    fontSize: 16,
                    bold: true,
                    autoPage: true,
                    newSlideStartY: 1,
                  });
                }
              }
            }
            pptx.writeFile({ fileName: formValues[0] });
            console.log("File exported...");
          }
        );
      } else {
        //this.isExport = false
      }
    },
    getActiveTab(value) {
      this.recentActiveTab = value;
    },
    getRecentActiveTab(tab) {
      this.recentActiveTab = this.$refs[tab][0].activetab;
      this.activeTab = tab;
      let obj = this.sourceFilter.find((o) => o.name === tab);
      if (obj) {
        this.emuMethods = obj.value;
        this.defaultMethod = obj.value[0]["children"][0]["id"];
        this.methodSelected = obj.value[0]["children"][0]["id"];
      }
    },
    closeToolbar() {
      this.showToolbarOnTablet = false;
    },
    getLocation(newLocation) {
      this.caltype = "method";
      this.value = [newLocation];
      this.newLocVal = newLocation;
      let obj = this.sourceFilter.find((o) => o.name === this.activeTab);
      this.emuMethods = obj.value;
      this.defaultMethod = obj.value[0]["children"][0]["id"];
      this.methodSelected = obj.value[0]["children"][0]["id"];
      this.locKey++;
      this.getConfigAccess(true);
    },
    methodFilterVal(value) {
      this.sourceFilter.push(value);
      let obj = this.sourceFilter.find((o) => o.name === this.activeTab);
      if (obj) {
        this.emuMethods = obj.value;
        this.defaultMethod = obj.value[0]["children"][0]["id"];
        this.methodSelected = obj.value[0]["children"][0]["id"];
        this.locKey++;
      }
    },
    getMethod(value) {
      this.locKey++;
      this.methodSelected = value;
    },
    /**
     * This is get banchmarking configuration.
     * Usage: `getConfigAccess()`
     * @param 'adBenchmarkModule' which is key for benchmarking config
     * @return {Object} categoryData
     */
    async getConfigAccess(locChange) {
      let locationID = this.newLocVal.split("/")[1];
      //chnaging period logic and taking application period datefor emu monthly
      // let sStartYear = this.dqrResponse.emu_monthly["Background_Data"][
      //   "startingYear"
      // ]
      //   ? this.dqrResponse.emu_monthly["Background_Data"]["startingYear"]
      //   : "2007";
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        d = new NepaliDate(
          new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
        ).getBS();
        let nplMonth = d.month;
        let nplYear = d.year;
        let zeroForMonth = nplMonth < 10 ? "0" + nplMonth : nplMonth;
        d = d.year + "" + zeroForMonth;
      }
      let lYear = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY");
      this.categoryData = this.dqrResponse.emu_monthly;
      // let lYear = this.categoryData["Background_Data"]["SSDataRecentYear"]
      //   ? this.categoryData["Background_Data"]["SSDataRecentYear"]
      //   : sStartYear * 1 + 13;
      let sStartYear = this.$moment(lYear, "YYYY")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");

      console.log(
        sStartYear,
        lYear,
        "=========",
        this.dqrResponse.emu_monthly["Background_Data"]["startingYear"],
        this.categoryData["Background_Data"]["SSDataRecentYear"]
      );
      let sYear = dataM.getYearFormated(sStartYear, lYear * 1 + 1);
      this.value = [this.newLocVal];
      this.locationValue = this.newLocVal;

      let aBackgorundIndicators = this.categoryData["Background_Data"][
        "backgroundIndicators"
      ]
        ? this.categoryData["Background_Data"]["backgroundIndicators"]
        : [];
      let aSelectedDEs = [],
        sSelectedDEs = "";
      aBackgorundIndicators[0].subIndicators.forEach((ind) => {
        ind.selectedDE.forEach((de) => {
          aSelectedDEs.push(de.id);
        });
      });
      sSelectedDEs = aSelectedDEs.join(";");
      if (!locChange) {
        this.activeTab =
          this.dqrResponse.emu_monthly.Background_Data["autoSaveEMU"];
        // this.switchCategory(this.categoryData);
      }
      let fromDataStore = this.categoryData["Background_Data"]["bgDataSource"]
        ? this.categoryData["Background_Data"]["bgDataSource"]
        : false;
      let innerDataStore = this.categoryData["Background_Data"][
        "backgroundIndicators"
      ][0]["bgDataSource"]
        ? this.categoryData["Background_Data"]["backgroundIndicators"][0][
            "bgDataSource"
          ]
        : fromDataStore;
      if (innerDataStore == "Datastore") {
        let levelid = this.newLocVal.split("/")[0];
        let popType = this.categoryData["Background_Data"]["FPWomenPopulation"]
          ? this.categoryData["Background_Data"]["FPWomenPopulation"]
          : "MWRA";
        popType = popType.toLowerCase();
        let key = `population_${popType}_${levelid}`;
        await service
          .getSavedConfig({ tableKey: key })
          .then(async (popResp) => {
            this.population = {};
            let popResponse =
              popResp && typeof popResp.data.rows == "string"
                ? {
                    ...popResp.data,
                    rows: decompress(JSON.parse(popResp.data.rows)),
                  }
                : popResp.data;
            let newpopResponse = popResponse.rows.filter(
              (arr) => arr[2] === locationID
            );
            newpopResponse.forEach((data) => {
              this.population[data[1]] = data[3] * 1;
            });

            console.log(this.population, "from DT");
          })
          .catch((res) => {
            this.$emit("popError", this.newLocVal);
          });
      } else {
        await service
          .getAnalyticalIndicatorData(sSelectedDEs, locationID, sYear)
          .then((response) => {
            this.population = {};
            if (response.data.rows.length) {
              response.data.rows.forEach((data) => {
                this.population[data[1]] = data[3] * 1;
              });
            } else {
              this.$emit("popError", this.newLocVal);
            }
          })
          .catch((res) => {
            this.$emit("popError", this.newLocVal);
            // this.showAlert();
          });
      }
      this.sStartYear = sStartYear;
      console.log("Population data from SL LIVE", innerDataStore);
      console.log(this.population);
    },
    showAlert() {
      console.trace();
      this.sweetAlert({
        text: this.$i18n.t("somethingwentwrong"),
      });
    },
    switchCategory(data) {
      // let aSource = {
      //   Commodities_Client: "EMU :Commodities to clients",
      //   Visits: "EMU :FP visits",
      //   Commodities_Facilities: "EMU :Commodities to facilitlity",
      //   User: "EMU :FP users",
      // };
      // let preVal = "",
      //   preValFlag = false;
      // Object.keys(aSource).forEach((source) => {
      //   if (
      //     data[source]["dataOnContraceptive"] == "Yes" &&
      //     preValFlag == false
      //   ) {
      //     preVal = source;
      //     preValFlag = true;
      //   }
      //   ////console.log(this.category, this.activeTab)
      // });
      ////console.log(preVal)
      this.activeTab =
        this.dqrResponse.emu_monthly.Background_Data["autoSaveEMU"];
    },
  },
  data() {
    ////console.log(this.dqrResponse)
    return {
      caltype: "method",
      categoryData: {},
      sStartYear: 2010,
      population: null,
      options: [],
      value: null,
      locationValue: "",
      period: this.$moment(new Date()).format("YYYY-MM"),
      activeTab: "",
      methodSelected: "",
      emuMethods: [],
      defaultMethod: "",
      showToolbarOnTablet: false,
      recentActiveTab: "",
      exportArr: [],
      newLocVal: this.locationVal,
      sourceFilter: [],
      locKey: 0,
    };
  },
  watch: {
    locationVal(newVal) {
      console.log(newVal, "in autosave emu benchmark tab");
      this.newLocVal = newVal;
      this.getConfigAccess(true);
      // if (newVal) {
      // this.newLocVal = newVal;
      // this.getConfigAccess(true);
      // }
    },
    methodSelected(newVal) {
      this.methodSelected = newVal;
    },
  },
};
</script>
<style>
.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 1.5;
}
</style>
