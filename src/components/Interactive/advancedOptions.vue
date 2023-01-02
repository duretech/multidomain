<template>
	<div class="col-6 text-right">
		<!-- <b-button size="sm" v-b-modal="'options-modal'">Options</b-button> -->
		<!-- <i class="fa fa-edit options_model" :title="$t('quickEdit')" v-b-tooltip v-b-modal="options-modal"></i> -->
		<img
			alt="img"
			:src="require('@/assets/img/icons/edit_new.png')"
			class="img imgWidth_20px options_model cursor-pointer"
			:title="$t('quickEdit')"
			v-b-tooltip
			@click="quickEditModal = true"
		/>
		<img
			alt="img"
			:src="require('@/assets/img/icons/edit_new_active_white.png')"
			class="img imgWidth_20px d-none"
			:title="$t('quickEdit')"
			v-b-tooltip
			@click="quickEditModal = true"
		/>
		<b-modal
			scrollable
			v-model="quickEditModal"
			@ok="update"
			:title="$t('chartSettings')"
			no-close-on-backdrop
		>
			<div class="row">
				<div class="col-12 drilldownTabs">
					<b-tabs small content-class="mt-3">
						<b-tab :title="$t('chart')" active>
							<h6>{{ $t("chart") }}</h6>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('chart_title')"
								label-for="input-title"
							>
								<b-form-input
									type="text"
									id="input-title"
									size="sm"
									v-model="title"
								></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('chart_subtitle')"
								label-for="input-subTitle"
							>
								<b-form-input
									type="text"
									id="input-subTitle"
									size="sm"
									v-model="subTitle"
								></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('x-axis')"
								label-for="input-xAxis"
							>
								<b-form-input
									type="text"
									id="input-xAxis"
									size="sm"
									v-model="xAxisTitle"
								></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('y-axis')"
								label-for="input-yAxis"
							>
								<b-form-input
									type="text"
									id="input-yAxis"
									size="sm"
									v-model="yAxisTitle"
								></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('source')"
								label-for="input-source"
							>
								<b-form-input
									type="text"
									id="input-source"
									size="sm"
									v-model="chartSource"
								></b-form-input>
							</b-form-group>
							<h6>{{ $t("data") }}</h6>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('showValues')"
								label-for="checkbox-dataLabels"
							>
								<b-form-checkbox
									id="checkbox-dataLabels"
									v-model="dataLabels"
									name="checkbox-dataLabels"
								>
								</b-form-checkbox>
							</b-form-group>
							<h6>{{ $t("legend") }}</h6>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('showLegends')"
								label-for="checkbox-legends"
							>
								<b-form-checkbox
									id="checkbox-legends"
									v-model="legends"
									name="checkbox-legends"
								>
								</b-form-checkbox>
							</b-form-group>
							<h6>{{ $t("tooltip") }}</h6>
							<b-form-group
								label-cols="4"
								label-cols-lg="4"
								label-size="sm"
								:label="$t('sharedTooltip')"
								label-for="checkbox-sharedTooltip"
							>
								<b-form-checkbox
									id="checkbox-sharedTooltip"
									v-model="sharedTooltip"
									name="checkbox-sharedTooltip"
								>
								</b-form-checkbox>
							</b-form-group>
						</b-tab>
						<b-tab :title="$t('benchmarking')">
							<h6>{{ $t("benchmarking") }}</h6>
							<div
								v-for="(plotline, i) in plotLines"
								:key="'benchmark' + i"
								class="border-bottom mb-3"
							>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="$t('line_type')"
									:label-for="'input-benchmarkLineStyle' + i"
								>
									<b-form-select
										v-model="plotline.dashStyle"
										:options="benchmarkLineStyleOptions"
										size="sm"
									></b-form-select>
								</b-form-group>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="$t('lineValueType')"
								>
									<b-form-select
										v-model="plotline.valueType"
										:options="benchmarkLineValueType"
										size="sm"
									></b-form-select>
								</b-form-group>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="`Line Value ${
										plotline.valueType === 'percentage' ? '(%)' : '(Numeric)'
									}`"
									:label-for="'input-benchmarkValue' + i"
								>
									<b-form-input
										type="number"
										:id="'input-benchmarkValue' + i"
										size="sm"
										v-model="plotline.percValue"
									></b-form-input>
								</b-form-group>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="$t('line_color')"
									:label-for="'input-benchmarkColor' + i"
								>
									<b-form-input
										type="color"
										:id="'input-benchmarkColor' + i"
										size="sm"
										v-model="plotline.color"
									></b-form-input>
								</b-form-group>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="$t('line_width')"
									:label-for="'input-benchmarkWidth' + i"
								>
									<b-form-input
										type="number"
										:id="'input-benchmarkWidth' + i"
										size="sm"
										v-model="plotline.width"
									></b-form-input>
								</b-form-group>
								<b-form-group
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="$t('line_label')"
									:label-for="'input-benchmarkWidth' + i"
								>
									<b-form-checkbox
										checked="benchmarkLabelTextEnable"
										v-model="plotline.label.enabled"
										name="benchmarkLabelTextEnable"
										switch
										size="sm"
										class="mt-1"
									/>
								</b-form-group>
								<div
									v-if="plotline.label.enabled"
									class="px-2 pt-3 mb-3 border"
								>
									<b-form-group
										label-cols="4"
										label-cols-lg="4"
										label-size="sm"
										:label="$t('label_text')"
										:label-for="'input-benchmarkLabelText' + i"
									>
										<b-form-input
											type="text"
											:id="'input-benchmarkLabelText' + i"
											size="sm"
											v-model="plotline.label.textVisible"
										></b-form-input>
									</b-form-group>
									<b-form-group
										label-cols="4"
										label-cols-lg="4"
										label-size="sm"
										:label="$t('label_position')"
										:label-for="'input-benchmarkLabelAlign' + i"
									>
										<b-form-select
											v-model="plotline.label.align"
											:options="benchmarkLabelAlignOptions"
											size="sm"
										></b-form-select>
									</b-form-group>
									<b-form-group
										label-cols="4"
										label-cols-lg="4"
										label-size="sm"
										:label="$t('label_color')"
										:label-for="'input-benchmarkLabelColor' + i"
									>
										<b-form-input
											type="color"
											:id="'input-benchmarkLabelColor' + i"
											size="sm"
											v-model="plotline.label.style.color"
										></b-form-input>
									</b-form-group>
								</div>
								<div class="text-right">
									<b-button
										class="my-3"
										@click="resetBenchmark(i)"
										size="sm"
										pill
										variant="outline-danger"
										><i class="mr-2 fa fa-refresh"></i
										>{{ $t("resetbtn") }}</b-button
									>
									<template v-if="i !== 0">
										<b-button
											class="my-3"
											@click="deleteBenchmark(i)"
											size="sm"
											pill
											variant="outline-danger"
											><i class="mr-2 fa fa-trash"></i
											>{{ $t("deletebtn") }}</b-button
										>
									</template>
								</div>
							</div>
							<div class="text-right">
								<b-button
									class="mb-3"
									@click="addBenchmark"
									size="sm"
									pill
									variant="outline-success"
									><i class="mr-2 fa fa-plus"></i>{{ $t("addbtn") }}</b-button
								>
							</div>
						</b-tab>
						<b-tab :title="$t('colors')">
							<h6>{{ $t("colors") }}</h6>
							<template v-for="(s, i) in seriesData">
								<b-form-group
									:key="i"
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="s.name"
									:label-for="'input-color' + i"
									style="word-break: break-all"
									v-if="s.showInEdit"
								>
									<div class="row mx-0">
										<b-form-input
											:id="'input-color' + i"
											size="sm"
											v-model="s.color"
											type="color"
											class="col-8"
										></b-form-input>
										<b-form-input
											:id="'input-color' + i"
											size="sm"
											v-model="s.color"
											type="text"
											class="col-4"
										></b-form-input>
									</div>
								</b-form-group>
							</template>
						</b-tab>
						<b-tab :title="$t('legends')">
							<h6>{{ $t("legends") }}</h6>
							<template v-for="(s, i) in seriesData">
								<b-form-group
									:key="'legend' + i"
									label-cols="4"
									label-cols-lg="4"
									label-size="sm"
									:label="s.static_name"
									:label-for="'input-legend' + i"
									style="word-break: break-all"
									v-if="s.showInEdit"
								>
									<b-form-input
										:id="'input-legend' + i"
										size="sm"
										v-model="s.name"
										type="text"
									></b-form-input>
								</b-form-group>
							</template>
						</b-tab>
						<b-tab :title="$t('drilldown')" v-if="canAddDrilldown">
							<h6>{{ $t("drilldown") }}</h6>
							<div
								class="mb-3"
								v-for="(s, i) in drilldownSeriesData"
								:key="'drilldownLegend' + i"
							>
								<div class="row mb-3">
									<div class="col-8">
										{{ s.name }}
									</div>
									<div
										class="text-right col-4"
										v-if="typeof s.drilldownDetails === 'undefined'"
									>
										<b-button
											class="mb-3"
											@click="addDrilldown(s.name)"
											size="sm"
											pill
											variant="outline-success"
											><i class="mr-2 fa fa-plus"></i
											>{{ $t("addbtn") }}</b-button
										>
									</div>
								</div>
								<div class="border p-2" v-if="'drilldownDetails' in s">
									<!-- v-if="typeof s.drilldownDetails !== 'undefined'" -->
									<h6>{{ $t("drilldownIndicators") }}</h6>
									<div
										class="mb-2"
										v-for="(data, i) in s.drilldownDetails.selectedData"
										:key="i"
									>
										{{ data.name }}
									</div>
									<div class="text-right mt-3">
										<b-button
											@click="editDrilldown(s.drilldownDetails, s.name)"
											size="sm"
											pill
											variant="outline-success"
											><i class="mr-2 fa fa-edit"></i>{{ $t("edit") }}</b-button
										>
										<b-button
											@click="deleteDrilldown(s.name)"
											size="sm"
											pill
											variant="outline-danger"
											><i class="mr-2 fa fa-trash"></i
											>{{ $t("deletebtn") }}</b-button
										>
									</div>
								</div>
							</div>
						</b-tab>
					</b-tabs>
				</div>
			</div>
			<template v-slot:modal-footer="{ ok, cancel }">
				<b-button size="sm" variant="primary" @click="cancel()" class="drill-newbtn">
					{{ $t("cancelbtn") }}
				</b-button>
				<b-button size="sm" variant="primary" @click="ok()" class="drill-newbtn1">
					{{ $t("update") }}
				</b-button>
			</template>
		</b-modal>
		<b-modal
			scrollable
			body-class="h-450px interactive_analytics"
			v-model="drilldownModal"
			@ok="addDrilldownData"
			@cancel="resetDrilldownData"
			title="Add drilldown"
			class="position-relative"
			no-close-on-backdrop
		>
			<loader v-if="showLoader" class="cardLoader" />
			<b-tabs small content-class="mt-3">
				<b-tab :title="$t('data')" active>
					<DataComponent
						:key="dataMappingKey"
						:reusableKey="'key2'"
						:isDrillDown="true"
						:editDrillDownData="editDrillDownData"
						@getDataSource="getDataSource"
						@getDataSourceGroup="getDataSourceGroup"
						@getSelectedData="getSelectedData"
					/>
				</b-tab>
			</b-tabs>
			<template v-slot:modal-footer="{ ok, cancel }">
				<b-button size="sm" variant="primary" @click="cancel()" class="cancel-newbtn">
					{{ $t("cancelbtn") }}
				</b-button>
				<b-button size="sm" variant="primary" @click="ok()">
					{{ $t("addbtn") }}
				</b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import service from "@/service";
export default {
	props: [
		"chartOptions",
		"autoUpdate",
		"selectedDrilldownData",
		"orgOptions",
		"defaultOrg",
		"canAddDrilldown",
		"source",
	],
	components: {
		DataComponent: () =>
			import(
				/*webpackChunkName: 'interactive-DataComponent'*/ "./DataComponent"
			),
	},
	data() {
		console.log("chartOptions", this.chartOptions);
		// console.log("drilldownSeriesData",this.selectedDrilldownData)
		// console.log("orgOptions",this.orgOptions)
		return {
			dataMappingKey: "drilldownMapping",
			// dataLabels: this.chartOptions.plotOptions[this.chartOptions.chart.type].dataLabels.enabled,
			dataLabels: this.chartOptions.plotOptions.series.dataLabels.enabled,
			xAxisTitle: this.chartOptions.xAxis.title.text,
			yAxisTitle: this.chartOptions.yAxis.title.text,
			legends: this.chartOptions.legend.enabled,
			title: this.chartOptions.title.text,
			subTitle: this.chartOptions.subtitle.text,
			chartSource: this.source,
			sharedTooltip: this.chartOptions.tooltip
				? this.chartOptions.tooltip.shared
				: "NA",
			seriesData: JSON.parse(JSON.stringify(this.chartOptions.series)),
			drilldownSeriesData: this.selectedDrilldownData,
			plotLines: JSON.parse(JSON.stringify(this.chartOptions.yAxis.plotLines)),
			benchmarkLineValueType: [
				{ value: "percentage", text: "Percentage (%)" },
				{ value: "numeric", text: "Numeric" },
			],
			benchmarkLabelAlignOptions: [
				{ value: "left", text: "Left" },
				{ value: "center", text: "Center" },
				{ value: "right", text: "Right" },
			],
			benchmarkLineStyleOptions: [
				{ value: "solid", text: "Solid" },
				{ value: "shortdash", text: "Short Dash" },
				{ value: "shortdot", text: "Short Dot" },
				{ value: "shortdashdot", text: "Short Dash Dot" },
				{ value: "shortdashdotdot", text: "Short Dash Dot Dot" },
				{ value: "dot", text: "Dot" },
				{ value: "dash", text: "Dash" },
				{ value: "longdash", text: "Long Dash" },
				{ value: "dashdot", text: "Dash Dot" },
				{ value: "longdashdot", text: "Long Dash Dot" },
				{ value: "longdashdotdot", text: "Long Dash Dot Dot" },
			],
			quickEditModal: false,
			drilldownModal: false,
			//drilldown Settings
			chartType: "column",
			dataSource: "",
			dataSourceGroup: "",
			dataSourceGroupList: [],
			dataListToggle: false,
			selectedData: [],
			periodType: "Monthly",
			periodToggle: false,
			periodList: [],
			selectedPeriod: [],
			treeselect: {
				multiple: true,
				clearable: true,
				searchable: true,
				disabled: false,
				openOnClick: true,
				openOnFocus: false,
				clearOnSelect: true,
				closeOnSelect: true,
				alwaysOpen: true,
				appendToBody: false,
				value: this.defaultOrg,
			},
			showLoader: false,
			originalDataSets: [],
			currentYear: new Date().getFullYear(),
			selectedLegend: "",
			seriesLayout: [{ id: "dx", text: "Data" }],
			categoryLayout: [{ id: "pe", text: "Period" }],
			filterLayout: [{ id: "ou", text: "Organisation Unit" }],
			dragDropDetails: "",
			editDrillDownData: null,
		};
	},
	watch: {
		periodList(newValue) {
			// console.log(newValue)
			if (this.periodType !== "Monthly" && !this.periodSorted) {
				this.periodList = newValue.sort((a, b) => {
					let valueA = a.id,
						valueB = b.id;

					let comparison = 0;
					if (valueA > valueB) {
						comparison = -1;
					} else if (valueA < valueB) {
						comparison = 1;
					}
					return comparison;
				});

				this.periodSorted = true;
			} else {
				this.periodSorted = false;
			}
		},
		drilldownModal(newVal) {
			if (!newVal) {
				this.resetDrilldownData();
			}
		},
	},
	methods: {
		getDataSource(value) {
			this.dataSource = value;
		},
		getDataSourceGroup(value) {
			this.dataSourceGroup = value;
		},
		getSelectedData(value) {
			this.selectedData = value;
		},
		drag(id, layout) {
			// console.log("drag id",id)
			this.dragDropDetails = `${id}_${layout}`;
			// event.dataTransfer.setData("transferData", );
		},
		drop(layout) {
			// console.log("drop id",event.target.id)
			// let data = event.dataTransfer.getData("transferData");
			let data = this.dragDropDetails;
			// console.log(data)
			let transferID = data.split("_")[0],
				sourceLayout = data.split("_")[1];
			if (layout === "seriesLayout" || layout === "categoryLayout") {
				let targetData = this[layout].length > 0 && this[layout][0];
				if (targetData) {
					this[layout] = [];
					this[sourceLayout].push(targetData);
				}
			}
			let dragData = this[sourceLayout].filter((s) => s.id === transferID)[0];
			this[sourceLayout] = this[sourceLayout].filter(
				(s) => s.id !== transferID
			);
			this[layout].push(dragData);

			this.$nextTick(() => (this.dragDropDetails = ""));
			// event.target.appendChild(document.getElementById(data));
		},
		editDrilldown(drilldown, name) {
			this.editDrillDownData = drilldown;
			this.selectedLegend = name;
			this.chartType = drilldown.chartType;
			this.dataSource = drilldown.dataSource;
			this.dataSourceGroup = drilldown.dataSourceGroup;
			this.selectedData = drilldown.selectedData;
			this.changePeriod();
			this.selectedPeriod = drilldown.selectedPeriod;
			let d = this.selectedPeriod.map((d) => d.id);
			this.periodList = this.periodList.filter((dl) => !d.includes(dl.id));
			this.periodType = drilldown.periodType;
			this.treeselect.value = drilldown.selectedOrg;
			this.seriesLayout = drilldown.seriesLayout;
			this.categoryLayout = drilldown.categoryLayout;
			this.filterLayout = drilldown.filterLayout;
			this.$nextTick(() => (this.drilldownModal = true));
		},
		deleteDrilldown(name) {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					// console.log(this.drilldownSeriesData)
					this.drilldownSeriesData = this.drilldownSeriesData.map((d) => {
						// console.log(d.name)
						// console.log(name)
						if (d.name === name) {
							// console.log("if ", d)
							return { id: d.id, name: d.name };
						} else {
							return d;
						}
					});
					// console.log(this.drilldownSeriesData)
				}
			});
		},
		addDrilldown(legendName) {
			// console.log("legendName",legendName)
			this.selectedLegend = legendName;
			this.editDrillDownData = null;
			this.$nextTick(() => (this.drilldownModal = true));
		},
		addDrilldownData(bvModalEvt) {
			bvModalEvt.preventDefault();
			// console.log("add")
			// console.log("legendName",this.selectedLegend)
			// console.log("chartType",this.chartType)
			// console.log("dataSource",this.dataSource)
			// console.log("dataSourceGroup",this.dataSourceGroup)
			// console.log("selectedData",this.selectedData)
			// console.log("selectedPeriod",this.selectedPeriod)
			// console.log("periodType",this.periodType)
			// console.log("org",this.treeselect.value)
			if (this.seriesLayout.length === 0) {
				this.$swal({
					title: this.$i18n.t("error"),
					text: this.$i18n.t("seriesError"),
				});
			} else {
				if (this.categoryLayout.length === 0) {
					this.$swal({
						title: this.$i18n.t("error"),
						text: this.$i18n.t("categoryError"),
					});
				} else {
					this.drilldownSeriesData = this.drilldownSeriesData.map((s) => {
						if (s.name === this.selectedLegend) {
							return {
								...s,
								drilldownDetails: {
									chartType: this.chartType,
									dataSource: this.dataSource,
									dataSourceGroup: this.dataSourceGroup,
									selectedData: this.selectedData,
									selectedPeriod: this.selectedPeriod,
									periodType: this.periodType,
									selectedOrg: this.treeselect.value,
									seriesLayout: this.seriesLayout,
									categoryLayout: this.categoryLayout,
									filterLayout: this.filterLayout,
								},
							};
						} else {
							return s;
						}
					});
					// console.log("this.drilldownSeriesData",this.drilldownSeriesData)
					this.$nextTick(() => (this.drilldownModal = false));
				}
			}
		},
		resetDrilldownData() {
			// console.log("reset")
			this.chartType = "column";
			this.dataSource = "";
			this.dataSourceGroup = "";
			this.dataSourceGroupList = [];
			this.dataListToggle = false;
			this.selectedData = [];
			this.selectedPeriod = [];
			this.periodType = "Monthly";
			this.treeselect.value = this.defaultOrg;
			this.changePeriod(true);
			this.seriesLayout = [{ id: "dx", text: "Data" }];
			this.categoryLayout = [{ id: "pe", text: "Period" }];
			this.filterLayout = [{ id: "ou", text: "Organisation Unit" }];
		},
		changeType(type) {
			this.chartType = type;
		},
		moveRight(type) {
			if (type === "data") {
				this.dataList.map((item, i) => {
					this.selectedData.push(item);
				});
				this.dataList.splice(0, this.dataList.length);
			}

			if (type === "period") {
				this.periodList.map((item, i) => {
					this.selectedPeriod.push(item);
				});
				this.periodList.splice(0, this.periodList.length);
			}

			if (type === "facility") {
				this.facilityList.map((item, i) => {
					this.selectedFacility.push(item);
				});
				this.facilityList.splice(0, this.facilityList.length);
			}
		},
		moveLeft(type) {
			if (type === "data") {
				this.selectedData.map((item) => {
					this.dataList.push(item);
				});
				this.selectedData.splice(0, this.selectedData.length);
			}

			if (type === "period") {
				this.selectedPeriod.map((item) => {
					this.periodList.push(item);
				});
				this.selectedPeriod.splice(0, this.selectedPeriod.length);
			}

			if (type === "facility") {
				this.selectedFacility.map((item) => {
					this.facilityList.push(item);
				});
				this.selectedFacility.splice(0, this.selectedFacility.length);
			}
		},
		addBenchmark() {
			let benchmark = {
				value: undefined,
				percValue: undefined,
				valueType: "percentage",
				color: "#ff0000",
				width: 1,
				zIndex: 5,
				dashStyle: "solid",
				label: {
					enabled: false,
					text: "",
					textVisible: "",
					align: "center",
					style: {
						color: "#000000",
					},
				},
			};
			this.plotLines.push(benchmark);
		},
		deleteBenchmark(index) {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					this.plotLines = this.plotLines.filter((p, i) => i !== index);
				}
			});
		},
		resetBenchmark(index) {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					this.plotLines = this.plotLines.map((p, i) => {
						if (i === index) {
							return {
								value: undefined,
								percValue: undefined,
								valueType: "percentage",
								color: "#ff0000",
								width: 1,
								zIndex: 5,
								dashStyle: "solid",
								label: {
									enabled: false,
									text: "",
									textVisible: "",
									align: "center",
									style: {
										color: "#000000",
									},
								},
							};
						} else {
							return p;
						}
					});
				}
			});
		},
		update() {
			// console.log("update")
			// console.log("this.seriesData",this.seriesData)
			// console.log("this.drilldownSeriesData",this.drilldownSeriesData)
			let isDrilldownAdded = false;
			let series = this.seriesData.map((s) => {
				let isFound = this.drilldownSeriesData.find(
					(d) =>
						d.name === s.static_name &&
						typeof d.drilldownDetails !== "undefined"
				);
				// console.log(isFound)
				if (isFound) {
					isDrilldownAdded = true;
					return {
						...s,
						data: s.data.map((d) => ({
							...d,
							drilldown: `${s.name}_${d.ou}_${d.pe}`,
						})),
					};
				} else {
					return {
						...s,
						data: s.data.map((d) => ({ ...d, drilldown: false })),
					};
				}
			});
			// console.log("series",series)
			// return
			let updated = {
				dataLabels: this.dataLabels,
				xAxisTitle: this.xAxisTitle,
				yAxisTitle: this.yAxisTitle,
				legends: this.legends,
				title: this.title,
				subTitle: this.subTitle,
				source: this.chartSource,
				sharedTooltip: this.sharedTooltip,
				seriesData: series,
				plotline: this.plotLines,
				drilldownData: this.drilldownSeriesData,
				isDrilldownAdded: isDrilldownAdded,
			};
			this.$emit("updateOptions", updated);
		},
		changeYear(num) {
			this.currentYear = this.currentYear + num;
			this.periodToggle = false;
			this.showLoader = true;
			this.changePeriod();
			setTimeout(() => {
				this.showLoader = false;
				this.periodToggle = true;
			}, 1000);
		},
		changePeriod(firstTime = false) {
			// console.log(this.periodType)
			this.periodToggle = false;
			this.showLoader = true;
			this.periodList = [];

			if (this.periodType === "Yearly") {
				let thisYear = new Date().getFullYear();
				let startYear = 1950;

				for (let i = thisYear; i >= startYear; i--) {
					this.periodList.push({ id: `${i}`, name: `${i}` });
				}
			} else {
				let years = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				if (this.$i18n.locale === "fr") {
					years = [
						"janv.",
						"févr.",
						"mars",
						"avril",
						"mai",
						"juin",
						"juil.",
						"août",
						"sept.",
						"oct.",
						"nov.",
						"déc.",
					];
				}
				for (let i = 1; i <= 12; i++) {
					if (i < 10) {
						let j = "0" + i;
						this.periodList.push({
							id: `${this.currentYear}${j}`,
							name: years[i - 1] + " " + this.currentYear,
						});
					} else {
						this.periodList.push({
							id: `${this.currentYear}${i}`,
							name: years[i - 1] + " " + this.currentYear,
						});
					}
				}
				// console.log(this.periodList)
				if (firstTime) {
					this.selectedPeriod.push(this.periodList[0]);
				}
			}
			setTimeout(() => {
				this.showLoader = false;
				this.periodToggle = true;
			}, 1000);
		},
	},
	created() {
		if (this.$i18n.locale === "fr") {
			this.benchmarkLineValueType = [
				{
					value: "percentage",
					text: this.$i18n.t("percentage") + " (%)",
				},
				{ value: "numeric", text: this.$i18n.t("numeric") },
			];
			this.benchmarkLabelAlignOptions = [
				{ value: "left", text: this.$i18n.t("left") },
				{ value: "center", text: this.$i18n.t("center") },
				{ value: "right", text: this.$i18n.t("right") },
			];
			this.benchmarkLineStyleOptions = [
				{ value: "solid", text: this.$i18n.t("solid") },
				{ value: "shortdash", text: this.$i18n.t("shortdash") },
				{ value: "shortdot", text: this.$i18n.t("shortdot") },
				{
					value: "shortdashdot",
					text: this.$i18n.t("shortdashdot"),
				},
				{
					value: "shortdashdotdot",
					text: this.$i18n.t("shortdashdotdot"),
				},
				{ value: "dot", text: this.$i18n.t("dot") },
				{ value: "dash", text: this.$i18n.t("dash") },
				{ value: "longdash", text: this.$i18n.t("longdash") },
				{ value: "dashdot", text: this.$i18n.t("dashdot") },
				{
					value: "longdashdot",
					text: this.$i18n.t("longdashdot"),
				},
				{
					value: "longdashdotdot",
					text: this.$i18n.t("longdashdotdot"),
				},
			];
		}
		if (this.autoUpdate) {
			this.update();
		}
		this.changePeriod(true);
	},
};
</script>
<style scoped lang="scss">
.options_model {
	font-size: 1.5625rem;
	margin-right: 0.25rem !important;
	&:focus {
		outline: none;
	}
}
</style>
