<template>
  <div class="saved-Fav-page">
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    />
    <div class="new-fav-page">
      <SavedFav />
    </div>
  </div>
</template>

<script>
import SavedFav from "@/components/SavedFavorites/SavedFav";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    SavedFav,
  },
  mixins: [
    UsesAnalyticsMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  created() {
    this.$store.commit(
      "setNamespace",
      `${this.$store.getters.getAppSettings.tableName}`
    ); //* Default sidebar navigation option selector
  },
};
</script>