<template>
	<fullscreen v-model="cDataFull" ref="fullscreen" class="fullContainer">
		<div class="card position-relative fullContent">
			<loader class="cardLoader" v-if="showLoader" />
			<div class="card-header px-2 py-1 text-decoration-none">
				<div class="row no-gutters">
					<div
						class="col-lg-9 col-md-9 p-t-4px"
						:class="{ 'col-lg-12 col-md-12': cDataFull }"
					>
						<div class="cardTitleSection text-wrap fs-19-1920">
							<i
								class="fa fa-info-circle color-white cursor-pointer chart-info mr-2"
								aria-hidden="true"
								v-b-popover.hover.rightbottom="{
									variant: 'info',
									content: chartInfo,
									title: cData.source ? title + ': ' + cData.source : title,
									html: true,
								}"
							></i>
							<p class="title_p fs-19-1920 m-0">
								{{ title }} {{ cData.source ? `: ${cData.source}` : "" }}
							</p>
						</div>
					</div>
					<div class="col-lg-3 col-md-3 position-relative" v-if="!cDataFull">
						<ChartOptions
							:title="title"
							:sorting="sortMenu"
							@dataSort="dataSort"
							:defaultSort="defaultSort"
							@showTable="showTable"
							@exportChart="exportChart"
							:cID="cid"
							:mapView="mapView"
							:chartKey="chartRef"
							fullScreenKey="cData"
							:trendTable="cData.tableData"
							@toggleFullscreen="toggleFullscreen"
						/>
					</div>
				</div>
			</div>
			<div class="card-body pb-0">
				<div class="row mx-0">
					<template v-if="viewType === 'chart'">
						<div class="col">
							<div class="row" v-if="!cDataFull">
								<div class="col">
									<div v-if="btns">
										<b-button
											variant="secondary"
											v-for="(btn, ind) in btns"
											:key="ind"
											@click="btnClickHandle(btn.value)"
											:class="[
												btn.class,
												btn.value === activeBtn ? 'black-btn' : '',
											]"
										>
											{{ btn.text }}
										</b-button>
									</div>
								</div>
								<div class="align-items-center col d-flex justify-content-end">
									<div
										class="text-right"
										v-if="typeof excludeHigherRegion !== 'undefined'"
									>
										<b-form-checkbox
											switch
											size="sm"
											v-model="excludeHigherData"
											>{{ $t("exclude") }}
											{{ higherRegionName }}</b-form-checkbox
										>
									</div>
								</div>
							</div>
							<div ref="bubbleChart">
								<highcharts
									class="chartHeight"
									:options="cData"
									:ref="chartRef"
								></highcharts>
							</div>
						</div>
					</template>
					<template v-if="viewType === 'table'">
						<div class="col p-2">
							<b-table
								head-variant="light"
								sticky-header
								class="mb-0"
								v-if="cData.tableData"
								:bordered="true"
								hover
								:items="cData.tableData"
								:ref="chartRef"
							>
							</b-table>
							<div class="my-4 text-center" v-else>
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</template>
					<template v-if="viewType === 'map'">
						<div class="col p-2" ref="bubbleChart">
							<bubble-Map
								v-if="mapObj && mapObj.indiId"
								:defaultLevelID="defaultLevelID"
								:defaultLocationID="defaultLocationID"
								:subLevelID="subLevelID"
								:period="period"
								:periodLength="periodLength"
								:mapObj="mapObj"
								:resetCurrentLevel="resetCurrentLevel"
								:locationChanged="locationChanged"
								:toolbarLevelID="toolbarLevelID"
								:toolbarLocationID="toolbarLocationID"
								:facilityLevelID="facilityLevelID"
								ref="map"
								:mapData="cData"
								:title="title"
								:periodType="periodType"
							/>
						</div>
					</template>
				</div>
			</div>
			<div class="card-footer text-right">
				<p class="m-0">
					{{ $t("source") }}: <span>{{ source }}</span>
				</p>
			</div>
		</div>
	</fullscreen>
</template>
<script>
import Vue from "vue";
import service from "@/service";
import html2canvas from "html2canvas";
import sortLib from "./seriesSorting";
import { chartExport } from "@/components/Common/commonFunctions";
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
	props: [
		"title",
		"chartData",
		"source",
		"chartRef",
		"sortMenu",
		"btns",
		"chartInfo",
		"cid",
		"excludeHigherRegion",
		"higherRegionName",
		"originalData",
		"excludeSeries",
		"sortWithCat",
		"defaultLocationID",
		"locationName",
		"defaultLevelID",
		"subLevelID",
		"periodLength",
		"period",
		"mapObj",
		"resetCurrentLevel",
		"locationChanged",
		"toolbarLevelID",
		"toolbarLocationID",
		"facilityLevelID",
		"periodType",
		"activeButton",
	],
	mixins: [FullScreenMixin],
	components: {
		bubbleMap: () =>
			import(
				/* webpackChunkName: "analytical_bubbleAnchorMap"*/ "../anchorMap/bubbleAnchorMap.vue"
			),
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
	},
	created() {
		if (
			this.chartRef == "oMostCommonMethodMix" ||
			this.chartRef == "emuMethodMix"
		) {
			this.massageMapData();
		}
		// if(this.cid) {
		//   this.getComments(this.cid)
		// }
		this.defaultSort();
	},
	data() {
		return {
			mapView:
				this.chartRef == "oMostCommonMethodMix" ||
				this.chartRef == "emuMethodMix"
					? true
					: false,
			viewType:
				this.chartRef == "oMostCommonMethodMix" ||
				this.chartRef == "emuMethodMix"
					? "map"
					: "chart",
			showLoader: false,
			commentList: [],
			excludeHigherData: this.excludeHigherRegion,
			cData: Vue.util.extend({}, this.chartData),
			originalChartData: this.originalData,
			activeBtn: this.activeButton,
			cDataFull: false,
		};
	},
	watch: {
		excludeHigherData(newVal) {
			if (newVal) {
				let seriesData = [];
				if (this.excludeSeries) {
					seriesData = this.originalChartData.filter(
						(d) => !d.name.includes(this.higherRegionName)
					);
				} else {
					seriesData = this.originalChartData.map((oData) => {
						return {
							...oData,
							data: oData.data.filter((d) => d.name !== this.higherRegionName),
						};
					});
					if (seriesData.length == 1 && seriesData[0].data.length == 0) {
						seriesData = [];
					}
				}
				if (this.cData.xAxis && this.cData.xAxis.max) {
					let isData = seriesData.find((s) => s.data.length);
					this.cData.xAxis.max =
						isData.data.length > 11 ? 11 : isData.data.length - 1;
				}
				this.cData.series = seriesData;
				this.defaultSort();
			} else {
				if (this.cData.xAxis && this.cData.xAxis.max) {
					let isData = this.originalChartData.find((s) => s.data.length);
					this.cData.xAxis.max =
						isData.data.length > 11 ? 11 : isData.data.length - 1;
				}

				this.cData.series = this.originalChartData;
				this.defaultSort();
			}
		},
		originalData(newVal) {
			if (newVal) {
				this.originalChartData = newVal;
				this.defaultSort();
			}
		},
		// cData:{
		//   handler(newVal) {
		//   },
		//   deep: true
		// },
		chartData: {
			handler(newVal) {
				this.cData = newVal;
				this.showLoader = false;
			},
			deep: true,
		},
	},
	methods: {
		defaultSort() {
			if (
				this.chartRef === "oComparingEMURegConf" ||
				this.chartRef === "avgEMUMonthlyGrowth" ||
				this.chartRef === "oTotalCypyRegConf" ||
				this.chartRef === "oAvgMethodMixChartConf" ||
				this.chartRef === "comparingPPFPUptake" ||
				this.chartRef === "adolescentPregnancy" ||
				this.chartRef === "youthNoMethod"
			) {
				this.dataSort("numeric-desc", this.sortWithCat);
				let min = 0,
					max = 0;
				this.cData.series.forEach((d) => {
					let innerDataArr = d.data.map((dInner) => dInner.y).filter((d) => d);
					let innerMin = Math.min(...innerDataArr);
					let innerMax = Math.max(...innerDataArr);
					if (innerMin < min) {
						min = innerMin;
					}
					if (innerMax > max) {
						max = innerMax;
					}
				});
				this.cData.yAxis.min = min > 0 ? 0 : min;
				this.cData.yAxis.max = max;
			}
		},
		massageMapData() {},
		async getScreenShot() {
			let bubbleChart = null;
			await html2canvas(this.$refs.bubbleChart, {
				logging: true,
				letterRendering: true,
				allowTaint: true,
				useCORS: true,
				scale: (1920 * 2) / window.innerWidth,
				backgroundColor: null,
			})
				.then((canvas) => {
					bubbleChart = canvas.toDataURL();
				})
				.catch((error) => {
					bubbleChart = null;
					console.log("Erorr in bubble chart screenshot capture...", error);
				});
			return bubbleChart;
		},
		addComment(commentText, cid) {
			this.showLoader = true;
			service
				.addComments(cid, commentText)
				.then((response) => {
					if (response.data.status === "OK") {
						this.getComments(cid);
						// this.successAlert()
					} else {
						this.showLoader = false;
						this.errorAlert();
					}
				})
				.catch(() => {
					this.showLoader = false;
					this.errorAlert();
				});
		},
		successAlert() {
			this.$swal({
				title: this.$i18n.t("data_saved_successfully"),
			});
		},
		errorAlert() {
			this.$swal({
				title: this.$i18n.t("error"),
			});
		},
		getComments(cid) {
			this.showLoader = true;
			service
				.getComments(cid)
				.then((response) => {
					// this.cID = cid
					this.commentList = response.data.interpretations.length
						? response.data.interpretations
								.sort((a, b) => {
									let valueA = new Date(a.created).getTime();
									let valueB = new Date(b.created).getTime();
									return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
								})
								.map((d) => ({
									...d,
									created: this.$moment(d.created).format("lll"),
								}))
						: [];

					// if (stopLoader) {
					this.showLoader = false;
					// }
				})
				.catch(() => {
					this.commentList = [];
				});
		},
		btnClickHandle(value) {
			this.activeBtn = value;
			if (value === "percentage_delivering") {
				this.chartData.yAxis.labels.format = "{value} %";
				let aData = JSON.parse(JSON.stringify(this.chartData.numbersData)),
					aCatValue = aData[0].data;
				aData.forEach((ele, ind) => {
					let data = [];
					ele.data.forEach((val, index) => {
						data[index] = aCatValue[index]
							? {
									name: val.name,
									y: ((val.y / aCatValue[index].y) * 100).toFixed(2) * 1,
							  }
							: { name: val.name, y: 0 };
					});
					aData[ind].data = data;
				});
				this.chartData.series = [...aData];
			} else if (value === "percentage" || value === "aggregate") {
				if (value === "percentage") {
					this.chartData.yAxis.labels.format = "{value} %";
				}
				let aData = JSON.parse(JSON.stringify(this.chartData.numbersData)),
					aCatValue = [];

				aData.forEach((ele) => {
					ele.data.forEach((val, index) => {
						aCatValue[index] = (aCatValue[index] || 0) + val;
					});
				});
				aData.forEach((ele, ind) => {
					let data = [];
					ele.data.forEach((val, index) => {
						data[index] = aCatValue[index]
							? ((val / aCatValue[index]) * 100).toFixed(2) * 1
							: 0;
					});
					aData[ind].data = data;
				});
				this.chartData.series = [...aData];
			} else if (value === "number") {
				this.chartData.yAxis.labels.format = "{value}";
				this.chartData.series = [...this.chartData.numbersData];
			} else if (value === "actual") {
				this.chartData.series = [...this.chartData.numbersData];
			} else if (value === "stack_number") {
				this.chartData.plotOptions.column.stacking = "normal";
				this.chartData.tooltip.pointFormat =
					'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>';
			} else if (value === "stack_percentage") {
				this.chartData.plotOptions.column.stacking = "percent";
				this.chartData.tooltip.pointFormat =
					'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>';
			}
		},
		exportChart(type, chartRef) {
			let chart = this.$refs[chartRef].chart;
			chart.options.xAxis[0].max = null;
			chartExport(type, chart);
		},
		dataSort(p_type) {
			if (this.sortWithCat) {
				this.cData.series.map((d) => ({
					...d,
					data: d.data.sort((a, b) => {
						let valueA = 0,
							valueB = 0;

						if (p_type === "numeric-asc" || p_type === "numeric-desc") {
							valueA = a.y;
							valueB = b.y;
						}

						if (p_type === "date-asc" || p_type === "date-desc") {
							valueA = new Date(a.pe).getTime();
							valueB = new Date(b.pe).getTime();
						}

						if (p_type === "alpha-asc" || p_type === "alpha-desc") {
							valueA = a.name;
							valueB = b.name;
						}

						let comparison = 0;
						if (
							p_type == "numeric-asc" ||
							p_type === "alpha-asc" ||
							p_type === "date-asc"
						) {
							if (valueA > valueB) {
								comparison = 1;
							} else if (valueA < valueB) {
								comparison = -1;
							}
						} else if (
							p_type == "numeric-desc" ||
							p_type === "alpha-desc" ||
							p_type === "date-desc"
						) {
							if (valueA > valueB) {
								comparison = -1;
							} else if (valueA < valueB) {
								comparison = 1;
							}
						}
						return comparison;
					}),
				}));
			} else {
				sortLib.sortSeries(p_type, this.chartData);
			}
		},
		showTable(val, key) {
			this.viewType = val;
		},
		changeViewType(p_active) {
			this.viewType = p_active;
		},
	},
};
</script>
<style scoped>
.nav-tabs .nav-link {
	padding: 0 !important;
}
</style>
