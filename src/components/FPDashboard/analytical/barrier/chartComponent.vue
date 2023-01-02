<template>
	<fullscreen v-model="cObjFull" ref="fullscreen" class="fullContainer">
		<div class="position-relative fullContent">
			<loader class="cardLoader" v-if="showLoader" />
			<div class="card" v-if="showCard">
				<div class="card-header px-2 py-1">
					<div class="row no-gutters">
						<div
							class="col-lg-9 col-md-9 p-t-4px"
							:class="{ 'col-lg-12 col-md-12': cObjFull }"
						>
							<div class="cardTitleSection text-wrap fs-19-1920">
								<i
									class="fa fa-info-circle color-white cursor-pointer chart-info mr-2"
									aria-hidden="true"
									v-b-popover.hover.rightbottom="{
										variant: 'info',
										content: chartInfo,
										title: cObj.title.title,
										html: true,
									}"
								></i>
								<p class="title_p fs-19-1920 m-0">{{ cObj.title.title }}</p>
							</div>
						</div>
						<div class="col-lg-3 col-md-3 position-relative" v-if="!cObjFull">
							<ChartOptions
								:sorting="sorting"
								@dataSort="dataSort"
								:defaultSort="defaultSort"
								@showTable="showTable"
								@exportChart="exportChart"
								:cID="cID"
								chartKey="barCharts"
								:trendTable="cObjTable"
								fullScreenKey="cObj"
								@toggleFullscreen="toggleFullscreen"
							/>
						</div>
					</div>
				</div>
				<div
					class="row px-3"
					:class="{ hidden: viewType === 'table' }"
					v-if="cObj.series.length > 0"
				>
					<div class="col-lg-12 col-md-12">
						<ChartFilters
							:periodOptions="periodOptions"
							:pLength="pLength"
							@changePeriod="changePeriod"
						/>
					</div>
				</div>
				<div class="card-body py-0">
					<div class="text-right my-2" v-if="btns">
						<b-button
							class="btn-sm"
							variant="secondary"
							v-for="(btn, ind) in btns"
							:key="ind"
							@click.stop.prevent="btnClickHandle(btn.value)"
							:class="[
								btn.class,
								btnSelected1 === btn.value ? 'black-btn' : '',
							]"
							>{{ btn.text }}</b-button
						>
					</div>
					<template v-if="viewType !== 'table'">
						<highcharts
							v-if="cObj"
							:options="cObj"
							ref="barCharts"
						></highcharts>
					</template>
					<template v-else>
						<div
							class="chartHeight text-center"
							style="height: 400px !important"
						>
							<b-table
								head-variant="light"
								sticky-header
								class="mb-0"
								v-if="cObj.series.length && cObjTable.items.length"
								:bordered="true"
								hover
								:items="cObjTable.items"
								:fields="cObjTable.fields"
								style="max-height: 400px !important"
								:sort-compare="sortDate"
							>
							</b-table>
							<div class="my-4 text-center" v-else>
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</template>
					<div class="" v-if="exceptionTable.length">
						<span class="cursor-pointer text-danger" @click="popoverShow = true"
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
									>{{ $t("csv") }} <i class="fa fa-download ml-2"></i
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
					</div>
					<div class="card-footer text-right">
						<p class="m-0">
							{{ $t("source") }}:
							<span>{{ chartSource }}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</fullscreen>
</template>

<script>
import service from "@/service";
import chartConfig from "./chartConfig.js";
import MD from "./cComponent";
import {
	getDateRange,
	formatSingleDate,
	chartExport,
} from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
	components: {
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
		ChartFilters: () =>
			import(
				/* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
			),
	},
	props: [
		"chartCategory",
		"chartSubCategory",
		"chartComponent",
		"chartName",
		"period",
		"sendLocation",
		"ministrialData",
		"dataFunction",
		"globalFactorsData",
		"cyp",
		"periodLen",
		"sorting",
		"cardKey",
		"noDerivedSettings",
		"total",
		"exclude",
		"plotTypeChange",
		"plotOptions",
		"derivedChart",
		"defaultSort",
		"viewTypeClass",
		"facilityLevel",
		"btns",
		"btnSelected",
		"chartType",
		"chartRep",
		"locationList",
		"isRegionalChart",
		"periodType",
		"applicationFinalYear",
		"debugging",
		"pOptions",
		"reportChartData",
	],
	mixins: [getCIDMixin, FullScreenMixin],
	data() {
		return {
			activityLogArr: [],
			chartData: [],
			cObj:
				this.chartRep === "scatter"
					? JSON.parse(JSON.stringify(chartConfig.scatter))
					: JSON.parse(JSON.stringify(chartConfig.normal)),
			chartSource: null,
			cObjTable: {
				items: [],
				fields: [],
			},
			updatedChartData: {},
			months: {
				"01": "Jan",
				"02": "Feb",
				"03": "Mar",
				"04": "Apr",
				"05": "May",
				"06": "Jun",
				"07": "Jul",
				"08": "Aug",
				"09": "Sep",
				10: "Oct",
				11: "Nov",
				12: "Dec",
			},
			showLoader: true,
			viewType: "chart",
			cID: "",
			commentList: [],
			chartInfo: "",
			plotType: "",
			drilldown: false,
			download: false,
			btnSelected1: this.btnSelected,
			cdata: null,
			btnData: [],
			globalData: {},
			exceptionTable: [],
			popoverShow: false,
			showCard: true,
			periodOptions: this.pOptions,
			pLength: this.periodLen,
			cObjFull: false,
		};
	},
	watch: {
		pOptions(newVal) {
			if (newVal) {
				this.periodOptions = newVal;
			}
		},
		period(newValue) {
			if (newValue) {
				this.showLoader = true;
				this.showCard = true;
				this.pLength = this.periodLen;
				this.cObj.series = [];
				this.cObj.drilldown = {
					series: [],
				};
				this.viewType = "chart";
				this.getIndicators();
			}
		},
		sendLocation(newValue) {
			if (newValue) {
				this.showLoader = true;
				this.showCard = true;
				this.cObj.series = [];
				this.cObj.drilldown = {
					series: [],
				};
				this.viewType = "chart";
				this.getIndicators();
			}
		},
		btnData(newValue) {
			this.updatedBtnData();
		},
		pLength(newValue) {
			if (newValue) {
				this.showLoader = true;
				this.cObj.series = [];
				this.cObj.drilldown = {
					series: [],
				};
				this.getIndicators();
			}
		},
	},
	methods: {
		changePeriod(newPeriod) {
			this.pLength = newPeriod;
		},
		btnClickHandle(value) {
			this.btnSelected1 = value;
			this.showLoader = true;
			// this.getButtonData()
			this.getIndicators();
		},
		sortDate(a, b, key) {
			if (key !== "Period") {
				// `key` is not the field that is a date.
				// Let b-table handle the sorting for other columns
				// returning null or false will tell b-table to fall back to it's
				// internal sort compare routine for fields keys other than `myDateField`
				return null; // or false
			}
			let aDate = this.$moment(a[key], "MMMM YYYY");
			let bDate = this.$moment(b[key], "MMMM YYYY");
			if (aDate.isValid && bDate.isValid) {
				if (aDate < bDate) {
					return -1;
				} else if (aDate > bDate) {
					return 1;
				} else {
					return 0;
				}
			}
			return null;
		},
		changePlotType(value) {
			if (value === "stack") {
				this.cObj.plotOptions.column.stacking = "normal";
			} else {
				this.cObj.plotOptions.column.stacking = "";
				this.cObj.chart.type = value.toLowerCase();
				if (value.toLowerCase() !== "line") {
					this.cObj.yAxis.min = null;
				} else {
					this.cObj.yAxis.min = 0;
				}
			}
		},
		changeViewType(type, key) {
			this[key] = type;
			setTimeout(() => {
				if (type === "table") {
					this.download = false;
				}
			}, 100);
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
		flattenLocationList(array) {
			var result = [];
			array.forEach((a) => {
				result.push(a);
				if (Array.isArray(a.children)) {
					let children = a.children.map((c) => ({
						...c,
						parentID: a.id,
					}));
					result = result.concat(this.flattenLocationList(children));
				}
			});
			return result;
		},
		showTable(val, key) {
			this.viewType = val;
		},
		/**
		 * This fnc is to get indicators api value from DHIS for selected options.
		 * Usage: `getIndicators()`
		 * @param 'minres' which is the Ministerial module configuration setup stored in datastore
		 * @return {Object}
		 */
		async getIndicators(minres = this.ministrialData) {
			let moduleConfig = minres;
			let cData = {};

			if (moduleConfig[this.chartSubCategory] != undefined) {
				cData = moduleConfig[this.chartSubCategory][this.chartComponent];
			} else {
				cData = undefined;
			}
			this.exceptionTable = [];
			this.cdata = cData;

			let items = [];
			let key =
				this.chartType !== "region"
					? this.$i18n.t("period")
					: this.$i18n.t("location");
			if (this.derivedChart && this.chartRep !== "scatter") {
				key = this.$i18n.t("period");
			}
			let fields = [
				{
					key,
					stickyColumn: true,
					sortable: true,
					isRowHeader: true,
					variant: "secondary",
				},
			];

			this.cObjTable = {
				items: items,
				fields: fields,
			};

			if (cData) {
				let derivedCharts = [];

				if (
					cData.derivedCharts &&
					cData.derivedCharts.length &&
					!this.noDerivedSettings
				) {
					derivedCharts = cData.derivedCharts;
				}
				let _this = this;
				this.cObj.chart.events = {
					drillup: function (e) {
						_this.drilldown = false;
						this.yAxis[0].options.min = 0;
						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11 && !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1;
						this.options.chart.zoomType = "x";
					},
					drilldown: function (e) {
						_this.drilldown = true;
						this.yAxis[0].options.min = null;
						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11 && !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1;
						this.options.chart.zoomType = "";
					},
				};

				if (
					this.derivedChart &&
					derivedCharts.length &&
					!this.noDerivedSettings
				) {
					let dData = derivedCharts[0].chartOptions;
					this.cID = dData.cid;
					if (
						cData.disableChart ||
						dData.disableChart ||
						(this.reportChartData &&
							this.reportChartData.cid.split("/")[1] !== this.cID &&
							!this.reportChartData.linkedCharts.find((c) =>
								c.includes(this.cID)
							))
					) {
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							hideFromReport: true,
							isReportChart: this.reportChartData
								? this.reportChartData.linkedCharts.find((c) =>
										c.includes(this.cID)
								  ) ||
								  this.reportChartData.cid.split("/")[1] === this.cID ||
								  false
								: false,
							cid: this.reportChartData
								? this.getCID(this.reportChartData, this.cID)
								: "",
						});
						return;
					}
					this.chartInfo = dData.chartInfo ? dData.chartInfo : "";
					this.cObj.chart.type = this.chartRep ? this.chartRep : "line";
					this.cObj.title.title = dData.chartName
						? dData.chartName
						: cData.chartOptions.title.title;
					this.cObj.title.text = dData.title.visible ? dData.title.text : "";
					this.cObj.exporting.chartOptions.title.text = dData.chartName
						? dData.chartName
						: cData.chartOptions.title.title;
					this.cObj.subtitle.text = dData.subTitle.visible
						? dData.subTitle.text
						: "";
					this.cObj.xAxis.title.text = dData.xAxis.visible
						? dData.xAxis.text
						: "";
					this.cObj.yAxis.title.text = dData.yAxis.visible
						? dData.yAxis.text
						: "";
					//this.cObj.yAxis.min = 0
					//this.cObj.xAxis.max = 11

					this.chartSource = cData.chartOptions.chartDataSource.text
						? cData.chartOptions.chartDataSource.text
						: "DHIS";
					let _this = this;
					this.cObj.plotOptions = {
						...this.cObj.plotOptions,
						line: {
							events: {
								legendItemClick: function (event) {
									_this.cObj.series = _this.cObj.series.map((s) => {
										if (s.name === this.name) {
											return {
												...s,
												visible: !s.visible,
											};
										} else {
											return s;
										}
									});
								},
							},
							showInLegend: true,
						},
					};
				} else {
					// this.cObj.chart.type = cData.chartOptions.chart.type.toLowerCase()
					this.cID = cData.cid;
					if (
						cData.disableChart ||
						(this.reportChartData &&
							this.cID !== this.reportChartData.cid.split("/")[1] &&
							!this.reportChartData.linkedCharts.find((c) =>
								c.includes(this.cID)
							))
					) {
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							hideFromReport: true,
							isReportChart: this.reportChartData
								? this.reportChartData.linkedCharts.find((c) =>
										c.includes(this.cID)
								  ) ||
								  this.reportChartData.cid.split("/")[1] === this.cID ||
								  false
								: false,
							cid: this.reportChartData
								? this.getCID(this.reportChartData, this.cID)
								: "",
						});
						return;
					}
					if (!this.derivedChart) {
						if (cData.chartOptions.chart.type.toLowerCase() === "stack") {
							this.cObj.chart.type = "column";
						} else {
							this.cObj.chart.type =
								this.chartRep === "scatter"
									? "scatter"
									: cData.chartOptions.chart.type.toLowerCase();
						}
						this.plotType = cData.chartOptions.chart.type.toLowerCase();
						if (cData.chartOptions.chart.type.toLowerCase() === "line") {
							this.cObj.yAxis.min = 0;
						}
					}

					this.chartInfo = cData.chartInfo ? cData.chartInfo : "";
					this.cObj.title.title = cData.chartName
						? cData.chartName
						: cData.chartOptions.title.title
						? cData.chartOptions.title.title
						: this.chartName;
					if (this.isRegionalChart) {
						this.cObj.title.title =
							this.cObj.title.title + " - " + this.$i18n.t("regional");
					}
					this.cObj.title.text = cData.chartOptions.title.visible
						? cData.chartOptions.title.title
						: "";
					this.cObj.exporting.chartOptions.title.text = cData.chartOptions.title
						.title
						? cData.chartOptions.title.title
						: "";
					this.cObj.subtitle.text = cData.chartOptions.subTitle.visible
						? cData.chartOptions.subTitle.subTitle
						: "";
					this.cObj.xAxis.title.text = cData.chartOptions.xAxis.visible
						? cData.chartOptions.xAxis.title.text
						: "";
					this.cObj.yAxis.title.text = cData.chartOptions.yAxis.visible
						? cData.chartOptions.yAxis.title.text
						: "";
					this.chartSource = cData.chartOptions.chartDataSource.text
						? cData.chartOptions.chartDataSource.text
						: "DHIS2";
					let _this = this;
					this.cObj.plotOptions = {
						...this.cObj.plotOptions,
						column: {
							stacking:
								cData.chartOptions.chart.type.toLowerCase() === "stack"
									? "normal"
									: "",
							dataLabels: {
								enabled: cData.dataLabels.enabled,
							},
							showInLegend: true,
						},
						line: {
							dataLabels: {
								enabled: cData.dataLabels.enabled,
							},
							showInLegend: true,
						},
						area: {
							dataLabels: {
								enabled: cData.dataLabels.enabled,
							},
							showInLegend: true,
						},
						series: {
							events: {
								legendItemClick: function (event) {
									_this.cObj.series = _this.cObj.series.map((s) => {
										if (s.name === this.name) {
											return {
												...s,
												visible: !s.visible,
											};
										} else {
											return s;
										}
									});
								},
							},
						},
					};
				}

				if (this.viewTypeClass === "access-chart4") {
					this.cObj.legend.symbolWidth = 30;
				}

				let sSelectedDE = "",
					aSelectedDE = [];
				let sSelectedDEReportingForm = "",
					aSelectedDEReportingForm = [],
					catArray = [],
					cypArray = [],
					cypData = [],
					color = "";

				if (this.cyp) {
					this.globalFactorsData.chartData.forEach((c) =>
						c.indicator.subIndicator.forEach((s) =>
							cypData.push({
								name: s.name[0],
								cyp: s.cyp,
							})
						)
					);
				}

				let chartData = "";
				if (this.btnSelected1) {
					this.getButtonData();
				} else {
					this.btnData = cData.chartData;
				}

				if (
					(this.dataFunction === "dxTotalOUDataStockNew" ||
						this.dataFunction === "dxTotalOUDataAccessNew") &&
					this.cdata.indicatorsType !== "calculated"
				) {
					this.updatedBtnDataNew();
					catArray = this.globalData.cat
						.filter((m) => m.methods.length)
						.map((c) => ({
							...c,
							methods: c.methods.map((m) => ({
								...m,
								dx: m.dx.flat(),
							})),
						}));
				} else {
					this.updatedBtnData();
					catArray = this.globalData.cat
						.filter((m) => m.dx.length)
						.map((c) => ({
							...c,
							dx: c.dx.flat(),
						}));
				}

				//cData.chartData.forEach((k, i) => {

				sSelectedDE = this.globalData.de.join(";");

				let level = [];
				if (this.facilityLevel == false) {
					level = [this.sendLocation[0], this.sendLocation[1]];
				} else {
					level =
						this.cdata.indicatorsType === "calculated"
							? [this.sendLocation[0], this.sendLocation[1]]
							: [this.sendLocation[0], this.facilityLevel];
				}

				let period = getDateRange({
						sendPeriod: this.period,
						periodType: this.periodType,
						periodLength: this.pLength,
						applicationFinalYear: this.applicationFinalYear,
					}),
					periodValue = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

				period = period.reverse().join(";");

				let countryID = [this.sendLocation[2]];

				if (
					typeof this.cdata.indicatorsType !== undefined &&
					this.cdata.indicatorsType === "calculated"
				) {
					color = cData.chartOptions.color
						? cData.chartOptions.color
						: "#" + ((Math.random() * 0xffffff) << 0).toString(16);
					if (this.globalData.de.length > 0) {
						if (this.debugging) {
							console.log(
								" API call started with params selected DE = '" +
									sSelectedDE +
									"', level = '" +
									level +
									"', location ID = '" +
									countryID +
									"', period = '" +
									period +
									"' @",
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
							);
							if (this.activityLogArr) {
								var obj_log = {
									name: "service.getIndicatorData",
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content:
										"API call started with params selected DE = '" +
										sSelectedDE +
										"', level = '" +
										level +
										"', location ID = '" +
										countryID +
										"', period = '" +
										period,
								};
								this.activityLogArr.push(obj_log);
								this.$emit("sendChartLog", this.activityLogArr);
							}
						}
						service
							.getIndicatorData(sSelectedDE, level, countryID, period)
							.then((response) => {
								if (this.debugging) {
									console.log(
										" API call received with params selected DE = '" +
											sSelectedDE +
											"', level = '" +
											level +
											"', location ID = '" +
											countryID +
											"', period = '" +
											period +
											"' received @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: "service.getIndicatorData",
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content:
												"API call received with params selected DE = '" +
												sSelectedDE +
												"', level = '" +
												level +
												"', location ID = '" +
												countryID +
												"', period = '" +
												period +
												"' received ",
										};
										this.activityLogArr.push(obj_log);
										this.$emit("sendChartLog", this.activityLogArr);
									}
								}
								if (response.data.rows.length) {
									let fData = {
										categories: [],
										series: [],
										drilldown: {},
									};
									fData = MD[`${this.dataFunction}Calculated`](
										response,
										countryID,
										catArray,
										items,
										fields,
										this.derivedChart,
										this.chartType,
										this.isRegionalChart,
										this.periodType,
										this.$i18n.locale,
										this.$i18n.t("period"),
										this.$i18n.t("location"),
										this.$moment
									);

									if (fData) {
										this.cObj.series = fData.series;
										if (this.defaultSort) {
											this.dataSort(this.defaultSort);
										}
										if (fData.series.length === 0) {
											this.showCard = false;
										}
										this.cObjTable = {
											items: fData.items,
											fields: fData.fields,
										};
										if (fData.drilldown.series.length > 0) {
											this.cObj.drilldown = fData.drilldown;
										}
										if (this.chartRep !== "scatter") {
											let min = 0,
												max = 0;
											fData.series.forEach((d) => {
												let innerDataArr = d.data.map((dInner) => dInner.y);
												let innerMin = Math.min(...innerDataArr);
												let innerMax = Math.max(...innerDataArr);
												if (innerMin < min) {
													min = innerMin;
												}
												if (innerMax > max) {
													max = innerMax;
												}
											});

											this.cObj.yAxis.min = min > 0 ? 0 : min;
											this.cObj.yAxis.max = max;

											this.cObj.chart.events = {
												...this.cObj.chart.events,
												selection: function (e) {
													if (!e.xAxis) {
														if (_this.derivedChart && !_this.reportChartData) {
															let catLen =
																this.options.series[0].data.length - 1;
															if (catLen > 11) {
																setTimeout(() => {
																	this.xAxis[0].setExtremes(
																		catLen - 11,
																		catLen
																	);
																}, 0);
															}
														}
														_this.download = false;
													} else {
														_this.download = true;
													}
												},
											};
										}
										if (this.derivedChart && this.chartRep !== "scatter") {
											this.cObj.chart.events = {
												...this.cObj.chart.events,
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
											};
										}

										// fData.fields.push('show_regions')

										this.showLoader = false;
										this.$emit("hideCard", this.cardKey, true, {
											...this.cObj,
											cardKey: this.cardKey,
											chartComponent: this.chartComponent,
											chartSubCategory: this.chartSubCategory,
											chartSource: this.chartSource,
											cid: this.reportChartData
												? this.getCID(this.reportChartData, this.cID)
												: "",
										});
									} else {
										if (this.debugging) {
											console.log(
												"fData failed @" +
													this.$moment().format("MMMM Do YYYY, h:mm:ss a")
											);
											if (this.activityLogArr) {
												var obj_log = {
													name: "fData failed",
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content: " fData failed",
												};
												this.activityLogArr.push(obj_log);
												this.$emit("sendChartLog", this.activityLogArr);
											}
										}
										this.showLoader = false;
										this.cObj.series = [];
										this.$emit("hideCard", this.cardKey, false, {
											...this.cObj,
											cardKey: this.cardKey,
											chartComponent: this.chartComponent,
											chartSubCategory: this.chartSubCategory,
											chartSource: this.chartSource,
											cid: this.reportChartData
												? this.getCID(this.reportChartData, this.cID)
												: "",
										});
									}
								} else {
									if (this.debugging) {
										console.log(
											"response.data.rows.length failed @",
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											var obj_log = {
												name: "service.getIndicatorData",
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: " response.data.rows.length failed ",
											};
											this.activityLogArr.push(obj_log);
											this.$emit("sendChartLog", this.activityLogArr);
										}
									}
									this.showLoader = false;
									this.cObj.series = [];
									this.$emit("hideCard", this.cardKey, false, {
										...this.cObj,
										cardKey: this.cardKey,
										chartComponent: this.chartComponent,
										chartSubCategory: this.chartSubCategory,
										chartSource: this.chartSource,
										cid: this.reportChartData
											? this.getCID(this.reportChartData, this.cID)
											: "",
									});
								}
							})
							.catch((e) => {
								if (this.debugging) {
									console.log(
										"API response failed @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: "service.getIndicatorData",
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content: " API response failed " + e.stack,
										};
										this.activityLogArr.push(obj_log);
										this.$emit("sendChartLog", this.activityLogArr);
									}
								}
								this.$emit("hideCard", this.cardKey, false, {
									...this.cObj,
									cardKey: this.cardKey,
									chartComponent: this.chartComponent,
									chartSubCategory: this.chartSubCategory,
									chartSource: this.chartSource,
									cid: this.reportChartData
										? this.getCID(this.reportChartData, this.cID)
										: "",
								});
								this.showLoader = false;
							});
					} else {
						if (this.debugging) {
							console.log(
								"this.globalData.de.length > 0 failed @" +
									this.$moment().format("MMMM Do YYYY, h:mm:ss a")
							);
							if (this.activityLogArr) {
								var obj_log = {
									name: "service.getIndicatorData",
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content: "this.globalData.de.length > 0 failed",
								};
								this.activityLogArr.push(obj_log);
								this.$emit("sendChartLog", this.activityLogArr);
							}
						}
						this.showLoader = false;
						this.cObj.series = [];
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							cardKey: this.cardKey,
							chartComponent: this.chartComponent,
							chartSubCategory: this.chartSubCategory,
							chartSource: this.chartSource,
							cid: this.reportChartData
								? this.getCID(this.reportChartData, this.cID)
								: "",
						});
					}
				} else {
					if (this.isRegionalChart) {
						let flatLocations = await this.flattenLocationList(
								this.locationList
							),
							locID = [];
						flatLocations.forEach((l) => {
							if (
								l.level === this.sendLocation[1] &&
								l.parentID === `${this.sendLocation[0]}/${this.sendLocation[2]}`
							) {
								locID.push(l.id.split("/")[1]);
							}
						});
						level = [this.sendLocation[1], this.facilityLevel];
						if (this.globalData.de.length > 0 && locID.length > 0) {
							let tempSeries = [],
								tempItems = [],
								promises = [];
							locID.forEach((locationID, i) => {
								promises.push(
									service.getIndicatorData(
										sSelectedDE,
										level,
										[locationID],
										period
									)
								);
							});
							Promise.all(promises).then((results) => {
								results.forEach((response, i) => {
									if (response.data.rows.length) {
										let fData = {
												categories: [],
												series: [],
												drilldown: {},
											},
											items = [];
										fData = MD[this.dataFunction](
											response,
											[locID[i]],
											catArray,
											items,
											fields,
											this.derivedChart,
											this.chartType,
											this.isRegionalChart,
											this.periodType,
											this.$i18n.locale,
											this.$i18n.t("period"),
											this.$i18n.t("location"),
											this.$moment
										);
										// this.cObj.xAxis.categories = fData.categories

										if (fData && fData.series.length) {
											if (tempSeries.length > 0) {
												tempSeries = tempSeries.map((s) => {
													let newObj = fData.series.find(
														(f) => f.name === s.name
													);
													return {
														...s,
														data: [...s.data, ...newObj.data],
													};
												});
											} else {
												tempSeries = fData.series;
											}
											if (tempItems.length > 0) {
												tempItems.push(fData.items[0]);
											} else {
												tempItems = fData.items;
											}
											if (i === locID.length - 1) {
												this.cObj.series = tempSeries;
												if (this.defaultSort) {
													this.dataSort(this.defaultSort);
												}
												this.cObjTable = {
													items: tempItems,
													fields: fData.fields,
												};

												if (this.chartRep !== "scatter") {
													let min = 0,
														max = 0;
													tempSeries.forEach((d) => {
														let innerDataArr = d.data.map((dInner) => dInner.y);
														let innerMin = Math.min(...innerDataArr);
														let innerMax = Math.max(...innerDataArr);
														if (innerMin < min) {
															min = innerMin;
														}
														if (innerMax > max) {
															max = innerMax;
														}
													});

													this.cObj.yAxis.min = min > 0 ? 0 : min;
													this.cObj.yAxis.max = max;

													this.cObj.chart.events = {
														...this.cObj.chart.events,
														selection: function (e) {
															if (!e.xAxis) {
																if (
																	_this.derivedChart &&
																	!_this.reportChartData
																) {
																	let catLen =
																		this.options.series[0].data.length - 1;
																	setTimeout(() => {
																		this.xAxis[0].setExtremes(
																			catLen - 11,
																			catLen
																		);
																	}, 0);
																}
																_this.download = false;
															} else {
																_this.download = true;
															}
														},
													};
												}
												if (this.derivedChart && this.chartRep !== "scatter") {
													this.cObj.chart.events = {
														...this.cObj.chart.events,
														load: function (e) {
															if (
																this.options.series.length &&
																this.options.series[0].data.length &&
																!_this.reportChartData
															) {
																var catLen =
																	this.options.series[0].data.length - 1;
																if (catLen > 11) {
																	this.xAxis[0].setExtremes(
																		catLen - 11,
																		catLen
																	);
																}
															}
														},
													};
												}
												this.showLoader = false;
												this.$emit("hideCard", this.cardKey, true, {
													...this.cObj,
													cardKey: this.cardKey,
													chartComponent: this.chartComponent,
													chartSubCategory: this.chartSubCategory,
													chartSource: this.chartSource,
													cid: this.reportChartData
														? this.getCID(this.reportChartData, this.cID)
														: "",
												});
											}
										} else {
											if (i === locID.length - 1) {
												this.showLoader = false;
												this.$emit("hideCard", this.cardKey, true, {
													...this.cObj,
													cardKey: this.cardKey,
													chartComponent: this.chartComponent,
													chartSubCategory: this.chartSubCategory,
													chartSource: this.chartSource,
													cid: this.reportChartData
														? this.getCID(this.reportChartData, this.cID)
														: "",
												});
												this.cObj.series =
													tempSeries.length > 0 ? tempSeries : [];
											}
										}
									} else {
										if (this.debugging) {
											console.log(
												" response.data.rows.length is failed",
												this.$moment().format("MMMM Do YYYY, h:mm:ss a")
											);
											if (this.activityLogArr) {
												var obj_log = {
													name: "Promise Used",
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content: "response.data.rows.length is failed",
												};
												this.activityLogArr.push(obj_log);
												this.$emit("sendChartLog", this.activityLogArr);
											}
										}
										this.showLoader = false;
										this.cObj.series = [];
										this.$emit("hideCard", this.cardKey, false, {
											...this.cObj,
											cardKey: this.cardKey,
											chartComponent: this.chartComponent,
											chartSubCategory: this.chartSubCategory,
											chartSource: this.chartSource,
											cid: this.reportChartData
												? this.getCID(this.reportChartData, this.cID)
												: "",
										});
									}
								});
							});
						} else {
							if (this.debugging) {
								console.log(
									"this.globalData.de.length > 0 && locID.length > 0",
									this.$moment().format("MMMM Do YYYY, h:mm:ss a")
								);
								if (this.activityLogArr) {
									var obj_log = {
										name: "Before Promise to be used",
										time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
										content:
											"this.globalData.de.length > 0 && locID.length > 0 is failed",
									};
									this.activityLogArr.push(obj_log);
									this.$emit("sendChartLog", this.activityLogArr);
								}
							}
							this.showLoader = false;
							this.cObj.series = [];
							this.$emit("hideCard", this.cardKey, false, {
								...this.cObj,
								cardKey: this.cardKey,
								chartComponent: this.chartComponent,
								chartSubCategory: this.chartSubCategory,
								chartSource: this.chartSource,
								cid: this.reportChartData
									? this.getCID(this.reportChartData, this.cID)
									: "",
							});
						}
					} else {
						color = cData.chartOptions.color
							? cData.chartOptions.color
							: "#" + ((Math.random() * 0xffffff) << 0).toString(16);
						let scatterColor =
							cData[this.btnSelected1] && cData[this.btnSelected1].color
								? cData[this.btnSelected1].color
								: "#" + ((Math.random() * 0xffffff) << 0).toString(16);

						if (this.globalData.de.length > 0) {
							service
								.getIndicatorData(sSelectedDE, level, countryID, period)
								.then((response) => {
									if (response.data.rows.length) {
										let fData = {
											categories: [],
											series: [],
											drilldown: {},
										};
										if (this.dataFunction === "dxTotalOUData") {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.cObj,
												cypArray,
												this.chartComponent,
												this.total,
												color,
												this.derivedChart,
												this.$i18n.locale,
												this.$i18n.t("period"),
												this.periodType,
												this.$moment
											);
										}
										if (this.dataFunction === "dxTotalOUScatterData") {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.chartType,
												periodValue,
												this.$i18n.t("location"),
												scatterColor
											);
										}
										if (
											this.dataFunction === "dxTotalOUDataStockNew" ||
											this.dataFunction === "dxTotalOUDataAccessNew"
										) {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.derivedChart,
												this.chartType,
												this.isRegionalChart,
												this.periodType,
												this.$i18n.locale,
												this.$i18n.t("period"),
												this.$i18n.t("location"),
												this.$moment
											);
										}

										if (fData) {
											this.cObj.series = fData.series;
											if (this.defaultSort) {
												this.dataSort(this.defaultSort);
											}
											this.cObjTable = {
												items: fData.items,
												fields: fData.fields,
											};
											if (fData.exceptionTable && fData.exceptionTable.length) {
												this.exceptionTable = fData.exceptionTable;
											}
											if (this.chartRep !== "scatter") {
												let min = 0,
													max = 0;
												fData.series.forEach((d) => {
													let innerDataArr = d.data.map((dInner) => dInner.y);
													let innerMin = Math.min(...innerDataArr);
													let innerMax = Math.max(...innerDataArr);
													if (innerMin < min) {
														min = innerMin;
													}
													if (innerMax > max) {
														max = innerMax;
													}
												});

												this.cObj.yAxis.min = min > 0 ? 0 : min;
												this.cObj.yAxis.max = max;

												this.cObj.chart.events = {
													...this.cObj.chart.events,
													selection: function (e) {
														if (!e.xAxis) {
															if (
																_this.derivedChart &&
																!_this.reportChartData
															) {
																let catLen =
																	this.options.series[0].data.length - 1;
																setTimeout(() => {
																	this.xAxis[0].setExtremes(
																		catLen - 11,
																		catLen
																	);
																}, 0);
															}
															_this.download = false;
														} else {
															_this.download = true;
														}
													},
												};
											}
											if (this.derivedChart && this.chartRep !== "scatter") {
												this.cObj.chart.events = {
													...this.cObj.chart.events,
													load: function (e) {
														if (
															this.options.series.length &&
															this.options.series[0].data.length &&
															!_this.reportChartData
														) {
															var catLen =
																this.options.series[0].data.length - 1;
															this.xAxis[0].setExtremes(catLen - 11, catLen);
														}
													},
												};
											}
											this.$emit("hideCard", this.cardKey, true, {
												...this.cObj,
												cardKey: this.cardKey,
												chartComponent: this.chartComponent,
												chartSubCategory: this.chartSubCategory,
												chartSource: this.chartSource,
												cid: this.reportChartData
													? this.getCID(this.reportChartData, this.cID)
													: "",
											});
											// fData.fields.push('show_regions')

											this.showLoader = false;
										} else {
											this.showLoader = false;
											this.cObj.series = [];
											this.$emit("hideCard", this.cardKey, false, {
												...this.cObj,
												cardKey: this.cardKey,
												chartComponent: this.chartComponent,
												chartSubCategory: this.chartSubCategory,
												chartSource: this.chartSource,
												cid: this.reportChartData
													? this.getCID(this.reportChartData, this.cID)
													: "",
											});
										}
									} else {
										this.showLoader = false;
										this.cObj.series = [];
										this.$emit("hideCard", this.cardKey, false, {
											...this.cObj,
											cardKey: this.cardKey,
											chartComponent: this.chartComponent,
											chartSubCategory: this.chartSubCategory,
											chartSource: this.chartSource,
											cid: this.reportChartData
												? this.getCID(this.reportChartData, this.cID)
												: "",
										});
									}
								})
								.catch(() => {
									this.showLoader = false;
									this.$emit("hideCard", this.cardKey, false, {
										...this.cObj,
										cardKey: this.cardKey,
										chartComponent: this.chartComponent,
										chartSubCategory: this.chartSubCategory,
										chartSource: this.chartSource,
										cid: this.reportChartData
											? this.getCID(this.reportChartData, this.cID)
											: "",
									});
								});
						} else {
							this.cObj.series = [];
							this.showLoader = false;
							this.$emit("hideCard", this.cardKey, false, {
								...this.cObj,
								cardKey: this.cardKey,
								chartComponent: this.chartComponent,
								chartSubCategory: this.chartSubCategory,
								chartSource: this.chartSource,
								cid: this.reportChartData
									? this.getCID(this.reportChartData, this.cID)
									: "",
							});
						}
					}
				}
			} else {
				if (this.debugging) {
					console.log(
						"cData failed @" + this.$moment().format("MMMM Do YYYY, h:mm:ss a")
					);
					if (this.activityLogArr) {
						var obj_log = {
							name: "cData",
							time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
							content: "cData failed",
						};
						this.activityLogArr.push(obj_log);
						this.$emit("sendChartLog", this.activityLogArr);
					}
				}
				this.showLoader = false;
				this.$emit("hideCard", this.cardKey, false, {
					...this.cObj,
					cardKey: this.cardKey,
					chartComponent: this.chartComponent,
					chartSubCategory: this.chartSubCategory,
					chartSource: this.chartSource,
					cid: this.reportChartData
						? this.getCID(this.reportChartData, this.cID)
						: "",
				});
			}
			if (this.dataFunction === "dxTotalOUData") {
				this.cObj.plotOptions = {
					series: {
						label: {
							connectorAllowed: false,
						},
						marker: {
							enabled: false,
						},
					},
				};
			}
		},
		updatedBtnDataNew() {
			let catArray = [],
				aSelectedDE = [],
				obj = {};
			this.btnData.forEach((k, i) => {
				let s_name = k.indicator.static_name
					? Array.isArray(k.indicator.static_name)
						? k.indicator.static_name[0].trim().toLowerCase()
						: k.indicator.static_name.trim().toLowerCase()
					: "";
				if (
					k.indicator.name !== "Total CYP" &&
					k.indicator.name !== "Total Visits" &&
					k.indicator.name !== "Total User" &&
					k.indicator.name !== "Total Users" &&
					s_name !== this.exclude
				) {
					let allMethods = [];
					k.indicator.subIndicator.forEach((s, j) => {
						let s_name = s.static_name
							? Array.isArray(s.static_name)
								? s.static_name[0].trim().toLowerCase()
								: s.static_name.trim().toLowerCase()
							: "";
						let innerMethod = {
							name: s_name,
							dx: [],
						};
						if (
							this.dataFunction === "dxTotalOUData" ||
							this.dataFunction === "dxTotalOUDataStockNew" ||
							this.dataFunction === "dxTotalOUDataAccessNew" ||
							this.dataFunction === "dxTotalOUDataStockMatrix"
						) {
							if (s.de.length > 0) {
								innerMethod.dx.push(s.de.flat());
							}
						}
						if (innerMethod.dx.length) {
							allMethods.push(innerMethod);
						}
						if (this.cyp && s.de.length > 0) {
							let cyp = cypData.forEach((c) => {
								if (c.name === s.name[0]) {
									s.de.forEach((sd) => {
										cypArray.push({
											dx: sd,
											cyp: c.cyp,
										});
									});
								}
							});
						}
						s.de.forEach((sd) => {
							aSelectedDE.push(sd);
						});
					});

					if (
						this.dataFunction === "dxTotalOUData" ||
						this.dataFunction === "dxTotalOUDataStockNew" ||
						this.dataFunction === "dxTotalOUDataAccessNew" ||
						this.dataFunction === "dxTotalOUDataStockMatrix"
					) {
						if (allMethods.length) {
							catArray.push({
								name: k.indicator.name,
								methods: allMethods,
								color: k.indicator.color,
								visible: k.indicator.visible,
							});
						}
					}
				}
			});

			this.globalData = {
				cat: catArray,
				de: aSelectedDE,
			};
		},
		updatedBtnData() {
			let catArray = [],
				aSelectedDE = [],
				obj = {};
			this.btnData.forEach((k, i) => {
				let s_name = k.indicator.static_name
					? Array.isArray(k.indicator.static_name)
						? k.indicator.static_name[0].trim().toLowerCase()
						: k.indicator.static_name.trim().toLowerCase()
					: "";
				if (
					k.indicator.name !== "Total CYP" &&
					k.indicator.name !== "Total Visits" &&
					k.indicator.name !== "Total User" &&
					k.indicator.name !== "Total Users" &&
					s_name !== this.exclude
				) {
					let allDE = [];
					k.indicator.subIndicator.forEach((s, j) => {
						if (
							this.dataFunction === "dxTotalOUData" ||
							this.dataFunction === "dxTotalOUScatterData" ||
							this.dataFunction === "dxTotalOUDataStockNew" ||
							this.dataFunction === "dxTotalOUDataAccessNew" ||
							this.dataFunction === "dxTotalOUDataStockMatrix"
						) {
							if (s.de.length > 0) {
								allDE.push(s.de.flat());
							}
						}

						if (this.cyp && s.de.length > 0) {
							let cyp = cypData.forEach((c) => {
								if (c.name === s.name[0]) {
									s.de.forEach((sd) => {
										cypArray.push({
											dx: sd,
											cyp: c.cyp,
										});
									});
								}
							});
						}
						s.de.forEach((sd) => {
							aSelectedDE.push(sd);
						});
					});

					if (
						this.dataFunction === "dxTotalOUData" ||
						this.dataFunction === "dxTotalOUScatterData" ||
						this.dataFunction === "dxTotalOUDataStockNew" ||
						this.dataFunction === "dxTotalOUDataAccessNew" ||
						this.dataFunction === "dxTotalOUDataStockMatrix"
					) {
						catArray.push({
							name: k.indicator.name,
							dx: allDE,
							color: k.indicator.color,
							visible: k.indicator.visible,
						});
					}
				}
			});

			this.globalData = {
				cat: catArray,
				de: aSelectedDE,
			};
		},
		getButtonData() {
			this.btnData = this.cdata[this.btnSelected1].chartData;
		},
		/**
		 * This fnc is to export charts in different format.
		 */
		exportChart(type, chartRef) {
			let chart = this.$refs[chartRef].chart;
			let max = chart.options.xAxis[0].max,
				yMin = chart.yAxis[0].min,
				yMax = chart.yAxis[0].max;
			if (!this.drilldown) {
				chart.options.xAxis[0].max = null;
			} else {
				chart.yAxis[0].setExtremes(yMin, yMax);
			}
			chartExport(type, chart);
			setTimeout(() => {
				if (!this.drilldown) {
					chart.options.xAxis[0].max = max;
				}
			}, 100);
		},

		/**
		 * This fnc is to massage received from dataSort function.
		 * Usage: `massagedData()`
		 * @param 'obj' sorted object
		 * @return {Object} sorted chart object
		 */
		massagedData(obj) {
			this.updatedChartData = obj.chartData[0];
			for (let x in obj.sorted) {
				let tempArray = [];
				Object.keys(obj.sorted[x]).forEach((res, j) => {
					this.updatedChartData.series[x].data[j] = obj.sorted[x][res];
					tempArray.push(res);
				});
				this.updatedChartData.xAxis.categories = tempArray;
			}
		},

		/**
		 * This fnc is to sort data on the basis of passed option.
		 * Usage: `dataSort()`
		 * @param 'sort' sort type
		 * @return {Object} sorted object
		 */
		dataSort(sort) {
			this.cObj.series.map((d) => ({
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
						valueA = a.name;
						valueB = b.name;
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
	},

	created() {
		this.getIndicators();
	},
};
</script>
<style scoped lang="scss">
.list-group .list-group-item a {
	cursor: pointer;
}

.chartType {
	padding: 5px;

	&.active {
		background-color: #000;
		color: #fff;
	}
}
</style>
