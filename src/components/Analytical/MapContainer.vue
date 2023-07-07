<template>
  <div class="">
    <div class="map-header mb-3">
      <div class="row map-section">
        <div class="col-3">
          <div v-if="locationPeriod">
            <h6 class="map-title pt-0">
              {{ locationPeriod.locationName }}
            </h6>
          </div>
        </div>
        <div class="col-9">
          <div
            class="ml-2"
            v-if="indList.length > 0"
            :style="{
              visibility: isJsonFetched && dataFetched ? 'visible' : 'hidden',
            }"
          >
            <b-form-select
              class="mapDropdown"
              v-model="selectedInd"
              :options="indList"
            ></b-form-select>
          </div>
        </div>
      </div>
    </div>
    <MapComponent
      v-if="dataFetched"
      :hideYears="true"
      :showScales="true"
      :chartData="chartData"
      :allGeoJson="allGeoJson"
      :selectedInd="selectedInd"
      :locationPeriod="locationPeriod"
      :mapConfigData="subTab.mapSetting[0].chartOptions"
      @isJsonFetched="isJsonFetched = true"
    />
    <div
      class="align-items-center d-flex justify-content-center h-400px"
      v-else
    >
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </div>
    <div v-if="dataFetched">
      {{ locationPeriod.locationName }}: {{ locValue }}
    </div>
  </div>
</template>
<script>
import service from "@/service";
import {
  getChild,
  getDateRange,
  generateChart,
  translateDate,
} from "@/components/Common/commonFunctions";
import { commonChartConfig } from "@/config/basicChartConfig";

export default {
  props: ["subTab", "emuData", "allGeoJson", "preFetchData", "locationPeriod"],
  components: {
    MapComponent: () =>
      import(
        /*webpackChunkName: "MapComponent"*/ "@/components/Maps/MapComponent"
      ),
  },
  data() {
    return {
      indList: [],
      selectedInd: "",
      dataFetched: false,
      isJsonFetched: false,
      abortController: null,
      chartData: JSON.parse(JSON.stringify(commonChartConfig)),
    };
  },
  computed: {
    isChart() {
      let chart = false;
      if (
        !this.dataFetched &&
        this.$store.getters.getActiveTab.includes(this.subTab.id)
      ) {
        chart = true;
      }
      return chart;
    },
    locValue() {
      let val = this.$i18n.t("NA");
      let isSeries = this.chartData.series.find(
        (s) => s.name === this.selectedInd
      );
      if (isSeries) {
        let isData = isSeries.data.find(
          (d) => d.locationID === this.locationPeriod.location.split("/")[1]
        );
        if (isData) {
          val = isData.y;
        }
      }
      return val;
    },
  },
  watch: {
    isChart(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          if (!this.subTab.mapSetting[0].chartOptions.isSavedData) {
            this.getCharts();
          } else {
            if (
              this.emuData[
                `${this.locationPeriod.periodType}_${this.$i18n.locale}`
              ]
            ) {
              this.getEMUChart();
            }
          }
        });
      }
    },
    emuData: {
      handler(data) {
        if (this.subTab.mapSetting[0].chartOptions.isSavedData) {
          this.dataFetched = false;
          this.selectedInd = "";
          this.chartData = JSON.parse(JSON.stringify(commonChartConfig));
          this.$nextTick(() => {
            if (this.isChart) {
              this.getEMUChart();
            }
          });
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler() {
        this.dataFetched = false;
        this.selectedInd = "";
        this.indList = [];
        this.chartData = JSON.parse(JSON.stringify(commonChartConfig));
      },
      deep: true,
    },
  },
  methods: {
    async getEMUChart() {
      let emuResponse = JSON.parse(JSON.stringify(this.emuData));
      emuResponse =
        emuResponse[`${this.locationPeriod.periodType}_${this.$i18n.locale}`];
      if (emuResponse) {
        let locationID = this.locationPeriod.location.split("/");
        let children = [];
        if (this.preFetchData?.orgList?.length) {
          children = getChild({
            locationList: this.preFetchData.orgList,
            location: locationID[1],
          });
        } else {
          try {
            let response = await service.getChildOrganisation(locationID[1]);
            children = response?.data?.children || [];
          } catch (err) {
            console.log("err", err);
          }
        }
        let obj = {
          displayName: this.locationPeriod.locationName,
          id: this.locationPeriod.location.split("/")[1],
          level: this.locationPeriod.location.split("/")[0],
          name: this.locationPeriod.locationName,
          parent: null,
        };
        children.unshift(obj);
        let emuModule = { ...emuResponse },
          period = translateDate({
            rawDate: this.locationPeriod.period,
            periodType: this.locationPeriod.periodType,
            monthlyFormat: "MMM YYYY",
          });

        let series = [];
        let totalLegend = this.$i18n.t("total-EMU");
        this.selectedInd = totalLegend;
        let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: null,
        };
        let data = {};
        if (this.locationPeriod.periodType === "yearly") {
          if (emuModule.compEMU) {
            data = JSON.parse(JSON.stringify(emuModule.compEMU));
            data = JSON.parse(data);
          }
        } else {
          data =
            typeof emuModule.totalEMU === "string"
              ? JSON.parse(emuModule.totalEMU)
              : emuModule.totalEMU;
        }
        children.forEach((cat) => {
          if (data[cat.id]) {
            let catKey = "saveCategories";
            let dataKey = "saveData";
            if (this.locationPeriod.periodType === "yearly") {
              catKey = "categories";
              dataKey = "data";
            }
            if (data[cat.id]?.[catKey]?.length) {
              let index = data[cat.id][catKey].indexOf(period);
              data[cat.id][dataKey].forEach((innerdata) => {
                let compKey = this.$i18n.t("EMU");
                if (this.locationPeriod.periodType === "yearly") {
                  compKey = data[cat.id]["source"];
                }
                if (innerdata.name == compKey) {
                  let y = innerdata["data"][index]
                    ? innerdata["data"][index].toFixed(2) * 1
                    : null;
                  totalSeriesObj.data.push({
                    locationID: cat.id,
                    y: y,
                    originalY: y,
                    name:
                      cat.name ||
                      `${this.$i18n.t("name") + " " + this.$i18n.t("error")}`,
                  });
                }
              });
            }
          } else {
            totalSeriesObj.data.push({
              locationID: cat.id,
              y: null,
              originalY: null,
              name:
                cat.name ||
                `${this.$i18n.t("name") + " " + this.$i18n.t("error")}`,
            });
          }
        });
        series.push(totalSeriesObj);
        this.chartData.series = series;
        this.dataFetched = true;
      } else {
        this.dataFetched = true;
      }
    },
    getMapping() {
      let catArray = [],
        de = [],
        rMapping = [];
      let gSetting = this.$store.getters.getGlobalFactors();
      if (
        gSetting.globalMappings &&
        gSetting.globalMappings.mappings &&
        gSetting.globalMappings.mappings.length
      ) {
        const allMappings = [].concat(
          ...gSetting.globalMappings.mappings.map(
            ({ mapping }) => mapping || []
          )
        );
        rMapping = allMappings.filter((m) =>
          this.subTab.mapSetting[0].chartOptions.dataMapping.includes(
            m.indicator.static_name
          )
        );
      }
      if (rMapping.length) {
        rMapping.forEach((element, i) => {
          let mapObj = {
            name: element.indicator.name[this.$i18n.locale],
            color: element.indicator.color,
            visible: !element.indicator.disable,
            dx: [],
            cyp: {},
          };
          element.indicator.subIndicator.forEach((subEle) => {
            subEle.selectedDE.forEach((s) => {
              de.push(s.id);
              mapObj.dx.push(s.id);
              mapObj.cyp[s.id] = 1;
            });
          });
          this.indList.push({
            value: element.indicator.name[this.$i18n.locale],
            text: element.indicator.name[this.$i18n.locale],
          });
          if (i === 0) {
            this.selectedInd = element.indicator.name[this.$i18n.locale];
          }
          catArray.push(mapObj);
        });
      }
      de = de.join(";");
      return {
        de,
        catArray,
      };
    },
    getCharts() {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let levels = [levelID, subLevelID];
      let { de, catArray } = this.getMapping();
      let period = getDateRange({
        sendPeriod: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        periodLength: 1,
      });
      let periodArr = period;
      period = period.reverse().join(";");
      if (de) {
        const signal = this.abortController.signal;
        service
          .getIndicatorData(
            de,
            levels,
            location,
            period,
            null,
            null,
            null,
            null,
            signal
          )
          .then((response) => {
            if (response.data.rows.length) {
              let { cObj } = generateChart({
                catArray,
                response,
                location,
                cObj: this.chartData,
                periodArr: periodArr,
                currentPeriod: periodArr[0],
                periodType: this.locationPeriod.periodType,
                cData: {
                  chartCategory: "regional",
                  isSingleSource: true,
                  isHigherLoc: true,
                },
              });
              this.chartData = cObj;
            }
            this.dataFetched = true;
            this.abortController = null;
          })
          .catch((res) => {
            if (res.message !== "canceled" || !signal.aborted) {
              this.dataFetched = true;
            }
            this.abortController = null;
            // errorMsg: "Error in fetching data",
          });
      } else {
        this.dataFetched = true;
        // errorMsg: "Mapping not available",
      }
    },
  },
  created() {
    if (this.isChart) {
      if (!this.subTab.mapSetting[0].chartOptions.isSavedData) {
        this.getCharts();
      } else {
        //Useful when user changes tab and comes back
        if (this.emuData) {
          this.dataFetched = false;
          this.getEMUChart();
        }
      }
    }
  },
};
</script>
