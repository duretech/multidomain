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
				<div class="form-group pr-3" v-if="showLocation">
					<label class="fs-15-1920 text-center">{{ $t("location") }}</label>
					<treeselect
						class="form-control fs-15-1920"
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
					<label class="fs-15-1920"
						>{{ $t("period") }} {{ $t("type") }}</label
					>
					<div class="select-wrapper">
						<select class="form-control tabbarselect" v-model="pType">
							<option class="fs-15-1920" value="monthly">
								{{ $t("monthly") }}
							</option>
							<option class="fs-15-1920" value="quarterly">
								{{ $t("quarterly") }}
							</option>
							<option class="fs-15-1920" value="yearly">
								{{ $t("yearly") }}
							</option>
							<option
								class="fs-15-1920"
								value="financialYear"
								v-if="$store.state.financialYear.includes('April')"
							>
								{{ $t("financialYear") }}
							</option>
							<option
								class="fs-15-1920"
								value="financialYearJuly"
								v-if="$store.state.financialYear.includes('July')"
							>
								{{ $t("financialYearJuly") }}
							</option>
						</select>
					</div>
				</div>
				<div class="form-group pr-3 toolbarDropdown">
					<label class="fs-15-1920">{{ $t("period") }}</label>
					<date-picker
						v-model="filterPeriod"
						:range="true"
						type="month"
						value-type="format"
						format="YYYY-MM"
						class="form-control fs-15-1920"
						:lang="lang"
						v-if="pType === 'monthly'"
						:disabled-date="disableDate"
					></date-picker>
					<date-picker
						v-model="filterPeriod"
						:range="true"
						type="year"
						value-type="format"
						format="YYYY"
						class="form-control fs-15-1920"
						:lang="lang"
						v-else-if="pType === 'yearly'"
						:disabled-date="disableDate"
					></date-picker>
					<b-dropdown
						id="dropdown-dropup"
						dropup
						:text="periodText"
						class="form-control p-0 fs-15-1920"
						variant="link"
						toggle-class="color-white"
						v-else
					>
						<b-dropdown-form>
							<b-form-group>
								<b-form-checkbox-group
									v-model="filterPeriod"
									:options="periodOptions"
									name="period"
									stacked
								></b-form-checkbox-group>
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
				<div class="form-group pr-3 d-none">
					<label class="text-uppercase">{{ $t("period") }} </label>
					<date-picker
						v-model="monthYear"
						type="month"
						value-type="format"
						format="YYYY-MM"
						class="form-control fs-15-1920"
						:lang="lang"
					></date-picker>
				</div>
				<b-button
					class="applyBtn btn btn-sm fs-15-1920"
					style="
						height: 38px;
						margin-top: 21px;
						background-color: #cfcfcf;
						border: none;
					"
					@click.prevent.stop="sendDetails"
					v-if="value && period"
					:disabled="value.length === 0 && period.length === 0"
					>{{ $t("apply") }}</b-button
				>
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
		"locationValue",
		"period",
		"showLocation",
		"globalPeriodData",
		"showToolbarOnTablet",
	],
	components: {
		Treeselect,
		DatePicker,
	},
	mixins: [loadLocChildMixin],
	data() {
		// console.log(this.$store.getters.getLocationList)
		// console.log(this.period)
		let period = this.globalPeriodData;
		let d = new Date();
		let currentDate = this.$moment(d, "YYYYMM")
			.subtract(period.backtrackedMonth * 1, "months")
			.format("YYYY-MM");
		let currentFinalDate = this.$moment(currentDate, "YYYYMM")
			.subtract(period.backtrackedYearLimit * 1, "years")
			.format("YYYY-MM");
		let type = null;
		if (this.$store.state.appId && this.$store.state.appUserId) {
			type =
				this.$store.state.financialYear.length === 1 &&
				this.$store.state.financialYear.includes("July")
					? "financialYearJuly"
					: "financialYear";
		} else {
			type = "monthly";
		}

		return {
			locList: null,
			periodArr: [],
			pType: type,
			monthYear: currentDate,
			allowedStartDate: period ? currentDate : null,
			allowedFinalDate: period ? currentFinalDate : null,
			filterPeriod: [],
			disabled: false,
			defaultExpandLevel: 1,
			options: [],
			value: null,
			firstTime: true,
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
			periodOptions: [],
			currentYear: period
				? new Date(currentDate).getFullYear()
				: new Date().getFullYear(),
		};
	},
	computed: {
		periodText() {
			return this.filterPeriod.length + " Selected";
		},
	},
	watch: {
		locationValue(newValue) {
			if (newValue) {
				this.value = newValue;
			}
		},
		value(newValue) {
			if (newValue) {
				if (!this.firstTime) {
					this.$emit("location", newValue);
				} else {
					this.firstTime = false;
				}
			}
		},
		monthYear(newValue, oldValue) {
			if(newValue) {
				//console.log(newValue, oldValue);
				let newDate = this.$moment(newValue, "YYYYMM").format("YYYYMM"),
					allowedStartDate = this.$moment(this.allowedStartDate, "YYYYMM").format(
						"YYYYMM"
					),
					allowedFinalDate = this.$moment(this.allowedFinalDate, "YYYYMM").format(
						"YYYYMM"
					);
				if (newDate > allowedStartDate || newDate < allowedFinalDate) {
					this.$swal({
						html:
							'<b class="text-center">' +
							this.$i18n.t("periodRange") +
							"<br/> </b>",
					}).then((result) => {
						if (result.value) {
							this.monthYear = oldValue;
							this.isEmit = false;
						}
					});
				} else {
					if (this.isEmit) {
						this.$emit("period", newValue);
					} else {
						this.isEmit = true;
					}
				}
			}
		},
		pType(newValue) {
			this.periodOptions = [];
			this.filterPeriod = [];
			if (newValue === "financialYear") {
				this.setCurrentPeriod("financialYear");
			} else if (newValue === "financialYearJuly") {
				this.setCurrentPeriod("financialYearJuly");
			} else if (newValue === "quarterly") {
				this.setCurrentPeriod("quarterly");
			} else if (newValue == "monthly") {
				this.setCurrentPeriod("monthly");
			}
		},
	},
	methods: {
		renameKeys(obj) {
			const keyValues = Object.keys(obj)
				.map((key) => {
					let newKey = null,
						newLabel = "";
					if (key === "displayName") {
						newKey = "label";
					} else {
						newKey = key;
					}

					if (key === "children") {
						obj[key] =
							obj[key].length &&
							obj[key]
								.map((obj) => this.renameKeys(obj))
								.sort((a, b) =>
									a.label > b.label ? 1 : a.label < b.label ? -1 : 0
								);
					}
					if (key === "displayName") {
						if (
							obj["organisationUnitGroups"] &&
							obj["organisationUnitGroups"].length
						) {
							//console.log(obj[key])
							if (obj["organisationUnitGroups"][0]) {
								newLabel = `(${obj["organisationUnitGroups"][0].name})`;
							}
							if (obj["organisationUnitGroups"][1]) {
								newLabel = `${newLabel} (${obj["organisationUnitGroups"][1].name})`;
							}

							if (obj["organisationUnitGroups"][2]) {
								newLabel = `${newLabel} (${obj["organisationUnitGroups"][2].name})`;
							}
						}
					}

					return {
						[newKey]:
							key === "displayName"
								? newLabel
									? `${obj[key]} ${newLabel}`
									: obj[key]
								: key === "id"
								? obj.level + "/" + obj.id
								: obj[key],
					};
				})
				.sort((a, b) =>
					a.displayName > b.displayName
						? 1
						: a.displayName < b.displayName
						? -1
						: 0
				);
			return Object.assign({}, ...keyValues);
		},
		disableDate(date) {
			let format = this.pType == "yearly" ? "YYYY" : "YYYYMM";
			let dStart = this.$moment(new Date(), format).format(format);
			let d1 = this.$moment(date, format).format(format);
			return d1 > dStart;
		},
		sendDetails() {
			if (this.pType == "yearly") {
				let lth = this.filterPeriod.length;
				let endYear = this.filterPeriod[lth - 1];
				let totalLength = parseInt(endYear) - parseInt(this.filterPeriod[0]);
				let years = Array.from(
					{ length: totalLength + 1 },
					(value, index) => parseInt(this.filterPeriod[0]) + index
				);

				for (let index = 0; index < years.length; index++) {
					var i = years[index];
					this.periodArr.push({
						text: `${i} - ${i + 1}`,
						value: `${i}`,
					});
				}
			} else if (this.pType == "monthly") {
				if (this.filterPeriod.length > 1) {
					//console.log(this.filterPeriod);
					var dateStart = this.$moment(this.filterPeriod[0]);
					var dateEnd = this.$moment(this.filterPeriod[1]);
					var interim = dateStart.clone();
					var timeValues = [];

					while (
						dateEnd > interim ||
						interim.format("M") === dateEnd.format("M")
					) {
						timeValues.push(interim.format("YYYYMM"));
						interim.add(1, "month");
					}
					let monthArray = timeValues;
					// let start = this.filterPeriod[0];
					// let end = this.filterPeriod[1];

					// let startYear = start.split("-")[0];
					// let endyear = end.split("-")[0];

					// let startMonth = parseInt(start.split("-")[1]);
					// let endMonth = parseInt(end.split("-")[1]);

					// let monthArray = Array.from(
					//   { length: endMonth },
					//   (value, index) => startMonth + index
					// );

					for (let index = 0; index < monthArray.length; index++) {
						// var i = "";
						// if (monthArray[index] > 9) {
						//   i = startYear + monthArray[index];
						// } else {
						//   i = startYear + "0" + monthArray[index];
						// }
						this.periodArr.push({
							text: `${monthArray[index]}`,
							value: `${monthArray[index]}`,
						});
					}
					//console.log(this.periodArr)
				}
			} else if (this.pType === "financialYear") {
				for (let index = 0; index < this.filterPeriod.length; index++) {
					var obj = this.filterPeriod[index].split("A");
					var i = parseInt(obj[0]);
					this.periodArr.push({
						text: `${i} - ${i + 1}`,
						value: `${i}April`,
					});
				}
			} else if (this.pType === "financialYearJuly") {
				for (let index = 0; index < this.filterPeriod.length; index++) {
					var obj = this.filterPeriod[index].split("J");
					var i = parseInt(obj[0]);
					this.periodArr.push({
						text: `${i} - ${i + 1}`,
						value: `${i}July`,
					});
				}
			} else if (this.pType === "quarterly") {
				for (let index = 0; index < this.filterPeriod.length; index++) {
					this.periodArr.push({
						text: `${this.filterPeriod[index]}`,
						value: `${this.filterPeriod[index]}`,
					});
				}
			}

			this.$emit("period", {
				periodList: this.periodArr,
				type: this.pType,
				isFromToolBar: true,
			});

			this.periodArr = [];
		},
		closeToolbar() {
			this.$emit("closeToolbar");
		},
		getConfigAccess() {
			let { locationID, levelID } = service.getAllowedLocation();
			this.value = levelID + "/" + locationID;
		},
		setLocationOnReset(newValue) {
			if (newValue) {
				this.value = newValue;
			}
		},
		setCurrentPeriod(type, initialSelect = false) {
			if (type == "monthly") {
				let selectedMonths = [];
				/**added by ashvini */
				for (let mn = 0; mn < 10; mn++) {
					let mnt = this.$moment(this.monthYear, "YYYY-MM")
						.subtract(mn * 1, "months")
						.format("YYYY-MM");
					selectedMonths.push(mnt);
				}
				if (initialSelect) {
					this.filterPeriod.push(selectedMonths[selectedMonths.length - 1]);
					this.filterPeriod.push(selectedMonths[0]);
				}
				//console.log(this.filterPeriod);
			} else {
				for (let i = this.currentYear - 10; i <= this.currentYear; i++) {
					if (type === "financialYear") {
						let months =
							this.$i18n.locale === "fr" ? ["avril", "mars"] : ["Apr", "Mar"];
						this.periodOptions.push({
							text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
							value: `${i}April`,
						});
						if (initialSelect) {
							this.filterPeriod.push(`${i}April`);
						}
					}

					if (type === "financialYearJuly") {
						let months =
							this.$i18n.locale === "fr" ? ["juil.", "juin"] : ["Jul", "Jun"];
						this.periodOptions.push({
							text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
							value: `${i}July`,
						});
						if (initialSelect) {
							this.filterPeriod.push(`${i}July`);
						}
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

						for (let j = 4; j >= 1; j--) {
							this.periodOptions.push({
								value: `${i}Q${j}`,
								text: years[`Q${j}`][0] + " - " + years[`Q${j}`][1] + " " + i,
							});
						}
					}
				}
			}

			this.periodOptions.reverse();
		},
		getLocationList() {
			service
				.getOrganisationChildrenwithGroup(
					this.locationValue.split("/")[1],
					this.locationValue.split("/")[0]
				)
				.then((res) => {
					this.locList = res.data;
					//console.log(JSON.stringify(this.locList))
					let newObj = this.renameKeys({ ...this.locList });
					//console.log(newObj)
					this.options = [newObj];
				})
				.catch((res) => {
					console.log(res);
				});
		},
	},
	created() {
		if (this.$store.state.appId && this.$store.state.appUserId) {
			if (
				this.$store.state.financialYear.length === 1 &&
				this.$store.state.financialYear.includes("July")
			) {
				// this.pType = "financialYearJuly"
				this.setCurrentPeriod("financialYearJuly", true);
			} else {
				this.setCurrentPeriod("financialYear", true);
			}
			this.getLocationList();
		} else {
			this.options = JSON.parse(
				JSON.stringify(this.$store.getters.getLocationList)
			);
			this.setCurrentPeriod("monthly", true);
		}

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
		}
	},
};
</script>
<style lang="scss" scoped></style>