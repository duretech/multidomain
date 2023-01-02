<template>
  <div>
    <div class="card border-radius-0">
      <!-- <div class="card-header px-2 py-0 text-decoration-none">
        <div class="row no-gutters">
          <div class="col-lg-12 col-md-12 p-t-4px" :title="indiName">
            <div class="cardTitleSection text-wrap">
              <p class="title_p m-0">{{ indiName }}</p>
            </div>
          </div>
        </div>
      </div> -->
      <div class="row px-3 pt-2">
        <div class="col-sm-12">
          <a @click="setView" class="float-right cursor-pointer"
            ><small class="text-secondary" style="font-weight: 300"
              ><i class="fa fa-arrow-left"></i> {{$t('backToMap')}}</small
            ></a
          >
        </div>
        <div
          class="col-sm-12 my-2 pb-3"
          style="
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ddd;
          "
        >
          <!-- <b-form-radio-group
          v-model="selectedChartType"
          :options="options"
          class="mb-3 "
          value-field="item"
          text-field="name"
          disabled-field="notEnabled"
        >
        <b-form-radio >{{o.name}}</b-form-radio>
          </b-form-radio-group> -->
          <b-form-group class="mb-0">
            <b-form-radio-group
              id="radio-group-2"
              v-model="selectedChartType"
              name="radio-sub-component"
              class="mapRadioButton"
            >
              <b-form-radio value="column"
                ><i class="fa fa-bar-chart" aria-hidden="true"></i>
                {{$t("column")}}</b-form-radio
              >
              <b-form-radio value="area"
                ><i class="fa fa-area-chart" aria-hidden="true"></i>
                {{$t("area")}}</b-form-radio
              >
              <b-form-radio value="line"
                ><i class="fa fa-minus" aria-hidden="true"></i>
                {{$t("line")}}</b-form-radio
              >
              <b-form-radio value="bar"
                ><i class="fa fa-bars" aria-hidden="true"></i> {{$t("bar_type")}}</b-form-radio
              >
              <b-form-radio value="spline"
                ><i class="fa fa-line-chart" aria-hidden="true"></i>
                {{$t("spline")}}</b-form-radio
              >
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <div class="card-body pb-0" style="height: 100vh">
        <div class="row">
          <div class="col-12" v-if="chartData">
            <highcharts :options="chartData" ref="inputCharts"></highcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
export default {
  components: {},
  watch: {
    selectedChartType(newVal) {
      //this.selectedChartType = newVal
      this.massageData();
    },
  },
  data() {
    // console.log(this.indiName)
    // console.log(this.periodList)
    return {
      selectedChartType: "column",
      // options: [
      //   { item: 'column', name: 'Column'},
      //   { item: 'bar', name: 'Bar' },
      //   { item: 'line', name: 'Line' },
      //   { item: 'area', name: 'Area' }
      // ],
      compData: this.data,
      compPeriods: this.periodList,
      seriesData: [],
      chartData: null,
    };
  },
  props: ["data", "periodList", "indiName"],
  methods: {
    setView() {
      // console.log('cha')
      this.$emit("setView", "map");
    },
    massageData() {
      this.$store.state.loading = true;
      let chartData = {
        chart: {
          type: this.selectedChartType ? this.selectedChartType : "column",
          zoomType: "x",
          events: {},
        },
        title: {
          text: this.indiName,
        },
        xAxis: {
          categories: [],
        },
        yAxis: {
          // min: 0,
          title: {
            text: "",
          },
          plotLines: [],
        },
        legend: {
          reversed: true,
          backgroundColor: "transparent",
          borderColor: "#a7a7a7",
          borderWidth: 1,
          borderRadius: 5,
          // itemDistance: 50
        },
        plotOptions: {
          series: {
            //stacking: "normal"
          },
        },
        exporting: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        series: [],
      };
      let locationArray = [],
        seriesArray = [],
        categories = [];

      Object.keys(this.compData).forEach((y, i) => {
        this.compData[y].forEach((d, j) => {
          if (locationArray.indexOf(d.name) == -1) {
            locationArray.push(d.name);
          }
        });
        let val = this.periodList.filter((item) => item.value == y);
        categories.push(val[0].text);
      });

      locationArray.forEach((loc, i) => {
        let visible = false;
        if (i == 0) {
          visible = true;
        }
        let obj = { name: loc, data: [], visible: visible };
        this.periodList.forEach((p) => {
          let dataObj = [];
          if (this.compData[p.value]) {
            dataObj = this.compData[p.value].filter((obj) => obj.name == loc);
          }

          if (dataObj.length > 0) {
            obj.data.push(Number(dataObj[0].value));
          }
        });
        seriesArray.push(obj);
      });
      seriesArray.reverse();

      this.seriesData = seriesArray;
      chartData.series = seriesArray;
      chartData.xAxis.categories = categories;
      this.chartData = chartData;
      this.$store.state.loading = false;
    },
  },
  created() {
    this.massageData();
  },
};
</script>
<style scoped>
.dashboardchart-container .card .card-header {
  border-radius: 0px;
}
</style>
