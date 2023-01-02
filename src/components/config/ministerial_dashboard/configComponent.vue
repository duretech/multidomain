<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">{{ $t("disable_chart") }}</label>
        <div class="col-sm-7 pr-0">
          <b-form-checkbox
            checked="disableChart"
            v-model="configData.disableChart"
            name="disableChartTitle"
            switch
            size="lg"
            class="mt-1"
          />
        </div>
      </div>
      <transition name="slide-fade">
        <div v-if="!configData.disableChart">
          <div class="form-group row" v-if="chartByType === 'stockOut'">
            <label class="col-sm-5 col-form-label">{{
              $t("indicators_type")
            }}</label>
            <div class="col-sm-7">
              <div class="select-wrapper">
                <select
                  class="form-control"
                  v-model="configData.indicatorsType"
                >
                  <option value="" disabled>
                    {{ $t("indicators_type_noOpt") }}
                  </option>
                  <option value="calculated">
                    {{ $t("indicators_type_opt1") }}
                  </option>
                  <option value="non_calculated">
                    {{ $t("indicators_type_opt2") }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <AdditionalSettings
            :configData="configData"
            v-bind.sync="configData"
            :chartBySubtype="chartBySubtype"
            :chartByType="chartByType"
            :chartInfoMaxLength="chartInfoMaxLength"
            :chartTitleMaxLength="chartTitleMaxLength"
            :chartInfoPlaceholder="chartInfoPlaceholder"
          />
          <Mapping
            :configData="configData"
            v-bind.sync="configData"
            :chartBySubtype="chartBySubtype"
            :chartByType="chartByType"
            :chartByModule="chartByModule"
            :updateDOM="updateDOM"
            :isDataFetched="isDataFetched"
            :globalMapping="globalMapping"
            :metrixList="metrixList"
            :dataSetsList="dataSetsList"
            :indicatorsList="indicatorsList"
            :dataElementsList="dataElementsList"
            @updateConfigData="updateConfigData"
          />
          <DerivedSettings
            v-if="configData.derivedCharts.length"
            :configData="configData"
            :chartBySubtype="chartBySubtype"
            :chartByType="chartByType"
            :chartInfoMaxLength="chartInfoMaxLength"
            :chartTitleMaxLength="chartTitleMaxLength"
            :chartInfoPlaceholder="chartInfoPlaceholder"
            v-bind.sync="configData"
          />
        </div>
      </transition>
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
</template>
<script>
import config from "@/config/ministerialConfig.js";
import service from "@/service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import audit from "../audit.js";
export default {
  props: [
    "chartByModule",
    "chartByType",
    "chartBySubtype",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
    "supportedLanguages",
    "globalMapping",
  ],
  components: {
    DerivedSettings: () =>
      import(
        /* webpackChunkName: "admin_DerivedSettings"*/ "@/components/config/DerivedSettings"
      ),
    AdditionalSettings: () =>
      import(
        /* webpackChunkName: "admin_AdditionalSettings"*/ "@/components/config/AdditionalSettings"
      ),
    Mapping: () =>
      import(
        /* webpackChunkName: "admin_Mapping"*/ "@/components/config/Mapping"
      ),
  },
  data() {
    let cData = config.ministrialModule[this.chartByType][this.chartBySubtype];
    return {
      configData: cData,
      chartInfoMaxLength: 200,
      chartTitleMaxLength: 100,
      originalData: null,
      updateDOM: 0,
      isDataFetched: false,
    };
  },
  computed: {
    chartInfoPlaceholder: function () {
      return this.$i18n.t("placeholderMaxValue", {
        number: this.chartInfoMaxLength,
      });
    },
  },
  watch: {},
  methods: {
    //This is to fetch configuration from Datastore
    getConfigData() {
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.chartByModule);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (
            response.data[this.chartByType] &&
            response.data[this.chartByType][this.chartBySubtype]
          ) {
            // console.log("response ministrial",[this.chartBySubtype],response.data)
            let data = response.data[this.chartByType][this.chartBySubtype];
            this.configData = merge(this.configData, data);
            this.originalData = JSON.parse(JSON.stringify(data));
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
    //This is to update configuration in Datastore
    async updateConfigData() {
      this.$store.state.loading = true;
      let saveData = false;
      if (!this.configData.cid) {
        try {
          let resp = await service.createDHISChart(
            `${this.chartByModule} ${this.chartByType}`
          );
          if (resp.data.status === "OK") {
            this.configData.cid = resp.data.response.uid;
            saveData = true;
          } else {
            saveData = true;
          }
        } catch (err) {
          // console.log(err)
          saveData = true;
        }
      } else {
        saveData = true;
      }
      let dCharts = [];
      if (this.configData.derivedCharts.length) {
        dCharts = this.configData.derivedCharts.map(async (d) => {
          let cid = "";
          if (d.chartOptions && !d.chartOptions.cid) {
            try {
              let resp = await service.createDHISChart(
                `${this.chartByModule} ${d.chartOptions.chartName}`
              );
              if (resp.data.status === "OK") {
                cid = resp.data.response.uid;
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            return d;
          }
          return {
            chartOptions: {
              ...d.chartOptions,
              cid,
            },
          };
        });
        dCharts = await Promise.all(dCharts);
      }

      if (saveData) {
        let chartBySubtypeData = {
          ...this.configData,
          derivedCharts: dCharts,
        };
        // console.log("chartBySubtypeData", JSON.parse(JSON.stringify(chartBySubtypeData)))
        let key = this.generateKey(this.chartByModule);

        let allKeys = service.getAllKeys();
        allKeys
          .then((keys) => {
            if (keys.data.includes(key)) {
              let saveConfig = service.getSavedConfig(key);
              saveConfig.then((res) => {
                let configData = res.data;
                // console.log("configData",configData);
                if (configData[this.chartByType]) {
                  configData[this.chartByType][this.chartBySubtype] =
                    configData[this.chartByType][this.chartBySubtype]
                      ? assign(
                          configData[this.chartByType][this.chartBySubtype],
                          chartBySubtypeData
                        )
                      : chartBySubtypeData;
                } else {
                  configData[this.chartByType] = {
                    [this.chartBySubtype]: chartBySubtypeData,
                  };
                }
                let configChanges = audit.configAudit(
                  this.originalData,
                  configData[this.chartByType][this.chartBySubtype]
                );
                // console.log("configChanges", configChanges)
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
                            this.chartByType,
                            this.chartBySubtype
                          );
                        }
                      });
                      this.getConfigData();
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
              let ministrial = {
                [this.chartByType]: {
                  [this.chartBySubtype]: chartBySubtypeData,
                },
              };
              let response = service.saveConfig(ministrial, key);
              response.then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response save ", response.data)
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.getConfigData();
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
          });
      } else {
        this.$store.state.loading = false;
      }
    },
  },
  created() {
    this.$store.state.loading = true;
    this.getConfigData();
  },
};
</script>
