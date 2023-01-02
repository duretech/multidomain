<template>
  <div class="m-t-20px dashboardchart-container" v-show="!reportChartData">
    <b-tabs
      content-class="mt-3 "
      nav-class="border-none fs-19-1920 d-none"
      nav-wrapper-class="benchmarking-sub-tab"
      id="benchmarking-sub-tab"
    >
      <b-tab
        content-class="fs-19-1920"
        :title="$t('aggregate')"
        :active="activateSubTabs === 'Aggregate'"
        @click="updateSubTab('Aggregate')"
        v-if="aggregate1Disable || aggregate2Disable"
      >
        <template>
          <aggregateTab
            v-if="internalValidationResponse"
            :method="selectedMethod"
            :defaultLocationID="defaultLocationID"
            :scorecardDefaultLocationID="scorecardDefaultLocationID"
            :internalValidationResponse="internalValidationResponse"
            @sendScore="score"
            @sendScoreBackground="scoreBackground"
            :scoreKey="key1"
            :derivedConfig="derivedConfig"
            :cypFactors="oCypFactors"
            @drilldownLocation="getDrilldownLocation"
            :aggregate1Disable="aggregate1Disable"
            :aggregate2Disable="aggregate2Disable"
            exportPosition="3"
            :signOffActive="signOffActive"
            :period="period"
            :periodScorecard="periodScorecard"
            :categoryInfo="aggregateCatInfo"
            :periodType="periodType"
            :standardDeviation="standardDeviation"
            :internalValidationResponseBackground="
              internalValidationResponseBackground
            "
            :reportChartData="reportChartData"
            @setReportChart="setReportChart"
          />
          <PlaceholderChart v-if="!isDataFetched" />
          <div class="mt-3 row">
            <div class="col-12">
              <div class="text-center m-t-20px" v-if="noDataText">
                <b-alert variant="info" show class="m-0"
                  ><h5 class="m-0">{{ noDataText }}</h5></b-alert
                >
              </div>
            </div>
          </div>
        </template>
      </b-tab>
      <b-tab
        content-class="fs-19-1920"
        :title="$t('method')"
        :active="activateSubTabs === 'Method'"
        @click="updateSubTab('Method')"
        v-if="method1Disable || method2Disable"
      >
        <template>
          <methodTab
            v-if="internalValidationResponse"
            :internalValidationResponse="internalValidationResponse"
            :method="selectedMethod"
            :conf="aMethodConfig"
            :confMethod="aMethodConfigMethod"
            @sendScore="score"
            @sendScoreBackground="scoreBackground"
            :scoreKey="key2"
            :derivedConfig="derivedConfig"
            :cypFactors="oCypFactors"
            exportPosition="4"
            :signOffActive="signOffActive"
            :period="period"
            :periodScorecard="periodScorecard"
            :defaultLocationID="defaultLocationID"
            :scorecardDefaultLocationID="scorecardDefaultLocationID"
            :method1Disable="method1Disable"
            :method2Disable="method2Disable"
            :categoryInfo="methodCatInfo"
            :periodType="periodType"
            :standardDeviation="standardDeviation"
            :internalValidationResponseBackground="
              internalValidationResponseBackground
            "
            :reportChartData="reportChartData"
            @setReportChart="setReportChart"
          />
          <PlaceholderChart v-if="!isDataFetched" />
          <div class="mt-3 row">
            <div class="col-12">
              <div class="text-center m-t-20px" v-if="noDataText">
                <b-alert variant="info" show class="m-0"
                  ><h5 class="m-0">{{ noDataText }}</h5></b-alert
                >
              </div>
            </div>
          </div>
        </template>
      </b-tab>
    </b-tabs>
    <div
      class="text-center"
      v-if="
        !aggregate1Disable &&
        !aggregate2Disable &&
        !method1Disable &&
        !method2Disable
      "
    >
      <b-alert variant="info" show class="m-0">{{
        $t("rr_text5")
      }}</b-alert>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import aggregateTab from "./aggregateTab";
import methodTab from "./methodTab";
import toolbarComponent from "../toolbarComponent";
import internalCalc from "./internalValCalc";
import { getDateRange } from "@/components/Common/commonFunctions";

export default {
  props: [
    "key1",
    "key2",
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
    "selectedMethod",
    "debugging",
    "debuggingLevel",
    "signOffActive",
    "periodType",
    "standardDeviation",
    "applicationFinalYear",
    "reportChartData",
  ],
  components: {
    aggregateTab,
    methodTab,
    toolbarComponent,
    PlaceholderChart: () => import("@/components/Common/PlaceholderChart"),
  },
  data() {
    return {
      activityLogArr: [],
      tabFlag: true,
      periodLength: 25,
      activeTab: "aggregateTab",
      internalValidation: null,
      internalValidationResponse: null,
      isDataFetched: false,
      internalValidationResponseBackground: null,
      aMethodConfig: [],
      derivedConfig: null,
      oCypFactors: null,
      aggregate1Disable: true,
      aggregate2Disable: true,
      method1Disable: true,
      method2Disable: true,
      noDataText: "",
      aggregateCatInfo: "",
      methodCatInfo: "",
    };
  },
  watch: {
    locationValue(newValue) {
      if (newValue) {
        this.isDataFetched = false;
        this.internalValidationResponse = null;
        this.fetchConfigData();
      }
    },
    period(newValue) {
      if (newValue) {
        this.isDataFetched = false;
        this.internalValidationResponse = null;
        this.fetchConfigData();
      }
    },
    selectedMethod(newValue) {
      if (newValue) {
        this.isDataFetched = false;
        this.internalValidationResponse = null;
        if (this.internalValidation[newValue]) {
          this.derivedConfig = this.internalValidation[newValue][
            "derivedCharts"
          ]
            ? this.internalValidation[newValue]["derivedCharts"]
            : null;
          let catData = this.internalValidation[this.selectedMethod];
          this.aggregateCatInfo =
            catData.categoryInfo && catData.categoryInfo.Aggregate
              ? catData.categoryInfo.Aggregate
              : "";
          this.methodCatInfo =
            catData.categoryInfo && catData.categoryInfo.Method
              ? catData.categoryInfo.Method
              : "";
        }
        this.fetchConfigData();
      }
    },
    aggregate1Disable(newValue) {
      if (!newValue) {
        this.score(this.key1, false, []);
      }
    },
    method1Disable(newValue) {
      if (!newValue) {
        this.score(this.key2, false, []);
      }
    },
    scorecardDefaultLocationID(newValue) {
      if (newValue) {
        this.internalValidationResponseBackground = null;
        if (!this.aggregate1Disable) {
          this.scoreBackground(this.key1, false);
        }
        if (!this.method1Disable) {
          this.scoreBackground(this.key2, false);
        }
        if (this.aggregate1Disable || this.method1Disable) {
          this.fetchConfigDataBackground();
        }
      }
    },
  },
  methods: {
    updateSubTab(subTab) {
      this.$emit("updateSubTab", subTab);
    },
    getDrilldownLocation(locationID) {
      this.$emit("drilldownLocation", this.subLevelID + "/" + locationID);
      // this.drilldownLocation = this.subLevelID + '/' + locationID
    },
    score(key, value, exportArr = [], method = null) {
      this.$emit("sendScore", key, { value: value, key: key }, exportArr, method);
    },
    scoreBackground(key, value) {
      this.$emit("sendScoreBackground", key, { value: value, key: key });
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
    },
    getConfig() {
      this.internalValidation = this.dqrResponse.internal_validations;
      if (this.internalValidation[this.selectedMethod]) {
        this.derivedConfig = this.internalValidation[this.selectedMethod][
          "derivedCharts"
        ]
          ? this.internalValidation[this.selectedMethod]["derivedCharts"]
          : null;
        let catData = this.internalValidation[this.selectedMethod];
        this.aggregateCatInfo =
          catData["categoryInfo"] && catData["categoryInfo"]["Aggregate"]
            ? catData["categoryInfo"]["Aggregate"]
            : "";
        this.methodCatInfo =
          catData["categoryInfo"] && catData["categoryInfo"]["Method"]
            ? catData["categoryInfo"]["Method"]
            : "";
      }
      this.aggregate1Disable = this.derivedConfig.length
        ? !this.derivedConfig[0].chartOptions.disableChart
        : false;
      this.aggregate2Disable = this.derivedConfig.length
        ? !this.derivedConfig[1].chartOptions.disableChart
        : false;
      this.method1Disable = this.derivedConfig.length
        ? !this.derivedConfig[2].chartOptions.disableChart
        : false;
      this.method2Disable = this.derivedConfig.length
        ? !this.derivedConfig[3].chartOptions.disableChart
        : false;

      if(!this.aggregate1Disable && !this.aggregate2Disable) {
        this.score(this.key1, false, [], "IC1");
      }  
      if(!this.method1Disable && !this.method2Disable) {
        this.score(this.key2, false, [], "IC2");
      }  
      this.fetchConfigData();
    },
    fetchConfigData() {
      let aDataSource = this.internalValidation
          ? this.internalValidation[this.selectedMethod]
          : undefined,
        aSelectedDE = [],
        sSelectedDE = "",
        oCypFactorConf = {};

      this.aMethodConfig = [];
      this.aMethodConfigMethod = [];
      // console.log(this.selectedMethod)
      // console.log(aDataSource)
      if (aDataSource) {
        aDataSource.chartData.forEach((element, index) => {
          let { name, color, static_name, visible } = element.indicator;
          let oData = {
            name,
            de: [],
            color,
            visible,
          };
          oCypFactorConf[static_name] = {};
          element.indicator.subIndicator.forEach((d) => {
            let sIndName = Array.isArray(d.static_name)
              ? d.static_name[0]
              : d.static_name;
            oCypFactorConf[static_name][sIndName] = d.de;
            oData.de = [...oData.de, ...d.de];
            this.aMethodConfigMethod.push({
              name: d.name,
              color: d.color,
              de: [...d.de],
              visible,
            });
            d.de.forEach((sd) => {
              aSelectedDE.push(sd);
            });
          });
          this.aMethodConfig.push(oData);
        });
        sSelectedDE = aSelectedDE.join(";");

        /* Calculating CYP Factors */
        this.oCypFactors = internalCalc.calculateCypFactors(
          this.globalResponse.cyp[this.selectedMethod],
          oCypFactorConf
        );
        // console.log("this.oCypFactors", this.oCypFactors);
        let level = [this.defaultLevelID, this.subLevelID],
          period = getDateRange({
            sendPeriod: this.period,
            periodType: this.periodType,
            periodLength: this.periodLength,
            applicationFinalYear: this.applicationFinalYear,
          });
        period = period.reverse().join(";");
        // console.log("period", period);
        // console.log("aSelectedDE", aSelectedDE);
        if (aSelectedDE.length) {
          if (this.debugging) {
            console.log(
              " internalValidation - Calling API getIndicatorData() with params selected DE = '" +
                sSelectedDE +
                "', Level = '" +
                level +
                "', Country ID = '" +
                this.defaultLocationID +
                "', Period = '" +
                period +
                "' @",
              this.$moment().format("MMMM Do YYYY, h:mm:ss a")
            );
            if (this.activityLogArr) {
              var obj_log = {
                name: "Internal Consistency",
                time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
                content:
                  "internalValidation - Calling API getIndicatorData() with params selected DE = '" +
                  sSelectedDE +
                  "', Level = '" +
                  level +
                  "', Country ID = '" +
                  this.defaultLocationID +
                  "', Period = '" +
                  period,
              };
              this.activityLogArr.push(obj_log);
            }
          }
          service
            .getIndicatorData(
              sSelectedDE,
              level,
              this.defaultLocationID,
              period
            )
            .then((response) => {
              if (this.debugging) {
                console.log(
                  "internalValidation - getIndicatorData() API response received @",
                  this.$moment().format("MMMM Do YYYY, h:mm:ss a")
                );
                if (this.activityLogArr) {
                  var obj_log = {
                    name: "Internal Consistency",
                    time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
                    content:
                      "internalValidation - getIndicatorData() API response received",
                  };
                  this.activityLogArr.push(obj_log);
                  this.$emit("sendLog", this.activityLogArr);
                }
              }
              // console.log(response)
              this.internalValidationResponse = response.data;
              this.isDataFetched = true;
              this.noDataText = response.data.rows.length ? "" : this.$i18n.t("no_data_to_display");
              // console.log(response.data);
            })
            .catch((res) => {
              this.isDataFetched = true;
              this.noDataText = this.$i18n.t("errorInData");
              if (this.debugging) {
                console.log(
                  "internalValidation - getIndicatorData() API response failed @",
                  this.$moment().format("MMMM Do YYYY, h:mm:ss a")
                );
                if (this.activityLogArr) {
                  var obj_log = {
                    name: "Internal Consistency",
                    time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
                    content:
                      "internalValidation - getIndicatorData() API response failed ",
                  };
                  this.activityLogArr.push(obj_log);
                  this.$emit("sendLog", this.activityLogArr);
                }
              }
              this.score(this.key1, false, []);
              this.score(this.key2, false, []);
              if (this.reportChartData) {
                this.$emit("setReportChart", {
                  chartObj: null,
                  cid: [
                    this.reportChartData.cid,
                    ...this.reportChartData.linkedCharts,
                  ],
                });
              }
            });
        } else {
          if (this.debugging) {
            if (this.activityLogArr) {
              var obj_log = {
                name: "Internal Consistency",
                time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
                content: "aSelectedDE not defined",
              };
              this.activityLogArr.push(obj_log);
              this.$emit("sendLog", this.activityLogArr);
            }
          }
          this.noDataText = this.$i18n.t(
            "maperror_msg"
          );
          this.isDataFetched = true;
          this.score(this.key1, false, []);
          this.score(this.key2, false, []);
          if (this.reportChartData) {
            this.$emit("setReportChart", {
              chartObj: null,
              cid: [
                this.reportChartData.cid,
                ...this.reportChartData.linkedCharts,
              ],
            });
          }
        }
      } else {
        if (this.debugging) {
          if (this.activityLogArr) {
            var obj_log = {
              name: "Internal Consistency",
              time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
              content: "aDataSource not defined",
            };
            this.activityLogArr.push(obj_log);
            this.$emit("sendLog", this.activityLogArr);
          }
        }
        this.noDataText = this.$i18n.t(
          "maperror_msg"
        );
        this.isDataFetched = true;
        this.score(this.key1, false, []);
        this.score(this.key2, false, []);
        // console.log('some error')
        if (this.reportChartData) {
          this.$emit("setReportChart", {
            chartObj: null,
            cid: [
              this.reportChartData.cid,
              ...this.reportChartData.linkedCharts,
            ],
          });
        }
      }
    },
    fetchConfigDataBackground() {
      let aDataSource = this.internalValidation
          ? this.internalValidation[this.selectedMethod]
          : undefined,
        aSelectedDE = [],
        sSelectedDE = "";

      // console.log("this.selectedMethod", this.selectedMethod)
      // console.log("aDataSource", aDataSource)
      if (aDataSource) {
        aDataSource.chartData.forEach((element, index) => {
          element.indicator.subIndicator.forEach((d) => {
            d.de.forEach((sd) => {
              aSelectedDE.push(sd);
            });
          });
        });
        sSelectedDE = aSelectedDE.join(";");

        // let level = [this.subLevelID];
					let level = [this.scorecardDefaultLocationID.split("/")[0]],
          period = getDateRange({
            sendPeriod: this.periodScorecard,
            periodType: this.periodType,
            periodLength: this.periodLength,
            applicationFinalYear: this.applicationFinalYear,
          });
        period = period.reverse().join(";");
        // console.log(aSelectedDE)
        if (aSelectedDE.length) {
          service
            .getIndicatorData(
              sSelectedDE,
              level,
              this.scorecardDefaultLocationID.split("/")[1],
              period
            )
            .then((response) => {
              // console.log("internalValidationResponseBackground", response)
              this.internalValidationResponseBackground = response.data;
            })
            .catch((res) => {
              this.scoreBackground(this.key1, false);
              this.scoreBackground(this.key2, false);
            });
        } else {
          this.scoreBackground(this.key1, false);
          this.scoreBackground(this.key2, false);
        }
      } else {
        this.scoreBackground(this.key1, false);
        this.scoreBackground(this.key2, false);
      }
    },
  },
  created() {
    this.getConfig();
  },
};
</script>
