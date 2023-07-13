<template>
  <b-col sm="12" lg="12" class="mb-3">
    <b-row>
      <b-col sm="12">
        <label :for="`summary-summaryText-${i}-${j}`">{{
          $t("summaryText")
        }}</label>
      </b-col>
      <b-col sm="12" v-if="pTypeOptions.length">
        <b-tabs content-class="mt-3" v-model="tabIndex" small>
          <b-tab
            :key="pType.id"
            :title="pType.label"
            v-for="pType in pTypeOptions"
          >
            <b-input-group :id="`summary-summaryText-${i}-${j}-${pType.id}`">
              <b-form-textarea
                disabled
                rows="10"
                type="number"
                v-model="sText[pType.id][$i18n.locale]"
                v-if="sText[pType.id] && sText[pType.id][$i18n.locale]"
              >
              </b-form-textarea>
              <b-input-group-append is-text>
                <Translations
                  type="summary"
                  :pType="pType.id"
                  :subTabGroup="subTabGroup"
                  :compareWith="compareWith"
                  :isDrillDown="isDrillDown"
                  :transText.sync="sText[pType.id]"
                  :refValue="`summary-summaryText-${i}-${j}-${pType.id}`"
                />
              </b-input-group-append>
            </b-input-group>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-col>
</template>
<script>
import { pTypeList } from "@/components/Common/commonFunctions";
export default {
  props: ["i", "j", "summaryText", "isDrillDown", "subTabGroup", "compareWith"],
  components: {
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      tabIndex: 0,
      pTypeOptions: [],
      sText: this.summaryText,
    };
  },
  watch: {
    summaryText(newValue) {
      this.sText = newValue;
    },
    sText(newValue) {
      this.$emit("update:summaryText", newValue);
    },
  },
  created() {
    this.pTypeOptions = pTypeList({});
  },
};
</script>
