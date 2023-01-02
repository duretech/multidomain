<template>
	<div class="summary-page-container" id="scrollTop">
		<DynamicSummaryNew
			v-if="
				showSummary &&
				summaryList.length > 0 &&
				mapList.length > 0 &&
				$store.getters.getActiveTab.includes('AnalyticalDashboard')
			"
			:locationPeriod="locationPeriod"
			:summaryList="summaryList"
			:mapList="mapList"
			:geoJson="geoJson"
		/>
		<div v-for="tab in configData" :key="'tabSummary' + tab.id">
			<div v-for="subTab in tab.subTabs" :key="'tabSummary' + subTab.id">
				<div v-show="$store.getters.getActiveTab.includes(subTab.id)">
					<TabSummary
						:content="subTab.categoryInfo"
						:contKey="tab.id + subTab.id"
					/>
				</div>
			</div>
		</div>
		<div v-show="showTrend" id="trendCharts">
			<b-card-group deck class="indicatorSectionWrap mt-3">
				<b-card>
					<!-- <b-card-header class="mainHeader">
						<h6>Trends in key indicators</h6>
					</b-card-header> -->
					<b-card-body class="indicatorCardBody p-0">
						<div v-for="tab in configData" :key="'trend' + tab.id">
							<div v-for="subTab in tab.subTabs" :key="'trend' + subTab.id">
								<div
									v-show="
										$store.getters.getActiveTab === 'sd-summary' ||
										$store.getters.getActiveTab.includes(subTab.id)
									"
								>
									<template
										v-if="
											!reportChartData ||
											(reportChartData &&
												reportChartData.selectedSource === subTab.id &&
												reportChartData.cid.split('/')[1] ===
													subTab.chartSetting[0].chartOptions.cid)
										"
									>
										<DynamicChartComponent
											chartCategory="trend"
											:tab="tab"
											:subTab="subTab"
											:locationPeriod="locationPeriod"
											@summaryChartData="summaryChartData"
											sendMapData="true"
											@mapData="mapData"
											flagKey="geoTab"
											:globalResponse="globalResponse"
											@flag="flag"
											:isAnalytical="true"
										/>
									</template>
								</div>
							</div>
						</div>
					</b-card-body>
				</b-card>
			</b-card-group>
		</div>
		<div v-show="showRegional" id="regionalCharts">
			<b-card-group deck class="indicatorSectionWrap mt-3">
				<b-card>
					<!-- <b-card-header class="mainHeader">
						<h6>Regional variation in key indicators</h6>
					</b-card-header> -->
					<b-card-body class="indicatorCardBody p-0">
						<div v-for="tab in configData" :key="'regional' + tab.id">
							<div v-for="subTab in tab.subTabs" :key="'regional' + subTab.id">
								<div
									v-show="
										$store.getters.getActiveTab === 'sd-summary' ||
										$store.getters.getActiveTab.includes(subTab.id)
									"
								>
									<template
										v-if="
											!reportChartData ||
											(reportChartData &&
												reportChartData.selectedSource === subTab.id &&
												reportChartData.cid.split('/')[1] ===
													subTab.chartSetting[1].chartOptions.cid)
										"
									>
										<DynamicChartComponent
											chartCategory="regional"
											:tab="tab"
											:subTab="subTab"
											:locationPeriod="locationPeriod"
											@summaryChartData="summaryChartData"
											:globalResponse="globalResponse"
											flagKey="regTab"
											@flag="flag"
											:isAnalytical="true"
										/>
									</template>
								</div>
							</div>
						</div>
					</b-card-body>
				</b-card>
			</b-card-group>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import DynamicSummaryNew from "@/components/Summary/DynamicSummaryNew.vue";
import DynamicChartComponent from "@/components/Summary/DynamicChartComponent";

export default {
	props: [
		"showTrend",
		"showRegional",
		"configData",
		"locationPeriod",
		"showSummary",
		"reportChartData",
	],
	mixins: [ScrollPageMixin],
	components: {
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
		DynamicSummaryNew,
		DynamicChartComponent,
	},
	data() {
		return {
			visible: false,
			summaryList: [],
			mapList: [],
			summaryObj: null,
			geoJson: null,
			globalResponse: null,
			flagObj: {},
		};
	},
	watch: {
		showTrend(newValue) {
			if (newValue) {
				// console.log("showTrend", newValue);
				this.scrollPage("trendCharts");
			}
		},
		showRegional(newValue) {
			if (newValue) {
				// console.log("showRegional", newValue);
				this.scrollPage("regionalCharts");
			}
		},
		locationPeriod: {
			handler() {
				this.summaryList = [];
				this.mapList = [];
				this.$nextTick(() => {
					this.getSummaryList();
					this.getMapList();
				});
			},
			deep: true,
		},
	},
	methods: {
		flag(flagDetails) {
			// console.log(flagDetails);
			if (!this.flagObj[flagDetails.tab]) this.flagObj[flagDetails.tab] = {};
			this.flagObj[flagDetails.tab] = flagDetails;
			this.$emit("flag", this.flagObj);
		},
		getSummaryList() {
			this.configData.forEach((c) => {
				c.subTabs.forEach((s) => {
					let isMapping = false;
					s.mapping.forEach((m) => {
						m.indicator.subIndicator.forEach((sub) => {
							if (sub.selectedDE.length) {
								isMapping = true;
							}
						});
					});
					if (isMapping) {
						if (this.$route.name === "AnalyticalDashboard") {
							this.summaryList.push({
								id: s.id,
								parentTab: c.id,
								tabName: s.tabName,
								trend: null,
								regional: null,
								summaryDetails: null,
								errorMsg: null,
							});
						} else {
							if (s.summary && !s.summary.disable) {
								this.summaryList.push({
									id: s.id,
									tabName: s.tabName,
									trend: null,
									regional: null,
									summaryDetails: null,
									errorMsg: null,
								});
							}
						}
					}
				});
			});
		},
		getMapList() {
			this.configData.forEach((c) => {
				c.subTabs.forEach((subTab) => {
					subTab.mapping.forEach((element) => {
						let isMapping = false;
						element.indicator.subIndicator.forEach((sub) => {
							if (sub.selectedDE.length) {
								isMapping = true;
							}
						});
						// console.log(element);
						if (isMapping) {
							let mapObj = {
								parentTab: c.id,
								name: element.indicator.name,
								color: element.indicator.color,
								visible: !element.indicator.disable,
								static_name: element.indicator.static_name,
								dx: [],
								id: subTab.id,
								mapData: [],
								location: null,
								period: [],
							};
							element.indicator.subIndicator.forEach((subEle) => {
								subEle.selectedDE.forEach((s) => {
									mapObj.dx.push(s.id);
								});
							});
							this.mapList.push(mapObj);
						}
					});
				});
			});
		},
		summaryChartData(data) {
			if (this.reportChartData) {
				this.$emit("setReportChart", {
					chartObj: data.chartData,
					chartName: data.chartData?.title?.title || "",
					cid: [this.reportChartData.cid],
				});
			}
			let isFound = this.summaryList.findIndex((s) => s.id === data.id);
			// console.log("isFound",isFound)
			if (isFound >= 0) {
				let obj = {
					...this.summaryList[isFound],
					[data.chartCategory]: data.chartData,
					summaryDetails: data.summaryDetails
						? data.summaryDetails
						: this.summaryList[isFound].summaryDetails,
					errorMsg: data.errorMsg
						? data.errorMsg
						: this.summaryList[isFound].errorMsg,
				};
				// this.summaryList[isFound] = {
				//   ...this.summaryList[isFound],
				//   [data.chartCategory]: data.chartData,
				//   summaryDetails: data.summaryDetails
				//     ? data.summaryDetails
				//     : this.summaryList[isFound].summaryDetails,
				//   errorMsg: data.errorMsg
				//     ? data.errorMsg
				//     : this.summaryList[isFound].errorMsg,
				// };
				this.$set(this.summaryList, isFound, obj);
				this.updateDOM++;
			}
		},
		mapData(data) {
			let isFound = this.mapList.findIndex(
				(s) => s.static_name === data.static_name
			);
			if (isFound >= 0) {
				this.mapList[isFound] = {
					...this.mapList[isFound],
					mapData: data.mapData,
					errorMsg: data.errorMsg
						? data.errorMsg
						: this.mapList[isFound].errorMsg,
					location: data.location
						? data.location
						: this.mapList[isFound].location,
					period: data.period ? data.period : this.mapList[isFound].period,
					periodType: data.periodType
						? data.periodType
						: this.mapList[isFound].periodType,
				};
			}
		},
		getGeoJson() {
			let defaultLocationID = this.locationPeriod.location.split("/")[1],
				currentLevel = this.locationPeriod.location.split("/")[0] * 1;
			service
				.getGeoJson(defaultLocationID, currentLevel + 1)
				.then((response) => {
					this.geoJson = response.data;
				});
		},
	},
	created() {
		this.getSummaryList();
		this.getMapList();
		if (!this.reportChartData) {
			this.getGeoJson();
		}
		this.globalResponse = this.$store.getters.getGlobalFactors();
	},
};
</script>
