<template>
	<div class="p-t-15px sumVolume">
		<div>
			<b-form-radio-group
				v-model="type"
				:options="options"
				:name="
					'radio-inline' +
					dataKey +
					chartBySubtype +
					ind +
					index +
					chartByType +
					name +
					calcType
				"
				@change="resetDE"
			></b-form-radio-group>
		</div>
		<div class="p-t-15px" v-if="$root.defaultLanguageLocale === $i18n.locale">
			<b-button
				class="black-btn mx-1"
				v-b-modal="
					'modal-selectDE1' +
					dataKey +
					index +
					chartBySubtype +
					ind +
					chartByType +
					name +
					calcType
				"
				>{{ buttonText }}</b-button
			>
			<b-button class="black-btn mx-1" @click="resetDE">{{
				$t("resetbtn")
			}}</b-button>
			<b-modal
				:id="
					'modal-selectDE1' +
					dataKey +
					index +
					chartBySubtype +
					ind +
					chartByType +
					name +
					calcType
				"
				hide-footer
				@show="resetValues"
				:title="modalTitleText"
				body-class="sumVolume"
				no-close-on-backdrop
			>
				<div v-if="type === 'data_sets'">
					{{ subHeadingText }}
					<multiselect
						v-model="dataSourceMetrix"
						select-label=""
						track-by="id"
						label="name"
						:placeholder="subPlaceholderText"
						:hide-selected="true"
						:options="metrixList"
						:searchable="true"
						:allow-empty="false"
					>
						<template slot="singleLabel" slot-scope="{ option }">{{
							option.name
						}}</template>
					</multiselect>
				</div>
				<div :class="{ 'pt-3': type === 'data_sets' }">
					{{ modalTitleText }}
					<multiselect
						v-model="selectedDataSource"
						select-label=""
						track-by="id"
						label="displayName"
						:placeholder="placeholderText"
						:hide-selected="true"
						:options="commonDEList"
						:searchable="true"
						:allow-empty="false"
					>
						<template slot="singleLabel" slot-scope="{ option }">{{
							option.displayName
						}}</template>
					</multiselect>
				</div>
				<div
					v-if="selectedDataSource.categoryCombo && type === 'data_element'"
					class="pt-3"
				>
					{{ subHeadingText }}
					<multiselect
						v-model="selectedCategoryCombo"
						select-label=""
						track-by="id"
						label="displayName"
						:placeholder="subPlaceholderText"
						:hide-selected="true"
						:options="selectedDataSource.categoryCombo.categoryOptionCombos"
						:searchable="true"
						:allow-empty="false"
					>
						<template slot="singleLabel" slot-scope="{ option }">{{
							option.displayName
						}}</template>
					</multiselect>
				</div>
				<div class="text-right pt-3">
					<b-button
						:disabled="!selectedDataSource"
						class="black-btn"
						@click="addDE"
						>{{ $t("addbtn") }}
					</b-button>
				</div>
			</b-modal>
		</div>
		<div class="pt-3" v-if="selectedDE.length > 0">
			{{ selectedDataText }}
			<ul class="list-unstyled">
				<template v-for="(de, deIndex) in selectedDE">
					<li :key="deIndex">
						<i
							class="fa fa-trash cursor-pointer mx-3"
							v-b-tooltip.hover
							:title="$t('deletebtn')"
							@click="deleteDE(deIndex)"
							v-if="$root.defaultLanguageLocale === $i18n.locale"
						></i>
						{{ de.displayName }}
						<template v-if="de.categoryCombo">
							<span
								v-for="(categoryCombo, cIndex) in de.categoryCombo
									.categoryOptionCombos"
								:key="cIndex"
							>
								<span v-if="categoryCombo.status === 'selected'">
									{{ categoryCombo.displayName }}
								</span>
							</span>
						</template>
					</li>
				</template>
			</ul>
		</div>
		<div class="pt-3" v-else>
			{{ noDataText }}
		</div>
	</div>
</template>
<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
export default {
	props: [
		"ind",
		"name",
		"index",
		"dataKey",
		"mapIndex",
		"calcType",
		"selectedDE",
		"sourceIndex",
		"subTabIndex",
		"mappingType",
		"chartBySubtype",
		"chartByType",
		"indicatorsList",
		"dataElementsList",
		"dataSetsList",
		"metrixList",
	],
	data() {
		return {
			type: null,
			options: [],
			selectedDataSource: "",
			selectedCategoryCombo: "",
			dataSourceMetrix: "",
			dataSetsOriginalList: [],
			commonDEList: [],
			buttonText: "",
			modalTitleText: "",
			subHeadingText: "",
			placeholderText: "",
			subPlaceholderText: "",
			selectedDataText: "",
			noDataText: "",
		};
	},
	components: {
		Multiselect,
	},
	watch: {
		type(newValue) {
			if (newValue) {
				if (newValue === "indicator") {
					this.commonDEList = this.indicatorsList;
					this.buttonText = this.$i18n.t("addIndicator");
					this.modalTitleText = this.$i18n.t("selectIndicator");
					this.subHeadingText = "";
					this.placeholderText = this.$i18n.t("searchforindicator");
					this.subPlaceholderText = "";
					this.selectedDataText = this.$i18n.t("selectedIndicators");
					this.noDataText = this.$i18n.t("noIndicatorsSelected");
				}
				if (newValue === "data_element") {
					this.commonDEList = this.dataElementsList;
					this.buttonText = this.$i18n.t("addDataElement");
					this.modalTitleText = this.$i18n.t("selectDataElement");
					this.subHeadingText = this.$i18n.t("selectCategoryCombo");
					this.placeholderText = this.$i18n.t("search_data_element");
					this.subPlaceholderText = this.$i18n.t("search_category_combo");
					this.selectedDataText = this.$i18n.t("selectedDataElements");
					this.noDataText = this.$i18n.t("no_Data_Elements_selected");
				}
				if (newValue === "data_sets") {
					this.commonDEList = this.dataSetsOriginalList;
					this.buttonText = this.$i18n.t("addDataSets");
					this.modalTitleText = this.$i18n.t("selectDataSets");
					this.subHeadingText = this.$i18n.t("selectMetrics");
					this.placeholderText = this.$i18n.t("search_data_sets");
					this.subPlaceholderText = this.$i18n.t("search_data_metrix");
					this.selectedDataText = this.$i18n.t("selectedDataSets");
					this.noDataText = this.$i18n.t("no_Data_Sets_selected");
				}
			}
		},
		dataSourceMetrix(newValue) {
			if (newValue.id === "[All metrics]") {
				this.dataSetsOriginalList = this.dataSetsList;
			} else {
				this.dataSetsOriginalList = this.dataSetsList.filter(
					(d) => d.dataSourceGroup === newValue.id
				);
			}
			if (this.type === "data_sets") {
				this.commonDEList = this.dataSetsOriginalList;
			}
		},
	},
	computed: {},
	methods: {
		resetValues() {
			this.selectedDataSource = "";
			this.selectedCategoryCombo = "";
			this.dataSourceMetrix = {
				id: "Reporting rates",
				name: this.$i18n.t("reportingRates"),
				alias: "REPORTING_RATE",
			};
		},
		resetDE() {
			this.resetValues();
			this.$emit("resetDE", {
				index: this.index,
				ind: this.ind,
				mapIndex: this.mapIndex,
				subTabIndex: this.subTabIndex,
				sourceIndex: this.sourceIndex,
				dataKey: this.dataKey,
				name: this.name,
				calcType: this.calcType,
			});
		},
		addDE() {
			let selectedDataSource = this.selectedDataSource;
			if (this.type === "data_element") {
				let selectedDE = {};
				if (this.selectedCategoryCombo) {
					selectedDE["id"] =
						this.selectedDataSource.id + "." + this.selectedCategoryCombo.id;
					selectedDE["displayName"] =
						this.selectedDataSource.displayName +
						" " +
						this.selectedCategoryCombo.displayName;
				} else {
					selectedDE["id"] = this.selectedDataSource.id;
					selectedDE["displayName"] = this.selectedDataSource.displayName;
				}
				selectedDataSource = selectedDE;
			}
			this.$emit("addDE", {
				index: this.index,
				ind: this.ind,
				mapIndex: this.mapIndex,
				subTabIndex: this.subTabIndex,
				sourceIndex: this.sourceIndex,
				dataKey: this.dataKey,
				type: this.type,
				selectedDataSource: selectedDataSource,
				name: this.name,
				calcType: this.calcType,
			});
			this.$bvModal.hide(
				"modal-selectDE1" +
					this.dataKey +
					this.index +
					this.chartBySubtype +
					this.ind +
					this.chartByType +
					this.name +
					this.calcType
			);
			this.resetValues();
		},
		deleteDE(deIndex) {
			this.$emit("deleteDE", {
				index: this.index,
				ind: this.ind,
				mapIndex: this.mapIndex,
				subTabIndex: this.subTabIndex,
				sourceIndex: this.sourceIndex,
				dataKey: this.dataKey,
				deIndex: deIndex,
				name: this.name,
				calcType: this.calcType,
			});
		},
	},
	created() {
		this.type = this.mappingType;
		this.options = [
			{
				text: this.$i18n.t("Indicator"),
				value: "indicator",
			},
			{
				text: this.$i18n.t("dataElement"),
				value: "data_element",
			},
			{
				text: this.$i18n.t("dataSets"),
				value: "data_sets",
			},
		];
		this.resetValues();
	},
};
</script>
