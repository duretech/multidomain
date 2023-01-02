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
              This section is designed to highlight priority indicators that
              show how the FP and MH program is performing. Understanding what
              indicators are changing can help point to areas of strong
              performance as well as areas that need greater attention.
            </p>
            <button
              type="button"
              class="btn btn-primary black-btn ml-3 float-right"
              @click.prevent.stop="downloadReport()"
            >
              {{ $t("generatePDF") }}
            </button>
          </b-col>
          <b-col sm="12">
            <div id="myDivToPrint">
              <b-row>
                <b-col class="transparentDiv" id="myDivToPrintLeft">
                  <div class="integratedSummaryCountWrap" ref="leftSummaryBox">
                    <b-row class="pl-3 pr-3">
                      <b-col sm="3" class="pr-1 pl-0" v-if="isFPModules">
                         <div class="fs-17-1920 programName" :class="{ programNameDownload : exportingPdf }">Family Planning</div>
                        <div
                          class="integratedBoxWrap purpleBox"
                          :style="{ 'background-color': emuValueColor }"
                        >
                         
                          <div class="textDivWrap">
                            <p class="fs-17-1920 courseName">EMU</p>
                            <div class="fs-17-1920 courseCount" v-if="emuValue">
                              {{
                                emuValue === "N/A" ? emuValue : `${emuValue}%`
                              }}
                            </div>
                            <b-spinner
                              type="grow"
                              label="Spinning"
                              v-else
                            ></b-spinner>
                            <p class="fs-17-1920 courseText">
                              Estimated Modern Use
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
                                        routeName: 'fp-dashboard',
                                        redirectDetails: {
                                          routeName: 'summary-dashboard',
                                        },
                                      })
                                    "
                                  >
                                    View More
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </b-col>
                      <template v-if="isMNCHModules && isMNCHSummaryModules">
                        <b-col
                          sm="3"
                          class="px-0"
                          v-for="(summary, i) in summaryScore"
                          :key="'summary' + i"
                        >
                        <div class="fs-17-1920 programName" :class="{ programNameDownload : exportingPdf, hidden: i !== 0 }">
                          Maternal Health
                        </div>
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
                                v-if="summary.value"
                              >
                                {{
                                  summary.value === "N/A"
                                    ? summary.value
                                    : `${summary.value}%`
                                }}
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
                                          routeName: 'mnch-dashboard',
                                          redirectDetails: {
                                            routeName: 'SummaryDashboard',
                                            activeTab: summary.link,
                                          },
                                        })
                                      "
                                    >
                                      View More
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-col>
                      </template>
                    </b-row>
                  </div>
                  <b-row class="my-2" ref="leftNavOptions">
                    <b-col sm="12">
                      <button
                        class="btn fs-17-1920 purple-btn mr-3"
                        @click="
                          goTo({
                            module: 'fp-dashboard',
                            setNamespace: true,
                            routeName: 'fp-dashboard',
                          })
                        "
                        v-show="isFPModules"
                      >
                        FP dashboard
                      </button>
                      <button
                        class="btn fs-17-1920 purple-btn"
                        @click="
                          goTo({
                            module: 'mnch-dashboard',
                            setNamespace: true,
                            routeName: 'mnch-dashboard',
                          })
                        "
                        v-show="isMNCHModules"
                      >
                        MH dashboard
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
                            >
                              <Maps
                                v-if="geoJson && actMapData"
                                @resetMap="resetMap"
                                :geoJson="geoJson"
                                :mapData="actMapData"
                                showIcons="true"
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
                                      @click="setMapData(mapData, 'EMU')"
                                    >
                                      <Maps
                                        v-if="geoJson && mapData"
                                        :geoJson="geoJson"
                                        :mapData="mapData"
                                        showIcons="false"
                                        :exportingPdf="exportingPdf"
                                      />
                                    </div>
                                    <p
                                      class="igmapslidertext fs-17-1920 text-center"
                                    >
                                      EMU
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
                                        showIcons="false"
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
                              Not authorized to view this section
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
                          Coverage estimates for the interventions across
                          multiprogram
                        </h6>
                        <b-card class="mapContainer">
                          <b-card-text class="text-center">
                            <template
                              v-if="
                                (!isNaN(emuValue) && emuValue !== '') ||
                                isMNCHSummaryModules
                              "
                            >
                              <FpIntegrated
                                :emuValue="emuValue"
                                :chartData="chartData"
                                :summaryScore="summaryScore"
                                :emuValueColor="emuValueColor"
                                v-if="
                                  chartData.series[0].data.length &&
                                  chartData.series[1].data.length
                                "
                                :exportingPdf="exportingPdf"
                              />
                              <b-spinner
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                            </template>
                            <b-row v-else style="height: 350px">
                              <b-col
                                sm="12"
                                class="text-center no-data-error-msg"
                              >
                                Not authorized to view this section
                              </b-col>
                            </b-row>
                          </b-card-text>
                        </b-card>
                        <b-card
                          class="mapContainer scorboardcardHeader mt-4 pt-2"
                          :class="{ 'text-center': dqrScorecard.length === 0 }"
                        >
                          <template #header>
                            <h6 class="mb-0 fs-17-1920 scorboardLabel">
                              DQR Scoreboard
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
                                  <b-col
                                    sm="2"
                                    class="d-flex align-items-center"
                                  >
                                    <div>
                                      <img
                                        src="@/assets/images/Group 111.svg"
                                      />
                                    </div>
                                  </b-col>
                                  <b-col sm="2">
                                    <p class="program-name fs-17-1920">
                                      {{ scoreCard.name }}
                                    </p>
                                  </b-col>
                                  <b-col sm="4">
                                    <p
                                      class="locationName fs-17-1920"
                                      v-if="selectedLocation"
                                    >
                                      {{ selectedLocation }}
                                    </p>
                                  </b-col>
                                  <b-col sm="4" class="position-relative">
                                    <Gauge
                                      v-if="scoreCard.score"
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
                              Not authorized to view this section
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
      :globalPeriodData="globalPeriodData"
      @getLocationPeriod="getLocationPeriod"
    />
  </div>
</template>
<script>
import service from "@/service";
import { decompress } from "compress-json";
import { Carousel, Slide } from "vue-carousel";
import Gauge from "@/components/Highcharts/Gauge.vue";
import NavigationMixin from "@/helpers/NavigationMixin";
import Maps from "@/components/Maps/IntegratedFPMap.vue";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import FpIntegrated from "@/components/Highcharts/FpIntegrated.vue";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import FpIntegratedConfig from "@/components/Highcharts/FpIntegratedConfig.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  getDateRange,
  getLocationName,
  formatSingleDate,
} from "@/components/Common/commonFunctions";


export default {
  props: ["dataElements"],
  components: {
    Maps,
    FpIntegrated,
    Gauge,
    Carousel,
    Slide,
  },
  mixins: [
    NavigationMixin,
    DocumentTitleMixin,
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
      selectedLocation: null,
      emuValueColor: "#B83C6D",
      chartData: JSON.parse(JSON.stringify(FpIntegratedConfig)),
      mapData: null,
      geoJson: null,
      indMapData: {},
      actMapData: null,
      updateDom: 0,
      activeMapTitle: "",
      benchmarkData: {},
      summaryFPData: null,
      fileName: "Scoreboard",
      exportingPdf: false,
    };
  },
  computed: {
    isFPModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.$store.getters.getUserPermissions?.dashboards?.includes(`fp`) ||
            false;
    },
    isFPSummaryModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.isFPModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `summary_dashboard-fp`
          ) || false
        : false;
    },
    isFPDQRModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.isFPModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(`DQR-fp`) ||
          false
        : false;
    },
    isMNCHModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.$store.getters.getUserPermissions?.dashboards?.includes(
            `mnch`
          ) || false;
    },
    isMNCHSummaryModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.isMNCHModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `summary_dashboard-mnch`
          ) || false
        : false;
    },
    isMNCHDQRModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.isMNCHModules
        ? this.$store.getters.getUserPermissions?.modules?.includes(
            `DQR-mnch`
          ) || false
        : false;
    },
  },
  watch: {
    emuValue(newValue) {
      if (!isNaN(newValue) && newValue !== "") {
        let obj = {
          y: !isNaN(newValue) && newValue !== "" ? newValue : null,
          name: "EMU",
          color: this.emuValueColor,
        };
        // let arr = [20, 0, 35];
        let obj1 = { y: null, name: "EMU Benchmark", color: "#DF5353" };
        this.chartData.xAxis[0].categories.unshift("EMU");
        this.chartData.series[0].data.unshift(obj);
        this.chartData.series[1].data.unshift(obj1);
        this.setBenchmarkData("fp");
      }
    },
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
      this.getSingleValue(newValue);
      this.getIndMapData(newValue);
    },
    mapData() {
      this.activeMapTitle = "EMU";
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
      await service.getChildOrganisation(location).then((response) => {
        service.renameKeys({ ...response.data })?.children?.forEach((l) => {
          locID.push(l.id.split("/")[1]);
          locIDLabels.push({
            id: l.id.split("/")[1],
            label: l.label,
          });
        });
      });
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
            let value = 0;
            locID.forEach((lc) => {
              let locInd = {
                data: "",
                location: lc,
                locationLabel: locIDLabels.filter((obj) => obj["id"] === lc),
              };
              let findD = res.value.data.rows.filter((obj) => obj[2] === lc);
              if (findD.length > 0) {
                findD.forEach((r) => {
                  value = value * 1 + r[3] * 1;
                });
              }
              locInd["data"] = value;
              finalObj[key].push(locInd);
            });
          }
        });

        this.indMapData = JSON.parse(JSON.stringify(finalObj));
      });
    },
    getSingleValue(newValue) {
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
      newValue.forEach((d) => {
        let de = d.dx.join(";");
        promises.push(
          service.getIndicatorData(de, [levelID], location, period)
        );
      });

      Promise.allSettled(promises).then((results) => {
        results.forEach((res, i) => {
          if (res.status === "fulfilled") {
            let value = 0;
            res.value.data.rows.forEach((r) => {
              value = value * 1 + r[3] * 1;
            });
            newValue[i].value = value;
          } else {
            newValue[i].value = "N/A";
          }
          if (i === results.length - 1) {
            this.setChartData(newValue);
          }
        });
      });
    },
    setChartData(newValue) {
      newValue.forEach((d) => {
        let obj = {
          y: !isNaN(d.value) && d.value !== "" ? d.value : null,
          name: d.shortName,
          color: d.color,
        };
        // let arr = [d.minThreshold * 1, 0, d.maxThreshold * 1];
        let obj1 = {
          y: null,
          link: d.link,
          color: d.benchmarkColor || "#DF5353",
          name: d.benchmarkLabel || `${d.shortName} Benchmark`,
        };
        this.chartData.xAxis[0].categories.push(d.shortName);
        this.chartData.series[0].data.push(obj);
        this.chartData.series[1].data.push(obj1);
      });
      this.setBenchmarkData();
    },
    matchHeight() {
      let rightBox = this.$refs.rightBox.clientHeight;
      let leftSummaryBox = this.$refs.leftSummaryBox.clientHeight;
      let leftNavOptions = this.$refs.leftNavOptions.clientHeight;
      let heightString = rightBox - (leftSummaryBox + leftNavOptions + 24 + 15);
      this.$set(this.leftColStyles, "height", heightString + "px");
      this.loadMap = true;
    },
    resetValues() {
      this.emuValue = "";
      this.geoJson = null;
      this.mapData = null;
      this.loadMap = false;
      this.indMapData = {};
      this.locIDLabels = [];
      this.actMapData = null;
      this.leftColStyles = {};
      this.chartData.series[0].data = [];
      this.chartData.series[1].data = [];
      this.chartData.xAxis[0].categories = [];
      this.summaryScore = this.summaryScore.map((d) => ({ ...d, value: "" }));
      this.dqrScorecard = this.dqrScorecard.map((d) => ({ ...d, score: null }));
    },
    getLocationPeriod(locPeObj) {
      let oldData = JSON.parse(JSON.stringify(this.locationPeriod));
      const { locName } = getLocationName(locPeObj);
      this.selectedLocation = locName;
      this.locationPeriod = locPeObj;
      let isLocationChanges = oldData.location !== locPeObj.location;
      this.resetValues();
      this.getScorecard();
      this.getGeoJson();
      if (
        (this.locationPeriod.periodType === "monthly" ||
          this.locationPeriod.periodType === "yearly") &&
        this.isFPModules
      ) {
        this.getEMUData(isLocationChanges);
      } else {
        this.emuValue = "N/A";
      }
    },
    async getScorecard() {
      let key = this.generateKey("dqrScorecard");
      let period = formatSingleDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      let scoreKey = `${this.locationPeriod.location.split("/")[1]}_${period}`;
      if (this.isMNCHModules && this.isMNCHDQRModules) {
        if (!this.mnchScorecard) {
          try {
            this.mnchScorecard = await service.getSavedConfig(
              key,
              false,
              "mnch-dashboard"
            );
          } catch (e) {
            console.log("Error in fetching mnch scorecard...");
          }
        }
        if (this.mnchScorecard) {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            if (this.mnchScorecard.data[d.id]) {
              if (
                this.mnchScorecard.data[d.id][scoreKey] &&
                this.mnchScorecard.data[d.id][scoreKey].scores[
                  this.locationPeriod.locationName
                ]
              ) {
                let score = 0;
                this.mnchScorecard.data[d.id][scoreKey].scores[
                  this.locationPeriod.locationName
                ].score.forEach((s) => {
                  if (s.score) {
                    score++;
                  }
                });
                return {
                  ...d,
                  score: score,
                  scoreLimit:
                    this.mnchScorecard.data[d.id][scoreKey].scores[
                      this.locationPeriod.locationName
                    ].score.length,
                };
              } else {
                return {
                  ...d,
                  score: "N/A",
                };
              }
            } else {
              return {
                ...d,
                score: "N/A",
              };
            }
          });
        } else {
          this.dqrScorecard = this.dqrScorecard.map((d) => {
            return d.id === "FPDashboard"
              ? d
              : {
                  ...d,
                  score: "N/A",
                };
          });
        }
      }
      if (this.isFPModules && this.isFPDQRModules) {
        if (!this.fpScorecard) {
          try {
            this.fpScorecard = await service.getSavedConfig(
              key,
              false,
              "fp-dashboard"
            );
          } catch (e) {
            console.log("Error in fetching fp scorecard...");
          }
        }
        let isFound = this.dqrScorecard.findIndex(
          (d) => d.id === "FPDashboard"
        );
        if (this.fpScorecard) {
          if (isFound >= 0) {
            if (
              this.fpScorecard.data[scoreKey] &&
              this.fpScorecard.data[scoreKey].scores[
                this.locationPeriod.locationName
              ]
            ) {
              let score = 0;
              this.fpScorecard.data[scoreKey].scores[
                this.locationPeriod.locationName
              ].score.forEach((s) => {
                if (s.value) {
                  score++;
                }
              });
              this.dqrScorecard[isFound] = {
                ...this.dqrScorecard[isFound],
                score: score,
                scoreLimit:
                  this.fpScorecard.data[scoreKey].scores[
                    this.locationPeriod.locationName
                  ].score.length,
              };
            } else {
              this.dqrScorecard[isFound] = {
                ...this.dqrScorecard[isFound],
                score: "N/A",
              };
            }
          }
        } else {
          this.dqrScorecard[isFound] = {
            ...this.dqrScorecard[isFound],
            score: "N/A",
          };
        }
      }
    },
    getConfigData() {
      if (this.isMNCHDQRModules) {
        let key = this.generateKey("dqrDashboard");
        service.getSavedConfig(key, false, "mnch-dashboard").then((res) => {
          res.data.forEach((s) => {
            this.dqrScorecard.push({
              id: s.group,
              name: s.tabName,
              score: null,
              scoreLimit: null,
              createAt: null,
              module: "mnch-dashboard",
              route: "mnch-dashboard",
              redirectRoute: "DQRDashboard",
              link: `${s.group}-${s.id}-dqr-summary`,
            });
          });
        });
      }
      if (this.isMNCHSummaryModules) {
        let key1 = this.generateKey("summaryDashboard");
        service.getSavedConfig(key1, false, "mnch-dashboard").then((res) => {
          let summaryScore = [];
          res.data.forEach((d) => {
            d.subTabs.forEach((s) => {
              if (s.integrated.linked) {
                let obj = {
                  dx: [],
                  value: "",
                  shortName: d.tabName,
                  color: s.integrated.color,
                  link: `${d.group}-${d.id}-${s.id}`,
                  displayName: s.integrated.displayName,
                  minThreshold: s.integrated.minThreshold,
                  maxThreshold: s.integrated.maxThreshold,
                  benchmarkLabel: s.integrated.benchmarkLabel,
                  benchmarkColor: s.integrated.benchmarkColor,
                };
                s.mapping.forEach((element) => {
                  element.indicator.subIndicator.forEach((subEle) => {
                    subEle.selectedDE.forEach((s) => {
                      obj.dx.push(s.id);
                    });
                  });
                });
                summaryScore.push(obj);
              }
            });
          });
          this.summaryScore = summaryScore;
        });
      }
    },
    getBenchmarkValue(de) {
      let loc = this.locationPeriod.location.split("/");
      let y = null;
      if (this.benchmarkData[loc[0]]) {
        let isFound = this.benchmarkData[loc[0]].filter(
          (b) => b[0] === `benchmark-${de}`
        );
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
            let bData = await service.getSavedConfig(
              key,
              false,
              "mnch-dashboard"
            );
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
            y: d.link && d.y === null ? this.getBenchmarkValue(d.link) : d.y,
          })
        );
      }
      if (this.isFPSummaryModules && isFP) {
        if (!this.summaryFPData) {
          let key = this.generateKey("ministrialModule");
          try {
            let sData = await service.getSavedConfig(
              key,
              false,
              "fp-dashboard"
            );
            this.summaryFPData = sData.data;
          } catch (e) {
            console.log("Error in fetching FP summary dashboard config...");
          }
        }
        let eData =
          this.summaryFPData && this.summaryFPData.summary
            ? this.summaryFPData.summary.find((s) => s.name === "EMU")
            : null;
        if (eData) {
          let data = {
            ...this.chartData.series[1].data[0],
            y: eData.selected.benchmark ? eData.selected.benchmark * 1 : null,
          };
          this.$set(this.chartData.series[1].data, 0, data);
        }
      }
    },
    async getEMUData(isLocationChanges) {
      let locationID = this.locationPeriod.location.split("/")[1];
      if (isLocationChanges) {
        await service.getChildOrganisation(locationID).then((response) => {
          service.renameKeys({ ...response.data })?.children?.forEach((l) => {
            this.locIDLabels.push({
              id: l.id.split("/")[1],
              label: l.label,
            });
          });
        });
      }
      if (!this.emuData[this.locationPeriod.periodType]) {
        let configKey = null;
        if (this.locationPeriod.periodType === "monthly") {
          configKey = "monthlyEMU";
        }
        if (this.locationPeriod.periodType === "yearly") {
          configKey = "annualEMU";
        }
        let key = this.generateKey(configKey);
        try {
          this.emuData[this.locationPeriod.periodType] =
            await service.getSavedConfig(key, false, "fp-dashboard");
        } catch (e) {
          console.log("Error in fetching EMU data...");
        }
      }

      if (this.emuData[this.locationPeriod.periodType]) {
        let emuData = null,
          emuDataKey =
            this.locationPeriod.periodType === "monthly"
              ? "totalEMU"
              : "compEMU";
        let emuSourceKey = null;

        let eData =
          typeof this.emuData[this.locationPeriod.periodType].data[
            emuDataKey
          ] === "string"
            ? JSON.parse(
                this.emuData[this.locationPeriod.periodType].data[emuDataKey]
              )
            : this.emuData[this.locationPeriod.periodType].data[emuDataKey];
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
                ? this.$moment(this.locationPeriod.period, "YYYY-MM").format(
                    "MMM YYYY"
                  )
                : this.locationPeriod.period;
            let isFound =
              this.locationPeriod.periodType === "monthly"
                ? emuData.saveCategories.findIndex((c) => c === toolbarDate)
                : emuData.categories.findIndex((c) => c === toolbarDate);
            if (isFound >= 0) {
              this.emuValue = emuObj.data[isFound];
            } else {
              this.emuValue = "N/A";
            }
          } else {
            this.emuValue = "N/A";
          }
        } else {
          this.emuValue = "N/A";
        }
      } else {
        this.emuValue = "N/A";
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
        let val = "NA";
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
                ? this.$moment(this.locationPeriod.period, "YYYY-MM").format(
                    "MMM YYYY"
                  )
                : this.locationPeriod.period;
            let isFound =
              this.locationPeriod.periodType === "monthly"
                ? emuData.saveCategories.findIndex((c) => c === toolbarDate)
                : emuData.categories.findIndex((c) => c === toolbarDate);
            if (isFound >= 0) {
              val = emuObj.data[isFound];
            } else {
              val = "N/A";
            }
          } else {
            val = "N/A";
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
      this.exportingPdf = true;
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
        confirmButtonText: this.$i18n.t("exportbtn"),
        preConfirm: () => {
          return [document.getElementById("fileName").value];
        },
      });
      
      if (formValues) {
        this.$store.state.loading = true;
        let canvas1 = await html2canvas(
          document.querySelector("#myDivToPrintLeft")
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
      }
      this.$store.state.loading = false;
      this.exportingPdf = false;
    },
    verticalCanvases(cnv) {
      let newCanvas = document.createElement("canvas"),
        ctx = newCanvas.getContext("2d"),
        width = cnv.width,
        height = cnv.height;
      newCanvas.width = width + 30;
      newCanvas.height = height + 30 ;
        ctx.beginPath();
        ctx.drawImage(cnv, 15, 15, width, height);
      let imgdata = newCanvas.toDataURL();
      return imgdata;
    },
  },
  created() {
    this.chartData.xAxis[0].categories = [];
    this.chartData.series[0].data = [];
    this.chartData.series[1].data = [];
    this.globalPeriodData = this.$store.getters.getGlobalFactors().period.Period;
    if (this.isFPModules && this.isFPDQRModules) {
      this.dqrScorecard = [
        {
          id: "FPDashboard",
          name: "FP Dashboard",
          score: null,
          scoreLimit: null,
          createAt: null,
          module: "fp-dashboard",
          route: "fp-dashboard",
          redirectRoute: "dqr-dashboard",
          link: "",
        },
      ];
    }
    if (this.isMNCHModules) {
      this.getConfigData();
    }
  },
};
</script>

<style scoped></style>
