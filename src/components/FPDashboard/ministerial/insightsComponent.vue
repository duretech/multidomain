<template>
	<div
		class="tabview_padding_col mt-4 px-2"
		:class="[
			showEMUCard ? 'col-xl-6 col-md-6 col-sm-6' : 'col-xl-6 col-md-6 col-sm-6',
		]"
		v-if="showCard"
	>
		<b-card class="summary-card-bg" v-if="boxNarrationText">
			<div class="mb-2">
				<b-row>
					<b-col sm="2">
						<div class="summary-dot" :class="colorHeader">
							<p
								class="mb-0 fs-25-1920 cursor-pointer"
								v-b-tooltip.hover
								:title="curValue ? curValue : `0.0`"
							>
								{{ curValue ? curValue : `0.0` }}
							</p>
						</div></b-col
					>
					<b-col sm="10" class="pl-5 pt-2">
						<b-row>
							<b-col sm="8">
								<div
									class="fs-17-1920 cursor-pointer"
									v-b-tooltip.hover
									:title="`${updatedHeader} ${
										tracerMethod ? ' - ' + tracerMethod : ''
									}`"
								>
									{{ updatedHeader }}
									{{ tracerMethod ? ` - ${tracerMethod}` : "" }}
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
									{{ prevDate }}
									<span class="float-right">{{
										stockDifference || "N/A"
									}}</span>
								</div>
							</b-col>
						</b-row>
					</b-col>
				</b-row>
			</div>
			<div
				class="fs-17-1920 emu-read"
				:class="{
					'emu-status ':
						showMore !== `${chartSubCategory}${chartComponent}${subComponent}`,
					isNotExport: !isExport,
				}"
				style="min-height: 36px"
			>
				<span v-html="getSummaryText(boxNarrationText)"></span>
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
					@click="
						showMoreText(`${chartSubCategory}${chartComponent}${subComponent}`)
					"
				>
					{{
						showMore === `${chartSubCategory}${chartComponent}${subComponent}`
							? "Read Less"
							: "Read More"
					}}</b-button
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
								performanceBenchmarking,
								cardHeader
							)}`)
						"
					/>
				</div>
			</div>
		</b-card>
		<Placeholder v-else />
		<b-modal
			v-model="modalShow"
			hide-footer
			scrollable
			size="xl"
			:title="`${updatedHeader} ${
				tracerMethod ? ' ( ' + tracerMethod + ' ) ' : ''
			} - ${curDate}`"
			no-close-on-backdrop
			id="modalfp"
		>
			<div class="card border border-0 pl-3">
				<!-- <h5 class="text-uppercase">
					{{ $t("Summary") }}
				</h5> -->
				<div class="row">
					<div class="col-6">
						<b-row class="pt-1 pb-1 pl-3">
							<b-col cols="6"></b-col>
							<b-col class="table-heading pr-0" cols="2"
								><p>
									{{ prevDate }}
								</p></b-col
							>
							<b-col class="table-heading pr-0" cols="2"
								><p>
									{{ curDate }}
								</p>
							</b-col>
							<b-col class="table-heading pr-0" cols="2"
								><p>{{ $t("change%") }}</p></b-col
							>
						</b-row>
						<b-row class="pt-1 pb-2">
							<b-col class="table-heading pt-2" cols="6"
								><p>
									{{
										`${updatedHeader} ${
											tracerMethod ? " ( " + tracerMethod + " ) " : ""
										}`
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
									{{ stockDifference || "N/A" }}
								</div></b-col
							>
						</b-row>
						<div class="col_wrap_sect pt-3">
							<!-- <div class="row mx-0">
								<div class="col-lg-4 col-sm-6 d-flex pl-0 pr-1">
									<div class="d-flex p-2 inner_div_sect" :class="colorHeader">
										<h2>{{ curValue }}</h2>
										<p class="fs-16-1920">
											{{ updatedHeader ? updatedHeader : "" }}
											{{ tracerMethod ? ` - ${tracerMethod}` : "" }}
											<br />
											{{ curDate }}
										</p>
									</div>
								</div>
								<div class="col-lg-4 col-sm-6 d-flex px-2">
									<div class="bg-secondary d-flex p-2 inner_div_sect">
										<h2>{{ prevValue }}</h2>
										<p style="padding-top: 8px">
											{{ $t("valueIn") }} {{ prevDate }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-4 col-sm-6 d-flex pl-1 pr-0"
									v-if="periodType === 'monthly'"
								>
									<div class="bg-secondary d-flex p-2 inner_div_sect">
										<h2>{{ curMonthLastYearValue }}</h2>
										<p style="padding-top: 8px">
											{{ $t("valueIn") }} {{ curMonthLastYear }}
										</p>
									</div>
								</div>
							</div> -->
							<div class="row">
								<div class="col-12">
									<p>
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
														performanceBenchmarking,
														cardHeader
													)}`)
												"
											/>
										</span>
									</p>
								</div>
							</div>
						</div>
						<p class=""><span v-html="boxNarrationText"></span></p>
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
								:chartData="trendChartData"
								:locationPeriod="locationPeriod"
								@isJsonFetched="isJsonFetched = true"
							/>
						</div>
					</div>
				</div>
				<div class="row pb-4">
					<div
						class="col"
						:class="[
							regionalChartData &&
							regionalChartData.series.length > 0 &&
							trendChartData &&
							trendChartData.series.length > 0
								? 'col-6'
								: 'col-12',
						]"
						v-if="regionalChartData && regionalChartData.series.length > 0"
					>
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
										{{ regionalChartData.title.title }}
									</div>
								</div>
							</div>
							<div
								class="card-body py-0"
								v-if="regionalChartData.series[0].data.length > 0"
							>
								<div class="row no-gutters">
									<div
										class="col-12 text-right d-flex align-items-center justify-content-end"
										v-if="inAnalytical"
									>
										<div class="dropdown ml-2">
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
									v-if="regionalChartData"
									:options="regionalChartData"
									ref="regionalCharts"
								></highcharts>
							</div>
							<div class="card-footer text-right">
								<p class="m-0">
									{{ $t("source") }}:
									<span>{{ regionalChartData.chartSource }}</span>
								</p>
							</div>
							<div
								class="card-body"
								v-if="regionalChartData.series[0].data.length === 0"
							>
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</div>
					<div
						class="col"
						:class="[
							regionalChartData &&
							regionalChartData.series.length > 0 &&
							trendChartData &&
							trendChartData.series.length > 0
								? 'col-6'
								: 'col-12',
						]"
						v-if="trendChartData && trendChartData.series.length > 0"
					>
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
										{{ trendChartData.title.title }}
									</div>
								</div>
							</div>
							<div
								class="card-body py-0"
								v-if="trendChartData.series[0].data.length > 0"
							>
								<div class="row no-gutters">
									<div
										class="col-12 text-right d-flex align-items-center justify-content-end"
										v-if="inAnalytical"
									>
										<div class="dropdown ml-2">
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
									v-if="trendChartData"
									:options="trendChartData"
									ref="trendCharts"
								></highcharts>
							</div>
							<div class="card-footer text-right">
								<p class="m-0">
									{{ $t("source") }}:
									<span>{{ trendChartData.chartSource }}</span>
								</p>
							</div>
							<div
								class="card-body"
								v-if="trendChartData.series[0].data.length === 0"
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
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import { chartExport } from "@/components/Common/commonFunctions";
export default {
	props: [
		"chartSubCategory",
		"chartComponent",
		"sendPeriod",
		"sendLocation",
		"ministerialData",
		"cardHeader",
		"name",
		"subComponent",
		"percentage",
		"exportArr",
		"showEMUCard",
		"reportingBenchmark",
		"benchmark",
		"periodType",
		"isExport",
		"inAnalytical",
		"allGeoJson",
		"locationName",
		"locationPeriod",
	],
	mixins: [SummaryViewMixin],
	components: {
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
		return {
			showCard: true,
			period: "",
			newPeriod: "",
			newLocation: [],
			chartType: this.chartComponent,
			stockDifference: "",
			prevDate: "",
			prevValue: "",
			curMonthLastYear: "",
			curMonthLastYearValue: "",
			curDate: "",
			curValue: "",
			boxNarrationText: "",
			boxNarrationTextOriginal: "",
			colorHeader: "bg-yellow", // #ffa726 - bg-yellow ,  #ef5350 - bg-red , #9cd49f - bg-green
			rmnchScorecard: "",
			updatedHeader: "",
			tracerMethod: "",
			modalShow: false,
			trendChartData: null,
			regionalChartData: null,
			performanceBenchmarking: "N/A",
			benchmarkValue: "",
			isDataSet: false,
			activeIcon: "",
			chartRef: "",
			isJsonFetched: false,
			selectedInd: "",
		};
	},
	computed: {
		indList() {
			return this.trendChartData &&
				this.trendChartData.series &&
				this.trendChartData.series.length
				? this.trendChartData.series.map((s) => ({
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
		sendPeriod(newValue) {
			this.sendPeriod = newValue;
			this.boxNarrationText = "";
			this.isDataSet = false;
		},
		sendLocation(newValue) {
			this.sendLocation = newValue;
			this.boxNarrationText = "";
			this.isDataSet = false;
		},
		exportArr(newValue) {
			// console.log("exportArr",newValue)
			let chartObj = newValue.find(
				(s) =>
					s.showInSummary &&
					s.isDerivedChart &&
					s.chartComponent === this.chartComponent &&
					s.chartSubCategory === this.chartSubCategory
			);
			// console.log("chartObj", chartObj)
			let indicators = {};
			if (
				this.ministerialData.data[this.chartSubCategory] &&
				this.ministerialData.data[this.chartSubCategory][this.chartType]
			) {
				indicators =
					this.ministerialData.data[this.chartSubCategory][this.chartType];
			} else {
				indicators = undefined;
			}
			let isMapping = false;

			if (indicators && indicators.chartData) {
				indicators.chartData.forEach((c) => {
					c.indicator.subIndicator.forEach((s) => {
						if (s.de.length > 0) {
							isMapping = true;
						}
					});
				});
			}

			if (
				(indicators && indicators.disableChart && !this.isDataSet) ||
				(!isMapping && !this.isDataSet) ||
				(!this.isDataSet && chartObj && chartObj.series.length === 0)
			) {
				this.showCard = false;
				this.isDataSet = true;
				return;
			}

			// console.log("indicators",indicators)
			// if(chartObj && !this.isDataSet && this.chartSubCategory !== 'reportingRate' && chartObj.series.length > 0) {
			if (chartObj && !this.isDataSet && chartObj.series.length > 0) {
				if (indicators) {
					if (indicators.disableChart) {
						this.showCard = false;
						return;
					}
					if (this.subComponent !== "sumAll") {
						indicators = indicators.chartData.find(
							(c) =>
								c.indicator.static_name.toLowerCase() ===
								this.subComponent.toLowerCase()
						);
					}

					// console.log("indicators",indicators)
					// console.log("this.sendPeriod",this.sendPeriod)
					if (this.periodType === "monthly") {
						let currentPeriod = this.$moment(this.sendPeriod, "YYYYMM").format(
								"YYYYMM"
							),
							lastMonth = this.$moment(currentPeriod, "YYYYMM")
								.subtract(1, "months")
								.format("YYYYMM"),
							lastYearSameMonth = this.$moment(currentPeriod, "YYYYMM")
								.subtract(12, "months")
								.format("YYYYMM");

						let periodValue = {};
						if (this.chartSubCategory === "stockOut") {
							chartObj.series.forEach((s) => {
								if (s.name === indicators.indicator.name) {
									s.data.forEach((dValue) => {
										if (dValue.pe === lastYearSameMonth) {
											periodValue[lastYearSameMonth] = dValue.y;
										}
										if (dValue.pe === lastMonth) {
											periodValue[lastMonth] = dValue.y;
										}
										if (dValue.pe === currentPeriod) {
											periodValue[currentPeriod] = dValue.y;
										}
									});
								}
							});
						} else {
							chartObj.series.forEach((s) => {
								s.data.forEach((dValue) => {
									if (dValue.pe === lastYearSameMonth) {
										periodValue[lastYearSameMonth] = dValue.y;
									}
									if (dValue.pe === lastMonth) {
										periodValue[lastMonth] = dValue.y;
									}
									if (dValue.pe === currentPeriod) {
										periodValue[currentPeriod] = dValue.y;
									}
								});
							});
						}

						let lastYearV = periodValue[lastYearSameMonth]
							? periodValue[lastYearSameMonth]
							: 0;
						let lastV = periodValue[lastMonth] ? periodValue[lastMonth] : 0;
						let currV = periodValue[currentPeriod]
							? periodValue[currentPeriod]
							: 0;

						let d = [lastYearV, lastV, currV],
							pe = [lastYearSameMonth, lastMonth, currentPeriod];

						// console.log("d",d)
						// console.log("pe",pe)

						this.stockDifference = (d[2] - d[1]).toFixed(1);
						this.lastStockDifference = (d[2] - d[0]).toFixed(1);
						this.curMonthLastYearValue =
							this.chartSubCategory === "Volume"
								? parseFloat(Math.round(d[0])).toLocaleString()
								: parseFloat(d[0].toFixed(1)).toLocaleString();
						this.prevValue =
							this.chartSubCategory === "Volume"
								? parseFloat(Math.round(d[1])).toLocaleString()
								: parseFloat(d[1].toFixed(1)).toLocaleString();
						this.curValue =
							this.chartSubCategory === "Volume"
								? parseFloat(Math.round(d[2])).toLocaleString()
								: parseFloat(d[2].toFixed(1)).toLocaleString();

						this.curMonthLastYear = this.$moment(pe[0], "YYYYMM").format(
							"MMM YYYY"
						);
						this.prevDate = this.$moment(pe[1], "YYYYMM").format("MMM YYYY");
						this.curDate = this.$moment(pe[2], "YYYYMM").format("MMM YYYY");

						let source = "";

						if (this.chartComponent === "Commodities_Client") {
							source = this.$i18n.t("commodities_Distributed_to_Clients");
						} else if (this.chartComponent === "Visits") {
							source = this.$i18n.t("fp_visits");
						} else if (this.chartComponent === "Commodities_Facilities") {
							source = this.$i18n.t("commodities_Distributed_to_Facilities");
						} else if (this.chartComponent === "User") {
							source = this.$i18n.t("fp_users");
						} else if (this.chartComponent === "Overall") {
							source = this.$i18n.t("overall");
						}

						if (this.chartSubCategory !== "reportingRate") {
							let benchmarkValue = this.benchmark * 1,
								curValue =
									this.chartSubCategory === "Volume"
										? Math.round(d[2])
										: d[2].toFixed(1);
							if (
								typeof this.benchmark !== undefined &&
								this.benchmark !== ""
							) {
								// console.log(curValue)
								this.benchmarkValue = this.percentage
									? `${benchmarkValue}%`
									: benchmarkValue;
								this.performanceBenchmarking =
									curValue * 1 > benchmarkValue
										? "High"
										: curValue * 1 < benchmarkValue
										? "Low"
										: curValue * 1 === benchmarkValue
										? "Equal"
										: "N/A";
							} else {
								this.benchmarkValue = "";
								this.performanceBenchmarking = "N/A";
							}
						}

						if (this.chartSubCategory === "stockOut") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							this.updatedHeader = chartData.chartName;
							this.tracerMethod = indicators.indicator.name;
							let internalDiff = 0.0;
							if (d[1]) {
								if ((d[2] - d[1]) / d[1]) {
									this.stockDifference = `${(
										((d[2] - d[1]) / d[1]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[2] - d[1]) / d[1]) * 100).toFixed(1);
								} else {
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}

							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}

							let sRange = this.$i18n.t("constant_V3"),
								hValue = this.$i18n.t("high_V1"),
								hRange = this.$i18n.t("stockOutCondition1");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V3");
								this.colorHeader = "bg-red";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V3");
								this.colorHeader = "bg-green";
							} else {
								this.colorHeader = "bg-yellow";
							}

							if ((d[2] - d[0]) / d[0]) {
								this.lastStockDifference = (
									((d[2] - d[0]) / d[0]) *
									100
								).toFixed(1);
							} else {
								this.lastStockDifference = 0.0;
							}

							let sLastRange = this.$i18n.t("constant_V3");
							if (this.lastStockDifference > 5) {
								sLastRange = this.$i18n.t("increased_V3");
							} else if (this.lastStockDifference < -5) {
								sLastRange = this.$i18n.t("decreased_V3");
							}

							if (d[1].toFixed(1) > 5) {
								hValue = this.$i18n.t("moderate_V1");
								hRange = this.$i18n.t("stockOutCondition2");
							} else {
								hValue = this.$i18n.t("low_V1");
								hRange = this.$i18n.t("stockOutCondition3");
							}

							this.boxNarrationText = this.$i18n.t(`stockOutMonthly`, {
								indicator1: `<strong>${this.$i18n.t(
									`${this.subComponent}`
								)}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								lastMonth: `<strong>${this.$moment(pe[1], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								compare2: `<strong>${sLastRange}</strong>`,
								lastYear: `<strong>${this.$moment(pe[0], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								lastYearPercentage: `<strong>${d[0].toFixed(1)}${
									this.percentage ? "%" : ""
								}</strong>`,
								compare3: `<strong>${hValue}</strong>`,
								stockOutCondition: `<strong>${hRange}</strong>`,
							});
						} else if (this.chartSubCategory === "Volume") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							// console.log("chartData",chartData)
							this.updatedHeader =
								chartData.derivedCharts[0].chartOptions.chartName;
							let internalDiff = 0.0;
							if (d[1]) {
								if ((d[2] - d[1]) / d[1]) {
									this.stockDifference = `${(
										((d[2] - d[1]) / d[1]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[2] - d[1]) / d[1]) * 100).toFixed(1);
								} else {
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}

							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}

							let sRange = this.$i18n.t("constant_V2");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V2");
								this.colorHeader = "bg-green";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}

							if ((d[2] - d[0]) / d[0]) {
								this.lastStockDifference = (
									((d[2] - d[0]) / d[0]) *
									100
								).toFixed(1);
							} else {
								this.lastStockDifference = 0.0;
							}

							let sLastRange = this.$i18n.t("constant_V2");
							if (this.lastStockDifference > 5) {
								sLastRange = this.$i18n.t("increased_V2");
							} else if (this.lastStockDifference < -5) {
								sLastRange = this.$i18n.t("decreased_V2");
							}

							this.boxNarrationText = this.$i18n.t(`volumeMonthly`, {
								indicator1: `<strong>${source}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								currentMonth: `<strong>${this.$moment(pe[2], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								lastMonth: `<strong>${this.$moment(pe[1], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								lastYearValue: `<strong>${
									!Number.isInteger(d[0])
										? Math.round(d[0]).toLocaleString()
										: Math.round(d[0]).toLocaleString()
								}${this.percentage ? "%" : ""}</strong>`,
								compare2: `<strong>${sLastRange}</strong>`,
							});
						} else if (this.chartSubCategory === "RMNCH") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							// console.log("chartData",chartData)

							this.updatedHeader = chartData.chartData[0].indicator.name;
							let internalDiff = 0.0;
							if (d[1]) {
								if ((d[2] - d[1]) / d[1]) {
									this.stockDifference = `${(
										((d[2] - d[1]) / d[1]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[2] - d[1]) / d[1]) * 100).toFixed(1);
								} else {
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}

							//console.log(moduleConfig[this.chartSubCategory][this.chartType])
							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}
							let rmnchCurrentValue = d[2].toFixed(1);

							let sRange = this.$i18n.t("constant_V2");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V2");
								this.colorHeader = "bg-green";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}

							if ((d[2] - d[0]) / d[0]) {
								this.lastStockDifference = (
									((d[2] - d[0]) / d[0]) *
									100
								).toFixed(1);
							} else {
								this.lastStockDifference = 0.0;
							}

							let sLastRange = this.$i18n.t("constant_V2");
							if (this.lastStockDifference > 5) {
								sLastRange = this.$i18n.t("increased_V2");
							} else if (this.lastStockDifference < -5) {
								sLastRange = this.$i18n.t("decreased_V2");
							}

							this.boxNarrationText = this.$i18n.t(`rmnchMonthly`, {
								indicator1: `<strong>${chartData.chartData[0].indicator.name}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								lastMonth: `<strong>${this.$moment(pe[1], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								compare2: `<strong>${sLastRange}</strong>`,
								lastYear: `<strong>${this.$moment(pe[0], "YYYYMM").format(
									"MMM YYYY"
								)}</strong>`,
								lastYearPercentage: `<strong>${d[0].toFixed(1)}${
									this.percentage ? "%" : ""
								}</strong>`,
							});
							this.$emit(
								"rmnchCurrentValue",
								rmnchCurrentValue,
								chartData.chartData[0].indicator.name,
								this.percentage
							);
						} else {
							// console.log("chartComponent reporting rate",this.chartComponent)
							//console.log(this.subComponent)
							let chartData =
									this.ministerialData.data[this.chartSubCategory][
										this.chartType
									],
								isFound = chartData.chartData.find(
									(c) =>
										c.indicator.static_name.toLowerCase() ===
										this.subComponent.toLowerCase()
								);
							if (isFound) {
								this.updatedHeader = isFound.indicator.name;
							}

							if (this.reportingBenchmark) {
								// console.log(this.reportingBenchmark)
								// console.log(this.curValue)
								let benchmarkValue =
										this.reportingBenchmark.plotLines[0].value * 1,
									curValue = d[2].toFixed(1);
								if (benchmarkValue) {
									this.benchmarkValue = this.percentage
										? `${benchmarkValue}%`
										: benchmarkValue;
									this.performanceBenchmarking =
										curValue * 1 > benchmarkValue
											? "High"
											: curValue * 1 < benchmarkValue
											? "Low"
											: curValue * 1 === benchmarkValue
											? "Equal"
											: "N/A";
								} else {
									this.benchmarkValue = "";
									this.performanceBenchmarking = "N/A";
								}
							}

							let sRange = this.$i18n.t("similar_to_V2");

							if (this.stockDifference > 5) {
								sRange = this.$i18n.t("higher_than_V2");
								this.colorHeader = "bg-green";
							} else if (this.stockDifference < -5) {
								sRange = this.$i18n.t("lower_than_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}

							if (this.percentage) {
								this.stockDifference = `${this.stockDifference}%`;
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}
							let sLastRange = this.$i18n.t("similar_to_V2");

							if (this.lastStockDifference > 5) {
								sLastRange = this.$i18n.t("higher_than_V2");
							} else if (this.lastStockDifference < -5) {
								sLastRange = this.$i18n.t("lower_than_V2");
							}

							this.boxNarrationText = this.boxNarrationTextOriginal =
								this.$i18n.t(`reportingRateMonthly`, {
									percentageValue: `<strong>${d[2].toFixed(1)}%</strong>`,
									indicatorAndSource: `<strong>${this.updatedHeader} - ${source}</strong>`,
									currentMonth: `<strong>${this.$moment(pe[2], "YYYYMM").format(
										"MMM YYYY"
									)}</strong>`,
									compare1: `<strong>${sRange}</strong>`,
									lastMonth: `<strong>${this.$moment(pe[1], "YYYYMM").format(
										"MMM YYYY"
									)}</strong>`,
									compare2: `<strong>${sLastRange}</strong>`,
									lastYear: `<strong>${this.$moment(pe[0], "YYYYMM").format(
										"MMM YYYY"
									)}</strong>`,
									lastYearPercentage: `<strong>${d[0].toFixed(1)}${
										this.percentage ? "%" : ""
									}</strong>`,
								});
						}
					} else {
						// console.log("sendPeriod", this.sendPeriod)
						// console.log("chartObj.series", chartObj.series)

						let currentPeriod =
								this.periodType === "financialYearJuly"
									? this.sendPeriod.split("July")[0]
									: this.sendPeriod,
							lastYear = this.$moment(currentPeriod, "YYYY")
								.subtract(1, "year")
								.format("YYYY");
						if (this.periodType === "quarterly") {
							lastYear = this.$moment(currentPeriod, "YYYY[Q]Q")
								.subtract(1, "Q")
								.format("YYYY[Q]Q");
						}
						if (this.periodType === "financialYear") {
							currentPeriod = `${currentPeriod}April`;
							lastYear = `${lastYear}April`;
						}

						if (this.periodType === "financialYearJuly") {
							currentPeriod = `${currentPeriod}July`;
							lastYear = `${lastYear}July`;
						}

						let periodValue = {};
						if (this.chartSubCategory === "stockOut") {
							chartObj.series.forEach((s) => {
								if (s.name === indicators.indicator.name) {
									s.data.forEach((dValue) => {
										if (dValue.pe === lastYear) {
											periodValue[lastYear] = dValue.y;
										}
										if (dValue.pe === currentPeriod) {
											periodValue[currentPeriod] = dValue.y;
										}
									});
								}
							});
						} else {
							chartObj.series.forEach((s) => {
								s.data.forEach((dValue) => {
									if (dValue.pe === lastYear) {
										periodValue[lastYear] = dValue.y;
									}
									if (dValue.pe === currentPeriod) {
										periodValue[currentPeriod] = dValue.y;
									}
								});
							});
						}
						// console.log("periodValue", periodValue)
						let lastV = periodValue[lastYear] ? periodValue[lastYear] : 0;
						let currV = periodValue[currentPeriod]
							? periodValue[currentPeriod]
							: 0;

						let d = [lastV, currV],
							pe = [lastYear, currentPeriod];

						// console.log("d",d)
						// console.log("pe",pe)
						this.stockDifference = (d[1] - d[0]).toFixed(1);
						this.prevValue =
							this.chartSubCategory === "Volume"
								? parseFloat(Math.round(d[0])).toLocaleString()
								: parseFloat(d[0].toFixed(1)).toLocaleString();
						this.curValue =
							this.chartSubCategory === "Volume"
								? parseFloat(Math.round(d[1])).toLocaleString()
								: parseFloat(d[1].toFixed(1)).toLocaleString();

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

						if (this.periodType === "quarterly") {
							let q1 = pe[0].split("Q"),
								q2 = pe[1].split("Q");
							this.prevDate =
								quarters[`Q${q1[1]}`][0] +
								" - " +
								quarters[`Q${q1[1]}`][1] +
								" " +
								q1[0];
							this.curDate =
								quarters[`Q${q2[1]}`][0] +
								" - " +
								quarters[`Q${q2[1]}`][1] +
								" " +
								q2[0];
						} else if (this.periodType === "financialYear") {
							this.prevDate = `${years[1]} ${this.sendPeriod * 1 - 1} - ${
								years[0]
							} ${this.sendPeriod}`;
							this.curDate = `${years[1]} ${this.sendPeriod} - ${years[0]} ${
								this.sendPeriod * 1 + 1
							}`;
						} else if (this.periodType === "financialYearJuly") {
							let period = this.sendPeriod.split("July")[0];
							this.prevDate = `${yearsJuly[1]} ${period * 1 - 1} - ${
								yearsJuly[0]
							} ${period}`;
							this.curDate = `${yearsJuly[1]} ${period} - ${yearsJuly[0]} ${
								period * 1 + 1
							}`;
						} else {
							this.prevDate = pe[0];
							this.curDate = pe[1];
						}

						let source = this.$i18n.t("commodities_Distributed_to_Clients");

						if (this.chartComponent === "Commodities_Client") {
							source = this.$i18n.t("commodities_Distributed_to_Clients");
						} else if (this.chartComponent === "Visits") {
							source = this.$i18n.t("fp_visits");
						} else if (this.chartComponent === "Commodities_Facilities") {
							source = this.$i18n.t("commodities_Distributed_to_Facilities");
						} else {
							source = this.$i18n.t("fp_users");
						}

						if (this.chartSubCategory !== "reportingRate") {
							let benchmarkValue = this.benchmark * 1,
								curValue =
									this.chartSubCategory === "Volume"
										? Math.round(d[1])
										: d[1].toFixed(1);
							if (
								typeof this.benchmark !== undefined &&
								this.benchmark !== ""
							) {
								// console.log(curValue)
								this.benchmarkValue = this.percentage
									? `${benchmarkValue}%`
									: benchmarkValue;
								this.performanceBenchmarking =
									curValue * 1 > benchmarkValue
										? "High"
										: curValue * 1 < benchmarkValue
										? "Low"
										: curValue * 1 === benchmarkValue
										? "Equal"
										: "N/A";
							} else {
								this.benchmarkValue = "";
								this.performanceBenchmarking = "N/A";
							}
						}

						// return
						if (this.chartSubCategory === "stockOut") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							this.updatedHeader = chartData.chartName;
							this.tracerMethod = indicators.indicator.name;
							let internalDiff = 0.0;
							if (d[0]) {
								if ((d[1] - d[0]) / d[0]) {
									this.stockDifference = `${(
										((d[1] - d[0]) / d[0]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[1] - d[0]) / d[0]) * 100).toFixed(1);
								} else {
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}

							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}

							let sRange = this.$i18n.t("constant_V3"),
								hValue = this.$i18n.t("high_V1"),
								hRange = this.$i18n.t("stockOutCondition1");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V3");
								this.colorHeader = "bg-red";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V3");
								this.colorHeader = "bg-green";
							} else {
								this.colorHeader = "bg-yellow";
							}

							if (d[0].toFixed(1) > 5) {
								hValue = this.$i18n.t("moderate_V1");
								hRange = this.$i18n.t("stockOutCondition2");
							} else {
								hValue = this.$i18n.t("low_V1");
								hRange = this.$i18n.t("stockOutCondition3");
							}

							let key = "stockOutAnnual";
							if (this.periodType === "quarterly") {
								key = "stockOutQuarterly";
							}

							this.boxNarrationText = this.$i18n.t(`${key}`, {
								indicator1: `<strong>${this.$i18n.t(
									`${this.subComponent}`
								)}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								lastYear: `<strong>${this.prevDate}</strong>`,
								lastYearPercentage: `<strong>${d[0].toFixed(1)}${
									this.percentage ? "%" : ""
								}</strong>`,
								compare2: `<strong>${hValue}</strong>`,
								stockOutCondition: `<strong>${hRange}</strong>`,
							});
						} else if (this.chartSubCategory === "Volume") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							// console.log("chartData",chartData)
							this.updatedHeader =
								chartData.derivedCharts[0].chartOptions.chartName;
							let internalDiff = 0.0;
							if (d[0]) {
								if ((d[1] - d[0]) / d[0]) {
									// console.log((d[1] - d[0]) / d[0])
									this.stockDifference = `${(
										((d[1] - d[0]) / d[0]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[1] - d[0]) / d[0]) * 100).toFixed(1);
								} else {
									// console.log((d[1] - d[0]) / d[0])
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}
							// console.log("this.stockDifference",this.stockDifference)
							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}

							let sRange = this.$i18n.t("constant_V2");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V2");
								this.colorHeader = "bg-green";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}
							let key = "volumeAnnual";
							if (this.periodType === "quarterly") {
								key = "volumeQuarterly";
							}
							this.boxNarrationText = this.$i18n.t(`${key}`, {
								indicator1: `<strong>${source}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								currentYear: `<strong>${this.curDate}</strong>`,
								lastYear: `<strong>${this.prevDate}</strong>`,
							});
						} else if (this.chartSubCategory === "RMNCH") {
							let chartData =
								this.ministerialData.data[this.chartSubCategory][
									this.chartType
								];
							// console.log("chartData",chartData)

							this.updatedHeader = chartData.chartData[0].indicator.name;
							let internalDiff = 0.0;
							if (d[0]) {
								if ((d[1] - d[0]) / d[0]) {
									this.stockDifference = `${(
										((d[1] - d[0]) / d[0]) *
										100
									).toFixed(1)}%`;
									internalDiff = (((d[1] - d[0]) / d[0]) * 100).toFixed(1);
								} else {
									this.stockDifference = "0.0%";
								}
							} else {
								this.stockDifference = "0.0%";
							}

							//console.log(moduleConfig[this.chartSubCategory][this.chartType])
							if (this.percentage) {
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}
							let rmnchCurrentValue = d[1].toFixed(1);

							let sRange = this.$i18n.t("constant_V2");
							if (internalDiff > 5) {
								sRange = this.$i18n.t("increased_V2");
								this.colorHeader = "bg-green";
							} else if (internalDiff < -5) {
								sRange = this.$i18n.t("decreased_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}
							let key = "rmnchAnnual";
							if (this.periodType === "quarterly") {
								key = "rmnchQuarterly";
							}
							this.boxNarrationText = this.$i18n.t(`${key}`, {
								indicator1: `<strong>${chartData.chartData[0].indicator.name}</strong>`,
								compare1: `<strong>${sRange}</strong>`,
								lastYear: `<strong>${this.prevDate}</strong>`,
								lastYearPercentage: `<strong>${d[0].toFixed(1)}${
									this.percentage ? "%" : ""
								}</strong>`,
							});
							this.$emit(
								"rmnchCurrentValue",
								rmnchCurrentValue,
								chartData.chartData[0].indicator.name,
								this.percentage
							);
						} else {
							//console.log(this.chartComponent)
							//console.log(this.subComponent)
							let chartData =
									this.ministerialData.data[this.chartSubCategory][
										this.chartType
									],
								isFound = chartData.chartData.find(
									(c) =>
										c.indicator.static_name.toLowerCase() ===
										this.subComponent.toLowerCase()
								);
							if (isFound) {
								this.updatedHeader = isFound.indicator.name;
							}

							if (this.reportingBenchmark) {
								// console.log(this.reportingBenchmark)
								// console.log(this.curValue)
								let benchmarkValue =
										this.reportingBenchmark.plotLines[0].value * 1,
									curValue = d[1].toFixed(1);
								if (benchmarkValue) {
									this.benchmarkValue = this.percentage
										? `${benchmarkValue}%`
										: benchmarkValue;
									this.performanceBenchmarking =
										curValue * 1 > benchmarkValue
											? "High"
											: curValue * 1 < benchmarkValue
											? "Low"
											: curValue * 1 === benchmarkValue
											? "Equal"
											: "N/A";
								} else {
									this.benchmarkValue = "";
									this.performanceBenchmarking = "N/A";
								}
							}

							// console.log(rData)

							let sRange = this.$i18n.t("similar_to_V2");

							if (this.stockDifference > 5) {
								sRange = this.$i18n.t("higher_than_V2");
								this.colorHeader = "bg-green";
							} else if (this.stockDifference < -5) {
								sRange = this.$i18n.t("lower_than_V2");
								this.colorHeader = "bg-red";
							} else {
								this.colorHeader = "bg-yellow";
							}
							let key = "reportingRateAnnual";
							if (this.periodType === "quarterly") {
								key = "reportingRateQuarterly";
							}
							if (this.percentage) {
								this.stockDifference = `${this.stockDifference}%`;
								this.prevValue = `${this.prevValue}%`;
								this.curValue = `${this.curValue}%`;
							}
							this.boxNarrationText = this.boxNarrationTextOriginal =
								this.$i18n.t(`${key}`, {
									percentageValue: `<strong>${d[1].toFixed(1)}%</strong>`,
									indicatorAndSource: `<strong>${this.updatedHeader} - ${source}</strong>`,
									currentYear: `<strong>${this.curDate}</strong>`,
									compare1: `<strong>${sRange}</strong>`,
									lastYear: `<strong>${this.prevDate}</strong>`,
									lastYearPercentage: `<strong>${d[0].toFixed(1)}${
										this.percentage ? "%" : ""
									}</strong>`,
								});
						}
					}

					this.showCard = true;
					this.isDataSet = true;
				} else {
					this.showCard = false;
				}
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
			this.trendChartData = null;
			this.regionalChartData = null;
			// console.log(this.exportArr)
			let data = this.exportArr.filter(
				(s) =>
					s.showInSummary &&
					s.chartComponent === this.chartComponent &&
					s.chartSubCategory === this.chartSubCategory
			);
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
			// let _this = this

			if (data.length) {
				if (data[0]) {
					if (data[0].cardKey.substring(3) * 1 < 13) {
						this.trendChartData = data[0];
						this.trendChartData.yAxis.max = null;
						if (data[0].chart.type === "line") {
							this.trendChartData.yAxis.min = 0;
						}
						this.trendChartData.chartSource = data[0].chartSource;
					} else {
						this.regionalChartData = data[0];
						this.regionalChartData.yAxis.max = null;
						if (data[0].chart.type === "line") {
							this.regionalChartData.yAxis.min = 0;
						}
						this.regionalChartData.chartSource = data[0].chartSource;
					}
				}
				if (data[1]) {
					if (data[1].cardKey.substring(3) * 1 < 13) {
						this.trendChartData = data[1];
						this.trendChartData.yAxis.max = null;
						if (data[1].chart.type === "line") {
							this.trendChartData.yAxis.min = 0;
						}
						this.trendChartData.chartSource = data[1].chartSource;
					} else {
						this.regionalChartData = data[1];
						this.regionalChartData.yAxis.max = null;
						if (data[1].chart.type === "line") {
							this.regionalChartData.yAxis.min = 0;
						}
						this.regionalChartData.chartSource = data[1].chartSource;
					}
				}
			}

			if (
				this.regionalChartData &&
				this.regionalChartData.series.length > 0 &&
				this.chartSubCategory === "reportingRate"
			) {
				// console.log("this.regionalChartData",this.regionalChartData)
				let pRegions = "";
				if (this.benchmarkValue) {
					let rData = [];
					this.regionalChartData.series[0].data.map((s) => {
						if (s.y * 1 < this.benchmarkValue.split("%")[0]) {
							rData.push(s);
						}
					});
					if (rData.length) {
						// let sortedReportingData = rData.length > 5 ? rData.slice(0, 5) : rData
						// console.log("rData", rData)
						let sortedReportingData = rData
							.sort(function (a, b) {
								return a.y - b.y;
							})
							.slice(0, 5);
						// console.log("sortedReportingData",sortedReportingData)

						sortedReportingData.forEach((p, ind) => {
							if (ind === 0) {
								pRegions += `${p.name}`;
							} else if (ind === sortedReportingData.length - 1) {
								pRegions += `, ${this.$i18n.t("and")} ${p.name}`;
							} else {
								pRegions += `, ${p.name}`;
							}
						});
					}
				}
				// console.log("pRegions",pRegions)
				let reportingRegions = "",
					period = null,
					key = null,
					pKey = null;
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
				if (this.periodType === "monthly") {
					period = this.$moment(this.sendPeriod, "YYYYMM").format("MMM YYYY");
				}
				if (this.periodType === "yearly") {
					period = this.sendPeriod;
				}
				if (this.periodType === "financialYear") {
					period = `${years[1]} ${this.sendPeriod} - ${years[0]} ${
						this.sendPeriod * 1 + 1
					}`;
				}
				if (this.periodType === "financialYearJuly") {
					let period = this.sendPeriod.split("July")[0];
					period = `${yearsJuly[1]} ${period} - ${yearsJuly[0]} ${
						period * 1 + 1
					}`;
				}
				if (this.periodType === "quarterly") {
					let q1 = this.sendPeriod.split("Q");
					period =
						quarters[`Q${q1[1]}`][0] +
						" - " +
						quarters[`Q${q1[1]}`][1] +
						" " +
						q1[0];
				}
				if (pRegions) {
					if (this.periodType === "monthly") {
						key = "reportingRateCondition1Monthly";
						pKey = "currentMonth";
					}
					if (this.periodType === "quarterly") {
						key = "reportingRateCondition1Quarterly";
						pKey = "currentYear";
					}
					if (
						this.periodType === "yearly" ||
						this.periodType === "financialYear" ||
						this.periodType === "financialYearJuly"
					) {
						key = "reportingRateCondition1Annual";
						pKey = "currentYear";
					}
					reportingRegions = this.$i18n.t(`${key}`, {
						[pKey]: `<strong>${period}</strong>`,
						regions: `<strong>${pRegions}</strong>`,
					});
				} else {
					if (this.periodType === "monthly") {
						key = "reportingRateCondition2Monthly";
						pKey = "currentMonth";
					}
					if (this.periodType === "quarterly") {
						key = "reportingRateCondition2Quarterly";
						pKey = "currentYear";
					}
					if (
						this.periodType === "yearly" ||
						this.periodType === "financialYear" ||
						this.periodType === "financialYear"
					) {
						key = "reportingRateCondition2Annual";
						pKey = "currentYear";
					}
					reportingRegions = this.$i18n.t(`${key}`, {
						[pKey]: `<strong>${period}</strong>`,
						benchmarkPercentage: `<strong>${
							this.benchmarkValue ? this.benchmarkValue : "80%"
						}</strong>`,
					});
				}
				// console.log("reportingRegions",reportingRegions)
				this.boxNarrationText =
					this.boxNarrationTextOriginal + "" + reportingRegions;
			}
			setTimeout(() => {
				this.modalShow = true;
			}, 100);
		},
	},
};
</script>
<style scoped lang="scss">
.card-header.bg-yellow {
	background-color: #ffba69;
}

.card-header.bg-red {
	background-color: #fe8081;
}

.card-header.bg-green {
	// background-color: #9cd49f;
	background-color: #5bd282;
}

//new styles
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
	padding-top: 18px;
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
	-webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06),
		0 0 2px 0 rgba(0, 0, 0, 0.06);
	box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.06), 0 0 2px 0 rgba(0, 0, 0, 0.06);
}

.alert {
	padding: 0.25rem 1.25rem;
	border: 0;
	border-radius: 3px;

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
	.inner_div_sect {
		justify-content: space-evenly;
		align-items: center;
		border-radius: 4px;
		color: #fff;
		width: 100%;
		h2 {
			margin-bottom: 0;
			font-size: 1.38rem;
		}
		p span {
			font-size: 0.75rem;
			margin-bottom: 0;
			padding-left: 5px;
			height: 35px;
		}
	}
}

.bg-secondary {
	background-color: #ababab !important;
	border-radius: 3px !important;
}
.close {
	color: #fff;
	opacity: 1;
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

.newGreen-theme {
	.key_insights {
		background: #fff !important;
		.card-header,
		.modal-header {
			background-color: #1a4728 !important;
			background-color: #1a4728 !important;
			border: 0 solid #1a4728;
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
}
.map-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: var(--fonts-white-shade);
}
</style>
