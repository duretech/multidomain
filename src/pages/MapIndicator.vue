<template>
  <div class="mdgridviewpage-bg mapIndiBg map-mainpart">
    <div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
      <a href="#" id="tabbar-expand">
        <i class="fas fa-filter"></i>
      </a>
    </div>
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
      ref="headerHeight"
    >
    </Header>
    <div class="container-fluid">
      <div
        class="row m-t-20px map_cardBody dashboardchart-container mapheight pb-5"
      >
        <div class="col-lg-12 h-100">
          <div class="card h-100">
            <div class="card-body p-0">
              <div class="row h-100">
                <div class="col-md-2 h-100 pr-0">
                  <div class="left_menu">
                    <div class="nav-side-menu">
                      <div class="menu-list mt-3">
                        <template v-if="menuList.length">
                          <ul
                            class="menu-content collapse"
                            v-for="(menu, index) in menuList"
                            :key="'menu' + index"
                          >
                            <div
                              class="brand fs-19-1920"
                              :class="{ active: menu.id === activeGroup }"
                            >
                              {{ menu.name[$i18n.locale] }}
                            </div>
                            <template v-for="(item, i) in menu.subGroups">
                              <li
                                :key="i"
                                data-toggle="collapse"
                                :data-target="'#menuitem' + item.id"
                                class="fs-18-1920"
                                :class="
                                  item.id === activeSubGroup ? 'collapsed' : ''
                                "
                                :aria-expanded="
                                  item.id === activeSubGroup ? true : false
                                "
                              >
                                <div
                                  class="d-flex justify-content-between fs-18-1920 map-firstitem"
                                  :class="{
                                    active: item.id === activeSubGroup,
                                  }"
                                >
                                  <a href="javascript:void(0)">{{
                                    item.name[$i18n.locale]
                                  }}</a>
                                  <span class="arrow"></span>
                                </div>
                                <ul
                                  class="sub-menu collapse fs-18-1920 map-activeitem"
                                  :id="'menuitem' + item.id"
                                  :class="
                                    item.id === activeSubGroup ? 'show' : ''
                                  "
                                >
                                  <li
                                    v-for="(items, index) in item.indicators"
                                    :key="index"
                                    @click.prevent.stop="setData(items)"
                                  >
                                    <a
                                      class="fs-17-1920"
                                      :class="{
                                        active: items.id === activeIndicator,
                                      }"
                                      href="javascript:void(0)"
                                    >
                                      <span class="ml-6"
                                        >{{ items.name[$i18n.locale] }}
                                      </span></a
                                    >
                                  </li>
                                </ul>
                              </li>
                            </template>
                          </ul>
                        </template>
                        <div class="text-center" v-else>
                          <b-spinner type="grow" label="Spinning"></b-spinner>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-7 h-100 bubblemap" id="bubblemap">
                  <div class="row mx-0 h-10">
                    <div class="col-md-6" style="padding-left:4px">
                      <span class="d-flex map-section">
                        <p class="map-view mt-3">View</p>
                        <b-button-group class="mx-2">
                          <b-button
                            class="map-btn1"
                            @click="setView('map')"
                            :style="{ opacity: activeTab === 'map' ? 1 : 0.5 }"
                          >
                            <img
                              src="@/assets/images/icons/icon-globe.svg"
                              :style="{ filter: filterColor }"
                              class="mr-3 w-25"
                            />
                            <span>{{ $t("map") }}</span>
                          </b-button>
                          <b-button
                            class="map-btn2"
                            @click="setView('chart')"
                            :style="{
                              opacity: activeTab === 'chart' ? 1 : 0.5,
                            }"
                          >
                            <img
                              src="@/assets/images/icons/map-charticon.svg"
                              :style="{ filter: filterColor }"
                              class="mr-3 w-25"
                            />
                            <span>{{ $t("chart") }}</span>
                          </b-button>
                        </b-button-group>
                      </span>
                    </div>
                    <div class="col-md-3"></div>
                    <div class="col-md-3 map-contain">
                      <span class="d-flex map-section map-newicons">
                        <b-dropdown
                          class="map-dropdown pt-2"
                          v-if="activeTab === 'map'"
                          :title="$t('mapLayer')"
                          v-b-tooltip:hover
                        >
                          <template #button-content>
                            <img
                              src="@/assets/images/icons/mapLayer.svg"
                              class="mr-4 cursor-pointer"
                              :style="{ filter: filterColor }"
                            />
                          </template>
                          <b-dropdown-text>
                            <b-form-radio-group
                              v-model="selectedLayer"
                              :options="optionsLayer"
                              class="mb-3"
                              value-field="item"
                              text-field="name"
                              style="top: 70px"
                            ></b-form-radio-group>
                          </b-dropdown-text>
                        </b-dropdown>
                        <template
                          v-if="
                            activeTab === 'chart' && chartData.series.length
                          "
                        >
                          <img
                            class="cursor-pointer mr-4"
                            :style="{ filter: filterColor }"
                            :title="$t('tableViewIcon')"
                            v-b-tooltip:hover
                            src="@/assets/images/icons/mapTable.svg"
                            @click.prevent.stop="generateTable"
                            v-if="splitViewType === 'chart'"
                          />
                          <img
                            class="cursor-pointer mr-4 mt-1"
                            :style="{ filter: filterColor }"
                            :title="$t('chartViewIcon')"
                            v-b-tooltip:hover
                            src="@/assets/images/icons/map-charticon.svg"
                            @click.prevent.stop="splitViewType = 'chart'"
                            v-if="splitViewType === 'table'"
                          />
                        </template>
                        <template v-if="chartData.series.length">
                          <img
                            class="cursor-pointer"
                            v-if="
                              activeTab === 'map' || splitViewType === 'chart'
                            "
                            :style="{ filter: filterColor }"
                            :title="$t('downloadIcon')"
                            v-b-tooltip:hover
                            src="@/assets/images/icons/mapDownload.svg"
                            @click.prevent.stop="callChildMethod('exportChart')"
                          />
                          <download-csv
                            v-else
                            class="btn color-white cursor-pointer w-100 p-0 text-left"
                            :data="chartTable"
                            :fields="fields"
                            :title="$t('downloadIcon')"
                            v-b-tooltip:hover
                            ><img
                              class="mr-1 cursor-pointer"
                              :style="{ filter: filterColor }"
                              src="@/assets/images/icons/mapDownload.svg"
                          /></download-csv>
                        </template>
                      </span>
                    </div>
                  </div>
                  <div class="h-90" v-if="activeTab === 'map'">
                    <MapComponent
                      ref="map"
                      v-if="dataFetched"
                      :showScales="true"
                      :chartData="chartData"
                      @getScales="getScales"
                      @getGeoData="getGeoData"
                      :allGeoJson="allGeoJson"
                      :selectedInd="selectedInd"
                      :selectedLayer="selectedLayer"
                      :locationPeriod="locationPeriod"
                      :mapConfigData="activeIndicatorObj"
                    />
                    <div
                      class="align-items-center d-flex justify-content-center h-400px"
                      v-else
                    >
                      <b-spinner type="grow" label="Spinning"></b-spinner>
                    </div>
                  </div>
                  <div class="h-90 mt-3" v-if="activeTab === 'chart'">
                    <highcharts
                      class="maincharts w-100"
                      :options="chartData"
                      ref="barCharts"
                      v-if="splitViewType === 'chart'"
                    ></highcharts>
                    <div class="tables" v-else>
                      <b-table
                        :items="chartTable"
                        :fields="fields"
                        bordered
                        show-empty
                        sticky-header="385px"
                        :empty-text="$t('no_data_to_display')"
                      >
                      </b-table>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 h-100 pl-0">
                  <div class="right_menu h-100">
                    <div class="nav-side-menu h-100">
                      <div class="searchbox">
                        <div class="d-flex form-group has-search fs-15-1920">
                          <span
                            class="fa fa-search form-control-feedback"
                          ></span>
                          <input
                            type="text"
                            class="form-control"
                            :placeholder="this.$i18n.t('search')"
                            v-model="searchText"
                          />
                          <download-csv
                            class="btn download-btn"
                            :data="rightMenuList"
                            :fields="['name', 'value', 'period']"
                            :title="$t('downloadIcon')"
                            v-b-tooltip:hover
                            ><img
                              class="mr-1 cursor-pointer"
                              :style="{
                                filter: filterColor,
                                width: '16px',
                                height: '16px',
                              }"
                              src="@/assets/images/icons/mapDownload.svg"
                          /></download-csv>
                        </div>
                      </div>
                      <div class="menu-list mx-2" v-if="rightMenuList.length">
                        <ul
                          id="menu-content"
                          class="menu-content collapse out"
                          v-if="rightMenuListFiltered.length === 0"
                        >
                          <li class="text-center no-data-error-msg">
                            {{ $t("no_data_to_display") }}
                          </li>
                        </ul>
                        <ul
                          id="menu-content"
                          class="menu-content collapse out"
                          v-for="(item, i) in rightMenuListFiltered"
                          :key="'item' + i"
                        >
                          <li
                            class="row position-relative"
                            style="cursor: context-menu"
                          >
                            <a
                              href="javascript:void(0)"
                              class="col-9 px-0 text-truncate fs-17-1920"
                              style="cursor: context-menu"
                            >
                              <img
                                :src="
                                  require('@/assets/images/icons/mapfile-icon.svg')
                                "
                                class="w-14 mr-2"
                                :style="{ filter: filterColor }"
                              />
                              {{ item.name }}
                            </a>
                            <template class="col-2 px-0 text-center">
                              <span
                                class="badge badge-dark badgeNumberPosition fs-14-1920"
                                :class="item.textColor"
                                :style="{
                                  backgroundColor: item.bgColor,
                                }"
                                >{{ item.value }}</span
                              >
                            </template>
                          </li>
                        </ul>
                      </div>
                      <div class="text-center no-data-error-msg pt-3" v-else>
                        <template v-if="dataFetched">
                          {{ $t("no_data_to_display") }}
                        </template>
                        <template v-else>
                          <b-spinner type="grow" label="Spinning"></b-spinner>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer
      :globalPeriodData="globalPeriodData"
      @getLocationPeriod="getLocationPeriod"
      ref="footerHeight"
    />
  </div>
</template>

<script>
import service from "@/service";
import {
  getChild,
  chartExport,
  getDateRange,
  generateChart,
  translateDate,
  translateAlphatoNum,
} from "@/components/Common/commonFunctions";
import GeoJsonMixin from "@/helpers/GeoJsonMixin";
import { commonChartConfig } from "@/config/basicChartConfig";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
export default {
  props: ["preFetchData"],
  components: {
    MapComponent: () =>
      import(
        /*webpackChunkName: "MapComponent"*/ "@/components/Maps/MapComponent"
      ),
  },
  mixins: [
    GeoJsonMixin,
    DynamicImageMixin,
    DocumentTitleMixin,
    ReFetchConfigMixin,
    UsesAnalyticsMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      fields: [],
      emuData: {},
      scales: null,
      geoData: null,
      chartTable: [],
      searchText: "",
      selectedInd: "",
      activeTab: "map",
      mapResponse: null,
      activeGroup: null,
      dataFetched: false,
      locationPeriod: null,
      activeSubGroup: null,
      activeIndicator: null,
      abortController: null,
      splitViewType: "chart",
      globalPeriodData: null,
      selectedLayer: "Default",
      activeIndicatorObj: null,
      chartData: JSON.parse(JSON.stringify(commonChartConfig)),
      optionsLayer: [
        {
          name: "OpenStreetMap.Mapnik",
          item: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        },
        {
          name: "OpenTopoMap",
          item: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        },
        {
          name: "CartoDB.DarkMatter",
          item: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        },
        {
          name: "Esri.DeLorme",
          item: "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
        },
        {
          name: "Esri.WorldImagery",
          item: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        },
        {
          name: this.$i18n.t("default"),
          item: "Default",
        },
      ],
    };
  },
  computed: {
    rightMenuListFiltered() {
      if (this.rightMenuList.length) {
        return this.rightMenuList.filter((item) => {
          return item.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
        });
      } else {
        return [];
      }
    },
    rightMenuList() {
      let m = [];
      if (this.geoData) {
        this.geoData.forEach((d) => {
          if (Object.keys(d).length) {
            let value = d.value.split(":")[1].trim(),
              name = d.name,
              period = d.period
                ? translateDate({
                    rawDate: d.period,
                    periodType: this.locationPeriod.periodType,
                  })
                : null;
            let obj = {
              name,
              value,
              period,
              // bgColor: "#65648c",
              bgColor: "#A0ADBA",
              textColor: "dark-text",
            };
            if (this.scales) {
              for (let i = 0; i < this.scales.length; i++) {
                if (
                  value * 1 >= this.scales[i]["lowScale"] &&
                  value * 1 <= this.scales[i]["highScale"]
                ) {
                  obj.bgColor = this.scales[i]["scaleColor"];
                  break;
                }
              }
              let brightness = this.lightOrDark(obj.bgColor);
              // If the background color is dark, add the light-text class to it else add dark-text
              obj.textColor =
                brightness === "dark" ? "light-text" : "dark-text";
            }
            m.push(obj);
          }
        });
      }
      if (m.length) {
        m = m.sort((a, b) => {
          return b.value - a.value;
        });
      }
      return m;
    },
    menuList() {
      let menu = [];
      if (this.mapResponse?.length) {
        this.mapResponse.forEach((m) => {
          if (m.visible) {
            let innerGroup = {
              ...m,
              subGroups: [],
            };
            m.subGroups.forEach((s) => {
              if (s.visible) {
                let innerSubGroup = {
                  ...s,
                  indicators: [],
                };
                s.indicators.forEach((i) => {
                  if (i.visible && (i.subIndicator.length || i.isSavedData)) {
                    let innerSubInd = {
                      ...i,
                      subIndicator: [],
                    };
                    i.subIndicator.forEach((si) => {
                      if (si.selectedDE.length) {
                        innerSubInd.subIndicator.push(si);
                      }
                    });
                    if (innerSubInd.subIndicator.length || i.isSavedData) {
                      innerSubGroup.indicators.push(innerSubInd);
                    }
                  }
                });
                if (innerSubGroup.indicators.length) {
                  innerGroup.subGroups.push(innerSubGroup);
                }
              }
            });
            if (innerGroup.subGroups.length) {
              menu.push(innerGroup);
            }
          }
        });
      }
      return menu;
    },
    getHeight() {
      if (
        this.$refs.headerHeight.$el.clientHeight &&
        this.$refs.footerHeight.$el.clientHeight
      ) {
        return (
          this.$refs.headerHeight.$el.clientHeight +
          this.$refs.footerHeight.$el.clientHeight +
          10 +
          "px"
        );
      } else {
        return 0;
      }
    },
  },
  watch: {
    menuList(newValue) {
      if (newValue.length) {
        let data = newValue[0].subGroups[0].indicators[0];
        this.setData(data);
      }
    },
    locationPeriod: {
      handler(newValue, oldValue) {
        if (
          (!oldValue && newValue.location) ||
          (oldValue &&
            (newValue.location !== oldValue.location ||
              newValue.periodType !== oldValue.periodType ||
              newValue.period !== oldValue.period))
        ) {
          this.$nextTick(() => {
            this.setData(this.activeIndicatorObj);
            this.getGeoJson(newValue.location); //mixin function
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    generateTable() {
      let tableData = [];
      let tableKey = "Period";
      this.fields = [tableKey];
      this.chartData.series.forEach((s) => {
        if (!s.isBenchmark) {
          let n = s.name;
          this.fields.push(n);
          s.data.forEach((d) => {
            let itemFoundIndex = tableData.findIndex(
              (t) => t[tableKey] === d.name
            );
            if (itemFoundIndex >= 0) {
              tableData[itemFoundIndex] = {
                ...tableData[itemFoundIndex],
                [n]: d.y,
              };
            } else {
              tableData.push({
                [tableKey]: d.name,
                [n]: d.y,
              });
            }
          });
        }
      });
      if (tableData.length) {
        this.chartTable = tableData;
        this.$nextTick(() => {
          this.splitViewType = "table";
        });
      }
    },
    getScales(scales) {
      this.scales = scales;
    },
    getGeoData(data) {
      this.geoData = data;
    },
    resetData() {
      //Please maintain the sequence
      this.dataFetched = false;
      this.$nextTick(() => {
        this.scales = null;
        this.geoData = null;
        this.activeTab = "map";
        this.splitViewType = "chart";
        this.chartData = JSON.parse(JSON.stringify(commonChartConfig));
      });
    },
    setData(data) {
      if (data) {
        this.resetData();
        this.activeGroup = data.groupId;
        this.activeSubGroup = data.subGroupId;
        this.activeIndicator = data.id;
        this.activeIndicatorObj = data;
        this.selectedInd = this.activeIndicatorObj.name[this.$i18n.locale];
        if (data.isSavedData) {
          if (["monthly", "yearly"].includes(this.locationPeriod.periodType)) {
            this.getEMUData();
          } else {
            this.sweetAlert({ title: this.$i18n.t("emuNotAvailable") });
            this.$nextTick(() => {
              this.dataFetched = true;
            });
          }
        } else {
          this.getData();
        }
      }
    },
    async getEMUData(periodType = this.locationPeriod.periodType) {
      if (
        this.preFetchData &&
        this.preFetchData[`${periodType}_${this.$i18n.locale}`]
      ) {
        this.$set(
          this.emuData,
          `${periodType}_${this.$i18n.locale}`,
          this.preFetchData[`${periodType}_${this.$i18n.locale}`]
        );
      }
      if (
        !this.emuData[`${periodType}_${this.$i18n.locale}`] &&
        ["monthly", "yearly"].includes(periodType)
      ) {
        let configKey = null;
        if (periodType === "monthly") {
          configKey = `monthlyEMU_${this.$i18n.locale}`;
        }
        if (periodType === "yearly") {
          configKey = `annualEMU_${this.$i18n.locale}`;
        }
        let key = this.generateKey(configKey);

        try {
          let response = await service.getSavedConfig({ tableKey: key });
          this.$set(
            this.emuData,
            `${periodType}_${this.$i18n.locale}`,
            response.data
          );
        } catch (err) {
          this.$set(
            this.emuData,
            `${periodType}_${this.$i18n.locale}`,
            "Error"
          );
        }
      }
      this.$nextTick(() => {
        this.getEMUChart();
      });
    },
    getMapping() {
      let catArray = [],
        de = [];
      let mapObj = {
        name: this.activeIndicatorObj.name[this.$i18n.locale],
        color: null,
        visible: true,
        dx: [],
        cyp: {},
      };
      this.activeIndicatorObj.subIndicator.forEach((subEle) => {
        subEle.selectedDE.forEach((s) => {
          de.push(s.id);
          mapObj.dx.push(s.id);
          mapObj.cyp[s.id] = 1;
        });
      });
      catArray.push(mapObj);
      de = de.join(";");
      return {
        de,
        catArray,
      };
    },
    getData() {
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
        periodLength: 12,
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
                  chartCategory: "trend",
                  isSingleSource: true,
                  chartDrillDown: true,
                },
              });
              this.chartData = cObj;
            } else {
              // errorMsg: "No Data to Display",
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
    async getEMUChart() {
      let emuResponse = JSON.parse(JSON.stringify(this.emuData));
      emuResponse =
        emuResponse[`${this.locationPeriod.periodType}_${this.$i18n.locale}`];
      if (emuResponse) {
        let locationID = this.locationPeriod.location.split("/")[1],
          locID = [],
          locIDLabels = [];
        let children = [];
        if (this.preFetchData?.orgList?.length) {
          children = getChild({
            locationList: this.preFetchData.orgList,
            location: locationID,
          });
        } else {
          try {
            let response = await service.getChildOrganisation(locationID);
            children = response?.data?.children || [];
          } catch (err) {
            console.log("err", err);
          }
        }
        if (children.length) {
          children.forEach((l) => {
            locID.push(l.id);
            locIDLabels.push({
              id: l.id,
              label: l.displayName,
            });
          });
        }
        let emuData = null,
          emuDataKey = null;
        let emuMethodDataKey = null;
        let emuSourceKey = null;

        if (this.locationPeriod.periodType === "monthly") {
          emuDataKey = "totalEMU";
          emuMethodDataKey = "methodTrend";
        }

        if (this.locationPeriod.periodType === "yearly") {
          emuDataKey = "compEMU";
          emuMethodDataKey = "usersTrend";
        }
        let eData =
          typeof emuResponse[emuDataKey] === "string"
            ? JSON.parse(emuResponse[emuDataKey])
            : emuResponse[emuDataKey];
        emuData = eData[locationID];
        if (emuData) {
          if (this.locationPeriod.periodType === "yearly") {
            if (emuData.source === this.$i18n.t("emu_output_5")) {
              emuSourceKey = "commoditiesToClients";
            } else if (emuData.source === this.$i18n.t("emu_output_6")) {
              emuSourceKey = "commoditiesToFacilities";
            } else if (emuData.source === this.$i18n.t("emu_output_8")) {
              emuSourceKey = "fp_users";
            } else if (emuData.source === this.$i18n.t("emu_output_7")) {
              emuSourceKey = "fp_visits";
            } else {
              emuSourceKey = "commoditiesToClients";
            }
          }
          let eMethodData =
            typeof emuResponse[emuMethodDataKey] === "string"
              ? JSON.parse(emuResponse[emuMethodDataKey])
              : emuResponse[emuMethodDataKey];
          this.emuMethodData = emuSourceKey
            ? eMethodData[locationID][emuSourceKey]
            : eMethodData[locationID];
          let emuObj = null,
            sourceKey = null,
            innerDataKey = null;
          if (this.locationPeriod.periodType === "monthly") {
            sourceKey = this.$i18n.t("EMU");
            innerDataKey = "saveData";
          }
          if (this.locationPeriod.periodType === "yearly") {
            if (this.$i18n.locale === "fr") {
              sourceKey = emuData.source
                ? emuData.source
                : "EUM : Produits aux clients";
            } else {
              sourceKey = emuData.source
                ? emuData.source
                : "EMU :Commodities to clients";
            }
            innerDataKey = "data";
          }
          // return;
          // this.compareKey = sourceKey;
          emuObj = emuData[innerDataKey].find((e) => e.name === sourceKey);
          if (emuObj) {
            let dataArr = [];

            let formattedCatArray = [];
            if (this.locationPeriod.periodType === "monthly") {
              emuData.saveCategories.forEach((c) =>
                formattedCatArray.push(translateAlphatoNum(c))
              );
            }
            if (this.locationPeriod.periodType === "yearly") {
              formattedCatArray = emuData.categories;
            }
            let pe = getDateRange({
              sendPeriod: this.locationPeriod.period,
              periodType: this.locationPeriod.periodType,
              periodLength: 12,
            });
            pe = pe.reverse();
            let drilldown = {
              drillUpButton: {
                position: {
                  align: "left",
                  x: 0,
                  y: 0,
                },
              },
              series: [],
            };
            pe.forEach((p) => {
              let formattedDate = translateDate({
                rawDate: p,
                // periodType: this.locationPeriod.periodType,
              });
              // let formattedDate = this.$store.getters.getPeriod[p].name;
              if (formattedCatArray.includes(p)) {
                let catIndex = formattedCatArray.indexOf(p);
                let drillText = formattedDate;
                dataArr.push({
                  pe: p,
                  name: formattedDate,
                  y: emuObj.data[catIndex].toFixed(2) * 1,
                  drilldown: drillText,
                });
                let drillObj = {
                  name: drillText,
                  id: drillText,
                  type: "column",
                  data: [],
                };

                Object.keys(eData).forEach((locKey) => {
                  if (locID.includes(locKey)) {
                    let innerData =
                      eData[locKey] &&
                      eData[locKey][innerDataKey] &&
                      eData[locKey][innerDataKey].length > 0
                        ? eData[locKey][innerDataKey].find(
                            (e) => e.name === sourceKey
                          )
                        : null;
                    let locName = locIDLabels.find(
                      (l) => l.id === locKey
                    ).label;
                    if (innerData) {
                      let currValue = innerData.data[catIndex] * 1 || null;
                      let y = currValue ? currValue.toFixed(2) * 1 : null;
                      let color = y > 0 ? "#5BD282" : "#FE8081";
                      drillObj.data.push({
                        y,
                        color,
                        name: locName,
                        locationID: locKey,
                        originalY: y,
                      });
                    } else {
                      console.log("EMU not found for location ", locName);
                    }
                  }
                });
                drilldown.series.push(drillObj);
              } else {
                dataArr.push({
                  name: formattedDate,
                  y: null,
                  pe: p,
                  drilldown: null,
                });
              }
            });

            this.chartData.series = [
              {
                name: this.activeIndicatorObj.name[this.$i18n.locale],
                color: null,
                data: dataArr,
              },
            ];
            if (drilldown.series.length) {
              this.chartData.drilldown = drilldown;
            }
            this.dataFetched = true;
          } else {
            this.dataFetched = true;
          }
        } else {
          this.dataFetched = true;
        }
      } else {
        this.dataFetched = true;
      }
    },
    getConfigData() {
      let key = this.generateKey("mapVisualization");
      service
        .getSavedConfig({ tableKey: key })
        .then((response) => {
          this.mapResponse = response.data;
        })
        .catch((err) => {
          console.log("Config not found...");
          this.reFetchConfig(err);
        });
    },
    callChildMethod(method) {
      try {
        if (this.activeTab === "map") {
          this.$refs.map[method]();
        }
        if (this.activeTab === "chart") {
          chartExport("jpg", this.$refs.barCharts.chart);
        }
      } catch (e) {
        this.sweetAlert({ title: this.$i18n.t("somethingwentwrong") });
      }
    },
    lightOrDark(color) {
      // Variables for red, green, blue values
      var r, g, b, hsp;

      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(
          "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
        );

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

      // Using the HSP value, determine whether the color is light or dark
      if (hsp > 127.5) {
        return "light";
      } else {
        return "dark";
      }
    },
    setView(view) {
      this.activeTab = view;
    },
    getLocationPeriod(locPeObj) {
      this.locationPeriod = locPeObj;
    },
  },
  created() {
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period; //Get period from global factors
    this.getConfigData();
  },
};
</script>

<style lang="scss" scoped>
.mdgridviewpage-bg {
  background-size: cover;
  background-position: center;
}

.map_cardBody {
  height: calc(100vh - v-bind("getHeight"));
  overflow: hidden;

  border-radius: 5px;
}

.nav-side-menu {
  overflow: auto;
  /* font-family: verdana; */
  font-size: 0.75rem;
  font-weight: 200;
  /* position: fixed; */
  top: 0px;
  /* width: 300px; */
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  color: var(--color-black);
  background: var(--primary-bg-color) 0% 0% no-repeat padding-box;
  opacity: 1;
}
.nav-side-menu .brand {
  line-height: 40px;
  display: block;
  background-color: var(--sidebar-subgroup-color) !important;
  opacity: 1;
  border: 1px solid transparent;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  font-size: var(--font-size-chart-sidebar-heading);
  color: var(--sidebar-maincolor) !important;
  font-weight: 400;
  font-size: 13px;
  padding-left: 8%;
  margin-right: 18px !important;
}

.nav-side-menu .toggle-btn {
  display: none;
}
.nav-side-menu ul,
.nav-side-menu li {
  list-style: none;
  padding: 0px;
  margin: 0px;
  line-height: 35px;
  cursor: pointer;
  font-size: 13px;
}

.nav-side-menu ul :not(collapsed) .arrow:before,
.nav-side-menu li :not(collapsed) .arrow:before {
  font-family: FontAwesome;
  content: "\f078";
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  float: right;
  color: var(--icons-active-color);
  font-size: 7px !important;
  transform: rotate(271deg);
}

.nav-side-menu ul .collapsed .arrow:before,
.nav-side-menu li .collapsed .arrow:before {
  font-family: FontAwesome;
  content: "\f078";
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  float: right;
  color: var(--icons-active-color);
  font-size: 7px !important;
  transform: rotate(2deg);
}

.nav-side-menu ul .sub-menu li,
.nav-side-menu li .sub-menu li {
  //background-color: #181736;
  border: none;
  line-height: 28px;
  //border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  // margin-left: 8%;
  display: flex;
  align-items: center;
  margin: 0px !important;
}

.nav-side-menu li .sub-menu li a {
  color: var(--sidebar-maincolor) !important;
}
.nav-side-menu li .sub-menu li a:active,
.nav-side-menu li .sub-menu li a:focus {
  color: var(--sidebar-activecolor);
  border-left: 3px solid var(--sidebar-border-left) !important;
}
.nav-side-menu li {
  padding-left: 0px;
  // border-left: 3px solid #f4f4f4;
  //border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 48px;
  padding-right: 16px;
  //margin-left: 4%;
}

.nav-side-menu li:hover {
  // background: var(--active-option-liner-gradient-color);
  border: 1px solid transparent;

  //border-top-right-radius: 30px;
  //border-bottom-right-radius: 30px;
  color: var(--sidebar-activecolor);
}
.menu-list #menu-content li {
  margin-right: 4%;
}
.nav-side-menu li a {
  text-decoration: none;
  // color: #f2f2f2;

  line-height: 20px;
  display: flex;
  align-items: center;
  /* height: 100%; */
  color: var(--sidebar-maincolor);
  opacity: 1;
  text-align: left;
  //letter-spacing: 0.8px;
  font-size: 13px;
  font-weight: 400;
}

.nav-side-menu li a span {
  font-size: 0.75rem !important;
}

.top_menu .nav-side-menu li a {
  height: 100%;
}
.nav-side-menu li a i {
  padding-left: 10px;
  width: 20px;
  padding-right: 20px;
}

.nav-side-menu li a:active {
  color: var(--sidebar-activecolor) !important;
}

.nav-side-menu li:active {
  color: var(--sidebar-activecolor) !important;
}

.nav-side-menu li .sub-menu li a.active {
  color: var(--sidebar-activecolor) !important;
  border-left: 3px solid var(--sidebar-border-left) !important;
}
.map-firstitem ul:active {
  color: var(--sidebar-activecolor) !important;
}

.map-firstitem.active {
  background-color: var(--active-option-liner-gradient-color) !important;
}

@media (max-width: 767px) {
  .nav-side-menu {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .nav-side-menu .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: var(--color-white);
    color: var(--color-black);
    width: 40px;
    text-align: center;
  }
  .brand {
    text-align: left !important;
    font-size: 1.375rem;
    padding-left: 20px;
    line-height: 50px !important;
  }
}
@media (min-width: 767px) {
  .nav-side-menu .menu-list .menu-content {
    display: block;
  }
}
body {
  margin: 0px;
  padding: 0px;
}

.nav-side-menu ul .sub-menu li .sub-line li,
.nav-side-menu li .sub-menu li .sub-line li {
  /* background-color: #181c20; */
  border: none;
  line-height: 28px;
  border-bottom: 1px solid var(--border-grey-color);
  margin-left: 0px;
}

.nav-side-menu ul .sub-menu li .sub-line li:before,
.nav-side-menu li .sub-menu li .sub-line li:before {
  font-family: FontAwesome;
  content: "\f105";
  display: inline-block;
  padding-left: 100px;
  padding-right: 10px;
  vertical-align: middle;
}

.nav-side-menu .sub-menu li {
  padding-left: 14px;
  border-left: 3px solid var(--border-grey-color);
  border-bottom: 1px solid var(--border-grey-color);
}
.nav-side-menu .sub-menu li a {
  text-decoration: none;
  
}

.sub-menu li a i {
  padding-left: 10px;
  width: 20px;
  padding-right: 20px;
}

@media (max-width: 767px) {
  .nav-side-menu .sub-menu {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .nav-side-menu .sub-menu .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: var(--color-white);
    color: var(--color-black);
    width: 40px;
    text-align: center;
  }
}

.sub-line ul .sub-press li,
.sub-line li .sub-press li {
  /*  background-color: #181c20; */
  border: none;
  line-height: 28px;
  border-bottom: 1px solid var(--border-grey-color);
  margin-left: 0px;
}
.sub-line ul .sub-press li:before,
.sub-line li .sub-press li:before {
  font-family: Arial;
  content: "\f105";
  display: inline-block;
  padding-left: 50px;
  padding-right: 10px;
  vertical-align: middle;
}

.sub-line li {
  padding-left: 20px;
  border-left: 3px solid var(--border-grey-color);
  border-bottom: 1px solid var(--border-grey-color);
}
.sub-line li a {
  text-decoration: none;
  color: var(--text-color);
}
.sub-line li a i {
  padding-left: 50px;
  width: 20px;
  padding-right: 20px;
}

@media (max-width: 767px) {
  .sub-line {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .sub-line .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: var(--color-white);
    color: var(--color-black);
    width: 40px;
    text-align: center;
  }
}
.top_menu .nav {
  display: flex;
  justify-content: flex-start;
  background: var(--new-header-color);
}
.top_menu .nav-item {
  margin-left: 0;
}

.top_menu li {
  border: 0;
}
.top_menu li.nav-item {
  padding: 0px 0;
}

.top_menu li.nav-item:hover .fa {
  color: var(--list-text-color);
}
.top_menu .nav-link .fa {
  padding-left: 0px;
  width: auto;
  padding-right: 0px;
  // color: #ddd;
}
.right_menu .fa {
  color: var(--fa-subfirst-color);
}
.right_menu .nav-side-menu li a {
  line-height: 23px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.has-search .form-control {
  padding-left: 2.375rem;
  border: 0;
  border-radius: 0;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: var(--text-color);
}
.form-group.has-search {
  margin-bottom: 0;
  position: relative;
}
.informationDiv p {
  margin-bottom: 0%;
  font-size: 0.875rem;
  font-weight: 100;
}
.accordion-head i {
  font-size: 1.5rem;
  float: right;
}

.accordion-head > .collapsed > i:before {
  content: "\f105";
}
#selectionModal .form-check {
  min-height: 45px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
#selectionModal .form-check-label {
  font-size: 0.875rem;
  font-weight: 100;
}
.accordion-heading {
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 0;
  font-weight: 100;
}
a:hover {
  text-decoration: none;
}

.top_menu {
  .nav-link {
    height: 100%;
    width: 49px;
    padding: 9px 10px;
    display: flex;
    justify-content: center;
    font-size: 1.7rem;
    color: var(--text-color);
  }

  .nav-link:hover .fa {
    color: var(--text-color);
  }
}
.searchbox {
  position: sticky;
  width: 100%;
  top: 1px;
  z-index: 1;
}
.sub-menu li:last-child {
  border-bottom: none !important;
}

.light-text {
  color: var(--main-theme-white-color);
  opacity: 1;
  width: 64px;
  height: 16px;
  padding-top: 2%;
  padding-bottom: 5%;
}

.dark-text {
  //background-color: #464287 !important;
  letter-spacing: 0.7px;
  color: var(--color-black);
  opacity: 1;
  width: 64px;
  height: 16px;
  padding-top: 2%;
  padding-bottom: 5%;
  //height: 24px;
  //padding-top:3%;
}

.searchbox .form-control {
  background: var(--primary-bg-color) 0% 0% no-repeat padding-box !important;
  border-color: var(--primary-bg-color) !important;
  opacity: 1;
  letter-spacing: 0.7px;
  color: var(--text-color) !important;
}

.download-btn {
  background: var(--primary-bg-color) 0% 0% no-repeat padding-box !important;
  border-radius: inherit !important;
}
.searchbox {
  background: var(--primary-bg-color) 0% 0% no-repeat padding-box !important;
}

.map-activeitem:active {
  color: var(--text-color) !important;
}
</style>
