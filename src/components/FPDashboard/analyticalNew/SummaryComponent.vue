<template>
  <div v-if="indicator1 || indicator2">
    <b-row class="mx-0">
      <b-col cols="4"></b-col>
      <b-col class="table-heading pr-0" cols="2"
        ><p>{{ currDate }}</p>
      </b-col>
      <b-col class="table-heading pr-0" cols="2"
        ><p>{{ currDateLastYear }}</p></b-col
      >
      <b-col class="table-heading pr-0" cols="2"
        ><p>{{ $t("change%") }}</p></b-col
      >
      <b-col class="table-heading pr-0" cols="2"
        ><p>{{ $t("2014dhs") }}</p></b-col
      >
    </b-row>
    <b-row class="mx-0 pb-3 valueRow" v-if="indicator1">
      <b-col class="table-heading pt-2" cols="4"
        ><p>{{ indicator1 }}</p></b-col
      >
      <b-col cols="2"
        ><div class="summary-dot">
          <span v-if="currValue">{{ currValue }}%</span
          ><b-spinner type="grow" label="Spinning" v-else></b-spinner>
        </div>
      </b-col>
      <b-col cols="2"
        ><div class="summary-dot">
          <span v-if="prevValue">{{ prevValue }}%</span
          ><b-spinner type="grow" label="Spinning" v-else></b-spinner></div
      ></b-col>
      <b-col cols="2">
        <div
          class="summary-dot"
          :class="[
            perChange
              ? perChange <= 5 && perChange >= -5
                ? 'green'
                : 'red'
              : '',
          ]"
        >
          <span v-if="perChange">{{ perChange.toFixed(0) }}%</span
          ><b-spinner type="grow" label="Spinning" v-else></b-spinner></div
      ></b-col>
      <b-col cols="2"
        ><div class="summary-dot">{{ dhsValue }}%</div></b-col
      >
    </b-row>
    <b-row class="mx-0 pb-3" v-if="indicator2">
      <b-col class="table-heading pt-2" cols="4"
        ><p>{{ indicator2 }}</p></b-col
      >
      <b-col cols="2"><div class="summary-dot">73.8%</div></b-col>
      <b-col cols="2"><div class="summary-dot">50.0%</div></b-col>
      <b-col cols="2"><div class="summary-dot green">47.5%</div></b-col>
      <b-col cols="2"><div class="summary-dot">94.9%</div></b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: [
    "selectedDate",
    "indicator1",
    "indicator2",
    "dhsValue",
    "isRandomData",
    "currentValue",
    "previousValue",
  ],
  data() {
    return {
      currDate: null,
      currDateLastYear: null,
      currValue: null,
      prevValue: null,
    };
  },
  watch: {
    currentValue(newValue) {
      console.log("currentValue", newValue)
      if(newValue) {
        this.currValue = newValue;
      }
    },
    previousValue(newValue) {
      console.log("previousValue", newValue)
      if(newValue) {
        this.prevValue = newValue;
      }
    },
  },
  computed: {
    perChange() {
      return ((this.currValue - this.prevValue) / this.prevValue) * 100;
    },
  },
  methods: {
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },
  created() {
    this.currDate = this.$moment(this.selectedDate, "YYYYMM").format(
      "MMM YYYY"
    );
    this.currDateLastYear = this.$moment(this.selectedDate, "YYYYMM")
      .subtract(12, "months")
      .format("MMM YYYY");
    if (this.isRandomData) {
      this.currValue = this.randomIntFromInterval(30, 70);
      this.prevValue = this.randomIntFromInterval(30, 70);
    }
  },
};
</script>