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
                  class="btn btn-link p-0 w-100 text-left text-uppercase color-grey f-s-0-875rem"
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
                  <!-- <i
                    class="fa fa-cog f-s-20px pr-2"
                    v-b-tooltip.hover
                    :title="$t('dataMapping')"
                  ></i> -->
                  <img
                    src="@/assets/images/icons/adminsetting-icon.svg"
                    :style="{ filter: filterColor }"
                    class="pr-2 cursor-pointer f-s-20px mb-lg-1"
                    v-b-tooltip.hover
                    :title="$t('dataMapping')"
                  />
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
              class="collapse"
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
              <div class="row m-0 mb-lg-n3">
                <div class="col-12 p-b-15px">
                  <div class="accordion no-header" role="tablist">
                    <b-card no-body class="mb-1">
                      <b-card-header
                        header-tag="header"
                        class="p-1 map-header f-s-0-875rem font-weight-bold"
                        role="tab"
                      >
                        <b-button
                          block
                          v-b-toggle.accordion-cyp1
                          variant="info"
                          class="button-add"
                        >
                          {{ $t("dataMapping") }}</b-button
                        >
                      </b-card-header>
                      <b-collapse
                        id="accordion-cyp1"
                        visible
                        accordion="my-cypaccordion"
                        role="tabpanel"
                        class="border-module"
                      >
                        <b-card-body class="mb-25px">
                          <b-card-text>
                            <div
                              class="col-12"
                              v-for="(subIndicator, ind) in chart.indicator
                                .subIndicator"
                              :key="ind"
                            >
                              <div class="row">
                                <div class="col">
                                  <div
                                    class="form-check form-check-inline mr-0 hide"
                                  >
                                    <div class="pure-checkbox">
                                      <input
                                        name="checkbox"
                                        type="checkbox"
                                        :id="
                                          'checkbox1' +
                                          index +
                                          type +
                                          subType +
                                          ind
                                        "
                                      />
                                      <label
                                        :for="
                                          'checkbox1' +
                                          index +
                                          type +
                                          subType +
                                          ind
                                        "
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
                                  >
                                    <!-- <i
                          class="fa fa-link f-s-20px"
                          v-b-tooltip.hover
                          :title="$t('link_IndicatorsData_Elements')"
                        ></i
                      > -->
                                    <img
                                      src="@/assets/images/icons/adminlink-icon.svg"
                                      class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                                      :style="{ filter: filterColor }"
                                      v-b-tooltip.hover
                                      :title="
                                        $t('link_IndicatorsData_Elements')
                                      "
                                    />
                                  </a>
                                  <span>{{
                                    Array.isArray(subIndicator.name)
                                      ? $t(`${subIndicator.name[0]}`)
                                      : $t(`${subIndicator.name}`)
                                  }}</span>
                                </div>
                              </div>

                              <div class="row mb-3 border-main">
                                <div class="col-lg-12">
                                  <div
                                    class="collapse mt-3"
                                    :id="
                                      'additionalSettingsCollapse' +
                                      ind +
                                      index +
                                      type +
                                      subType
                                    "
                                    :aria-labelledby="
                                      'additionalSettingsCollapse' +
                                      ind +
                                      index +
                                      type +
                                      subType
                                    "
                                  >
                                    <div
                                      class="card-header default-card-border-radius f-s-0-875rem p-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
                                    >
                                      {{ $t("settings") }}
                                    </div>
                                    <div class="card card-body admin-emucard">
                                      <div class="row">
                                        <div class="col-12">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-5 col-form-label"
                                              >{{ $t("cyp") }}</label
                                            >
                                            <div class="col-sm-7">
                                              <input
                                                type="text"
                                                class="form-control"
                                                placeholder=""
                                                v-model="subIndicator.cyp"
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
                          </b-card-text>
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </div>
                </div>
              </div>
            </div>
            <div class="bordertop-grey mt-2"></div>
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button
              type="button"
              class="btn btn-primary black-btn save-btn"
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
import service from "@/service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
// import globalFactorsConfig from "@/config/globalFactorsConfig.js";
export default {
  props: ["module", "type", "subType"],
  mixins: [DynamicImageMixin, ReFetchConfigMixin],
  data() {
    return {
      originalCypdata: [],
      chartData: null,
    };
  },
  methods: {
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.commit("setLoading", true);
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig({ tableKey: key });
      response
        .then((response) => {
          // console.log("response",response)

          if (response.data[this.type][this.subType]) {
            this.chartData = response.data[this.type][this.subType].chartData
              ? merge(
                  this.chartData,
                  response.data[this.type][this.subType].chartData
                )
              : this.chartData;
            this.originalCypdata = JSON.parse(JSON.stringify(this.chartData));
          }
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          console.log("Config not found...");
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
    updateConfigData() {
      this.$store.commit("setLoading", true);
      let cyp = {
        chartData: this.chartData,
      };

      let key = this.generateKey(this.module);

      // console.log("cyp", metaConfigData)

      let allKeys = service.getAllKeys({});
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig({ tableKey: key });
          saveConfig.then((res) => {
            let configData = res.data;
            // console.log("configData",configData);
            if (configData[this.type]) {
              configData[this.type][this.subType] = configData[this.type][
                this.subType
              ]
                ? assign(configData[this.type][this.subType], cyp)
                : cyp;
            } else {
              configData[this.type] = {
                [this.subType]: cyp,
              };
            }
            let configChanges = {};
            // let configChanges = audit.configAudit(
            //   this.originalCypdata,
            //   configData[this.type][this.subType].chartData
            // );
            // console.log("configChanges", configChanges);
            let response = service.updateConfig({
              data: configData,
              tableKey: key,
            });
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response update ", response.data)
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                  this.originalCypdata = JSON.parse(
                    JSON.stringify(this.chartData)
                  );
                  this.$store.commit("setLoading", false);
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.commit("setLoading", false);
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                });

                this.$store.commit("setLoading", false);
                return;
              });
          });
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: cyp,
            },
          };
          // console.log("cyp in", cyp)
          let response = service.saveConfig({
            data: configData,
            tableKey: key,
          });
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.$store.commit("setGlobalFactors", {
                payload: configData,
              });
              this.originalCypdata = JSON.parse(JSON.stringify(this.chartData));
              this.$store.commit("setLoading", false);
            } else {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.commit("setLoading", false);
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
