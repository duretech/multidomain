export default {
	data() {
		return {
			dsl: [],
			signOffForm: [],
			updateForm: null,
		};
	},
	components: {
		SignOffDSL: () =>
			import(
				/* webpackChunkName: "signOff_DSL"*/ "@/components/DQR/SignOffDSL.vue"
			),
		SignOffForm: () =>
			import(
				/* webpackChunkName: "signOff_form"*/ "@/components/DQR/SignOffForm.vue"
			),
		SignOffHeader: () =>
			import(
				/* webpackChunkName: "signOff_header"*/ "@/components/DQR/SignOffHeader.vue"
			),
		AllSignOffForms: () =>
			import(
				/* webpackChunkName: "signOff_allForms"*/ "@/components/DQR/AllSignOffForms.vue"
			),
	},
	computed: {
		tabName() {
			let id = this.$store.getters.getActiveTab.split("-");
			let tName = id[0];
			let gName = "";
			if (id[2] === "CT") {
				gName = "Completeness and Timeliness";
			}
			if (id[2] === "IC") {
				gName = "Internal Consistency";
			}
			if (id[2] === "CC") {
				gName = "Internal Consistency Correlation";
			}
			return this.updateForm && this.updateForm.signOffTab
				? this.updateForm.signOffTab
				: `${tName}-${gName}-${this.signOffData.tabName}`;
		},
		formDate() {
			return this.updateForm && this.updateForm.period
				? this.updateForm.period
				: this.selectedDate;
		},
		formUser() {
			return this.updateForm && this.updateForm.userDetails
				? this.updateForm.userDetails
				: this.userDetails;
		},
		formLocation() {
			return this.updateForm && this.updateForm.location
				? this.updateForm.location
				: this.locationName;
		},
		formColor() {
			return this.updateForm && this.updateForm.iconColorClass
				? this.updateForm.iconColorClass
				: "";
		},
	},
	created() {
		let classes = ["low", "mediumLow", "medium", "mediumHigh", "high"];
		classes.forEach((a) => {
			this.dsl.push({
				text: this.$i18n.t(`${a}`),
				class: a,
				count: null,
			});
		});
	},
};
