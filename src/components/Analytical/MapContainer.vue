<template>
  <div class="">
    <div class="map-header mb-3">
      <b-row>
        <b-col sm="4">
          <div v-if="locationPeriod">
            <h6 class="summary-chart-title mb-0">
              <i
                class="fa fa-info-circle cursor-pointer chart-info mr-2 ml-2"
                aria-hidden="true"
                v-b-popover.hover.rightbottom="{
                  variant: 'info',
                  content: mapConfigData?.chartInfo?.[$i18n.locale] || '',
                  title: selectedInd,
                  html: true,
                }"
              ></i
              >
              {{ locationPeriod.locationName }}
            </h6>
          </div>
        </b-col>
        <b-col sm="8">
          <div
            class="ml-2"
            v-if="indList.length > 0"
            :style="{
              visibility: isJsonFetched && dataFetched ? 'visible' : 'hidden',
            }"
          >
            <b-form-select
            v-if="!isGenerating"
              class="mapDropdown"
              v-model="selectedInd"
              :options="indList"
            ></b-form-select>
          </div>
        </b-col>
      </b-row>
            <h5 v-if="isGenerating">{{selectedInd}}</h5>
    </div>
    <MapComponent
      v-if="dataFetched"
      :hideYears="true"
      :showScales="true"
      :chartData="chartData"
      :allGeoJson="allGeoJson"
      :selectedInd="selectedInd"
      :locationPeriod="locationPeriod"
      :mapConfigData="mapConfigData"
      :isGenerating="isGenerating"
      @isJsonFetched="isJsonFetched = true"
      @mapPic ="mapPic"
      :title = locationPeriod.locationName
      @deleteMapPic="deleteMapPic"
    />
    <div
      class="align-items-center d-flex justify-content-center h-400px"
      v-else
    >
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </div>
    <b-row class="small" v-if="dataFetched">
      <b-col v-if="dataFetched">
        <strong>
          {{ locationPeriod.locationName }}: {{ locValue.toLocaleString() }}
        </strong>
      </b-col>
      <b-col class="text-right" v-if="mapConfigData?.source?.[$i18n.locale]">
        {{ $t("source") }}:
        {{ mapConfigData?.source?.[$i18n.locale] || $t("NA") }}
      </b-col>
    </b-row>
  </div>
</template>
<script>
import service from "@/service";
import {
  getChild,
  getDateRange,
  generateChart,
  // translateDate,
} from "@/components/Common/commonFunctions";
import { commonChartConfig } from "@/config/basicChartConfig";

export default {
  props: ["subTab", "emuData", "allGeoJson", "preFetchData", "locationPeriod", "isGenerating"],
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
        if (isData && isData.y) {
          val = isData.y;
        }
      }
      return val;
    },
    mapConfigData() {
      let obj = this.subTab.mapSetting.find(
        (m) => m.chartOptions.chartName[this.$i18n.locale] === this.selectedInd
      );
      return obj ? obj.chartOptions : {};
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
            } else {
              this.dataFetched = true;
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
      handler(newValue, oldValue) {
        if (
          oldValue &&
          (newValue.location !== oldValue.location ||
            newValue.periodType !== oldValue.periodType ||
            newValue.period !== oldValue.period)
        ) {
          this.dataFetched = false;
          this.selectedInd = "";
          this.indList = [];
          this.chartData = JSON.parse(JSON.stringify(commonChartConfig));
        }
      },
      deep: true,
    },
  },
  methods: {
    deleteMapPic(data) {
      this.$emit("deleteMapPic", data);
    },
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
          period = "";
        let allMonthnameJson = this.$store.getters.getPeriodData;

        let newDate = this.locationPeriod.period.split("-").join("");
        Object.keys(allMonthnameJson).forEach((month) => {
          if (month == newDate) {
            period = allMonthnameJson[month]["name"];
          }
        });

        let series = [];
        let totalLegend =
          this.subTab.mapSetting[0].chartOptions.chartName[this.$i18n.locale];
        this.indList.push({
          value: totalLegend,
          text: totalLegend,
        });
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
        this.subTab.mapSetting.forEach((m, mInd) => {
          let mapObj = {
            name: m.chartOptions.chartName[this.$i18n.locale],
            color: null,
            visible: true,
            dx: [],
            cyp: {},
          };
          if(!m.chartOptions.disable){
            this.indList.push({
              value: m.chartOptions.chartName[this.$i18n.locale],
              text: m.chartOptions.chartName[this.$i18n.locale],
            });  
          this.selectedInd = this.indList[0].text;
          }
          rMapping = allMappings.filter((mAll) =>
            m.chartOptions.dataMapping.includes(mAll.indicator.static_name)
          );
          if (rMapping.length) {
            rMapping.forEach((element, i) => {
              element.indicator.subIndicator.forEach((subEle) => {
                subEle.selectedDE.forEach((s) => {
                  de.push(s.id);
                  mapObj.dx.push(s.id);
                  mapObj.cyp[s.id] = 1;
                });
              });
            });
            catArray.push(mapObj);
          }
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
    mapPic(data){
      data['locVal'] = this.locValue.toLocaleString();
      data['location'] = this.locationPeriod.locationName;
      data['selectedInd'] = this.selectedInd
      this.$emit("mapPic" , data);
    }
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
