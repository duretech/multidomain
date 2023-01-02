<template>
  <div class="summary-page-container" id="scrollTop">
    <template v-if="configData && !reportChartData">
      <div
        v-for="(subTab, sInd) in configData.subTabs"
        :key="'tabSummary' + configData.id + subTab.id + sInd"
      >
        <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
          <TabSummary
            :content="subTab.categoryInfo"
            :contKey="configData.id + subTab.id"
          />
        </div>
      </div>
    </template>
    <div
      class="anc-charts tablemap-col2"
      v-if="
        ['emuMonthlyTab', 'emuAnnualTab'].includes($store.getters.getActiveTab)
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
    <b-row id="modal-anc" v-else>
      <b-col
        class="tablemap-col1 pr-4 modal-content bg-map"
        sm="12"
        lg="6"
        v-if="!reportChartData"
      >
        <div v-for="(obj, i) in sumArray" :key="'sumArray' + i">
          <b-row
            class="pt-1 pb-1 pl-3"
            v-if="obj.summaryDetails && obj.summaryDetails.length && i === 0"
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
              ><p class="fs-17-1920">{{ $t("change%") }}</p></b-col
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
            <b-col class="table-heading pt-2" cols="4"
              ><p class="fs-17-1920">{{ sDetails.indicatorName }}</p></b-col
            >
            <b-col cols="2"
              ><div class="summary-dot fs-17-1920">
                {{ sDetails.currValue === null ? "NA" : sDetails.currValue }}
              </div></b-col
            >
            <b-col cols="2"
              ><div class="summary-dot fs-17-1920">
                {{ sDetails.prevValue === null ? "NA" : sDetails.prevValue }}
              </div></b-col
            >
            <b-col cols="2">
              <div class="summary-dot fs-17-1920" :class="sDetails.color">
                {{ sDetails.change === null ? "NA" : sDetails.change }}
              </div></b-col
            >
            <b-col cols="2"
              ><div class="summary-dot fs-17-1920">
                {{ sDetails.benchmark === null ? "NA" : sDetails.benchmark }}
              </div></b-col
            >
          </b-row>
        </div>
        <div
          v-for="(region, i) in regionCountArray"
          :key="'regionCountArray' + i"
        >
          <b-row class="pt-1 pb-1 pl-3" v-if="region.summaryDetails && i === 0">
            <b-col cols="4"></b-col>
            <b-col class="table-heading pr-0" cols="4"
              ><p class="fs-17-1920">
                # Counties Moving in the same direction as national trend
              </p></b-col
            >
            <b-col class="table-heading pr-0" cols="4"
              ><p class="fs-17-1920">
                # Counties Moving in the opposite direction of national trend
              </p></b-col
            >
          </b-row>
          <b-row
            class="pt-1 pb-2 valueRow"
            v-for="(sDetails, i) in region.summaryDetails"
            :key="'regionCountArrayDetails' + i"
          >
            <b-col class="table-heading pt-2" cols="4"
              ><p class="fs-17-1920">{{ sDetails.indicatorName }}</p></b-col
            >
            <b-col cols="4"
              ><div class="summary-dot fs-17-1920" :class="sDetails.aColor">
                {{ sDetails.aBenchmark === null ? "NA" : sDetails.aBenchmark }}
              </div></b-col
            >
            <b-col cols="4"
              ><div class="summary-dot fs-17-1920" :class="sDetails.bColor">
                {{ sDetails.bBenchmark === null ? "NA" : sDetails.bBenchmark }}
              </div></b-col
            >
          </b-row>
        </div>
        <div class="anc-map">
          <template v-if="configData">
            <div
              v-for="(subTab, sInd) in configData.subTabs"
              :key="'map' + configData.id + subTab.id + sInd"
            >
              <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
                <!-- <div v-if="$store.getters.getActiveTab.includes(subTab.id)"> -->
                <MapContainer
                  :subTab="subTab"
                  :emuData="emuData"
                  :allGeoJson="allGeoJson"
                  @getGeoJson="getGeoJson"
                  :locationPeriod="locationPeriod"
                />
              </div>
            </div>
          </template>
        </div>
      </b-col>
      <b-col class="anc-charts tablemap-col2" sm="12" lg="6">
        <template v-if="configData">
          <div
            v-for="(subTab, sInd) in configData.subTabs"
            :key="'subTabs' + configData.id + subTab.id + sInd"
          >
            <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
              <!-- <div v-if="$store.getters.getActiveTab.includes(subTab.id)"> -->
              <template v-for="chartData in subTab.chartSetting">
                <div
                  v-if="
                    !reportChartData ||
                    (reportChartData &&
                      reportChartData.selectedSource === subTab.id &&
                      reportChartData.cid.split('/')[1] ===
                        chartData.chartOptions.cid)
                  "
                  :key="
                    'chart-' +
                    configData.id +
                    subTab.id +
                    chartData.chartOptions.cid
                  "
                >
                  <ChartComponent
                    :subTab="subTab"
                    :emuData="emuData"
                    :chartData="chartData"
                    @summaryData="summaryData"
                    @setReportChart="setReportChart"
                    :locationPeriod="locationPeriod"
                    :reportChartData="reportChartData"
                  />
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import service from "@/service";
import MapContainer from "./MapContainer.vue";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import basicChartConfig from "@/config/basicChartConfig.js";
import HighChartComponent from "@/components/Highcharts/HighChartComponentDynamic";

export default {
  props: ["selectedData", "locationPeriod", "reportChartData"],
  mixins: [ScrollPageMixin],
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
    HighChartComponent,
  },
  data() {
    return {
      emuData: {},
      mapList: [],
      visible: false,
      allGeoJson: {},
      summaryList: [],
      summaryObj: null,
      dqrResponse: null,
      regionCountList: [],
      configData: this.selectedData,
      placeholderObj: basicChartConfig,
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
              `<strong>Flag:</strong> <strong>${isFound.bBenchmark}</strong> sub-national areas are moving in a different direction than the national trend in priority indicator`,
            ];
          } else if (isFound && isFound.bBenchmark <= 0) {
            obj[r.id].value = "no flag";
            obj[r.id].messages = [
              `<strong>No Flag:</strong> <strong>${isFound.bBenchmark}</strong> sub-national areas are moving in a different direction than the national trend in priority indicator`,
            ];
          } else {
            obj[r.id].value = "error";
            obj[r.id].messages = [`Summary not generated`];
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
              let gValue = isGenerateFound.change.split("%");
              let cValue = isCompareFound.change.split("%");
              if (
                (gValue[0] * 1 < 0 && cValue[0] * 1 < 0) ||
                (gValue[0] * 1 > 0 && cValue[0] * 1 > 0)
              ) {
                obj[g.id].value = "no flag";
                obj[g.id].messages = [
                  `<strong>No Flag:</strong> The <strong>${isGenerateFound.indicatorName} (${isGenerateFound.change})</strong> is moving in a same direction than the priority indicator <strong>${isCompareFound.indicatorName} (${isCompareFound.change})</strong>`,
                ];
              } else {
                obj[g.id].value = "flag";
                obj[g.id].messages = [
                  `<strong>Flag:</strong> The <strong>${isGenerateFound.indicatorName} (${isGenerateFound.change})</strong> is moving in a different direction than the priority indicator <strong>${isCompareFound.indicatorName} (${isCompareFound.change})</strong>`,
                ];
              }
            } else {
              obj[g.id] = {
                value: "error",
                messages: [`Summary not generated`],
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
    setDQRResponse(val) {
      this.dqrResponse = val;
    },
    getEMUData(periodType = this.locationPeriod.periodType) {
      if (
        !this.emuData[periodType] &&
        ["monthly", "yearly"].includes(periodType)
      ) {
        let configKey = null;
        if (periodType === "monthly") {
          configKey = "monthlyEMU";
        }
        if (periodType === "yearly") {
          configKey = "annualEMU";
        }
        let key = this.generateKey(configKey);

        service.getSavedConfig(key).then((resp) => {
          this.$set(this.emuData, periodType, resp.data);
        });
      }
    },
    getGeoJson(loc, obj) {
      this.allGeoJson[loc] = obj;
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
