<template>
  <div class="row no-gutters">
    <div
      class="col-12 text-right d-flex align-items-center justify-content-end"
    >
      <div
        class="ml-2"
        v-if="reportingForm && formOptions.length > 0 && cObj.series.length > 0"
      >
        <b-form-select
          class="typeDropdown"
          v-model="reportingForm"
          :options="formOptions"
        ></b-form-select>
      </div>
      <div class="ml-2" v-if="periodOptions">
        <b-form-select
          class="typeDropdown"
          v-model="prdLength"
          :options="periodOptions"
        >
        </b-form-select>
      </div>
      <div
        class="ml-2"
        v-if="
          plotOptions &&
          plotOptions.length &&
          !ddOptions &&
          cObj.series.length > 0
        "
      >
        <b-form-select
          class="typeDropdown"
          v-model="chartPlotType"
          :options="plotOptions"
        >
        </b-form-select>
      </div>
      <div
        class="ml-2"
        v-if="
          dataOptions &&
          (source === 'Commodities_Client' ||
            source === 'Commodities_Facilities') &&
          cObj.series.length > 0
        "
      >
        <b-form-select
          class="typeDropdown"
          v-model="dOption"
          :options="dataOptions"
        >
        </b-form-select>
      </div>
      <div
        class="ml-2"
        v-if="
          seriesOptions &&
          (source === 'Commodities_Client' ||
            source === 'Commodities_Facilities') &&
          cObj.series.length > 0
        "
      >
        <b-form-select
          class="typeDropdown"
          v-model="sOption"
          :options="seriesOptions"
        >
        </b-form-select>
      </div>
      <div class="ml-2" v-if="allMethods">
        <b-form-select
          class="typeDropdown"
          v-model="sMethod"
          :options="allMethods"
        >
        </b-form-select>
      </div>
      <div
        class="ml-2"
        v-if="periodList && periodList.length && cObj.series.length > 0"
      >
        <b-form-select
          class="typeDropdown"
          v-model="averagePeriod"
          :options="periodList"
        >
        </b-form-select>
      </div>
      <div class="ml-2" v-if="ddOptions && cObj.series.length > 0">
        <select
          class="form-control typeDropdown custom-select"
          style="padding: 2px 2px 2px 5px"
          v-model="dValue"
        >
          <option
            className="typeoptions"
            v-for="(option, ind) in ddOptions"
            :value="ind"
            :key="ind"
          >
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    "cObj",
    "source",
    "ddValue",
    "pLength",
    "chartRef",
    "plotType",
    "ddOptions",
    "allMethods",
    "dataOptions",
    "plotOptions",
    "periodLength",
    "periodOptions",
    "seriesOptions",
    "averagePeriods",
    "selectedMethod",
    "defaultDataOption",
    "defaultSeriesOption",
    "reportingFormsOptions",
    "selectedReportingForm",
  ],
  data() {
    let formOptions = this.reportingFormsOptions
      ? this.reportingFormsOptions.map((o) => ({ value: o, text: o }))
      : null;
    return {
      dValue: this.ddValue,
      prdLength: this.pLength,
      formOptions: formOptions,
      chartPlotType: this.plotType,
      sMethod: this.selectedMethod,
      periodList: this.averagePeriods,
      dOption: this.defaultDataOption,
      sOption: this.defaultSeriesOption,
      averagePeriod: this.periodLength * 1 - 1,
      reportingForm: this.selectedReportingForm,
    };
  },
  computed: {},
  watch: {
    plotType(newValue) {
      this.chartPlotType = newValue;
    },
    chartPlotType(newValue) {
      this.$emit("changePlotType", newValue, this.chartRef);
    },
    prdLength(newValue) {
      if (newValue) {
        this.$emit("changePeriod", newValue);
      }
    },
    sOption(newValue) {
      this.$emit("changeSeriesOption", newValue);
    },
    dOption(newValue) {
      this.$emit("changeDataOption", newValue);
    },
    selectedMethod(newValue) {
      this.sMethod = newValue;
    },
    sMethod(newValue) {
      this.$emit("getSelectedMethod", newValue);
    },
    periodLength(newValue) {
      this.averagePeriod = newValue * 1 - 1;
    },
    averagePeriods(newValue) {
      this.periodList = newValue;
    },
    averagePeriod(newValue) {
      this.$emit("updatePeriodLength", newValue);
    },
    dValue(newValue) {
      this.$emit("handleFilterChange", newValue);
    },
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.typeDropdown {
  font-size: 0.75rem;
  padding: 2px 25px 2px 5px;
  height: auto;
  margin-top: 4px;
}
</style>
