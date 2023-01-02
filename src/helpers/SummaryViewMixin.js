export default {
	data() {
		return {
			showMore: "",
		};
	},
	methods: {
		showMoreText(id) {
			this.showMore = this.showMore === id ? "" : id;
		},
		getSummaryText(text) {
			return text.length
				? text
				: `<strong>Summary not set in the admin</strong>`;
		},
		getIcon(type, cardHeader = null) {
			if (type === "High") {
				return cardHeader === "Stock-out"
					? "redUparrow.svg"
					: "greenUparrow.svg";
			}
			if (type === "Low") {
				return cardHeader === "Stock-out"
					? "greenDownarrow.svg"
					: "redDownarrow.svg";
			}
			if (type === "Equal") {
				return "orangeEqualsign.svg";
			}
		},
	},
};
