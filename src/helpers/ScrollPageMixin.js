export default {
	watch: {
		"$store.getters.getActiveTab": function () {
			this.scrollPage();
		},
	},
	methods: {
		scrollPage(divID = "scrollTop") {
			setTimeout(() => {
				let element = document.getElementById(divID);
				if (element) {
					element.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
			}, 0);
		},
	},
};
