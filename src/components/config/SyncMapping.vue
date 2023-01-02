<template>
  <div>
    <button
      type="button"
      class="btn btn-primary black-btn btn-sm"
      v-b-tooltip.hover
      :title="$t('syncInfo')"
      v-on:click="syncMappingModal"
    >
      {{ $t("sync_mapping") }}
    </button>
    <b-modal
      v-model="syncMappingModalStatus"
      hide-footer
      centered
      size="sm"
      :title="$t('sync_mapping')"
      no-close-on-backdrop
    >
      <div class="form-group row">
        <label for="inputPeriodType" class="col-sm-12 col-form-label">{{
          $t("sync_from")
        }}</label>
        <div class="col-sm-12">
          <div class="select-wrapper">
            <select
              class="form-control"
              id="inputPeriodType"
              v-model="selectedLocaleToCopy"
            >
              <option value="" disabled>
                {{ $t("select_sync_mapping") }}
              </option>
              <option value="en" v-if="$i18n.locale !== 'en'">
                {{ $t("en") }}
              </option>
              <option value="fr" v-if="$i18n.locale !== 'fr'">
                {{ $t("fr") }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="text-right mt-3">
        <button
          type="button"
          class="btn btn-primary black-btn btn-sm"
          :disabled="!selectedLocaleToCopy"
          v-on:click="syncMapping"
        >
          {{ $t("sync") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedLocaleToCopy: "",
      syncMappingModalStatus: false,
    };
  },
  watch: {
    syncMappingModalStatus(newValue) {
      if (!newValue) {
        this.selectedLocaleToCopy = "";
      }
    },
  },
  methods: {
    syncMappingModal() {
      this.syncMappingModalStatus = !this.syncMappingModalStatus;
    },
    syncMapping() {
      this.$emit("syncMapping", this.selectedLocaleToCopy);
    },
  },
};
</script>