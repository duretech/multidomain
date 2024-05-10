<template>
  <div>
    <highcharts class="maincharts" :options="cObj"></highcharts>
    <div class="position-relative ml-5 mr-3 mt-3 row">
      <div
        class="col"
        v-if="!isNaN(emuValue) && emuValue !== ''"
        :style="{ 'background-color': emuValueColor, height: '18px' }"
      ></div>
      <template v-for="(s, i) in summaryScore">
        <div
          class="col"
          :key="'arrow' + i"
          v-if="
            !isNaN(s.graphValue) && s.graphValue !== '' && s.graphValue !== null
          "
          :style="{ 'background-color': s.graphColor, height: '18px' }"
        ></div>
      </template>
      <!-- <div
        class="dynamic-arrow"
        :style="{ 'background-color': arrowColor }"
        v-if="!exportingPdf"
      ></div> -->
    </div>
    <div class="arrow-content ml-5 mr-3 pt-3 row">
      <span class="col" v-if="!isNaN(emuValue) && emuValue !== ''">{{
        $t("estimatedUse")
      }}</span>
      <template v-for="(s, i) in summaryScore">
        <span
          class="col"
          v-if="
            !isNaN(s.graphValue) && s.graphValue !== '' && s.graphValue !== null
          "
          :key="'legend' + i"
          >{{ s.shortName }}</span
        >
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "emuValue",
    "chartData",
    "summaryScore",
    "emuValueColor",
    "exportingPdf",
  ],
  data() {
    return {
      cObj: JSON.parse(JSON.stringify(this.chartData)),
    };
  },
  computed: {
    arrowColor() {
      let color = this.emuValueColor;
      if (this.summaryScore.length) {
        color = this.summaryScore[this.summaryScore.length - 1].color;
      }
      return color;
    },
  },
  watch: {
    chartData: {
      handler(newValue) {
        this.cObj = newValue;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.dynamic-arrow {
  mask: url("../../assets/images/Path_108.svg") no-repeat center / contain;
  -webkit-mask: url("../../assets/images/Path_108.svg") no-repeat center /
    contain;
  width: 32px;
  height: 37.16px;
  position: absolute;
  right: -32px;
  top: -10px;
}
</style>
