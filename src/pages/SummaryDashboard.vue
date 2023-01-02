<template>
	<div class="summarydashboard-page" v-show="!reportChartData">
		<Header
			:headerConditions="{
				home: true,
				profile: true,
				pageTitle: true,
				dashboardLogo: true,
			}"
			@langChange="langChange"
			@activateTour="activateTour"
		/>
		<div class="summary">
			<b-container fluid class="pl-0">
				<SummaryPage
					:showTrend="showTrend"
					:showSeasonal="showSeasonal"
					:showRegional="showRegional"
					:configData="configData"
					:locationPeriod="locationPeriod"
					:reportChartData="reportChartData"
					@setReportChart="setReportChart"
					v-if="configData && locationPeriod"
				/>
			</b-container>
		</div>
		<Footer
			:globalPeriodData="globalPeriodData"
			:showTrend="showTrend"
			:showSeasonal="showSeasonal"
			:showRegional="showRegional"
			@getViewType="getViewType"
			@getLocationPeriod="getLocationPeriod"
		/>
	</div>
</template>
<script>
import service from "@/service";
import ResetMenuMixin from "@/helpers/ResetMenuMixin";
import SummaryPage from "@/components/Summary/SummaryPage.vue";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
export default {
	props: [
		"activeTab",
		"reportPeriod",
		"reportLocationValue",
		"reportDefaultLevelID",
		"reportDefaultLocationID",
		"reportSubLevelID",
		"reportPeriodType",
		"reportChartData",
		"reportConfigData",
	],
	components: {
		SummaryPage,
	},
	mixins: [ResetMenuMixin, DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
	data() {
		return {
			globalPeriodData: null,
			showTrend: false,
			showSeasonal: false,
			showRegional: false,
			configData: null,
			locationPeriod: null,
		};
	},
	watch: {
		activeComponent(newValue) {
			if (newValue === "SummaryPage") {
				this.showRegional = false;
				this.showSeasonal = false;
				this.showTrend = false;
			} else {
				this.showRegional = true;
				this.showSeasonal = true;
				this.$nextTick(() => {
					this.showTrend = true;
				});
			}
		},
	},
	computed: {
		activeComponent() {
			let component = "SummaryPage";
			if (this.$store.getters.getActiveTab !== "sd-summary") {
				component = "ChartComponent";
			}
			return component;
		},
	},
	methods: {
		setReportChart(obj) {
			this.$emit("setReportChart", obj);
		},
		getLocationPeriod(locPeObj) {
			this.locationPeriod = this.reportChartData
				? {
						...locPeObj,
						location: this.reportLocationValue,
						period: this.reportPeriod,
						periodType: this.reportPeriodType,
				  }
				: locPeObj;
		},
		getViewType(type, value) {
			if (type === "trend") {
				this.showTrend = value;
			}
			if(type === "seasonal") {
				this.showSeasonal = value;
			} 
			if(type === "regional") {
				this.showRegional = value;
			}
		},
		getConfigData() {
			if (!this.reportChartData) {
				this.$store.commit("setLoading", true);
			}
			let key = this.generateKey("summaryDashboard");
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			service
				.getSavedConfig(key, false, namespace)
				.then((response) => {
					this.configData = response.data;
					this.$emit("getConfigData", response.data);
					this.$store.commit("setLoading", false);
				})
				.catch(() => {
					console.log("Config not found...");
					this.$store.commit("setLoading", false);
				});
		},
	},
	created() {
		this.$store.commit("setActiveTab", "sd-summary");
		if (this.activeTab) {
			this.$nextTick(() => {
				this.$store.commit("setActiveTab", this.activeTab);
			});
		}
		this.globalPeriodData = this.$store.getters.getGlobalFactors().period.Period;
		if (
			!this.reportChartData ||
			(this.reportChartData && !this.reportConfigData)
		) {
			this.getConfigData();
		} else {
			this.configData = this.reportConfigData;
		}
	},
};
</script>

<style scoped></style>