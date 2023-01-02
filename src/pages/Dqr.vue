<template>
  <div class="dqr-page" v-show="!reportChartData">
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    />
    <div>
      <dqr
        :sideMenu="sideMenu"
        :dqrResponse="dqrResponse"
        :selectedData="selectedData"
        @updatedConfig="updatedConfig"
        :locationPeriod="locationPeriod"
        :reportChartData="reportChartData"
        @setReportChart="setReportChart"
      />
      <!-- v-if="locationPeriod" -->
    </div>
    <Footer
      v-if="
        !['emuMonthlyTab', 'emuAnnualTab'].includes(
          this.$store.getters.getActiveTab
        )
      "
      :globalPeriodData="globalPeriodData"
      @getLocationPeriod="getLocationPeriod"
    />
  </div>
</template>
<script>
import service from "@/service";
import dqr from "@/components/DQR/dqr";
import ResetMenuMixin from "@/helpers/ResetMenuMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    dqr,
  },
  props: [
    "sideMenu",
    "activeTab",
    "reportPeriod",
    "reportLocationValue",
    "reportDefaultLevelID",
    "reportDefaultLocationID",
    "reportSubLevelID",
    "reportPeriodType",
    "reportChartData",
    "reportConfigData",
  ],
  mixins: [
    ResetMenuMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      configData: null,
      dqrResponse: null,
      locationPeriod: {},
      globalPeriodData: {},
    };
  },
  watch: {},
  computed: {
    selectedData() {
      let id = this.$store.getters.getActiveTab.split("-");
      let data =
        this.configData && this.configData.length
          ? this.configData.find((c) => c.group === id[0] && c.id === id[1])
          : null;
      return data ? data : null;
    },
  },
  methods: {
    setReportChart(obj) {
      this.$emit("setReportChart", {
        chartObj: obj.chartData,
        chartName: obj.chartData?.title?.title || "",
        showLabels: obj.showLabels,
        r2: obj.r2,
        cid: [this.reportChartData.cid],
      });
    },
    getLocationPeriod(locPeObj) {
      this.locationPeriod = this.reportChartData
        ? {
            ...locPeObj,
            location: this.reportLocationValue,
            period: this.reportPeriod,
            periodType: this.reportPeriodType,
          }
        : locPeObj;
    },
    updatedConfig(configData) {
      this.configData = configData;
    },
    getConfigData() {
      let key1 = this.generateKey("dqrModule");

      service
        .getSavedConfig(key1)
        .then((dqrResponse) => {
          this.dqrResponse = dqrResponse.data;
          //Before destroy we need to reset the value
          this.$emit("getConfigDataFP", {
            data: dqrResponse.data,
            module: "dqr",
          });
        })
        .catch(() => {
          console.log("DQR module getConfig() - dqrModule response failed");
        });

      let key = this.generateKey("dqrDashboard");
      let namespace = this.reportChartData
        ? this.reportChartData.selectedDashboard
        : "";
      service
        .getSavedConfig(key, false, namespace)
        .then((response) => {
          this.configData = response.data;
          this.$emit("getConfigData", response.data);
          this.setTab();
        })
        .catch(() => {
          console.log("Config not found...");
        });
    },
    setTab() {
      let tabInd = 0;
      if (this.reportChartData) {
        let isTab = this.configData.findIndex(
          (t) => t.id === this.reportChartData.selectedCategory
        );
        if (isTab >= 0) {
          tabInd = isTab;
        }
      }
      if (this.configData.length && !this.activeTab) {
        this.$store.commit(
          "setActiveTab",
          `${this.configData[tabInd].group}-${this.configData[tabInd].id}-dqr-summary`
        );
      }
    },
  },
  async created() {
    if (this.activeTab && !this.reportChartData) {
      this.$store.commit("setActiveTab", this.activeTab);
    }
    if (this.reportChartData) {
      let namespace = this.reportChartData
        ? this.reportChartData.selectedDashboard
        : "";
      let key = this.generateKey("globalFactors");
      await service
        .getSavedConfig(key, false, namespace)
        .then((response) => {
          this.$store.commit("setGlobalFactors", {
            payload: response.data,
          }); // Set the global factors in store
        })
        .catch(() => {
          console.log("Failed in getGlobalFactors()...");
        });
    }
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
    if (
      !this.reportChartData ||
      (this.reportChartData && !this.reportConfigData)
    ) {
      this.getConfigData();
    } else {
      this.configData = this.reportConfigData;
      this.setTab();
    }
  },
};
</script>
<style></style>