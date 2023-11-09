<template>
  <div class="integratedDashboardPage">
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    />
    <div class="integratedFamilyWrap py-4">
      <b-container fluid class="px-5">
        <b-row>
          <b-col sm="12" class="mb-3">
            <p class="fs-17-1920 integratedPlanningText">
              {{ $t("indDashboard") }}
            </p>
            <button
              type="button"
              class="btn btn-primary blue-btn ml-3 float-right"
              @click.prevent.stop="downloadReport()"
            >
              <span class="">
                <img
                  :src="require('@/assets/images/icons/generateReport.svg')"
                  class="img-fluid mt-xl-n1"
                />
              </span>
              <span class="mx-1"> {{ $t("exportbtn") }} </span>
            </button>
          </b-col>
          <b-col sm="12">
            <div id="myDivToPrint">
              <b-row>
                <b-col
                  ref="leftBox"
                  class="transparentDiv"
                  id="myDivToPrintLeft"
                >
                  <div class="integratedSummaryCountWrap" ref="leftSummaryBox">
                    <div>
                      <b-row class="pl-3 pr-3">
                        <b-col sm="3" class="pr-1 pl-0" v-if="isFPModules">
                          <div
                            class="fs-17-1920 programName"
                            :class="{ programNameDownload: exportingPdf }"
                          >
                            {{ $t("family_planning") }}
                          </div>
                        </b-col>
                        <b-col class="px-0">
                          <div
                            class="fs-17-1920 programName"
                            :class="{
                              programNameDownload: exportingPdf,
                            }"
                            v-if="
                              isMNCHModules &&
                              isMNCHSummaryModules &&
                              summaryScore.length
                            "
                          >
                            {{ $t("maternalHealth") }}
                          </div>
                        </b-col>
                      </b-row>
                      <b-row class="pl-3 pr-3">
                        <b-col sm="3" class="pr-1 pl-0 mb-1" v-if="isFPModules">
                          <div
                            class="integratedBoxWrap purpleBox"
                            :style="{ 'background-color': emuValueColor }"
                          >
                            <div class="textDivWrap">
                              <p class="fs-17-1920 courseName">
                                {{ $t("EMU") }}
                              </p>
                              <div
                                class="fs-17-1920 courseCount"
                                v-if="emuValue"
                              >
                                {{
                                  emuValue === $t("NA")
                                    ? emuValue
                                    : `${emuValue}%`
                                }}
                              </div>
                              <b-spinner
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                              <p class="fs-17-1920 courseText">
                                {{ $t("estimatedUse") }}
                              </p>
                              <div class="overlay">
                                <div class="text">
                                  <div class="integratedDashboardOverlay">
                                    <i
                                      class="fa fa-bar-chart"
                                      aria-hidden="true"
                                    ></i
                                    ><button
                                      class="btn purple-btn fs-17-1920"
                                      @click.prevent.stop="
                                        goTo({
                                          module: 'fp-dashboard',
                                          setNamespace: true,
                                          routeName: 'dashboard',
                                          redirectDetails: {
                                            routeName: 'SummaryDashboard',
                                            locationPeriod: locationPeriod,
                                          },
                                        })
                                      "
                                    >
                                      {{ $t("viewMore") }}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-col>
                        <template v-if="isMNCHModules && isMNCHSummaryModules">
                          <div
                            class="show-div"
                            :class="{ 'maternal-health': !exportingPdf }"
                          >
                            <template v-for="(summary, i) in summaryScore">
                              <b-col
                                sm="4"
                                class="px-0 mb-1"
                                :key="'summary' + i"
                                v-if="!summary.isHide && summary.dx.length"
                              >
                                <div
                                  class="integratedBoxWrap pinkBox"
                                  :style="{ 'background-color': summary.color }"
                                >
                                  <div class="textDivWrap">
                                    <p class="fs-17-1920 courseName">
                                      {{ summary.shortName }}
                                    </p>
                                    <div
                                      class="fs-17-1920 courseCount"
                                      v-if="
                                        !isNaN(summary.value) &&
                                        summary.value !== ''
                                      "
                                    >
                                      {{ getValue(summary) }}
                                    </div>
                                    <b-spinner
                                      type="grow"
                                      label="Spinning"
                                      v-else
                                    ></b-spinner>
                                    <p class="fs-17-1920 courseText">
                                      {{ summary.displayName }}
                                    </p>
                                    <div class="overlay">
                                      <div class="text">
                                        <div class="integratedDashboardOverlay">
                                          <i
                                            class="fa fa-bar-chart"
                                            aria-hidden="true"
                                          ></i
                                          ><button
                                            class="btn purple-btn fs-17-1920"
                                            @click.prevent.stop="
                                              goTo({
                                                module: 'mnch-dashboard',
                                                setNamespace: true,
                                                routeName: 'dashboard',
                                                redirectDetails: {
                                                  routeName: 'SummaryDashboard',
                                                  activeTab: summary.link,
                                                  locationPeriod:
                                                    locationPeriod,
                                                },
                                              })
                                            "
                                          >
                                            {{ $t("viewMore") }}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </b-col>
                            </template>
                          </div>
                        </template>
                      </b-row>
                    </div>
                  </div>
                  <b-row class="my-2" ref="leftNavOptions">
                    <b-col sm="12">
                      <button
                        class="btn fs-17-1920 purple-btn mr-3"
                        @click="
                          goTo({
                            module: 'fp-dashboard',
                            setNamespace: true,
                            routeName: 'dashboard',
                          })
                        "
                        v-show="isFPModules"
                      >
                        {{ $t("FPDashboard") }}
                      </button>
                      <button
                        class="btn fs-17-1920 purple-btn"
                        @click="
                          goTo({
                            module: 'mnch-dashboard',
                            setNamespace: true,
                            routeName: 'dashboard',
                          })
                        "
                        v-show="isMNCHModules"
                      >
                        {{ $t("MHDashboard") }}
                      </button>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="ml-1 mr-0 mt-0 mb-4">
                        <b-card
                          class="mapContainer position-relative"
                          :class="{ 'text-center': !loadMap }"
                          :style="leftColStyles"
                          style="height: 535px"
                          id="mapsID"
                        >
                          <template #header>
                            <h6 class="mb-0 fs-17-1920">
                              {{ activeMapTitle }}
                            </h6>
                          </template>
                          <template
                            v-if="
                              (!isNaN(emuValue) && emuValue !== '') ||
                              isMNCHSummaryModules
                            "
                          >
                            <div
                              class="p-0"
                              :class="{
                                'text-center': !(geoJson && actMapData),
                              }"
                              v-if="loadMap"
                              style="height: 500px"
                            >
                              <Maps
                                v-if="geoJson && actMapData"
                                @resetMap="resetMap"
                                :geoJson="geoJson"
                                :mapData="actMapData"
                                :showIcons="true"
                                :key="updateDom"
                                :exportingPdf="exportingPdf"
                              />
                              <b-spinner
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                              <div class="carosalWrap px-3">
                                <carousel
                                  :per-page="4"
                                  :navigationEnabled="true"
                                  :paginationEnabled="false"
                                >
                                  <slide v-if="mapData">
                                    <div
                                      class="iganchorMap"
                                      @click="setMapData(mapData, $t('EMU'))"
                                    >
                                      <Maps
                                        v-if="geoJson && mapData"
                                        :geoJson="geoJson"
                                        :mapData="mapData"
                                        :showIcons="false"
                                        :exportingPdf="exportingPdf"
                                      />
                                    </div>
                                    <p
                                      class="igmapslidertext fs-17-1920 text-center"
                                    >
                                      {{ $t("EMU") }}
                                    </p>
                                  </slide>
                                  <slide
                                    :key="indIndex"
                                    v-for="(ind, indIndex) in Object.keys(
                                      indMapData
                                    )"
                                  >
                                    <div
                                      class="iganchorMap"
                                      @click="setMapData(indMapData[ind], ind)"
                                    >
                                      <Maps
                                        v-if="geoJson && indMapData[ind]"
                                        :geoJson="geoJson"
                                        :mapData="indMapData[ind]"
                                        :showIcons="false"
                                        :exportingPdf="exportingPdf"
                                      />
                                    </div>
                                    <p
                                      class="igmapslidertext fs-17-1920 text-center"
                                    >
                                      {{ ind }}
                                    </p>
                                  </slide>
                                </carousel>
                              </div>
                            </div>
                            <b-spinner
                              type="grow"
                              label="Spinning"
                              v-else
                            ></b-spinner>
                          </template>
                          <b-row v-else>
                            <b-col
                              sm="12"
                              class="text-center no-data-error-msg"
                            >
                              {{ $t("notAuthorized") }}
                            </b-col>
                          </b-row>
                        </b-card>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col
                  ref="rightBox"
                  class="transparentDiv"
                  id="myDivToPrintRight"
                >
                  <b-row>
                    <b-col>
                      <div class="m-1 pt-3 mt-2">
                        <h6 class="fs-17-1920 rightSidetext">
                          {{ $t("coverageEstimates") }}
                        </h6>
                        <b-card ref="rightChart" class="mapContainer">
                          <b-card-text class="text-center">
                            <template
                              v-if="
                                (!isNaN(emuValue) && emuValue !== '') ||
                                isMNCHSummaryModules
                              "
                            >
                              <FpIntegrated
                                :chartData="chartData"
                                :summaryScore="summaryScore"
                                :emuValueColor="emuValueColor"
                                v-if="
                                  chartData
                                "
                                :exportingPdf="exportingPdf"
                              />
                              <b-spinner
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                              {{ "1" }}
                            </template>
                            <b-row v-else style="height: 350px">
                              <b-col
                                sm="12"
                                class="text-center no-data-error-msg"
                              >
                                {{ $t("notAuthorized") }}
                              </b-col>
                            </b-row>
                          </b-card-text>
                        </b-card>
                        <b-card
                          ref="rightScore"
                          class="mapContainer scorboardcardHeader mt-5 pt-2"
                          :class="{ 'text-center': dqrScorecard.length === 0 }"
                        >
                          <template #header>
                            <h6 class="mb-0 fs-17-1920 scorboardLabel">
                              {{ $t("DQRScoreboard") }}
                            </h6>
                          </template>
                          <b-row v-if="dqrScorecard.length">
                            <b-col
                              sm="6"
                              v-for="(scoreCard, i) in dqrScorecard"
                              :key="'dqrScorecard-' + i"
                            >
                              <div class="scorboardWrap borderBottomId">
                                <b-row>
                                  <!-- <b-col
                                  <!-- <b-col
                                    sm="2"
                                    class="d-flex align-items-center"
                                  >
                                    <div>
                                      <img
                                        src="@/assets/images/Group 111.svg"
                                      />-->
                                  <!-- Do not add below code -->
                                  <!-- :style="{ filter: filterColor }" -->
                                  <!--</div>
                                  </b-col> -->
                                  <b-col sm="5">
                                    <p class="program-name fs-17-1920">
                                      {{ scoreCard.name[$i18n.locale] }}
                                    </p>
                                  </b-col>
                                  <b-col sm="3">
                                    <p
                                      class="locationName fs-17-1920"
                                      v-if="locationPeriod.locationName"
                                    >
                                      {{ locationPeriod.locationName }}
                                    </p>
                                  </b-col>
                                  <b-col sm="4" class="position-relative">
                                    <Gauge
                                      v-if="scoreCard.score !== null"
                                      :score="scoreCard.score"
                                      :scoreLimit="scoreCard.scoreLimit"
                                    />
                                    <b-spinner
                                      type="grow"
                                      label="Spinning"
                                      v-else
                                    ></b-spinner>
                                  </b-col>
                                </b-row>
                                <div class="overlay-scorecard">
                                  <div class="text">
                                    <div class="integratedDashboardOverlay">
                                      <button
                                        class="btn fs-17-1920 purple-btn"
                                        @click.prevent.stop="
                                          goTo({
                                            module: scoreCard.module,
                                            setNamespace: true,
                                            routeName: scoreCard.route,
                                            redirectDetails: {
                                              routeName:
                                                scoreCard.redirectRoute,
                                              activeTab: scoreCard.link,
                                              locationPeriod: locationPeriod,
                                            },
                                          })
                                        "
                                      >
                                        {{ $t("viewMore") }}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </b-col>
                          </b-row>
                          <b-spinner
                            type="grow"
                            label="Spinning"
                            v-if="
                              dqrScorecard.length === 0 &&
                              (isFPDQRModules || isMNCHDQRModules)
                            "
                          ></b-spinner>
                          <b-row v-if="!isFPDQRModules && !isMNCHDQRModules">
                            <b-col
                              sm="12"
                              class="text-center no-data-error-msg"
                            >
                              {{ $t("notAuthorized") }}
                            </b-col>
                          </b-row>
                        </b-card>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <Footer
      ref="toolbar"
      v-if="globalPeriodData"
      :globalPeriodData="globalPeriodData"
      @getLocationPeriod="getLocationPeriod"
    />
  </div>
</template>
<script>
import service from "@/service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { decompress } from "compress-json";
import { Carousel, Slide } from "vue-carousel";
import Gauge from "@/components/Highcharts/Gauge.vue";
import NavigationMixin from "@/helpers/NavigationMixin";
import Maps from "@/components/Maps/IntegratedFPMap.vue";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import { integratedChartConfig } from "@/config/basicChartConfig";
import FpIntegrated from "@/components/Highcharts/FpIntegrated.vue";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import {
  getChild,
  getDateRange,
  formatSingleDate,
  translateDate,
  getAllPeriodRange,
} from "@/components/Common/commonFunctions";

export default {
  props: ["preFetchData", "dataElements"],
  components: {
    Maps,
    FpIntegrated,
    Gauge,
    Carousel,
    Slide,
  },
  mixins: [
    NavigationMixin,
    DynamicImageMixin,
    DocumentTitleMixin,
    ReFetchConfigMixin,
    UsesAnalyticsMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      emuValue: "",
      emuData: {},
      loadMap: false,
      locIDLabels: [],
      summaryScore: [],
      dqrScorecard: [],
      leftColStyles: {},
      fpScorecard: null,
      locationPeriod: {},
      mnchScorecard: null,
      globalPeriodData: null,
      emuValueColor: "#B83C6D",
      chartData: JSON.parse(JSON.stringify(integratedChartConfig)),
      mapData: null,
      geoJson: null,
      indMapData: {},
      actMapData: null,
      updateDom: 0,
      activeMapTitle: "",
      benchmarkData: {},
      benchmarkDataFP: {},
      fileName: "Scoreboard",
      exportingPdf: false,
    };
  },
  computed: {
    isFPModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.$store.getters.getUserPermissions?.dashboards?.includes(`fp`) ||
            false;
    },
    isFPSummaryModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.isFPModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `summary_dashboard-fp`
          ) || false
        : false;
    },
    isFPDQRModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.isFPModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(`DQR-fp`) ||
          false
        : false;
    },
    isMNCHModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.$store.getters.getUserPermissions?.dashboards?.includes(
            `mnch`
          ) || false;
    },
    isMNCHSummaryModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.isMNCHModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `summary_dashboard-mnch`
          ) || false
        : false;
    },
    isMNCHDQRModules() {
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
        ? true
        : this.isMNCHModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `DQR-mnch`
          ) || false
        : false;
    },
  },
  watch: {
    // emuValue(newValue) {
    //   if (!isNaN(newValue) && newValue !== "") {
    //     let obj = {
    //       y:
    //         !isNaN(newValue) && newValue !== ""
    //           ? newValue.toFixed(2) * 1
    //           : null,
    //       name: this.$i18n.t("EMU"),
    //       color: this.emuValueColor,
    //     };
    //     // let arr = [20, 0, 35];
    //     let obj1 = {
    //       y: null,
    //       name: this.$i18n.t("emuBenchmark"),
    //       color: "#DF5353",
    //     };
    //     this.chartData.xAxis[0].categories.unshift(this.$i18n.t("EMU"));
    //     this.chartData.series[0].data.unshift(obj);
    //     this.chartData.series[1].data.unshift(obj1);
    //     this.setBenchmarkData("fp");
    //   }
    // },
    chartData: {
      handler(newValue) {
        this.$nextTick(() => {
          this.matchHeight();
        });
      },
      deep: true,
    },
    dqrScorecard: {
      handler(newValue) {
        this.$nextTick(() => {
          this.matchHeight();
        });
      },
      deep: true,
    },
    summaryScore(newValue) {
      if (this.locationPeriod.location) {
        this.getSingleValue(newValue);
        this.getIndMapData(newValue);
      }
    },
    mapData() {
      this.activeMapTitle = this.$i18n.t("EMU");
    },
    indMapData(newValue) {
      if (!this.mapData) {
        this.activeMapTitle = Object.keys(newValue).length
          ? Object.keys(newValue)[0]
          : "";
        if (this.activeMapTitle && newValue[this.activeMapTitle]) {
          this.actMapData = JSON.parse(
            JSON.stringify(newValue[this.activeMapTitle])
          );
        }
      }
    },
  },
  methods: {
    getValue(summary) {
      let value = summary.value;
      if (summary.value !== this.$i18n.t("NA")) {
        if (summary.percentIndicator) {
          value = `${value}%`;
        } else {
          value = value.toLocaleString();
        }
      }
      return value;
    },
    resetMap() {
      this.$refs.toolbar.resetMap();
    },
    setMapData(md, name) {
      this.activeMapTitle = name;
      this.actMapData = JSON.parse(JSON.stringify(md));
      this.updateDom++;
    },
    async getIndMapData(newValue) {
      let finalObj = {};
      let promises = [];
      let period = getDateRange({
        sendPeriod: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        periodLength: 1,
      });
      period = period.reverse().join(";");
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let locID = [],
        locIDLabels = [];
      let children = [];
      if (this.preFetchData?.orgList?.length) {
        children = getChild({
          locationList: this.preFetchData.orgList,
          location: location,
        });
      } else {
        try {
          let response = await service.getChildOrganisation(location);
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
      newValue.forEach((d) => {
        let de = d.dx.join(";");
        promises.push(
          service.getIndicatorData(de, [subLevelID], location, period)
        );
      });
      Promise.allSettled(promises).then((results) => {
        results.forEach((res, i) => {
          let key = newValue[i]["shortName"];
          finalObj[key] = [];
          if (res.status === "fulfilled") {
            let value = null;
            locID.forEach((lc) => {
              let locInd = {
                data: "",
                location: lc,
                locationLabel: locIDLabels.filter((obj) => obj["id"] === lc),
              };
              let findD = res.value.data.rows.filter((obj) => obj[2] === lc);

              if (findD.length > 0) {
                findD.forEach((r) => {
                  value = value == null ? r[3] * 1 : value * 1 + r[3] * 1;
                });
              }
              locInd["data"] = value ? value.toFixed(2) * 1 : null;
              finalObj[key].push(locInd);
            });
          }
        });

        this.indMapData = JSON.parse(JSON.stringify(finalObj));
      });
    },
    getSingleValue(newValue) {
      let promises = [],
        graphPromises = [];
      let period = getDateRange({
        sendPeriod: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        periodLength: 1,
      });
      period = period.reverse().join(";");
      let loc = this.locationPeriod.location;
      let location = loc.split("/")[1];
      let levelID = loc.split("/")[0] * 1;
      let subLevelID = levelID + 1;
      let newModifiedValues = [];
      newValue.forEach((d) => {
        // if (d.dx.length) {
        let de = d.dx.join(";");
        promises.push(
          service.getIndicatorData(de, [levelID], location, period)
        );
        // }
        // if (d.graphDX.length) {
        let de1 = d.graphDX.join(";");
        graphPromises.push(
          service.getIndicatorData(de1, [levelID], location, period)
        );
        //}
        if (d.dx.length || d.graphDX.length) {
          newModifiedValues.push(d);
        }
      });
      console.log(
        JSON.parse(JSON.stringify(newValue)),
        JSON.parse(JSON.stringify(newModifiedValues)),
        "newModifiedValues"
      );
      Promise.allSettled(promises).then((results) => {
        results.forEach((res, i) => {
          if (res.status === "fulfilled") {
            let value = 0;
            res.value.data.rows.forEach((r) => {
              value = value * 1 + r[3] * 1;
            });
            newValue[i].value = value.toFixed(2) * 1;
          } else {
            newValue[i].value = this.$i18n.t("NA");
          }
          // if (i === results.length - 1) {
          //   this.setChartData(newValue);
          // }
        });
      });
      Promise.allSettled(graphPromises).then((results) => {
        results.forEach((res, i) => {
          if (res.status === "fulfilled") {
            let value = 0;
            res.value.data.rows.forEach((r) => {
              value = value * 1 + r[3] * 1;
            });
            newValue[i].graphValue = value.toFixed(2) * 1;
          } else {
            newValue[i].graphValue = this.$i18n.t("NA");
          }
          if (i === results.length - 1) {
            this.setChartData(newValue);
          }
        });
      });
    },
    setChartData(newValue) {
      newValue.forEach((d) => {
        if (d.graphDX.length) {
          let obj = {
            y:
              !isNaN(d.graphValue) && d.graphValue !== ""
                ? d.graphValue.toFixed(2) * 1
                : null,
            name: d.shortName,
            color: d.graphColor,
          };
          // let arr = [d.minThreshold * 1, 0, d.maxThreshold * 1];
          let obj1 = {
            y: null,
            link: d.link,
            color: d.benchmarkColor || "#DF5353",
            name:
              d.benchmarkLabel || `${d.shortName} ${this.$i18n.t("benchmark")}`,
          };
          this.chartData.xAxis[0].categories.push(d.shortName);
          this.chartData.series[0].data.push(obj);
          this.chartData.series[1].data.push(obj1);
        }
      });
      this.setBenchmarkData();
    },
    matchHeight() {
      // let rightBox = this.$refs.rightBox.clientHeight;
      // let leftSummaryBox = this.$refs.leftSummaryBox.clientHeight;
      // let leftNavOptions = this.$refs.leftNavOptions.clientHeight;
      // let heightString = rightBox - (leftSummaryBox + leftNavOptions + 24 + 15);
      // this.$set(this.leftColStyles, "height", heightString + "px");
      this.loadMap = true;
    },
    resetValues(isLocationChanges) {
      this.emuValue = "";
      this.geoJson = null;
      this.mapData = null;
      this.loadMap = false;
      this.indMapData = {};
      if (isLocationChanges) {
        this.locIDLabels = [];
      }
      this.actMapData = null;
      this.leftColStyles = {};
      this.chartData.series[0].data = [];
      this.chartData.series[1].data = [];
      this.chartData.xAxis[0].categories = [];
      this.summaryScore = this.summaryScore.map((d) => ({
        ...d,
        value: "",
        graphValue: "",
      }));
      this.dqrScorecard = this.dqrScorecard.map((d) => ({
        ...d,
        score: null,
      }));
    },
    getLocationPeriod(locPeObj) {
      let oldData = JSON.parse(JSON.stringify(this.locationPeriod));
      this.locationPeriod = locPeObj;
      let isLocationChanges = oldData.location !== locPeObj.location;
      this.resetValues(isLocationChanges);
      this.getScorecard();
      this.getGeoJson();
      if (
        (this.locationPeriod.periodType === "monthly" ||
          this.locationPeriod.periodType === "yearly") &&
        this.isFPModules
      ) {
        this.getEMUData(isLocationChanges);
      } else {
        this.emuValue = this.$i18n.t("NA");
      }
    },
    async getScorecard() {
      let key = this.generateKey("dqrScorecard");
      let period = formatSingleDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      if (this.isMNCHModules && this.isMNCHDQRModules) {
        if (!this.mnchScorecard) {
          try {
            this.mnchScorecard = await service.getSavedConfig({
              tableKey: key,
              namespace: "mnch-dashboard",
            });
          } catch (e) {
            console.log("Error in fetching mnch scorecard...");
          }
        }
        if (this.mnchScorecard) {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            if (
              d.module === "mnch-dashboard" &&
              this.mnchScorecard.data[d.id] &&
              this.mnchScorecard.data[d.id].length
            ) {
              let isFound = this.mnchScorecard.data[d.id].find(
                (s) =>
                  s.id === this.locationPeriod.location && s.period === period
              );
              if (isFound) {
                let score = 0;
                isFound.score.forEach((s) => {
                  if (s.score) {
                    score++;
                  }
                });
                return {
                  ...d,
                  score: score,
                  scoreLimit: isFound.score.length,
                };
              } else {
                return {
                  ...d,
                  score: this.$i18n.t("NA"),
                };
              }
            } else {
              return d.module === "fp-dashboard"
                ? d
                : {
                    ...d,
                    score: this.$i18n.t("NA"),
                  };
            }
          });
        } else {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            return d.module === "fp-dashboard"
              ? d
              : {
                  ...d,
                  score: this.$i18n.t("NA"),
                };
          });
        }
      }
      if (this.isFPModules && this.isFPDQRModules) {
        if (!this.fpScorecard) {
          try {
            this.fpScorecard = await service.getSavedConfig({
              tableKey: key,
              namespace: "fp-dashboard",
            });
          } catch (e) {
            console.log("Error in fetching fp scorecard...");
          }
        }
        if (this.fpScorecard) {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            if (
              d.module === "fp-dashboard" &&
              this.fpScorecard.data[d.id] &&
              this.fpScorecard.data[d.id].length
            ) {
              let isFound = this.fpScorecard.data[d.id].find(
                (s) =>
                  s.id === this.locationPeriod.location && s.period === period
              );
              if (isFound) {
                let score = 0;
                isFound.score.forEach((s) => {
                  if (s.score) {
                    score++;
                  }
                });
                return {
                  ...d,
                  score: score,
                  scoreLimit: isFound.score.length,
                };
              } else {
                return {
                  ...d,
                  score: this.$i18n.t("NA"),
                };
              }
            } else {
              return d.module === "mnch-dashboard"
                ? d
                : {
                    ...d,
                    score: this.$i18n.t("NA"),
                  };
            }
          });
        } else {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            return d.module === "mnch-dashboard"
              ? d
              : {
                  ...d,
                  score: this.$i18n.t("NA"),
                };
          });
        }
      }
    },
    async getConfigData() {
      let n = "mnch-dashboard";
      if (Object.keys(this.$store.getters.getGlobalFactors(n)).length === 0) {
        let key = this.generateKey("globalFactors");
        try {
          let response = await service.getSavedConfig({
            tableKey: key,
            namespace: n,
          });
          this.$store.commit("setGlobalFactors", {
            payload: response.data,
            namespace: n,
          });
          let FinalPeriodArray = [];
          FinalPeriodArray = getAllPeriodRange(
            response.data.period.Period,
            FinalPeriodArray
          );
          let { locationID } = service.getAllowedLocation(),
            des = null;
          for (let map in response.data.globalMappings.mappings) {
            let mappingData = response.data.globalMappings.mappings[map];
            for (let innerMap in mappingData["mapping"]) {
              let innerMapData =
                response.data.globalMappings.mappings[map]["mapping"][innerMap][
                  "indicator"
                ]["subIndicator"];
              if (innerMapData[0] && innerMapData[0]["selectedDE"].length > 0) {
                des = innerMapData[0]["selectedDE"][0]["id"];
                break;
              }
            }
            if (des != null) break;
          }
          let finalPeriodData = this.$store.getters.getPeriodData ?? {};
          //Check if we already have the formatted date in store
          FinalPeriodArray = FinalPeriodArray.filter(
            (p) => !finalPeriodData[p]
          );
          //Check if required params are available
          if (FinalPeriodArray.length && locationID && des) {
            let pRes = null;
            try {
              pRes = await service.getAnalyticalIndicatorData(
                des,
                locationID,
                FinalPeriodArray.join(";"),
                false,
                true
              );
            } catch (err) {
              console.log("Error in fetching periods from DHIS2...", err);
            }
            FinalPeriodArray.forEach((pe) => {
              finalPeriodData[pe] = pRes?.data?.metaData?.items?.[pe] || pe;
            });
            this.$store.commit("setPeriodData", finalPeriodData); // Set the periods in store
          }
        } catch (err) {
          this.reFetchConfig(err);
        }
      }
      n = "fp-dashboard";
      if (Object.keys(this.$store.getters.getGlobalFactors(n)).length === 0) {
        let key = this.generateKey("globalFactors");
        try {
          let response = await service.getSavedConfig({
            tableKey: key,
            namespace: n,
          });
          this.$store.commit("setGlobalFactors", {
            payload: response.data,
            namespace: n,
          });
          let FinalPeriodArray = [];
          FinalPeriodArray = getAllPeriodRange(
            response.data.period.Period,
            FinalPeriodArray
          );
          let { locationID } = service.getAllowedLocation(),
            des = null;
          for (let map in response.data.globalMappings.mappings) {
            let mappingData = response.data.globalMappings.mappings[map];
            for (let innerMap in mappingData["mapping"]) {
              let innerMapData =
                response.data.globalMappings.mappings[map]["mapping"][innerMap][
                  "indicator"
                ]["subIndicator"];
              if (innerMapData[0] && innerMapData[0]["selectedDE"].length > 0) {
                des = innerMapData[0]["selectedDE"][0]["id"];
                break;
              }
            }
            if (des != null) break;
          }
          let finalPeriodData = this.$store.getters.getPeriodData ?? {};
          //Check if we already have the formatted date in store
          FinalPeriodArray = FinalPeriodArray.filter(
            (p) => !finalPeriodData[p]
          );
          //Check if required params are available
          if (FinalPeriodArray.length && locationID && des) {
            let pRes = null;
            try {
              pRes = await service.getAnalyticalIndicatorData(
                des,
                locationID,
                FinalPeriodArray.join(";"),
                false,
                true
              );
            } catch (err) {
              console.log("Error in fetching periods from DHIS2...", err);
            }
            FinalPeriodArray.forEach((pe) => {
              finalPeriodData[pe] = pRes?.data?.metaData?.items?.[pe] || pe;
            });
            this.$store.commit("setPeriodData", finalPeriodData); // Set the periods in store
          }
        } catch (err) {
          this.reFetchConfig(err);
        }
      }
      if (this.isFPModules && this.isFPDQRModules) {
        let key = this.generateKey("dqrDashboard");
        await service
          .getSavedConfig({
            tableKey: key,
            namespace: "fp-dashboard",
          })
          .then((res) => {
            res.data.forEach((s) => {
              let isMapping = false;
              for (let i = 0; i < s.subTabs.length - 1; i++) {
                let isM = s.subTabs[i].chartSetting.find(
                  (c) =>
                    c.chartOptions.isSavedData ||
                    (c.chartOptions.dataMapping &&
                      c.chartOptions.dataMapping.length)
                );
                if (isM) {
                  isMapping = true;
                  break;
                }
              }
              if (isMapping) {
                this.dqrScorecard.push({
                  id: s.group,
                  name: s.tabName,
                  score: null,
                  scoreLimit: null,
                  createAt: null,
                  module: "fp-dashboard",
                  route: "dashboard",
                  redirectRoute: "DQRDashboard",
                  link: `${s.group}-${s.id}-dqr-summary`,
                });
              }
            });
          })
          .catch((err) => {
            this.reFetchConfig(err);
          });
      }
      if (this.isMNCHModules && this.isMNCHDQRModules) {
        let key = this.generateKey("dqrDashboard");
        await service
          .getSavedConfig({
            tableKey: key,
            namespace: "mnch-dashboard",
          })
          .then((res) => {
            res.data.forEach((s) => {
              let isMapping = false;
              for (let i = 0; i < s.subTabs.length - 1; i++) {
                let isM = s.subTabs[i].chartSetting.find(
                  (c) =>
                    c.chartOptions.isSavedData ||
                    (c.chartOptions.dataMapping &&
                      c.chartOptions.dataMapping.length)
                );
                if (isM) {
                  isMapping = true;
                  break;
                }
              }
              if (isMapping) {
                this.dqrScorecard.push({
                  id: s.group,
                  name: s.tabName,
                  score: null,
                  scoreLimit: null,
                  createAt: null,
                  module: "mnch-dashboard",
                  route: "dashboard",
                  redirectRoute: "DQRDashboard",
                  link: `${s.group}-${s.id}-dqr-summary`,
                });
              }
            });
          })
          .catch((err) => {
            this.reFetchConfig(err);
          });
      }

      if (this.isMNCHModules && this.isMNCHSummaryModules) {
        let allMappings = [];
        let gSetting = this.$store.getters.getGlobalFactors("mnch-dashboard");
        if (
          gSetting.globalMappings &&
          gSetting.globalMappings.mappings &&
          gSetting.globalMappings.mappings.length
        ) {
          allMappings = [].concat(
            ...gSetting.globalMappings.mappings.map(
              ({ mapping }) => mapping || []
            )
          );
        }
        let key1 = this.generateKey("summaryDashboard");
        await service
          .getSavedConfig({
            tableKey: key1,
            namespace: "mnch-dashboard",
          })
          .then((res) => {
            let summaryScore = [];
            res.data.forEach((d) => {
              d.subTabs.forEach((s) => {
                if (s.integrated.linked) {
                  let obj = {
                    dx: [],
                    value: "",
                    graphValue: "",
                    shortName: d.tabName[this.$i18n.locale],
                    color: s.integrated.color,
                    graphColor: s.integrated?.graphColor,
                    graphDisplayName:
                      s.integrated?.graphDisplayName?.[this.$i18n.locale],
                    graphDX: [],
                    graphPercentIndicator: s.integrated?.graphPercentIndicator,
                    link: `${d.group}-${d.id}-${s.id}`,
                    displayName: s.integrated.displayName[this.$i18n.locale],
                    minThreshold: s.integrated.minThreshold,
                    maxThreshold: s.integrated.maxThreshold,
                    benchmarkLabel:
                      s.integrated.benchmarkLabel[this.$i18n.locale],
                    benchmarkColor: s.integrated.benchmarkColor,
                    percentIndicator: s.integrated.percentIndicator,
                    isHide: false,
                  };
                  if (s.integrated.dataMapping) {
                    let rMapping = allMappings.filter((m) =>
                      s.integrated.dataMapping.includes(m.indicator.static_name)
                    );
                    rMapping.forEach((m) =>
                      m.indicator.subIndicator.forEach((subEle) => {
                        subEle.selectedDE.forEach((s) => {
                          obj.dx.push(s.id);
                        });
                      })
                    );
                  } else {
                    obj.isHide = true;
                  }
                  if (s.integrated.graphDataMapping) {
                    let graphMapping = allMappings.filter((m) =>
                      s.integrated.graphDataMapping.includes(
                        m.indicator.static_name
                      )
                    );
                    graphMapping.forEach((m) =>
                      m.indicator.subIndicator.forEach((subEle) => {
                        subEle.selectedDE.forEach((s) => {
                          obj.graphDX.push(s.id);
                        });
                      })
                    );
                  }

                  summaryScore.push(obj);
                }
              });
            });
            this.summaryScore = summaryScore;
            })
          .catch((err) => {
            this.reFetchConfig(err);
          });
      }
    },
    getBenchmarkValue(de, isFP) {
      let loc = this.locationPeriod.location.split("/");
      let y = null;
      let data = isFP === null ? this.benchmarkData : this.benchmarkDataFP;
      if (data[loc[0]]) {
        let isFound = data[loc[0]].filter((b) => b[0] === `benchmark-${de}`);
        let sorted = isFound.sort(function (a, b) {
          return parseInt(b[1]) - parseInt(a[1]);
        });
        y = sorted.length && sorted[0].length ? sorted[0][3] * 1 : null;
      }
      return y;
    },
    async setBenchmarkData(isFP = null) {
      if (this.isMNCHSummaryModules && isFP === null) {
        let loc = this.locationPeriod.location.split("/");
        if (!this.benchmarkData[loc[0]]) {
          let key = `benchmark_${loc[0]}`;
          try {
            let bData = await service.getSavedConfig({
              tableKey: key,
              namespace: "mnch-dashboard",
            });
            let data =
              typeof bData.data.rows == "string"
                ? decompress(JSON.parse(bData.data.rows))
                : bData.data.rows;
            this.$set(this.benchmarkData, loc[0], data);
          } catch (e) {
            console.log("Error in fetching benchmark data...");
          }
        }

        this.chartData.series[1].data = this.chartData.series[1].data.map(
          (d) => ({
            ...d,
            y:
              d.link && d.y === null
                ? this.getBenchmarkValue(d.link, isFP)
                : d.y,
          })
        );
        }
      if (this.isFPSummaryModules && isFP) {
        let loc = this.locationPeriod.location.split("/");
        if (!this.benchmarkDataFP[loc[0]]) {
          let key = `benchmark_${loc[0]}`;
          try {
            let bData = await service.getSavedConfig({
              tableKey: key,
              namespace: "fp-dashboard",
            });
            let data =
              typeof bData.data.rows == "string"
                ? decompress(JSON.parse(bData.data.rows))
                : bData.data.rows;
            this.$set(this.benchmarkDataFP, loc[0], data);
          } catch (e) {
            console.log("Error in fetching benchmark data...");
          }
        }

        this.chartData.series[1].data = this.chartData.series[1].data.map(
          (d) => ({
            ...d,
            y:
              d.link && d.y === null
                ? this.getBenchmarkValue(d.link, isFP)
                : d.y,
          })
        );
      }
    },
    async getEMUData(isLocationChanges) {
      let locationID = this.locationPeriod.location.split("/")[1];
      if (isLocationChanges) {
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
            this.locIDLabels.push({
              id: l.id,
              label: l.displayName,
            });
          });
        }
      }
      console.log(
        isLocationChanges,
        this.preFetchData[
          `${this.locationPeriod.periodType}_${this.$i18n.locale}`
        ]
      );
      if (
        this.preFetchData &&
        this.preFetchData[
          `${this.locationPeriod.periodType}_${this.$i18n.locale}`
        ]
      ) {
        this.$set(
          this.emuData,
          `${this.locationPeriod.periodType}_${this.$i18n.locale}`,
          this.preFetchData[
            `${this.locationPeriod.periodType}_${this.$i18n.locale}`
          ]
        );
      }
      if (
        !this.emuData[`${this.locationPeriod.periodType}_${this.$i18n.locale}`]
      ) {
        let configKey = null;
        if (this.locationPeriod.periodType === "monthly") {
          configKey = `monthlyEMU_${this.$i18n.locale}`;
        }
        if (this.locationPeriod.periodType === "yearly") {
          configKey = `annualEMU_${this.$i18n.locale}`;
        }
        let key = this.generateKey(configKey);
        try {
          let res = await service.getSavedConfig({
            tableKey: key,
            namespace: "fp-dashboard",
          });
          this.emuData[
            `${this.locationPeriod.periodType}_${this.$i18n.locale}`
          ] = res.data;
        } catch (e) {
          console.log("Error in fetching EMU data...");
        }
      }

      if (
        this.emuData[`${this.locationPeriod.periodType}_${this.$i18n.locale}`]
      ) {
        let emuData = null,
          emuDataKey =
            this.locationPeriod.periodType === "monthly"
              ? "totalEMU"
              : "compEMU";
        let emuSourceKey = null;

        let eData =
          typeof this.emuData[
            `${this.locationPeriod.periodType}_${this.$i18n.locale}`
          ][emuDataKey] === "string"
            ? JSON.parse(
                this.emuData[
                  `${this.locationPeriod.periodType}_${this.$i18n.locale}`
                ][emuDataKey]
              )
            : this.emuData[
                `${this.locationPeriod.periodType}_${this.$i18n.locale}`
              ][emuDataKey];
        emuData = eData[locationID];

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

        this.getEmuMapData(this.locIDLabels, eData);

        if (emuData) {
          let emuObj = null,
            sourceKey = null,
            innerDataKey =
              this.locationPeriod.periodType === "monthly"
                ? "saveData"
                : "data";
          if (this.locationPeriod.periodType === "monthly") {
            sourceKey = this.$i18n.t("EMU");
          }
          if (this.locationPeriod.periodType === "yearly") {
            sourceKey = emuData.source
              ? emuData.source
              : this.$i18n.locale === "fr"
              ? "EUM : Produits aux clients"
              : "EMU :Commodities to clients";
          }
          emuObj = emuData[innerDataKey].find((e) => e.name === sourceKey);
          if (emuObj) {
            let toolbarDate =
              this.locationPeriod.periodType === "monthly"
                ? translateDate({ rawDate: this.locationPeriod.period })
                : this.locationPeriod.period;
            let isFound =
              this.locationPeriod.periodType === "monthly"
                ? emuData.saveCategories.findIndex((c) => c === toolbarDate)
                : emuData.categories.findIndex((c) => c === toolbarDate);
            if (isFound >= 0) {
              this.emuValue = (emuObj.data[isFound] * 1).toFixed(2) * 1;
            } else {
              this.emuValue = this.$i18n.t("NA");
            }
          } else {
            this.emuValue = this.$i18n.t("NA");
          }
        } else {
          this.emuValue = this.$i18n.t("NA");
        }
      } else {
        this.emuValue = this.$i18n.t("NA");
      }
    },
    getGeoJson() {
      let defaultLocationID = this.locationPeriod.location.split("/")[1],
        currentLevel = this.locationPeriod.location.split("/")[0] * 1;
      service
        .getGeoJson(defaultLocationID, currentLevel + 1)
        .then((response) => {
          this.geoJson = response.data;
        });
    },
    getEmuMapData(locIDLabels, eMethodData) {
      let emuMapData = [];
      locIDLabels.forEach((loc) => {
        let val = this.$i18n.t("NA");
        if (eMethodData && eMethodData[loc.id]) {
          let emuData = eMethodData[loc.id];
          let emuObj = null,
            sourceKey = null,
            innerDataKey =
              this.locationPeriod.periodType === "monthly"
                ? "saveData"
                : "data";
          if (this.locationPeriod.periodType === "monthly") {
            sourceKey = this.$i18n.t("EMU");
          }
          if (this.locationPeriod.periodType === "yearly") {
            sourceKey = emuData.source
              ? emuData.source
              : this.$i18n.locale === "fr"
              ? "EUM : Produits aux clients"
              : "EMU :Commodities to clients";
          }
          emuObj = emuData[innerDataKey].find((e) => e.name === sourceKey);
          if (emuObj) {
            let toolbarDate =
              this.locationPeriod.periodType === "monthly"
                ? translateDate({ rawDate: this.locationPeriod.period })
                : this.locationPeriod.period;
            let isFound =
              this.locationPeriod.periodType === "monthly"
                ? emuData.saveCategories.findIndex((c) => c === toolbarDate)
                : emuData.categories.findIndex((c) => c === toolbarDate);
            if (isFound >= 0) {
              val = emuObj.data[isFound].toFixed(2) * 1;
            } else {
              val = this.$i18n.t("NA");
            }
          } else {
            val = this.$i18n.t("NA");
          }
          let obj = {
            data: val,
            location: loc.id,
            locationLabel: loc.label,
          };
          // obj["data"] = eMethodData[loc];
          emuMapData.push(obj);
        }
      });
      this.mapData = JSON.parse(JSON.stringify(emuMapData));
      this.actMapData = JSON.parse(JSON.stringify(emuMapData));
      this.updateDom++;
    },
    async downloadReport() {
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<input id="fileName" class="form-control" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="' +
          this.fileName +
          '"/>',
        focusConfirm: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
        preConfirm: () => {
          return [document.getElementById("fileName").value];
        },
      });

      if (formValues) {
        this.$store.commit("setLoading", true);
        this.exportingPdf = true;
        setTimeout(async()=>{
          let canvas1 = await html2canvas(
            document.querySelector("#mapsID")
          );
          let canvas2 = await html2canvas(
            document.querySelector("#myDivToPrintRight")
          );
          let doc = new jsPDF("p", "in", "a4");
          let dURLLeft = this.verticalCanvases(canvas1);
          let widthLeft = doc.internal.pageSize.getWidth();
          let heightLeft = doc.internal.pageSize.getHeight();
          doc.addImage(dURLLeft, "PNG", 0, 0, widthLeft, heightLeft);
          doc.addPage();
          let dURLRight = this.verticalCanvases(canvas2);
          let widthRight = doc.internal.pageSize.getWidth();
          let heightRight = doc.internal.pageSize.getHeight();
          doc.addImage(dURLRight, "PNG", 0, 0, widthRight, heightRight);
          doc.save(
            formValues[0] + "_" + this.$moment(new Date()).format("lll") + ".pdf"
          );
          this.exportingPdf = false;        
          this.$store.commit("setLoading", false);
        }, 5000)
      }
    },
    verticalCanvases(cnv) {
      let newCanvas = document.createElement("canvas"),
        ctx = newCanvas.getContext("2d"),
        width = cnv.width,
        height = cnv.height;
      newCanvas.width = width + 30;
      newCanvas.height = height + 30;
      ctx.beginPath();
      ctx.drawImage(cnv, 15, 15, width, height);
      let imgdata = newCanvas.toDataURL();
      return imgdata;
    },
  },
  async created() {
    this.chartData.xAxis[0].categories = [];
    this.chartData.series[0].data = [];
    this.chartData.series[1].data = [];
    await this.getConfigData();
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
        },
};
</script>

<style scoped></style>
