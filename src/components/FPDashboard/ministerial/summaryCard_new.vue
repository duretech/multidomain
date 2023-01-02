<template>
	<div
		class="card key_insights position-relative summary-page-container"
		v-if="showSummary"
	>
		<div class="card-body key-insights_card-body p-4">
			<div class="summary_div">
				<div class="row no-gutters stat-cards">
					<div class="col-12" style="margin: 0 5px">
						<div class="summary-title">
							{{
								$t("key_insights_sum_1", {
									period:
										periodType === "monthly"
											? $t("month")
											: periodType === "quarterly"
											? $t("quarter")
											: $t("year"),
								})
							}}<span class="text-green"
								> {{ $t("key_insights_sum_2") }}</span
							>,
							<span class="text-red"
								>{{ $t("key_insights_sum_3") }}</span
							>, {{ $t("key_insights_sum_4") }}
							<span class="text-yellow"
								>{{ $t("key_insights_sum_5") }}</span
							>. {{ $t("key_insights_sum_6") }}
						</div>
					</div>
				</div>
				<div class="row">
					<div
						class="col-xl-6 tabview_padding_col mt-4 px-2"
						v-if="showEMUCard"
					>
						<b-card class="summary-card-bg" v-if="boxNarrationText">
							<div class="mb-2">
								<b-row>
									<b-col sm="2">
										<div class="summary-dot" :class="colorHeader">
											<p
												class="mb-0 fs-25-1920 cursor-pointer"
												v-b-tooltip.hover
												:title="curValue ? `${curValue}%` : `0.0%`"
											>
												{{ curValue ? curValue : `0.0` }}%
											</p>
										</div></b-col
									>
									<b-col sm="10" class="pl-5 pt-2">
										<b-row>
											<b-col sm="8">
												<div
													class="fs-17-1920 cursor-pointer"
													v-b-tooltip.hover
													:title="
														periodType === 'monthly'
															? $t('emu_monthly')
															: $t('emu_annual')
													"
												>
													{{
														periodType === "monthly"
															? $t("emu_monthly")
															: $t("emu_annual")
													}}
												</div>
											</b-col>
											<b-col sm="4" class="view-more-btn">
												<b-button
													class="summary-view-more-btn fs-17-1920 btn-sm"
													@click="viewMore"
													>{{ $t("viewMore") }}</b-button
												>
											</b-col>
											<b-col sm="12" class="pt-2">
												<div class="from-last-year fs-14-1920">
													{{ $t("change_from") }}
													{{ prevMonth }}
													<span class="float-right">{{ emuDifference }}</span>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</div>
							<div
								class="fs-17-1920 emu-read"
								:class="{
									'emu-status ': showMore !== 'EMU',
									isNotExport: !isExport,
								}"
								style="min-height: 36px"
							>
								<span v-html="getSummaryText(boxNarrationText)"></span
								><span v-html="getSummaryText(emuRMNCHText)"></span
								><span v-html="getSummaryText(emuMethodsText)"></span>
							</div>
							<div
								data-html2canvas-ignore="true"
								class="text-right"
								:style="{
									visibility: boxNarrationText.length === 0 ? 'hidden' : '',
								}"
							>
								<b-button
									class="readMoreBtn btn-sm"
									@click="showMoreText('EMU')"
								>
									{{ showMore === "EMU" ? "Read Less" : "Read More" }}</b-button
								>
							</div>
							<div class="p-2 mt-3 performance-in-card fs-17-1920">
								<span
									class="cursor-pointer"
									v-b-tooltip.hover
									:title="`${$t('performance_against_benchmark')} ${
										benchmarkValue ? ' ( ' + benchmarkValue + ' ) ' : ''
									}`"
								>
									{{ $t("performance_against_benchmark") }}
									{{ benchmarkValue ? `(${benchmarkValue})` : "" }}</span
								>
								<div class="fs-17-1920 na px-3">
									<template v-if="performanceBenchmarking === 'N/A'">
										{{ performanceBenchmarking }}
									</template>
									<img
										v-else
										alt="s_icon"
										class="equalTosign w-20px"
										:src="
											require(`@/assets/img/ministerialSummaryIcon/${getIcon(
												performanceBenchmarking
											)}`)
										"
									/>
								</div>
							</div>
						</b-card>
						<Placeholder v-else />
					</div>
					<template v-for="(value, i) in ministerialData.data.summary">
						<insightsComponent
							v-if="value.name !== 'EMU'"
							:cardHeader="value.selected.cardHeader"
							:name="value.selected.name"
							:chartSubCategory="value.selected.chartSubCategory"
							:chartComponent="value.selected.chartComponent"
							:subComponent="value.selected.subComponent"
							:sendPeriod="sendPeriod"
							:sendLocation="sendLocation"
							:ministerialData="ministerialData"
							@rmnchCurrentValue="getRMNCHValue"
							:percentage="value.selected.percentage"
							:reportingBenchmark="
								globalFactorsData.rrBenchmarking[value.selected.chartComponent]
							"
							:benchmark="value.selected.benchmark"
							:key="i"
							:exportArr="exportArr"
							:showEMUCard="showEMUCard"
							:periodType="periodType"
							:isExport="isExport"
							:inAnalytical="inAnalytical"
							@getGeoJson="getGeoJson"
							:allGeoJson="allGeoJson"
							:locationName="locationName"
							:locationPeriod="locationPeriod"
						/>
					</template>
				</div>
			</div>
		</div>
		<b-modal
			v-model="modalShow"
			hide-footer
			size="xl"
		
			:title="
				periodType === 'monthly'
					? `${$t('emu_monthly')} ${currentPeriod ? ' - ' + currentPeriod : ''}`
					: `${$t('emu_annual')} ${currentPeriod ? ' - ' + currentPeriod : ''}`
			"
			no-close-on-backdrop
			id="modalfp"
		>
			<div class="card border border-0 pl-3">
				<!-- <h5 class="text-uppercase">
					{{ $t("Summary") }}
				</h5> -->
				<div class="row">
					<div class="col-6 para">
						<b-row class="pt-1 pb-1 pl-3">
							<b-col cols="6"></b-col>
							<b-col class="table-heading pr-0" cols="2"
								><p>
									{{ prevMonth }}
								</p></b-col
							>
							<b-col class="table-heading pr-0" cols="2"
								><p>
									{{ currentPeriod }}
								</p>
							</b-col>
							<b-col class="table-heading pr-0" cols="2"
								><p>{{ $t("change%") }}</p></b-col
							>
						</b-row>
						<b-row class="pt-1 pb-2 valueRow">
							<b-col class="table-heading pt-2" cols="6"
								><p>
									{{
										periodType === "monthly"
											? $t("emu_monthly")
											: $t("emu_annual")
									}}
								</p></b-col
							>
							<b-col cols="2"
								><div class="summary-dot">
									{{ prevValue }}
								</div></b-col
							>
							<b-col cols="2"
								><div class="summary-dot">
									{{ curValue }}
								</div></b-col
							>
							<b-col cols="2">
								<div class="summary-dot" :class="colorHeader">
									{{ emuDifference || "N/A" }}
								</div></b-col
							>
						</b-row>
						<div class="col_wrap_sect pt-3 para">
							<!-- <div class="row mx-0 para">
								<div class="col-lg-4 col-sm-6 pl-0 pr-1">
									<div class="d-flex p-2 inner_div_sect" :class="colorHeader">
										<h2>{{ curValue }}</h2>
										<p class="fs-16-1920">
											{{
												periodType === "monthly"
													? $t("emu_monthly")
													: $t("emu_annual")
											}}
											<br />
											{{ currentPeriod }}
										</p>
									</div>
								</div>
								<div class="col-lg-4 col-sm-6 px-2">
									<div class="bg-secondary d-flex p-2 inner_div_sect">
										<h2>{{ prevValue }}</h2>
										<p style="padding-top: 8px">
											{{ $t("valueIn") }} {{ prevMonth }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-4 col-sm-6 pl-1 pr-0"
									v-if="periodType === 'monthly'"
								>
									<div class="bg-secondary d-flex p-2 inner_div_sect">
										<h2>{{ currentMonthLastYearValue }}</h2>
										<p style="padding-top: 8px">
											{{ $t("valueIn") }} {{ currentMonthLastYear }}
										</p>
									</div>
								</div>
							</div> -->
							<div class="row">
								<div class="col-12">
									<p
									>
										{{ $t("performance_against_benchmark") }}
										{{ benchmarkValue ? `(${benchmarkValue})` : "" }}
										<span class="ml-3">
											<template v-if="performanceBenchmarking === 'N/A'">
												{{ performanceBenchmarking }}
											</template>
											<img
												v-else
												alt="s_icon"
												class="equalTosign w-20px"
												:src="
													require(`@/assets/img/ministerialSummaryIcon/${getIcon(
														performanceBenchmarking
													)}`)
												"
											/>
										</span>
									</p>
								</div>
							</div>
						</div>
						<p class="">
							<span v-html="boxNarrationText"></span
							><span v-html="emuRMNCHText"></span
							><span v-html="emuMethodsText"></span>
						</p>
					</div>
					<div class="col-6">
						<div class="anc-map">
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
								:chartData="chartData"
								:locationPeriod="locationPeriod"
								@isJsonFetched="isJsonFetched = true"
							/>
						</div>
					</div>
				</div>
				<div class="row pb-4">
					<div
						class="col"
						v-if="chartRegionalData && chartRegionalData.series.length > 0"
					>
						<div class="card position-relative family-highchart-body border-0">
							<div class="card-header p-10px">
								<div class="row no-gutters">
									<div
										class="col-lg-12 col-md-12 p-t-4px pl-3 pb-2"
										style="
											white-space: nowrap;
											overflow: hidden;
											text-overflow: ellipsis;
										"
									>
										{{ chartRegionalData.title.title }}
									</div>
								</div>
							</div>
							<div
								class="card-body py-0"
								v-if="chartRegionalData.series[0].data.length > 0"
							>
								<div class="row no-gutters">
									<div
										class="col-12 text-right d-flex align-items-center justify-content-end"
										v-if="inAnalytical"
									>
										<div class="dropdown ml-2 dropdown-arrow">
											<b-dropdown
												right
												toggle-class="bg-transparent border-0 dropdown-toggle p-0"
												no-caret
												menu-class="chart-dd-menu"
												@hide="hideClass"
												@shown="getActive('download', 'regionalCharts')"
											>
												<template v-slot:button-content>
													<img
														alt="img"
														:src="
															require(`@/assets/img/icons/download_new${
																activeIcon === 'download' ? '_active' : ''
															}.png`)
														"
														class="img imgWidth_15px"
														v-b-tooltip.hover
														:title="$t('downloadIcon')"
													/>
												</template>
												<b-dropdown-group class="chart-dd-options">
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('png')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("png") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-powerpoint-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('jpg')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("jpg") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-image-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('pdf')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("pdf") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-pdf-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
												</b-dropdown-group>
											</b-dropdown>
										</div>
									</div>
								</div>
								<highcharts
									v-if="chartRegionalData"
									:options="chartRegionalData"
									ref="regionalCharts"
								></highcharts>
							</div>
							<div class="card-footer text-right">
								<p class="m-0">
									{{ $t("source") }}:
									<span>{{ chartRegionalData.chartSource }}</span>
								</p>
							</div>
							<div
								class="card-body"
								v-if="chartRegionalData.series[0].data.length === 0"
							>
								{{ $t("no_data_to_display") }}
							</div>	 	
						</div>
					</div>
					<div class="col" v-if="chartData && chartData.series.length > 0">
						<div class="card position-relative family-highchart-body border-0 ">
							<div class="card-header p-10px">
								<div class="row no-gutters">
									<div
										class="col-lg-12 col-md-12 p-t-4px pl-3 pb-2"
										style="
											white-space: nowrap;
											overflow: hidden;
											text-overflow: ellipsis;
										"
									>
										{{ chartData.title.title }}
									</div>
								</div>
							</div>
							<div
								class="card-body py-0 fpchart-body"
								v-if="chartData.series[0].data.length > 0"
							>
								<div class="row no-gutters">
									<div
										class="col-12 text-right d-flex align-items-center justify-content-end"
										v-if="inAnalytical"
									>
										<div class="dropdown ml-2 dropdown-arrow">
											<b-dropdown
												right
												toggle-class="bg-transparent border-0 dropdown-toggle p-0"
												no-caret
												menu-class="chart-dd-menu"
												@hide="hideClass"
												@shown="getActive('downloadTrend', 'trendCharts')"
											>
												<template v-slot:button-content>
													<img
														alt="img"
														:src="
															require(`@/assets/img/icons/download_new${
																activeIcon === 'downloadTrend' ? '_active' : ''
															}.png`)
														"
														class="img imgWidth_15px"
														v-b-tooltip.hover
														:title="$t('downloadIcon')"
													/>
												</template>
												<b-dropdown-group class="chart-dd-options">
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('png')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("png") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-powerpoint-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('jpg')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("jpg") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-image-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
													<b-dropdown-item
														class="list-group-item bg-transparent px-0"
													>
														<a
															class="color-white"
															@click.prevent.stop="exportChart('pdf')"
														>
															<div class="row no-gutters">
																<div class="col-lg-10 text-left">
																	<p class="m-0px">
																		{{ $t("pdf") }}
																	</p>
																</div>
																<div class="col-lg-2">
																	<p class="m-0px">
																		<i class="fa fa-file-pdf-o"></i>
																	</p>
																</div>
															</div>
														</a>
													</b-dropdown-item>
												</b-dropdown-group>
											</b-dropdown>
										</div>
									</div>
								</div>
								<highcharts
									v-if="chartData"
									:options="chartData"
									ref="trendCharts"
									className="fphighcharts pt-2"
								></highcharts>
							</div>
							<div class="card-footer text-right">
								<p class="m-0">
									{{ $t("source") }}:
									<span>{{ chartData.chartSource }}</span>
								</p>
							</div>
							<div
								class="card-body"
								v-if="chartData.series[0].data.length === 0"
							>
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</b-modal>
	</div>
</template>
<script>
/*eslint no-undef: "error"*/
import chartConfig from "./chartConfig.js";
import insightsComponent from "./insightsComponent";
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import { chartExport } from "@/components/Common/commonFunctions";
export default {
	props: [
		"ministerialData",
		"sendPeriod",
		"sendLocation",
		"globalFactorsData",
		"emuData",
		"emuMethodData",
		"locationName",
		"exportArr",
		"periodType",
		"compareKey",
		"showEMUCard",
		"isExport",
		"inAnalytical",
		"allGeoJson",
	],
	mixins: [SummaryViewMixin],
	components: {
		insightsComponent,
		Placeholder: () =>
			import(
				/* webpackChunkName: "Placeholder"*/ "@/components/Common/Placeholder"
			),
		MapComponent: () =>
			import(
				/*webpackChunkName: "MapComponent"*/ "@/components/Maps/MapComponent"
			),
	},
	data() {
		//console.log("Summary section initialized @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
		// console.log(this.exportArr)
		return {
			prevMonth: "",
			prevValue: "",
			currentPeriod: "",
			curValue: "",
			currentMonthLastYearValue: "",
			currentMonthLastYear: "",
			boxNarrationText: "",
			emuDifference: "",
			rmnchCurrentValue: "",
			colorHeader: "bg-yellow",
			emuRMNCHText: "",
			emuMethodsText: "",
			rmnchScorecard: "",
			showSummary: true,
			modalShow: false,
			chartData: JSON.parse(JSON.stringify(chartConfig)),
			chartRegionalData: JSON.parse(JSON.stringify(chartConfig)),
			performanceBenchmarking: "N/A",
			benchmarkValue: "",
			activeIcon: "",
			chartRef: "",
			isJsonFetched: false,
			selectedInd: "",
		};
	},
	computed: {
		locationPeriod() {
			return {
				locationName: this.locationName,
				location: `${this.sendLocation[0]}/${this.sendLocation[2]}`,
				periodType: this.periodType,
			};
		},
		indList() {
			return this.chartData &&
				this.chartData.series &&
				this.chartData.series.length
				? this.chartData.series.map((s) => ({
						value: s.name,
						text: s.name,
				  }))
				: [];
		},
	},
	watch: {
		indList(newValue) {
			this.selectedInd = newValue.length ? newValue[0].value : "";
		},
		sendPeriod() {
			this.boxNarrationText = "";
		},
		sendLocation() {
			this.boxNarrationText = "";
		},
		emuData(newValue) {
			this.emuDifference = "";
			if (newValue) {
				// console.log("EMU data is available '"+ newValue+"' @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				// console.log("Calling showEMUMonthlySummary() with param '"+ newValue +"' @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				this.showEMUMonthlySummary(newValue);
			}
		},
		curValue(newValue) {
			if (newValue) {
				// console.log("newValue", newValue)
				this.updateRMNCHValue();
			}
		},
	},
	methods: {
		getGeoJson(loc, obj) {
			this.$emit("getGeoJson", loc, obj);
		},
		hideClass() {
			this.activeIcon = "";
		},
		getActive(icon, type) {
			this.activeIcon = icon;
			this.chartRef = type;
		},
		exportChart(type) {
			let chart = this.$refs[this.chartRef].chart;
			// console.log(chart)
			let max = chart.options.xAxis[0].max;
			let catLen = chart.options.series[0].data.length - 1;
			chart.options.xAxis[0].max = null;
			chart.options.xAxis[0].min = 0;
			if (catLen > 11) {
				chart.xAxis[0].setExtremes(0, catLen);
			}

			chartExport(type, chart);
			setTimeout(() => {
				chart.options.xAxis[0].max = max;
				if (catLen > 11) {
					chart.xAxis[0].setExtremes(catLen - 11, catLen);
				}
			}, 100);
		},
		viewMore() {
			this.chartData = JSON.parse(JSON.stringify(chartConfig));
			this.chartRegionalData = JSON.parse(JSON.stringify(chartConfig));
			// console.log("View More called @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
			let data = this.exportArr.filter(
				(s) =>
					s.showInSummary &&
					s.chartComponent === "EMU" &&
					s.chartSubCategory === "EMU"
			);
			// console.log("data", data)
			let reA = /[^a-zA-Z]/g;
			let reN = /[^0-9]/g;
			data.sort((a, b) => {
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
			// console.log(data)
			// console.log(this.chartRegionalData)
			// console.log(this.chartData)
			if (data.length) {
				if (data[0]) {
					if (data[0].cardKey.substring(3) * 1 < 0) {
						this.chartRegionalData.chart.type = data[0].chart.type;
						this.chartRegionalData.title.title = data[0].title.title;
						this.chartRegionalData.xAxis.title.text = data[0].xAxis.title.text;
						this.chartRegionalData.yAxis.title.text = data[0].yAxis.title.text;
						if (data[0].chart.type === "line") {
							this.chartRegionalData.yAxis.min = 0;
						}
						this.chartRegionalData.series = data[0].series;
						this.chartRegionalData.chartSource = data[0].chartSource;
						if (data[0].series[0].data.length > 11) {
							this.chartRegionalData.xAxis.max = 11;
						} else {
							this.chartRegionalData.xAxis.max =
								data[0].series[0].data.length - 1;
						}
					} else {
						this.chartData.chart.type = data[0].chart.type;
						this.chartData.title.title = data[0].title.title;
						this.chartData.xAxis.title.text = data[0].xAxis.title.text;
						this.chartData.yAxis.title.text = data[0].yAxis.title.text;
						if (data[0].chart.type === "line") {
							this.chartData.yAxis.min = 0;
						}
						this.chartData.series = data[0].series;
						this.chartData.drilldown = data[0].drilldown;
						this.chartData.chartSource = data[0].chartSource;
						let _this = this;

						this.chartData.chart.events = {
							...this.chartData.chart.events,
							load: function () {
								// console.log(this.yAxis)
								if (this.series.length && this.series[0].data.length) {
									let catLen = this.series[0].data.length - 1;
									if (catLen > 11) {
										this.xAxis[0].setExtremes(catLen - 11, catLen);
									}
								}
							},
							selection: function (e) {
								if (!e.xAxis) {
									let catLen = this.options.series[0].data.length - 1;
									if (catLen > 11) {
										setTimeout(() => {
											this.xAxis[0].setExtremes(catLen - 11, catLen);
										}, 0);
									}
								}
							},
							drillup: function (e) {
								this.xAxis[0].options.max =
									data[0].series[0].data.length > 11
										? 11
										: data[0].series[0].data.length - 1;
								this.options.chart.zoomType = "x";

								this.yAxis[0].setTitle({
									text: _this.$i18n.t("EMU") + " (%)",
								});
							},
							drilldown: function (e) {
								this.xAxis[0].options.max = e.seriesOptions.data.length - 1;
								this.yAxis[0].update({
									min: null,
									max: null,
								});
								this.yAxis[0].setTitle({
									text:
										_this.$i18n.t("changeIn") +
										" " +
										_this.$i18n.t("EMU") +
										" (%)",
								});

								this.options.chart.zoomType = "";
							},
						};
					}
				}
				if (data[1]) {
					if (data[1].cardKey.substring(3) * 1 < 0) {
						this.chartRegionalData.chart.type = data[1].chart.type;
						this.chartRegionalData.title.title = data[1].title.title;
						this.chartRegionalData.xAxis.title.text = data[1].xAxis.title.text;
						this.chartRegionalData.yAxis.title.text = data[1].yAxis.title.text;
						if (data[1].chart.type === "line") {
							this.chartRegionalData.yAxis.min = 0;
						}
						this.chartRegionalData.series = data[1].series;
						this.chartRegionalData.chartSource = data[1].chartSource;
						if (data[1].series[0].data.length > 11) {
							this.chartRegionalData.xAxis.max = 11;
						} else {
							this.chartRegionalData.xAxis.max =
								data[1].series[0].data.length - 1;
						}
					} else {
						this.chartData.chart.type = data[1].chart.type;
						this.chartData.title.title = data[1].title.title;
						this.chartData.xAxis.title.text = data[1].xAxis.title.text;
						this.chartData.yAxis.title.text = data[1].yAxis.title.text;
						if (data[1].chart.type === "line") {
							this.chartData.yAxis.min = 0;
						}
						this.chartData.series = data[1].series;
						this.chartData.drilldown = data[1].drilldown;
						this.chartData.chartSource = data[1].chartSource;
						let _this = this;
						this.chartData.chart.events = {
							...this.chartData.chart.events,
							load: function () {
								// console.log(this.yAxis)
								if (this.series.length && this.series[0].data.length) {
									let catLen = this.series[0].data.length - 1;
									if (catLen > 11) {
										this.xAxis[0].setExtremes(catLen - 11, catLen);
									}
								}
							},
							selection: function (e) {
								if (!e.xAxis) {
									let catLen = this.options.series[0].data.length - 1;
									if (catLen > 11) {
										setTimeout(() => {
											this.xAxis[0].setExtremes(catLen - 11, catLen);
										}, 0);
									}
								}
							},
							drillup: function (e) {
								this.xAxis[0].options.max =
									data[1].series[0].data.length > 11
										? 11
										: data[0].series[0].data.length - 1;
								this.options.chart.zoomType = "x";
								this.yAxis[0].setTitle({
									text: _this.$i18n.t("EMU") + " (%)",
								});
							},
							drilldown: function (e) {
								this.xAxis[0].options.max = e.seriesOptions.data.length - 1;
								this.yAxis[0].update({
									min: null,
									max: null,
								});
								this.yAxis[0].setTitle({
									text:
										_this.$i18n.t("changeIn") +
										" " +
										_this.$i18n.t("EMU") +
										" (%)",
								});

								this.options.chart.zoomType = "";
							},
						};
					}
				}
			}
			// console.log(this.chartData)
			setTimeout(() => {
				this.modalShow = true;
			}, 100);
		},
		showEMUMonthlySummary(emuData) {
			// console.log("showEMUMonthlySummary() call started @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
			//console.log(this.sendPeriod)
			// console.log("emuData",emuData)
			// console.log("EMU - Calculating dates @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
			if (this.periodType === "monthly") {
				this.currentPeriod = this.$moment(this.sendPeriod, "YYYYMM").format(
					"MMM YYYY"
				);
				this.prevMonth = this.$moment(this.sendPeriod, "YYYYMM")
					.subtract(1, "months")
					.format("MMM YYYY");
				this.currentMonthLastYear = this.$moment(this.sendPeriod, "YYYYMM")
					.subtract(1, "year")
					.format("MMM YYYY");
				let emuMonthlyData = emuData.saveData.find(
					(c) => c.name === this.compareKey
				).data;
				let emuMonthlyPeriod = emuData.saveCategories;
				// console.log("emuMonthlyPeriod",emuMonthlyPeriod)

				let currentPeriodIndex = emuMonthlyPeriod.indexOf(this.currentPeriod);
				let prevMonthIndex = emuMonthlyPeriod.indexOf(this.prevMonth);
				let currentMonthLastYearIndex = emuMonthlyPeriod.indexOf(
					this.currentMonthLastYear
				);

				// console.log("EMU - Calculating values @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				this.curValue =
					(emuMonthlyData[currentPeriodIndex] * 1).toFixed(1) !== "NaN"
						? (emuMonthlyData[currentPeriodIndex] * 1).toFixed(1)
						: 0;
				this.prevValue =
					(emuMonthlyData[prevMonthIndex] * 1).toFixed(1) !== "NaN"
						? (emuMonthlyData[prevMonthIndex] * 1).toFixed(1)
						: 0;
				this.currentMonthLastYearValue = (
					emuMonthlyData[currentMonthLastYearIndex] * 1
				).toFixed(1);

				let emuSettings = this.ministerialData.data.summary.find(
					(m) => m.name === "EMU"
				);
				if (emuSettings) {
					let benchmarkValue = emuSettings.selected.benchmark * 1;
					if (
						typeof emuSettings.selected.benchmark !== undefined &&
						emuSettings.selected.benchmark !== ""
					) {
						this.benchmarkValue = emuSettings.selected.percentage
							? `${benchmarkValue}%`
							: benchmarkValue;
						this.performanceBenchmarking =
							this.curValue * 1 > benchmarkValue
								? "High"
								: this.curValue * 1 < benchmarkValue
								? "Low"
								: this.curValue * 1 === benchmarkValue
								? "Equal"
								: "N/A";
					} else {
						this.benchmarkValue = "";
						this.performanceBenchmarking = "N/A";
					}
				}

				/*console.log(this.prevMonth)
        console.log(this.currentMonthLastYear)
        console.log(this.currentPeriod)
        console.log(emuMonthlyData[prevMonthIndex])
        console.log(emuMonthlyData[currentMonthLastYearIndex])
        console.log(emuMonthlyData[currentPeriodIndex])
        console.log(this.rmnchCurrentValue)*/

				/* Comparison between EMU current month and last month */

				// console.log("EMU - Calculating percentage change @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				let sRange = this.$i18n.t("constant_V1");
				let internalDiff = 0.0;
				if ((this.curValue - this.prevValue) / this.prevValue) {
					this.emuDifference = `${(
						((this.curValue - this.prevValue) / this.prevValue) *
						100
					).toFixed(1)}%`;
					internalDiff = (
						((this.curValue - this.prevValue) / this.prevValue) *
						100
					).toFixed(1);
				} else {
					this.emuDifference = "0.0%";
				}

				if (internalDiff > 5) {
					sRange = this.$i18n.t("increased_V1");
					this.colorHeader = "bg-green";
				} else if (internalDiff < -5) {
					sRange = this.$i18n.t("decreased_V1");
					this.colorHeader = "bg-red";
				} else {
					this.colorHeader = "bg-yellow";
				}

				/* Comparison between EMU current month and same month from last year */

				let sRange1 = this.$i18n.t("constant_V1");
				let internalDiff1 = 0.0;
				if (
					(this.curValue - this.currentMonthLastYearValue) /
					this.currentMonthLastYearValue
				) {
					internalDiff1 = (
						((this.curValue - this.currentMonthLastYearValue) /
							this.currentMonthLastYearValue) *
						100
					).toFixed(1);
				} else {
					//this.emuDifference = '0.0%'
				}

				if (internalDiff1 > 5) {
					sRange1 = this.$i18n.t("increased_V1");
				} else if (internalDiff1 < -5) {
					sRange1 = this.$i18n.t("decreased_V1");
				} else {
				}

				this.boxNarrationText = this.$i18n.t(`emuMonthly`, {
					compare1: `<strong>${sRange}</strong>`,
					lastMonth: `<strong>${this.prevMonth}</strong>`,
					compare2: `<strong>${sRange1}</strong>`,
					lastYear: `<strong>${this.currentMonthLastYear}</strong>`,
				});

				if (this.emuMethodData) {
					// console.log("emuMethodData",this.emuMethodData)
					let emuMethodData = this.emuMethodData.saveData;
					let emuMonthlyPeriod = this.emuMethodData.saveCategories;
					// console.log("emuMonthlyPeriod",emuMonthlyPeriod)

					let currentPeriodIndex = emuMonthlyPeriod.indexOf(this.currentPeriod);

					// let prevMonthIndex = emuMonthlyPeriod.indexOf(this.prevMonth)
					let currentMonthLastYearIndex = emuMonthlyPeriod.indexOf(
						this.currentMonthLastYear
					);

					// console.log("EMU - Calculation methods increased decreased data @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
					if (currentPeriodIndex && currentMonthLastYearIndex) {
						let methodIncreased = "",
							methodDecreased = "",
							// methodValueTemp = null,
							methodValueInc = null,
							methodValueDesc = null;
						for (let i in emuMethodData) {
							// console.log(emuMethodData[i].name)
							// console.log(emuMethodData[i].data[currentPeriodIndex])
							// console.log(emuMethodData[i].data[currentMonthLastYearIndex])

							let methodDiff =
								emuMethodData[i].data[currentPeriodIndex] -
								emuMethodData[i].data[currentMonthLastYearIndex];
							// console.log(methodDiff)
							if (methodDiff > methodValueInc) {
								methodValueInc = Number(methodDiff.toFixed(1));
								methodIncreased = emuMethodData[i].name;
							} else if (methodDiff < methodValueDesc) {
								methodValueDesc = Number(methodDiff.toFixed(1));
								methodDecreased = emuMethodData[i].name;
							}
						}

						// console.log(methodIncreased, methodValueInc)
						// console.log(methodDecreased, methodValueDesc)
						// console.log("EMU - Generating methods description @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))

						this.emuMethodsText =
							methodIncreased && methodDecreased
								? this.$i18n.t(`emuMethodsMonthly`, {
										indicator1: `<strong>${methodIncreased}</strong>`,
										indicator2: `<strong>${methodDecreased}</strong>`,
								  })
								: "";
					}
				}
			}
			if (this.periodType === "yearly") {
				this.currentPeriod = this.$moment(this.sendPeriod, "YYYY").format(
					"YYYY"
				);
				this.prevMonth = this.$moment(this.sendPeriod, "YYYY")
					.subtract(1, "year")
					.format("YYYY");
				let emuMonthlyData = emuData.data.find(
					(c) => c.name === this.compareKey
				).data;
				let emuMonthlyPeriod = emuData.categories;
				// console.log("currentPeriod",this.currentPeriod)
				// console.log("prevMonth",this.prevMonth)
				// console.log("emuMonthlyData",emuMonthlyData)
				// console.log("emuMonthlyPeriod",emuMonthlyPeriod)

				let currentPeriodIndex = emuMonthlyPeriod.indexOf(this.currentPeriod);
				let prevMonthIndex = emuMonthlyPeriod.indexOf(this.prevMonth);
				// console.log("currentPeriodIndex",currentPeriodIndex)
				// console.log("prevMonthIndex",prevMonthIndex)

				// console.log("EMU - Calculating values @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				this.curValue =
					(emuMonthlyData[currentPeriodIndex] * 1).toFixed(1) !== "NaN"
						? (emuMonthlyData[currentPeriodIndex] * 1).toFixed(1)
						: 0;
				this.prevValue =
					(emuMonthlyData[prevMonthIndex] * 1).toFixed(1) !== "NaN"
						? (emuMonthlyData[prevMonthIndex] * 1).toFixed(1)
						: 0;
				// console.log("curValue",this.curValue)
				// console.log("prevValue",this.prevValue)

				let emuSettings = this.ministerialData.data.summary.find(
					(m) => m.name === "EMU"
				);
				if (emuSettings) {
					let benchmarkValue = emuSettings.selected.benchmark * 1;
					if (
						typeof emuSettings.selected.benchmark !== undefined &&
						emuSettings.selected.benchmark !== ""
					) {
						this.benchmarkValue = emuSettings.selected.percentage
							? `${benchmarkValue}%`
							: benchmarkValue;
						this.performanceBenchmarking =
							this.curValue * 1 > benchmarkValue
								? "High"
								: this.curValue * 1 < benchmarkValue
								? "Low"
								: this.curValue * 1 === benchmarkValue
								? "Equal"
								: "N/A";
					} else {
						this.benchmarkValue = "";
						this.performanceBenchmarking = "N/A";
					}
				}

				/*console.log(this.prevMonth)
        console.log(this.currentMonthLastYear)
        console.log(this.currentPeriod)
        console.log(emuMonthlyData[prevMonthIndex])
        console.log(emuMonthlyData[currentMonthLastYearIndex])
        console.log(emuMonthlyData[currentPeriodIndex])
        console.log(this.rmnchCurrentValue)*/

				/* Comparison between EMU current month and last month */

				// console.log("EMU - Calculating percentage change @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
				let sRange = this.$i18n.t("constant_V1");
				let internalDiff = 0.0;
				if ((this.curValue - this.prevValue) / this.prevValue) {
					this.emuDifference = `${(
						((this.curValue - this.prevValue) / this.prevValue) *
						100
					).toFixed(1)}%`;
					internalDiff = (
						((this.curValue - this.prevValue) / this.prevValue) *
						100
					).toFixed(1);
				} else {
					this.emuDifference = "0.0%";
				}

				if (internalDiff > 5) {
					sRange = this.$i18n.t("increased_V1");
					this.colorHeader = "bg-green";
				} else if (internalDiff < -5) {
					sRange = this.$i18n.t("decreased_V1");
					this.colorHeader = "bg-red";
				} else {
					this.colorHeader = "bg-yellow";
				}

				this.boxNarrationText = this.$i18n.t(`emuAnnual`, {
					compare1: `<strong>${sRange}</strong>`,
					lastYear: `<strong>${this.prevMonth}</strong>`,
				});

				if (this.emuMethodData) {
					// console.log("emuMethodData",this.emuMethodData)
					// console.log("emuMethodData",this.emuMethodData.data)
					let emuMethodData = this.emuMethodData.data;
					let emuMonthlyPeriod = this.emuMethodData.categories;
					// console.log("emuMonthlyPeriod",emuMonthlyPeriod)

					let currentPeriodIndex = emuMonthlyPeriod.indexOf(this.currentPeriod);
					let prevMonthIndex = emuMonthlyPeriod.indexOf(this.prevMonth);
					// console.log("EMU - Calculation methods increased decreased data @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
					if (currentPeriodIndex && prevMonthIndex) {
						let methodIncreased = "",
							methodDecreased = "",
							methodValueInc = null,
							methodValueDesc = null;
						for (let i in emuMethodData) {
							// console.log(emuMethodData[i].name)
							// console.log(emuMethodData[i].data[currentPeriodIndex])
							// console.log(emuMethodData[i].data[prevMonthIndex])

							let methodDiff =
								emuMethodData[i].data[currentPeriodIndex] -
								emuMethodData[i].data[prevMonthIndex];
							//console.log(methodDiff)
							if (methodDiff > methodValueInc) {
								methodValueInc = Number(methodDiff.toFixed(1));
								methodIncreased = emuMethodData[i].name;
							} else if (methodDiff < methodValueDesc) {
								methodValueDesc = Number(methodDiff.toFixed(1));
								methodDecreased = emuMethodData[i].name;
							}
						}

						// console.log(methodIncreased, methodValueInc)
						// console.log(methodDecreased, methodValueDesc)
						// console.log("EMU - Generating methods description @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))

						this.emuMethodsText =
							methodIncreased && methodDecreased
								? this.$i18n.t(`emuMethodsAnnual`, {
										indicator1: `<strong>${methodIncreased}</strong>`,
										indicator2: `<strong>${methodDecreased}</strong>`,
								  })
								: "";
					}
				}
			}
		},
		updateRMNCHValue() {
			/* Comparison between EMU and RMNCH scorecard indicator */
			let sRange2 = this.$i18n.t("similar_to_V3");

			let internalDiff2 = 0.0;
			if (this.curValue - this.rmnchCurrentValue) {
				internalDiff2 = (this.curValue - this.rmnchCurrentValue).toFixed(1);
			} else {
				//this.emuDifference = '0.0%'
			}
			// console.log("this.curValue",this.curValue)
			// console.log("internalDiff2",internalDiff2)
			if (internalDiff2 > 5) {
				sRange2 = this.$i18n.t("higher_than_V3");
			} else if (internalDiff2 < -5) {
				sRange2 = this.$i18n.t("lower_than_V3");
			} else {
			}

			// console.log("sRange2",sRange2)
			// console.log("EMU - Generating RMNCH description @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))

			this.emuRMNCHText =
				this.rmnchCurrentValue && this.rmnchPercentage
					? this.$i18n.t(`emuRMNCHMonthly`, {
							compare1: `<strong>${sRange2}</strong>`,
							indicator1: `<strong>${this.rmnchScorecard}</strong>`,
					  })
					: "";
		},
		getRMNCHValue(value, scorecard, percentage) {
			// console.log("in getRMNCHValue", value, scorecard, percentage)
			// console.log("EMU - getRMNCHValue() call started @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))

			let mdData = this.ministerialData.data.summary.find(
				(s) => s.name === "EMU"
			);
			// console.log("getRMNCHValue", mdData)
			if (mdData && mdData.selected.comparePriorityIndicator) {
				this.rmnchCurrentValue = value;
				this.rmnchScorecard = scorecard.trim();
				this.rmnchPercentage = percentage;
				if (this.curValue) {
					this.updateRMNCHValue();
				}
			}
		},
	},
	cretaed() {
		// console.log("Summary section cretaed @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
		let mdData = Object.keys(this.ministerialData.data).filter(
			(m) => m !== "summary"
		);
		// console.log(mdData)
		if (mdData.length === 0) {
			this.showSummary = false;
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
		}
		if (this.emuData) {
			// console.log("EMU data is available '"+ this.emuData+"' @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
			// console.log("Calling showEMUMonthlySummary() with param '"+ this.emuData +"' @", this.$moment().format('MMMM Do YYYY, h:mm:ss a'))
			this.showEMUMonthlySummary(this.emuData);
		}
	},
};
</script>

<style scoped lang="scss">
.card-header.bg-yellow {
	background-color: #ffba69;
}
.text-yellow {
	color: #ffba69;
}
.bg-yellow {
	background-color: #ffba69;
}
.btn-yellow,
.btn-yellow:hover {
	background-color: #ffba69;
	border: 1px solid #ffba69;
	color: #fff;
}
.card-header.bg-red {
	background-color: #fe8081;
}
.text-red {
	color: #fe8081;
}
.bg-red {
	background-color: #fe8081;
}
.btn-red,
.btn-red:hover {
	background-color: #fe8081;
	border: 1px solid #fe8081;
	color: #fff;
}
.card-header.bg-green {
	// background-color: #9cd49f;
	background-color: #5bd282;
}
.text-green {
	color: #5bd282;
}
.bg-green {
	background-color: #5bd282 !important;
}
.btn-green,
.btn-green:hover {
	background-color: #5bd282;
	border: 1px solid #5bd282;
	color: #fff;
}
.key_insights {
	// margin-top: 50px;
	height: 100%;
	min-height: 450px;
}
button {
	border-radius: 3px;
}
.circle_create {
	/* padding: 28px 18px; */
	color: #fff;
	border-radius: 50px;
	font-weight: 600;
	position: relative;
	width: 75px;
	height: 75px;
	span {
		display: flex;
		justify-content: center;
		padding-top: 26px;
		font-size: 1.1em;
		font-weight: 400;
	}
}
.info-card-text {
	padding-top: 34px;
	h5 {
		font-size: 1rem;
		margin-bottom: 3px;
		width: 230px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	p {
		font-size: 0.75rem;
		margin-bottom: 0;
		font-weight: 400;
	}
}
.bottom-card-text {
	font-size: 0.75rem;
	padding-top: 6px;
	color: #797979;
	padding-left: 20px;
	&.isNotExport {
		height: 45px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden; //New added
	}
}
.btn-secondary {
	color: #fff;

	background-color: #ababab;
	border-color: #ababab;
}
.view_more_btn {
	position: absolute;
	right: 8px;
	top: 8px;
}
.percentage-card {
	-webkit-box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.06),
		0 0px 2px 0 rgba(0, 0, 0, 0.06);
	box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.06), 0 0px 2px 0 rgba(0, 0, 0, 0.06);
	height: 100%;
}
.alertRow {
	position: absolute;
	width: 100%;
	left: 0;
	right: 0;
	padding: 10px;
	bottom: 0;
}

.alert {
	padding: 0.25rem 1.25rem;
	border: 0px;
	border-radius: 3px;
	// position: absolute;
	width: 100%;
	// top: 75px;

	span.float-left {
		font-size: 0.875rem;
		padding-top: 4px;
		font-weight: 400;
	}
}

.card-footer {
	background-color: #f1f1f1e3;
	border-top: 1px solid #d4d4d4;

	span {
		font-size: 0.75rem;
		padding: 0.175rem 0.45rem;
		border-radius: 3px !important;
	}
}

.black-btn,
.black-btn:hover {
	background-color: #171a22 !important;
	border-color: #171a22 !important;
}
.view_more_btn {
	button {
		padding: 0.15rem 0.2rem;
		font-size: 0.6875rem;
		img {
			width: 18px;
			margin-right: 4px;
		}
	}
}

.col_wrap_sect {
	background-color: #f1f1f1;
	border-radius: 4px;
}
.col_wrap_sect .inner_div_sect {
	justify-content: space-evenly;
	align-items: center;
	border-radius: 4px;
	color: #fff;
}
.col_wrap_sect .inner_div_sect h2 {
	margin-bottom: 0;
	font-size: 1.38rem;
}
.col_wrap_sect .inner_div_sect p {
	font-size: 0.75rem;
	margin-bottom: 0;
	padding-left: 5px;
	height: 35px;
}

.bg-secondary {
	background-color: #ababab !important;
	border-radius: 3px !important;
}

.newGreen-theme {
	.key_insights {
		background: #fff !important;
		.card-header,
		.modal-header {
			background-color: #1a4728 !important;
			background-color: #1a4728 !important;
			border: 0px solid #1a4728;
			border-radius: 3px 3px 0 0;
		}
		.card-footer {
			background-color: #f9f9f9 !important;
		}
	}
	.percentage-card {
		background-color: #f9f9f9;
		box-shadow: none;
		border: 1px solid #f1f1f1;
	}

	.black-btn,
	.black-btn :hover {
		background-color: #1a4728 !important;
		border-color: #1a4728 !important;
	}
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
	.tabview_padding_col {
		padding-left: 2px;
		padding-right: 5px;
	}
	.inner_div_sect {
		margin-bottom: 4%;
	}
	.info-card-text h5 {
		width: 180px;
	}
	.info-card-text {
		padding-left: 10px !important;
	}
	.bottom-card-text {
		font-size: 0.8125rem;
		padding-top: 6px;
		margin-bottom: 2px;
		color: #797979;
		padding-left: 20px;
		&.isNotExport {
			height: 45px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden; //New added
		}
	}
	.alertRow {
		position: static;
	}
}
.map-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: var(--fonts-white-shade);
}
</style>
