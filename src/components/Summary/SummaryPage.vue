<template>
  <div class="summary-page-container" id="scrollTop">
    <div
      class="mt-4 mr-0 p-4 summary-page"
      v-show="$store.getters.getActiveTab === 'sd-summary'"
    >
      <div class="pb-4 summary-title fs-17-1920">
        This section is designed to highlight priority indicators that show how
        the MCH program is performing. Indicators are compared to the prior
        month to show whether there has been
        <span class="green fs-17-1920"> positive growth (of +5% or more)</span>,
        <span class="red fs-17-1920">declines (-5% or more)</span>, or
        <span class="orange fs-17-1920">limited change (+/- 5%)</span>.
        Understanding what indicators are changing can help point to areas of
        strong performance as well as areas that need greater attention. Select
        the indicators below to see more details on their performance at a
        national and subnational level and over time
      </div>
      <div class="mb-4">
        <b-row>
          <b-col
            sm="6"
            :class="{
              'col-lg-12': $store.state.defaultViewType === 'wide',
            }"
            v-for="summary in summaryList"
            :key="summary.id"
          >
            <b-card class="mb-4 summary-card-bg" v-if="summary.summaryDetails">
              <div class="mb-2">
                <b-row>
                  <b-col sm="2">
                    <div
                      class="summary-dot"
                      :class="summary.summaryDetails[0].colorLastMn"
                    >
                      <p class="mb-0 fs-25-1920">
                        {{ summary.summaryDetails[0].currValue }}
                      </p>
                    </div></b-col
                  >
                  <b-col sm="10" class="pl-5 pt-2">
                    <b-row>
                      <b-col sm="8">
                        <div class="fs-17-1920">{{ summary.tabName }}</div>
                      </b-col>
                      <b-col sm="4" class="view-more-btn">
                        <b-button
                          class="summary-view-more-btn fs-17-1920 btn-sm"
                          @click="viewMore(summary)"
                          >{{ $t("viewMore") }}</b-button
                        >
                      </b-col>
                      <b-col sm="12" class="pt-2">
                        <div class="from-last-year fs-14-1920">
                          % change from
                          {{ summary.summaryDetails[0].prevForDate }}
                          <span class="float-right">{{
                            summary.summaryDetails[0].change === null
                              ? "NA"
                              : summary.summaryDetails[0].change
                          }}</span>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </div>
              <div
                class="fs-17-1920 emu-read"
                :class="{ 'emu-status ': showMore !== summary.id }"
                style="min-height: 36px"
                v-html="getSummaryText(summary.summaryDetails[0].summaryText)"
              ></div>
              <div
                data-html2canvas-ignore="true"
                class="text-right"
                :style="{
                  visibility:
                    summary.summaryDetails[0].summaryText.length === 0
                      ? 'hidden'
                      : '',
                }"
              >
                <b-button
                  class="readMoreBtn btn-sm"
                  @click="showMoreText(summary.id)"
                >
                  {{
                    showMore === summary.id ? "Read Less" : "Read More"
                  }}</b-button
                >
              </div>
              <div class="p-2 mt-3 performance-in-card fs-17-1920">
                <span>
                  Performance against benchmark
                  {{
                    summary.summaryDetails[0].benchmarkValue
                      ? `(${summary.summaryDetails[0].benchmarkValue})`
                      : ""
                  }}</span
                >
                <div class="fs-17-1920 na px-3">
                  <template
                    v-if="
                      summary.summaryDetails[0].performanceBenchmarking ===
                      'N/A'
                    "
                  >
                    {{ summary.summaryDetails[0].performanceBenchmarking }}
                  </template>
                  <img
                    v-else
                    alt="s_icon"
                    class="equalTosign"
                    :src="
                      require(`@/assets/img/ministerialSummaryIcon/${getIcon(
                        summary.summaryDetails[0].performanceBenchmarking
                      )}`)
                    "
                  />
                </div>
              </div>
            </b-card>
            <template v-else>
              <b-overlay
                :show="summary.errorMsg && summary.errorMsg !== ''"
                :rounded="true"
              >
                <template #overlay>
                  <div class="text-center">
                    <p class="color-black">{{ summary.errorMsg }}</p>
                  </div>
                </template>
                <Placeholder :animation="summary.errorMsg ? 'none' : 'wave'" />
              </b-overlay>
            </template>
          </b-col>
        </b-row>
      </div>
    </div>
    <ViewMorePopup
      v-if="visible"
      @getGeoJson="getGeoJson"
      :allGeoJson="allGeoJson"
      :summaryObj="summaryObj"
      :locationPeriod="locationPeriod"
      @visibleChange="visibleChange"
    />
    <div v-for="tab in configData" :key="'tabSummary' + tab.id">
      <div v-for="subTab in tab.subTabs" :key="'tabSummary' + subTab.id">
        <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
          <TabSummary
            :content="subTab.categoryInfo"
            :contKey="tab.id + subTab.id"
          />
        </div>
      </div>
    </div>
    <div class="summary-section">
      <div v-show="showTrend" id="trendCharts">
        <b-card-group deck class="indicatorSectionWrap mt-3">
          <b-card>
            <b-card-header class="mainHeader">
              <h6>Trends in key indicators</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody p-0">
              <div v-for="tab in configData" :key="'trend' + tab.id">
                <div v-for="subTab in tab.subTabs" :key="'trend' + subTab.id">
                  <div
                    v-show="
                      $store.getters.getActiveTab === 'sd-summary' ||
                      $store.getters.getActiveTab.includes(subTab.id)
                    "
                  >
                    <template v-for="chartData in subTab.chartSetting">
                      <div
                        v-if="
                          chartData.chartOptions.chartCategory === 'trend' &&
                          (!reportChartData ||
                            (reportChartData &&
                              reportChartData.selectedSource === subTab.id &&
                              reportChartData.cid.split('/')[1] ===
                                chartData.chartOptions.cid))
                        "
                        :key="
                          'trend-' +
                          tab.id +
                          subTab.id +
                          chartData.chartOptions.cid
                        "
                      >
                        <ChartComponent
                          :subTab="subTab"
                          :emuData="emuData"
                          :chartData="chartData"
                          :summaryList="summaryList"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                        />
                      </div>
                    </template>
                    <div
                      class="text-center"
                      v-if="
                        !checkCharts(subTab.chartSetting, 'trend') &&
                        $store.getters.getActiveTab !== 'sd-summary'
                      "
                    >
                      No mapping available
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-center"
                v-if="
                  !checkCharts(configData, 'trend', true) &&
                  $store.getters.getActiveTab === 'sd-summary'
                "
              >
                No mapping available
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </div>
      <div v-show="showSeasonal" id="seasonalCharts">
        <b-card-group deck class="indicatorSectionWrap mt-3">
          <b-card>
            <b-card-header class="mainHeader">
              <h6>Seasonal trends in key indicators</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody p-0">
              <div v-for="tab in configData" :key="'seasonal' + tab.id">
                <div
                  v-for="subTab in tab.subTabs"
                  :key="'seasonal' + subTab.id"
                >
                  <div
                    v-show="
                      $store.getters.getActiveTab === 'sd-summary' ||
                      $store.getters.getActiveTab.includes(subTab.id)
                    "
                  >
                    <template v-for="chartData in subTab.chartSetting">
                      <div
                        v-if="
                          chartData.chartOptions.chartCategory === 'seasonal' &&
                          (!reportChartData ||
                            (reportChartData &&
                              reportChartData.selectedSource === subTab.id &&
                              reportChartData.cid.split('/')[1] ===
                                chartData.chartOptions.cid))
                        "
                        :key="
                          'seasonal-' +
                          tab.id +
                          subTab.id +
                          chartData.chartOptions.cid
                        "
                      >
                        <ChartComponent
                          :subTab="subTab"
                          :emuData="emuData"
                          :chartData="chartData"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                        />
                      </div>
                    </template>
                    <div
                      class="text-center"
                      v-if="
                        !checkCharts(subTab.chartSetting, 'seasonal') &&
                        $store.getters.getActiveTab !== 'sd-summary'
                      "
                    >
                      No mapping available
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-center"
                v-if="
                  !checkCharts(configData, 'seasonal', true) &&
                  $store.getters.getActiveTab === 'sd-summary'
                "
              >
                No mapping available
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </div>
      <div v-show="showRegional" id="regionalCharts">
        <b-card-group deck class="indicatorSectionWrap mt-3">
          <b-card>
            <b-card-header class="mainHeader">
              <h6>Regional variation in key indicators</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody p-0">
              <div v-for="tab in configData" :key="'regional' + tab.id">
                <div
                  v-for="subTab in tab.subTabs"
                  :key="'regional' + subTab.id"
                >
                  <div
                    v-show="
                      $store.getters.getActiveTab === 'sd-summary' ||
                      $store.getters.getActiveTab.includes(subTab.id)
                    "
                  >
                    <template v-for="chartData in subTab.chartSetting">
                      <div
                        v-if="
                          chartData.chartOptions.chartCategory === 'regional' &&
                          (!reportChartData ||
                            (reportChartData &&
                              reportChartData.selectedSource === subTab.id &&
                              reportChartData.cid.split('/')[1] ===
                                chartData.chartOptions.cid))
                        "
                        :key="
                          'regional-' +
                          tab.id +
                          subTab.id +
                          chartData.chartOptions.cid
                        "
                      >
                        <ChartComponent
                          :subTab="subTab"
                          :emuData="emuData"
                          :chartData="chartData"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                        />
                      </div>
                    </template>
                    <div
                      class="text-center"
                      v-if="
                        !checkCharts(subTab.chartSetting, 'regional') &&
                        $store.getters.getActiveTab !== 'sd-summary'
                      "
                    >
                      No mapping available
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-center"
                v-if="
                  !checkCharts(configData, 'regional', true) &&
                  $store.getters.getActiveTab === 'sd-summary'
                "
              >
                No mapping available
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import ViewMorePopup from "@/components/Summary/ViewMorePopup.vue";

export default {
  props: [
    "showTrend",
    "showSeasonal",
    "showRegional",
    "configData",
    "locationPeriod",
    "showSummary",
    "reportChartData",
  ],
  mixins: [ScrollPageMixin, SummaryViewMixin],
  components: {
    ViewMorePopup,
    Placeholder: () =>
      import(
        /* webpackChunkName: "Placeholder"*/ "@/components/Common/Placeholder"
      ),
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
    ChartComponent: () =>
      import(
        /* webpackChunkName: "Dynamic_Common_ChartComponent"*/ "@/components/Analytical/ChartComponent"
      ),
  },
  data() {
    return {
      emuData: {},
      visible: false,
      allGeoJson: {},
      summaryList: [],
      summaryObj: null,
      globalResponse: null,
    };
  },
  watch: {
    showTrend(newValue) {
      if (newValue) {
        this.scrollPage("trendCharts");
      }
    },
    showSeasonal(newValue) {
      if (newValue) {
        this.scrollPage("seasonalCharts");
      }
    },
    showRegional(newValue) {
      if (newValue) {
        this.scrollPage("regionalCharts");
      }
    },
    locationPeriod: {
      handler() {
        this.summaryList = [];
        this.mapList = [];
        this.$nextTick(() => {
          this.getSummaryList();
        });
      },
      deep: true,
    },
  },
  methods: {
    checkCharts(charts, type, isOuter = false) {
      let isCharts = false;
      if (isOuter) {
        charts.forEach((t) => {
          t.subTabs.forEach((st) => {
            if (!isCharts) {
              isCharts = this.checkCharts(st.chartSetting, type);
            }
          });
        });
      } else {
        isCharts = charts.find(
          (chartData) => chartData.chartOptions.chartCategory === type
        );
        isCharts = isCharts ? true : false;
      }
      return isCharts;
    },
    setReportChart(data) {
      if (this.reportChartData) {
        this.$emit("setReportChart", {
          chartObj: data.chartData,
          chartName: data.chartData?.title?.title || "",
          cid: [this.reportChartData.cid],
        });
      }
    },
    getGeoJson(loc, obj) {
      this.allGeoJson[loc] = obj;
    },
    visibleChange() {
      this.visible = false;
    },
    viewMore(summary) {
      this.summaryObj = summary;
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    getEMUData() {
      if (
        !this.emuData[this.locationPeriod.periodType] &&
        ["monthly", "yearly"].includes(this.locationPeriod.periodType)
      ) {
        let configKey = null;
        if (this.locationPeriod.periodType === "monthly") {
          configKey = "monthlyEMU";
        }
        if (this.locationPeriod.periodType === "yearly") {
          configKey = "annualEMU";
        }
        let key = this.generateKey(configKey);

        service.getSavedConfig(key).then((resp) => {
          this.$set(this.emuData, this.locationPeriod.periodType, resp.data);
        });
      }
    },
    getSummaryList() {
      let isEMUCharts = false;
      this.configData.forEach((c) => {
        c.subTabs.forEach((s) => {
          let isMapping = false;
          s.chartSetting.forEach((c) => {
            if (
              ((c.chartOptions.dataMapping &&
                c.chartOptions.dataMapping.length) ||
                c.chartOptions.isSavedData) &&
              c.chartOptions.generateSummary
            ) {
              isMapping = true;
            }
            if (c.chartOptions.isSavedData) {
              isEMUCharts = true;
            }
          });
          if (isMapping && s.summary && !s.summary.disable) {
            this.summaryList.push({
              id: s.id,
              trend: null,
              regional: null,
              errorMsg: null,
              compareData: null,
              compareDone: false,
              tabName: s.tabName,
              summaryDetails: null,
              chartConfigData: null,
              isCompare: s.summary.compareWith,
            });
          }
        });
      });
      if (isEMUCharts) {
        this.getEMUData();
      }
    },
    summaryChartData(data) {
      let isFound = this.summaryList.findIndex((s) => s.id === data.id);
      if (isFound >= 0) {
        let obj = {
          ...this.summaryList[isFound],
          [data.chartCategory]: data.chartData,
          chartConfigData: data.chartConfigData
            ? data.chartConfigData
            : this.summaryList[isFound].chartConfigData,
          summaryDetails: data.summaryDetails
            ? data.summaryDetails
            : this.summaryList[isFound].summaryDetails,
          errorMsg: data.errorMsg
            ? data.errorMsg
            : this.summaryList[isFound].errorMsg,
          compareDone: data.compareDone
            ? data.compareDone
            : this.summaryList[isFound].compareDone,
        };
        this.$set(this.summaryList, isFound, obj);
      }
      let isCompareFound = this.summaryList.findIndex(
        (s) => s.isCompare === data.chartConfigData.id && !s.compareDone
      );
      if (isCompareFound >= 0) {
        let obj = {
          ...this.summaryList[isCompareFound],
          compareData: data.summaryDetails || null,
        };
        this.$set(this.summaryList, isCompareFound, obj);
      }
    },
  },
  created() {
    this.getSummaryList();
    this.globalResponse = this.$store.getters.getGlobalFactors();
  },
};
</script>
