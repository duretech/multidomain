<template>
	<b-overlay :show="showLoader" rounded="sm" :opacity="0.3">
		<div class="position-relative">
			<!-- <loader class="cardLoader" v-if="showLoader" /> -->
			<div class="card-header px-1 py-0" style="height: 55px">
				<div class="row no-gutters">
					<div
						class="col-lg-12 col-md-12 p-t-4px"
						style="overflow: hidden; text-overflow: ellipsis"
					>
						{{ chartName }}
					</div>
				</div>
			</div>
			<div class="card-body py-0" :style="{ height: chartHeight + 'px' }">
				<div>
					<template v-if="viewType === 'chart'">
						<highcharts
							:options="cObj"
							v-if="cObj.series.length"
							ref="addedChart"
						/>
						<div
							class="text-center d-flex justify-content-center align-items-center"
							v-if="errorText"
						>
							{{ errorText }}
						</div>
					</template>
				</div>
			</div>
			<!-- <reportingRateTabs
				v-if="isReportingRateChart"
				key1="rrCompleteness"
				key2="rrTimeliness"
				:userDetails="userDetails"
				:dqrResponse="dqrResponse"
				:appResponse="appResponse"
				:globalResponse="globalResponse"
				:period="sendPeriod"
				:defaultLevelID="defaultLevelID"
				:defaultLocationID="defaultLocationID"
				:subLevelID="subLevelID"
				:source="reportingSelectedMethod"
				:locationValue="locationValue"
				:periodType="periodType"
				:applicationFinalYear="applicationFinalYear"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/>
			<externalValidation
				v-if="isExternalValidationChart && isChildFetched"
				key1="evInjectables"
				key2="evIUD"
				key3="evImplant"
				:userDetails="userDetails"
				:dqrResponse="dqrResponse"
				:appResponse="appResponse"
				:globalResponse="globalResponse"
				:period="sendPeriod"
				:defaultLevelID="defaultLevelID"
				:defaultLocationID="defaultLocationID"
				:subLevelID="subLevelID"
				:locationValue="locationValue"
				:periodType="periodType"
				:reportChartData="chartData"
				:childArr="childArr"
				@setReportChart="setReportChart"
			/>
			<internalValidationTab
				v-if="isInternalValidationChart"
				key1="icAggregate"
				key2="icMethod"
				:userDetails="userDetails"
				:dqrResponse="dqrResponse"
				:appResponse="appResponse"
				:globalResponse="globalResponse"
				:period="sendPeriod"
				:defaultLevelID="defaultLevelID"
				:defaultLocationID="defaultLocationID"
				:subLevelID="subLevelID"
				:locationValue="locationValue"
				:selectedMethod="internalSelectedMethod"
				:periodType="periodType"
				:standardDeviation="standardDeviation"
				:applicationFinalYear="applicationFinalYear"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/>
			<ministerialPage
				v-if="isMinisterialChart"
				:reportPeriodType="periodType"
				:period="sendPeriod"
				:locationValue="locationValue"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/>
			<geographicalProgressTab
				v-if="isGeographicalChart"
				:appResponse="appResponse"
				:globalResponse="globalResponse"
				:userDetails="userDetails"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/>
			<beTabs
				v-if="isBarriersChart"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/>
			<program-priorities-tab
				v-if="isProgrammaticChart"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				@setReportChart="setReportChart"
			/> -->
			<SummaryDashboard
				v-if="isSummaryChart"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				:reportConfigData="configData.summaryDashboard"
				@setReportChart="setReportChart"
			/>
			<AnalyticalDashboard
				v-if="isAnalyticalChart"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				:reportConfigData="configData.analyticalDashboard"
				@setReportChart="setReportChart"
			/>
			<DQRDashboard
				v-if="isDQRChart"
				:reportPeriod="sendPeriod"
				:reportLocationValue="locationValue"
				:reportDefaultLevelID="defaultLevelID"
				:reportDefaultLocationID="defaultLocationID"
				:reportSubLevelID="subLevelID"
				:reportPeriodType="periodType"
				:reportChartData="chartData"
				:reportConfigData="configData.dqrDashboard"
				@setReportChart="setReportChart"
			/>
		</div>
	</b-overlay>
</template>
<script>
import service from "@/service";
import basicChartConfig from "@/config/basicChartConfig_IA.js";

export default {
	props: [
		"chartData",
		"otherChartObj",
		"selectedLocation",
		"configData",
		"updateFrequencyType",
		"basePeriod",
	],
	components: {
		// reportingRateTabs: () =>
		// 	import(
		// 		/* webpackChunkName: "dqr_reportingRate"*/ "@/components/FPDashboard/dqr/reportingRate/chartComponent.vue"
		// 	),
		// externalValidation: () =>
		// 	import(
		// 		/* webpackChunkName: "dqr_externalValidation"*/ "@/components/FPDashboard/dqr/externalValidation/externalValidation.vue"
		// 	),
		// internalValidationTab: () =>
		// 	import(
		// 		/* webpackChunkName: "dqr_internalValidation"*/ "@/components/FPDashboard/dqr/internalValidation/internalValidation.vue"
		// 	),
		// ministerialPage: () =>
		// 	import(
		// 		/* webpackChunkName: "ministerial"*/ "@/pages/FPDashboard/MinisterialPage"
		// 	),
		// programPrioritiesTab: () =>
		// 	import(
		// 		/* webpackChunkName: "analytical_programPriorities"*/ "@/components/FPDashboard/analytical/programPriorities/programPrioritiesTab"
		// 	),
		// geographicalProgressTab: () =>
		// 	import(
		// 		/* webpackChunkName: "analytical_geographical"*/ "@/components/FPDashboard/analytical/geographical/geoProgress"
		// 	),
		// beTabs: () =>
		// 	import(
		// 		/* webpackChunkName: "analytical_barriers"*/ "@/components/FPDashboard/analytical/barrier/barrierTab"
		// 	),
		SummaryDashboard: () =>
			import(
				/*webpackChunkName: 'summaryDashboard'*/ "@/pages/SummaryDashboard"
			),
		AnalyticalDashboard: () =>
			import(/*webpackChunkName: 'AnalyticalDashboard'*/ "@/pages/Analytical"),
		DQRDashboard: () =>
			import(/*webpackChunkName: 'DQRDashboard'*/ "@/pages/Dqr"),
	},
	data() {
		return {
			cObj: JSON.parse(JSON.stringify(basicChartConfig.column)),
			viewType: "chart",
			sendPeriod: null,
			chartName: "",
			applicationFinalYear: null,
			showLoader: true,
			isReportingRateChart: false,
			isExternalValidationChart: false,
			isInternalValidationChart: false,
			isMinisterialChart: false,
			isGeographicalChart: false,
			isBarriersChart: false,
			isProgrammaticChart: false,
			isSummaryChart: false,
			isAnalyticalChart: false,
			isDQRChart: false,
			userDetails: null,
			dqrResponse: null,
			appResponse: null,
			globalResponse: null,
			defaultLevelID: null,
			locationValue: null,
			defaultLocationID: null,
			subLevelID: null,
			reportingSelectedMethod: null,
			periodType: null,
			errorText: "",
			internalSelectedMethod: null,
			standardDeviation: 2,
			isChartSet: false,
			childArr: [],
			isChildFetched: false,
		};
	},
	watch: {
		configData: {
			handler: function (newValue) {
				this.cObj = JSON.parse(JSON.stringify(basicChartConfig.column));
				this.setPeriod(this.chartData?.periodType || "monthly");
				this.isChartSet = false;
				this.showLoader = true;
				let c = this.chartData;
				let selectedDashboard = c.selectedDashboard.split("-");
				let permissions = {
					dashboards: [],
					modules: [],
				};
				if (!this.$store.getters.getIsAdmin) {
					permissions = this.$store.getters.getUserPermissions;
				}
				if (c.selectedModule.includes("interactive") && newValue.interactive) {
					if (newValue.interactive === "error") {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText = this.$i18n.t("errorInData");
					} else {
						this.getInteractiveCharts(c, newValue.interactive);
					}
				}
				if (
					c.selectedModule.includes("dqrModule") &&
					c.selectedCategory === "emu" &&
					newValue.dqrModule &&
					newValue.emu
				) {
					if (
						newValue.dqrModule === "error" ||
						newValue.emu === "error" ||
						(!this.$store.getters.getIsAdmin &&
							!permissions.dashboards.includes(selectedDashboard[0]))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrModule === "error" || newValue.emu === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						this.getEMUAnnualCharts(c, newValue.dqrModule, newValue.emu);
					}
				}
				if (
					c.selectedModule.includes("dqrModule") &&
					c.selectedCategory === "emu_monthly" &&
					newValue.dqrModule &&
					newValue.emu_monthly
				) {
					if (
						newValue.dqrModule === "error" ||
						newValue.emu_monthly === "error" ||
						(!this.$store.getters.getIsAdmin &&
							!permissions.dashboards.includes(selectedDashboard[0]))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrModule === "error" || newValue.emu_monthly === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						this.getEMUMonthlyCharts(
							c,
							newValue.dqrModule,
							newValue.emu_monthly
						);
					}
				}
				if (
					c.selectedModule.includes("dqrModule") &&
					c.selectedCategory === "reportingRate" &&
					newValue.dqrModule
				) {
					this.isReportingRateChart = false;
					if (
						newValue.dqrModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(`DQR-${selectedDashboard[0]}`)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getReportingRateCharts(c, newValue.dqrModule);
						}
					}
				}
				if (
					c.selectedModule.includes("dqrModule") &&
					c.selectedCategory.includes("external_validation") &&
					newValue.dqrModule
				) {
					this.isExternalValidationChart = false;
					this.isChildFetched = false;
					if (
						newValue.dqrModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(`DQR-${selectedDashboard[0]}`)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getExternalValidationCharts(c, newValue.dqrModule);
						}
					}
				}
				if (
					c.selectedModule.includes("dqrModule") &&
					c.selectedCategory.includes("internal_validations") &&
					newValue.dqrModule
				) {
					this.isInternalValidationChart = false;
					if (
						newValue.dqrModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(`DQR-${selectedDashboard[0]}`)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getInternalValidationCharts(c, newValue.dqrModule);
						}
					}
				}
				if (
					c.selectedModule.includes("ministrialModule") &&
					newValue.ministrialModule
				) {
					this.isMinisterialChart = false;
					if (
						newValue.ministrialModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`summary_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.ministrialModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						this.getMinisterialCharts(c);
					}
				}
				if (
					c.selectedModule.includes("adGeographicalModule") &&
					newValue.adGeographicalModule
				) {
					this.isGeographicalChart = false;
					if (
						newValue.adGeographicalModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`analytical_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.adGeographicalModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getGeographicalCharts(c);
						}
					}
				}
				if (
					c.selectedModule.includes("adBarrierModule") &&
					newValue.adBarrierModule
				) {
					this.isBarriersChart = false;
					if (
						newValue.adBarrierModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`analytical_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.adBarrierModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getBarriersCharts(c);
						}
					}
				}
				if (
					c.selectedModule.includes("adProgramModule") &&
					newValue.adProgramModule
				) {
					this.isProgrammaticChart = false;
					if (
						newValue.adProgramModule === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`analytical_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.adProgramModule === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getProgrammaticCharts(c);
						}
					}
				}
				if (
					c.selectedModule.includes("summaryDashboard") &&
					newValue.summaryDashboard
				) {
					this.isSummaryChart = false;
					if (
						newValue.summaryDashboard === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`summary_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.summaryDashboard === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getSummaryCharts(c);
						}
					}
				}
				if (
					c.selectedModule.includes("analyticalDashboard") &&
					newValue.analyticalDashboard
				) {
					this.isAnalyticalChart = false;
					if (
						newValue.analyticalDashboard === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(
									`analytical_dashboard-${selectedDashboard[0]}`
								)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.analyticalDashboard === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getAnalyticalCharts(c);
						}
					}
				}
				if (
					c.selectedModule.includes("dqrDashboard") &&
					newValue.dqrDashboard
				) {
					this.isDQRChart = false;
					if (
						newValue.dqrDashboard === "error" ||
						(!this.$store.getters.getIsAdmin &&
							(!permissions.dashboards.includes(selectedDashboard[0]) ||
								!permissions.modules.includes(`DQR-${selectedDashboard[0]}`)))
					) {
						this.showLoader = false;
						this.chartName = c.name;
						this.errorText =
							newValue.dqrDashboard === "error"
								? this.$i18n.t("errorInData")
								: "Not authorized to view this chart";
					} else {
						if (c.canCallAPI) {
							this.getDQRCharts(c);
						}
					}
				}
			},
			deep: true,
		},
		otherChartObj: {
			handler: function (newValue) {
				if (newValue.length) {
					let isFound = newValue.find((c) =>
						c.cid.includes(this.chartData.cid)
					);
					if (isFound && !this.isChartSet) {
						this.setReportChart(isFound, false);
					}
				}
			},
			deep: true,
		},
	},
	computed: {
		chartHeight() {
			let height =
				this.chartData && this.chartData.chartData
					? this.chartData.chartData.chart.height
					: 300;
			return height;
		},
	},
	methods: {
		setReportChart(obj, canEmit = true) {
			if (canEmit) {
				this.$emit("getOtherChartObj", obj);
			} else {
				if (obj.chartObj) {
					this.cObj = obj.chartObj;
					this.cObj.chart.height = this.chartHeight;
					if (obj.chartObj.series.length === 0) {
						this.errorText = this.$i18n.t("chartDisabled");
					}
				} else {
					this.errorText = this.$i18n.t("chartDisabled");
				}
				this.showLoader = false;
				if (obj.chartName) {
					this.chartName = obj.chartName;
				}
				if (obj.showLabels) {
					this.cObj.plotOptions = {
						...this.cObj.plotOptions,
						series: {
							...this.cObj.plotOptions.series,
							dataLabels: {
								enabled: true,
								formatter: function () {
									return this.point.label;
								},
							},
						},
					};
				}
				if (obj.r2 >= 0) {
					this.cObj.chart.events = {
						...this.cObj.chart.events,
						load: function () {
							var chart = this;
							chart.renderer
								.html(
									`R<sup>2</sup> : ${obj.r2}`,
									chart.plotWidth - 30,
									chart.plotHeight - 40
								)
								.css({
									fontSize: "13px",
									color: "#FFFFFF",
									fontWeight: 600,
									backgroundColor: "#f1f1f14d",
									padding: "10px",
									border: "1px solid #c4c4c4",
									borderRadius: "4px",
								})
								.add();
						},
					};
				}
				this.isChartSet = true;
			}
		},
		setLocationDetails(chart) {
			let selectedLocation = this.selectedLocation.split("/");
			this.defaultLevelID = selectedLocation[0];
			this.defaultLocationID = selectedLocation[1];
			this.subLevelID = selectedLocation[0] * 1 + 1;
			this.locationValue = this.selectedLocation;
			this.periodType = chart.periodType;
		},
		getSummaryCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isSummaryChart = true;
			});
		},
		getAnalyticalCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isAnalyticalChart = true;
			});
		},
		getDQRCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isDQRChart = true;
			});
		},
		getProgrammaticCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isProgrammaticChart = true;
			});
		},
		getBarriersCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isBarriersChart = true;
			});
		},
		getGeographicalCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isGeographicalChart = true;
			});
		},
		getMinisterialCharts(chart) {
			this.setLocationDetails(chart);
			this.$nextTick(() => {
				this.isMinisterialChart = true;
			});
		},
		getReportingRateCharts(chart, configData) {
			this.setLocationDetails(chart);
			this.dqrResponse = configData;
			this.reportingSelectedMethod = chart.selectedSource;
			this.$nextTick(() => {
				this.isReportingRateChart = true;
			});
		},
		getExternalValidationCharts(chart, configData) {
			this.setLocationDetails(chart);
			let selectedLocation = this.selectedLocation.split("/")[1];
			service
				.getChildOrganisation(this.defaultLocationID)
				.then((response) => {
					this.childArr = response.data.children;
					this.isChildFetched = true;
				})
				.catch(() => {
					this.childArr = [];
					this.isChildFetched = true;
				});
			this.dqrResponse = configData;
			this.subLevelID = configData.external_validation.Background_Data.dataLevel
				? configData.external_validation.Background_Data.dataLevel
				: selectedLocation[0] * 1 + 1;
			this.$nextTick(() => {
				this.isExternalValidationChart = true;
			});
		},
		getInternalValidationCharts(chart, configData) {
			this.setLocationDetails(chart);
			this.dqrResponse = configData;
			this.internalSelectedMethod = chart.selectedSource
				? chart.selectedSource
				: configData.internal_validations.Background_Data.data_source;
			this.standardDeviation = configData.internal_validations.Background_Data
				.standardDeviation
				? configData.internal_validations.Background_Data.standardDeviation
				: 2;
			this.$nextTick(() => {
				this.isInternalValidationChart = true;
			});
		},
		getInteractiveCharts(chart, configData) {
			let isFound = configData.find((c) => chart.cid.split("/")[1] === c.id);
			if (isFound) {
				let updatedChart = {
					...isFound.chartData,
				};
				this.cObj = updatedChart;
			} else {
				this.errorText = "Chart is deleted from Favorites";
			}
			this.chartName = chart.name;
			this.showLoader = false;
		},
		getEMUMonthlyCharts(chart, configData, savedData) {
			let k = chart.selectedModule.split("-"),
				chartSettings = null,
				selectedLocation = this.selectedLocation.split("/")[1];
			let autoSaveEMU = configData.emu_monthly.Background_Data.autoSaveEMU;
			let foundChart = configData.emu_monthly[autoSaveEMU].derivedCharts.find(
				(c) => c.chartOptions.cid === chart.cid.split("/")[1]
			);
			if (foundChart) {
				chartSettings = foundChart.chartOptions;
			}

			if (k[2] === "emu_monthly" && chartSettings) {
				let emuChart = null;
				Object.keys(savedData).forEach((key) => {
					let parsedObj =
						typeof savedData[key] == "string"
							? JSON.parse(savedData[key])
							: savedData[key];
					if (
						parsedObj[selectedLocation] &&
						parsedObj[selectedLocation].cid === chart.cid.split("/")[1]
					) {
						emuChart = parsedObj[selectedLocation];
					}
				});
				if (emuChart && chartSettings) {
					let updatedChartData = [];
					if (emuChart.isPeriodChart) {
						let pe = [];
						let formatedCatArray = [];
						for (let i = 23; i >= 0; i--) {
							if (i === 0) {
								pe.push(
									this.$moment(this.sendPeriod, "YYYYMM").format("YYYYMM")
								);
							} else {
								pe.push(
									this.$moment(this.sendPeriod, "YYYYMM")
										.subtract(i, "months")
										.format("YYYYMM")
								);
							}
						}
						emuChart.saveCategories.forEach((c) => {
							formatedCatArray.push(
								this.$moment(c, "MMM YYYY").format("YYYYMM")
							);
						});

						emuChart.saveData.forEach((c) => {
							let innerObj = {
								name: c.trans_name ? c.trans_name : c.name,
								color: c.color,
								data: [],
							};

							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);

									innerObj.data.push({
										name: formatedDate,
										y: c.data[catIndex],
									});
								} else {
									innerObj.data.push({
										name: formatedDate,
										y: null,
									});
								}
							});
							updatedChartData.push(innerObj);
						});
					} else {
						emuChart.data.forEach((c) => {
							let innerObj = {
								name: c.trans_name ? c.trans_name : c.name,
								data: [],
								color: c.color,
							};

							emuChart.categories.forEach((cat, i) => {
								innerObj.data.push({
									name: cat,
									y: c.data[i],
								});
							});
							updatedChartData.push(innerObj);
						});
					}
					this.cObj.series = updatedChartData;
					this.cObj.chart.type = emuChart.reportChartType
						? emuChart.reportChartType === "stacked" ||
						  emuChart.reportChartType === "column_stack"
							? "column"
							: emuChart.reportChartType
						: "line";
					if (
						emuChart.reportChartType === "stacked" ||
						emuChart.reportChartType === "column_stack"
					) {
						this.cObj.plotOptions.series.stacking = "normal";
					}
					this.chartName = chartSettings.chartName;
					this.cObj.title.text = chartSettings.title.visible
						? chartSettings.title.text
						: "";
					this.cObj.subtitle.text = chartSettings.subTitle.visible
						? chartSettings.subTitle.text
						: "";
					this.cObj.xAxis.title.text = chartSettings.xAxis.visible
						? chartSettings.xAxis.text
						: "";
					this.cObj.yAxis.title.text = chartSettings.yAxis.visible
						? chartSettings.yAxis.text
						: "";
					this.showLoader = false;
				}
			}
		},
		getEMUAnnualCharts(chart, configData, savedData) {
			let k = chart.selectedModule.split("-"),
				chartSettings = null,
				key = this.generateKey(k[0]),
				selectedLocation = this.selectedLocation.split("/")[1];
			let foundChart = configData.emu.Output.derivedCharts.find(
				(c) => c.chartOptions.cid === chart.cid.split("/")[1]
			);
			if (foundChart) {
				chartSettings = foundChart.chartOptions;
			}
			if (k[2] === "emu" && chartSettings) {
				let emuChart = null,
					chartIndex = 0;
				Object.keys(savedData).forEach((key, i) => {
					let parsedObj =
						typeof savedData[key] == "string"
							? JSON.parse(savedData[key])
							: savedData[key];
					if (
						parsedObj[selectedLocation] &&
						parsedObj[selectedLocation].cid === chart.cid.split("/")[1]
					) {
						emuChart = parsedObj[selectedLocation];
						chartIndex = i;
					}
				});
				if (emuChart && chartSettings) {
					let updatedChartData = [];
					let pe = [];
					let formatedCatArray = [];
					let toolbarDate = this.$moment(this.sendPeriod, "YYYY").format(
						"YYYY"
					);
					let yearDiff = toolbarDate - this.applicationFinalYear;
					for (let i = yearDiff; i >= 0; i--) {
						if (i === 0) {
							pe.push(this.$moment(this.sendPeriod, "YYYY").format("YYYY"));
						} else {
							pe.push(
								this.$moment(this.sendPeriod, "YYYY")
									.subtract(i, "year")
									.format("YYYY")
							);
						}
					}
					formatedCatArray = emuChart.categories;
					emuChart.data.forEach((c) => {
						let innerObj = {
							name: c.trans_name ? c.trans_name : c.name,
							data: [],
							color: c.color,
						};
						pe.forEach((p) => {
							let formatedDate = this.$moment(p, "YYYY").format("YYYY");
							if (formatedCatArray.includes(p)) {
								let catIndex = formatedCatArray.indexOf(p);

								innerObj.data.push({
									name: formatedDate,
									y: c.data[catIndex],
								});
							} else {
								innerObj.data.push({
									name: formatedDate,
									y: null,
								});
							}
						});
						updatedChartData.push(innerObj);
					});
					this.cObj.series = updatedChartData;
					this.cObj.chart.type = chartIndex === 0 ? "line" : "bar";
					if (chartIndex === 2) {
						this.cObj.plotOptions.series.stacking = "normal";
					}
					this.cObj.yAxis.min = null;
					this.chartName = chartSettings.chartName;
					this.cObj.title.text = chartSettings.title.visible
						? chartSettings.title.text
						: "";
					this.cObj.subtitle.text = chartSettings.subTitle.visible
						? chartSettings.subTitle.text
						: "";
					this.cObj.xAxis.title.text = chartSettings.xAxis.visible
						? chartSettings.xAxis.text
						: "";
					this.cObj.yAxis.title.text = chartSettings.yAxis.visible
						? chartSettings.yAxis.text
						: "";
					this.showLoader = false;
				}
			}
		},
		setPeriod(newVal) {
			let period = this.$store.getters.getGlobalFactors().period.Period,
				periodObj = {
					defaultPeriod: null,
					calculatedPeriod: null,
				};
			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(period.backtrackedMonth * 1, "months")
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(period.backtrackedYearLimit * 1, "years")
				.format("YYYY-MM");
			let currentYear = this.$moment(currentDate, "YYYY").format("YYYY");
			this.applicationFinalYear = this.$moment(currentFinalDate, "YYYY").format(
				"YYYY"
			);
			let currYear = new Date().getFullYear(),
				currentMonth = new Date().getMonth() + 1;
			let currentQuarter = Math.ceil(currentMonth / 3);
			let quarterLimit = currentYear * 1 === currYear * 1 ? currentQuarter : 4;

			let calculatedPeriod = {
				monthly: currentDate,
				yearly: currentYear,
				financialYear: `${currentYear - 1}`,
				financialYearJuly: `${currentYear - 1}July`,
				quarterly: `${currentYear}Q${quarterLimit}`,
			};
			periodObj.defaultPeriod = JSON.parse(JSON.stringify(calculatedPeriod));
			if (this.updateFrequencyType === "monthly") {
				let limitPeriod = this.$moment(
					calculatedPeriod[this.updateFrequencyType],
					"YYYYMM"
				)
					.subtract(this.basePeriod, "months")
					.format("YYYY-MM");
				let currYear = new Date(limitPeriod).getFullYear(),
					currentMonth = new Date(limitPeriod).getMonth() + 1;
				let currentQuarter = Math.ceil(currentMonth / 3);
				let lastMonths = {
					Q1: "3",
					Q2: "6",
					Q3: "9",
					Q4: "12",
				};

				let updatedMonthly = limitPeriod;

				let updatedYearly = "";
				if (limitPeriod == `${currYear}-12`) {
					updatedYearly = currYear;
				} else {
					updatedYearly = currYear - 1;
				}

				let updatedFinancialYear = "",
					lastMonthOfFY = `${currYear}-03`;
				if (limitPeriod == lastMonthOfFY) {
					updatedFinancialYear = currYear - 1;
				} else if (
					new Date(limitPeriod).getTime() > new Date(lastMonthOfFY).getTime()
				) {
					updatedFinancialYear = currYear - 1;
				} else if (
					new Date(limitPeriod).getTime() < new Date(lastMonthOfFY).getTime()
				) {
					updatedFinancialYear = currYear - 2;
				}

				let updatedFinancialYearJuly = "",
					lastMonthOfFYJuly = `${currYear}-06`;
				if (limitPeriod == lastMonthOfFYJuly) {
					updatedFinancialYearJuly = `${currYear - 1}July`;
				} else if (
					new Date(limitPeriod).getTime() >
					new Date(lastMonthOfFYJuly).getTime()
				) {
					updatedFinancialYearJuly = `${currYear - 1}July`;
				} else if (
					new Date(limitPeriod).getTime() <
					new Date(lastMonthOfFYJuly).getTime()
				) {
					updatedFinancialYearJuly = `${currYear - 2}July`;
				}

				let updatedQuarterly = "";
				if (currentMonth == lastMonths[`Q${currentQuarter}`]) {
					updatedQuarterly = `${currYear}Q${currentQuarter}`;
				} else {
					updatedQuarterly = this.$moment(
						`${currYear}Q${currentQuarter}`,
						"YYYY[Q]Q"
					)
						.subtract(1, "Q")
						.format("YYYY[Q]Q");
				}
				calculatedPeriod = {
					monthly: updatedMonthly,
					yearly: updatedYearly.toString(),
					financialYear: updatedFinancialYear.toString(),
					financialYearJuly: updatedFinancialYearJuly,
					quarterly: updatedQuarterly,
				};
			}

			if (this.updateFrequencyType === "yearly") {
				let limitPeriod = this.$moment(
					calculatedPeriod[this.updateFrequencyType],
					"YYYY"
				)
					.subtract(this.basePeriod, "years")
					.format("YYYY");
				let currYear = limitPeriod;
				let currentQuarter = 4;

				let updatedMonthly = `${currYear}-12`;

				let updatedYearly = currYear;

				let updatedFinancialYear = currYear - 1;

				let updatedFinancialYearJuly = `${currYear - 1}July`;

				let updatedQuarterly = `${currYear}Q${currentQuarter}`;
				calculatedPeriod = {
					monthly: updatedMonthly,
					yearly: updatedYearly.toString(),
					financialYear: updatedFinancialYear.toString(),
					financialYearJuly: updatedFinancialYearJuly,
					quarterly: updatedQuarterly,
				};
			}
			if (
				this.updateFrequencyType === "financialYear" ||
				this.updateFrequencyType === "financialYearJuly"
			) {
				let year =
					this.updateFrequencyType === "financialYear"
						? calculatedPeriod[this.updateFrequencyType]
						: calculatedPeriod[this.updateFrequencyType].split("July")[0];
				let limitPeriod = this.$moment(year, "YYYY")
					.subtract(this.basePeriod, "years")
					.format("YYYY");
				let currYear = limitPeriod;
				let currentQuarter =
					this.updateFrequencyType === "financialYear" ? 1 : 2;
				let lastMonths = {
					Q1: "3",
					Q2: "6",
					Q3: "9",
					Q4: "12",
				};
				let findMonth =
					lastMonths[`Q${currentQuarter}`] < 10
						? "0" + lastMonths[`Q${currentQuarter}`]
						: lastMonths[`Q${currentQuarter}`];
				let updatedMonthly = `${currYear * 1 + 1}-${findMonth}`;

				let updatedYearly = currYear;

				let updatedFinancialYear =
					this.updateFrequencyType === "financialYear"
						? currYear
						: `${currYear}July`;

				let updatedFinancialYearJuly =
					this.updateFrequencyType === "financialYear"
						? currYear
						: `${currYear}July`;

				let updatedQuarterly = `${currYear * 1 + 1}Q${currentQuarter}`;
				calculatedPeriod = {
					monthly: updatedMonthly,
					yearly: updatedYearly.toString(),
					financialYear: updatedFinancialYear.toString(),
					financialYearJuly: updatedFinancialYearJuly,
					quarterly: updatedQuarterly,
				};
			}
			if (this.updateFrequencyType === "quarterly") {
				let limitPeriod = this.$moment(
					calculatedPeriod[this.updateFrequencyType],
					"YYYY[Q]Q"
				)
					.subtract(this.basePeriod, "Q")
					.format("YYYY[Q]Q");
				let currYear = limitPeriod.split("Q")[0];
				let currentQuarter = limitPeriod.split("Q")[1];
				let lastMonths = {
					Q1: "3",
					Q2: "6",
					Q3: "9",
					Q4: "12",
				};
				let findMonth =
					lastMonths[`Q${currentQuarter}`] < 10
						? "0" + lastMonths[`Q${currentQuarter}`]
						: lastMonths[`Q${currentQuarter}`];
				let updatedMonthly = `${currYear}-${findMonth}`;

				let updatedYearly = "";
				if (`${currYear}-${findMonth}` === `${currYear}-12`) {
					updatedYearly = currYear;
				} else {
					updatedYearly = currYear - 1;
				}

				let updatedFinancialYear = "",
					lastMonthOfFY = `${currYear}-03`;
				if (`${currYear}-${findMonth}` == lastMonthOfFY) {
					updatedFinancialYear = currYear - 1;
				} else if (
					new Date(`${currYear}-${findMonth}`).getTime() >
					new Date(lastMonthOfFY).getTime()
				) {
					updatedFinancialYear = currYear - 1;
				} else if (
					new Date(`${currYear}-${findMonth}`).getTime() <
					new Date(lastMonthOfFY).getTime()
				) {
					updatedFinancialYear = currYear - 2;
				}

				let updatedFinancialYearJuly = "",
					lastMonthOfFYJuly = `${currYear}-06`;
				if (`${currYear}-${findMonth}` == lastMonthOfFYJuly) {
					updatedFinancialYearJuly = `${currYear - 1}July`;
				} else if (
					new Date(`${currYear}-${findMonth}`).getTime() >
					new Date(lastMonthOfFYJuly).getTime()
				) {
					updatedFinancialYearJuly = `${currYear - 1}July`;
				} else if (
					new Date(`${currYear}-${findMonth}`).getTime() <
					new Date(lastMonthOfFYJuly).getTime()
				) {
					updatedFinancialYearJuly = `${currYear - 2}July`;
				}

				let updatedQuarterly = limitPeriod;
				calculatedPeriod = {
					monthly: updatedMonthly,
					yearly: updatedYearly.toString(),
					financialYear: updatedFinancialYear.toString(),
					financialYearJuly: updatedFinancialYearJuly,
					quarterly: updatedQuarterly,
				};
			}
			periodObj.calculatedPeriod = JSON.parse(JSON.stringify(calculatedPeriod));
			this.sendPeriod = calculatedPeriod[newVal];
			this.$emit("getPeriod", periodObj);
		},
	},
	created() {
		this.chartName =
			this.chartData && this.chartData.chartName
				? this.chartData.chartName
				: "";
		this.setPeriod(this.chartData?.periodType || "monthly");
		this.appResponse = this.$store.getters.getApplicationModule();
		this.globalResponse = this.$store.getters.getGlobalFactors();
		this.userDetails = this.$store.getters.getUserDetails;
	},
};
</script>
