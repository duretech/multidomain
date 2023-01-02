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
      <b-col sm="6" class="m-b-30px">
        <card-component
          v-if="comparingEMU"
          :chartdata="comparingEMU"
          :showSource="true"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          sorting="['JAN-DEC','DEC-JAN']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="m-b-30px">
        <card-component
          v-if="comparingAverageAnnual"
          :chartdata="comparingAverageAnnual"
          :showSource="true"
          :canComment="canComment"
          defaultSort="A-Z"
          sorting="['0-1','1-0', 'A-Z','Z-A']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="m-b-30px">
        <card-component
          v-if="comparingUsers"
          :chartdata="comparingUsers"
          :showSource="true"
          :canComment="canComment"
          defaultSort="A-Z"
          sorting="['0-1','1-0', 'A-Z','Z-A']"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="m-b-30px">
        <card-component
          v-if="annualuserTrendsDataByMethods"
          :chartdata="annualuserTrendsDataByMethods"
          :ddOptions="userMethodList"
          :handleFilterChange="handleFilterChange"
          :showSource="true"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          sorting="['JAN-DEC','DEC-JAN']"
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
import basicChartConfig from "@/config/basicChartConfig.js";
import cardComponent from "@/components/FPDashboard/dqr/emuAnnual/cardComponent";
import HighChartComponent from "@/components/Highcharts/HighChartComponentDynamic";

export default {
  props: ["emuData", "dqrResponse", "locationPeriod"],
  components: { cardComponent, HighChartComponent },
  data() {
    return {
      noData: "",
      canComment: false,
      comparingEMU: null,
      comparingUsers: null,
      selectedUserMethod: 0,
      globalPeriodData: null,
      comparingAverageAnnual: null,
      placeholderObj: basicChartConfig,
      annualuserTrendsDataByMethods: null,
    };
  },
  watch: {
    emuData: {
      handler(newValue) {
        if (newValue["yearly"] && this.dqrResponse) {
          this.getEMUChart();
        }
      },
      deep: true,
    },
    dqrResponse: {
      handler(newValue) {
        if (this.emuData["yearly"] && newValue) {
          this.getEMUChart();
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler() {
        this.getEMUChart();
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
        typeof emuData["yearly"]["compEMU"] === "string"
          ? JSON.parse(emuData["yearly"]["compEMU"])
          : emuData["yearly"]["compEMU"];
      let locId = this.locationPeriod.location.split("/")[1];
      // console.log("locId", locId);
      // console.log("compEMU", compEMU);
      // console.log("compEMU[locId]", compEMU[locId]);
      if (compEMU[locId]) {
        let dqrData = this.dqrResponse.emu.Output.derivedCharts;
        // console.log("dqrResponse", this.dqrResponse.emu.Output.derivedCharts)

        let comparingEMU = compEMU[locId] ? compEMU[locId] : null;
        // console.log("comparingEMU", comparingEMU)
        if (comparingEMU) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingEMU.cid
          );
          // console.log("data",data)
          if (data) {
            data = data.chartOptions;
            comparingEMU.chartInfo = data.chartInfo;
            comparingEMU.title = data.chartName;
            comparingEMU.xTitle =
              data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
            comparingEMU.yTitle =
              data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
          }
          this.comparingEMU = comparingEMU;
        } else {
          this.comparingEMU = null;
        }
        let comAvgEMU = JSON.parse(emuData["yearly"]["compAvgAnuual"]);
        let comparingAverageAnnual = comAvgEMU[locId] ? comAvgEMU[locId] : null;
        if (comparingAverageAnnual) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingAverageAnnual.cid
          );
          if (data) {
            data = data.chartOptions;
            comparingAverageAnnual.chartInfo = data.chartInfo;
            comparingAverageAnnual.title = data.chartName;
            comparingAverageAnnual.type = "bar";
            comparingAverageAnnual.xTitle =
              data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
            comparingAverageAnnual.yTitle =
              data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
          }
          this.comparingAverageAnnual = comparingAverageAnnual;
        } else {
          this.comparingAverageAnnual = null;
        }

        let comUsers = JSON.parse(emuData["yearly"]["compUsers"]);
        let comparingUsers = comUsers[locId] ? comUsers[locId] : null;
        if (comparingUsers) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === comparingUsers.cid
          );
          if (data) {
            data = data.chartOptions;
            comparingUsers.chartInfo = data.chartInfo;
            comparingUsers.title = data.chartName;
            comparingUsers.type = "bar";
            comparingUsers.xTitle =
              data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
            comparingUsers.yTitle =
              data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
          }
          this.comparingUsers = comparingUsers;
        } else {
          this.comparingUsers = null;
        }
        let usersT = JSON.parse(emuData["yearly"]["usersTrend"]);
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
        this.userMethodList = aCategories;
        if (p_bFlag) {
          this.selectedUserMethod = 0;
        }
        sMethod = this.userMethodList[this.selectedUserMethod];
        if (sMethod) {
          this.annualuserTrendsDataByMethods = {
            data: oRet[sMethod].data,
            title: this.$i18n.t("user_trend"),
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
    handleFilterChange(e) {
      this.selectedUserMethod = e.target.value;
      this.drawUserByMethods(false, this.usersTrend);
    },
    getConfig() {
      let key = this.generateKey("dqrModule");
      service
        .getSavedConfig(key)
        .then((response) => {
          this.$emit("setDQRResponse", response.data);
        })
        .catch((res) => {
          console.log("catch error", res);
          if (this.$store.state.isAdmin) {
            // Popup message to set the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("pleasesetyourconfiguration"),
              showCancelButton: true,
              confirmButtonText: this.$i18n.t("configurenow"),
            }).then((result) => {
              if (result.value) {
                this.$router.push("/config");
              }
            });
          } else {
            // Popup message to contact admin for the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("error_text_2"),
            });
          }
        });
    },
  },
  created() {
    this.canComment =
      this.$store.getters.getIsAdmin ||
      this.$store.getters.getUserPermissions.canComment;
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
    if (!this.dqrResponse) {
      this.getConfig();
    }
    if (this.emuData["yearly"] && this.dqrResponse) {
      this.getEMUChart();
    }
  },
};
</script>