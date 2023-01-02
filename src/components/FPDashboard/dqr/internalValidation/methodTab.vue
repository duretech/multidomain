<template>
	<div>
		<div class="container-fluid px-0">
			<TabSummary :content="categoryInfo" contKey="method" />
			<div
				class="row m-t-20px mb-5 dashboardchart-container"
				v-if="
					method1Disable &&
					chartByMethodsData.tableData &&
					chartByMethodsData.tableData.length
				"
			>
				<div class="col-12" style="overflow: auto">
					<chartWithNarration
						:title="methodChartHeading1"
						:source="method"
						chartRef="chartByMethodsData"
						:chartData="chartByMethodsData"
						:bounds="chartByMethodsBound"
						:chartInfo="methodChartInfo1"
						:cid="methodCID1"
						@dataSort="dataSort"
						:signOffActive="signOffActive"
						ref="chartByMethodsData"
						key="chartByMethodsData"
						:dataOptions="[
							{ text: $t('raw'), value: 'RAW' },
							{ text: $t('cyp'), value: 'CYP' },
						]"
						:defaultDataOption="defaultDataOption"
						@changeDataOption="changeDataOption"
						:seriesOptions="[
							{
								text: $t('method_aggregate'),
								value: 'aggregate',
							},
							{
								text: $t('method_detial'),
								value: 'method',
							},
						]"
						:defaultSeriesOption="defaultSeriesOption"
						@changeSeriesOption="changeSeriesOption"
					/>
				</div>
			</div>
			<div
				class="row m-t-20px mb-5 dashboardchart-container"
				v-if="method2Disable && chartByRegionsData.series.length"
			>
				<div class="col-12 position-relative" style="overflow: auto">
					<chartWithNarration
						:title="methodChartHeading2"
						:source="method"
						chartRef="chartByRegionsData"
						:chartData="chartByRegionsData"
						:bounds="chartByRegionsBound"
						:chartInfo="methodChartInfo2"
						:cid="methodCID2"
						@dataSort="dataSort"
						:signOffActive="signOffActive"
						:allMethods="allMethods"
						:selectedMethod="selectedMethod"
						@getSelectedMethod="getSelectedMethod"
						ref="chartByRegionsData"
						key="chartByRegionsData"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import chartWithNarration from "./chartwithnarration";
import internalMethodCalc from "./internalValidationMethodCalc";
import internalCalc from "./internalValCalc";
import chartConfig from "./internalValChartConfig";
import { translateDate } from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
export default {
	props: [
		"internalValidationResponse",
		"conf",
		"confMethod",
		"method",
		"scoreKey",
		"derivedConfig",
		"cypFactors",
		"exportPosition",
		"signOffActive",
		"period",
		"periodScorecard",
		"defaultLocationID",
		"scorecardDefaultLocationID",
		"method1Disable",
		"method2Disable",
		"categoryInfo",
		"periodType",
		"standardDeviation",
		"internalValidationResponseBackground",
		"reportChartData",
	],
	mixins: [getCIDMixin],
	components: {
		chartWithNarration,
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
	},
	data() {
		let allMethods = [];
		this.conf.forEach((d) => {
			if (d.de.length > 0) {
				allMethods.push({ text: d.name, value: d.name });
			}
		});
		return {
			chartByMethodsData: { ...chartConfig.totalCYPRegion },
			chartByRegionsData: JSON.parse(
				JSON.stringify(chartConfig.totalCYPRegion)
			),
			chartByMethodsBound: {
				text: `The following Regions have CYP values falling outside ${this.standardDeviation} Standard Deviations of the regional trend in :`,
				highLowOutlier: null,
				Low: null,
				High: null,
			},
			chartByRegionsBound: {
				text: `The following Regions have CYP values falling outside ${this.standardDeviation} Standard Deviations of the regional trend in :`,
				highLowOutlier: null,
				Low: null,
				High: null,
			},
			methodChartInfo1: "",
			methodChartInfo2: "",
			methodChartHeading1: "",
			methodChartHeading2: "",
			methodCID1: "",
			methodCID2: "",
			download: false,
			oRegionalData: null,
			allMethods: allMethods,
			selectedMethod: allMethods[0].text,
			exportArr: [],
			defaultDataOption: "CYP",
			defaultSeriesOption: "aggregate",
		};
	},
	watch: {
		selectedMethod(newValue) {
			if (newValue) {
				this.chartByRegionsData.series = [];
				this.chartByRegionsData.tableData = [];
				this.getRegionalChart(true);
			}
		},
		internalValidationResponseBackground(newValue) {
			if (newValue) {
				this.calculateAggregateDataBackground();
			}
		},
	},
	methods: {
		changeDataOption(newValue) {
			this.defaultDataOption = newValue;
			this.chartByMethodsData.series = [];
			this.calculateMethodTabData();
		},
		changeSeriesOption(newValue) {
			this.defaultSeriesOption = newValue;
			this.chartByMethodsData.series = [];
			this.calculateMethodTabData();
		},
		dataSort(sort, key) {
			this[key].series.map((d) => ({
				...d,
				data: d.data.sort((a, b) => {
					let valueA = 0,
						valueB = 0;

					if (sort === "0-1" || sort === "1-0") {
						valueA = a.y;
						valueB = b.y;
					}

					if (sort === "JAN-DEC" || sort === "DEC-JAN") {
						valueA = new Date(a.pe).getTime();
						valueB = new Date(b.pe).getTime();
					}

					if (sort === "A-Z" || sort === "Z-A") {
						valueA = a.name.toLowerCase();
						valueB = b.name.toLowerCase();
					}

					let comparison = 0;
					if (sort == "0-1" || sort === "A-Z" || sort === "JAN-DEC") {
						if (valueA > valueB) {
							comparison = 1;
						} else if (valueA < valueB) {
							comparison = -1;
						}
					} else if (sort == "1-0" || sort === "Z-A" || sort === "DEC-JAN") {
						if (valueA > valueB) {
							comparison = -1;
						} else if (valueA < valueB) {
							comparison = 1;
						}
					}

					return comparison;
				}),
			}));
		},
		successAlert() {
			this.$swal({
				title: this.$i18n.t("data_saved_successfully"),
			});
		},
		errorAlert() {
			this.$swal({
				title: this.$i18n.t("error"),
			});
		},
		getSelectedMethod(method) {
			this.selectedMethod = method;
		},
		getRegionalChart(hideLoader = false) {
			this.methodChartHeading2 = this.derivedConfig[3].chartOptions.chartName;
			this.methodChartInfo2 = this.derivedConfig[3].chartOptions.chartInfo;

			if (this.derivedConfig[3].chartOptions.cid) {
				this.methodCID2 = this.derivedConfig[3].chartOptions.cid;
			}
			if (
				!hideLoader &&
				this.oRegionalData.seriesNum[this.selectedMethod].length === 0
			) {
				let method = this.allMethods.find(
					(a) => this.oRegionalData.seriesNum[a.text].length > 0
				);
				if (method) {
					this.selectedMethod = method.text;
				}
			}
			let oDeviatedData = internalCalc.getStdDevForCypregion(
					this.oRegionalData.seriesNum[this.selectedMethod],
					this.standardDeviation
				),
				oRangeSeries = internalCalc.addRangeLabel(
					this.oRegionalData.series[this.selectedMethod],
					oDeviatedData,
					this.$i18n.t("high"),
					this.$i18n.t("low")
				),
				aTable = internalCalc.calcCypTable(
					this.oRegionalData.devSeries[this.selectedMethod],
					this.$i18n.t("period")
				);

			let combinedBounds = [];
			if (oRangeSeries.cypRange[this.$i18n.t("high")]) {
				Object.keys(oRangeSeries.cypRange[this.$i18n.t("high")]).forEach(
					(h) => {
						let val = oRangeSeries.cypRange[this.$i18n.t("high")][h].map(
							(v) => ({
								type: this.$i18n.t("high"),
								value: v,
							})
						);
						let index = combinedBounds.length
							? combinedBounds.findIndex((c) => c.date === h)
							: -1;
						if (index >= 0) {
							combinedBounds[index] = {
								...combinedBounds[index],
								outlier: combinedBounds[index].outlier.concat(val),
							};
						} else {
							combinedBounds.push({
								date: h,
								outlier: val,
							});
						}
					}
				);
			}
			if (oRangeSeries.cypRange[this.$i18n.t("low")]) {
				Object.keys(oRangeSeries.cypRange[this.$i18n.t("low")]).forEach((h) => {
					let val = oRangeSeries.cypRange[this.$i18n.t("low")][h].map((v) => ({
						type: this.$i18n.t("low"),
						value: v,
					}));
					let index = combinedBounds.length
						? combinedBounds.findIndex((c) => c.date === h)
						: -1;
					if (index >= 0) {
						combinedBounds[index] = {
							...combinedBounds[index],
							outlier: combinedBounds[index].outlier.concat(val),
						};
					} else {
						combinedBounds.push({
							date: h,
							outlier: val,
						});
					}
				});
			}
			combinedBounds = combinedBounds.sort((a, b) => {
				let aDate = this.$moment(a.date, "MMM YYYY");
				let bDate = this.$moment(b.date, "MMM YYYY");
				let comparison = 0;
				if (aDate > bDate) {
					comparison = -1;
				} else if (aDate < bDate) {
					comparison = 1;
				}
				return comparison;
			});
			this.chartByRegionsBound = {
				...this.chartByRegionsBound,
				highLowOutlier: combinedBounds,
				...oRangeSeries.cypRange,
			};
			// this.chartByRegionsBound = {...this.chartByRegionsBound,...oRangeSeries.cypRange};
			let bIsCom =
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities";

			if (
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities"
			) {
				this.chartByRegionsBound.text = this.$i18n.t("cypRegionBound_client", {
					standardDeviation: this.standardDeviation,
				});
			} else if (this.method == "Visits") {
				this.chartByRegionsBound.text = this.$i18n.t("cypRegionBound_visit", {
					standardDeviation: this.standardDeviation,
				});
			} else {
				this.chartByRegionsBound.text = this.$i18n.t("cypRegionBound_else", {
					standardDeviation: this.standardDeviation,
				});
			}

			let min = 0,
				max = 0,
				xMax = 0;
			oRangeSeries.series.forEach((d) => {
				let innerDataArr = d.data.map((dInner) => dInner.y);
				let innerMin = Math.min(...innerDataArr);
				let innerMax = Math.max(...innerDataArr);
				if (innerMin < min) {
					min = innerMin;
				}
				if (innerMax > max) {
					max = innerMax;
				}
				let xM = d.data.length;
				if (xMax < xM) {
					xMax = xM;
				}
			});
			this.chartByRegionsData.yAxis.min = min > 0 ? 0 : min;
			this.chartByRegionsData.yAxis.max = max;
			this.chartByRegionsData.chart.height = 500;

			this.chartByRegionsData.xAxis.max =
				xMax > 11 ? (!this.reportChartData ? 11 : xMax - 1) : xMax - 1;
			let _this = this;
			this.chartByRegionsData.title.text = this.derivedConfig[3].chartOptions
				.title.visible
				? this.derivedConfig[3].chartOptions.title.text
				: "";
			this.chartByRegionsData.title.title =
				this.$i18n.t("in_Consistency") +
				" - " +
				this.$i18n.t("aggregate") +
				" - " +
				this.derivedConfig[3].chartOptions.chartName;
			this.chartByRegionsData.subtitle.text = this.derivedConfig[3].chartOptions
				.subTitle.visible
				? this.derivedConfig[3].chartOptions.subTitle.text
				: "";
			this.chartByRegionsData.xAxis.title.text = this.derivedConfig[3]
				.chartOptions.xAxis.visible
				? this.derivedConfig[3].chartOptions.xAxis.text
				: "";
			this.chartByRegionsData.yAxis.title.text = this.derivedConfig[3]
				.chartOptions.yAxis.visible
				? this.derivedConfig[3].chartOptions.yAxis.text
				: "";
			this.chartByRegionsData.plotOptions = {
				series: {
					...this.chartByRegionsData.plotOptions.series,
					events: {
						legendItemClick: function (event) {
							let index = _this.chartByRegionsData.series.findIndex(
								(s) => s.name === this.name
							);
							if (index >= 0) {
								_this.chartByRegionsData.series[index] = {
									..._this.chartByRegionsData.series[index],
									visible: !_this.chartByRegionsData.series[index].visible,
								};
							}
							_this.$refs.chartByRegionsData.updateScale();
						},
					},
					showInLegend: true,
				},
			};

			this.chartByRegionsData.chart.events = {
				load: function (e) {
					if (
						this.options.series.length &&
						this.options.series[0].data.length &&
						!_this.reportChartData
					) {
						var catLen = this.options.series[0].data.length - 1;
						if (catLen > 11) {
							this.xAxis[0].setExtremes(catLen - 11, catLen);
						}
					}
				},
				selection: function (e) {
					if (!e.xAxis) {
						let catLen = this.options.series[0].data.length - 1;
						if (catLen > 11 && !_this.reportChartData) {
							setTimeout(() => {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}, 0);
						}
						_this.download = false;
					} else {
						_this.download = true;
					}
				},
			};
			this.chartByRegionsData.series = oRangeSeries.series.map((s, i) => ({
				...s,
				visible: i > 4 ? false : true,
			}));
			if (bIsCom) {
				let newSeries = this.chartByRegionsData.series;
				newSeries.forEach((d) => {
					d.data.forEach((dy) => {
						dy.y = parseInt(dy.y);
					});
				});
				this.chartByRegionsData.series = newSeries;
			}
			this.chartByRegionsData.plotOptions.series.dataLabels.enabled = false;
			// this.chartByRegionsData.xAxis.categories = this.oRegionalData.categories;
			this.chartByRegionsData.tableData = aTable;
			if (
				this.exportPosition === "4" &&
				this.chartByRegionsData.series.length > 0
			) {
				this.exportArr.push({ cardKey: "key13", ...this.chartByRegionsData });
			}
			if (
				(this.reportChartData &&
					this.reportChartData.cid.split("/")[1] === this.methodCID2) ||
				(this.reportChartData &&
					this.reportChartData.linkedCharts.find((c) =>
						c.includes(this.methodCID2)
					))
			) {
				let cid = this.getCID(this.reportChartData, this.methodCID2);
				this.$emit("setReportChart", {
					chartObj: this.chartByRegionsData,
					chartName: this.methodChartHeading2,
					cid: [cid],
				});
				// return;
			}
			if (hideLoader) {
				this.hideLoader();
			}
		},
		calculateMethodTabData() {
			this.methodChartHeading1 = this.derivedConfig[2].chartOptions.chartName;
			this.methodChartInfo1 = this.derivedConfig[2].chartOptions.chartInfo;
			if (this.derivedConfig[2].chartOptions.cid) {
				this.methodCID1 = this.derivedConfig[2].chartOptions.cid;
			}
			let bIsCom =
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities";
			let conf =
				this.defaultSeriesOption === "method" ? this.confMethod : this.conf;
			let oNormalData = internalMethodCalc.getTotalData(
					this.internalValidationResponse,
					conf,
					this.cypFactors,
					bIsCom,
					this.defaultLocationID,
					this.$i18n.locale,
					this.periodType,
					this.$moment,
					this.defaultDataOption
				),
				oDeviatedData = internalCalc.getStdDevForCypregion(
					oNormalData.seriesNum,
					this.standardDeviation
				),
				oRangeSeries = internalCalc.addRangeLabel(
					oNormalData.series,
					oDeviatedData,
					this.$i18n.t("high"),
					this.$i18n.t("low")
				),
				aTable = internalCalc.calcCypTable(
					oNormalData.devSeries,
					this.$i18n.t("period")
				);

			this.oRegionalData = internalMethodCalc.getTotalRegionalData(
				this.internalValidationResponse,
				this.conf,
				this.cypFactors,
				bIsCom,
				this.defaultLocationID,
				this.$i18n.locale,
				this.periodType,
				this.$moment
			);
			if (this.oRegionalData) {
				this.getRegionalChart();
			}

			let combinedBounds = [];
			if (oRangeSeries.cypRange[this.$i18n.t("high")]) {
				Object.keys(oRangeSeries.cypRange[this.$i18n.t("high")]).forEach(
					(h) => {
						let val = oRangeSeries.cypRange[this.$i18n.t("high")][h].map(
							(v) => ({
								type: this.$i18n.t("high"),
								value: v,
							})
						);
						let index = combinedBounds.length
							? combinedBounds.findIndex((c) => c.date === h)
							: -1;

						if (index >= 0) {
							combinedBounds[index] = {
								...combinedBounds[index],
								outlier: combinedBounds[index].outlier.concat(val),
							};
						} else {
							combinedBounds.push({
								date: h,
								outlier: val,
							});
						}
					}
				);
			}
			if (oRangeSeries.cypRange[this.$i18n.t("low")]) {
				Object.keys(oRangeSeries.cypRange[this.$i18n.t("low")]).forEach((h) => {
					let val = oRangeSeries.cypRange[this.$i18n.t("low")][h].map((v) => ({
						type: this.$i18n.t("low"),
						value: v,
					}));
					let index = combinedBounds.length
						? combinedBounds.findIndex((c) => c.date === h)
						: -1;
					if (index >= 0) {
						combinedBounds[index] = {
							...combinedBounds[index],
							outlier: combinedBounds[index].outlier.concat(val),
						};
					} else {
						combinedBounds.push({
							date: h,
							outlier: val,
						});
					}
				});
			}

			combinedBounds = combinedBounds.sort((a, b) => {
				let aDate = this.$moment(a.date, "MMM YYYY");
				let bDate = this.$moment(b.date, "MMM YYYY");
				let comparison = 0;
				if (aDate > bDate) {
					comparison = -1;
				} else if (aDate < bDate) {
					comparison = 1;
				}
				return comparison;
			});
			this.chartByMethodsBound = {
				...this.chartByMethodsBound,
				highLowOutlier: combinedBounds,
				...oRangeSeries.cypRange,
			};
			let min = 0,
				max = 0,
				xMax = 0;
			oRangeSeries.series.forEach((d) => {
				let innerDataArr = d.data.map((dInner) => dInner.y);
				let innerMin = Math.min(...innerDataArr);
				let innerMax = Math.max(...innerDataArr);
				if (innerMin < min) {
					min = innerMin;
				}
				if (innerMax > max) {
					max = innerMax;
				}
				let xM = d.data.length;
				if (xMax < xM) {
					xMax = xM;
				}
			});
			this.chartByMethodsData.yAxis.min = min > 0 ? 0 : min;
			this.chartByMethodsData.yAxis.max = max;

			let series = oRangeSeries.series.map((s) => {
				let color = null,
					visible = true;
				let method = this.conf.find((m) => m.name === s.name);
				if (method) {
					color = method.color;
					visible = method.visible;
				}
				return { ...s, color, visible };
			});
			this.chartByMethodsData.series = series;
			if (bIsCom) {
				let newSeries = series;
				newSeries.forEach((d) => {
					d.data.forEach((dy) => {
						dy.y = parseInt(dy.y);
					});
				});
				this.chartByMethodsData.series = newSeries;
			}
			if (
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities"
			) {
				this.chartByMethodsBound.text = this.$i18n.t("cypRegionBound_client", {
					standardDeviation: this.standardDeviation,
				});
			} else if (this.method == "Visits") {
				this.chartByMethodsBound.text = this.$i18n.t("cypRegionBound_visit", {
					standardDeviation: this.standardDeviation,
				});
			} else {
				this.chartByMethodsBound.text = this.$i18n.t("cypRegionBound_else", {
					standardDeviation: this.standardDeviation,
				});
			}
			this.chartByMethodsData.xAxis.max =
				xMax > 11 ? (!this.reportChartData ? 11 : xMax - 1) : xMax - 1;
			let _this = this;
			this.chartByMethodsData.title.text = this.derivedConfig[2].chartOptions
				.title.visible
				? this.derivedConfig[2].chartOptions.title.text
				: "";
			this.chartByMethodsData.title.title =
				this.$i18n.t("in_Consistency") +
				" - " +
				this.$i18n.t("aggregate") +
				" - " +
				this.derivedConfig[2].chartOptions.chartName;
			this.chartByMethodsData.subtitle.text = this.derivedConfig[2].chartOptions
				.subTitle.visible
				? this.derivedConfig[2].chartOptions.subTitle.text
				: "";
			this.chartByMethodsData.xAxis.title.text = this.derivedConfig[2]
				.chartOptions.xAxis.visible
				? this.derivedConfig[2].chartOptions.xAxis.text
				: "";
			this.chartByMethodsData.yAxis.title.text = this.derivedConfig[2]
				.chartOptions.yAxis.visible
				? this.defaultDataOption === "CYP"
					? this.derivedConfig[2].chartOptions.yAxis.text
					: this.derivedConfig[2].chartOptions.yAxis.text
				: ""; //"Value by Method"
			this.chartByMethodsData.plotOptions = {
				series: {
					...this.chartByMethodsData.plotOptions.series,
					events: {
						legendItemClick: function (event) {
							let index = _this.chartByMethodsData.series.findIndex(
								(s) => s.name === this.name
							);
							if (index >= 0) {
								_this.chartByMethodsData.series[index] = {
									..._this.chartByMethodsData.series[index],
									visible: !_this.chartByMethodsData.series[index].visible,
								};
							}
							_this.$refs.chartByMethodsData.updateScale();
						},
					},
					showInLegend: true,
				},
			};

			this.chartByMethodsData.chart.events = {
				load: function (e) {
					if (
						this.options.series.length &&
						this.options.series[0].data.length &&
						!_this.reportChartData
					) {
						var catLen = this.options.series[0].data.length - 1;
						if (catLen > 11) {
							this.xAxis[0].setExtremes(catLen - 11, catLen);
						}
					}
				},
				selection: function (e) {
					if (!e.xAxis) {
						let catLen = this.options.series[0].data.length - 1;
						if (catLen > 11 && !_this.reportChartData) {
							setTimeout(() => {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}, 0);
						}
						_this.download = false;
					} else {
						_this.download = true;
					}
				},
			};
			// this.chartByMethodsData.xAxis.categories = oNormalData.categories;
			this.chartByMethodsData.tableData = aTable;
			if (
				this.exportPosition === "4" &&
				this.chartByMethodsData.series.length > 0
			) {
				this.exportArr.push({ cardKey: "key12", ...this.chartByMethodsData });
			}
			if (
				(this.chartByMethodsBound[this.$i18n.t("low")] &&
					Object.keys(this.chartByMethodsBound[this.$i18n.t("low")]).length) ||
				(this.chartByMethodsBound[this.$i18n.t("high")] &&
					Object.keys(this.chartByMethodsBound[this.$i18n.t("high")]).length)
			) {
				let lowBound = this.chartByMethodsBound[this.$i18n.t("low")]
						? Object.keys(this.chartByMethodsBound[this.$i18n.t("low")])
						: [],
					highBound = this.chartByMethodsBound[this.$i18n.t("high")]
						? Object.keys(this.chartByMethodsBound[this.$i18n.t("high")])
						: [];

				let formattedPeriod = translateDate({
					rawDate: this.period,
					periodType: this.periodType,
				});
				if (
					(lowBound.length && lowBound.includes(formattedPeriod)) ||
					(highBound.length && highBound.includes(formattedPeriod))
				) {
					this.$emit("sendScore", this.scoreKey, false, this.exportArr);
				} else {
					this.$emit("sendScore", this.scoreKey, true, this.exportArr);
				}
			} else {
				this.$emit("sendScore", this.scoreKey, true, this.exportArr);
			}
			if (
				(this.reportChartData &&
					this.reportChartData.cid.split("/")[1] === this.methodCID1) ||
				(this.reportChartData &&
					this.reportChartData.linkedCharts.find((c) =>
						c.includes(this.methodCID1)
					))
			) {
				let cid = this.getCID(this.reportChartData, this.methodCID1);
				this.$emit("setReportChart", {
					chartObj: this.chartByMethodsData,
					chartName: this.methodChartHeading1,
					cid: [cid],
				});
				// return;
			}
			this.hideLoader();
		},
		calculateAggregateDataBackground() {
			let bIsCom =
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities";
			let oNormalData = internalMethodCalc.getTotalData(
					this.internalValidationResponseBackground,
					this.conf,
					this.cypFactors,
					bIsCom,
					this.scorecardDefaultLocationID.split("/")[1],
					this.$i18n.locale,
					this.periodType,
					this.$moment
				),
				oDeviatedData = internalCalc.getStdDevForCypregion(
					oNormalData.seriesNum,
					this.standardDeviation
				),
				oRangeSeries = internalCalc.addRangeLabel(
					oNormalData.series,
					oDeviatedData,
					this.$i18n.t("high"),
					this.$i18n.t("low")
				),
				aTable = internalCalc.calcCypTable(
					oNormalData.devSeries,
					this.$i18n.t("period")
				);

			let chartByMethodsBound = { ...oRangeSeries.cypRange };

			if (
				(chartByMethodsBound[this.$i18n.t("low")] &&
					Object.keys(chartByMethodsBound[this.$i18n.t("low")]).length) ||
				(chartByMethodsBound[this.$i18n.t("high")] &&
					Object.keys(chartByMethodsBound[this.$i18n.t("high")]).length)
			) {
				let lowBound = chartByMethodsBound[this.$i18n.t("low")]
						? Object.keys(chartByMethodsBound[this.$i18n.t("low")])
						: [],
					highBound = chartByMethodsBound[this.$i18n.t("high")]
						? Object.keys(chartByMethodsBound[this.$i18n.t("high")])
						: [];

				let formattedPeriod = translateDate({
					rawDate: this.period,
					periodType: this.periodType,
				});

				if (
					(lowBound.length && lowBound.includes(formattedPeriod)) ||
					(highBound.length && highBound.includes(formattedPeriod))
				) {
					this.$emit("sendScoreBackground", this.scoreKey, false);
				} else {
					this.$emit("sendScoreBackground", this.scoreKey, true);
				}
			} else {
				this.$emit("sendScoreBackground", this.scoreKey, true);
			}
		},
		hideLoader() {
			setTimeout(() => {
				this.$store.state.loading = false;
			}, 1000);
		},
	},
	created() {
		if (!this.reportChartData) {
			this.$store.state.loading = false;
		}
		this.calculateMethodTabData();
	},
};
</script>
