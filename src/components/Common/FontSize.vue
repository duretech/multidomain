<template>
  <div class="font-size">
    <b-button
      class="btn-fixed dec-btn"
      @click="decreaseFont"
      v-b-tooltip.hover title="Decrease Font Size"
      :disabled="$store.state.baseFontSize === $store.state.defaultFontSize - 3"
    >
      A-
    </b-button>
    <b-button
      class="btn-fixed mx-1 active-btn"
      @click="resetFont"
      v-b-tooltip.hover title="Reset Font Size"
    >
      A
    </b-button>
    <b-button
      class="btn-fixed inc-btn"
      @click="increaseFont"
      v-b-tooltip.hover title="Increase Font Size"
      :disabled="$store.state.baseFontSize === $store.state.defaultFontSize + 3"
      >A+</b-button
    >
  </div>
</template>
<script>
export default {
  watch: {
    "$store.state.baseFontSize": function (newValue) {
      document.getElementById("mainHTML").style.fontSize = `${newValue}px`;
    },
  },
  methods: {
    decreaseFont() {
      this.$store.commit("setBaseFontSize", this.$store.state.baseFontSize - 1);
    },
    resetFont() {
      this.$store.commit("setBaseFontSize", this.$store.state.defaultFontSize);
    },
    increaseFont() {
      this.$store.commit("setBaseFontSize", this.$store.state.baseFontSize + 1);
    },
  },
};
</script>
<style scoped lang="scss">
.font-size{
  display: flex;
  align-items: baseline;
}
.btn-fixed {
  width: 30px;
      height: 30px;
      font-size: 11px !important;
      padding: 0.375rem 0.25rem;
}
</style>