<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div
          class="row"
          v-for="(value, name, index) in continuation"
          :key="index"
        >
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
                  {{ $t(`${name}`) }}
                </button>
              </h2>
            </div>
            <div
              :id="'collapseChartSettings' + index + type + subType"
              class="collapse collapse-section-border"
              :aria-labelledby="'headingChartSettings' + index + type + subType"
            >
              <div class="row m-0 mt-4 mb-2">
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
                        :value="$t(`${name}`)"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{
                      $t("methodType")
                    }}</label>
                    <div class="col-sm-7">
                      <div class="select-wrapper">
                        <select class="form-control" v-model="value.type">
                          <option value="Long Term">
                            {{ $t("longterm") }}
                          </option>
                          <option value="Short Term">
                            {{ $t("shortterm") }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{
                      $t("scalingFactor")
                    }}</label>
                    <div class="col-sm-7">
                      <div class="row mx-0">
                        <input
                          type="number"
                          class="form-control col-sm-2"
                          id="inputR2Max"
                          placeholder=""
                          v-model="value.scalingFactor"
                          disabled=""
                        />
                        <b-form-input
                          id="r2Max-range-1"
                          v-model="value.scalingFactor"
                          class="col-sm-10 mt-2 pl-2"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                        ></b-form-input>
                      </div>
                    </div>
                  </div>
                  <div
                    class="form-group row"
                    v-if="typeof value.packets !== 'undefined'"
                  >
                    <label class="col-sm-5 col-form-label">{{
                      $t("packets")
                    }}</label>
                    <div class="col-sm-7">
                      <div class="row mx-0">
                        <input
                          type="number"
                          class="form-control col-sm-2"
                          id="inputR2Max"
                          placeholder=""
                          v-model="value.packets"
                          disabled=""
                        />
                        <b-form-input
                          id="r2Max-range-1"
                          v-model="value.packets"
                          class="col-sm-10 mt-2 pl-2"
                          type="range"
                          min="1"
                          max="13"
                          step="1"
                          @change="calculatePackets(name, value.packets)"
                        ></b-form-input>
                      </div>
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
                    {{
                      value.type === "Long Term"
                        ? "(" + $t("continuationRates") + ")"
                        : ""
                    }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="row">
                    <div class="col-6">
                      <div
                        class="form-group row"
                        v-for="(v, n, i) in value.continuation"
                        :key="i"
                        v-if="i < Object.keys(value.continuation).length / 2"
                      >
                        <label class="col-sm-5 col-form-label"
                          >{{
                            value.type === "Long Term" ? $t("yr") : $t("month")
                          }}
                          {{ n }}</label
                        >
                        <div class="col-sm-7">
                          <input
                            type="number"
                            class="form-control"
                            placeholder=""
                            :disabled="
                              i ===
                                Object.keys(value.continuation).length - 1 ||
                              typeof value.packets !== 'undefined'
                            "
                            v-model="value.continuation[n]"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div
                        class="form-group row"
                        v-for="(v, n, i) in value.continuation"
                        :key="i"
                        v-if="i >= Object.keys(value.continuation).length / 2"
                      >
                        <label class="col-sm-5 col-form-label"
                          >{{
                            value.type === "Long Term" ? $t("yr") : $t("month")
                          }}
                          {{ n }}</label
                        >
                        <div class="col-sm-7">
                          <input
                            type="number"
                            class="form-control"
                            placeholder=""
                            :disabled="
                              i ===
                                Object.keys(value.continuation).length - 1 ||
                              typeof value.packets !== 'undefined'
                            "
                            v-model="value.continuation[n]"
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
import globalFactorsConfig from "../../../config/globalFactorsConfig.js";
import service from "../../../service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import audit from "../audit.js";

export default {
  props: ["module", "type", "subType"],
  data() {
    return {
      originalContinuationData: [],
      continuation: globalFactorsConfig[this.type][this.subType],
    };
  },
  methods: {
    calculatePackets(name, value) {
      let calculatedObj = {};
      if (this.subType === "Visits" || this.subType === "User") {
        Object.keys(this.continuation[name].continuation).forEach((c, i) => {
          if (i <= value - 1) {
            if (value * 1 === 13) {
              calculatedObj[c] = 1;
            } else {
              calculatedObj[c] = (12 / 13).toFixed(3);
            }
          } else {
            calculatedObj[c] = 0;
          }
        });
      } else {
        Object.keys(this.continuation[name].continuation).forEach((c, i) => {
          if (i <= value - 1) {
            calculatedObj[c] = (12 / 13 / value).toFixed(3);
          } else {
            calculatedObj[c] = 0;
          }
        });
      }
      this.continuation[name].continuation = calculatedObj;
    },
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (response.data[this.type][this.subType]) {
            this.continuation = response.data[this.type][this.subType]
              ? merge(this.continuation, response.data[this.type][this.subType])
              : this.continuation;
            this.originalContinuationData = JSON.parse(
              JSON.stringify(this.continuation)
            );
          }
          this.$store.state.loading = false;
        })
        .catch((res) => {
          console.log("Config not found...");
          this.$store.state.loading = false;
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;

      let key = this.generateKey(this.module);
      //console.log(metaConfigData, "metaConfigData")

      let allKeys = service.getAllKeys();
      allKeys
        .then((keys) => {
          // console.log("keys",keys)
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let configData = res.data;
              // console.log("configData",configData);

              if (configData[this.type]) {
                configData[this.type][this.subType] = configData[this.type][
                  this.subType
                ]
                  ? assign(
                      configData[this.type][this.subType],
                      this.continuation
                    )
                  : this.continuation;
              } else {
                configData[this.type] = {
                  [this.subType]: this.continuation,
                };
              }
              let configChanges = audit.configAudit(
                this.originalContinuationData,
                configData[this.type][this.subType]
              );

              let response = service.updateConfig(configData, key);
              response
                .then((response) => {
                  if (response.data.status === "OK") {
                    // console.log("response update ", response.data)
                    this.$swal({
                      title: this.$i18n.t("data_saved_successfully"),
                    }).then(() => {
                      if (Object.keys(configChanges).length) {
                        audit.processAudit(
                          "process2",
                          key,
                          configChanges,
                          this.type,
                          this.subType
                        );
                      }
                    });
                    this.$store.commit("setGlobalFactors", {
                      payload: configData,
                    });
                    this.originalContinuationData = JSON.parse(
                      JSON.stringify(this.continuation)
                    );
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
            // console.log("else")
            let configData = {
              [this.type]: {
                [this.subType]: this.continuation,
              },
            };
            let response = service.saveConfig(configData, key);
            response.then((response) => {
              if (response.data.status === "OK") {
                // console.log("response save ", response.data)
                this.$swal({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.$store.commit("setGlobalFactors", {
                  payload: configData,
                });
                this.originalContinuationData = JSON.parse(
                  JSON.stringify(this.continuation)
                );
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
        })
        .catch(() => {
          this.$store.state.loading = false;
          this.$swal({
            title: this.$i18n.t("error"),
            title: this.$i18n.t("table_not_found"),
          });
        });
    },
  },
  created() {
    // console.log("created")
    this.getConfigData(); //Remove / add $store.state.loading in updated when you enable / disable this call
  },
  updated() {
    // this.$store.state.loading = false
  },
};
</script>
