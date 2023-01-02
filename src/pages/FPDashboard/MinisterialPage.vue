<template>
	<div v-show="!reportChartData" id="scrollTop">
		<!-- <div> -->
		<div
			class="mdgridviewpage-bg pt-0"
			id="topDiv"
			:class="{ 'px-0': inAnalytical }"
		>
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
				v-if="!inAnalytical"
				@langChange="langChange"
				@activateTour="activateTour"
			>
				<template v-slot:admin>
					<button
						v-if="$store.getters.getApplicationModule(true).debugging"
						type="button"
						class="btn btn-primary black-btn mr-2 fs-19-1920"
						@click.prevent.stop="exportActivityLogs"
						style="border: 2px solid #fff"
					>
						{{ $t("exportLogs") }}
					</button>
					<button
						type="button"
						class="btn btn-primary black-btn fs-19-1920"
						@click.prevent.stop="exportPPT"
						style="border: 2px solid #fff"
					>
						{{ $t("exportbtn") }}
					</button>
				</template>
			</Header>
			<template>
				<div
					class="sumContainer main"
					:class="[inAnalytical ? 'px-0 mt-0' : '']"
					v-show="
						$store.getters.getActiveTab === 'sd-summary' ||
						$store.getters.getActiveTab === 'summaryTab'
					"
					ref="summarySection"
				>
					<div
						class="row mx-0"
						v-if="ministerialData && sendPeriod && sendLocation"
					>
						<div class="col-md-12">
							<summaryCard
								:ministerialData="ministerialData"
								:sendPeriod="sendPeriod"
								:sendLocation="sendLocation"
								:globalFactorsData="globalFactorsData"
								:emuData="emuData"
								:showEMUCard="showEMUCard"
								:emuMethodData="emuMethodData"
								:locationName="locationName"
								:exportArr="exportArr"
								:periodType="periodType"
								:compareKey="compareKey"
								:isExport="isExport"
								:inAnalytical="inAnalytical"
								@getGeoJson="getGeoJson"
								:allGeoJson="allGeoJson"
							/>
						</div>
					</div>
					<div class="summary-highchart-body mt-1 pt-3" v-else>
						<b-row class="mx-0">
							<b-col sm="12">
								<b-skeleton></b-skeleton>
								<b-skeleton></b-skeleton>
								<b-skeleton></b-skeleton>
							</b-col>
							<b-col sm="6" class="mt-4" v-for="i in 5" :key="i">
								<Placeholder />
							</b-col>
						</b-row>
					</div>
				</div>
			</template>
			<loader v-if="pageLoader" />
			<div
				class="sumContentDiv sumContainer"
				v-if="
					ministerialData && sendPeriod && sendLocation && globalFactorsData.cyp
				"
				v-show="dashboardchartholder"
				id="dashboardchartholder"
			>
				<div class="row mx-0">
					<div class="col-md-12">
						<div
							class="card key_insights position-relative"
							style="
								border: 0;
								width: 100% !important;
								border-radius: 10px 10px 0 0;
							"
						>
							<div
								class="card-header key_insights_div fs-19-1920"
								style="
									background-color: #212121;
									color: #fff;
									border-bottom: none;
									border-radius: 5px;
									border-bottom-left-radius: 0px;
									border-bottom-right-radius: 0px;
									border: 0;
								"
							>
								{{ $t("trends_in_key_indicators") }}
								{{ locationName ? `- ${locationName}` : "" }}
							</div>
							<div class="card-body key-insights_card-body check_box_div">
								<div class="container-fluid dashboardchartholder px-0">
									<div class="row dashboardchart-container">
										<div class="col-12 fs-17-1920">
											{{ $t("trends_in_key_indicators1") }}
										</div>
										<template
											v-if="
												emuChartData &&
												(periodType === 'monthly' || periodType === 'yearly')
											"
										>
											<div
												v-show="$store.getters.getActiveTab === 'sd-summary'"
												class=""
												:class="[layoutView]"
											>
												<cardComponent
													:layoutChanged="layoutView"
													:cardTitle="
														periodType === 'monthly'
															? $t('emu_monthly') + '(%)' + EMUSource
															: $t('emuAnnual') + '(%)' + EMUSource
													"
													:yAxis="$t('EMU') + '(%)'"
													:chartdata="emuChartData"
													:inMD="true"
													:setExtreme="true"
													:canComment="
														$store.getters.getIsAdmin ||
														$store.getters.getUserPermissions.canComment
													"
													:sorting="sorting1"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													key="emuTrend"
												/>
											</div>
										</template>
										<template v-if="key1">
											<div
												class=""
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'Volume-Volume-Visits'
												"
											>
												<chartComponent
													key="key1"
													cardKey="key1"
													periodLen="13"
													defaultSort="JAN-DEC"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Visits"
													dataFunction="totalData"
													:layoutChanged="layoutView"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting2"
													:derivedChart="true"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@hideCard="hideCard"
													@drilldownLocation="getDrillDownLocation"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key1 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
											</div>
										</template>
										<template v-if="key2">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'Volume-Volume-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="totalData"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Client']
													"
													:cyp="true"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting2"
													key="key2"
													cardKey="key2"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key2 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
											</div>
										</template>
										<template v-if="key3">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'Volume-Volume-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="totalData"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Facilities']
													"
													:cyp="true"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting2"
													key="key3"
													cardKey="key3"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key3 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
											</div>
										</template>
										<template v-if="key4">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'Volume-Volume-User'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="User"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="totalData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting2"
													key="key4"
													cardKey="key4"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key4 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource === 'User'))
													"
												/>
											</div>
										</template>
										<template v-if="key17">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Visits'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Visits"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="12"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="globalFactorsData.cyp['Visits']"
													key="key17"
													cardKey="key17"
													@hideCard="hideCard"
													:cyp="true"
													:derivedChart="true"
													dataFunction="dxPEData"
													:sorting="sorting1"
													:plotOptions="plotOptions1"
													defaultSort="JAN-DEC"
													:periodType="periodType"
													chartType="period"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key17 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
												<!-- :noDerivedSettings="true" -->
											</div>
										</template>
										<template v-if="key18">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="12"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Client']
													"
													key="key18"
													cardKey="key18"
													@hideCard="hideCard"
													:cyp="true"
													:derivedChart="true"
													dataFunction="dxPEData"
													:sorting="sorting1"
													:plotOptions="plotOptions1"
													defaultSort="JAN-DEC"
													:periodType="periodType"
													chartType="period"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key18 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
												<!-- :noDerivedSettings="true" -->
											</div>
										</template>
										<template v-if="key19">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="12"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Facilities']
													"
													key="key19"
													cardKey="key19"
													@hideCard="hideCard"
													:cyp="true"
													:derivedChart="true"
													dataFunction="dxPEData"
													:sorting="sorting1"
													:plotOptions="plotOptions1"
													defaultSort="JAN-DEC"
													:periodType="periodType"
													chartType="period"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key19 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
												<!-- :noDerivedSettings="true" -->
											</div>
										</template>
										<template v-if="key5">
											<div
												class="m-t-30px"
												:class="[layoutView]"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'RMNCH-RMNCH-RMNCH'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="RMNCH"
													chartComponent="RMNCH"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key5"
													cardKey="key5"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key5 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'RMNCH' &&
																this.reportChartData.selectedSource ===
																	'RMNCH'))
													"
												/>
											</div>
										</template>
										<template v-if="key6">
											<div
												class="m-t-30px"
												:class="[layoutView]"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'stockOut-stockOut-stockOut'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="stockOut"
													chartComponent="stockOut"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key6"
													cardKey="key6"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													chartType="period"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key6 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'stockOut' &&
																this.reportChartData.selectedSource ===
																	'stockOut'))
													"
												/>
											</div>
										</template>
										<template v-if="key7">
											<div
												class="m-t-30px"
												:class="[layoutView]"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'program-program-Post_Partum'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="program"
													chartComponent="Post_Partum"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key7"
													cardKey="key7"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key7 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'program' &&
																this.reportChartData.selectedSource ===
																	'Post_Partum'))
													"
												/>
											</div>
										</template>
										<template v-if="key8">
											<div
												class="m-t-30px"
												:class="[layoutView]"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'program-program-Youth_Availing'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="program"
													chartComponent="Youth_Availing"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key8"
													cardKey="key8"
													@hideCard="hideCard"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key8 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'program' &&
																this.reportChartData.selectedSource ===
																	'Youth_Availing'))
													"
												/>
											</div>
										</template>
										<template v-if="key9">
											<div
												class="m-t-30px"
												:class="[layoutView]"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Visits'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Visits"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['Visits']
													"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key9"
													cardKey="key9"
													@hideCard="hideCard"
													exclude="reporting rate (on time)"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key9 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
											</div>
										</template>
										<template v-if="key10">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking[
															'Commodities_Client'
														]
													"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key10"
													cardKey="key10"
													@hideCard="hideCard"
													exclude="reporting rate (on time)"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key10 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
											</div>
										</template>
										<template v-if="key11">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking[
															'Commodities_Facilities'
														]
													"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key11"
													cardKey="key11"
													@hideCard="hideCard"
													exclude="reporting rate (on time)"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key11 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
											</div>
										</template>
										<template v-if="key12">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-User'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="User"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['User']
													"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key12"
													cardKey="key12"
													@hideCard="hideCard"
													exclude="reporting rate (on time)"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key12 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource === 'User'))
													"
												/>
											</div>
										</template>
										<template v-if="key31">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Overall'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Overall"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['Overall']
													"
													dataFunction="dxData"
													periodLen="13"
													:pOptions="pOptions"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting1"
													key="key31"
													cardKey="key31"
													@hideCard="hideCard"
													exclude="reporting rate (on time)"
													:derivedChart="true"
													defaultSort="JAN-DEC"
													@drilldownLocation="getDrillDownLocation"
													:periodType="periodType"
													:dashboardchartholder="dashboardchartholder"
													@sendLog="getLog"
													:reportChartData="reportChartData"
													v-if="
														key31 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Overall'))
													"
												/>
											</div>
										</template>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="m-t-20px sumContentDiv sumContainer"
				v-if="
					ministerialData && sendPeriod && sendLocation && globalFactorsData.cyp
				"
				v-show="dashboardchartholder1"
				id="dashboardchartholder1"
			>
				<div class="row mx-0">
					<div class="col-md-12">
						<div
							class="card key_insights position-relative"
							style="
								border: 0;
								width: 100% !important;
								border-radius: 10px 10px 0 0;
							"
						>
							<div
								class="card-header fs-19-1920"
								style="
									background-color: #212121;
									color: #fff;
									border-bottom: none;
									border-radius: 5px;
									border-bottom-left-radius: 0px;
									border-bottom-right-radius: 0px;
									border: 0;
								"
							>
								{{ $t("regional_variation_in_key_indicators") }}
								{{ locationName ? `- ${locationName}` : "" }}
							</div>
							<div class="card-body key-insights_card-body check_box_div">
								<div class="container-fluid dashboardchartholder1 px-0">
									<div class="row dashboardchart-container">
										<div class="col-12 fs-17-1920">
											{{ $t("regional_variation_in_key_indicators1") }}
										</div>
										<template
											v-if="
												regionalEMUchartData &&
												(periodType === 'monthly' || periodType === 'yearly')
											"
										>
											<div
												v-show="$store.getters.getActiveTab === 'sd-summary'"
												class=""
												:class="[layoutView]"
											>
												<cardComponent
													:layoutChanged="layoutView"
													:cardTitle="
														periodType === 'monthly'
															? $t('emu_monthly') + '(%)' + EMUSource
															: $t('emuAnnual') + '(%)' + EMUSource
													"
													:yAxis="$t('EMU') + '(%)'"
													:chartdata="regionalEMUchartData"
													:inMD="true"
													:setExtreme="false"
													:canComment="
														$store.getters.getIsAdmin ||
														$store.getters.getUserPermissions.canComment
													"
													:sorting="sorting3"
													defaultSort="1-0"
													key="emuRegional"
												/>
											</div>
										</template>
										<template v-if="key13">
											<div
												class=""
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'Volume-Volume-Visits'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Visits"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="globalFactorsData.cyp['Visits']"
													key="key13"
													cardKey="key13"
													@hideCard="hideCard"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:noDerivedSettings="true"
													:total="true"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key13 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
											</div>
										</template>
										<template v-if="key14">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'Volume-Volume-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Client']
													"
													dataFunction="dxTotalOUData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting3"
													key="key14"
													cardKey="key14"
													@hideCard="hideCard"
													:cyp="true"
													:noDerivedSettings="true"
													:total="true"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key14 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
											</div>
										</template>
										<template v-if="key15">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'Volume-Volume-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Facilities']
													"
													key="key15"
													cardKey="key15"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													:total="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key15 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
											</div>
										</template>
										<template v-if="key16">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'Volume-Volume-User'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="Volume"
													chartComponent="User"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="globalFactorsData.cyp['User']"
													key="key16"
													cardKey="key16"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													:total="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key16 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'Volume' &&
																this.reportChartData.selectedSource === 'User'))
													"
												/>
											</div>
										</template>
										<template v-if="key28">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Visits'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Visits"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="globalFactorsData.cyp['Visits']"
													key="key28"
													cardKey="key28"
													@hideCard="hideCard"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:cyp="true"
													:methodCYP="true"
													:noDerivedSettings="true"
													:total="true"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key28 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
											</div>
										</template>
										<template v-if="key29">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Client']
													"
													dataFunction="dxTotalOUData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting3"
													key="key29"
													cardKey="key29"
													@hideCard="hideCard"
													:cyp="true"
													:methodCYP="true"
													:noDerivedSettings="true"
													:total="true"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key29 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
											</div>
										</template>
										<template v-if="key30">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'coverage-coverage-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="coverage"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.cyp['Commodities_Facilities']
													"
													key="key30"
													cardKey="key30"
													@hideCard="hideCard"
													:cyp="true"
													:methodCYP="true"
													:noDerivedSettings="true"
													:total="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key30 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'coverage' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
											</div>
										</template>
										<template v-if="key20">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab === 'RMNCH-RMNCH-RMNCH'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="RMNCH"
													chartComponent="RMNCH"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													:globalFactorsData="globalFactorsData.cyp['Visits']"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:sorting="sorting3"
													key="key20"
													cardKey="key20"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key20 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'RMNCH' &&
																this.reportChartData.selectedSource ===
																	'RMNCH'))
													"
												/>
											</div>
										</template>
										<template v-if="key21">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'stockOut-stockOut-stockOut'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="stockOut"
													chartComponent="stockOut"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													key="key21"
													cardKey="key21"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													dataFunctionNonCalculated="dxData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													chartType="region"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key21 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'stockOut' &&
																this.reportChartData.selectedSource ===
																	'stockOut'))
													"
												/>
											</div>
										</template>
										<template v-if="key22">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'program-program-Post_Partum'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="program"
													chartComponent="Post_Partum"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													key="key22"
													cardKey="key22"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key22 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'program' &&
																this.reportChartData.selectedSource ===
																	'Post_Partum'))
													"
												/>
											</div>
										</template>
										<template v-if="key23">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'program-program-Youth_Availing'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="program"
													chartComponent="Youth_Availing"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													key="key23"
													cardKey="key23"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key23 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'program' &&
																this.reportChartData.selectedSource ===
																	'Youth_Availing'))
													"
												/>
											</div>
										</template>
										<template v-if="key24">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Visits'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Visits"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['Visits']
													"
													key="key24"
													cardKey="key24"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key24 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Visits'))
													"
												/>
											</div>
										</template>
										<template v-if="key25">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Commodities_Client'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Commodities_Client"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking[
															'Commodities_Client'
														]
													"
													key="key25"
													cardKey="key25"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key25 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Client'))
													"
												/>
											</div>
										</template>
										<template v-if="key26">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Commodities_Facilities'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Commodities_Facilities"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking[
															'Commodities_Facilities'
														]
													"
													key="key26"
													cardKey="key26"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key26 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Commodities_Facilities'))
													"
												/>
											</div>
										</template>
										<template v-if="key27">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-User'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="User"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['User']
													"
													key="key27"
													cardKey="key27"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key27 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource === 'User'))
													"
												/>
											</div>
										</template>
										<template v-if="key32">
											<div
												class="m-t-30px"
												:class="layoutView"
												v-show="
													$store.getters.getActiveTab === 'sd-summary' ||
													$store.getters.getActiveTab ===
														'reportingRate-reportingRate-Overall'
												"
											>
												<chartComponent
													:layoutChanged="layoutView"
													chartCategory="ministrialModule"
													chartSubCategory="reportingRate"
													chartComponent="Overall"
													:sendPeriod="sendPeriod"
													:sendLocation="sendLocation"
													:ministerialData="ministerialData"
													periodLen="1"
													:applicationFinalYear="applicationFinalYear"
													:globalFactorsData="
														globalFactorsData.rrBenchmarking['Overall']
													"
													key="key32"
													cardKey="key32"
													@hideCard="hideCard"
													:noDerivedSettings="true"
													dataFunction="dxTotalOUData"
													:sorting="sorting3"
													:plotOptions="plotOptions2"
													defaultSort="1-0"
													:periodType="periodType"
													@sendLog="getLog"
													:dashboardchartholder1="dashboardchartholder1"
													:reportChartData="reportChartData"
													v-if="
														key32 &&
														(!this.reportChartData ||
															(this.reportChartData &&
																this.reportChartData.selectedCategory ===
																	'reportingRate' &&
																this.reportChartData.selectedSource ===
																	'Overall'))
													"
												/>
											</div>
										</template>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<toolbarComponent
			@period="getPeriod"
			@location="getLocation"
			:drilldownLocation="drilldownLocation"
			@view="setView"
			:dashboardchartholder.sync="dashboardchartholder"
			:dashboardchartholder1.sync="dashboardchartholder1"
			:layoutView="layoutView"
			:globalPeriodData="globalPeriodData"
			@closeToolbar="closeToolbar"
			:showToolbarOnTablet="showToolbarOnTablet"
			:periodType="periodType"
			:inAnalytical="inAnalytical"
			v-if="layoutView && globalPeriodData"
		/>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import chartComponent from "@/components/FPDashboard/ministerial/chartComponent";
import cardComponent from "@/components/FPDashboard/dqr/monthly/cardComponent";
import toolbarComponent from "@/components/FPDashboard/ministerial/toolbarComponent";
import service from "@/service";
import summaryCard from "@/components/FPDashboard/ministerial/summaryCard_new";
// import pptxgen from "pptxgenjs";
import domtoimage from "dom-to-image";
import ActivityLog from "@/activityLog.js";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import ResetFPMenuMixin from "@/helpers/ResetFPMenuMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
	name: "MinistrialDashboard",
	/* Import custom component */
	props: [
		"inAnalytical",
		"reportChartData",
		"period",
		"reportPeriodType",
		"locationValue",
	],
	mixins: [
		ScrollPageMixin,
		ResetFPMenuMixin,
		DocumentTitleMixin,
		LanguageChangeMixin,
		EmitTourCallbackMixin,
	],
	components: {
		chartComponent,
		toolbarComponent,
		summaryCard,
		cardComponent,
		Placeholder: () =>
			import(
				/* webpackChunkName: "Placeholder"*/ "@/components/Common/Placeholder"
			),
	},
	data() {
		return {
			periodType: "monthly",
			sendPeriod: "",
			keyPeriod: "",
			sendLocation: [],
			ministerialData: null,
			globalFactorsData: {},
			pageLoader: true,
			layoutView: "",
			emuChartData: null,
			emuData: null,
			regionalEMUchartData: null,
			emuMethodData: null,
			dashboardchartholder: false,
			dashboardchartholder1: false,
			key1: true,
			key2: true,
			key3: true,
			key4: true,
			key5: true,
			key6: true,
			key7: true,
			key8: true,
			key9: true,
			key10: true,
			key11: true,
			key12: true,
			key13: true,
			key14: true,
			key15: true,
			key16: true,
			key17: true,
			key18: true,
			key19: true,
			key20: true,
			key21: true,
			key22: true,
			key23: true,
			key24: true,
			key25: true,
			key26: true,
			key27: true,
			key28: true,
			key29: true,
			key30: true,
			key31: true,
			key32: true,
			showSummaryViewMore: true,
			drilldownLocation: "",
			locationName: "",
			exportArr: [],
			EMUSource: "",
			globalPeriodData: null,
			showToolbarOnTablet: false,
			locationList: [],
			compareKey: null,
			applicationFinalYear: null,
			pOptions: [
				{ text: 13, value: 13 },
				{ text: 24, value: 24 },
			],
			activityLogArr: [],
			showEMUCard: true,
			plotOptions1: [],
			plotOptions2: [],
			sorting1: ["JAN-DEC", "DEC-JAN"],
			sorting2: ["0-1", "1-0", "JAN-DEC", "DEC-JAN"],
			sorting3: ["0-1", "1-0", "A-Z", "Z-A"],
			isExport: false,
			allGeoJson: {},
		};
	},
	computed: {
		activeComponent() {
			let component = "SummaryPage";
			//added condition for Analytical dashboard
			if (
				this.$store.getters.getActiveTab !== "sd-summary" &&
				this.$store.getters.getActiveTab !== "summaryTab"
			) {
				component = "ChartComponent";
			}
			return component;
		},
	},
	watch: {
		dashboardchartholder(newValue) {
			if (newValue) {
				this.goto("dashboardchartholder", "dashboardchartholder1", "topDiv");
			} else {
				if (this.dashboardchartholder1) {
					this.scrollPage("dashboardchartholder1");
				} else {
					this.scrollPage("scrollTop");
				}
			}
		},
		dashboardchartholder1(newValue) {
			if (newValue) {
				this.goto("dashboardchartholder1", "dashboardchartholder", "topDiv");
			} else {
				if (this.dashboardchartholder) {
					this.scrollPage("dashboardchartholder");
				} else {
					this.scrollPage("scrollTop");
				}
			}
		},
		activeComponent(newValue) {
			if (newValue === "SummaryPage") {
				this.dashboardchartholder1 = false;
				this.dashboardchartholder = false;
			} else {
				this.dashboardchartholder1 = true;
				this.$nextTick(() => {
					this.dashboardchartholder = true;
				});
			}
		},
	},
	methods: {
		getGeoJson(loc, obj) {
			this.allGeoJson[loc] = obj;
		},
		exportActivityLogs() {
			const fname =
				"MinistreialLogs_" + this.$moment().format("MMMM Do YYYY, h:mm:ss");
			ActivityLog.exportActivityLog(this.activityLogArr, fname);
		},
		getLog(data) {
			this.activityLogArr.push(data);
		},
		closeToolbar() {
			this.showToolbarOnTablet = false;
		},
		async exportPPT() {
			this.pageLoader = true;
			this.isExport = true;
			let summary = null;
			this.$nextTick(async () => {
				let el = this.$refs.summarySection;
				await domtoimage
					.toPng(el)
					.then(function (dataUrl) {
						summary = dataUrl;
					})
					.catch(function (error) {
						console.error("oops, something went wrong!", error);
					});
			});
			this.pageLoader = false;
			const { value: formValues } = await this.$swal({
				title: this.$i18n.t("export_options"),
				html:
					'<div><input id="fileName" class="swal2-input" placeholder="' +
					this.$i18n.t("fileName_placeholder") +
					'" value="' +
					this.$i18n.t("ministerial") +
					'"/></div>' +
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
				confirmButtonText: this.$i18n.t("exportbtn"),
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
				import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
					(pptxgen) => {
						let pptx = new pptxgen.default();
						pptx.layout = "LAYOUT_WIDE";
						pptx.author = "Avenir Generic Tool";
						pptx.company = "Dure Technologies";
						pptx.subject = this.$i18n.t("ministerial");
						pptx.title = this.$i18n.t("ministerial");

						pptx.defineSlideMaster({
							title: "MASTER_SLIDE",
							background: { color: "FFFFFF" },
							objects: [
								{
									text: {
										text: this.$i18n.t("ministerial"),
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
										text: this.$i18n.t("location") + " :- " + this.locationName,
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
										text: this.$i18n.t("period") + " :- " + this.keyPeriod,
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

						let slide = pptx.addSlide("MASTER_SLIDE");
						slide.addText(`${this.$i18n.t("Summary")} ::`, {
							x: 0.5,
							y: 0.6,
							w: "90%",
							fontSize: 18,
							bold: true,
							underline: true,
							breakLine: true,
						});
						if (summary) {
							slide.addImage({
								data: summary,
								x: 0.5,
								y: 0.7,
								w: "90%",
								h: "80%",
							});
						}
						let exportArr = [];
						if (this.dashboardchartholder && this.dashboardchartholder1) {
							exportArr = this.exportArr;
						} else if (this.dashboardchartholder) {
							exportArr = this.exportArr.filter(
								(e) => e.cardKey.substring(3) * 1 < 14
							);
						} else if (this.dashboardchartholder1) {
							exportArr = this.exportArr.filter(
								(e) => e.cardKey.substring(3) * 1 > 13
							);
						}
						if (exportArr && exportArr.length) {
							let reA = /[^a-zA-Z]/g;
							let reN = /[^0-9]/g;

							exportArr.sort((a, b) => {
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

							for (let index = 0; index < exportArr.length; index++) {
								const element = exportArr[index];
								if (element.series.length) {
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
						}
						pptx.writeFile({ fileName: formValues[0] });
						this.isExport = false;
					}
				);
			}
		},
		getDrillDownLocation(locationID, level = this.sendLocation[1]) {
			this.drilldownLocation = level + "/" + locationID;
		},
		hideCard(key, value, obj = {}) {
			this[key] = value;
			// if (value) {
			let foundIndex = this.exportArr.findIndex(
				(e) => e.cardKey === obj.cardKey
			);
			if (foundIndex >= 0) {
				this.exportArr[foundIndex] = obj;
			} else {
				this.exportArr.push(obj);
			}
			// }
			if (
				(this.reportChartData && !obj.hideFromReport) ||
				(this.reportChartData && obj.isReportChart)
			) {
				this.$emit("setReportChart", {
					chartObj: obj,
					chartName: obj?.title?.title || "",
					cid: [this.reportChartData.cid],
				});
			}
		},
		setView(view) {
			this.layoutView = view;
			this.$store.commit("setMDLayout", view);
		},
		goto(refDiv, scrollDiv = null, topScrollDiv = null) {
			// this[refDiv] = !this[refDiv]; //no need to save as value is auto sync from toolbar

			if (this[refDiv]) {
				this.scrollPage(refDiv);
			} else {
				if (!this[scrollDiv]) {
					this.scrollPage(topScrollDiv);
				}
			}
			if (refDiv === "dashboardchartholder1") {
				this.key13 = true;
				this.key14 = true;
				this.key15 = true;
				this.key16 = true;
				this.key20 = true;
				this.key21 = true;
				this.key22 = true;
				this.key23 = true;
				this.key24 = true;
				this.key25 = true;
				this.key26 = true;
				this.key27 = true;
				this.key28 = true;
				this.key29 = true;
				this.key30 = true;
				this.key32 = true;
			}
			if (refDiv === "dashboardchartholder") {
				this.key1 = true;
				this.key2 = true;
				this.key3 = true;
				this.key4 = true;
				this.key5 = true;
				this.key6 = true;
				this.key7 = true;
				this.key8 = true;
				this.key9 = true;
				this.key10 = true;
				this.key11 = true;
				this.key12 = true;
				this.key17 = true;
				this.key18 = true;
				this.key19 = true;
				this.key31 = true;
			}
		},
		/**
		 * This fnc is to get emitted period value from child Toolbar Component.
		 * Usage: `getPeriod()`
		 * @param 'period' which is the emitted value
		 * @return period value
		 */
		getPeriod(period, location, locationList, type) {
			if (location) {
				this.setLocationPeriod(period, location, locationList, type);
			}
		},

		/**
		 * This fnc is to get emitted location value from child Toolbar Component.
		 * Usage: `getLocation()`
		 * @param 'location' which is the emitted value
		 * @return location value
		 */
		getLocation(period, location, locationList, type) {
			if (period) {
				// this.goto('topDiv')
				this.setLocationPeriod(period, location, locationList, type);
			}
		},
		setLocationPeriod(toolbarPeriod, location, locationList, type) {
			this.activityLogArr = [];
			this.dashboardchartholder = this.reportChartData ? true : false;
			this.dashboardchartholder1 = this.reportChartData ? true : false;
			this.$nextTick(() => {
				this.key1 = true;
				this.key2 = true;
				this.key3 = true;
				this.key4 = true;
				this.key5 = true;
				this.key6 = true;
				this.key7 = true;
				this.key8 = true;
				this.key9 = true;
				this.key10 = true;
				this.key11 = true;
				this.key12 = true;
				this.key13 = true;
				this.key14 = true;
				this.key15 = true;
				this.key16 = true;
				this.key17 = true;
				this.key18 = true;
				this.key19 = true;
				this.key20 = true;
				this.key21 = true;
				this.key22 = true;
				this.key23 = true;
				this.key24 = true;
				this.key25 = true;
				this.key26 = true;
				this.key27 = true;
				this.key28 = true;
				this.key29 = true;
				this.key30 = true;
				this.key31 = true;
				this.key32 = true;

				let res = this.reportChartData
						? this.locationValue.split("/")
						: location.split("/"),
					period = this.reportChartData ? this.period : toolbarPeriod;
				this.sendLocation = [parseInt(res[0]), parseInt(res[0]) + 1, res[1]];
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
				if (type === "monthly") {
					this.pOptions = [
						{ text: `13 ${this.$i18n.t("month")}`, value: 13 },
						{ text: `24 ${this.$i18n.t("month")}`, value: 24 },
					];
					this.sendPeriod = this.$moment(period, "YYYY-MM").format("YYYYMM");
					this.keyPeriod = this.$moment(period, "YYYYMM").format("MMM YYYY");
				} else if (type === "financialYear" || type === "financialYearJuly") {
					this.pOptions = [
						{
							text: `13 ${this.$i18n.t("financialYear")}`,
							value: 13,
						},
						{
							text: `24 ${this.$i18n.t("financialYear")}`,
							value: 24,
						},
					];
					this.sendPeriod = period;
					if (type === "financialYear") {
						this.keyPeriod = `${years[1]} ${this.sendPeriod} ${this.$i18n.t(
							"toSmall"
						)} ${years[0]} ${this.sendPeriod * 1 + 1}`;
					} else {
						let period = this.sendPeriod.split("July")[0];
						this.keyPeriod = `${yearsJuly[1]} ${period} ${this.$i18n.t(
							"toSmall"
						)} ${yearsJuly[0]} ${period * 1 + 1}`;
					}
				} else if (type === "quarterly") {
					this.pOptions = [
						{ text: `13 ${this.$i18n.t("quarter")}`, value: 13 },
						{ text: `24 ${this.$i18n.t("quarter")}`, value: 24 },
					];
					this.sendPeriod = period;
					let q1 = this.sendPeriod.split("Q");
					this.keyPeriod =
						quarters[`Q${q1[1]}`][0] +
						" " +
						this.$i18n.t("toSmall") +
						" " +
						quarters[`Q${q1[1]}`][1] +
						" " +
						q1[0];
				} else {
					this.pOptions = [
						{
							text: `13 ${this.$i18n.t("year")}`,
							value: 13,
						},
						{
							text: `24 ${this.$i18n.t("year")}`,
							value: 24,
						},
					];
					this.sendPeriod = period;
					this.keyPeriod = period;
				}
				this.periodType = type;
				this.exportArr = [];
				this.pageLoader = false;
				this.locationList = locationList;
				this.emuChartData = null;
				this.emuData = null;
				this.emuMethodData = null;
				this.regionalEMUchartData = null;
				this.getLocationName();
				if (
					(type === "monthly" || type === "yearly") &&
					!this.reportChartData
				) {
					this.showEMUCard = true;
					this.getEMUData();
				} else {
					this.showEMUCard = false;
				}
			});
		},
		async getLocationName() {
			let locData = await service.flattenLocationList(this.locationList);
			let locFound = locData.find((l) => l.id.includes(this.sendLocation[2]));
			if (locFound) {
				this.locationName = locFound.label;
			} else {
				service.getIndividualOrganisation(this.sendLocation[2]).then((key) => {
					this.locationName = key.data.displayName;
				});
			}
		},

		/**
		 * This fnc is to get ministrialModule.
		 * Usage: `getConfigAccess()`
		 * @param null
		 * @return {Object} ministrialModule, applicationModule
		 */
		getConfigAccess() {
			let key = this.generateKey("ministrialModule");
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			service
				.getSavedConfig(key, false, namespace)
				.then((response) => {
					this.ministerialData = response;
					this.$emit("getConfigDataFP", {
						data: response.data,
						module: "summary",
					});
					let mdData = Object.keys(this.ministerialData.data).filter(
						(m) => m !== "summary"
					);
					if (mdData.length === 0) {
						this.showSummaryViewMore = false;
						this.showAlert(this.$i18n.t("configurationnotavailable"));
					}
				})
				.catch(() => {
					this.showAlert(this.$i18n.t("configurationnotavailable"));
				});
		},
		showAlert(title) {
			this.pageLoader = false;
			if (this.$store.state.isAdmin) {
				// Popup message to set the configurations
				this.$swal({
					title,
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
					title,
					text: this.$i18n.t("error_text_2"),
				});
			}
		},
		getEMUData() {
			let configKey = null;
			if (this.periodType === "monthly") {
				configKey = "monthlyEMU";
			}
			if (this.periodType === "yearly") {
				configKey = "annualEMU";
			}
			let key = this.generateKey(configKey);

			service
				.getSavedConfig(key)
				.then(async (monres) => {
					let locationID = this.sendLocation[2],
						locID = [],
						locIDLabels = [];

					await service
						.getChildOrganisation(this.sendLocation[2])
						.then((response) => {
							service
								.renameKeys({ ...response.data })
								?.children?.forEach((l) => {
									locID.push(l.id.split("/")[1]);
									locIDLabels.push({
										id: l.id.split("/")[1],
										label: l.label,
									});
								});
						});

					let emuData = null,
						emuDataKey = null;
					let emuMethodData = null,
						emuMethodDataKey = null;
					let emuSourceKey = null;

					if (this.periodType === "monthly") {
						emuDataKey = "totalEMU";
						emuMethodDataKey = "methodTrend";
					}

					if (this.periodType === "yearly") {
						emuDataKey = "compEMU";
						emuMethodDataKey = "usersTrend";
					}
					let eData =
						typeof monres.data[emuDataKey] === "string"
							? JSON.parse(monres.data[emuDataKey])
							: monres.data[emuDataKey];
					emuData = eData[locationID];

					if (this.periodType === "yearly") {
						if (emuData.source === this.$i18n.t("emu_output_5")) {
							emuSourceKey = "commoditiesToClients";
						} else if (emuData.source === this.$i18n.t("emu_output_6")) {
							emuSourceKey = "commoditiesToFacilities";
						} else if (emuData.source === this.$i18n.t("emu_output_8")) {
							emuSourceKey = "fp_users";
						} else if (emuData.source === this.$i18n.t("emu_output_7")) {
							emuSourceKey = "fp_visits";
						} else {
							emuSourceKey = "commoditiesToClients";
						}
					}
					let eMethodData =
						typeof monres.data[emuMethodDataKey] === "string"
							? JSON.parse(monres.data[emuMethodDataKey])
							: monres.data[emuMethodDataKey];
					emuMethodData = emuSourceKey
						? eMethodData[locationID][emuSourceKey]
						: eMethodData[locationID];

					if (emuData) {
						this.emuData = emuData;
						this.emuMethodData = emuMethodData;
						let emuObj = null,
							sourceKey = null,
							innerDataKey = null,
							chartSource = null;
						if (this.periodType === "monthly") {
							chartSource = emuData.source;
							sourceKey = this.$i18n.t("EMU");
							innerDataKey = "saveData";
						}
						if (this.periodType === "yearly") {
							if (this.$i18n.locale === "fr") {
								sourceKey = emuData.source
									? emuData.source
									: "EUM : Produits aux clients";
							} else {
								sourceKey = emuData.source
									? emuData.source
									: "EMU :Commodities to clients";
							}
							chartSource = sourceKey.split(":")[1];
							innerDataKey = "data";
						}
						this.compareKey = sourceKey;
						this.EMUSource = ": " + chartSource;
						emuObj = emuData[innerDataKey].find((e) => e.name === sourceKey);
						if (emuObj) {
							let dataArr = [],
								regionalDataArr = [],
								regionalTableArr = [],
								tableArr = [],
								toolbarDate = null;

							let pe = [];
							let formatedCatArray = [];
							if (this.periodType === "monthly") {
								toolbarDate = this.$moment(this.sendPeriod, "YYYYMM").format(
									"YYYYMM"
								);
								for (let i = 23; i >= 0; i--) {
									if (i === 0) {
										pe.push(
											this.$moment(this.sendPeriod, "YYYYMM").format("YYYYMM")
										);
									} else {
										pe.push(
											this.$moment(this.sendPeriod, "YYYYMM")
												.subtract(i, "months")
												.format("YYYYMM")
										);
									}
								}
								emuData.saveCategories.forEach((c) =>
									formatedCatArray.push(
										this.$moment(c, "MMM YYYY").format("YYYYMM")
									)
								);
							}
							if (this.periodType === "yearly") {
								toolbarDate = this.$moment(this.sendPeriod, "YYYY").format(
									"YYYY"
								);
								let yearDiff = toolbarDate - this.applicationFinalYear;
								for (let i = yearDiff; i >= 0; i--) {
									if (i === 0) {
										pe.push(
											this.$moment(this.sendPeriod, "YYYY").format("YYYY")
										);
									} else {
										pe.push(
											this.$moment(this.sendPeriod, "YYYY")
												.subtract(i, "year")
												.format("YYYY")
										);
									}
								}
								formatedCatArray = emuData.categories;
							}

							let drilldown = {
								drillUpButton: {
									position: {
										align: "left",
										x: 0,
										y: 0,
									},
								},
								series: [],
							};

							pe.forEach((p, i) => {
								let formatedDate = null,
									prevDate = null;
								if (this.periodType === "monthly") {
									(formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY")),
										(prevDate = this.$moment(p, "YYYYMM")
											.subtract(1, "months")
											.format("MMM YYYY"));
								}
								if (this.periodType === "yearly") {
									formatedDate = this.$moment(p, "YYYY").format("YYYY");
									prevDate = this.$moment(p, "YYYY")
										.subtract(1, "year")
										.format("YYYY");
								}
								if (formatedCatArray.includes(p)) {
									let catIndex = formatedCatArray.indexOf(p),
										prevCatIndex = formatedCatArray.indexOf(pe[i - 1]);

									tableArr.push({
										Period: formatedDate,
										EMU: emuObj.data[catIndex],
									});
									dataArr.push({
										name: formatedDate,
										y: emuObj.data[catIndex],
										pe: p,
										drilldown:
											i === 0
												? `${emuObj.name} ( ${formatedDate} )`
												: `${emuObj.name} ( ${formatedDate} - ${prevDate} )`,
									});
									let drillObj = {
										name:
											i === 0
												? `${emuObj.name} ( ${formatedDate} )`
												: `${emuObj.name} ( ${formatedDate} - ${prevDate} )`,
										id:
											i === 0
												? `${emuObj.name} ( ${formatedDate} )`
												: `${emuObj.name} ( ${formatedDate} - ${prevDate} )`,
										type: "column",
										data: [],
									};

									Object.keys(eData).forEach((locKey) => {
										if (locID.includes(locKey)) {
											let innerData =
												eData[locKey] &&
												eData[locKey][innerDataKey] &&
												eData[locKey][innerDataKey].length > 0
													? eData[locKey][innerDataKey].find(
															(e) => e.name === sourceKey
													  )
													: null;
											if (innerData) {
												let locName = locIDLabels.find(
													(l) => l.id === locKey
												).label;
												// let catIndex = monres.data['totalEMU'][locKey].saveCategories.indexOf(c)
												let y = null,
													yOriginal = innerData.data[catIndex] * 1,
													color = null;
												if (i === 0) {
													y =
														innerData.data[catIndex] * 1
															? (
																	(innerData.data[catIndex] * 1).toFixed(1) *
																		1 -
																	0
															  ).toFixed(1) * 1
															: null;
													color = y > 0 ? "#5BD282" : "#FE8081";
													drillObj.data.push({
														name: locName,
														y,
														color,
														locationID: locKey,
														originalY: innerData.data[catIndex] * 1,
													});
												} else {
													if (innerData.data[prevCatIndex] * 1) {
														if (innerData.data[catIndex] * 1) {
															y =
																(
																	(innerData.data[catIndex] * 1).toFixed(1) *
																		1 -
																	(innerData.data[prevCatIndex] * 1).toFixed(
																		1
																	) *
																		1
																).toFixed(1) * 1;
														} else {
															y =
																(
																	0 -
																	(innerData.data[prevCatIndex] * 1).toFixed(
																		1
																	) *
																		1
																).toFixed(1) * 1;
														}
													} else if (innerData.data[catIndex] * 1) {
														y =
															(
																(innerData.data[catIndex] * 1).toFixed(1) * 1 -
																0
															).toFixed(1) * 1;
													} else {
														y = null;
													}

													color = y > 0 ? "#5BD282" : "#FE8081";
													drillObj.data.push({
														name: locName,
														y,
														color,
														locationID: locKey,
														originalY: innerData.data[catIndex] * 1,
													});

													if (p === toolbarDate && yOriginal) {
														regionalTableArr.push({
															Location: locName,
															EMU: yOriginal ? yOriginal : "",
														});
														regionalDataArr.push({
															name: locName,
															y: yOriginal ? yOriginal : 0,
															pe: p,
														});
													}
												}
											} else {
												let locName = locIDLabels.find(
													(l) => l.id === locKey
												).label;
												console.log("EMU not found for location ", locName);
											}
										}
									});
									drilldown.series.push(drillObj);
								} else {
									tableArr.push({
										Period: formatedDate,
										EMU: "",
									});
									dataArr.push({
										name: formatedDate,
										y: null,
										pe: p,
										drilldown: null,
									});
								}
							});
							let titleKey = null;
							if (this.periodType === "monthly") {
								titleKey = "emu_monthly";
							}
							if (this.periodType === "yearly") {
								titleKey = "emuAnnual";
							}
							if (dataArr && dataArr.length > 0) {
								let exportEMU = {
									cardKey: "key0",
									chart: {
										type: this.emuData.type,
									},
									title: {
										title: this.$i18n.t(`${titleKey}`) + "(%)",
									},
									xAxis: {
										title: {
											text: "",
										},
									},
									yAxis: {
										title: {
											text: this.$i18n.t("EMU") + " (%)",
										},
									},
									series: [
										{
											name: emuObj.name,
											color: "#7cb5ec",
											data: dataArr,
										},
									],
									drilldown: drilldown,
									showInSummary: true,
									chartComponent: "EMU",
									chartSubCategory: "EMU",
									chartSource: chartSource,
								};
								let foundIndex = this.exportArr.findIndex(
									(e) => e.cardKey === exportEMU.cardKey
								);
								if (foundIndex >= 0) {
									this.exportArr[foundIndex] = exportEMU;
								} else {
									this.exportArr.push(exportEMU);
								}

								emuObj = {
									...emuObj,
									data: dataArr, //.reverse().slice(0, 23)
								};

								this.emuChartData = {
									...emuData,
									data: [emuObj],
									// max: 23,
									drilldown,
									tableData: [
										{
											...emuData.tableData[0],
											data: tableArr,
										},
									],
								};
							} else {
								this.emuData = null;
								this.emuChartData = null;
							}

							if (regionalDataArr && regionalDataArr.length > 0) {
								let exportRegionalEMU = {
									cardKey: "key-1",
									chart: {
										type: "column",
									},
									title: {
										title: this.$i18n.t(`${titleKey}`) + "(%)",
									},
									xAxis: {
										title: {
											text: "",
										},
									},
									yAxis: {
										title: {
											text: this.$i18n.t("EMU") + " (%)",
										},
									},
									series: [
										{
											name: emuObj.name,
											color: "#7cb5ec",
											data: regionalDataArr,
										},
									],
									showInSummary: true,
									chartComponent: "EMU",
									chartSubCategory: "EMU",
									chartSource: chartSource,
								};
								let foundIndex = this.exportArr.findIndex(
									(e) => e.cardKey === exportRegionalEMU.cardKey
								);
								if (foundIndex >= 0) {
									this.exportArr[foundIndex] = exportRegionalEMU;
								} else {
									this.exportArr.push(exportRegionalEMU);
								}

								regionalDataArr.sort((a, b) => {
									let valueA = a.y,
										valueB = b.y;

									let comparison = 0;
									if (valueA > valueB) {
										comparison = -1;
									} else if (valueA < valueB) {
										comparison = 1;
									}
									return comparison;
								});
								let originalEMUObj = emuObj;
								let regionalEMUObj = {
									...originalEMUObj,
									data: regionalDataArr,
								};
								this.regionalEMUchartData = {
									...emuData,
									categories: regionalEMUObj.data.map((r) => r.name),
									type: "column",
									data: [regionalEMUObj],
									// max: 23,
									tableData: [
										{
											...emuData.tableData[0],
											data: regionalTableArr,
										},
									],
								};
							} else {
								this.regionalEMUchartData = null;
							}
						} else {
							this.emuData = null;
							this.emuChartData = null;
							this.regionalEMUchartData = null;
							this.showEMUCard = false;
						}
					} else {
						this.emuData = null;
						this.emuChartData = null;
						this.regionalEMUchartData = null;
						this.showEMUCard = false;
					}
				})
				.catch(() => {
					this.emuData = null;
					this.emuChartData = null;
					this.regionalEMUchartData = null;
					this.showEMUCard = false;
				});
		},
	},
	created() {
		if (this.reportChartData) {
			this.periodType = this.reportPeriodType;
		}
		this.dashboardchartholder = this.reportChartData ? true : false;
		this.dashboardchartholder1 = this.reportChartData ? true : false;
		if (!this.inAnalytical) {
			this.$store.commit("setActiveTab", "sd-summary");
			// document.title = this.$i18n.t("ministerial");
		} else {
			this.$store.commit("setActiveTab", "summaryTab");
		}
		// Redirect to the landige page if 'baseURL' is not found in the sessionStorage
		if (!this.$store.state.baseURL && this.inAnalytical) {
			return;
		}
		// Set default layout type
		if (this.$store.state.mdLayout) {
			this.layoutView = this.$store.state.mdLayout;
		} else {
			// let layout = "col-6 grid-view-card";
			let layout = "col-12";
			this.$store.commit("setMDLayout", layout);
			this.layoutView = layout;
		}
		// Options for periods
		this.pOptions = [
			{ text: `13 ${this.$i18n.t("month")}`, value: 13 },
			{ text: `24 ${this.$i18n.t("month")}`, value: 24 },
		];
		let columnPlot = {
			value: "column",
			text: this.$i18n.t("column"),
		};
		let stackPlot = {
			value: "stack",
			text: this.$i18n.t("stack"),
		};
		let linePlot = {
			value: "line",
			text: this.$i18n.t("line"),
		};
		let areaPlot = {
			value: "area",
			text: this.$i18n.t("area"),
		};

		this.plotOptions1.push(columnPlot);
		this.plotOptions1.push(stackPlot);
		this.plotOptions2.push(columnPlot);
		this.plotOptions2.push(linePlot);
		this.plotOptions2.push(areaPlot);
		this.plotOptions2.push(stackPlot);
		this.globalFactorsData = this.$store.getters.getGlobalFactors();
		if (
			this.$store.getters.getGlobalFactors().period &&
			this.$store.getters.getGlobalFactors().period.Period
		) {
			this.globalPeriodData =
				this.$store.getters.getGlobalFactors().period.Period;
			this.applicationFinalYear = this.$moment(
				new Date(this.globalPeriodData.backtrackedLimitedDate),
				"YYYY"
			).format("YYYY");
		}
		this.getConfigAccess();
	},
};
</script>
<style lang="scss" scoped>
.mdgridviewpage-bg {
	min-height: 100vh;
	// padding: 20px 40px 159px;
	// padding: 0px 0 20px !important;
	// background-color: #3471ce;
	background-color: var(--primary-bg-color) !important;
	// padding-top: 60px !important;
	//   padding-bottom: 150px !important;
}

input[type="checkbox"] {
	cursor: pointer;
	background-color: #fff;
	width: 25px;
	height: 25px;
	position: relative;
	top: 8px;
	border: 2px solid #d4d4d4 !important;
	margin-right: 11px;
	visibility: hidden;
	border-radius: 3px;
}

input[type="checkbox"]:after {
	content: " ";
	background-color: #2e2e48;
	display: inline-block;
	visibility: visible;
	width: 25px;
	height: 25px;
	display: flex;
	justify-content: center;
	border-radius: 3px;
	border: 1px solid #c7c4e4;
}

input[type="checkbox"]:checked:after {
	content: "\2714";
	color: #fff;
}
@supports (-moz-appearance: none) {
	input[type="checkbox"] {
		visibility: visible;
	}
}
.black-grey,
.black-grey:hover {
	background-color: #cfcfcf !important;
	border-color: #cfcfcf !important;
}
.bottomcheckbox_strip {
	left: 0;
	right: 0;
	background-color: #fff;
	position: fixed;
	bottom: 64px;
	width: 100%;
	padding: 10px 0;
	z-index: 999;
}
.check_box_div {
	background-color: #fff;
}
.newGreen-theme {
	.check_box_div {
		background-color: #f4f4f4;
	}
	.key_insights {
		.card-header {
			background-color: #1a4728 !important;
		}
	}
}
.newBlack-theme {
	.key_insights_div {
		background-color: #373a3f !important;
	}
	.key_insights {
		.card-header {
			background-color: #373a3f !important;
		}
	}
}

@media screen and (min-width: 768px) and (max-width: 1200px) {
	.bottomcheckbox_strip {
		bottom: 0 !important;
	}
	.mdgridviewpage-bg {
		// padding: 20px 0 59px !important;
	}
}
</style>
<!--[if IE]>
	<style>
		.actual-form table {
			width: 100%;
		}

		input[type="checkbox"] {
			visibility: visible;
		}
	</style>
<![endif]-->
