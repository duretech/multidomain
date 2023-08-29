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
        :preFetchData="preFetchData"
        :selectedData="selectedData"
        @updatedConfig="updatedConfig"
        @updateToolBar="updateToolBar"
        :locationPeriod="locationPeriod"
        :reportChartData="reportChartData"
        @setReportChart="setReportChart"
      />
    </div>
    <Footer
      v-if="
        !['emuMonthlyTab', 'emuAnnualTab'].includes(
          this.$store.getters.getActiveTab
        )
      "
      :updateLocPer="updateLocPer"
      :IDLocationPeriod="IDLocationPeriod"
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
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    dqr,
  },
  props: [
    "sideMenu",
    "activeTab",
    "preFetchData",
    "reportPeriod",
    "IDLocationPeriod",
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
    ReFetchConfigMixin,
    UsesAnalyticsMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      configData: null,
      dqrResponse: null,
      updateLocPer: null,
      locationPeriod: {},
      globalPeriodData: {},
    };
  },
  watch: {},
  computed: {
    selectedData() {
      let data = null;
      if (this.reportChartData) {
        if (this.configData) {
          let isTab = this.configData.findIndex(
            (t) => t.id === this.reportChartData.selectedCategory
          );
          if (isTab >= 0) {
            data = this.configData[isTab];
          }
        }
      } else {
        let id = this.$store.getters.getActiveTab.split("-");
        data =
          this.configData && this.configData.length
            ? this.configData.find((c) => c.group === id[0] && c.id === id[1])
            : null;
      }
      return data ? data : null;
    },
  },
  methods: {
    updateToolBar(updatedVal) {
      this.updateLocPer = updatedVal;
    },
    setReportChart(obj) {
      this.$emit("setReportChart", {
        chartObj: obj.chartData,
        chartName: obj.chartData?.title?.title || "",
        showLabels: obj.showLabels,
        r2: obj.r2,
        cid: [this.reportChartData.cid],
        errorText: obj.errorText,
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
      if (this.$store.getters.getNamespace.includes("_fp-dashboard")) {
        let key1 = this.generateKey("dqrModule");
        service
          .getSavedConfig({ tableKey: key1 })
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
      }
      let key = this.generateKey("dqrDashboard");
      let namespace = this.reportChartData
        ? this.reportChartData.selectedDashboard
        : "";
      service
        .getSavedConfig({ tableKey: key, namespace: namespace })
        .then((response) => {
          this.configData = response.data;
          this.$emit("getConfigData", response.data);
          this.setTab();
        })
        .catch((err) => {
          console.log("Config not found...");
          this.reFetchConfig(err);
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
        .getSavedConfig({ tableKey: key, namespace: namespace })
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
      // this.setTab();
    }
  },
};
</script>
<style></style>