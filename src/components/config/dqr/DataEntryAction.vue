<template>
  <div>
    <b-button
      @click="popupAction('download')"
      class="mx-1 btn-sm greycolor-btn"
    >
      <img
        v-b-tooltip.hover
        class="img-fluid icon1"
        :title="$t('downloadIcon')"
        :style="{ filter: filterColor }"
        :src="require(`@/assets/images/icons/downloadActive.svg`)"
    /></b-button>
    <b-button @click="popupAction('upload')" class="mx-1 btn-sm greycolor-btn"
      ><img
        v-b-tooltip.hover
        class="img-fluid icon1"
        :title="$t('UploadIcon')"
        :style="{ filter: filterColor }"
        :src="require(`@/assets/images/icons/UploadIcon.svg`)"
    /></b-button>
  </div>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["dataEntryID"],
  mixins: [DynamicImageMixin],
  methods: {
    popupAction(type) {
      this.$emit("openPopup", this.dataEntryID, type);
    },
  },
};
</script>