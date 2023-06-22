<template>
  <b-dropdown size="lg" class="mx-2" no-caret menu-class="p-0">
    <template #button-content>
      <img
        v-bind:src="require('@/assets/images/icons/lang-icon.svg')"
        class="logo-img-header"
        v-b-tooltip.hover
        :title="$t('changeLang')"
        :style="{ filter: filterColor }"
      />
    </template>
    <template v-for="(lang, i) in $store.getters.getAppSettings.langList">
      <b-dropdown-item-button
        :key="'lang' + lang"
        href="#"
        :style="{ opacity: $i18n.locale === lang ? '1' : '0.5' }"
        class="mx-3 font-14"
        @click="langChange(lang)"
      >
        <i
          class="fa"
          :class="[
            $i18n.locale === lang
              ? 'fa-check-square-o mr-1'
              : 'fa-square-o mr-2',
          ]"
          aria-hidden="true"
        ></i
        >{{ $t(`${lang}`) }}</b-dropdown-item-button
      >
      <b-dropdown-divider
        :key="'divider' + lang"
        v-if="i < $store.getters.getAppSettings.langList.length - 1"
      ></b-dropdown-divider>
    </template>
  </b-dropdown>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
export default {
  mixins: [DynamicImageMixin, LanguageChangeMixin],
};
</script>