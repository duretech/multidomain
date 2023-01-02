<template>
	<div>
		<div class="container-fluid px-0">
			<TabSummary :content="categoryInfo" contKey="agree" />
			<div
				class="row m-t-20px dashboardchart-container"
				v-if="
					aggregate1Disable &&
					cypDrillDownChart.tableData &&
					cypDrillDownChart.tableData.length
				"
			>
				<div class="col-12" style="overflow: auto">
					<chartWithNarration
						:title="aggregateChartHeading1"
						:source="method"
						chartRef="cypDrillDownChart"
						:chartData="cypDrillDownChart"
						:bounds="aggRegionBound"
						:nested="true"
						:drill="bIsDrillDown"
						:chartInfo="aggregateChartInfo1"
						:drillChartData="cypRegionWiseDrillDown"
						drillChartRef="cypRegionWiseDrillDown"
						:cid="aggregateCID1"
						:drillDown="bIsDrillDown"
						@dataSort="dataSort"
						:signOffActive="signOffActive"
						ref="cypDrillDownChart"
						key="cypDrillDownChart"
					/>
				</div>
			</div>
			<div
				class="row mt-2 mb-5 dashboardchart-container"
				v-if="
					aggregate2Disable &&
					cypRegionChart.tableData &&
					cypRegionChart.tableData.length
				"
			>
				<div class="col-12" style="overflow: auto">
					<chartWithNarration
						:title="aggregateChartHeading2 || $t('chartHeading')"
						:source="method"
						chartRef="cypRegionChart"
						:chartData="cypRegionChart"
						:bounds="cypRegionBound"
						:chartInfo="aggregateChartInfo2"
						:cid="aggregateCID2"
						@dataSort="dataSort"
						:signOffActive="signOffActive"
						ref="cypRegionChart"
						key="cypRegionChart"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import chartConfig from "./internalValChartConfig";
import internalCalc from "./internalValCalc";
import chartWithNarration from "./chartwithnarration";
import { translateDate } from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
export default {
	props: [
		"method",
		"defaultLocationID",
		"scorecardDefaultLocationID",
		"internalValidationResponse",
		"scoreKey",
		"derivedConfig",
		"cypFactors",
		"aggregate1Disable",
		"aggregate2Disable",
		"exportPosition",
		"signOffActive",
		"period",
		"periodScorecard",
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
		return {
			cypRegionChart: JSON.parse(JSON.stringify(chartConfig.totalCYPRegion)),
			cypDrillDownChart: { ...chartConfig.totalCYPRegionDrillDown },
			cypRegionWiseDrillDown: { ...chartConfig.totalCYPRegionWiseDiff },
			aggRegionBound: {
				text: `The following months have CYP values falling outside ${this.standardDeviation} Standard Deviations of the trend (OUTLIERS)`,
				outliers: null,
			},
			cypRegionBound: {
				text: `The following Regions have CYP values falling outside ${this.standardDeviation} Standard Deviations of the regional trend in :`,
				highLowOutlier: null,
				Low: null,
				High: null,
			},
			bIsDrillDown: false,
			aggregateChartInfo1: "",
			aggregateChartInfo2: "",
			aggregateChartHeading1: "",
			aggregateChartHeading2: "",
			aggregateCID1: "",
			aggregateCID2: "",
			download1: false,
			download2: false,
			yMax: null,
		};
	},
	watch: {
		internalValidationResponseBackground(newValue) {
			if (newValue) {
				this.calculateAggregateDataBackground();
			}
		},
	},
	methods: {
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
		changeLocation(locationID) {
			this.bIsDrillDown = false;
			this.$emit("drilldownLocation", locationID);
		},
		calculateAggregateData() {
			this.aggregateChartHeading1 =
				this.derivedConfig[0].chartOptions.chartName;
			this.aggregateChartInfo1 = this.derivedConfig[0].chartOptions.chartInfo;
			let _this = this;
			if (this.derivedConfig[0].chartOptions.cid) {
				this.aggregateCID1 = this.derivedConfig[0].chartOptions.cid;
			}
			this.aggregateChartHeading2 =
				this.derivedConfig[1].chartOptions.chartName;
			this.aggregateChartInfo2 = this.derivedConfig[1].chartOptions.chartInfo;

			if (this.derivedConfig[1].chartOptions.cid) {
				this.aggregateCID2 = this.derivedConfig[1].chartOptions.cid;
			}

			let bIsCom =
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities";
			let oNormalData = internalCalc.getTotalData(
					this.internalValidationResponse,
					this.defaultLocationID,
					this.cypFactors,
					bIsCom,
					this.$i18n.locale,
					this.periodType,
					this.$moment
				),
				oDeviatedData = internalCalc.getStdDevForCypregion(
					oNormalData.wholeSeriesNum,
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
				),
				aAggregateTable = internalCalc.calcAggTable(
					oNormalData.aggregate,
					this.$i18n.t("period")
				),
				ocypDrillDownChartSeries = internalCalc.addRangeLabelWithColor(
					oNormalData.aggregate,
					oDeviatedData,
					this.$i18n.t("high"),
					this.$i18n.t("low")
				),
				oDrillDownSeries = internalCalc.addLowAndHighInDrillDownSeries(
					oNormalData.drillDown,
					oDeviatedData
				),
				oAvgChartData = internalCalc.avgChartData(
					oNormalData.seriesNum,
					oDeviatedData
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
			this.cypRegionBound = {
				...this.cypRegionBound,
				highLowOutlier: combinedBounds,
				...oRangeSeries.cypRange,
			};
			let min = 0,
				max = 0,
				xMax = 0;
			oRangeSeries.series.forEach((d, ind) => {
				if (ind <= 4) {
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
				}
			});
			this.cypRegionChart.yAxis.min = min > 0 ? 0 : min;
			this.cypRegionChart.yAxis.max = max;
			this.cypRegionChart.xAxis.max =
				xMax > 11 ? (!this.reportChartData ? 11 : xMax - 1) : xMax - 1;
			this.cypRegionChart.chart.height = 500;

			this.cypRegionChart.series = oRangeSeries.series.map((s, i) => ({
				...s,
				visible: i > 4 ? false : true,
			}));
			//*Added by ashvini *****/
			if (bIsCom) {
				let newSeries = this.cypRegionChart.series;
				newSeries.forEach((d) => {
					d.data.forEach((dy) => {
						dy.y = parseInt(dy.y);
					});
					// return innerD;
				});
				this.cypRegionChart.series = newSeries;
			}
			// this.cypRegionChart.xAxis.categories = oNormalData.categories;
			this.cypRegionChart.tableData = aTable;
			// this.cypDrillDownChart.xAxis.categories = oNormalData.categories;
			// this.aggRegionBound.outliers = oRangeSeries.outliers;
			if (
				this.method === "Commodities_Client" ||
				this.method === "Commodities_Facilities"
			) {
				this.aggRegionBound.text = this.$i18n.t("aggRegionBound_client", {
					standardDeviation: this.standardDeviation,
				});
				this.cypRegionBound.text = this.$i18n.t("cypRegionBound_client", {
					standardDeviation: this.standardDeviation,
				});
			} else if (this.method == "Visits") {
				this.aggRegionBound.text = this.$i18n.t("aggRegionBound_visit", {
					standardDeviation: this.standardDeviation,
				});
				this.cypRegionBound.text = this.$i18n.t("cypRegionBound_visit", {
					standardDeviation: this.standardDeviation,
				});
			} else {
				this.aggRegionBound.text = this.$i18n.t("aggRegionBound_else", {
					standardDeviation: this.standardDeviation,
				});
				this.cypRegionBound.text = this.$i18n.t("cypRegionBound_else", {
					standardDeviation: this.standardDeviation,
				});
			}

			this.cypDrillDownChart.title.text = this.derivedConfig[0].chartOptions
				.title.visible
				? this.derivedConfig[0].chartOptions.title.text
				: "";
			this.cypDrillDownChart.title.title =
				this.$i18n.t("in_Consistency") +
				" - " +
				this.$i18n.t("aggregate") +
				" - " +
				this.derivedConfig[0].chartOptions.chartName;
			this.cypDrillDownChart.subtitle.text = this.derivedConfig[0].chartOptions
				.subTitle.visible
				? this.derivedConfig[0].chartOptions.subTitle.text
				: "";
			this.cypDrillDownChart.xAxis.title.text = this.derivedConfig[0]
				.chartOptions.xAxis.visible
				? this.derivedConfig[0].chartOptions.xAxis.text
				: "";
			this.cypDrillDownChart.yAxis.title.text = this.derivedConfig[0]
				.chartOptions.yAxis.visible
				? this.derivedConfig[0].chartOptions.yAxis.text
				: "";

			this.cypRegionChart.title.text = this.derivedConfig[1].chartOptions.title
				.visible
				? this.derivedConfig[1].chartOptions.title.text
				: "";
			this.cypRegionChart.title.title =
				this.$i18n.t("in_Consistency") +
				" - " +
				this.$i18n.t("aggregate") +
				" - " +
				this.derivedConfig[1].chartOptions.chartName;

			this.cypRegionChart.subtitle.text = this.derivedConfig[1].chartOptions
				.subTitle.visible
				? this.derivedConfig[1].chartOptions.subTitle.text
				: "";
			this.cypRegionChart.xAxis.title.text = this.derivedConfig[1].chartOptions
				.xAxis.visible
				? this.derivedConfig[1].chartOptions.xAxis.text
				: "";
			this.cypRegionChart.yAxis.title.text = this.derivedConfig[1].chartOptions
				.yAxis.visible
				? this.derivedConfig[1].chartOptions.yAxis.text
				: "";
			this.cypRegionChart.plotOptions = {
				series: {
					...this.cypRegionChart.plotOptions.series,
					dataLabels: {
						...this.cypRegionChart.plotOptions.series.dataLabels,
						enabled: false,
					},
					events: {
						legendItemClick: function () {
							let index = _this.cypRegionChart.series.findIndex(
								(s) => s.name === this.name
							);
							if (index >= 0) {
								_this.cypRegionChart.series[index] = {
									..._this.cypRegionChart.series[index],
									visible: !_this.cypRegionChart.series[index].visible,
								};
							}
							_this.$refs.cypRegionChart.updateScale();
						},
					},
					showInLegend: true,
				},
			};
			let min1 = 0,
				max1 = 0;
			ocypDrillDownChartSeries.series.forEach((d) => {
				let innerDataArr = d.data.map((dInner) => dInner.y);
				let innerMin = Math.min(...innerDataArr);
				let innerMax = Math.max(...innerDataArr);
				if (innerMin < min1) {
					min1 = innerMin;
				}
				if (innerMax > max1) {
					max1 = innerMax;
				}
			});
			this.cypDrillDownChart.yAxis.min = min1 > 0 ? 0 : min1;
			this.cypDrillDownChart.yAxis.max = max1;
			this.yMax = max1;
			//*** Added by ashvini *****/
			if (bIsCom) {
				let newSeries = ocypDrillDownChartSeries.series;
				newSeries.forEach((d) => {
					d.data.forEach((dy) => {
						dy.y = parseInt(dy.y);
					});
					// return innerD;
				});
				this.cypDrillDownChart.series = newSeries;
			} else {
				this.cypDrillDownChart.series = ocypDrillDownChartSeries.series;
			}

			this.cypDrillDownChart.tableData = aAggregateTable;
			// let aScatterPoints = internalCalc.addMarkers(oDeviatedData);
			// this.cypDrillDownChart.drilldown.series = [...oNormalData.drillDown,...aScatterPoints];
			this.cypDrillDownChart.drilldown.series = oDrillDownSeries.series;
			this.cypDrillDownChart.plotOptions = {
				...this.cypDrillDownChart.plotOptions,
				series: {
					...this.cypDrillDownChart.plotOptions.series,
					events: {
						legendItemClick: function (e) {
							if (e.target.drilldown !== undefined) {
								let index = _this.cypDrillDownChart.series.findIndex(
									(s) => s.name === this.name
								);
								if (index >= 0) {
									_this.cypDrillDownChart.series[index] = {
										..._this.cypDrillDownChart.series[index],
										visible: !_this.cypDrillDownChart.series[index].visible,
									};
								}
								_this.$refs.cypDrillDownChart.updateScale();
							}
						},
					},
					cursor: "pointer",
				},
			};

			this.cypRegionChart.chart.events = {
				load: function () {
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
						_this.download2 = false;
					} else {
						_this.download2 = true;
					}
				},
			};
			this.cypDrillDownChart.chart.events = {
				selection: function (e) {
					if (!e.xAxis) {
						let catLen = this.options.series[0].data.length - 1;
						if (catLen > 11 && !_this.reportChartData) {
							setTimeout(() => {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}, 0);
						}
						_this.download1 = false;
					} else {
						_this.download1 = true;
					}
				},
				load: function () {
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
				drillup: function (e) {
					_this.bIsDrillDown = false;
					_this.cypRegionWiseDrillDown.series = [];
					_this.aggRegionBound.outliers = [
						...ocypDrillDownChartSeries.outliers,
					];
					this.options.chart.zoomType = "x";
					this.xAxis[0].options.max =
						e.seriesOptions.data.length - 1 > 11
							? !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1
							: e.seriesOptions.data.length - 1;
					this.yAxis[0].options.max = _this.yMax;
					delete e.target.options.plotOptions.point;
				},
				drilldown: function (e) {
					this.yAxis[0].options.max = null;
					this.xAxis[0].options.max =
						e.seriesOptions.data.length - 1 > 11
							? !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1
							: e.seriesOptions.data.length - 1;
					// let drillSeries = oDrillDownSeries.series.find(s => s.name === e.point.name)
					// if(drillSeries) {
					e.target.options.plotOptions = {
						...e.target.options.plotOptions,
						series: {
							...e.target.options.plotOptions.series,
							point: {
								events: {
									click: function () {
										if (this.series && !_this.reportChartData) {
											_this.changeLocation(this.locationID);
										}
									},
								},
							},
						},
					};
					let minus2SD = [],
						plus2SD = [],
						mainSeries = {
							name: e.seriesOptions.name,
							type: e.seriesOptions.type,
							data: [],
							visible: true,
							color: "#7cb5ec",
						};
					// oDrillDownSeries.series
					e.seriesOptions.data.forEach((d) => {
						let dLow = null,
							dHigh = null,
							dY = null;
						if (bIsCom) {
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
					_this.aggRegionBound.outliers = null;
					_this.bIsDrillDown = true;
					let sMonth = e.seriesOptions.id,
						nCatIndex = oNormalData.categories.indexOf(sMonth),
						aOutliers = oDrillDownSeries.outliers[sMonth];
					_this.aggRegionBound.outliers = aOutliers.length ? aOutliers : ["NA"];
					if (nCatIndex > -1) {
						_this.cypRegionWiseDrillDown.series =
							internalCalc.getcypRegionSeries(oAvgChartData, nCatIndex);
					}
					// }
				},
			};

			let exportArr = [];
			if (this.exportPosition === "3") {
				if (
					this.aggregate1Disable &&
					this.cypDrillDownChart.series.length > 0
				) {
					exportArr.push({ cardKey: "key10", ...this.cypDrillDownChart });
				}
				if (this.aggregate2Disable && this.cypRegionChart.series.length > 0) {
					exportArr.push({ cardKey: "key11", ...this.cypRegionChart });
				}
			}
			this.aggRegionBound.outliers = [
				...ocypDrillDownChartSeries.outliers,
			].reverse();
			if (this.aggRegionBound.outliers && this.aggRegionBound.outliers.length) {
				let formattedPeriod = translateDate({
					rawDate: this.period,
					periodType: this.periodType,
				});

				if (this.aggRegionBound.outliers.includes(formattedPeriod)) {
					this.$emit("sendScore", this.scoreKey, false, exportArr);
				} else {
					this.$emit("sendScore", this.scoreKey, true, exportArr);
				}
			} else {
				this.$emit("sendScore", this.scoreKey, true, exportArr);
			}
			if (
				(this.reportChartData &&
					this.reportChartData.cid.split("/")[1] === this.aggregateCID1) ||
				(this.reportChartData &&
					this.reportChartData.linkedCharts.find((c) =>
						c.includes(this.aggregateCID1)
					))
			) {
				let cid = this.getCID(this.reportChartData, this.aggregateCID1);
				this.$emit("setReportChart", {
					chartObj: this.cypDrillDownChart,
					chartName: this.aggregateChartHeading1,
					cid: [cid],
				});
				// return;
			}
			if (
				(this.reportChartData &&
					this.reportChartData.cid.split("/")[1] === this.aggregateCID2) ||
				(this.reportChartData &&
					this.reportChartData.linkedCharts.find((c) =>
						c.includes(this.aggregateCID2)
					))
			) {
				let cid = this.getCID(this.reportChartData, this.aggregateCID2);
				this.$emit("setReportChart", {
					chartObj: this.cypRegionChart,
					chartName: this.aggregateChartHeading2,
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
			let oNormalData = internalCalc.getTotalData(
					this.internalValidationResponseBackground,
					this.scorecardDefaultLocationID.split("/")[1],
					this.cypFactors,
					bIsCom,
					this.$i18n.locale,
					this.periodType,
					this.$moment
				),
				oDeviatedData = internalCalc.getStdDevForCypregion(
					oNormalData.wholeSeriesNum,
					this.standardDeviation
				),
				ocypDrillDownChartSeries = internalCalc.addRangeLabelWithColor(
					oNormalData.aggregate,
					oDeviatedData,
					this.$i18n.t("high"),
					this.$i18n.t("low")
				);

			let outliers = [...ocypDrillDownChartSeries.outliers].reverse();
			if (outliers && outliers.length) {
				let formattedPeriod = translateDate({
					rawDate: this.periodScorecard,
					periodType: this.periodType,
				});

				if (outliers.includes(formattedPeriod)) {
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
			}, 1500);
		},
	},
	created() {
		if (!this.reportChartData) {
			this.$store.state.loading = false;
		}
		// this.getIndicatorsData();
		this.calculateAggregateData();
	},
};
</script>
