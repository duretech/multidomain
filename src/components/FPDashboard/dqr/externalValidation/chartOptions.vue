<template>
	<div class="row no-gutters">
		<div
			class="col-12 text-right d-flex align-items-center justify-content-end"
		>
			<div class="ml-2" v-if="periodList && periodList.length">
				<b-form-select
					class="typeDropdown"
					v-model="averagePeriod"
					:options="periodList"
				>
				</b-form-select>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: [
		"averagePeriods",
		"periodLength",
	],
	data() {
		return {
			averagePeriod: this.periodLength * 1 - 1,
			periodList: this.averagePeriods,
		};
	},
	computed: {
	},
	watch: {
		periodLength(newValue) {
			this.averagePeriod = newValue * 1 - 1;
		},
		averagePeriods(newValue) {
			this.periodList = newValue;
		},
		averagePeriod(newValue) {
			this.$emit("updatePeriodLength", newValue);
		},
	},
	methods: {
	},
};
</script>
