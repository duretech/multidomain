<template>
	<div class="row no-gutters">
		<div
			class="col-12 text-right d-flex align-items-center justify-content-end"
		>
			<div class="ml-2" v-if="reportingForm && formOptions.length > 0">
				<b-form-select
					class="typeDropdown"
					v-model="reportingForm"
					:options="formOptions"
				></b-form-select>
			</div>
			<div class="ml-2" v-if="periodOptions">
				<b-form-select
					class="typeDropdown"
					v-model="periodLength"
					:options="periodOptions"
				>
				</b-form-select>
			</div>
			<div class="ml-2" v-if="tType != 'table' && plotOptions">
				<b-form-select
					class="typeDropdown"
					v-model="chartPlotType"
					:options="plotOptions"
				>
				</b-form-select>
			</div>
			<div class="ml-2" v-if="tType !== 'table' && !drilldown">
				<a
					v-b-tooltip.hover
					:title="$t('preview')"
					@click.stop.prevent="fullScreen"
				>
					<img
						alt="img"
						:src="
							require(`@/assets/img/icons/preview_new${
								activeIcon == 'preview' ? '_active' : ''
							}.png`)
						"
						class="img cursor-pointer imgWidth_20px"
					/>
				</a>
			</div>
			<div v-if="cid" class="dropdown ml-2 commentSection">
				<b-dropdown
					id="dropdown-form"
					ref="dropdown"
					@hide="hideClass"
					@show="getComments()"
					right
					toggle-class="bg-transparent border-0 dropdown-toggle p-0"
					no-caret
					menu-class="chart-dd-menu"
				>
					<template v-slot:button-content>
						<img
							alt="img"
							:src="
								require(`../../assets/img/icons/comment_new${
									activeIcon == 'comment' ? '_active' : ''
								}.png`)
							"
							class="img cursor-pointer imgWidth_20px"
							v-b-tooltip.hover
							:title="$t('commentsIcon')"
						/>
					</template>
					<div class="commentDropDownBox h-300px overflow-auto">
						<b-dropdown-form
							class="border-bottom-black dropdownComments"
							v-if="
								$store.getters.getIsAdmin ||
								$store.getters.getUserPermissions.canComment
							"
						>
							<b-form-group @submit.stop.prevent>
								<b-form-textarea
									v-model="commentText"
									:state="
										commentText.length !== 0 &&
										commentText.length <= commentTextMaxLength
									"
									:placeholder="commentPlaceholder"
									rows="3"
								></b-form-textarea>
								<span>{{ commentText.length }}/{{ commentTextMaxLength }}</span>
							</b-form-group>

							<div class="col-sm-12 m-t-30px text-center">
								<b-button
									class="black-btn"
									@click.stop.prevent="addComment"
									:disabled="
										commentText.length === 0 ||
										commentText.length > commentTextMaxLength
									"
									>{{ $t("submitbtn") }}</b-button
								>
								<b-button
									:disabled="!commentText"
									@click.stop.prevent="cancelComment"
									variant="danger"
									>{{ $t("cancelbtn") }}</b-button
								>
							</div>
						</b-dropdown-form>
						<div class="col-lg-12 px-0 mt-3">
							<template v-if="commentList.length > 0">
								<div
									class="media"
									:class="{ 'm-t-10px': index !== 0 }"
									v-for="(comment, index) in commentList"
									:key="comment.id"
								>
									<div
										class="row border-bottom-black mx-0 w-100"
										style="padding-bottom: 10px"
									>
										<div class="col-md-2">
											<i
												class="fa fa-user fa-2x img-thumbnail"
												aria-hidden="true"
											></i>
										</div>
										<div class="col-md-10">
											<div class="media-body">
												<h6 class="mt-0">{{ comment.user.displayName }}</h6>
												<h6 class="font-weight-normal f-s-0-875rem w-100">
													{{ comment.text }}
												</h6>
												<div class="row">
													<div class="col commentsactionlinkcontainer hide">
														<a href="#" :title="$t('like')" v-b-tooltip>
															<i class="fa fa-thumbs-up"></i>
														</a>
														<a href="#" :title="$t('reply')" v-b-tooltip>
															<i class="fa fa-reply"></i>
														</a>
														<a
															href="#"
															:title="$t('edit')"
															v-b-tooltip
															v-if="
																$store.state.loggedInUserId === comment.user.id
															"
														>
															<i class="fa fa-pencil"></i>
														</a>
														<a
															href="#"
															:title="$t('deletebtn')"
															v-b-tooltip
															v-if="
																$store.state.loggedInUserId === comment.user.id
															"
														>
															<i class="fa fa-trash"></i>
														</a>
													</div>
													<div class="col text-right">
														<p class="f-w-500 commentsdate mb-0">
															<i class="fa fa-calendar"></i>
															{{ comment.created }}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="text-center no-data-error-msg">
									{{ $t("no_data_to_display") }}
								</div>
							</template>
						</div>
					</div>
				</b-dropdown>
			</div>
			<div
				v-if="tType !== 'table' && sorting && !drilldown"
				class="dropdown ml-2"
			>
				<b-dropdown
					right
					toggle-class="bg-transparent border-0 dropdown-toggle p-0"
					no-caret
					menu-class="chart-dd-menu"
					@hide="hideClass"
					@show="getActive('sort')"
				>
					<template v-slot:button-content>
						<img
							alt="img"
							:src="
								require(`../../assets/img/icons/sort_new${
									activeIcon == 'sort' ? '_active' : ''
								}.png`)
							"
							class="img imgWidth_20px"
							v-b-tooltip.hover
							:title="$t('sorting')"
						/>
					</template>
					<b-dropdown-group class="chart-dd-options">
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('0-1') && sortType != '0-1'"
							@click.prevent="dataSort('0-1')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px"><i class="fa fa-sort-numeric-asc"></i></p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('1-0') && sortType != '1-0'"
							@click.prevent="dataSort('1-0')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px"><i class="fa fa-sort-numeric-desc"></i></p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('JAN-DEC') && sortType != 'JAN-DEC'"
							@click.prevent="dataSort('JAN-DEC')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px">
											<i class="fa fa-custom-sort-date-asc fa-fw"></i>
										</p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('DEC-JAN') && sortType != 'DEC-JAN'"
							@click.prevent="dataSort('DEC-JAN')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px">
											<i class="fa fa-custom-sort-date-desc fa-fw"></i>
										</p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('A-Z') && sortType != 'A-Z'"
							@click.prevent="dataSort('A-Z')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px"><i class="fa fa-sort-alpha-asc"></i></p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
						<b-dropdown-item
							class="list-group-item bg-transparent px-0"
							v-if="sorting.includes('Z-A') && sortType != 'Z-A'"
							@click.prevent="dataSort('Z-A')"
						>
							<a href="#" class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<p class="m-0px">{{ $t("sortBy") }}</p>
									</div>
									<div class="col-lg-2">
										<p class="m-0px"><i class="fa fa-sort-alpha-desc"></i></p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
					</b-dropdown-group>
				</b-dropdown>
			</div>
			<div class="ml-2" v-if="!drilldown">
				<a
					@click="changeViewType('chart', chartKeyValue)"
					:title="$t('chartViewIcon')"
					v-b-tooltip
				>
					<img
						alt="img"
						:src="
							require(`../../assets/img/icons/chart_new${
								tType == 'chart' ? '_active' : ''
							}.png`)
						"
						class="img cursor-pointer imgWidth_20px"
					/>
				</a>
			</div>
			<div class="ml-2" v-if="!drilldown">
				<a
					@click="changeViewType('table', chartKeyValue)"
					:title="$t('tableViewIcon')"
					v-b-tooltip
				>
					<img
						alt="img"
						:src="
							require(`../../assets/img/icons/table_new${
								tType == 'table' ? '_active' : ''
							}.png`)
						"
						class="img cursor-pointer imgWidth_20px"
					/>
				</a>
			</div>
			<div class="dropdown ml-2" v-if="!download">
				<b-dropdown
					right
					toggle-class="bg-transparent border-0 dropdown-toggle p-0"
					no-caret
					menu-class="chart-dd-menu"
					@hide="hideClass"
					@show="getActive('download')"
				>
					<template v-slot:button-content>
						<img
							alt="img"
							:src="
								require(`../../assets/img/icons/download_new${
									activeIcon === 'download' ? '_active' : ''
								}.png`)
							"
							class="img imgWidth_15px"
							v-b-tooltip.hover
							:title="$t('downloadIcon')"
						/>
					</template>
					<b-dropdown-group class="chart-dd-options" v-if="tType == 'table'">
						<b-dropdown-item class="list-group-item bg-transparent px-0">
							<a class="color-white">
								<div class="row no-gutters">
									<div class="col-lg-10">
										<download-csv
											class="btn color-white cursor-pointer w-100 p-0 text-left"
											:data="tTable.items"
											>{{ $t("csv") }}</download-csv
										>
									</div>
									<div class="col-lg-2">
										<p class="m-0px">
											<i class="fa fa-file-image-o"></i>
										</p>
									</div>
								</div>
							</a>
						</b-dropdown-item>
					</b-dropdown-group>
					<b-dropdown-group class="chart-dd-options" v-if="tType == 'chart'">
						<b-dropdown-item class="list-group-item bg-transparent px-0">
							<a class="color-white" @click.prevent.stop="exportChart('png')">
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
						<b-dropdown-item class="list-group-item bg-transparent px-0">
							<a class="color-white" @click.prevent.stop="exportChart('jpg')">
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
						<b-dropdown-item class="list-group-item bg-transparent px-0">
							<a class="color-white" @click.prevent.stop="exportChart('pdf')">
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
		<div>
			<b-modal
				v-model="modalShow"
				hide-footer
				centered
				size="xl"
				:title="name"
				@hide="getActive('chart')"
				modal-class="preview-modal-up"
				no-close-on-backdrop
			>
				<highcharts
					id="container"
					class="chartHeight h-100 align-items-center justify-content-center d-flex"
					:options="chartData"
				></highcharts>
			</b-modal>
		</div>
	</div>
</template>
<script>
import service from "@/service";

export default {
	props: [
		"cid",
		"pLength",
		"sorting",
		"chartRef",
		"keyValue",
		"download",
		"plotType",
		"trendType",
		"drilldown",
		"trendTable",
		"defaultSort",
		"plotOptions",
		"periodOptions",
		"fullScreenData",
		"defaultYAxisTitle",
		"drilldownYAxisTitle",
		"reportingFormsOptions",
		"selectedReportingForm",
	],
	data() {
		let tableData = this.trendTable?.items
			? {
					...this.trendTable,
					//eslint-disable-next-line
					items: this.trendTable.items.map(
						({ _cellVariants, regions, ...rest }) => ({
							...rest,
						})
					),
			  }
			: {
					items: [],
			  };
		let formOptions = this.reportingFormsOptions
			? this.reportingFormsOptions.map((o) => ({ value: o, text: o }))
			: null;
		return {
			name: "",
			chartData: "",
			commentList: [],
			commentText: "",
			modalShow: false,
			tTable: tableData,
			activeIcon: "chart",
			tType: this.trendType,
			formOptions: formOptions,
			commentTextMaxLength: 100,
			sortType: this.defaultSort,
			periodLength: this.pLength,
			chartKeyValue: this.keyValue,
			chartPlotType: this.plotType,
			reportingForm: this.selectedReportingForm,
		};
	},
	computed: {
		commentPlaceholder: function () {
			return this.$i18n.t("placeholderMaxValue", {
				number: this.commentTextMaxLength,
			});
		},
	},
	watch: {
		trendType(newValue) {
			this.tType = newValue;
		},
		trendTable(newValue) {
			this.tTable = newValue;
		},
		modalShow(newValue) {
			if (!newValue) {
				this.$emit("resetDrillDown");
			}
		},
		chartPlotType(newValue) {
			this.$emit("changePlotType", newValue, this.chartRef);
		},
		periodLength(newValue) {
			if (newValue) {
				this.$emit("changePeriod", newValue);
			}
		},
	},
	methods: {
		hideClass() {
			this.activeIcon = this.tType === "table" ? "table" : "chart";
		},
		getActive(icon) {
			this.activeIcon = icon;
		},
		exportChart(type) {
			this.$emit("export", type, this.chartRef);
		},
		changeViewType(type, key) {
			this.getActive(type);
			this.$emit("changeViewType", type, key, this.chartRef);
		},
		dataSort(type) {
			this.sortType = type;
			this.$emit("dataSort", type, this.chartRef);
		},
		getComments() {
			this.getActive("comment");
			this.$emit("handleLoader", true);
			service
				.getComments(this.cid)
				.then((response) => {
					// console.log("comments", response)
					this.commentList = response?.data?.interpretations.length
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
					this.$emit("handleLoader", false);
				})
				.catch(() => {
					this.commentList = [];
					this.$emit("handleLoader", false);
				});
		},
		addComment() {
			this.$emit("handleLoader", true);
			service
				.addComments(this.cid, this.commentText)
				.then((response) => {
					// console.log(response)
					this.commentText = "";
					if (response.data.status === "OK") {
						this.getComments();
					} else {
						this.$emit("handleLoader", false);
						this.errorAlert();
					}
				})
				.catch(() => {
					this.commentText = "";
					this.$emit("handleLoader", false);
					this.errorAlert();
				});
		},
		errorAlert() {
			this.$swal({
				title: this.$i18n.t("error"),
			});
		},
		cancelComment() {
			this.commentText = "";
		},
		fullScreen() {
			this.getActive("preview");
			this.chartData = JSON.parse(JSON.stringify(this.fullScreenData));
			// console.log("this.chartData", this.chartData)
			this.chartData.xAxis.max = null;
			let _this = this;
			this.chartData.chart.events = {
				drillup: function (e) {
					if (_this.defaultYAxisTitle) {
						this.yAxis[0].setTitle({ text: _this.defaultYAxisTitle });
					}
					this.yAxis[0].options.min = 0;
					// this.yAxis[0].options.max = _this.yMax
					this.xAxis[0].options.max = null;
					this.options.chart.zoomType = "x";
				},
				drilldown: function (e) {
					if (_this.drilldownYAxisTitle) {
						this.yAxis[0].setTitle({ text: _this.drilldownYAxisTitle });
					}
					// console.log(this.yAxis[0])
					this.yAxis[0].options.min = null;
					this.yAxis[0].options.max = null;
					this.xAxis[0].options.max = null;
					// console.log(this.yAxis[0])
					this.options.chart.zoomType = "";
					e.target.options.plotOptions = {
						...e.target.options.plotOptions,
						series: {
							...e.target.options.plotOptions.series,
							cursor: "",
						},
					};
				},
			};
			let isDrilldown =
				this.chartData.drilldown && this.chartData.drilldown.series.length > 0
					? true
					: false;
			// console.log("isDrilldown", isDrilldown)
			this.chartData.plotOptions = {
				series: {
					...this.chartData.plotOptions.series,
					events: {
						legendItemClick: function () {},
					},
					showInLegend: true,
					cursor: isDrilldown ? "pointer" : "",
				},
			};
			// console.log("this.chartData", this.chartData)
			this.name = this.fullScreenData.title.title;
			this.$nextTick(() => {
				this.modalShow = true;
			});
		},
	},
};
</script>
<style scoped lang="scss">
.fa-custom-sort-date-asc,
.fa-custom-sort-date-desc {
	position: relative;
	width: 35px;
}
.fa-custom-sort-date-asc::before,
.fa-custom-sort-date-desc::before {
	content: "\f175";
	position: relative;
	right: 14px;
}
.fa-custom-sort-date-asc::after,
.fa-custom-sort-date-desc::after {
	position: absolute;
	width: 18px;
	top: 0;
	right: 8px;
	font-size: 0.625rem;
	line-height: 9px;
	font-family: "courier new", monospace;
	font-weight: bold;
}
.fa-custom-sort-date-asc::after {
	content: "JAN\a DEC";
	white-space: pre-line;
}
.fa-custom-sort-date-desc::after {
	content: "DEC\aJAN";
	white-space: pre;
}
.typeDropdown {
	font-size: 0.75rem;
	padding: 2px 25px 2px 5px;
	height: auto;
	margin-top: 4px;
}
</style>