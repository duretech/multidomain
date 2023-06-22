<template>
  <div class="summary-page-container" id="scrollTop">
    <div id="modal-anc">
      <template v-if="configData && !reportChartData">
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
        class="anc-charts tablemap-col2 newcolumntab grey-newborder"
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
          />
        </div>
        <div v-if="['emuAnnualTab'].includes($store.getters.getActiveTab)">
          <EMUAnnual
            :emuData="emuData"
            :dqrResponse="dqrResponse"
            :locationPeriod="locationPeriod"
            @setDQRResponse="setDQRResponse"
          />
        </div>
      </div>
      <b-row v-else class="modal-newac">
        <b-col
          sm="12"
          lg="6"
          class="tablemap-col1 pr-3 modal-content bg-map"
          v-if="
            !reportChartData && (sumArray.length || regionCountArray.length)
          "
        >
          <div class="border-greytheme mb-4">
            <div v-for="(obj, i) in sumArray" :key="'sumArray' + i">
              <b-row
                class="pt-1 pb-1 pl-3 greyborder px-10px"
                v-if="
                  obj.summaryDetails && obj.summaryDetails.length && i === 0
                "
              >
                <b-col cols="4"></b-col>
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
                <b-col class="table-heading pr-0" cols="2"
                  ><p class="fs-17-1920">{{ $t("benchmark") }}</p></b-col
                >
              </b-row>
              <b-row
                class="pt-1 pb-2 valueRow"
                v-for="(sDetails, i) in obj.summaryDetails"
                :key="'sumArrayDetails' + i"
              >
                <b-col class="table-heading pt-2 px-10px" cols="4"
                  ><p class="fs-17-1920">{{ sDetails.indicatorName }}</p></b-col
                >
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
                  <div class="summary-dot fs-17-1920" :class="sDetails.color">
                    {{ sDetails.change === null ? $t("NA") : sDetails.change }}
                  </div></b-col
                >
                <b-col cols="2" class="px-10px"
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
                  ><div class="summary-dot fs-17-1920" :class="sDetails.aColor">
                    {{
                      sDetails.aBenchmark === null
                        ? $t("NA")
                        : sDetails.aBenchmark
                    }}
                  </div></b-col
                >
                <b-col cols="4"
                  ><div class="summary-dot fs-17-1920" :class="sDetails.bColor">
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
        </b-col>
        <template v-if="configData">
          <template
            class="anc-charts tablemap-col2"
            v-for="(subTab, sInd) in configData.subTabs"
          >
            <template v-if="!reportChartData">
              <b-col
                sm="12"
                lg="6"
                class="tablemap-col1 pr-3 modal-content bg-map anc-indicatormap"
                :key="'map' + configData.id + subTab.id + sInd"
                v-show="$store.getters.getActiveTab.includes(subTab.id)"
              >
                <div class="border-greytheme">
                  <MapContainer
                    :subTab="subTab"
                    :emuData="emuData"
                    :allGeoJson="allGeoJson"
                    :preFetchData="preFetchData"
                    :locationPeriod="locationPeriod"
                    class="greyborder"
                  />
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
                  display: $store.getters.getActiveTab.includes(subTab.id)
                    ? 'block'
                    : 'none',
                }"
              >
                <ChartComponent
                  :subTab="subTab"
                  :emuData="emuData"
                  :chartData="chartData"
                  @setExtData="setExtData"
                  :allExtData="allExtData"
                  :population="population"
                  @summaryData="summaryData"
                  :preFetchData="preFetchData"
                  @setReportChart="setReportChart"
                  :locationPeriod="locationPeriod"
                  :reportChartData="reportChartData"
                  :backgroundData="subTab.backgroundData"
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

export default {
  props: ["selectedData", "preFetchData", "locationPeriod", "reportChartData"],
  mixins: [GeoJsonMixin, ScrollPageMixin],
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
    };
  },
  computed: {
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
      handler() {
        this.summaryList = [];
        this.getGeoJson(this.locationPeriod.location);
        this.getEMUData();
      },
      deep: true,
    },
    "$store.getters.getActiveTab": function () {
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
    setExtData(level, obj) {
      this.allExtData[level] = obj;
    },
    setDQRResponse(val) {
      this.dqrResponse = val;
    },
    async getEMUData(periodType = this.locationPeriod.periodType) {
      if (!this.population && ["yearly"].includes(periodType)) {
        let pe = this.locationPeriod.period;
        let loc = this.locationPeriod.location;
        let location = loc.split("/")[1];
        let levelID = loc.split("/")[0] * 1;
        let subLevelID = levelID + 1;
        let key = this.generateKey("dqrModule");

        let aLevel = [levelID, subLevelID];
        await service.getSavedConfig(key).then(async (dqrModule) => {
          let isDataStore =
            dqrModule.data["emu"]["Background_Data"]["backgroundIndicators"][0]
              .bgDataSource === "Datastore";
          let typeKey =
            dqrModule.data["emu"][
              "Background_Data"
            ].FPWomenPopulation.toLowerCase();
          let pData = null;
          if (isDataStore) {
            try {
              pData = await service.getSavedConfig(
                `population_${typeKey}_${levelID}`
              );
              pData =
                typeof pData.data.rows == "string"
                  ? {
                      ...pData.data,
                      rows: decompress(JSON.parse(pData.data.rows)),
                    }
                  : pData.data;
            } catch {
              console.log(
                `Population data not found for population_${typeKey}_${levelID}...`
              );
            }
            try {
              let pData1 = await service.getSavedConfig(
                `population_${typeKey}_${subLevelID}`
              );
              pData1 =
                typeof pData1.data.rows == "string"
                  ? decompress(JSON.parse(pData1.data.rows))
                  : pData1.data.rows;
              pData.rows = pData.rows.concat(pData1);
            } catch {
              console.log(
                `Population data not found for population_${typeKey}_${subLevelID}...`
              );
            }
          } else {
            let id =
              dqrModule.data["emu"]["Background_Data"][
                "backgroundIndicators"
              ][0]["subIndicators"][0]["selectedDE"][0]["id"];
            pData = await service.getIndicatorData(id, aLevel, location, pe);
            pData = pData.data;
          }
          if (pData) {
            this.population = pData;
          }
        });
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
        !this.emuData[`${periodType}_${this.$i18n.locale}`] &&
        ["monthly", "yearly"].includes(periodType)
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
          .getSavedConfig(key)
          .then((resp) => {
            this.$set(
              this.emuData,
              `${periodType}_${this.$i18n.locale}`,
              resp.data
            );
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
        });
      }
    },
  },
  created() {},
};
</script>
