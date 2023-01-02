<template>
	<b-row id="modal-anc">
		<!-- tablemap-col1 -->
		<b-col class="pr-4 modal-content" sm="12" lg="6">
			<b-row class="pt-1 pb-1 pl-3">
				<b-col cols="4"></b-col>
				<b-col class="table-heading pr-0" cols="2"
					><p>
						{{ summaryObj.summaryDetails[0].prevForDate }}
					</p></b-col
				>
				<b-col class="table-heading pr-0" cols="2"
					><p>
						{{ summaryObj.summaryDetails[0].currForDate }}
					</p>
				</b-col>
				<b-col class="table-heading pr-0" cols="2"
					><p>{{ $t("change%") }}</p></b-col
				>
				<b-col class="table-heading pr-0" cols="2"
					><p>{{ $t("2014dhs") }}</p></b-col
				>
			</b-row>
			<b-row
				class="pt-1 pb-2 mx-0 valueRow"
				v-for="(sDetails, i) in summaryObj.summaryDetails"
				:key="'details' + i"
			>
				<b-col class="table-heading pt-2" cols="4"
					><p>{{ sDetails.indicatorName }}</p></b-col
				>
				<b-col cols="2"
					><div class="summary-dot">
						{{ sDetails.prevValue === null ? "NA" : sDetails.prevValue }}
					</div></b-col
				>
				<b-col cols="2"
					><div class="summary-dot">
						{{ sDetails.currValue === null ? "NA" : sDetails.currValue }}
					</div></b-col
				>
				<b-col cols="2">
					<div class="summary-dot" :class="sDetails.colorLastYr">
						{{ sDetails.change === null ? "NA" : sDetails.change }}
					</div></b-col
				>
				<b-col cols="2"><div class="summary-dot">61.5%</div></b-col>
			</b-row>
			<b-row>
				<b-col sm="12">
					<p>
						{{ $t("performance_against_benchmark") }}
						{{
							summaryObj.summaryDetails[0].benchmarkValue
								? `(${summaryObj.summaryDetails[0].benchmarkValue})`
								: ""
						}}
						<span class="ml-3">
							<template
								v-if="
									summaryObj.summaryDetails[0].performanceBenchmarking === 'N/A'
								"
							>
								{{ summaryObj.summaryDetails[0].performanceBenchmarking }}
							</template>
							<img
								v-else
								alt="s_icon"
								class="equalTosign w-20px"
								:src="
									require(`@/assets/img/ministerialSummaryIcon/${getIcon(
										summaryObj.summaryDetails[0].performanceBenchmarking
									)}`)
								"
							/>
						</span>
					</p>
				</b-col>
			</b-row>
			<b-row>
				<b-col sm="12">
					<p class="">
						<span
							v-html="getSummaryText(summaryObj.summaryDetails[0].summaryText)"
						></span>
					</p>
				</b-col>
			</b-row>
		</b-col>
		<b-col class="anc-map" sm="12" lg="6">
			<div class="map-header mb-3" v-show="isJsonFetched">
				<div v-if="locationPeriod">
					<h6 class="map-title pt-1">
						{{ locationPeriod.locationName }}
					</h6>
				</div>
				<div class="ml-2" v-if="indList.length > 0">
					<b-form-select
						class="mapDropdown"
						v-model="selectedInd"
						:options="indList"
					></b-form-select>
				</div>
			</div>
			<MapComponent
				@getGeoJson="getGeoJson"
				:allGeoJson="allGeoJson"
				:selectedInd="selectedInd"
				:chartData="summaryObj.trend"
				:locationPeriod="locationPeriod"
				@isJsonFetched="isJsonFetched = true"
			/>
		</b-col>
		<!-- tablemap-col2 -->
		<b-col class="anc-charts" sm="12" lg="6">
			<HighChartComponentDynamic
				:chartData="summaryObj.trend"
				class="border-bottom"
				:dataFetched="true"
				:chartType="'period'"
				:isHideOption="true"
				:chartConfigData="summaryObj.chartConfigData"
				/>
			</b-col>
			<b-col class="anc-charts" sm="12" lg="6">
				<HighChartComponentDynamic
				:chartData="summaryObj.regional"
				class="border-bottom"
				:dataFetched="true"
				:chartType="'regional'"
				:isHideOption="true"
			/>
		</b-col>
	</b-row>
</template>
<script>
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import HighChartComponentDynamic from "@/components/Highcharts/HighChartComponentDynamic";
export default {
	props: ["summaryObj", "allGeoJson", "locationPeriod"],
	mixins: [SummaryViewMixin],
	components: {
		HighChartComponentDynamic,
		MapComponent: () =>
			import(
				/*webpackChunkName: "MapComponent"*/ "@/components/Maps/MapComponent"
			),
	},
	data() {
		return {
			indList: [],
			selectedInd: "",
			isJsonFetched: false,
		};
	},
	methods: {
		getGeoJson(loc, obj) {
			this.$emit("getGeoJson", loc, obj);
		},
	},
	created() {
		this.indList =
			this.summaryObj &&
			this.summaryObj.summaryDetails &&
			this.summaryObj.summaryDetails.length
				? this.summaryObj.summaryDetails.map((s) => ({
						value: s.indicatorName,
						text: s.indicatorName,
				  }))
				: [];
		this.selectedInd = this.indList.length ? this.indList[0].value : "";
	},
};
</script>

<style scoped></style>
