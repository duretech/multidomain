<template>
  <div class="saved-Fav-page">
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: false,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    />
    <Reports />
  </div>
</template>

<script>
import Reports from "@/components/ReportTemplate/Reports";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    Reports,
  },
  mixins: [DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
};
</script>

<style scoped></style>
