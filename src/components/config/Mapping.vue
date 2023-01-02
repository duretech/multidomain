<template>
  <div class="row mt-3 mb-4" :key="updateDOM">
    <div class="col">
      <div class="card">
        <div
          class="
            card-header
            color-black
            text-uppercase
            f-s-0-875rem
            font-weight-bold
          "
        >
          {{ $t("mapping") }}
        </div>
        <div class="card-body border">
          <div
            class="text-right"
            v-if="$root.defaultLanguageLocale !== $i18n.locale"
          >
            <SyncMapping ref="syncMapping" @syncMapping="syncMapping" />
          </div>
          <div
            class="text-right"
            v-if="
              $root.defaultLanguageLocale === $i18n.locale &&
              globalMapping &&
              configData.chartData
            "
          >
            <copyMapping
              :globalMapping="globalMapping"
              :chartData="configData.chartData"
              @getUpdatedMapping="getUpdatedMapping"
            />
          </div>
          <div
            class="row"
            v-for="(chart, index) in configData.chartData"
            :key="index"
          >
            <div class="col-12">
              <div class="default-card-border-radius">
                <h2 class="">
                  <i
                    class="
                      fa fa-arrow-up
                      
                      f-s-20px
                      pr-2
                      cursor-pointer
                      hide
                    "
                    v-b-tooltip.hover
                    title="Move Up"
                    @click.prevent.stop="moveItem(index, -1)"
                  ></i>
                  <i
                    class="
                      fa fa-arrow-down
                     
                      f-s-20px
                      pr-2
                      cursor-pointer
                      hide
                    "
                    v-b-tooltip.hover
                    title="Move Down"
                    @click.prevent.stop="moveItem(index, 1)"
                  ></i>
                  <button
                    class="
                      btn btn-link
                      p-0
                      text-uppercase
                      color-grey
                      f-s-0-875rem
                    "
                    type="button"
                    v-b-toggle="
                      'collapseChartSettings' +
                      index +
                      chartBySubtype +
                      chartByType
                    "
                  >
                    <i
                      class="fa fa-cog f-s-20px pr-2"
                      v-b-tooltip.hover
                      :title="$t('dataMapping')"
                    ></i>
                    {{
                      Array.isArray(configData.chartData[index].indicator.name)
                        ? configData.chartData[index].indicator.name[0]
                        : configData.chartData[index].indicator.name
                    }}
                  </button>
                </h2>
              </div>
              <b-collapse
                class="border border-b-l-radius-10px border-b-r-radius-10px"
                :id="
                  'collapseChartSettings' + index + chartBySubtype + chartByType
                "
              >
                <div class="row m-0 mt-4 mb-2">
                  <div class="col">
                    <div class="form-group row hide">
                      <label class="col-sm-5 col-form-label">{{
                        $t("identifier")
                      }}</label>
                      <div class="col-sm-7">
                        <input
                          type="text"
                          class="form-control"
                          placeholder=""
                          :value="
                            Array.isArray(
                              configData.chartData[index].indicator.static_name
                            )
                              ? $t(
                                  `${configData.chartData[index].indicator.static_name[0]}`
                                )
                              : $t(
                                  `${configData.chartData[index].indicator.static_name}`
                                )
                          "
                          disabled
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-5 col-form-label">{{
                        $t("displayName")
                      }}</label>
                      <div class="col-sm-7">
                        <input
                          type="text"
                          class="form-control"
                          placeholder=""
                          v-model="configData.chartData[index].indicator.name"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-5 col-form-label">{{
                        $t("color")
                      }}</label>
                      <div class="col-sm-2">
                        <input
                          type="color"
                          class="form-control"
                          placeholder=""
                          v-model="configData.chartData[index].indicator.color"
                        />
                      </div>
                      <div class="col-sm-5">
                        <input
                          type="text"
                          class="form-control"
                          placeholder=""
                          v-model="configData.chartData[index].indicator.color"
                        />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-5 col-form-label"
                        >{{ $t("visible") }}
                        <span v-if="chartByType === 'stockOut'"
                          >({{ $t("visible_tracer_method") }})</span
                        ></label
                      >
                      <div class="col-sm-7">
                        <b-form-checkbox
                          checked="configData.chartData[index].indicator.visible"
                          v-model="
                            configData.chartData[index].indicator.visible
                          "
                          name="check-button"
                          switch
                          size="lg"
                        >
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="row m-0 mt-4 mb-2"
                  v-if="
                    configData.chartData[index].indicator.subIndicator.length
                  "
                >
                  <div class="col-12 pb-3">
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      {{ $t("dataMapping") }}
                    </div>
                  </div>
                  <div
                    class="col-12 pb-2"
                    v-for="(subIndicator, ind) in configData.chartData[index]
                      .indicator.subIndicator"
                    :key="ind"
                  >
                    <button
                      class="
                        btn btn-link
                        text-uppercase
                        color-grey
                        f-s-0-875rem
                      "
                      type="button"
                      v-b-toggle="
                        'additionalSettingsCollapse' +
                        chartBySubtype +
                        ind +
                        index +
                        chartByType
                      "
                    >
                      <i
                        class="fa fa-link f-s-20px"
                        v-b-tooltip.hover
                        :title="$t('link_IndicatorsData_Elements')"
                      ></i>
                      <span class="pl-2 color-grey">{{
                        Array.isArray(
                          configData.chartData[index].indicator.subIndicator[
                            ind
                          ].name
                        )
                          ? configData.chartData[index].indicator.subIndicator[
                              ind
                            ].name[0]
                          : configData.chartData[index].indicator.subIndicator[
                              ind
                            ].name
                      }}</span>
                    </button>
                    <b-collapse
                      class="
                        border border-b-l-radius-10px border-b-r-radius-10px
                        mx-3
                        my-2
                      "
                      :id="
                        'additionalSettingsCollapse' +
                        chartBySubtype +
                        ind +
                        index +
                        chartByType
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
                            <div class="form-group row hide">
                              <label class="col-sm-5 col-form-label">{{
                                $t("identifier")
                              }}</label>
                              <div class="col-sm-7">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  :value="
                                    Array.isArray(
                                      configData.chartData[index].indicator
                                        .subIndicator[ind].static_name
                                    )
                                      ? $t(
                                          `${configData.chartData[index].indicator.subIndicator[ind].static_name[0]}`
                                        )
                                      : $t(
                                          `${configData.chartData[index].indicator.subIndicator[ind].static_name}`
                                        )
                                  "
                                  disabled
                                />
                              </div>
                            </div>
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("displayName")
                              }}</label>
                              <div class="col-sm-7">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  v-model="
                                    configData.chartData[index].indicator
                                      .subIndicator[ind].name
                                  "
                                />
                              </div>
                            </div>
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("color")
                              }}</label>
                              <div class="col-sm-2">
                                <input
                                  type="color"
                                  class="form-control"
                                  placeholder=""
                                  v-model="
                                    configData.chartData[index].indicator
                                      .subIndicator[ind].color
                                  "
                                />
                              </div>
                              <div class="col-sm-5">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  v-model="
                                    configData.chartData[index].indicator
                                      .subIndicator[ind].color
                                  "
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
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
                              {{ $t("indicators_Data_Elements_Mapping") }}
                            </div>
                          </div>
                          <div class="col-12">
                            <AddMapping
                              :ind="ind"
                              :index="index"
                              dataKey="subIndicator"
                              :metrixList="metrixList"
                              :chartByType="chartByType"
                              :dataSetsList="dataSetsList"
                              :chartBySubtype="chartBySubtype"
                              :indicatorsList="indicatorsList"
                              :dataElementsList="dataElementsList"
                              :key="
                                'add-mapping' +
                                chartBySubtype +
                                ind +
                                chartByType +
                                index
                              "
                              :mappingType="
                                configData.chartData[index].indicator
                                  .subIndicator[ind].type
                              "
                              :selectedDE="
                                configData.chartData[index].indicator
                                  .subIndicator[ind].selectedDE
                              "
                              @addDE="addDE"
                              @resetDE="resetDE"
                              @deleteDE="deleteDE"
                              v-if="isDataFetched"
                            />
                          </div>
                        </div>
                      </div>
                    </b-collapse>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";

export default {
  props: [
    "configData",
    "chartBySubtype",
    "chartByModule",
    "chartByType",
    "isDataFetched",
    "globalMapping",
    "metrixList",
    "dataSetsList",
    "indicatorsList",
    "dataElementsList",
  ],
  components: {
    copyMapping: () =>
      import(
        /* webpackChunkName: "admin_copyMapping"*/ "@/components/config/copyMapping"
      ),
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
    SyncMapping: () =>
      import(
        /* webpackChunkName: "admin_SyncMapping"*/ "@/components/config/SyncMapping"
      ),
  },
  data() {
    return {
      configDataWrapper: this.configData,
      updateDOM: 0,
    };
  },
  watch: {
    configData: {
      handler(newValue) {
        this.configDataWrapper = newValue;
      },
      deep: true,
    },
  },
  methods: {
    getUpdatedMapping(updatedMapping, ismatchFound) {
      if (ismatchFound) {
        this.configDataWrapper.chartData = updatedMapping;
        this.$nextTick(() => {
          // this.updateConfigData();
          this.$emit("updateConfigData");
        });
      } else {
        this.$swal({
          title: this.$i18n.t("oops"),
          text: this.$i18n.t("no_match_found"),
        });
      }
    },
    syncMapping(selectedLocaleToCopy) {
      // console.log(selectedLocaleToCopy)
      this.$store.state.loading = true;
      let key = this.generateKey(
        this.chartByModule,
        true,
        true,
        selectedLocaleToCopy
      );

      let response = service.getSavedConfig(key);
      response.then((response) => {
        let data = response.data[this.chartByType][this.chartBySubtype],
          updatedData = [];

        // console.log(this.configData.chartData)
        // console.log(data.chartData)

        this.configDataWrapper.chartData.forEach((c, i) => {
          let innerData = c.indicator,
            dataFromLocale = data.chartData.find((cLocale) => {
              if (Array.isArray(innerData.static_name)) {
                if (Array.isArray(cLocale.indicator.static_name)) {
                  return (
                    cLocale.indicator.static_name[0].toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                } else {
                  return (
                    cLocale.indicator.static_name.toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                }
              } else {
                if (Array.isArray(cLocale.indicator.static_name)) {
                  return (
                    cLocale.indicator.static_name[0].toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                } else {
                  return (
                    cLocale.indicator.static_name.toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                }
              }
            }),
            innerSubInd = [];
          // console.log("dataFromLocale",dataFromLocale)
          if (dataFromLocale) {
            innerData.subIndicator.forEach((subInd, j) => {
              let dataFromSubLocale =
                dataFromLocale.indicator.subIndicator.find((cSubLocale) => {
                  if (Array.isArray(subInd.static_name)) {
                    if (Array.isArray(cSubLocale.static_name)) {
                      return (
                        cSubLocale.static_name[0].toLowerCase() ===
                        subInd.static_name[0].toLowerCase()
                      );
                    } else {
                      return (
                        cSubLocale.static_name.toLowerCase() ===
                        subInd.static_name[0].toLowerCase()
                      );
                    }
                  } else {
                    if (Array.isArray(cSubLocale.static_name)) {
                      return (
                        cSubLocale.static_name[0].toLowerCase() ===
                        subInd.static_name.toLowerCase()
                      );
                    } else {
                      return (
                        cSubLocale.static_name.toLowerCase() ===
                        subInd.static_name.toLowerCase()
                      );
                    }
                  }
                });
              // console.log(dataFromSubLocale)
              if (dataFromSubLocale) {
                innerSubInd.push({
                  ...subInd,
                  de: dataFromSubLocale.de,
                  selectedDE: dataFromSubLocale.selectedDE,
                  type: dataFromSubLocale.type,
                  color: dataFromSubLocale.color,
                });
              } else {
                innerSubInd.push({
                  ...subInd,
                });
              }
            });
            updatedData.push({
              indicator: {
                ...innerData,
                subIndicator: innerSubInd,
                color: dataFromLocale.indicator.color,
                visible: dataFromLocale.indicator.visible,
              },
            });
          } else {
            updatedData.push({
              indicator: {
                ...innerData,
              },
            });
          }
        });
        // console.log(updatedData)
        this.configDataWrapper.chartData = updatedData;
        this.indicatorsType = data.indicatorsType ? data.indicatorsType : "";
        this.$store.state.loading = false;
        if (this.$refs.syncMapping) {
          this.$refs.syncMapping.syncMappingModal();
        }
        this.$nextTick(() => {
          // this.updateConfigData();
          this.$emit("updateConfigData");
        });
      });
    },
    moveItem(index, places) {
      console.log("index, places", index, places);
      if (
        (index === 0 && places === -1) ||
        (index === this.configDataWrapper.chartData.length - 1 && places === 1)
      ) {
        this.$swal({
          title: "Can't Move",
        });
      } else {
        let temp = this.configDataWrapper.chartData[index * 1 + places];
        this.configDataWrapper.chartData[index * 1 + places] =
          this.configDataWrapper.chartData[index];
        this.configDataWrapper.chartData[index] = temp;
        this.updateDOM++;
      }
    },
    //Delete specific mapping
    deleteDE({ index, ind, deIndex, dataKey }) {
      this.configDataWrapper.chartData[index].indicator[dataKey][
        ind
      ].selectedDE.splice(deIndex, 1);
      this.configDataWrapper.chartData[index].indicator[dataKey][ind].de.splice(
        deIndex,
        1
      );
    },
    //Reset the mapping
    resetDE({ index, ind, dataKey }) {
      this.configDataWrapper.chartData[index].indicator[dataKey][ind].de = [];
      this.configDataWrapper.chartData[index].indicator[dataKey][
        ind
      ].selectedDE = [];
    },
    //Store the selected mapping in configuration object
    addDE({ index, ind, type, selectedDataSource, dataKey }) {
      this.configDataWrapper.chartData[index].indicator[dataKey][ind].type =
        type;
      this.configDataWrapper.chartData[index].indicator[dataKey][
        ind
      ].selectedDE.push(selectedDataSource);
      this.configDataWrapper.chartData[index].indicator[dataKey][ind].de.push(
        selectedDataSource.id
      );
    },
  },
};
</script>