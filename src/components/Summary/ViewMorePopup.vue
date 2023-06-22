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
        />
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import DynamicSummary from "@/components/Summary/DynamicSummary.vue";
import GenerateReportMixin from "@/helpers/GenerateReportMixin";
export default {
  props: ["summaryObj", "allGeoJson", "allExtData", "locationPeriod"],
  mixins: [GenerateReportMixin],
  components: {
    DynamicSummary,
  },
  data() {
    return {
      modalShow: true,
    };
  },
};
</script>

<style scoped></style>