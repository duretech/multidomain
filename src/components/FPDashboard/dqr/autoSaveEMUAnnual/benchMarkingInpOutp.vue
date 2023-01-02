<template>
  <div class="row">
    <loader v-if="bshowLoader" />
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
      <div class="tab-content">
        <div
          class="tab-pane fade"
          :id="'input_tab_content_' + tabName"
          role="tabpanel"
          :aria-labelledby="'input_tab_link_' + tabName"
        >
          <TabSummary
            v-if="data['tabCategoryInfo'] && data['tabCategoryInfo'][0]"
            :content="data['tabCategoryInfo'][0]"
            :contKey="'input' + contName"
          />
          <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12">
              <b-alert v-if="!aFinalInputData" show variant="danger">{{
                $t("no_data_to_display")
              }}</b-alert>
              <div class="row" v-if="aFinalInputData">
                <div
                  v-bind:class="getClass()"
                  v-for="chart in aFinalInputData.filter(
                    (obj) => obj.disableChart != true
                  )"
                  :key="chart.title"
                >
                  <card-component
                    :chartdata="chart"
                    :period="true"
                    :canComment="canComment"
                    :loggedInUserId="loggedInUserId"
                    defaultSort="JAN-DEC"
                    sorting="['JAN-DEC','DEC-JAN']"
                  ></card-component>
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
            v-if="data['tabCategoryInfo'] && data['tabCategoryInfo'][1]"
            :content="data['tabCategoryInfo'][1]"
            :contKey="'output' + contName"
          />

          <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12">
              <div class="row">
                <!-- <div class="col-12 d-none">
                  <div class="card mb-3">
                    <div
                      class="card-header"
                    >{{$t('outputsChartTitle1')}}</div>
                    <div
                      class="card-body"
                    >{{$t('outputsChartBody1')}}</div>
                  </div>
                </div> -->
                <div class="col-12">
                  <div class="card mb-4">
                    <div class="card-header">
                      {{ $t("outputsChartTitle1") }}
                    </div>
                    <div
                      class="card-body bg-white"
                      style="border-radius: 0 0 10px 10px"
                    >
                      <p>{{ $t("outputsChartBody1") }}</p>
                      <div class="row">
                        <div
                          v-bind:class="getClass()"
                          v-if="
                            lineAdNonAdChartData &&
                            lineAdNonAdChartData.disable == false
                          "
                        >
                          <card-component
                            :chartdata="lineAdNonAdChartData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="['JAN-DEC','DEC-JAN']"
                          />
                        </div>
                        <div
                          v-bind:class="getClass()"
                          v-if="
                            adNonadChartData &&
                            adNonadChartData.disable == false
                          "
                        >
                          <card-component
                            :chartdata="adNonadChartData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                          <!--  defaultSort="A-Z" sorting="['0-1','1-0', 'A-Z','Z-A']" -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div class="col-12 d-none">
                  <div class="card mb-3">
                    <div
                      class="card-header"
                    >{{$t('outputsChartTitle2')}}</div>
                    <div
                      class="card-body"
                    >{{$t('outputsChartBody2')}}</div>
                  </div>
                </div> -->
                <div class="col-12">
                  <div class="card mb-4">
                    <div class="card-header">
                      {{ $t("outputsChartTitle2") }}
                    </div>
                    <div
                      class="card-body bg-white"
                      style="border-radius: 0 0 10px 10px"
                    >
                      <p>{{ $t("outputsChartBody2") }}</p>
                      <div class="row">
                        <div
                          v-bind:class="getClass()"
                          v-if="
                            outPutTrendsChart &&
                            outPutTrendsChart.disable == false
                          "
                        >
                          <card-component
                            :chartdata="outPutTrendsChart"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="['JAN-DEC','DEC-JAN']"
                          ></card-component>
                        </div>
                        <div
                          v-bind:class="getClass()"
                          v-if="
                            comparisionEstimateData &&
                            comparisionEstimateData.disable == false
                          "
                        >
                          <card-component
                            :chartdata="comparisionEstimateData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                        </div>
                        <!--                                             defaultSort="A-Z" sorting="['0-1','1-0', 'A-Z','Z-A']"
 -->
                        <div
                          class="col-lg-12 col-xl-12 mb-4 pieChart-col"
                          v-if="
                            MordernUsersByMethodsData &&
                            MordernUsersByMethodsData.disable == false &&
                            signOffActive
                          "
                        >
                          <card-component
                            :chartdata="MordernUsersByMethodsData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="A-Z"
                            sorting="['0-1','1-0', 'A-Z','Z-A']"
                          />
                        </div>

                        <div
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
                            sorting="['0-1','1-0', 'A-Z','Z-A']"
                          />
                        </div>

                        <div
                          class="col-lg-12 col-xl-12 mb-4 pieChart-col"
                          v-if="
                            MixComparisionData &&
                            MixComparisionData.disable == false &&
                            signOffActive
                          "
                        >
                          <card-component
                            :chartdata="MixComparisionData"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                          />
                        </div>
                        <div
                          class="col-lg-8 col-xl-8 mb-4 pieChart-col"
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
                        </div>

                        <!-- <div class="col-lg-6 col-xl-4 mb-4" v-if="methodMixPieChart">
                                    <card-component
                                        :chartdata="methodMixPieChart"
                                    />
                </div>-->

                        <div
                          v-bind:class="getClass()"
                          v-if="
                            userTrendsByMethod &&
                            userTrendsByMethod.disable == false
                          "
                        >
                          <card-component
                            :chartdata="userTrendsByMethod"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="JAN-DEC"
                            sorting="['JAN-DEC','DEC-JAN']"
                          />
                        </div>

                        <div
                          v-bind:class="getClass()"
                          v-if="
                            comparisionSlope &&
                            comparisionSlope.disable == false
                          "
                        >
                          <card-component
                            :chartdata="comparisionSlope"
                            :canComment="canComment"
                            :loggedInUserId="loggedInUserId"
                            defaultSort="A-Z"
                            sorting="['0-1','1-0', 'A-Z','Z-A']"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-12">
                  <div class="row dashboardchart-container">
                    <div class="col-lg-12 col-xl-12 mb-4">
                      <dataTable
                        v-if="userTrendsByMethod"
                        :chartdata="userTrendsByMethod"
                        :tableName="tableName"
                        :tableHeading="firstTableName"
                        :chartInfo="firstTableInfo"
                        @filter="getFilter"
                      />
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
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row m-t-40px float-right">
                        <div class="col-lg-12 col-xl-12 ">
                            <a class="btn black-btn color-white" :id="'input_tab_link_'+tabName" data-toggle="pill"
                                :href="'#input_tab_content_'+tabName" role="tab" :aria-controls="'input_tab_content_'+tabName"
                                aria-selected="true" @click="removeActiveClass" style="margin-bottom:30px;">
                                Prev
                            </a>

                            <a class="btn black-btn color-white" id="benchmarking-fpemuoutput-tabemu"
                            data-toggle="pill" href="#benchmarking-fpemuoutput"
                            role="tab" aria-controls="benchmarking-fpemuoutput"
                            aria-selected="false" @click="removeActiveClass" style="margin-bottom:30px;">EMU Output</a>
                        </div>
          </div>-->
        </div>
        <div
          class="tab-pane fade show active"
          :id="'reporting_tab_content_' + tabName"
          role="tabpanel"
          :aria-labelledby="'reporting_tab_link_' + tabName"
        >
          <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12 mb-4" v-if="reportinRateChart">
              <TabSummary
                :content="reportinRateChart['categoryInfo']"
                :contKey="contName"
              />
              <card-component
                :chartdata="reportinRateChart"
                :canComment="canComment"
                :loggedInUserId="loggedInUserId"
                chartComp="repotingRate"
                defaultSort="JAN-DEC"
                sorting="['JAN-DEC','DEC-JAN']"
              />
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
import cardComponent from "./cardComponent";
import dataTable from "./dataTable";
import service from "@/service";
import dataM from "./dataMassaging.js";
import bechMarkingOutputTable from "./bechMarkingOutputTable";
export default {
  data() {
    //console.log(this.inputActive)
    return {
      finalMethodArr: [],
      sYearArray: [],
      emuColors: null,
      globalConfig: null,
      bRequestFlag: false,
      aFinalInputData: null,
      bshowLoader: false,
      totalCyp: null,
      reportingRateDe: this.repoId,
      CommAdjustment: null,
      repoRate: null,
      baseLineUsers: null,
      newBaseLineUsers: null,
      cypFactors: null,
      AdjudtedValues: null,
      NonAdjudtedValues: null,
      outPutTrendsChart: null,
      comparisionEstimateData: null,
      MordernUsersByMethodsData: null,
      MixComparisionData: null,
      methodMixPieChart: null,
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
        this.data["derivedCharts"][6]["chartOptions"]["chartName"],
      secondTableName:
        this.data["derivedCharts"][7]["chartOptions"]["chartName"],
      firstTableInfo:
        this.data["derivedCharts"][6]["chartOptions"]["chartInfo"],
      secondTableInfo:
        this.data["derivedCharts"][7]["chartOptions"]["chartInfo"],
      filter: "inc",
      userTData: null,
      canComment: false,
      loggedInUserId: "",
      statData: [],
      statFields: [],
      activetab: "",
      defaultLevelID: "",
      sourceStartYear: this.data["initialYear"],
      sourceEndYear: this.data["finalYear"],
      methodSeq: [],
      tableMethodSeq: [],
      newinputActive: this.inputActive,
      newoutputActive: this.outputActive,
      newrepoActive: this.repoActive,
    };
  },
  props: [
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
    activeSummary(tab) {
      if (tab == "input") {
        this.newinputActive = !this.newinputActive;
      } else if (tab == "output") {
        this.newoutputActive = !this.newoutputActive;
      } else {
        this.newrepoActive = !this.newrepoActive;
      }
    },
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
      //console.log(this.bgData)
      let { levelID } = service.getAllowedLocation();

      //let locationID = locationID;
      this.defaultLevelID = levelID;
      let oRet = dataM.getFormatedData(
        this.data,
        this.$store.getters.getApplicationModule(),
        this.bgData.cyp[this.contName],
        this.$store.getters.getGlobalFactors().continuation[this.contName]
      );
      this.finalMethodArr = oRet.finalMethodArr;
      this.globalConfig = oRet.data;
      this.totalCyp = oRet.totalCYP;
      this.methodSeq = oRet.methodSeq;
      this.tableMethodSeq = oRet.tableMethodSeq;
      this.emuColors = oRet.emuColors;
      if (this.globalConfig.chartArr.length) {
        let returnSt = this.getAllDataelemsData();
        if (returnSt) {
          this.$emit("errorOccured", returnSt);
        } else {
          this.bshowLoader = false;
        }
      } else {
        this.bshowLoader = false;
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
      let i,
        aChart = this.globalConfig.chartArr,
        ncLen = aChart.length,
        //sLocId = this.globalConfig.locationId,
        sLocId = this.location.split("/")[1],
        //sYear = dataM.getYearFormated(this.startYear,this.endYear),
        sYear = dataM.getYearFormated(this.sourceStartYear, this.sourceEndYear),
        nFlag1 = 0,
        nFlag2 = 0;
      let showAlert = false;
      this.sYearArray = sYear.split(";");
      this.getReportingRate(sLocId, sYear);
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
          let sdes = aDe[j].de.join(";"),
            nI = i,
            nJ = j;
          if (!aDe[j].de.length) {
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
    getReportingRate(p_loc, p_pe) {
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
      //console.log(this.data['reportingRate'][0]['indicator']['chartOptions']['title']['text'], 'jvhnvhgvng')
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
      repoData.title = this.data["reportingRate"][0]["indicator"]["chartName"];
      repoData.chartInfo =
        this.data["reportingRate"][0]["indicator"]["chartInfo"];
      repoData.categoryInfo =
        this.data["reportingRate"][0]["indicator"]["categoryInfo"];
      repoData.source = "";
      repoData.xTitle =
        this.data["reportingRate"][0]["indicator"]["chartOptions"]["xAxis"][
          "text"
        ];
      repoData.yTitle =
        this.data["reportingRate"][0]["indicator"]["chartOptions"]["yAxis"][
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
        oAdjustmentFactors
      );
      console.log(
        this.contName,
        "Short term methods calculation",
        oSTMAdjusment
      );
      console.log(
        "Continuation factor ",
        this.bgData.continuation[this.contName]
      );
      let aSumOfCont = dataM.getSumOfCont(
        this.bgData.continuation[this.contName]
      );
      // bIsUser = this.tabName === "fp_users";
      console.log(this.contName, "aSumOfContinuation", aSumOfCont);
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
        continuation
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
      this.NonAdjudtedValues = dataM.calculateNewAdjustedVals(
        allMethodsAdjusted.nonAdjusted
      );
      // let oUserTrends = dataM.getFinalOutPutChart(
      //   this.tabName,
      //   allMethodsAdjusted.adjusted
      // );
      //
      let adjNonAdjData = dataM.getFinaladjNonAdjData(
        this.tabName,
        allMethodsAdjusted
      );
      console.log("adjNonAdjData", adjNonAdjData);
      let methodWiseAdjObject = adjNonAdjData.adjusted;
      let oUserTrends = dataM.getUserTrendsData(
        this.tabName,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject
      );
      //console.log("oUserTrendsNew",oUserTrendsNew);
      // console.log("oUserTrends",oUserTrends);
      this.outPutTrendsChart = this.getOtherChartDeatils(oUserTrends, 0, "");

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
        unpdtext = "unpd";
      if (this.defaultLevelID == this.location.split("/")[0]) {
        unpdData = this.bgData.UNPD;
        unpdtext = "unpd";
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
        [...this.finalMethodArr],
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
        surveyData
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
        surveyData
      );
      this.lineAdNonAdChartData = this.getOtherChartDeatils(
        adjNonAdjLineChart,
        8,
        "line"
      );

      let adjNonAdjBarChart = dataM.getadjNonAdjBarChart(
        this.currentYear,
        this.sYearArray,
        [...this.finalMethodArr],
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
        this.aSource[this.contName]
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
            size: 200,
            center: [200, 180],
            name: "Methods",
            colorByPoint: true,
            data: pieDataObject["estiMethod"].data,
          },
          {
            size: 200,
            center: [600, 180],
            name: "Methods",
            colorByPoint: true,
            data: pieDataObject["methodMix"].data,
          },
        ],
        title: this.data["derivedCharts"][3]["chartOptions"]["chartName"],
        source: this.sources[this.contName],
        xTitle: "",
        yTitle: "",
        type: "pie",
        disable: this.data["derivedCharts"][3]["chartOptions"]["disableChart"],
        dataLable: true,
        chartInfo: this.data["derivedCharts"][3]["chartOptions"]["chartInfo"],
        cid: this.data["derivedCharts"][3]["chartOptions"]["cid"],
        tableData: pieDataObject.tableData,
        fields: pieDataObject.aFields,
        labels: {
          items: [
            {
              // html: 'Estimated Modern Method Mix',
              html: this.data["derivedCharts"][3]["chartOptions"]["subTitle"][
                "text"
              ],
              style: {
                left: "150px",
                top: "0px",
                color: "black",
              },
            },
            {
              // html: 'Modern Contraceptive Method Mix',
              html: this.data["derivedCharts"][3]["chartOptions"]["subTitle1"][
                "text"
              ],
              style: {
                left: "450px",
                top: "0px",
                color: "black",
              },
            },
          ],
        },
      };
      //console.log(oResponse, this.tabName, this.location.split('/')[1])
      return oResponse;
    },
    getOtherChartDeatils(obj, index, type) {
      obj.title =
        this.data["derivedCharts"][index]["chartOptions"]["chartName"];
      obj.source = "";
      obj.xTitle =
        this.data["derivedCharts"][index]["chartOptions"]["xAxis"]["text"];
      obj.yTitle =
        this.data["derivedCharts"][index]["chartOptions"]["yAxis"]["text"];
      obj.disable =
        this.data["derivedCharts"][index]["chartOptions"]["disableChart"];
      obj.cid = this.data["derivedCharts"][index]["chartOptions"]["cid"];
      obj.chartInfo =
        this.data["derivedCharts"][index]["chartOptions"]["chartInfo"];
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
      this.$swal({
        text: this.$i18n.t("somethingwentwrong"),
      });
      this.bshowLoader = false;
    },
    onYearChange(p_val) {
      this.currentYear = p_val;
      this.allDataFetched();
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
    console.log(this.contName);
    this.getGlobalConfig();
  },
  updated() {},
  destroyed() {},
  watch: {
    bgData(newVal) {
      this.bgData = newVal;
      this.bshowLoader = false;
      if (this.bRequestFlag) this.allDataFetched();
    },
    bRequestFlag(newVal) {
      if (newVal && this.repoRate) {
        this.allDataFetched();
      }
    },
    // repoRate(newVal) {
    //   ////console.log(newVal)
    //   console.log("repoRate allDataFetched",newVal)
    //   if (newVal && this.bRequestFlag) {
    //     this.allDataFetched();
    //   }
    // },
    location(newVal) {
      if (newVal) {
        this.bRequestFlag = false;
        this.bshowLoader = false;
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
      this.bshowLoader = false;
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
    background-color: #2e2e48;
    border-color: #2e2e48;
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: #2e2e48;
    border-color: #2e2e48;
  }
}
.newGreen-theme .top-date-page-div {
  position: absolute;
  top: 0;
  right: 15px;

  span {
    background-color: #0c5327;
    border-color: #0c5327;
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: #0c5327;
    border-color: #0c5327;
  }
}

.newBlack-theme .top-date-page-div {
  position: absolute;
  top: 0px;
  right: 15px;

  span {
    background-color: #0b0c10;
    border-color: #0b0c10;
    font-size: 0.75rem;
    padding: 12px;
  }
  span:hover {
    background-color: #0b0c10;
    border-color: #0b0c10;
  }
}
</style>
