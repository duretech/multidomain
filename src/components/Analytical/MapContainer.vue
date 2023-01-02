<template>
  <div class="mt-3">
    <div class="map-header mb-3" v-show="isJsonFetched">
      <div v-if="locationPeriod">
        <h6 class="map-title pt-1">
          {{ locationPeriod.locationName }}
        </h6>
      </div>
      <div class="ml-2" v-if="indList.length > 0">
        <b-form-select
          class="mapDropdown"
          v-model="selectedInd"
          :options="indList"
        ></b-form-select>
      </div>
    </div>
    <MapComponent
      v-if="dataFetched"
      :hideYears="true"
      :showScales="true"
      :chartData="chartData"
      @getGeoJson="getGeoJson"
      :allGeoJson="allGeoJson"
      :selectedInd="selectedInd"
      :locationPeriod="locationPeriod"
      :mapConfigData="subTab.mapSetting[0].chartOptions"
      @isJsonFetched="isJsonFetched = true"
    />
    <div class="text-center" v-else>
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import {
  getDateRange,
  generateChart,
  translateDate,
} from "@/components/Common/commonFunctions";
import basicChartConfig from "@/config/basicChartConfig.js";

export default {
  props: ["subTab", "emuData", "allGeoJson", "locationPeriod"],
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
      chartData: JSON.parse(JSON.stringify(basicChartConfig)),
    };
  },
  watch: {
    emuData: {
      handler() {
        if (this.subTab.mapSetting[0].chartOptions.isSavedData) {
          this.dataFetched = false;
          this.selectedInd = "";
          this.chartData = JSON.parse(JSON.stringify(basicChartConfig));
          this.getEMUChart();
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler() {
        this.dataFetched = false;
        this.selectedInd = "";
        this.chartData = JSON.parse(JSON.stringify(basicChartConfig));
        if (!this.subTab.mapSetting[0].chartOptions.isSavedData) {
          this.getCharts();
        } else {
          //Useful when user changes tab and comes back
          if (this.emuData) {
            this.getEMUChart();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    async getEMUChart() {
      let emuResponse = JSON.parse(JSON.stringify(this.emuData));
      emuResponse = emuResponse[this.locationPeriod.periodType];
      if (emuResponse) {
        let locationID = this.locationPeriod.location.split("/");
        let children = await service.getChildOrganisation(locationID[1]),
          emuModule = { ...emuResponse },
          period = translateDate({
            rawDate: this.locationPeriod.period,
            periodType: this.locationPeriod.periodType,
            monthlyFormat: "MMM YYYY",
          });

        let categories = {},
          series = [],
          catIds = [];
        let totalLegend = this.$i18n.t("total-EMU");
        this.selectedInd = totalLegend;
        let totalSeriesObj = {
          name: totalLegend,
          data: [],
          visible: true,
          color: null,
        };
        let dataKey = {};
        if (this.locationPeriod.periodType === "yearly") {
          if (emuModule.compEMU) {
            dataKey = JSON.parse(JSON.stringify(emuModule.compEMU));
            dataKey = JSON.parse(dataKey);
          }
        } else {
          dataKey =
            typeof emuModule.totalEMU === "string"
              ? JSON.parse(emuModule.totalEMU)
              : emuModule.totalEMU;
        }
        Object.keys(dataKey).forEach((ids) => {
          children.data.children.forEach((child) => {
            if (child.id == ids && dataKey[ids] != null) {
              if (!categories[child.id]) {
                categories[child.id] = child.name;
                catIds.push(child.id);
              }
            }
          });
        });
        let idArr = [];
        catIds.forEach((cat) => {
          Object.keys(dataKey).forEach((ids) => {
            if (cat == ids && dataKey[ids] != null) {
              idArr.push(ids);
              if (this.locationPeriod.periodType === "yearly") {
                let index = dataKey[ids]["categories"].indexOf(period);
                dataKey[ids]["data"].forEach((data) => {
                  if (data.name == dataKey[ids]["source"]) {
                    totalSeriesObj.data.push({
                      locationID: ids,
                      y: data["data"][index],
                      originalY: data["data"][index],
                      name: categories[ids] || "Name Error",
                    });
                  }
                });
              } else {
                let index = dataKey[ids]["saveCategories"].indexOf(period);
                dataKey[ids]["saveData"].forEach((data) => {
                  if (data.name == this.$i18n.t("EMU")) {
                    totalSeriesObj.data.push({
                      locationID: ids,
                      y: data["data"][index],
                      originalY: data["data"][index],
                      name: categories[ids] || "Name Error",
                    });
                  }
                });
              }
            }
          });
        });
        series.push(totalSeriesObj);
        this.chartData.series = series;
        this.dataFetched = true;
      } else {
        this.dataFetched = true;
      }
    },
    getGeoJson(loc, obj) {
      this.$emit("getGeoJson", loc, obj);
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
            name: element.indicator.name,
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
            value: element.indicator.name,
            text: element.indicator.name,
          });
          if (i === 0) {
            this.selectedInd = element.indicator.name;
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
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let levels = [subLevelID];
      let { de, catArray } = this.getMapping();
      let period = getDateRange({
        sendPeriod: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        periodLength: 1,
      });
      let periodArr = period;
      period = period.reverse().join(";");
      if (de) {
        service
          .getIndicatorData(de, levels, location, period)
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
                cData: { chartCategory: "regional", isSingleSource: true },
              });
              this.chartData = cObj;
            } else {
              // errorMsg: "No Data to Display",
            }
            this.dataFetched = true;
          })
          .catch(() => {
            this.dataFetched = true;
            // errorMsg: "Error in fetching data",
          });
      } else {
        this.dataFetched = true;
        // errorMsg: "Mapping not available",
      }
    },
  },
  created() {
    if (!this.subTab.mapSetting[0].chartOptions.isSavedData) {
      this.getCharts();
    } else {
      //Useful when user changes tab and comes back
      if (this.emuData) {
        this.dataFetched = false;
        this.getEMUChart();
      }
    }
  },
};
</script>
