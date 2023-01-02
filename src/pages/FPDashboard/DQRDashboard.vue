<template>
	<div class="mdgridviewpage-bg dqrbgchart">
		<div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
			<a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
		</div>
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
				<div class="sign-off-btn" v-if="dqrResponse && period && locationValue">
					<button
						v-if="debugging && activeTab != 'summaryTab'"
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
						@click.prevent.stop="exportPPT"
						v-if="showExportButton"
						style="border: 2px solid #fff"
					>
						{{ $t("exportbtn") }}
					</button>
					<button
						class="btn text-white"
						@click.prevent.stop="signOff"
						v-if="!signOffActive && showSignoffButton && locationName && period"
					>
						<img
							alt="img"
							:src="require('@/assets/img/sign_off_icon.png')"
							v-b-tooltip.hover
							:title="$t('signOffTitle')"
							style="width: 75%"
						/>
					</button>
				</div>
			</template>
		</Header>
		<div class="container-fluid">
			<div
				v-b-tooltip.hover
				:title="$t('signOffTitle')"
				class="signoff-floating-icon"
				@click.prevent.stop="signOff"
				v-if="!signOffActive && showSignoffButton && locationName && period"
			>
				<div class="signoff-icon-div">
					<img
						:src="require('@/assets/images/sign_off_icon.png')"
						class="img-fluid logo-img"
					/>
				</div>
			</div>
			<div class="row dqrContainer">
				<div class="col-12" v-if="dqrResponse && period && locationValue">
					<!-- :class="[
					signOffActive ? 'col-lg-9 col-sm-7 pr-0 transition_eff' : 'col-12',
				]" -->
					<b-tabs nav-class="appConfigtabMain fs-19-1920 d-none">
						<b-tab
							content-class="fs-19-1920"
							:title="$t('summary')"
							:active="activeTab === 'summaryTab'"
							@click="updateActiveTab('summaryTab')"
						>
							<template>
								<summaryTab
									:evInjectables="evInjectables"
									:evIUD="evIUD"
									:evImplant="evImplant"
									:rrCompleteness="rrCompleteness"
									:rrTimeliness="rrTimeliness"
									:icAggregate="icAggregate"
									:icMethod="icMethod"
									@activateTab="activateTab"
									ref="summarySection"
									:exportArr="exportArr"
									:dqrResponse="dqrResponse"
									:period="period"
									:defaultLevelID="defaultLevelID"
									:defaultLocationID="defaultLocationID"
									:subLevelID="subLevelID"
									:locationValue="locationValue"
									:plotLines="plotLines"
									:isFilterChange="isFilterChange"
									@resetIsFilterChange="isFilterChange = false"
									:signOffResponse="signOffResponse"
									:tabNameMapping="tabNameMapping"
									:userListEMU="userListEMU"
									:periodType="periodType"
									:standardDeviation="standardDeviation"
									@generateScore="generateScorePopup"
									@viewScorecard="viewScorecard"
									@cancelScorecard="cancelScorecard"
									:locationFetchedPercent="locationFetchedPercent"
									:scorecardDataFetching="scorecardDataFetching"
									:scorecardGenerated="scorecardGenerated"
									:tabName="$t('summary')"
									:disabledTabs="disabledTabs"
									@chartMaxLimit="chartMaxLimit"
								/>
							</template>
						</b-tab>
						<b-tab
							content-class="fs-19-1920"
							:title="$t('compTime')"
							:active="activeTab === 'reportingRate'"
							@click="updateActiveTab('reportingRate')"
						>
							<template>
								<reportingRateTabs
									@sendScore="score"
									@sendScoreBackground="scoreBackground"
									key1="rrCompleteness"
									key2="rrTimeliness"
									:activeTab="activeTab"
									:activateSubTabs="activateSubTabs"
									:dqrResponse="dqrResponse"
									:globalResponse="globalResponse"
									:period="period"
									:periodScorecard="periodScorecard"
									:defaultLevelID="defaultLevelID"
									:defaultLocationID="defaultLocationID"
									:scorecardDefaultLocationID="scorecardDefaultLocationID"
									:subLevelID="subLevelID"
									:locationValue="locationValue"
									:source="reportingSelectedMethod"
									@drilldownLocation="getLocation"
									:debugging="debugging"
									:debuggingLevel="debuggingLevel"
									@updateSubTab="updateSubTab"
									:periodType="periodType"
									:applicationFinalYear="applicationFinalYear"
									@sendDatatodqr="getLog"
								/>
								<!-- :signOffActive="signOffActive" Remove the implementation from pages later-->
							</template>
						</b-tab>
						<b-tab
							content-class="fs-19-1920"
							:title="$t('in_Consistency')"
							:active="activeTab === 'internal_validations'"
							@click="updateActiveTab('internal_validations')"
						>
							<template>
								<internalValidationTab
									@sendScore="score"
									@sendScoreBackground="scoreBackground"
									key1="icAggregate"
									key2="icMethod"
									:activateSubTabs="activateSubTabs"
									:dqrResponse="dqrResponse"
									:globalResponse="globalResponse"
									:period="period"
									:periodScorecard="periodScorecard"
									:defaultLevelID="defaultLevelID"
									:defaultLocationID="defaultLocationID"
									:scorecardDefaultLocationID="scorecardDefaultLocationID"
									:subLevelID="subLevelID"
									:locationValue="locationValue"
									:selectedMethod="internalSelectedMethod"
									@drilldownLocation="getLocation"
									:debugging="debugging"
									:debuggingLevel="debuggingLevel"
									@updateSubTab="updateSubTab"
									:periodType="periodType"
									:standardDeviation="standardDeviation"
									:applicationFinalYear="applicationFinalYear"
									@sendLog="getIVLog"
								/>
								<!-- :signOffActive="signOffActive" -->
							</template>
						</b-tab>
						<b-tab
							content-class="fs-19-1920"
							:title="$t('internalConsistencyCorrelation_tab')"
							:active="activeTab === 'external_validation'"
							@click="updateActiveTab('external_validation')"
						>
							<template>
								<external-validation
									v-if="isChildFetched"
									:childArr="childArr"
									@sendScore="score"
									@sendScoreBackground="scoreBackground"
									key1="evInjectables"
									key2="evIUD"
									key3="evImplant"
									:activateSubTabs="activateSubTabs"
									:dqrResponse="dqrResponse"
									:period="period"
									:periodScorecard="periodScorecard"
									:defaultLevelID="defaultLevelID"
									:defaultLocationID="defaultLocationID"
									:scorecardDefaultLocationID="scorecardDefaultLocationID"
									:applicationFinalYear="applicationFinalYear"
									:subLevelID="externalSubLevelID"
									:locationValue="locationValue"
									:orgLevel="orgLevel"
									:debugging="debugging"
									:debuggingLevel="debuggingLevel"
									@updateSubTab="updateSubTab"
									:periodType="periodType"
									@sendLog="getEVLog"
								/>
								<!-- :signOffActive="signOffActive" -->
							</template>
						</b-tab>
						<b-tab
							content-class="fs-19-1920"
							:title="$t('emu_monthly')"
							:active="activeTab === 'emuMonthlyTab'"
							@click="updateActiveTab('emuMonthlyTab')"
							:disabled="scorecardDataFetching"
						>
							<template v-if="activeTab === 'emuMonthlyTab'">
								<!-- <template> -->
								<benchmarkMonthlyTab
									@sendScore="score"
									ref="emu"
									:locationVal="locationValue"
									:userDetails="userDetails"
									:dqrResponse="dqrResponse"
									:appResponse="appResponse"
									:globalResponse="globalResponse"
									@methodFilter="methodFilterVal"
									:method="methodSelected"
									:debugging="debugging"
									:debuggingLevel="debuggingLevel"
									:tabName="$t('emu_monthly')"
								/>
								<!-- :signOffActive="signOffActive" -->
							</template>
						</b-tab>
						<b-tab
							content-class="fs-19-1920"
							:title="$t('emu_annual')"
							:active="activeTab === 'emuAnnualTab'"
							@click="updateActiveTab('emuAnnualTab')"
							:disabled="scorecardDataFetching"
						>
							<template v-if="activeTab === 'emuAnnualTab'">
								<annual-tab
									:locationVal="locationValue"
									:userDetails="userDetails"
									:dqrResponse="dqrResponse"
									:appResponse="appResponse"
									:globalResponse="globalResponse"
									@yearFilter="yearVal"
									:debugging="debugging"
									:debuggingLevel="debuggingLevel"
									:tabName="$t('emuAnnual')"
								/>
								<!-- :signOffActive="signOffActive" -->
							</template>
						</b-tab>
					</b-tabs>
				</div>
				<!-- <div class="col-lg-3 col-sm-5 pl-0 transition_eff" v-if="signOffActive"> -->
			</div>
			<div class="transition_eff">
				<signOffForm
					v-if="signOffActive"
					class="animate__animated animate__slideInRight"
					@signOff="signOff"
					:activeTab="activeTab"
					:activateSubTabs="activateSubTabs"
					:tabNameMapping="tabNameMapping"
					:locationName="locationName"
					:userDetails="userDetails"
					:period="period"
					:periodType="periodType"
					:tabName="$t('signOffTitle')"
				/>
			</div>
			<b-modal
				v-model="generateScorecardPopup"
				hide-footer
				centered
				size="sm"
				:title="$t('location')"
				no-close-on-backdrop
			>
				<div class="row">
					<div class="col-12">
						<treeselect
							name="scorecardLocations"
							:multiple="true"
							:options="filteredLocation"
							:limit="3"
							:value-consists-of="'LEAF_PRIORITY'"
							:default-expand-level="1"
							v-model="selectedScorecardLocations"
							sort-value-by="INDEX"
							:placeholder="$t('select')"
						/>
					</div>
					<div class="col-12 mt-4">
						<div class="text-right">
							<b-button
								small
								@click.prevent.stop="generateScore"
								class=""
								:disabled="selectedScorecardLocations.length === 0"
							>
								<span class="small">{{ $t("ok") }}</span>
							</b-button>
						</div>
					</div>
				</div>
			</b-modal>
			<b-modal
				v-model="showScorecard"
				hide-footer
				centered
				size="xl"
				:title="$t('scorecard')"
				no-close-on-backdrop
			>
				<div class="row">
					<div class="col-4">
						<div v-if="scorecardLocation" class="mr-4 small">
							<strong>{{ $t("location") }}: </strong
							><strong>{{ scorecardLocation }}</strong>
						</div>
						<div v-if="scorecardPeriod" class="mr-4 small">
							<strong>{{ $t("period") }}: </strong
							><strong>{{ scorecardPeriod }}</strong>
						</div>
					</div>
					<div class="col-8">
						<div class="d-flex justify-content-end pb-3 text-right">
							<div class="small w-50">
								<treeselect
									name="scorecardLocations"
									:multiple="true"
									:options="filteredLocation"
									:limit="3"
									:value-consists-of="'LEAF_PRIORITY'"
									:default-expand-level="1"
									v-model="selectedScorecardLocations"
									sort-value-by="INDEX"
									:placeholder="$t('select')"
								/>
							</div>
							<b-button
								small
								@click.prevent.stop="generateScore(true)"
								class="position-relative mx-4"
								:disabled="selectedScorecardLocations.length === 0"
							>
								<span class="small">{{ $t("scorecardReGenerate") }}</span>
							</b-button>
							<download-csv
								class="align-items-center btn btn-secondary d-flex justify-content-center"
								:data="scorecardItemsDownload"
							>
								<span class="small">
									<i class="fa fa-download mr-2"></i>
									{{ $t("csv") }}
								</span>
							</download-csv>
						</div>
					</div>
					<div class="col-3 offset-9">
						<div class="text-right small pb-3">
							<input
								type="text"
								class="form-control"
								id="inputScorecardSearch"
								:placeholder="$t('search')"
								v-model="scorecardSearch"
							/>
						</div>
					</div>
					<div class="col-12">
						<b-table
							head-variant="light"
							responsive
							sticky-header
							bordered
							hover
							:items="scorecardItemsFiltered"
							:fields="scorecardFields"
							show-empty
							:empty-text="$t('no_data_to_display')"
						>
							<template v-slot:cell(show_details)="row">
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
										responsive
										hover
										bordered
										:items="row.item.scoreDetails"
									></b-table>
								</b-card>
							</template>
						</b-table>
					</div>
				</div>
			</b-modal>
		</div>
		<!-- :class="{ 'padding-push-right': signOffActive }" -->
		<toolbarComponent
			v-if="period && locationValue && showToolbar && globalPeriodData"
			:defaultYear="defaultYear"
			:methods="methodsVal"
			:emuYears="yearsVal"
			:locationValue="locationValue"
			:period="period"
			@period="getPeriod"
			@emuYear="getEmuYear"
			@location="getLocation"
			:reportingSource="reportingSelectedMethod"
			:internalSource="internalSelectedMethod"
			:reportingSourceAvailable="reportingSourceAvailable"
			:internalSourceAvailable="internalSourceAvailable"
			@source="getSource"
			@method="getMethod"
			:activeTab="activeTab"
			:globalPeriodData="globalPeriodData"
			@closeToolbar="closeToolbar"
			:drilldownLocation="drilldownLocation"
			:showToolbarOnTablet="showToolbarOnTablet"
			:periodType="periodType"
			:scorecardDataFetching="scorecardDataFetching"
		/>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import summaryTab from "@/components/FPDashboard/dqr/summary/summary.vue";
import service from "@/service";
import ActivityLog from "@/activityLog.js";
import assign from "lodash/assign";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ResetFPMenuMixin from "@/helpers/ResetFPMenuMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import LocationMixin from "@/helpers/LocationMixin";
export default {
	components: {
		Treeselect,
		benchmarkMonthlyTab: () =>
			import(
				/* webpackChunkName: "dqr_emuMonthly"*/ "@/components/FPDashboard/dqr/monthly/benchmarkTab"
			),
		externalValidation: () =>
			import(
				/* webpackChunkName: "dqr_externalValidation"*/ "@/components/FPDashboard/dqr/externalValidation/externalValidation.vue"
			),
		internalValidationTab: () =>
			import(
				/* webpackChunkName: "dqr_internalValidation"*/ "@/components/FPDashboard/dqr/internalValidation/internalValidation.vue"
			),
		summaryTab,
		reportingRateTabs: () =>
			import(
				/* webpackChunkName: "dqr_reportingRate"*/ "@/components/FPDashboard/dqr/reportingRate/chartComponent.vue"
			),
		annualTab: () =>
			import(
				/* webpackChunkName: "dqr_emuAnnual"*/ "@/components/FPDashboard/dqr/emuAnnual/benchmarkTab"
			),
		toolbarComponent: () =>
			import(
				/* webpackChunkName: "dqr_toolbarComponent"*/ "@/components/FPDashboard/dqr/toolbarComponent.vue"
			),
		signOffForm: () =>
			import(
				/* webpackChunkName: "dqr_signOff"*/ "@/components/FPDashboard/dqr/signOff/signOffForm.vue"
			),
	},
	mixins: [
		LocationMixin,
		ResetFPMenuMixin,
		DocumentTitleMixin,
		LanguageChangeMixin,
		EmitTourCallbackMixin,
	],
	data() {
		return {
			activityLogArr: [],
			evDataLogArr: [],
			ivdataLogArr: [],
			periodType: "monthly",
			activeTab: "summaryTab",
			evInjectables: { value: false },
			evIUD: { value: false },
			evImplant: { value: false },
			rrCompleteness: { value: false },
			rrTimeliness: { value: false },
			icAggregate: { value: false },
			icMethod: { value: false },
			summaryLocation: "",
			canSignOff: false,
			summaryPeriodValue: "",
			activateSubTabs: "",
			exportArr: [],
			showExportButton: true,
			showSignoffButton: false,
			userDetails: null,
			dqrResponse: null,
			appResponse: null,
			globalResponse: null,
			period: "",
			defaultLevelID: "",
			defaultLocationID: "",
			subLevelID: "",
			locationValue: "",
			externalSubLevelID: "",
			externalInitialDefaultLevelID: "",
			externalInitialSubLevelID: "",
			orgLevel: "",
			orgLevelList: [],
			showToolbar: true,
			internalSelectedMethod: "",
			reportingSelectedMethod: "",
			plotLinesList: [],
			plotLines: "",
			methodsVal: null,
			methodSelected: "",
			yearsVal: null,
			emuYear: "",
			defaultYear: "",
			globalPeriodData: null,
			showToolbarOnTablet: false,
			isFilterChange: false,
			debugging: false,
			debuggingLevel: "API",
			signOffActive: false,
			tabNameMapping: {
				reportingRate: "Completeness and Timeliness",
				reportingActual: "Reporting Rate (Actual)",
				reportingOnTime: "Reporting Rate (On Time)",
				internal_validations: "Internal Consistency",
				Aggregate: "Aggregate",
				Method: "Method",
				external_validation: "Internal Consistency - Correlation",
				Injectable: "Injectable",
				IUD: "IUD",
				Implant: "Implant",
				emuMonthlyTab: "EMU Monthly",
				emuAnnualTab: "EMU Annual",
			},
			isExport: false,
			signOffResponse: null,
			userListEMU: [],
			standardDeviation: 2,
			applicationFinalYear: null,
			drilldownLocation: "",
			reportingSourceAvailable: [],
			internalSourceAvailable: [],
			filteredLocation: [],
			selectedScorecardLocations: [],
			periodScorecard: "",
			defaultLocationIDScorecard: "",
			scorecardDefaultLocationID: "",
			dataFetched: [],
			locName: "",
			locIndex: -1,
			scorecardTotalLocation: null,
			scorecardLocationFetched: null,
			scorecardDataFetching: false,
			scorecardGenerated: false,
			locationFetchedPercent: null,
			showScorecard: false,
			scorecardFields: [],
			scorecardItems: [],
			scorecardItemsDownload: [],
			scorecardDetails: {},
			isScorecardCancel: false,
			scorecardLocation: null,
			scorecardPeriod: null,
			currentScorecard: null,
			generateScorecardPopup: false,
			scorecardSearch: "",
			disabledTabs: {
				IC1: false,
				IC2: false,
				Injectable: false,
				IUD: false,
				Implant: false,
			},
			chartLimit: 7,
			isChildFetched: false,
			childArr: [],
		};
	},
	watch: {
		scorecardLocationFetched(newValue) {
			if (newValue) {
				this.locationFetchedPercent = Math.round(
					(newValue / this.scorecardTotalLocation) * 100
				);
			}
		},
		dataFetched(newValue) {
			if (newValue.length === this.chartLimit && !this.isScorecardCancel) {
				let periodValue = this.getFormattedPeriod(this.periodScorecard);
				let scorecardKey = `${this.defaultLocationIDScorecard}_${periodValue}`;
				let scorecardCreatedOn = this.$moment().format("lll");
				this.scorecardDetails[this.locName] = {
					// id: `${this.subLevelID}/${this.scorecardDefaultLocationID.split('/')[1]}`,
					id: this.scorecardDefaultLocationID,
					createdOn: scorecardCreatedOn,
					score: JSON.parse(JSON.stringify(newValue)),
				};

				this.dataFetched = [];
				this.locIndex = this.locIndex * 1 + 1;
				if (
					this.locIndex < this.selectedScorecardLocations.length &&
					this.selectedScorecardLocations.length > 0
				) {
					this.scorecardDefaultLocationID =
						this.selectedScorecardLocations[this.locIndex];
					service
						.getIndividualOrganisation(
							this.scorecardDefaultLocationID.split("/")[1]
						)
						.then((key) => {
							this.scorecardLocationFetched = this.locIndex * 1 + 1;
							this.locName = key.data.displayName;
						});
				}
				if (
					this.locIndex === this.selectedScorecardLocations.length &&
					this.selectedScorecardLocations.length > 0
				) {
					this.updateScorecard(scorecardKey);
				}
			}
		},
		"$store.getters.getActiveTab": function () {
			let tabs = this.$store.getters.getActiveTab.split("-");
			this.updateActiveTab(tabs[0], tabs[1]);
		},
	},
	computed: {
		scorecardItemsFiltered: function () {
			let filterdData = this.scorecardItems.filter((s) =>
				s[this.$i18n.t("location")]
					.toLowerCase()
					.includes(this.scorecardSearch.toLowerCase())
			);
			return filterdData;
		},
	},
	methods: {
		updateScorecard(scorecardKey) {
			let key = this.generateKey("dqrScorecard");

			let period = this.getFormattedPeriodText(this.periodScorecard);
			this.scorecardLocation = this.locationName;
			this.scorecardPeriod = period;
			service
				.getSavedConfig(key)
				.then((res) => {
					let scorecardData = res.data;
					scorecardData[scorecardKey] = {
						scores:
							scorecardData[scorecardKey] && scorecardData[scorecardKey].scores
								? assign(
										scorecardData[scorecardKey].scores,
										this.scorecardDetails
								  )
								: this.scorecardDetails,
						loationName: this.locationName,
						period: period,
					};
					let response = service.updateConfig(scorecardData, key);
					response
						.then((response) => {
							if (response.data.status === "OK") {
								this.currentScorecard = scorecardData[scorecardKey];
								this.resetBackgroundSetting("update", true);
								this.generateTable(scorecardData[scorecardKey].scores);
								this.selectedScorecardLocations = [];
							} else {
								console.log("Scorecard Saving Failed!");
								return;
							}
						})
						.catch((error) => {
							console.log("Scorecard Saving Failed!");
						});
				})
				.catch(() => {
					let scorecardData = {
						[scorecardKey]: {
							scores: this.scorecardDetails,
							loationName: this.locationName,
							period: period,
						},
					};
					let response = service.saveConfig(scorecardData, key);
					response.then((response) => {
						if (response.data.status === "OK") {
							this.resetBackgroundSetting("update", true);
							this.generateTable(this.scorecardDetails);
							this.selectedScorecardLocations = [];
						} else {
							console.log("Scorecard Saving Failed!");
							return;
						}
					});
				});
		},
		getScorecard() {
			let key = this.generateKey("dqrScorecard");

			let periodValue = this.getFormattedPeriod(this.periodScorecard);
			let scorecardKey = `${this.defaultLocationIDScorecard}_${periodValue}`;
			service
				.getSavedConfig(key)
				.then((res) => {
					let scorecardData = res.data;
					if (scorecardData[scorecardKey]) {
						this.currentScorecard = scorecardData[scorecardKey];
						this.setScorecard();
					} else {
						this.currentScorecard = null;
					}
				})
				.catch(() => {
					this.currentScorecard = null;
					console.log("Scorecard Not Found!");
				});
		},
		setScorecard() {
			if (this.currentScorecard) {
				this.scorecardGenerated = true;
				this.scorecardLocation = this.currentScorecard.loationName;
				this.scorecardPeriod = this.currentScorecard.period;
				this.generateTable(this.currentScorecard.scores);
			}
		},
		setScorecardLocations() {
			service
				.getChildOrganisation(this.defaultLocationIDScorecard)
				.then((response) => {
					this.childArr = response.data.children;
					this.isChildFetched = true;
					let filteredLocation =
						service.renameKeys({ ...response.data })?.children?.map((l) => {
							let { children, ...rest } = l;
							return rest;
						}) || [];

					if (filteredLocation.length) {
						if (
							this.locationName &&
							this.defaultLevelID === this.appResponse.defaultLevelID
						) {
							let isFound = filteredLocation.find(
								(c) => c.id === this.locationValue
							);
							if (!isFound) {
								filteredLocation.unshift({
									label: this.locationName,
									id: this.locationValue,
									level: this.defaultLevelID,
								});
							}
						}
						filteredLocation = [
							{
								id: "All",
								label: "All",
								children: filteredLocation,
							},
						];
					}
					this.filteredLocation = filteredLocation;
				})
				.catch(() => {
					this.childArr = [];
					this.isChildFetched = true;
				});
		},
		getFormattedPeriod(period) {
			let periodValue = null;
			if (this.periodType === "yearly") {
				periodValue = this.$moment(period, "YYYY").format("YYYY");
			} else if (
				this.periodType === "financialYear" ||
				this.periodType === "financialYearJuly"
			) {
				let pText = this.periodType === "financialYear" ? "April" : "July";
				let currentYear =
					this.periodType === "financialYear"
						? period
						: period.split("July")[0];
				periodValue = `${currentYear}${pText}`;
			} else if (this.periodType === "quarterly") {
				periodValue = period;
			} else {
				periodValue = this.$moment(period, "YYYYMM").format("YYYYMM");
			}
			return periodValue;
		},
		getFormattedPeriodText(period) {
			let quarters = {
					Q1: ["Jan", "Mar"],
					Q2: ["Apr", "Jun"],
					Q3: ["Jul", "Sep"],
					Q4: ["Oct", "Dec"],
				},
				years = ["Mar", "Apr"],
				yearsJuly = ["Jun", "Jul"];
			if (this.$i18n.locale === "fr") {
				quarters = {
					Q1: ["janv.", "mars"],
					Q2: ["avril", "juin"],
					Q3: ["juil.", "sept."],
					Q4: ["oct.", "déc."],
				};
				(years = ["mars", "avril"]), (yearsJuly = ["juin", "juil."]);
			}
			let formattedPeriod = null;
			if (this.periodType === "monthly") {
				formattedPeriod = this.$moment(period, "YYYYMM").format("MMM YYYY");
			} else if (this.periodType === "quarterly") {
				let q1 = period.split("Q");
				formattedPeriod =
					quarters[`Q${q1[1]}`][0] +
					" " +
					this.$i18n.t("toSmall") +
					" " +
					quarters[`Q${q1[1]}`][1] +
					" " +
					q1[0];
			} else if (this.periodType === "financialYear") {
				let q1 = period.split("April");
				formattedPeriod = `${years[1]} ${q1[0]} ${this.$i18n.t("toSmall")} ${
					years[0]
				} ${q1[0] * 1 + 1}`;
			} else if (this.periodType === "financialYearJuly") {
				let q1 = period.split("July");
				formattedPeriod = `${yearsJuly[1]} ${q1[0]} ${this.$i18n.t(
					"toSmall"
				)} ${yearsJuly[0]} ${q1[0] * 1 + 1}`;
			} else {
				formattedPeriod = this.$moment(period, "YYYY").format("YYYY");
			}
			return formattedPeriod;
		},
		generateTable(scorecardDetails) {
			this.scorecardFields = [];
			this.scorecardItems = [];
			this.scorecardItemsDownload = [];
			this.scorecardFields = [
				{
					key: this.$i18n.t("location"),
					sortable: true,
					isRowHeader: true,
					// variant: "secondary",
				},
				{
					key: this.$i18n.t("dqrScore"),
					sortable: true,
					isRowHeader: true,
					// variant: "info",
				},
				{
					key: this.$i18n.t("scorecardGeneratedOn"),
					sortable: true,
					isRowHeader: true,
				},
				{
					key: "show_details",
					label: this.$i18n.t("viewMore"),
					variant: "light",
				},
			];
			Object.keys(scorecardDetails).forEach((s) => {
				let innerItem = {
						[this.$i18n.t("location")]: s,
						scoreDetails: [],
						_cellVariants: {},
					},
					innerItemDownload = {
						[this.$i18n.t("location")]: s,
					};
				let positiveScore = 0,
					totalScore = 0,
					sDetails = {},
					tabPositions = [
						"rrCompleteness",
						"rrTimeliness",
						"icAggregate",
						"icMethod",
						"evInjectables",
						"evIUD",
						"evImplant",
					];
				tabPositions.forEach((tab) => {
					let isTab = scorecardDetails[s].score.find((t) => t.key === tab);
					if (isTab) {
						let innerScore = isTab.value;
						let keyName = "";
						if (isTab.key === "rrCompleteness") {
							keyName = this.$i18n.t("completenessfp_rr");
						}
						if (isTab.key === "rrTimeliness") {
							keyName = this.$i18n.t("timelines_rr");
						}
						if (isTab.key === "icAggregate") {
							keyName = this.$i18n.t("internalConsistency_tab1");
						}
						if (isTab.key === "icMethod") {
							keyName = this.$i18n.t("internalConsistency_tab2");
						}
						if (isTab.key === "evInjectables") {
							keyName = this.$i18n.t("internalConsistencyCorrelation_tab1");
						}
						if (isTab.key === "evIUD") {
							keyName = this.$i18n.t("internalConsistencyCorrelation_tab1_1", {
								method: this.$i18n.t("IUD"),
							});
						}
						if (isTab.key === "evImplant") {
							keyName = this.$i18n.t("internalConsistencyCorrelation_tab1_1", {
								method: this.$i18n.t("Implant"),
							});
						}
						totalScore += 1;
						if (innerScore) {
							sDetails[keyName] = 1;
							innerItemDownload[keyName] = 1;
							sDetails["_cellVariants"] = {
								...sDetails["_cellVariants"],
								[keyName]: "success",
							};
							positiveScore += 1;
						} else {
							sDetails[keyName] = 0;
							innerItemDownload[keyName] = 0;
							sDetails["_cellVariants"] = {
								...sDetails["_cellVariants"],
								[keyName]: "danger",
							};
						}
					}
				});

				innerItem.scoreDetails.push(sDetails);
				innerItem[this.$i18n.t("dqrScore")] = `${positiveScore}/${totalScore}`;
				innerItem[this.$i18n.t("scorecardGeneratedOn")] =
					scorecardDetails[s].createdOn;
				innerItemDownload[
					this.$i18n.t("dqrScore")
				] = `${positiveScore} ${this.$i18n.t("outOf")} ${totalScore}`;
				(innerItemDownload[this.$i18n.t("scorecardGeneratedOn")] =
					scorecardDetails[s].createdOn),
					this.scorecardItems.push(innerItem);
				this.scorecardItems.sort((a, b) => {
					var textA = a[this.$i18n.t("location")].toUpperCase();
					var textB = b[this.$i18n.t("location")].toUpperCase();
					return textA < textB ? -1 : textA > textB ? 1 : 0;
				});
				this.scorecardItemsDownload.push(innerItemDownload);
				this.scorecardItemsDownload.sort((a, b) => {
					var textA = a[this.$i18n.t("location")].toUpperCase();
					var textB = b[this.$i18n.t("location")].toUpperCase();
					return textA < textB ? -1 : textA > textB ? 1 : 0;
				});
			});
		},
		exportActivityLogs() {
			const fname =
				"DQRLogs_" +
				this.activeTab +
				"_" +
				this.$moment().format("MMMM Do YYYY, h:mm:ss");
			//this.activityLogArr = [...this.activityLogArr,this.getIVLogData]
			const tab = this.activeTab;
			if (tab == "reportingRate")
				ActivityLog.exportActivityLog(this.activityLogArr, fname);
			if (tab == "internal_validations")
				ActivityLog.exportActivityLog(this.ivdataLogArr, fname);
			if (tab == "external_validation")
				ActivityLog.exportActivityLog(this.evDataLogArr, fname);
		},
		getLog(data) {
			this.activityLogArr.push(data);
		},
		getIVLog(ivdata) {
			this.ivdataLogArr.push(ivdata);
		},
		getEVLog(evdata) {
			this.evDataLogArr.push(evdata);
		},
		generateScorePopup() {
			this.selectedScorecardLocations = [];
			this.generateScorecardPopup = true;
		},
		generateScore(isReset = false) {
			this.generateScorecardPopup = false;
			// return
			this.scorecardDataFetching = true;
			this.isScorecardCancel = false;
			// this.setScorecardLocations()
			this.locIndex = this.locIndex * 1 + 1;
			this.scorecardTotalLocation = this.selectedScorecardLocations.length;
			this.scorecardLocationFetched = this.locIndex * 1 + 1;
			if (
				this.locIndex < this.selectedScorecardLocations.length &&
				this.selectedScorecardLocations.length > 0
			) {
				this.scorecardDefaultLocationID =
					this.selectedScorecardLocations[this.locIndex];
				service
					.getIndividualOrganisation(
						this.scorecardDefaultLocationID.split("/")[1]
					)
					.then((key) => {
						this.locName = key.data.displayName;
						if (isReset) {
							this.resetBackgroundSetting("regenerate");
						}
					});
			} else {
				if (isReset) {
					this.resetBackgroundSetting("noLocationReset");
				} else {
					this.resetBackgroundSetting("noLocation");
				}
				this.$swal({
					title: this.$i18n.t("oops"),
					text: this.$i18n.t("errorInfo"),
				});
			}
		},
		cancelScorecard() {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
			}).then((result) => {
				if (result.value) {
					this.isScorecardCancel = true;
					this.selectedScorecardLocations = [];
					this.resetBackgroundSetting("cancel");
					this.setScorecard();
				}
			});
		},
		viewScorecard() {
			this.showScorecard = true;
			this.scorecardSearch = "";
			this.selectedScorecardLocations = [];
		},
		closeToolbar() {
			this.showToolbarOnTablet = false;
		},
		methodFilterVal(value) {
			this.methodsVal = value;
		},
		yearVal(value) {
			this.defaultYear = value[value.length - 1]["val"];
			this.yearsVal = value;
		},
		exportPPT() {
			if (
				this.activeTab == "emuMonthlyTab" ||
				this.activeTab == "emuAnnualTab"
			) {
				this.$refs.emu.exportPPT();
			} else {
				this.$refs.summarySection.exportPPT();
			}
		},
		signOff() {
			this.signOffActive = !this.signOffActive;
		},
		activateTab(tab, subTab) {
			this.$store.commit("setActiveTab", `${tab}-${subTab}`);
			this.activeTab = tab;
			this.activateSubTabs = subTab;
		},
		updateSubTab(subTab) {
			this.activateSubTabs = subTab;
		},
		updateActiveTab(tab, subTab) {
			this.activeTab = tab;
			if (
				tab === "summaryTab" ||
				tab === "reportingRate" ||
				tab === "internal_validations" ||
				tab === "external_validation"
			) {
				this.showToolbar = true; //This is the common toolbar,
			} else {
				this.showToolbar = false; //This is the common toolbar, not applicable for EMU tabs
			}
			//Activate this line 255 when adding export functionality in EMU section and hide line 256 below
			// this.showExportButton = tab !== 'summaryTab' && tab !== 'emuMonthlyTab' && tab !== 'emuAnnualTab' ? false : true
			this.showExportButton =
				tab !== "summaryTab" && tab !== "emuMonthlyTab" ? false : true;
			if (this.canSignOff) {
				this.showSignoffButton = tab !== "summaryTab" ? true : false;
			} else {
				if (
					tab !== "summaryTab" &&
					tab !== "reportingRate" &&
					tab !== "internal_validations" &&
					tab !== "external_validation"
				) {
					this.showSignoffButton = true;
				} else {
					this.showSignoffButton = false;
				}
			}
			if (tab === "summaryTab") {
				this.signOffActive = false;
			}
			let tabName = "";
			if (tab === "reportingRate") {
				this.activateSubTabs = subTab;
				tabName = this.$i18n.t("compTime");
			} else if (tab === "internal_validations") {
				this.activateSubTabs = subTab;
				tabName = this.$i18n.t("in_Consistency");
			} else if (tab === "external_validation") {
				this.activateSubTabs = subTab;
				tabName = this.$i18n.t("internalConsistencyCorrelation_tab");
			} else {
				this.activateSubTabs = "";
			}
			if (
				tab === "reportingRate" ||
				tab === "internal_validations" ||
				tab === "external_validation"
			) {
				this.$gtag.event("tab_view", {
					value: tabName,
				});
			}
			this.$store.commit("setEMUMethodTable", null);
		},
		score(key, value, exportArr = [], method = null) {
			this[key] = value;
			exportArr.forEach((obj) => {
				let foundIndex = this.exportArr.findIndex(
					(e) => e.cardKey === obj.cardKey
				);
				if (foundIndex >= 0) {
					this.exportArr[foundIndex] = obj;
				} else {
					this.exportArr.push(obj);
				}
			});
			if (method) {
				this.disabledTabs[method] = true;
			}
		},
		chartMaxLimit(limit) {
			this.chartLimit = limit;
		},
		scoreBackground(key, value) {
			// this[key] = value;
			let addScore = false;
			if (
				(key === "evInjectables" && !this.disabledTabs.Injectable) ||
				(key === "evIUD" && !this.disabledTabs.IUD) ||
				(key === "evImplant" && !this.disabledTabs.Implant)
			) {
				addScore = true;
			}
			if (key !== "evInjectables" && key !== "evIUD" && key !== "evImplant") {
				addScore = true;
			}
			if (addScore) {
				let foundIndex = this.dataFetched.findIndex((d) => d.key === key);
				if (foundIndex >= 0) {
					this.dataFetched[foundIndex] = value;
				} else {
					this.dataFetched.push(value);
				}
			}
		},
		getPeriod(newValue, type) {
			this.isFilterChange = true;
			this.evInjectables = { value: false };
			this.evIUD = { value: false };
			this.evImplant = { value: false };
			this.rrCompleteness = { value: false };
			this.rrTimeliness = { value: false };
			this.icAggregate = { value: false };
			this.icMethod = { value: false };
			this.periodType = type;
			this.period = newValue;
			// if(!this.scorecardDataFetching) {
			this.periodScorecard = newValue;
			this.resetBackgroundSetting("filterChange");
			this.getScorecard();
			// }
		},
		getEmuYear(newYear) {
			this.emuYear = newYear;
		},
		async getLocation(newLocation, locationList) {
			this.isFilterChange = true;
			this.locationName = "";
			this.evInjectables = { value: false };
			this.evIUD = { value: false };
			this.evImplant = { value: false };
			this.rrCompleteness = { value: false };
			this.rrTimeliness = { value: false };
			this.icAggregate = { value: false };
			this.icMethod = { value: false };

			let res = newLocation.split("/");
			this.defaultLevelID = parseInt(res[0]);
			this.subLevelID = parseInt(res[0]) + 1;
			this.defaultLocationID = res[1];
			this.locationValue = newLocation;
			this.drilldownLocation = newLocation;
			await this.getLocName(locationList);
			if (this.externalInitialDefaultLevelID === parseInt(res[0])) {
				this.externalSubLevelID = this.externalInitialSubLevelID;
			} else {
				this.externalSubLevelID = parseInt(res[0]) + 1;
			}

			if (this.orgLevelList.length) {
				let level = this.orgLevelList.find(
					(o) => o.level === this.externalSubLevelID
				);
				if (level) {
					this.orgLevel = level.name;
				} else {
					this.orgLevel = "";
				}
			} else {
				this.orgLevel = "";
			}
			// if(!this.scorecardDataFetching) {
			this.isChildFetched = false;
			this.defaultLocationIDScorecard = res[1];
			this.resetBackgroundSetting("filterChange");
			this.getScorecard();
			this.setScorecardLocations();
			// }
		},
		resetBackgroundSetting(type, scorecardGenerated = false) {
			if (
				type === "cancel" ||
				type === "filterChange" ||
				type === "noLocation" ||
				type === "noLocationReset" ||
				type === "update"
			) {
				this.scorecardDefaultLocationID = "";
				this.dataFetched = [];
				this.locName = "";
				this.locIndex = -1;
				this.scorecardTotalLocation = null;
				this.scorecardLocationFetched = null;
				this.scorecardDataFetching = false;
				this.locationFetchedPercent = null;
			}
			if (
				type === "cancel" ||
				type === "regenerate" ||
				type === "filterChange" ||
				type === "noLocation"
			) {
				this.showScorecard = false;
				this.isScorecardCancel = false;
				this.scorecardGenerated = scorecardGenerated;
				if (!scorecardGenerated) {
					this.scorecardDetails = {};
					this.scorecardLocation = null;
					this.scorecardPeriod = null;
					this.scorecardItems = [];
					this.scorecardFields = [];
				}
			}

			if (type === "update") {
				this.scorecardGenerated = scorecardGenerated;
			}
		},
		async getLocName(locationList = this.$store.getters.getLocationList) {
			await this.getLocationChild({
				locationList,
				location: this.locationValue,
			});
		},
		getSource(newValue, activeTab) {
			if (activeTab === "reportingRate") {
				this.reportingSelectedMethod = newValue;
				this.plotLines =
					this.plotLinesList[newValue] &&
					this.plotLinesList[newValue].plotLines[0].value
						? this.plotLinesList[newValue].plotLines[0].value
						: "";
			}
			if (activeTab === "internal_validations") {
				this.internalSelectedMethod = newValue;
			}
		},
		getMethod(newValue) {
			this.methodSelected = newValue;
		},
		getConfig() {
			let key = this.generateKey("dqrModule"),
				key1 = this.generateKey("signOffModule");

			service
				.getSavedConfig(key1)
				.then((response) => {
					let allForms = [];
					Object.keys(response.data).forEach((f) => {
						Object.keys(response.data[f]).forEach((fInner) => {
							if (response.data[f][fInner].signOff) {
								response.data[f][fInner].signOff.forEach((s) => {
									allForms.push(s);
									let newUser = this.userListEMU.find(
										(u) => u.value === s.userDetails.id
									);
									if (!newUser) {
										this.userListEMU.push({
											label: `${s.userDetails.firstName} ${s.userDetails.surname}`,
											id: s.userDetails.id,
										});
									}
								});
							}
						});
					});
					this.signOffResponse = allForms;
				})
				.catch(() => {
					this.signOffResponse = [];
					this.userListEMU = [];
				});

			service
				.getSavedConfig(key)
				.then((dqrResponse) => {
					let dqr = dqrResponse.data.external_validation;
					this.externalSubLevelID = dqr.Background_Data.dataLevel
						? dqr.Background_Data.dataLevel
						: this.subLevelID;
					this.externalInitialDefaultLevelID = this.defaultLevelID;
					this.externalInitialSubLevelID = dqr.Background_Data.dataLevel
						? dqr.Background_Data.dataLevel
						: this.subLevelID;
					this.orgLevelList = dqr.Background_Data.orgLevel
						? dqr.Background_Data.orgLevel
						: [];
					this.orgLevel =
						this.orgLevelList && this.orgLevelList.length
							? this.orgLevelList.find(
									(o) => o.level === this.externalSubLevelID
							  ).name
							: "";

					let internal = dqrResponse.data.internal_validations;
					let reportingRate = dqrResponse.data.reportingRate;
					let dataSources = [
						"Commodities_Client",
						"Commodities_Facilities",
						"User",
						"Visits",
						"Overall",
					];
					Object.keys(internal).forEach((source) => {
						if (dataSources.includes(source)) {
							let isFound = internal[source].chartData.find((element) =>
								element.indicator.subIndicator.find((d) => d.de.length > 0)
							);
							if (!this.internalSourceAvailable.includes(source) && isFound) {
								this.internalSourceAvailable.push(source);
							}
						}
					});
					Object.keys(reportingRate).forEach((source) => {
						if (dataSources.includes(source)) {
							let isFound = reportingRate[source].chartData.find((element) =>
								element.indicator.subIndicator.find((d) => d.de.length > 0)
							);
							if (!this.reportingSourceAvailable.includes(source) && isFound) {
								this.reportingSourceAvailable.push(source);
							}
						}
					});
					this.reportingSelectedMethod =
						reportingRate.Background_Data &&
						reportingRate.Background_Data.data_source
							? reportingRate.Background_Data.data_source
							: this.reportingSourceAvailable[0];
					this.internalSelectedMethod = internal.Background_Data.data_source
						? internal.Background_Data.data_source
						: this.internalSourceAvailable[0];
					this.standardDeviation = internal.Background_Data.standardDeviation
						? internal.Background_Data.standardDeviation
						: 2;
					this.plotLines =
						this.globalResponse.rrBenchmarking &&
						this.globalResponse.rrBenchmarking[this.reportingSelectedMethod] &&
						this.globalResponse.rrBenchmarking[this.reportingSelectedMethod]
							.plotLines[0].value
							? this.globalResponse.rrBenchmarking[this.reportingSelectedMethod]
									.plotLines[0].value
							: "";

					this.dqrResponse = dqrResponse.data;
					//Before destroy we need to reset the value
					this.$emit("getConfigDataFP", {
						data: dqrResponse.data,
						module: "dqr",
					});
					this.$store.state.loading = false;
				})
				.catch(() => {
					this.showAlert(this.$i18n.t("noDQRConfig"));
					console.log("DQR module getConfig() - dqrModule response failed");
				});
		},
		errorAlert() {
			this.$store.state.loading = false;
			this.$swal({
				title: this.$i18n.t("oops"),
				text: this.$i18n.t("somethingwentwrong"),
			});
		},
		showAlert(title) {
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
					}
				});
			} else {
				// Popup message to contact admin for the configurations
				this.$swal({
					title: this.$i18n.t("configurationnotavailable"),
					text: this.$i18n.t("error_text_2"),
				});
			}
		},
	},
	async created() {
		this.$store.commit("setActiveTab", "summaryTab");
		this.$store.state.loading = true;
		this.tabNameMapping = {
			reportingRate: this.$i18n.t("compTime"),
			reportingActual: this.$i18n.t("Reporting Rate (Actual)"),
			reportingOnTime: this.$i18n.t("Reporting Rate (On Time)"),
			internal_validations: this.$i18n.t("in_Consistency"),
			Aggregate: this.$i18n.t("aggregate"),
			Method: this.$i18n.t("method"),
			external_validation: this.$i18n.t("internalConsistencyCorrelation_tab"),
			Injectable: this.$i18n.t("Injectable"),
			IUD: this.$i18n.t("IUD"),
			Implant: this.$i18n.t("Implant"),
			emuMonthlyTab: this.$i18n.t("emu_monthly"),
			emuAnnualTab: this.$i18n.t("emuAnnual"),
		};

		this.appResponse = this.$store.getters.getApplicationModule();
		this.globalResponse = this.$store.getters.getGlobalFactors();
		this.userDetails = this.$store.getters.getUserDetails;
		this.canSignOff =
			this.$store.getters.getIsAdmin ||
			this.$store.getters.getUserPermissions.canSignOff;

		this.plotLinesList = this.globalResponse.rrBenchmarking
			? this.globalResponse.rrBenchmarking
			: [];

		this.debugging = this.appResponse.debugging
			? this.appResponse.debugging
			: false;
		this.debuggingLevel = this.appResponse.debuggingLevel
			? this.appResponse.debuggingLevel
			: "API";

		if (this.globalResponse.period && this.globalResponse.period.Period) {
			this.globalPeriodData = this.globalResponse.period.Period;
			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(this.globalPeriodData.backtrackedMonth * 1, "months")
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(this.globalPeriodData.backtrackedYearLimit * 1, "years")
				.format("YYYY-MM");
			this.period = currentDate;
			this.periodScorecard = currentDate;
			this.applicationFinalYear = this.$moment(currentFinalDate, "YYYY").format(
				"YYYY"
			);
		}

		let { locationID, levelID, subLevelID } = service.getAllowedLocation();
		this.defaultLevelID = levelID;
		this.defaultLocationID = locationID;
		this.defaultLocationIDScorecard = locationID;
		this.subLevelID = subLevelID;
		this.locationValue = levelID + "/" + locationID;
		await this.getLocName();
		this.setScorecardLocations();
		this.getScorecard();
		this.getConfig();
	},
};
</script>
<style lang="scss" scoped>
.mdgridviewpage-bg {
	background-size: cover;
	background-position: center;
	min-height: 100vh;
	// padding: 20px 40px;
	// padding: 0px 0 20px !important;
	// padding-bottom: 50px;
	background-color: #3471ce;
}
.sign-off-btn {
	display: flex;
	justify-content: flex-end;
}
.transition_eff {
	transition: all 0.5s;
}
.padding-push-right {
	padding-right: 25%;
}
.b-table-sticky-header {
//	max-height: calc(100vh - 200px);
}
.b-table-sticky-header {
    overflow-y: auto;
    max-height: 300px;
}
</style>
