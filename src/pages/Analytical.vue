<template>
  <div class="analytic-page" v-show="!reportChartData">
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
    <div
      class="analytic analytic-section"
      ref="main"
      :class="{ wide: this.$store.getters.getViewType === 'wide' }"
    >
      <b-container fluid>
        <DynamicAnalytical
          @flag="flag"
          :selectedData="selectedData"
          :preFetchData="preFetchData"
          @updateToolBar="updateToolBar"
          :locationPeriod="locationPeriod"
          @setReportChart="setReportChart"
          :reportChartData="reportChartData"
        />
        <!-- v-if="configData && locationPeriod" -->
      </b-container>
    </div>
    <Footer
      :updateLocPer="updateLocPer"
      :globalPeriodData="globalPeriodData"
      @getLocationPeriod="getLocationPeriod"
    />
  </div>
</template>
<script>
import service from "@/service";
import ResetMenuMixin from "@/helpers/ResetMenuMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import DynamicAnalytical from "@/components/Analytical/DynamicAnalytical.vue";

export default {
  props: [
    "reportPeriod",
    "preFetchData",
    "reportChartData",
    "reportConfigData",
    "reportPeriodType",
    "reportSubLevelID",
    "reportLocationValue",
    "reportDefaultLevelID",
    "reportDefaultLocationID",
  ],
  components: {
    DynamicAnalytical,
  },
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
      updateLocPer: null,
      locationPeriod: null,
      globalPeriodData: null,
    };
  },
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
  watch: {},
  methods: {
    updateToolBar(updatedVal) {
      this.updateLocPer = updatedVal;
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
      this.$emit("setLocationPeriod", this.locationPeriod);
    },
    flag(flagDetails) {
      this.$emit("flag", flagDetails);
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
    getConfigData() {
      if (!this.reportChartData) {
        this.$store.commit("setLoading", true);
      }
      let key = this.generateKey("analyticalDashboard");
      let namespace = this.reportChartData
        ? this.reportChartData.selectedDashboard
        : "";
      service
        .getSavedConfig({ tableKey: key, namespace: namespace })
        .then((response) => {
          this.configData = response.data;
          this.$emit("getConfigData", response.data);
          this.setTab();
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          console.log("Config not found...");
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
    setTab() {
      let tabInd = 0,
        subTabInd = 0;
      if (this.reportChartData) {
        let isTab = this.configData.findIndex(
          (t) => t.id === this.reportChartData.selectedCategory
        );
        if (isTab >= 0) {
          tabInd = isTab;
          let isSubTab = this.configData[isTab].subTabs.findIndex(
            (t) => t.id === this.reportChartData.selectedSource
          );
          if (isSubTab >= 0) {
            subTabInd = isSubTab;
          }
        }
      }
      if (this.configData?.length && !this.activeTab) {
        this.$store.commit(
          "setActiveTab",
          `${this.configData[tabInd].group}-${this.configData[tabInd].id}-${this.configData[tabInd].subTabs[subTabInd].id}`
        );
      }
    },
  },

  created() {
    //this.$store.commit("setActiveTab", "ad-summary");
    this.$store.commit("setModuleName", this.$i18n.t("analytical_dashboard"));
    if (this.activeTab) {
      this.$store.commit("setActiveTab", this.activeTab);
    } else {
      // this.$store.commit(
      // 	"setActiveTab",
      // 	"AnalyticalDashboard--ANC--OVITY6LcozwdOIiR"
      // );
    }
    let namespace = "";
    if (this.reportChartData) {
      namespace = this.reportChartData.selectedDashboard;
    }
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors(namespace).period.Period;
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
