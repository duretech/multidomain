<template>
  <div class="dqr dqr-main2 dqr-section">
    <div id="scrollTop">
      <div
        class="dqr-main pt-2"
        v-show="$store.getters.getActiveTab.includes('dqr-summary')"
      >
        <div class="summary-dqr-page" v-if="!reportChartData">
          <b-card class="overview-card mx-3 mt-3">
            <template #header class="pb-0 border-bottom-0">
              <h5 class="dqr-title mb-0 text-uppercase fs-19-1920">
                {{ $t("dqr") }} {{ selectedDate }}
              </h5>
            </template>
            <b-card-body class="dqr-card-body pt-0">
              <div class="dqr-border">
                <div class="d-flex justify-content-end mb-2">
                  <b-button
                    @click.prevent.stop="cancelScorecard"
                    class="mt-4 mb-2 ml-3"
                    v-if="scorecardDataFetching"
                  >
                    <span>{{ $t("cancelbtn") }}</span>
                  </b-button>
                  <b-button
                    v-if="!scorecardGenerated"
                    class="position-relative blue-btn mt-4 mb-2 mx-2"
                    @click.prevent.stop="generateScorePopup"
                  >
                    <span v-if="scorecardDataFetching">{{
                      `${locationFetchedPercent}%`
                    }}</span>
                    <div
                      class="loaderBackground"
                      v-if="scorecardDataFetching || scorecardsFetching"
                    ></div>
                    <span
                      :class="{
                        'ml-2': scorecardDataFetching,
                        'ml-4 pl-2': scorecardsFetching,
                      }"
                      >{{
                        scorecardDataFetching
                          ? $t("scorecardGenerating")
                          : scorecardsFetching
                          ? $t("scorecardFetch")
                          : $t("scorecardGenerate")
                      }}</span
                    >
                  </b-button>

                  <b-button
                    class="generate-btn blue-btn mt-4 mb-2"
                    @click.prevent.stop="viewScorecard"
                    v-else
                  >
                    <span>{{ $t("viewScorecard") }}</span>
                  </b-button>

                  <b-modal
                    v-model="generateScorecardPopup"
                    hide-footer
                    centered
                    size="sm"
                    :title="$t('location')"
                    no-close-on-backdrop
                  >
                    <div class="row">
                      <div class="col-12">
                        <treeselect
                          name="scorecardLocations"
                          :multiple="true"
                          :options="locationPeriod.locationList"
                          :limit="3"
                          :flat="true"
                          :default-expand-level="1"
                          v-model="selectedScorecardLocations"
                          sort-value-by="INDEX"
                          :placeholder="$t('select')"
                          :load-options="loadOptions"
                        />
                      </div>
                      <div class="col-12 mt-4">
                        <div class="text-right">
                          <b-button
                            small
                            @click.prevent.stop="generateScore"
                            class="ok-grey blue-btn"
                            :disabled="selectedScorecardLocations.length === 0"
                          >
                            <span class="small">{{ $t("ok") }}</span>
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </b-modal>
                  <b-modal
                    v-model="showScorecard"
                    hide-footer
                    centered
                    size="xl"
                    :title="$t('scorecard')"
                    no-close-on-backdrop
                    :ok-title="$t('ok')"
                    :cancel-title="$t('cancelbtn')"
                  >
                    <div class="row">
                      <div class="col-4">
                        <!-- <div
                          v-if="locationPeriod.locationName"
                          class="mr-4 small"
                        >
                          <strong>{{ $t("location") }}: </strong
                          ><strong>{{ locationPeriod.locationName }}</strong>
                        </div> -->
                        <div v-if="selectedDate" class="mr-4 small">
                          <strong>{{ $t("period") }}: </strong
                          ><strong>{{ selectedDate }}</strong>
                        </div>
                      </div>
                      <div class="col-8">
                        <div class="d-flex justify-content-end pb-3 text-right">
                          <div class="small w-50 select-dqr">
                            <treeselect
                              name="scorecardLocations"
                              :multiple="true"
                              :options="locationPeriod.locationList"
                              :limit="3"
                              :flat="true"
                              :default-expand-level="1"
                              v-model="selectedScorecardLocations"
                              sort-value-by="INDEX"
                              :placeholder="$t('select')"
                              :load-options="loadOptions"
                            />
                          </div>
                          <b-button
                            small
                            @click.prevent.stop="generateScore(true)"
                            class="position-relative mx-4 blue-btn"
                            :disabled="
                              selectedScorecardLocations.length === 0 ||
                              scorecardDataFetching
                            "
                          >
                            <span class="small">{{
                              $t("scorecardReGenerate")
                            }}</span>
                          </b-button>
                          <download-csv
                            class="align-items-center btn btn-secondary blue-btn d-flex justify-content-center"
                            :data="scorecardItemsDownload"
                          >
                            <span class="small">
                              <!-- <i class="fa fa-download mr-2"></i> -->
                              <span>
                                <img
                                  :src="
                                    require('@/assets/images/icons/downloadcsvActive.svg')
                                  "
                                  class="w-auto mx-1 mt-lg-n1"
                                />
                              </span>
                              <span class="mx-1"> {{ $t("csv") }} </span>
                            </span>
                          </download-csv>
                        </div>
                      </div>
                      <div class="col-3 offset-9">
                        <div class="text-right small pb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="inputScorecardSearch"
                            :placeholder="$t('search')"
                            v-model="scorecardSearch"
                          />
                        </div>
                      </div>
                      <div class="col-12">
                        <b-table
                          class="dqr-scoreboard"
                          head-variant="light"
                          responsive
                          sticky-header
                          bordered
                          hover
                          :items="scorecardItemsFiltered"
                          :fields="scorecardFields"
                          show-empty
                          :empty-text="$t('no_data_to_display')"
                        >
                          <template v-slot:cell(show_details)="row">
                            <b-form-checkbox
                              v-model="row.detailsShowing"
                              @change="row.toggleDetails"
                            >
                            </b-form-checkbox>
                          </template>
                          <template v-slot:row-details="row">
                            <b-card>
                              <b-table
                                head-variant="light"
                                responsive
                                hover
                                bordered
                                :items="row.item.scoreDetails"
                              ></b-table>
                            </b-card>
                          </template>
                        </b-table>
                      </div>
                    </div>
                  </b-modal>
                </div>
                <div>
                  <b-row>
                    <b-col cols="6">
                      <p class="quality-text fs-17-1920">
                        {{ $t("dqr1") }}
                        {{ selectedDate }})
                        {{ $t("dqr2") }}
                      </p>
                    </b-col>
                    <b-col cols="4">
                      <highcharts
                        :options="chartConfig"
                        style="height: 150px"
                      ></highcharts>
                    </b-col>
                    <b-col cols="2">
                      <div
                        class="align-items-center d-flex flex-column justify-content-center score"
                      >
                        <h4 class="scoretitle fs-25-1920">
                          {{ $t("dqrScore") }}
                        </h4>
                        <p class="totalscore fs-25-1920">
                          {{ qualityScore }}/{{ totalScores }}
                        </p>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="mb-sm-4 mt-4">
                <b-row>
                  <template v-if="scoreBox.length === 0">
                    <b-col sm="4" v-for="i in 3" :key="'dummy' + i">
                      <b-card class="inner-card">
                        <template #header class="inner-header pb-0">
                          <h6 class="mb-0 pl-1 fs-19-1920">
                            <b-skeleton></b-skeleton>
                          </h6>
                        </template>
                        <b-card-body class="inner-card-body p-3">
                          <b-skeleton class="mb-3"></b-skeleton>
                          <b-skeleton></b-skeleton>
                        </b-card-body>
                      </b-card>
                    </b-col>
                  </template>
                  <b-col
                    :sm="dynamicCols"
                    v-for="(menu, i) in scoreBox"
                    :key="'menu' + i"
                  >
                    <b-card class="inner-card">
                      <template #header class="inner-header pb-0">
                        <h6 class="mb-0 pl-1 fs-19-1920">
                          {{ menu.tabName }}
                        </h6>
                      </template>
                      <b-card-body
                        class="inner-card-body pl-0"
                        :style="{ height: getHeight + 'px' }"
                      >
                        <ul class="complete-list p-4 mb-0">
                          <li
                            class="pb-2"
                            v-for="(subMenu, j) in menu.subTabs"
                            :key="'subMenu' + i + j"
                          >
                            <div>
                              <i
                                class="fa fa-circle pr-2 cursor-pointer"
                                aria-hidden="true"
                                :class="[
                                  subMenu.scoreDetails.score === 0
                                    ? 'color-red'
                                    : subMenu.scoreDetails.score === 1
                                    ? 'color-green'
                                    : '',
                                ]"
                                v-b-popover.hover="{
                                  variant: 'info',
                                  content: subMenu.scoreDetails.errorMsg
                                    ? subMenu.scoreDetails.errorMsg
                                    : subMenu.scoreDetails.hoverText,
                                  title: subMenu.tabName,
                                  html: true,
                                }"
                                v-if="subMenu.scoreDetails"
                              ></i>
                              <b-spinner
                                class="mr-2"
                                small
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                            </div>
                            <div
                              class="fs-17-1920 cursor-pointer"
                              @click="
                                $store.commit('setActiveTab', subMenu.navLink)
                              "
                            >
                              {{ subMenu.tabName }}
                            </div>
                          </li>
                        </ul>
                      </b-card-body>
                    </b-card>
                  </b-col>
                  <b-col sm="12" class="pt-4 analytic">
                    <b-card class="inner-card">
                      <template #header class="inner-header">
                        <h6 class="mb-0 pl-1 fs-19-1920 text-center">
                          {{ $t("eConsistency") }}
                        </h6>
                      </template>
                      <div class="inner-card-body py-3">
                        <FPExternal
                          :dqrResponse="dqrResponse"
                          :preFetchData="preFetchData"
                          :locationPeriod="locationPeriod"
                          v-if="
                            $store.getters.getNamespace.includes(
                              '_fp-dashboard'
                            )
                          "
                        ></FPExternal>
                        <div class="text-center" v-else>
                          {{ $t("no_data_to_display") }}
                        </div>
                      </div>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
            </b-card-body>
          </b-card>
          <b-card class="sign-off-card mx-3 mb-5 pb-5">
            <template #header class="sign-off-header border-bottom-0">
              <h5 class="dqr-title mb-0 text-uppercase fs-19-1920">
                {{ $t("data_sign_off") }}
              </h5>
            </template>
            <b-card-body class="sign-off-card-body p-0">
              <b-row>
                <b-col sm="12" lg="6">
                  <b-card class="level-card">
                    <!-- <b-card-body> -->
                    <div class="dsl fs-17-1920">
                      <label>{{ $t("dsl") }}</label>
                      <div>
                        <div id="range"></div>
                        <div class="rangeSlider">
                          <SignOffDSL :dsl="dsl" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        class="align-items-center d-flex justify-content-end"
                      >
                        <b-button
                          size="sm"
                          @click="showCountTable = !showCountTable"
                          id="tooltip-target-count"
                          class="count bg-transparent rounded-0 border-left-0 border-right-0 border-top-0 fs-17-1920"
                        >
                          <i
                            aria-hidden="true"
                            class="fa mr-2 fs-17-1920"
                            :class="[
                              showCountTable ? 'fa-eye-slash' : 'fa-eye',
                            ]"
                          ></i>
                          {{ $t("countDetails") }}
                        </b-button>
                        <b-tooltip
                          class="fs-17-1920"
                          target="tooltip-target-count"
                          triggers="hover"
                        >
                          {{ $t("countDetails_hover") }}
                        </b-tooltip>
                      </div>
                      <transition name="slide-fade">
                        <div
                          class="mt-3 table-responsive"
                          v-if="showCountTable"
                          style="font-size: 0.7rem"
                        >
                          <table class="table table-bordered dqr-table">
                            <thead class="thead-light">
                              <tr>
                                <th
                                  :colspan="Object.keys(value).length"
                                  v-for="(value, name, i) in countDistribution"
                                  :key="'name' + i"
                                  class="dqr-tablehead"
                                >
                                  {{ name }}
                                </th>
                              </tr>
                              <tr>
                                <template
                                  v-for="(value, name, i) in countDistribution"
                                >
                                  <th
                                    v-for="(vInner, nInner, j) in value"
                                    :key="'name' + i + j"
                                  >
                                    {{ nInner }}
                                  </th>
                                </template>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <template
                                  v-for="(value, name, i) in countDistribution"
                                >
                                  <th
                                    v-for="(vInner, nInner, j) in value"
                                    :key="'name' + j + i"
                                  >
                                    <template v-if="vInner.length > 0">
                                      <i
                                        class="fa fa-user mr-2 cursor-pointer"
                                        v-b-tooltip.hover
                                        :title="
                                          dot.title + ' (' + dot.count + ')'
                                        "
                                        v-for="(dot, k) in vInner"
                                        :key="'name' + j + i + k"
                                        :style="{
                                          color: dot.color,
                                        }"
                                        :class="dot.color"
                                        ><span class="ml-1">{{
                                          dot.count
                                        }}</span></i
                                      >
                                    </template>
                                    <template v-else>
                                      <i
                                        class="fa fa-user mr-2 cursor-pointer"
                                        v-b-tooltip.hover
                                        :title="$t('no_forms')"
                                        ><span class="ml-1">0</span></i
                                      >
                                    </template>
                                  </th>
                                </template>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </transition>
                    </div>
                    <div class="mt-2 dqr-greyvue">
                      <b-row>
                        <b-col cols="6">
                          <treeselect
                            :multiple="true"
                            :options="userList"
                            value-consists-of="LEAF_PRIORITY"
                            :default-expand-level="1"
                            :limit="1"
                            :zIndex="999999"
                            v-model="userSelected"
                            :placeholder="$t('pickUser')"
                          />
                        </b-col>
                        <b-col cols="6" class="select-vue">
                          <treeselect
                            :multiple="true"
                            :openDirection="'bottom'"
                            :options="tabList"
                            value-consists-of="LEAF_PRIORITY"
                            :default-expand-level="1"
                            :limit="1"
                            :zIndex="998"
                            v-model="tabSelected"
                            :placeholder="$t('pickCategory')"
                          />
                        </b-col>
                        <b-col
                          sm="12"
                          class="mt-1 text-right small"
                          :style="{
                            opacity:
                              userSelected.length || tabSelected.length
                                ? '1'
                                : '0.5',
                            cursor:
                              userSelected.length || tabSelected.length
                                ? 'pointer'
                                : 'default',
                          }"
                        >
                          <i class="fa fa-refresh mr-1" aria-hidden="true"></i>
                          <u
                            class="resetcolr"
                            @click="
                              userSelected = [];
                              tabSelected = [];
                            "
                            >{{ $t("resetbtn") }}</u
                          >
                        </b-col>
                      </b-row>
                    </div>
                    <div
                      class="signoff-modal-body list-of-cards question_view mt-3"
                    >
                      <AllSignOffForms
                        :viewOpt="true"
                        :editOpt="false"
                        :deleteOpt="false"
                        :userDetails="userDetails"
                        :responseForms="signOffForms"
                        @updateSignOffForm="updateSignOffForm"
                      />
                    </div>
                    <!-- </b-card-body> -->
                  </b-card>
                </b-col>
                <b-col sm="12" lg="6">
                  <b-card class="sign-questions">
                    <!-- <b-card-body> -->
                    <div
                      class="signoff-modal-header"
                      v-if="tabName && formUser && formDate && formLocation"
                    >
                      <SignOffHeader
                        :showForms="false"
                        :tabName="tabName"
                        :isViewForms="false"
                        :formColor="formColor"
                        :userDetails="formUser"
                        :selectedDate="formDate"
                        :locationName="formLocation"
                      />
                    </div>
                    <div class="list-of-questions">
                      <SignOffForm
                        :isViewForm="true"
                        :hideRefresh="true"
                        :signOffForm="signOffForm"
                      />
                    </div>
                    <!-- </b-card-body> -->
                  </b-card>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </div>
      </div>
      <!-- class="dqr-main pt-4" -->
      <div
        class="pt-4 mt-1"
        v-show="!$store.getters.getActiveTab.includes('dqr-summary')"
      >
        <div
          :style="{
            visibility:
              $store.getters.getActiveTab.includes('emuMonthlyTab') ||
              $store.getters.getActiveTab.includes('emuAnnualTab')
                ? 'hidden'
                : 'visible',
          }"
        >
          <SignOff
            :configData="configData"
            :userDetails="userDetails"
            :signOffData="signOffData"
            :selectedDate="selectedDate"
            :locationName="locationPeriod.locationName"
            @updatedConfig="updatedConfig"
            :locationPeriod="locationPeriod"
            v-if="
              ($store.getters.getIsAdmin ||
                this.$store.getters.getAppSettings.bypassUser ||
                $store.getters.getUserPermissions.canSignOff) &&
              !reportChartData
            "
          />
        </div>
        <b-container class="dqr-charts p-0 m-0">
          <template v-if="configData && isChildFetched">
            <div
              v-for="(subTab, i) in configData.subTabs"
              :key="subTab.group + i"
            >
              <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
                <TabSummary
                  :content="subTab.categoryInfo[$i18n.locale]"
                  :contKey="subTab.group + subTab.id"
                />
                <div
                  v-for="chartData in subTab.chartSetting"
                  :key="configData.id + subTab.id + chartData.chartOptions.cid"
                >
                  <template v-if="!chartData.chartOptions.disable">
                    <ChartComponent
                      :subTab="subTab"
                      :childArr="childArr"
                      :chartData="chartData"
                      @setExtData="setExtData"
                      :allExtData="allExtData"
                      @summaryData="summaryData"
                      @setReportChart="setReportChart"
                      :locationPeriod="locationPeriod"
                      :reportChartData="reportChartData"
                      :scorecardLocation="scorecardLocation"
                      :backgroundData="subTab.backgroundData"
                    />
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="
              !(configData && isChildFetched) &&
              !['emuMonthlyTab', 'emuAnnualTab'].includes(
                $store.getters.getActiveTab
              )
            "
          >
            <HighChartComponent :chartData="placeholderObj" />
          </template>
          <div
            v-if="
              $store.getters.getActiveTab.includes('emuMonthlyTab') &&
              dqrResponse
            "
          >
            <!-- @sendScore="score" -->
            <benchmarkMonthlyTab
              ref="emu"
              :locationVal="locationPeriod.location"
              :userDetails="userDetails"
              :dqrResponse="dqrResponse"
              :appResponse="appResponse"
              :globalResponse="globalResponse"
              :dhsColor="dhsColor"
              :totalEMUColor="emuColor"
              @methodFilter="methodFilterVal"
              :method="methodSelected"
              :debugging="debugging"
              :debuggingLevel="debuggingLevel"
              :tabName="$t('emu_monthly')"
            />
          </div>
          <div
            v-if="
              $store.getters.getActiveTab.includes('emuAnnualTab') &&
              dqrResponse
            "
          >
            <annual-tab
              :locationVal="locationPeriod.location"
              :userDetails="userDetails"
              :dqrResponse="dqrResponse"
              :appResponse="appResponse"
              :globalResponse="globalResponse"
              @yearFilter="yearVal"
              :debugging="debugging"
              :debuggingLevel="debuggingLevel"
              :tabName="$t('emu_annual')"
            />
          </div>
        </b-container>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import {
  getOrg,
  getChild,
  getParent,
  excludeName,
  translateDate,
  formatSingleDate,
} from "@/components/Common/commonFunctions";
import SignOff from "@/components/DQR/SignOff";
import Treeselect from "@riophae/vue-treeselect";
import {
  commonChartConfig,
  summaryChartConfig,
} from "@/config/basicChartConfig";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SignOffMixin from "@/helpers/SignOffMixin";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import StaticColorMixin from "@/helpers/StaticColorMixin";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
export default {
  props: [
    "sideMenu",
    "dqrResponse",
    "selectedData",
    "preFetchData",
    "locationPeriod",
    "reportChartData",
  ],
  mixins: [
    SignOffMixin,
    ScrollPageMixin,
    DynamicImageMixin,
    StaticColorMixin,
    loadLocChildMixin,
  ],
  components: {
    SignOff,
    Treeselect,
    ChartComponent: () =>
      import(
        /* webpackChunkName: "Dynamic_Common_ChartComponent"*/ "@/components/Analytical/ChartComponent"
      ),
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
    benchmarkMonthlyTab: () =>
      import(
        /* webpackChunkName: "dqr_emuMonthly"*/ "@/components/FPDashboard/dqr/monthly/benchmarkTab"
      ),
    annualTab: () =>
      import(
        /* webpackChunkName: "dqr_emuAnnual"*/ "@/components/FPDashboard/dqr/emuAnnual/benchmarkTab"
      ),
    FPExternal: () =>
      import(
        /* webpackChunkName: "dqr_FPExternal"*/ "@/components/DQR/FPExternal"
      ),
  },
  data() {
    return {
      scores: [],
      childArr: [],
      userList: [],
      allExtData: {},
      tabSelected: [],
      userSelected: [],
      userDetails: null,
      locationScores: [],
      scorecardItems: [],
      scorecardSearch: "",
      scorecardData: null,
      scorecardFields: [],
      scorecardDetails: [],
      showScorecard: false,
      showCountTable: false,
      scorecardLocation: "",
      isChildFetched: false,
      currentScorecard: [],
      isScorecardCancel: false,
      scorecardsFetching: false,
      scorecardGenerated: false,
      scorecardItemsDownload: [],
      scorecardDataFetching: false,
      configData: this.selectedData,
      generateScorecardPopup: false,
      selectedScorecardLocations: [],
      placeholderObj: commonChartConfig,
      chartConfig: JSON.parse(JSON.stringify(summaryChartConfig)),

      //Used for EMU setions
      appResponse: null,
      globalResponse: null,
      methodSelected: "",
      debugging: false,
      debuggingLevel: "API",
    };
  },
  computed: {
    dhsColor() {
      return this.staticColors["dhsColor"];
    },
    emuColor() {
      return this.staticColors["emuColor"];
    },
    dynamicCols() {
      let cols =
        this.scoreBox.length === 3 ? 4 : this.scoreBox.length === 2 ? 6 : 12;
      return cols;
    },
    getHeight() {
      let h = 106;
      if (this.scoreBox.length) {
        let el = document.getElementsByClassName("complete-list");
        for (let i = 0; i < el.length; i++) {
          let ht = el[i].clientHeight;
          h = ht > h ? ht : h;
        }
      }
      return h;
    },
    scorecardItemsFiltered: function () {
      let filteredData = this.scorecardItems.length
        ? this.scorecardItems.filter((s) =>
            s[this.$i18n.t("location")]
              .toLowerCase()
              .includes(this.scorecardSearch.toLowerCase())
          )
        : [];
      return filteredData;
    },
    tabList() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let tabs = tab ? tab.subTabs : [];
      let tabList = [];
      if (tabs.length) {
        tabs.forEach((c) => {
          let obj = {
            id: c.tabName,
            label: c.tabName,
            children: [],
          };
          c.subTabs.forEach((s) => {
            obj.children.push({
              id: `${activeTab.split("-")[0]}-${activeTab.split("-")[1]}-${
                c.id
              }-${s.id}`,
              label: s.tabName,
            });
          });
          tabList.push(obj);
        });
      }
      return tabList;
    },
    countDistribution() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let tabs = tab ? tab.subTabs : [];
      let count = {};
      if (tabs.length) {
        tabs.forEach((c) => {
          count[c.tabName] = {};
          c.subTabs.forEach((s) => {
            count[c.tabName][s.tabName] = [];
            let data = this.signOffForms.filter(
              (t) =>
                t.signOffTab ===
                `${activeTab.split("-")[0]}-${activeTab.split("-")[1]}-${
                  c.id
                }-${s.id}`
            );
            if (data.length) {
              data.forEach((d) => {
                let t = d.iconColorClass.split("-")[0];
                let dotDetails = {
                  title: this.$i18n.t(`${t}`),
                  color: d.iconColorClass,
                  count: 1,
                };
                let catDetails = count[c.tabName][s.tabName];

                let foundIndex = catDetails.findIndex((c) => c.title === t);
                if (foundIndex >= 0) {
                  let updatedDotDetails = {
                    ...catDetails[foundIndex],
                    count: catDetails[foundIndex].count * 1 + 1,
                  };
                  catDetails[foundIndex] = updatedDotDetails;
                } else {
                  catDetails.push(dotDetails);
                }
              });
            }
          });
        });
      }
      return count;
    },
    scoreBox() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let box = tab ? tab.subTabs : [];
      if (box.length) {
        box = box.map((b) => ({
          ...b,
          subTabs: b.subTabs
            .filter((st) => st.isSummary)
            .map((st) => {
              let isFound = this.scores.findIndex((s) => s.id === st.id);
              st.navLink = `${tab.group}-${tab.id}-${b.id}-${st.id}`;
              if (isFound >= 0) {
                st = {
                  ...st,
                  scoreDetails: this.scores[isFound],
                };
              }
              return st;
            }),
        }));
      }
      return box;
    },
    scoreTabID() {
      let ids = [];
      this.scoreBox.forEach((s) => {
        s.subTabs.forEach((s) => {
          ids.push({ id: s.id, tabName: s.tabName });
        });
      });
      return ids;
    },
    selectedDate() {
      return translateDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
        monthlyFormat: "MMM YYYY",
      });
    },
    qualityScore() {
      let score = 0;
      this.scores.forEach((s) => {
        if (s.score === 1) {
          score++;
        }
      });
      return score;
    },
    totalScores() {
      let score = 0;
      this.scoreBox.forEach((s) => {
        score = score + s.subTabs.length;
      });
      return score;
    },
    locationFetchedPercent() {
      let per = 0;
      if (
        this.scorecardDetails.length > 0 &&
        this.selectedScorecardLocations.length >= 0
      ) {
        per = Math.round(
          (this.scorecardDetails.length /
            this.selectedScorecardLocations.length) *
            100
        );
      }
      return per;
    },
    signOffData() {
      let id = this.$store.getters.getActiveTab.split("-");
      let data =
        this.configData &&
        this.configData.subTabs &&
        this.configData.subTabs.length
          ? this.configData.subTabs.find((c) => c.id === id[3])
          : null;
      return data ? JSON.parse(JSON.stringify(data)) : {};
    },
    signOffForms() {
      let forms = [];
      if (this.configData) {
        this.configData.subTabs.forEach((f) => {
          let tabs = this.tabSelected.length
            ? f.signOff.filter((t) => this.tabSelected.includes(t.signOffTab))
            : f.signOff;
          tabs = this.userSelected.length
            ? tabs.filter((u) => this.userSelected.includes(u.userDetails.id))
            : tabs;
          forms = forms.concat(tabs);
        });
      }
      return forms;
    },
  },
  watch: {
    totalScores(newValue) {
      this.chartConfig.yAxis.max = newValue;
      this.chartConfig.yAxis.tickPositioner = function () {
        return [this.min, this.max];
      };
    },
    qualityScore(newValue) {
      this.chartConfig.series[0].data[0].y = newValue;
    },
    signOffForms: {
      handler(newValue) {
        this.dsl = this.dsl.map((d) => ({
          ...d,
          count: null,
        }));
        this.signOffForm = [];
        this.updateForm = null;
        if (newValue.length) {
          let form = newValue[0];
          this.signOffForm = form.signOffForm;
          this.updateForm = JSON.parse(JSON.stringify(form));
          this.dsl = this.dsl.map((d) => {
            let count = 0;
            newValue.forEach((n) => {
              if (n.iconColorClass === `${d.class}-text`) {
                count++;
              }
            });
            return {
              ...d,
              count: count > 0 ? count : null,
            };
          });
          newValue.forEach((s) => {
            let newUser = this.userList.find((u) => u.id === s.userDetails.id);
            if (!newUser) {
              this.userList.push({
                label: `${s.userDetails.firstName} ${s.userDetails.surname}`,
                id: s.userDetails.id,
              });
            }
          });
        }
      },
      deep: true,
    },
    selectedData: {
      handler(newValue) {
        this.scores = [];
        this.configData = newValue;
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
          this.scores = [];
          if (this.$store.getters.getActiveTab && !this.reportChartData) {
            this.getScorecard();
          }
          this.isChildFetched = false;
          this.setScorecardLocations();
        }
      },
      deep: true,
    },
    async locationScores(newValue) {
      if (newValue.length === this.totalScores && !this.isScorecardCancel) {
        let periodValue = formatSingleDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
        });
        let scorecardCreatedOn = this.$moment().format("L");
        let isFound = this.scorecardDetails.findIndex(
          (s) => s.id === this.scorecardLocation && s.period === periodValue
        );
        let locName = await this.getLocation(
          this.scorecardLocation.split("/")[1]
        );
        let parent = getParent({
          locationList: this.locationPeriod.locationList,
          location: this.scorecardLocation.split("/")[1],
        });
        let obj = {
          parent,
          name: locName,
          period: periodValue,
          id: this.scorecardLocation,
          createdOn: scorecardCreatedOn,
          score: JSON.parse(JSON.stringify(newValue)),
        };
        if (isFound >= 0) {
          this.scorecardDetails[isFound] = obj;
        } else {
          this.scorecardDetails.push(obj);
        }

        this.locationScores = [];
        let locIndex = this.scorecardDetails.length;
        if (
          locIndex < this.selectedScorecardLocations.length &&
          this.selectedScorecardLocations.length > 0
        ) {
          this.scorecardLocation = this.selectedScorecardLocations[locIndex];
        }
        if (
          locIndex === this.selectedScorecardLocations.length &&
          this.selectedScorecardLocations.length > 0
        ) {
          this.updateScorecard(periodValue);
        }
      }
    },
    "$store.getters.getActiveTab": function () {
      if (this.$store.getters.getActiveTab && !this.reportChartData) {
        this.getScorecard();
      }
    },
  },
  methods: {
    setExtData(level, obj) {
      this.allExtData[level] = obj;
    },
    async getLocation(location) {
      let locName = "";
      let loc = getOrg({
        locationList: this.locationPeriod.locationList,
        location: location,
      });
      if (loc) {
        locName = loc;
      } else {
        try {
          let orgData = await service.getIndividualOrganisation(location);
          locName = orgData.data?.displayName || "";
        } catch (err) {
          console.log("Error in fetching location...");
        }
      }
      return locName;
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
    updateSignOffForm({ form }) {
      this.signOffForm = form.signOffForm;
      this.updateForm = JSON.parse(JSON.stringify(form));
    },
    updatedConfig(configData) {
      this.$emit("updatedConfig", configData);
    },
    updateScorecard(periodValue) {
      let key = this.generateKey("dqrScorecard");
      service
        .getSavedConfig(key)
        .then((res) => {
          let scorecardData = res.data;
          if (!scorecardData[this.$store.getters.getActiveTab.split("-")[0]]) {
            scorecardData[this.$store.getters.getActiveTab.split("-")[0]] = [];
          }
          this.scorecardDetails.forEach((sd) => {
            let isFound = scorecardData[
              this.$store.getters.getActiveTab.split("-")[0]
            ].findIndex((s) => s.id === sd.id && s.period === sd.period);
            if (isFound >= 0) {
              scorecardData[this.$store.getters.getActiveTab.split("-")[0]][
                isFound
              ] = sd;
            } else {
              scorecardData[
                this.$store.getters.getActiveTab.split("-")[0]
              ].push(sd);
            }
          });
          let response = service.updateConfig(scorecardData, key);
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.currentScorecard = scorecardData[
                  this.$store.getters.getActiveTab.split("-")[0]
                ].filter((s) => s.period === periodValue);
                this.setScorecard();
                this.resetBackgroundSetting("update", true);
                this.selectedScorecardLocations = [];
              } else {
                console.log("Scorecard Saving Failed!");
                return;
              }
            })
            .catch(() => {
              console.log("Scorecard Saving Failed!");
            });
        })
        .catch(() => {
          let scorecardData = {
            [this.$store.getters.getActiveTab.split("-")[0]]:
              this.scorecardDetails,
          };
          let response = service.saveConfig(scorecardData, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.currentScorecard = this.scorecardDetails.filter(
                (s) => s.period === periodValue
              );
              this.setScorecard();
              this.resetBackgroundSetting("update", true);
              this.selectedScorecardLocations = [];
            } else {
              console.log("Scorecard Saving Failed!");
              return;
            }
          });
        });
    },
    generateTable(scorecardDetails) {
      this.scorecardFields = [];
      this.scorecardItems = [];
      this.scorecardItemsDownload = [];
      this.scorecardFields = [
        {
          key: this.$i18n.t("location"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("parent"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("dqrScore"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("scorecardGeneratedOn"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: "show_details",
          label: this.$i18n.t("viewMore"),
        },
      ];
      scorecardDetails.forEach((s) => {
        let innerItem = {
            [this.$i18n.t("location")]: excludeName(s.name),
            [this.$i18n.t("parent")]: excludeName(s.parent?.name || "-"),
            scoreDetails: [],
            _cellVariants: {},
          },
          innerItemDownload = {
            [this.$i18n.t("group")]:
              this.$store.getters.getActiveTab.split("-")[0],
            [this.$i18n.t("location")]: excludeName(s.name),
            [this.$i18n.t("parent")]: excludeName(s.parent?.name || "-"),
          };
        let positiveScore = 0,
          totalScore = 0,
          sDetails = {};
        this.scoreTabID.forEach((tab) => {
          let isTab = s.score.find((t) => t.id === tab.id);
          if (isTab) {
            let innerScore = isTab.score;
            let keyName = tab.tabName;
            totalScore += 1;
            if (innerScore) {
              sDetails[keyName] = 1;
              innerItemDownload[keyName] = 1;
              sDetails["_cellVariants"] = {
                ...sDetails["_cellVariants"],
                [keyName]: "success",
              };
              positiveScore += 1;
            } else {
              sDetails[keyName] = 0;
              innerItemDownload[keyName] = 0;
              sDetails["_cellVariants"] = {
                ...sDetails["_cellVariants"],
                [keyName]: "danger",
              };
            }
          }
        });

        innerItem.scoreDetails.push(sDetails);
        innerItem[this.$i18n.t("dqrScore")] = `${positiveScore}/${totalScore}`;
        innerItem[this.$i18n.t("scorecardGeneratedOn")] = this.$moment(
          s.createdOn
        ).format("ll");
        innerItemDownload[
          this.$i18n.t("dqrScore")
        ] = `${positiveScore} ${this.$i18n.t("outOf")} ${totalScore}`;
        innerItemDownload[this.$i18n.t("scorecardGeneratedOn")] = this.$moment(
          s.createdOn
        ).format("ll");
        this.scorecardItems.push(innerItem);
        this.scorecardItems.sort((a, b) => {
          var textA = a[this.$i18n.t("parent")].toUpperCase();
          var textB = b[this.$i18n.t("parent")].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        this.scorecardItemsDownload.push(innerItemDownload);
        this.scorecardItemsDownload.sort((a, b) => {
          var textA = a[this.$i18n.t("parent")].toUpperCase();
          var textB = b[this.$i18n.t("parent")].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      });
    },
    getScorecard() {
      this.scorecardGenerated = false;
      let periodValue = formatSingleDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      let group = this.$store.getters.getActiveTab.split("-")[0];
      if (
        this.scorecardData &&
        this.scorecardData[group] &&
        this.scorecardData[group].length
      ) {
        this.currentScorecard = this.scorecardData[group].filter(
          (s) => s.period === periodValue
        );
        this.setScorecard();
      } else {
        this.scorecardsFetching = true;
        let key = this.generateKey("dqrScorecard");
        service
          .getSavedConfig(key)
          .then((res) => {
            this.scorecardData = res.data;
            this.scorecardsFetching = false;
            if (
              this.scorecardData &&
              this.scorecardData[group] &&
              this.scorecardData[group].length
            ) {
              this.currentScorecard = this.scorecardData[group].filter(
                (s) => s.period === periodValue
              );
              this.setScorecard();
            } else {
              this.currentScorecard = [];
            }
          })
          .catch(() => {
            this.currentScorecard = [];
            this.scorecardsFetching = false;
            console.log("Scorecard Not Found!");
          });
      }
    },
    setScorecard() {
      if (this.currentScorecard.length) {
        this.scorecardGenerated = true;
        this.generateTable(this.currentScorecard);
      }
    },
    summaryData(data) {
      let scoreKey = data.scorecardLocation ? "locationScores" : "scores";
      let isFound = this[scoreKey].findIndex((s) => s.id === data.id);
      if (isFound >= 0) {
        this[scoreKey][isFound] = data;
      } else {
        this[scoreKey].push(data);
      }
    },
    async setScorecardLocations() {
      let children = [];
      if (this.preFetchData?.orgList?.length) {
        children = getChild({
          locationList: this.preFetchData.orgList,
          location: this.locationPeriod.location.split("/")[1],
        });
        children = children.map((c) => {
          return {
            ...c,
            id: `${c.level}/${c.id}`,
          };
        });
      } else {
        try {
          let response = await service.getChildOrganisation(
            this.locationPeriod.location.split("/")[1]
          );
          children = response?.data?.children || [];
        } catch (err) {
          console.log("err", err);
        }
      }
      if (children.length) {
        this.childArr = children;
        this.isChildFetched = true;
      } else {
        this.childArr = [];
        this.isChildFetched = true;
      }
    },
    generateScorePopup() {
      if (!this.scorecardDataFetching) {
        this.selectedScorecardLocations = [];
        this.generateScorecardPopup = true;
      }
    },
    async generateScore(isReset = false) {
      this.showScorecard = false;
      this.isScorecardCancel = false;
      this.scorecardDataFetching = true;
      this.generateScorecardPopup = false;
      let locIndex = this.scorecardDetails.length;
      if (
        locIndex < this.selectedScorecardLocations.length &&
        this.selectedScorecardLocations.length > 0
      ) {
        this.scorecardLocation = this.selectedScorecardLocations[locIndex];
        if (isReset) {
          this.resetBackgroundSetting("regenerate");
        }
      } else {
        if (isReset) {
          this.resetBackgroundSetting("noLocationReset");
        } else {
          this.resetBackgroundSetting("noLocation");
        }
        if (this.selectedScorecardLocations.length === 0) {
          this.sweetAlert({
            title: this.$i18n.t("oops"),
            text: this.$i18n.t("errorInfo"),
          });
        }
      }
    },
    resetBackgroundSetting(type, scorecardGenerated = false) {
      if (
        type === "cancel" ||
        type === "filterChange" ||
        type === "noLocation" ||
        type === "noLocationReset" ||
        type === "update"
      ) {
        this.locationScores = [];
        this.scorecardDetails = [];
        this.scorecardLocation = "";
        this.scorecardDataFetching = false;
      }
      if (
        type === "cancel" ||
        type === "regenerate" ||
        type === "filterChange" ||
        type === "noLocation"
      ) {
        this.showScorecard = false;
        this.isScorecardCancel = false;
        this.scorecardGenerated = scorecardGenerated;
        if (!scorecardGenerated) {
          this.scorecardDetails = [];
          this.scorecardItems = [];
          this.scorecardFields = [];
        }
      }
    },
    cancelScorecard() {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("ok"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.isScorecardCancel = true;
          this.selectedScorecardLocations = [];
          this.resetBackgroundSetting("cancel");
          this.setScorecard();
        }
      });
    },
    viewScorecard() {
      this.showScorecard = true;
      this.scorecardSearch = "";
      this.selectedScorecardLocations = [];
    },
    methodFilterVal() {},
    yearVal() {},
  },
  created() {
    this.userDetails = this.$store.getters.getUserDetails;
    this.appResponse = this.$store.getters.getApplicationModule(
      this.$store.getters.getIsMultiProgram
    );
    this.globalResponse = this.$store.getters.getGlobalFactors();
    this.debugging = this.appResponse.debugging
      ? this.appResponse.debugging
      : false;
    this.debuggingLevel = this.appResponse.debuggingLevel
      ? this.appResponse.debuggingLevel
      : "API";
  },
};
</script>

<style lang="scss" scoped>
.loaderBackground {
  position: absolute;
  top: 2px;
  left: 7px;
  border: 16px solid rgba(255, 255, 255, 0.2); /* Light grey */
  border-top: 16px solid rgba(255, 255, 255, 0.53); /* Blue */
  border-radius: 50%;
  width: 10px;
  height: 10px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
