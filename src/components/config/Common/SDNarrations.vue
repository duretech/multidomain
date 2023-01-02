<template>
	<div class="p-2 border mb-3">
		<b-row class="mb-3">
			<b-col sm="6">
				<label :for="`summary-visible-${i}-${j}`">{{ $t("disable") }}</label>
			</b-col>
			<b-col sm="6">
				<b-form-checkbox
					:id="`summary-visible-${i}-${j}`"
					class="mr-n2 mb-n1"
					switch
					v-model="summary.disable"
				>
				</b-form-checkbox>
			</b-col>
		</b-row>
		<transition name="slide-fade">
			<div v-if="!summary.disable">
				<b-row>
					<b-col sm="12" lg="6" class="mb-3">
						<b-row>
							<b-col sm="5">
								<label :for="`summary-primaryChart-${i}-${j}`"
									>Primary Chart</label
								>
							</b-col>
							<b-col sm="7">
								<b-form-select
									:id="`summary-primaryChart-${i}-${j}`"
									v-model="summary.primaryChart"
									:options="getCharts('trend')"
								></b-form-select>
							</b-col>
						</b-row>
					</b-col>
					<b-col sm="12" lg="6" class="mb-3">
						<b-row>
							<b-col sm="5">
								<label :for="`summary-secondaryChart-${i}-${j}`"
									>Secondary Chart</label
								>
							</b-col>
							<b-col sm="7">
								<b-form-select
									:id="`summary-secondaryChart-${i}-${j}`"
									v-model="summary.secondaryChart"
									:options="getCharts('regional')"
								></b-form-select>
							</b-col>
						</b-row>
					</b-col>
					<b-col
						sm="12"
						lg="6"
						class="mb-3"
						v-if="
							$store.getters.getNamespace !== 'multi_program_mnch-dashboard' &&
							subTabGroup === 'EMU'
						"
					>
						<b-row>
							<b-col sm="5">
								<label :for="`summary-compareWith-${i}-${j}`"
									>Compare with</label
								>
							</b-col>
							<b-col sm="7">
								<b-form-select
									:id="`summary-compareWith-${i}-${j}`"
									v-model="summary.compareWith"
									:options="getSummaryCharts()"
								></b-form-select>
							</b-col>
						</b-row>
					</b-col>
					<b-col
						sm="12"
						lg="6"
						class="mb-3"
						v-if="showPriority(summary.primaryChart)"
					>
						<b-row>
							<b-col sm="5">
								<label :for="`summary-priorityIndicator-${i}-${j}`"
									>Priority Indicator</label
								>
							</b-col>
							<b-col sm="7">
								<b-form-select
									:id="`summary-priorityIndicator-${i}-${j}`"
									v-model="summary.priorityIndicator"
									:options="mappings(summary.primaryChart)"
								></b-form-select>
							</b-col>
						</b-row>
					</b-col>
					<b-col sm="12" lg="6" class="mb-3">
						<b-row>
							<b-col sm="5">
								<label :for="`summary-percentageIndicator-${i}-${j}`">{{
									$t("percentageIndicator")
								}}</label>
							</b-col>
							<b-col sm="7">
								<b-form-checkbox
									:id="`summary-percentageIndicator-${i}-${j}`"
									class="mr-n2 mb-n1"
									switch
									v-model="summary.percentageIndicator"
								>
								</b-form-checkbox>
							</b-col>
						</b-row>
					</b-col>
					<b-col sm="12" lg="6" class="mb-3">
						<b-row>
							<b-col sm="5">
								<label :for="`summary-benchmark-${i}-${j}`">{{
									$t("benchmark")
								}}</label>
							</b-col>
							<b-col sm="7">
								<b-input
									type="number"
									:id="`summary-benchmark-${i}-${j}`"
									v-model="summary.benchmarkValue"
								>
								</b-input>
							</b-col>
						</b-row>
					</b-col>
					<DynamicNarration
						:i="i"
						:j="j"
						:isDrillDown="isDrillDown"
						:compareWith="summary.compareWith"
						:subTabGroup="subTabGroup"
						:summaryText.sync="summary.summaryText"
					/>
				</b-row>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	props: ["i", "j", "tabs", "summary", "subTabId", "allCharts", "subTabGroup"],
	components: {
		DynamicNarration: () =>
			import(
				/* webpackChunkName: "admin_DynamicNarration"*/ "@/components/config/DynamicNarration"
			),
	},
	computed: {
		isDrillDown() {
			let isDrill = false;
			this.allCharts.forEach((c) => {
				if (
					c.chartOptions.chartCategory === "trend" &&
					c.chartOptions.generateSummary
				) {
					isDrill = c.chartOptions.chartDrillDown;
				}
			});
			return isDrill;
		},
		getCharts: function () {
			return function (type) {
				let charts = [];
				this.allCharts.forEach((c) => {
					if (c.chartOptions.chartCategory === type) {
						charts.push({
							value: c.chartOptions.id,
							text: c.chartOptions.chartName,
						});
					}
				});
				return charts;
			};
		},
		getSummaryCharts: function () {
			return function () {
				let charts = [];
				this.tabs.forEach((t) => {
					t.subTabs.forEach((st) => {
						if (
							st.id !== this.subTabId &&
							st.summary.percentageIndicator ===
								this.summary.percentageIndicator
						) {
							st.chartSetting.forEach((c) => {
								if (c.chartOptions.generateSummary) {
									charts.push({
										value: c.chartOptions.id,
										text: c.chartOptions.chartName,
									});
								}
							});
						}
					});
				});
				return charts;
			};
		},
		showPriority: function () {
			return function (chartId) {
				let flag = false;
				let chart = this.allCharts.find((c) => c.chartOptions.id === chartId);
				if (chart && !chart.chartOptions.chartDataSum) {
					flag = true;
				}
				return flag;
			};
		},
		mappings: function () {
			return function (chartId) {
				let arr = [];
				let chart = this.allCharts.find((c) => c.chartOptions.id === chartId);
				if (chart) {
					let gSetting = this.$store.getters.getGlobalFactors();
					if (
						gSetting.globalMappings &&
						gSetting.globalMappings.mappings &&
						gSetting.globalMappings.mappings.length
					) {
						const allMappings = [].concat(
							...gSetting.globalMappings.mappings.map(
								({ mapping }) => mapping || []
							)
						);
						allMappings.forEach((m) => {
							if (chart.chartOptions.dataMapping.includes(m.indicator.id)) {
								arr.push({
									text: m.indicator.name,
									value: m.indicator.static_name,
								});
							}
						});
					}
				}
				return arr;
			};
		},
	},
};
</script>
