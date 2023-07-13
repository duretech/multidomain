<template>
  <b-row class="mx-0">
    <template v-if="pTypeError">
      <b-col>
        <div class="text-center">{{ pTypeError }}</div>
      </b-col></template
    >
    <template v-else>
      <b-col sm="6" class="emuchart">
        <cardComponent
          :chartdata="mData"
          :cardTitle="dummyName"
          :inDQR="true"
          :noOptions="true"
          :bShowIcons="true"
          emuType="monthly"
          :canComment="canComment"
          key="monthly"
          v-if="mData && aDataFetched"
        />
        <div class="text-center" v-else>
          <b-spinner
            type="grow"
            label="Spinning"
            v-if="!mDataFetched"
          ></b-spinner>
          <div v-else>{{ $t("configError") }}</div>
        </div>
      </b-col>
      <b-col sm="6" class="emuchart">
        <cardComponent
          :chartdata="aData"
          :cardTitle="dummyName"
          :noOptions="true"
          :bShowIcons="true"
          emuType="annual"
          :canComment="canComment"
          key="annual"
          v-if="aData && mDataFetched"
        />
        <div class="text-center" v-else>
          <b-spinner
            type="grow"
            label="Spinning"
            v-if="!mDataFetched"
          ></b-spinner>
          <div v-else>{{ $t("configError") }}</div>
        </div>
      </b-col>
    </template>
  </b-row>
</template>
<script>
import service from "@/service";
import cardComponent from "@/components/FPDashboard/dqr/emuAnnual/cardComponent";

export default {
  props: ["dqrResponse", "preFetchData", "locationPeriod"],
  components: { cardComponent },
  data() {
    return {
      mData: null,
      aData: null,
      pTypeError: null,
      canComment: false,
      mDataFetched: false,
      aDataFetched: false,
    };
  },
  computed: {
    dummyName() {
      return this.$i18n.t("chart") + " " + this.$i18n.t("name");
    },
  },
  watch: {
    dqrResponse: {
      handler() {
        if (["monthly", "yearly"].includes(this.locationPeriod.periodType)) {
          this.pTypeError = null;
          this.mData = null;
          this.mDataFetched = false;
          this.aData = null;
          this.aDataFetched = false;
          this.$nextTick(() => {
            this.getMonthlyCharts();
            this.getAnnualCharts();
          });
        } else {
          this.pTypeError = this.$i18n.t("emuNotAvailable");
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler(newValue) {
        if (["monthly", "yearly"].includes(newValue.periodType)) {
          this.pTypeError = null;
          this.mData = null;
          this.mDataFetched = false;
          this.aData = null;
          this.aDataFetched = false;
          this.$nextTick(() => {
            if (this.dqrResponse) {
              this.getMonthlyCharts();
              this.getAnnualCharts();
            }
          });
        } else {
          this.pTypeError = this.$i18n.t("emuNotAvailable");
        }
      },
      deep: true,
    },
  },
  methods: {
    async getAnnualCharts() {
      let dqrDataAnnual = this.dqrResponse.emu.Output.derivedCharts;
      let defaultLocationID = this.locationPeriod.location.split("/")[1];
      let aData = null;
      if (
        this.preFetchData &&
        this.preFetchData[`yearly_${this.$i18n.locale}`]
      ) {
        aData = this.preFetchData[`yearly_${this.$i18n.locale}`];
      } else {
        try {
          let key = this.generateKey(`annualEMU_${this.$i18n.locale}`);
          let res = await service.getSavedConfig(key);
          aData = res.data;
        } catch (err) {
          this.aData = null;
          this.aDataFetched = true;
          console.log("DQR module - getConfig() - annualEMU response failed");
        }
      }
      if (aData) {
        let eData =
          typeof aData["compEMU"] === "string"
            ? JSON.parse(aData["compEMU"])
            : aData["compEMU"];
        this.aData = eData[defaultLocationID] ? eData[defaultLocationID] : null;
        if (this.aData) {
          let data = dqrDataAnnual.find(
            (d) => d.chartOptions.cid === this.aData.cid
          );
          if (data) {
            data = data.chartOptions;
            this.aData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            this.aData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            this.aData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            this.aData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
          } else {
            this.aData = null;
          }
        }
        this.aDataFetched = true;
      } else {
        this.aData = null;
        this.aDataFetched = true;
        console.log("DQR module - getConfig() - annualEMU response failed");
      }
    },
    async getMonthlyCharts() {
      let savedEMU = this.dqrResponse.emu_monthly.Background_Data.autoSaveEMU;
      let dqrData = this.dqrResponse.emu_monthly[savedEMU].derivedCharts;
      let defaultLocationID = this.locationPeriod.location.split("/")[1];
      let mData = null;
      if (
        this.preFetchData &&
        this.preFetchData[`monthly_${this.$i18n.locale}`]
      ) {
        mData = this.preFetchData[`monthly_${this.$i18n.locale}`];
      } else {
        try {
          let key = this.generateKey(`monthlyEMU_${this.$i18n.locale}`);
          let res = await service.getSavedConfig(key);
          mData = res.data;
        } catch (err) {
          this.mData = null;
          this.mDataFetched = true;
          console.log("DQR module - getConfig() - monthlyEMU response failed");
        }
      }
      if (mData) {
        let eData =
          typeof mData["totalEMU"] === "string"
            ? JSON.parse(mData["totalEMU"])
            : mData["totalEMU"];
        this.mData = eData[defaultLocationID] ? eData[defaultLocationID] : null;
        if (this.mData) {
          let data = dqrData.find((d) => d.chartOptions.cid === this.mData.cid);
          if (data) {
            data = data.chartOptions;
            this.mData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            this.mData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            this.mData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            this.mData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
            this.mData.type = "line";
            this.mData["categories"] = [];
            this.mData["data"] = [];
            let pe = [],
              fCatArray = [];
            let defaultDate = this.$moment(
              this.locationPeriod.period,
              "YYYYMM"
            );
            let selectedDate = this.$moment(defaultDate, "YYYYMM").format(
              "MMM YYYY"
            );
            for (let i = 23; i >= 0; i--) {
              if (i === 0) {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
                );
              } else {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY")
                    .subtract(i, "months")
                    .format("YYYYMM")
                );
              }
            }
            this.mData.saveCategories.forEach((c) =>
              fCatArray.push(this.$moment(c, "MMM YYYY").format("YYYYMM"))
            );
            this.mData.saveData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.name,
                data: [],
                color: sData.color,
              };
              pe.forEach((p) => {
                let formattedDate = this.$moment(p, "YYYYMM").format(
                  "MMM YYYY"
                );
                if (fCatArray.includes(p)) {
                  let catIndex = fCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex].toFixed(2) * 1);

                  if (!this.mData.categories.includes(formattedDate)) {
                    this.mData.categories.push(formattedDate);
                  }
                }
              });
              this.mData["data"].push(obj);
            });
            let count = 0;
            this.mData["data"].forEach((s) => {
              if (count < s.data.length) {
                count = s.data.length;
              }
            });
            this.mData.max = count > 11 ? 11 : count - 1;
          } else {
            this.mData = null;
          }
          this.mDataFetched = true;
        }
      } else {
        this.mData = null;
        this.mDataFetched = true;
        console.log("DQR module - getConfig() - monthlyEMU response failed");
      }
    },
  },
  created() {
    this.canComment =
      this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser ||
      this.$store.getters.getUserPermissions.canComment;
    if (this.dqrResponse) {
      this.getMonthlyCharts();
      this.getAnnualCharts();
    }
  },
};
</script>