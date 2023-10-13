<template>
  <div class="anc-modal">
    <b-modal
      class="anc-modalpopup"
      id="modal-newanc"
      size="xl"
      :title="summaryObj.tabName[$i18n.locale]"
      v-model="modalShow"
      @hidden="$emit('visibleChange')"
      no-close-on-backdrop
      hide-footer
      ignore-enforce-focus-selector="#fileName"
    >
      <b-container ref="printPDF" class="modal-content">
        <h2 v-if="isGenerating" style="text-align: center">Summary Dashboard</h2>
        <div class="text-right mb-3" v-if="!isGenerating">
          <button
            type="button"
            class="btn btn-primary black-btn blue-btn ml-3"
            @click.prevent.stop="downloadReport()"
          >
          <span class="">
            <img
              :src="require('@/assets/images/icons/generateReport.svg')"
              class="img-fluid mt-xl-n1"
            /> </span
          > <span class="mx-1"> {{ $t("exportbtn") }} </span>
          </button>
        </div>
        <DynamicSummary
          :allGeoJson="allGeoJson"
          :allExtData="allExtData"
          :summaryObj="summaryObj"
          :locationPeriod="locationPeriod"
          @mapPic ="mapPic"
          @deleteMapPic="deleteMapPic"
        />
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import DynamicSummary from "@/components/Summary/DynamicSummary.vue";
export default {
  props: ["summaryObj", "allGeoJson", "allExtData", "locationPeriod", "isGenerating"],
  components: {
    DynamicSummary,
  },
  data() {
    return {
      modalShow: true,
    };
  },
  mounted(){
    this.summaryObj['viewMore'] = true;
    this.$emit("updateChartData" , this.summaryObj)
  },
  methods:{
    downloadReport(){
      this.$emit("downloadReport")
    },
    mapPic(data){
      this.$emit("mapPic" , data);
    },
    deleteMapPic(data) {
      this.$emit("deleteMapPic", data);
    },
  }
};
</script>

<style scoped></style>