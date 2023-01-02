<template>
	<div>
		<loader v-if="showLoader" />
		<div
			class="row mx-0 text-center page-main-title mb-2"
			v-if="orgLevel && methodConfig.series.length > 0"
		>
			<div class="col px-0">
				<b-alert variant="info" show class="m-0 heading-alert">
					<p class="m-0">{{ orgLevel }} {{ $t("levelData") }}</p>
				</b-alert>
			</div>
		</div>
		<TabSummary :content="categoryInfo" :contKey="method" />

		<div
			class="row mx-0"
			:class="[averageMethod.series.length === 0 ? 'mb-5' : '']"
		>
			<div class="col-lg-12 px-0">
				<div class="row">
					<div
						class="col-6"
						:class="[outliersMethod.series.length === 0 ? 'col-12' : '']"
						v-if="methodConfig.series.length > 0"
					>
						<fullscreen
							v-model="methodConfigFull"
							ref="fullscreen"
							class="fullContainer"
						>
							<div
								class="card position-relative m-t-20px bg-transparent border-none fullContent"
							>
								<loader class="cardLoader" v-if="showLoader1" />
								<div
									class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
								>
									<div class="row no-gutters">
										<div
											class="col-lg-9 col-md-9 p-t-4px"
											:class="{ 'col-lg-12 col-md-12': methodConfigFull }"
										>
											<div class="cardTitleSection text-wrap fs-19-1920">
												<i
													class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
													aria-hidden="true"
													v-b-popover.hover.rightbottom="{
														variant: 'info',
														content: methodConfigChartInfo,
														title: chartName,
														html: true,
													}"
												></i>
												<p class="title_p fs-19-1920 m-0">{{ chartName }}</p>
											</div>
										</div>
										<div
											class="col-lg-3 col-md-3 position-relative"
											v-if="!methodConfigFull"
										>
											<ChartOptions
												sorting="null"
												:title="chartName"
												@showTable="showTable"
												@exportChart="exportChart"
												:cID="methodConfigCID"
												chartKey="methodConfig"
												:trendTable="methodConfigTable"
												@toggleFullscreen="toggleFullscreen"
											/>
										</div>
									</div>
								</div>

								<div
									class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
								>
									<div
										class="row px-3"
										:class="{ hidden: methodConfigType === 'table' }"
										v-if="methodConfig.series.length"
									>
										<div class="col-lg-12 col-md-12">
											<ChartFilters
												:averagePeriods="averagePeriods"
												:periodLength="periodLength"
												@updatePeriodLength="updatePeriodLength"
											/>
										</div>
									</div>
									<div class="row mx-0">
										<template v-if="methodConfigType !== 'table'">
											<div class="col-12">
												<div class="text-right hide">
													<b-form-checkbox
														switch
														size="sm"
														v-model="excludeMethodOutliers"
														>Exclude Outliers</b-form-checkbox
													>
												</div>
												<highcharts
													class="chartHeight m-t-10px"
													:options="methodConfig"
													ref="methodConfig"
													v-if="methodConfig.series.length"
												></highcharts>
												<div
													class="text-center pt-3"
													v-else
													style="height: 410px"
												>
													{{ failedText }}
												</div>
											</div>
											<div class="col-12 small" id="my-container">
												<i
													class="fa fa-circle mr-3"
													:style="{ color: outliersColor }"
												></i>
												{{ $t("outliers_regions") }}
												<template v-if="exceptionTable.length">
													<span
														class="float-right cursor-pointer text-danger"
														@click="popoverShow = true"
														><u>{{ $t("exceptions") }}</u></span
													>

													<b-modal
														v-model="popoverShow"
														hide-footer
														centered
														size="md"
														:title="$t('scatterException')"
														no-close-on-backdrop
													>
														<div class="text-right mb-3">
															<download-csv
																class="btn cursor-pointer"
																:data="exceptionTable"
																v-b-tooltip.hover
																:title="$t('downloadIcon')"
																>{{ $t("csv") }}
																<i class="fa fa-download ml-2"></i
															></download-csv>
														</div>
														<b-table
															head-variant="light"
															sticky-header
															class="mb-0"
															:bordered="true"
															hover
															:items="exceptionTable"
														/>
													</b-modal>
												</template>
											</div>
										</template>
										<template v-else>
											<div class="col p-2">
												<b-table
													head-variant="light"
													sticky-header
													class="mb-0"
													v-if="methodConfig.series.length"
													:bordered="true"
													hover
													:items="methodConfigTable.items"
													:fields="methodConfigTable.fields"
													ref="methodConfig"
												>
												</b-table>
												<div class="my-4 text-center" v-else>
													{{ $t("no_data_to_display") }}
												</div>
											</div>
										</template>
									</div>
									<div class="card-footer text-right">
										<p class="m-0">
											{{ $t("source") }}:
											<span>{{ chartSource }}</span>
										</p>
									</div>
								</div>
							</div>
						</fullscreen>
					</div>
					<div class="col-12 text-center m-t-20px" v-if="failedText">
						<b-alert variant="info" show class="m-0">
							<h5 class="m-0">{{ failedText }}</h5>
						</b-alert>
					</div>
					<div
						class="col-6"
						v-if="outliersMethod.series.length > 0 && outliersMethodVisible"
						:class="[methodConfig.series.length === 0 ? 'col-12' : '']"
					>
						<fullscreen
							v-model="outliersMethodFull"
							ref="fullscreen"
							class="fullContainer"
						>
							<div
								class="card bg-transparent border-none fullContent"
								:class="{ 'm-t-20px': !outliersMethodFull }"
							>
								<loader class="cardLoader" v-if="showLoader2" />
								<div
									class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
								>
									<div class="row no-gutters">
										<div
											class="col-lg-9 col-md-9 p-t-4px"
											:class="{ 'col-lg-12 col-md-12': outliersMethodFull }"
										>
											<div class="cardTitleSection text-wrap fs-19-1920">
												<i
													class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
													aria-hidden="true"
													v-b-popover.hover.rightbottom="{
														variant: 'info',
														content: outliersMethodChartInfo,
														title: outlierChartName,
														html: true,
													}"
												></i>
												<p class="title_p fs-19-1920 m-0">
													{{ outlierChartName }}
												</p>
											</div>
										</div>
										<div
											class="col-lg-3 col-md-3 position-relative"
											v-if="!outliersMethodFull"
										>
											<ChartOptions
												sorting="null"
												@showTable="showTable"
												:title="outlierChartName"
												@exportChart="exportChart"
												:cID="outliersMethodCID"
												chartKey="outliersMethod"
												:trendTable="outliersMethodTable"
												@toggleFullscreen="toggleFullscreen"
												:outliersMethodFull="outliersMethodFull"
											/>
										</div>
									</div>
								</div>
								<div
									class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
								>
									<div class="row mx-0">
										<template v-if="outliersMethodType !== 'table'">
											<div class="col-12">
												<highcharts
													class="chartHeight m-t-10px"
													:options="outliersMethod"
													ref="outliersMethod"
												></highcharts>
											</div>
											<div class="col-12 small">
												<i
													class="fa fa-circle mr-3"
													:style="{ color: outliersColor }"
												></i>
												{{ $t("outliers_regions") }}
											</div>
										</template>
										<template v-else>
											<div class="col p-2">
												<b-table
													head-variant="light"
													sticky-header
													class="mb-0"
													v-if="outliersMethod.series.length"
													:bordered="true"
													hover
													:items="outliersMethodTable.items"
													:fields="outliersMethodTable.fields"
													ref="outliersMethod"
												>
												</b-table>
												<div class="my-4 text-center" v-else>
													{{ $t("no_data_to_display") }}
												</div>
											</div>
										</template>
									</div>
									<div class="card-footer text-right">
										<p class="m-0">
											{{ $t("source") }}:
											<span>{{ chartSource }}</span>
										</p>
									</div>
								</div>
							</div>
						</fullscreen>
					</div>
					<div
						class="col-lg-12 mt-2 mb-5"
						v-if="averageMethod.series.length > 0 && averageMethodVisible"
					>
						<fullscreen
							v-model="averageMethodFull"
							ref="fullscreen"
							class="fullContainer"
						>
							<div class="card bg-transparent border-none fullContent">
								<loader class="cardLoader" v-if="showLoader3" />
								<div
									class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
								>
									<div class="row no-gutters">
										<div
											class="col-lg-9 col-md-9 p-t-4px"
											:class="{ 'col-lg-12 col-md-12': averageMethodFull }"
										>
											<div class="cardTitleSection text-wrap fs-19-1920">
												<i
													class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
													aria-hidden="true"
													v-b-popover.hover.rightbottom="{
														variant: 'info',
														content: averageMethodChartInfo,
														title: averageChartName,
														html: true,
													}"
												></i>
												<p class="title_p fs-19-1920 m-0">
													{{ averageChartName }}
												</p>
											</div>
										</div>
										<div
											class="col-lg-3 col-md-3 position-relative"
											v-if="!averageMethodFull"
										>
											<ChartOptions
												sorting="type4"
												defaultSort="1-0"
												@dataSort="dataSort"
												@showTable="showTable"
												:title="averageChartName"
												@exportChart="exportChart"
												:cID="averageMethodCID"
												chartKey="averageMethod"
												:trendTable="averageMethodTable"
												@toggleFullscreen="toggleFullscreen"
											/>
										</div>
									</div>
								</div>
								<div
									class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
								>
									<div class="row mx-0">
										<template v-if="averageMethodType !== 'table'">
											<div class="col">
												<highcharts
													class="chartHeight m-t-10px"
													:options="averageMethod"
													ref="averageMethod"
												></highcharts>
											</div>
										</template>
										<template v-else>
											<div class="col p-2">
												<b-table
													head-variant="light"
													sticky-header
													class="mb-0"
													v-if="averageMethod.series.length"
													:bordered="true"
													hover
													:items="averageMethodTable.items"
													:fields="averageMethodTable.fields"
													ref="averageMethod"
												>
												</b-table>
												<div class="my-4 text-center" v-else>
													{{ $t("no_data_to_display") }}
												</div>
											</div>
										</template>
									</div>
									<div class="card-footer text-right">
										<p class="m-0">
											{{ $t("source") }}:
											<span>{{ chartSource }}</span>
										</p>
									</div>
								</div>
							</div>
						</fullscreen>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import externalChartConfig from "./externalChartConfig.js";
import regression from "regression";
import { getDateRange, chartExport } from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
import FullScreenMixin from "@/helpers/FullScreenMixin";
export default {
	props: [
		"method",
		"period",
		"periodScorecard",
		"defaultLevelID",
		"defaultLocationID",
		"scorecardDefaultLocationID",
		"subLevelID",
		"externalValidation",
		"scoreKey",
		"orgLevel",
		"locations",
		"exportPosition",
		"debugging",
		"debuggingLevel",
		"signOffActive",
		"periodType",
		"reportChartData",
		"applicationFinalYear",
		"childArr",
	],
	mixins: [getCIDMixin, FullScreenMixin],
	components: {
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
		ChartFilters: () =>
			import(
				/* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
			),
	},
	data() {
		return {
			activityLogArr: [],
			methodConfig: JSON.parse(JSON.stringify(externalChartConfig.method)),
			averageMethod: JSON.parse(JSON.stringify(externalChartConfig.average)),
			outliersMethod: JSON.parse(JSON.stringify(externalChartConfig.outlier)),
			showLoader: false,
			showLoader1: false,
			showLoader2: false,
			showLoader3: false,
			failedText: "",
			chartName: "",
			outlierChartName: "",
			averageChartName: "",
			averageMethodTable: {
				items: [],
				fields: [],
			},
			averageMethodType: "chart",
			methodConfigTable: {
				items: [],
				fields: [],
			},
			methodConfigType: "chart",
			outliersMethodTable: {
				items: [],
				fields: [],
			},
			originalData: [],
			outliersMethodType: "chart",
			sortingOptions: ["0-1", "1-0", "A-Z", "Z-A"],
			methodConfigComment: false,
			averageMethodComment: false,
			outliersMethodComment: false,
			methodConfigCID: "",
			averageMethodCID: "",
			outliersMethodCID: "",
			averageMethodVisible: false,
			outliersMethodVisible: false,
			methodConfigChartInfo: "",
			averageMethodChartInfo: "",
			outliersMethodChartInfo: "",
			chartSource: "",
			periodValue: this.period,
			excludeMethodOutliers: false,
			outliersColor: "#FF0000",
			categoryInfo: "",
			exceptionTable: [],
			popoverShow: false,
			periodLength: 1,
			averagePeriods: [
				{ text: "3 Month Average", value: "3" },
				{ text: "6 Month Average", value: "6" },
				{ text: "9 Month Average", value: "9" },
				{ text: "12 Month Average", value: "12" },
			],
			outliersMethodFull: false,
			methodConfigFull: false,
			averageMethodFull: false,
		};
	},
	watch: {
		scorecardDefaultLocationID(newValue) {
			if (newValue) {
				this.calculateMethodDataBackground(this.method);
			}
		},
		signOffActive() {
			this.showLoader1 = true;
			this.showLoader2 = true;
			this.showLoader3 = true;

			let ser = this.methodConfig.series,
				ser1 = this.averageMethod.series,
				ser2 = this.outliersMethod.series;

			this.methodConfig.series = [];
			this.averageMethod.series = [];
			this.outliersMethod.series = [];
			setTimeout(() => {
				this.methodConfig.series = ser;
				this.averageMethod.series = ser1;
				this.outliersMethod.series = ser2;
				this.showLoader1 = false;
				this.showLoader2 = false;
				this.showLoader3 = false;
			}, 500);
		},
		excludeMethodOutliers(newValue) {
			if (newValue) {
				let seriesData = this.originalData.map((oData) => {
					if (
						oData.name === "Ideal Trendline" ||
						oData.name === "Linear Trendline"
					) {
						return oData;
					} else {
						return {
							...oData,
							data: oData.data.filter((d) => !d.outlier),
						};
					}
				});
				this.methodConfig.series = seriesData;
			} else {
				this.methodConfig.series = this.originalData;
			}
		},
		locations(newValue) {
			if (newValue) {
				this.methodConfig.series = [];
				this.averageMethod.series = [];
				this.outliersMethod.series = [];
				// this.$store.state.loading = true;
				this.showLoader = true;
				this.calculateMethodData(this.method);
			}
		},
		period(newValue) {
			if (newValue) {
				this.averagePeriods = [];
				if (this.externalValidation[this.method].selectedSource.length > 1) {
					this.periodLength = 1;
				} else {
					this.periodLength = 4;
					let pType = this.$i18n.t("month");
					if (this.periodType === "monthly") {
						pType = this.$i18n.t("month");
					} else if (this.periodType === "quarterly") {
						pType = this.$i18n.t("quarter");
					} else if (this.periodType === "financialYear") {
						pType = this.$i18n.t("financialYear");
					} else {
						pType = this.$i18n.t("year");
					}
					for (let i = 1; i <= 4; i++) {
						let p = i * 3;
						this.averagePeriods.push({
							text: this.$i18n.t("legend6", {
								count: p,
								periodType: pType,
							}),
							value: p,
						});
					}
				}
				this.periodValue = newValue;
				this.methodConfig.series = [];
				this.averageMethod.series = [];
				this.outliersMethod.series = [];
				// this.$store.state.loading = true;
				this.showLoader = true;
				this.calculateMethodData(this.method);
			}
		},
	},
	methods: {
		updatePeriodLength(newValue) {
			this.periodLength = newValue * 1 + 1;
			// this.$store.state.loading = true;
			this.showLoader = true;
			this.methodConfig.series = [];
			this.calculateMethodData(this.method);
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
		exportChart(type, chartRef, xyChart = null) {
			let chart = this.$refs[chartRef].chart;
			let max = chart.options.xAxis[0].max;
			let maxY = chart.options.yAxis[0].max;
			chart.options.xAxis[0].max = null;
			// chart.options.xAxis[0].min = 0
			if (xyChart) {
				chart.options.yAxis[0].max = null;
				// chart.options.yAxis[0].min = 0
			}
			chartExport(type, chart);
			setTimeout(() => {
				chart.options.xAxis[0].max = max;
				if (xyChart) {
					chart.options.yAxis[0].max = maxY;
				}
			}, 100);
		},
		calculateMethodData(method) {
			let chartOptions = this.externalValidation[method].chartOptions;
			if (chartOptions.chartInfo) {
				this.methodConfigChartInfo = chartOptions.chartInfo;
			}
			if (chartOptions.categoryInfo) {
				this.categoryInfo = chartOptions.categoryInfo;
			}
			this.chartName = chartOptions.chartName
				? chartOptions.chartName
				: this.$i18n.t("chartHeading");
			this.chartSource = chartOptions.chartDataSource.text
				? chartOptions.chartDataSource.text
				: "DHIS2";
			this.methodConfig.title.text = chartOptions.title.visible
				? chartOptions.title.text
				: "";
			this.methodConfig.title.title =
				this.$i18n.t("internalConsistencyCorrelation_tab") +
				" - " +
				this.method +
				" - " +
				chartOptions.chartName;
			this.methodConfig.subtitle.text = chartOptions.subTitle.visible
				? chartOptions.subTitle.text
				: "";
			this.outliersColor = chartOptions.outliersColor
				? chartOptions.outliersColor
				: "#FF0000";
			let minOutlier = chartOptions.minOutlier;
			let wastageFactor = chartOptions.wastageFactor;
			let r2Max = this.externalValidation.Background_Data.r2Max * 1;
			let qualityThreshold = chartOptions.qualityThreshold
				? (chartOptions.qualityThreshold * 1) / 100
				: 33 / 100;
			let derivedCharts = this.externalValidation[method].derivedCharts
				? this.externalValidation[method].derivedCharts
				: [];

			this.methodConfig.xAxis.title.text = chartOptions.xAxis.visible
				? chartOptions.xAxis.text
				: "";
			this.methodConfig.yAxis.title.text = chartOptions.yAxis.visible
				? chartOptions.yAxis.text
				: "";

			if (
				derivedCharts &&
				derivedCharts.length &&
				this.externalValidation[method].selectedSource.length > 1
			) {
				derivedCharts.forEach((d, index) => {
					if (d.chartOptions.cid) {
						if (index === 0) {
							this.outliersMethodCID = d.chartOptions.cid;
							this.outliersMethodChartInfo = d.chartOptions.chartInfo;
						}
						if (index === 1) {
							this.averageMethodCID = d.chartOptions.cid;
							this.averageMethodChartInfo = d.chartOptions.chartInfo;
						}
					} else {
						if (index === 0) {
							this.outliersMethodChartInfo = d.chartOptions.chartInfo;
							this.outliersMethodCID = "";
						}
						if (index === 1) {
							this.averageMethodChartInfo = d.chartOptions.chartInfo;
							this.averageMethodCID = "";
						}
					}
				});
			}

			let items = [],
				items1 = [],
				items2 = [];
			let fields = [this.$i18n.t("location")],
				fields1 = [this.$i18n.t("location")],
				fields2 = [this.$i18n.t("location")];

			this.exceptionTable = [];

			let sData = {};
			if (this.externalValidation[method]) {
				if (this.externalValidation[method].cid) {
					this.methodConfigComment = true;
					this.methodConfigCID = this.externalValidation[method].cid;
				}
				this.externalValidation[method].selectedSource.forEach((s) => {
					let sSelectedDE = "",
						aSelectedDE = [];
					if (this.externalValidation[method][s]) {
						this.externalValidation[method][s].chartData.forEach((m) => {
							m.indicator.subIndicator.forEach((d) => {
								d.de.forEach((sd) => {
									aSelectedDE.push(sd);
								});
							});
						});
						sSelectedDE = aSelectedDE.join(";");
						let level = [this.defaultLevelID, this.subLevelID],
							period = getDateRange({
								sendPeriod: this.periodValue,
								periodType: this.periodType,
								periodLength: this.periodLength,
								applicationFinalYear: this.applicationFinalYear,
							}),
							currentPeriod = null;
						if (this.periodType === "yearly") {
							let periodValue = this.$moment(this.periodValue, "YYYY").format(
								"YYYY"
							);
							currentPeriod = periodValue;
						} else if (this.periodType === "financialYear") {
							let currentYear = this.periodValue;
							currentPeriod = `${currentYear}April`;
						} else if (this.periodType === "quarterly") {
							currentPeriod = this.periodValue;
						} else {
							let periodValue = this.$moment(this.periodValue, "YYYYMM").format(
								"YYYYMM"
							);
							currentPeriod = periodValue;
						}
						period = period.reverse().join(";");
						if (aSelectedDE.length) {
							if (this.debugging) {
								console.log(
									this.method +
										" - " +
										s +
										" - chartComponent - Calling API getIndicatorData() with params selected DE = '" +
										sSelectedDE +
										"', Level = '" +
										level +
										"', Country ID = '" +
										this.defaultLocationID +
										"', Period = '" +
										period +
										"' @",
									this.$moment().format("MMMM Do YYYY, h:mm:ss a")
								);
								if (this.activityLogArr) {
									var obj_log = {
										name: this.method,
										time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
										content:
											s +
											" - chartComponent - Calling API getIndicatorData() with params selected DE = '" +
											sSelectedDE +
											"', Level = '" +
											level +
											"', Country ID = '" +
											this.defaultLocationID +
											"', Period = '" +
											period,
									};
									this.activityLogArr.push(obj_log);
								}
							}
							service
								.getIndicatorData(
									sSelectedDE,
									level,
									this.defaultLocationID,
									period
								)
								.then((response) => {
									if (this.debugging) {
										console.log(
											this.method +
												" - " +
												s +
												" - chartComponent - getIndicatorData() API response received @",
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											var obj_log = {
												name: this.method,
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content:
													s +
													" - chartComponent - getIndicatorData() API response received",
											};
											this.activityLogArr.push(obj_log);
										}
									}
									if (response.data.rows.length) {
										let ou = response.data.metaData.dimensions.ou;

										let valueIndex = 0,
											ouIndex = 0,
											peIndex = 0;
										response.data.headers.forEach((h, i) => {
											if (h.name === "value") {
												valueIndex = i;
											}

											if (h.name === "ou") {
												ouIndex = i;
											}

											if (h.name === "pe") {
												peIndex = i;
											}
										});

										let rData = {};
										response.data.rows.forEach((r) => {
											if (rData[r[ouIndex]]) {
												if (rData[r[ouIndex]][r[peIndex]]) {
													rData[r[ouIndex]][r[peIndex]] =
														Number(rData[r[ouIndex]][r[peIndex]]) +
														Number(r[valueIndex]);
												} else {
													rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
												}
											} else {
												rData[r[ouIndex]] = {
													[r[peIndex]]: Number(r[valueIndex]),
												};
											}
										});
										sData[s] = rData;
										if (
											Object.keys(sData).length ===
											this.externalValidation[method].selectedSource.length
										) {
											if (
												this.externalValidation[method].selectedSource.length >
												1
											) {
												let method1 =
													this.externalValidation[method].selectedSource[0];
												let method2 =
													this.externalValidation[method].selectedSource[1];

												let m1 = method1;
												let m2 = method2;

												if (method1.split("_").length > 1) {
													m1 =
														this.$i18n.locale === "fr"
															? this.$i18n.t(`${method1}`)
															: `${method1.split("_")[0]} (${
																	method1.split("_")[1]
															  })`;
												} else {
													let innerMethod = method1.toLowerCase();
													m1 =
														this.$i18n.locale === "fr"
															? this.$i18n.t(`${innerMethod}`)
															: method1;
												}

												if (method2.split("_").length > 1) {
													m2 =
														this.$i18n.locale === "fr"
															? this.$i18n.t(`${method2}`)
															: `${method2.split("_")[0]} (${
																	method2.split("_")[1]
															  })`;
												} else {
													let innerMethod = method2.toLowerCase();
													m2 =
														this.$i18n.locale === "fr"
															? this.$i18n.t(`${innerMethod}`)
															: method2;
												}

												let xException = Object.keys(sData[method1]).filter(
													(val) => !Object.keys(sData[method2]).includes(val)
												);
												let yException = Object.keys(sData[method2]).filter(
													(val) => !Object.keys(sData[method1]).includes(val)
												);

												let sameRegions = Object.keys(sData[method1]).filter(
													(val) => Object.keys(sData[method2]).includes(val)
												);
												let noDataRegions = ou.filter(
													(val) => !sameRegions.includes(val)
												);

												noDataRegions.forEach((val) => {
													let name =
														response.data.metaData.items[val].name || null;
													if (xException.includes(val)) {
														Object.keys(sData[method1]).forEach((x) => {
															if (x === val) {
																this.exceptionTable.push({
																	[this.$i18n.t("location")]: name,
																	[m2]: "",
																	[m1]: sData[method1][x][period] * 1,
																});
															}
														});
													} else if (yException.includes(val)) {
														Object.keys(sData[method2]).forEach((x) => {
															if (x === val) {
																this.exceptionTable.push({
																	[this.$i18n.t("location")]: name,
																	[m2]: sData[method2][x][period] * 1,
																	[m1]: "",
																});
															}
														});
													} else {
														this.exceptionTable.push({
															[this.$i18n.t("location")]: name,
															[m2]: "",
															[m1]: "",
														});
													}
												});
												let data = [],
													ratioData = [],
													diffData = [],
													avgData = [],
													accessData = [],
													accessDataFixYAxis = [],
													cat = [],
													regressionData = [];

												Object.keys(sData[method1]).forEach((x) => {
													let name = "";
													if (response.data.metaData.items[x]) {
														name = response.data.metaData.items[x].name;
													}
													let locID = this.defaultLocationID;
													if (this.childArr.length === 0) {
														locID = "";
													}
													if (x !== locID) {
														Object.keys(sData[method2]).forEach((y) => {
															if (x === y) {
																regressionData.push([
																	sData[method1][x][period] * 1,
																	sData[method2][y][period] * 1,
																]);
																let ratio =
																	sData[method1][y][period] * 1 !== 0
																		? ((sData[method2][x][period] * 1) /
																				(sData[method1][y][period] * 1)) *
																		  1
																		: 0;
																let diff =
																	(sData[method1][x][period] * 1 -
																		sData[method2][y][period] * 1) *
																	1;
																let avg =
																	((sData[method1][x][period] * 1 +
																		sData[method2][y][period] * 1) /
																		2) *
																	1;

																let t2 = this.$i18n.t("legend5", {
																	m2: m2,
																	m1: m1,
																});
																items1.push({
																	[this.$i18n.t("location")]: name,
																	[m2]: sData[method2][y][period] * 1,
																	[m1]: sData[method1][x][period] * 1,
																	[t2]: ratio.toFixed(2) * 1,
																});

																let accData = (avg * (wastageFactor * 1)) / 100;
																let outlier =
																	Math.abs(diff) > accData &&
																	avg > minOutlier * 1;
																cat.push(name);
																if (
																	derivedCharts.length &&
																	derivedCharts[1].chartOptions
																) {
																	ratioData.push({
																		name,
																		y: ratio.toFixed(2) * 1,
																		color: derivedCharts[1].chartOptions.color,
																	});
																} else {
																	ratioData.push({
																		name,
																		y: ratio.toFixed(2) * 1,
																		color: chartOptions.color,
																	});
																}

																if (outlier) {
																	items.push({
																		[this.$i18n.t("location")]: name,
																		[m2]: sData[method2][y][period] * 1,
																		[m1]: sData[method1][x][period] * 1,
																		_rowVariant: "danger",
																	});
																	data.push({
																		name,
																		x: sData[method1][x][period] * 1,
																		y: sData[method2][y][period] * 1,
																		color: this.outliersColor,
																		outlier: true,
																	});
																	diffData.push({
																		name,
																		y: diff.toFixed(2) * 1,
																		color: this.outliersColor,
																	});
																	items2.push({
																		[this.$i18n.t("location")]: name,
																		[m2]: sData[method2][y][period] * 1,
																		[m1]: sData[method1][x][period] * 1,
																		[this.$i18n.t("legend4", {
																			wastageFactor: wastageFactor,
																		})]: accData.toFixed(2) * 1,
																		["-" +
																		this.$i18n.t("legend4", {
																			wastageFactor: wastageFactor,
																		})]: -accData.toFixed(2) * 1,
																		[this.$i18n.t("legend3", {
																			m2: m2,
																			m1: m1,
																		})]: diff.toFixed(2) * 1,
																		_rowVariant: "danger",
																	});
																} else {
																	items.push({
																		[this.$i18n.t("location")]: name,
																		[m2]: sData[method2][y][period] * 1,
																		[m1]: sData[method1][x][period] * 1,
																	});
																	data.push({
																		name,
																		x: sData[method1][x][period] * 1,
																		y: sData[method2][y][period] * 1,
																		outlier: false,
																	});

																	if (
																		derivedCharts.length &&
																		derivedCharts[0].chartOptions
																	) {
																		diffData.push({
																			name,
																			y: diff.toFixed(2) * 1,
																			color:
																				derivedCharts[0].chartOptions.color,
																		});
																	} else {
																		diffData.push({
																			name,
																			y: diff.toFixed(2) * 1,
																			color: chartOptions.color,
																		});
																	}
																	items2.push({
																		[this.$i18n.t("location")]: name,
																		[m2]: sData[method2][y][period] * 1,
																		[m1]: sData[method1][x][period] * 1,
																		[this.$i18n.t("legend4", {
																			wastageFactor: wastageFactor,
																		})]: accData.toFixed(2) * 1,
																		["-" +
																		this.$i18n.t("legend4", {
																			wastageFactor: wastageFactor,
																		})]: -accData.toFixed(2) * 1,
																		[this.$i18n.t("legend3", {
																			m2: m2,
																			m1: m1,
																		})]: diff.toFixed(2) * 1,
																	});
																}
																avgData.push({
																	name,
																	y: avg.toFixed(2) * 1,
																});
																accessData.push([
																	-accData.toFixed(2) * 1,
																	0,
																	accData.toFixed(2) * 1,
																]);
																accessDataFixYAxis.push(accData.toFixed(2) * 1);
															}
														});
													}
												});

												//This is to sort the data by default using location name's on first load
												diffData
													.map(function (v, i) {
														return {
															value1: v,
															value2: accessData[i],
															value3: cat[i],
														};
													})
													.sort(function (a, b) {
														return a.value1.y < b.value1.y
															? -1
															: a.value1.y == b.value1.y
															? 0
															: 1;
													})
													.forEach(function (v, i) {
														diffData[i] = v.value1;
														accessData[i] = v.value2;
														cat[i] = v.value3;
													});

												ratioData.sort((a, b) => {
													return a.y < b.y ? 1 : a.y == b.y ? 0 : -1;
												});

												fields1.push(`${m2}`);
												fields1.push(`${m1}`);
												fields1.push(
													this.$i18n.t("legend5", {
														m2: m2,
														m1: m1,
													})
												);
												if (ratioData.length) {
													if (
														derivedCharts.length &&
														derivedCharts[1].chartOptions
													) {
														let cSetting = derivedCharts[1].chartOptions;
														this.averageMethod.xAxis.title.text = cSetting.xAxis
															.visible
															? cSetting.xAxis.text
															: "";
														this.averageMethod.yAxis.title.text = cSetting.yAxis
															.visible
															? cSetting.yAxis.text
															: "";

														this.averageMethod.title.text = cSetting.title
															.visible
															? cSetting.title.text
															: "";
														this.averageMethod.title.title =
															this.$i18n.t(
																"internalConsistencyCorrelation_tab"
															) +
															" - " +
															this.method +
															" - " +
															cSetting.chartName;
														this.averageMethod.subtitle.text = cSetting.subTitle
															.visible
															? cSetting.subTitle.text
															: "";

														this.averageChartName = cSetting.chartName
															? cSetting.chartName
															: this.$i18n.t("chartHeading");
														this.averageMethodVisible = !cSetting.disableChart;

														this.averageMethodComment = cSetting.cid
															? true
															: false;
													} else {
														this.averageChartName = `Implications - Average # of ${m2} per ${m1}`;
														this.averageMethodVisible = true;
													}
													if (this.averageMethodVisible) {
														this.averageMethod.series = [
															{
																name: this.$i18n.t("legend5", {
																	m2: m2,
																	m1: m1,
																}),
																data: ratioData,
																color: derivedCharts[1].chartOptions.color,
															},
														];
														// this.averageMethod.xAxis.categories = cat
														this.averageMethod.xAxis.max = !this.reportChartData
															? ratioData.length > 10
																? 10
																: ratioData.length - 1
															: ratioData.length - 1;
														this.averageMethodTable = {
															items: items1,
															fields: fields1,
														};
														let min = 0,
															max = 0,
															dArr = [];
														dArr = ratioData.map((dInner) => dInner.y);
														let innerMin = Math.min(...dArr);
														let innerMax = Math.max(...dArr);
														if (innerMin < min) {
															min = innerMin;
														}
														if (innerMax > max) {
															max = innerMax;
														}
														this.averageMethod.yAxis.min = min > 0 ? 0 : min;
														this.averageMethod.yAxis.max = max;
													}
												}

												fields2.push(`${m2}`);
												fields2.push(`${m1}`);
												fields2.push(
													"-" +
														this.$i18n.t("legend4", {
															wastageFactor: wastageFactor,
														})
												);
												fields2.push(
													this.$i18n.t("legend4", {
														wastageFactor: wastageFactor,
													})
												);
												fields2.push(
													this.$i18n.t("legend3", {
														m2: m2,
														m1: m1,
													})
												);
												if (accessData.length && diffData.length) {
													if (
														derivedCharts.length &&
														derivedCharts[0].chartOptions
													) {
														let cSetting = derivedCharts[0].chartOptions;
														this.outliersMethod.xAxis[0].title.text = cSetting
															.xAxis.visible
															? cSetting.xAxis.text
															: "";
														this.outliersMethod.yAxis.title.text = cSetting
															.yAxis.visible
															? cSetting.yAxis.text
															: "";
														// this.outliersMethod.yAxis.max = 3000
														// this.outliersMethod.yAxis.min = -3000

														this.outliersMethod.title.text = cSetting.title
															.visible
															? cSetting.title.text
															: "";
														this.outliersMethod.title.title =
															this.$i18n.t(
																"internalConsistencyCorrelation_tab"
															) +
															" - " +
															this.method +
															" - " +
															cSetting.chartName;
														this.outliersMethod.subtitle.text = cSetting
															.subTitle.visible
															? cSetting.subTitle.text
															: "";

														this.outlierChartName = cSetting.chartName
															? cSetting.chartName
															: this.$i18n.t("chartHeading");

														this.outliersMethodVisible = !cSetting.disableChart;

														this.outliersMethodComment = cSetting.cid
															? true
															: false;
													} else {
														this.outlierChartName = `Assessing Outliers in Difference between ${m1} and ${m2}`;
														this.outliersMethodVisible = true;
													}
													if (this.outliersMethodVisible) {
														this.outliersMethod.xAxis[0].categories = cat;
														this.outliersMethod.series.push({
															name: this.$i18n.t("legend3", { m2: m2, m1: m1 }),
															type: "line",
															color: derivedCharts[0].chartOptions.color,
															data: diffData,
															lineWidth: 0,
															states: {
																hover: {
																	lineWidthPlus: 0,
																},
															},
														});
														this.outliersMethod.series.push({
															name: `${wastageFactor}% & -${this.$i18n.t(
																"legend4",
																{ wastageFactor: wastageFactor }
															)}`,
															data: accessData,
															tooltip: {
																pointFormatter: function () {
																	var point = this;
																	return (
																		'<span style="color:' +
																		point.color +
																		'">\u25CF</span> ' +
																		point.series.name +
																		":<br/>High (" +
																		wastageFactor +
																		"% of average) : <b>" +
																		point.high +
																		"</b><br/>Low (-" +
																		wastageFactor +
																		"% of average): <b>" +
																		point.low +
																		"</b><br/>"
																	);
																},
																shared: true,

        														useHTML: true,
															},
														});
														this.outliersMethod.yAxis.plotLines = [
															{
																value: "0",
																color: "#000",
																width: 2,
																zIndex: 5,
																dashStyle: "solid",
															},
														];
														this.outliersMethod.xAxis[0].max = !this
															.reportChartData
															? diffData.length > 10
																? 10
																: diffData.length - 1
															: diffData.length - 1;

														this.outliersMethodTable = {
															items: items2,
															fields: fields2,
														};
													}

													let min = 0,
														max = 0,
														dArr = [];
													dArr = diffData.map((dInner) => dInner.y);
													let innerMin = Math.min(...dArr);
													let innerMax = Math.max(...dArr);
													if (innerMin < min) {
														min = innerMin;
													}
													if (innerMax > max) {
														max = innerMax;
													}

													innerMin = Math.min(...accessDataFixYAxis);
													innerMax = Math.max(...accessDataFixYAxis);
													if (innerMin < min) {
														min = innerMin;
													}
													if (innerMax > max) {
														max = innerMax;
													}
													this.outliersMethod.yAxis.min = min > 0 ? 0 : min;
													this.outliersMethod.yAxis.max = max;
												}

												let chartXLegend = chartOptions.xAxis.visible
													? chartOptions.xAxis.text
														? chartOptions.xAxis.text
														: m1
													: m1;
												let chartYLegend = chartOptions.yAxis.visible
													? chartOptions.yAxis.text
														? chartOptions.yAxis.text
														: m2
													: m2;
												fields.push(`${m2}`);
												fields.push(`${m1}`);
												if (data.length) {
													this.methodConfig.series.push({
														name: `${chartXLegend} vs ${chartYLegend}`,
														color: chartOptions.color,
														data: data,
													});
													this.methodConfigTable = {
														items: items,
														fields: fields,
													};

													const result = regression.linear(regressionData);
													let maxValue = Math.max(...regressionData.flat());
													let diagonalLine = {
														type: "line",
														name: this.$i18n.t("legend1"),
														color: "#000000",
														dashStyle: "Dot",
														data: [
															[0, 0],
															[maxValue, maxValue],
														],
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
														// showInLegend: false
													};
													this.methodConfig.xAxis.max = maxValue;
													this.methodConfig.yAxis.max = maxValue;
													// this.methodConfig.chart.height = 400
													// this.methodConfig.chart.width = 400
													this.methodConfig.series.push(diagonalLine);

													let regressionLine = {
														type: "line",
														name: this.$i18n.t("legend2"),
														color: chartOptions.trendlineColor,
														data: result.points,
														dashStyle: "LongDash",
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
													};
													this.methodConfig.series.push(regressionLine);
													let r2 = result.r2 ? result.r2 : 0;
													this.methodConfig.chart.events = {
														load: function () {
															var chart = this;
															chart.renderer
																.html(
																	`R<sup>2</sup> : ${r2}`,
																	chart.plotWidth - 30,
																	chart.plotHeight - 40
																)
																.css({
																	fontSize: "13px",
																	color: chartOptions.trendlineColor,
																	fontWeight: 600,
																	backgroundColor: "#f1f1f1",
																	padding: "10px",
																	border: "1px solid #c4c4c4",
																	borderRadius: "4px",
																})
																.add();
														},
													};
													let exportArr = [];
													if (this.exportPosition === "5") {
														if (this.methodConfig.series.length) {
															exportArr.push({
																cardKey: "key14",
																...this.methodConfig,
															});
														}
														// if(this.outliersMethodVisible) {
														//   exportArr.push({'cardKey': 'key15', ...this.outliersMethod})
														// }
														if (
															this.averageMethodVisible &&
															this.averageMethod.series.length
														) {
															exportArr.push({
																cardKey: "key16",
																...this.averageMethod,
															});
														}
													} else if (this.exportPosition === "6") {
														if (this.methodConfig.series.length) {
															exportArr.push({
																cardKey: "key17",
																...this.methodConfig,
															});
														}
														// if(this.outliersMethodVisible) {
														//   exportArr.push({'cardKey': 'key18', ...this.outliersMethod})
														// }
														if (
															this.averageMethodVisible &&
															this.averageMethod.series.length
														) {
															exportArr.push({
																cardKey: "key19",
																...this.averageMethod,
															});
														}
													} else {
														if (this.methodConfig.series.length) {
															exportArr.push({
																cardKey: "key20",
																...this.methodConfig,
															});
														}
														// if(this.outliersMethodVisible) {
														//   exportArr.push({'cardKey': 'key21', ...this.outliersMethod})
														// }
														if (
															this.averageMethodVisible &&
															this.averageMethod.series.length
														) {
															exportArr.push({
																cardKey: "key22",
																...this.averageMethod,
															});
														}
													}
													if (r2 > r2Max) {
														this.$emit(
															"sendScore",
															this.scoreKey,
															true,
															exportArr
														);
													} else {
														this.$emit(
															"sendScore",
															this.scoreKey,
															false,
															exportArr
														);
													}
													this.originalData = this.methodConfig.series;
													if (
														(this.reportChartData &&
															this.reportChartData.cid.split("/")[1] ===
																this.methodConfigCID) ||
														(this.reportChartData &&
															this.reportChartData.linkedCharts.find((c) =>
																c.includes(this.methodConfigCID)
															))
													) {
														let cid = this.getCID(
															this.reportChartData,
															this.methodConfigCID
														);
														this.$emit("setReportChart", {
															chartObj: this.methodConfig,
															chartName: this.chartName,
															cid: [cid],
														});
														// return;
													}
													if (
														(this.reportChartData &&
															this.reportChartData.cid.split("/")[1] ===
																this.outliersMethodCID) ||
														(this.reportChartData &&
															this.reportChartData.linkedCharts.find((c) =>
																c.includes(this.outliersMethodCID)
															))
													) {
														let cid = this.getCID(
															this.reportChartData,
															this.outliersMethodCID
														);
														this.$emit("setReportChart", {
															chartObj: this.outliersMethod,
															chartName: this.outlierChartName,
															cid: [cid],
														});
														// return;
													}
													if (
														(this.reportChartData &&
															this.reportChartData.cid.split("/")[1] ===
																this.averageMethodCID) ||
														(this.reportChartData &&
															this.reportChartData.linkedCharts.find((c) =>
																c.includes(this.averageMethodCID)
															))
													) {
														let cid = this.getCID(
															this.reportChartData,
															this.averageMethodCID
														);
														this.$emit("setReportChart", {
															chartObj: this.averageMethod,
															chartName: this.averageChartName,
															cid: [cid],
														});
														// return;
													}
													this.failedText = "";
													// this.$store.state.loading = false;
													this.showLoader = false;
												} else {
													// this.$store.state.loading = false;
													this.showLoader = false;
													this.$emit("sendScore", this.scoreKey, false, []);
													if (this.reportChartData) {
														this.$emit("setReportChart", {
															chartObj: null,
															chartName: null,
															cid: [
																this.reportChartData.cid,
																...this.reportChartData.linkedCharts,
															],
														});
													}
													this.failedText = this.$i18n.t("no_data_to_display");
												}
											} else {
												let xAxisData = {},
													yAxisData = {};

												Object.keys(sData[s]).forEach((ou) => {
													if (sData[s][ou][currentPeriod]) {
														yAxisData[ou] = sData[s][ou][currentPeriod]
															? sData[s][ou][currentPeriod]
															: null;
													}
													let sum = Object.keys(sData[s][ou]).reduce(
														(sum, key) =>
															sum + parseFloat(sData[s][ou][key] || 0),
														0
													);
													sum = sData[s][ou][currentPeriod]
														? sum - sData[s][ou][currentPeriod]
														: sum;
													xAxisData[ou] = Math.round(
														sum / (this.periodLength * 1 - 1)
													);
												});

												let quarters = {
														Q1: ["Jan", "Mar"],
														Q2: ["Apr", "Jun"],
														Q3: ["Jul", "Sep"],
														Q4: ["Oct", "Dec"],
													},
													years = ["Mar", "Apr"];
												if (this.$i18n.locale === "fr") {
													quarters = {
														Q1: ["janv.", "mars"],
														Q2: ["avril", "juin"],
														Q3: ["juil.", "sept."],
														Q4: ["oct.", "déc."],
													};
													years = ["mars", "avril"];
												}
												let formattedPeriod = null,
													pType = this.$i18n.t("month");
												if (this.periodType === "monthly") {
													formattedPeriod = this.$moment(
														currentPeriod,
														"YYYYMM"
													).format("MMM YYYY");
													pType = this.$i18n.t("month");
												} else if (this.periodType === "quarterly") {
													let q1 = currentPeriod.split("Q");
													formattedPeriod =
														quarters[`Q${q1[1]}`][0] +
														" " +
														this.$i18n.t("toSmall") +
														" " +
														quarters[`Q${q1[1]}`][1] +
														" " +
														q1[0];
													pType = this.$i18n.t("quarter");
												} else if (this.periodType === "financialYear") {
													let q1 = currentPeriod.split("April");
													formattedPeriod = `${years[1]} ${
														q1[0]
													} ${this.$i18n.t("toSmall")} ${years[0]} ${
														q1[0] * 1 + 1
													}`;
													pType = this.$i18n.t("financialYear");
												} else {
													formattedPeriod = this.$moment(
														currentPeriod,
														"YYYY"
													).format("YYYY");
													pType = this.$i18n.t("year");
												}
												let xLegend = this.$i18n.t("legend6", {
													count: this.periodLength * 1 - 1,
													periodType: pType,
												});
												let chartXLegend = chartOptions.xAxis.visible
													? chartOptions.xAxis.text
														? chartOptions.xAxis.text
														: xLegend
													: xLegend;
												let chartYLegend = chartOptions.yAxis.visible
													? chartOptions.yAxis.text
														? chartOptions.yAxis.text
														: formattedPeriod
													: formattedPeriod;

												let xException = Object.keys(xAxisData).filter(
													(val) => !Object.keys(yAxisData).includes(val)
												);
												let yException = Object.keys(yAxisData).filter(
													(val) => !Object.keys(xAxisData).includes(val)
												);

												let sameRegions = Object.keys(xAxisData).filter((val) =>
													Object.keys(yAxisData).includes(val)
												);
												let noDataRegions = ou.filter(
													(val) => !sameRegions.includes(val)
												);

												noDataRegions.forEach((val) => {
													let name = null;
													if (response.data.metaData.items[val]) {
														name = response.data.metaData.items[val].name;
													}
													if (xException.includes(val)) {
														Object.keys(xAxisData).forEach((x) => {
															if (x === val) {
																this.exceptionTable.push({
																	[this.$i18n.t("location")]: name,
																	[chartYLegend]: "",
																	[chartXLegend]: xAxisData[x] * 1,
																});
															}
														});
													} else if (yException.includes(val)) {
														Object.keys(yAxisData).forEach((x) => {
															if (x === val) {
																this.exceptionTable.push({
																	[this.$i18n.t("location")]: name,
																	[chartYLegend]: yAxisData[y] * 1,
																	[chartXLegend]: "",
																});
															}
														});
													} else {
														this.exceptionTable.push({
															[this.$i18n.t("location")]: name,
															[chartYLegend]: "",
															[chartXLegend]: "",
														});
													}
												});
												let highX = 0,
													highY = 0,
													lowX = 0,
													lowY = 0;

												let data = [],
													regressionData = [],
													xArr = [];

												Object.keys(xAxisData).forEach((x) => {
													let locID = this.defaultLocationID;
													if (this.childArr.length === 0) {
														locID = "";
													}
													if (x !== locID) {
														xArr.push(xAxisData[x]);
														let name = "";
														if (response.data.metaData.items[x]) {
															name = response.data.metaData.items[x].name;
														}

														Object.keys(yAxisData).forEach((y) => {
															if (x === y) {
																regressionData.push([
																	xAxisData[x] * 1,
																	yAxisData[y] * 1,
																]);
																let ratio =
																	xAxisData[x] * 1 !== 0
																		? ((yAxisData[y] * 1) /
																				(xAxisData[x] * 1)) *
																		  1
																		: 0;
																let thresholdLow = 1 - qualityThreshold,
																	thresholdHigh = 1 + qualityThreshold;
																let outlier =
																	ratio < thresholdLow || ratio > thresholdHigh;
																data.push({
																	name,
																	x: xAxisData[x] * 1,
																	y: yAxisData[y] * 1,
																	color: outlier
																		? this.outliersColor
																		: chartOptions.color,
																	outlier: outlier,
																});
																let itemObj = {
																	[this.$i18n.t("location")]: name,
																};
																Object.keys(sData[s][y]).forEach((d) => {
																	if (d !== currentPeriod) {
																		let formattedPeriod = null;
																		if (this.periodType === "monthly") {
																			formattedPeriod = this.$moment(
																				d,
																				"YYYYMM"
																			).format("MMM YYYY");
																		} else if (
																			this.periodType === "quarterly"
																		) {
																			let q1 = d.split("Q");
																			formattedPeriod =
																				quarters[`Q${q1[1]}`][0] +
																				" " +
																				this.$i18n.t("toSmall") +
																				" " +
																				quarters[`Q${q1[1]}`][1] +
																				" " +
																				q1[0];
																		} else if (
																			this.periodType === "financialYear"
																		) {
																			let q1 = d.split("April");
																			formattedPeriod = `${years[1]} ${
																				q1[0]
																			} ${this.$i18n.t("toSmall")} ${
																				years[0]
																			} ${q1[0] * 1 + 1}`;
																		} else {
																			formattedPeriod = this.$moment(
																				d,
																				"YYYY"
																			).format("YYYY");
																		}
																		let isFound = fields.find(
																			(f) => f === formattedPeriod
																		);
																		if (!isFound) {
																			fields.push(formattedPeriod);
																		}
																		itemObj[formattedPeriod] = sData[s][y][d];
																	}
																});
																let isFound = fields.find(
																	(f) => f === chartXLegend
																);
																if (!isFound) {
																	fields.push(chartXLegend);
																}
																itemObj[chartXLegend] = xAxisData[x] * 1;
																isFound = fields.find(
																	(f) => f === chartYLegend
																);
																if (!isFound) {
																	fields.push(chartYLegend);
																}
																itemObj[chartYLegend] = yAxisData[y] * 1;
																if (outlier) {
																	itemObj["_rowVariant"] = "danger";
																}
																items.push(itemObj);
															}
														});
													}
												});

												let max = Math.max(...xArr);
												// highX = lowY = Math.round(max / 1000) * 1000;
												// highY = lowX =
												//   Math.round(((1 + qualityThreshold) * highX) / 1000) *
												//   1000;
												highX = lowY = max;
												highY = lowX = (1 + qualityThreshold) * highX;
												if (data.length) {
													this.methodConfig.series.push({
														name: `${chartXLegend} vs ${chartYLegend}`,
														color: chartOptions.color,
														data: data,
													});
													this.methodConfigTable = {
														items: items,
														fields: fields,
													};

													const result = regression.linear(regressionData);
													let maxValue = Math.max(...regressionData.flat());
													// maxValue = Math.round(maxValue / 1000) * 1000;
													let diagonalLine = {
														type: "line",
														name: this.$i18n.t("legend1"),
														color: "#000000",
														dashStyle: "Dot",
														data: [
															[0, 0],
															[maxValue, maxValue],
														],
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
														// showInLegend: false
													};
													let qualityThresholdHigh = {
														type: "line",
														name: "Quality Threshold High",
														color: chartOptions.trendlineColor,
														dashStyle: "LongDash",
														data: [
															[0, 0],
															[highX, highY],
														],
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
														showInLegend: false,
													};
													let qualityThresholdLow = {
														type: "line",
														name: "Quality Threshold Low",
														color: chartOptions.trendlineColor,
														dashStyle: "LongDash",
														data: [
															[0, 0],
															[lowX, lowY],
														],
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
														showInLegend: false,
													};
													this.methodConfig.xAxis.max = maxValue;
													this.methodConfig.yAxis.max = maxValue;
													this.methodConfig.series.push(diagonalLine);
													this.methodConfig.series.push(qualityThresholdHigh);
													this.methodConfig.series.push(qualityThresholdLow);

													let regressionLine = {
														type: "line",
														name: this.$i18n.t("legend2"),
														color: chartOptions.trendlineColor,
														data: result.points,
														dashStyle: "solid",
														marker: {
															enabled: false,
														},
														states: {
															hover: {
																lineWidth: 0,
															},
														},
														enableMouseTracking: false,
													};
													this.methodConfig.series.push(regressionLine);
													let r2 = result.r2 ? result.r2 : 0;
													this.methodConfig.chart.events = {
														load: function () {
															var chart = this;
															chart.renderer
																.html(
																	`R<sup>2</sup> : ${r2}`,
																	chart.plotWidth - 30,
																	chart.plotHeight - 40
																)
																.css({
																	fontSize: "13px",
																	color: chartOptions.trendlineColor,
																	fontWeight: 600,
																	backgroundColor: "#f1f1f1",
																	padding: "10px",
																	border: "1px solid #c4c4c4",
																	borderRadius: "4px",
																})
																.add();
														},
													};
													let exportArr = [];
													if (this.exportPosition === "5") {
														if (this.methodConfig.series.length) {
															exportArr.push({
																cardKey: "key14",
																...this.methodConfig,
															});
														}
													} else {
														if (this.methodConfig.series.length) {
															exportArr.push({
																cardKey: "key17",
																...this.methodConfig,
															});
														}
													}
													if (r2 > r2Max) {
														this.$emit(
															"sendScore",
															this.scoreKey,
															true,
															exportArr
														);
													} else {
														this.$emit(
															"sendScore",
															this.scoreKey,
															false,
															exportArr
														);
													}
													this.originalData = this.methodConfig.series;
													this.failedText = "";
													if (
														(this.reportChartData &&
															this.reportChartData.cid.split("/")[1] ===
																this.methodConfigCID) ||
														(this.reportChartData &&
															this.reportChartData.linkedCharts.find((c) =>
																c.includes(this.methodConfigCID)
															))
													) {
														let cid = this.getCID(
															this.reportChartData,
															this.methodConfigCID
														);
														this.$emit("setReportChart", {
															chartObj: this.methodConfig,
															chartName: this.chartName,
															cid: [cid],
														});
														// return;
													}
												} else {
													this.$emit("sendScore", this.scoreKey, false, []);
													this.failedText = this.$i18n.t("no_data_to_display");
													if (this.reportChartData) {
														this.$emit("setReportChart", {
															chartObj: null,
															chartName: null,
															cid: [this.reportChartData.cid],
														});
													}
												}
												// this.$store.state.loading = false;
												this.showLoader = false;
											}
										}
									} else {
										if (this.debugging) {
											if (this.activityLogArr) {
												let obj_log = {
													name: this.method,
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content: "response.data is not defined",
												};
												this.activityLogArr.push(obj_log);
											}
										}
										this.$emit("sendScore", this.scoreKey, false, []);
										if (this.reportChartData) {
											this.$emit("setReportChart", {
												chartObj: null,
												chartName: null,
												cid: [
													this.reportChartData.cid,
													...this.reportChartData.linkedCharts,
												],
											});
										}
										// this.$store.state.loading = false;
										this.showLoader = false;
										this.failedText = this.$i18n.t("no_data_to_display");
									}
									if (this.debugging && this.activityLogArr) {
										this.$emit("sendEVLog", this.activityLogArr);
									}
								})
								.catch(() => {
									this.$emit("sendScore", this.scoreKey, false, []);
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: null,
											chartName: null,
											cid: [
												this.reportChartData.cid,
												...this.reportChartData.linkedCharts,
											],
										});
									}
									if (this.debugging) {
										console.log(
											this.method +
												" - " +
												s +
												" - chartComponent - getIndicatorData() API response failed @",
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											let obj_log = {
												name: this.method,
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content:
													s +
													" - chartComponent - getIndicatorData() API response failed",
											};
											this.activityLogArr.push(obj_log);
											this.$emit("sendEVLog", this.activityLogArr);
										}
									}
									// this.$store.state.loading = false;
									this.showLoader = false;
								});
						} else {
							if (this.debugging) {
								if (this.activityLogArr) {
									let obj_log = {
										name: "External Validation",
										time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
										content: "aSelectedDE is not defined",
									};
									this.activityLogArr.push(obj_log);
									this.$emit("sendEVLog", this.activityLogArr);
								}
							}
							this.$emit("sendScore", this.scoreKey, false, []);
							if (this.reportChartData) {
								this.$emit("setReportChart", {
									chartObj: null,
									chartName: null,
									cid: [
										this.reportChartData.cid,
										...this.reportChartData.linkedCharts,
									],
								});
							}
							this.showAlert();
						}
					} else {
						if (this.debugging) {
							if (this.activityLogArr) {
								let obj_log = {
									name: "External Validation",
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content: "this.externalValidation[method][s] is not defined",
								};
								this.activityLogArr.push(obj_log);
							}
						}
						this.$emit("sendScore", this.scoreKey, false, []);
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: null,
								chartName: null,
								cid: [
									this.reportChartData.cid,
									...this.reportChartData.linkedCharts,
								],
							});
						}
						this.showAlert();
					}
				});
			} else {
				if (this.debugging) {
					if (this.activityLogArr) {
						var obj_log = {
							name: "External Validation",
							time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
							content: "this.externalValidation[method] is not defined",
						};
						this.activityLogArr.push(obj_log);
						this.$emit("sendEVLog", this.activityLogArr);
					}
				}
				this.$emit("sendScore", this.scoreKey, false, []);
				if (this.reportChartData) {
					this.$emit("setReportChart", {
						chartObj: null,
						chartName: null,
						cid: [
							this.reportChartData.cid,
							...this.reportChartData.linkedCharts,
						],
					});
				}
				this.showAlert();
			}
		},
		calculateMethodDataBackground(method) {
			let r2Max = this.externalValidation.Background_Data.r2Max * 1;

			let sData = {};

			if (this.externalValidation[method]) {
				this.externalValidation[method].selectedSource.forEach(async (s) => {
					let sSelectedDE = "",
						aSelectedDE = [];
					if (this.externalValidation[method][s]) {
						this.externalValidation[method][s].chartData.forEach((m) => {
							m.indicator.subIndicator.forEach((d) => {
								d.de.forEach((sd) => {
									aSelectedDE.push(sd);
								});
							});
						});
						sSelectedDE = aSelectedDE.join(";");
						let l = this.subLevelID;
						if (
							this.subLevelID == this.scorecardDefaultLocationID.split("/")[0]
						) {
							l = this.scorecardDefaultLocationID.split("/")[0] * 1 + 1;
						}
						let level = [l],
							period = getDateRange({
								sendPeriod: this.periodScorecard,
								periodType: this.periodType,
								periodLength: this.periodLength,
								applicationFinalYear: this.applicationFinalYear,
							}),
							currentPeriod = null;
						if (this.periodType === "yearly") {
							let periodValue = this.$moment(this.periodValue, "YYYY").format(
								"YYYY"
							);
							currentPeriod = periodValue;
						} else if (this.periodType === "financialYear") {
							let currentYear = this.periodValue;
							currentPeriod = `${currentYear}April`;
						} else if (this.periodType === "quarterly") {
							currentPeriod = this.periodValue;
						} else {
							let periodValue = this.$moment(this.periodValue, "YYYYMM").format(
								"YYYYMM"
							);
							currentPeriod = periodValue;
						}
						period = period.reverse().join(";");
						if (aSelectedDE.length) {
							service
								.getIndicatorData(
									sSelectedDE,
									level,
									this.scorecardDefaultLocationID.split("/")[1],
									period
								)
								.then((response) => {
									if (response.data.rows.length) {
										let valueIndex = 0,
											ouIndex = 0,
											peIndex = 0;
										response.data.headers.forEach((h, i) => {
											if (h.name === "value") {
												valueIndex = i;
											}

											if (h.name === "ou") {
												ouIndex = i;
											}

											if (h.name === "pe") {
												peIndex = i;
											}
										});

										let rData = {};
										response.data.rows.forEach((r) => {
											if (Object.keys(rData).includes(r[ouIndex])) {
												if (
													Object.keys(rData[r[ouIndex]]).includes(r[peIndex])
												) {
													rData[r[ouIndex]][r[peIndex]] =
														Number(rData[r[ouIndex]][r[peIndex]]) +
														Number(r[valueIndex]);
												} else {
													rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
												}
											} else {
												rData[r[ouIndex]] = {
													[r[peIndex]]: Number(r[valueIndex]),
												};
											}
										});
										sData[s] = rData;

										if (
											Object.keys(sData).length ===
											this.externalValidation[method].selectedSource.length
										) {
											let regressionData = [];
											if (
												this.externalValidation[method].selectedSource.length >
												1
											) {
												let method1 =
													this.externalValidation[method].selectedSource[0];
												let method2 =
													this.externalValidation[method].selectedSource[1];

												Object.keys(sData[method1]).forEach((x) => {
													let locID =
														this.scorecardDefaultLocationID.split("/")[1];
													if (this.childArr.length === 0) {
														locID = "";
													}
													if (x !== locID) {
														Object.keys(sData[method2]).forEach((y) => {
															if (x === y) {
																regressionData.push([
																	sData[method1][x][period] * 1,
																	sData[method2][y][period] * 1,
																]);
															}
														});
													}
												});
											} else {
												let xAxisData = {},
													yAxisData = {};
												Object.keys(sData[s]).forEach((ou) => {
													if (sData[s][ou][currentPeriod]) {
														yAxisData[ou] = sData[s][ou][currentPeriod]
															? sData[s][ou][currentPeriod]
															: null;
													}
													let sum = Object.keys(sData[s][ou]).reduce(
														(sum, key) =>
															sum + parseFloat(sData[s][ou][key] || 0),
														0
													);
													sum = sData[s][ou][currentPeriod]
														? sum - sData[s][ou][currentPeriod]
														: sum;
													xAxisData[ou] = Math.round(
														sum / (this.periodLength * 1 - 1)
													);
												});
												Object.keys(xAxisData).forEach((x) => {
													let locID =
														this.scorecardDefaultLocationID.split("/")[1];
													if (this.childArr.length === 0) {
														locID = "";
													}
													if (x !== locID) {
														Object.keys(yAxisData).forEach((y) => {
															if (x === y) {
																regressionData.push([
																	xAxisData[x] * 1,
																	yAxisData[y] * 1,
																]);
															}
														});
													}
												});
											}
											if (regressionData.length) {
												const result = regression.linear(regressionData);
												let r2 = result.r2 ? result.r2 : 0;
												if (r2 > r2Max) {
													this.$emit(
														"sendScoreBackground",
														this.scoreKey,
														true
													);
												} else {
													this.$emit(
														"sendScoreBackground",
														this.scoreKey,
														false
													);
												}
											} else {
												this.$emit("sendScoreBackground", this.scoreKey, false);
											}
										}
									} else {
										this.$emit("sendScoreBackground", this.scoreKey, false);
									}
								})
								.catch(() => {
									this.$emit("sendScoreBackground", this.scoreKey, false);
								});
						} else {
							this.$emit("sendScoreBackground", this.scoreKey, false);
						}
					} else {
						this.$emit("sendScoreBackground", this.scoreKey, false);
					}
				});
			} else {
				this.$emit("sendScoreBackground", this.scoreKey, false);
			}
		},
		showTable(val, key) {
			this[`${key}Type`] = val;
		},
		dataSort(sort) {
			this.averageMethod.series.map((d) => ({
				...d,
				data: d.data.sort((a, b) => {
					let valueA = 0,
						valueB = 0;

					if (sort === "0-1" || sort === "1-0") {
						valueA = a.y;
						valueB = b.y;
					}

					if (sort === "A-Z" || sort === "Z-A") {
						valueA = a.name.toLowerCase();
						valueB = b.name.toLowerCase();
					}

					let comparison = 0;
					if (sort == "0-1" || sort === "A-Z") {
						if (valueA > valueB) {
							comparison = 1;
						} else if (valueA < valueB) {
							comparison = -1;
						}
					} else if (sort == "1-0" || sort === "Z-A") {
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
		showAlert() {
			// this.$store.state.loading = false;
			this.showLoader = false;
			this.failedText = this.$i18n.t("maperror_msg");
		},
	},
	created() {
		this.averagePeriods = [];
		if (this.externalValidation[this.method].selectedSource.length > 1) {
			this.periodLength = 1;
		} else {
			this.periodLength = 4;
			for (let i = 1; i <= 4; i++) {
				let p = i * 3;
				this.averagePeriods.push({
					text: this.$i18n.t("legend6", {
						count: p,
						periodType: this.$i18n.t("month"),
					}),
					value: p,
				});
			}
		}

		if (!this.reportChartData) {
			// this.$store.state.loading = false;
			this.showLoader = true;
		}

		if (
			!this.reportChartData ||
			(this.reportChartData &&
				this.reportChartData.selectedCategory.split("-")[1] === this.method)
		) {
			this.calculateMethodData(this.method);
		}
	},
};
</script>
<style lang="scss" scoped>
.b-table-sticky-header {
	max-height: 380px;
	height: 380px;
}
.heading-alert {
	width: auto;
	float: right;
	background-color: #2e2e48;
	border-color: #2e2e48;
	font-size: 0.875rem !important;
	padding: 0.25rem 0.5rem;
	color: #fff;
	p {
		letter-spacing: 0.1em;
	}
}
.newGreen-theme .heading-alert {
	width: auto;
	float: right;
	background-color: #0c5327;
	border-color: #0c5327;
	font-size: 0.875rem !important;
	padding: 12px;
	color: #fff;
	p {
		letter-spacing: 0.1em;
	}
}

.newBlack-theme .heading-alert {
	width: auto;
	float: right;
	background-color: #0b0c10;
	border-color: #0b0c10;
	font-size: 0.875rem !important;
	padding: 12px;
	color: #fff;
	p {
		letter-spacing: 0.1em;
	}
}
</style>
