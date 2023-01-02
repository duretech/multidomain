<template>
	<div>
		<div class="container-fluid px-0">
			<div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
				<a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
			</div>
			<div class="row">
				<div class="col-lg-12 pl-0 pr-0 d-none">
					<ul
						class="nav nav-pills mb-3"
						id="benchmarking-sub-tab"
						role="tablist"
					>
						<li class="nav-item">
							<a
								class="nav-link active"
								id="benchmarking-comclient-tab"
								data-toggle="pill"
								href="#benchmarking-comclient"
								role="tab"
								aria-controls="benchmarking-comclient"
								aria-selected="true"
								@click="getActiveTab('monthly')"
								>{{ $t("emu_monthly") }}</a
							>
						</li>
						<li class="nav-item">
							<a
								class="nav-link"
								id="benchmarking-comfacilities-tab"
								data-toggle="pill"
								href="#benchmarking-comfacilities"
								role="tab"
								aria-controls="benchmarking-comfacilities"
								aria-selected="false"
								@click="getActiveTab('annual')"
								>{{ $t("emuAnnual") }}</a
							>
						</li>
					</ul>
				</div>
				<div class="col-12">
					<div
						class="row dashboardchart-container"
						id="progtabwrapper"
						:class="{ toggled: maptoggle }"
					>
						<div v-if="mapConfigAvailable" class="col-5 p-x-0px">
							<SummaryComponent
								:selectedDate="period"
								:indicator1="mapIndicatorName"
								:dhsValue="dhsValue"
								:currentValue="currentValue"
								:previousValue="previousValue"
								indicator2=""
								style="color: #dad7d7"
							/>
							<div class="map-collapse-btndiv d-none">
								<a
									href="javascript:void(0)"
									class="color-white d-none"
									id="progmap-toggle1"
									@click.prevent="hideMap"
								>
									{{ maptoggle ? $t("showMap") : $t("hideMap") }}
									<span><i class="fa fa-arrows-v"></i></span>
								</a>
							</div>
							<div class="map-borderdiv d-none">
								<img
									alt="img"
									:src="require('@/assets/img/map-border.png')"
									class="img img-fluid"
								/>
							</div>
							<div class="row" id="progmapcontainer" v-if="loadMap">
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
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
							class="col-7"
							id="progchartcontainer"
							
							v-if="monthlyEMU"
						>
							<div class="tab-content" id="benchmarking-sub-tabContent">
								<div
									class="tab-pane fade show active"
									id="benchmarking-comclient"
									role="tabpanel"
									aria-labelledby="benchmarking-comclient-tab"
								>
									<div
										class="row dashboardchart-container position-relative"
										:class="{ 'h-752px': bShowLoader }"
									>
										<loader v-if="bShowLoader" class="cardLoader" />
										<!-- <div
                      class="m-b-30px"
                      :class="layoutView"
                      v-if="flagTableData.length"
                    >
                      <b-table
                        sticky-header
                        :items="flagTableData"
                        :fields="flagTableFields"
                        bordered
                        responsive
                      ></b-table>
                    </div> -->
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="totalEMUChartData"
										>
											<card-component
												:chartdata="totalEMUChartData"
												:showSource="true"
												:canComment="canComment"
												defaultSort="JAN-DEC"
												sorting="type3"
												:setExtreme="true"
												key="monthlyChart1"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="trendsChartData"
										>
											<card-component
												:chartdata="trendsChartData"
												:period="true"
												:showSource="true"
												:aggregate="true"
												chartName="trend"
												:caltype="calType"
												:canComment="canComment"
												defaultSort="JAN-DEC"
												sorting="type3"
												:setExtreme="true"
												key="monthlyChart2"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="methodTrendsChartData"
										>
											<card-component
												:chartdata="methodTrendsChartData"
												:showSource="true"
												:aggregate="true"
												chartName="methodSpecific"
												:caltype="calType"
												:canComment="canComment"
												defaultSort="JAN-DEC"
												sorting="type3"
												:setExtreme="true"
												key="monthlyChart3"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="oneMonthEMUChartData"
										>
											<card-component
												:chartdata="oneMonthEMUChartData"
												:showSource="true"
												:aggregate="true"
												chartName="monthSpecific"
												:caltype="calType"
												:canComment="canComment"
												defaultSort="A-Z"
												sorting="type2"
												:setExtreme="true"
												key="monthlyChart4"
											/>
										</div>
									</div>
									<div class="text-center" v-if="monthlyNoData">
										<b-alert variant="info" show class="m-0"
											><h5 class="m-0">{{ monthlyNoData }}</h5></b-alert
										>
									</div>
								</div>
								<div
									class="tab-pane fade"
									id="benchmarking-comfacilities"
									role="tabpanel"
									aria-labelledby="benchmarking-comfacilities-tab"
								>
									<div
										class="row dashboardchart-container position-relative"
										:class="{ 'h-752px': bShowLoader1 }"
									>
										<loader v-if="bShowLoader1" class="cardLoader" />
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="comparingEMU"
										>
											<dqrcardComponent
												:chartdata="comparingEMU"
												:showSource="true"
												:canComment="canComment"
												defaultSort="JAN-DEC"
												sorting="type3"
												key="annualChart1"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="comparingAverageAnnual"
										>
											<dqrcardComponent
												:chartdata="comparingAverageAnnual"
												:showSource="true"
												:canComment="canComment"
												defaultSort="A-Z"
												sorting="type4"
												key="annualChart2"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="comparingUsers"
										>
											<dqrcardComponent
												:chartdata="comparingUsers"
												:showSource="true"
												:canComment="canComment"
												defaultSort="A-Z"
												sorting="type4"
												key="annualChart3"
											/>
										</div>
										<div
											class="m-b-30px"
											:class="layoutView"
											v-if="annualuserTrendsDataByMethods"
										>
											<!-- <card-component  :chartdata="usersTrend"/> -->
											<dqrcardComponent
												:chartdata="annualuserTrendsDataByMethods"
												:ddOptions="userMethodList"
												:handleFilterChange="handleUserMthdChange"
												:showSource="true"
												:canComment="canComment"
												defaultSort="JAN-DEC"
												sorting="type3"
												key="annualChart4"
											/>
										</div>
									</div>
									<div class="text-center" v-if="annualNoData">
										<b-alert variant="info" show class="m-0"
											><h5 class="m-0">{{ annualNoData }}</h5></b-alert
										>
									</div>
								</div>
							</div>
						</div>
						<div
							class="col-7"
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
							v-else
						>
							<PlaceholderChart />
						</div>
					</div>
				</div>
			</div>
			<toolbarComponent
				v-if="mapIndicatorID && layoutView && locationValue"
				@mapIndicatorID="getMapIndicatorID"
				:mapIndicatorID="mapIndicatorID"
				:mapConfigData="mapConfigData"
				:showView="false"
				:showIndicator="true"
				:layoutView="layoutView"
				@view="setView"
				:globalPeriodData="globalPeriodData"
				:showLocation="true"
				@location="getLocation"
				:locationValue="locationValue"
				@closeToolbar="closeToolbar"
				:showToolbarOnTablet="showToolbarOnTablet"
				:activeTab="activeTab"
				@calsType="getCalType"
			/>
			<!-- defaultCalType="method" -->
		</div>
	</div>
</template>
<script>
/*global settings*/
import service from "@/service";
import cardComponent from "../../dqr/monthly/cardComponent";
import dqrcardComponent from "../../dqr/emuAnnual/cardComponent";
import toolbarComponent from "../toolbarComponent";
import CalculateFlagMixin from "@/helpers/CalculateFlagMixin";
import PlaceholderChart from "@/components/Common/PlaceholderChart";
export default {
	props: [
		"dhsValue",
		"debugging",
		"globalResponse",
		"flagKey",
		"activeTabKey",
		"facilityLevelID",
	],
	mixins: [CalculateFlagMixin],
	data() {
		return {
			bShowLoader: true,
			bShowLoader1: true,
			trendsChartData: null,
			methodTrendsChartData: null,
			totalEMUChartData: null,
			oneMonthEMUChartData: null,
			comparingEMU: null,
			comparingAverageAnnual: null,
			comparingUsers: null,
			usersTrend: null,
			userMethodList: null,
			selectedUserMethod: 0,
			annualuserTrendsDataByMethods: null,
			monthlyTabExist: false,
			annualTabExist: false,
			applicationData: null,
			layoutView: "",
			locationValue: "",
			showToolbarOnTablet: false,
			monthlyEMU: null,
			annualEMU: null,
			activeTab: "monthly",
			calType: "aggregate",
			canComment: false,
			dqrResponse: null,
			monthlyNoData: "",
			annualNoData: "",
			activityLogArr: [],
			globalPeriodData: null,
			mapConfigAvailable: true,
			maptoggle: false,
			loadMap: true,
			leftMapChartInfo: "",
			mapIndicatorName: "Map",
			mapConfigData: null,
			mapObj: {
				indiId: "",
				zoom: 7,
				lat: "",
				lang: "",
			},
			defaultLevelID: "",
			defaultLocationID: "",
			subLevelID: "",
			period: "",
			periodLength: 24,
			resetCurrentLevel: false,
			locationChanged: false,
			toolbarLevelID: "",
			toolbarLocationID: "",
			locationName: "",
			periodType: "monthly",
			mapIndicatorID: "",
			currentValue: "",
			previousValue: "",
			flagTableData: [],
			flagTableFields: [],
		};
	},
	components: {
		cardComponent,
		dqrcardComponent,
		toolbarComponent,
		PlaceholderChart,
		SummaryComponent: () =>
			import(
				/* webpackChunkName: "analytical_summaryComponent"*/ "@/components/FPDashboard/analyticalNew/SummaryComponent"
			),
		anchorMap: () =>
			import(/* webpackChunkName: "analytical_map"*/ "../anchorMap/Map.vue"),
	},
	watch: {
		activeTabKey(newValue) {
			console.log("in watch activeTabKey newValue", newValue);
			this.loadMap = false;
			this.$nextTick(() => {
				this.loadMap = true;
			});
		},
	},
	methods: {
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
		getCalType(val) {
			this.calType = val;
			this.flagTableData = [];
			this.flagTableFields = [];
			this.$emit("resetFlagDetails", this.flagKey);
			this.$nextTick(() => {
				this.calculateFlag({
					rawData: this.monthlyEMU,
					globalFactorsData: this.globalResponse,
					location: this.locationValue,
					type: "type1",
					periodType: "monthly",
					calType: this.calType,
				});
			});
		},
		getActiveTab(tab) {
			this.activeTab = tab;
		},
		closeToolbar() {
			this.showToolbarOnTablet = false;
		},
		setView(view) {
			this.layoutView = view;
			localStorage.setItem("adBenchmarkLayout", view);
			this.bShowLoader = true;
			this.bShowLoader1 = true;
			const totalEMUChartData = this.totalEMUChartData,
				trendsChartData = this.trendsChartData,
				methodTrendsChartData = this.methodTrendsChartData,
				oneMonthEMUChartData = this.oneMonthEMUChartData,
				comparingEMU = this.comparingEMU,
				comparingAverageAnnual = this.comparingAverageAnnual,
				comparingUsers = this.comparingUsers,
				annualuserTrendsDataByMethods = this.annualuserTrendsDataByMethods;

			this.totalEMUChartData = null;
			this.trendsChartData = null;
			this.methodTrendsChartData = null;
			this.oneMonthEMUChartData = null;
			this.comparingEMU = null;
			this.comparingAverageAnnual = null;
			this.comparingUsers = null;
			this.annualuserTrendsDataByMethods = null;

			setTimeout(() => {
				this.totalEMUChartData = totalEMUChartData;
				this.trendsChartData = trendsChartData;
				this.methodTrendsChartData = methodTrendsChartData;
				this.oneMonthEMUChartData = oneMonthEMUChartData;
				this.comparingEMU = comparingEMU;
				this.comparingAverageAnnual = comparingAverageAnnual;
				this.comparingUsers = comparingUsers;
				this.annualuserTrendsDataByMethods = annualuserTrendsDataByMethods;
				this.bShowLoader = false;
				this.bShowLoader1 = false;
			}, 100);
			// this.bShowLoader = true
			// this.getGlobalConfig()
		},
		getLocation(location) {
			// console.log(location);
			var res = location.split("/");

			this.toolbarLevelID = parseInt(res[0]);
			this.subLevelID = parseInt(res[0]) + 1;
			this.toolbarLocationID = res[1];
			this.locationValue = "";
			this.trendsChartData = null;
			this.methodTrendsChartData = null;
			this.totalEMUChartData = null;
			this.oneMonthEMUChartData = null;
			this.caltype = "aggregate";
			this.locationValue = location;
			this.annualuserTrendsDataByMethods = null;
			this.bShowLoader = true;
			this.bShowLoader1 = true;
			this.locationChanged = true;
			this.$emit("resetFlagDetails", this.flagKey);
			this.flagTableData = [];
			this.flagTableFields = [];
			this.getLocationName(this.toolbarLocationID);
			setTimeout(() => {
				this.mapObj.indiId = "";
				this.mapObj.indiId = this.mapIndicatorID;
			}, 900);
			this.$nextTick(() => {
				if (this.monthlyEMU) {
					this.drawMonthlyEMUCharts();
				}
				if (this.annualEMU) {
					this.drawAnnualEMUCharts();
				}
			});
		},
		getConfig() {
			let { locationID, levelID } = service.getAllowedLocation();
			this.locationValue = levelID + "/" + locationID;

			let key = this.generateKey("dqrModule");

			service
				.getSavedConfig(key)
				.then((response) => {
					this.dqrResponse = response.data;
					if (this.debugging) {
						console.log(
							"Monthly Tab - Config Data Response received @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "Monthly Tab - Config ",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Data Response received ",
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
				})
				.then(() => {
					this.getSavedEMU();
				})
				.catch((res) => {
					this.bShowLoader = false;
					this.bShowLoader1 = false;
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
							}
						});
					} else {
						// Popup message to contact admin for the configurations
						this.$swal({
							title: this.$i18n.t("configurationnotavailable"),
							text: this.$i18n.t("error_text_2"),
						});
					}
					if (this.debugging) {
						if (this.activityLogArr) {
							var obj_log = {
								name: "Monthly Tab - Config ",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Data Response failed " + res.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
						console.log(
							"Monthly Tab - Config Data Response failed @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
								+res.stack
						);
					}
				});
		},
		getSavedEMU() {
			let locale = this.$i18n.locale,
				key = `monthlyEMU_${locale}`,
				key1 = `annualEMU_${locale}`;
			if (!settings.country) {
				let appId = this.$store.state.appId ? this.$store.state.appId : "",
					appUserId = this.$store.state.appUserId
						? this.$store.state.appUserId
						: "";
				if (appId && appUserId) {
					key = `${appUserId}_${appId}_monthlyEMU_${locale}`;
					key1 = `${appUserId}_${appId}_annualEMU_${locale}`;
				} else {
					this.showLocalStorageError();
					return;
				}
			}

			service
				.getSavedConfig(key)
				.then((oGlobal) => {
					this.monthlyEMU = oGlobal;
					this.drawMonthlyEMUCharts();
					if (this.debugging) {
						console.log(
							"monthlyEMU - Config Data Response received @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "monthlyEMU",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Config Data Response received ",
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
				})
				.catch((res) => {
					this.bShowLoader = false;
					this.monthlyNoData = this.$i18n.t("no_data_to_display");
					if (this.debugging) {
						console.log(
							"monthlyEMU - Config Data Response failed @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
								res.stack
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "monthlyEMU",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Config Data Response failed " + res.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
				});

			service
				.getSavedConfig(key1)
				.then((aGlobal) => {
					this.annualEMU = aGlobal;
					this.drawAnnualEMUCharts();
					if (this.debugging) {
						console.log(
							"annualEMU - Config Data Response received @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "annualEMU",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Config Data Response received ",
							};
							this.activityLogArr.push(obj_log);
						}
					}
				})
				.catch((res) => {
					this.bShowLoader1 = false;
					this.annualNoData = this.$i18n.t("no_data_to_display");
					if (this.debugging) {
						console.log(
							"annualEMU - Config Data Response failed @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
								res.stack
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "annualEMU",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Config Data Response failed " + res.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
				});
		},
		drawMonthlyEMUCharts() {
			this.calculateFlag({
				rawData: this.monthlyEMU,
				globalFactorsData: this.globalResponse,
				location: this.locationValue,
				type: "type1",
				periodType: "monthly",
				calType: this.calType,
			});
			let locId = this.locationValue.split("/")[1];
			// console.log("locId", locId);
			let totalEMU =
				typeof this.monthlyEMU.data["totalEMU"] === "string"
					? JSON.parse(this.monthlyEMU.data["totalEMU"])
					: this.monthlyEMU.data["totalEMU"];
			// let totalEMU = this.monthlyEMU.data['totalEMU'] ? this.monthlyEMU.data['totalEMU'] : null
			// console.log("totalEMU", totalEMU);
			// console.log("totalEMU[locId]", totalEMU[locId]);
			if (totalEMU[locId]) {
				// console.log("dqrResponse", this.dqrResponse)
				let savedEMU = this.dqrResponse.emu_monthly.Background_Data.autoSaveEMU;
				let dqrData = this.dqrResponse.emu_monthly[savedEMU].derivedCharts;
				let d = new Date();
				let defaultDate = this.$moment(d, "YYYYMM").subtract(
					this.globalResponse.period.Period.backtrackedMonth * 1,
					"months"
				);
				let selectedDate = this.$moment(defaultDate, "YYYYMM").format(
					"MMM YYYY"
				);
				let totalEMUChartData = totalEMU[locId] ? totalEMU[locId] : null;
				if (totalEMUChartData) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === totalEMUChartData.cid
					);
					if (data) {
						data = data.chartOptions;
						totalEMUChartData.title = data.chartName;
						totalEMUChartData.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						totalEMUChartData.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
						totalEMUChartData.type = "line";
						totalEMUChartData.max = 11;
						totalEMUChartData["categories"] = [];
						totalEMUChartData["data"] = [];
						let pe = [],
							formatedCatArray = [];
						for (let i = 23; i >= 0; i--) {
							if (i === 0) {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
								);
							} else {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY")
										.subtract(i, "months")
										.format("YYYYMM")
								);
							}
						}
						totalEMUChartData.saveCategories.forEach((c) =>
							formatedCatArray.push(
								this.$moment(c, "MMM YYYY").format("YYYYMM")
							)
						);
						let items = [],
							fields = [];
						fields.push(
							{ key: "Period", value: this.$i18n.t("period") }
							// {
							//   key: "Value",
							//   value: this.$i18n.t("value"),
							// }
						);
						let currPeriod = this.$moment(selectedDate, "MMM YYYY").format(
							"YYYYMM"
						);
						let prevPeriod = this.$moment(selectedDate, "MMM YYYY")
							.subtract(1, "months")
							.format("YYYYMM");
						totalEMUChartData.saveData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.name,
								data: [],
								//color: sData.color,
							};
							let methodName = sData.name;
							fields.push(methodName);
							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);
									if (p === currPeriod) {
										this.currentValue = reqData[catIndex];
									}
									if (p === prevPeriod) {
										this.previousValue = reqData[catIndex];
									}
									if (!totalEMUChartData.categories.includes(formatedDate))
										totalEMUChartData.categories.push(formatedDate);
								}
							});
							totalEMUChartData["data"].push(obj);
						});
						totalEMUChartData.categories.forEach((p, i) => {
							let innObj = { Period: p };
							totalEMUChartData.data.forEach((sData) => {
								let reqData = sData.data;
								let methodName = sData.trans_name
									? sData.trans_name
									: sData.name;
								innObj[methodName] = reqData[i] ? reqData[i] : null;
							});
							items.push(innObj);
						});
						// let reqData = totalEMUChartData.saveData[0].data;
						// let obj = {
						//   name: totalEMUChartData.saveData[0].name,
						//   data: [],
						// };
						// let items = [],
						//   fields = [];
						// fields.push(
						//   { key: "Period", value: this.$i18n.t("period") },
						//   {
						//     key: "Value",
						//     value: this.$i18n.t("value"),
						//   }
						// );
						// pe.forEach((p, i) => {
						//   let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
						//   if (formatedCatArray.includes(p)) {
						//     let catIndex = formatedCatArray.indexOf(p);
						//     obj.data.push(reqData[catIndex]);
						//     totalEMUChartData.categories.push(formatedDate);
						//     items.push({ Period: formatedDate, Value: reqData[catIndex] });
						//   }
						// });
						totalEMUChartData["fields"] = fields;
						totalEMUChartData["tableData"] = [
							{
								name: this.$i18n.t("EMU"),
								data: items,
							},
						];
						//totalEMUChartData["data"].push(obj);
					}
					this.totalEMUChartData = totalEMUChartData;
				} else {
					this.totalEMUChartData = null;
				}
				// let eTrend = this.monthlyEMU.data['emuTrend'] ? JSON.parse(this.monthlyEMU.data['emuTrend']) : null
				let eTrend =
					typeof this.monthlyEMU.data["emuTrend"] === "string"
						? JSON.parse(this.monthlyEMU.data["emuTrend"])
						: this.monthlyEMU.data["emuTrend"];
				let trendsChartData = eTrend[locId] ? eTrend[locId] : null;
				if (trendsChartData) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === trendsChartData.cid
					);
					if (data) {
						data = data.chartOptions;
						trendsChartData.chartInfo = data.chartInfo;
						trendsChartData.title = data.chartName;
						trendsChartData.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						trendsChartData.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
						trendsChartData.max = 11;
						trendsChartData["categories"] = [];
						trendsChartData["data"] = [];
						let pe = [],
							formatedCatArray = [];
						for (let i = 23; i >= 0; i--) {
							if (i === 0) {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
								);
							} else {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY")
										.subtract(i, "months")
										.format("YYYYMM")
								);
							}
						}
						trendsChartData.saveCategories.forEach((c) =>
							formatedCatArray.push(
								this.$moment(c, "MMM YYYY").format("YYYYMM")
							)
						);
						let items = [],
							agreItems = [],
							fields = [{ key: "Period", value: this.$i18n.t("period") }];
						trendsChartData.saveData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.trans_name ? sData.trans_name : sData.name,
								data: [],
								color: sData.color,
							};
							let methodName = sData.trans_name ? sData.trans_name : sData.name;
							fields.push(methodName);
							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);

									if (!trendsChartData.categories.includes(formatedDate))
										trendsChartData.categories.push(formatedDate);
								}
							});
							trendsChartData["data"].push(obj);
						});
						let agreDataTemp = [];
						trendsChartData.agreData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.trans_name ? sData.trans_name : sData.name,
								data: [],
								color: sData.color,
							};
							// let methodName = sData.trans_name ? sData.trans_name : sData.name;
							//fields.push(methodName)
							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);

									if (!trendsChartData.categories.includes(formatedDate))
										trendsChartData.categories.push(formatedDate);
								}
							});
							agreDataTemp.push(obj);
						});
						trendsChartData["agreData"] = agreDataTemp;
						trendsChartData["fields"] = fields;

						trendsChartData.categories.forEach((p, i) => {
							let innObj = { Period: p };
							let agreObj = { Period: p };
							trendsChartData.data.forEach((sData) => {
								let reqData = sData.data;
								let methodName = sData.trans_name
									? sData.trans_name
									: sData.name;
								innObj[methodName] = reqData[i] ? reqData[i] : null;
							});
							items.push(innObj);
							trendsChartData.agreData.forEach((sData) => {
								let reqData = sData.data;
								let methodName = sData.trans_name
									? sData.trans_name
									: sData.name;
								agreObj[methodName] = reqData[i] ? reqData[i] : null;
							});
							agreItems.push(agreObj);
						});
						trendsChartData["tableData"] = [
							{
								name: this.$i18n.t("EMU"),
								data: items,
							},
						];
						trendsChartData["agreTableData"] = [
							{
								name: this.$i18n.t("EMU"),
								data: agreItems,
							},
						];
						//let items=[],fields=[],newFields=[];
						// if (trendsChartData.tableData) {
						//   trendsChartData.tableData[0]['data'].forEach(key => {
						//     Object.keys(key).forEach(field => {
						//       if (newFields.indexOf(field) == -1) {
						//         newFields.push(field)
						//         if(field == 'Period' || field == 'Value'){
						//           fields.push({key: field, sortable: true})
						//         }else{
						//           fields.push(field)
						//         }
						//       }
						//     })
						//     items.push(key)
						//   })
						// }
						//trendsChartData['tableData'] = this.items
						// trendsChartData['fields'] = this.fields
					}
					this.trendsChartData = trendsChartData;
				} else {
					this.trendsChartData = null;
				}
				// let methodTrend = this.monthlyEMU.data['methodTrend'] ? JSON.parse(this.monthlyEMU.data['methodTrend']) : null
				let methodTrend =
					typeof this.monthlyEMU.data["methodTrend"] === "string"
						? JSON.parse(this.monthlyEMU.data["methodTrend"])
						: this.monthlyEMU.data["methodTrend"];
				let methodTrendsChartData = methodTrend[locId]
					? methodTrend[locId]
					: null;
				if (methodTrendsChartData) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === methodTrendsChartData.cid
					);
					// console.log("data",data)
					let items = [],
						agreItems = [],
						fields = [{ key: "Period", value: this.$i18n.t("period") }];
					if (data) {
						data = data.chartOptions;
						methodTrendsChartData.chartInfo = data.chartInfo;
						methodTrendsChartData.title = data.chartName;
						methodTrendsChartData.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						methodTrendsChartData.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
						methodTrendsChartData.max = 11;
						methodTrendsChartData["categories"] = [];
						methodTrendsChartData["data"] = [];
						let pe = [],
							formatedCatArray = [];
						for (let i = 23; i >= 0; i--) {
							if (i === 0) {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
								);
							} else {
								pe.push(
									this.$moment(selectedDate, "MMM YYYY")
										.subtract(i, "months")
										.format("YYYYMM")
								);
							}
						}
						methodTrendsChartData.saveCategories.forEach((c) =>
							formatedCatArray.push(
								this.$moment(c, "MMM YYYY").format("YYYYMM")
							)
						);
						methodTrendsChartData.saveData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.trans_name ? sData.trans_name : sData.name,
								data: [],
								color: sData.color,
							};
							let methodName = sData.trans_name ? sData.trans_name : sData.name;
							fields.push(methodName);
							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);
									if (!methodTrendsChartData.categories.includes(formatedDate))
										methodTrendsChartData.categories.push(formatedDate);
								}
							});
							methodTrendsChartData["data"].push(obj);
						});
						let agreDataTemp = [];
						methodTrendsChartData.agreData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.trans_name ? sData.trans_name : sData.name,
								data: [],
								color: sData.color,
							};
							// let methodName = sData.trans_name ? sData.trans_name : sData.name;
							//fields.push(methodName)
							pe.forEach((p) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);

									if (!trendsChartData.categories.includes(formatedDate))
										methodTrendsChartData.categories.push(formatedDate);
								}
							});
							agreDataTemp.push(obj);
						});
						methodTrendsChartData["agreData"] = agreDataTemp;
						methodTrendsChartData["fields"] = fields;
						methodTrendsChartData.categories.forEach((p, i) => {
							let innObj = { Period: p };
							let agreObj = { Period: p };
							methodTrendsChartData.data.forEach((sData) => {
								let reqData = sData.data;
								let methodName = sData.trans_name
									? sData.trans_name
									: sData.name;
								innObj[methodName] = reqData[i] ? reqData[i] : null;
							});
							methodTrendsChartData.agreData.forEach((sData) => {
								let reqData = sData.data;
								let methodName = sData.trans_name
									? sData.trans_name
									: sData.name;
								agreObj[methodName] = reqData[i] ? reqData[i] : null;
							});
							items.push(innObj);
							agreItems.push(agreObj);
						});
						methodTrendsChartData["tableData"] = [
							{
								name: this.$i18n.t("EMU"),
								data: items,
							},
						];
						methodTrendsChartData["agreTableData"] = [
							{
								name: this.$i18n.t("EMU"),
								data: agreItems,
							},
						];
						// if (methodTrendsChartData.tableData) {
						//   methodTrendsChartData.tableData[0]['data'].forEach(key => {
						//     Object.keys(key).forEach(field => {
						//       if (newFields.indexOf(field) == -1) {
						//         newFields.push(field)
						//         if(field == 'Period' || field == 'Value'){
						//           fields.push({key: field, sortable: true})
						//         }else{
						//           fields.push(field)
						//         }
						//       }
						//     })
						//     items.push(key)
						//   })
						// }
						// methodTrendsChartData['tableData'] = this.items
						// methodTrendsChartData['fields'] = this.fields
					}
					this.methodTrendsChartData = methodTrendsChartData;
				} else {
					this.methodTrendsChartData = null;
				}

				// let monthTrend = this.monthlyEMU.data['monthTrend'] ? JSON.parse(this.monthlyEMU.data['monthTrend']) : null
				let monthTrend =
					typeof this.monthlyEMU.data["monthTrend"] === "string"
						? JSON.parse(this.monthlyEMU.data["monthTrend"])
						: this.monthlyEMU.data["monthTrend"];
				let oneMonthEMUChartData = monthTrend[locId] ? monthTrend[locId] : null;
				if (oneMonthEMUChartData) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === oneMonthEMUChartData.cid
					);
					// console.log("data",data)
					if (data) {
						data = data.chartOptions;
						oneMonthEMUChartData.chartInfo = data.chartInfo;
						oneMonthEMUChartData.title = data.chartName;
						oneMonthEMUChartData.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						oneMonthEMUChartData.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
					}
					this.oneMonthEMUChartData = oneMonthEMUChartData;
				} else {
					this.oneMonthEMUChartData = null;
				}

				this.bShowLoader = false;
			} else {
				this.totalEMUChartData = null;
				this.trendsChartData = null;
				this.methodTrendsChartData = null;
				this.oneMonthEMUChartData = null;
				this.bShowLoader = false;
				this.monthlyNoData = this.$i18n.t("no_data_to_display");
			}
		},
		drawAnnualEMUCharts() {
			let compEMU =
				typeof this.annualEMU.data["compEMU"] === "string"
					? JSON.parse(this.annualEMU.data["compEMU"])
					: this.annualEMU.data["compEMU"];
			let locId = this.locationValue.split("/")[1];
			// console.log("locId", locId);
			// console.log("compEMU", compEMU);
			// console.log("compEMU[locId]", compEMU[locId]);
			if (compEMU[locId]) {
				let dqrData = this.dqrResponse.emu.Output.derivedCharts;
				// console.log("dqrResponse", this.dqrResponse.emu.Output.derivedCharts)

				let comparingEMU = compEMU[locId] ? compEMU[locId] : null;
				// console.log("comparingEMU", comparingEMU)
				if (comparingEMU) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === comparingEMU.cid
					);
					// console.log("data",data)
					if (data) {
						data = data.chartOptions;
						comparingEMU.chartInfo = data.chartInfo;
						comparingEMU.title = data.chartName;
						comparingEMU.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						comparingEMU.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
					}
					this.comparingEMU = comparingEMU;
				} else {
					this.comparingEMU = null;
				}
				let comAvgEMU = JSON.parse(this.annualEMU.data["compAvgAnuual"]);
				let comparingAverageAnnual = comAvgEMU[locId] ? comAvgEMU[locId] : null;
				if (comparingAverageAnnual) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === comparingAverageAnnual.cid
					);
					if (data) {
						data = data.chartOptions;
						comparingAverageAnnual.chartInfo = data.chartInfo;
						comparingAverageAnnual.title = data.chartName;
						comparingAverageAnnual.type = "bar";
						comparingAverageAnnual.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						comparingAverageAnnual.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
					}
					this.comparingAverageAnnual = comparingAverageAnnual;
				} else {
					this.comparingAverageAnnual = null;
				}

				let comUsers = JSON.parse(this.annualEMU.data["compUsers"]);
				let comparingUsers = comUsers[locId] ? comUsers[locId] : null;
				if (comparingUsers) {
					let data = dqrData.find(
						(d) => d.chartOptions.cid === comparingUsers.cid
					);
					if (data) {
						data = data.chartOptions;
						comparingUsers.chartInfo = data.chartInfo;
						comparingUsers.title = data.chartName;
						comparingUsers.type = "bar";
						comparingUsers.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						comparingUsers.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
					}
					this.comparingUsers = comparingUsers;
				} else {
					this.comparingUsers = null;
				}
				let usersT = JSON.parse(this.annualEMU.data["usersTrend"]);
				this.usersTrend = usersT[locId] ? usersT[locId] : null;
				this.bShowLoader1 = false;
			} else {
				this.comparingEMU = null;
				this.comparingAverageAnnual = null;
				this.comparingUsers = null;
				this.usersTrend = null;
				this.bShowLoader1 = false;
				this.annualNoData = this.$i18n.t("no_data_to_display");
			}
			this.drawUserBymethods(true, this.usersTrend);
		},
		drawUserBymethods(p_bFlag, data) {
			if (data) {
				let oRet = data,
					aCategories = Object.keys(oRet),
					sMethod;
				this.userMethodList = aCategories;
				if (p_bFlag) {
					this.selectedUserMethod = 0;
				}
				sMethod = this.userMethodList[this.selectedUserMethod];
				if (sMethod) {
					this.annualuserTrendsDataByMethods = {
						data: oRet[sMethod].data,
						title: this.$i18n.t("user_trend"),
						source: "",
						xTitle: "",
						yTitle: "",
						type: "line",
						categories: oRet[sMethod].categories,
						tableData: oRet[sMethod].tableData,
						fields: oRet[sMethod].fields,
					};
				}
			}
		},
		handleUserMthdChange(e) {
			this.selectedUserMethod = e.target.value;
			this.drawUserBymethods(false, this.usersTrend);
		},
		getMapConfig() {
			let key = this.generateKey("adAnchorMapModule");

			service
				.getSavedConfig(key)
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
		getLocationName(defaultLocationID) {
			// this.locationName = service.getLocationName(defaultLocationID);
			service.getIndividualOrganisation(defaultLocationID).then((key) => {
				// console.log(key)
				this.locationName = key.data.displayName;
			});
		},
	},
	created() {
		if (localStorage.getItem("adBenchmarkLayout") === null) {
			localStorage.setItem("adBenchmarkLayout", "col-12");
			this.layoutView = "col-12";
		} else {
			this.layoutView = localStorage.getItem("adBenchmarkLayout");
		}
		this.canComment =
			this.$store.getters.getIsAdmin ||
			this.$store.getters.getUserPermissions.canComment;
		this.globalPeriodData = this.$store.getters.getGlobalFactors().period.Period;
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
		this.getMapConfig();
		this.getConfig();
	},
};
</script>
