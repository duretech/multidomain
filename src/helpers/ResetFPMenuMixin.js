export default {
	beforeDestroy() {
		this.$emit("getConfigDataFP", {});
	},
};
