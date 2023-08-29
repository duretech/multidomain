<template>
  <div class="mt-2 sumVolume">
    <div class="row">
      <div class="col-md-12">
        <b-form-radio-group
          v-model="type"
          :options="options"
          :name="'radio-inline' + modalKey"
          @change="resetDE"
        ></b-form-radio-group>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="">
          <b-button class="black-btn mx-1" @click="resetDE">{{
            $t("resetbtn")
          }}</b-button>
          <b-button
            class="black-btn blue-btn mx-1"
            v-b-modal="'modal-selectDE1' + modalKey"
            >{{ buttonText }}</b-button
          >

          <b-modal
            :id="'modal-selectDE1' + modalKey"
            hide-footer
            centered
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
                label="displayName"
                :placeholder="subPlaceholderText"
                :hide-selected="true"
                :options="matrixList"
                :searchable="true"
                :allow-empty="false"
                class="mt-2"
                :open-direction="'bottom'"
              >
                <template slot="singleLabel" slot-scope="{ option }">{{
                  option.displayName
                }}</template>
              </multiselect>
            </div>
            <div :class="{ 'pt-3': type === 'data_sets' }">
              {{ modalTitleText }}
              <multiselect
                v-model="selectedDataSource"
                @input="updateSelectDataSource(selectedDataSource)"
                select-label=""
                track-by="id"
                label="displayName"
                :placeholder="placeholderText"
                :hide-selected="true"
                :options="commonDEList"
                :searchable="true"
                :allow-empty="false"
                class="mt-2"
                :open-direction="'bottom'"
              >
                <template slot="singleLabel" slot-scope="{ option }">{{
                  option.displayName
                }}</template>
              </multiselect>
            </div>
            <div v-if="categoryCombo && type === 'data_element'" class="pt-3">
              {{ subHeadingText }}
              <multiselect
                v-model="selectedCategoryCombo"
                select-label=""
                track-by="id"
                label="displayName"
                :placeholder="subPlaceholderText"
                :hide-selected="true"
                :options="categoryCombo"
                :searchable="true"
                :allow-empty="false"
                class="mt-2"
                :open-direction="'bottom'"
              >
                <template slot="singleLabel" slot-scope="{ option }">{{
                  option.displayName
                }}</template>
              </multiselect>
            </div>
            <div class="text-right pt-3">
              <b-button
                :disabled="!selectedDataSource"
                class="black-btn blue-btn btn-sm"
                @click="addDE"
                >{{ $t("addbtn") }}
              </b-button>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
    <div class="pt-3 mx-1" v-if="sDE.length > 0">
      {{ selectedDataText }}
      <ul class="list-unstyled mt-3">
        <li v-for="(de, deIndex) in sDE" :key="deIndex">
          <img
            src="@/assets/images/icons/admindelete-icon.svg"
            :style="{ filter: filterColor }"
            class="cursor-pointer f-s-0-875rem w-auto mt-lg-n1"
            v-b-tooltip.hover
            :title="$t('deletebtn')"
            @click="deleteDE(deIndex)"
          />
          <span class="mx-3">{{ de.displayName }}</span>
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
          <div class="form-group row py-2 px-4 ml-2" v-if="namesKey">
            <div class="col-sm-5 transalte-height p-0">
              <b-input-group>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :placeholder="$t('displayName')"
                  v-model="de[namesKey][$i18n.locale]"
                  disabled
                  v-if="de[namesKey] && typeof de[namesKey] === 'object'"
                />
                <b-input-group-append is-text>
                  <Translations :transText.sync="de[namesKey]" />
                </b-input-group-append>
              </b-input-group>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="pt-3" v-else>
      {{ noDataText }}
    </div>
  </div>
</template>
<script>
import service from "@/service";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "modalKey",
    "namesKey",
    "selectedDE",
    "mappingType",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "matrixList",
  ],
  mixins: [DynamicImageMixin],
  data() {
    return {
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
      categoryCombo: null,
    };
  },
  components: {
    Multiselect,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  watch: {
    type(newValue) {
      if (newValue) {
        this.setValues();
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
  computed: {
    sDE: {
      get() {
        return this.selectedDE;
      },
      set(sDE) {
        this.$emit("update:selectedDE", sDE);
      },
    },
    type: {
      get() {
        return this.mappingType;
      },
      set(type) {
        this.$emit("update:mappingType", type);
      },
    },
  },
  methods: {
    updateSelectDataSource(dataSource) {
      if (dataSource && this.type === "data_element") {
        this.$store.commit("setLoading", true);
        this.categoryCombo = null;
        service
          .getCategoryCombo(dataSource.id)
          .then((res) => {
            this.categoryCombo =
              res.data.categoryCombo?.categoryOptionCombos || null;
            this.$store.commit("setLoading", false);
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
          });
      }
    },
    resetValues() {
      this.selectedDataSource = "";
      this.selectedCategoryCombo = "";
      this.dataSourceMetrix = {
        id: "Reporting rates",
        displayName: this.$i18n.t("reportingRates"),
        alias: "REPORTING_RATE",
      };
    },
    //Reset the mapping
    resetDE() {
      this.resetValues();
      this.sDE.splice(0, this.sDE.length);
    },
    //Store the selected mapping in configuration object
    addDE() {
      let selectedDataSource = this.selectedDataSource;
      if (this.type === "data_element") {
        let sDE = {};
        if (this.selectedCategoryCombo) {
          sDE["id"] =
            this.selectedDataSource.id + "." + this.selectedCategoryCombo.id;
          sDE["displayName"] =
            this.selectedDataSource.displayName +
            " " +
            this.selectedCategoryCombo.displayName;
        } else {
          sDE["id"] = this.selectedDataSource.id;
          sDE["displayName"] = this.selectedDataSource.displayName;
        }
        selectedDataSource = sDE;
      }
      this.sDE = [...this.sDE, selectedDataSource];
      this.$bvModal.hide("modal-selectDE1" + this.modalKey);
      this.resetValues();
    },
    //Delete specific mapping
    deleteDE(deIndex) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.sDE.splice(deIndex, 1);
        }
      });
    },
    setValues() {
      if (this.type === "indicator") {
        this.commonDEList = this.indicatorsList;
        this.buttonText = this.$i18n.t("addIndicator");
        this.modalTitleText = this.$i18n.t("selectIndicator");
        this.subHeadingText = "";
        this.placeholderText = this.$i18n.t("searchforindicator");
        this.subPlaceholderText = "";
        this.selectedDataText = this.$i18n.t("selectedIndicators");
        this.noDataText = this.$i18n.t("noIndicatorsSelected");
      }
      if (this.type === "data_element") {
        this.commonDEList = this.dataElementsList;
        this.buttonText = this.$i18n.t("addDataElement");
        this.modalTitleText = this.$i18n.t("selectDataElement");
        this.subHeadingText = this.$i18n.t("selectCategoryCombo");
        this.placeholderText = this.$i18n.t("search_data_element");
        this.subPlaceholderText = this.$i18n.t("search_category_combo");
        this.selectedDataText = this.$i18n.t("selectedDataElements");
        this.noDataText = this.$i18n.t("no_Data_Elements_selected");
      }
      if (this.type === "data_sets") {
        this.commonDEList = this.dataSetsOriginalList;
        this.buttonText = this.$i18n.t("addDataSets");
        this.modalTitleText = this.$i18n.t("selectDataSets");
        this.subHeadingText = this.$i18n.t("selectMetrics");
        this.placeholderText = this.$i18n.t("search_data_sets");
        this.subPlaceholderText = this.$i18n.t("search_data_metrix");
        this.selectedDataText = this.$i18n.t("selectedDataSets");
        this.noDataText = this.$i18n.t("no_Data_Sets_selected");
      }
    },
  },
  created() {
    this.setValues();
    this.options = [
      {
        text: this.$i18n.t("indicator"),
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
