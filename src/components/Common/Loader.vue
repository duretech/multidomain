<template>
  <div class="loader-container flex-column">
    <div class="loader">
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__bar"></div>
      <div class="loader__ball"></div>
    </div>
    <div class="loader_text text-white w-100 text-center" v-if="$store.getters.getLoadingText">
      {{$store.getters.getLoadingText}}
    </div>
  </div>
</template>
