<template>
	<div class="analytic-charts">
		<HighChartComponent
			:cID="cID"
			class="border-bottom"
			:dataFetched="dataFetched"
			v-bind:chart-data="chartData"
			:chartType="chartCategory === 'trend' ? 'period' : 'regional'"
		/>
	</div>
</template>

<script>
import service from "@/service";
import HighChartComponent from "@/components/Highcharts/HighChartComponentDynamic";
import basicChartConfig from "@/config/basicChartConfig.js";
import {
	getDateRange,
	generateChart,
} from "@/components/Common/commonFunctions";
import SummaryDataMixin from "@/helpers/SummaryDataMixin";
import CalculateFlagMixin from "@/helpers/CalculateFlagMixin";
export default {
	props: [
		"chartCategory",
		"tab",
		"flagKey",
		"subTab",
		"locationPeriod",
		"sendMapData",
		"summaryType",
		"globalResponse",
		"isAnalytical",
	],
	data() {
		// console.log(this.summaryType);
		return {
			cID: null,
			chartData: JSON.parse(JSON.stringify(basicChartConfig)),
			dataFetched: false,
			getNewFlagKey:
				this.tab["group"] + "_" + this.subTab["group"] + "_" + this.flagKey,
		};
	},
	mixins: [SummaryDataMixin, CalculateFlagMixin],
	components: {
		HighChartComponent,
	},
	watch: {
		summaryType(newVal) {
			//console.log(newVal);
		},
		locationPeriod: {
			handler() {
				// console.log("updated location period", newValue);
				this.dataFetched = false;
				this.getData();
			},
			deep: true,
		},
	},
	methods: {
		setMetaData() {
			let chartMetaData = null;
			if (this.chartCategory === "trend") {
				chartMetaData = this.subTab.chartSetting[0]
					? this.subTab.chartSetting[0].chartOptions
					: null;
			} else {
				chartMetaData = this.subTab.chartSetting[1]
					? this.subTab.chartSetting[1].chartOptions
					: null;
			}
			// console.log(
			// 	this.tab.tabName,
			// 	this.subTab.tabName,
			// 	JSON.parse(JSON.stringify(chartMetaData))
			// );
			if (chartMetaData) {
				this.cID = chartMetaData.cid;
				let type =
					chartMetaData.type === "stack" ? "column" : chartMetaData.type;
				let isStack = chartMetaData.type === "stack";
				this.chartData = {
					...this.chartData,
					chart: { ...this.chartData.chart, height: null, type: type },
					plotOptions: {
						...this.chartData.plotOptions,
						series: {
							...this.chartData.plotOptions.series,
							stacking: isStack ? "normal" : "",
						},
					},
				};
				this.chartData.title.text = chartMetaData.title.visible
					? chartMetaData.title.text
					: "";
				this.chartData.title.title = chartMetaData.chartName;
				this.chartData.subtitle.text = chartMetaData.subTitle.visible
					? chartMetaData.subTitle.text
					: "";
				this.chartData.xAxis.title.text = chartMetaData.xAxis.visible
					? chartMetaData.xAxis.text
					: "";
				this.chartData.yAxis.title.text = chartMetaData.yAxis.visible
					? chartMetaData.yAxis.text
					: "";
				this.chartData.plotOptions.series.dataLabels.enabled =
					chartMetaData.dataLabels;
			}
			// console.log(
			// 	"this.chartData",
			// 	this.tab.tabName,
			// 	this.subTab.tabName,
			// 	JSON.parse(JSON.stringify(this.chartData))
			// );
		},
		getData() {
			// this.$store.commit("setLoading", true);
			this.chartData.series = [];
			let period = getDateRange({
				sendPeriod: this.locationPeriod.period,
				periodType: this.locationPeriod.periodType,
				periodLength: this.chartCategory === "trend" ? 24 : 1,
			});
			period = period.reverse().join(";");
			// console.log("period", period);
			let location = this.locationPeriod.location.split("/")[1];
			// console.log("location", location);
			let levelID = this.locationPeriod.location.split("/")[0] * 1;
			// console.log("levelID", levelID);
			let subLevelID = levelID + 1;
			// console.log("subLevelID", subLevelID);
			let de = [];
			let catArray = [];
			this.subTab.mapping.forEach((element) => {
				let mapObj = {
					name: element.indicator.name,
					color: element.indicator.color,
					visible: !element.indicator.disable,
					static_name: element.indicator.static_name,
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
			de = de.join(";");
			// console.log("de", de);
			// console.log("catArray", catArray);
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
			this.setMetaData();
			if (de) {
				service
					.getIndicatorData(de, [levelID, subLevelID], location, period)
					.then((response) => {
						// console.log("response", response);
						if (response.data.rows.length) {
							let { cObj } = generateChart({
								response: response,
								cObj: this.chartData,
								catArray: catArray,
								chartCategory: this.chartCategory,
								location: location,
								currentPeriod: currentPeriod,
								periodType: this.locationPeriod.periodType,
							});
							if (this.sendMapData === "true") {
								let emitData = response.data.rows.filter(
									(obj) => obj[2] !== location
								);
								this.$emit("mapData", {
									static_name: catArray[0]["static_name"],
									location: location,
									summaryType: this.summaryType,
									periodType: this.locationPeriod.periodType,
									mapData: emitData,
									period: period.split(";"),
								});
							}
							// console.log(cObj, this.subTab.group);
							if (this.subTab.summary && !this.subTab.summary.disable) {
								if (this.chartCategory === "trend") {
									this.calculateSummary();
								} else {
									this.$emit("summaryChartData", {
										id: this.subTab.id,
										chartCategory: this.chartCategory,
										chartData: this.chartData,
									});
								}
							} else {
								if (this.chartCategory === "trend") {
									this.calculateSummary();
									// console.log("calculateFlag obj", {
									//   rawData: response,
									//   location: this.locationPeriod.location,
									//   type: "type4",
									//   period: this.locationPeriod.period,
									//   periodType: this.locationPeriod.periodType,
									//   globalFactorsData: this.globalResponse,
									// });
									if (this.isAnalytical) {
										this.calculateFlag({
											rawData: response,
											globalFactorsData: this.globalResponse,
											location: this.locationPeriod.location,
											type: "type4",
											period: this.locationPeriod.period,
											periodType: this.locationPeriod.periodType,
										});
									}
								} else {
									this.$emit("summaryChartData", {
										id: this.subTab.id,
										chartCategory: this.chartCategory,
										chartData: this.chartData,
									});
								}
							}

							// console.log("cObj", cObj);
						} else {
							if (this.subTab.summary && !this.subTab.summary.disable) {
								this.$emit("summaryChartData", {
									id: this.subTab.id,
									chartCategory: this.chartCategory,
									chartData: this.chartData,
									errorMsg: "No Data to Display",
								});
							} else {
								this.$emit("summaryChartData", {
									id: this.subTab.id,
									chartCategory: this.chartCategory,
									chartData: this.chartData,
									errorMsg: "No Data to Display",
								});
							}
							if (this.sendMapData === true) {
								this.$emit("mapData", {
									static_name: catArray[0]["static_name"],
									location: location,
									periodType: this.locationPeriod.periodType,
									summaryType: this.summaryType,
									mapData: [],
									period: period.split(";"),
									errorMsg: "No Data to Display",
								});
							}
						}
						this.dataFetched = true;
						// this.$store.commit("setLoading", false);
					})
					.catch((res) => {
						this.dataFetched = true;
						//console.log("res", res);
						if (this.subTab.summary && !this.subTab.summary.disable) {
							this.$emit("summaryChartData", {
								id: this.subTab.id,
								chartCategory: this.chartCategory,
								chartData: this.chartData,
								errorMsg: "Error in fetching data",
							});
						} else {
							this.$emit("summaryChartData", {
								id: this.subTab.id,
								chartCategory: this.chartCategory,
								chartData: this.chartData,
								errorMsg: "Error in fetching data",
							});
						}
						if (this.sendMapData === true) {
							this.$emit("mapData", {
								static_name: catArray[0]["static_name"],
								location: location,
								periodType: this.locationPeriod.periodType,
								summaryType: this.summaryType,
								mapData: [],
								period: period.split(";"),
								errorMsg: "Error in fetching data",
							});
						}
						// this.$store.commit("setLoading", false);
					});
			} else {
				if (this.subTab.summary && !this.subTab.summary.disable) {
					this.$emit("summaryChartData", {
						id: this.subTab.id,
						chartCategory: this.chartCategory,
						chartData: this.chartData,
						errorMsg: "Mapping not available",
					});
				} else {
					this.$emit("summaryChartData", {
						id: this.subTab.id,
						chartCategory: this.chartCategory,
						chartData: this.chartData,
						errorMsg: "Mapping not available",
					});
				}
				if (this.sendMapData === true) {
					this.$emit("mapData", {
						location: location,
						periodType: this.locationPeriod.periodType,
						summaryType: this.summaryType,
						mapData: [],
						period: period.split(";"),
						errorMsg: "Mapping not available",
					});
				}
			}
		},
		
		
		getSummaryText({
			indicatorName,
			compLastMn,
			compLastYr,
			prevForDate,
			prevYrForDate,
		}) {
			let found = [], // an array to collect the strings that are found
				rxp = /{([^}]+)}/g,
				summaryText = this.subTab.summary
					? this.subTab.summary.summaryText
					: null,
				curMatch;
			if (summaryText) {
				while ((curMatch = rxp.exec(summaryText))) {
					found.push(curMatch[1]);
				}
				// console.log("summary functions", found);
				let calculatedValues = {};
				found.forEach((f) => {
					switch (f) {
						case "INDICATOR_NAME":
							calculatedValues[f] = indicatorName;
							break;
						case "COMPARE_LAST_MONTH":
							calculatedValues[f] = compLastMn;
							break;
						case "COMPARE_LAST_YEAR":
							calculatedValues[f] = compLastYr;
							break;
						case "LAST_PERIOD":
							calculatedValues[f] = prevForDate;
							break;
						case "LAST_YEAR_PERIOD":
							calculatedValues[f] = prevYrForDate;
							break;
					}
				});
				found.forEach((f) => {
					summaryText = summaryText.replace(
						`{${f}}`,
						`<b>${calculatedValues[f]}</b>`
					);
				});
			}
			return { summaryText };
		},
		getBenchmark(currValue) {
			let benchmarkValue =
					this.subTab.summary && this.subTab.summary.benchmarkValue !== ""
						? this.subTab.summary.benchmarkValue * 1
						: null,
				performanceBenchmarking = "N/A";
			let percentage = this.subTab.summary
				? this.subTab.summary.percentageIndicator
				: true; //kept default percentage to true, need to add admin setting for this
			if (benchmarkValue && benchmarkValue >= 0) {
				performanceBenchmarking =
					currValue * 1 > benchmarkValue
						? "High"
						: currValue * 1 < benchmarkValue
						? "Low"
						: currValue * 1 === benchmarkValue
						? "Equal"
						: "N/A";
				benchmarkValue = percentage ? `${benchmarkValue}%` : benchmarkValue;
			}
			return { benchmarkValue, percentage, performanceBenchmarking };
		},
		
		calculateSummary() {
			//console.log("this.chartData", JSON.parse(JSON.stringify(this.chartData)));
			//console.log("this.locationPeriod", this.locationPeriod);
			let {
				currDate,
				currForDate,
				prevDate,
				prevForDate,
				prevYrDate,
				prevYrForDate,
			} = this.getPeriods();
			// console.log(
			// 	"getPeriods",
			// 	currDate,
			// 	currForDate,
			// 	prevDate,
			// 	prevForDate,
			// 	prevYrDate,
			// 	prevYrForDate
			// );
			let details = [];
			this.chartData.series.forEach((cData) => {
				let { currValue, prevValue, prevYrValue } = this.getValue(
					cData.data,
					currDate,
					prevDate,
					prevYrDate
				);

				// console.log("getValue", currValue, prevValue, prevYrValue);

				let { benchmarkValue, percentage, performanceBenchmarking } =
					this.getBenchmark(currValue);

				// console.log(
				// 	"getBenchmark",
				// 	benchmarkValue,
				// 	percentage,
				// 	performanceBenchmarking
				// );
				let d = [prevYrValue, prevValue, currValue];

				let { change } = this.getPercentChange(d[2], d[1], percentage);
				// console.log("getPercentChange", change);

				let { change: lastChange } = this.getPercentChange(
					d[2],
					d[0],
					percentage
				);
				// console.log("getPercentChange lastChange", lastChange);

				let { compare: compLastMn, color: colorLastMn } =
					this.getRangeColor(change);
				// console.log("getRangeColore", compLastMn, colorLastMn);
				let { compare: compLastYr, color: colorLastYr } =
					this.getRangeColor(lastChange);
				// console.log("getRangeColore", compLastYr, colorLastYr);

				let indicatorName = cData.name;

				let { summaryText } = this.getSummaryText({
					indicatorName,
					compLastMn,
					compLastYr,
					prevForDate,
					prevYrForDate,
				});
				// console.log("summaryText", summaryText);

				details.push({
					compLastYr,
					compLastMn,
					colorLastMn,
					colorLastYr,
					summaryText,
					currForDate,
					prevForDate,
					prevYrForDate,
					indicatorName,
					benchmarkValue,
					performanceBenchmarking,
					change: change ? `${change}%` : change,
					lastChange: lastChange ? `${lastChange}%` : lastChange,
					currValue: percentage && currValue ? `${currValue}%` : currValue,
					prevValue: percentage && prevValue ? `${prevValue}%` : prevValue,
					prevYrValue:
						percentage && prevYrValue ? `${prevYrValue}%` : prevYrValue,
				});
			});
			// console.log("details", details);
			this.$emit("summaryChartData", {
				id: this.subTab.id,
				chartCategory: this.chartCategory,
				chartData: this.chartData,
				summaryDetails: details,
			});
		},
	},
	created() {
		this.getData();
	},
};
</script>

<style scoped></style>
