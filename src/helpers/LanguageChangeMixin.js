export default {
	methods: {
		/**
		 * This executes after changing the language from the header component.
		 * Emits the change event till App.vue component. Then App.vue handles the reloading of the page.
		 */
		langChange(lang) {
			this.$emit("langChange", lang);
		},
	},
};
