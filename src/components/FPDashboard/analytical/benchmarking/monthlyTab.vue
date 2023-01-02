<template>
	<div>
		<div class="container-fluid m-t-20px">
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
						<li class="nav-item fs-19-1920">
							<a
								class="nav-link"
								:class="[activeTab === 'monthly' ? 'active' : '']"
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
						<li class="nav-item fs-19-1920">
							<a
								class="nav-link"
								:class="[activeTab === 'annual' ? 'active' : '']"
								id="benchmarking-comfacilities-tab"
								data-toggle="pill"
								href="#benchmarking-comfacilities"
								role="tab"
								aria-controls="benchmarking-comfacilities"
								aria-selected="false"
								@click="getActiveTab('annual')"
								>{{ $t("emu_annual") }}</a
							>
						</li>
					</ul>
				</div>

				<div class="col-lg-12 px-0">
					<div class="tab-content" id="benchmarking-sub-tabContent">
						<div
							class="tab-pane fade"
							:class="{ 'show active': activeTab === 'monthly' }"
							id="benchmarking-comclient"
							role="tabpanel"
							aria-labelledby="benchmarking-comclient-tab"
						>
							<div
								class="row dashboardchart-container position-relative"
								:class="{ 'h-752px': bShowLoader }"
							>
								<loader v-if="bShowLoader" class="cardLoader" />
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
										sorting="['JAN-DEC','DEC-JAN']"
										:setExtreme="true"
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
										sorting="['JAN-DEC','DEC-JAN']"
										:setExtreme="true"
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
										sorting="['JAN-DEC','DEC-JAN']"
										:setExtreme="true"
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
										sorting="['0-1','1-0', 'A-Z','Z-A']"
										:setExtreme="true"
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
							:class="{ 'show active': activeTab === 'annual' }"
							id="benchmarking-comfacilities"
							role="tabpanel"
							aria-labelledby="benchmarking-comfacilities-tab"
						>
							<div
								class="row dashboardchart-container position-relative"
								:class="{ 'h-752px': bShowLoader1 }"
							>
								<loader v-if="bShowLoader1" class="cardLoader" />
								<div class="m-b-30px" :class="layoutView" v-if="comparingEMU">
									<dqrcardComponent
										:chartdata="comparingEMU"
										:showSource="true"
										:canComment="canComment"
										defaultSort="JAN-DEC"
										sorting="['JAN-DEC','DEC-JAN']"
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
										sorting="['0-1','1-0', 'A-Z','Z-A']"
									/>
								</div>
								<div class="m-b-30px" :class="layoutView" v-if="comparingUsers">
									<dqrcardComponent
										:chartdata="comparingUsers"
										:showSource="true"
										:canComment="canComment"
										defaultSort="A-Z"
										sorting="['0-1','1-0', 'A-Z','Z-A']"
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
										sorting="['JAN-DEC','DEC-JAN']"
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
			</div>
			<toolbarComponent
				v-if="layoutView && locationValue"
				:showView="true"
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
				defaultCalType="method"
			/>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import dataM from "../../dqr/emuAnnual/dataMassaging.js";
import cardComponent from "../../dqr/monthly/cardComponent";
import dqrcardComponent from "../../dqr/emuAnnual/cardComponent";
import toolbarComponent from "../toolbarComponent";

export default {
	props: ["debugging", "activateSubTabs", "globalResponse"],
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
			calType: "method",
			canComment: false,
			dqrResponse: null,
			monthlyNoData: "",
			annualNoData: "",
			activityLogArr: [],
			globalPeriodData: null,
		};
	},
	components: {
		cardComponent,
		dqrcardComponent,
		toolbarComponent,
	},
	watch: {
		activateSubTabs(newValue) {
			this.getActiveTab(newValue);
		},
	},
	methods: {
		getCalType(val) {
			this.calType = val;
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
			this.caltype = "method";
			this.locationValue = location;
			this.annualuserTrendsDataByMethods = null;
			this.bShowLoader = true;
			this.bShowLoader1 = true;
			this.drawMonthlyEMUCharts();
			this.drawAnnualEMUCharts();
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
						totalEMUChartData.saveData.forEach((sData) => {
							let reqData = sData.data;
							let obj = {
								name: sData.name,
								data: [],
								//color: sData.color,
							};
							let methodName = sData.name;
							fields.push(methodName);
							pe.forEach((p, i) => {
								let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);

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
							pe.forEach((p, i) => {
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
							let methodName = sData.trans_name ? sData.trans_name : sData.name;
							//fields.push(methodName)
							pe.forEach((p, i) => {
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
							pe.forEach((p, i) => {
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
							let methodName = sData.trans_name ? sData.trans_name : sData.name;
							//fields.push(methodName)
							pe.forEach((p, i) => {
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
	},
	created() {
		this.getActiveTab(this.activateSubTabs);
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
		this.getConfig();
	},
};
</script>
