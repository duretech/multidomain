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
				<div class="form-group pr-3">
					<label class="text-center">{{ $t("location") }}</label>
					<treeselect
						class="form-control"
						:options="options"
						:show-count="true"
						:placeholder="$t('search')"
						v-model="value"
						:flat="false"
						:default-expand-level="defaultExpandLevel"
						:disabled="scorecardDataFetching"
						:load-options="loadOptions"
					/>
				</div>
				<div class="form-group pr-3 d-none">
					<label class=""
						>{{ $t("period") }} {{ $t("type") }}</label
					>
					<div class="select-wrapper">
						<select
							class="form-control tabbarselect"
							v-model="pType"
							:disabled="scorecardDataFetching"
						>
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
				<div
					class="form-group pr-3 toolbarDropdown"
					v-if="activeTab != 'emuMonthlyTab' && activeTab != 'emuAnnualTab'"
				>
					<label class="text-capitalize text-center">{{ $t("period") }} </label>
					<date-picker
						v-model="monthYear"
						type="month"
						value-type="format"
						format="YYYY-MM"
						class="form-control"
						:lang="lang"
						v-if="pType === 'monthly'"
						:disabled-date="disableDate"
						:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
					></date-picker>
					<b-dropdown
						id="dropdown-dropup"
						ref="dropdown"
						dropup
						:text="periodText"
						class="form-control p-0"
						variant="link"
						toggle-class="color-white"
						v-else
					>
						<b-dropdown-form>
							<b-form-group>
								<b-form-radio-group
									v-model="monthYear"
									:options="periodOptions"
									name="period"
									stacked
									:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
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
						:disabled="scorecardDataFetching"
						v-b-tooltip.hover
						:title="$t('Monthly_view')"
						><div v-if="pType === 'monthly'">
							{{ $t("Monthly_view") }}
						</div>
						<div v-else>{{ $t("M") }}</div></b-button
					>
				</div>
				<div
					class="form-group pr-3"
					v-if="actTab === 'reportingRate' && reportingSourceAvailable.length"
				>
					<label class="">{{ $t("dashboardIndicator") }}</label>
					<div class="select-wrapper">
						<select
							v-if="actTab === 'reportingRate'"
							class="form-control tabbarselect"
							v-model="initialReportingSource"
						>
							<option
								value="Commodities_Client"
								v-if="reportingSourceAvailable.includes('Commodities_Client')"
							>
								{{ $t("commoditiesClients") }}
							</option>
							<option
								value="Commodities_Facilities"
								v-if="
									reportingSourceAvailable.includes('Commodities_Facilities')
								"
							>
								{{ $t("commoditiesFacilities") }}
							</option>
							<option
								value="Visits"
								v-if="reportingSourceAvailable.includes('Visits')"
							>
								{{ $t("visits") }}
							</option>
							<option
								value="User"
								v-if="reportingSourceAvailable.includes('User')"
							>
								{{ $t("user") }}
							</option>
							<option
								value="Overall"
								v-if="reportingSourceAvailable.includes('Overall')"
							>
								{{ $t("overall") }}
							</option>
						</select>
					</div>
				</div>
				<div
					class="form-group pr-3"
					v-if="
						actTab === 'internal_validations' && internalSourceAvailable.length
					"
				>
					<label class="">{{ $t("dashboardIndicator") }}</label>
					<div class="select-wrapper">
						<select
							v-if="actTab === 'internal_validations'"
							class="form-control tabbarselect"
							v-model="initialInternalSource"
						>
							<option
								value="Commodities_Client"
								v-if="internalSourceAvailable.includes('Commodities_Client')"
							>
								{{ $t("commoditiesClients") }}
							</option>
							<option
								value="Commodities_Facilities"
								v-if="
									internalSourceAvailable.includes('Commodities_Facilities')
								"
							>
								{{ $t("commoditiesFacilities") }}
							</option>
							<option
								value="Visits"
								v-if="internalSourceAvailable.includes('Visits')"
							>
								{{ $t("visits") }}
							</option>
							<option
								value="User"
								v-if="internalSourceAvailable.includes('User')"
							>
								{{ $t("user") }}
							</option>
						</select>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
/*eslint no-undef: "error"*/
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
	props: [
		"defaultYear",
		"emuYears",
		"methods",
		"reportingSource",
		"internalSource",
		"locationValue",
		"period",
		"disableLocation",
		"disableSource",
		"drilldownLocation",
		"summaryLocation",
		"summaryPeriod",
		"activeTab",
		"globalPeriodData",
		"showToolbarOnTablet",
		"periodType",
		"reportingSourceAvailable",
		"internalSourceAvailable",
		"scorecardDataFetching",
	],
	components: {
		Treeselect,
		DatePicker,
	},
	mixins: [loadLocChildMixin],
	data() {
		//console.log(this.defaultYear)
		let period = this.globalPeriodData;
		let d = new Date();
		let currentDate = this.$moment(d, "YYYYMM")
			.subtract(period.backtrackedMonth * 1, "months")
			.format("YYYY-MM");
		let currentFinalDate = this.$moment(currentDate, "YYYYMM")
			.subtract(period.backtrackedYearLimit * 1, "years")
			.format("YYYY-MM");
		// console.log("currentFinalDate", currentFinalDate)

		return {
			monthYear: this.$moment(this.period, "YYYYMM").format("YYYY-MM"),
			// allowedStartDate: period ? period.backtrackedDate : null,
			// allowedFinalDate: period ? period.backtrackedLimitedDate : null,
			// monthYear: new Date(period.backtrackedDate),
			// allowedStartDate: period ? new Date(period.backtrackedDate): null,
			allowedStartDate: period ? currentDate : null,
			// allowedFinalDate: period ? new Date(period.backtrackedLimitedDate): null,
			allowedFinalDate: period ? currentFinalDate : null,
			initialReportingSource: this.reportingSource,
			initialInternalSource: this.internalSource,
			actTab: this.activeTab,
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
			defaultExpandLevel: 1,
			options: [],
			value: null,
			firstTime: true,
			selected: null,
			emuYear: this.defaultYear,
			isEmit: true,
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
			pType: this.periodType,
			periodText: "",
			periodOptions: [],
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
		internalSource(newVal) {
			if (newVal) {
				this.initialInternalSource = newVal;
			}
		},
		reportingSource(newVal) {
			if (newVal) {
				this.initialReportingSource = newVal;
			}
		},
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
				// let period = this.globalPeriodData
				this.monthYear = currentYear;
			}

			if (newVal === "financialYear" || newVal === "financialYearJuly") {
				let yearsText =
					newVal === "financialYear"
						? this.financialYearsText
						: this.financialYearsjulyText;
				// let period = this.globalPeriodData

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
				// let period = this.globalPeriodData
				// let currentYear = this.$moment(new Date(period.backtrackedDate), 'YYYY').format('YYYY')
				// let finalYear = this.$moment(new Date(period.backtrackedLimitedDate), 'YYYY').format('YYYY')
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
			// console.log(this.perioperiodOptions)
			// console.log(this.monthYear)
			// this.$emit('period', this.monthYear, this.value, this.options, newVal)
		},
		methods(newValue) {
			if (newValue) {
				this.selected = newValue[0]["children"][0]["id"];
			}
		},
		defaultYear(newValue) {
			if (newValue) {
				// console.log(newValue)
			}
		},
		emuYear(newValue) {
			if (newValue) {
				this.$emit("emuYear", newValue);
			}
		},
		activeTab(newValue) {
			if (newValue) {
				this.actTab = newValue;
			}
		},
		summaryLocation(newValue) {
			if (newValue) {
				this.value = newValue;
			}
		},
		summaryPeriod(newValue) {
			if (newValue) {
				this.monthYear = new Date(newValue);
			}
		},
		drilldownLocation(newValue) {
			if (newValue) {
				this.value = newValue;
			}
		},
		// locationValue(newValue) {
		//   if (newValue) {
		//     this.value = newValue
		//   }
		// },
		value(newValue) {
			if (newValue) {
				if (!this.firstTime) {
					this.$emit("location", newValue, this.options);
				} else {
					this.firstTime = false;
				}
			}
		},
		selected(newValue) {
			``;
			if (newValue) {
				this.$emit("method", newValue);
			}
		},
		monthYear(newValue, oldValue) {
			if(newValue) {
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
							this.$emit("period", newValue, this.pType);
						} else {
							this.isEmit = true;
						}
					}
				} else {
					this.$emit("period", newValue, this.pType);
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
		// period(newValue) {
		//   if (newValue) {
		//     this.monthYear = this.$moment(newValue, 'YYYYMM').format('YYYY-MM')
		//   }
		// },
		initialReportingSource(newValue) {
			if (newValue) {
				this.$emit("source", newValue, this.actTab);
			}
		},
		initialInternalSource(newValue) {
			if (newValue) {
				this.$emit("source", newValue, this.actTab);
			}
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
	},
	created() {
		this.options = JSON.parse(
			JSON.stringify(this.$store.getters.getLocationList)
		);
		this.value = this.locationValue;

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
.form-control:disabled {
	opacity: 0.8 !important;
}
.indicatortext {
	display: flex;
}
</style>