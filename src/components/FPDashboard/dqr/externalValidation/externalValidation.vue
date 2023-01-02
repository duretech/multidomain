<template>
  <div class="m-t-20px dashboardchart-container" v-show="!reportChartData">
    <b-tabs
      content-class="mt-3 fs-19-1920"
      nav-class="border-none d-none"
      nav-wrapper-class="benchmarking-sub-tab"
      id="benchmarking-sub-tab"
    >
      <b-tab
        class="fs-19-1920"
        :title="$t('Injectable')"
        :active="activateSubTabs === 'Injectable'"
        @click="updateSubTab('Injectable')"
        v-if="externalValidation['Injectable'] && method1Disable"
      >
        <template>
          <chartComponent
            method="Injectable"
            :period="period"
            :periodScorecard="periodScorecard"
            :defaultLevelID="defaultLevelID"
            :defaultLocationID="defaultLocationID"
            :scorecardDefaultLocationID="scorecardDefaultLocationID"
            :subLevelID="subLevelID"
            :orgLevel="orgLevel"
            :externalValidation="externalValidation"
            @sendScore="score"
            @sendScoreBackground="scoreBackground"
            :scoreKey="key1"
            :locations="locationValue"
            :debugging="debugging"
            :debuggingLevel="debuggingLevel"
            :signOffActive="signOffActive"
            exportPosition="5"
            :periodType="periodType"
            key="Injectable"
            @sendEVLog="sendEVLogtoDqr"
            :reportChartData="reportChartData"
            @setReportChart="setReportChart"
            :childArr="childArr"
            :applicationFinalYear="applicationFinalYear"
          />
        </template>
      </b-tab>
      <b-tab
        class="fs-19-1920"
        :title="$t('IUD')"
        :active="activateSubTabs === 'IUD'"
        @click="updateSubTab('IUD')"
        v-if="externalValidation['IUD'] && method2Disable"
      >
        <template>
          <chartComponent
            method="IUD"
            :period="period"
            :periodScorecard="periodScorecard"
            :defaultLevelID="defaultLevelID"
            :defaultLocationID="defaultLocationID"
            :scorecardDefaultLocationID="scorecardDefaultLocationID"
            :subLevelID="subLevelID"
            :orgLevel="orgLevel"
            :externalValidation="externalValidation"
            @sendScore="score"
            @sendScoreBackground="scoreBackground"
            :scoreKey="key2"
            :locations="locationValue"
            :debugging="debugging"
            :debuggingLevel="debuggingLevel"
            :signOffActive="signOffActive"
            exportPosition="6"
            :periodType="periodType"
            key="IUD"
            @sendEVLog="sendEVLogtoDqr"
            :reportChartData="reportChartData"
            @setReportChart="setReportChart"
            :childArr="childArr"
            :applicationFinalYear="applicationFinalYear"
          />
        </template>
      </b-tab>
      <b-tab
        class="fs-19-1920"
        :title="$t('Implant')"
        :active="activateSubTabs === 'Implant'"
        @click="updateSubTab('Implant')"
        v-if="externalValidation['Implant'] && method3Disable"
      >
        <template>
          <chartComponent
            method="Implant"
            :period="period"
            :periodScorecard="periodScorecard"
            :defaultLevelID="defaultLevelID"
            :defaultLocationID="defaultLocationID"
            :scorecardDefaultLocationID="scorecardDefaultLocationID"
            :subLevelID="subLevelID"
            :orgLevel="orgLevel"
            :externalValidation="externalValidation"
            @sendScore="score"
            @sendScoreBackground="scoreBackground"
            :scoreKey="key3"
            :locations="locationValue"
            :debugging="debugging"
            :debuggingLevel="debuggingLevel"
            :signOffActive="signOffActive"
            exportPosition="7"
            :periodType="periodType"
            key="Implant"
            @sendEVLog="sendEVLogtoDqr"
            :reportChartData="reportChartData"
            @setReportChart="setReportChart"
            :childArr="childArr"
            :applicationFinalYear="applicationFinalYear"
          />
        </template>
      </b-tab>
    </b-tabs>
    <div
      class="text-center"
      v-if="!method1Disable && !method2Disable && !method3Disable"
    >
      <b-alert variant="info" show class="m-0">{{
        $t("rr_text5")
      }}</b-alert>
    </div>
  </div>
</template>
<script>
import chartComponent from "./chartComponent";

export default {
  props: [
    "key1",
    "key2",
    "key3",
    "activateSubTabs",
    "dqrResponse",
    "period",
    "periodScorecard",
    "defaultLevelID",
    "defaultLocationID",
    "scorecardDefaultLocationID",
    "subLevelID",
    "locationValue",
    "orgLevel",
    "debugging",
    "debuggingLevel",
    "signOffActive",
    "periodType",
    "reportChartData",
    "childArr",
    "applicationFinalYear",
  ],
  components: {
    chartComponent,
  },
  watch: {
    method1Disable(newValue) {
      if (!newValue) {
        this.score(this.key1, false, [], "Injectable");
      }
    },
    method2Disable(newValue) {
      if (!newValue) {
        this.score(this.key2, false, [], "IUD");
      }
    },
    method3Disable(newValue) {
      if (!newValue) {
        // console.log("sendScoreBackground disabled");
        this.score(this.key3, false, [], "Implant");
      }
    },
    locationValue(newValue) {
      if (newValue) {
        this.method1Disable = true;
        this.method2Disable = true;
        this.method3Disable = true;
        this.$nextTick(() => this.checkDisableTab());
      }
    },
    period(newValue) {
      if (newValue) {
        this.method1Disable = true;
        this.method2Disable = true;
        this.method3Disable = true;
        this.$nextTick(() => this.checkDisableTab());
      }
    },
    scorecardDefaultLocationID(newValue) {
      if (newValue) {
        if (!this.method1Disable) {
          this.scoreBackground(this.key1, false);
        }
        if (!this.method2Disable) {
          this.scoreBackground(this.key2, false);
        }
        if (!this.method3Disable) {
          this.scoreBackground(this.key3, false);
        }
      }
    },
  },
  data() {
    return {
      externalValidation: {},
      method1Disable: true,
      method2Disable: true,
      method3Disable: true,
    };
  },
  methods: {
    sendEVLogtoDqr(evData) {
      this.$emit("sendLog", evData);
    },
    updateSubTab(subTab) {
      this.$emit("updateSubTab", subTab);
    },
    score(key, value, exportArr, method = null) {
      this.$emit(
        "sendScore",
        key,
        { value: value, key: key },
        exportArr,
        method
      );
    },
    scoreBackground(key, value) {
      this.$emit("sendScoreBackground", key, { value: value, key: key });
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
    checkDisableTab() {
      // console.log("called")
      this.method1Disable =
        this.externalValidation["Injectable"] &&
        typeof this.externalValidation["Injectable"].disableChart !==
          "undefined"
          ? !this.externalValidation["Injectable"].disableChart
          : false;
      // console.log("called", this.method1Disable.toString())
      this.method2Disable =
        this.externalValidation["IUD"] &&
        typeof this.externalValidation["IUD"].disableChart !== "undefined"
          ? !this.externalValidation["IUD"].disableChart
          : false;
      this.method3Disable =
        this.externalValidation["Implant"] &&
        typeof this.externalValidation["Implant"].disableChart !== "undefined"
          ? !this.externalValidation["Implant"].disableChart
          : false;
    },
  },
  created() {
    this.externalValidation = this.dqrResponse.external_validation
      ? this.dqrResponse.external_validation
      : {};
    if (this.dqrResponse.external_validation) {
      this.checkDisableTab();
    }
  },
};
</script>
<style lang="scss" scoped>
.benchmarking-sub-tab {
  .nav-tabs {
    .nav-link {
      &:hover,
      &:focus {
        border-color: none !important;
      }
    }
  }
}
</style>
