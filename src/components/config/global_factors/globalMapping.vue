<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row" v-for="(chart, index) in chartData" :key="index">
          <div class="col-12">
            <div
              class="default-card-border-radius"
              :id="'headingChartSettings' + index + type + subType"
            >
              <!-- mb-0 class removed to remove fa-plus icon from right corner -->
              <h2 class="">
                <button
                  class="
                    btn btn-link
                    p-0
                    w-100
                    text-left text-uppercase
                    color-grey
                    f-s-0-875rem
                  "
                  type="button"
                  data-toggle="collapse"
                  :data-target="
                    '#collapseChartSettings' + index + type + subType
                  "
                  aria-expanded="false"
                  :aria-controls="
                    'collapseChartSettings' + index + type + subType
                  "
                >
                  <i
                    class="fa fa-cog f-s-20px pr-2"
                    v-b-tooltip.hover
                    :title="$t('dataMapping')"
                  ></i>
                  {{
                    Array.isArray(chart.indicator.name)
                      ? $t(`${chart.indicator.name[0]}`)
                      : $t(`${chart.indicator.name}`)
                  }}
                </button>
              </h2>
            </div>
            <div
              :id="'collapseChartSettings' + index + type + subType"
              class="collapse collapse-section-border"
              :aria-labelledby="'headingChartSettings' + index + type + subType"
            >
              <div class="row m-0 mt-4 mb-2 hide">
                <div class="col">
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{
                      $t("name")
                    }}</label>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chart.indicator.name"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row m-0 mt-4 mb-2">
                <div class="col-12 p-b-15px">
                  <div
                    class="
                      card-header
                      bg-faint-grey
                      color-black
                      border-radius-0
                      text-uppercase
                      f-s-0-875rem
                      font-weight-bold
                    "
                  >
                    {{ $t("dataMapping") }}
                  </div>
                </div>
                <div
                  class="col-12"
                  v-for="(subIndicator, ind) in chart.indicator.subIndicator"
                  :key="ind"
                >
                  <div
                    class="row"
                    :id="
                      'headingAdditionalChartSettings' +
                      ind +
                      index +
                      type +
                      subType
                    "
                  >
                    <div class="col">
                      <div class="form-check form-check-inline mr-0 hide">
                        <div class="pure-checkbox">
                          <input
                            name="checkbox"
                            type="checkbox"
                            :id="'checkbox1' + index + type + subType + ind"
                          />
                          <label
                            :for="'checkbox1' + index + type + subType + ind"
                          ></label>
                        </div>
                      </div>
                      <a
                        data-toggle="collapse"
                        :href="
                          '#additionalSettingsCollapse' +
                          ind +
                          index +
                          type +
                          subType
                        "
                        role="button"
                        aria-expanded="false"
                        :aria-controls="
                          'additionalSettingsCollapse' +
                          ind +
                          index +
                          type +
                          subType
                        "
                        class="pr-2"
                        ><i
                          class="fa fa-link  f-s-20px"
                          v-b-tooltip.hover
                          :title="
                            $t(
                              'link_IndicatorsData_Elements'
                            )
                          "
                        ></i
                      ></a>
                      <span>{{
                        Array.isArray(subIndicator.name)
                          ? $t(`${subIndicator.name[0]}`)
                          : $t(`${subIndicator.name}`)
                      }}</span>
                    </div>
                  </div>
                  <div class="row my-3">
                    <div class="col-lg-12">
                      <div
                        class="collapse border-grey"
                        :id="
                          'additionalSettingsCollapse' +
                          ind +
                          index +
                          type +
                          subType
                        "
                        :aria-labelledby="
                          'headingAdditionalChartSettings' +
                          ind +
                          index +
                          type +
                          subType
                        "
                      >
                        <div
                          class="
                            card-header
                            bg-faint-grey
                            default-card-border-radius
                            color-black
                            f-s-0-875rem
                          "
                        >
                          {{ $t("settings") }}
                        </div>
                        <div class="card card-body">
                          <div class="row">
                            <div class="col-12">
                              <AddMapping
                                :ind="ind"
                                :index="index"
                                dataKey="subIndicator"
                                :metrixList="metrixList"
                                :chartByType="type"
                                :dataSetsList="dataSetsList"
                                :chartBySubtype="subType"
                                :indicatorsList="indicatorsList"
                                :dataElementsList="dataElementsList"
                                :key="
                                  'add-mapping' + subType + ind + type + index
                                "
                                :mappingType="
                                  chartData[index].indicator.subIndicator[ind]
                                    .type
                                "
                                :selectedDE="
                                  chartData[index].indicator.subIndicator[ind]
                                    .selectedDE
                                "
                                @addDE="addDE"
                                @resetDE="resetDE"
                                @deleteDE="deleteDE"
                                v-if="isDataFetched"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button
              type="button"
              class="btn btn-primary black-btn"
              v-on:click="updateConfigData"
            >
              {{ $t("savebtn") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import globalMappingConfig from "@/config/globalMappingConfig.js";
import service from "@/service";
// import audit from "../audit.js"
import merge from "lodash/merge";
import assign from "lodash/assign";
export default {
  props: [
    "module",
    "type",
    "subType",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
  ],
  components: {
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
  },
  data() {
    return {
      originalCypdata: [],
      chartData: globalMappingConfig[this.type][this.subType].chartData,
      isDataFetched: false,
    };
  },
  watch: {},
  methods: {
    //Delete specific mapping
    deleteDE({ index, ind, deIndex, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].selectedDE.splice(
        deIndex,
        1
      );
      this.chartData[index].indicator[dataKey][ind].de.splice(deIndex, 1);
    },
    //Reset the mapping
    resetDE({ index, ind, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].de = [];
      this.chartData[index].indicator[dataKey][ind].selectedDE = [];
    },
    //Store the selected mapping in configuration object
    addDE({ index, ind, type, selectedDataSource, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].type = type;
      this.chartData[index].indicator[dataKey][ind].selectedDE.push(
        selectedDataSource
      );
      this.chartData[index].indicator[dataKey][ind].de.push(
        selectedDataSource.id
      );
    },
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      // console.log("data initial",[this.subType],JSON.stringify(config))
      let key = this.generateKey(this.module, false);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          // console.log("response",response)
          if (response.data[this.type][this.subType]) {
            let data = response.data[this.type][this.subType];
            let mergedData = data.chartData.length
              ? merge(this.chartData, data.chartData)
              : this.chartData;
            this.chartData = JSON.parse(JSON.stringify(mergedData));
            this.originalCypdata = JSON.parse(JSON.stringify(this.chartData));
          }
          this.isDataFetched = true;
          this.$store.state.loading = false;
        })
        .catch((res) => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.state.loading = false;
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;
      let globalMapping = {
        chartData: this.chartData,
      };

      let key = this.generateKey(this.module, false);

      // console.log("globalMapping", metaConfigData)

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            // console.log("configData",configData);
            if (configData[this.type]) {
              configData[this.type][this.subType] = configData[this.type][
                this.subType
              ]
                ? assign(configData[this.type][this.subType], globalMapping)
                : globalMapping;
            } else {
              configData[this.type] = {
                [this.subType]: globalMapping,
              };
            }
            // let configChanges = audit.configAudit(this.originalCypdata, configData[this.type][this.subType].chartData)
            // console.log("configChanges",configChanges);
            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response update ", response.data)
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  }).then(() => {
                    //   if(Object.keys(configChanges).length) {
                    //     audit.processAudit('process2', key, configChanges, this.type, this.subType)
                    //   }
                    this.$emit(
                      "updatedGlobalMapping",
                      configData.globalMapping
                    );
                  });
                  // this.originalCypdata = JSON.parse(JSON.stringify(this.chartData))
                  this.$store.state.loading = false;
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  return;
                }
              })
              .catch((error) => {
                this.$swal({
                  title: this.$i18n.t("error"),
                });

                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let globalMappingData = {
            [this.type]: {
              [this.subType]: globalMapping,
            },
          };
          // console.log("globalMapping in", globalMapping)
          let response = service.saveConfig(globalMappingData, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
              });
              //   this.originalCypdata = JSON.parse(JSON.stringify(this.chartData))
              this.$emit("updatedGlobalMapping", globalMappingData);
              this.$store.state.loading = false;
            } else {
              this.$swal({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.state.loading = false;
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.getConfigData();
  },
};
</script>
