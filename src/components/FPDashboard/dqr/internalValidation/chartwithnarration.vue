<template>
	<fullscreen v-model="cDataFull" ref="fullscreen" class="fullContainer">
		<div class="card position-relative m-t-20px border-none fullContent">
			<!-- <loader class="cardLoader" v-if="showLoader" /> -->
			<div class="card-header px-2 py-1">
				<div class="row no-gutters">
					<div
						class="col-lg-9 col-md-9 p-t-4px"
						:class="{ 'col-lg-12 col-md-12': cDataFull }"
					>
						<div class="cardTitleSection text-wrap fs-19-1920">
							<i
								class="fa fa-info-circle color-white cursor-pointer chart-info mr-2 ml-2"
								aria-hidden="true"
								v-b-popover.hover.rightbottom="{
									variant: 'info',
									content: chartInfo,
									title: title,
									html: true,
								}"
							></i>
							<p class="title_p fs-19-1920 m-0">{{ title }}</p>
						</div>
					</div>
					<div class="col-lg-3 col-md-3 position-relative" v-if="!cDataFull">
						<ChartOptions
							:cID="cid"
							:title="title"
							sorting="type3"
							:chartKey="chartRef"
							@dataSort="dataSort"
							defaultSort="JAN-DEC"
							:drillDown="drillDown"
							@showTable="showTable"
							fullScreenKey="cData"
							@exportChart="exportChart"
							:trendTable="cData.tableData"
							@toggleFullscreen="toggleFullscreen"
						/>
					</div>
				</div>
			</div>

			<div
				class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
			>
				<div class="row m-0">
					<div class="" :class="[signOffActive ? 'col-12' : 'col-9']">
						<div class="row mb-3" :class="{ hidden: chartView === 'table' }">
							<div class="col-lg-12 col-md-12">
								<ChartFilters
									:source="source"
									:allMethods="allMethods"
									:dataOptions="dataOptions"
									:seriesOptions="seriesOptions"
									:selectedMethod="selectedMethod"
									@changeDataOption="changeDataOption"
									@getSelectedMethod="getSelectedMethod"
									:defaultDataOption="defaultDataOption"
									@changeSeriesOption="changeSeriesOption"
									:defaultSeriesOption="defaultSeriesOption"
								/>
							</div>
						</div>
						<b-tabs
							align="right"
							no-nav-style
							class="internal-nested-tab-noCSS"
						>
							<b-tab v-if="chartView === 'chart'">
								<!-- <div v-if="btns">
                  <b-button variant="primary" v-for="(btn,ind) in btns" :key="ind"
                      @click="btnClickHandle(btn.value)" :class="btn.class">{{btn.text}}</b-button>
              </div> -->
								<template v-if="nested">
									<highcharts
										class="chartHeight"
										:ref="chartRef"
										:options="cData"
									/>
									<div class="f-s-0-875rem mb-2" v-if="drillDown">
										<i class="fa fa-circle mr-3" style="color: #df5353"></i>
										{{ $t("outliers_regions") }}
									</div>
									<!-- <b-tabs align="right" pills :class="drill ? 'internal-nested-tab' : 'internal-nested-tab-noCSS'" no-nav-style>
                                    <b-tab active title="Region">
                                        <highcharts class="chartHeight" :ref="chartRef" :options="cData" />
                                        <div class="f-s-0-875rem mb-2" v-if="drillDown">
                                          <i class="fa fa-circle mr-3" style="color: #DF5353;"></i> Represent's Outliers Regions
                                        </div>
                                    </b-tab>
                                    <b-tab title="Trends" >
                                        <highcharts class="chartHeight" :ref="drillChartRef" :options="drillChartData" />
                                    </b-tab>
                                </b-tabs> -->
								</template>
								<template v-else>
									<highcharts
										class="chartHeight"
										:ref="chartRef"
										:options="cData"
									/>
								</template>
							</b-tab>
							<b-tab v-else>
								<b-table
									class="h-350px"
									v-if="cData.tableData"
									sticky-header
									hover
									:items="cData.tableData"
									:bordered="true"
								></b-table>
							</b-tab>
						</b-tabs>
					</div>
					<div
						class="bg-warm-grey"
						:class="[signOffActive ? 'col-12' : 'col-3']"
					>
						<template v-if="bounds">
							<div class="regionselectioncontainer m-t-10px">
								<p class="mb-0">
									<span class="border-bottom-black font-weight-bold">
										{{ bounds.text }}
									</span>
								</p>
							</div>
							<template v-if="bounds.highLowOutlier">
								<div class="pillcontainer outlier_wrapper_scrollbar">
									<!-- <div v-if="bounds.Low">
                                    <div class="m-t-10px" v-for="(month,ind) in bounds.Low" :key="ind">
                                        <p class="mb-0">
                                            <span class="border-bottom-black font-weight-bold">
                                                {{ind}}
                                            </span>
                                        </p>
                                        <div class="pillcontainer m-t-10px border-bottom-0">
                                            <h5 class="d-inline-block mx-2" v-for="(reg,num) in month" :key="num">
                                                <span class="badge badge-secondary shadow-sm selection-pills">
                                                    {{reg}} (LOW)
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                </div> -->
									<div>
										<div
											class="m-t-10px"
											v-for="(bound, ind) in bounds.highLowOutlier"
											:key="'highLow' + ind"
										>
											<p class="mb-0">
												<span class="border-bottom-black font-weight-bold">
													{{ bound.date }}
												</span>
											</p>
											<div class="pillcontainer m-t-10px border-bottom-0">
												<h5
													class="d-inline-block mx-2"
													v-for="(reg, num) in bound.outlier"
													:key="num"
												>
													<span
														class="badge badge-secondary shadow-sm selection-pills"
													>
														{{ reg.value }} ({{ reg.type }})
													</span>
												</h5>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-if="bounds.outliers">
								<div class="pillcontainer m-t-10px border-bottom-0">
									<h5
										class="d-inline-block mx-2"
										v-for="(reg, num) in bounds.outliers"
										:key="num"
									>
										<span
											class="badge badge-secondary shadow-sm selection-pills"
										>
											{{ reg }}
										</span>
									</h5>
								</div>
							</template>
						</template>
					</div>
				</div>
			</div>
			<!-- <div class="card-footer text-right">
            <p class="m-0">Source: <span>{{source}}</span></p>
        </div> -->
		</div>
	</fullscreen>
</template>
<script>
import { chartExport } from "@/components/Common/commonFunctions";
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
	props: [
		"title",
		"source",
		"chartRef",
		"chartData",
		"bounds",
		"nested",
		"drill",
		"drillChartData",
		"drillChartRef",
		"chartInfo",
		"cid",
		"drillDown",
		"signOffActive",
		"allMethods",
		"selectedMethod",
		"dataOptions",
		"defaultDataOption",
		"seriesOptions",
		"defaultSeriesOption",
	],
	mixins: [FullScreenMixin],
	components: {
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
		ChartFilters: () =>
			import(
				/* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
			),
	},
	data() {
		return {
			chartView: "chart",
			cData: this.chartData,
			cDataFull: false,
		};
	},
	watch: {},
	methods: {
		changeDataOption(newValue) {
			this.$emit("changeDataOption", newValue);
		},
		changeSeriesOption(newValue) {
			this.$emit("changeSeriesOption", newValue);
		},
		updateScale() {
			let min = 0,
				max = 0,
				cData = this.chartData,
				series = this.chartData.series.filter((f) => f.visible);
			series.forEach((d) => {
				let innerDataArr = d.data.map((dInner) => dInner.y);
				let innerMin = Math.min(...innerDataArr);
				let innerMax = Math.max(...innerDataArr);
				if (innerMin < min) {
					min = innerMin;
				}
				if (innerMax > max) {
					max = innerMax;
				}
			});
			cData.yAxis.min = min > 0 ? 0 : min;
			cData.yAxis.max = max;
			cData.series[0].data[0].y = cData.series[0].data[0].y + 1;
			cData.series[0].data[0].y = cData.series[0].data[0].y - 1;
		},
		getSelectedMethod(method) {
			this.$emit("getSelectedMethod", method);
		},
		exportChart(type, chartRef) {
			let chart = this.$refs[chartRef].chart;
			let max = chart.options.xAxis[0].max,
				yMin = chart.yAxis[0].min,
				yMax = chart.yAxis[0].max;
			let catLen = chart.options.series[0].data.length - 1;
			if (!this.drillDown) {
				chart.options.xAxis[0].max = null;
				chart.options.xAxis[0].min = 0;
				chart.xAxis[0].setExtremes(0, catLen);
			} else {
				chart.yAxis[0].setExtremes(yMin, yMax);
			}

			chartExport(type, chart);
			setTimeout(() => {
				if (!this.drillDown) {
					chart.options.xAxis[0].max = max;
					if (catLen > 11) {
						chart.xAxis[0].setExtremes(catLen - 11, catLen);
					}
				}
			}, 100);
		},
		dataSort(p_type, key) {
			this.$emit("dataSort", p_type, key);
		},
		showTable(val, key) {
			this.chartView = val;
		},
	},
};
</script>
<style scoped lang="scss">
.outlier_wrapper_scrollbar {
	max-height: 450px;
	overflow-y: auto;
	overflow-x: hidden;
}
.pillcontainer {
	border-bottom: 0;
}
</style>
