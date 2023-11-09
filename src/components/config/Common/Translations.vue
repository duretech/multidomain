<template>
  <span>
    <img
      v-bind:src="require('@/assets/images/icons/lang-icon.svg')"
      class="cursor-pointer"
      v-b-tooltip.hover
      :title="$t('addTranslations')"
      @click="transModal = true"
      :style="{ filter: filterColor }"
    />
    <b-modal
      :size="type === 'editor' || type === 'summary' ? 'lg' : 'md'"
      v-model="transModal"
      :title="$t('addTranslations')"
      @ok="handleOk"
      ok-only
      :ok-title="$t('ok')"
      no-close-on-backdrop
      centered
    >
      <div class="adminsection-modal">
        <div class="mb-4 small" v-if="type === 'summary'">
          <strong>{{ $t("note") }}:&nbsp;</strong>{{ $t("transNote") }}
        </div>
        <b-row
          class="mb-3"
          v-for="lang in langList"
          :key="'lang-' + refValue + lang"
        >
          <b-col sm="4">{{ $t(`${lang}`) }}</b-col>
          <b-col sm="8">
            <vue-editor
              v-model="tText[lang]"
              :state="tText && tText[lang] && tText[lang].length !== 0"
              :editorToolbar="customToolbar"
              :placeholder="$t('catInformation')"
              v-if="type === 'editor'"
            ></vue-editor>
            <b-form-textarea
              :ref="`${refValue}-${lang}`"
              :rows="type === 'summary' ? 10 : 4"
              v-model="tText[lang]"
              @focus="focusTA = lang"
              v-else
            ></b-form-textarea>
          </b-col>
        </b-row>
        <div v-if="type === 'summary'">
          <button
            v-for="fun in summaryFunList(
              subTabGroup,
              compareWith,
              isDrillDown,
              pType
            )"
            :key="fun.value"
            type="button"
            class="btn btn-primary black-btn mr-3 mb-3 btn-sm"
            @click.prevent="addFunction(fun.value)"
            v-b-popover.hover="{
              variant: 'info',
              content: fun.hoverText,
              title: fun.text,
              html: true,
            }"
          >
            {{ fun.text }}
          </button>
        </div>
      </div>
    </b-modal>
  </span>
</template>
<script>
import { VueEditor } from "vue2-editor";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
export default {
  props: [
    "type",
    "pType",
    "refValue",
    "transText",
    "subTabGroup",
    "compareWith",
    "isDrillDown",
  ],
  mixins: [DynamicImageMixin, VueEditorOptionMixin],
  components: { VueEditor },
  data() {
    return {
      transModal: false,
      langList: [],
      focusTA: "",
      tText: this.transText,
    };
  },
  watch: {
    transText(newValue) {
      this.formatText(newValue);
    },
    tText: {
      handler(newValue) {
        this.$emit("update:transText", newValue);
      },
      deep: true,
    },
  },
  computed: {
    summaryFunList: function () {
      return function (subTabGroup, compareWith, isDrillDown, pType) {
        let summaryFunList = [];
        summaryFunList.push({
          value: "INDICATOR_NAME",
          text: this.$i18n.t("funOpt1"),
          hoverText: this.$i18n.t("funOpt1Hover"),
        });
        summaryFunList.push({
          value: "COMPARE_LAST_PERIOD",
          text: this.$i18n.t("funOpt2"),
          hoverText: this.$i18n.t("funOpt2Hover"),
        });
        if (pType === "monthly") {
          summaryFunList.push({
            value: "COMPARE_LAST_YEAR",
            text: this.$i18n.t("funOpt3"),
            hoverText: this.$i18n.t("funOpt3Hover"),
          });
        }
        summaryFunList.push({
          value: "CURRENT_PERIOD",
          text: this.$i18n.t("funOpt16"),
          hoverText: this.$i18n.t("funOpt16Hover"),
        });
        summaryFunList.push({
          value: "CURRENT_PERIOD_VALUE",
          text: this.$i18n.t("funOpt4"),
          hoverText: this.$i18n.t("funOpt4Hover"),
        });
        summaryFunList.push({
          value: "LAST_PERIOD",
          text: this.$i18n.t("funOpt17"),
          hoverText: this.$i18n.t("funOpt17Hover"),
        });
        summaryFunList.push({
          value: "LAST_PERIOD_VALUE",
          text: this.$i18n.t("funOpt5"),
          hoverText: this.$i18n.t("funOpt5Hover"),
        });
        if (pType === "monthly") {
          summaryFunList.push({
            value: "LAST_YEAR_PERIOD",
            text: this.$i18n.t("funOpt6"),
            hoverText: this.$i18n.t("funOpt6Hover"),
          });
          summaryFunList.push({
            value: "LAST_YEAR_PERIOD_VALUE",
            text: this.$i18n.t("funOpt7"),
            hoverText: this.$i18n.t("funOpt7Hover"),
          });
        }
        if (
          this.$store.getters.getNamespace !== `${this.$store.getters.getAppSettings.tableName}_mnch-dashboard`
        ) {
          // if (subTabGroup === "EMU") {
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
          // }
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
              value: "ORG_LEVEL",
              text: this.$i18n.t("funOpt15"),
              hoverText: this.$i18n.t("funOpt15Hover"),
            });
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
    formatText(newValue) {
      let t = newValue;
      if (typeof t === "undefined") {
        t = {
          [this.$i18n.locale]: "",
        };
      }
      if (typeof t === "string" || t instanceof String) {
        t = {
          [this.$i18n.locale]: t,
        };
      }
      if (Array.isArray(t)) {
        t = {
          [this.$i18n.locale]: t[0],
        };
      }
      this.tText = t;
    },
    handleOk() {
      this.$emit("update:transText", this.tText);
    },
    addFunction(type) {
      const textarea = this.$refs[`${this.refValue}-${this.focusTA}`][0].$el;
      const index = textarea.selectionStart;
      const name = `{${type}}`;
      const text = this.tText[this.focusTA] || "";
      this.$set(
        this.tText,
        this.focusTA,
        `${text.substring(0, index)}${name}${text.substring(index)}`
      );
      textarea.focus();
      this.$nextTick(() => {
        textarea.selectionStart = index + name.length;
        textarea.selectionEnd = index + name.length;
      });
    },
  },
  created() {
    this.formatText(this.transText);
    this.langList = this.$store.getters.getAppSettings.languageSupport
      ? this.$store.getters.getAppSettings.langList
      : [this.$i18n.locale];
  },
};
</script>