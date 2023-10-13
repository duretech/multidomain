<template>
  <div class="summary-page-container" id="scrollTop" ref="printPDF">
    <div
      id="modal-anc"
      :style="{ paddingTop: isGenerating ? '0%' : '' }"
    >
      <h2
        v-if="isGenerating"
        style="text-align: center"
        :style="{
          color: isGenerating
            ? $store.getters.getTheme == 'dark'
              ? 'white !important'
              : $store.getters.getTheme == 'grey'
              ? 'white !important'
              : ''
            : '',
        }"
      >
        {{ $t("analytical_dashboard") }}
      </h2>
      <div class="text-right" v-if="!isGenerating">
        <button
          type="button"
          class="btn btn-primary black-btn blue-btn f-08rem"
          @click.prevent.stop="downloadReport()"
        >
          <span class="">
            <img
              :src="require('@/assets/images/icons/generateReport.svg')"
              class="img-fluid mt-xl-n1"
            />
          </span>
          <span class="mx-1"> {{ $t("exportbtn") }} </span>
        </button>
      </div>
      <template v-if="configData && !reportChartData && !isGenerating">
        <div
          v-for="(subTab, sInd) in configData.subTabs"
          :key="'tabSummary' + configData.id + subTab.id + sInd"
        >
          <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
            <TabSummary
              :content="subTab.categoryInfo[$i18n.locale]"
              :contKey="configData.id + subTab.id"
            />
          </div>
        </div>
      </template>
      <div
        class="anc-charts tablemap-col2 newcolumntab grey-newborder mt-3"
        v-if="
          ['emuMonthlyTab', 'emuAnnualTab'].includes(
            $store.getters.getActiveTab
          )
        "
      >
        <div v-if="['emuMonthlyTab'].includes($store.getters.getActiveTab)">
          <EMUMonthly
            :emuData="emuData"
            :dqrResponse="dqrResponse"
            :locationPeriod="locationPeriod"
            @setDQRResponse="setDQRResponse"
            @updateChartData="updateChartData"
          />
        </div>
        <div v-if="['emuAnnualTab'].includes($store.getters.getActiveTab)">
          <EMUAnnual
            :emuData="emuData"
            :dqrResponse="dqrResponse"
            :locationPeriod="locationPeriod"
            @setDQRResponse="setDQRResponse"
            @updateChartData="updateChartData"
          />
        </div>
      </div>
      <b-row v-else class="modal-newac">
        <b-col
          sm="12"
          lg="6"
          v-if="
            !reportChartData && (sumArray.length || regionCountArray.length)
          "
          style="display:block"
                :style="{margin: isGenerating ? '5% 0% 15% 0%' : ''}"
        >
        <div class="h-100 tablemap-col1 modal-content bg-map">
          <div
            class="border-greytheme"
            style="margin-top: 30px"
            ref="summaryContainer"
          >
          <div class="text-right">
            <b-dropdown
              menu-class="chart-dd-menu"
              toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
              v-if="!isPrinting"
            >
              <!-- v-if="tType !== 'map'" -->
              <template v-slot:button-content>
                <img
                  :src="require(`@/assets/images/icons/downloadnewActive.svg`)"
                  v-b-tooltip.hover
                  :title="$t('downloadIcon')"
                  class="img-fluid icon1"
                />
              </template>
              <b-dropdown-item class="list-group-item bg-transparent px-0"  @click.prevent.stop="exportChart('pdf')"
                ><a
                  class="color-white"
                >
                  <div class="row no-gutters options-item">
                    <div class="col-lg-10 text-left">
                      <p class="m-0px">{{ $t("pdf") }}</p>
                    </div>
                    <div class="col-lg-2">
                      <p class="m-0px">
                        <i class="fa-solid fa-file-pdf"></i>
                      </p>
                    </div>
                  </div> </a
              ></b-dropdown-item>
            </b-dropdown>
          </div>
            <div v-for="(obj, i) in sumArray" :key="'sumArray' + i">
              <b-row
                class="pt-1 pb-1 pl-3 greyborder px-10px"
                v-if="
                  obj.summaryDetails && obj.summaryDetails.length && i === 0
                "
              >
                <b-col
                  :cols="$store.getters.getAppSettings?.benchmark ? 4 : 6"
                ></b-col>
                <b-col class="table-heading pr-0" cols="2"
                  ><p class="fs-17-1920">
                    {{ obj.summaryDetails[0].currForDate }}
                  </p>
                </b-col>
                <b-col class="table-heading pr-0" cols="2"
                  ><p class="fs-17-1920">
                    {{ obj.summaryDetails[0].prevForDate }}
                  </p></b-col
                >
                <b-col class="table-heading pr-0" cols="2"
                  ><p class="fs-17-1920">{{ $t("per_change") }}</p></b-col
                >
                <b-col
                  class="table-heading pr-0"
                  cols="2"
                  v-if="$store.getters.getAppSettings?.benchmark"
                  ><p class="fs-17-1920">{{ $t("benchmark") }}</p></b-col
                >
              </b-row>
              <b-row
                class="pt-1 pb-2 valueRow"
                v-for="(sDetails, i) in obj.summaryDetails"
                :key="'sumArrayDetails' + i"
              >
                <b-col
                  class="table-heading pt-2 px-10px"
                  :cols="$store.getters.getAppSettings?.benchmark ? 4 : 6"
                  ><p class="fs-17-1920">
                    {{ sDetails.indicatorName
                    }}<span class="small text-info" v-if="obj.priorityIndicator"
                      ><strong
                        >&nbsp;({{ $t("chartPriorityIndicator") }})</strong
                      ></span
                    >
                  </p>
                </b-col>
                <b-col cols="2" class="px-10px"
                  ><div class="summary-dot fs-17-1920">
                    {{
                      sDetails.currValue === null
                        ? $t("NA")
                        : sDetails.currValue
                    }}
                  </div></b-col
                >
                <b-col cols="2" class="px-10px"
                  ><div class="summary-dot fs-17-1920">
                    {{
                      sDetails.prevValue === null
                        ? $t("NA")
                        : sDetails.prevValue
                    }}
                  </div></b-col
                >
                <b-col cols="2" class="px-10px">
                  <div
                    class="summary-dot fs-17-1920"
                    :style="{ backgroundColor: sDetails.color }"
                  >
                    {{ sDetails.change === null ? $t("NA") : sDetails.change }}
                  </div></b-col
                >
                <b-col
                  cols="2"
                  class="px-10px"
                  v-if="$store.getters.getAppSettings?.benchmark"
                  ><div class="summary-dot fs-17-1920">
                    {{
                      sDetails.benchmark === null
                        ? $t("NA")
                        : sDetails.benchmark
                    }}
                  </div></b-col
                >
              </b-row>
            </div>
            <hr v-if="regionCountArray.length" />
            <div
              v-for="(region, i) in regionCountArray"
              :key="'regionCountArray' + i"
            >
              <b-row
                class="pt-1 pb-1 pl-3"
                v-if="region.summaryDetails && i === 0"
              >
                <b-col cols="4"></b-col>
                <b-col class="table-heading pr-0" cols="4"
                  ><p class="fs-17-1920">
                    {{ $t("countryInSameDirection") }}
                  </p></b-col
                >
                <b-col class="table-heading pr-0" cols="4"
                  ><p class="fs-17-1920">
                    {{ $t("countryInOppositeDirection") }}
                  </p></b-col
                >
              </b-row>
              <b-row
                class="pt-1 pb-2 valueRow borderGrey"
                v-for="(sDetails, i) in region.summaryDetails"
                :key="'regionCountArrayDetails' + i"
              >
                <b-col class="table-heading pt-2" cols="4"
                  ><p class="fs-17-1920">{{ sDetails.indicatorName }}</p></b-col
                >
                <b-col cols="4"
                  ><div
                    class="summary-dot fs-17-1920"
                    :style="{ backgroundColor: sDetails.aColor }"
                  >
                    {{
                      sDetails.aBenchmark === null
                        ? $t("NA")
                        : sDetails.aBenchmark
                    }}
                  </div></b-col
                >
                <b-col cols="4"
                  ><div
                    class="summary-dot fs-17-1920"
                    :style="{ backgroundColor: sDetails.bColor }"
                  >
                    {{
                      sDetails.bBenchmark === null
                        ? $t("NA")
                        : sDetails.bBenchmark
                    }}
                  </div></b-col
                >
              </b-row>
            </div>
          </div>
        </div>
        </b-col>
        <template v-if="configData">
          <template
            class="anc-charts tablemap-col2 after"
            v-for="(subTab, sInd) in configData.subTabs"
          >
            <template v-if="!reportChartData && isMaps(subTab.mapSetting)">
              <b-col
                sm="12"
                lg="6"
                :key="'map' + configData.id + subTab.id + sInd"
                v-show="$store.getters.getActiveTab.includes(subTab.id)"
                style="display:block"
                :style="{margin: isGenerating ? '5% 0% 15% 0%' : ''}"
              >
              <div class="h-100 tablemap-col1 modal-content bg-map anc-indicatormap">
                <div class="border-greytheme" style="margin-top: 30px">
                  <MapContainer
                    :subTab="subTab"
                    :emuData="emuData"
                    :allGeoJson="allGeoJson"
                    :preFetchData="preFetchData"
                    :locationPeriod="locationPeriod"
                    :isGenerating="isGenerating"
                    @mapPic="mapPic"
                    @deleteMapPic="deleteMapPic"
                    class="greyborder"
                  />
                </div>
              </div>
              </b-col>
            </template>
            <template v-for="chartData in subTab.chartSetting">
              <b-col
                sm="12"
                lg="6"
                v-if="!chartData.chartOptions.disable"
                :key="
                  'chart-' +
                  configData.id +
                  subTab.id +
                  sInd +
                  chartData.chartOptions.cid
                "
                :style="{
                  display:
                    reportChartData ||
                    $store.getters.getActiveTab.includes(subTab.id)
                      ? 'block'
                      : 'none',
                      margin: isGenerating ? '5% 0% 15% 0%' : ''
                }"
              >
                <ChartComponent
                  :style="{
                    display:
                      isGenerating &&
                      (chartData.chartOptions.chartCalculation.includes(
                        'OTHER_MATRIX_TABLE'
                      ) ||
                        chartData.chartOptions.chartCalculation.includes(
                          'OTHER_MATRIX_TABLE_CYP'
                        ) ||
                        chartData.chartOptions.chartCalculation.includes(
                          'MATRIX_TABLE'
                        ))
                        ? 'none'
                        : 'block',
                  }"
                  :subTab="subTab"
                  :emuData="emuData"
                  :chartData="chartData"
                  @setExtData="setExtData"
                  :allExtData="allExtData"
                  :population="population"
                  @summaryData="summaryData"
                  :preFetchData="preFetchData"
                  @updateToolBar="updateToolBar"
                  @setReportChart="setReportChart"
                  :locationPeriod="locationPeriod"
                  :reportChartData="reportChartData"
                  :backgroundData="subTab.backgroundData"
                  :isGenerating="isGenerating"
                  :configDataAD="configData"
                  @updateChartData="updateChartData"
                  @getBubbleChart="getBubbleChart"
                  @mapPic="mapPic"
                  @deleteBubbleChart="deleteBubbleChart"
                  @deleteMapPic="deleteMapPic"
                />
              </b-col>
            </template>
          </template>
        </template>
      </b-row>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import { decompress } from "compress-json";
import MapContainer from "./MapContainer.vue";
import GeoJsonMixin from "@/helpers/GeoJsonMixin";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import GenerateReportMixin from "@/helpers/GenerateReportMixin";
import html2pdf from "html2pdf.js";
import domtoimage from "dom-to-image";
export default {
  props: ["selectedData", "preFetchData", "locationPeriod", "reportChartData"],
  mixins: [GeoJsonMixin, ScrollPageMixin, GenerateReportMixin],
  components: {
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
    MapContainer,
    ChartComponent: () =>
      import(
        /* webpackChunkName: "Dynamic_Common_ChartComponent"*/ "@/components/Analytical/ChartComponent"
      ),
    EMUMonthly: () =>
      import(
        /* webpackChunkName: "Benchmarking_EMU"*/ "@/components/Analytical/EMUMonthly"
      ),
    EMUAnnual: () =>
      import(
        /* webpackChunkName: "Benchmarking_EMU"*/ "@/components/Analytical/EMUAnnual"
      ),
  },
  data() {
    return {
      emuData: {},
      mapList: [],
      visible: false,
      allExtData: {},
      summaryList: [],
      summaryObj: null,
      population: null,
      dqrResponse: null,
      regionCountList: [],
      configData: this.selectedData,
      isDataSet: false,
      isPrinting: false,
    };
  },
  computed: {
    // isBenchMarkFound() {
    //   let arr = this.sumArray;
    //   console.log(this.sumArray);
    //   let isFound = this.sumArray.find(
    //     (obj) => obj.summaryDetails?.[0]?.isBenchmark
    //   );
    //   console.log(isFound, "isBenchMarkFound");
    //   return isFound;
    // },
    updatedSize(){
      return !this.isGenerating ? '6' : '12'
    },
    sumArray() {
      let arr = this.summaryList;
      let cID = [];
      let isFound = this.configData
        ? this.configData.subTabs.find((s) =>
            this.$store.getters.getActiveTab.includes(s.id)
          )
        : null;
      let summary = this.configData
        ? this.configData.subTabs.find((s) => s.group === "SUMMARY")
        : null;
      if (summary) {
        summary.chartSetting.forEach((c) => {
          if (c.chartOptions.generateSummary) cID.push(c.chartOptions.cid);
        });
      }
      if (isFound) {
        arr = arr.filter((a) => a.id === isFound.id || a.priorityIndicator);
        if (!summary || (summary && isFound.id !== summary.id)) {
          isFound.chartSetting.forEach((c) => {
            if (c.chartOptions.generateSummary) cID.push(c.chartOptions.cid);
          });
        }
      }
      if (cID.length && arr.length) {
        arr.sort((a, b) => cID.indexOf(a.cid) - cID.indexOf(b.cid));
      }
      return arr;
    },
    regionCountArray() {
      let arr = this.regionCountList;
      let cID = [];
      let isFound = this.configData
        ? this.configData.subTabs.find((s) =>
            this.$store.getters.getActiveTab.includes(s.id)
          )
        : null;
      if (isFound) {
        arr = arr.filter((a) => a.id === isFound.id);
        isFound.chartSetting.forEach((c) => cID.push(c.chartOptions.cid));
      }
      if (cID.length) {
        arr.sort((a, b) => cID.indexOf(a.cid) - cID.indexOf(b.cid));
      }
      return arr;
    },
    emuCharts() {
      let isEMUCharts = false;
      if (this.selectedData) {
        this.selectedData.subTabs.forEach((s) => {
          s.chartSetting.forEach((c) => {
            if (c.chartOptions.isSavedData) {
              isEMUCharts = true;
            }
          });
        });
      }
      return isEMUCharts;
    },
    flagObj() {
      let obj = {};
      let isFound = this.regionCountList.filter((r) => r.generateFlag);
      if (isFound.length) {
        isFound.forEach((r) => {
          if (!obj[r.id]) {
            obj[r.id] = {
              value: null,
              messages: [],
            };
          }
          let isFound = r.summaryDetails.find((s) => s.priorityFlagIndicator);
          if (isFound && isFound.bBenchmark > 0) {
            obj[r.id].value = "flag";
            obj[r.id].messages = [
              this.$i18n.t("flagMsg", {
                benchmark: `<strong>${isFound.bBenchmark}</strong>`,
              }),
            ];
          } else if (isFound && isFound.bBenchmark <= 0) {
            obj[r.id].value = "no flag";
            obj[r.id].messages = [
              this.$i18n.t("noFlagMsg", {
                benchmark: `<strong>${isFound.bBenchmark}</strong>`,
              }),
            ];
          } else {
            obj[r.id].value = "error";
            obj[r.id].messages = [this.$i18n.t("noSum")];
          }
        });
      }
      let compareFlag = this.summaryList.filter((r) => r.compareFlag);
      let isCompareFound = null;
      if (compareFlag.length) {
        compareFlag = compareFlag[compareFlag.length - 1];
        isCompareFound = compareFlag.summaryDetails.find(
          (s) => s.priorityFlagIndicator
        );
      }
      if (isCompareFound) {
        let generateFlag = this.summaryList.filter((r) => r.generateFlag);
        if (generateFlag.length) {
          generateFlag.forEach((g) => {
            if (!obj[g.id]) {
              obj[g.id] = {
                value: null,
                messages: [],
              };
            }
            let isGenerateFound = g.summaryDetails.find(
              (s) => s.priorityFlagIndicator
            );
            if (isGenerateFound) {
              let gValue = isGenerateFound?.change?.split("%") || [0];
              let cValue = isCompareFound?.change?.split("%") || [0];
              if (
                (gValue[0] * 1 < 0 && cValue[0] * 1 < 0) ||
                (gValue[0] * 1 > 0 && cValue[0] * 1 > 0)
              ) {
                obj[g.id].value = "no flag";
                obj[g.id].messages = [
                  this.$i18n.t("noFlagMsgInd", {
                    indicator1: `<strong>${isGenerateFound.indicatorName} (${isGenerateFound.change})</strong>`,
                    indicator2: `<strong>${isCompareFound.indicatorName} (${isCompareFound.change})</strong>`,
                  }),
                ];
              } else {
                obj[g.id].value = "flag";
                obj[g.id].messages = [
                  this.$i18n.t("flagMsgInd", {
                    indicator1: `<strong>${isGenerateFound.indicatorName} (${isGenerateFound.change})</strong>`,
                    indicator2: `<strong>${isCompareFound.indicatorName} (${isCompareFound.change})</strong>`,
                  }),
                ];
              }
            } else {
              obj[g.id] = {
                value: "error",
                messages: [this.$i18n.t("noSum")],
              };
            }
          });
        }
      }
      return obj;
    },
  },
  watch: {
    flagObj(newValue) {
      this.$emit("flag", newValue);
    },
    emuCharts(newValue) {
      if (newValue) {
        this.getEMUData();
      }
    },
    selectedData: {
      handler(newValue) {
        this.summaryList = [];
        this.configData = newValue;
      },
      deep: true,
    },
    locationPeriod: {
      handler(newValue, oldValue) {
        if (
          (!oldValue && newValue.location) ||
          (oldValue &&
            (newValue.location !== oldValue.location ||
              newValue.periodType !== oldValue.periodType ||
              newValue.period !== oldValue.period))
        ) {
          this.summaryList = [];
          this.getGeoJson(newValue.location); //mixin function
          this.getEMUData();
        }
        this.mapValue = [];
      },
      deep: true,
    },
    "$store.getters.getActiveTab": function () {
      this.bubbleChart = "";
      if (
        ["emuMonthlyTab", "emuAnnualTab"].includes(
          this.$store.getters.getActiveTab
        )
      ) {
        let pType =
          this.$store.getters.getActiveTab === "emuMonthlyTab"
            ? "monthly"
            : "yearly";
        this.getEMUData(pType);
      }
    },
  },
  methods: {
    updateToolBar(updatedVal) {
      this.$emit("updateToolBar", updatedVal);
    },
    isMaps(mSetting) {
      let isMap = false;
      if (mSetting.length) {
        isMap = mSetting.find(
          (c) =>
            (c.chartOptions.isSavedData ||
              (c.chartOptions.dataMapping &&
                c.chartOptions.dataMapping.length)) &&
            !c.chartOptions.disable
        );
      }
      return isMap;
    },
    setExtData(level, obj) {
      this.allExtData[level] = obj;
    },
    setDQRResponse(val) {
      this.dqrResponse = val;
    },
    async getEMUData(periodType = this.locationPeriod.periodType) {
      let pData = null;
      let pe = this.locationPeriod.period;
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let aLevel = [levelID, subLevelID];

      if (!this.population && ["yearly"].includes(periodType)) {
        let key = this.generateKey("dqrModule");

        await service
          .getSavedConfig({ tableKey: key })
          .then(async (dqrModule) => {
            let isDataStore =
              dqrModule.data["emu"]["Background_Data"][
                "backgroundIndicators"
              ][0].bgDataSource === "Datastore";
            let typeKey =
              dqrModule.data["emu"][
                "Background_Data"
              ].FPWomenPopulation.toLowerCase();

            if (isDataStore) {
              try {
                pData = await service.getSavedConfig({
                  tableKey: `population_${typeKey}_${levelID}`,
                });
                pData =
                  typeof pData.data.rows == "string"
                    ? {
                        ...pData.data,
                        rows: decompress(JSON.parse(pData.data.rows)),
                      }
                    : pData.data;
                //pData.rows = pData.rows.filter((obj) => obj[1] == pe);
              } catch {
                console.log(
                  `Population data not found for population_${typeKey}_${levelID}...`
                );
              }
              try {
                let pData1 = await service.getSavedConfig({
                  tableKey: `population_${typeKey}_${subLevelID}`,
                });
                pData1 =
                  typeof pData1.data.rows == "string"
                    ? decompress(JSON.parse(pData1.data.rows))
                    : pData1.data.rows;
                //pData1 = pData1.filter((obj) => obj[1] == pe);
                pData.rows = pData.rows.concat(pData1);
              } catch {
                console.log(
                  `Population data not found for population_${typeKey}_${subLevelID}...`
                );
              }
            } else {
              this.isDataSet = true;
            }
          });
      }
      if (this.isDataSet) {
        let perArray = [];
        for (let i = 0; i < 10; i++) {
          let newPe = pe - i;
          if (!perArray.includes(newPe)) {
            perArray.push(newPe);
          }
        }
        let id =
          dqrModule.data["emu"]["Background_Data"]["backgroundIndicators"][0][
            "subIndicators"
          ][0]["selectedDE"][0]["id"];
        pData = await service.getIndicatorData(
          id,
          aLevel,
          location,
          perArray.join(";")
        );
        pData = pData.data;
      }
      if (pData) {
        this.population = pData;
      }
      if (
        this.preFetchData &&
        this.preFetchData[`${periodType}_${this.$i18n.locale}`]
      ) {
        this.$set(
          this.emuData,
          `${periodType}_${this.$i18n.locale}`,
          this.preFetchData[`${periodType}_${this.$i18n.locale}`]
        );
      }
      if (
        (!this.emuData[`${periodType}_${this.$i18n.locale}`] &&
          ["monthly", "yearly"].includes(periodType)) ||
        !this.$store.getters.getIsMonthlyEMUSet ||
        !this.$store.getters.getIsAnnualEMUSet
      ) {
        let configKey = null;
        if (periodType === "monthly") {
          configKey = `monthlyEMU_${this.$i18n.locale}`;
        }
        if (periodType === "yearly") {
          configKey = `annualEMU_${this.$i18n.locale}`;
        }
        let key = this.generateKey(configKey);

        service
          .getSavedConfig({ tableKey: key })
          .then((resp) => {
            this.$set(
              this.emuData,
              `${periodType}_${this.$i18n.locale}`,
              resp.data
            );
            this.$store.commit("setIsMonthlyEMUSet", true);
            this.$store.commit("setIsAnnualEMUSet", true);
          })
          .catch(() => {
            this.$set(
              this.emuData,
              `${periodType}_${this.$i18n.locale}`,
              "Error"
            );
          });
      }
    },
    summaryData(data) {
      let key = "summaryList";
      if (data.chartCalculation === "PERIOD_DIFF") {
        key = "regionCountList";
      }
      let isFound = this[key].findIndex((s) => s.cid === data.cid);
      if (isFound >= 0) {
        this.$set(this[key], isFound, data);
      } else {
        this.$set(this[key], this[key].length, data);
      }
    },
    setReportChart(data) {
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          chartObj: data.chartData,
          chartName: data.chartData?.title?.title || "",
          cid: [this.reportChartData.cid],
          errorText: data.errorText,
        });
      }
    },
    exportChart(type) {
      let chart = this.$refs.summaryContainer;
      console.log("chart", chart);
      
      
      if (type == "ppt") {
        import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
          async (pptxgen) => {
            this.$store.commit("setLoading", true);
            this.isPrinting = true;
            let pptx = new pptxgen.default();
            pptx.layout = "LAYOUT_WIDE";
            pptx.author = "Avenir Generic Tool";
            pptx.company = "Dure Technologies";
            pptx.subject = this.$i18n.t("summary_dashboard");
            pptx.title = this.$i18n.t("summary_dashboard");

            pptx.defineSlideMaster({
              title: "MASTER_SLIDE",
              background: { color: "FFFFFF" },
              objects: [
                {
                  text: {
                    text: "title",
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
                    text:
                      "LOCATION",
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
                    text:
                      "PERIOD",
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
                    text:
                      "DATE",
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
            });

            await domtoimage
              .toPng(chart)
              .then(function (dataUrl) {
                const slide = pptx.addSlide("MASTER_SLIDE");
                slide.addImage({
                  data: dataUrl,
                  x: 0,
                  y: 0,
                  w: "100%",
                  h: "90%",
                });
                this.$store.commit("setLoading", false);
                this.isPrinting = false;
              })
              .catch((error) => {
                console.error("Error converting DOM to PNG:", error);
                this.$store.commit("setLoading", false);
                this.isPrinting = false;
              });
              pptx.writeFile({ fileName: "DEMO" });
          }
        );
      } else if (type == "pdf") {
        setTimeout(async () => {
          this.$store.commit("setLoading", true);
          this.isPrinting = true;
          let options = {
            filename: "_" + this.$moment(new Date()).format("lll") + ".pdf",
            pagebreak: {
              mode: "avoid-all",
              before: ".before",
              avoid: ".after",
            },
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "l",
            },
          };

          await html2pdf()
            .set(options)
            .from(chart)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
              this.isPrinting = false;
              this.$store.commit("setLoading", false);
            })
            .save();
          }, 50);
      }
      this.isPrinting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.before {
  page-break-before: always !important;
}
.after {
  page-break-after: always !important;
  page-break-inside: avoid !important;
}
</style>
