<template>
	<div class="analytic-charts">
		<template v-if="charts.length">
			<HighChartComponent
				v-for="(chart, i) in charts"
				:r2="chart.r2"
				:cID="chart.cID"
				:key="'chart' + i + chart.cID + subTab.id"
				class="border-bottom"
				:outliers="chart.outliers"
				:dataFetched="dataFetched"
				:chartData="chart.chartData"
				:showLabels="chart.showLabels"
				:drillPointBenchmark="chart.drillPointBenchmark"
				:chartType="chart.chartCategory === 'trend' ? 'period' : 'regional'"
			/>
		</template>
		<template v-else>
			<HighChartComponent :chartData="placeholderObj" />
		</template>
	</div>
</template>
<script>
import service from "@/service";
import {
	getDateRange,
	generateChart,
	subtractNDate,
	translateDate,
} from "@/components/Common/commonFunctions";
import { generateScatterChart } from "./ICCCharts";
import basicChartConfig from "@/config/basicChartConfig.js";
import standardDeviation from "ml-array-standard-deviation";
import SetChartMetaDataMixin from "@/helpers/SetChartMetaDataMixin";
import HighChartComponent from "@/components/Highcharts/HighChartComponentDynamic";
import externalChartConfig from "@/components/FPDashboard/dqr/externalValidation/externalChartConfig.js";
export default {
	props: [
		"subTab",
		"childArr",
		"locationPeriod",
		"reportChartData",
		"scorecardLocation",
	],
	mixins: [SetChartMetaDataMixin],
	components: {
		HighChartComponent,
	},
	data() {
		return {
			periodLength: 1,
			dataFetched: false,
			charts: [],
			placeholderObj: basicChartConfig,
		};
	},
	computed: {
		selectedDate() {
			return translateDate({
				rawDate: this.locationPeriod.period,
				periodType: this.locationPeriod.periodType,
				monthlyFormat: "MMM YYYY",
			});
		},
	},
	watch: {
		locationPeriod: {
			handler(newValue, oldValue) {
				if (oldValue && newValue.location !== oldValue.location) {
					this.dataFetched = false;
					this.charts = [];
					this.setValues();
				}
			},
			deep: true,
		},
		scorecardLocation(newValue) {
			if (newValue) {
				this.setValues();
			}
		},
	},
	methods: {
		updateOutliersList({ name, value, header, outliers, method = "default" }) {
			if (!outliers[method]) {
				outliers = {
					[method]: [
						{
							header,
							outlierList: [],
						},
					],
				};
			}
			let isMIndex = outliers[method].findIndex((m) => m.header === header);
			if (isMIndex >= 0) {
				let isFound = outliers[method][isMIndex].outlierList.findIndex(
					(o) => o.name === name
				);
				if (isFound >= 0) {
					outliers[method][isMIndex].outlierList[isFound].outliers.push(value);
				} else {
					outliers[method][isMIndex].outlierList.push({
						name: name,
						outliers: [value],
					});
				}
			} else {
				outliers[method].push({
					header,
					outlierList: [],
				});
			}
			return outliers;
		},
		findOutliers({
			cObj,
			type,
			header,
			isMethods = false,
			substantialChange = 0,
			benchmarkValue = null,
			standardDeviationValue = null,
			currentPeriod = null,
		}) {
			const getAvg = (d) => {
				let data = d.map((d) => d.y);
				let nLen = data.length;
				let nSum = data.reduce((a, b) => a + b, 0);
				let avg = nLen ? nSum / nLen : 0;
				return {
					data,
					avg,
				};
			};
			const getHighLow = (c, m = "default") => {
				let { data, avg } = getAvg(c.data);
				let stdDev = standardDeviation(data);
				let low = avg * 1 - standardDeviationValue * stdDev;
				let high = avg * 1 + standardDeviationValue * stdDev;
				let updatedData = c.data.map((d) => {
					d.label = d.y > high ? "High" : d.y < low ? "Low" : "";
					d.color = d.y > high ? "#55BF3B" : d.y < low ? "#DF5353" : "";
					if (d.label) {
						if (d.pe === currentPeriod) {
							isOutlier = true;
						}
						outliers = this.updateOutliersList({
							header,
							outliers,
							name: c.name,
							value: d.name,
							method: m,
						});
					}
					return d;
				});
				return {
					high,
					low,
					avg,
					stdDev,
					updatedData,
				};
			};
			const getUpdatedData = (data, m = "default") => {
				let updatedM = data.map((c) => {
					let { high, low, avg, stdDev, updatedData } = getHighLow(c, m);
					return {
						...c,
						data: updatedData,
						stdDev,
						low,
						high,
						avg,
					};
				});
				return updatedM;
			};
			let outliers = {},
				isOutlier = false;

			if (type === "-CT-") {
				cObj.series = cObj.series.map((s) => {
					if (substantialChange) {
						let { avg } = getAvg(s.data);
						let substantialChangeAvg = avg.toFixed(2);
						s.data.map((d) => {
							if (avg - d.y * 1 < -substantialChange) {
								outliers = this.updateOutliersList({
									header: `${this.$i18n.t("rr_text2", {
										substantialChange: substantialChange,
										substantialChangeAvg: substantialChangeAvg
											? `(${substantialChangeAvg})%`
											: "",
									})}`,
									outliers,
									name: s.name,
									value: `${d.name} (${(avg - d.y * 1).toFixed(2)}%)`,
								});
							}
						});
					}
					return {
						...s,
						data: s.data.map((d) => {
							if (d.y < benchmarkValue) {
								d.color = "#FE8081";
								outliers = this.updateOutliersList({
									header,
									outliers,
									name: s.name,
									value: `${d.name} (${d.y}%)`,
								});
							}
							return d;
						}),
					};
				});
			}

			if (type === "-IC-") {
				if (isMethods) {
					cObj.methodSeries = cObj.methodSeries.map((m) => {
						let updatedM = getUpdatedData(m.data, m.name);
						return {
							...m,
							data: updatedM,
						};
					});
				} else {
					cObj.series = getUpdatedData(cObj.series);
				}
			}

			return { oSeries: cObj, outliers, isOutlier };
		},
		getCharts(plotLines = []) {
			let period = getDateRange({
				sendPeriod: this.locationPeriod.period,
				periodType: this.locationPeriod.periodType,
				periodLength: this.periodLength,
			});
			period = period.reverse().join(";");
			let loc = this.scorecardLocation
				? this.scorecardLocation
				: this.locationPeriod.location;
			let location = loc.split("/")[1];
			let levelID = loc.split("/")[0] * 1;
			let subLevelID = levelID + 1;
			let de = [];
			let catArray = [];
			if (this.subTab.group.includes("-CC-")) {
				this.subTab.sourceMapping.forEach((element) => {
					let mapObj = {
						name: element.tabName,
						dx: [],
					};
					element.mapping.forEach((map) => {
						map.indicator.subIndicator.forEach((subEle) => {
							subEle.selectedDE.forEach((s) => {
								de.push(s.id);
								mapObj.dx.push(s.id);
							});
						});
					});
					catArray.push(mapObj);
				});
			} else {
				this.subTab.mapping.forEach((element) => {
					let mapObj = {
						name: element.indicator.name,
						color: element.indicator.color,
						visible: !element.indicator.disable,
						dx: [],
					};
					element.indicator.subIndicator.forEach((subEle) => {
						subEle.selectedDE.forEach((s) => {
							de.push(s.id);
							mapObj.dx.push(s.id);
						});
					});
					catArray.push(mapObj);
				});
			}
			de = de.join(";");
			let currentPeriod = null;
			if (this.locationPeriod.periodType === "yearly") {
				let periodValue = this.$moment(
					this.locationPeriod.period,
					"YYYY"
				).format("YYYY");
				currentPeriod = periodValue;
			} else if (this.locationPeriod.periodType === "financialYear") {
				let currentYear = this.locationPeriod.period;
				currentPeriod = `${currentYear}April`;
			} else if (this.locationPeriod.periodType === "quarterly") {
				currentPeriod = this.locationPeriod.period;
			} else {
				let periodValue = this.$moment(
					this.locationPeriod.period,
					"YYYYMM"
				).format("YYYYMM");
				currentPeriod = periodValue;
			}
			let prevPeriod = subtractNDate({
				rawDate: currentPeriod,
				periodType: this.locationPeriod.periodType,
			});
			let minOutlier = this.subTab?.backgroundData?.minOutlier || 20;
			let wastageFactor = this.subTab?.backgroundData?.wastageFactor || 20;
			let standardDeviationValue =
				this.subTab?.backgroundData?.standardDeviation || 2;
			let r2Max = this.subTab?.backgroundData?.r2Max
				? this.subTab.backgroundData.r2Max * 1
				: 1;
			let qualityThreshold = this.subTab?.backgroundData?.qualityThreshold
				? (this.subTab.backgroundData.qualityThreshold * 1) / 100
				: 33 / 100;
			let substantialChange =
				this.subTab?.backgroundData?.substantialChange || 5;
			if (de) {
				service
					.getIndicatorData(de, [levelID, subLevelID], location, period)
					.then((response) => {
						if (response.data.rows.length) {
							let allCharts = [];
							if (this.subTab.group.includes("-CT-")) {
								let { cObj } = generateChart({
									total: true,
									drillDiff: false,
									response: response,
									location: location,
									catArray: catArray,
									chartCategory: "trend",
									benchmarkValue: plotLines[0].value,
									periodType: this.locationPeriod.periodType,
									cObj: JSON.parse(JSON.stringify(basicChartConfig)),
									color: this.subTab.chartSetting[0].chartOptions.color,
								});
								if (!this.scorecardLocation) {
									let { oSeries, outliers } = this.findOutliers({
										cObj: cObj,
										type: "-CT-",
										benchmarkValue: plotLines[0].value,
										substantialChange: substantialChange,
										header: `${this.$i18n.t("rr_text1", {
											option: this.subTab.group.includes("onTimeRR")
												? this.$i18n.t("rr_text1_opt2")
												: this.$i18n.t("rr_text1_opt1"),
										})} ${plotLines[0].value}%`,
									});
									cObj = this.setMetaData({
										chartData: oSeries,
										chartOptions: this.subTab.chartSetting[0].chartOptions,
										plotLines,
									});
									allCharts.push({
										chartData: cObj,
										outliers: outliers,
										chartCategory: "trend",
										drillPointBenchmark: true,
										cID: this.subTab.chartSetting[0].chartOptions.cid,
									});
								}
								if (
									this.reportChartData &&
									this.reportChartData.cid.split("/")[1] ===
										this.subTab.chartSetting[0].chartOptions.cid
								) {
									this.$emit("setReportChart", {
										id: this.subTab.id,
										chartCategory: "trend",
										chartData: cObj,
									});
								}
								let s =
									cObj.series.length &&
									cObj.series[0].data.find((obj) => obj.pe == currentPeriod);
								let hoverText = this.$i18n.t("rr_hover", {
									date: this.selectedDate ? "(" + this.selectedDate + ")" : "",
									plotLines: plotLines.length
										? "(" + plotLines[0].value + "%)"
										: "",
								});
								if (s) {
									let obj = {
										errorMsg: "",
										id: this.subTab.id,
										score: s.y > plotLines[0].value * 1 ? 1 : 0,
									};
									if (this.scorecardLocation) {
										obj["scorecardLocation"] = this.scorecardLocation;
									} else {
										obj["hoverText"] = hoverText;
									}

									this.$emit("summaryData", obj);
								} else {
									let obj = {
										score: null,
										id: this.subTab.id,
										errorMsg: "Data not available for selected period",
									};
									if (this.scorecardLocation) {
										obj["scorecardLocation"] = this.scorecardLocation;
									} else {
										obj["hoverText"] = hoverText;
									}
									this.$emit("summaryData", obj);
								}
								if (!this.scorecardLocation) {
									let { cObj: cObj2 } = generateChart({
										response: response,
										catArray: catArray,
										location: location,
										chartCategory: "regionalDiff",
										currentPeriod: currentPeriod,
										prevPeriod: prevPeriod,
										periodType: this.locationPeriod.periodType,
										cObj: JSON.parse(JSON.stringify(basicChartConfig)),
									});

									cObj2 = this.setMetaData({
										chartData: cObj2,
										chartOptions: this.subTab.chartSetting[1].chartOptions,
									});

									allCharts.push({
										chartData: cObj2,
										chartCategory: "regionalDiff",
										cID: this.subTab.chartSetting[1].chartOptions.cid,
									});
									if (
										this.reportChartData &&
										this.reportChartData.cid.split("/")[1] ===
											this.subTab.chartSetting[1].chartOptions.cid
									) {
										this.$emit("setReportChart", {
											id: this.subTab.id,
											chartCategory: "regional",
											chartData: cObj2,
										});
									}

									let { cObj: cObj1 } = generateChart({
										response: response,
										catArray: catArray,
										location: location,
										chartCategory: "regionalTrend",
										currentPeriod: currentPeriod,
										periodType: this.locationPeriod.periodType,
										cObj: JSON.parse(JSON.stringify(basicChartConfig)),
									});
									let { oSeries, outliers } = this.findOutliers({
										cObj: cObj1,
										type: "-CT-",
										benchmarkValue: plotLines[0].value,
										header: `${this.$i18n.t("rr_text12", {
											option: this.subTab.group.includes("onTimeRR")
												? this.$i18n.t("rr_text1_opt2")
												: this.$i18n.t("rr_text1_opt1"),
										})} ${plotLines[0].value}%`,
									});
									cObj1 = this.setMetaData({
										chartData: oSeries,
										chartOptions: this.subTab.chartSetting[2].chartOptions,
										plotLines,
									});
									allCharts.push({
										chartData: cObj1,
										outliers: outliers,
										chartCategory: "regional",
										cID: this.subTab.chartSetting[2].chartOptions.cid,
									});
									if (
										this.reportChartData &&
										this.reportChartData.cid.split("/")[1] ===
											this.subTab.chartSetting[2].chartOptions.cid
									) {
										this.$emit("setReportChart", {
											id: this.subTab.id,
											chartCategory: "regional",
											chartData: cObj1,
										});
									}
								}
							}
							if (this.subTab.group.includes("-IC-")) {
								let { cObj } = generateChart({
									response: response,
									catArray: catArray,
									location: location,
									chartCategory: "trend",
									periodType: this.locationPeriod.periodType,
									cObj: JSON.parse(JSON.stringify(basicChartConfig)),
									total: this.subTab.group.includes("-total") ? true : false,
								});
								if (!this.scorecardLocation) {
									cObj = this.setMetaData({
										chartData: cObj,
										chartOptions: this.subTab.chartSetting[0].chartOptions,
									});
								}
								let isOutlier = false;

								let { oSeries, outliers } = this.findOutliers({
									cObj: cObj,
									type: "-IC-",
									currentPeriod,
									standardDeviationValue,
									header: this.$i18n.t("aggRegionBound", {
										standardDeviation: standardDeviationValue,
									}),
								});
								cObj = oSeries;

								let hoverText = this.$i18n.t("ic_hover", {
									date: this.selectedDate ? "(" + this.selectedDate + ")" : "",
									standardDeviation: standardDeviationValue,
								});
								let obj = {
									errorMsg: "",
									id: this.subTab.id,
									score: isOutlier ? 0 : 1,
								};
								if (this.scorecardLocation) {
									obj["scorecardLocation"] = this.scorecardLocation;
								} else {
									obj["hoverText"] = hoverText;
								}
								this.$emit("summaryData", obj);
								if (
									this.reportChartData &&
									this.reportChartData.cid.split("/")[1] ===
										this.subTab.chartSetting[0].chartOptions.cid
								) {
									this.$emit("setReportChart", {
										chartData: cObj,
										showLabels: true,
										id: this.subTab.id,
										chartCategory: "trend",
									});
								}
								if (!this.scorecardLocation) {
									allCharts.push({
										chartData: cObj,
										showLabels: true,
										outliers: outliers,
										chartCategory: "trend",
										cID: this.subTab.chartSetting[0].chartOptions.cid,
									});
								}
								if (!this.scorecardLocation) {
									let { cObj: cObj1 } = generateChart({
										response: response,
										catArray: catArray,
										location: location,
										chartCategory: this.subTab.group.includes("-total")
											? "regionalTrend"
											: "regionalMethodTrend",
										currentPeriod: currentPeriod,
										periodType: this.locationPeriod.periodType,
										cObj: JSON.parse(JSON.stringify(basicChartConfig)),
									});
									cObj1 = this.setMetaData({
										chartData: cObj1,
										chartOptions: this.subTab.chartSetting[1].chartOptions,
										plotLines,
									});

									let { oSeries, outliers } = this.findOutliers({
										cObj: cObj1,
										type: "-IC-",
										currentPeriod,
										isMethods: this.subTab.group.includes("-total")
											? false
											: true,
										standardDeviationValue,
										header: this.$i18n.t("aggRegionBound", {
											standardDeviation: standardDeviationValue,
										}),
									});
									cObj1 = oSeries;

									allCharts.push({
										chartData: cObj1,
										showLabels: true,
										outliers: outliers,
										chartCategory: "regional",
										cID: this.subTab.chartSetting[1].chartOptions.cid,
									});
									if (
										this.reportChartData &&
										this.reportChartData.cid.split("/")[1] ===
											this.subTab.chartSetting[1].chartOptions.cid
									) {
										this.$emit("setReportChart", {
											id: this.subTab.id,
											chartCategory: "regional",
											chartData: cObj1,
										});
									}
								}
							}
							if (this.subTab.group.includes("-CC-")) {
								let { cObj, cObj1, cObj2, r2 } = generateScatterChart({
									response: response,
									location: location,
									catArray: catArray,
									minOutlier: minOutlier,
									childArr: this.childArr,
									wastageFactor: wastageFactor,
									currentPeriod: currentPeriod,
									periodLength: this.periodLength,
									qualityThreshold: qualityThreshold,
									backgroundData: this.subTab.backgroundData,
									periodType: this.locationPeriod.periodType,
									isSingleSource: this.subTab.isSingleSource,
									chartOptions: this.subTab.chartSetting[0].chartOptions,
									chartOptions1: this.subTab.chartSetting[1].chartOptions,
									chartOptions2: this.subTab.chartSetting[2].chartOptions,
									cObj: JSON.parse(JSON.stringify(externalChartConfig.method)),
									cObj1: JSON.parse(
										JSON.stringify(externalChartConfig.outlier)
									),
									cObj2: JSON.parse(
										JSON.stringify(externalChartConfig.average)
									),
								});
								if (!this.scorecardLocation) {
									cObj = this.setMetaData({
										chartData: cObj,
										chartOptions: this.subTab.chartSetting[0].chartOptions,
									});
									allCharts.push({
										chartData: cObj,
										cID: this.subTab.chartSetting[0].chartOptions.cid,
										chartCategory: "regional",
										r2: r2,
									});
								}
								let factor = "<sup>2</sup>";
								let hoverText = this.$i18n.t("icc_hover", {
									r2Max,
									factor,
								});
								let obj = {
									errorMsg: r2 >= 0 ? "" : `Error in R${factor} calculation`,
									id: this.subTab.id,
									score: r2 >= 0 ? (r2 > r2Max ? 1 : 0) : null,
								};
								if (this.scorecardLocation) {
									obj["scorecardLocation"] = this.scorecardLocation;
								} else {
									obj["hoverText"] = hoverText;
								}
								this.$emit("summaryData", obj);
								if (
									this.reportChartData &&
									this.reportChartData.cid.split("/")[1] ===
										this.subTab.chartSetting[0].chartOptions.cid
								) {
									this.$emit("setReportChart", {
										id: this.subTab.id,
										chartCategory: "regional",
										chartData: cObj,
										r2: r2,
									});
								}

								if (!this.subTab.isSingleSource && !this.scorecardLocation) {
									cObj1 = this.setMetaData({
										chartData: cObj1,
										chartOptions: this.subTab.chartSetting[1].chartOptions,
									});
									allCharts.push({
										chartData: cObj1,
										cID: this.subTab.chartSetting[1].chartOptions.cid,
										chartCategory: "regional",
									});
									if (
										this.reportChartData &&
										this.reportChartData.cid.split("/")[1] ===
											this.subTab.chartSetting[1].chartOptions.cid
									) {
										this.$emit("setReportChart", {
											id: this.subTab.id,
											chartCategory: "regional",
											chartData: cObj1,
										});
									}

									cObj2 = this.setMetaData({
										chartData: cObj2,
										chartOptions: this.subTab.chartSetting[2].chartOptions,
									});
									allCharts.push({
										chartData: cObj2,
										cID: this.subTab.chartSetting[2].chartOptions.cid,
										chartCategory: "regional",
									});
									if (
										this.reportChartData &&
										this.reportChartData.cid.split("/")[1] ===
											this.subTab.chartSetting[2].chartOptions.cid
									) {
										this.$emit("setReportChart", {
											id: this.subTab.id,
											chartCategory: "regional",
											chartData: cObj2,
										});
									}
								}
							}
							this.charts = allCharts;
						} else {
							let obj = {
								score: null,
								id: this.subTab.id,
								errorMsg: "No Data to Display",
							};
							if (this.scorecardLocation) {
								obj["scorecardLocation"] = this.scorecardLocation;
							}
							this.$emit("summaryData", obj);
						}
						this.dataFetched = true;
					})
					.catch(() => {
						this.dataFetched = true;
						let obj = {
							score: null,
							id: this.subTab.id,
							errorMsg: "Error in fetching data",
						};
						if (this.scorecardLocation) {
							obj["scorecardLocation"] = this.scorecardLocation;
						}
						this.$emit("summaryData", obj);
					});
			} else {
				this.dataFetched = true;
				let obj = {
					score: null,
					id: this.subTab.id,
					errorMsg: "Mapping not available",
				};
				if (this.scorecardLocation) {
					obj["scorecardLocation"] = this.scorecardLocation;
				}
				this.$emit("summaryData", obj);
			}
		},
		setValues() {
			if (this.subTab.group.includes("-CT-")) {
				this.periodLength = 24;
				let plotLines =
					this.$store.getters.getGlobalFactors()?.rrBenchmarking?.Overall
						?.plotLines || [];
				this.getCharts(plotLines);
			}
			if (this.subTab.group.includes("-IC-")) {
				this.periodLength = 25;
				this.getCharts();
			}
			if (this.subTab.group.includes("-CC-")) {
				this.periodLength = this.subTab.isSingleSource ? 4 : 1;
				this.getCharts();
			}
		},
	},
	created() {
		this.setValues();
	},
};
</script>
