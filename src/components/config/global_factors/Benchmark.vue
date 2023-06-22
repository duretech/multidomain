<template>
  <div clas="">
    <b-card>
      <b-row>
        <b-col sm="12" class="text-right mb-3" v-if="benchmarks.length">
          <b-form-input
            type="text"
            v-model="searchText"
            :placeholder="$t('search')"
            class="w-25"
          ></b-form-input>
        </b-col>
        <b-col sm="12">
          <div class="accordion no-header" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-bench1 variant="info">{{
                  $t("benchmark")
                }}</b-button>
              </b-card-header>
              <b-collapse
                id="accordion-bench1"
                visible
                accordion="my-benchaccordion"
                role="tabpanel"
                class="accordion-delete"
              >
                <b-card-body>
                  <b-card-text>
                    <b-col sm="12">
                      <div class="accordion" role="tablist">
                        <b-card
                          no-body
                          class="mb-1"
                          v-for="(benchmark, bInd) in filteredBenchmarks"
                          :key="benchmark.id"
                        >
                          <div class="p-2" role="tab">
                            <img
                              src="@/assets/images/icons/admindelete-icon.svg"
                              :style="{ filter: filterColor }"
                              class="cursor-pointer f-s-0-875rem w-13 mr-2"
                              v-b-tooltip.hover
                              :title="$t('deletebtn')"
                              @click.prevent.stop="
                                deleteBenchmark(benchmark.id)
                              "
                            />
                            <b-button
                              v-b-toggle="'accordion-' + bInd"
                              class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
                            >
                              <img
                                src="@/assets/images/icons/adminsetting-icon.svg"
                                :style="{ filter: filterColor }"
                                class="mr-2 cursor-pointer f-s-0-875rem w-14"
                                v-b-tooltip.hover
                                :title="$t('settings')"
                              />
                              {{
                                benchmark.displayName[$i18n.locale]
                              }}</b-button
                            >
                          </div>
                          <div class="bordertop-grey mt-2"></div>
                          <b-collapse
                            :id="'accordion-' + bInd"
                            accordion="my-accordion"
                            role="tabpanel"
                            class="border-bottomgrey"
                          >
                            <b-card-body>
                              <b-row class="">
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`displayName-${bInd}`">{{
                                        $t("name")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group
                                        :id="`displayName-${bInd}`"
                                      >
                                        <b-form-input
                                          type="text"
                                          v-model="
                                            benchmark.displayName[$i18n.locale]
                                          "
                                          disabled
                                        ></b-form-input>
                                        <b-input-group-append is-text>
                                          <Translations
                                            :transText.sync="
                                              benchmark.displayName
                                            "
                                          />
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`plotLineType-${bInd}`"
                                        >{{ $t("benchmark") }}
                                        {{ $t("type") }}</label
                                      >
                                    </b-col>
                                    <b-col sm="7">
                                      <b-form-select
                                        :id="`plotLineType-${bInd}`"
                                        v-model="benchmark.plotLineType"
                                        :options="plotLineTypes()"
                                      ></b-form-select>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`dashStyle-${bInd}`">{{
                                        $t("line_type")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-form-select
                                        :id="`dashStyle-${bInd}`"
                                        v-model="benchmark.plotLine.dashStyle"
                                        :options="dashStyles"
                                      ></b-form-select>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <transition name="slide-fade">
                                  <b-col
                                    sm="12"
                                    lg="6"
                                    class="mb-3"
                                    v-if="benchmark.plotLineType === 'custom'"
                                  >
                                    <b-row>
                                      <b-col sm="5"
                                        ><label :for="`value-${bInd}`"
                                          >{{ $t("line_value") }} (%)</label
                                        >
                                      </b-col>
                                      <b-col sm="7">
                                        <b-form-input
                                          type="number"
                                          :id="`value-${bInd}`"
                                          v-model.number="
                                            benchmark.plotLine.value
                                          "
                                        ></b-form-input>
                                      </b-col>
                                    </b-row>
                                  </b-col>
                                </transition>
                                <transition name="slide-fade">
                                  <b-col
                                    sm="12"
                                    lg="6"
                                    class="mb-3"
                                    v-if="benchmark.plotLineType === 'external'"
                                  >
                                    <b-row>
                                      <b-col sm="5"
                                        ><label :for="`value-${bInd}`"
                                          >{{ $t("line_value") }} (%)</label
                                        >
                                      </b-col>
                                      <b-col sm="7">
                                        <b-form-select
                                          :id="`value-${bInd}`"
                                          v-model="benchmark.plotLine.extID"
                                          :options="getExtData()"
                                        ></b-form-select>
                                      </b-col>
                                    </b-row>
                                  </b-col>
                                </transition>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`color-${bInd}`">{{
                                        $t("line_color")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group :id="`color-${bInd}`">
                                        <b-form-input
                                          type="text"
                                          v-model="benchmark.plotLine.color"
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-form-input
                                            type="color"
                                            class="w-40px"
                                            v-model="benchmark.plotLine.color"
                                          ></b-form-input>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`width-${bInd}`">{{
                                        $t("line_width")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-form-select
                                        :id="`width-${bInd}`"
                                        v-model="benchmark.plotLine.width"
                                      >
                                        <b-form-select-option
                                          :value="n"
                                          v-for="n in 5"
                                          :key="'width-' + bInd + n"
                                          >{{ n }}</b-form-select-option
                                        >
                                      </b-form-select>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`label_text-${bInd}`">{{
                                        $t("label_text")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group :id="`label_text-${bInd}`">
                                        <b-form-input
                                          type="text"
                                          v-model="
                                            benchmark.plotLine.label.text[
                                              $i18n.locale
                                            ]
                                          "
                                          disabled
                                        ></b-form-input>
                                        <b-input-group-append is-text>
                                          <Translations
                                            :transText.sync="
                                              benchmark.plotLine.label.text
                                            "
                                          />
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`label_position-${bInd}`">{{
                                        $t("label_position")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-form-select
                                        :id="`label_position-${bInd}`"
                                        v-model="benchmark.plotLine.label.align"
                                        :options="labelPositions"
                                      ></b-form-select>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`label_color-${bInd}`">{{
                                        $t("label_color")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group
                                        :id="`label_color-${bInd}`"
                                      >
                                        <b-form-input
                                          type="text"
                                          v-model="
                                            benchmark.plotLine.label.style.color
                                          "
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-form-input
                                            type="color"
                                            class="w-40px"
                                            v-model="
                                              benchmark.plotLine.label.style
                                                .color
                                            "
                                          ></b-form-input>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </b-col>
                    <b-col
                      sm="12"
                      class="text-center"
                      v-if="
                        benchmarks.length && filteredBenchmarks.length === 0
                      "
                    >
                      {{ $t("noBenchmark") }}
                    </b-col>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
        <b-col sm="12" class="text-center" v-if="benchmarks.length === 0">
          {{ $t("addBenchmark") }}
          <code>{{ $t("addbtn") }}</code> {{ $t("btnBelow") }}
        </b-col>
        <b-col sm="12" class="text-right pt-3">
          <b-button class="black-btn ml-2" @click="addBenchmark">{{
            $t("addbtn")
          }}</b-button>
          <b-button
            class="black-btn save-btn ml-2"
            @click="updateConfigData"
            v-if="benchmarks.length"
            >{{ $t("savebtn") }}</b-button
          >
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import { randomString } from "@/components/Common/commonFunctions";

const benchmarkConfig = {
  id: null,
  displayName: {},
  plotLineType: "custom",
  plotLine: {
    id: null,
    width: 1,
    zIndex: 5,
    value: 80,
    color: "#ff0000",
    dashStyle: "solid",
    label: {
      text: {},
      align: "center",
      style: {
        color: "#f6f6f6",
      },
    },
  },
};
export default {
  props: ["module", "type", "subType"],
  mixins: [DynamicImageMixin, ReFetchConfigMixin],
  components: {
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      searchText: "",
      benchmarks: [],
      originalBenchmarks: null,
    };
  },
  computed: {
    getExtData: function () {
      return function () {
        let gSetting = this.$store.getters.getGlobalFactors();
        let arr = [];
        if (gSetting?.allExtData?.extData?.length) {
          gSetting.allExtData.extData.forEach((m) => {
            arr.push({
              text: m.displayName[this.$i18n.locale],
              value: m.id,
            });
          });
        }
        return arr;
      };
    },
    filteredBenchmarks() {
      let list = this.benchmarks;
      list = list.filter((l) =>
        l.displayName[this.$i18n.locale]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
      return list;
    },
    plotLineTypes: function () {
      return function () {
        let arr = [];
        arr.push({
          text: this.$i18n.t("custom"),
          value: "custom",
        });
        arr.push({
          text: this.$i18n.t("extData"),
          value: "external",
        });
        arr.push({
          text: this.$i18n.t("nationalBenchmark"),
          value: "national",
        });
        return arr;
      };
    },
    labelPositions() {
      return [
        { value: "left", text: this.$i18n.t("left") },
        { value: "center", text: this.$i18n.t("center") },
        { value: "right", text: this.$i18n.t("right") },
      ];
    },
    dashStyles() {
      return [
        { value: "solid", text: this.$i18n.t("solid") },
        { value: "shortdash", text: this.$i18n.t("shortdash") },
        { value: "shortdot", text: this.$i18n.t("shortdot") },
        { value: "shortdashdot", text: this.$i18n.t("shortdashdot") },
        { value: "shortdashdotdot", text: this.$i18n.t("shortdashdotdot") },
        { value: "dot", text: this.$i18n.t("dot") },
        { value: "dash", text: this.$i18n.t("dash") },
        { value: "longdash", text: this.$i18n.t("longdash") },
        { value: "dashdot", text: this.$i18n.t("dashdot") },
        { value: "longdashdot", text: this.$i18n.t("longdashdot") },
        { value: "longdashdotdot", text: this.$i18n.t("longdashdotdot") },
      ];
    },
  },
  methods: {
    //To delete benchmark
    deleteBenchmark(id) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.benchmarks = this.benchmarks.filter((b) => b.id !== id);
        }
      });
    },
    //To add new benchmark
    addBenchmark() {
      let config = JSON.parse(JSON.stringify(benchmarkConfig));
      this.benchmarks.push({
        ...config,
        id: randomString(16),
        displayName: { [this.$i18n.locale]: this.$i18n.t("default") },
        plotLine: {
          ...config.plotLine,
          id: randomString(16),
        },
      });
    },
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (response.data[this.type][this.subType]) {
            let list = response.data[this.type][this.subType];
            list =
              list && list.length
                ? list.map((l) => ({
                    ...l,
                    displayName:
                      typeof l.displayName === "string"
                        ? { [this.$i18n.locale]: l.displayName }
                        : l.displayName,
                  }))
                : [];
            this.benchmarks = list;
            this.originalBenchmarks = JSON.parse(JSON.stringify(list));
          }
          this.$store.state.loading = false;
        })
        .catch((err) => {
          console.log("Config not found...", err);
          this.$store.state.loading = false;
          this.reFetchConfig(err);
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;
      let benchmarks = this.benchmarks;

      let key = this.generateKey(this.module);

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            if (!configData[this.type]) {
              configData[this.type] = {};
            }
            configData[this.type][this.subType] = benchmarks;
            let configChanges = {};
            // let configChanges = audit.configAudit(
            //   this.originalBenchmarks,
            //   configData[this.type][this.subType]
            // );
            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                  this.originalBenchmarks = JSON.parse(
                    JSON.stringify(this.benchmarks)
                  );
                  this.$store.state.loading = false;
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: error,
                });

                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: benchmarks,
            },
          };
          let response = service.saveConfig(configData, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.$store.commit("setGlobalFactors", {
                payload: configData,
              });
              this.originalBenchmarks = JSON.parse(
                JSON.stringify(this.benchmarks)
              );
              this.$store.state.loading = false;
            } else {
              this.sweetAlert({
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
