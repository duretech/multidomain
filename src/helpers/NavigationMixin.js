/*global settings*/
/*eslint no-undef: "error"*/

export default {
	methods: {
		goTo({
			module,
			moduleId = "",
			activeTab = "",
			routeName = "",
			setNamespace = false,
			redirectDetails = "",
		}) {
			if (setNamespace) {
				let namespace = module
					? `${settings.tableName}_${module}`
					: settings.tableName;
				this.$store.commit("setNamespace", namespace);
			}
			let queryObj = moduleId ? { moduleId } : {};
			this.$nextTick(() => {
				this.$router.push({
					name: routeName,
					params: { activeTab: activeTab, redirectDetails: redirectDetails },
					query: queryObj,
				});
			});
		},
	},
};
