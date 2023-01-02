<template>
	<div class="mdgridviewpage-bg fpnewanalytical">
		<Header
			:headerConditions="{
				home: true,
				profile: false,
				pageTitle: true,
				dashboardLogo: true,
			}"
			@langChange="langChange"
			@activateTour="activateTour"
		>
			<template v-slot:admin>
				<button
					v-if="debugging && showExLogButton"
					type="button"
					class="btn btn-primary black-btn mr-2"
					style="border: 2px solid #fff"
					@click.prevent.stop="exportActivityLogs"
				>
					{{ $t("exportLogs") }}
				</button>
				<button
					type="button"
					class="btn btn-primary black-btn"
					style="border: 2px solid #fff"
					@click.prevent.stop="exportPPT"
					v-if="showExportButton"
				>
					{{ $t("exportbtn") }}
				</button>
			</template>
		</Header>
		<div class="container-fluid">
			<div class="row">
				<div class="col-lg-12 pl-0">
					<b-tabs
						content-class="mt-3 overflow-hidden"
						nav-class="appConfigtabMain"
						vertical
					>
						<b-tab
							class="fs-19-1920"
							active
							@click="updateActiveTab('summaryTab')"
						>
							<template #title>
								<b-spinner type="grow" small v-if="!summaryTabFlag"></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												summaryTabFlag.value === 'error'
													? '#b5b3a7'
													: summaryTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-1"
									></i>
									<b-popover
										target="popover-target-1"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in summaryTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								EMU
							</template>
							<monthly-tab
								:loggedInUserId="loggedInUserId"
								:canComment="canComment"
								:debugging="debugging"
								:globalResponse="globalResponse"
								:facilityLevelID="facilityLevelID"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								ref="summaryTab"
								key="summaryTab"
								flagKey="summaryTabFlag"
								@sendlog="getMonthTabLog"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
								class="analyticnew"
							/>
						</b-tab>
						<b-tab class="fs-19-1920" @click="updateActiveTab('geoTab')">
							<template #title>
								<b-spinner type="grow" small v-if="!geoTabFlag"></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												geoTabFlag.value === 'error'
													? '#b5b3a7'
													: geoTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-2"
									></i>
									<b-popover
										target="popover-target-2"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in geoTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Geographic Variations
							</template>
							<geographicalProgressTab
								:appResponse="appResponse"
								:globalResponse="globalResponse"
								:userDetails="userDetails"
								:facilityLevelID="facilityLevelID"
								:debugging="debugging"
								:debuggingLevel="debuggingLevel"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								type="total"
								ref="geoTab"
								key="geoTab"
								flagKey="geoTabFlag"
								@sendlog="getLog"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<b-tab class="fs-19-1920" @click="updateActiveTab('geoMethodTab')">
							<template #title>
								<b-spinner
									type="grow"
									small
									v-if="!geoMethodTabFlag"
								></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												geoMethodTabFlag.value === 'error'
													? '#b5b3a7'
													: geoMethodTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-3"
									></i>
									<b-popover
										target="popover-target-3"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in geoMethodTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Method Variations
							</template>
							<methodProgressTab
								:appResponse="appResponse"
								:globalResponse="globalResponse"
								:userDetails="userDetails"
								:facilityLevelID="facilityLevelID"
								:debugging="debugging"
								:debuggingLevel="debuggingLevel"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								ref="geoMethodTab"
								key="geoMethodTab"
								flagKey="geoMethodTabFlag"
								type="methodDetails"
								@sendlog="getLog"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<b-tab class="fs-19-1920" @click="updateActiveTab('stockTab')">
							<template #title>
								<b-spinner type="grow" small v-if="!stockTabFlag"></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												stockTabFlag.value === 'error'
													? '#b5b3a7'
													: stockTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-4"
									></i>
									<b-popover
										target="popover-target-4"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in stockTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Stock-Out
							</template>
							<beTabs
								ref="stockTab"
								key="stockTab"
								flagKey="stockTabFlag"
								type="stock"
								summaryText="Stock-Out (%) for tracer method (IUD)"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								:debugging="debugging"
								@sendlog="getBarrierLog"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<b-tab
							class="fs-19-1920"
							@click="updateActiveTab('availabilityTab')"
						>
							<template #title>
								<b-spinner
									type="grow"
									small
									v-if="!availabilityTabFlag"
								></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												availabilityTabFlag.value === 'error'
													? '#b5b3a7'
													: availabilityTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-5"
									></i>
									<b-popover
										target="popover-target-5"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in availabilityTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Availability
							</template>
							<beTabs
								ref="availabilityTab"
								key="availabilityTab"
								flagKey="availabilityTabFlag"
								type="access"
								summaryText="Method availability (%) for tracer method (IUD)"
								:activeTabKey="activeTab"
								:debugging="debugging"
								:dhsValue="dhsValue"
								@sendlog="getBarrierLog"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<b-tab class="fs-19-1920" @click="updateActiveTab('programTab')">
							<template #title>
								<b-spinner type="grow" small v-if="!programTabFlag"></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												programTabFlag.value === 'error'
													? '#b5b3a7'
													: programTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-6"
									></i>
									<b-popover
										target="popover-target-6"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in programTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Program
							</template>
							<program-priorities-tab
								type="program"
								ref="programTab"
								key="programTab"
								summaryText="PPFP Uptake"
								flagKey="programTabFlag"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<b-tab class="fs-19-1920" @click="updateActiveTab('youthTab')">
							<template #title>
								<b-spinner type="grow" small v-if="!youthTabFlag"></b-spinner>
								<template v-else>
									<i
										class="fa fa-circle"
										:style="{
											color:
												youthTabFlag.value === 'error'
													? '#b5b3a7'
													: youthTabFlag.value === 'flag'
													? '#d97276'
													: '#5ab276',
										}"
										id="popover-target-7"
									></i>
									<b-popover
										target="popover-target-7"
										triggers="hover"
										placement="rightbottom"
									>
										<template #title>Status</template>
										<div
											v-for="(message, index) in youthTabFlag.messages"
											:key="index"
										>
											{{ message }}
										</div>
									</b-popover>
								</template>
								Youth
							</template>
							<program-priorities-tab
								type="youth"
								ref="youthTab"
								flagKey="youthTabFlag"
								summaryText="Total FP Visits among Youth by tracer method (IUD)"
								key="youthTab"
								:activeTabKey="activeTab"
								:dhsValue="dhsValue"
								@flag="flag"
								@resetFlagDetails="resetFlagDetails"
							/>
						</b-tab>
						<!-- <b-tab
              :title="$t('benchmarking')"
              @click="updateActiveTab('benchMarkingTab')"
              v-if="!modules.benchmarking.disable"
            >
              <monthly-tab
                v-if="activeTab === 'benchMarkingTab'"
                :loggedInUserId="loggedInUserId"
                :canComment="canComment"
                :debugging="debugging"
                :globalResponse="globalResponse"
                @sendlog="getMonthTabLog"
              />
            </b-tab> -->
					</b-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/*eslint no-undef: "error"*/
import service from "@/service";
import ActivityLog from "@/activityLog.js";
import modules from "@/config/modules.js";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
	components: {
		monthlyTab: () =>
			import(
				/* webpackChunkName: "analytical_benchmarking"*/ "@/components/FPDashboard/analyticalNew/benchmarking/monthlyTab"
			),
		programPrioritiesTab: () =>
			import(
				/* webpackChunkName: "analytical_programPriorities"*/ "@/components/FPDashboard/analyticalNew/programPriorities/programPrioritiesTab"
			),
		geographicalProgressTab: () =>
			import(
				/* webpackChunkName: "analytical_geographical"*/ "@/components/FPDashboard/analyticalNew/geographical/geoProgress"
			),
		methodProgressTab: () =>
			import(
				/* webpackChunkName: "analytical_geographical"*/ "@/components/FPDashboard/analyticalNew/geographical/methodProgress"
			),
		beTabs: () =>
			import(
				/* webpackChunkName: "analytical_barriers"*/ "@/components/FPDashboard/analyticalNew/barrier/barrierTab"
			),
	},
	mixins: [DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
	data() {
		return {
			debugging: false,
			activeTab: "summaryTab",
			loggedInUserId: "",
			canComment: false,
			userDetails: null,
			appResponse: null,
			globalResponse: null,
			facilityLevelID: null,
			debugging: false,
			debuggingLevel: "API",
			showExportButton: false,
			showExLogButton: false,
			geoPregressLog: [],
			monthTabLog: [],
			barrierLog: [],
			modules: modules.module,
			moduleActiveTab: "",
			summaryTabFlag: null,
			geoTabFlag: null,
			geoMethodTabFlag: null,
			stockTabFlag: null,
			availabilityTabFlag: null,
			programTabFlag: null,
			youthTabFlag: null,
			dhsValue: "89",
		};
	},
	watch: {
		moduleActiveTab(newVal) {
			if (newVal) {
				if (newVal === "geoSummary") {
					this.activeTab = "summaryTab";
				}
				if (newVal === "geographical") {
					this.activeTab = "geoTab";
				}
				if (newVal === "benchmarking") {
					this.activeTab = "benchMarkingTab";
				}
				if (newVal === "barrier") {
					this.activeTab = "barrierTab";
				}
				if (newVal === "program") {
					this.activeTab = "proTab";
				}
			}
		},
	},
	methods: {
		flag(flagDetails) {
			this[flagDetails.tab] = flagDetails;
		},
		resetFlagDetails(key) {
			this[key] = null;
		},
		getModules() {
			let key = this.generateKey("modules", false);

			let modules = [
					"geoSummary",
					"geographical",
					"benchmarking",
					"barrier",
					"program",
				],
				redirectToHome = true;
			service.getSavedConfig(key).then((response) => {
				this.modules = response.data;
				// console.log("this.modules", this.modules)
				Object.keys(response.data).forEach((m) => {
					if (modules.includes(m)) {
						if (!response.data[m].disable) {
							if (this.moduleActiveTab === "") {
								this.moduleActiveTab = m;
							}
							redirectToHome = false;
						}
					}
				});
				this.$nextTick(() => {
					// console.log("redirectToHome", redirectToHome)
					if (redirectToHome) {
						this.$swal({
							title: this.$i18n.t("all_tabs_disabled"),
							html: this.$i18n.t("redirectToHome"),
							timer: 5000,
							showConfirmButton: false,
						}).then((result) => {
							if (result.dismiss) {
								this.$router.push("/");
							}
						});
					}
				});
			});
		},
		getMonthTabLog(monthTabLog) {
			this.monthTabLog.push(monthTabLog);
		},
		exportActivityLogs() {
			if (this.activeTab === "geoTab") {
				const fname =
					"Analytical_geoLogs_" +
					this.$moment().format("MMMM Do YYYY, h:mm:ss");
				ActivityLog.exportActivityLog(this.geoPregressLog, fname);
			}
			if (this.activeTab === "benchMarkingTab") {
				const fname =
					"Analytical_benchMarkingLog_" +
					this.$moment().format("MMMM Do YYYY, h:mm:ss");
				ActivityLog.exportActivityLog(this.monthTabLog, fname);
			}
			if (this.activeTab === "barrierTab") {
				const fname =
					"Analytical_barrierTab_" +
					this.$moment().format("MMMM Do YYYY, h:mm:ss");
				ActivityLog.exportActivityLog(this.barrierLog, fname);
			}
		},
		getBarrierLog(barrierLog) {
			this.barrierLog.push(barrierLog);
		},
		getLog(geoLog) {
			this.geoPregressLog.push(geoLog);
		},
		exportPPT() {
			if (this.activeTab === "geoTab") {
				this.$refs.geoTab.exportPPT();
			} else if (this.activeTab === "barrierTab") {
				this.$refs.barrierTab.exportPPT();
			} else if (this.activeTab === "proTab") {
				this.$refs.proTab.exportPPT();
			}
		},
		updateActiveTab(tab_name) {
			this.activeTab = tab_name;
			if (tab_name !== "benchMarkingTab") {
				this.showExportButton = true;
			} else {
				this.showExportButton = false;
			}

			let tabName = "";
			if (tab_name === "geoTab") {
				tabName = this.$i18n.t("gPro_tab");
			}
			if (tab_name === "benchMarkingTab") {
				tabName = this.$i18n.t("benchmarking");
			}
			if (tab_name === "barrierTab") {
				tabName = this.$i18n.t("barriers_enablers_tab");
			}
			if (tab_name === "proTab") {
				tabName = this.$i18n.t("proPrio");
			}

			if (tab_name !== "summaryTab") {
				this.showExLogButton = true;
				this.$gtag.event("tab_view", {
					value: tabName,
				});
			} else {
				this.showExLogButton = false;
			}
		},
		getConfig() {
			// console.log("Geographical module getConfig() called")

			service
				.getOrganisationUnitLevels()
				.then((orgResponse) => {
					// console.log("Geographical module getConfig() - OrganisationUnitLevels response received")

					let facility = orgResponse.data.find((o) =>
						o.name.toLowerCase().includes("facility")
					);
					if (facility) {
						this.facilityLevelID = facility.level;
					} else {
						let facilityLevels = orgResponse.data.map(
							(o) => o.level
						);
						this.facilityLevelID = Math.max(...facilityLevels);
					}
					// console.log("Geographical module getConfig() call ended")
				})
				.catch(() => {
					if (this.debugging) {
						console.log(
							"Geographical module getConfig() - OrganisationUnitLevels response failed"
						);
						if (this.geoPregressLog) {
							var obj_log = {
								name: "geoProgress - service.getChildOrganisation()",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Failed" + res.stack,
							};
							this.geoPregressLog.push(obj_log);
						}
					}
				});
		},
		randomIntFromInterval(min, max) {
			// min and max included
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
	},
	created() {
		this.getModules();
		this.appResponse = this.$store.getters.getApplicationModule();
		this.globalResponse = this.$store.getters.getGlobalFactors();
		this.userDetails = this.$store.getters.getUserDetails;
		this.loggedInUserId = this.$store.state.loggedInUserId;
		this.canComment =
			this.$store.getters.getIsAdmin ||
			this.$store.getters.getUserPermissions.canComment;
		this.debugging = this.appResponse.debugging
			? this.appResponse.debugging
			: false;
		this.debuggingLevel = this.appResponse.debuggingLevel
			? this.appResponse.debuggingLevel
			: "API";
		this.getConfig();
	},
	mounted() {
		setTimeout(() => {
			this.flag({
				tab: "stockTabFlag",
				value: "error",
				messages: ["Coming soon"],
			});
			this.flag({
				tab: "availabilityTabFlag",
				value: "error",
				messages: ["Coming soon"],
			});
			this.flag({
				tab: "programTabFlag",
				value: "error",
				messages: ["Coming soon"],
			});
			this.flag({
				tab: "youthTabFlag",
				value: "error",
				messages: ["Coming soon"],
			});
		}, 5000);
	},
};
</script>

<style>
.mdgridviewpage-bg {
	background-size: cover;
	background-position: center;
	min-height: 100vh;
	/* padding: 20px 40px;
  padding: 0px 0 20px !important;
  padding-bottom: 50px; */
	background-color: #3471ce;
	/* padding-top: 60px !important;
  padding-bottom: 50px !important; */
}
</style>
