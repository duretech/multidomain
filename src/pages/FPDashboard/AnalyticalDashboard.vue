<template>
	<div class="mdgridviewpage-bg">
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
			<div
				class="row m-t-20px"
				:class="{ sumContainer: activeTab !== 'summaryTab' }"
			>
				<div class="col-lg-12">
					<b-tabs
						class="fs-19-1920"
						content-class="mt-3"
						nav-class="appConfigtabMain d-none"
					>
						<b-tab
							class="fs-19-1920"
							:title="$t('summary')"
							:active="activeTab === 'summaryTab'"
							@click="updateActiveTab('summaryTab')"
							v-if="!modules.geoSummary.disable"
						>
							<ministerialPage :inAnalytical="true" class="summarySection" />
						</b-tab>
						<b-tab
							class="fs-19-1920"
							:title="$t('gPro_tab')"
							:active="activeTab === 'geoTab'"
							@click="updateActiveTab('geoTab')"
							v-if="!modules.geographical.disable"
						>
							<geographicalProgressTab
								v-if="activeTab === 'geoTab'"
								:appResponse="appResponse"
								:globalResponse="globalResponse"
								:userDetails="userDetails"
								:facilityLevelID="facilityLevelID"
								:debugging="debugging"
								:debuggingLevel="debuggingLevel"
								:activateSubTabs="activateSubTabs"
								ref="geoTab"
								@sendlog="getLog"
							/>
						</b-tab>
						<b-tab
							class="fs-19-1920"
							:title="$t('benchmarking')"
							:active="activeTab === 'benchMarkingTab'"
							@click="updateActiveTab('benchMarkingTab')"
							v-if="!modules.benchmarking.disable"
						>
							<monthly-tab
								v-if="activeTab === 'benchMarkingTab'"
								:loggedInUserId="loggedInUserId"
								:canComment="canComment"
								:debugging="debugging"
								:globalResponse="globalResponse"
								:activateSubTabs="activateSubTabs"
								@sendlog="getMonthTabLog"
							/>
						</b-tab>
						<b-tab
							class="fs-19-1920"
							:title="$t('barriers_enablers_tab')"
							:active="activeTab === 'barrierTab'"
							@click="updateActiveTab('barrierTab')"
							v-if="!modules.barrier.disable"
						>
							<beTabs
								v-if="activeTab === 'barrierTab'"
								ref="barrierTab"
								:debugging="debugging"
								:activateSubTabs="activateSubTabs"
								@sendlog="getBarrierLog"
							/>
						</b-tab>
						<b-tab
							class="fs-19-1920"
							:title="$t('proPrio')"
							:active="activeTab === 'proTab'"
							@click="updateActiveTab('proTab')"
							v-if="!modules.program.disable"
						>
							<program-priorities-tab
								v-if="activeTab === 'proTab'"
								:activateSubTabs="activateSubTabs"
								ref="proTab"
							/>
						</b-tab>
					</b-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/*global settings*/
/*eslint no-undef: "error"*/
// import ministerialPage from "./ministerialPage";
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
				/* webpackChunkName: "analytical_benchmarking"*/ "@/components/FPDashboard/analytical/benchmarking/monthlyTab"
			),
		programPrioritiesTab: () =>
			import(
				/* webpackChunkName: "analytical_programPriorities"*/ "@/components/FPDashboard/analytical/programPriorities/programPrioritiesTab"
			),
		geographicalProgressTab: () =>
			import(
				/* webpackChunkName: "analytical_geographical"*/ "@/components/FPDashboard/analytical/geographical/geoProgress"
			),
		beTabs: () =>
			import(
				/* webpackChunkName: "analytical_barriers"*/ "@/components/FPDashboard/analytical/barrier/barrierTab"
			),
		ministerialPage: () =>
			import(/* webpackChunkName: "ministerial"*/ "./MinisterialPage"),
	},
	mixins: [DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
	data() {
		return {
			debugging: false,
			activeTab: "summaryTab",
			activateSubTabs: "",
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
		"$store.getters.getActiveTab": function () {
			let tabs = this.$store.getters.getActiveTab.split("-");
			console.log("tabs", tabs);
			this.updateActiveTab(tabs[0], tabs[1]);
		},
	},
	methods: {
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
		updateActiveTab(tab_name, subTab) {
			this.activeTab = tab_name;
			if (tab_name !== "benchMarkingTab") {
				this.showExportButton = true;
			} else {
				this.showExportButton = false;
			}
			this.activateSubTabs = subTab;

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
				this.activateSubTabs = "";
				this.showExLogButton = false;
			}
			console.log("activateSubTabs", this.activateSubTabs);
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
