<template>
  <div class="m-t-20px dashboardchart-container px-0" v-show="!reportChartData">
    <b-tabs
      nav-class="border-none fs-19-1920 d-none"
      nav-wrapper-class="benchmarking-sub-tab"
      id="benchmarking-sub-tab"
    >
      <b-tab
        content-class="fs-19-1920"
        :title="$t('Reporting Rate (Actual)')"
        :active="activateSubTabs === 'reportingActual'"
        @click="updateSubTab('reportingActual')"
      >
        <!-- v-if="period && locationValue" -->
        <reportingRate
          filters="Reporting Rate (Actual)"
          contName="actual"
          :activeTab="activeTab"
          :periodValue="period"
          :periodScorecard="periodScorecard"
          :locations="locationValue"
          :sourceValue="source"
          @sendScore="score"
          @sendScoreBackground="scoreBackground"
          :scoreKey="key1"
          :defaultLevelID="defaultLevelID"
          :defaultLocationID="defaultLocationID"
          :scorecardDefaultLocationID="scorecardDefaultLocationID"
          :subLevelID="subLevelID"
          @drilldownLocation="getDrillDownLocation"
          :dqrResponse="dqrResponse"
          :globalResponse="globalResponse"
          :debugging="debugging"
          :debuggingLevel="debuggingLevel"
          exportPosition="1"
          :signOffActive="signOffActive"
          :periodType="periodType"
          :applicationFinalYear="applicationFinalYear"
          :reportChartData="reportChartData"
          @setReportChart="setReportChart"
          key="actual"
          @sendlog="sendData"
        />
      </b-tab>
      <b-tab
        content-class="fs-19-1920"
        :title="$t('Reporting Rate (On Time)')"
        :active="activateSubTabs === 'reportingOnTime'"
        @click="updateSubTab('reportingOnTime')"
      >
        <!-- v-if="period && locationValue" -->
        <reportingRate
          filters="Reporting Rate (On Time)"
          contName="ontime"
          :activeTab="activeTab"
          :periodValue="period"
          :periodScorecard="periodScorecard"
          :locations="locationValue"
          :sourceValue="source"
          @sendScore="score"
          @sendScoreBackground="scoreBackground"
          :scoreKey="key2"
          :defaultLevelID="defaultLevelID"
          :defaultLocationID="defaultLocationID"
          :scorecardDefaultLocationID="scorecardDefaultLocationID"
          :subLevelID="subLevelID"
          @drilldownLocation="getDrillDownLocation"
          :dqrResponse="dqrResponse"
          :globalResponse="globalResponse"
          :debugging="debugging"
          :debuggingLevel="debuggingLevel"
          exportPosition="2"
          :signOffActive="signOffActive"
          :periodType="periodType"
          :applicationFinalYear="applicationFinalYear"
          :reportChartData="reportChartData"
          @setReportChart="setReportChart"
          key="ontime"
          @sendlog="sendData"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import reportingRate from "./reportingRate.vue";

export default {
  props: [
    "key1",
    "key2",
    "activeTab",
    "activateSubTabs",
    "dqrResponse",
    "globalResponse",
    "period",
    "periodScorecard",
    "defaultLevelID",
    "defaultLocationID",
    "scorecardDefaultLocationID",
    "subLevelID",
    "locationValue",
    "source",
    "debugging",
    "debuggingLevel",
    "signOffActive",
    "periodType",
    "applicationFinalYear",
    "reportChartData",
  ],
  components: {
    reportingRate,
  },
  watch: {},
  data() {
    return {};
  },
  methods: {
    sendData(logData) {
      this.$emit("sendDatatodqr", logData);
    },
    updateSubTab(subTab) {
      this.$emit("updateSubTab", subTab);
    },
    getDrillDownLocation(locationID, level) {
      // console.log(locationID)
      this.$emit("drilldownLocation", level + "/" + locationID);
    },
    score(key, value, exportArr = []) {
      this.$emit("sendScore", key, { value: value, key: key }, exportArr);
    },
    scoreBackground(key, value) {
      this.$emit("sendScoreBackground", key, { value: value, key: key });
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
  },
};
</script>
<style scoped lang="scss">
.outlier_scrollbar {
  max-height: 150px;
  overflow-y: auto;
}

.outlier_wrapper_scrollbar {
  max-height: 350px;
  overflow-y: auto;
}

.b-table-sticky-header {
  max-height: 400px;
}

.chartType {
  padding: 5px;

  &.active {
    background-color: #000;
    color: #fff;
  }
}

.chart_types {
  &:focus {
    outline: none;
  }
}
</style>
