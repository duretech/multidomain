<template>
  <div class="summarydashboard-page" v-show="!reportChartData">
    <Header
      :headerConditions="{
        home: true,
        profile: true,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    />
    <div class="summary">
      <b-container fluid class="pl-0">
        <SummaryPage
          :showTrend="showTrend"
          :configData="configData"
          :preFetchData="preFetchData"
          :showSeasonal="showSeasonal"
          :showRegional="showRegional"
          @setReportChart="setReportChart"
          :locationPeriod="locationPeriod"
          :reportChartData="reportChartData"
          v-if="configData && locationPeriod"
          @updateToolBar="updateToolBar"
        />
      </b-container>
    </div>
    <Footer
      :showTrend="showTrend"
      @getViewType="getViewType"
      :showSeasonal="showSeasonal"
      :showRegional="showRegional"
      :updateLocPer="updateLocPer"
      :globalPeriodData="globalPeriodData"
      :IDLocationPeriod="IDLocationPeriod"
      @getLocationPeriod="getLocationPeriod"
    />
  </div>
</template>
<script>
import service from "@/service";
import ResetMenuMixin from "@/helpers/ResetMenuMixin";
import SummaryPage from "@/components/Summary/SummaryPage.vue";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  props: [
    "activeTab",
    "preFetchData",
    "reportPeriod",
    "reportChartData",
    "IDLocationPeriod",
    "reportSubLevelID",
    "reportPeriodType",
    "reportConfigData",
    "reportLocationValue",
    "reportDefaultLevelID",
    "reportDefaultLocationID",
  ],
  components: {
    SummaryPage,
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
      showTrend: false,
      configData: null,
      updateLocPer: null,
      showSeasonal: false,
      showRegional: false,
      locationPeriod: null,
      globalPeriodData: null,
    };
  },
  watch: {
    /**
     * @author Ravindra Bagul
     * @description Watch the sidebar navigation option change.
     * * Used to enable/disable the trend/regional/seasonal charts.
     * @param newValue - sidebar navigation option
     * @returns null
     */
    activeComponent(newValue) {
      if (newValue === "sd-summary") {
        this.showRegional = false;
        this.showSeasonal = false;
        this.showTrend = false;
      } else {
        this.showRegional = true;
        this.showSeasonal = true;
        this.$nextTick(() => {
          this.showTrend = true;
        });
      }
    },
  },
  computed: {
    activeComponent() {
      return this.$store.getters.getActiveTab;
    },
  },
  methods: {
    /**
     * @author Ravindra Bagul
     * @description Emitted function from SummaryPage component.
     * * Used to send the generated chart to report component.
     * @param obj - chart object
     * @returns null
     */
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted function from Toolbar component.
     * * Used to get the selected filters value from the toolbar.
     * @param locPeObj - selected value object
     * @returns null
     */
    getLocationPeriod(locPeObj) {
      if (this.activeComponent === "sd-summary") {
        this.showRegional = false;
        this.showSeasonal = false;
        this.showTrend = false;
      }
      this.locationPeriod = this.reportChartData
        ? {
            ...locPeObj,
            location: this.reportLocationValue,
            period: this.reportPeriod,
            periodType: this.reportPeriodType,
          }
        : locPeObj;
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted function from Toolbar component.
     * * Used to display the charts as per selected type.
     * @param type - chart type
     * @param value - boolean flag
     * @returns null
     */
    getViewType(type, value) {
      if (type === "trend") {
        this.showTrend = value;
      }
      if (type === "seasonal") {
        this.showSeasonal = value;
      }
      if (type === "regional") {
        this.showRegional = value;
      }
    },
    /**
     * @author Ravindra Bagul
     * @description Get the summaryDashboard.json datastore file
     * @param null
     * @returns null
     */
    getConfigData() {
      if (!this.reportChartData) {
        this.$store.commit("setLoading", true);
      }
      let key = this.generateKey("summaryDashboard");
      let namespace = this.reportChartData
        ? this.reportChartData.selectedDashboard
        : "";
      service
        .getSavedConfig({ tableKey: key, namespace: namespace })
        .then((response) => {
          this.configData = response.data;
          this.$emit("getConfigData", response.data); //* Emit the config data to Sidebar component to generate sidebar navigation options
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          console.log("Config not found...");
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err); //* In case of network error, shows the popup to refresh and fetch the summaryDashboard.json datastore file
        });
    },
    updateToolBar(updatedVal) {
      this.updateLocPer = updatedVal;
    },
  },
  async created() {
    if (!this.reportChartData) {
      this.$store.commit("setActiveTab", "sd-summary"); //* Default sidebar navigation option selector
    }
    //Select the sidebar navigation option as selected from the Integrated dashboard
    if (this.activeTab) {
      this.$nextTick(() => {
        this.$store.commit("setActiveTab", this.activeTab);
      });
    }
    let namespace = "";
    if (this.reportChartData) {
      namespace = this.reportChartData.selectedDashboard;
    }
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors(namespace).period.Period; //Get period from global factors
    //Condition to call this component from Report section vs direct component visit
    if (
      !this.reportChartData ||
      (this.reportChartData && !this.reportConfigData)
    ) {
      this.getConfigData();
    } else {
      this.configData = this.reportConfigData;
    }
  },
};
</script>

<style scoped></style>