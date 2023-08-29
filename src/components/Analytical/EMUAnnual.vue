<template>
  <b-row>
    <template v-if="noData">
      <b-col class="text-center">
        <b-alert variant="info" show class="m-0"
          ><h5 class="m-0">{{ noData }}</h5></b-alert
        >
      </b-col>
    </template>
    <template v-else>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="comparingEMU"
          :chartdata="comparingEMU"
          :showSource="true"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          :sorting="['JAN-DEC', 'DEC-JAN']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="comparingAverageAnnual"
          :chartdata="comparingAverageAnnual"
          :showSource="true"
          :canComment="canComment"
          defaultSort="A-Z"
          :sorting="['0-1', '1-0', 'A-Z', 'Z-A']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>

      <b-col sm="6" class="mb-3">
        <card-component
          v-if="comparingUsers"
          :chartdata="comparingUsers"
          :showSource="true"
          :canComment="canComment"
          defaultSort="A-Z"
          :sorting="['0-1', '1-0', 'A-Z', 'Z-A']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="annualuserTrendsDataByMethods"
          :chartdata="annualuserTrendsDataByMethods"
          :ddOptions="userMethodList"
          @handleFilterChange="handleFilterChange"
          :showSource="true"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          :sorting="['JAN-DEC', 'DEC-JAN']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
    </template>
  </b-row>
</template>
<script>
import service from "@/service";
import { commonChartConfig } from "@/config/basicChartConfig";
import cardComponent from "@/components/FPDashboard/dqr/emuAnnual/cardComponent";

export default {
  props: ["emuData", "dqrResponse", "locationPeriod"],
  components: {
    cardComponent,
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
  },
  data() {
    return {
      noData: "",
      canComment: false,
      comparingEMU: null,
      comparingUsers: null,
      selectedUserMethod: 0,
      globalPeriodData: null,
      comparingAverageAnnual: null,
      placeholderObj: commonChartConfig,
      annualuserTrendsDataByMethods: null,
    };
  },
  watch: {
    emuData: {
      handler(newValue) {
        if (
          newValue[`yearly_${this.$i18n.locale}`] &&
          newValue[`yearly_${this.$i18n.locale}`] !== "Error" &&
          this.dqrResponse
        ) {
          this.getEMUChart();
        }
        if (newValue[`yearly_${this.$i18n.locale}`] === "Error") {
          this.noData = this.$i18n.t("no_data_to_display");
        }
      },
      deep: true,
    },
    dqrResponse: {
      handler(newValue) {
        if (
          this.emuData[`yearly_${this.$i18n.locale}`] &&
          this.emuData[`yearly_${this.$i18n.locale}`] !== "Error" &&
          newValue
        ) {
          this.getEMUChart();
        }
        if (this.emuData[`yearly_${this.$i18n.locale}`] === "Error") {
          this.noData = this.$i18n.t("no_data_to_display");
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler(newValue, oldValue) {
        if (
          oldValue &&
          (newValue.location !== oldValue.location ||
            newValue.periodType !== oldValue.periodType ||
            newValue.period !== oldValue.period)
        ) {
          this.getEMUChart();
        }
      },
      deep: true,
    },
  },
  methods: {
    getEMUChart() {
      this.comparingEMU = null;
      this.comparingUsers = null;
      this.comparingAverageAnnual = null;
      this.annualuserTrendsDataByMethods = null;
      let emuData = JSON.parse(JSON.stringify(this.emuData));
      let compEMU =
        typeof emuData[`yearly_${this.$i18n.locale}`]["compEMU"] === "string"
          ? JSON.parse(emuData[`yearly_${this.$i18n.locale}`]["compEMU"])
          : emuData[`yearly_${this.$i18n.locale}`]["compEMU"];
      let locId = this.locationPeriod.location.split("/")[1];
      if (compEMU[locId]) {
        let dqrData = this.dqrResponse.emu.Output.derivedCharts;

        let comparingEMU = compEMU[locId] ? compEMU[locId] : null;
        if (comparingEMU) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingEMU.cid
          );
          if (data) {
            data = data.chartOptions;
            comparingEMU.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            comparingEMU.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            comparingEMU.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            comparingEMU.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
          }
          this.comparingEMU = comparingEMU;
        } else {
          this.comparingEMU = null;
        }
        let comAvgEMU = JSON.parse(
          emuData[`yearly_${this.$i18n.locale}`]["compAvgAnuual"]
        );
        let comparingAverageAnnual = comAvgEMU[locId] ? comAvgEMU[locId] : null;
        if (comparingAverageAnnual) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingAverageAnnual.cid
          );
          if (data) {
            data = data.chartOptions;
            comparingAverageAnnual.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            comparingAverageAnnual.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            comparingAverageAnnual.type = "bar";
            comparingAverageAnnual.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            comparingAverageAnnual.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
          }
          this.comparingAverageAnnual = comparingAverageAnnual;
        } else {
          this.comparingAverageAnnual = null;
        }

        let comUsers = JSON.parse(
          emuData[`yearly_${this.$i18n.locale}`]["compUsers"]
        );
        let comparingUsers = comUsers[locId] ? comUsers[locId] : null;
        if (comparingUsers) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingUsers.cid
          );
          if (data) {
            data = data.chartOptions;
            comparingUsers.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            comparingUsers.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            comparingUsers.type = "bar";
            comparingUsers.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            comparingUsers.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
          }
          this.comparingUsers = comparingUsers;
        } else {
          this.comparingUsers = null;
        }
        let usersT = JSON.parse(
          emuData[`yearly_${this.$i18n.locale}`]["usersTrend"]
        );
        this.usersTrend = usersT[locId] ? usersT[locId] : null;
      } else {
        this.comparingEMU = null;
        this.comparingAverageAnnual = null;
        this.comparingUsers = null;
        this.usersTrend = null;
        this.noData = this.$i18n.t("no_data_to_display");
      }
      this.drawUserByMethods(true, this.usersTrend);
    },
    drawUserByMethods(p_bFlag, data) {
      if (data) {
        let oRet = data,
          aCategories = Object.keys(oRet),
          sMethod;
        this.userMethodList = aCategories.length
          ? aCategories.filter(
              (el) =>
                !["type", "isPeriodChart", "reportChartType", "cid"].includes(
                  el
                )
            )
          : [];
        if (p_bFlag) {
          this.selectedUserMethod = 0;
        }
        sMethod = this.userMethodList[this.selectedUserMethod];
        if (sMethod) {
          this.annualuserTrendsDataByMethods = {
            data: oRet[sMethod].data,
            title: this.$i18n.t("user_trend"),
            cid: data.cid,
            source: "",
            xTitle: "",
            yTitle: "",
            type: "line",
            categories: oRet[sMethod].categories,
            tableData: oRet[sMethod].tableData,
            fields: oRet[sMethod].fields,
          };
        }
      }
    },
    handleFilterChange(newVal) {
      this.selectedUserMethod = newVal;
      this.drawUserByMethods(false, this.usersTrend);
    },
    getConfig() {
      let key = this.generateKey("dqrModule");
      service
        .getSavedConfig({ tableKey: key })
        .then((response) => {
          this.$emit("setDQRResponse", response.data);
        })
        .catch((res) => {
          console.log("catch error", res);
          if (this.$store.getters.getIsAdmin) {
            // Popup message to set the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("pleasesetyourconfiguration"),
              showCancelButton: true,
              reverseButtons: true,
              confirmButtonText: this.$i18n.t("configureNow"),
              cancelButtonText: this.$i18n.t("cancelbtn"),
            }).then((result) => {
              if (result.value) {
                this.$router.push("/config");
              }
            });
          } else {
            // Popup message to contact admin for the configurations
            this.sweetAlert({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("contactAdmin"),
            });
          }
        });
    },
  },
  created() {
    this.canComment =
      this.$store.getters.getIsAdmin ||
      this.$store.getters.getAppSettings.bypassUser ||
      this.$store.getters.getUserPermissions.canComment;
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
    if (!this.dqrResponse) {
      this.getConfig();
    }
    if (this.emuData[`yearly_${this.$i18n.locale}`] && this.dqrResponse) {
      this.getEMUChart();
    }
  },
};
</script>
