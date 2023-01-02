<template>
	<div>
		<b-col sm="12" lg="12" class="mb-3">
			<b-row>
				<b-col sm="12">
					<label :for="`summary-summaryText-${i}-${j}`">Summary Text</label>
				</b-col>
				<b-col sm="12">
					<b-form-textarea
						:ref="`summary-textarea-${i}-${j}`"
						type="number"
						:id="`summary-summaryText-${i}-${j}`"
						v-model="sText"
						rows="4"
					>
					</b-form-textarea>
				</b-col>
			</b-row>
		</b-col>
		<b-col sm="12" lg="12">
			<button
				v-for="fun in summaryFunList(subTabGroup, compareWith, isDrillDown)"
				:key="fun.value"
				type="button"
				class="btn btn-primary black-btn mr-3 mb-3 btn-sm"
				@click.prevent="addFunction(fun.value, i, j)"
				v-b-popover.hover="{
					variant: 'info',
					content: fun.hoverText,
					title: fun.text,
					html: true,
				}"
			>
				{{ fun.text }}
			</button>
		</b-col>
	</div>
</template>
<script>
export default {
	props: ["i", "j", "summaryText", "isDrillDown", "subTabGroup", "compareWith"],
	data() {
		return {
			sText: this.summaryText,
		};
	},
	watch: {
		summaryText(newValue) {
			this.sText = newValue;
		},
		sText(newValue) {
			this.$emit("update:summaryText", newValue);
		},
	},
	computed: {
		summaryFunList: function () {
			return function (subTabGroup, compareWith, isDrillDown) {
				let summaryFunList = [
					{
						value: "INDICATOR_NAME",
						text: "Indicator Name",
						hoverText:
							"The <code>{INDICATOR_NAME}</code> will be replaced by the <code>Indicator Name</code> in the narrations.",
					},
					{
						value: "COMPARE_LAST_MONTH",
						text: "Compare Last Month Value",
						hoverText:
							"The <code>{COMPARE_LAST_MONTH}</code> will be replaced by <code>increased/decreased/remain constant</code> after comparing the <strong>current month value</strong> with <strong>previous month value</strong>.",
					},
					{
						value: "COMPARE_LAST_YEAR",
						text: "Compare Last Year Same Month Value",
						hoverText: "",
					},
					{ value: "CURRENT_PERIOD", text: "Current Period", hoverText: "" },
					{
						value: "CURRENT_PERIOD_VALUE",
						text: "Current Period Value",
						hoverText: "",
					},
					{ value: "LAST_PERIOD", text: "Last Period", hoverText: "" },
					{
						value: "LAST_PERIOD_VALUE",
						text: "Last Period Value",
						hoverText: "",
					},
					{
						value: "LAST_YEAR_PERIOD",
						text: "Last Year Period",
						hoverText: "",
					},
					{
						value: "LAST_YEAR_PERIOD_VALUE",
						text: "Last Year Period Value",
						hoverText: "",
					},
				];
				if (
					this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
				) {
					if (subTabGroup === "EMU") {
						summaryFunList.push({
							value: "METHOD_INCREASED",
							text: "Increased Method Use",
							hoverText: "",
						});
						summaryFunList.push({
							value: "METHOD_DECREASED",
							text: "Decreased Method Use",
							hoverText: "",
						});
					}
					if (compareWith) {
						summaryFunList.push({
							value: "COMPARE_OTHER_INDICATOR",
							text: "Compare with Other Indicator",
							hoverText: "",
						});
						summaryFunList.push({
							value: "COMPARE_OTHER_INDICATOR_NAME",
							text: "Compare with Other Indicator Name",
							hoverText: "",
						});
					}
					summaryFunList.push({
						value: "COMPARE_TRACER_METHOD",
						text: "Compare with Tracer Method",
						hoverText: "",
					});
					summaryFunList.push({
						value: "METHOD_AVAILABILITY",
						text: "Method availability of FP uptake",
						hoverText: "",
					});
					if (isDrillDown) {
						summaryFunList.push({
							value: "LAST_REGIONS",
							text: "Show last 5 regions",
							hoverText: "",
						});
					}
				}
				return summaryFunList;
			};
		},
	},
	methods: {
		addFunction(type, i, j) {
			const textarea = this.$refs[`summary-textarea-${i}-${j}`].$el;
			// const textarea = this.$refs[`summary-textarea-${i}`][j].$el;
			const index = textarea.selectionStart;
			const name = `{${type}}`;
			const text = this.sText || "";
			this.sText = `${text.substring(0, index)}${name}${text.substring(index)}`;
			textarea.focus();
			this.$nextTick(() => {
				textarea.selectionStart = index + name.length;
				textarea.selectionEnd = index + name.length;
			});
		},
	},
	created() {},
};
</script>
