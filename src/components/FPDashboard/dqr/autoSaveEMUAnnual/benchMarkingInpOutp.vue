<template>
  <div class="row">
    <!-- <loader v-if="bshowLoader" /> -->
    <div class="col-lg-12">
      <div class="top-date-page-div">
        <span class="btn pointer-events-none color-white">
          {{ sourceStartYear }} - {{ sourceEndYear }}
        </span>
      </div>
      <ul class="nav nav-pills mb-3" role="tablist">
        <li class="nav-item">
          <a
            class="nav-link active analytical-tab-links fs-19-1920"
            :id="'reporting_tab_link_' + tabName"
            data-toggle="pill"
            :href="'#reporting_tab_content_' + tabName"
            role="tab"
            :aria-controls="'reporting_tab_content_' + tabName"
            aria-selected="false"
            @click="getActiveTab('repo')"
            >{{ $t("reportingRates") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link analytical-tab-links fs-19-1920"
            :id="'input_tab_link_' + tabName"
            data-toggle="pill"
            :href="'#input_tab_content_' + tabName"
            role="tab"
            :aria-controls="'input_tab_content_' + tabName"
            aria-selected="true"
            @click="getActiveTab('input')"
            >{{ $t("inputData") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link analytical-tab-links fs-19-1920"
            :id="'output_tab_link_' + tabName"
            data-toggle="pill"
            :href="'#output_tab_content_' + tabName"
            role="tab"
            :aria-controls="'output_tab_content_' + tabName"
            aria-selected="false"
            @click="getActiveTab('output')"
            >{{ $t("outputs") }}</a
          >
        </li>
      </ul>
    </div>

    <div class="col-lg-12">
      <div class="tab-content mt-3">
        <div
          class="tab-pane fade"
          :id="'input_tab_content_' + tabName"
          role="tabpanel"
          :aria-labelledby="'input_tab_link_' + tabName"
        >
          <TabSummary
            v-if="
              data['tabCategoryInfo'] &&
              (typeof data['tabCategoryInfo'][0] == 'object'
                ? data['tabCategoryInfo'][0][$i18n.locale]
                : data['tabCategoryInfo'][0])
            "
            :content="
              typeof data['tabCategoryInfo'][0] == 'object'
                ? data['tabCategoryInfo'][0][$i18n.locale]
                : data['tabCategoryInfo'][0]
            "
            :contKey="'input' + contName"
          />
          <div class="row dashboardchart-container emu-dqr m-1">
            <div class="col-lg-12 col-xl-12">
              <div
                v-if="!aFinalInputData"
                class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
              >
                <b-spinner type="grow" label="Spinning"></b-spinner>
              </div>
              <div class="row" v-if="aFinalInputData">
                <div
                  v-bind:class="getClass()"
                  v-for="chart in aFinalInputData.filter(
                    (obj) => obj.disableChart != true
                  )"
                  :key="chart.title"
                  class="border-right"
                >
                  <card-component
                    v-if="chart"
                    :chartdata="chart"
                    :period="true"
                    :canComment="canComment"
                    :loggedInUserId="loggedInUserId"
                    defaultSort="JAN-DEC"
                    sorting="type3"
                  ></card-component>
                  <div class="card" v-else>
                    <div
                      class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                    >
                      <b-spinner type="grow" label="Spinning"></b-spinner>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <a class="btn black-btn pointer-events-none color-white float-right" :id="'output_tab_link_'+tabName" data-toggle="pill"
                        :href="'#output_tab_content_'+tabName" role="tab"
                        :aria-controls="'output_tab_content_'+tabName" aria-selected="false" @click="removeActiveClass" style="margin-bottom:30px;">
                        Output
          </a>-->
        </div>
        <div
          class="tab-pane fade"
          :id="'output_tab_content_' + tabName"
          role="tabpanel"
          :aria-labelledby="'output_tab_link_' + tabName"
        >
          <TabSummary
            v-if="
              data['tabCategoryInfo'] &&
              typeof data['tabCategoryInfo'][1] == 'object'
                ? data['tabCategoryInfo'][1][$i18n.locale]
                : data['tabCategoryInfo'][1]
            "
            :content="
              typeof data['tabCategoryInfo'][0] == 'object'
                ? data['tabCategoryInfo'][0][$i18n.locale]
                : data['tabCategoryInfo'][0]
            "
            :contKey="'output' + contName"
          />

          <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12">
              <div class="row">
                <div class="col-12">
                  <div class="mb-25px">
                    <div class="card-header">
                      {{ $t("outputsChartTitle1") }}
                    </div>
                    <div
                      class="card-body bg-white"
                      style="border-radius: 0 0 10px 10px"
                    >
                      <p>{{ $t("outputsChartBody1") }}</p>
                      <div class="row emu-dqr">
                        <div v-bind:class="getClass()" class="">
                          <card-component
                            v-if="
                              lineAdNonAdChartData &&
                              lineAdNonAdChartData.disable == false
                            "
                            :chartdata="lineAdNonAdChartData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="type3"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>
                        <div v-bind:class="getClass()">
                          <card-component
                            v-if="
                              adNonadChartData &&
                              adNonadChartData.disable == false
                            "
                            :chartdata="adNonadChartData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                          <!--  defaultSort="A-Z" sorting="type4" -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-25px">
                    <div class="card-header">
                      {{ $t("outputsChartTitle2") }}
                    </div>
                    <div
                      class="card-body bg-white"
                      style="border-radius: 0 0 10px 10px"
                    >
                      <p>{{ $t("outputsChartBody2") }}</p>
                      <div class="row emu-dqr">
                        <div v-bind:class="getClass()" class="border-right">
                          <card-component
                            v-if="
                              outPutTrendsChart &&
                              outPutTrendsChart.disable == false
                            "
                            :chartdata="outPutTrendsChart"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="type3"
                          ></card-component>
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>
                        <div v-bind:class="getClass()">
                          <card-component
                            v-if="
                              comparisionEstimateData &&
                              comparisionEstimateData.disable == false
                            "
                            :chartdata="comparisionEstimateData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>

                        <div
                          :class="
                            signOffActive
                              ? `col-lg-12 col-xl-12 mb-4 pieChart-col`
                              : `col-lg-4 col-xl-4 mb-4`
                          "
                        >
                          <card-component
                            v-if="
                              MordernUsersByMethodsData &&
                              MordernUsersByMethodsData.disable == false
                            "
                            :chartdata="MordernUsersByMethodsData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="A-Z"
                            sorting="type4"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>

                        <!-- <div
                          class="col-lg-4 col-xl-4 mb-4"
                          v-else-if="
                            MordernUsersByMethodsData &&
                            MordernUsersByMethodsData.disable == false
                          "
                        >
                          <card-component
                            :chartdata="MordernUsersByMethodsData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="A-Z"
                            sorting="type4"
                          />
                        </div> -->

                        <div
                          :class="
                            signOffActive
                              ? `col-lg-12 col-xl-12 mb-4 pieChart-col`
                              : `col-lg-8 col-xl-8 mb-4 pieChart-col border-left`
                          "
                        >
                          <card-component
                            v-if="
                              MixComparisionData &&
                              MixComparisionData.disable == false
                            "
                            :chartdata="MixComparisionData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>

                        <!-- <div
                          class="col-lg-8 col-xl-8 mb-4 pieChart-col border-left"
                          v-else-if="
                            MixComparisionData &&
                            MixComparisionData.disable == false
                          "
                        >
                          <card-component
                            :chartdata="MixComparisionData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                        </div> -->

                        <div v-bind:class="getClass()" class="border-right">
                          <card-component
                            v-if="
                              userTrendsByMethod &&
                              userTrendsByMethod.disable == false
                            "
                            :chartdata="userTrendsByMethod"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="type3"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>

                        <div v-bind:class="getClass()">
                          <card-component
                            v-if="
                              comparisionSlope &&
                              comparisionSlope.disable == false
                            "
                            :chartdata="comparisionSlope"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="A-Z"
                            sorting="type4"
                          />
                          <div class="card" v-else>
                            <div
                              class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                            >
                              <b-spinner
                                type="grow"
                                label="Spinning"
                              ></b-spinner>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-12">
                  <div class="row dashboardchart-container">
                    <div class="col-lg-12 col-xl-12 mb-4 p-4">
                      <dataTable
                        v-if="userTrendsByMethod"
                        :chartdata="userTrendsByMethod"
                        :tableName="tableName"
                        :popData="bgData.population"
                        :tableHeading="firstTableName"
                        :chartInfo="firstTableInfo"
                        @filter="getFilter"
                      />
                      <div class="card" v-else>
                        <div
                          class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                        >
                          <b-spinner type="grow" label="Spinning"></b-spinner>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-4">
                  <!--  <bechMarkingOutputTable v-if="aFinalInputData"
                                        :data="aFinalInputData"
                  />-->
                  <bechMarkingOutputTable
                    v-if="AdjudtedValues && tableMethodSeq.length > 0"
                    :data="AdjudtedValues"
                    :tableHeading="secondTableName"
                    :chartInfo="secondTableInfo"
                    :methodSeq="tableMethodSeq"
                    :source="contName"
                    :location="location"
                  />
                  <div class="card" v-else>
                    <div
                      class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                    >
                      <b-spinner type="grow" label="Spinning"></b-spinner>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade show active"
          :id="'reporting_tab_content_' + tabName"
          role="tabpanel"
          :aria-labelledby="'reporting_tab_link_' + tabName"
        >
          <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12 mb-4 p-4" v-if="reportinRateChart">
              <TabSummary
                v-if="reportinRateChart"
                :content="reportinRateChart['categoryInfo']"
                :contKey="contName"
              />
              <card-component
                v-if="reportinRateChart"
                :chartdata="reportinRateChart"
                :canComment="canComment"
                :loggedInUserId="loggedInUserId"
                chartComp="repotingRate"
                defaultSort="JAN-DEC"
                sorting="type3"
              />
            </div>
            <div class="col-lg-12 col-xl-12 mb-4 p-4" v-else>
              <div
                class="card"
                v-if="!reportinRateChart && byPassRepoRate == false"
              >
                <div
                  class="card-body pb-0 h-410px align-items-center d-flex justify-content-center"
                >
                  <b-spinner type="grow" label="Spinning"></b-spinner>
                </div>
              </div>
              <b-alert
                v-if="!reportinRateChart && byPassRepoRate == true"
                show
                variant="warning"
                >{{ $t("rrByPass") }}</b-alert
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global settings, $*/
/*eslint no-undef: "error"*/
import cardComponent from "./../emuAnnual/cardComponent";
import dataTable from "./../emuAnnual/dataTable";
import service from "@/service";
import dataM from "./../emuAnnual/dataMassaging.js";
import bechMarkingOutputTable from "./bechMarkingOutputTable";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import StaticColorMixin from "@/helpers/StaticColorMixin";

export default {
  mixins: [DynamicImageMixin, StaticColorMixin],
  data() {
    return {
      finalMethodArr: [],
      sYearArray: [],
      emuColors: null,
      globalConfig: null,
      bRequestFlag: false,
      aFinalInputData: null,
      //bshowLoader: false,
      totalCyp: null,
      reportingRateDe: this.repoId,
      CommAdjustment: null,
      repoRate: null,
      baseLineUsers: null,
      newBaseLineUsers: null,
      cypFactors: null,
      AdjudtedValues: null,
      // NonAdjudtedValues: null,
      outPutTrendsChart: null,
      comparisionEstimateData: null,
      MordernUsersByMethodsData: null,
      MixComparisionData: null,
      //methodMixPieChart: null,
      userTrendsByMethod: null,
      comparisionSlope: null,
      reportinRateChart: null,
      adNonadChartData: null,
      lineAdNonAdChartData: null,
      currentYear: this.endYear,
      //currentYear:this.data['finalYear'],
      yearFilterList: this.getYearList(),
      sources: {
        commoditiesToClients: "Commodities Distributed to Clients",
        commoditiesToFacilities: "Commodities Distributed to Facilities",
        fp_visits: "FP Visits",
        fp_users: "FP Users",
      },
      aSource: {
        Commodities_Client: this.$i18n.t("commodities_to_clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t("commodities_to_facility"),
        User: this.$i18n.t("fp_users"),
      },
      firstTableName:
        typeof this.data["derivedCharts"][6]["chartOptions"]["chartName"] ==
        "object"
          ? this.data["derivedCharts"][6]["chartOptions"]["chartName"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][6]["chartOptions"]["chartName"],
      secondTableName:
        typeof this.data["derivedCharts"][7]["chartOptions"]["chartName"] ==
        "object"
          ? this.data["derivedCharts"][7]["chartOptions"]["chartName"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][7]["chartOptions"]["chartName"],
      firstTableInfo:
        this.data["derivedCharts"][6]["chartOptions"]["chartInfo"] == "object"
          ? this.data["derivedCharts"][6]["chartOptions"]["chartInfo"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][6]["chartOptions"]["chartInfo"],
      secondTableInfo:
        this.data["derivedCharts"][7]["chartOptions"]["chartInfo"] == "object"
          ? this.data["derivedCharts"][7]["chartOptions"]["chartInfo"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][7]["chartOptions"]["chartInfo"],
      filter: "inc",
      userTData: null,
      canComment: false,
      loggedInUserId: "",
      statData: [],
      statFields: [],
      activetab: "",
      defaultLevelID: "",
      sourceStartYear: "",
      sourceEndYear: "",
      methodSeq: [],
      tableMethodSeq: [],
      newinputActive: this.inputActive,
      newoutputActive: this.outputActive,
      newrepoActive: this.repoActive,
    };
  },
  props: [
    "byPassRepoRate",
    "data",
    "bgData",
    "bAllWomen",
    "tabName",
    "repoId",
    "getData",
    "tableName",
    "startYear",
    "endYear",
    "contName",
    "location",
    "year",
    "repoColor",
    "signOffActive",
    "inputActive",
    "outputActive",
    "repoActive",
    "userDetails",
  ],
  components: {
    cardComponent,
    dataTable,
    bechMarkingOutputTable,
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
  },
  mounted() {
    this.getUser();
    this.getActiveTab("repo");
  },
  methods: {
    getClass() {
      if (this.signOffActive) {
        return "col-lg-12 col-xl-12 mb-4";
      } else {
        return "col-lg-6 col-xl-6 mb-4";
      }
    },
    getActiveTab(tab) {
      this.activetab = tab;
      this.$emit("activeTabName", tab);
    },
    getUser() {
      this.loggedInUserId = this.userDetails.id;
      this.canComment =
        this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser ||
        this.$store.getters.getUserPermissions.canComment;
    },
    getFilter(p) {
      this.filter = p;
    },
    removeActiveClass(e) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      $(e.target).removeClass("active");
      if (e.target.id === "benchmarking-fpemuoutput-tabemu") {
        $(".analytical-method-link").removeClass("active");
        $("#benchmarking-fpemuoutput-tab").addClass("active");
      }
    },
    /**
     * This fnc is to get applicationModule.
     * Usage: `getGlobalConfig()`
     * @param 'applicationModule' which is key for global application config
     * @return {Object} globalConfig
     */
    getGlobalConfig() {
      let { levelID } = service.getAllowedLocation();

      //let locationID = locationID;
      this.defaultLevelID = levelID;
      let oRet = dataM.getFormatedData(
        this.data,
        this.$store.getters.getApplicationModule(
          this.$store.getters.getIsMultiProgram
        ),
        this.startYear,
        this.bgData.cyp[this.contName],
        this.$store.getters.getGlobalFactors().continuation[this.contName]
      );
      this.finalMethodArr = oRet.finalMethodArr;
      this.globalConfig = oRet.data;
      this.totalCyp = oRet.totalCYP;
      this.methodSeq = oRet.methodSeq;
      this.tableMethodSeq = oRet.tableMethodSeq;
      this.emuColors = oRet.emuColors;
      this.$store.commit("setEMUColors", oRet.emuColors);
      //Global Period Seeting in emu annual
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
      }
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        this.sourceEndYear = recentYearMonth.split("-")[0];
      else this.sourceEndYear = recentYearMonth.split("-")[0] * 1 - 1;

      this.sourceStartYear = this.$moment(recentYearMonth, "YYYY-MM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");
      if (this.globalConfig.chartArr.length) {
        this.getReportingRate();

        let returnSt = this.getAllDataelemsData();
        if (returnSt) {
          this.$emit("errorOccured", returnSt);
        } else {
          this.bshowLoader = false;
        }
      } else {
        //this.bshowLoader = false;
        if (this.getData) {
          this.getData(this.tabName, null, "whole_data_empty", this.filter);
        }
      }
    },
    /**
     * This fnc is to get fetch all data of data elements.
     * Usage: `getAllDataelemsData()`
     */
    async getAllDataelemsData() {
      console.log(
        this.location,
        "this.location",
        "getAllDataelemsData method caled==========================",
        this.globalConfig.chartArr
      );
      let i,
        aChart = this.globalConfig.chartArr,
        ncLen = aChart.length,
        //sLocId = this.globalConfig.locationId,
        sLocId = this.location.split("/")[1],
        //sYear = dataM.getYearFormated(this.startYear,this.endYear),
        sYear = dataM.getYearFormated(this.sourceStartYear, this.sourceEndYear),
        nFlag1 = 0,
        nFlag2 = 0;
      this.sYearArray = sYear.split(";");
      let showAlert = false;
      this.sYearArray = sYear.split(";");
      for (i = 0; i < ncLen; i++) {
        let dataEle = aChart[i].dataElems;
        let j;
        for (j in dataEle) {
          if (dataEle[j].de.length) nFlag1++;
        }
      }
      for (i = 0; i < ncLen; i++) {
        let j,
          aDe = aChart[i].dataElems;
        let alertSt = "";
        for (j in aDe) {
          let sdesIDS = aDe[j].selectedDE.map((obj) => obj.id);
          let sdes = sdesIDS.join(";"),
            nI = i,
            nJ = j;
          if (!sdesIDS.length) {
            continue;
          }
          nFlag2++;
          let subinpName = aDe[j].name;
          await service
            .getAnalyticalIndicatorData(sdes, sLocId, sYear)
            .then((response) => {
              if (
                response != undefined &&
                response.data &&
                response.data.rows.length
              ) {
                if (!aChart[nI].charts) {
                  aChart[nI].charts = {};
                }
                if (!aChart[nI].scaling) {
                  aChart[nI].scaling = {};
                }

                aChart[nI].charts = dataM.getChartFormatedData(
                  response.data.rows,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].charts,
                  sYear
                );
              } else {
                showAlert = true;
                //alertSt +=subinpName+" <br/>";
              }
            })
            .catch((res) => {
              //console.log(res);
              //this.$emit("errorOccured", this.newLocVal);
              //this.showAlert();
            });
        }
      }
      if (nFlag1 === nFlag2) {
        this.bRequestFlag = true;
        showAlert = false;
      }
      if (showAlert == true) {
        // //console.log("location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt)
        // return "location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt;
        return this.location;
      } else {
        return null;
      }
    },
    /**
     * This fn is for getting reporting rate
     * Using De
     *
     */
    getReportingRate() {
      let p_loc = this.location.split("/")[1],
        p_pe = dataM.getYearFormated(this.sourceStartYear, this.sourceEndYear);
      let yearArray = p_pe.split(";");
      service
        .getAnalyticalIndicatorData(this.reportingRateDe, p_loc, p_pe)
        .then((response) => {
          let i,
            aRows = response.data.rows,
            nLength = aRows.length,
            oRepoRate = {};

          for (let yInd = 0; yInd < yearArray.length; yInd++) {
            let sYr = yearArray[yInd];
            let findData = aRows.find((obj) => obj[1] * 1 === sYr * 1);
            oRepoRate[sYr] = isFinite(findData && findData[3])
              ? Number(findData[3])
              : 0;
          }
          this.repoRate = oRepoRate;
          this.reportingRateChart(this.repoRate);
        })
        .catch((res) => {
          this.$emit("errorOccured", this.newLocVal);
          //console.log(res);
          // this.showAlert();
        });
    },
    /**
     * This fnc is to compute reporting chart data.
     */
    reportingRateChart(data) {
      let categories = [];
      let seriesData = [];
      let catData = [];
      Object.keys(data).forEach((res) => {
        categories.push(res);
        seriesData.push(data[res]);
        catData.push({
          [this.$i18n.t("year")]: res,
          [this.$i18n.t("Reporting Rate")]: data[res],
        });
      });

      let repoData = {
        categories: categories,
        data: [
          {
            name: this.$i18n.t("Reporting Rate"),
            data: seriesData,
            color: this.repoColor,
          },
        ],
      };
      repoData.title =
        typeof this.data["reportingRate"][0]["indicator"]["chartName"] ==
        "object"
          ? this.data["reportingRate"][0]["indicator"]["chartName"][
              this.$i18n.locale
            ]
          : this.data["reportingRate"][0]["indicator"]["chartName"];
      repoData.chartInfo =
        typeof this.data["reportingRate"][0]["indicator"]["chartInfo"] ==
        "object"
          ? this.data["reportingRate"][0]["indicator"]["chartInfo"][
              this.$i18n.locale
            ]
          : this.data["reportingRate"][0]["indicator"]["chartInfo"];
      repoData.categoryInfo =
        typeof this.data["reportingRate"][0]["indicator"]["categoryInfo"] ==
        "object"
          ? this.data["reportingRate"][0]["indicator"]["categoryInfo"][
              this.$i18n.locale
            ]
          : this.data["reportingRate"][0]["indicator"]["categoryInfo"];
      repoData.source = "";
      repoData.xTitle =
        typeof this.data["reportingRate"][0]["indicator"]["chartOptions"][
          "xAxis"
        ]["text"] == "object"
          ? this.data["reportingRate"][0]["indicator"]["chartOptions"]["xAxis"][
              "text"
            ][this.$i18n.locale]
          : this.data["reportingRate"][0]["indicator"]["chartOptions"]["xAxis"][
              "text"
            ];
      repoData.yTitle =
        typeof this.data["reportingRate"][0]["indicator"]["chartOptions"][
          "yAxis"
        ]["text"] == "object"
          ? this.data["reportingRate"][0]["indicator"]["chartOptions"]["yAxis"][
              "text"
            ][this.$i18n.locale]
          : this.data["reportingRate"][0]["indicator"]["chartOptions"]["yAxis"][
              "text"
            ];
      repoData.type = "column";
      repoData.tableData = catData;
      repoData.cid = this.data["reportingRate"][0]["indicator"]["cid"];

      this.reportinRateChart = repoData;
    },
    /**
     * This fnc is to compute final chart data.
     * Usage: `getFinalChartsdata()`
     * @param 'globalConfig' which is used in the function
     * @return {Array} 'aFinalInputData'
     */
    getFinalChartsdata() {
      let aChartArr = this.globalConfig.chartArr,
        i,
        nLen = aChartArr.length,
        aFinalCharts = [],
        ochartConfig = {
          type: this.globalConfig.type,
          xTitle: this.globalConfig.xTitle,
          yTitle: this.globalConfig.yTitle,
          //visible:this.globalConfig.visible,
        };

      for (i = 0; i < nLen; i++) {
        aFinalCharts.push(dataM.getFinalChartData(aChartArr[i], ochartConfig));
      }

      aFinalCharts.push(
        dataM.getFinalTotalCYP(
          dataM.getTotalCYP(aChartArr),
          ochartConfig,
          this.totalCyp
        )
      );
      this.aFinalInputData = aFinalCharts;
      dataM.saveChartColors(aFinalCharts, this.tabName);
    },
    /**
     * This function is to calculate commodities adjustment for output
     * Usage: ``
     */
    getOutComAdjustment() {
      let allMethodsAdjusted = { adjusted: {}, nonAdjusted: {} };

      let oAdjustmentFactors =
        this.bgData.adjustmentFactorTypeWise[this.contName] ||
        this.bgData.adjustmentFactor;
      let oSTMAdjusment = dataM.calculateSTMNotAdjusted(
        this.globalConfig.chartArr,
        this.repoRate,
        oAdjustmentFactors,
        this.byPassRepoRate
      );
      let aSumOfCont = dataM.getSumOfCont(
        this.bgData.continuation[this.contName]
      );
      // bIsUser = this.tabName === "fp_users";
      let continuation = {};
      Object.keys(this.bgData.continuation[this.contName]).forEach((cont) => {
        continuation[cont] = [];
        Object.keys(
          this.bgData.continuation[this.contName][cont]["continuation"]
        ).forEach((val) => {
          continuation[cont].push(
            this.bgData.continuation[this.contName][cont]["continuation"][val]
          );
        });
      });
      this.cypFactors = oSTMAdjusment.cyp;

      this.newBaseLineUsers = dataM.calculateNewBU(
        this.globalConfig.chartArr,
        aSumOfCont,
        this.repoRate,
        oAdjustmentFactors,
        continuation,
        this.byPassRepoRate
      );

      allMethodsAdjusted.adjusted = Object.assign(
        oSTMAdjusment.adjusted,
        this.newBaseLineUsers.adjusted
      );
      allMethodsAdjusted.nonAdjusted = Object.assign(
        oSTMAdjusment.nonAdjusted,
        this.newBaseLineUsers.nonAdjusted
      );
      this.AdjudtedValues = dataM.calculateNewAdjustedVals(
        allMethodsAdjusted.adjusted
      );

      let adjNonAdjData = dataM.getFinaladjNonAdjData(
        this.tabName,
        allMethodsAdjusted
      );

      let methodWiseAdjObject = adjNonAdjData.adjusted;
      let oUserTrends = dataM.getUserTrendsData(
        this.tabName,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject
      );
      this.outPutTrendsChart = this.getOtherChartDeatils(
        oUserTrends,
        0,
        "line"
      );

      let newData = [];
      oUserTrends.data.forEach((m) => {
        this.methodSeq.forEach((v, i) => {
          if (m["name"] == v) {
            newData[i] = m;
          }
        });
      });

      oUserTrends.data = newData.filter(function (el) {
        return el != null && el != "";
      });
      this.outPutTrendsChart = oUserTrends;

      if (this.getData) {
        this.getData(
          this.tabName,
          this.outPutTrendsChart,
          "userTrendsBymethods",
          this.filter
        );
      }

      let unpdData = {},
        unpdtext = "fpet";
      if (this.defaultLevelID == this.location.split("/")[0]) {
        unpdData = this.bgData.FPET;
        unpdtext = "fpet";
      } else {
        unpdData = this.bgData.FPET;
        unpdtext = "fpet";
      }
      let oMethodMix = this.bgData.methodMix,
        oPopulation = this.bgData.population;

      let surveyData = dataM.getSurveyWiseData(
        this.sYearArray,
        this.finalMethodArr,
        unpdData,
        oMethodMix,
        oPopulation
      );
      if (this.getData) {
        this.getData(this.tabName, surveyData, "surveyData", this.filter);
      }
      if (this.getData) {
        this.getData(
          this.tabName,
          this.finalMethodArr,
          "finalMethodArr",
          this.filter
        );
      }

      //comparison estimate chart calculation
      let combinedComparisonEstimate = dataM.combinedComparisonEstimate(
        this.currentYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        surveyData
      );
      this.comparisionEstimateData = this.getOtherChartDeatils(
        combinedComparisonEstimate,
        1,
        "bar"
      );
      //Column chart for comparison estimate chart
      let MordernUsersByMethodsData = dataM.comarisonEstimateColumnChart(
        this.currentYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        surveyData,
        this.staticColors
      );
      this.MordernUsersByMethodsData = this.getOtherChartDeatils(
        MordernUsersByMethodsData,
        2,
        "column"
      );

      let adjNonAdjLineChart = dataM.getadjNonAdjLineChart(
        this.sYearArray,
        this.finalMethodArr,
        adjNonAdjData,
        surveyData,
        this.staticColors
      );
      this.lineAdNonAdChartData = this.getOtherChartDeatils(
        adjNonAdjLineChart,
        8,
        "line"
      );

      let adjNonAdjBarChart = dataM.getadjNonAdjBarChart(
        this.currentYear,
        this.sYearArray,
        this.finalMethodArr,
        adjNonAdjData,
        surveyData
      );
      this.adNonadChartData = this.getOtherChartDeatils(
        adjNonAdjBarChart,
        9,
        "bar"
      );

      let methodMixService = dataM.getMethodMixServicePie(
        this.currentYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        this.bgData.methodMix
      );
      this.MixComparisionData = this.getPieChart(methodMixService);

      let dhsData = this.bgData.DHS ? this.bgData.DHS : {};
      let pmaData = this.bgData.PMA ? this.bgData.PMA : {};
      let userTrendsByMethodSurvey = dataM.getUserTrendsDatafromSurvey(
        this.sYearArray,
        unpdData,
        dhsData,
        pmaData,
        this.bAllWomen,
        this.bgData["bgIndColor"],
        unpdtext
      );
      let userTrendsbyEmu = dataM.getuserTrendsbyEmu(
        this.sYearArray,
        methodWiseAdjObject,
        oPopulation,
        userTrendsByMethodSurvey,
        this.aSource[this.contName],
        this.staticColors
      );
      this.userTrendsByMethod = this.getOtherChartDeatils(
        userTrendsbyEmu,
        4,
        "line"
      );

      let slopeData = dataM.getSlopData(userTrendsbyEmu);
      this.comparisionSlope = this.getOtherChartDeatils(slopeData, 5, "bar");
      //console.log("comparisionSlope by ashvini", this.comparisionSlope);
      // console.log("adjNonAdjData.adjusted",adjNonAdjData.adjusted);
      if (this.getData) {
        this.getData(this.tabName, methodWiseAdjObject, "userT", this.filter);
      }
      if (this.getData) {
        this.getData(this.tabName, this.comparisionSlope, "slope", this.filter);
      }
      //console.log("userTrendsbyEmu",this.userTrendsByMethod)
      if (this.getData) {
        this.getData(this.tabName, userTrendsbyEmu, "output", this.filter);
      }
    },
    getPieChart(pieDataObject) {
      let oResponse = {
        data: [
          {
            size: 130,
            center: [150, 130],
            name: this.$i18n.t("methods"),
            colorByPoint: true,
            data: pieDataObject["estiMethod"].data,
          },
          {
            size: 130,
            center: [450, 180],
            name: this.$i18n.t("methods"),
            colorByPoint: true,
            data: pieDataObject["methodMix"].data,
          },
        ],
        title:
          typeof this.data["derivedCharts"][3]["chartOptions"]["chartName"] ==
          "object"
            ? this.data["derivedCharts"][3]["chartOptions"]["chartName"][
                this.$i18n.locale
              ]
            : this.data["derivedCharts"][3]["chartOptions"]["chartName"],
        source: this.sources[this.contName],
        xTitle:
          ((typeof this.data["derivedCharts"][3]["chartOptions"]["subTitle"][
            "text"
          ] == "object"
            ? this.data["derivedCharts"][3]["chartOptions"]["subTitle"]["text"][
                this.$i18n.locale
              ]
            : this.data["derivedCharts"][3]["chartOptions"]["subTitle"][
                "text"
              ]) || this.$i18n.t("estimated_modern")) +
          " & " +
          ((typeof this.data["derivedCharts"][3]["chartOptions"]["subTitle1"][
            "text"
          ] == "object"
            ? this.data["derivedCharts"][3]["chartOptions"]["subTitle1"][
                "text"
              ][this.$i18n.locale]
            : this.data["derivedCharts"][3]["chartOptions"]["subTitle1"][
                "text"
              ]) || this.$i18n.t("contraceptive_modern")),
        yTitle: "",
        type: "pie",
        disable: this.data["derivedCharts"][3]["chartOptions"]["disableChart"],
        dataLable: true,
        chartInfo:
          typeof this.data["derivedCharts"][3]["chartOptions"]["chartInfo"] ==
          "object"
            ? this.data["derivedCharts"][3]["chartOptions"]["chartInfo"][
                this.$i18n.locale
              ]
            : this.data["derivedCharts"][3]["chartOptions"]["chartInfo"],
        cid: this.data["derivedCharts"][3]["chartOptions"]["cid"],
        tableData: pieDataObject.tableData,
        fields: pieDataObject.aFields,
        labels: {
          items: [
            {
              // html: 'Estimated Modern Method Mix',
              html:
                "<span class='pie-title'>" +
                  (typeof this.data["derivedCharts"][3]["chartOptions"][
                    "subTitle"
                  ]["text"] == "object"
                    ? this.data["derivedCharts"][3]["chartOptions"]["subTitle"][
                        "text"
                      ][this.$i18n.locale]
                    : this.data["derivedCharts"][3]["chartOptions"]["subTitle"][
                        "text"
                      ]) || this.$i18n.t("estimated_modern") + "</span>",
              style: {
                left: "100px",
                top: "0px",
                color: "#FFFFFF",
              },
            },
            {
              // html: 'Modern Contraceptive Method Mix',
              html:
                "<span class='pie-title'>" +
                  (typeof this.data["derivedCharts"][3]["chartOptions"][
                    "subTitle1"
                  ]["text"] == "object"
                    ? this.data["derivedCharts"][3]["chartOptions"][
                        "subTitle1"
                      ]["text"][this.$i18n.locale]
                    : this.data["derivedCharts"][3]["chartOptions"][
                        "subTitle1"
                      ]["text"]) ||
                this.$i18n.t("contraceptive_modern") + "</span>",
              style: {
                left: "400px",
                top: "0px",
                color: "#FFFFFF",
              },
            },
          ],
        },
      };
      return oResponse;
    },
    getOtherChartDeatils(obj, index, type) {
      obj.title =
        typeof this.data["derivedCharts"][index]["chartOptions"]["chartName"] ==
        "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["chartName"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["chartName"];
      obj.source = "";
      obj.xTitle =
        typeof this.data["derivedCharts"][index]["chartOptions"]["xAxis"][
          "text"
        ] == "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["xAxis"]["text"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["xAxis"]["text"];
      obj.yTitle =
        typeof this.data["derivedCharts"][index]["chartOptions"]["yAxis"][
          "text"
        ] == "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["yAxis"]["text"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["yAxis"]["text"];
      obj.disable =
        this.data["derivedCharts"][index]["chartOptions"]["disableChart"];
      obj.cid = this.data["derivedCharts"][index]["chartOptions"]["cid"];
      obj.chartInfo =
        typeof this.data["derivedCharts"][index]["chartOptions"]["chartInfo"] ==
        "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["chartInfo"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["chartInfo"];
      obj.type = type;
      return obj;
    },
    allDataFetched() {
      if (this.globalConfig) {
        this.getFinalChartsdata();
        this.getOutComAdjustment();
        this.bshowLoader = false;
      }
    },
    /**
     * This function is to alert when something goes wrong with API.
     * Usage: `showAlert()`
     */
    showAlert() {
      // console.trace();
      this.sweetAlert({
        text: this.$i18n.t("somethingwentwrong"),
      });
      //this.bshowLoader = false;
    },
    getYearList() {
      let aKeys = [],
        nStart = this.startYear * 1,
        nEnd = this.endYear * 1;
      //let aKeys = [],nStart = this.sourceStartYear * 1,nEnd = this.sourceEndYear * 1;
      if (!(isNaN(nStart) || isNaN(nEnd))) {
        while (nStart <= nEnd) {
          aKeys.push(nStart);
          nStart++;
        }
      }
      let i,
        nLen = aKeys.length,
        aFinalList = [];
      for (i = 0; i < nLen; i++) {
        let oTemp = { val: aKeys[i], label: aKeys[i] };
        aFinalList.push(oTemp);
      }
      this.$emit("yearFilterList", aFinalList);
      return aFinalList;
    },
  },
  created() {
    this.getGlobalConfig();
  },
  updated() {},
  destroyed() {},
  watch: {
    bgData(newVal) {
      this.bgData = newVal;
      //this.bshowLoader = false;
      if (this.bRequestFlag) this.allDataFetched();
    },
    bRequestFlag(newVal) {
      if (newVal && this.repoRate) {
        this.allDataFetched();
      }
    },
    location(newVal) {
      if (newVal) {
        this.bRequestFlag = false;
        //this.bshowLoader = false;
        this.getGlobalConfig();
      }
    },
    year(newVal) {
      this.currentYear = newVal;
      if (newVal && this.bRequestFlag) {
        this.allDataFetched();
      }
    },
    // filter() {
    //   this.drawUserTrendsByMethods(this.userTData);
    // },
    signOffActive(newVal) {
      this.signOffActive = newVal;
      this.aFinalInputData = null;
      this.reportinRateChart = null;

      this.outPutTrendsChart = null;
      this.comparisionEstimateData = null;
      this.MordernUsersByMethodsData = null;
      this.MixComparisionData = null;
      this.methodMixPieChart = null;
      this.userTrendsByMethod = null;
      this.comparisionSlope = null;

      this.bRequestFlag = false;
      // this.bshowLoader = false;
      this.getGlobalConfig();
    },
  },
};
</script>
<style lang="scss" scoped>
.top-date-page-div {
  position: absolute;
  top: 0;
  right: 15px;

  span {
    background-color: var(--new-footer-component-color);
    border-color: var(--new-footer-component-color);
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: var(--new-footer-component-color);
    border-color: var(--new-footer-component-color);
  }
}
</style>
