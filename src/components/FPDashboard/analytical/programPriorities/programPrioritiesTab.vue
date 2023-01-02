<template>
	<div v-show="!reportChartData">
		<div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
			<a href="#" id="tabbar-expand">
				<i class="fas fa-filter"></i>
			</a>
		</div>
		<div class="container-fluid m-t-20px px-0">
			<div class="row">
				<div class="col-lg-12 d-none">
					<ul class="nav nav-pills mb-3" id="prog-sub-tab" role="tablist">
						<li
							class="nav-item"
							v-if="
								comparingPPFPUptakeDisable ||
								trendsInPPFPRegionDisable ||
								PPFPContinnumDisable ||
								comparingPPFPRegionDisable ||
								overAllPPFPUseDisable ||
								PPFPServiceProMapDataDisable
							"
						>
							<a
								class="nav-link"
								:class="{
									active:
										comparingPPFPUptakeDisable ||
										trendsInPPFPRegionDisable ||
										PPFPContinnumDisable ||
										comparingPPFPRegionDisable ||
										overAllPPFPUseDisable ||
										PPFPServiceProMapDataDisable,
								}"
								id="programmatic_priority_indicators"
								data-toggle="pill"
								href="#pro_priorities_indicators_tab"
								role="tab"
								aria-controls="pro_priorities_indicators_tab"
								aria-selected="false"
								@click="getActiveTab('program')"
								>{{ $t("post_partum") }}</a
							>
						</li>

						<li
							class="nav-item"
							v-if="
								youthChart1Disable ||
								youthChart2Disable ||
								adolescentPregnancyDisable ||
								adolescentPregnancyTrendDisable ||
								youthNoMethodDisable ||
								youthNoMethodTrendDisable ||
								youthAvailabilityDisable ||
								youthAvailabilityTrendDisable
							"
						>
							<a
								class="nav-link"
								:class="{
									active:
										!(
											comparingPPFPUptakeDisable ||
											trendsInPPFPRegionDisable ||
											PPFPContinnumDisable ||
											comparingPPFPRegionDisable ||
											overAllPPFPUseDisable ||
											PPFPServiceProMapDataDisable
										) &&
										(youthChart1Disable ||
											youthChart2Disable ||
											adolescentPregnancyDisable ||
											adolescentPregnancyTrendDisable ||
											youthNoMethodDisable ||
											youthNoMethodTrendDisable ||
											youthAvailabilityDisable ||
											youthAvailabilityTrendDisable),
								}"
								id="programmatic_youth_indicators"
								data-toggle="pill"
								href="#pro_youth_indicators_tab"
								role="tab"
								aria-controls="pro_youth_indicators_tab"
								aria-selected="false"
								@click="getActiveTab('youth')"
								>{{ $t("youth") }}</a
							>
						</li>
					</ul>
				</div>
				<div class="col-lg-12">
					<TabSummary
						v-if="
							ppResponse_youth.programPriorities &&
							activeTab == 'program' &&
							ppResponse_youth.programPriorities['Category_Data'] &&
							ppResponse_youth.programPriorities['Category_Data'][
								'categoryInformation'
							] &&
							(comparingPPFPUptakeDisable ||
								trendsInPPFPRegionDisable ||
								PPFPContinnumDisable ||
								comparingPPFPRegionDisable ||
								overAllPPFPUseDisable ||
								PPFPServiceProMapDataDisable)
						"
						:content="
							ppResponse_youth.programPriorities['Category_Data'][
								'categoryInformation'
							]
						"
						contKey="program"
					/>

					<TabSummary
						v-if="
							ppResponse_youth.youth &&
							activeTab == 'youth' &&
							ppResponse_youth.youth['Category_Data'] &&
							ppResponse_youth.youth['Category_Data']['categoryInformation'] &&
							(youthChart1Disable ||
								youthChart2Disable ||
								adolescentPregnancyDisable ||
								adolescentPregnancyTrendDisable ||
								youthNoMethodDisable ||
								youthNoMethodTrendDisable ||
								youthAvailabilityDisable ||
								youthAvailabilityTrendDisable)
						"
						:content="
							ppResponse_youth.youth['Category_Data']['categoryInformation']
						"
						contKey="youth"
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
									<span>
										<i class="fa fa-arrows-v"></i>
									</span>
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
									<div class="card">
										<div class="card-header p-10px text-decoration-none">
											<div class="row no-gutters">
												<div
													class="col-lg-8 col-md-8 p-t-4px"
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
													></i>
													{{ mapIndicatorName }}
												</div>
											</div>
										</div>
										<div
											class="card-body position-relative"
											style="height: calc(100vh - 300px); padding: 0.25rem"
										>
											<anchor-Map
												v-if="componentKey && mapObj.indiId"
												:defaultLevelID="defaultLevelID"
												:defaultLocationID="defaultLocationID"
												:subLevelID="subLevelID"
												:period="period"
												:periodLength="periodLength"
												:mapObj="mapObj"
												:mapConfigData="mapConfigData"
												@setIndicatordata="setIndicatordata"
												:resetCurrentLevel="resetCurrentLevel"
												:locationChanged="locationChanged"
												:toolbarLevelID="toolbarLevelID"
												:toolbarLocationID="toolbarLocationID"
												@setLocationOnReset="setLocationOnReset"
												:facilityLevelID="facilityLevel"
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
							class="col-8 p-x-0px pl-3"
							id="progchartcontainer"
							:class="{ 'col-12': !mapConfigAvailable || maptoggle }"
						>
							<div class="tab-content">
								<div
									class="tab-pane"
									:class="{
										'show active':
											(comparingPPFPUptakeDisable ||
												trendsInPPFPRegionDisable ||
												PPFPContinnumDisable ||
												comparingPPFPRegionDisable ||
												overAllPPFPUseDisable ||
												PPFPServiceProMapDataDisable) &&
											activeTab === 'program',
									}"
									id="pro_priorities_indicators_tab"
									role="tabpanel"
									aria-labelledby="programmatic_priority_indicators"
									v-if="
										(comparingPPFPUptakeDisable ||
											trendsInPPFPRegionDisable ||
											PPFPContinnumDisable ||
											comparingPPFPRegionDisable ||
											overAllPPFPUseDisable ||
											PPFPServiceProMapDataDisable) &&
										activeTab === 'program'
									"
								>
									<div class="row dashboardchart-container">
										<div
											class="col-lg-12 col-xl-12"
											
										>
											<div
												class="row"
												v-if="
													comparingPPFPUptakeDisable &&
													comparingPPFPUptake.series.length
												"
											>
												<div class="col-12">
													<chartTableToggleComp
														:title="comparingPPFPUptakeTitle"
														:chartData="comparingPPFPUptake"
														source="DHIS 2"
														chartRef="comparingPPFPUptake"
														sortMenu="type4"
														:chartInfo="comparingPPFPUptakeChartInfo"
														:cid="comparingPPFPUptakeCID"
														:excludeHigherRegion="false"
														:higherRegionName="higherRegion"
														:originalData="comparingPPFPUptakeOriginalData"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="comparingPPFPUptake"
													/>
												</div>
											</div>
											<div class="row" v-if="showPlaceholder">
												<div class="col-12">
													<PlaceholderChart />
												</div>
											</div>
											<div
												class="row mt-4"
												v-if="
													trendsInPPFPRegionDisable &&
													trendsInPPFPRegion.series.length
												"
											>
												<div class="col-12">
													<chartTableToggleComp
														:title="trendsInPPFPRegionTitle"
														:chartData="trendsInPPFPRegion"
														source="DHIS 2"
														chartRef="trendsInPPFPRegion"
														sortMenu="type1"
														:chartInfo="trendsInPPFPRegionChartInfo"
														:cid="trendsInPPFPRegionCID"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="trendsInPPFPRegion"
													/>
												</div>
											</div>
											<div
												class="row mt-4"
												v-if="
													PPFPContinnumDisable && PPFPContinnum.series.length
												"
											>
												<div class="col-12">
													<chartTableToggleComp
														:title="PPFPContinnumTitle"
														:chartData="PPFPContinnum"
														source="DHIS 2"
														chartRef="PPFPContinnum"
														sortMenu="type4"
														:chartInfo="PPFPContinnumChartInfo"
														:cid="PPFPContinnumCID"
														:excludeHigherRegion="false"
														:higherRegionName="higherRegion"
														:originalData="PPFPContinnumOriginalData"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="PPFPContinnum"
														:btns="[
															{
																text: '#',
																value: 'number',
																class: 'color-white mr-2',
															},
															{
																text: '%',
																value: 'percentage_delivering',
																class: 'color-white',
															},
														]"
														activeButton="number"
													/>
												</div>
											</div>
											<div
												class="row mt-4"
												v-if="
													comparingPPFPRegionDisable &&
													comparingPPFPRegion.series.length
												"
											>
												<div class="col-12">
													<chartTableToggleComp
														:title="comparingPPFPRegionTitle"
														:chartData="comparingPPFPRegion"
														source="DHIS 2"
														chartRef="comparingPPFPRegion"
														sortMenu="type2"
														:chartInfo="comparingPPFPRegionChartInfo"
														:cid="comparingPPFPRegionCID"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="comparingPPFPRegion"
													/>
												</div>
											</div>
											<div
												class="row mt-4"
												v-if="
													overAllPPFPUseDisable && overAllPPFPUse.series.length
												"
											>
												<div class="col-12">
													<chartTableToggleComp
														:title="overAllPPFPUseTitle"
														:chartData="overAllPPFPUse"
														source="DHIS 2"
														chartRef="overAllPPFPUse"
														sortMenu="type2"
														:chartInfo="overAllPPFPUseChartInfo"
														:cid="overAllPPFPUseCID"
														:excludeHigherRegion="false"
														:higherRegionName="higherRegion"
														:originalData="overAllPPFPUseOriginalData"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="overAllPPFPUse"
														:btns="[
															{
																text: '#',
																value: 'stack_number',
																class: 'color-white mr-2',
															},
															{
																text: '%',
																value: 'stack_percentage',
																class: 'color-white',
															},
														]"
														activeButton="stack_percentage"
													/>
												</div>
											</div>
											<div
												class="row mt-4 m-b-40px"
												v-if="PPFPServiceProMapDataDisable"
											>
												<div class="col-lg-12">
													<div class="card">
														<div class="card-header">
															<i
																class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2"
																aria-hidden="true"
																v-b-popover.hover.rightbottom="{
																	variant: 'info',
																	content: rightPriorityMapChartInfo,
																	title: 'PPFP Service Provider',
																	html: true,
																}"
															></i>
															{{ $t("PPFP_ServiceProvider") }}
														</div>
														<div
															class="card-body"
															style="
																height: calc(100vh - 300px);
																padding: 0.25rem;
															"
														>
															<anchor-Map
																v-if="
																	componentKey &&
																	bPPFPServiceProMap &&
																	mapObj.indiId
																"
																:defaultLevelID="defaultLevelID"
																:defaultLocationID="defaultLocationID"
																:subLevelID="subLevelID"
																:period="period"
																:periodLength="periodLength"
																:mapObj="PPFPServiceProMapOptions"
																:mapConfigData="PPFPServiceProMapData"
																:locationChanged="locationChanged"
																:toolbarLevelID="toolbarLevelID"
																:toolbarLocationID="toolbarLocationID"
																@setLocationOnReset="setLocationOnReset"
																:facilityLevelID="facilityLevel"
																:periodType="periodType"
															/>
														</div>
													</div>
												</div>
											</div>
											<div
												class="text-center"
												v-if="
													!comparingPPFPUptakeDisable &&
													!trendsInPPFPRegionDisable &&
													!PPFPContinnumDisable &&
													!comparingPPFPRegionDisable &&
													!overAllPPFPUseDisable &&
													!PPFPServiceProMapDataDisable
												"
											>
												<b-alert variant="info" show class="m-0">{{
													$t("rr_text5")
												}}</b-alert>
											</div>
										</div>
									</div>
								</div>
								<!-- !(
												comparingPPFPUptakeDisable ||
												trendsInPPFPRegionDisable ||
												PPFPContinnumDisable ||
												comparingPPFPRegionDisable ||
												overAllPPFPUseDisable ||
												PPFPServiceProMapDataDisable
											) -->
								<div
									class="tab-pane"
									:class="{
										'active show':
											(youthChart1Disable ||
												youthChart2Disable ||
												adolescentPregnancyDisable ||
												adolescentPregnancyTrendDisable ||
												youthNoMethodDisable ||
												youthNoMethodTrendDisable ||
												youthAvailabilityDisable ||
												youthAvailabilityTrendDisable) &&
											activeTab === 'youth',
									}"
									id="pro_youth_indicators_tab"
									role="tabpanel"
									aria-labelledby="programmatic_youth_indicators"
									v-if="
										(youthChart1Disable ||
											youthChart2Disable ||
											adolescentPregnancyDisable ||
											adolescentPregnancyTrendDisable ||
											youthNoMethodDisable ||
											youthNoMethodTrendDisable ||
											youthAvailabilityDisable ||
											youthAvailabilityTrendDisable) &&
										activeTab === 'youth'
									"
								>
									<div
										class="row dashboardchart-container m-t-20px"
										id="youthtabwrapper"
									>
										<div
											class="col-lg-12 col-xl-12"
											id="youthchartcontainer"
											
										>
											<div class="row">
												<div
													v-if="
														ppResponse_youth.youth &&
														ppResponse_youth.youth.Youth &&
														youthChart1Disable
													"
													class="col-lg-6 col-xl-12 mb-4"
												>
													<div class="card">
														<chartComponent
															chartSubCategory="youth"
															chartComponent="Youth"
															viewTypeClass="access-chart1"
															:chartName="$t('chartHeading')"
															:sendPeriod="period"
															:periodType="periodType"
															:sendLocation="sendLocation"
															:ministrialData="ppResponse_youth"
															periodLen="1"
															:globalFactorsData="{}"
															cardKey="youthChart1Disable"
															key="youthChart1Disable"
															@hideCard="hideCard"
															dataFunction="dxTotalOUDataAccessNew"
															:noDerivedSettings="true"
															:total="false"
															:facilityLevel="facilityLevel"
															chartType="region"
															:applicationFinalYear="applicationFinalYear"
															:reportChartData="reportChartData"
														/>
													</div>
												</div>
												<div
													v-if="
														ppResponse_youth.youth &&
														ppResponse_youth.youth.Youth &&
														youthChart2Disable
													"
													class="col-lg-6 col-xl-12 mb-4"
												>
													<div class="card">
														<chartComponent
															chartSubCategory="youth"
															chartComponent="Youth"
															viewTypeClass="access-chart2"
															:chartName="$t('chartHeading')"
															:sendPeriod="period"
															:periodType="periodType"
															:sendLocation="sendLocation"
															:ministrialData="ppResponse_youth"
															periodLen="12"
															:globalFactorsData="{}"
															cardKey="youthChart2Disable"
															key="youthChart2Disable1"
															@hideCard="hideCard"
															:cyp="false"
															:derivedChart="true"
															dataFunction="dxTotalOUDataAccessNew"
															sorting="type3"
															defaultSort="JAN-DEC"
															:facilityLevel="facilityLevel"
															chartType="period"
															:applicationFinalYear="applicationFinalYear"
															:reportChartData="reportChartData"
														/>
													</div>
												</div>
												<div
													class="col-lg-6 col-xl-12 mb-4"
													v-if="
														adolescentPregnancyDisable &&
														adolescentPregnancy.series.length
													"
												>
													<chartTableToggleComp
														:title="adolescentPregnancyTitle"
														:chartData="adolescentPregnancy"
														source="DHIS 2"
														chartRef="adolescentPregnancy"
														sortMenu="type4"
														:chartInfo="adolescentPregnancyChartInfo"
														:cid="adolescentPregnancyCID"
														:excludeHigherRegion="false"
														:higherRegionName="higherRegion"
														:originalData="adolescentPregnancyOriginalData"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="adolescentPregnancy"
													/>
												</div>
												<div
													class="col-lg-6 col-xl-12 mb-4"
													v-if="
														adolescentPregnancyTrendDisable &&
														adolescentPregnancyTrend.series.length
													"
												>
													<chartTableToggleComp
														:title="adolescentPregnancyTrendTitle"
														:chartData="adolescentPregnancyTrend"
														source="DHIS 2"
														chartRef="adolescentPregnancyTrend"
														sortMenu="type3"
														:chartInfo="adolescentPregnancyTrendChartInfo"
														:cid="adolescentPregnancyTrendCID"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="adolescentPregnancyTrend"
													/>
												</div>
												<div
													class="col-lg-6 col-xl-12 mb-4"
													v-if="
														youthNoMethodDisable && youthNoMethod.series.length
													"
												>
													<chartTableToggleComp
														:title="youthNoMethodTitle"
														:chartData="youthNoMethod"
														source="DHIS 2"
														chartRef="youthNoMethod"
														sortMenu="type4"
														:chartInfo="youthNoMethodChartInfo"
														:cid="youthNoMethodCID"
														:excludeHigherRegion="false"
														:higherRegionName="higherRegion"
														:originalData="youthNoMethodOriginalData"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="youthNoMethod"
													/>
												</div>
												<div
													class="col-lg-6 col-xl-12 mb-4"
													v-if="
														youthNoMethodTrendDisable &&
														youthNoMethodTrend.series.length
													"
												>
													<chartTableToggleComp
														:title="youthNoMethodTrendTitle"
														:chartData="youthNoMethodTrend"
														source="DHIS 2"
														chartRef="youthNoMethodTrend"
														sortMenu="type3"
														:chartInfo="youthNoMethodTrendChartInfo"
														:cid="youthNoMethodTrendCID"
														:sortWithCat="true"
														:periodType="periodType"
														cardKey="youthNoMethodTrend"
													/>
												</div>
												<div
													v-if="
														ppResponse_youth.youth &&
														ppResponse_youth.youth.Youth_Availability &&
														youthAvailabilityDisable
													"
													class="col-lg-6 col-xl-12 mb-4"
												>
													<div class="card">
														<chartComponent
															chartSubCategory="youth"
															chartComponent="Youth_Availability"
															viewTypeClass="youth-chart1"
															:chartName="$t('chartHeading')"
															:sendPeriod="period"
															:periodType="periodType"
															:sendLocation="sendLocation"
															:ministrialData="ppResponse_youth"
															periodLen="1"
															:globalFactorsData="{}"
															cardKey="youthAvailabilityDisable"
															key="youthAvailabilityDisable"
															@hideCard="hideCard"
															dataFunction="dxTotalOUDataAccessNew"
															:noDerivedSettings="true"
															:total="false"
															:facilityLevel="facilityLevel"
															chartType="region"
															defaultSort="1-0"
															:applicationFinalYear="applicationFinalYear"
															:reportChartData="reportChartData"
														/>
													</div>
												</div>
												<div
													v-if="
														ppResponse_youth.youth &&
														ppResponse_youth.youth.Youth_Availability &&
														youthAvailabilityTrendDisable
													"
													class="col-lg-6 col-xl-12 mb-4"
												>
													<div class="card">
														<chartComponent
															chartSubCategory="youth"
															chartComponent="Youth_Availability"
															viewTypeClass="youth-chart2"
															:chartName="$t('chartHeading')"
															:sendPeriod="period"
															:periodType="periodType"
															:sendLocation="sendLocation"
															:ministrialData="ppResponse_youth"
															periodLen="12"
															:globalFactorsData="{}"
															cardKey="youthAvailabilityTrendDisable"
															key="youthAvailabilityTrendDisable"
															@hideCard="hideCard"
															:cyp="false"
															:derivedChart="true"
															dataFunction="dxTotalOUDataAccessNew"
															sorting="type3"
															defaultSort="JAN-DEC"
															:facilityLevel="facilityLevel"
															chartType="period"
															:applicationFinalYear="applicationFinalYear"
															:reportChartData="reportChartData"
														/>
													</div>
												</div>
											</div>
											<div
												class="text-center"
												v-if="
													!youthChart1Disable &&
													!youthChart2Disable &&
													!adolescentPregnancyDisable &&
													!adolescentPregnancyTrendDisable &&
													!youthNoMethodDisable &&
													!youthNoMethodTrendDisable &&
													!youthAvailabilityDisable &&
													!youthAvailabilityTrendDisable
												"
											>
												<b-alert variant="info" show class="m-0">{{
													$t("rr_text5")
												}}</b-alert>
											</div>
										</div>
									</div>
								</div>
								<div
									class="text-center"
									v-if="
										!comparingPPFPUptakeDisable &&
										!trendsInPPFPRegionDisable &&
										!PPFPContinnumDisable &&
										!comparingPPFPRegionDisable &&
										!overAllPPFPUseDisable &&
										!PPFPServiceProMapDataDisable &&
										!youthChart1Disable &&
										!youthChart2Disable &&
										!adolescentPregnancyDisable &&
										!adolescentPregnancyTrendDisable &&
										!youthNoMethodDisable &&
										!youthNoMethodTrendDisable &&
										!youthAvailabilityDisable &&
										!youthAvailabilityTrendDisable
									"
								>
									<b-alert variant="info" show class="m-0">{{
										$t("noMappingData")
									}}</b-alert>
								</div>
							</div>
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
			:source="source"
			:locationValue="locationValue"
			:period="period"
			:mapIndicatorID="mapIndicatorID"
			:mapConfigData="mapConfigData"
			:showIndicator="true"
			:showLocation="true"
			:showYear="true"
			:globalPeriodData="globalPeriodData"
			@closeToolbar="closeToolbar"
			:showToolbarOnTablet="showToolbarOnTablet"
			:periodType="periodType"
			:showPeriodType="true"
		/>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import toolbarComponent from "../toolbarComponent";
import chartComponent from "./chartComponent";
import programPrioritiesChartConfig from "./programPrioritiesChartConfig";
import chartTableToggleComp from "./chartTableToggleComp.vue";
import chartConfig from "./chartConfig.js";
// import pptxgen from "pptxgenjs";
import PlaceholderChart from "@/components/Common/PlaceholderChart";
import {
	getDateRange,
	translateDate,
	formatSingleDate,
} from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
export default {
	props: [
		"reportPeriod",
		"reportLocationValue",
		"reportDefaultLevelID",
		"reportDefaultLocationID",
		"reportSubLevelID",
		"reportPeriodType",
		"reportChartData",
		"activateSubTabs",
	],
	mixins: [getCIDMixin],
	components: {
		anchorMap: () =>
			import(/* webpackChunkName: "analytical_map"*/ "../anchorMap/Map.vue"),
		toolbarComponent,
		chartComponent,
		chartTableToggleComp,
		PlaceholderChart,
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
	},
	data() {
		return {
			comparingPPFPUptakeDisable: true,
			trendsInPPFPRegionDisable: true,
			PPFPContinnumDisable: true,
			comparingPPFPRegionDisable: true,
			overAllPPFPUseDisable: true,
			PPFPServiceProMapDataDisable: false,
			youthChart1Disable: true,
			youthChart2Disable: true,
			periodType: "monthly",
			activeTab: "program",
			chartType: "column",
			defaultLevelID: "",
			defaultLocationID: "",
			ppResponse_youth: {},
			sendLocation: [],
			facilityLevel: 0,
			subLevelID: "",
			mapIndicatorID: "",
			source: "Commodities_Client",
			period: "",
			periodLength: 12,
			locationValue: "",
			ppResponse: {},
			adolescentPregnancyTitle: "",
			adolescentPregnancy: JSON.parse(JSON.stringify(chartConfig.normal)),
			adolescentPregnancyChartInfo: "",
			adolescentPregnancyCID: "",
			adolescentPregnancyDisable: true,
			adolescentPregnancyOriginalData: null,
			adolescentPregnancyTrendTitle: "",
			adolescentPregnancyTrend: JSON.parse(JSON.stringify(chartConfig.normal)),
			adolescentPregnancyTrendChartInfo: "",
			adolescentPregnancyTrendCID: "",
			adolescentPregnancyTrendDisable: true,
			youthNoMethodTitle: "",
			youthNoMethod: JSON.parse(JSON.stringify(chartConfig.normal)),
			youthNoMethodChartInfo: "",
			youthNoMethodCID: "",
			youthNoMethodDisable: true,
			youthNoMethodOriginalData: null,
			youthNoMethodTrendTitle: "",
			youthNoMethodTrend: JSON.parse(JSON.stringify(chartConfig.normal)),
			youthNoMethodTrendChartInfo: "",
			youthNoMethodTrendCID: "",
			youthNoMethodTrendDisable: true,
			youthAvailabilityDisable: true,
			youthAvailabilityTrendDisable: true,
			higherRegion: "",
			comparingPPFPUptake: JSON.parse(
				JSON.stringify(programPrioritiesChartConfig.comparingPPFPUptake)
			),
			comparingPPFPUptakeTitle: "",
			comparingPPFPUptakeChartInfo: "",
			comparingPPFPUptakeCID: "",
			comparingPPFPUptakeOriginalData: null,
			trendsInPPFPRegion: JSON.parse(
				JSON.stringify(programPrioritiesChartConfig.trendsInPPFPRegion)
			),
			trendsInPPFPRegionTitle: "",
			trendsInPPFPRegionChartInfo: "",
			trendsInPPFPRegionCID: "",
			PPFPContinnum: JSON.parse(
				JSON.stringify(programPrioritiesChartConfig.PPFPContinnum)
			),
			PPFPContinnumTitle: "",
			PPFPContinnumChartInfo: "",
			PPFPContinnumCID: "",
			PPFPContinnumOriginalData: null,
			overAllPPFPUse: JSON.parse(
				JSON.stringify(programPrioritiesChartConfig.overAllPPFPUse)
			),
			overAllPPFPUseTitle: "",
			overAllPPFPUseChartInfo: "",
			overAllPPFPUseCID: "",
			overAllPPFPUseOriginalData: null,
			comparingPPFPRegion: JSON.parse(
				JSON.stringify(programPrioritiesChartConfig.comparingPPFPRegion)
			),
			comparingPPFPRegionTitle: "",
			comparingPPFPRegionChartInfo: "",
			comparingPPFPRegionCID: "",
			// Anchor Map
			locationChanged: false,
			mapConfigAvailable: true,
			resetCurrentLevel: false,
			componentKey: false,
			mapIndicatorName: "Map",
			mapConfigData: "",
			toolbarLevelID: "",
			toolbarLocationID: "",
			mapObj: {
				indiId: "",
				zoom: 7,
				lat: "",
				lang: "",
			},
			extraMapObj: {
				indiId: "",
				zoom: 7,
				lat: "",
				lang: "",
			},
			/*  */
			bPPFPServiceProMap: false,
			PPFPServiceProMapOptions: {},
			PPFPServiceProMapData: {},
			leftMapChartInfo: "",
			rightPriorityMapChartInfo: "",
			chartInfo: "",
			globalPeriodData: null,
			showToolbarOnTablet: false,
			exportArr: [],
			applicationFinalYear: null,
			maptoggle: false,
		};
	},
	watch: {
		maptoggle() {
			this.$store.state.loading = true;
			this.ppResponse_youth = {};
			this.getProgramConfig();
		},
		activateSubTabs(newValue) {
			this.getActiveTab(newValue);
		},
	},
	computed: {
		showPlaceholder() {
			return (
				this.comparingPPFPUptake.series.length === 0 &&
				this.trendsInPPFPRegion.series.length === 0 &&
				this.PPFPContinnum.series.length === 0 &&
				this.comparingPPFPRegion.series.length === 0 &&
				this.overAllPPFPUse.series.length === 0
			);
		},
	},
	methods: {
		hideMap() {
			this.maptoggle = !this.maptoggle;
		},
		getActiveTab(tab) {
			this.activeTab = tab;
		},
		async exportPPT() {
			this.pageLoader = true;
			let locationName = "";
			await service
				.getIndividualOrganisation(this.sendLocation[2])
				.then((key) => {
					locationName = key.data.name;
				});
			this.pageLoader = false;
			const { value: formValues } = await this.$swal({
				title: this.$i18n.t("export_options"),
				html:
					'<div><input id="fileName" class="swal2-input" placeholder="' +
					this.$i18n.t("fileName_placeholder") +
					'" value="Programatic Priorities" tabindex="-1"/></div>' +
					'<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">' +
					this.$i18n.t("legends") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">' +
					this.$i18n.t("values") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">' +
					this.$i18n.t("x-axis") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">' +
					this.$i18n.t("y-axis") +
					"</label></div></div>",
				focusConfirm: true,
				showCancelButton: true,
				confirmButtonText: "Export",
				preConfirm: () => {
					return [
						document.getElementById("fileName").value,
						document.getElementById("showLegends").checked
							? document.getElementById("showLegends").value
							: "",
						document.getElementById("showValues").checked
							? document.getElementById("showValues").value
							: "",
						document.getElementById("showXAxis").checked
							? document.getElementById("showXAxis").value
							: "",
						document.getElementById("showYAxis").checked
							? document.getElementById("showYAxis").value
							: "",
					];
				},
			});
			if (formValues) {
				let period = translateDate({
					rawDate: this.period,
					periodType: this.periodType,
				});
				import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
					(pptxgen) => {
						let pptx = new pptxgen.default();
						pptx.layout = "LAYOUT_WIDE";
						pptx.author = "Avenir Generic Tool";
						pptx.company = "Dure Technologies";
						pptx.subject = this.$i18n.t("proPrio");
						pptx.title = this.$i18n.t("proPrio");

						pptx.defineSlideMaster({
							title: "MASTER_SLIDE",
							bkgd: "FFFFFF",
							objects: [
								{
									text: {
										text: this.$i18n.t("proPrio"),
										options: {
											y: "2%",
											fontSize: 30,
											align: "center",
											w: "100%",
											underline: true,
										},
									},
								},
								{
									line: {
										align: "center",
										x: 4.2,
										y: "94%",
										w: 5,
										h: 0,
										line: "0088CC",
										lineSize: 1,
									},
								},
								{
									line: {
										align: "center",
										x: 5.2,
										y: "95%",
										w: 3,
										h: 0,
										line: "0088CC",
										lineSize: 1,
									},
								},
								{
									text: {
										text: this.$i18n.t("location") + " :- " + locationName,
										options: {
											x: 0.5,
											y: "95%",
											w: "60%",
											bold: true,
											fontSize: 12,
										},
									},
								},
								{
									text: {
										text: this.$i18n.t("period") + " :- " + period,
										options: {
											x: 0.5,
											y: "98%",
											w: "60%",
											bold: true,
											fontSize: 12,
										},
									},
								},
								{
									text: {
										text: this.$moment(new Date()).format("llll"),
										options: {
											x: 8.5,
											y: "98%",
											w: "30%",
											align: "right",
											fontSize: 12,
											bold: true,
										},
									},
								},
							],
							// slideNumber: { x:0.5, y:'1%'}
						});

						let slide = null;

						if (this.exportArr && this.exportArr.length) {
							let reA = /[^a-zA-Z]/g;
							let reN = /[^0-9]/g;

							this.exportArr.sort((a, b) => {
								let aA = a.cardKey.replace(reA, ""),
									bA = b.cardKey.replace(reA, "");
								if (aA === bA) {
									let aN = parseInt(a.cardKey.replace(reN, ""), 10);
									let bN = parseInt(b.cardKey.replace(reN, ""), 10);
									return aN === bN ? 0 : aN > bN ? 1 : -1;
								} else {
									return aA > bA ? 1 : -1;
								}
							});

							for (let index = 0; index < this.exportArr.length; index++) {
								const element = this.exportArr[index];
								slide = pptx.addSlide("MASTER_SLIDE");
								slide.addText(element.title.title, {
									x: 0.5,
									y: 0.6,
									w: "90%",
									fontSize: 18,
									bold: true,
									underline: true,
									breakLine: true,
								});
								let chartData = [],
									chartColors = [];
								element.series.forEach((e) => {
									if (e.color) {
										chartColors.push(e.color.split("#")[1]);
									} else {
										chartColors.push(
											((Math.random() * 0xffffff) << 0).toString(16)
										);
									}

									let name = e.name,
										labels = [],
										values = [];
									if (e.data && e.data.length) {
										e.data.forEach((ed) => {
											labels.push(ed.name);
											values.push(ed.y);
										});
									}

									chartData.push({
										name,
										labels,
										values,
									});
								});
								let type = element.chart.type;

								let options = {
									x: 0.5,
									y: 1,
									w: "90%",
									h: "75%",
									showValue: formValues[2] === "show" ? true : false,
									showLegend: formValues[1] === "show" ? true : false,
									legendPos: "b",
									barGapWidthPct: 50,
									showCatAxisTitle:
										formValues[3] !== "show"
											? false
											: element.xAxis &&
											  element.xAxis.title &&
											  element.xAxis.title.text
											? true
											: false,
									catAxisTitle:
										element.xAxis &&
										element.xAxis.title &&
										element.xAxis.title.text
											? element.xAxis.title.text
											: "",
									showValAxisTitle:
										formValues[4] !== "show"
											? false
											: element.yAxis &&
											  element.yAxis.title &&
											  element.yAxis.title.text
											? true
											: false,
									valAxisTitle:
										element.yAxis &&
										element.yAxis.title &&
										element.yAxis.title.text
											? element.yAxis.title.text
											: "",
								};

								if (type == "line") {
									type = pptx.ChartType.line;
								} else if (type == "area") {
									type = pptx.ChartType.area;
								} else {
									type = pptx.ChartType.bar;
									options["barDir"] = "col";
									if (
										element.plotOptions &&
										element.plotOptions.series &&
										element.plotOptions.series.stacking === "normal"
									) {
										options["barGrouping"] = "stacked";
									}
								}
								slide.addChart(type, chartData, options);
							}
						}
						pptx.writeFile({ fileName: formValues[0] });
					}
				);
			} else {
				//this.isExport = false
			}
		},
		hideCard(key, value, obj = {}) {
			this[key] = value;
			if (value) {
				let foundIndex = this.exportArr.findIndex(
					(e) => e.cardKey === obj.cardKey
				);
				if (foundIndex >= 0) {
					this.exportArr[foundIndex] = obj;
				} else {
					this.exportArr.push(obj);
				}
			}
			if (
				(this.reportChartData && !obj.hideFromReport) ||
				(this.reportChartData && obj.isReportChart)
			) {
				this.$emit("setReportChart", {
					chartObj: obj,
					chartName: obj?.title?.title || "",
					cid: [obj.cid || ""],
				});
			}
		},
		closeToolbar() {
			this.showToolbarOnTablet = false;
		},
		getSource(source) {
			this.source = source;
			this.calculateComparingPPFPUptake();
			this.calculateTrendsInPPFPRegion();
			this.calculatePPFPContinnum();
			this.calculateOverAllPPFPUse();
			this.calculateComparingPPFPRegion();
		},
		getHigherLocationName() {
			// this.higherRegion = service.getLocationName(this.defaultLocationID);
			service.getIndividualOrganisation(this.defaultLocationID).then((key) => {
				
				this.higherRegion = key.data.displayName;
			});
		},
		getLocation(location) {
			this.comparingPPFPUptakeDisable = true;
			this.trendsInPPFPRegionDisable = true;
			this.PPFPContinnumDisable = true;
			this.comparingPPFPRegionDisable = true;
			this.overAllPPFPUseDisable = true;
			this.PPFPServiceProMapDataDisable = false;
			this.youthChart1Disable = true;
			this.youthChart2Disable = true;
			this.adolescentPregnancyDisable = true;
			this.adolescentPregnancyTrendDisable = true;
			this.youthNoMethodDisable = true;
			this.youthNoMethodTrendDisable = true;
			this.youthAvailabilityDisable = true;
			this.youthAvailabilityTrendDisable = true;
			var res = location.split("/");

			this.sendLocation = [parseInt(res[0]), parseInt(res[0]) + 1, res[1]];

			if (parseInt(res[0]) < 6) {
				this.toolbarLevelID = this.defaultLevelID = parseInt(res[0]);
				this.subLevelID = parseInt(res[0]) + 1;
				this.toolbarLocationID = this.defaultLocationID = res[1];
				this.locationValue = location;
				this.locationChanged = "";
				this.locationChanged = true;
				setTimeout(() => {
					this.mapObj.indiId = "";
					this.mapObj.indiId = this.mapIndicatorID;
				}, 900);
			}
			this.getHigherLocationName();
			this.getIndicatorMapData();
			this.calculateComparingPPFPUptake();
			this.calculateTrendsInPPFPRegion();
			this.calculatePPFPContinnum();
			this.calculateOverAllPPFPUse();
			this.calculateComparingPPFPRegion();
			this.calculateSubnationalComparison(
				"adolescentPregnancy",
				"adolescentPregnancyTrend",
				"Adolescent_Pregnancy"
			);
		},
		getMapIndicatorID(id) {
			this.mapIndicatorID = id;
			this.mapObj.indiId = "";
			this.mapObj.indiId = this.mapIndicatorID;
			if (id != "monthlyEMU") {
				this.resetCurrentLevel = false;
			} else {
				this.resetCurrentLevel = true;
			}
		},
		getPeriod(p, periodType) {
			this.comparingPPFPUptakeDisable = true;
			this.trendsInPPFPRegionDisable = true;
			this.PPFPContinnumDisable = true;
			this.comparingPPFPRegionDisable = true;
			this.overAllPPFPUseDisable = true;
			this.PPFPServiceProMapDataDisable = false;
			this.youthChart1Disable = true;
			this.youthChart2Disable = true;
			this.adolescentPregnancyDisable = true;
			this.adolescentPregnancyTrendDisable = true;
			this.youthNoMethodDisable = true;
			this.youthNoMethodTrendDisable = true;
			this.youthAvailabilityDisable = true;
			this.youthAvailabilityTrendDisable = true;
			this.period = p;
			this.periodType = periodType;
			// this.locationValue = this.locationValue;
			this.mapObj.indiId = "";
			this.mapObj.indiId = this.mapIndicatorID;
			this.getIndicatorMapData();
			this.calculateComparingPPFPUptake();
			this.calculateTrendsInPPFPRegion();
			this.calculatePPFPContinnum();
			this.calculateOverAllPPFPUse();
			this.calculateComparingPPFPRegion();
			this.calculateSubnationalComparison(
				"adolescentPregnancy",
				"adolescentPregnancyTrend",
				"Adolescent_Pregnancy"
			);
		},
		setLocationOnReset(location) {
			this.locationValue = location;
		},
		getProgramConfig() {
			//adProgramModule
			let key = this.generateKey("adProgramModule");
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			service
				.getSavedConfig(key, false, namespace)
				.then((ppResponse) => {
					this.ppResponse_youth = ppResponse.data;
					this.ppResponse = ppResponse.data.programPriorities;

					this.getIndicatorMapData();
					this.calculateComparingPPFPUptake();
					this.calculateTrendsInPPFPRegion();
					this.calculatePPFPContinnum();
					this.calculateOverAllPPFPUse();
					this.calculateComparingPPFPRegion();
					this.calculateSubnationalComparison(
						"adolescentPregnancy",
						"adolescentPregnancyTrend",
						"Adolescent_Pregnancy"
					);
					this.calculateSubnationalComparison(
						"youthNoMethod",
						"youthNoMethodTrend",
						"Youth_NoMethod"
					);
					this.$store.state.loading = false;
				})
				.catch(() => {
					this.$store.state.loading = false;
				});
		},
		calculateTrend(cData, sSelectedDE, catArray, trendKey) {
			
			let dData = cData.derivedCharts[0].chartOptions;
			this[`${trendKey}Title`] = dData.chartName;
			this[trendKey].chart.type = "line";
			this[trendKey].title.text = dData.title.visible ? dData.title.text : "";
			this[trendKey].subtitle.text = dData.subTitle.visible
				? dData.subTitle.text
				: "";
			this[trendKey].xAxis.title.text = dData.xAxis.visible
				? dData.xAxis.text
				: "";
			this[trendKey].yAxis.title.text = dData.yAxis.visible
				? dData.yAxis.text
				: "";
			this[`${trendKey}ChartInfo`] = dData.chartInfo;
			this[`${trendKey}CID`] = dData.cid;
			this[`${trendKey}Disable`] = !dData.disableChart;
			this[trendKey].series = [];
			let level = [this.toolbarLevelID];
			let period = getDateRange({
				sendPeriod: this.period,
				periodType: this.periodType,
				periodLength: this.periodLength,
				applicationFinalYear: this.applicationFinalYear,
			});
			period = period.reverse().join(";");
			if (sSelectedDE && this[`${trendKey}Disable`]) {
				service
					.getIndicatorData(sSelectedDE, level, this.toolbarLocationID, period)
					.then((response) => {
						if (response.data.rows.length) {
							let pe = response.data.metaData.dimensions.pe;
							// let ou = response.data.metaData.dimensions.ou;
							let valueIndex = 0,
								ouIndex = 0,
								peIndex = 0,
								dxIndex = 0;
							response.data.headers.forEach((h, i) => {
								if (h.name === "value") {
									valueIndex = i;
								}
								if (h.name === "ou") {
									ouIndex = i;
								}

								if (h.name === "pe") {
									peIndex = i;
								}
								if (h.name === "dx") {
									dxIndex = i;
								}
							});
							let categories = [];
							pe.forEach((p) => {
								if (response.data.metaData.items[p]) {
									let formattedPeriod = translateDate({
										rawDate: p,
										periodType: this.periodType,
									});
									categories.push(formattedPeriod);
								}
							});
							let obj = {},
								aTableData = [];
							catArray.forEach((dx) => {
								let rData = {};
								response.data.rows.forEach((r) => {
									if (dx.dx.includes(r[dxIndex])) {
										if (Object.keys(rData).includes(r[ouIndex])) {
											// rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
											if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
												rData[r[ouIndex]][r[peIndex]] =
													Number(rData[r[ouIndex]][r[peIndex]]) +
													Number(r[valueIndex]);
											} else {
												rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
											}
										} else {
											rData[r[ouIndex]] = {
												[r[peIndex]]: Number(r[valueIndex]),
											};
										}
									}
								});

							

								Object.keys(rData).forEach((d) => {
									
									// if (!Object.keys(rData[d]).includes(countryID[0])) {

									

									let name = null,
										color = null,
										visible = null;

									
									Object.keys(response.data.metaData.items).forEach((k) => {
										if (dx.dx.includes(k)) {
											// name = response.data.metaData.items[k].name
											name = dx.name;
											color = dx.color;
											visible = dx.visible;
										}
									});

									obj = {
										name,
										visible,
										data: [],
										color: color
											? color
											: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
										// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
									};

									pe.forEach((p, i) => {
										if (Object.keys(rData[d]).includes(p)) {
											// check for double sum of indicator

											obj.data.push({
												name: categories[i],
												pe: p,
												y: (rData[d][p] * 1).toFixed(2) * 1,
											});

											let isLocationIndex = aTableData.findIndex(
												(a) => a[this.$i18n.t("period")] === categories[i]
											);
											if (isLocationIndex >= 0) {
												aTableData[isLocationIndex] = {
													...aTableData[isLocationIndex],
													[dx.name]: rData[d][p] * 1,
												};
											} else {
												aTableData.push({
													[this.$i18n.t("period")]: categories[i],
													[dx.name]: rData[d][p] * 1,
												});
											}
										} else {
											let isLocationIndex = aTableData.findIndex(
												(a) => a[this.$i18n.t("period")] === categories[i]
											);
											if (isLocationIndex >= 0) {
												aTableData[isLocationIndex] = {
													...aTableData[isLocationIndex],
													[dx.name]: "",
												};
											} else {
												aTableData.push({
													[this.$i18n.t("period")]: categories[i],
													[dx.name]: "",
												});
											}
										}
									});
									this[trendKey].series.push(obj);
									this[trendKey].tableData = aTableData;
									// }
								});
							});
							if (this.reportChartData) {
								this.$emit("setReportChart", {
									chartObj: this[trendKey],
									chartName: dData.chartName,
									cid: [
										this.getCID(this.reportChartData, this[`${trendKey}CID`]),
									],
								});
							}
						} else {
							this[`${trendKey}Disable`] = false;
							if (this.reportChartData) {
								this.$emit("setReportChart", {
									chartObj: this[trendKey],
									chartName: null,
									cid: [
										this.getCID(this.reportChartData, this[`${trendKey}CID`]),
									],
								});
							}
						}
					})
					.catch(() => {
						this[trendKey].series = [];
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this[trendKey],
								chartName: dData.chartName,
								cid: [
									this.getCID(this.reportChartData, this[`${trendKey}CID`]),
								],
							});
						}
					});
			} else {
				this[`${trendKey}Disable`] = false;
				if (this.reportChartData) {
					this.$emit("setReportChart", {
						chartObj: this[trendKey],
						chartName: null,
						cid: [this.getCID(this.reportChartData, this[`${trendKey}CID`])],
					});
				}
			}
		},
		calculateSubnationalComparison(key, trendKey, dataKey) {
			let cData =
				this.ppResponse_youth.youth && this.ppResponse_youth.youth[dataKey]
					? JSON.parse(JSON.stringify(this.ppResponse_youth.youth[dataKey]))
					: null;
			let loadChart = true;
			if (
				this.reportChartData &&
				cData.cid !== this.reportChartData.cid.split("/")[1] &&
				cData.derivedCharts[0].chartOptions.cid !==
					this.reportChartData.cid.split("/")[1] &&
				!this.reportChartData.linkedCharts.find((c) =>
					c.includes(cData.derivedCharts[0].chartOptions.cid)
				) &&
				!this.reportChartData.linkedCharts.find((c) => c.includes(cData.cid))
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (cData) {
					this[`${key}Title`] = cData.chartName;
					this[key].chart.type = cData.chartOptions.chart.type.toLowerCase();
					this[key].title.text = cData.chartOptions.title.visible
						? cData.chartOptions.title.text
						: "";
					this[key].subtitle.text = cData.chartOptions.subTitle.visible
						? cData.chartOptions.subTitle.text
						: "";
					this[key].xAxis.title.text = cData.chartOptions.xAxis.vizible
						? cData.chartOptions.xAxis.title.text
						: "";
					this[key].yAxis.title.text = cData.chartOptions.yAxis.visible
						? cData.chartOptions.yAxis.title.text
						: "";
					this[`${key}ChartInfo`] = cData.chartInfo;
					this[`${key}CID`] = cData.cid;
					this[`${key}Disable`] = !cData.disableChart;
					this[key].series = [];

					let catArray = [],
						aSelectedDE = [],
						sSelectedDE = "";
					cData.chartData.forEach((k) => {
						// let s_name = k.indicator.static_name ? Array.isArray(k.indicator.static_name) ? k.indicator.static_name[0].trim().toLowerCase() : k.indicator.static_name.trim().toLowerCase() : "";

						let allDE = [];
						k.indicator.subIndicator.forEach((s) => {
							if (s.de.length > 0) {
								allDE.push(s.de.flat());
							}
							s.de.forEach((sd) => {
								aSelectedDE.push(sd);
							});
						});
						if (allDE.length > 0) {
							catArray.push({
								name: k.indicator.name,
								dx: allDE.flat(),
								color: k.indicator.color,
								visible: k.indicator.visible,
							});
						}
					});
					sSelectedDE = aSelectedDE.join(";");

				

					let level = [this.toolbarLevelID, this.subLevelID];
					let period = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

					if (aSelectedDE.length > 0 && this[`${key}Disable`]) {
						if (
							!cData.disableChart &&
							cData.derivedCharts.length > 0 &&
							(!this.reportChartData ||
								(this.reportChartData &&
									(this.reportChartData.cid.split("/")[1] ===
										cData.derivedCharts[0].chartOptions.cid ||
										this.reportChartData.linkedCharts.find((c) =>
											c.includes(cData.derivedCharts[0].chartOptions.cid)
										))))
						) {
							this.calculateTrend(cData, sSelectedDE, catArray, trendKey);
						}
						if (
							!this.reportChartData ||
							(this.reportChartData &&
								(this.reportChartData.cid.split("/")[1] === cData.cid ||
									this.reportChartData.linkedCharts.find((c) =>
										c.includes(cData.cid)
									)))
						) {
							service
								.getIndicatorData(
									sSelectedDE,
									level,
									this.toolbarLocationID,
									period
								)
								.then((response) => {
									// let pe = response.data.metaData.dimensions.pe;
									if (response.data.rows.length) {
										let ou = response.data.metaData.dimensions.ou;
										let valueIndex = 0,
											ouIndex = 0,
											peIndex = 0,
											dxIndex = 0;
										response.data.headers.forEach((h, i) => {
											if (h.name === "value") {
												valueIndex = i;
											}
											if (h.name === "ou") {
												ouIndex = i;
											}

											if (h.name === "pe") {
												peIndex = i;
											}
											if (h.name === "dx") {
												dxIndex = i;
											}
										});

										let obj = {},
											aTableData = [];
										catArray.forEach((dx) => {
											let rData = {};
											response.data.rows.forEach((r) => {
												if (dx.dx.includes(r[dxIndex])) {
													if (Object.keys(rData).includes(r[peIndex])) {
														// if(r[ouIndex] !== countryID[0]){
														if (
															Object.keys(rData[r[peIndex]]).includes(
																r[ouIndex]
															)
														) {
															rData[r[peIndex]][r[ouIndex]] =
																Number(rData[r[peIndex]][r[ouIndex]]) +
																Number(r[valueIndex]);
														} else {
															rData[r[peIndex]][r[ouIndex]] = Number(
																r[valueIndex]
															);
														}
														// }
													} else {
														// if(r[ouIndex] !== countryID[0]){
														rData[r[peIndex]] = {
															[r[ouIndex]]: Number(r[valueIndex]),
														};
														// }
													}
												}
											});

											

											Object.keys(rData).forEach((d) => {
												// if (!Object.keys(rData[d]).includes(countryID[0])) {

												let name = null,
													color = null,
													visible = null;

												Object.keys(response.data.metaData.items).forEach(
													(k) => {
														if (dx.dx.includes(k)) {
															// name = response.data.metaData.items[k].name
															name = dx.name;
															color = dx.color;
															visible = dx.visible;
														}
													}
												);

												obj = {
													name,
													visible,
													data: [],
													color: color
														? color
														: "#" +
														  ((Math.random() * 0xffffff) << 0).toString(16),
													// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
												};
												ou.forEach((o) => {
													if (Object.keys(rData[d]).includes(o)) {
														// check for double sum of indicator

														obj.data.push({
															name: response.data.metaData.items[o].name,
															y: (rData[d][o] * 1).toFixed(2) * 1,
														});

														let isLocationIndex = aTableData.findIndex(
															(a) =>
																a[this.$i18n.t("location")] ===
																response.data.metaData.items[o].name
														);
														if (isLocationIndex >= 0) {
															aTableData[isLocationIndex] = {
																...aTableData[isLocationIndex],
																[dx.name]: rData[d][o] * 1,
															};
														} else {
															aTableData.push({
																[this.$i18n.t("location")]:
																	response.data.metaData.items[o].name,
																[dx.name]: rData[d][o] * 1,
															});
														}
													} else {
														let isLocationIndex = aTableData.findIndex(
															(a) =>
																a[this.$i18n.t("location")] ===
																response.data.metaData.items[o].name
														);
														if (isLocationIndex >= 0) {
															aTableData[isLocationIndex] = {
																...aTableData[isLocationIndex],
																[dx.name]: "",
															};
														} else {
															aTableData.push({
																[this.$i18n.t("location")]:
																	response.data.metaData.items[o].name,
																[dx.name]: "",
															});
														}
													}
												});
												this[key].series.push(obj);
												this[key].tableData = aTableData;
												// }
											});
										});
										this[`${key}OriginalData`] = this[key].series;
										let max = 0;
										this[key].series.forEach((s) => {
											if (s.data.length) {
												if (s.data.length > 11) {
													max = 11;
												} else {
													max = s.data.length - 1;
												}
											}
										});
										this[key].xAxis.max = this.reportChartData ? null : max;

										if (this[key].series) {
											this.exportArr.push({ cardKey: "key3", ...this[key] });
										}
										if (this.reportChartData) {
											this.$emit("setReportChart", {
												chartObj: this[key],
												chartName: cData.chartName,
												cid: [
													this.getCID(this.reportChartData, this[`${key}CID`]),
												],
											});
										}
									} else {
										this[`${key}Disable`] = false;
										if (this.reportChartData) {
											this.$emit("setReportChart", {
												chartObj: this[key],
												chartName: null,
												cid: [
													this.getCID(this.reportChartData, this[`${key}CID`]),
												],
											});
										}
									}
								})
								.catch(() => {
									this[key].series = [];
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this[key],
											chartName: cData.chartName,
											cid: [
												this.getCID(this.reportChartData, this[`${key}CID`]),
											],
										});
									}
								});
						}
					} else {
						this[`${key}Disable`] = false;
						this[`${trendKey}Disable`] = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this[key],
								chartName: null,
								cid: [
									this.reportChartData.cid,
									...this.reportChartData.linkedCharts,
								],
							});
						}
					}
				} else {
					this[key].series = [];
					this[trendKey].series = [];
					this[`${key}Disable`] = false;
					this[`${trendKey}Disable`] = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this[key],
							chartName: null,
							cid: [
								this.reportChartData.cid,
								...this.reportChartData.linkedCharts,
							],
						});
					}
				}
			}
		},
		getIndicatorMapData() {
			let oModuleData = this.ppResponse["PPFP_Service_Provider"];
			// this.PPFPServiceProMapDataDisable = oModuleData.mapData[0].indicator.visible;
			this.PPFPServiceProMapDataDisable = false;
			this.PPFPServiceProMapOptions = oModuleData.mapOptions;
			this.PPFPServiceProMapOptions.indiId = "";
			this.PPFPServiceProMapOptions.lang = oModuleData.mapOptions.lng;
			this.PPFPServiceProMapOptions.zoom =
				oModuleData.mapOptions.zoom || oModuleData.mapOptions.mapZoom;
			this.PPFPServiceProMapData = oModuleData.mapData;
			if (
				oModuleData.mapData[0].indicator.subIndicator &&
				oModuleData.mapData[0].indicator.subIndicator[0].de.length
			) {
				this.PPFPServiceProMapOptions.indiId =
					oModuleData.mapData[0].indicator.subIndicator[0].de[0];
				this.bPPFPServiceProMap = true;
			} else {
				this.bPPFPServiceProMap = false;
				this.PPFPServiceProMapDataDisable = false;
			}
		},
		calculateComparingPPFPUptake() {
			
			let sourceConfig = JSON.parse(
				JSON.stringify(this.ppResponse["Comparing_PPFP_Uptake"])
			);
			let loadChart = true;
			if (
				this.reportChartData &&
				sourceConfig.cid !== this.reportChartData.cid.split("/")[1]
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (sourceConfig != undefined) {
					this.comparingPPFPUptakeTitle = sourceConfig.chartName;
					this.comparingPPFPUptake.title.text =
						sourceConfig.chartOptions.title.text;
					this.comparingPPFPUptake.subtitle.text =
						sourceConfig.chartOptions.subTitle.text;
					this.comparingPPFPUptake.xAxis.title.text =
						sourceConfig.chartOptions.xAxis.title.text;
					this.comparingPPFPUptake.yAxis.title.text =
						sourceConfig.chartOptions.yAxis.title.text;
					this.comparingPPFPUptake.series = [];
					this.comparingPPFPUptakeDisable = !sourceConfig.disableChart;
					this.comparingPPFPUptakeChartInfo = sourceConfig.chartInfo;
					this.comparingPPFPUptakeCID = sourceConfig.cid;

					//this.comparingPPFPUptake.xAxis.categories = []

					let cData = sourceConfig.chartData.find(
						(c) => c.indicator.key === "Comp_PPFP_Uptake"
					);


					let sSelectedDE = "",
						aSelectedDE = [];
					cData.indicator.subIndicator.forEach((s) => {
						s.selectedDE.forEach((sd) => {
							aSelectedDE.push(sd.id);
						});
					});
					sSelectedDE = aSelectedDE.join(";");
					let level = [this.toolbarLevelID, this.subLevelID];
					let period = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

					if (aSelectedDE.length > 0 && this.comparingPPFPUptakeDisable) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.toolbarLocationID,
								period
							)
							.then((response) => {
								// let pe = response.data.metaData.dimensions.pe;
								if (response.data.rows.length) {
									let valueIndex = 0,
										ouIndex = 0,
										peIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}

										if (h.name === "pe") {
											peIndex = i;
										}
									});

									let rData = {};

									response.data.rows.forEach((r) => {
										if (Object.keys(rData).includes(r[peIndex])) {
											rData[r[peIndex]][r[ouIndex]] = r[valueIndex];
										} else {
											rData[r[peIndex]] = {
												[r[ouIndex]]: r[valueIndex],
											};
										}
									});


									let obj = {},
										aTableData = [];

									obj = {
										name: cData.indicator.subIndicator[0].name,
										data: [],
										//color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
										//color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
									};

									Object.keys(rData).forEach((d, j) => {
										

										obj.color = cData.indicator.subIndicator[j]
											? cData.indicator.subIndicator[j].color
											: "#" + ((Math.random() * 0xffffff) << 0).toString(16);

										for (var i in rData[d]) {
											//obj.data.push([i, Number(rData[d][i])])
											obj.data.push({
												name: response.data.metaData.items[i].name,
												y: Number(rData[d][i]),
											});
											aTableData.push({
												[this.$i18n.t("location")]:
													response.data.metaData.items[i].name,
												[this.$i18n.t("value")]: Number(rData[d][i]),
											});
										}

										this.comparingPPFPUptake.series.push(obj);
										this.comparingPPFPUptake.tableData = aTableData;
									});
									this.comparingPPFPUptakeOriginalData =
										this.comparingPPFPUptake.series;
									let max = 0;
									this.comparingPPFPUptake.series.forEach((s) => {
										if (s.data.length) {
											if (s.data.length > 11) {
												max = 11;
											} else {
												max = s.data.length - 1;
											}
										}
									});
									this.comparingPPFPUptake.xAxis.max = this.reportChartData
										? null
										: max;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.comparingPPFPUptake,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								} else {
									this.comparingPPFPUptakeDisable = false;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.comparingPPFPUptake,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								}
								this.$store.state.loading = false;
							})
							.catch(() => {
								this.$store.state.loading = false;
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: this.comparingPPFPUptake,
										chartName: sourceConfig.chartName || "",
										cid: [this.reportChartData.cid],
									});
								}
							});
					} else {
						this.comparingPPFPUptakeDisable = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this.comparingPPFPUptake,
								chartName: sourceConfig.chartName || "",
								cid: [this.reportChartData.cid],
							});
						}
					}
				} else {
					this.$store.state.loading = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this.comparingPPFPUptake,
							chartName: sourceConfig.chartName || "",
							cid: [this.reportChartData.cid],
						});
					}
				}
			}
		},
		calculateTrendsInPPFPRegion() {
			let sourceConfig = JSON.parse(
				JSON.stringify(this.ppResponse["Trends_in_PPFP_Uptake"])
			);
			let loadChart = true;
			if (
				this.reportChartData &&
				sourceConfig.cid !== this.reportChartData.cid.split("/")[1]
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (sourceConfig != undefined) {
					this.trendsInPPFPRegionTitle = sourceConfig.chartName;
					this.trendsInPPFPRegion.title.text =
						sourceConfig.chartOptions.title.text;
					this.trendsInPPFPRegion.subtitle.text =
						sourceConfig.chartOptions.subTitle.text;
					this.trendsInPPFPRegion.xAxis.title.text =
						sourceConfig.chartOptions.xAxis.title.text;
					this.trendsInPPFPRegion.yAxis.title.text =
						sourceConfig.chartOptions.yAxis.title.text;
					this.trendsInPPFPRegion.series = [];
					this.trendsInPPFPRegion.xAxis.categories = [];
					this.trendsInPPFPRegionDisable = !sourceConfig.disableChart;
					this.trendsInPPFPRegionChartInfo = sourceConfig.chartInfo;
					this.trendsInPPFPRegionCID = sourceConfig.cid;

					let cData = sourceConfig.chartData.find(
						(c) => c.indicator.key === "Trends_PPFP_Uptake"
					);


					let sSelectedDE = "",
						aSelectedDE = [];
					cData.indicator.subIndicator.forEach((s) => {
						s.selectedDE.forEach((sd) => {
							aSelectedDE.push(sd.id);
						});
					});
					sSelectedDE = aSelectedDE.join(";");
					let level = [this.toolbarLevelID, this.subLevelID];
					let period = getDateRange({
						sendPeriod: this.period,
						periodType: this.periodType,
						periodLength: this.periodLength,
						applicationFinalYear: this.applicationFinalYear,
					});
					period = period.reverse().join(";");
					if (aSelectedDE.length > 0 && this.trendsInPPFPRegionDisable) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.toolbarLocationID,
								period
							)
							.then((response) => {
								if (response.data.rows.length) {
									let pe = response.data.metaData.dimensions.pe;

									let categories = [];
									pe.forEach((p) => {
										if (response.data.metaData.items[p]) {
											let formattedPeriod = translateDate({
												rawDate: p,
												periodType: this.periodType,
											});
											categories.push(formattedPeriod);
											this.trendsInPPFPRegion.xAxis.categories.push(
												formattedPeriod
											);
										}
									});


									let valueIndex = 0,
										ouIndex = 0,
										peIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}

										if (h.name === "pe") {
											peIndex = i;
										}
									});

									let rData = {};

									response.data.rows.forEach((r) => {
										if (Object.keys(rData).includes(r[ouIndex])) {
											rData[r[ouIndex]][r[peIndex]] = r[valueIndex];
										} else {
											rData[r[ouIndex]] = {
												[r[peIndex]]: r[valueIndex],
											};
										}
									});

									Object.keys(rData).forEach((d, dInd) => {
										
										let obj = {};
										obj.name = response.data.metaData.items[d].name;
										obj.color =
											"#" + ((Math.random() * 0xffffff) << 0).toString(16);
										obj.data = [];
										obj.visible = dInd <= 4 ? true : false;

										for (var i in rData[d]) {
											//obj.data.push([i, Number(rData[d][i])])
											//obj.data.push([response.data.metaData.items[i].name, Number(rData[d][i])])
											obj.data.push(Number(rData[d][i]));
										}

										this.trendsInPPFPRegion.series.push(obj);
									});
									/*  */
									let aTableData = [],
										nLenCat = categories.length,
										x;
									for (x = 0; x < nLenCat; x++) {
										let _obj = {
												[this.$i18n.t("period")]: categories[x],
											},
											z = 0,
											aSeries = this.trendsInPPFPRegion.series,
											nLenSeries = aSeries.length;
										for (z = 0; z < nLenSeries; z++) {
											_obj[aSeries[z].name] = aSeries[z].data[x];
										}
										aTableData.push(_obj);
									}
									this.trendsInPPFPRegion.tableData = aTableData;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.trendsInPPFPRegion,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								} else {
									this.trendsInPPFPRegionDisable = false;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.trendsInPPFPRegion,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								}
								this.$store.state.loading = false;
							})
							.catch(() => {
								this.$store.state.loading = false;
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: this.trendsInPPFPRegion,
										chartName: sourceConfig.chartName || "",
										cid: [this.reportChartData.cid],
									});
								}
							});
					} else {
						this.trendsInPPFPRegionDisable = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this.trendsInPPFPRegion,
								chartName: sourceConfig.chartName || "",
								cid: [this.reportChartData.cid],
							});
						}
					}
				} else {
					this.$store.state.loading = false;
					this.trendsInPPFPRegionDisable = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this.trendsInPPFPRegion,
							chartName: sourceConfig.chartName || "",
							cid: [this.reportChartData.cid],
						});
					}
				}
			}
		},
		calculatePPFPContinnum() {
			let sourceConfig = JSON.parse(
				JSON.stringify(this.ppResponse["PPFP_Continuum"])
			);
			let loadChart = true;
			if (
				this.reportChartData &&
				sourceConfig.cid !== this.reportChartData.cid.split("/")[1]
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (sourceConfig != undefined) {
					this.PPFPContinnumTitle = sourceConfig.chartName;
					this.PPFPContinnum.title.text = sourceConfig.chartOptions.title.text;
					this.PPFPContinnum.subtitle.text =
						sourceConfig.chartOptions.subTitle.text;
					this.PPFPContinnum.xAxis.title.text =
						sourceConfig.chartOptions.xAxis.title.text;
					this.PPFPContinnum.yAxis.title.text =
						sourceConfig.chartOptions.yAxis.title.text;
					this.PPFPContinnum.series = [];
					// this.PPFPContinnum.xAxis.categories = [];
					this.PPFPContinnumDisable = !sourceConfig.disableChart;
					this.PPFPContinnumChartInfo = sourceConfig.chartInfo;
					this.PPFPContinnumCID = sourceConfig.cid;

					let cData = sourceConfig.chartData.filter(
						(c) => c.indicator.key === "PPFP_Continuum"
					);
					// let mainIndicator = cData[0].indicator.subIndicator[0].de[0]
					// let indicators = cData.map(c => c.indicator.subIndicator[0].de[0])
					let catArray = [];
					let sSelectedDE = "";
					let aSelectedDE = [];
					cData.forEach((k) => {
						let allDE = [];
						k.indicator.subIndicator.forEach((s) => {
							s.de.forEach((sd) => {
								aSelectedDE.push(sd);
								allDE.push(sd);
							});
						});

						catArray.push({
							name: k.indicator.name,
							dx: allDE,
							color: k.indicator.color,
							visible: k.indicator.visible,
						});
					});

					//cData.indicator.subIndicator.forEach((s, j) => {
					// cData.forEach((x) => {
					//   x.indicator.subIndicator.forEach((s) => {
					//     // s.selectedDE.forEach((sd) => {
					//     //   aSelectedDE.push(sd.id);
					//     // });
					//     s.de.forEach(sd => {
					//       aSelectedDE.push(sd)
					//     })
					//   });
					// });

					sSelectedDE = aSelectedDE.join(";");
					let level = [this.toolbarLevelID, this.subLevelID];
					let period = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

					if (aSelectedDE.length > 0 && this.PPFPContinnumDisable) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.toolbarLocationID,
								period
							)
							.then((response) => {
								if (response.data.rows.length) {
									let ou = response.data.metaData.dimensions.ou;
									let valueIndex = 0,
										ouIndex = 0,
										dxIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "dx") {
											dxIndex = i;
										}
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}
									});

									let obj = {},
										series = [];

									let aTableData = [],
										pPadding = 0;

									catArray.forEach((dx, dxI) => {
										if (dx.dx.length) {
											let rData = {};
											response.data.rows.forEach((r) => {
												if (dx.dx.includes(r[dxIndex])) {
													if (Object.keys(rData).includes(r[ouIndex])) {
														rData[r[ouIndex]] =
															Number(rData[r[ouIndex]]) + Number(r[valueIndex]);
													} else {
														rData[r[ouIndex]] = Number(r[valueIndex]);
													}
												}
											});

											if (dxI === 0) {
												pPadding = 0;
											} else {
												pPadding = pPadding + 0.2;
											}

											// Object.keys(rData).forEach((d, j) => {


											let name = dx.name,
												color = dx.color,
												visible = dx.visible;

											let oTable = {
												[this.$i18n.t("indicators")]: name,
											};
											obj = {
												name,
												visible,
												data: [],
												pointPadding: pPadding.toFixed(2),
												color: color
													? color
													: "#" +
													  ((Math.random() * 0xffffff) << 0).toString(16),
												// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
											};

											ou.forEach((o, i) => {
												if (Object.keys(rData).includes(o)) {
													obj.data.push({
														name: response.data.metaData.items[o].name,
														y: Number(rData[o]),
													});
													oTable[response.data.metaData.items[o].name] = Number(
														rData[o]
													);
												} else {
													obj.data.push({
														name: response.data.metaData.items[o].name,
														y: null,
													});
													oTable[response.data.metaData.items[o].name] = "";
												}
											});
											aTableData.push(oTable);
											this.PPFPContinnum.series.push(obj);
											// })
										}
									});
									this.PPFPContinnum.tableData = aTableData;
									this.PPFPContinnum.numbersData = [
										...this.PPFPContinnum.series,
									];
									this.PPFPContinnumOriginalData = this.PPFPContinnum.series;
									
									let max = 0;
									this.PPFPContinnum.series.forEach((s) => {
										if (s.data.length) {
											if (s.data.length > 11) {
												max = 11;
											} else {
												max = s.data.length - 1;
											}
										}
									});
									this.PPFPContinnum.xAxis.max = this.reportChartData
										? null
										: max;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.PPFPContinnum,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								} else {
									this.PPFPContinnumDisable = false;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.PPFPContinnum,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								}
								this.$store.state.loading = false;
							})
							.catch(() => {
								this.$store.state.loading = false;
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: this.PPFPContinnum,
										chartName: sourceConfig.chartName || "",
										cid: [this.reportChartData.cid],
									});
								}
							});
					} else {
						this.PPFPContinnumDisable = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this.PPFPContinnum,
								chartName: sourceConfig.chartName || "",
								cid: [this.reportChartData.cid],
							});
						}
					}
				} else {
					this.$store.state.loading = false;
					this.PPFPContinnumDisable = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this.PPFPContinnum,
							chartName: sourceConfig.chartName || "",
							cid: [this.reportChartData.cid],
						});
					}
				}
			}
		},
		calculateOverAllPPFPUse() {
			let sourceConfig = JSON.parse(
				JSON.stringify(this.ppResponse["Overall_PPFP_Use"])
			);
			let loadChart = true;
			if (
				this.reportChartData &&
				sourceConfig.cid !== this.reportChartData.cid.split("/")[1]
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (sourceConfig != undefined) {
					this.overAllPPFPUseTitle = sourceConfig.chartName;
					this.overAllPPFPUse.title.text = sourceConfig.chartOptions.title.text;
					this.overAllPPFPUse.subtitle.text =
						sourceConfig.chartOptions.subTitle.text;
					this.overAllPPFPUse.xAxis.title.text =
						sourceConfig.chartOptions.xAxis.title.text;
					this.overAllPPFPUse.yAxis.title.text =
						sourceConfig.chartOptions.yAxis.title.text;
					this.overAllPPFPUse.series = [];
					// this.overAllPPFPUse.xAxis.categories = [];
					this.overAllPPFPUseDisable = !sourceConfig.disableChart;
					this.overAllPPFPUseChartInfo = sourceConfig.chartInfo;
					this.overAllPPFPUseCID = sourceConfig.cid;

					let cData = sourceConfig.chartData.filter(
						(c) => c.indicator.key === "Overall_PPFP_Use"
					);


					let catArray = [];
					let sSelectedDE = "";
					let aSelectedDE = [];
					cData.forEach((k) => {
						let allDE = [];
						k.indicator.subIndicator.forEach((s) => {
							s.de.forEach((sd) => {
								aSelectedDE.push(sd);
								allDE.push(sd);
							});
						});

						catArray.push({
							name: k.indicator.name,
							dx: allDE,
							color: k.indicator.color,
							visible: k.indicator.visible,
						});
					});
					//
					// let sSelectedDE = "",
					//   aSelectedDE = [];
					// //cData.indicator.subIndicator.forEach((s, j) => {
					// cData.forEach((x) => {
					//   x.indicator.subIndicator.forEach((s) => {
					//     s.selectedDE.forEach((sd) => {
					//       aSelectedDE.push(sd.id);
					//     });
					//   });
					// });

					sSelectedDE = aSelectedDE.join(";");
					let level = [this.toolbarLevelID, this.subLevelID];
					let period = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

					if (aSelectedDE.length > 0 && this.overAllPPFPUseDisable) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.toolbarLocationID,
								period
							)
							.then((response) => {
								// let pe = response.data.metaData.dimensions.pe
								if (response.data.rows.length) {
									let ou = response.data.metaData.dimensions.ou;
									let valueIndex = 0,
										ouIndex = 0,
										dxIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "dx") {
											dxIndex = i;
										}
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}
									});

									let obj = {},
										series = [];

									let aTableData = [];

									catArray.forEach((dx, dxI) => {
										let rData = {};
										response.data.rows.forEach((r) => {
											if (dx.dx.includes(r[dxIndex])) {
												if (Object.keys(rData).includes(r[ouIndex])) {
													rData[r[ouIndex]] =
														Number(rData[r[ouIndex]]) + Number(r[valueIndex]);
												} else {
													rData[r[ouIndex]] = Number(r[valueIndex]);
												}
											}
										});


										// Object.keys(rData).forEach((d, j) => {

									

										let name = null,
											color = null,
											visible = null;

										Object.keys(response.data.metaData.items).forEach((k) => {
											if (dx.dx.includes(k)) {
												// name = response.data.metaData.items[k].name
												name = dx.name;
												color = dx.color;
												visible = dx.visible;
											}
										});
										let oTable = { [this.$i18n.t("indicators")]: name };
										obj = {
											name,
											visible,
											data: [],
											color: color
												? color
												: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
											// color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
										};

										ou.forEach((o, i) => {
											if (Object.keys(rData).includes(o)) {
												obj.data.push({
													name: response.data.metaData.items[o].name,
													y: Number(rData[o]),
												});
												oTable[response.data.metaData.items[o].name] = Number(
													rData[o]
												);
											} else {
												obj.data.push({
													name: response.data.metaData.items[o].name,
													y: null,
												});
												oTable[response.data.metaData.items[o].name] = "";
											}
										});
										aTableData.push(oTable);
										this.overAllPPFPUse.series.push(obj);
										// })
									});
									this.overAllPPFPUse.tableData = aTableData;
									this.overAllPPFPUseOriginalData = this.overAllPPFPUse.series;
									let max = 0;
									this.overAllPPFPUse.series.forEach((s) => {
										if (s.data.length) {
											if (s.data.length > 11) {
												max = 11;
											} else {
												max = s.data.length - 1;
											}
										}
									});
									this.overAllPPFPUse.xAxis.max = this.reportChartData
										? null
										: max;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.overAllPPFPUse,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								} else {
									this.overAllPPFPUseDisable = false;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.overAllPPFPUse,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								}
								this.$store.state.loading = false;
							})
							.catch(() => {
								this.$store.state.loading = false;
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: this.overAllPPFPUse,
										chartName: sourceConfig.chartName || "",
										cid: [this.reportChartData.cid],
									});
								}
							});
					} else {
						this.overAllPPFPUseDisable = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this.overAllPPFPUse,
								chartName: sourceConfig.chartName || "",
								cid: [this.reportChartData.cid],
							});
						}
					}
				} else {
					this.$store.state.loading = false;
					this.overAllPPFPUseDisable = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this.overAllPPFPUse,
							chartName: sourceConfig.chartName || "",
							cid: [this.reportChartData.cid],
						});
					}
				}
			}
		},
		calculateComparingPPFPRegion() {
			
			let sourceConfig = JSON.parse(
				JSON.stringify(this.ppResponse["Comparing_PPFP_Method"])
			);
			let loadChart = true;
			if (
				this.reportChartData &&
				sourceConfig.cid !== this.reportChartData.cid.split("/")[1]
			) {
				loadChart = false;
			}
			if (loadChart) {
				if (sourceConfig != undefined) {
					this.comparingPPFPRegionTitle = sourceConfig.chartName;
					this.comparingPPFPRegion.title.text =
						sourceConfig.chartOptions.title.text;
					this.comparingPPFPRegion.subtitle.text =
						sourceConfig.chartOptions.subTitle.text;
					this.comparingPPFPRegion.xAxis.title.text =
						sourceConfig.chartOptions.xAxis.title.text;
					this.comparingPPFPRegion.yAxis.title.text =
						sourceConfig.chartOptions.yAxis.title.text;
					this.comparingPPFPRegion.series = [];
					this.comparingPPFPRegionDisable = !sourceConfig.disableChart;
					this.comparingPPFPRegionChartInfo = sourceConfig.chartInfo;
					this.comparingPPFPRegionCID = sourceConfig.cid;

					let cData = sourceConfig.chartData.filter(
						(c) => c.indicator.key === "Comparing_PPFP_Method"
					);


					let sSelectedDE = "",
						aSelectedDE = [];
					let catArray = [];

					cData.forEach((k) => {
						let allDE = [];
						k.indicator.subIndicator.forEach((s) => {
							s.de.forEach((sd) => {
								aSelectedDE.push(sd);
								allDE.push(sd);
							});
						});
						if (allDE.length) {
							catArray.push({
								name: k.indicator.name,
								dx: allDE,
								color: k.indicator.color,
								visible: k.indicator.visible,
							});
						}
					});

		

					sSelectedDE = aSelectedDE.join(";");
					let level = [this.toolbarLevelID, this.subLevelID];
					let period = formatSingleDate({
						rawDate: this.period,
						periodType: this.periodType,
					});

					if (aSelectedDE.length > 0 && this.comparingPPFPRegionDisable) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.toolbarLocationID,
								period
							)
							.then((response) => {
								if (response.data.rows.length) {
									let ou = response.data.metaData.dimensions.ou;
									let valueIndex = 0,
										ouIndex = 0,
										dxIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "dx") {
											dxIndex = i;
										}
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}
									});

									let obj = {};

									let aTableData = [];

									catArray.forEach((dx, dxI) => {
										let rData = {};
										response.data.rows.forEach((r) => {
											if (dx.dx.includes(r[dxIndex])) {
												if (Object.keys(rData).includes(r[ouIndex])) {
													rData[r[ouIndex]] =
														Number(rData[r[ouIndex]]) + Number(r[valueIndex]);
												} else {
													rData[r[ouIndex]] = Number(r[valueIndex]);
												}
											}
										});


										let name = null,
											color = null,
											visible = null;

										Object.keys(response.data.metaData.items).forEach((k) => {
											if (dx.dx.includes(k)) {
												name = dx.name;
												color = dx.color;
												visible = dx.visible;
											}
										});
										let oTable = { [this.$i18n.t("indicators")]: name };
										obj = {
											name,
											visible,
											data: [],
											color: color
												? color
												: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
										};

										ou.forEach((o, i) => {
											if (Object.keys(rData).includes(o)) {
												obj.data.push({
													name: response.data.metaData.items[o].name,
													y: Number(rData[o]),
												});
												oTable[response.data.metaData.items[o].name] = Number(
													rData[o]
												);
											} else {
												obj.data.push({
													name: response.data.metaData.items[o].name,
													y: null,
												});
												oTable[response.data.metaData.items[o].name] = "";
											}
										});
										aTableData.push(oTable);
										this.comparingPPFPRegion.series.push(obj);
									});

									/* Calculating aggregate percentage for graph only, table still shows actual numbers*/
									let aData = [...this.comparingPPFPRegion.series],
										aCatValue = {};
									aData.forEach((ele) => {
										ele.data.forEach((val, index) => {
											aCatValue[val.name] = (aCatValue[val.name] || 0) + val.y;
										});
									});
									aData.forEach((ele, ind) => {
										let data = [];
										ele.data.forEach((val, index) => {
											let calVal = aCatValue[val.name]
												? ((val.y / aCatValue[val.name]) * 100).toFixed(2) * 1
												: null;
											calVal = calVal > 100 ? 100 : calVal;
											data[index] = {
												name: val.name,
												y: calVal,
											};
										});
										aData[ind].data = data;
									});
									this.comparingPPFPRegion.series = aData;
									this.comparingPPFPRegion.tableData = aTableData;
								
									this.comparingPPFPRegion.numbersData = [
										...this.comparingPPFPRegion.series,
									];
									let max = 0;
									this.comparingPPFPRegion.series.forEach((s) => {
										if (s.data.length) {
											if (s.data.length > 11) {
												max = 11;
											} else {
												max = s.data.length - 1;
											}
										}
									});
									this.comparingPPFPRegion.xAxis.max = this.reportChartData
										? null
										: max;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.comparingPPFPRegion,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
									this.$store.state.loading = false;
								} else {
									this.comparingPPFPRegionDisable = false;
									this.$store.state.loading = false;
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: this.comparingPPFPRegion,
											chartName: sourceConfig.chartName || "",
											cid: [this.reportChartData.cid],
										});
									}
								}
							})
							.catch(() => {
								this.$store.state.loading = false;
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: this.comparingPPFPRegion,
										chartName: sourceConfig.chartName || "",
										cid: [this.reportChartData.cid],
									});
								}
							});
					} else {
						this.comparingPPFPRegionDisable = false;
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: this.comparingPPFPRegion,
								chartName: sourceConfig.chartName || "",
								cid: [this.reportChartData.cid],
							});
						}
					}
				} else {
					this.$store.state.loading = false;
					this.comparingPPFPRegionDisable = false;
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: this.comparingPPFPRegion,
							chartName: sourceConfig.chartName || "",
							cid: [this.reportChartData.cid],
						});
					}
				}
			}
		},
		getAnchorMapConfig() {
			//anchorMapModule
			let key = this.generateKey("adAnchorMapModule");

			service
				.getOrganisationUnitLevels()
				.then((fresponse) => {
					let facility = fresponse.data.find((o) =>
						o.name.toLowerCase().includes("facility")
					);
					if (facility) {
						this.facilityLevel = facility.level;
					} else {
						let facilityLevels = fresponse.data.map(
							(o) => o.level
						);
						this.facilityLevel = Math.max(...facilityLevels);
					}
				})
				.then(() => {
					if (!this.reportChartData) {
						service
							.getSavedConfig(key)
							.then((amResponse) => {
								let anchorMapConfig = amResponse.data.anchorMap.anchorMap;

								if (anchorMapConfig) {
									this.mapObj.zoom = Number(anchorMapConfig.mapOptions.mapZoom);
									this.mapObj.lang = anchorMapConfig.mapOptions.lng;
									this.mapObj.lat = anchorMapConfig.mapOptions.lat;

									let EMUData = anchorMapConfig.mapData.find(
											(m) => !m.indicator.dataMapping
										),
										noEMUData = anchorMapConfig.mapData.filter(
											(m) => m.indicator.dataMapping
										);
									if (EMUData) {
										noEMUData.unshift(EMUData);
										this.mapIndicatorID = this.mapObj.indiId =
											EMUData.indicator.subIndicator[0].de[0];
										this.mapIndicatorName = EMUData.indicator.name;
									} else {
										this.mapIndicatorID = this.mapObj.indiId =
											anchorMapConfig.mapData[0].indicator.subIndicator[0].de[0];
										this.mapIndicatorName =
											anchorMapConfig.mapData[0].indicator.name;
									}

									this.mapConfigData = noEMUData;

									this.componentKey = true;

									this.mapConfigAvailable = true;
								} else {
									this.mapConfigAvailable = false;
								}
							})
							.catch(() => {
								this.$store.state.loading = false;
								this.mapConfigAvailable = false;
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
								this.PPFPServiceProMapDataDisable = false;
							});
					}
				})
				.catch(() => {
					this.$store.state.loading = false;
					this.mapConfigAvailable = false;
				});
		},
		setIndicatordata(iobj) {
			this.mapIndicatorName = iobj[0].indicator.name;
			this.leftMapChartInfo = iobj[0].indicator.chartInfo;
		},
	},
	created() {
		this.getActiveTab(this.activateSubTabs);
		if (this.reportChartData) {
			this.periodType = this.reportPeriodType;
		}
		if (
			this.$store.getters.getGlobalFactors().period &&
			this.$store.getters.getGlobalFactors().period.Period
		) {
			this.globalPeriodData =
				this.$store.getters.getGlobalFactors().period.Period;

			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(this.globalPeriodData.backtrackedMonth * 1, "months")
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(this.globalPeriodData.backtrackedYearLimit * 1, "years")
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
		this.getHigherLocationName();
		this.subLevelID = this.reportChartData
			? this.reportSubLevelID * 1
			: subLevelID;
		this.locationValue = this.reportChartData
			? this.reportLocationValue
			: levelID + "/" + locationID;
		this.sendLocation = [
			parseInt(this.defaultLevelID),
			parseInt(this.subLevelID),
			this.toolbarLocationID,
		];
		this.getAnchorMapConfig();
		this.getProgramConfig();
	},
};
</script>
<style scoped>
.bottom-tabbar {
	z-index: 9999;
}
#dropdownNarration,
#dropdownComments {
	z-index: 9999;
}
</style>