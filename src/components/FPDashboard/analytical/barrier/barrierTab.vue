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
						<li class="nav-item" v-if="stockChartsDisable">
							<a
								class="nav-link"
								:class="{
									active: stockChartsDisable,
								}"
								@click="getActiveTab('stock')"
								id="barrier_stock"
								data-toggle="pill"
								href="#barrier_stock_tab"
								role="tab"
								aria-controls="barrier_stock_tab"
								aria-selected="false"
								>{{ $t("stock") }}</a
							>
						</li>
						<!-- <li v-if="beResponse.access" class="nav-item"> -->
						<li class="nav-item" v-if="accessChartsDisable">
							<a
								class="nav-link"
								:class="{
									active: !stockChartsDisable && accessChartsDisable,
								}"
								@click="getActiveTab('access')"
								id="barrier_access"
								data-toggle="pill"
								href="#barrier_access_tab"
								role="tab"
								aria-controls="barrier_access_tab"
								aria-selected="false"
								>{{ $t("access") }}</a
							>
						</li>
						<li class="nav-item" v-if="insertionChartsDisable">
							<a
								class="nav-link"
								:class="{
									active:
										!stockChartsDisable &&
										!accessChartsDisable &&
										insertionChartsDisable,
								}"
								@click="getActiveTab('insertion_removal')"
								id="barrier_insertion_removal"
								data-toggle="pill"
								href="#barrier_insertion_removal_tab"
								role="tab"
								aria-controls="barrier_insertion_removal_tab"
								aria-selected="false"
								>{{ $t("insertion_Removal") }}</a
							>
						</li>
					</ul>
				</div>
				<div class="col-lg-12">
					<template
						v-if="
							beResponse.stock && activeTab == 'stock' && stockChartsDisable
						"
					>
						<TabSummary
							v-if="beResponse.stock['Stock']['categoryInfo']"
							:content="beResponse.stock['Stock']['categoryInfo']"
							contKey="stock"
						/>
					</template>

					<template
						v-else-if="
							beResponse.access && activeTab == 'access' && accessChartsDisable
						"
					>
						<TabSummary
							v-if="beResponse.access['Accessibility']['categoryInfo']"
							:content="beResponse.access['Accessibility']['categoryInfo']"
							contKey="access"
						/>
					</template>

					<template v-else>
						<TabSummary
							v-if="
								beResponse.access &&
								activeTab == 'insertion_removal' &&
								insertionChartsDisable
							"
							:content="beResponse.access['Services']['categoryInfo']"
							contKey="insertion_removal"
						/>
					</template>

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
										<!--Map Header-->
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
										<!--Map Body-->
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
										'show active': stockChartsDisable && activeTab === 'stock',
									}"
									id="barrier_stock_tab"
									role="tabpanel"
									aria-labelledby="barrier_stock"
									v-if="stockChartsDisable && activeTab === 'stock'"
								>
									<div class="row dashboardchart-container">
										<div
											v-if="beResponse.stock"
											class="col-lg-12 col-xl-12"
											id="stockChartContainer"
											
										>
											<div
												v-if="beResponse.stock.Stock && chart1Disable"
												class="row mb-4"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="stock"
														chartComponent="Stock"
														:chartName="$t('chartHeading')"
														viewTypeClass="stock-chart1"
														key="stock-chart1"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="1"
														:globalFactorsData="{}"
														cardKey="chart1Disable"
														@hideCard="hideCard"
														data-function="dxTotalOUDataStockNew"
														:noDerivedSettings="true"
														:total="false"
														:facilityLevel="facilityLevel"
														chartType="region"
														:isRegionalChart="false"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												v-if="
													beResponse.stock.Stock &&
													locationList.length > 0 &&
													chart2Disable &&
													!this.reportChartData
												"
												class="row mb-4"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="stock"
														chartComponent="Stock"
														:chartName="$t('chartHeading')"
														viewTypeClass="stock-chart2"
														key="stock-chart2"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="1"
														:globalFactorsData="{}"
														cardKey="chart2Disable"
														@hideCard="hideCard"
														data-function="dxTotalOUDataStockNew"
														:locationList="locationList"
														:noDerivedSettings="true"
														:total="false"
														sorting="type4"
														defaultSort="1-0"
														:facilityLevel="facilityLevel"
														chartType="region"
														:isRegionalChart="true"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												v-if="beResponse.stock.Stock && chart3Disable"
												class="row m-b-40px"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="stock"
														chartComponent="Stock"
														:chartName="$t('chartHeading')"
														viewTypeClass="stock-chart3"
														key="stock-chart3"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="12"
														:globalFactorsData="{}"
														cardKey="chart3Disable"
														@hideCard="hideCard"
														:cyp="false"
														:derivedChart="true"
														data-function="dxTotalOUDataStockNew"
														sorting="type3"
														defaultSort="JAN-DEC"
														:facilityLevel="facilityLevel"
														chartType="period"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												class="text-center"
												v-if="
													!chart1Disable && !chart2Disable && !chart3Disable
												"
											>
												<b-alert variant="info" show class="m-0">{{
													$t("rr_text5")
												}}</b-alert>
											</div>
										</div>
										<div class="col-lg-12 col-xl-12" v-else>
											<PlaceholderChart />
										</div>
									</div>
								</div>
								<!-- !(stockChartsDisable) && -->
								<div
									class="tab-pane"
									:class="{
										'show active':
											accessChartsDisable && activeTab === 'access',
									}"
									id="barrier_access_tab"
									role="tabpanel"
									aria-labelledby="barrier_access"
									v-if="accessChartsDisable && activeTab === 'access'"
								>
									<div class="row dashboardchart-container">
										<div
											v-if="beResponse.access"
											class="col-lg-12 col-xl-12"
											id="stockChartContainer"
											
										>
											<div
												v-if="beResponse.access.Accessibility && chart4Disable"
												class="row mb-4"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="access"
														chartComponent="Accessibility"
														viewTypeClass="access-chart1"
														key="access-chart1"
														:chartName="$t('chartHeading')"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="1"
														:globalFactorsData="{}"
														cardKey="chart4Disable"
														@hideCard="hideCard"
														data-function="dxTotalOUDataAccessNew"
														:noDerivedSettings="true"
														:total="false"
														:facilityLevel="facilityLevel"
														chartType="region"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												v-if="beResponse.access.Accessibility && chart5Disable"
												class="row mb-4"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="access"
														chartComponent="Accessibility"
														viewTypeClass="access-chart2"
														key="access-chart2"
														:chartName="$t('chartHeading')"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="12"
														:globalFactorsData="{}"
														cardKey="chart5Disable"
														@hideCard="hideCard"
														:cyp="false"
														:derivedChart="true"
														data-function="dxTotalOUDataAccessNew"
														sorting="type3"
														defaultSort="JAN-DEC"
														:facilityLevel="facilityLevel"
														chartType="period"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:pOptions="pOptions"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												class="text-center"
												v-if="!chart4Disable && !chart5Disable"
											>
												<b-alert variant="info" show class="m-0">{{
													$t("rr_text5")
												}}</b-alert>
											</div>
										</div>
										<div class="col-lg-12 col-xl-12" v-else>
											<PlaceholderChart />
										</div>
									</div>
								</div>
								<!-- !(stockChartsDisablee) &&
											!(accessChartsDisable) -->
								<div
									class="tab-pane"
									:class="{
										'show active':
											insertionChartsDisable &&
											activeTab === 'insertion_removal',
									}"
									id="barrier_insertion_removal_tab"
									role="tabpanel"
									aria-labelledby="barrier_insertion_removal"
									v-if="
										insertionChartsDisable && activeTab === 'insertion_removal'
									"
								>
									<div class="row dashboardchart-container">
										<div
											v-if="beResponse.access"
											class="col-lg-12 col-xl-12"
											id="stockChartContainer"
											
										>
											<div
												v-if="beResponse.access.Services && chart6Disable"
												class="row m-b-40px"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="access"
														chartComponent="Services"
														:chartName="$t('chartHeading')"
														viewTypeClass="access-chart3"
														key="access-chart3"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="1"
														:globalFactorsData="{}"
														cardKey="chart6Disable"
														@hideCard="hideCard"
														data-function="dxTotalOUScatterData"
														:derivedChart="true"
														:total="false"
														chartType="region"
														chartRep="scatter"
														:btnSelected="'IUD'"
														:facilityLevel="false"
														:btns="[
															{
																text: $t('IUD'),
																value: 'IUD',
																class: 'color-white mr-2',
															},
															{
																text: $t('Implant'),
																value: 'Implant',
																class: 'color-white',
															},
														]"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												v-if="beResponse.access.Services && chart7Disable"
												class="row m-b-40px"
											>
												<div class="col-12">
													<chartComponent
														chartCategory
														chartSubCategory="access"
														chartComponent="Services"
														:chartName="$t('chartHeading')"
														viewTypeClass="access-chart4"
														key="access-chart4"
														:period="period"
														:periodType="periodType"
														:sendLocation="sendLocation"
														:ministrialData="beResponse"
														periodLen="12"
														:globalFactorsData="{}"
														cardKey="chart7Disable"
														@hideCard="hideCard"
														data-function="dxTotalOUData"
														sorting="type3"
														defaultSort="JAN-DEC"
														:noDerivedSettings="true"
														:total="false"
														:facilityLevel="false"
														:btnSelected="'IUD'"
														:btns="[
															{
																text: $t('IUD'),
																value: 'IUD',
																class: 'color-white mr-2',
															},
															{
																text: $t('Implant'),
																value: 'Implant',
																class: 'color-white',
															},
														]"
														chartType="period"
														:applicationFinalYear="applicationFinalYear"
														:debugging="debugging"
														@sendChartLog="getChartLog"
														:reportChartData="reportChartData"
													/>
												</div>
											</div>
											<div
												class="text-center"
												v-if="!chart6Disable && !chart7Disable"
											>
												<b-alert variant="info" show class="m-0">{{
													$t("rr_text5")
												}}</b-alert>
											</div>
										</div>
										<div class="col-lg-12 col-xl-12" v-else>
											<PlaceholderChart />
										</div>
									</div>
								</div>
								<div
									class="text-center"
									v-if="
										!chart1Disable &&
										!chart2Disable &&
										!chart3Disable &&
										!chart4Disable &&
										!chart5Disable &&
										!chart6Disable &&
										!chart7Disable
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
			@dataType="getDataType"
			:source="source"
			:dataType="dataType"
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
// import pptxgen from "pptxgenjs";
import PlaceholderChart from "@/components/Common/PlaceholderChart";

export default {
	props: [
		"debugging",
		"reportPeriod",
		"reportLocationValue",
		"reportDefaultLevelID",
		"reportDefaultLocationID",
		"reportSubLevelID",
		"reportPeriodType",
		"reportChartData",
		"activateSubTabs",
	],
	components: {
		anchorMap: () =>
			import(/* webpackChunkName: "analytical_map"*/ "../anchorMap/Map.vue"),
		toolbarComponent,
		chartComponent,
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
		PlaceholderChart,
	},
	data() {
		return {
			chartComponentLogArr: [],
			activityLogArr: [],
			chart1Disable: true,
			chart2Disable: true,
			chart3Disable: true,
			chart4Disable: true,
			chart5Disable: true,
			chart6Disable: true,
			chart7Disable: true,
			activeTab: "stock",
			periodType: "monthly",
			beResponse: {},
			sendLocation: [],
			facilityLevel: 0,
			maptoggle: false,
			chartData: [],
			chartSource: null,
			cObjTable: {
				items: [],
				fields: [],
			},
			viewType: "chart",
			cID: "",
			commentList: [],
			chartInfo: "",
			//plotType: '',
			drilldown: false,
			chartType: "column",
			defaultLevelID: "",
			defaultLocationID: "",
			subLevelID: "",
			source: "Commodities_Client",
			period: "",
			periodLength: 12,
			dataType: "Report Due Period",
			locationValue: "",
			services_insertion_vs_removal: "",
			// Anchor Map
			locationChanged: false,
			mapIndicatorID: "",
			toolbarLevelID: "",
			toolbarLocationID: "",
			resetCurrentLevel: false,
			componentKey: false,
			mapIndicatorName: "Map",
			mapConfigData: "",
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
			bPPFPServiceProMap: false,
			PPFPServiceProMapOptions: {},
			PPFPServiceProMapData: {},
			mapConfigAvailable: true,
			oResponse: null,
			mapChartInfo: "",
			leftMapChartInfo: "",
			globalPeriodData: null,
			showToolbarOnTablet: false,
			locationList: [],
			tabComponentKey: 0,
			exportArr: [],
			applicationFinalYear: null,
			pOptions: [
				{ text: 3, value: 3 },
				{ text: 6, value: 6 },
				{ text: 9, value: 9 },
				{ text: 12, value: 12 },
			],
		};
	},
	watch: {
		maptoggle() {
			this.$store.state.loading = true;
			let beResponse = this.beResponse;
			setTimeout(() => {
				this.beResponse = {};
			}, 50);
			setTimeout(() => {
				this.beResponse = beResponse;
				this.$store.state.loading = false;
			}, 50);
			// this.getBarriersConfig();
		},
		activateSubTabs(newValue) {
			this.getActiveTab(newValue);
		},
	},
	computed: {
		stockChartsDisable() {
			let result =
				this.chart1Disable || this.chart2Disable || this.chart3Disable;
			return result;
		},
		accessChartsDisable() {
			let result = this.chart4Disable || this.chart5Disable;
			return result;
		},
		insertionChartsDisable() {
			let result = this.chart6Disable || this.chart7Disable;
			return result;
		},
	},
	methods: {
		getChartLog(chartCompLog) {
			this.chartComponentLogArr.push(chartCompLog);
			this.activityLogArr.push(chartCompLog);
		},
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
					'" value="Barriers/Enablers" tabindex="-1"/></div>' +
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
				let period = this.$moment(this.period, "YYYYMM").format("MMM YYYY");
				import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
					(pptxgen) => {
						let pptx = new pptxgen.default();
						pptx.layout = "LAYOUT_WIDE";
						pptx.author = "Avenir Generic Tool";
						pptx.company = "Dure Technologies";
						pptx.subject = this.$i18n.t("barriers_enablers_tab");
						pptx.title = this.$i18n.t("barriers_enablers_tab");

						pptx.defineSlideMaster({
							title: "MASTER_SLIDE",
							bkgd: "FFFFFF",
							objects: [
								{
									text: {
										text: this.$i18n.t("barriers_enablers_tab"),
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
		closeToolbar() {
			this.showToolbarOnTablet = false;
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
		getSource(source) {
			this.source = source;
			this.$store.state.loading = true;
		},
		getLocation(location) {
			var res = location.split("/");
			this.chart1Disable = true;
			this.chart2Disable = true;
			this.chart3Disable = true;
			this.chart4Disable = true;
			this.chart5Disable = true;
			this.chart6Disable = true;
			this.chart7Disable = true;
			this.sendLocation = [parseInt(res[0]), parseInt(res[0]) + 1, res[1]];
			if (parseInt(res[0]) < 6) {
				this.toolbarLevelID = parseInt(res[0]);
				this.subLevelID = parseInt(res[0]) + 1;
				this.toolbarLocationID = res[1];
				this.locationValue = location;
				this.locationChanged = "";
				this.locationChanged = true;
				setTimeout(() => {
					this.mapObj.indiId = "";
					this.mapObj.indiId = this.mapIndicatorID;
				}, 900);
			}
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
			this.chart1Disable = true;
			this.chart2Disable = true;
			this.chart3Disable = true;
			this.chart4Disable = true;
			this.chart5Disable = true;
			this.chart6Disable = true;
			this.chart7Disable = true;

			if (periodType === "monthly") {
				this.pOptions = [
					{ text: `3 ${this.$i18n.t("month")}`, value: 3 },
					{ text: `6 ${this.$i18n.t("month")}`, value: 6 },
					{ text: `9 ${this.$i18n.t("month")}`, value: 9 },
					{ text: `12 ${this.$i18n.t("month")}`, value: 12 },
				];
			} else if (
				periodType === "financialYear" ||
				periodType === "financialYearJuly"
			) {
				this.pOptions = [
					{ text: `3 ${this.$i18n.t("financialYear")}`, value: 3 },
					{ text: `6 ${this.$i18n.t("financialYear")}`, value: 6 },
					{ text: `9 ${this.$i18n.t("financialYear")}`, value: 9 },
					{
						text: `12 ${this.$i18n.t("financialYear")}`,
						value: 12,
					},
				];
			} else if (periodType === "quarterly") {
				this.pOptions = [
					{ text: `3 ${this.$i18n.t("quarter")}`, value: 3 },
					{ text: `6 ${this.$i18n.t("quarter")}`, value: 6 },
					{ text: `9 ${this.$i18n.t("quarter")}`, value: 9 },
					{ text: `12 ${this.$i18n.t("quarter")}`, value: 12 },
				];
			} else {
				this.pOptions = [
					{
						text: `3 ${this.$i18n.t("year")}`,
						value: 3,
					},
					{
						text: `6 ${this.$i18n.t("year")}`,
						value: 6,
					},
					{
						text: `9 ${this.$i18n.t("year")}`,
						value: 9,
					},
					{
						text: `12 ${this.$i18n.t("year")}`,
						value: 12,
					},
				];
			}

			this.period = p;
			this.periodType = periodType;

			// this.locationValue = this.locationValue;
			this.mapObj.indiId = "";
			this.mapObj.indiId = this.mapIndicatorID;
		},
		getDataType(r) {
			this.dataType = r;
		},
		setLocationOnReset(location) {
			this.locationValue = location;
		},
		// Barrier Enablers
		getBarriersConfig() {
			//adProgramModule
			let key = this.generateKey("adBarrierModule");
			let namespace = this.reportChartData
				? this.reportChartData.selectedDashboard
				: "";
			service
				.getSavedConfig(key, false, namespace)
				.then((beResponse) => {
					this.beResponse = beResponse.data;
					this.$store.state.loading = false;
				})
				.catch((e) => {
					this.$store.state.loading = false;
					if (this.debugging) {
						console.log(
							"Failed to fetch adBarrierModule config... @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
								e.stack
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "adBarrierModule config",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Failed to fetch adBarrierModule config... " + e.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
					if (this.reportChartData) {
						this.$emit("setReportChart", {
							chartObj: null,
							chartName: null,
							cid: [this.reportChartData, ...this.reportChartData.linkedCharts],
						});
					}
				});
		},
		// Anchor Map
		getAnchorMapConfig() {
			let key = this.generateKey("adAnchorMapModule");

			service
				.getOrganisationUnitLevels()
				.then((fresponse) => {
					if (this.debugging) {
						console.log(
							"Service.getOrganisationUnitLevels data received @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "getOrganisationUnitLevels",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Service.getOrganisationUnitLevels data received",
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
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
								if (this.debugging) {
									console.log(
										" service.getSavedConfig data received @" +
											this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: "getSavedConfig",
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content: "service.getSavedConfig data received",
										};
										this.activityLogArr.push(obj_log);
										this.$emit("sendlog", this.activityLogArr);
									}
								}
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
							.catch((e) => {
								if (this.debugging) {
									console.log(
										" service.getSavedConfig data failed  @" +
											this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
											e.stack
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: "getSavedConfig",
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content: "service.getSavedConfig data failed" + e.stack,
										};
										this.activityLogArr.push(obj_log);
										this.$emit("sendlog", this.activityLogArr);
									}
								}
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
							});
					}
				})
				.catch((e) => {
					if (this.debugging) {
						console.log(
							"Service.getOrganisationUnitLevels data failed @" +
								this.$moment().format("MMMM Do YYYY, h:mm:ss a") +
								e.stack
						);
						if (this.activityLogArr) {
							var obj_log = {
								name: "getOrganisationUnitLevels",
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content:
									"Service.getOrganisationUnitLevels data failed " + e.stack,
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
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
		this.componentKey = false;
		if (this.reportChartData) {
			this.periodType = this.reportPeriodType;
		}
		this.locationList = JSON.parse(
			JSON.stringify(this.$store.getters.getLocationList)
		);
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
		this.pOptions = [
			{ text: `3 ${this.$i18n.t("month")}`, value: 3 },
			{ text: `6 ${this.$i18n.t("month")}`, value: 6 },
			{ text: `9 ${this.$i18n.t("month")}`, value: 9 },
			{ text: `12 ${this.$i18n.t("month")}`, value: 12 },
		];
		let { locationID, levelID, subLevelID } = service.getAllowedLocation();

		this.defaultLevelID = this.toolbarLevelID = this.reportChartData
			? this.reportDefaultLevelID * 1
			: levelID;
		this.defaultLocationID = this.toolbarLocationID = this.reportChartData
			? this.reportDefaultLocationID
			: locationID;
		this.subLevelID = this.reportChartData
			? this.reportSubLevelID * 1
			: subLevelID;
		this.locationValue = "";
		this.locationValue = this.reportChartData
			? this.reportLocationValue
			: levelID + "/" + locationID;
		this.sendLocation = [
			parseInt(this.defaultLevelID),
			parseInt(this.subLevelID),
			this.toolbarLocationID,
		];
		this.getAnchorMapConfig();
		this.getBarriersConfig();
	},
};
</script>
<style scoped lang="scss">
#dropdownNarration,
#dropdownComments {
	z-index: 9999;
}
</style>
