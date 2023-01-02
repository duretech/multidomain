<template>
  <div class="tab-content" id="benchmarking-sub-tabContent">
    <div
      class="tab-pane fade"
      :class="[activeTab === 'total' ? 'show active' : '']"
      id="benchmarking-comclient"
      role="tabpanel"
      aria-labelledby="benchmarking-comclient-tab"
    >
      <div class="row">
        <div
          class="col-12"
          v-if="
            !chartOptions[0].disableChart &&
            oTotalCypyRegConf &&
            oTotalCypyRegConf.series.length &&
            higherRegion
          "
        >
          <chartTableToggleComp
            :title="chartOptions[0].chartName"
            :chartData="oTotalCypyRegConf"
            source="DHIS 2"
            chartRef="oTotalCypyRegConf"
            sortMenu="type2"
            :chartInfo="chartOptions[0].chartInfo"
            :cid="chartOptions[0].cid"
            :excludeHigherRegion="false"
            :higherRegionName="higherRegion"
            :originalData="oTotalCypyRegConfOriginalData"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[1].disableChart &&
            oTotalCypTrendConf &&
            oTotalCypTrendConf.series.length
          "
        >
          <chartTableToggleComp
            :title="chartOptions[1].chartName"
            :chartData="oTotalCypTrendConf"
            source="DHIS 2"
            chartRef="oTotalCypTrendConf"
            sortMenu="type3"
            :chartInfo="chartOptions[1].chartInfo"
            :cid="chartOptions[1].cid"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[2].disableChart &&
            oAvgMethodMixChartConf &&
            oAvgMethodMixChartConf.series.length &&
            higherRegion
          "
        >
          <chartTableToggleComp
            :title="chartOptions[2].chartName"
            :chartData="oAvgMethodMixChartConf"
            source="DHIS 2"
            chartRef="oAvgMethodMixChartConf"
            sortMenu="type2"
            :chartInfo="chartOptions[2].chartInfo"
            :cid="chartOptions[2].cid"
            :excludeHigherRegion="false"
            :higherRegionName="higherRegion"
            :originalData="oAvgMethodMixChartConfOriginalData"
            :sortWithCat="true"
            :periodType="periodType"
          />
        </div>
      </div>
    </div>
    <div
      class="tab-pane fade"
      :class="[activeTab !== 'total' ? 'show active' : '']"
      id="benchmarking-comfacilities"
      role="tabpanel"
      aria-labelledby="benchmarking-comfacilities-tab"
    >
      <div class="row">
        <div
          class="col-12"
          v-if="
            !chartOptions[3].disableChart &&
            oMostCommonMethodMix &&
            oMostCommonMethodMix.series.length &&
            higherRegion &&
            activeTab !== 'total' &&
            activeTabKey === 'geoMethodTab'
          "
        >
          <chartTableToggleComp
            :title="chartOptions[3].chartName"
            :chartData="oMostCommonMethodMix"
            source="DHIS 2"
            chartRef="oMostCommonMethodMix"
            :chartInfo="chartOptions[3].chartInfo"
            :cid="chartOptions[3].cid"
            :excludeHigherRegion="false"
            :higherRegionName="higherRegion"
            :originalData="oMostCommonMethodMixOriginalData"
            ref="bubbleChart"
            :period="period"
            :defaultLocationID="defaultLocationID"
            :locationName="locationName"
            :defaultLevelID="defaultLevelID"
            :subLevelID="subLevelID"
            :periodLength="periodLength"
            :mapObj="mapObj"
            :resetCurrentLevel="resetCurrentLevel"
            :locationChanged="locationChanged"
            :toolbarLevelID="toolbarLevelID"
            :toolbarLocationID="toolbarLocationID"
            :facilityLevelID="facilityLevelID"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mt-4"
          v-if="
            !chartOptions[4].disableChart &&
            oComparingMethodMix &&
            oComparingMethodMix.series.length &&
            higherRegion
          "
        >
          <chartTableToggleComp
            :title="chartOptions[4].chartName"
            :chartData="oComparingMethodMix"
            source="DHIS 2"
            chartRef="oComparingMethodMix"
            :chartInfo="chartOptions[4].chartInfo"
            :cid="chartOptions[4].cid"
            :excludeHigherRegion="false"
            :higherRegionName="higherRegion"
            :originalData="oComparingMethodMixOriginalData"
            :periodType="periodType"
          />
        </div>
        <div
          class="col-12 mb-5 mt-4"
          v-if="oGeoData && !chartOptions[5].disableChart"
        >
          <highchartTable
            :data="oGeoData"
            :period="period"
            :periodType="periodType"
            :min="-5"
            :max="5"
            :title="chartOptions[5].chartName"
            type="Source"
            :chartInfo="chartOptions[5].chartInfo"
            :cid="chartOptions[5].cid"
            ref="trendMatrixTable"
            :methodSeq="methSeq"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import chartTableToggleComp from "../programPriorities/chartTableToggleComp.vue";
import oChartConfig from "./geographicalchartconfig";
import geoCalc from "./geoCalc";
import highchartTable from "./highcharttable";
import {
  translateDate,
  formatSingleDate,
} from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";

export default {
  props: [
    "rawGeoData",
    "methodConf",
    "period",
    "chartOptions",
    "cypFactors",
    "dataType",
    "defaultLocationID",
    "locationName",
    "defaultLevelID",
    "subLevelID",
    "periodLength",
    "mapObj",
    "resetCurrentLevel",
    "locationChanged",
    "toolbarLevelID",
    "toolbarLocationID",
    "facilityLevelID",
    "methodSeq",
    "activeTab",
    "activeTabKey",
    "periodType",
    "calsType",
    "subMethodConf",
    "applicationFinalYear",
    "reportChartData",
  ],
  mixins: [getCIDMixin],
  components: {
    chartTableToggleComp,
    highchartTable,
  },
  data() {
    return {
      oTotalCypyRegConf: { ...oChartConfig.totalCypChartConfig },
      oTotalCypyRegConfOriginalData: null,
      oTotalCypTrendConf: { ...oChartConfig.totalCyptrendChartConfig },
      oMostCommonMethodMix: { ...oChartConfig.methodMix },
      oMostCommonMethodMixOriginalData: null,
      oComparingMethodMix: { ...oChartConfig.comparingMethodMix },
      oComparingMethodMixOriginalData: null,
      oAvgMethodMixChartConf: { ...oChartConfig.avgMethodMixChartConfig },
      oAvgMethodMixChartConfOriginalData: null,
      tableChartMethods: null,
      oGeoData: null,
      rawGeoDataLocal: this.rawGeoData,
      higherRegion: "",
      exportArr: [],
      bubbleChartHeader: "",
      trendMatrixTableHeader: "",
      methSeq: [],
    };
  },
  watch: {
    rawGeoData: {
      // watch it
      handler(newVal) {
        if (newVal) this.rawGeoDataLocal = newVal;
        this.loadGeoProgressCharts();
      },
      deep: true,
    },
    higherRegion(newVal) {
      if (newVal) {
        this.loadGeoProgressCharts();
      }
    },
    calsType(newVal) {
      if (newVal) {
        this.methSeq = [];
        this.oTotalCypyRegConf.series = [];
        this.oTotalCypTrendConf.series = [];
        this.oAvgMethodMixChartConf.series = [];
        this.oMostCommonMethodMix.series = [];
        this.oComparingMethodMix.series = [];
        this.oGeoData = null;
        this.$nextTick(() => {
          this.loadGeoProgressCharts();
        });
      }
    },
  },
  created() {
    this.rawGeoDataLocal = this.rawGeoData;
    // this.higherRegion = service.getLocationName(this.defaultLocationID)
    service.getIndividualOrganisation(this.defaultLocationID).then((key) => {
      // console.log(key)
      this.higherRegion = key.data.displayName;
    });
  },
  methods: {
    async exportPPT(map) {
      this.$store.state.loading = true;
      let bubbleChart = await this.$refs.bubbleChart.getScreenShot();
      let trendMatrixTable = await this.$refs.trendMatrixTable.getTableData();
      if (trendMatrixTable.data.length) {
        this.exportArr.push({
          cardKey: "key6",
          title: { title: this.trendMatrixTableHeader },
          min: -5,
          max: 5,
          ...trendMatrixTable,
        });
      }
      // console.log(bubbleChart)
      let dataType = this.dataType.split("_")[1]
        ? `${this.dataType.split("_")[0]} ${this.dataType.split("_")[1]}`
        : this.dataType;
      this.$store.state.loading = false;
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<div><input id="fileName" class="swal2-input" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="Geograpgical Progress"/></div>' +
          '<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">' +
          this.$i18n.t("legends") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">' +
          this.$i18n.t("values") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">' +
          this.$i18n.t("x-axis") +
          "</label></div>" +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">' +
          this.$i18n.t("y-axis") +
          "</label></div></div>",
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
        preConfirm: () => {
          return [
            document.getElementById("fileName").value,
            document.getElementById("showLegends").checked
              ? document.getElementById("showLegends").value
              : "",
            document.getElementById("showValues").checked
              ? document.getElementById("showValues").value
              : "",
            document.getElementById("showXAxis").checked
              ? document.getElementById("showXAxis").value
              : "",
            document.getElementById("showYAxis").checked
              ? document.getElementById("showYAxis").value
              : "",
          ];
        },
      });

      if (formValues) {
        let period = translateDate({
          rawDate: this.period,
          periodType: this.periodType,
        });
        geoCalc.exportPPT(
          this.exportArr,
          formValues,
          map,
          {
            cardKey: "key4",
            header: this.bubbleChartHeader,
            screenShot: bubbleChart,
          },
          this.locationName,
          period,
          dataType,
          this.$moment
        );
      }
    },
    loadGeoProgressCharts() {
      let cypData = this.$store.getters.getGlobalFactors();
      let totalCYPName = this.$i18n.t("Total CYP");
      if (this.dataType === "Visits") {
        totalCYPName = this.$i18n.t("Total Visits");
      }
      if (this.dataType === "User") {
        totalCYPName = this.$i18n.t("Total Users");
      }
      let period = formatSingleDate({
        rawDate: this.period,
        periodType: this.periodType,
      });

      // console.log("period", period)
      let methConf = [];
      if (this.calsType == "aggregate") {
        methConf = this.methodConf;
      } else {
        methConf = this.subMethodConf;
      }
      let bCommodities =
          this.dataType === "Commodities_Client" ||
          this.dataType === "Commodities_Facilities",
        oCypRet = geoCalc.calculateCypFactors(
          cypData.cyp[this.dataType],
          this.cypFactors
        ),
        oRetData = geoCalc.getTotalData(
          this.rawGeoDataLocal,
          methConf,
          oCypRet,
          this.dataType,
          period,
          this.defaultLocationID,
          this.$i18n.locale,
          totalCYPName,
          this.$i18n.t("method"),
          this.periodType,
          this.calsType,
          this.$moment
        ),
        oMethodMix = geoCalc.getMethodMixChartDataNew(
          oRetData,
          this.$i18n.t("method")
        );

      // console.log("oMethodMix",oMethodMix)
      // console.log("oCypRet",oCypRet)
      // console.log("oRetData",oRetData)
      // console.log(this.methodConf)
      let series = oRetData.series.map((s) => {
        let color = null;
        let method = methConf.find((m) => m.name === s.name);
        if (method) {
          color = method.color;
        }
        return { ...s, color };
      });
      // let min = 0, max = 0
      // oRetData.series.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min) {
      //       min = innerMin
      //     }
      //     if(innerMax > max) {
      //       max = innerMax
      //     }
      // })
      // this.oTotalCypyRegConf.yAxis.min = min > 0 ? 0 : min
      // this.oTotalCypyRegConf.yAxis.max = max
      // console.log(min)
      // console.log(max)
      // let noCatSeries = series.map(s => ({
      //   ...s,
      //   data: s.data.map((d,i) => ({"name": oRetData.categories[i], "y": d}))
      // }))
      // console.log("line 320")
      this.oTotalCypyRegConf.series = series;
      this.oTotalCypyRegConf.title.title = this.chartOptions[0].chartName;
      if (this.oTotalCypyRegConf.series.length) {
        this.exportArr.push({ cardKey: "key1", ...this.oTotalCypyRegConf });
      }
      this.oTotalCypyRegConfOriginalData = series;
      this.oTotalCypyRegConf.xAxis.min = 0;
      let oTotalCypyRegConf = series.find((s) => s.data.length);
      this.oTotalCypyRegConf.xAxis.max =
        oTotalCypyRegConf?.data?.length > 11 && !this.reportChartData
          ? 11
          : oTotalCypyRegConf?.data?.length - 1;
      // this.oTotalCypyRegConf.xAxis.categories = oRetData.categories;
      this.oTotalCypyRegConf.tableData = oRetData.cypTable;
      /* changing yAxis label */
      this.oTotalCypyRegConf.yAxis.title.text = this.chartOptions[0].yAxis.text;
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[0].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[0].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[0].cid)
        this.$emit("setReportChart", {
          chartObj: this.oTotalCypyRegConf,
          chartName: this.chartOptions[0].chartName,
          cid: [cid],
        });
      }
      // console.log(this.oTotalCypyRegConf)
      /*  */
      // console.log("line 333")
      // let min1 = 0, max1 = 0
      // oRetData.lineSeries.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min1) {
      //       min1 = innerMin
      //     }
      //     if(innerMax > max1) {
      //       max1 = innerMax
      //     }
      // })
      // this.oTotalCypTrendConf.yAxis.min = min1 > 0 ? 0 : min1
      // this.oTotalCypTrendConf.yAxis.max = max1
      // console.log("oTotalCypTrendConf", oRetData.lineSeries)
      series = oRetData.lineSeries.map((s) => {
        let color = null;
        let method = methConf.find((m) => m.name === s.name);
        if (method) {
          color = method.color;
        }
        return { ...s, color };
      });
      // console.log("oTotalCypTrendConf series", series)
      // let noCatSeries = series.map(s => ({
      //   ...s,
      //   data: s.data.map((d,i) => ({"name": oRetData.lineCats[i], "y": d}))
      // }))
      // console.log("oTotalCypTrendConf noCatSeries", noCatSeries)
      this.oTotalCypTrendConf.series = series;
      // this.oTotalCypTrendConf.xAxis.categories = oRetData.lineCats;
      this.oTotalCypTrendConf.tableData = oRetData.trendTable;
      this.oTotalCypTrendConf.yAxis.title.text =
        this.chartOptions[1].yAxis.text;
      this.oTotalCypTrendConf.title.title = this.chartOptions[1].chartName;
      if (this.oTotalCypTrendConf.series.length) {
        this.exportArr.push({ cardKey: "key2", ...this.oTotalCypTrendConf });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[1].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[1].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[1].cid)
        this.$emit("setReportChart", {
          chartObj: this.oTotalCypTrendConf,
          chartName: this.chartOptions[1].chartName,
          cid: [cid],
        });
      }
      /*  */
      // console.log("line 370")
      // console.log(oRetData.bubbleSeries)
      series = oRetData.bubbleSeries.map((s) => {
        let color = null;
        let method = methConf.find((m) => m.name === s.name);
        if (method) {
          color = method.color;
        }
        return { ...s, color };
      });
      this.oMostCommonMethodMix.series = series;
      this.oMostCommonMethodMixOriginalData = series;
      this.oMostCommonMethodMix.tableData = oRetData.bubbleTable;
      this.bubbleChartHeader = this.chartOptions[3].chartName;
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[3].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[3].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[3].cid)
        this.$emit("setReportChart", {
          chartObj: this.oMostCommonMethodMix,
          chartName: this.chartOptions[3].chartName,
          cid: [cid],
        });
      }
      /*  */
      //console.log(this.oMostCommonMethodMix.series)
      // this.oComparingMethodMix.series = oMethodMix.finalData;
      series = oMethodMix.finalData.map((s) => {
        let color = null;
        let method = methConf.find((m) => m.name === s.name);
        if (method) {
          color = method.color;
        }
        return { ...s, color };
      });
      // console.log("oComparingMethodMix series",series)
      // oMethodMix.aggData.map(s => {
      //   let color = null
      //   let method = this.methodConf.find(m => m.name === s.name)
      //   if(method) {
      //     color = method.color
      //   }
      //   return {...s, color}
      // })
      // let noCatSeries = series.map(s => ({
      //   ...s,
      //   data: s.data.map((d,i) => ({"name": oRetData.categories[i], "y": d}))
      // }))
      // console.log("line 408")
      this.oComparingMethodMix.series = series.reverse();
      // console.log("oComparingMethodMix obj",this.oComparingMethodMix)
      // this.oComparingMethodMix.plotOptions.series.stacking = 'percent'
      this.oComparingMethodMixOriginalData = series;
      this.oComparingMethodMix.xAxis.min = 0;
      let oComparingMethodMix = series.find((s) => s.data.length);
      this.oComparingMethodMix.xAxis.max =
        oComparingMethodMix?.data?.length > 11 && !this.reportChartData
          ? 11
          : oComparingMethodMix?.data?.length - 1;
      // this.oComparingMethodMix.numbersData = [...oMethodMix.finalData];
      this.oComparingMethodMix.tableData = oMethodMix.table;
      // this.oComparingMethodMix.xAxis.categories = oRetData.categories;
      this.oComparingMethodMix.title.title = this.chartOptions[4].chartName;
      if (this.oComparingMethodMix.series.length) {
        this.exportArr.push({ cardKey: "key5", ...this.oComparingMethodMix });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[4].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[4].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[4].cid)
        this.$emit("setReportChart", {
          chartObj: this.oComparingMethodMix,
          chartName: this.chartOptions[4].chartName,
          cid: [cid],
        });
      }
      /*  */
      // console.log("line 421")
      /* console.log(oRetData,this.$moment(this.period, 'YYYYMM').subtract(12, 'months').format('MMM YYYY'));
          console.log(geoCalc.calculateAvgMethodMix(oRetData,this.period)); */
      let oAvgMM = geoCalc.calculateAvgMethodMix(
        oRetData,
        this.period,
        12,
        true,
        this.$i18n.locale,
        totalCYPName,
        this.$i18n.t("method"),
        null,
        this.periodType,
        this.$moment
      );
      // console.log("oAvgMM",oAvgMM)
      // let min2 = 0, max2 = 0
      // oAvgMM.series.forEach(d => {
      //     // let innerDataArr = d.data.map(dInner => dInner.y)
      //     let innerMin = Math.min(...d.data)
      //     let innerMax = Math.max(...d.data)
      //     if(innerMin < min2) {
      //       min2 = innerMin
      //     }
      //     if(innerMax > max2) {
      //       max2 = innerMax
      //     }
      // })
      // this.oAvgMethodMixChartConf.yAxis.min = min2 > 0 ? 0 : min2
      // this.oAvgMethodMixChartConf.yAxis.max = max2
      series = oAvgMM.series.map((s) => {
        let color = null;
        let method = methConf.find((m) => m.name === s.name);
        if (method) {
          color = method.color;
        }
        return { ...s, color };
      });
      let noCatSeries = series.map((s) => ({
        ...s,
        data:
          s.data.length > 0
            ? s.data.map((d, i) => ({ name: oRetData.categories[i], y: d }))
            : [],
      }));

      // console.log("noCatSeries", noCatSeries)
      let compData = [];
      let totalRow = noCatSeries.find(
        (m, i) =>
          m.name === this.$i18n.t("Total CYP") ||
          m.name === this.$i18n.t("Total Visits") ||
          m.name === this.$i18n.t("Total Users")
      );
      if (totalRow) {
        compData.push(totalRow);
      }
      methConf.forEach((v, i) => {
        this.methSeq.push(v.name);
        //  console.log("methodSeq", v)
        let innerRow = noCatSeries.find((m, i) => m.name === v.name);
        // console.log("methodSeq innerRow", innerRow)
        if (innerRow) {
          compData.push(innerRow);
        }
      });

      //this.oAvgMethodMixChartConf.series = noCatSeries;
      // console.log("compData", compData)
      this.oAvgMethodMixChartConf.series = compData;
      this.oAvgMethodMixChartConfOriginalData = compData;
      this.oAvgMethodMixChartConf.xAxis.min = 0;
      let oAvgMethodMix = noCatSeries.find((s) => s.data.length);
      this.oAvgMethodMixChartConf.xAxis.max =
        oAvgMethodMix?.data?.length > 11 && !this.reportChartData
          ? 11
          : oAvgMethodMix?.data?.length - 1;
      this.oAvgMethodMixChartConf.tableData = oAvgMM.table;
      // this.oAvgMethodMixChartConf.xAxis.categories = oRetData.categories;
      this.oAvgMethodMixChartConf.yAxis.title.text =
        this.chartOptions[2].yAxis.text;
      this.oAvgMethodMixChartConf.title.title = this.chartOptions[2].chartName;
      if (this.oAvgMethodMixChartConf.series.length) {
        this.exportArr.push({
          cardKey: "key3",
          ...this.oAvgMethodMixChartConf,
        });
      }
      if (
        this.reportChartData &&
        (this.reportChartData.cid.split("/")[1] === this.chartOptions[2].cid ||
          this.reportChartData.linkedCharts.find((c) => c.includes(this.chartOptions[2].cid)))
      ) {
        let cid = this.getCID(this.reportChartData, this.chartOptions[2].cid)
        this.$emit("setReportChart", {
          chartObj: this.oAvgMethodMixChartConf,
          chartName: this.chartOptions[2].chartName,
          cid: [cid],
        });
      }
      /*  */
      // console.log("oRetData", this.oRetData)
      this.oGeoData = oRetData;
      // console.log("oGeoData", this.oGeoData)
      // console.log("Table disable", this.chartOptions[5].disableChart)
      this.trendMatrixTableHeader = this.chartOptions[5].chartName;
      //console.log(this.oGeoData)
      /* let oChartTable = geoCalc.calculateAvgMethodMix(oRetData,this.period,2),
              aHighChartTable = geoCalc.calculateHighChartTable(oChartTable,oRetData.categories);
          this.tableChartMethods = oChartTable.methods;
          this.tableChartData = aHighChartTable; */
    },
    showAlert() {
      this.$swal({
        title: this.$i18n.t("error"),
        text: this.$i18n.t("somethingwentwrong"),
      });
    },
  },
};
</script>
