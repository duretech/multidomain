<template>
  <!-- <div class="md_tabs py-3"> -->
  <div class="dqremu-admin">
    <b-card no-body>
      <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
        <b-tab
          :title="$t('emu_monthly')"
          :active="activeTab === 'emu_monthly'"
          @click="updateActiveTab('emu_monthly')"
          class="pl-2 pb-0 pt-0 pr-0 border m-4"
        >
          <b-card-text v-if="activeTab === 'emu_monthly'">
            <div class="md_nested_tabs module-spacing card-border1">
              <div class="accordion" role="tablist">
                <b-card no-body class="mb-1">
                  <b-card-header
                    header-tag="header"
                    class="p-1 map-header f-s-0-875rem font-weight-bold"
                    role="tab"
                  >
                    <b-button block v-b-toggle.accordion-demu1 variant="info">
                      {{ $t("initialSetup") }}</b-button
                    >
                  </b-card-header>
                  <b-collapse
                    id="accordion-demu1"
                    visible
                    accordion="my-accordion"
                    role="tabpanel"
                    class="border-module"
                  >
                    <b-card-body>
                      <b-card-text>
                        <benchmark-background-config
                          :moduleConfig="backgroundDataMonthly"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :matrixList="matrixList"
                          :autoSaveOption="true"
                        />
                      </b-card-text>
                    </b-card-body>
                    <div class="col-12 text-right mb-3">
                      <button
                        type="button"
                        class="btn btn-primary black-btn save-btn"
                        @click="saveBgData('emu_monthly')"
                      >
                        {{ $t("savebtn") }}
                      </button>
                    </div>
                  </b-collapse>
                </b-card>
              </div>

              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner mb-3 mt-2"
                >
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Visits"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Commodities_Client"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Facilities')"
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Commodities_Facilities"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="User"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('emu_annual')"
          :active="activeTab === 'emu'"
          @click="updateActiveTab('emu')"
          class="pl-2 pb-0 pt-0 pr-0 border m-4"
        >
          <b-card-text v-if="activeTab === 'emu'">
            <div class="md_nested_tabs module-spacing card-border1">
              <div class="accordion" role="tablist">
                <b-card no-body class="mb-1">
                  <b-card-header
                    header-tag="header"
                    class="p-1 map-header f-s-0-875rem font-weight-bold"
                    role="tab"
                  >
                    <b-button block v-b-toggle.accordion-dan1 variant="info">{{
                      $t("initialSetup")
                    }}</b-button>
                  </b-card-header>
                  <b-collapse
                    id="accordion-dan1"
                    visible
                    accordion="my-accordion"
                    role="tabpanel"
                    class="border-module"
                  >
                    <b-card-body>
                      <b-card-text
                        ><benchmark-background-config
                          :moduleConfig="backgroundData"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :matrixList="matrixList"
                          :defaultEMUOption="true"
                        />
                      </b-card-text>
                    </b-card-body>
                    <div class="row mb-4">
                      <div class="col-12 text-right">
                        <button
                          type="button"
                          class="btn btn-primary black-btn save-btn"
                          @click="saveBgData('emu')"
                        >
                          {{ $t("savebtn") }}
                        </button>
                      </div>
                    </div>
                  </b-collapse>
                </b-card>
              </div>
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-2 m-3"
                >
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Visits"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Commodities_Client"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Facilities')"
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Commodities_Facilities"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="User"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('output')"
                    @click="updateActiveSubTab('output')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'output'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Output"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :matrixList="matrixList"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('cyp')"
          :active="activeTab === 'cyp'"
          @click="updateActiveTab('cyp')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'cyp'">
            <div class="md_nested_tabs module-spacing accordion-delete">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-4 mx-3"
                >
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <cyp module="globalFactors" type="cyp" subType="Visits" />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <cyp
                        module="globalFactors"
                        type="cyp"
                        subType="Commodities_Client"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Facilities')"
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <cyp
                        module="globalFactors"
                        type="cyp"
                        subType="Commodities_Facilities"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <cyp module="globalFactors" type="cyp" subType="User" />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('continuationFactor')"
          :active="activeTab === 'continuation'"
          @click="updateActiveTab('continuation')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'continuation'">
            <div class="md_nested_tabs module-spacing accordion-delete">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-4 mx-3"
                >
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <continuation
                        module="globalFactors"
                        type="continuation"
                        subType="Visits"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <continuation
                        module="globalFactors"
                        type="continuation"
                        subType="Commodities_Client"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Facilities')"
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <continuation
                        module="globalFactors"
                        type="continuation"
                        subType="Commodities_Facilities"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <continuation
                        module="globalFactors"
                        type="continuation"
                        subType="User"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import emuAnnualConfig from "@/config/emuAnnualConfig.js";
import emuMonthlyConfig from "@/config/emuMonthlyConfig.js";
import service from "@/service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import cyp from "@/components/config/global_factors/cyp";
import continuation from "@/components/config/global_factors/continuation";
export default {
  props: [
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "matrixList",
    "globalMapping",
  ],
  components: {
    cyp,
    continuation,
    emuAnnual: () => import(/* webpackChunkName: "adm_emuA"*/ "./emuAnnual"),
    benchmarkBackgroundConfig: () =>
      import(
        /* webpackChunkName: "adm_emuBGSettings"*/ "./benchmarkBackgroundConfig"
      ),
    emuMonthly: () => import(/* webpackChunkName: "adm_emuM"*/ "./emuMonthly"),
  },
  data() {
    // console.log("emuMonthlyConfig.dqrModule.emu_monthly.Background_Data",emuMonthlyConfig.dqrModule.emu_monthly.Background_Data)
    return {
      activeTab: "emu_monthly",
      activeSubTab: "visits",
      backgroundData: emuAnnualConfig.dqrModule.emu.Background_Data,
      backgroundDataMonthly:
        emuMonthlyConfig.dqrModule.emu_monthly.Background_Data,
    };
  },
  methods: {
    //This is to update active tab name.
    //On the base of the active tab we will render the component.
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      this.activeSubTab = "visits";
    },
    updateActiveSubTab(tab_name) {
      this.activeSubTab = tab_name;
    },
    getBGInfo(response) {
      this.backgroundData = emuAnnualConfig.dqrModule.emu.Background_Data;
      this.backgroundDataMonthly =
        emuMonthlyConfig.dqrModule.emu_monthly.Background_Data;
      this.$nextTick(() => {
        if (response.emu.Background_Data) {
          let mergedData = merge(
            this.backgroundData,
            response.emu.Background_Data
          );
          this.backgroundData = JSON.parse(JSON.stringify(mergedData));
        }
        // console.log("this.backgroundData after merging",this.backgroundData)

        if (response.emu_monthly.Background_Data) {
          let mergedData = merge(
            this.backgroundDataMonthly,
            response.emu_monthly.Background_Data
          );
          this.backgroundDataMonthly = JSON.parse(JSON.stringify(mergedData));
        }
      });
    },
    saveBgData(p_type) {
      // console.log(p_type)
      // console.log(this.backgroundData)
      // console.log(this.backgroundDataMonthly)
      this.$store.commit("setLoading", true);
      let key = this.generateKey("dqrModule");

      // console.log("key", key)
      let allKeys = service.getAllKeys({});
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig({ tableKey: key });
          saveConfig.then((res) => {
            let configData = res.data;
            // console.log("configData",configData);
            if (p_type === "emu") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: this.backgroundData,
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: configData[p_type].Background_Data
                    ? assign(
                        configData[p_type].Background_Data,
                        this.backgroundData
                      )
                    : this.backgroundData,
                };
              }
            }
            if (p_type === "emu_monthly") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: this.backgroundDataMonthly,
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: configData[p_type].Background_Data
                    ? assign(
                        configData[p_type].Background_Data,
                        this.backgroundDataMonthly
                      )
                    : this.backgroundDataMonthly,
                };
              }
            }
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
          let dqr = {};
          if (p_type === "emu") {
            dqr = {
              [p_type]: {
                Background_Data: this.backgroundData,
              },
            };
          }
          if (p_type === "emu_monthly") {
            dqr = {
              [p_type]: {
                Background_Data: this.backgroundDataMonthly,
              },
            };
          }
          let response = service.saveConfig({ data: dqr, tableKey: key });
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
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
  created() {},
};
</script>
