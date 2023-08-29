<template>
  <div class="card summary-highchart-body">
    <div class="card-header p-10px text-decoration-none">
      <div class="row no-gutters">
        <div class="col-lg-10 col-md-10 p-t-4px summary-chart-title">
          <i
            class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2"
            aria-hidden="true"
            v-b-popover.hover.rightbottom="{
              variant: 'info',
              content: chartInfo,
              title: data.source ? chartName + ': ' + data.source : chartName,
              html: true,
            }"
          ></i
          >{{ chartName }}{{ data.source ? `: ${data.source}` : "" }}
        </div>
        <div
          class="col-lg-2 col-md-2"
          v-if="
            locationPeriod.periodType == 'monthly' &&
            tableChartMethods &&
            Object.keys(tableChartMethods).length > 0
          "
        >
          <dropdown
            :ddVal="timeFrequency"
            :ddoptions="dropDownOptions"
            :onChangeFn="getMonthsVal"
          />
        </div>
      </div>
    </div>
    <div class="card-body pb-0">
      <div class="table-responsive h-300px">
        <table
          class="table table-striped table-bordered"
          v-if="tableChartMethods && Object.keys(tableChartMethods).length > 0"
        >
          <thead>
            <th>{{ $t("location") }}/{{ $t("method") }}</th>
            <th v-for="(sTh, ind) in tableChartMethods" :key="ind">
              {{ sTh }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(oTr, rowInd) in tableChartData" :key="rowInd">
              <template v-for="(oTd, cellInd) in oTr">
                <td v-if="typeof oTd === 'string'" :key="'if-' + cellInd">
                  {{ oTd }}
                </td>
                <td v-else :key="'else-' + cellInd">
                  <i
                    :class="['fa', getClass(oTd)]"
                    aria-hidden="true"
                    :style="{ color: getColor(oTd) }"
                  ></i>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <!-- <b-alert show v-else class="m-t-40px">{{$t('no_data_to_display')}}</b-alert> -->
        <div class="m-t-40px text-center" v-else>
          {{ $t("no_data_to_display") }}
        </div>
      </div>
    </div>
    <div
      class="card-footer legends"
      style="visibility: visible"
      v-if="tableChartMethods && Object.keys(tableChartMethods).length > 0"
    >
      <div
        style="
          background-color: 'transparent';
          padding: 10px;
          text-align: center;
          border-radius: 5px;
          border: 1px solid var(--border-grey-color);
          width: fit-content;
          margin: auto;
        "
      >
        <div>
          <span class="mr-3"
            ><i
              class="fa fa-arrow-down mr-2"
              :style="{ color: '#ef5350 !important' }"
            ></i>
            {{ $t("highchartmsg_footer1") }}
          </span>
          <span
            ><i
              class="fa fa-arrow-up mr-2"
              :style="{ color: '#66bb6a !important' }"
            ></i>
            {{ $t("highchartmsg_footer2") }}</span
          >
        </div>
        <div>
          <span
            ><i
              class="fa fa-circle mr-2"
              :style="{ color: '#ffa726 !important' }"
            ></i>
            {{ $t("highchartmsg_footer3") }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dropdown from "./dropdown";
import geoCalc from "./geoCalc";
import { translateDate } from "@/components/Common/commonFunctions";
export default {
  props: [
    "data",
    "min",
    "max",
    "chartName",
    "type",
    "chartInfo",
    "methodSeq",
    "matrixData",
    "dataFetched",
    "locationPeriod",
  ],
  components: {
    dropdown,
  },
  watch: {
    matrixData(newVal) {
      this.matrixPData = this.data;
      this.computeMonthsData();
    },
    methodSeq(newVal) {
      if (newVal) {
        this.matrixPData = this.data;
        this.computeMonthsData();
      }
    },
  },
  data() {
    return {
      dropDownOptions: [],
      tableChartMethods: null,
      tableChartData: null,
      timeFrequency: 1,
      matrixPData: this.data,
    };
  },
  methods: {
    getClass(p_val) {
      let mark =
        p_val * 100 < this.min
          ? "fa-arrow-down"
          : p_val * 100 > this.max
          ? "fa-arrow-up"
          : "fa-circle";

      return mark;
    },
    getColor(p_val) {
      return p_val * 100 < this.min
        ? "#ef5350 !important"
        : p_val * 100 > this.max
        ? "#66bb6a !important"
        : "#ffa726 !important";
    },
    getMonthsVal(p_val) {
      this.tableChartMethods = null;
      this.tableChartData = null;
      this.timeFrequency = p_val;
      this.computeMonthsData();
    },
    computeMonthsData() {
      if (this.type == "Source") {
        let oChartTable = geoCalc.calculateAvgMethodMix(
            this.matrixPData,
            this.locationPeriod.period,
            this.timeFrequency,
            false,
            this.$i18n.locale,
            this.$i18n.t("Total CYP"),
            this.$i18n.t("method"),
            this.methodSeq,
            this.locationPeriod.periodType,
            this.$moment
          ),
          aHighChartTable = geoCalc.calculateHighChartTable(
            oChartTable,
            this.matrixPData.categories
          );
        this.tableChartMethods = oChartTable.methods;
        this.tableChartData = aHighChartTable;
      } else {
        let period = "";
        let newDate = this.locationPeriod.period.split("-").join("");
        Object.keys(this.matrixPData["allMonthNameJson"]).forEach((month) => {
          if (month == newDate) {
            period = this.matrixPData["allMonthNameJson"][month]["name"];
          }
        });
        let oChartTable = geoCalc.calculateAvgEMUMethodMix(
            this.matrixPData,
            period,
            this.timeFrequency,
            this.$i18n.t("method"),
            this.locationPeriod.periodType,
            this.$i18n.locale,
            this.$moment
          ),
          aHighChartTable = geoCalc.calculateHighChartTable(
            oChartTable,
            this.matrixPData.categories
          );
        this.tableChartMethods = oChartTable.methods;
        this.tableChartData = aHighChartTable;
      }
    },
    getTableData() {
      return { header: this.tableChartMethods, data: this.tableChartData };
    },
  },
  created() {
    this.dropDownOptions = [
      { val: 1, label: this.$i18n.t("nMonth", { n: 1 }) },
      { val: 3, label: this.$i18n.t("nMonth", { n: 3 }) },
      { val: 6, label: this.$i18n.t("nMonth", { n: 6 }) },
      { val: 12, label: this.$i18n.t("nMonth", { n: 12 }) },
    ];
    this.computeMonthsData();
  },
};
</script>
<style scoped lang="scss">
thead th,
td {
  width: 100px;
  text-align: center;
}
.legends {
  font-weight: bold !important;
  font-size: 0.75rem !important;
  font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica,
    sans-serif !important;
  color: var(--fonts-white-shade) !important;
  span {
    margin-right: 7px;
  }
}
</style>
