<template>
  <div class="font-size">
    <b-button
      class="btn-fixed dec-btn"
      @click="decreaseFont"
      :disabled="$store.getters.getBaseFontSize === $store.getters.getDefaultFontSize - 3"
    >
      <span v-b-tooltip.hover :title="$t('decreaseFont')">A-</span>
    </b-button>
    <b-button class="btn-fixed mx-1 active-btn" @click="resetFont">
      <span v-b-tooltip.hover :title="$t('resetFont')">A</span>
    </b-button>
    <b-button
      class="btn-fixed inc-btn"
      @click="increaseFont"
      :disabled="$store.getters.getBaseFontSize === $store.getters.getDefaultFontSize + 3"
      ><span v-b-tooltip.hover :title="$t('increaseFont')"> A+ </span></b-button
    >
  </div>
</template>
<script>
export default {
  watch: {
    "$store.getters.getBaseFontSize": function (newValue) {
      document.getElementById("mainHTML").style.fontSize = `${newValue}px`;
    },
  },
  methods: {
    decreaseFont() {
      this.$store.commit("setBaseFontSize", this.$store.getters.getBaseFontSize - 1);
    },
    resetFont() {
      this.$store.commit("setBaseFontSize", this.$store.getters.getDefaultFontSize);
    },
    increaseFont() {
      this.$store.commit("setBaseFontSize", this.$store.getters.getBaseFontSize + 1);
    },
  },
};
</script>
<style scoped lang="scss">
.font-size {
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