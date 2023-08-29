<template>
  <div>
    <button
      type="button"
      class="btn btn-primary btn-sm black-btn"
      @click="openModal"
      v-b-tooltip.hover
      :title="$t('copyMappingInfo')"
    >
      {{ $t("copy_mapping") }}
    </button>
    <b-modal
      v-model="copyMappingModal"
      hide-footer
      centered
      size="md"
      :title="$t('copy_mapping')"
      no-close-on-backdrop
    >
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label class="">{{ $t("source") }}</label>
            <treeselect
              class=""
              :options="sourceList"
              :show-count="true"
              :placeholder="$t('search')"
              v-model="selectedSource"
              :flat="false"
              :default-expand-level="1"
            />
          </div>
        </div>
        <div class="col-12" v-if="selectedSource">
          <div class="form-group row">
            <label class="col-sm-7 col-form-label">{{
              $t("replace_mapping")
            }}</label>
            <div class="col-sm-5 pr-0">
              <b-form-checkbox
                checked="disableChart"
                v-model="replaceExisting"
                name="disableChartTitle"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
          </div>
        </div>
        <div class="col-12" v-if="selectedSource">
          <div class="form-group">
            <label class="">{{ $t("methods") }}</label>
            <treeselect
              class=""
              multiple
              :options="methodsList"
              :show-count="true"
              :placeholder="$t('search')"
              sort-value-by="INDEX"
              :disable-branch-nodes="true"
              v-model="selectedMethods"
            />
          </div>
        </div>
        <div class="col-12 text-right mt-3">
          <button
            type="button"
            class="btn btn-secondary black-btn btn-sm"
            :disabled="!selectedSource || !selectedMethods.length"
            @click="copyMapping"
          >
            {{ $t("copybtn") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: ["globalMapping", "chartData"],
  components: {
    Treeselect,
  },
  data() {
    return {
      selectedSource: null,
      sourceList: [],
      selectedMethods: [],
      methodsList: [],
      copyMappingModal: false,
      mapping: {},
      replaceExisting: true,
    };
  },
  watch: {
    selectedSource(newValue) {
      if (newValue) {
        let mapping = this.globalMapping[newValue];
        // console.log("mapping", mapping)
        this.methodsList = [];
        this.mapping = {};
        mapping.chartData.forEach((m) => {
          let methodName = Array.isArray(m.indicator.name)
            ? m.indicator.name[0]
            : m.indicator.name;
          let outerMapping = {
            label: this.$i18n.t(`${methodName}`),
            id: `${methodName} Parent`,
            children: [],
          };
          m.indicator.subIndicator.forEach((subM) => {
            let methodName = Array.isArray(subM.name)
              ? subM.name[0]
              : subM.name;
            outerMapping.children.push({
              label: this.$i18n.t(`${methodName}`),
              id: methodName,
            });
            this.mapping[methodName] = subM;
          });
          this.methodsList.push(outerMapping);
        });
      }
    },
  },
  methods: {
    openModal() {
      this.copyMappingModal = true;
    },
    copyMapping() {
      // console.log("selectedMethods", this.selectedMethods)
      // console.log("mapping", this.mapping)
      // console.log("chartData", this.chartData)
      // console.log("replaceExisting", this.replaceExisting)
      this.$store.commit("setLoading",true);
      let mapping = JSON.parse(JSON.stringify(this.chartData));
      // console.log("mapping", mapping)
      let updatedMapping = [];
      let ismatchFound = false;
      mapping.forEach((m) => {
        let outerMapping = {
          ...m.indicator,
          subIndicator: [],
        };
        m.indicator.subIndicator.forEach((subM) => {
          let methodName = Array.isArray(subM.static_name)
            ? subM.static_name[0]
            : subM.static_name;
          if (this.selectedMethods.includes(methodName)) {
            ismatchFound = true;
            if (this.replaceExisting) {
              let innerMapping = {
                ...subM,
                de: this.mapping[methodName].de,
                selectedDE: this.mapping[methodName].selectedDE,
                type: this.mapping[methodName].type,
              };
              outerMapping.subIndicator.push(innerMapping);
            } else {
              let innerMapping = {
                ...subM,
                de: [],
                selectedDE: [],
                type: this.mapping[methodName].type,
              };
              if (subM.type === this.mapping[methodName].type) {
                subM.selectedDE.forEach((subDE, ind) => {
                  let subDEFound = this.mapping[methodName].selectedDE.find(
                    (d) => d.id === subDE.id
                  );
                  if (subDEFound) {
                    innerMapping.selectedDE.push(subDEFound);
                    let de = "";
                    if (
                      subDEFound.categoryCombo &&
                      subDEFound.categoryCombo.categoryOptionCombos.length > 0
                    ) {
                      subDEFound.categoryCombo.categoryOptionCombos.forEach(
                        (cat) => {
                          if (cat.status === "selected") {
                            de = cat.id;
                          }
                        }
                      );
                      if (de === "") {
                        innerMapping.de.push(subDEFound.id);
                      } else {
                        innerMapping.de.push(`${subDEFound.id}.${de}`);
                      }
                    } else {
                      innerMapping.de.push(subDEFound.id);
                    }
                  } else {
                    innerMapping.selectedDE.push(subDE);
                    innerMapping.de.push(subM.de[ind]);
                  }
                });
              }
              this.mapping[methodName].selectedDE.forEach((subDE) => {
                let subDEFound = subM.selectedDE.find((d) => d.id === subDE.id);
                if (!subDEFound) {
                  innerMapping.selectedDE.push(subDE);
                  let de = "";
                  if (
                    subDE.categoryCombo &&
                    subDE.categoryCombo.categoryOptionCombos.length > 0
                  ) {
                    subDE.categoryCombo.categoryOptionCombos.forEach((cat) => {
                      if (cat.status === "selected") {
                        de = cat.id;
                      }
                    });
                    if (de === "") {
                      innerMapping.de.push(subDE.id);
                    } else {
                      innerMapping.de.push(`${subDE.id}.${de}`);
                    }
                  } else {
                    innerMapping.de.push(subDE.id);
                  }
                }
              });
              outerMapping.subIndicator.push(innerMapping);
            }
          } else {
            outerMapping.subIndicator.push(subM);
          }
        });
        updatedMapping.push({
          indicator: outerMapping,
        });
      });
      this.$emit("getUpdatedMapping", updatedMapping, ismatchFound);
      this.selectedSource = null;
      this.selectedMethods = [];
      this.replaceExisting = true;
      this.copyMappingModal = false;
      this.$store.commit("setLoading",false);
    },
    createSourceList() {
      Object.keys(this.globalMapping).forEach((source) => {
        if (source === "Visits") {
          this.sourceList.push({
            label: this.$i18n.t("visits"),
            id: "Visits",
          });
        }
        if (source === "Commodities_Client") {
          this.sourceList.push({
            label: this.$i18n.t("Commodities_Client"),
            id: "Commodities_Client",
          });
        }
        if (source === "Commodities_Facilities") {
          this.sourceList.push({
            label: this.$i18n.t(
              "Commodities_Facilities"
            ),
            id: "Commodities_Facilities",
          });
        }
        if (source === "User") {
          this.sourceList.push({
            label: this.$i18n.t("users"),
            id: "User",
          });
        }
        if (source === "Overall") {
          this.sourceList.push({
            label: this.$i18n.t("overall"),
            id: "Overall",
          });
        }
      });
    },
  },
  created() {
    this.createSourceList();
  },
};
</script>