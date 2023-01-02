<template>
	<div v-show="!reportChartData">
		<div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
			<a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
		</div>
		<div class="container-fluid px-0">
			<div class="row">
				<div class="col-12">
					<TabSummary
						v-if="geoData && geoData['categoryInfo']"
						:content="geoData['categoryInfo']"
						contKey="geo"
					/>
				</div>
				<div class="col-lg-12 d-none">
					<ul
						class="nav nav-pills mb-3"
						id="benchmarking-sub-tab"
						role="tablist"
					>
						<li class="nav-item fs-19-1920" @click="activeTab = 'total'">
							<a
								class="nav-link"
								:class="[activeTab === 'total' ? 'active' : '']"
								id="benchmarking-comclient-tab"
								data-toggle="pill"
								href="#benchmarking-comclient"
								role="tab"
								aria-controls="benchmarking-comclient"
								aria-selected="true"
								>{{ $t("total_tab") }}</a
							>
						</li>
						<li
							class="nav-item fs-19-1920"
							@click="activeTab = 'methodDetails'"
						>
							<a
								class="nav-link"
								:class="[activeTab !== 'total' ? 'active' : '']"
								id="benchmarking-comfacilities-tab"
								data-toggle="pill"
								href="#benchmarking-comfacilities"
								role="tab"
								aria-controls="benchmarking-comfacilities"
								aria-selected="false"
								>{{ $t("method_Tab") }}</a
							>
						</li>
					</ul>
				</div>
				<div class="col-12">
					<TabSummary
						v-if="
							geoData &&
							geoData.tabCategoryInfo &&
							geoData.tabCategoryInfo[0] &&
							activeTab === 'total'
						"
						:content="geoData.tabCategoryInfo[0]"
						contKey="geo"
					/>
					<TabSummary
						v-if="
							geoData &&
							geoData.tabCategoryInfo &&
							geoData.tabCategoryInfo[1] &&
							activeTab === 'methodDetails'
						"
						:content="geoData.tabCategoryInfo[1]"
						contKey="geo"
					/>
					<div
						class="row dashboardchart-container"
						id="progtabwrapper"
						:class="{ toggled: maptoggle }"
					>
						<div v-if="mapConfigAvailable" class="col-4 p-x-0px">
							<div class="map-collapse-btndiv">
								<a
									href="javascript:void(0)"
									class="color-white"
									id="progmap-toggle1"
									@click.prevent="hideMap"
								>
									{{ maptoggle ? $t("showMap") : $t("hideMap") }}
									<span><i class="fa fa-arrows-v"></i></span>
								</a>
							</div>
							<div class="map-borderdiv">
								<img
									alt="img"
									:src="require('@/assets/img/map-border.png')"
									class="img img-fluid"
								/>
							</div>
							<div class="row" id="progmapcontainer">
								<div class="col-lg-12">
									<div class="card mb-md-5 mb-sm-3">
										<div
											class="card-header p-10px text-decoration-none"
											style="
												white-space: nowrap;
												overflow: hidden;
												text-overflow: ellipsis;
											"
										>
											<i
												class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2"
												aria-hidden="true"
												v-b-popover.hover.rightbottom="{
													variant: 'info',
													content: leftMapChartInfo,
													title: mapIndicatorName,
													html: true,
												}"
											></i
											>{{ mapIndicatorName }}
										</div>
										<div
											class="card-body position-relative"
											style="height: calc(100vh - 300px); padding: 0.25rem"
										>
											<anchor-Map
												v-if="mapConfigData && mapObj.indiId"
												:defaultLevelID="defaultLevelID"
												:defaultLocationID="defaultLocationID"
												:subLevelID="subLevelID"
												:period="period"
												:periodLength="periodLength"
												:mapObj="mapObj"
												:mapConfigData="mapConfigData"
												:resetCurrentLevel="resetCurrentLevel"
												:locationChanged="locationChanged"
												:toolbarLevelID="toolbarLevelID"
												:toolbarLocationID="toolbarLocationID"
												@setLocationOnReset="setLocationOnReset"
												@setIndicatordata="setIndicatordata"
												:facilityLevelID="facilityLevelID"
												:leftMapChartInfo="leftMapChartInfo"
												:locationName="locationName"
												:mapIndicatorName="mapIndicatorName"
												ref="map"
												:periodType="periodType"
											/>
											<loader
												v-else
												class="cardLoader"
												style="z-index: 999 !important"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div
							v-if="oResponse && dataType != 'EMU'"
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
							class="col-8"
							id="progchartcontainer"
							
						>
							<geodatatypecomp
								v-if="oResponse"
								:rawGeoData="oResponse"
								:methodConf="aMethodConfig"
								:period="period"
								:chartOptions="chartOptions"
								:cypFactors="oCypFactorConf"
								:dataType="dataType"
								:defaultLocationID="toolbarLocationID"
								ref="chartsSection"
								:locationName="locationName"
								:defaultLevelID="defaultLevelID"
								:subLevelID="subLevelID"
								:periodLength="periodLength"
								:mapObj="bubbleMapObj"
								:resetCurrentLevel="resetCurrentLevel"
								:locationChanged="locationChanged"
								:toolbarLevelID="toolbarLevelID"
								:toolbarLocationID="toolbarLocationID"
								:facilityLevelID="facilityLevelID"
								:methodSeq="methodSeq"
								:activeTab="activeTab"
								:periodType="periodType"
								:calsType="calsType"
								:subMethodConf="subMethodConf"
								:applicationFinalYear="applicationFinalYear"
								:maptoggle="maptoggle"
								:reportChartData="reportChartData"
								@setReportChart="setReportChart"
							/>
						</div>
						<div
							v-else-if="emuResponse"
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
							class="col-8"
							id="progchartcontainer"
							
						>
							<geoEMUcomp
								v-if="emuResponse"
								:rawEMUData="emuResponse"
								:emuModuleData="emuModuleData"
								:period="formatedPeriod"
								:location="formatedLoc"
								:chartOptions="chartOptions"
								:defaultLocationID="toolbarLocationID"
								ref="chartsSection"
								:locationName="locationName"
								:dataType="dataType"
								:defaultLevelID="defaultLevelID"
								:subLevelID="subLevelID"
								:periodLength="periodLength"
								:mapObj="bubbleMapObj"
								:resetCurrentLevel="resetCurrentLevel"
								:locationChanged="locationChanged"
								:toolbarLevelID="toolbarLevelID"
								:toolbarLocationID="toolbarLocationID"
								:facilityLevelID="facilityLevelID"
								:activeTab="activeTab"
								:periodType="periodType"
								:calsType="calsType"
								:applicationFinalYear="applicationFinalYear"
								:maptoggle="maptoggle"
								:reportChartData="reportChartData"
								@setReportChart="setReportChart"
							/>
						</div>
						<div
							class="col-8"
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
							v-else
						>
							<PlaceholderChart />
						</div>
						<div
							class="col-12"
							v-if="
								(!mapConfigAvailable && !oResponse) ||
								(!mapConfigAvailable && !emuResponse)
							"
						>
							<b-alert variant="info" show class="mt-2">{{
								$t("maperror_msg")
							}}</b-alert>
						</div>
					</div>
				</div>
			</div>
		</div>
		<toolbarComponent
			v-if="mapIndicatorID && locationValue && globalPeriodData && period"
			@mapIndicatorID="getMapIndicatorID"
			@period="getPeriod"
			@location="getLocation"
			@source="getSource"
			@dataType="getDataType"
			:source="dataType"
			:dataType="dataType"
			:locationValue="locationValue"
			:period="period"
			:mapIndicatorID="mapIndicatorID"
			:mapConfigData="mapConfigData"
			:noEMUMapIndicatorChange="noEMUMapIndicatorChange"
			:disabledFilter="true"
			:showIndicator="true"
			:showLocation="true"
			:showYear="true"
			:showSource="true"
			:globalPeriodData="globalPeriodData"
			@closeToolbar="closeToolbar"
			:showToolbarOnTablet="showToolbarOnTablet"
			:availableSource="availableSource"
			:periodType="periodType"
			:showPeriodType="true"
			@calsType="getCalType"
			:showCalType="true"
		/>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import toolbarComponent from "../toolbarComponent";
import geodatatypecomp from "./geodatatypecomp";
import geoEMUcomp from "./geoEMUcomp";
import {
	getDateRange,
	translateDate,
} from "@/components/Common/commonFunctions";
import PlaceholderChart from "@/components/Common/PlaceholderChart";
export default {
	props: [
		"appResponse",
		"globalResponse",
		"userDetails",
		"facilityLevelID",
		"debugging",
		"activateSubTabs",
		"debuggingLevel",
		"reportPeriod",
		"reportLocationValue",
		"reportDefaultLevelID",
		"reportDefaultLocationID",
		"reportSubLevelID",
		"reportPeriodType",
		"reportChartData",
	],
	components: {
		anchorMap: () =>
			import(/* webpackChunkName: "analytical_map"*/ "../anchorMap/Map.vue"),
		toolbarComponent,
		geodatatypecomp,
		geoEMUcomp,
		PlaceholderChart,
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
	},
	data() {
		return {
			activityLogArr: [],
			source: "",
			dataType: "EMU",
			chartOptions: null,
			activeTab: "total",
			geoConfig: {},
			period: "",
			mapConfigAvailable: true,
			aMethodConfig: [],
			periodLength: 24,
			oResponse: null,
			mapConfigData: null,
			mapIndicatorID: "",
			bubbleMapIndicatorID: "",
			locationChanged: false,
			resetCurrentLevel: false,
			mapIndicatorName: "Map",
			defaultLevelID: "",
			toolbarLevelID: "",
			defaultLocationID: "",
			toolbarLocationID: "",
			subLevelID: "",
			locationValue: "",
			mapObj: {
				indiId: "",
				zoom: 7,
				lat: "",
				lang: "",
			},
			bubbleMapObj: {
				indiId: "",
				zoom: 7,
				lat: "",
				lang: "",
			},
			oCypFactorConf: null,
			emuResponse: null,
			emuModuleData: null,
			formatedLoc: "",
			formatedPeriod: "",
			isEMUData: true,
			leftMapChartInfo: "",
			globalPeriodData: null,
			showToolbarOnTablet: false,
			maptoggle: false,
			locationName: "",
			methodSeq: [],
			geoData: null,
			availableSource: [],
			periodType: "monthly",
			calsType: "aggregate",
			subMethodConf: [],
			applicationFinalYear: null,
			noEMUMapIndicatorChange: null,
		};
	},
	methods: {
		setReportChart(obj) {
			this.$emit("setReportChart", obj);
		},
		hideMap() {
			this.maptoggle = !this.maptoggle;
		},
		getCalType(val) {
			this.calsType = val;
		},
		async exportPPT() {
			this.$store.state.loading = true;
			let map = null;
			if (this.$refs.map) {
				map = await this.$refs.map.getScreenShot();
			}
			this.$store.state.loading = false;
			this.$refs.chartsSection.exportPPT({
				header: this.mapIndicatorName,
				screenShot: map,
			});
		},
		closeToolbar() {
			this.showToolbarOnTablet = false;
		},
		fullScreen() {
			setTimeout(() => {
				this.modalShow = true;
			}, 100);
		},
		simplifyChartOptions(p_arr) {
			let aChartarr = [];
			p_arr.forEach((ele) => {
				aChartarr.push(ele.chartOptions);
			});
			return aChartarr;
		},
		getGeoConfig(flag) {
			this.methodSeq = [];
			this.subMethodConf = [];
			this.aMethodConfig = [];
			if (this.dataType != "EMU") {
				let key = this.generateKey("adGeographicalModule");
				let namespace = this.reportChartData
					? this.reportChartData.selectedDashboard
					: "";
				service
					.getSavedConfig(key, false, namespace)
					.then((oGeoModule) => {
						this.checkAvailableSources(oGeoModule);
						// console.log("availableSource",availableSource)
						let aSelectedDE = [],
							sSelectedDE = "";
						this.oCypFactorConf = {};
						this.geoData = oGeoModule.data.sourceType[this.dataType];
						// console.log("geoData", this.geoData)
						let oGeoDataType = oGeoModule.data.sourceType[this.dataType];

						if (oGeoDataType) {
							this.chartOptions = this.simplifyChartOptions(
								oGeoDataType.derivedCharts
							);
							oGeoDataType.chartData.forEach((element) => {
								let { name, color, static_name } = element.indicator;
								let oData = {
									name: static_name,
									de: [],
									color,
								};

								//console.log(this.calsType)
								let isMethod = this.methodSeq.find(
									(m) => m === element.indicator.name
								);
								if (!isMethod) {
									this.methodSeq.push(element.indicator.name);
								}
								this.oCypFactorConf[static_name] = {};
								element.indicator.subIndicator.forEach((d) => {
									let sIndName = Array.isArray(d.static_name)
										? d.static_name[0]
										: d.static_name;
									let subName = Array.isArray(d.name) ? d.name[0] : d.name;
									this.oCypFactorConf[static_name][sIndName] = d.de;
									oData.de = [...oData.de, ...d.de];
									d.de.forEach((sd) => {
										aSelectedDE.push(sd);
									});
									let isMethod = this.subMethodConf.find(
										(m) => m.name === sIndName
									);
									if (!isMethod) {
										this.subMethodConf.push({
											de: d.de,
											name: sIndName,
											color: color,
										});
									}
								});
								let isMethodConfig = this.aMethodConfig.find(
									(m) => m.name === oData.name
								);
								if (!isMethodConfig) {
									this.aMethodConfig.push(oData);
								}
							});
							// console.log("this.methodSeq",this.methodSeq)
							// console.log("this.subMethodConf",this.subMethodConf)
							// console.log("this.aMethodConfig",this.aMethodConfig)
							//console.log(this.subMethodConf)
							sSelectedDE = aSelectedDE.join(";");
							this.sSelectedDE = sSelectedDE;
							let updatedToolbarLocationID = this.toolbarLocationID;
							let updatedSubLevelID = this.subLevelID;
							let updatedToolbarLevelID = this.toolbarLevelID;

							let levelID = this.appResponse.defaultLevelID,
								locationID = this.appResponse.defaultLocationID[0],
								subLevelID = this.appResponse.subLevelID;
							if (
								this.userDetails.dataViewOrganisationUnits[0].level >
								this.appResponse.defaultLevelID
							) {
								levelID = this.userDetails.dataViewOrganisationUnits[0].level;
								locationID = this.userDetails.dataViewOrganisationUnits[0].id;
								subLevelID =
									this.userDetails.dataViewOrganisationUnits[0].level * 1 + 1;
							}
							if (!flag && !this.reportChartData) {
								this.defaultLevelID = this.toolbarLevelID = levelID;
								this.defaultLocationID = this.toolbarLocationID = locationID;
								this.subLevelID = subLevelID;
								this.locationValue = levelID + "/" + locationID;
							}

							let alevel = [
								parseInt(this.locationValue.split("/")[0]),
								parseInt(this.locationValue.split("/")[0]) + 1,
							];

							let period = getDateRange({
								sendPeriod: this.period,
								periodType: this.periodType,
								periodLength: this.periodLength,
								applicationFinalYear: this.applicationFinalYear,
							});

							period = period.reverse().join(";");
							let newUpdatedLoctionID = "";
							if (this.isEMUData == false) {
								alevel = [updatedToolbarLevelID, updatedSubLevelID];
								newUpdatedLoctionID = updatedToolbarLocationID;
							} else {
								newUpdatedLoctionID = this.toolbarLocationID;
							}
							if (this.debugging) {
								console.log(
									"geoProgress - getGeoConfig() => API call started with params selected DE = '" +
										sSelectedDE +
										"', level = '" +
										alevel +
										"', location ID = '" +
										newUpdatedLoctionID +
										"', period = '" +
										period +
										"' @",
									this.$moment().format("MMMM Do YYYY, h:mm:ss a")
								);
								if (this.activityLogArr) {
									var obj_log = {
										name: "geoProgress - getGeoConfig()",
										time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
										content:
											"API call started with params selected DE = '" +
											sSelectedDE +
											"', level = '" +
											alevel +
											"', location ID = '" +
											newUpdatedLoctionID +
											"', period = '" +
											period,
									};
									this.activityLogArr.push(obj_log);
								}
							}
							service
								.getIndicatorData(
									sSelectedDE,
									alevel,
									newUpdatedLoctionID,
									period
								)
								.then((response) => {
									if (this.debugging) {
										console.log(
											"geoProgress - getGeoConfig() => API response received @",
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											var obj_log = {
												name: "geoProgress - getGeoConfig()",
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "API response received",
											};
											this.activityLogArr.push(obj_log);
										}
									}
									// console.log("geo response", response.data)
									this.oResponse = response.data;
									this.$store.state.loading = false;
									if (this.debugging && this.activityLogArr) {
										this.$emit("sendlog", this.activityLogArr);
									}
								})
								.catch((res) => {
									// console.log(res)
									if (this.debugging) {
										console.log(
											"geoProgress - getGeoConfig() => API response failed @",
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											var obj_log = {
												name: "geoProgress - getGeoConfig()",
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "API response failed" + res.stack,
											};
											this.activityLogArr.push(obj_log);
											this.$emit("sendlog", this.activityLogArr);
										}
									}
									if (!this.reportChartData) {
										this.showAlert();
									}
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: null,
											cid: [
												this.reportChartData.cid,
												...this.reportChartData.linkedCharts,
											],
										});
									}
								});
						} else {
							if (this.debugging) {
								if (this.activityLogArr) {
									var obj_log = {
										name: "geoProgress - getGeoConfig()",
										time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
										content: "Mapping not available",
									};
									this.activityLogArr.push(obj_log);
									this.$emit("sendlog", this.activityLogArr);
								}
							}
							if (this.reportChartData) {
								this.$emit("setReportChart", {
									chartObj: null,
									cid: [
										this.reportChartData.cid,
										...this.reportChartData.linkedCharts,
									],
								});
							}
							throw "Mapping not available";
						}
					})
					.catch((res) => {
						console.log(res);
						if (!this.reportChartData) {
							this.showAlert();
						}
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: null,
								cid: [
									this.reportChartData.cid,
									...this.reportChartData.linkedCharts,
								],
							});
						}
					});
			} else {
				this.getEMU();
			}
		},
		getLocationName(defaultLocationID) {
			// this.locationName = service.getLocationName(defaultLocationID);
			service.getIndividualOrganisation(defaultLocationID).then((key) => {
				// console.log(key)
				this.locationName = key.data.displayName;
			});
		},
		checkAvailableSources(oGeoModule) {
			let dataSources = [
				"Commodities_Client",
				"Commodities_Facilities",
				"User",
				"Visits",
			];
			let availableSource = ["EMU"];
			Object.keys(oGeoModule.data.sourceType).forEach((source) => {
				if (source != "EMU" && dataSources.includes(source)) {
					oGeoModule.data.sourceType[source].chartData.forEach((element) => {
						if (!availableSource.includes(source)) {
							let isMapping = element.indicator.subIndicator.find(
								(d) => d.de.length > 0
							);
							if (isMapping) {
								availableSource.push(source);
							}
						}
					});
				}
			});
			this.availableSource = availableSource;
		},
		getEMU() {
			console.log("getEMU() called");
			let key2 = this.generateKey("monthlyEMU"),
				key = this.generateKey("adGeographicalModule");
			if (this.periodType === "yearly") {
				key2 = this.generateKey("annualEMU");
			}
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			let loc = this.locationValue.split("/")[1];
			service
				.getSavedConfig(key, false, namespace)
				.then((oGeoModule) => {
					service
						.getSavedConfig(key2, false, namespace)
						.then((emuModule) => {
							let oGeoDataType = oGeoModule.data.sourceType["EMU"];
							this.checkAvailableSources(oGeoModule);
							// console.log(oGeoDataType.derivedCharts)
							this.chartOptions = this.simplifyChartOptions(
								oGeoDataType.derivedCharts
							);
							let period = translateDate({
								rawDate: this.period,
								periodType: this.periodType,
								monthlyFormat: "MMM YYYY",
							});

							service
								.getChildOrganisation(loc)
								.then((response) => {
									//this.comparingEMU(response.data, emuModule.data, loc, period)
									this.emuResponse = response.data;
									this.emuModuleData = emuModule.data;
									let emuFound = true;
									if (this.periodType === "yearly") {
										if (this.emuModuleData.compEMU) {
											emuFound = Object.keys(
												JSON.parse(this.emuModuleData.compEMU)
											).find((element) => element === loc);
										}
									} else {
										let emuT =
											typeof this.emuModuleData.emuTrend === "string"
												? JSON.parse(this.emuModuleData.emuTrend)
												: this.emuModuleData.emuTrend;
										emuFound = Object.keys(emuT).find(
											(element) => element === loc
										);
									}
									console.log("emuFound", emuFound);
									this.formatedLoc = loc;
									this.formatedPeriod = period;
									this.$store.state.loading = false;
									if (emuFound === undefined && this.dataType == "EMU") {
										let text = "";
										if (this.periodType == "yearly") {
											text = this.$i18n.t("referdqremuannualtogenerateresults");
										} else {
											text = this.$i18n.t(
												"referdqremumonthlytogenerateresults"
											);
										}
										this.isEMUData = false;
										this.$swal({
											title:
												this.$i18n.t("emudatanotavailablefor") +
												" " +
												this.locationName,
											text: text,
										}).then(() => {
											//this.dataType = 'Commodities_Client'
											this.getSource("Commodities_Client");
											//this.updateGeoCharts()
										});
									} else {
										this.isEMUData = true;
									}
								})
								.catch((res) => {
									console.log(res);
									if (this.debugging) {
										console.log(
											"service.getChildOrganisation() failed @" +
												this.$moment().format("MMMM Do YYYY, h:mm:ss a")
										);
										if (this.activityLogArr) {
											var obj_log = {
												name: "geoProgress - service.getChildOrganisation()",
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "Failed" + res.stack,
											};
											this.activityLogArr.push(obj_log);
											this.$emit("sendlog", this.activityLogArr);
										}
									}

									//this.showAlert();
								});
						})
						.catch((res) => {
							// this.source = 'Commodities_Client'
							console.log(res);
							this.isEMUData = false;
							this.$store.state.loading = false;
							this.$swal({
								title:
									this.$i18n.t("emudatanotavailablefor") +
									" " +
									this.locationName,
								text: this.$i18n.t("referdqremumonthlytogenerateresults"),
							}).then(() => {
								//this.dataType = 'Commodities_Client'
								this.getSource("Commodities_Client", true);
								//this.updateGeoCharts()
							});
						});
				})
				.catch(() => {
					//this.showAlert();
				});
		},
		getMapConfig() {
			let key = this.generateKey("adAnchorMapModule");
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			service
				.getSavedConfig(key, false, namespace)
				.then((amResponse) => {
					if (this.debugging) {
						console.log(
							"service.getSavedConfig() received @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "geoProgress - service.getSavedConfig()",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: " data received",
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}

					//console.log(this.defaultLevelID, this.defaultLocationID ,this.subLevelID, this.locationValue);
					let anchorMapConfig = amResponse.data.anchorMap.anchorMap;

					if (anchorMapConfig) {
						//console.log(anchorMapConfig.mapOptions.mapZoom)
						this.mapObj.zoom = Number(anchorMapConfig.mapOptions.mapZoom);
						this.mapObj.lang = anchorMapConfig.mapOptions.lng;
						this.mapObj.lat = anchorMapConfig.mapOptions.lat;

						let EMUData = anchorMapConfig.mapData.find(
								(m) => !m.indicator.dataMapping
							),
							noEMUData = anchorMapConfig.mapData.filter(
								(m) => m.indicator.dataMapping
							);
						// console.log("EMUData",EMUData)
						// console.log("noEMUData",noEMUData)
						if (EMUData) {
							noEMUData.unshift(EMUData);
							this.mapIndicatorID = this.mapObj.indiId =
								EMUData.indicator.subIndicator[0].de[0];
							this.mapIndicatorName = EMUData.indicator.name;
						} else {
							this.mapIndicatorID = this.mapObj.indiId =
								anchorMapConfig.mapData[0].indicator.subIndicator[0].de[0];
							this.mapIndicatorName = anchorMapConfig.mapData[0].indicator.name;
						}

						this.mapConfigData = noEMUData;

						this.bubbleMapObj.zoom = Number(anchorMapConfig.mapOptions.mapZoom);
						this.bubbleMapObj.lang = anchorMapConfig.mapOptions.lng;
						this.bubbleMapObj.lat = anchorMapConfig.mapOptions.lat;
						this.bubbleMapIndicatorID = this.bubbleMapObj.indiId =
							"bubbleChart";

						this.mapConfigAvailable = true;
					} else {
						this.mapConfigAvailable = false;
					}
				})
				.catch((res) => {
					if (this.debugging) {
						console.log(
							"service.getSavedConfig() failed @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "geoProgress - service.getSavedConfig()",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Failed" + res.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
					this.mapConfigAvailable = false;
					// console.log(res)
					this.showAlert();
				});
		},
		showAlert() {
			this.$store.state.loading = false;
			if (this.$store.state.isAdmin) {
				// Popup message to set the configurations
				this.$swal({
					title: this.$i18n.t("configurationnotavailable"),
					text: this.$i18n.t("pleasesetyourconfiguration"),
					showCancelButton: true,
					confirmButtonText: this.$i18n.t("configurenow"),
				}).then((result) => {
					if (result.value) {
						this.$router.push("/config");
					} else {
						this.dataType = "Commodities_Client";
					}
				});
			} else {
				// Popup message to contact admin for the configurations
				this.$swal({
					title: this.$i18n.t("configurationnotavailable"),
					text: this.$i18n.t("error_text_2"),
				}).then(() => {
					this.dataType = "Commodities_Client";
				});
			}
		},
		getSource(source, emuNotAvailable = false) {
			this.subMethodConf = [];
			this.source = source;
			this.dataType = source;
			this.oResponse = null;
			this.emuResponse = null;
			this.getGeoConfig(true);
			// this.activeTab = "total";
			if (emuNotAvailable) {
				// console.log("mapConfigData", this.mapConfigData)
				let configData = this.mapConfigData.filter(
					(m) => m.indicator.visible && m.indicator.dataMapping
				);
				// console.log("configData", configData)
				if (configData.length) {
					this.noEMUMapIndicatorChange =
						configData[0].indicator.subIndicator[0].de[0];
				}
			}
		},
		getLocation(location) {
			var res = location.split("/");

			this.toolbarLevelID = parseInt(res[0]);

			this.subLevelID = parseInt(res[0]) + 1;
			this.toolbarLocationID = res[1];
			this.locationValue = "";
			this.locationValue = location;
			this.locationChanged = true;

			this.updateGeoCharts();
			this.getLocationName(this.toolbarLocationID);
			setTimeout(() => {
				this.mapObj.indiId = "";
				this.mapObj.indiId = this.mapIndicatorID;
			}, 900);
		},
		getMapIndicatorID(id) {
			//console.log("mapIndicatorID", id)
			this.mapIndicatorID = id;
			this.mapObj.indiId = "";
			this.mapObj.indiId = this.mapIndicatorID;

			// console.log(this.mapConfigData)
			if (id != "monthlyEMU") {
				this.resetCurrentLevel = false;
			} else {
				this.resetCurrentLevel = false; //initially the value is "true", changed to "false" for issue :: when we change location from toolbar after that we change Map indicator from Reporting rate to Monthly EMU we are getting higher level map instead of regional map.
			}
		},
		getPeriod(p, periodType) {
			this.period = p;
			this.periodType = periodType;
			this.updateGeoCharts();
			// this.locationValue = this.locationValue
			this.mapObj.indiId = "";
			this.mapObj.indiId = this.mapIndicatorID;
		},
		getDataType(r) {
			this.dataType = r;
		},
		changeChartType(newValue, chart) {
			this.nationalRegionReportingTrendOutier = [];
			this[chart].chart.type = newValue.toLowerCase();
		},
		getIndicatordata(id) {
			this.mapObj.indiId = id;
		},
		setIndicatordata(iobj) {
			// console.log(iobj)
			// console.log(this.emuModuleData)
			// console.log(this.locationValue)
			if (iobj[0].indicator.static_name === "Monthly EMU") {
				let src = "",
					loc = this.locationValue.split("/")[1];
				if (this.emuModuleData) {
					src = this.emuModuleData.totalEMU[loc].source
						? this.emuModuleData.totalEMU[loc].source
						: "";
				}
				if (src) {
					this.mapIndicatorName = `${iobj[0].indicator.name}: ${src}`;
				} else {
					this.mapIndicatorName = iobj[0].indicator.name;
				}
			} else {
				this.mapIndicatorName = iobj[0].indicator.name;
			}
			this.leftMapChartInfo = iobj[0].indicator.chartInfo;
			//this.sourceName = 'Source: ' + this.sourecArr.filter(obj => obj.sourceid == iobj.sourceId[0])[0]["sourcename"]
		},
		setLocationOnReset(location) {
			this.locationValue = location;
		},
		updateGeoCharts() {
			this.oResponse = null;
			let alevel = [this.toolbarLevelID, this.subLevelID];
			let period = getDateRange({
				sendPeriod: this.period,
				periodType: this.periodType,
				periodLength: this.periodLength,
				applicationFinalYear: this.applicationFinalYear,
			});
			period = period.reverse().join(";");
			this.emuResponse = null;
			// this.emuModuleData = null
			this.formatedLoc = "";
			this.formatedPeriod = "";
			//console.log(this.isEMUData)
			if (this.isEMUData == true && this.dataType == "EMU") {
				this.getEMU();
			}

			if (this.sSelectedDE != undefined) {
				service
					.getIndicatorData(
						this.sSelectedDE,
						alevel,
						this.toolbarLocationID,
						period
					)
					.then((response) => {
						this.oResponse = "";
						// console.log("geo response updated", response.data)
						this.oResponse = response.data;
						this.$store.state.loading = false;
						// console.log(this.oResponse)
					})
					.catch((res) => {
						console.log(res);
						this.showAlert();
					});
			}
		},
	},
	watch: {
		maptoggle() {
			this.$store.state.loading = true;
			let oResponse = this.oResponse;
			let emuResponse = this.emuResponse;
			setTimeout(() => {
				this.oResponse = null;
				this.emuResponse = null;
			}, 50);
			setTimeout(() => {
				this.oResponse = oResponse;
				this.emuResponse = emuResponse;
				this.$store.state.loading = false;
			}, 50);
			// this.getGeoConfig(true);
		},
		activateSubTabs(newValue) {
			console.log("newValue", newValue);
			this.activeTab = newValue;
		},
	},
	created() {
		this.activeTab = this.activateSubTabs;
		if (this.reportChartData) {
			// console.log("this.reportChartData", this.reportChartData)
			this.periodType = this.reportPeriodType;
			this.dataType = this.reportChartData.selectedSource;
		}
		if (this.globalResponse.period && this.globalResponse.period.Period) {
			this.globalPeriodData = this.globalResponse.period.Period;
			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(
					this.globalResponse.period.Period.backtrackedMonth * 1,
					"months"
				)
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(
					this.globalResponse.period.Period.backtrackedYearLimit * 1,
					"years"
				)
				.format("YYYY-MM");
			this.period = this.reportChartData ? this.reportPeriod : currentDate;
			this.applicationFinalYear = this.$moment(currentFinalDate, "YYYY").format(
				"YYYY"
			);
		}
		let { locationID, levelID, subLevelID } = service.getAllowedLocation();
		this.defaultLevelID = this.toolbarLevelID = this.reportChartData
			? this.reportDefaultLevelID * 1
			: levelID;
		this.defaultLocationID = this.toolbarLocationID = this.reportChartData
			? this.reportDefaultLocationID
			: locationID;
		this.subLevelID = this.reportChartData
			? this.reportSubLevelID * 1
			: subLevelID;
		this.locationValue = this.reportChartData
			? this.reportLocationValue
			: levelID + "/" + locationID;

		this.getLocationName(this.defaultLocationID);
		if (!this.reportChartData) {
			this.getMapConfig();
		}
		this.getGeoConfig();
	},
};
</script>
<style scoped>
.outlier_scrollbar {
	max-height: 150px;
	overflow-y: auto;
}
</style>