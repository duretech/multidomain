export default {
	created() {
		document.title =
			typeof this.$route.meta === "function"
				? this.$route.meta().title
				: this.$i18n.t("dashboard");
	},
};
