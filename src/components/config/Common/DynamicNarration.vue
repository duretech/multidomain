<template>
  <div>
    <b-col sm="12" lg="12" class="mb-3">
      <b-row>
        <b-col sm="12">
          <label :for="`summary-summaryText-${i}-${j}`">{{
            $t("summaryText")
          }}</label>
        </b-col>
        <b-col sm="12">
          <b-input-group :id="`summary-summaryText-${i}-${j}`">
            <b-form-textarea
              :ref="`summary-textarea-${i}-${j}`"
              type="number"
              v-model="sText[$i18n.locale]"
              rows="4"
            >
            </b-form-textarea>
            <b-input-group-append is-text>
              <Translations :transText.sync="sText" type="summary" />
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </b-col>
    <b-col sm="12" lg="12">
      <button
        v-for="fun in summaryFunList(subTabGroup, compareWith, isDrillDown)"
        :key="fun.value"
        type="button"
        class="btn btn-primary black-btn mr-3 mb-3 btn-sm"
        @click.prevent="addFunction(fun.value, i, j)"
        v-b-popover.hover="{
          variant: 'info',
          content: fun.hoverText,
          title: fun.text,
          html: true,
        }"
      >
        {{ fun.text }}
      </button>
    </b-col>
  </div>
</template>
<script>
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
  computed: {
    summaryFunList: function () {
      return function (subTabGroup, compareWith, isDrillDown) {
        let summaryFunList = [
          {
            value: "INDICATOR_NAME",
            text: this.$i18n.t("funOpt1"),
            hoverText: this.$i18n.t("funOpt1Hover"),
          },
          {
            value: "COMPARE_LAST_MONTH",
            text: this.$i18n.t("funOpt2"),
            hoverText: this.$i18n.t("funOpt2Hover"),
          },
          {
            value: "COMPARE_LAST_YEAR",
            text: this.$i18n.t("funOpt3"),
            hoverText: this.$i18n.t("funOpt3Hover"),
          },
          { value: "CURRENT_PERIOD", text: "Current Period", hoverText: "" },
          {
            value: "CURRENT_PERIOD_VALUE",
            text: this.$i18n.t("funOpt4"),
            hoverText: this.$i18n.t("funOpt4Hover"),
          },
          { value: "LAST_PERIOD", text: "Last Period", hoverText: "" },
          {
            value: "LAST_PERIOD_VALUE",
            text: this.$i18n.t("funOpt5"),
            hoverText: this.$i18n.t("funOpt5Hover"),
          },
          {
            value: "LAST_YEAR_PERIOD",
            text: this.$i18n.t("funOpt6"),
            hoverText: this.$i18n.t("funOpt6Hover"),
          },
          {
            value: "LAST_YEAR_PERIOD_VALUE",
            text: this.$i18n.t("funOpt7"),
            hoverText: this.$i18n.t("funOpt7Hover"),
          },
        ];
        if (
          this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
        ) {
          if (subTabGroup === "EMU") {
            summaryFunList.push({
              value: "METHOD_INCREASED",
              text: this.$i18n.t("funOpt8"),
              hoverText: this.$i18n.t("funOpt8Hover"),
            });
            summaryFunList.push({
              value: "METHOD_DECREASED",
              text: this.$i18n.t("funOpt9"),
              hoverText: this.$i18n.t("funOpt9Hover"),
            });
          }
          if (compareWith) {
            summaryFunList.push({
              value: "COMPARE_OTHER_INDICATOR",
              text: this.$i18n.t("funOpt10"),
              hoverText: this.$i18n.t("funOpt10Hover"),
            });
            summaryFunList.push({
              value: "COMPARE_OTHER_INDICATOR_NAME",
              text: this.$i18n.t("funOpt11"),
              hoverText: this.$i18n.t("funOpt11Hover"),
            });
          }
          summaryFunList.push({
            value: "COMPARE_TRACER_METHOD",
            text: this.$i18n.t("funOpt12"),
            hoverText: this.$i18n.t("funOpt12Hover"),
          });
          summaryFunList.push({
            value: "METHOD_AVAILABILITY",
            text: this.$i18n.t("funOpt13"),
            hoverText: this.$i18n.t("funOpt13Hover"),
          });
          if (isDrillDown) {
            summaryFunList.push({
              value: "LAST_REGIONS",
              text: this.$i18n.t("funOpt14"),
              hoverText: this.$i18n.t("funOpt14Hover"),
            });
          }
        }
        return summaryFunList;
      };
    },
  },
  methods: {
    addFunction(type, i, j) {
      const textarea = this.$refs[`summary-textarea-${i}-${j}`].$el;
      // const textarea = this.$refs[`summary-textarea-${i}`][j].$el;
      const index = textarea.selectionStart;
      const name = `{${type}}`;
      const text = this.sText || "";
      this.sText = `${text.substring(0, index)}${name}${text.substring(index)}`;
      textarea.focus();
      this.$nextTick(() => {
        textarea.selectionStart = index + name.length;
        textarea.selectionEnd = index + name.length;
      });
    },
  },
  created() {},
};
</script>
