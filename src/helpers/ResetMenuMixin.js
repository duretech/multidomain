export default {
	beforeDestroy() {
		this.$emit("getConfigData", []);
	},
};
