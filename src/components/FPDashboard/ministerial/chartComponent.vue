<template>
	<div>
		<fullscreen v-model="cObjFull" ref="fullscreen" class="fullContainer">
			<div
				class="card position-relative fullContent"
				v-if="cObj.series.length > 0"
			>
				<loader class="cardLoader" v-if="showLoader" />
				<div class="card-header px-2 py-1 text-decoration-none">
					<div class="row no-gutters">
						<div
							class="col-lg-9 col-md-9 p-t-4px"
							:class="{ 'col-lg-12 col-md-12': cObjFull }"
						>
							<div class="cardTitleSection text-wrap fs-19-1920">
								<i
									class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
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
								:cID="cID"
								chartKey="cObj"
								:sorting="sorting"
								@dataSort="dataSort"
								:drillDown="drillDown"
								@showTable="showTable"
								:trendTable="cObjTable"
								:defaultSort="defaultSort"
								@exportChart="exportChart"
								@toggleFullscreen="toggleFullscreen"
								v-if="cObj.series.length && !isHideOption"
							/>
						</div>
					</div>
				</div>
				<div class="card-body pb-0" v-if="cObj.series[0].data.length > 0">
					<div
						class="row pb-2 mx-0"
						:class="{ hidden: viewType === 'table' }"
						v-if="cObj.series.length > 0 && !cObjFull"
					>
						<div class="col-lg-12 col-md-12 p-0">
							<ChartFilters
								:pLength="pLength"
								:plotType="plotType"
								chartRef="barCharts"
								:plotOptions="plotOptions"
								:periodOptions="periodOptions"
								@changePeriod="changePeriod"
								@changePlotType="changePlotType"
							/>
						</div>
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
							class="chartHeight text-center mb-2"
							style="height: 400px !important"
						>
							<b-table
								head-variant="light"
								sticky-header
								class="mb-0"
								v-if="cObj.series.length"
								:bordered="true"
								hover
								:items="cObjTable.items"
								:fields="cObjTable.fields"
								ref="nationalReportingTrend"
								style="max-height: 400px !important"
								:sort-compare="sortDate"
							>
								<template v-slot:cell(show_regions)="row">
									<b-form-checkbox
										v-model="row.detailsShowing"
										@change="row.toggleDetails"
									>
									</b-form-checkbox>
								</template>
								<template v-slot:row-details="row">
									<b-card>
										<b-table
											head-variant="light"
											hover
											:items="row.item.regions"
										></b-table>
									</b-card>
								</template>
							</b-table>
							<div class="my-4 text-center" v-else>
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</template>
				</div>
				<div class="card-body" v-if="cObj.series[0].data.length === 0">
					{{ $t("no_data_to_display") }}
				</div>
				<div class="card-footer text-right">
					<p class="m-0">
						{{ $t("source") }}:
						<span>{{ chartSource }}</span>
					</p>
				</div>
			</div>
			<PlaceholderChart v-else />
		</fullscreen>
	</div>
</template>
<script>
import MD from "./cComponent";
import service from "@/service";
import chartConfig from "./chartConfig.js";
import FullScreenMixin from "@/helpers/FullScreenMixin";
import PlaceholderChart from "@/components/Common/PlaceholderChart";
import { getDateRange, chartExport } from "@/components/Common/commonFunctions";

export default {
	props: [
		"chartCategory",
		"chartSubCategory",
		"chartComponent",
		"sendPeriod",
		"sendLocation",
		"ministerialData",
		"dataFunction",
		"isHideOption",
		"globalFactorsData",
		"cyp",
		"periodLen",
		"pOptions",
		"applicationFinalYear",
		"sorting",
		"cardKey",
		"noDerivedSettings",
		"total",
		"exclude",
		"plotOptions",
		"derivedChart",
		"defaultSort",
		"layoutChanged",
		"chartType",
		"dataFunctionNonCalculated",
		"periodType",
		"dashboardchartholder",
		"dashboardchartholder1",
		"methodCYP",
		"reportChartData",
	],
	components: {
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
		ChartFilters: () =>
			import(
				/* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
			),
		PlaceholderChart,
	},
	mixins: [FullScreenMixin],
	data() {
		return {
			activityLogArr: [],
			cObj: JSON.parse(JSON.stringify(chartConfig)),
			chartSource: null,
			cObjTable: {
				items: [],
				fields: [],
			},
			showLoader: true,
			viewType: "chart",
			cID: "",
			chartInfo: "",
			plotType: "",
			drillDown: false,
			download: false,
			drilldownYAxisTitle: "",
			defaultYAxisTitle: "",
			yMax: null,
			pLength: this.periodLen,
			periodOptions: this.pOptions,
			debugging: false,
			cObjFull: false,
		};
	},
	watch: {
		pOptions(newVal) {
			if (newVal) {
				this.periodOptions = newVal;
			}
		},
		cObj: {
			// watch it
			handler(newVal) {
				this.updateYAxis(newVal);
			},
			deep: true,
		},
		layoutChanged() {
			this.$nextTick(() => {
				this.$refs.barCharts.chart.reflow();
			});
		},
		sendPeriod(newValue, oldValue) {
			if (newValue && newValue !== oldValue) {
				this.showLoader = true;
				this.pLength = this.periodLen;
				this.cObj.series = [];
				this.cObj.drilldown = {
					series: [],
				};
				this.getIndicators();
			}
		},
		sendLocation(newValue, oldValue) {
			if (newValue && newValue[2] !== oldValue[2]) {
				this.showLoader = true;
				this.cObj.series = [];
				this.cObj.drilldown = {
					series: [],
				};
				this.getIndicators();
			}
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
		resetDrillDown() {
			this.drillDown = false;
		},
		updateYAxis(newVal) {
			let min = 0,
				max = 0;
			if (
				newVal.plotOptions &&
				newVal.plotOptions.series &&
				newVal.plotOptions.series.stacking === "normal"
			) {
				let dataArr = [];
				newVal.series.forEach((d) => {
					if (d.visible) {
						let innerDataArr = d.data.map((dInner) => dInner.y);
						dataArr.push(innerDataArr);
					}
				});
				const n = dataArr.reduce((max, xs) => Math.max(max, xs.length), 0);
				const result = Array.from({ length: n });
				let finalDataArr = result.map((_, i) =>
					dataArr.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
				);
				let innerMin = Math.min(...finalDataArr);
				let innerMax = Math.max(...finalDataArr);
				if (innerMin < min) {
					min = innerMin;
				}
				if (innerMax > max) {
					max = innerMax;
				}
				newVal.yAxis.min = min > 0 ? 0 : min;
				newVal.yAxis.max = max;
				this.yMax = max;

				let len = Math.round(max).toString().length;

				let multiplier = "1";

				for (let i = 0; i < len - 1; i++) {
					multiplier += "0";
				}
				newVal.yAxis.tickInterval =
					(Math.round(max / multiplier) * multiplier) /
					Math.round(max / multiplier);
				newVal.yAxis.step = Math.round(max / multiplier);
			} else {
				if (
					newVal.chart.type !== "pie" ||
					newVal.chart.type !== "packedbubble"
				) {
					newVal.series.forEach((d) => {
						if (d.visible) {
							let innerDataArr = d.data.map((dInner) => dInner.y);
							let innerMin = Math.min(...innerDataArr);
							let innerMax = Math.max(...innerDataArr);
							if (innerMin < min) {
								min = innerMin;
							}
							if (innerMax > max) {
								max = innerMax;
							}
						}
					});
					newVal.yAxis.min = min > 0 ? 0 : min;
					newVal.yAxis.max = max;
					this.yMax = max;
				}
			}
		},
		sortDate(a, b, key) {
			if (key !== "Period") {
				// `key` is not the field that is a date.
				// Let b-table handle the sorting for other columns
				// returning null or false will tell b-table to fall back to it's
				// internal sort compare routine for fields keys other than `myDateField`
				return null; // or false
			}
			let aDate = this.$moment(a[key], "MMM YYYY");
			let bDate = this.$moment(b[key], "MMM YYYY");
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
				this.cObj.chart.type = "column";
				this.cObj.plotOptions.series.stacking = "normal";
			} else {
				this.cObj.plotOptions.series.stacking = "";
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
		changeLocation(locationID) {
			this.drillDown = false;
			this.$emit("drilldownLocation", locationID, this.sendLocation[1]);
		},
		/**
		 * This fnc is to get indicators api value from DHIS for selected options.
		 * Usage: `getIndicators()`
		 * @param 'minres' which is the Ministerial module configuration setup stored in datastore
		 * @param 'appres' which is the Application module configuration setup stored in datastore
		 * @return {Object}
		 */
		async getIndicators(minres = this.ministerialData) {
			let moduleConfig = minres.data;
			let cData = {};
			let _this = this;
			if (moduleConfig[this.chartSubCategory] != undefined) {
				cData = moduleConfig[this.chartSubCategory][this.chartComponent];
			} else {
				cData = undefined;
			}

			let showInSummary = false,
				exclude = "";
			this.ministerialData.data.summary.forEach((s) => {
				if (
					s.selected.chartComponent === this.chartComponent &&
					s.selected.chartSubCategory === this.chartSubCategory
				) {
					showInSummary = true;
				}
				if (s.selected.chartSubCategory === this.chartSubCategory) {
					exclude = this.exclude
						? s.selected.subComponent.toLowerCase().includes("(on time)")
							? "reporting rate (actual)"
							: "reporting rate (on time)"
						: "";
				}
			});
			if (
				!showInSummary &&
				!this.dashboardchartholder &&
				!showInSummary &&
				!this.dashboardchartholder1
			) {
				this.showLoader = false;
				this.$emit("hideCard", this.cardKey, false, {
					...this.cObj,
					cardKey: this.cardKey,
					showInSummary: showInSummary,
					chartComponent: this.chartComponent,
					chartSubCategory: this.chartSubCategory,
					series: [],
					isDerivedChart: this.derivedChart,
				});
				return;
			}

			let items = [];
			let key =
				this.chartSubCategory === "coverage" && this.chartType === "period"
					? this.$i18n.t("period")
					: this.$i18n.t("location");
			if (this.derivedChart) {
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

				this.cObj.chart.events = {
					drillup: function (e) {
						_this.drillDown = false;
						if (_this.defaultYAxisTitle) {
							this.yAxis[0].setTitle({ text: _this.defaultYAxisTitle });
						}
						this.yAxis[0].options.min = 0;
						this.yAxis[0].options.max = _this.yMax;
						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11 && !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1;
						this.options.chart.zoomType = "x";
						delete e.target.options.plotOptions.point;
					},
					drilldown: function (e) {
						_this.drillDown = true;
						if (_this.drilldownYAxisTitle) {
							this.yAxis[0].setTitle({ text: _this.drilldownYAxisTitle });
						}
						this.yAxis[0].options.min = null;
						this.yAxis[0].options.max = null;
						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11 && !_this.reportChartData
								? 11
								: e.seriesOptions.data.length - 1;

						this.options.chart.zoomType = "";
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
							dData.cid !== this.reportChartData.cid.split("/")[1])
					) {
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							cardKey: this.cardKey,
							showInSummary: showInSummary,
							chartComponent: this.chartComponent,
							chartSubCategory: this.chartSubCategory,
							series: [],
							isDerivedChart: this.derivedChart,
							hideFromReport: true,
							isReportChart: this.reportChartData
								? dData.cid === this.reportChartData.cid.split("/")[1]
								: false,
						});
						return;
					}
					this.chartInfo = dData.chartInfo ? dData.chartInfo : "";
					this.cObj.chart.type =
						this.chartSubCategory === "coverage" ? "column" : "line";

					this.cObj.title.title = dData.chartName
						? dData.chartName
						: cData.chartOptions.title.title
						? cData.chartOptions.title.title
						: this.$i18n.t("chartHeading");
					this.cObj.title.text = dData.title.visible ? dData.title.text : "";

					this.cObj.subtitle.text = dData.subTitle.visible
						? dData.subTitle.text
						: "";
					this.cObj.xAxis.title.text = dData.xAxis.visible
						? dData.xAxis.text
						: "";
					this.cObj.yAxis.title.text = dData.yAxis.visible
						? dData.yAxis.text
						: "";
					this.defaultYAxisTitle = dData.yAxis.visible ? dData.yAxis.text : "";
					this.drilldownYAxisTitle = dData.yAxis.visible
						? dData.yAxis.text
							? this.$i18n.t("changeIn") + " " + dData.yAxis.text
							: ""
						: "";
					this.cObj.yAxis.min = 0;
					if (!this.reportChartData) {
						this.cObj.xAxis.max = 11;
					}

					this.chartSource = cData.chartOptions.chartDataSource.text
						? cData.chartOptions.chartDataSource.text
						: "DHIS2";

					this.cObj.plotOptions = {
						series: {
							...this.cObj.plotOptions.series,
							events: {
								legendItemClick: function () {
									if (!_this.drillDown) {
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
									}
								},
							},
							showInLegend: true,
							cursor: "pointer",
						},
					};
					if (this.chartSubCategory === "coverage") {
						this.plotType = cData.chartOptions.chart.type.toLowerCase();
						this.cObj.plotOptions = {
							series: {
								...this.cObj.plotOptions.series,
								stacking: "normal",
							},
						};
					}
				} else {
					// this.cObj.chart.type = cData.chartOptions.chart.type.toLowerCase()
					this.cID = cData.cid;
					if (
						cData.disableChart ||
						(this.reportChartData &&
							cData.cid !== this.reportChartData.cid.split("/")[1])
					) {
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							cardKey: this.cardKey,
							showInSummary: showInSummary,
							chartComponent: this.chartComponent,
							chartSubCategory: this.chartSubCategory,
							series: [],
							isDerivedChart: this.derivedChart,
							hideFromReport: true,
							isReportChart: this.reportChartData
								? cData.cid === this.reportChartData.cid.split("/")[1]
								: false,
						});
						return;
					}
					if (!this.derivedChart) {
						if (cData.chartOptions.chart.type.toLowerCase() === "stack") {
							this.cObj.chart.type = "column";
						} else {
							this.cObj.chart.type =
								cData.chartOptions.chart.type.toLowerCase();
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
						: this.$i18n.t("chartHeading");
					this.cObj.title.text = cData.chartOptions.title.visible
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

					this.cObj.plotOptions = {
						series: {
							...this.cObj.plotOptions.series,
							stacking:
								cData.chartOptions.chart.type.toLowerCase() === "stack"
									? "normal"
									: "",
							dataLabels: {
								enabled: cData.dataLabels.enabled,
							},
							showInLegend: true,
							events: {
								legendItemClick: function () {
									if (!_this.drillDown) {
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
									}
								},
							},
						},
					};
				}

				let sSelectedDE = "",
					aSelectedDE = [],
					catArray = [],
					cypArray = [],
					cypData = [],
					color = "",
					totalObj = {};

				if (this.cyp) {
					this.globalFactorsData.chartData.forEach((c) =>
						c.indicator.subIndicator.forEach((s) => {
							let n = Array.isArray(s.name) ? s.name[0] : s.name;
							cypData.push({
								name: n,
								cyp: s.cyp,
							});
						})
					);
				}

				let facilityLevel = 0;

				if (
					typeof cData.indicatorsType !== undefined &&
					cData.indicatorsType === "non_calculated"
				) {
					await service.getOrganisationUnitLevels().then((response) => {
						let facility = response.data.find((o) =>
							o.name.toLowerCase().includes("facility")
						);
						if (facility) {
							facilityLevel = facility.level;
						} else {
							let facilityLevels = response.data.map(
								(o) => o.level
							);
							facilityLevel = Math.max(...facilityLevels);
						}
					});
					cData.chartData.forEach((k) => {
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
							s_name !== exclude
						) {
							let allMethods = [];
							k.indicator.subIndicator.forEach((s) => {
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
									this.dataFunction === "dxData" ||
									this.dataFunction === "dxTotalOUData"
								) {
									if (s.de.length > 0) {
										innerMethod.dx.push(s.de.flat());
									}
								}
								if (innerMethod.dx.length) {
									allMethods.push(innerMethod);
								}
								s.de.forEach((sd) => {
									aSelectedDE.push(sd);
								});
							});

							if (
								this.dataFunction === "dxData" ||
								this.dataFunction === "dxTotalOUData"
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
				} else {
					cData.chartData.forEach((k) => {
						let s_name = k.indicator.static_name
							? Array.isArray(k.indicator.static_name)
								? k.indicator.static_name[0].trim().toLowerCase()
								: k.indicator.static_name.trim().toLowerCase()
							: "";
						if (
							k.indicator.static_name !== "Total CYP" &&
							k.indicator.static_name !== "Total Visits" &&
							k.indicator.static_name !== "Total User" &&
							k.indicator.static_name !== "Total Users" &&
							s_name !== exclude
						) {
							let allDE = [];
							k.indicator.subIndicator.forEach((s) => {
								if (
									this.dataFunction === "dxData" ||
									this.dataFunction === "dxTotalOUData" ||
									this.dataFunction === "dxPEData"
								) {
									if (s.de.length > 0) {
										allDE.push(s.de.flat());
									}
								}

								if (this.cyp && s.de.length > 0) {
									cypData.forEach((c) => {
										let n = Array.isArray(s.static_name)
											? s.static_name[0]
											: s.static_name;
										if (c.name === n) {
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
								this.dataFunction === "dxData" ||
								this.dataFunction === "dxTotalOUData" ||
								this.dataFunction === "dxPEData"
							) {
								catArray.push({
									name: k.indicator.name,
									dx: allDE,
									color: k.indicator.color,
									visible: k.indicator.visible,
								});
							}
						}
						if (
							(k.indicator.static_name === "Total CYP" ||
								k.indicator.static_name === "Total Visits" ||
								k.indicator.static_name === "Total User" ||
								k.indicator.static_name === "Total Users") &&
							this.total
						) {
							totalObj = {
								name: k.indicator.name,
								color: k.indicator.color,
								visible: k.indicator.visible,
							};
						}
						if (
							k.indicator.static_name === "Total CYP" ||
							k.indicator.static_name === "Total Visits" ||
							k.indicator.static_name === "Total User" ||
							k.indicator.static_name === "Total Users"
						) {
							color = k.indicator.color;
						}
					});
				}

				catArray =
					typeof cData.indicatorsType !== undefined &&
					cData.indicatorsType === "non_calculated"
						? catArray
								.filter((m) => m.methods.length)
								.map((c) => ({
									...c,
									methods: c.methods.map((m) => ({
										...m,
										dx: m.dx.flat(),
									})),
								}))
						: catArray
								.filter((m) => m.dx.length)
								.map((c) => ({
									...c,
									dx: c.dx.flat(),
								}));

				sSelectedDE = aSelectedDE.join(";");

				let level =
					typeof cData.indicatorsType !== undefined &&
					cData.indicatorsType === "non_calculated"
						? [this.sendLocation[0], facilityLevel]
						: [this.sendLocation[0], this.sendLocation[1]];
				let period = getDateRange({
					sendPeriod: this.sendPeriod,
					periodType: this.periodType,
					periodLength:
						this.pLength > 1 && this.reportChartData ? 24 : this.pLength,
					applicationFinalYear: this.applicationFinalYear,
				});
				period = period.reverse().join(";");
				// let countryID = appres.data.defaultLocationID
				let countryID = [this.sendLocation[2]];

				if (
					this.chartType === "region" &&
					typeof cData.indicatorsType !== undefined &&
					cData.indicatorsType === "non_calculated"
				) {
					let flatLocations = await service.getChildOrganisation(
							this.sendLocation[2]
						),
						locID = [];
					flatLocations.data.children.forEach((l) => {
						locID.push(l.id);
					});
					level = [this.sendLocation[1], facilityLevel];
					if (aSelectedDE.length > 0) {
						let tempSeries = [],
							tempItems = [],
							promises = [];
						locID.forEach((locationID) => {
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
									fData = MD[`${this.dataFunctionNonCalculated}NonCalculated`](
										response,
										[locID[i]],
										catArray,
										items,
										fields,
										this.chartType,
										this.$i18n.t("location"),
										this.$i18n.t("period"),
										this.periodType
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
											this.cObjTable = {
												items: tempItems.reverse(),
												fields: fData.fields,
											};
											if (this.defaultSort) {
												this.dataSort(this.defaultSort);
											}
											// if (!this.derivedChart) {
											this.cObj.xAxis.min = 0;
											let maxLen = 0;
											tempSeries.forEach((t) => {
												if (maxLen < t.data.length) {
													maxLen = t.data.length;
												}
											});
											this.cObj.xAxis.max =
												maxLen > 11 && !_this.reportChartData ? 11 : maxLen - 1;
											// }
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
											this.showLoader = false;

											this.$emit("hideCard", this.cardKey, true, {
												...this.cObj,
												cardKey: this.cardKey,
												showInSummary: showInSummary,
												chartComponent: this.chartComponent,
												chartSubCategory: this.chartSubCategory,
												chartSource: this.chartSource,
												isDerivedChart: this.derivedChart,
											});
										}
									} else {
										if (i === locID.length - 1) {
											this.showLoader = false;
											this.cObj.series =
												tempSeries.length > 0 ? tempSeries : [];
										}
									}
								} else {
									this.showLoader = false;
									this.cObj.series = [];
								}
							});
						});
					} else {
						//config mapping not available
						this.showLoader = false;
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							cardKey: this.cardKey,
							showInSummary: showInSummary,
							chartComponent: this.chartComponent,
							chartSubCategory: this.chartSubCategory,
							series: [],
							isDerivedChart: this.derivedChart,
						});
					}
				} else {
					if (aSelectedDE.length > 0) {
						if (this.debugging) {
							console.log(
								this.cObj.title.title +
									" - chartComponent - Calling API getIndicatorData() with params selected DE = '" +
									sSelectedDE +
									"', Level = '" +
									level +
									"', Country ID = '" +
									countryID +
									"', Period = '" +
									period +
									"' @",
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
							);
							if (this.activityLogArr) {
								var obj = {
									name: this.cObj.title.title,
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content:
										"chartComponent - Calling API getIndicatorData() with params selected DE = '" +
										sSelectedDE +
										"', Level = '" +
										level +
										"', Country ID = '" +
										countryID +
										"', Period = '" +
										period +
										"' ",
								};
								this.activityLogArr.push(obj);
							}
						}

						service
							.getIndicatorData(sSelectedDE, level, countryID, period)
							.then((response) => {
								if (this.debugging) {
									console.log(
										this.cObj.title.title +
											" - chartComponent - getIndicatorData() API response received @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj = {
											name: this.cObj.title.title,
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content:
												"chartComponent - getIndicatorData() API response received ",
										};
										this.activityLogArr.push(obj);
									}
								}
								if (response.data.rows.length) {
									let fData = {
										categories: [],
										series: [],
										drilldown: {},
									};
									if (
										typeof cData.indicatorsType !== undefined &&
										cData.indicatorsType === "non_calculated"
									) {
										fData = MD[`${this.dataFunction}NonCalculated`](
											response,
											countryID,
											catArray,
											items,
											fields,
											this.chartType,
											this.$i18n.t("location"),
											this.$i18n.t("period"),
											this.periodType
										);
									} else {
										if (this.dataFunction === "dxData") {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.cObj,
												this.derivedChart,
												this.$i18n.t("period"),
												this.periodType
											);
										} else if (this.dataFunction === "dxTotalOUData") {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.cObj,
												cypArray,
												this.total,
												totalObj,
												this.$i18n.t("location"),
												this.methodCYP
											);
										} else if (this.dataFunction === "dxPEData") {
											fData = MD[this.dataFunction](
												response,
												countryID,
												catArray,
												items,
												fields,
												this.cObj,
												cypArray,
												this.$i18n.t("period"),
												this.periodType
											);
										} else {
											fData = MD[this.dataFunction](
												response,
												countryID,
												items,
												fields,
												cypArray,
												color,
												this.cObj,
												this.derivedChart,
												this.$i18n.t("period"),
												this.periodType
											);
										}
									}

									if (this.chartSubCategory === "reportingRate") {
										this.cObj.yAxis.plotLines =
											this.globalFactorsData.plotLines;
									}

									if (this.debugging) {
										if (this.activityLogArr) {
											var obj = {
												name: "fData",
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "Before fData",
											};
											this.activityLogArr.push(obj);
										}
									}
									// this.cObj.xAxis.categories = fData.categories
									if (fData) {
										this.cObj.series = fData.series;
										if (this.defaultSort) {
											this.dataSort(this.defaultSort);
										}
										if (this.derivedChart) {
											this.cObj.chart.events = {
												...this.cObj.chart.events,
												load: function () {
													if (
														this.options.series.length &&
														this.options.series[0].data.length &&
														!_this.reportChartData
													) {
														let catLen = this.options.series[0].data.length - 1;
														if (catLen > 11) {
															this.xAxis[0].setExtremes(catLen - 11, catLen);
														}
													}
												},
											};
										}

										this.cObj.chart.events = {
											...this.cObj.chart.events,
											selection: function (e) {
												if (!e.xAxis) {
													if (_this.derivedChart && !_this.reportChartData) {
														let catLen = this.options.series[0].data.length - 1;
														if (catLen > 11) {
															setTimeout(() => {
																this.xAxis[0].setExtremes(catLen - 11, catLen);
															}, 0);
														}
													}
													_this.download = false;
												} else {
													_this.download = true;
												}
											},
										};
										// if (!this.derivedChart) {
										this.cObj.xAxis.min = 0;
										if (fData.series.length > 0) {
											this.cObj.xAxis.max =
												fData.series[0].data.length > 11
													? !_this.reportChartData
														? 11
														: fData.series[0].data.length - 1
													: fData.series[0].data.length - 1;
										}
										// }

										if (this.reportChartData) {
											this.cObj.yAxis.max = null;
										}

										if (fData.drilldown) {
											this.cObj.drilldown = fData.drilldown;
										}
										// fData.fields.push('show_regions')
										this.cObjTable = {
											items: fData.items.reverse(),
											fields: fData.fields,
										};
										this.showLoader = false;
										if (fData.series.length) {
											let showInSummary = false;
											this.ministerialData.data.summary.forEach((s) => {
												if (
													s.selected.chartComponent === this.chartComponent &&
													s.selected.chartSubCategory === this.chartSubCategory
												) {
													showInSummary = true;
												}
											});
											this.$emit("hideCard", this.cardKey, true, {
												...this.cObj,
												cardKey: this.cardKey,
												showInSummary: showInSummary,
												chartComponent: this.chartComponent,
												chartSubCategory: this.chartSubCategory,
												chartSource: this.chartSource,
												isDerivedChart: this.derivedChart,
											});
										} else {
											if (this.debugging) {
												if (this.activityLogArr) {
													var obj = {
														name: "derivedChart",
														time: this.$moment().format(
															"MMMM Do YYYY, h:mm:ss a"
														),
														content: "Series is empty",
													};
													this.activityLogArr.push(obj);
												}
											}
											this.$emit("hideCard", this.cardKey, false, {
												...this.cObj,
												cardKey: this.cardKey,
												showInSummary: showInSummary,
												chartComponent: this.chartComponent,
												chartSubCategory: this.chartSubCategory,
												series: [],
												isDerivedChart: this.derivedChart,
											});
										}
									} else {
										if (this.debugging) {
											if (this.activityLogArr) {
												var obj = {
													name: "derivedChart",
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content: "fData not available",
												};
												this.activityLogArr.push(obj);
											}
										}
										this.showLoader = false;
										this.$emit("hideCard", this.cardKey, false, {
											...this.cObj,
											cardKey: this.cardKey,
											showInSummary: showInSummary,
											chartComponent: this.chartComponent,
											chartSubCategory: this.chartSubCategory,
											series: [],
											isDerivedChart: this.derivedChart,
										});
									}
								} else {
									if (this.debugging) {
										if (this.activityLogArr) {
											var obj = {
												name: this.cObj.title.title,
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "Data not available",
											};
											this.activityLogArr.push(obj);
										}
									}
									this.showLoader = false;
									this.$emit("hideCard", this.cardKey, false, {
										...this.cObj,
										cardKey: this.cardKey,
										showInSummary: showInSummary,
										chartComponent: this.chartComponent,
										chartSubCategory: this.chartSubCategory,
										series: [],
										isDerivedChart: this.derivedChart,
									});
								}
								if (this.debugging && this.activityLogArr) {
									this.$emit("sendLog", this.activityLogArr);
								}
							})
							.catch((e) => {
								if (this.debugging) {
									console.log(
										this.cObj.title.title +
											" - chartComponent - getIndicatorData() API response failed @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj = {
											name: this.cObj.title.title,
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content:
												"chartComponent - getIndicatorData() API response failed" +
												e.stack,
										};
										this.activityLogArr.push(obj);
									}
									this.$emit("sendLog", this.activityLogArr);
								}

								this.showLoader = false;
								this.$emit("hideCard", this.cardKey, false, {
									...this.cObj,
									cardKey: this.cardKey,
									showInSummary: showInSummary,
									chartComponent: this.chartComponent,
									chartSubCategory: this.chartSubCategory,
									series: [],
									isDerivedChart: this.derivedChart,
								});
							});
					} else {
						if (this.debugging) {
							console.log(
								this.cObj.title.title +
									" - chartComponent - getIndicatorData() API response failed @",
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
							);
							if (this.activityLogArr) {
								var obj = {
									name: this.cObj.title.title,
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content: "indicator mapping not available",
								};
								this.activityLogArr.push(obj);
							}
							this.$emit("sendLog", this.activityLogArr);
						}
						this.showLoader = false;
						this.$emit("hideCard", this.cardKey, false, {
							...this.cObj,
							cardKey: this.cardKey,
							showInSummary: showInSummary,
							chartComponent: this.chartComponent,
							chartSubCategory: this.chartSubCategory,
							series: [],
							isDerivedChart: this.derivedChart,
						});
					}
					// if(this.debugging && this.activityLogArr)
					// {
					//   this.$emit('sendLog', this.activityLogArr)
					// }
				}
			} else {
				if (this.debugging) {
					console.log(
						this.cObj.title.title +
							" - chartComponent - getIndicatorData() API response failed @",
						this.$moment().format("MMMM Do YYYY, h:mm:ss a")
					);
					if (this.activityLogArr) {
						var obj = {
							name: this.cObj.title.title,
							time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
							content: "Data mapping not available",
						};
						this.activityLogArr.push(obj);
					}
					this.$emit("sendLog", this.activityLogArr);
				}
				this.showLoader = false;
				this.$emit("hideCard", this.cardKey, false, {
					...this.cObj,
					cardKey: this.cardKey,
					showInSummary: showInSummary,
					chartComponent: this.chartComponent,
					chartSubCategory: this.chartSubCategory,
					series: [],
					isDerivedChart: this.derivedChart,
				});
			}
		},

		/**
		 * This fnc is to export charts in different format.
		 * Usage: `getIndicators()`
		 * @param 'minres' which is the Ministerial module configuration setup stored in datastore
		 * @param 'appres' which is the Application module configuration setup stored in datastore
		 * @return {Object}
		 */
		exportChart(type) {
			let chart = this.$refs.barCharts.chart;
			let max = chart.options.xAxis[0].max,
				yMin = chart.yAxis[0].min,
				yMax = chart.yAxis[0].max,
				catLen = chart.options.series[0].data.length - 1;
			if (!this.drillDown) {
				chart.options.xAxis[0].max = null;
				chart.options.xAxis[0].min = 0;
				if (this.derivedChart) {
					chart.xAxis[0].setExtremes(0, catLen);
				}
			} else {
				chart.yAxis[0].setExtremes(yMin, yMax);
			}

			chartExport(type, chart);
			setTimeout(() => {
				if (!this.drillDown) {
					chart.options.xAxis[0].max = max;
					if (this.derivedChart) {
						chart.xAxis[0].setExtremes(catLen - 11, catLen);
					}
				}
			}, 100);
		},
		showTable(val) {
			this.viewType = val;
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
		this.debugging = this.$store.getters.getApplicationModule(true).debugging
			? this.$store.getters.getApplicationModule(true).debugging
			: false;
		this.getIndicators();
	},
};
</script>
<style scoped lang="scss">
.list-group .list-group-item a {
	cursor: pointer;
}
</style>
