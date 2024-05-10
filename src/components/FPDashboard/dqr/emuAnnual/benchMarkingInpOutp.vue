<template>
  <div class="row">
    <!-- <loader v-if="bshowLoader" /> -->
    <div class="col-lg-12">
      <div
        class="top-date-page-div"
        v-if="
          finalAdjNonAdjTableData &&
          finalAdjNonAdjTableData.baseline &&
          finalAdjNonAdjTableData.adjusted
        "
      >
        <a
          class="btn black-btn pointer-events-none color-white ml-3"
          :title="$t('showSteps')"
          @click="showSteps"
        >
          <img
            :src="require('@/assets/images/icons/stepsd.svg')"
            :style="{ filter: filterColor }"
          />
        </a>
        <span class="btn pointer-events-none color-white me-15 pointer-none">
          {{ sourceStartYear }} - {{ sourceEndYear }}
        </span>
      </div>
      <ul class="nav nav-pills mb-3 mx-3" role="tablist">
        <li class="nav-item">
          <a
            v-if="
              (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
              emuSaveType === 'Custom'
            "
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
            v-if="
              (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
              emuSaveType === 'Custom'
            "
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
            v-if="
              (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
              emuSaveType === 'Custom'
            "
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
          v-if="!isEMUSaved && emuSaveType === 'Indicator_Calculator'"
          class="fs-19-1920 analytical-tab-links"
        >
          <h4>Annual EMU is not saved for {{ tableName }}</h4>
          <h5>
            Please click on
            <a href="#" @click.stop.prevent="goToAdmin"> link </a> to save EMU
          </h5>
        </div>
        <div
          v-if="
            (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
            emuSaveType === 'Custom'
          "
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
          v-if="
            (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
            emuSaveType === 'Custom'
          "
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

          <div class="row dashboardchart-container emu-annual">
            <div class="col-lg-12 col-xl-12">
              <div class="row">
                <div class="col-12">
                  <div class="mb-25px">
                    <div class="card-header">
                      {{ $t("outputsChartTitle1") }}
                    </div>
                    <div
                      class="card-body bg-transparent"
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
                      class="card-body bg-transparent"
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

                        <div v-bind:class="getClass()" class="border-right">
                          <card-component
                            v-if="
                              userTrendsByMethod &&
                              userTrendsByMethod.disable == false
                            "
                            :chartdata="userTrendsByMethod"
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
          v-if="
            (isEMUSaved && emuSaveType === 'Indicator_Calculator') ||
            emuSaveType === 'Custom'
          "
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
    <b-modal
      v-model="viewSteps"
      hide-footer
      centered
      size="xl"
      :title="$t('showSteps')"
      no-close-on-backdrop
    >
      <div class="row p-3" v-if="finalAdjNonAdjTableData">
        <strong>{{ $t("baseLineText") }}</strong>
        <download-csv
          v-if="finalAdjNonAdjTableData && finalAdjNonAdjTableData.baseline"
          :data="finalAdjNonAdjTableData.baseline.items"
          style="display: inline-block; margin-left: 10px"
          ><img
            :src="require('@/assets/images/icons/downloadActive.svg')"
            :style="{ filter: filterColor }"
            class="img cursor-pointer"
            v-b-tooltip.hover
            :title="$t('downloadIcon')"
        /></download-csv>
        <b-table
          hover
          v-if="finalAdjNonAdjTableData && finalAdjNonAdjTableData.baseline"
          :items="finalAdjNonAdjTableData.baseline.items"
          bordered
          :fields="finalAdjNonAdjTableData.baseline.fields"
          responsive
          class="methodsTable"
          show-empty
          :empty-text="$t('no_data_to_display')"
        />
        <strong>{{ $t("adjustedNonAdjText") }}</strong>
        <download-csv
          v-if="finalAdjNonAdjTableData && finalAdjNonAdjTableData.adjusted"
          :data="finalAdjNonAdjTableData.adjusted.items"
          style="display: inline-block; margin-left: 10px"
          ><img
            :src="require('@/assets/images/icons/downloadActive.svg')"
            :style="{ filter: filterColor }"
            class="img cursor-pointer"
            v-b-tooltip.hover
            :title="$t('downloadIcon')"
        /></download-csv>
        <b-table
          hover
          v-if="finalAdjNonAdjTableData && finalAdjNonAdjTableData.adjusted"
          :items="finalAdjNonAdjTableData.adjusted.items"
          bordered
          :fields="finalAdjNonAdjTableData.adjusted.fields"
          responsive
          class="methodsTable"
          show-empty
          :empty-text="$t('no_data_to_display')"
        />
        <!-- <template #thead-top="">
              <b-tr >
                <b-th>Method</b-th>
                <b-th>Sub-method</b-th>
                <b-th colspan="2" style="text-align:center;" v-for="year in sYearArray" :key="year">{{year}}</b-th>
              </b-tr>
            </template> -->
        <!-- </b-table> -->
      </div>
    </b-modal>
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
import { decompress } from "compress-json";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import StaticColorMixin from "@/helpers/StaticColorMixin";

export default {
  mixins: [DynamicImageMixin, StaticColorMixin],
  data() {
    return {
      isEMUSaved: false,
      dhisDataFetched: false,
      finalDHIS2Obj: {},
      finalAdjNonAdjTableData: {},
      viewSteps: false,
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
      statData: [],
      statFields: [],
      activetab: "",
      defaultLevelID: "",
      sourceStartYear: "",
      sourceEndYear: "",
      methodSeq: [],
      tableMethodSeq: [],
    };
  },
  props: [
    "byPassRepoRate",
    "emuSaveType",
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
    goToAdmin() {
      this.$store.commit(
        "setNamespace",
        `${this.$store.getters.getAppSettings.tableName}`
      );
      this.$router.push("/admin");
    },
    async getSavedDataElemenet(type) {
      let isDhisDataExist = [];
      let allCatOpt = [],
        sLocId = this.location.split("/")[1],
        sYear = dataM.getYearFormated(this.sourceStartYear, this.sourceEndYear);

      this.sYearArray = sYear.split(";");
      let finalDHIS2Obj = {
        adjusted: {},
        nonAdjusted: {},
      };
      await service.getAllCategoryOptionCombo().then((resp) => {
        if (resp.data) {
          allCatOpt = resp.data.categoryOptionCombos;
        }
      });
      let sYearArray = sYear.split(";");
      let obj = {};
      let finalDES = [];
      this.data.chartData.forEach((indObj) => {
        let indNm =
          typeof indObj.indicator.name == "object"
            ? indObj.indicator.name[this.$i18n.locale]
            : indObj.indicator.name;
        let stNm =
          typeof indObj.indicator.static_name == "object"
            ? indObj.indicator.static_name[this.$i18n.locale]
            : indObj.indicator.static_name;
        if (!obj[indNm + "/" + stNm]) obj[indNm + "/" + stNm] = {};
        sYearArray.forEach((year) => {
          indObj.indicator.subIndicator.forEach((subIndObj) => {
            let subIndNm =
              typeof subIndObj.name == "object"
                ? subIndObj.name[this.$i18n.locale]
                : subIndObj.name;
            let staticName =
              typeof subIndObj.static_name == "object"
                ? subIndObj.static_name[this.$i18n.locale]
                : subIndObj.static_name;
            let catFound = allCatOpt.find(
              (obj) => obj.displayName === staticName
            );
            if (catFound && catFound.id && !finalDES.includes(catFound))
              finalDES.push(catFound);

            if (!obj[indNm + "/" + stNm][year])
              obj[indNm + "/" + stNm][year] = {};
            obj[indNm + "/" + stNm][year][subIndNm + "/" + staticName] = 0;
          });
        });
      });
      finalDHIS2Obj["adjusted"] = obj;
      finalDHIS2Obj["nonAdjusted"] = obj;

      if (this.data["annualDE"]) {
        // await this.data["annualDE"].forEach(async (obj) => {
        for (let obj of this.data["annualDE"]) {
          if (obj.DEID) {
            let concatedDES = finalDES.map(function (e) {
              return obj.DEID + "." + e.id; //Axui7Bg8eGP
            });
            if (
              obj.type === "Adjusted Data Element" ||
              obj.type === "Unadjusted Data Element"
            ) {
              await service
                .getAnalyticalIndicatorData(
                  concatedDES.join(";"),
                  sLocId,
                  sYear
                )
                .then((response) => {
                  if (
                    response != undefined &&
                    response.data &&
                    response.data.rows.length
                  ) {
                    isDhisDataExist.push(true);
                    if (obj.type === "Adjusted Data Element") {
                      response.data.rows.forEach((obj) => {
                        let method = finalDES.find((innerDE) => {
                          return innerDE.id === obj[0].split(".")[1];
                        });
                        if (method) {
                          Object.keys(finalDHIS2Obj.adjusted).forEach(
                            (meth) => {
                              Object.keys(finalDHIS2Obj.adjusted[meth]).forEach(
                                (year) => {
                                  let subMethodArr = Object.keys(
                                    finalDHIS2Obj.adjusted[meth][year]
                                  );
                                  let keyFound = subMethodArr.find((key) => {
                                    return (
                                      key.split("/")[1] === method.displayName
                                    );
                                  });
                                  if (keyFound) {
                                    finalDHIS2Obj.adjusted[meth][obj[1]][
                                      keyFound
                                    ] = obj[3] * 1;
                                  }
                                }
                              );
                            }
                          );
                        }
                      });
                    }
                    if (obj.type === "Unadjusted Data Element") {
                      response.data.rows.forEach((obj) => {
                        let method = finalDES.find((innerDE) => {
                          return innerDE.id === obj[0].split(".")[1];
                        });
                        if (method) {
                          Object.keys(finalDHIS2Obj.nonAdjusted).forEach(
                            (meth) => {
                              Object.keys(
                                finalDHIS2Obj.nonAdjusted[meth]
                              ).forEach((year) => {
                                let subMethodArr = Object.keys(
                                  finalDHIS2Obj.nonAdjusted[meth][year]
                                );
                                let keyFound = subMethodArr.find((key) => {
                                  return (
                                    key.split("/")[1] === method.displayName
                                  );
                                });
                                if (keyFound) {
                                  finalDHIS2Obj.nonAdjusted[meth][obj[1]][
                                    keyFound
                                  ] = obj[3] * 1;
                                }
                              });
                            }
                          );
                        }
                      });
                    }
                  } else {
                    isDhisDataExist.push(false);
                  }
                });
            }
          }
        }
        // });

        if (isDhisDataExist.includes(true)) {
          this.isEMUSaved = true;
          this.dhisDataFetched = true;
          // this.bshowLoader = false;
        } else {
          this.isEMUSaved = false;
          this.dhisDataFetched = false;
          // this.sweetAlert({
          //   text: " EMU is not saved through Indicator Calculator",
          // });
        }
        this.finalDHIS2Obj = finalDHIS2Obj;
      } else {
        this.finalDHIS2Obj = {
          adjusted: {},
          nonAdjusted: {},
        };
      }
    },
    showSteps() {
      this.viewSteps = true;
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
    getUser() {},
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
        this.getReportingRate(this.emuSaveType === "Indicator_Calculator");
        if (this.emuSaveType !== "Indicator_Calculator") {
          this.getAllDataelemsData();
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
      let alertSt = "";
      for (i = 0; i < ncLen; i++) {
        let dataEle = aChart[i].dataElems;
        let j;
        for (j in dataEle) {
          if (dataEle[j].selectedDE.length) nFlag1++;
        }
      }
      let promises = [],
        dataElementsArr = [],
        reqChartArr = [],
        // finalSdes = [],
        methodMapping = [];
      for (i = 0; i < ncLen; i++) {
        let j,
          aDe = aChart[i].dataElems;
        reqChartArr.push(aChart[i]);
        let obj = { parent: aChart[i].static_name, child: [] };
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
          obj.child.push(aDe[j].name);
          if (!aChart[nI].charts) {
            aChart[nI].charts = {};
          }
          if (!aChart[nI].scaling) {
            aChart[nI].scaling = {};
          }
          dataElementsArr.push(aChart[nI].dataElems[nJ]);

          // finalSdes.push(sdes);
          // promises.push(
          //   service.getAnalyticalIndicatorData(sdes, sLocId, sYear)
          // );

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
                alertSt += subinpName + " <br/>";
              }
            })
            .catch((res) => {
              console.log(res, "Error in fetching mapping data elements data");
            });
        }
        methodMapping.push(obj);
      }

      if (nFlag1 === nFlag2) {
        this.bRequestFlag = true;
        showAlert = false;
        //this.bshowLoader = false;
      }
      if (showAlert == true) {
        service
          .getIndividualOrganisation(this.location.split("/")[1])
          .then((key) => {
            console.log(
              "location" +
                key.data.displayName +
                "Error NO Data found for" -
                alertSt
            );
            //this.bshowLoader = false;
          });
        // return "location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt;
        //  return this.location;
      }
    },
    /**
     * This fn is for getting reporting rate
     * Using De
     *
     */
    getReportingRate(ICFlag) {
      let p_loc = this.location.split("/")[1],
        p_pe = dataM.getYearFormated(this.sourceStartYear, this.sourceEndYear);
      let yearArray = p_pe.split(";");

      this.sYearArray = p_pe.split(";");
      if (ICFlag === false) {
        if (this.byPassRepoRate == false) {
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
              console.log(res, "Error in fetching reporting rate data");
            });
        }
      } else {
        let key = this.generateKey(`annualCharts_${this.$i18n.locale}`);
        service
          .getSavedConfig({ tableKey: key })
          .then((resp) => {
            if (resp && resp.data) {
              let annualCharts = resp.data;
              this.finalAnnualCharts = annualCharts;
              let aFinalCharts = annualCharts[this.location.split("/")[1]]
                ? annualCharts[this.location.split("/")[1]][this.contName]
                  ? annualCharts[this.location.split("/")[1]][this.contName][
                      "repoCharts"
                    ]
                    ? annualCharts[this.location.split("/")[1]][this.contName][
                        "repoCharts"
                      ]
                    : {}
                  : {}
                : {};
              aFinalCharts =
                typeof aFinalCharts == "string"
                  ? decompress(JSON.parse(aFinalCharts))
                  : aFinalCharts;

              let savedfinalObj = annualCharts[this.location.split("/")[1]]
                ? annualCharts[this.location.split("/")[1]][this.contName]
                  ? annualCharts[this.location.split("/")[1]][this.contName][
                      "outputCharts"
                    ]
                    ? typeof annualCharts[this.location.split("/")[1]][
                        this.contName
                      ]["outputCharts"] == "string"
                      ? decompress(
                          JSON.parse(
                            annualCharts[this.location.split("/")[1]][
                              this.contName
                            ]["outputCharts"]
                          )
                        )
                      : annualCharts[this.location.split("/")[1]][
                          this.contName
                        ]["outputCharts"]
                    : []
                  : []
                : [];

              this.isEMUSaved = true;
              this.dhisDataFetched = true;
              //this.bshowLoader = false;
              this.finalDHIS2Obj = savedfinalObj["allMethodsAdjusted"];
              this.repoRate = aFinalCharts;
              if (Object.keys(aFinalCharts).length)
                this.reportingRateChart(aFinalCharts);
            }
          })
          .catch((err) => {
            console.log("err");
            console.log("reporting rate data not found");
            this.repoRate = null;
            this.reportinRateChart = null;
            //this.bshowLoader = false;
            if (this.getData) {
              this.getData(this.tabName, null, "whole_data_empty", this.filter);
            }
          });
      }
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
    async getFinalChartsdata(customCal) {
      let aFinalCharts = [];

      if (customCal) {
        let aChartArr = this.globalConfig.chartArr,
          i,
          nLen = aChartArr.length,
          ochartConfig = {
            type: this.globalConfig.type,
            xTitle: this.globalConfig.xTitle,
            yTitle: this.globalConfig.yTitle,
            //visible:this.globalConfig.visible,
          };

        for (i = 0; i < nLen; i++) {
          aFinalCharts.push(
            dataM.getFinalChartData(aChartArr[i], ochartConfig)
          );
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
      } else {
        if (!this.finalAnnualCharts) {
          let key = this.generateKey(`annualCharts_${this.$i18n.locale}`);
          await service
            .getSavedConfig({ tableKey: key })
            .then((resp) => {
              if (resp && resp.data) {
                let annualCharts = resp.data;
                this.finalAnnualCharts = annualCharts;
              }
            })
            .catch((err) => {
              this.aFinalInputData = null;
              //this.bshowLoader = false;
              if (this.getData) {
                this.getData(
                  this.tabName,
                  null,
                  "whole_data_empty",
                  this.filter
                );
              }
            });
        }
        if (this.finalAnnualCharts) {
          let annualCharts = this.finalAnnualCharts;
          aFinalCharts = annualCharts[this.location.split("/")[1]]
            ? annualCharts[this.location.split("/")[1]][this.contName]
              ? annualCharts[this.location.split("/")[1]][this.contName][
                  "inputCharts"
                ]
                ? annualCharts[this.location.split("/")[1]][this.contName][
                    "inputCharts"
                  ]
                : []
              : []
            : [];
          aFinalCharts =
            typeof aFinalCharts == "string"
              ? decompress(JSON.parse(aFinalCharts))
              : aFinalCharts;
          this.aFinalInputData = aFinalCharts;

          dataM.saveChartColors(aFinalCharts, this.tabName);
        }
      }
    },
    /**
     * This function is to calculate commodities adjustment for output
     * Usage: ``
     */
    getOutComAdjustment(customCal) {
      let allMethodsAdjusted = { adjusted: {}, nonAdjusted: {} };
      if (customCal) {
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
          this.byPassRepoRate,
          this.contName
        );

        allMethodsAdjusted.adjusted = Object.assign(
          oSTMAdjusment.adjusted,
          this.newBaseLineUsers.adjusted
        );
        allMethodsAdjusted.nonAdjusted = Object.assign(
          oSTMAdjusment.nonAdjusted,
          this.newBaseLineUsers.nonAdjusted
        );
        this.generateIntermediateTable(
          "baseline",
          this.newBaseLineUsers.baseline,
          this.newBaseLineUsers.scalling
        );
      }
      if (!customCal) {
        allMethodsAdjusted = JSON.parse(JSON.stringify(this.finalDHIS2Obj));
      }

      this.AdjudtedValues = dataM.calculateNewAdjustedVals(
        allMethodsAdjusted.adjusted
      );

      let adjNonAdjData = dataM.getFinaladjNonAdjData(
        this.tabName,
        allMethodsAdjusted
      );

      this.generateAdjNonadjTable("adjusted", allMethodsAdjusted);
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
      if (this.getData) {
        this.getData(this.tabName, methodWiseAdjObject, "userT", this.filter);
      }
      if (this.getData) {
        this.getData(this.tabName, this.comparisionSlope, "slope", this.filter);
      }
      if (this.getData) {
        this.getData(this.tabName, userTrendsbyEmu, "output", this.filter);
      }
      //}
    },
    generateIntermediateTable(type, obj, scaling = null) {
      this.finalAdjNonAdjTableData[type] = {};
      this.finalAdjNonAdjTableData[type]["items"] = [];
      let fieldArray = [];
      this.finalAdjNonAdjTableData[type]["fields"] = [
        { key: "Method", label: this.$i18n.t("method") },
        { key: "Sub-method", label: this.$i18n.t("sub_method") },
      ];
      let mainObj = {};
      Object.keys(obj).forEach((method) => {
        mainObj[method.split("/")[0]] = {};
        Object.keys(obj[method]).forEach((year) => {
          Object.keys(obj[method][year]).forEach((subm) => {
            if (!mainObj[method.split("/")[0]][subm.split("/")[0]])
              mainObj[method.split("/")[0]][subm.split("/")[0]] = {};
            if (scaling) {
              mainObj[method.split("/")[0]][subm.split("/")[0]]["Scaling"] =
                scaling[subm] && scaling[subm]["scaling"]
                  ? scaling[subm]["scaling"]
                  : null;
              if (!fieldArray.includes("Scaling")) {
                fieldArray.push("Scaling");
                this.finalAdjNonAdjTableData[type]["fields"].push({
                  key: "Scaling",
                  label: this.$i18n.t("scalingFactor"),
                });
              }
            }
            let val = obj[method][year][subm];

            if (
              !this.finalAdjNonAdjTableData[type]["fields"].includes(
                " " + year + " "
              )
            )
              this.finalAdjNonAdjTableData[type]["fields"].push(
                " " + year + " "
              );
            mainObj[method.split("/")[0]][subm.split("/")[0]][year] = val;
          });
        });
      });
      Object.keys(mainObj).forEach((method) => {
        Object.keys(mainObj[method]).forEach((subm) => {
          let innobj = {};
          innobj["Method"] = method;
          innobj["Sub-method"] = subm;
          Object.keys(mainObj[method][subm]).forEach((year) => {
            let val = mainObj[method][subm][year];
            if (isNaN(year * 1)) {
              innobj[year] = val;
            }
          });
          Object.keys(mainObj[method][subm]).forEach((year) => {
            let val = mainObj[method][subm][year];
            if (!isNaN(year * 1)) {
              innobj[" " + year + " "] = val;
            }
          });
          this.finalAdjNonAdjTableData[type]["items"].push(innobj);
        });
      });
    },
    generateAdjNonadjTable(type, actObj) {
      this.finalAdjNonAdjTableData[type] = {};
      this.finalAdjNonAdjTableData[type]["items"] = [];
      let fieldArray = ["Method", "Sub-method"];
      this.finalAdjNonAdjTableData[type]["fields"] = [
        { key: "Method", label: this.$i18n.t("method") },
        { key: "Sub-method", label: this.$i18n.t("sub_method") },
      ];
      let mainObj = {};
      Object.keys(actObj).forEach((tp) => {
        let obj = actObj[tp];
        Object.keys(obj).forEach((method) => {
          if (!mainObj[method.split("/")[0]])
            mainObj[method.split("/")[0]] = {};
          Object.keys(obj[method]).forEach((year) => {
            Object.keys(obj[method][year]).forEach((subm) => {
              if (!mainObj[method.split("/")[0]][subm.split("/")[0]])
                mainObj[method.split("/")[0]][subm.split("/")[0]] = {};
              let val = obj[method][year][subm];
              if (!mainObj[method.split("/")[0]][subm.split("/")[0]][year])
                mainObj[method.split("/")[0]][subm.split("/")[0]][year] = {};
              let nTp = "";
              if (tp == "adjusted") nTp = this.$i18n.t("adjusted");
              else nTp = this.$i18n.t("unadjusted");
              mainObj[method.split("/")[0]][subm.split("/")[0]][year][
                nTp + "_" + year
              ] = val;
            });
          });
        });
      });
      Object.keys(mainObj).forEach((method) => {
        Object.keys(mainObj[method]).forEach((subm) => {
          let innobj = {};
          innobj["Method"] = method;
          innobj["Sub-method"] = subm;

          Object.keys(mainObj[method][subm]).forEach((yearA) => {
            Object.keys(mainObj[method][subm][yearA]).forEach((year) => {
              if (!fieldArray.includes(year)) {
                fieldArray.push(year);
                this.finalAdjNonAdjTableData[type]["fields"].push({
                  key: year,
                  lable: yearA,
                });
              }
              let val = mainObj[method][subm][yearA][year];
              innobj[year] = val;
            });
          });
          this.finalAdjNonAdjTableData[type]["items"].push(innobj);
        });
      });
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
            center: [450, 130],
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
    async allDataFetched() {
      if (this.globalConfig) {
        let customCal = this.emuSaveType === "Custom";
        await this.getFinalChartsdata(customCal);
        this.getOutComAdjustment(customCal);
        //this.bshowLoader = false;
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
    dhisDataFetched(val) {
      if (val) {
        this.bRequestFlag = true;
        //this.bshowLoader = false;
      }
    },
    bgData(newVal) {
      this.bgData = newVal;
      //this.bshowLoader = false;
      if (this.bRequestFlag) this.allDataFetched();
    },
    bRequestFlag(newVal) {
      if (
        (newVal && this.repoRate && this.byPassRepoRate == false) ||
        (newVal && this.byPassRepoRate == true)
      ) {
        this.allDataFetched();
      }
    },
    repoRate(newVal) {
      if (newVal && this.bRequestFlag) {
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
    filter(newVal) {
      this.$emit("changeFilter", newVal, this.tabName);
    },
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
      //this.bshowLoader = true;
      // if (this.emuSaveType === "Indicator_Calculator")
      // this.getSavedDataElemenet("onsignoff");
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
