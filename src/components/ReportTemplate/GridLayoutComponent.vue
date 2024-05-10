<template>
  <div
    class="position-relative"
    :style="{
      ...wrapperStyle,
      height: canvasH + 'px',
    }"
  >
    <template v-if="isHeaderFooter">
      <template v-for="i in Math.ceil(canvasH / 1122.24)">
        <div
          class=""
          :key="'page-header' + i"
          :style="{
            position: 'absolute',
            top: 1122.24 * (i - 1) + 'px',
            zIndex: 1,
            width: '790px',
            height: '20px',
            color: '#d6d6d6',
            fontSize: '13px',
            padding: '0 10px',
          }"
          v-if="layout?.details?.[0]?.user || layout?.details?.[2]?.location"
        >
          <span v-if="layout?.details?.[0]?.user">
            {{ isStaticHeader ? $t("createdBy") : userName }}
          </span>
          <span class="float-right" v-if="layout?.details?.[2]?.location">
            {{ isStaticHeader ? $t("location") : selectedLocationName + ", "
            }}{{ selectedPeriod }}</span
          >
        </div>
        <div
          class=""
          :key="'page-footer' + i"
          :style="{
            position: 'absolute',
            top: 1122.24 * i - 20 + 'px',
            zIndex: 1,
            width: '790px',
            height: '20px',
            color: '#d6d6d6',
            fontSize: '13px',
            padding: '0 10px',
          }"
          v-if="
            !isGenerating &&
            (layout?.details?.[1]?.timestamp || layout?.details?.[3]?.pageCount)
          "
        >
          <span v-if="layout?.details?.[1]?.timestamp">{{
            dateUpdates
          }}</span>
          <span class="float-right" v-if="layout?.details?.[3]?.pageCount">{{
            $t("pageOf", {
              page: i,
              totalPages: Math.ceil(canvasH / 1122.24),
            })
          }}</span>
        </div>
        <div
          v-if="i < Math.ceil(canvasH / 1122.24)"
          data-html2canvas-ignore="true"
          class="text-center"
          :key="'page-break' + i"
          :style="{
            position: 'absolute',
            top: 1122.24 * i + 'px',
            zIndex: 2,
            width: '790px',
            border: '1px solid #d6d6d6',
          }"
        ></div>
      </template>
    </template>
    <grid-layout
      :vertical-compact="false"
      :use-css-transforms="true"
      :margin="gridLayout.margin"
      :col-num="gridLayout.colNum"
      :row-height="gridLayout.rowHeight"
      @layout-updated="layoutUpdatedEvent"
      :layout.sync="layout[configKey]"
      :is-resizable="gridLayout.isResizable"
      :is-draggable="gridLayout.isDraggable"
    >
      <grid-item
        v-for="chart in layout[configKey]"
        :x="chart.x"
        :y="chart.y"
        :w="chart.w"
        :h="chart.h"
        :i="chart.i"
        :key="chart.i"
        @resized="resizedEvent"
        :class="{
          'summary-highchart-body': chart.showInCard && isDynamicModule,
        }"
      >
        <div
          class="position-relative"
          :class="{
            'card border-0 h-100':
              chart.type !== 'Textarea' ||
              (chart.type === 'Textarea' && isStaticCharts),
          }"
        >
          <span
            class="fa position-absolute cursor-pointer p-1"
            :class="[showSetting === chart.id ? 'fa-close' : 'fa-cog']"
            :title="showSetting === chart.id ? $t('cancelbtn') : $t('settings')"
            v-b-tooltip
            style="
              background-color: var(--chat-user-sender-bg-color);
              top: 1px;
              right: 1px;
              z-index: 1;
            "
            @click.prevent.stop="
              updateSetting(showSetting === chart.id ? null : chart.id)
            "
            v-if="isStaticCharts"
          ></span>
          <div
            class="chartIconsDivTextarea d-flex align-items-center w-100 position-absolute pl-4"
            v-if="showSetting === chart.id && isStaticCharts"
          >
            <template v-if="chart.type === 'Textarea'">
              <span>
                <img
                  class="mr-3 cursor-pointer"
                  :src="require('@/assets/images/icons/editActive.svg')"
                  :style="{ filter: filterColor }"
                  :title="$t('edit')"
                  v-b-tooltip
                  @click.prevent.stop="showAddTextPopup(chart)"
                />
              </span>
              <span
                v-if="!isReport"
                class="btn cursor-pointer mr-2 p-0"
                :title="$t('showInCard')"
                v-b-tooltip
              >
                <b-form-checkbox
                  checked="chart.showInCard"
                  v-model="chart.showInCard"
                  name="showInCardTitle"
                  switch
                  size="sm"
                  class="mt-1 cursor-pointer"
                />
              </span>
            </template>
            <template v-else>
              <span
                v-if="!isReport"
                class="fa fa-refresh cursor-pointer mr-3"
                @click.prevent.stop="syncChart(chart.id)"
                :title="$t('syncChart')"
                v-b-tooltip
              >
              </span>
            </template>
            <span v-if="isReport">
              <img
                alt="img"
                :src="require('@/assets/images/icons/previewActive.svg')"
                :style="{ filter: filterColor }"
                class="cursor-pointer mr-3"
                @click.prevent.stop="$emit('showAddChartPopup', chart)"
                :title="$t('chartDetails')"
                v-b-tooltip
              />
            </span>
            <span>
              <img
                alt="img"
                :src="require('@/assets/images/icons/deleteActive.svg')"
                :style="{ filter: filterColor }"
                class="cursor-pointer mr-3"
                @click.prevent.stop="removeChart(chart.id)"
                :title="$t('deletebtn')"
                v-b-tooltip
              />
            </span>
          </div>
          <div class="inputTextarea mt-1 ml-1" v-if="chart.type === 'Textarea'">
            <div
              :class="{
                'sampleinput text-white': !chart.showInCard && isDynamicModule,
              }"
              v-html="chart.text"
            ></div>
          </div>
          <template v-else>
            <template v-if="isStaticCharts">
              <div class="card-header border border-0 p-2" style="height: 55px">
                <div class="cardTitleSection d-block">
                  <p class="textTitleHeading title_p ml-1 mt-1">
                    {{ chart.name }}
                  </p>
                </div>
              </div>
              <div class="card-body p-0">
                <!-- Add this div to display the chart options on front-end implementation -->
                <div
                  style="height: 45px; visibility: hidden"
                  v-if="!isReport"
                ></div>
                <highcharts
                  :options="chart.chartData"
                  :ref="'addedChart' + chart.i"
                />
                <div
                  class="text-right small pr-4"
                  style="height: 20px"
                  v-if="!isReport"
                >
                  {{ $t("source") }}:
                  <b>{{ chart.source ? chart.source : $t("NA") }}</b>
                </div>
              </div>
            </template>
            <template v-else>
              <template v-if="isDynamicModule">
                <DynamicChartComponent
                  :chartData="chart"
                  :sendFilters="sendFilters"
                  :alertData="alertData"
                  :lowerOrg="lowerOrg"
                  @setExportArr="setExportArr"
                  :cardKey="'Key' + chart.i"
                />
              </template>
              <template v-else>
                <ChartComponent
                  :chartData="chart"
                  @getPeriod="getPeriod"
                  @setLocationPeriod="setLocationPeriod"
                  :configData="configData"
                  :cardKey="'Key' + chart.i"
                  :otherChartObj="otherChartObj"
                  :basePeriod="layout.basePeriod"
                  @getOtherChartObj="getOtherChartObj"
                  :selectedLocation="selectedLocation"
                  :updateFrequencyType="layout.updateFrequencyType"
                />
              </template>
            </template>
          </template>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import { translateDate } from "@/components/Common/commonFunctions";
export default {
  props: [
    "layout",
    "lowerOrg",
    "isReport",
    "configKey",
    "alertData",
    "configData",
    "sendFilters",
    "wrapperStyle",
    "otherChartObj",
    "selectedPeriod",
    "isStaticHeader",
    "isStaticCharts",
    "isHeaderFooter",
    "excludedHeight",
    "isDynamicModule",
    "selectedLocation",
    "updatedGridLayout",
    "selectedLocationName",
    "isGenerating",
  ],
  mixins: [DynamicImageMixin],
  components: {
    GridItem,
    GridLayout,
    ChartComponent: () =>
      import(/*webpackChunkName: "RT_ChartComponent" */ "./ChartComponent"),
    DynamicChartComponent: () =>
      import(
        /*webpackChunkName: "RT_DynamicChartComponent" */ "@/components/DynamicModule/ChartComponent"
      ),
  },
  data() {
    return {
      showSetting: null,
      gridCanvasHeight: 0,
      gridLayout: {
        colNum: 12,
        rowHeight: 30,
        margin: [10, 10],
        isDraggable: true,
        isResizable: true,
      },
      canvasH: 0,
    };
  },
  watch: {
    isGenerating(newVal) {
      this.canvasH = newVal ? this.canvasH * 1.2 : this.canvasH / 1.2;
    },
  },
  computed: {
    userName() {
      return `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`;
    },
    dateUpdates() {
      if (this.$store.getters.getAppSettings.calendar == "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        let date = new Date();
        let nepaliDate = adToBs(
          `${
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
          }`
        );
        let nepaliMonthYear = translateDate({
          rawDate:
            `${new Date(nepaliDate).getFullYear()}` +
            "-" +
            `${
              new Date(nepaliDate).getMonth() + 1 < 10
                ? "0" + (new Date(nepaliDate).getMonth() + 1)
                : new Date(nepaliDate).getMonth() + 1
            }`,
        });
        console.log("nepaliMonthYear", nepaliMonthYear);
        return nepaliDate.split("-")[2] + ", " + nepaliMonthYear;
      } else {
        return this.$moment(new Date()).format("lll");
      }
    },
  },
  methods: {
    canvasHeight() {
      let finalHeight = this.gridCanvasHeight ? this.gridCanvasHeight : 1122.24;
      let pages = finalHeight;
      if (this.isReport) {
        pages = Math.ceil(finalHeight / 1122.24);
        pages = pages * 1122.24;
        this.$emit("getCanvasHeight", pages);
      }
      this.canvasH = pages;
      // return pages;
    },
    setExportArr(obj) {
      this.$emit("setExportArr", obj);
    },
    getOtherChartObj(obj) {
      this.$emit("getOtherChartObj", obj);
    },
    setLocationPeriod(value) {
      this.$emit("setLocationPeriod", value);
    },
    getPeriod(period) {
      this.$emit("getPeriod", period);
    },
    updateSetting(value) {
      this.showSetting = value;
    },
    showAddTextPopup(chart) {
      this.$emit("showAddTextPopup", chart);
    },
    syncChart(id) {
      this.$emit("syncChart", id);
    },
    removeChart(id) {
      let layout = JSON.parse(JSON.stringify(this.layout));
      layout = {
        ...layout,
        [this.configKey]: layout[this.configKey].filter((c) => c.id !== id),
      };
      this.$emit("update:layout", layout);
    },
    resizedEvent(i, newX, newY, newHPx, newWPx) {
      let layout = JSON.parse(JSON.stringify(this.layout));
      layout = {
        ...layout,
        [this.configKey]: layout[this.configKey].map((el) => {
          if (el.i === i) {
            if (el.type !== "Textarea") {
              el.chartData.chart = {
                ...el.chartData.chart,
                width: newWPx * 1,
                height: newHPx * 1 - this.excludedHeight,
              };
              this.reloadChart(i);
            }
          }
          return el;
        }),
      };
      this.$emit("update:layout", layout);
    },
    layoutUpdatedEvent(newLayout) {
      this.gridCanvasHeight =
        this.bottom(newLayout) *
          (this.gridLayout.rowHeight + this.gridLayout.margin[1]) +
        this.gridLayout.margin[1]; //bottom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
      this.canvasHeight();
    },
    bottom(layout) {
      let max = 0,
        bottomY;
      for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) max = bottomY;
      }
      return max;
    },
    reloadChart(i) {
      this.$refs["addedChart" + i][0].chart.reflow();
    },
  },
  created() {
    if (this.updatedGridLayout) {
      this.gridLayout = {
        ...this.gridLayout,
        ...this.updatedGridLayout,
      };
    }
  },
};
</script>
<style lang="scss" scoped>
.chartIconsDivTextarea {
  height: 55px;
  background-color: var(--chat-user-sender-bg-color);
}
</style>
