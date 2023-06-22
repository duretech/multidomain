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
      :size="type === 'editor' ? 'lg' : 'md'"
      v-model="transModal"
      :title="$t('addTranslations')"
      @ok="handleOk"
      ok-only
      :ok-title="$t('ok')"
      no-close-on-backdrop
      centered
    >
      <div>
        <div class="mb-4 small" v-if="type === 'summary'">
          <strong>{{ $t("note") }}:&nbsp;</strong>{{ $t("transNote") }}
        </div>
        <b-row class="mb-3" v-for="lang in langList" :key="'lang' + lang">
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
              rows="4"
              v-model="tText[lang]"
              v-else
            ></b-form-textarea>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </span>
</template>
<script>
import { VueEditor } from "vue2-editor";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
export default {
  props: ["transText", "type"],
  mixins: [DynamicImageMixin, VueEditorOptionMixin],
  components: { VueEditor },
  data() {
    return {
      transModal: false,
      langList: [],
    };
  },
  computed: {
    tText() {
      let t = this.transText;
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
      return t;
    },
  },
  methods: {
    handleOk() {
      this.$emit("update:transText", this.tText);
    },
  },
  created() {
    this.langList = this.$store.getters.getAppSettings.languageSupport
      ? this.$store.getters.getAppSettings.langList
      : [this.$i18n.locale];
  },
};
</script>