<template>
  <div class="summary-page-container" id="scrollTop" ref="printPDF">
    <div
      class="mr-0 p-4 summary-page"
      id="summary"
      v-show="$store.getters.getActiveTab === 'sd-summary'"
    >
      <b-row>
        <b-col :sm="!isGenerating ? '10' : '11'"
          ><div class="pb-4 summary-title fs-17-1920">
            {{ $t("MNCHPerformance") }}
            <span class="green fs-17-1920">{{ $t("positive5") }}</span>
            <span class="red fs-17-1920">{{ $t("decline5") }}</span>
            <span class="orange fs-17-1920">{{ $t("limited5") }}</span>
            {{ $t("understandingInd") }}
          </div></b-col
        >
        <b-col sm="2" v-if="!isGenerating"
          ><div class="text-right mb-3">
            <button
              type="button"
              class="btn btn-primary black-btn blue-btn f-08rem"
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
          </div></b-col
        >
      </b-row>
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
                      v-b-tooltip:hover
                      :title="summary.summaryDetails[0].currValue"
                      class="summary-dot"
                      :class="summary.summaryDetails[0].colorLastMn"
                    >
                      <p
                        class="mb-0 fs-25-1920"
                        :class="getClass(summary.summaryDetails[0].currValue)"
                      >
                        {{ summary.summaryDetails[0].currValue }}
                      </p>
                    </div></b-col
                  >
                  <b-col sm="10" class="pl-3 pt-2">
                    <b-row>
                      <b-col sm="8">
                        <div
                          v-b-tooltip:hover
                          :title="summary.tabName[$i18n.locale]"
                          class="fs-17-1920 indicator-name"
                        >
                          {{ summary.tabName[$i18n.locale] }}
                        </div>
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
                          {{ $t("per_change_from") }}
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
                :class="{
                  'emu-status ': showMore !== summary.id && !isGenerating,
                }"
                style="min-height: 36px"
                v-html="getSummaryText(summary.summaryDetails[0].summaryText)"
              ></div>
              <!-- data-html2canvas-ignore="true" -->
              <div
                v-if="!isGenerating"
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
                  {{ $t("performance_against_benchmark") }}
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
                    crossorigin="*"
                    alt="s_icon"
                    class="equalTosign w-20px"
                    :src="
                      require(`@/assets/images/ministerialSummaryIcon/${getIcon(
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
                :variant="
                  $store.getters.getTheme === 'white' ? 'light' : 'dark'
                "
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
      v-if="visible && !isGenerating"
      :allGeoJson="allGeoJson"
      :allExtData="allExtData"
      :summaryObj="summaryObj"
      :locationPeriod="locationPeriod"
      @visibleChange="visibleChange"
    />
    <template v-if="!isGenerating">
      <div v-for="tab in configData" :key="'tabSummary' + tab.id">
        <div v-for="subTab in tab.subTabs" :key="'tabSummary' + subTab.id">
          <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
            <TabSummary
              :content="subTab.categoryInfo[$i18n.locale]"
              :contKey="tab.id + subTab.id"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="summary-section">
      <div v-show="showTrend" id="trendCharts" class="pt-5">
        <b-card-group
          deck
          class="indicatorSectionWrap"
          v-show="checkCharts(configData, 'trend', true)"
        >
          <b-card>
            <b-card-header class="mainHeader before">
              <h6>{{ $t("trendsKeyInd") }}</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody summary-bordercharts p-0">
              <div
                v-for="tab in configData"
                :key="'trend' + tab.id"
                class="after"
              >
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
                          !chartData.chartOptions.disable
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
                          :isShowChart="showTrend"
                          @setExtData="setExtData"
                          :allExtData="allExtData"
                          :summaryList="summaryList"
                          :preFetchData="preFetchData"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                          :backgroundData="subTab.backgroundData"
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </div>
      <div v-show="showSeasonal" id="seasonalCharts">
        <b-card-group
          deck
          class="indicatorSectionWrap"
          v-show="checkCharts(configData, 'seasonal', true)"
        >
          <b-card>
            <b-card-header class="mainHeader before">
              <h6>{{ $t("SeasonTrends") }}</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody p-0">
              <div
                v-for="tab in configData"
                :key="'seasonal' + tab.id"
                class="after"
              >
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
                          !chartData.chartOptions.disable
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
                          @setExtData="setExtData"
                          :allExtData="allExtData"
                          :isShowChart="showSeasonal"
                          :preFetchData="preFetchData"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                          :backgroundData="subTab.backgroundData"
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-card-group>
      </div>
      <div v-show="showRegional" id="regionalCharts">
        <b-card-group
          deck
          class="indicatorSectionWrap"
          v-show="checkCharts(configData, 'regional', true)"
        >
          <b-card>
            <b-card-header class="mainHeader before">
              <h6>{{ $t("RegionalVariation") }}</h6>
            </b-card-header>
            <b-card-body class="indicatorCardBody p-0">
              <div
                v-for="tab in configData"
                :key="'regional' + tab.id"
                class="after"
              >
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
                          !chartData.chartOptions.disable
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
                          @setExtData="setExtData"
                          :allExtData="allExtData"
                          :isShowChart="showRegional"
                          :preFetchData="preFetchData"
                          @setReportChart="setReportChart"
                          :locationPeriod="locationPeriod"
                          :reportChartData="reportChartData"
                          @summaryChartData="summaryChartData"
                          :backgroundData="subTab.backgroundData"
                        />
                      </div>
                    </template>
                  </div>
                </div>
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
import GeoJsonMixin from "@/helpers/GeoJsonMixin";
import ExtDataMixin from "@/helpers/ExtDataMixin";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import GenerateReportMixin from "@/helpers/GenerateReportMixin";
import ViewMorePopup from "@/components/Summary/ViewMorePopup.vue";
export default {
  props: [
    "showTrend",
    "configData",
    "showSummary",
    "preFetchData",
    "showSeasonal",
    "showRegional",
    "locationPeriod",
    "reportChartData",
  ],
  mixins: [
    GeoJsonMixin,
    ExtDataMixin,
    ScrollPageMixin,
    SummaryViewMixin,
    DynamicImageMixin,
    GenerateReportMixin,
  ],
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
      allExtData: {},
      visible: false,
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
      handler(newValue, oldValue) {
        if (
          oldValue &&
          (newValue.location !== oldValue.location ||
            newValue.periodType !== oldValue.periodType ||
            newValue.period !== oldValue.period)
        ) {
          this.summaryList = [];
          this.mapList = [];
          this.$nextTick(() => {
            this.getSummaryList();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    setExtData(level, obj) {
      this.allExtData[level] = obj;
    },
    getClass(value) {
      return value && value.toString().length > 5
        ? "big-number"
        : value && value.toString().length > 7
        ? "biggest-number"
        : "";
    },
    checkCharts(charts, type, isOuter = false) {
      let isCharts = false;
      if (isOuter) {
        if (this.$store.getters.getActiveTab === "sd-summary") {
          charts.forEach((t) => {
            t.subTabs.forEach((st) => {
              if (!isCharts) {
                isCharts = this.checkCharts(st.chartSetting, type);
              }
            });
          });
        } else {
          let arr = charts.find((c) =>
            this.$store.getters.getActiveTab.includes(c.id)
          );
          if (arr) {
            let isSub = arr.subTabs.find((s) =>
              this.$store.getters.getActiveTab.includes(s.id)
            );
            if (isSub) {
              if (!isCharts) {
                isCharts = this.checkCharts(isSub.chartSetting, type);
              }
            }
          }
        }
      } else {
        isCharts = charts
          .filter((c) => !c.chartOptions.disable)
          .find((chartData) => chartData.chartOptions.chartCategory === type);
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
    visibleChange() {
      this.visible = false;
    },
    viewMore(summary) {
      this.summaryObj = summary;
      this.$nextTick(() => {
        this.visible = true;
        this.getGeoJson(this.locationPeriod.location);
        this.getExtData(this.locationPeriod.location.split("/")[0]);
      });
    },
    getEMUData() {
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
        !this.emuData[
          `${this.locationPeriod.periodType}_${this.$i18n.locale}`
        ] &&
        ["monthly", "yearly"].includes(this.locationPeriod.periodType)
      ) {
        let configKey = null;
        if (this.locationPeriod.periodType === "monthly") {
          configKey = `monthlyEMU_${this.$i18n.locale}`;
        }
        if (this.locationPeriod.periodType === "yearly") {
          configKey = `annualEMU_${this.$i18n.locale}`;
        }
        let key = this.generateKey(configKey);

        service
          .getSavedConfig(key)
          .then((resp) => {
            this.$set(
              this.emuData,
              `${this.locationPeriod.periodType}_${this.$i18n.locale}`,
              resp.data
            );
          })
          .catch(() => {
            this.$set(
              this.emuData,
              `${this.locationPeriod.periodType}_${this.$i18n.locale}`,
              "Error"
            );
          });
      } else {
        if (
          !this.emuData[
            `${this.locationPeriod.periodType}_${this.$i18n.locale}`
          ] &&
          !["monthly", "yearly"].includes(this.locationPeriod.periodType)
        ) {
          this.$set(
            this.emuData,
            `${this.locationPeriod.periodType}_${this.$i18n.locale}`,
            "Error"
          );
        }
      }
    },
    getSummaryList() {
      let isEMUCharts = false;
      let index = 0;
      this.configData.forEach((c) => {
        c.subTabs.forEach((s) => {
          let isMapping = false;
          s.chartSetting.forEach((c) => {
            if (
              ((c.chartOptions.dataMapping &&
                c.chartOptions.dataMapping.length) ||
                c.chartOptions.isSavedData) &&
              c.chartOptions.generateSummary &&
              !c.chartOptions.disable
            ) {
              isMapping = true;
            }
            if (c.chartOptions.isSavedData) {
              isEMUCharts = true;
            }
          });
          if (isMapping && s.summary && !s.summary.disable) {
            let obj = {
              id: s.id,
              trend: null,
              regional: null,
              errorMsg: null,
              compareData: null,
              compareDone: false,
              tabName: s.tabName,
              summaryDetails: null,
              chartConfigData: null,
              extData: s.summary.extData,
              isCompare: s.summary.compareWith,
            };
            this.$set(this.summaryList, index, obj);
            index++;
          }
        });
      });
      if (isEMUCharts) {
        this.getEMUData();
      }
    },
    summaryChartData(data) {
      if (this.summaryList.length === 0) {
        this.getSummaryList();
      }
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
        (s) =>
          data.chartConfigData &&
          s.isCompare === data.chartConfigData.id &&
          !s.compareDone
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
<style>
.before {
  page-break-before: always !important;
}
.after {
  page-break-after: always !important;
  page-break-inside: avoid !important;
}
.avoid {
  page-break-inside: avoid !important;
}
</style>