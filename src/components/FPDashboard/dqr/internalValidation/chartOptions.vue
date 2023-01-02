<template>
	<div class="row no-gutters">
		<div
			class="col-12 text-right d-flex align-items-center justify-content-end"
		>
			<div
				class="ml-2"
				v-if="
					dataOptions &&
					(source === 'Commodities_Client' ||
						source === 'Commodities_Facilities')
				"
			>
				<b-form-select
					class="typeDropdown"
					v-model="dOption"
					:options="dataOptions"
				>
				</b-form-select>
			</div>
			<div
				class="ml-2"
				v-if="
					seriesOptions &&
					(source === 'Commodities_Client' ||
						source === 'Commodities_Facilities')
				"
			>
				<b-form-select
					class="typeDropdown"
					v-model="sOption"
					:options="seriesOptions"
				>
				</b-form-select>
			</div>
			<div class="ml-2" v-if="allMethods">
				<b-form-select
					class="typeDropdown"
					v-model="sMethod"
					:options="allMethods"
				>
				</b-form-select>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: [
		"allMethods",
		"selectedMethod",
		"source",
		"dataOptions",
		"defaultDataOption",
		"seriesOptions",
		"defaultSeriesOption",
	],
	data() {
		return {
			sMethod: this.selectedMethod,
			dOption: this.defaultDataOption,
			sOption: this.defaultSeriesOption,
		};
	},
	computed: {},
	watch: {
		sOption(newValue) {
			this.$emit("changeSeriesOption", newValue);
		},
		dOption(newValue) {
			this.$emit("changeDataOption", newValue);
		},
		selectedMethod(newValue) {
			this.sMethod = newValue;
		},
		sMethod(newValue) {
			this.$emit("getSelectedMethod", newValue);
		},
	},
	methods: {
		fullScreen() {
			this.chartData = JSON.parse(JSON.stringify(this.fullScreenData)) || {};
			this.chartData.xAxis.max = null;
			let _this = this;
			this.chartData.chart.events = {
				drillup: function () {
					this.yAxis[0].options.min = 0;
					// this.yAxis[0].options.max = _this.yMax
					this.xAxis[0].options.max = null;
					this.options.chart.zoomType = "x";
				},
				drilldown: function (e) {
					this.yAxis[0].options.min = null;
					this.yAxis[0].options.max = null;
					this.xAxis[0].options.max = null;
					let minus2SD = [],
						plus2SD = [],
						mainSeries = {
							name: e.seriesOptions.name,
							type: e.seriesOptions.type,
							data: [],
							visible: true,
							color: "#7cb5ec",
						};
					e.target.options.plotOptions = {
						...e.target.options.plotOptions,
						series: {
							...e.target.options.plotOptions.series,
							cursor: "",
						},
					};
					// oDrillDownSeries.series
					e.seriesOptions.data.forEach((d) => {
						let dLow = null,
							dHigh = null,
							dY = null;
						if (
							_this.source === "Commodities_Client" ||
							_this.source === "Commodities_Facilities"
						) {
							if (d.lowd) {
								dLow = Math.round(d.lowd);
							}
							if (d.highd) {
								dHigh = Math.round(d.highd);
							}
							if (d.y) {
								dY = Math.round(d.y);
							}
						} else {
							if (d.lowd) {
								dLow = d.lowd.toFixed(1) * 1;
							}
							if (d.highd) {
								dHigh = d.highd.toFixed(1) * 1;
							}
							if (d.y) {
								dY = d.y.toFixed(1) * 1;
							}
						}
						minus2SD.push({
							name: d.name,
							y: dLow,
						});
						plus2SD.push({
							name: d.name,
							y: dHigh,
						});
						mainSeries.data.push({
							name: d.name,
							y: dY,
							color: d.color,
							locationID: d.locationID,
						});
					});
					let obj1 = {
							name: _this.$i18n.t("min2SD", {
								standardDeviation: _this.standardDeviation,
							}),
							data: minus2SD,
							type: "line",
							visible: true,
							marker: {
								symbol: "square",
							},
							lineWidth: 0,
							states: {
								hover: {
									// enabled: false,
									lineWidth: 0,
									lineWidthPlus: 0,
								},
							},
							color: "#fcb241",
						},
						obj2 = {
							name: _this.$i18n.t("max2SD", {
								standardDeviation: _this.standardDeviation,
							}),
							data: plus2SD,
							type: "line",
							visible: true,
							marker: {
								symbol: "square",
							},
							lineWidth: 0,
							states: {
								hover: {
									// enabled: false,
									lineWidth: 0,
									lineWidthPlus: 0,
								},
							},
							color: "#2f7ed8",
						};

					this.addSingleSeriesAsDrilldown(e.point, mainSeries);
					this.addSingleSeriesAsDrilldown(e.point, obj1);
					this.addSingleSeriesAsDrilldown(e.point, obj2);
					this.applyDrilldown();
					this.options.chart.zoomType = "";
				},
			};
			let isDrilldown =
				this.chartData.drilldown && this.chartData.drilldown.series.length > 0
					? true
					: false;

			this.chartData.plotOptions = {
				series: {
					...this.chartData.plotOptions.series,
					events: {
						legendItemClick: function () {},
					},
					showInLegend: true,
					cursor: isDrilldown ? "pointer" : "",
					dataLabels: {
						enabled: true,
						formatter: function () {
							return this.point.label;
						},
					},
				},
			};
		},
	},
};
</script>
<style scoped lang="scss">
.comments_Scrollable {
	max-height: 200px;
	overflow-y: auto;
}

.fa-custom-sort-date-asc,
.fa-custom-sort-date-desc {
	position: relative;
	width: 35px;
}

.fa-custom-sort-date-asc::before,
.fa-custom-sort-date-desc::before {
	content: "\f175";
	position: relative;
	right: 14px;
}

.fa-custom-sort-date-asc::after,
.fa-custom-sort-date-desc::after {
	position: absolute;
	width: 18px;
	top: 0;
	right: 8px;
	font-size: 0.625rem;
	line-height: 9px;
	font-family: "courier new", monospace;
	font-weight: bold;
}

.fa-custom-sort-date-asc::after {
	content: "JAN\a DEC";
	white-space: pre-line;
}
.fa-custom-sort-date-desc::after {
	content: "DEC\aJAN";
	white-space: pre;
}

.typeDropdown {
	font-size: 0.75rem;
	padding: 2px 25px 2px 5px;
	height: auto;
	margin-top: 4px;
}
</style>
