<template>
	<div
		class="container-fluid bottom-tabbar"
		:class="{ active: showToolbarOnTablet }"
	>
		<div class="bottom-tabbar-close" @click="closeToolbar">
			<i class="far fa-times-circle"></i>
		</div>
		<div class="bottom_toolbar_wrap">
			<form class="input-select-items">
				<div class="form-group pr-3 fptool">
					<label class="text-capitalize text-center loc-title">{{
						$t("location")
					}}</label>
					<treeselect
						class="form-control"
						:options="options"
						:show-count="true"
						:load-options="loadOptions"
						:placeholder="$t('search')"
						v-model="value"
						:flat="false"
						:default-expand-level="defaultExpandLevel"
						
					/>
				</div>
				<div class="form-group pr-3 d-none">
					<label class="text-capitalize"
						>{{ $t("period") }} {{ $t("type") }}</label
					>
					<div class="select-wrapper">
						<select class="form-control tabbarselect" v-model="pType">
							<option value="monthly">{{ $t("monthly") }}</option>
							<option value="quarterly">{{ $t("quarterly") }}</option>
							<option value="yearly">{{ $t("yearly") }}</option>
							<option
								value="financialYear"
								v-if="$store.state.financialYear.includes('April')"
							>
								{{ $t("financialYear") }}
							</option>
							<option
								value="financialYearJuly"
								v-if="$store.state.financialYear.includes('July')"
							>
								{{ $t("financialYearJuly") }}
							</option>
						</select>
					</div>
				</div>
				<div class="form-group pr-2 toolbarDropdown fptool">
					<label class="text-capitalize text-center loc-title"
						>{{ $t("period") }}
					</label>
					<date-picker
						v-model="monthYear"
						type="month"
						value-type="format"
						format="YYYY-MM"
						class="form-control"
						:lang="lang"
						v-if="pType === 'monthly'"
						:disabled-date="disableDate"
					></date-picker>
					<date-picker
						v-model="monthYear"
						type="year"
						value-type="format"
						format="YYYY"
						class="form-control"
						:lang="lang"
						v-else-if="pType === 'yearly'"
						:disabled-date="disableDate"
					></date-picker>
					<b-dropdown
						id="dropdown-dropup"
						ref="dropdown"
						dropup
						:text="periodText"
						class="form-control p-0"
						variant="link"
						toggle-class="color-white"
						menu-class="timeFrequenncyDropdown"
						v-else
					>
						<b-dropdown-form>
							<b-form-group>
								<b-form-radio-group
									v-model="monthYear"
									:options="periodOptions"
									name="period"
									stacked
								></b-form-radio-group>
							</b-form-group>
						</b-dropdown-form>
					</b-dropdown>
				</div>
				<div class="pr-3 d-flex justify-content-center align-items-end yearBtn">
					<b-button
						v-if="$store.state.financialYear.includes('April')"
						class="views-btn-footer mx-2 fs-17-1920"
						:class="{ 'onclick-btn-footer': pType === 'financialYear' }"
						@click="pType = 'financialYear'"
						v-b-tooltip.hover
						:title="$t('financialYear')"
						><div v-if="pType === 'financialYear'">
							{{ $t("financialYear") }}
						</div>
						<div v-else>FY(Apr)</div></b-button
					>
					<b-button
						v-if="$store.state.financialYear.includes('July')"
						class="views-btn-footer mx-2 fs-17-1920"
						:class="{ 'onclick-btn-footer': pType === 'financialYearJuly' }"
						@click="pType = 'financialYearJuly'"
						v-b-tooltip.hover
						:title="$t('financialYearJuly')"
						><div v-if="pType === 'financialYearJuly'">
							{{ $t("financialYearJuly") }}
						</div>
						<div v-else>FY(Jul)</div></b-button
					>
					<b-button
						class="views-btn-footer mx-2 fs-17-1920"
						:class="{ 'onclick-btn-footer': pType === 'yearly' }"
						@click="pType = 'yearly'"
						v-b-tooltip.hover
						:title="$t('Yearly_view')"
						><div v-if="pType === 'yearly'">
							{{ $t("Yearly_view") }}
						</div>
						<div v-else>{{ $t("Y") }}</div></b-button
					>
					<b-button
						class="views-btn-footer mx-2 fs-17-1920"
						:class="{ 'onclick-btn-footer': pType === 'quarterly' }"
						@click="pType = 'quarterly'"
						v-b-tooltip.hover
						:title="$t('Quaterly_view')"
						><div v-if="pType === 'quarterly'">
							{{ $t("Quaterly_view") }}
						</div>
						<div v-else>{{ $t("Q") }}</div></b-button
					>
					<b-button
						class="views-btn-footer mx-2 fs-17-1920"
						:class="{ 'onclick-btn-footer': pType === 'monthly' }"
						@click="pType = 'monthly'"
						v-b-tooltip.hover
						:title="$t('Monthly_view')"
						><div v-if="pType === 'monthly'">
							{{ $t("Monthly_view") }}
						</div>
						<div v-else>{{ $t("M") }}</div></b-button
					>
				</div>
				<div class="form-group pr-3">
					<div
						class="key-indicators"
						v-if="$route.name === 'summary-dashboard' && !inAnalytical"
					>
						<p class="view-title fs-15-1920">
							{{ $t("view_key_indicators_variations") }}
						</p>
						<div class="tr-checkboxes px-4 fs-15-1920">
							<b-form-checkbox
								class="pr-3 fs-15-1920"
								id="checkbox-trends"
								name="checkbox-trends"
								:value="true"
								v-model="trendCharts"
							>
								{{ $t("trends") }}
							</b-form-checkbox>
							<b-form-checkbox
								class="fs-15-1920"
								id="checkbox-regional"
								name="checkbox-regional"
								:value="true"
								v-model="regionalCharts"
							>
								{{ $t("regional") }}
							</b-form-checkbox>
						</div>
					</div>
				</div>
				<div
					class="form-group pr-3 d-none"
					v-if="(dashboardchartholder || dashboardchartholder1) && layoutView"
				>
					<label class="text-uppercase">{{ $t("view") }} </label>
					<div class="view-icons form-control">
						<a
							class="view_option col px-0 text-center cursor-pointer position-relative"
							@click="setView('col-12')"
							:class="{ active: defaultView === 'col-12' }"
							style="border-right: 1px solid #939393"
						>
							<img
								:src="require('@/assets/img/toolbar/wide_active.svg')"
								alt="wide"
								class="mr-1"
							/>
							{{ $t("wide") }}
							<img
								:src="require('@/assets/img/toolbar/selected.svg')"
								alt="tick"
								class="position-absolute"
								v-if="defaultView === 'col-12'"
								style="top: -5px; left: 20px"
							/>
						</a>
						<a
							class="view_option col px-0 text-center cursor-pointer position-relative"
							@click="setView('col-6 grid-view-card')"
							:class="{ active: defaultView === 'col-6 grid-view-card' }"
							style="border-left: 1px solid #939393"
						>
							<img
								:src="require('@/assets/img/toolbar/grid_active.svg')"
								alt="grid"
								class="mr-1"
							/>
							{{ $t("grid") }}
							<img
								:src="require('@/assets/img/toolbar/selected.svg')"
								alt="tick"
								class="position-absolute"
								v-if="defaultView === 'col-6 grid-view-card'"
								style="top: -5px; left: 20px"
							/>
						</a>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
	props: [
		"drilldownLocation",
		"dashboardchartholder",
		"dashboardchartholder1",
		"layoutView",
		"globalPeriodData",
		"showToolbarOnTablet",
		"periodType",
		"inAnalytical",
	],
	components: {
		Treeselect,
		DatePicker,
	},
	mixins: [loadLocChildMixin],
	data() {
		let period = this.globalPeriodData;
		let d = new Date();
		let currentDate = this.$moment(d, "YYYYMM")
			.subtract(period.backtrackedMonth * 1, "months")
			.format("YYYY-MM");
		let currentFinalDate = this.$moment(currentDate, "YYYYMM")
			.subtract(period.backtrackedYearLimit * 1, "years")
			.format("YYYY-MM");
		return {
			source: "NA",
			monthYear: currentDate,
			allowedStartDate: period ? currentDate : null,
			allowedFinalDate: period ? currentFinalDate : null,
			locationList: [],
			location: "",
			yearString: "",
			year: "",
			month: "",
			monthName: "",
			defaultExpandLevel: 1,
			period: [],
			level: "",
			multiple: false,
			clearable: true,
			searchable: false,
			disabled: false,
			openOnClick: true,
			openOnFocus: false,
			clearOnSelect: true,
			closeOnSelect: false,
			alwaysOpen: true,
			appendToBody: false,
			options: [],
			value: null,
			defaultView: this.layoutView,
			isEmit: true,
			// pType: this.periodType,
			pType: "",
			periodOptions: [],
			periodText: "",
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
			financialYearsText: ["Mar", "Apr"],
			financialYearsjulyText: ["Jun", "Jul"],
			quartersText: {
				Q1: ["Jan", "Mar"],
				Q2: ["Apr", "Jun"],
				Q3: ["Jul", "Sep"],
				Q4: ["Oct", "Dec"],
			},
		};
	},
	watch: {
		pType(newVal) {
			this.periodOptions = [];
			let period = this.globalPeriodData;
			let d = new Date();
			let currentDate = this.$moment(d, "YYYYMM")
				.subtract(period.backtrackedMonth * 1, "months")
				.format("YYYY-MM");
			let currentFinalDate = this.$moment(currentDate, "YYYYMM")
				.subtract(period.backtrackedYearLimit * 1, "years")
				.format("YYYY-MM");
			let currentYear = this.$moment(currentDate, "YYYY").format("YYYY");
			let finalYear = this.$moment(currentFinalDate, "YYYY").format("YYYY");
			if (newVal === "monthly") {
				this.monthYear = currentDate;
				this.allowedStartDate = period ? currentDate : null;
				this.allowedFinalDate = period ? currentFinalDate : null;
			}

			if (newVal === "yearly") {
				this.monthYear = currentYear;
			}

			if (newVal === "financialYear" || newVal === "financialYearJuly") {
				let yearsText =
					newVal === "financialYear"
						? this.financialYearsText
						: this.financialYearsjulyText;

				for (let i = currentYear - 1; i >= finalYear; i--) {
					this.periodOptions.push({
						text: `${yearsText[1]} ${i} - ${yearsText[0]} ${i + 1}`,
						value: newVal === "financialYear" ? `${i}` : `${i}July`,
					});
				}
				this.monthYear =
					newVal === "financialYear"
						? `${currentYear - 1}`
						: `${currentYear - 1}July`;
				this.periodText = `${yearsText[1]} ${currentYear - 1} - ${
					yearsText[0]
				} ${currentYear}`;
			}

			if (newVal === "quarterly") {
				let currYear = new Date().getFullYear(),
					currentMonth = new Date().getMonth() + 1;
				let currentQuarter = Math.ceil(currentMonth / 3);
				let quarterLimit =
					currentYear * 1 === currYear * 1 ? currentQuarter : 4;
				for (let i = currentYear; i >= finalYear; i--) {
					let quarterLimit = i * 1 === currYear * 1 ? currentQuarter : 4;
					for (let j = quarterLimit; j >= 1; j--) {
						this.periodOptions.push({
							value: `${i}Q${j}`,
							text:
								this.quartersText[`Q${j}`][0] +
								" - " +
								this.quartersText[`Q${j}`][1] +
								" " +
								i,
						});
					}
				}
				this.monthYear = `${currentYear}Q${quarterLimit}`;
				this.periodText =
					this.quartersText[`Q${quarterLimit}`][0] +
					" - " +
					this.quartersText[`Q${quarterLimit}`][1] +
					" " +
					currentYear;
			}
			// this.$emit('period', this.monthYear, this.value, this.options, newVal)
		},
		drilldownLocation(newValue) {
			if (newValue) {
				this.value = newValue;
			}
		},
		value(newValue) {
			if (newValue) {
				this.$emit(
					"location",
					this.monthYear,
					newValue,
					this.options,
					this.pType
				);
			}
		},
		monthYear(newValue, oldValue) {
			if (newValue) {
				if (this.pType === "monthly") {
					let newDate = this.$moment(newValue, "YYYYMM").format("YYYYMM"),
						allowedStartDate = this.$moment(
							this.allowedStartDate,
							"YYYYMM"
						).format("YYYYMM"),
						allowedFinalDate = this.$moment(
							this.allowedFinalDate,
							"YYYYMM"
						).format("YYYYMM");

					if (newDate > allowedStartDate || newDate < allowedFinalDate) {
						this.$swal({
							html:
								'<b class="text-center">' +
								this.$i18n.t("periodRange") +
								"<br/> (" +
								this.globalPeriodData.yearRange +
								")</b>",
						}).then((result) => {
							if (result.value) {
								this.monthYear = oldValue;
								this.isEmit = false;
							}
						});
					} else {
						if (this.isEmit) {
							this.$emit(
								"period",
								newValue,
								this.value,
								this.options,
								this.pType
							);
						} else {
							this.isEmit = true;
						}
					}
				} else {
					this.$emit("period", newValue, this.value, this.options, this.pType);
					if (
						this.pType === "quarterly" ||
						this.pType === "financialYear" ||
						this.pType === "financialYearJuly"
					) {
						this.setPeriodText(newValue);
					}
				}
			}
		},
	},
	computed: {
		trendCharts: {
			get() {
				return this.dashboardchartholder;
			},
			set(value) {
				this.$emit("update:dashboardchartholder", value);
			},
		},
		regionalCharts: {
			get() {
				return this.dashboardchartholder1;
			},
			set(value) {
				this.$emit("update:dashboardchartholder1", value);
			},
		},
	},
	methods: {
		setPeriodText(newValue) {
			if (this.pType === "quarterly") {
				let q = newValue.split("Q");
				this.periodText =
					this.quartersText[`Q${q[1]}`][0] +
					" - " +
					this.quartersText[`Q${q[1]}`][1] +
					" " +
					q[0];
			}
			if (
				this.pType === "financialYear" ||
				this.pType === "financialYearJuly"
			) {
				let yearsText =
					this.pType === "financialYear"
						? this.financialYearsText
						: this.financialYearsjulyText;
				let p =
					this.pType === "financialYear" ? newValue : newValue.split("July")[0];
				this.periodText = `${yearsText[1]} ${p} - ${yearsText[0]} ${p * 1 + 1}`;
			}

			if (this.$refs.dropdown) {
				this.$refs.dropdown.hide();
			}
		},
		disableDate(date) {
			let format = this.pType == "yearly" ? "YYYY" : "YYYYMM";
			let dStart = this.$moment(this.allowedStartDate, format).format(format);
			let dEnd = this.$moment(this.allowedFinalDate, format).format(format);
			let d1 = this.$moment(date, format).format(format);
			return d1 < dEnd || d1 > dStart;
		},
		closeToolbar() {
			this.$emit("closeToolbar");
		},
		setView(newValue) {
			this.defaultView = newValue;
			this.$emit("view", newValue);
		},
		getConfigAccess() {
			let { locationID, levelID } = service.getAllowedLocation();
			this.location = locationID;
			this.level = levelID;
			this.options = JSON.parse(
				JSON.stringify(this.$store.getters.getLocationList)
			);
			this.value = this.level + "/" + this.location;
		},
	},
	created() {
		this.pType = this.periodType;
		this.getConfigAccess();

		if (this.$i18n.locale === "fr") {
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
			this.financialYearsText = ["mars", "avril"];
			this.financialYearsjulyText = ["juin", "juil."];
			this.quartersText = {
				Q1: ["janv.", "mars"],
				Q2: ["avril", "juin"],
				Q3: ["juil.", "sept."],
				Q4: ["oct.", "déc."],
			};
		}
	},
};
</script>
<style lang="scss" scoped>
.bottom-tabbar {
	z-index: 999;
}
</style>
