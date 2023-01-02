<template>
	<b-dropdown size="lg" class="mx-2" no-caret menu-class="p-0">
		<template #button-content
			><img
				v-bind:src="require('@/assets/images/icons/Icon awesome-language.svg')"
				class="logo-img-header"
				v-b-tooltip.hover
				title="Change Language"
			/>
		</template>
		<b-dropdown-item-button
			href="#"
			:style="{ opacity: $i18n.locale === 'en' ? '1' : '0.5' }"
			class="mx-3 font-14"
			@click="langChange('en')"
		>
			<i
				class="fa"
				:class="[
					$i18n.locale === 'en' ? 'fa-check-square-o mr-1' : 'fa-square-o mr-2',
				]"
				aria-hidden="true"
			></i
			>{{ $t("english") }}</b-dropdown-item-button
		>
		<b-dropdown-divider></b-dropdown-divider>
		<b-dropdown-item-button
			href="#"
			:style="{ opacity: $i18n.locale === 'fr' ? '1' : '0.5' }"
			@click="langChange('fr')"
			class="mx-3 font-14"
			><i
				class="fa"
				:class="[
					$i18n.locale === 'fr' ? 'fa-check-square-o mr-1' : 'fa-square-o mr-2',
				]"
				aria-hidden="true"
			></i
			>{{ $t("french") }}</b-dropdown-item-button
		>
	</b-dropdown>
</template>
<script>
	import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
export default {
	mixins: [LanguageChangeMixin]
};
</script>