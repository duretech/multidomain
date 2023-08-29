<template>
  <div>
    <fullscreen
      v-model="cObjFull"
      ref="fullscreen"
      class="fullContainer chart-dqrborder"
    >
      <b-card
        class="summary-highchart-body p-0 border-0 rounded-0 fullContent"
        :key="updateDOM"
      >
        <b-card-header
          class="summary-highchart1-header pt-0 border-0 rounded-0"
        >
          <b-row v-if="dataFetched">
            <b-col sm="9" class="p-0" :class="{ 'col-sm-12': cObjFull }"
              ><h5 class="summary-chart-title pl-0 mb-0 fs-17-1920">
                <i
                  class="fa fa-info-circle cursor-pointer chart-info mr-2 ml-2"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: chartInfo,
                    title: cObj.title.title || dummyName,
                    html: true,
                  }"
                ></i>
                {{ cObj.title.title || dummyName }}
              </h5></b-col
            >
            <b-col sm="3" class="position-relative" v-if="!cObjFull">
              <ChartOptions
                :cID="cID"
                :mapView="isMap"
                :sorting="sorting"
                :trendTable="downloadCSV"
                :viewType="viewType"
                @dataSort="dataSort"
                fullScreenKey="cObj"
                :drillDown="drillDown"
                @showTable="showTable"
                :defaultSort="defaultSort"
                @exportChart="exportChart"
                @toggleFullscreen="toggleFullscreen"
                v-if="cObj.series.length && !isHideOption"
              />
            </b-col>
          </b-row>
        </b-card-header>
        <b-card-body class="chart-body highchart-section">
          <b-row>
            <b-col
              :class="[
                outliersArr && outliersArr.length ? 'col-sm-9' : 'col-sm-12',
              ]"
            >
              <b-row
                class="pb-2 mx-0"
                :class="{ hidden: viewType !== 'chart' || drillDown }"
              >
                <b-col sm="12" class="p-0">
                  <ChartFilters
                    :cObj="cObj"
                    :plotType="plotType"
                    :plotOptions="plotOptions(plotType)"
                    :allMethods="allMethods"
                    :selectedMethod="selectedMethod"
                    @changePlotType="changePlotType"
                    @getSelectedMethod="getSelectedMethod"
                  />
                </b-col>
              </b-row>
              <div
                :class="{
                  'align-items-center d-flex justify-content-center h-400px':
                    cObj.series.length === 0 || (isMap && !geoJson),
                }"
              >
                <template v-if="isError">
                  <div class="text-center small">
                    <div class="">{{ $t("errorInData") }}</div>
                    <div class="cursor-pointer" @click="$emit('reloadChart')">
                      <u
                        ><i class="fa fa-refresh mr-1"></i
                        >{{ $t("refreshBtn") }}</u
                      >
                    </div>
                  </div>
                </template>
                <template v-else>
                  <template v-if="viewType !== 'table'">
                    <template
                      v-if="dataFetched && (!isMap || (isMap && geoJson))"
                    >
                      <Maps
                        v-if="geoJson && viewType === 'map'"
                        :geoJson="geoJson"
                        :mapData="mapData"
                        :mapScales="mapScales"
                        :showIcons="true"
                        :isAnalytical="true"
                        ref="map"
                      />
                      <highcharts
                        class="maincharts w-100"
                        v-if="viewType === 'chart'"
                        :options="cObj"
                        ref="barCharts"
                      ></highcharts>
                    </template>
                    <b-spinner type="grow" label="Spinning" v-else></b-spinner>
                  </template>
                  <template v-if="viewType === 'table'">
                    <div class="tables">
                      <template v-if="dataFetched">
                        <b-table
                          :items="items"
                          :fields="fields"
                          bordered
                          sticky-header="385px"
                          show-empty
                          :empty-text="$t('no_data_to_display')"
                        >
                          <template #cell(show_details)="row">
                            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
                            <b-form-group>
                              <input
                                type="checkbox"
                                v-model="row.detailsShowing"
                                @click="addValues(row)"
                              />
                            </b-form-group>
                          </template>
                          <template #row-details="row">
                            <b-table
                              :items="
                                drillTable?.[row.item[$i18n.t('period')]] || []
                              "
                              show-empty
                              :empty-text="$t('no_data_to_display')"
                              class="drillTable"
                            ></b-table>
                            <b-button
                              class="blue-btn"
                              size="sm"
                              @click="row.toggleDetails"
                              >{{ $t("viewLess") }}</b-button
                            >
                          </template>
                        </b-table>
                        <div v-if="isRRChart">
                          <b-row>
                            <b-col>
                              <i
                                class="fa fa-circle mr-1"
                                style="color: #7bcdb7; font-size: 0.9375rem"
                              ></i>
                              {{ $t("rr_text8") }} ({{ bValue }}%)
                            </b-col>
                            <b-col>
                              <i
                                class="fa fa-circle mr-1"
                                style="color: #f7927e; font-size: 0.9375rem"
                              ></i>
                              {{ $t("rr_text9") }} ({{ bValue }}%)
                            </b-col>
                          </b-row>
                          <b-row>
                            <b-col>
                              <i
                                class="fa fa-circle mr-1"
                                style="color: #f8775a; font-size: 0.9375rem"
                              ></i>
                              {{ $t("rr_text8") }} ({{ bValue }}%)
                              {{ $t("rr_text11") }} ({{ subChange }}%)
                            </b-col>
                          </b-row>
                        </div>
                      </template>
                      <b-spinner
                        type="grow"
                        label="Spinning"
                        v-else
                      ></b-spinner>
                    </div>
                  </template>
                </template>
              </div>
            </b-col>
            <b-col
              sm="3"
              v-if="outliersArr && outliersArr.length"
              class="border-dqrleft h-400px overflow-auto"
            >
              <!-- add slice() to avoid mutating the array and getting infinite update error -->
              <div
                v-for="(outlier, i) in outliersArr.slice().reverse()"
                :key="'outliers' + i"
              >
                <div class="pb-2 f-s-0-9375rem">
                  <strong
                    ><u>{{ outlier.header }}</u></strong
                  >
                </div>
                <template v-if="drillICOutliers.length">
                  <div v-for="(o, i) in drillICOutliers" :key="i">
                    <div>
                      <strong>{{ o.name }}</strong>
                    </div>
                    <h6 class="d-inline-block" v-if="o.outliers.length > 0">
                      <b-badge
                        variant="secondary"
                        class="m-1 shadow-sm selection-pills"
                        v-for="(o, i) in o.outliers"
                        :key="i"
                        >{{ o }}</b-badge
                      >
                    </h6>
                    <div class="my-3 text-center" v-else>{{ $t("NA") }}</div>
                  </div>
                </template>
                <template v-else>
                  <div v-if="outlier.outlierList.length > 0">
                    <div v-for="(o, i) in outlier.outlierList" :key="i">
                      <div>
                        <strong>{{ o.name }}</strong>
                      </div>
                      <h6 class="d-inline-block" v-if="o.outliers.length > 0">
                        <b-badge
                          variant="secondary"
                          class="m-1 shadow-sm selection-pills"
                          v-for="(o, i) in o.outliers.slice().reverse()"
                          :key="i"
                          >{{ o }}</b-badge
                        >
                      </h6>
                      <div class="my-3 text-center" v-else>{{ $t("NA") }}</div>
                    </div>
                  </div>
                  <div class="my-3 text-center" v-else>{{ $t("NA") }}</div>
                </template>
              </div>
              <div v-if="drillPointBenchmark">
                <div class="pb-2 f-s-0-9375rem">
                  <strong
                    ><u>{{ $t("rr_text3") }}</u></strong
                  >
                </div>
                <div v-if="nationalRegionReportingTrendOutlier.length > 0">
                  <div
                    class="text-center"
                    v-if="
                      nationalRegionReportingTrendOutlier[0] ===
                      $t('noRegionsFound')
                    "
                  >
                    {{ nationalRegionReportingTrendOutlier[0] }}
                  </div>
                  <h6 class="d-inline-block" v-else>
                    <b-badge
                      variant="secondary"
                      class="m-1 shadow-sm selection-pills"
                      v-for="(o, i) in nationalRegionReportingTrendOutlier"
                      :key="i"
                      >{{ o }}</b-badge
                    >
                  </h6>
                </div>
                <div class="my-3 text-center" v-else>
                  <i class="mr-2 fa fa-arrow-left"></i
                  >{{
                    $t("rr_text4", {
                      lineType: $t(`${cObj.chart.type}`),
                    })
                  }}
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row class="small" v-if="source || isOutlier || isPOutlier">
            <b-col
              v-if="
                (isOutlier || isPOutlier) && dataFetched && cObj.series.length
              "
            >
              <span v-if="isOutlier"
                ><i
                  class="mr-2 fa fa-circle"
                  :style="{ color: outlierColor }"
                ></i
                >{{ $t("outlier") }}</span
              >
              <span v-if="isPOutlier">
                <i
                  class="mx-2 fa fa-circle"
                  :style="{
                    color: chartConfigData?.chartOptions?.cngPtPos || '#5ab276',
                  }"
                ></i
                >{{ $t("outlierPlus") }}
              </span>
              <span v-if="isPOutlier">
                <i
                  class="mx-2 fa fa-circle"
                  :style="{
                    color: chartConfigData?.chartOptions?.cngPtNeg || '#e8bb69',
                  }"
                ></i
                >{{ $t("outlierMinus") }}
              </span>
              <template v-if="exceptionTable && exceptionTable.length">
                <span class="ml-5 cursor-pointer" @click="isException = true"
                  ><i class="fa fa-file mr-2"></i
                  ><u>{{ $t("exceptions") }}</u></span
                >
                <b-modal
                  v-model="isException"
                  hide-footer
                  ok-only
                  :title="$t('exceptions')"
                  no-close-on-backdrop
                >
                  <div>
                    <div class="mb-3 text-right small">
                      <download-csv
                        class="btn color-white cursor-pointer p-0"
                        :data="exceptionTable"
                        ><img
                          :src="
                            require(`@/assets/images/icons/downloadnewActive.svg`)
                          "
                          :style="{
                            filter: filterColor,
                          }"
                          v-b-tooltip.hover
                          :title="$t('downloadIcon')"
                          class="img-fluid icon1"
                      /></download-csv>
                    </div>
                    <b-table
                      :items="exceptionTable"
                      bordered
                      sticky-header="385px"
                      show-empty
                      :empty-text="$t('no_data_to_display')"
                    ></b-table>
                  </div>
                </b-modal>
              </template>
            </b-col>
            <b-col class="text-right" v-if="source">
              {{ $t("source") }}: {{ source ? source : $t("NA") }}
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </fullscreen>
  </div>
</template>

<script>
import service from "@/service";
import FullScreenMixin from "@/helpers/FullScreenMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import Maps from "@/components/Maps/IntegratedFPMap.vue";
export default {
  components: {
    Maps,
    ChartOptions: () =>
      import(
        /* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
      ),
    ChartFilters: () =>
      import(
        /* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
      ),
  },
  mixins: [FullScreenMixin, DynamicImageMixin],
  props: [
    "r2",
    "cID",
    "subTab",
    "source",
    "drillSD",
    "isError",
    "sorting",
    "outliers",
    "chartInfo",
    "chartType",
    "chartData",
    "showLabels",
    "dataFetched",
    "defaultSort",
    "isHideOption",
    "backgroundData",
    "exceptionTable",
    "locationPeriod",
    "chartConfigData",
    "drillPointBenchmark",
  ],
  data() {
    return {
      items: [],
      fields: [],
      updateDOM: 0,
      viewType: "",
      chartName: "",
      geoJson: null,
      plotType: null,
      drillTable: {},
      cObjFull: false,
      drillDown: false,
      drillDownPoint: 0,
      isException: false,
      redrawEnabled: true,
      drillICOutliers: [],
      selectedMethod: null,
      nationalRegionReportingTrendOutlier: [],
      cObj: JSON.parse(JSON.stringify(this.chartData)),
    };
  },
  computed: {
    isMap() {
      return this.chartConfigData?.chartOptions?.chartDefaultView === "map";
    },
    mapData() {
      let mArr = [];
      this.cObj.series.forEach((m) => {
        m.data.forEach((d) => {
          mArr.push({
            data: d.value,
            sName: m.name,
            color: m.color,
            location: d.id,
            locationLabel: d.name,
          });
        });
      });
      return mArr;
    },
    mapScales() {
      let s = [];
      this.cObj.series.forEach((m) => {
        s.push({ scaleColor: m.color, scaleLabel: m.name });
      });
      return s;
    },
    dummyName() {
      return this.$i18n.t("chart") + " " + this.$i18n.t("name");
    },
    allMethods() {
      return this.chartData?.methodSeries?.length
        ? this.chartData.methodSeries.map((m) => ({
            text: m.name,
            value: m.name,
          }))
        : null;
    },
    outliersArr() {
      let key = this.selectedMethod ? this.selectedMethod : "default";
      let o = [];
      if (this.outliers?.[key]) {
        //Add slice() to avoid mutation
        o = this.outliers[key].slice().sort(function (x, y) {
          // true values first
          return x.secondary === y.secondary ? 0 : x.secondary ? -1 : 1;
          // false values first
          // return x.secondary === y.secondary ? 0 : x.secondary ? 1 : -1;
        });
      }
      return o;
    },
    plotOptions: function () {
      return function (type) {
        let options = [],
          types = [
            "column",
            "line",
            "spline",
            "stack",
            "area",
            "bar",
            "stack_bar",
            "stack_percent",
            "stack_bar_percent",
          ];
        if (types.includes(type)) {
          options = [
            {
              value: "column",
              text: this.$i18n.t("column"),
            },
            {
              value: "stack",
              text: this.$i18n.t("stack"),
            },
            {
              value: "stack_percent",
              text: `${this.$i18n.t("stack")} (%)`,
            },
            {
              value: "bar",
              text: this.$i18n.t("bar"),
            },
            {
              value: "stack_bar",
              text: `${this.$i18n.t("stack")} ${this.$i18n.t("bar")}`,
            },
            {
              value: "stack_bar_percent",
              text: `${this.$i18n.t("stack")} ${this.$i18n.t("bar")} (%)`,
            },
            {
              value: "line",
              text: this.$i18n.t("line"),
            },
            {
              value: "spline",
              text: this.$i18n.t("spline"),
            },
            {
              value: "area",
              text: this.$i18n.t("area"),
            },
          ];
        }
        return options;
      };
    },
    isPOutlier() {
      let isOutlier = false;
      if (this.chartConfigData?.chartOptions) {
        if (
          ["PERIOD_DIFF", "PERIOD_DIFF_CYP"].includes(
            this.chartConfigData.chartOptions.chartCalculation
          )
        ) {
          isOutlier = true;
        }
      }
      return isOutlier;
    },
    isOutlier() {
      let isOutlier = false;
      if (this.chartConfigData?.chartOptions) {
        if (
          ["SOURCE_DIFF"].includes(
            this.chartConfigData.chartOptions.chartCalculation
          ) ||
          this.chartConfigData.chartOptions.type === "scatter"
        ) {
          isOutlier = true;
        }
      }
      return isOutlier;
    },
    outlierColor() {
      let color = null;
      if (this.isOutlier) {
        color = this.backgroundData?.outliersColor || null;
      }
      return color;
    },
    isRRChart() {
      let isRRChart = false;
      if (
        this.cObj?.series?.length &&
        (this.subTab?.group?.includes("-CT-") ||
          this.subTab?.group?.includes("-FAC-CTFacility")) &&
        this.chartConfigData?.chartOptions
      ) {
        if (
          ["regionalTrend"].includes(
            this.chartConfigData.chartOptions.chartCategory
          )
        ) {
          isRRChart = true;
        }
      }
      return isRRChart;
    },
    bValue() {
      let bValue = 80;
      if (
        this.chartData.yAxis.plotLines &&
        this.chartData.yAxis.plotLines.length
      ) {
        bValue = this.chartData.yAxis.plotLines[0].value;
      }
      return bValue;
    },
    subChange() {
      let sChange = 5;
      if (this.backgroundData) {
        sChange = this.backgroundData?.substantialChange || 5;
      }
      return sChange;
    },
    generateTable() {
      return (
        this.cObj.series.length && this.dataFetched && this.viewType === "table"
      );
    },
    downloadCSV() {
      let t = JSON.parse(JSON.stringify(this.items));
      if (this.chartConfigData?.chartOptions?.chartDrillDown) {
        this.cObj.drilldown.series.forEach((s) => {
          let isD = t.findIndex((d) => d[this.$i18n.t("period")] === s.period);
          if (isD >= 0 && s.data.length) {
            s.data.forEach((item) => {
              t[isD] = {
                ...t[isD],
                [`${item.name} [${s.sName}]`]: item.y,
              };
            });
          }
        });
        //* When we pass only Items array to download plugin, it download the data based on "keys" available in the first object of the array
        //* When we don't have drill-down data for the very first object in the table array, it fails to download the drill-down data for the other objects from the table
        //* This is to add the missing keys in the first object of the table
        let bigObj = {};
        t.forEach((d) => {
          if (Object.keys(bigObj).length < Object.keys(d).length) {
            bigObj = d;
          }
        });
        Object.keys(bigObj).forEach((k) => {
          if (!Object.keys(t[0]).includes(k)) {
            t[0][k] = null;
          }
        });
      }
      //To remove the extra "_showDetails" column
      t = t.map((tIn) => {
        let { _showDetails, ...rest } = tIn;
        return rest;
      });
      return t;
    },
  },
  watch: {
    chartData: {
      handler(newValue) {
        this.cObj = JSON.parse(JSON.stringify(newValue));
        this.plotType = this.cObj.chart.oType
          ? this.cObj.chart.oType
          : this.cObj.chart.type;
        this.addEvents();
        if (this.cObj.chart.type !== "packedbubble") {
          this.setYMin();
        }
        if (
          !["SOURCE_DIFF"].includes(
            this.chartConfigData?.chartOptions?.chartCalculation
          )
        ) {
          this.dataSort(this.defaultSort);
        }
        if (this.cObj.chart.type === "packedbubble") {
          this.getGeoJson();
        }
        if (this.cObj.series.length) {
          this.showTable(this.viewType);
        }
      },
      deep: true,
    },
    allMethods(newValue) {
      this.selectedMethod =
        newValue && newValue.length ? newValue[0].value : null;
    },
    selectedMethod(newValue) {
      let isFound =
        this.cObj?.methodSeries?.findIndex((m) => m.name === newValue) || -1;
      if (isFound >= 0) {
        this.cObj.series = this.cObj.methodSeries[isFound].data;
        this.$nextTick(() => {
          this.updateDOM++;
        });
      }
    },
    showLabels(newValue) {
      if (newValue) {
        this.applyLabels();
      }
    },
    r2(newValue) {
      if (newValue >= 0) {
        this.setR2();
      }
    },
    isRRChart(newValue) {
      if (newValue) {
        this.showTable("table");
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
          this.fields = [];
          this.items = [];
          this.drillDown = false;
        }
      },
      deep: true,
    },
    generateTable(newValue) {
      if (newValue) {
        this.showTable(this.viewType);
      }
    },
  },
  methods: {
    changePlotType(value) {
      if (
        this.cObj &&
        this.cObj.yAxis &&
        this.cObj.yAxis.plotLines &&
        this.cObj.yAxis.plotLines.length
      ) {
        this.cObj.yAxis.plotLines = this.cObj.yAxis.plotLines.map((p) => {
          return {
            ...p,
            label: {
              ...p.label,
              y: value.includes("bar") ? 125 : -5,
            },
          };
        });
      }
      if (this.cObj.chart.type !== "packedbubble" && this.cObj?.tooltip) {
        this.cObj.tooltip.pointFormat =
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>';
      }
      if (value.includes("stack")) {
        this.cObj.plotOptions.series.stacking = value.includes("percent")
          ? "percent"
          : "normal";
        if (value.includes("percent")) {
          this.cObj.tooltip.pointFormat =
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>';
        }
        this.$nextTick(() => {
          this.cObj.chart.type = value.includes("bar") ? "bar" : "column";
        });
      } else {
        if (value.includes("scatter")) {
          this.cObj.tooltip.pointFormat =
            '<span>{point.name}</span><br/><span style="color:{series.color}">{series.name}</span>: <b>X: {point.x}</b>, <b>Y: {point.y}</b><br/>';
        }
        this.cObj.plotOptions.series.stacking = "";
        this.$nextTick(() => {
          this.cObj.chart.type = value.toLowerCase();
        });
      }
    },
    getSelectedMethod(val) {
      this.selectedMethod = val;
    },
    dataSort(sortType) {
      this.cObj.series.map((d) => ({
        ...d,
        data: d.data.sort((a, b) => {
          let valueA = 0;
          let valueB = 0;
          let comparison = 0;

          if (sortType === "0-1" || sortType === "1-0") {
            valueA = a.y;
            valueB = b.y;
          }

          if (sortType === "JAN-DEC" || sortType === "DEC-JAN") {
            valueA = a.pe
              ? new Date(a.pe).getTime()
              : new Date(a.name).getTime();
            valueB = b.pe
              ? new Date(b.pe).getTime()
              : new Date(b.name).getTime();
          }

          if (sortType === "A-Z" || sortType === "Z-A") {
            valueA = a.name;
            valueB = b.name;
          }

          if (
            sortType == "0-1" ||
            sortType === "A-Z" ||
            sortType === "JAN-DEC"
          ) {
            if (valueA > valueB) {
              comparison = 1;
            } else if (valueA < valueB) {
              comparison = -1;
            }
          } else if (
            sortType == "1-0" ||
            sortType === "Z-A" ||
            sortType === "DEC-JAN"
          ) {
            if (valueA > valueB) {
              comparison = -1;
            } else if (valueA < valueB) {
              comparison = 1;
            }
          }
          return comparison;
        }),
      }));
    },
    showTable(val) {
      if (val === "table") {
        let tableData = [];
        if (
          this.chartData &&
          this.chartData.tableData &&
          this.chartData.tableData.length
        ) {
          tableData = this.chartData.tableData;
        } else {
          let tableKey = this.chartType.includes("period")
            ? this.$i18n.t("period")
            : this.$i18n.t("location");
          this.fields = [tableKey];
          this.cObj.series.forEach((s) => {
            if (!s.isBenchmark) {
              let n = s.name;
              if (this.cObj.chart.type === "scatter") {
                this.fields.push(s.xMethod);
                this.fields.push(s.yMethod);
                s.data.forEach((d) => {
                  let itemFoundIndex = tableData.findIndex(
                    (t) => t[tableKey] === d.name
                  );
                  if (itemFoundIndex >= 0) {
                    tableData[itemFoundIndex] = {
                      ...tableData[itemFoundIndex],
                      [s.xMethod]: d.x?.toLocaleString() || d.x,
                      [s.yMethod]: d.y?.toLocaleString() || d.y,
                    };
                  } else {
                    tableData.push({
                      [tableKey]: d.name,
                      [s.xMethod]: d.x?.toLocaleString() || d.x,
                      [s.yMethod]: d.y?.toLocaleString() || d.y,
                    });
                  }
                });
                if (this.cObj?.natData?.length) {
                  let d = this.cObj.natData[0];
                  tableData.unshift({
                    [tableKey]: d.name,
                    [s.xMethod]: d.x?.toLocaleString() || d.x,
                    [s.yMethod]: d.y?.toLocaleString() || d.y,
                    _cellVariants: {
                      [tableKey]: "info",
                      [s.xMethod]: "info",
                      [s.yMethod]: "info",
                    },
                  });
                }
              } else {
                this.fields.push(n);
                s.data.forEach((d, i) => {
                  let dN = d.name;
                  if (s.isHighLow) {
                    dN = this.cObj.series[0].data[i].name;
                  }
                  let itemFoundIndex = tableData.findIndex(
                    (t) => t[tableKey] === dN
                  );
                  if (itemFoundIndex >= 0) {
                    tableData[itemFoundIndex] = {
                      ...tableData[itemFoundIndex],
                      [n]: s.isHighLow
                        ? `${s.lText}: ${d[2]} & -${s.lText}: ${d[0]}`
                        : this.plotType === "packedbubble"
                        ? d.value
                        : d.y?.toLocaleString() || d.y,
                    };
                  } else {
                    tableData.push({
                      [tableKey]: d.name,
                      [n]:
                        this.plotType === "packedbubble"
                          ? d.value?.toLocaleString() || d.value
                          : d.y?.toLocaleString() || d.y,
                    });
                  }
                });
              }
            }
          });
          if (this.isRRChart) {
            let avgObj = {};
            this.cObj.series.forEach((s) => {
              if (!s.isBenchmark) {
                let n = s.name,
                  len = s.data.length,
                  avg = 0;
                s.data.forEach((d) => {
                  avg += d.y;
                });
                avg = avg / len;
                avg = avg.toFixed(2);
                avgObj[n] = avg;
                let itemFoundIndex = tableData.findIndex(
                  (t) => t[tableKey] === this.$i18n.t("avg")
                );
                if (itemFoundIndex >= 0) {
                  tableData[itemFoundIndex] = {
                    ...tableData[itemFoundIndex],
                    [n]: avg?.toLocaleString() || avg,
                    _cellVariants: {
                      ...tableData[itemFoundIndex]["_cellVariants"],
                      [n]: "info",
                    },
                  };
                } else {
                  tableData.push({
                    [tableKey]: this.$i18n.t("avg"),
                    [n]: avg?.toLocaleString() || avg,
                    _cellVariants: {
                      [n]: "info",
                    },
                  });
                }
              }
            });
            tableData = tableData.map((t) => {
              if (t[tableKey] !== this.$i18n.t("avg")) {
                t["_cellVariants"] = {};
                Object.keys(t).forEach((inT) => {
                  if (t[inT] !== tableKey) {
                    if (t[inT] >= this.bValue) {
                      let txt =
                        avgObj[inT] * 1 - t[inT] * 1 > this.subChange * 1
                          ? "warning"
                          : "success";
                      t["_cellVariants"] = {
                        ...t["_cellVariants"],
                        [inT]: txt,
                      };
                    }
                    if (t[inT] < this.bValue) {
                      t["_cellVariants"] = {
                        ...t["_cellVariants"],
                        [inT]: "danger",
                      };
                    }
                  }
                });
                return t;
              } else {
                return t;
              }
            });
          }
          if (this.chartConfigData.chartOptions.chartDrillDown) {
            this.fields.push({
              key: "show_details",
              label: this.$i18n.t("viewMore"),
            });
          }
        }
        this.items = tableData;
      }
      this.$nextTick(() => {
        this.viewType = val;
      });
    },
    exportChart(type) {
      if (this.viewType === "chart") {
        let chart = this.$refs.barCharts.chart;
        let catLen = chart.options.series[0].data.length - 1;
        chart.options.xAxis[0].min = 0;
        chart.options.exporting.chartOptions.title.text = `${
          chart.options.title.title
        }${chart.options.title.text ? " - " + chart.options.title.text : ""}`;

        if (type == "jpg") {
          chart.exportChart({
            type: "image/jpeg",
            filename: "overview-chart",
          });
        } else if (type == "png") {
          chart.exportChart({
            type: "image/png",
            filename: "overview-chart",
          });
        } else if (type == "pdf") {
          chart.exportChart({
            type: "application/pdf",
            filename: "overview-chart",
          });
        }
        setTimeout(() => {
          chart.options.xAxis[0].max = null;
          chart.options.exporting.chartOptions.title.text = "";
          if (this.derivedChart) {
            chart.xAxis[0].setExtremes(catLen - 11, catLen);
          }
        }, 100);
      }
      if (this.viewType === "map") {
        this.$refs.map.exportChart(type);
      }
    },
    getMax(plotValue, dataMax) {
      return plotValue * 1 > dataMax * 1 ? plotValue * 1 + 5 : dataMax;
    },
    getMin(plotValue, dataMin) {
      let m =
        plotValue * 1 < dataMin * 1 && plotValue * 1 - 5 > 0
          ? plotValue * 1 - 5
          : dataMin;
      return m < 0 ? m : 0;
    },
    addEvents() {
      let _this = this;
      this.cObj = {
        ...this.cObj,
        chart: {
          ...this.cObj.chart,
          events: {
            ...this.cObj.chart.events,
            load: function () {
              let yAxis = this.yAxis[0],
                plotLines = yAxis.plotLinesAndBands[0];

              if (plotLines) {
                yAxis.update({
                  max: _this.getMax(plotLines.options.value, yAxis.dataMax),
                  min: _this.getMin(plotLines.options.value, yAxis.dataMin),
                });
              }
            },
            redraw: function () {
              if (_this.redrawEnabled) {
                _this.redrawEnabled = false;
                let yAxis = this.yAxis[0],
                  plotLines = yAxis.plotLinesAndBands[0];
                if (plotLines) {
                  yAxis.update({
                    max: _this.getMax(plotLines.options.value, yAxis.dataMax),
                    min: _this.getMin(plotLines.options.value, yAxis.dataMin),
                  });
                }
                if (_this.chartConfigData?.chartOptions?.chartDrillDown) {
                  yAxis.update({
                    max: _this.getMax(_this.drillDownPoint, yAxis.dataMax),
                    min: _this.getMin(_this.drillDownPoint, yAxis.dataMin),
                  });
                }
                _this.redrawEnabled = true;
              }
            },
            drillup: function (e) {
              _this.drillDown = false;
              if (
                _this.chartConfigData.chartOptions &&
                _this.chartConfigData.chartOptions.yAxis &&
                _this.chartConfigData.chartOptions.yAxis.visible
              ) {
                this.yAxis[0].setTitle({
                  text:
                    _this.chartConfigData.chartOptions.yAxis?.text[
                      _this.$i18n.locale
                    ] || "",
                });
              }
              if (_this.drillPointBenchmark) {
                _this.drillDownPoint = 0;
                this.yAxis[0].removePlotLine("p1");
                _this.nationalRegionReportingTrendOutlier = [];
              }
              if (_this.drillSD) {
                _this.drillICOutliers = [];
              }
            },
            drilldown: function (e) {
              _this.drillDown = true;
              this.yAxis[0].setTitle({
                text:
                  _this.chartConfigData?.chartOptions?.drillYTitle[
                    _this.$i18n.locale
                  ] || "",
              });
              if (_this.drillPointBenchmark) {
                let y = 0;
                this.options.series[0].data.forEach((d) => {
                  if (d.drilldown === e.seriesOptions.name) {
                    y = d.y;
                  }
                });
                _this.drillDownPoint = y;
                let outlier = [];
                e.seriesOptions.data.forEach((s) => {
                  if (s.y * 1 > _this.drillDownPoint * 1) {
                    _this.drillDownPoint = s.y * 1;
                  }
                  if (s.y * 1 < y * 1) {
                    let v = s.y ? `${s.y}%` : _this.$i18n.t("noData");
                    outlier.push(`${s.name} (${v})`);
                  }
                });
                if (outlier.length) {
                  _this.nationalRegionReportingTrendOutlier = outlier;
                } else {
                  _this.nationalRegionReportingTrendOutlier = [
                    _this.$i18n.t("noRegionsFound"),
                  ];
                }
                // let txt =
                //   _this.chartConfigData.chartOptions.drillCalculation ===
                //   "DEFAULT"
                //     ? `${this.options.series[0].name} (${e.seriesOptions.name}): ${y}%`
                //     : `${e.seriesOptions.name}: ${y}%`;
                let txt = `${e.seriesOptions.name}: ${y}%`;
                this.yAxis[0].addPlotLine({
                  id: "p1",
                  value: y,
                  percValue: undefined,
                  valueType: "percentage",
                  color: "#0000ff",
                  width: 2,
                  zIndex: 5,
                  dashStyle: "solid",
                  label: {
                    enabled: true,
                    text: txt,
                    textVisible: "",
                    align: "center",
                    y: _this.cObj.chart.type.includes("bar") ? 150 : -5,
                    style: {
                      color:
                        _this.$store.getters.getTheme === "white"
                          ? "#000"
                          : "#f6f6f6",
                    },
                  },
                });
              }
              if (_this.drillSD) {
                let minus2SD = [],
                  plus2SD = [],
                  mainSeries = {
                    name: e.seriesOptions.name,
                    type: e.seriesOptions.type,
                    period: e.seriesOptions.period,
                    sName: e.seriesOptions.sName,
                    data: [],
                    visible: true,
                    color: "#7cb5ec",
                  },
                  standardDeviation = null;
                // oDrillDownSeries.series
                _this.drillICOutliers = [
                  {
                    name: e.seriesOptions.name,
                    outliers: [],
                  },
                ];
                e.seriesOptions.data.forEach((d) => {
                  standardDeviation = d.standardDeviationValue;
                  if (d.outlier) {
                    _this.drillICOutliers[0].outliers.push(d.name);
                  }
                  let dLow = null,
                    dHigh = null,
                    dY = null;
                  if (d.lowd) {
                    dLow = d.lowd.toFixed(1) * 1;
                  }
                  if (d.highd) {
                    dHigh = d.highd.toFixed(1) * 1;
                  }
                  if (d.y) {
                    dY = d.y.toFixed(1) * 1;
                  }
                  minus2SD.push({
                    name: d.name,
                    y: dLow,
                    locationID: d.locationID,
                    levelID: d.levelID,
                    period: d.period,
                  });
                  plus2SD.push({
                    name: d.name,
                    y: dHigh,
                    locationID: d.locationID,
                    levelID: d.levelID,
                    period: d.period,
                  });
                  mainSeries.data.push({
                    name: d.name,
                    y: dY,
                    color: d.color,
                    locationID: d.locationID,
                    levelID: d.levelID,
                    period: d.period,
                  });
                });
                let obj1 = {
                    name: _this.$i18n.t("min2SD", {
                      standardDeviation,
                    }),
                    period: e.seriesOptions.period,
                    sName: e.seriesOptions.sName,
                    data: minus2SD,
                    type: "line",
                    visible: true,
                    marker: {
                      symbol: "square",
                    },
                    lineWidth: 0,
                    states: {
                      hover: {
                        // enabled: false,
                        lineWidth: 0,
                        lineWidthPlus: 0,
                      },
                    },
                    color: "#fcb241",
                  },
                  obj2 = {
                    name: _this.$i18n.t("max2SD", {
                      standardDeviation,
                    }),
                    period: e.seriesOptions.period,
                    sName: e.seriesOptions.sName,
                    data: plus2SD,
                    type: "line",
                    visible: true,
                    marker: {
                      symbol: "square",
                    },
                    lineWidth: 0,
                    states: {
                      hover: {
                        // enabled: false,
                        lineWidth: 0,
                        lineWidthPlus: 0,
                      },
                    },
                    color: "#2f7ed8",
                  };

                this.addSingleSeriesAsDrilldown(e.point, mainSeries);
                this.addSingleSeriesAsDrilldown(e.point, obj1);
                this.addSingleSeriesAsDrilldown(e.point, obj2);
                this.applyDrilldown();
              }
            },
          },
        },
        plotOptions: {
          ...this.cObj.plotOptions,
          series: {
            ...this.cObj.plotOptions.series,
            events: {
              legendItemClick: function (e) {
                if (!_this.drillDown) {
                  let isFound = _this.cObj.series.findIndex(
                    (s) => s.name === this.name
                  );
                  if (isFound >= 0) {
                    if (_this.cObj.series[isFound].isBenchmark) {
                      _this.sweetAlert({
                        title: _this.$i18n.t("noAction"),
                      });
                      return false;
                    } else {
                      _this.cObj.series[isFound] = {
                        ..._this.cObj.series[isFound],
                        visible: !_this.cObj.series[isFound].visible,
                      };
                    }
                  }
                }
              },
              click: function (e) {
                if (_this.drillDown) {
                  _this.drillDown = false;
                  _this.updateToolBar(e);
                }
              },
            },
          },
        },
      };
    },
    applyLabels() {
      this.cObj.plotOptions = {
        ...this.cObj.plotOptions,
        series: {
          ...this.cObj.plotOptions.series,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.point.label;
            },
          },
        },
      };
    },
    setR2() {
      let _this = this;
      this.cObj.chart.events = {
        ...this.cObj.chart.events,
        load: function () {
          var chart = this;
          chart.renderer
            .html(
              `<span class="highchart-theme">R<sup>2</sup> : ${_this.r2}</span>`,
              chart.plotWidth - 30,
              chart.plotHeight - 40
            )
            .css({
              fontSize: "13px",
              color: "#FFFFFF",
              fontWeight: 600,
              backgroundColor: "#f1f1f14d",
              padding: "10px",
              border: "1px solid #c4c4c4",
              borderRadius: "4px",
            })
            .add();
        },
      };
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
    setYMin() {
      let m = 0;
      this.cObj.series.forEach((s) => {
        s.data.forEach((d) => {
          if (d.y < m) {
            m = d.y;
          }
        });
      });
      this.cObj.yAxis.min = m;
    },
    addValues(row) {
      let drillItems = [];
      let filterSubItems = this.cObj.drilldown.series.filter(
        (items) => items.period === row.item[this.$i18n.t("period")]
      );
      filterSubItems.forEach((s) => {
        s.data.map((item) => {
          let isD = drillItems.findIndex(
            (d) => d[this.$i18n.t("location")] === item.name
          );
          if (isD >= 0) {
            drillItems[isD] = {
              ...drillItems[isD],
              [`${s.name}`]: item.y,
            };
          } else {
            drillItems.push({
              [this.$i18n.t("location")]: item.name,
              [`${s.name}`]: item.y,
            });
          }
        });
      });
      this.drillTable[row.item[this.$i18n.t("period")]] = drillItems;
      row.toggleDetails();
    },
    async updateToolBar(e) {
      let childObj = [
        {
          id: e.point.options.levelID + "/" + e.point.options.locationID,
          name: e.point.options.name,
          label: e.point.options.name,
          children: null,
          level: e.point.options.levelID,
          parent: {
            id: this.locationPeriod.location.split("/")[1],
            name: this.locationPeriod.locationName,
          },
        },
      ];
      let obj = {
        id: e.point.options.levelID + "/" + e.point.options.locationID,
        monthYear: ["monthly"].includes(this.locationPeriod.periodType)
          ? this.$moment(e.point.options.period, "YYYYMM").format("YYYY-MM")
          : ["financialYear", "financialYearJuly"].includes(
              this.locationPeriod.periodType
            )
          ? e.point.options.period.slice(0, 4)
          : e.point.options.period,
        pType: this.locationPeriod.periodType,
        children: childObj,
      };
      this.$emit("updateToolBar", obj);
    },
  },
  created() {
    this.viewType =
      this.chartConfigData?.chartOptions?.chartDefaultView || "chart";
    if (this.cObj.chart.type === "packedbubble") {
      this.getGeoJson();
    }
    let height =
      this.cObj.chart.type === "packedbubble" ? this.cObj.chart.height : null;
    this.cObj = {
      ...this.cObj,
      chart: {
        ...this.cObj.chart,
        height,
      },
    };

    this.plotType = this.cObj.chart.oType
      ? this.cObj.chart.oType
      : this.cObj.chart.type;
    if (this.r2 >= 0) {
      this.setR2();
    }
    if (this.showLabels) {
      this.applyLabels();
    }
    this.addEvents();
    if (this.cObj.chart.type !== "packedbubble") {
      this.setYMin();
    }
  },
};
</script>

<style scoped></style>
