<template>
	<div>
		<div class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-12">
						<div class="text-right mb-3" v-if="reportTemplates.length < 3">
							<button
								class="btn btn-sm btn-secondary"
								@click.prevent="createTemplateSection"
							>
								{{ $t("createTemplate") }}
							</button>
						</div>
						<div>
							<b-table-simple bordered responsive>
								<b-thead>
									<b-tr>
										<b-th>{{ $t("templateName") }}</b-th>
										<b-th>{{ $t("createdAt") }}</b-th>
										<b-th>{{ $t("updatedAt") }}</b-th>
										<b-th>{{ $t("createdBy") }}</b-th>
										<b-th>{{ $t("action") }}</b-th>
									</b-tr>
								</b-thead>
								<b-tbody>
									<template v-if="reportTemplates.length">
										<b-tr
											v-for="template in reportTemplates"
											:key="template.templateId"
										>
											<b-td>{{ template.templateName }}</b-td>
											<b-td>{{ template.createdAt }}</b-td>
											<b-td>{{ template.updatedAt }}</b-td>
											<b-td>{{ template.createdBy }}</b-td>
											<b-td>
												<i
													class="fa fa-edit mr-3 cursor-pointer"
													v-b-tooltip.hover
													:title="$t('edit')"
													@click.prevent="editTemplate(template.templateId)"
												></i>
												<i
													class="fa fa-trash mr-3 cursor-pointer"
													v-b-tooltip.hover
													:title="$t('deletebtn')"
													@click.prevent="deleteTemplate(template.templateId)"
												></i>
											</b-td>
										</b-tr>
									</template>
									<template v-else>
										<b-tr>
											<b-td colspan="5">
												<div class="text-center my-2" v-if="isReportsFetched">
													<strong>{{ $t("noTemplates") }}</strong>
												</div>
												<div class="text-center my-2" v-else>
													<b-spinner class="align-middle mr-2"></b-spinner>
													<strong>{{ $t("loadText") }}</strong>
												</div>
											</b-td>
										</b-tr>
									</template>
								</b-tbody>
							</b-table-simple>
						</div>
						<hr />
					</div>
				</div>
				<div class="row" v-if="templateSection">
					<div class="col-12">
						<div class="form-group mb-1 row">
							<label class="col-lg-3 col-sm-6 col-form-label">{{
								$t("templateName")
							}}</label>
							<div class="col-lg-4 col-sm-6">
								<input
									class="form-control"
									type="text"
									v-model="templateObj.templateName"
								/>
							</div>
						</div>
						<div
							class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold mt-4"
						>
							{{ $t("charts") }}
						</div>
						<template v-if="templateObj.selectedCharts.length">
							<div
								class="border border-b-l-radius-10px border-b-r-radius-10px py-4 mb-4"
							>
								<div
									v-for="(chart, i) in templateObj.selectedCharts"
									:key="chart.cid + i"
								>
									<button
										class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
										type="button"
										v-b-toggle="chart.cid"
									>
										<i
											class="fa fa-trash f-s-20px pr-2"
											v-b-tooltip.hover
											:title="$t('deletebtn')"
											@click.prevent.stop="deleteChartFromTemplate(chart.cid)"
										>
										</i>
										<i
											class="fa fa-edit f-s-20px pr-2"
											v-b-tooltip.hover
											:title="$t('edit')"
											@click.prevent.stop="editChartFromTemplate(chart.cid)"
										>
										</i>
										<i
											class="fa fa-cog f-s-20px pr-2"
											v-b-tooltip.hover
											:title="$t('chartSettings')"
										>
										</i>
										{{ chart.chartName }}
									</button>
									<b-collapse
										class="border border-b-l-radius-10px border-b-r-radius-10px p-3 mx-3"
										:id="chart.cid"
									>
										<div
											v-if="
												!chart.selectedModule.includes('interactive') &&
												!chart.selectedModule.includes('emu')
											"
										>
											<div v-if="!isEditChart">
												<div class="form-group mb-1 row">
													<label class="col-lg-3 col-sm-6 col-form-label">{{
														$t("location")
													}}</label>
													<div class="col-lg-4 col-sm-6">
														<input
															class="form-control"
															type="text"
															disabled
															:value="getLocName(chart.location)"
														/>
													</div>
												</div>
												<div class="form-group mb-1 row">
													<label class="col-lg-3 col-sm-6 col-form-label"
														>{{ $t("period") }} {{ $t("type") }}</label
													>
													<div class="col-lg-4 col-sm-6">
														<input
															class="form-control"
															type="text"
															disabled
															:value="getPeriodType(chart.periodType)"
														/>
													</div>
												</div>
												<div class="form-group mb-1 row">
													<label class="col-lg-3 col-sm-6 col-form-label">{{
														$t("period")
													}}</label>
													<div class="col-lg-4 col-sm-6">
														<textarea
															class="form-control"
															rows="3"
															disabled
															:value="getPeriod(chart.period, chart.periodType)"
														/>
													</div>
												</div>
											</div>
											<div class="text-center" v-else>
												{{ $t("editInProcess") }}
											</div>
										</div>
										<div class="text-center" v-else>
											{{ $t("noSettingsInfo") }}
										</div>
									</b-collapse>
								</div>
							</div>
						</template>
						<template v-else>
							<div
								class="border border-b-l-radius-10px border-b-r-radius-10px py-4 text-center mb-4"
							>
								{{ $t("noCharts") }}
							</div>
						</template>
						<template v-if="addChartSection">
							<div class="form-group mb-1 row">
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("module")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="selectedModule"
										:options="modulesList"
										:disabled="isEditChart"
									></b-form-select>
								</div>
							</div>
							<div class="form-group mb-1 row" v-if="categoryList.length">
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("category")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="selectedCategory"
										:options="categoryList"
										:disabled="isEditChart"
									></b-form-select>
								</div>
							</div>
							<div class="form-group mb-1 row" v-if="sourceList.length">
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("source")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="selectedSource"
										:options="sourceList"
										:disabled="isEditChart"
									></b-form-select>
								</div>
							</div>
							<div class="form-group mb-1 row" v-if="typeList.length">
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("type")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="selectedType"
										:options="typeList"
										:disabled="isEditChart"
									></b-form-select>
								</div>
							</div>
							<div class="form-group mb-1 row" v-if="chartsList.length">
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("chart")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="selectedChart"
										:options="chartsList"
										:disabled="isEditChart"
									></b-form-select>
								</div>
							</div>
							<div
								class="form-group mb-1 row"
								v-if="
									selectedChart &&
									!selectedModule.includes('interactive') &&
									!selectedModule.includes('emu')
								"
							>
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("location")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<treeselect
										class="p-0"
										:options="$store.getters.getLocationList"
										:show-count="true"
										:placeholder="$t('search')"
										v-model="selectedLocation"
										:flat="false"
										:default-expand-level="1"
									/>
								</div>
							</div>
							<div
								class="form-group mb-1 row"
								v-if="
									selectedChart &&
									!selectedModule.includes('interactive') &&
									!selectedModule.includes('emu')
								"
							>
								<label class="col-lg-3 col-sm-6 col-form-label"
									>{{ $t("period") }} {{ $t("type") }}</label
								>
								<div class="col-lg-4 col-sm-6">
									<b-form-select
										v-model="periodType"
										:options="periodTypeList"
									></b-form-select>
								</div>
							</div>
							<div
								class="form-group mb-1 row"
								v-if="
									selectedChart &&
									!selectedModule.includes('interactive') &&
									!selectedModule.includes('emu')
								"
							>
								<label class="col-lg-3 col-sm-6 col-form-label">{{
									$t("period")
								}}</label>
								<div class="col-lg-4 col-sm-6">
									<date-picker
										v-model="selectedPeriod"
										range
										:default-value="allowedStartDate"
										type="month"
										value-type="format"
										format="YYYY-MM"
										class="form-control"
										:lang="lang"
										v-if="periodType === 'monthly'"
										:disabled-date="disableDate"
									></date-picker>
									<date-picker
										v-model="selectedPeriod"
										range
										type="year"
										value-type="format"
										format="YYYY"
										class="form-control"
										:lang="lang"
										v-else-if="periodType === 'yearly'"
										:disabled-date="disableDate"
									></date-picker>
									<b-dropdown
										id="dropdown-dropup"
										ref="dropdown"
										block
										split
										:text="periodText"
										class="form-control p-0"
										variant="link"
										toggle-class="color-black"
										split-class="color-black text-left"
										menu-class="timeFrequenncyDropdown w-100"
										v-else
									>
										<b-dropdown-form>
											<b-form-group>
												<b-form-checkbox-group
													v-model="selectedPeriod"
													:options="periodList"
													name="period"
													stacked
												></b-form-checkbox-group>
											</b-form-group>
										</b-dropdown-form>
									</b-dropdown>
								</div>
							</div>
						</template>
						<div class="row pt-4">
							<div class="col text-right">
								<button
									type="button"
									class="btn btn-sm btn-secondary ml-3"
									@click.prevent="addChart"
									v-if="!addChartSection"
								>
									{{ $t("subMenu_3") }}
								</button>
								<template v-else>
									<button
										type="button"
										class="btn btn-sm btn-secondary ml-3"
										@click.prevent="addChartToTemplate"
										:disabled="!selectedChart"
									>
										{{ $t("addbtn") }}
									</button>
									<button
										type="button"
										class="btn btn-sm btn-secondary ml-3"
										@click.prevent="cancelAddChart"
									>
										{{ $t("cancelbtn") }}
									</button>
								</template>
							</div>
						</div>
					</div>
				</div>
				<div
					class="row pt-4 mt-4 border-top mx-0"
					v-if="templateSection && !addChartSection"
				>
					<div class="col text-right px-0">
						<button
							type="button"
							class="btn btn-primary new-btndisable black-btn ml-3"
							:disabled="!templateObj.templateName"
							@click.prevent="saveReportTemplate"
						>
							{{ $t("savebtn") }}
						</button>
						<button
							type="button"
							class="btn btn-primary new-btn1 black-btn ml-3"
							@click.prevent="resetValues"
						>
							{{ $t("cancelbtn") }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import {
	randomString,
	translateDate,
	getLocationName,
} from "@/components/common/commonFunctions";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
const originalTemplateObj = {
	templateId: "",
	templateName: "",
	createdAt: "",
	updatedAt: "",
	createdBy: "",
	selectedCharts: [],
};
export default {
	data() {
		return {
			modulesList: [],
			categoryList: [],
			sourceList: [],
			chartsList: [],
			typeList: [],
			reportTemplates: [],
			moduleGroup: null,
			moduleConfig: null,
			selectedChart: null,
			selectedModule: null,
			selectedCategory: null,
			selectedSource: null,
			selectedType: null,
			createTemplatePopup: false,
			isReportsFetched: false,
			templateSection: false,
			templateObj: { ...originalTemplateObj },
			addChartSection: false,
			selectedLocation: null,
			periodTypeList: [],
			selectedPeriod: [],
			periodList: [],
			periodType: "",
			allowedStartDate: null,
			allowedFinalDate: null,
			financialYearsText: ["Mar", "Apr"],
			financialYearsjulyText: ["Jun", "Jul"],
			quartersText: {
				Q1: ["Jan", "Mar"],
				Q2: ["Apr", "Jun"],
				Q3: ["Jul", "Sep"],
				Q4: ["Oct", "Dec"],
			},
			lang: {
				formatLocale: {
					monthsShort: [
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
					],
				},
			},
			isEditChart: false,
			editChartObj: null,
		};
	},
	components: {
		Treeselect,
		DatePicker,
	},
	computed: {
		periodText() {
			return this.selectedPeriod.length + " Selected";
		},
	},
	watch: {
		selectedModule(newValue) {
			if (newValue) {
				this.resetChartValues("all");
				let m = newValue.split("-");
				this.moduleGroup = m[1];
				this.getModuleConfig(m[0]);
			}
		},
		selectedCategory(newValue) {
			if (newValue) {
				this.resetChartValues("category");
				if (
					this.moduleGroup === "G1" ||
					this.moduleGroup === "G3" ||
					this.moduleGroup === "G4"
				) {
					this.getSources(newValue);
				} else {
					this.getCharts(newValue);
				}
			}
		},
		selectedSource(newValue) {
			if (newValue) {
				this.resetChartValues("source");
				if (this.moduleGroup === "G4") {
					this.getTypes(newValue);
				} else {
					this.getCharts(newValue);
				}
			}
		},
		selectedType(newValue) {
			if (newValue) {
				this.resetChartValues("type");
				this.getCharts(newValue);
			}
		},
		periodType(newValue) {
			this.periodList = [];
			this.selectedPeriod = [];
			this.$nextTick(() => {
				this.setPeriod(newValue);
			});
		},
	},
	methods: {
		getLocName(id) {
			const { locName } = getLocationName({
				locationList: this.$store.getters.getLocationList,
				location: id,
			});
			return locName;
		},
		getPeriodType(id) {
			let periodType = this.periodTypeList.find((p) => p.value === id);
			return periodType.text;
		},
		getPeriod(rawDate, type) {
			let translatedDate = "",
				separator = type === "monthly" || type === "yearly" ? " ~ " : ", ";
			rawDate.forEach((d, i) => {
				let transDate = translateDate({
					rawDate: d,
					periodType: this.periodType,
					monthlyFormat: "MMM YYYY",
				});

				translatedDate =
					i === 0 ? transDate : `${translatedDate}${separator}${transDate}`;
			});
			return translatedDate;
		},
		disableDate(date) {
			let format = this.periodType == "yearly" ? "YYYY" : "YYYYMM";
			let dStart = this.$moment(this.allowedStartDate, format).format(format);
			let dEnd = this.$moment(this.allowedFinalDate, format).format(format);
			let d1 = this.$moment(date, format).format(format);
			return d1 < dEnd || d1 > dStart;
		},
		getCharts(newValue) {
			if (this.moduleGroup === "G2") {
				if (
					this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
						.cid &&
					(this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
						.chartName ||
						this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
							.chartOptions.chartName)
				) {
					this.chartsList.push({
						value:
							this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
								.cid,
						text:
							this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
								.chartName ||
							this.moduleConfig[newValue.split("-")[0]][newValue.split("-")[1]]
								.chartOptions.chartName,
					});
				}
				this.moduleConfig[newValue.split("-")[0]][
					newValue.split("-")[1]
				]?.derivedCharts?.forEach((c) => {
					this.chartsList.push({
						value: c.chartOptions.cid,
						text: `${c.chartOptions.chartName} [${this.$i18n.t(
							"derivedChart"
						)}]`,
					});
				});
			} else if (this.moduleGroup === "G4") {
				let data = this.moduleConfig[this.selectedCategory][
					this.selectedSource
				].chartData.find((c) => c.indicator.static_name === this.selectedType);
				if (data) {
					if (data.indicator.cid && data.indicator.chartName) {
						this.chartsList.push({
							value: data.indicator.cid,
							text: data.indicator.chartName,
						});
					}
					data.indicator?.derivedCharts?.forEach((c) => {
						this.chartsList.push({
							value: c.chartOptions.cid,
							text: `${c.chartOptions.chartName} [${this.$i18n.t(
								"derivedChart"
							)}]`,
						});
					});
				}
			} else if (this.moduleGroup === "G5") {
				let source =
					newValue === "emu"
						? "Output"
						: this.moduleConfig[newValue].Background_Data.autoSaveEMU;
				let chartIndex = newValue === "emu" ? -1 : 2;
				this.moduleConfig[newValue][source].derivedCharts.forEach((c, i) => {
					if (i > chartIndex) {
						this.chartsList.push({
							value: c.chartOptions.cid,
							text: c.chartOptions.chartName,
						});
					}
				});
			} else if (this.moduleGroup === "G6") {
				this.moduleConfig.forEach((c) => {
					this.chartsList.push({
						value: c.id,
						text: c.name,
					});
				});
			} else {
				if (
					this.moduleConfig[this.selectedCategory][newValue].cid &&
					this.moduleConfig[this.selectedCategory][newValue].chartName
				) {
					this.chartsList.push({
						value: this.moduleConfig[this.selectedCategory][newValue].cid,
						text: this.moduleConfig[this.selectedCategory][newValue].chartName,
					});
				}
				this.moduleConfig[this.selectedCategory][
					newValue
				]?.derivedCharts?.forEach((c) => {
					this.chartsList.push({
						value: c.chartOptions.cid,
						text: `${c.chartOptions.chartName} [${this.$i18n.t(
							"derivedChart"
						)}]`,
					});
				});
			}
			if (this.isEditChart) {
				this.selectedChart = this.editChartObj.cid;
				this.selectedLocation = this.editChartObj.location;
				this.periodType = this.editChartObj.periodType;
				this.selectedPeriod = this.editChartObj.period;
			}
		},
		getTypes(newValue) {
			this.moduleConfig[this.selectedCategory][newValue].chartData.forEach(
				(c) => {
					this.typeList.push({
						value: c.indicator.static_name,
						text: this.$i18n.t(`${c.indicator.static_name}`),
					});
				}
			);
			if (this.isEditChart) {
				this.selectedType = this.editChartObj.selectedType;
			}
		},
		getSources(newValue) {
			Object.keys(this.moduleConfig[newValue]).forEach((c) => {
				if (c !== "CAR" && c !== "Background_Data") {
					let translatedText = c;
					switch (c) {
						case "Visits":
							translatedText = this.$i18n.t("visits");
							break;
						case "Commodities_Client":
							translatedText = this.$i18n.t("Commodities_Client");
							break;
						case "Commodities_Facilities":
							translatedText = this.$i18n.t("Commodities_Facilities");
							break;
						case "User":
							translatedText = this.$i18n.t("users");
							break;
						case "EMU":
							translatedText = this.$i18n.t("EMU");
							break;
					}
					this.sourceList.push({
						value: c,
						text: translatedText,
					});
				}
			});
			if (this.isEditChart) {
				this.selectedSource = this.editChartObj.selectedSource;
			}
		},
		getModuleConfig(newValue) {
			this.$store.state.loading = true;
			let key = this.generateKey(newValue);

			service
				.getSavedConfig(key)
				.then((response) => {
					if (response.data) {
						this.moduleConfig = response.data;
						this.$nextTick(() => {
							if (this.moduleGroup === "G1" || this.moduleGroup === "G2") {
								this.setCategoryList(newValue);
							}
							if (this.moduleGroup === "G3") {
								this.selectedCategory =
									newValue === "adGeographicalModule"
										? "sourceType"
										: "internal_validations";
							}
							if (this.moduleGroup === "G4") {
								this.selectedCategory = "reportingRate";
							}
							if (this.moduleGroup === "G5") {
								this.selectedCategory = this.selectedModule.split("-")[2];
							}
							if (this.moduleGroup === "G6") {
								this.getCharts(newValue);
							}
						});
					}
					this.$store.state.loading = false;
				})
				.catch((res) => {
					console.log("Config not found...");
					this.$store.state.loading = false;
				});
		},
		setCategoryList(newValue) {
			if (newValue === "ministrialModule") {
				Object.keys(this.moduleConfig).forEach((c) => {
					if (c.toLowerCase() !== "summary") {
						let translatedText = c;
						switch (c) {
							case "Volume":
								translatedText = this.$i18n.t("Volume");
								break;
							case "coverage":
								translatedText = this.$i18n.t("volume_cyp");
								break;
							case "stockOut":
								translatedText = this.$i18n.t("stockOut");
								break;
							case "program":
								translatedText = this.$i18n.t("program");
								break;
							case "reportingRate":
								translatedText = this.$i18n.t("Reporting Rate");
								break;
							case "RMNCH":
								translatedText = this.$i18n.t("RMNCH");
								break;
						}
						this.categoryList.push({
							value: c,
							text: translatedText,
						});
					}
				});
			} else if (newValue === "adBarrierModule") {
				Object.keys(this.moduleConfig).forEach((c) => {
					Object.keys(this.moduleConfig[c]).forEach((subC) => {
						if (subC !== "Background_Data" && subC !== "Category_Data") {
							let translatedText = subC;
							switch (subC) {
								case "Accessibility":
									translatedText = this.$i18n.t("access");
									break;
								case "Services":
									translatedText = this.$i18n.t("insertion_Removal");
									break;
								case "Stock":
									translatedText = this.$i18n.t("stock");
									break;
							}
							this.categoryList.push({
								value: `${c}-${subC}`,
								text: translatedText,
							});
						}
					});
				});
			} else {
				Object.keys(
					this.moduleConfig[this.selectedModule.split("-")[2]]
				).forEach((subC) => {
					if (
						subC !== "Background_Data" &&
						subC !== "Category_Data" &&
						subC !== "PPFP_Service_Provider"
					) {
						if (this.selectedModule.split("-")[2] === "external_validation") {
							if (
								subC === "Injectable" ||
								subC ===
									this.moduleConfig[this.selectedModule.split("-")[2]]
										.Background_Data.selectedMethod
							) {
								this.categoryList.push({
									value: `${this.selectedModule.split("-")[2]}-${subC}`,
									text: this.$i18n.t(`${subC}`),
								});
							}
						} else {
							let translatedText = subC;
							switch (subC) {
								case "Comparing_PPFP_Uptake":
									translatedText = this.$i18n.t("Comparing PPFP Uptake");
									break;
								case "Trends_in_PPFP_Uptake":
									translatedText = this.$i18n.t("Trends in PPFP Uptake");
									break;
								case "PPFP_Continuum":
									translatedText = this.$i18n.t("PPFP_Conti");
									break;
								case "Overall_PPFP_Use":
									translatedText = this.$i18n.t("overall_PPFP_use");
									break;
								case "Comparing_PPFP_Method":
									translatedText = this.$i18n.t("comparing_PPFP_Method");
									break;
								case "PPFP_Service_Provider":
									translatedText = this.$i18n.t("PPFP_ServiceProvider");
									break;
								case "Youth":
									translatedText = this.$i18n.t("youth");
									break;
								case "Adolescent_Pregnancy":
									translatedText = this.$i18n.t("adolescentPregnancy");
									break;
								case "Youth_NoMethod":
									translatedText = this.$i18n.t("youthNoMethod");
									break;
								case "Youth_Availability":
									translatedText = this.$i18n.t("youthAvailability");
									break;
							}
							this.categoryList.push({
								value: `${this.selectedModule.split("-")[2]}-${subC}`,
								text: translatedText,
							});
						}
					}
				});
			}
			if (this.isEditChart) {
				this.selectedCategory = this.editChartObj.selectedCategory;
			}
		},
		getTranslatedText(rawText) {
			let translatedText = rawText;
			switch (rawText) {
				case "Visits":
					translatedText = this.$i18n.t("visits");
					break;
				case "Commodities_Client":
					translatedText = this.$i18n.t("Commodities_Client");
					break;
				case "Commodities_Facilities":
					translatedText = this.$i18n.t("Commodities_Facilities");
					break;
				case "User":
					translatedText = this.$i18n.t("users");
					break;
				case "EMU":
					translatedText = this.$i18n.t("EMU");
					break;
				case "Volume":
					translatedText = this.$i18n.t("Volume");
					break;
				case "coverage":
					translatedText = this.$i18n.t("volume_cyp");
					break;
				case "stockOut":
					translatedText = this.$i18n.t("stockOut");
					break;
				case "program":
					translatedText = this.$i18n.t("program");
					break;
				case "reportingRate":
					translatedText = this.$i18n.t("Reporting Rate");
					break;
				case "RMNCH":
					translatedText = this.$i18n.t("RMNCH");
					break;
				case "Accessibility":
					translatedText = this.$i18n.t("access");
					break;
				case "Services":
					translatedText = this.$i18n.t("insertion_Removal");
					break;
				case "Stock":
					translatedText = this.$i18n.t("stock");
					break;
				case "Comparing_PPFP_Uptake":
					translatedText = this.$i18n.t("Comparing PPFP Uptake");
					break;
				case "Trends_in_PPFP_Uptake":
					translatedText = this.$i18n.t("Trends in PPFP Uptake");
					break;
				case "PPFP_Continuum":
					translatedText = this.$i18n.t("PPFP_Conti");
					break;
				case "Overall_PPFP_Use":
					translatedText = this.$i18n.t("overall_PPFP_use");
					break;
				case "Comparing_PPFP_Method":
					translatedText = this.$i18n.t("comparing_PPFP_Method");
					break;
				case "PPFP_Service_Provider":
					translatedText = this.$i18n.t("PPFP_ServiceProvider");
					break;
				case "Youth":
					translatedText = this.$i18n.t("youth");
					break;
				case "Adolescent_Pregnancy":
					translatedText = this.$i18n.t("adolescentPregnancy");
					break;
				case "Youth_NoMethod":
					translatedText = this.$i18n.t("youthNoMethod");
					break;
				case "Youth_Availability":
					translatedText = this.$i18n.t("youthAvailability");
					break;
			}
			return translatedText;
		},
		getReportTemplates() {
			this.isReportsFetched = false;
			let key = this.generateKey("reportTemplates");
			service
				.getSavedConfig(key)
				.then((res) => {
					this.reportTemplates = res.data;
					this.isReportsFetched = true;
				})
				.catch(() => {
					this.isReportsFetched = true;
					console.log("Report templates not found...");
				});
		},
		createTemplateSection() {
			this.resetValues();
			this.$nextTick(() => {
				this.templateSection = true;
			});
		},
		saveReportTemplate() {
			this.$store.state.loading = true;
			this.templateObj.templateId = this.templateObj.templateId
				? this.templateObj.templateId
				: randomString(16);
			this.templateObj.createdAt = this.templateObj.createdAt
				? this.templateObj.createdAt
				: this.$moment(new Date()).format("lll");
			this.templateObj.updatedAt = this.$moment(new Date()).format("lll");
			this.templateObj.createdBy = this.templateObj.createdBy
				? this.templateObj.createdBy
				: `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`;
			let key = this.generateKey("reportTemplates");
			service
				.getSavedConfig(key)
				.then((res) => {
					let reportTemplates = res.data;
					let templateIndex = res.data.findIndex(
						(t) => t.templateId === this.templateObj.templateId
					);
					if (templateIndex >= 0) {
						reportTemplates[templateIndex] = this.templateObj;
					} else {
						reportTemplates = [...res.data, this.templateObj];
					}
					service.updateConfig(reportTemplates, key).then((response) => {
						this.handleResponse(response);
					});
				})
				.catch(() => {
					console.log("Report templates not found, adding new...");
					service.saveConfig([this.templateObj], key).then((response) => {
						this.handleResponse(response);
					});
				});
		},
		handleResponse(response) {
			this.createTemplatePopup = false;
			this.resetValues();
			if (response.data.status === "OK") {
				this.$swal({
					title: this.$i18n.t("data_saved_successfully"),
				});
				this.getReportTemplates();
				this.$store.state.loading = false;
			} else {
				this.$swal({
					title: this.$i18n.t("error"),
					text: `${response.data.message}`,
				});
				this.$store.state.loading = false;
				return;
			}
		},
		resetValues() {
			this.templateObj = originalTemplateObj;
			this.templateSection = false;
			this.addChartSection = false;
			this.isEditChart = false;
		},
		resetChartValues(type = "all") {
			if (type === "category") {
				this.sourceList = [];
				this.selectedSource = null;
				this.chartsList = [];
				this.selectedChart = null;
			} else if (type === "source") {
				this.chartsList = [];
				this.selectedChart = null;
				this.typeList = [];
				this.selectedType = null;
			} else if (type === "type") {
				this.chartsList = [];
				this.selectedChart = null;
			} else if (type === "all") {
				this.categoryList = [];
				this.selectedCategory = null;
				this.sourceList = [];
				this.selectedSource = null;
				this.chartsList = [];
				this.selectedChart = null;
				this.typeList = [];
				this.selectedType = null;
				this.moduleConfig = null;
			}
		},
		deleteTemplate(id) {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					this.$store.state.loading = true;
					let key = this.generateKey("reportTemplates");
					service
						.getSavedConfig(key)
						.then((res) => {
							let reportTemplates = res.data.filter((t) => t.templateId != id);
							service.updateConfig(reportTemplates, key).then((response) => {
								this.handleResponse(response);
							});
						})
						.catch(() => {
							console.log("Error while deleting template...");
							this.$store.state.loading = false;
						});
				}
			});
		},
		editTemplate(id) {
			this.templateObj = this.reportTemplates.find((t) => t.templateId === id);
			this.templateSection = true;
		},
		deleteChartFromTemplate(id) {
			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					this.templateObj.selectedCharts =
						this.templateObj.selectedCharts.filter((c) => c.cid !== id);
				}
			});
		},
		editChartFromTemplate(id) {
			this.isEditChart = true;
			this.addChartSection = true;
			this.editChartObj = this.templateObj.selectedCharts.find(
				(c) => c.cid === id
			);
			if (this.editChartObj) {
				this.selectedModule = this.editChartObj.selectedModule;
			}
		},
		addChartToTemplate() {
			let chart = this.chartsList.find((c) => c.value === this.selectedChart);
			// let isChartFound = this.templateObj.selectedCharts.find(
			//   (c) => c.cid === chart.value
			// );
			// if (isChartFound) {
			//   this.$swal({
			//     text: "Chart Already added",
			//   });
			// } else {}
			let includeLocationPeriod =
				!this.selectedModule.includes("interactive") &&
				!this.selectedModule.includes("emu");
			let chartDetails = {
				selectedModule: this.selectedModule,
				selectedCategory: this.selectedCategory,
				selectedSource: this.selectedSource,
				selectedType: this.selectedType,
				cid: chart.value,
				chartName: chart.text,
				location: includeLocationPeriod ? this.selectedLocation : null,
				periodType: includeLocationPeriod ? this.periodType : null,
				period: includeLocationPeriod ? this.selectedPeriod : null,
			};
			if (this.isEditChart) {
				let chartIndex = this.templateObj.selectedCharts.findIndex(
					(c) => c.cid === chart.value
				);
				this.templateObj.selectedCharts[chartIndex] = chartDetails;
				this.isEditChart = false;
			} else {
				this.templateObj.selectedCharts.push(chartDetails);
			}
			this.cancelAddChart();
		},
		addChart() {
			this.addChartSection = true;
		},
		cancelAddChart() {
			this.resetChartValues("all");
			this.setLocation();
			this.setPeriod();
			this.isEditChart = false;
			this.selectedModule = null;
			this.addChartSection = false;
		},
		setLocation() {
			let { locationID, levelID } = service.getAllowedLocation();
			this.selectedLocation = levelID + "/" + locationID;
		},
		setPeriod(type) {
			let period = this.$store.getters.getGlobalFactors().period.Period;
			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(period.backtrackedMonth * 1, "months")
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(period.backtrackedYearLimit * 1, "years")
				.format("YYYY-MM");
			let currentYear = this.$moment(currentDate, "YYYY").format("YYYY");
			let finalYear = this.$moment(currentFinalDate, "YYYY").format("YYYY");
			if (type === "monthly") {
				this.selectedPeriod = [currentDate, currentDate];
				this.allowedStartDate = period ? currentDate : null;
				this.allowedFinalDate = period ? currentFinalDate : null;
			} else if (type === "yearly") {
				this.selectedPeriod = [currentYear, currentYear];
			} else {
				let currentMonth = new Date(currentDate).getMonth() + 1;
				let currentQuarter = Math.ceil(currentMonth / 3);
				if (type === "financialYear" || type === "financialYearJuly") {
					if (currentMonth <= 4) {
						currentYear = currentYear * 1 - 1;
					}
				}
				for (let i = currentYear; i >= finalYear; i--) {
					if (type === "financialYear") {
						let months =
							this.$i18n.locale === "fr" ? ["avril", "mars"] : ["Apr", "Mar"];
						this.periodList.push({
							text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
							value: `${i}April`,
						});
						this.selectedPeriod = [`${currentYear}April`];
					}

					if (type === "financialYearJuly") {
						let months =
							this.$i18n.locale === "fr" ? ["juin", "juil."] : ["Jun", "Jul"];
						this.periodList.push({
							text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
							value: `${i}July`,
						});
						this.selectedPeriod = [`${currentYear}July`];
					}

					if (type === "quarterly") {
						let years = {
							Q1: ["Jan", "Mar"],
							Q2: ["Apr", "Jun"],
							Q3: ["Jul", "Sep"],
							Q4: ["Oct", "Dec"],
						};
						if (this.$i18n.locale === "fr") {
							years = {
								Q1: ["janv.", "mars"],
								Q2: ["avril", "juin"],
								Q3: ["juil.", "sept."],
								Q4: ["oct.", "déc."],
							};
						}

						if (i === currentYear) {
							for (let j = currentQuarter; j >= 1; j--) {
								this.periodList.push({
									value: `${i}Q${j}`,
									text: years[`Q${j}`][0] + " - " + years[`Q${j}`][1] + " " + i,
								});
							}
						} else {
							for (let j = 4; j >= 1; j--) {
								this.periodList.push({
									value: `${i}Q${j}`,
									text: years[`Q${j}`][0] + " - " + years[`Q${j}`][1] + " " + i,
								});
							}
						}
						this.selectedPeriod = [`${currentYear}Q${currentQuarter}`];
					}
				}
			}
		},
	},
	created() {
		this.modulesList = [
			{
				value: "interactive-G6",
				text: this.$i18n.t("saved"),
			},
			{ value: "ministrialModule-G1", text: this.$i18n.t("ministerial") },
			{
				value: "adGeographicalModule-G3",
				text: this.$i18n.t("gPro_tab"),
			},
			{
				value: "adBarrierModule-G2",
				text: this.$i18n.t("barriers_enablers_tab"),
			},
			{
				value: "adProgramModule-G2-programPriorities",
				text: this.$i18n.t("proPrio"),
			},
			{
				value: "adProgramModule-G2-youth",
				text: this.$i18n.t("proPrio") + " - " + this.$i18n.t("youth"),
			},
			{
				value: "dqrModule-G5-emu_monthly",
				text:
					this.$i18n.t("benchmarking") + " - " + this.$i18n.t("emu_monthly"),
			},
			{
				value: "dqrModule-G5-emu",
				text: this.$i18n.t("benchmarking") + " - " + this.$i18n.t("emuAnnual"),
			},
			{
				value: "dqrModule-G4-reportingRate",
				text: this.$i18n.t("compTime"),
			},
			{
				value: "dqrModule-G3-internal_validations",
				text: this.$i18n.t("in_Consistency"),
			},
			{
				value: "dqrModule-G2-external_validation",
				text: this.$i18n.t("internalConsistencyCorrelation_tab"),
			},
		];

		this.periodTypeList = [
			{ value: "monthly", text: this.$i18n.t("monthly") },
			{ value: "quarterly", text: this.$i18n.t("quarterly") },
			{ value: "yearly", text: this.$i18n.t("yearly") },
		];
		if (this.$store.state.financialYear.includes("April")) {
			this.periodTypeList.push({
				value: "financialYear",
				text: this.$i18n.t("financialYear"),
			});
		}
		if (this.$store.state.financialYear.includes("July")) {
			this.periodTypeList.push({
				value: "financialYearJuly",
				text: this.$i18n.t("financialYearJuly"),
			});
		}
		this.setLocation();
		this.periodType = "monthly";
		if (this.$i18n.locale === "fr") {
			this.financialYearsText = ["mars", "avril"];
			this.financialYearsjulyText = ["juin", "juil."];
			this.quartersText = {
				Q1: ["janv.", "mars"],
				Q2: ["avril", "juin"],
				Q3: ["juil.", "sept."],
				Q4: ["oct.", "déc."],
			};
			this.lang = {
				formatLocale: {
					monthsShort: [
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
					],
					// janv.	févr.	mars	avril	mai	juin	juil.	août	sept.	oct.	nov.	déc.
					//https://web.library.yale.edu/cataloging/months get abbrevation from here for othe locales
				},
			};
		}
		this.getReportTemplates();
	},
};
</script>
<style scoped lang="scss">
.timeFrequenncyDropdown {
	.b-dropdown-form {
		max-height: 200px;
		overflow-y: auto;
	}
}
#dropdown-dropup__BV_button_ {
	color: #616161 !important;
	text-align: left !important;
}
</style>
