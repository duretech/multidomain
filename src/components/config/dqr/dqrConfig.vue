<template>
  <div class="dqremu-admin" v-if="isDataFetched">
    <b-card no-body>
      <template v-if="dqrResponse">
        <b-tabs
          card
          vertical
          nav-class="p-0"
          nav-wrapper-class="adminConfig"
        >
          <b-tab
            active
            :title="$t('emu_monthly')"
            @click="updateActiveTab('emu_monthly')"
          >
            <b-card-text v-if="activeTab === 'emu_monthly'">
              <div class="md_nested_tabs card-border1">
                <div
                  class="accordion"
                  role="tablist"
                  v-if="backgroundDataMonthly"
                >
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
                      accordion="accordion-demu1"
                      role="tabpanel"
                      class="border-module"
                    >
                      <b-card-body>
                        <b-card-text>
                          <benchmark-background-config
                            :autoSaveOption="true"
                            :matrixList="matrixList"
                            :dataSetsList="dataSetsList"
                            :indicatorsList="indicatorsList"
                            :dataElementsList="dataElementsList"
                            :moduleConfig="backgroundDataMonthly"
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
                    nav-wrapper-class="adminConfigInner mb-3 mt-2 border-bottomgrey"
                  >
                    <b-tab
                      active
                      :title="$t('visits')"
                      @click="updateActiveSubTab('visits')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'visits'">
                        <emuMonthly
                          chartBySubtype="Visits"
                          :matrixList="matrixList"
                          chartByType="emu_monthly"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
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
                          :matrixList="matrixList"
                          chartByType="emu_monthly"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          chartBySubtype="Commodities_Client"
                          :dataElementsList="dataElementsList"
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
                          :matrixList="matrixList"
                          chartByType="emu_monthly"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          chartBySubtype="Commodities_Facilities"
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
                          chartBySubtype="User"
                          :matrixList="matrixList"
                          chartByType="emu_monthly"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </div>
            </b-card-text>
          </b-tab>
          <b-tab :title="$t('emu_annual')" @click="updateActiveTab('emu')">
            <b-card-text v-if="activeTab === 'emu'">
              <div class="md_nested_tabs card-border1">
                <div class="accordion" role="tablist" v-if="backgroundData">
                  <b-card no-body class="mb-1">
                    <b-card-header
                      header-tag="header"
                      class="p-1 map-header f-s-0-875rem font-weight-bold"
                      role="tab"
                    >
                      <b-button
                        block
                        v-b-toggle.accordion-dan1
                        variant="info"
                        >{{ $t("initialSetup") }}</b-button
                      >
                    </b-card-header>
                    <b-collapse
                      id="accordion-dan1"
                      visible
                      accordion="accordion-dan1"
                      role="tabpanel"
                      class="border-module"
                    >
                      <b-card-body>
                        <b-card-text
                          ><benchmark-background-config
                            :defaultEMUOption="true"
                            :matrixList="matrixList"
                            :dataSetsList="dataSetsList"
                            :moduleConfig="backgroundData"
                            :indicatorsList="indicatorsList"
                            :dataElementsList="dataElementsList"
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
                    nav-wrapper-class="adminConfigInner mb-3 mt-2 border-bottomgrey"
                  >
                    <b-tab
                      active
                      :title="$t('visits')"
                      @click="updateActiveSubTab('visits')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'visits'">
                        <emuAnnual
                          chartByType="emu"
                          chartBySubtype="Visits"
                          :matrixList="matrixList"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
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
                          chartByType="emu"
                          :matrixList="matrixList"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          chartBySubtype="Commodities_Client"
                          :dataElementsList="dataElementsList"
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
                          chartByType="emu"
                          :matrixList="matrixList"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          chartBySubtype="Commodities_Facilities"
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
                          chartByType="emu"
                          chartBySubtype="User"
                          :matrixList="matrixList"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :globalMapping="globalMapping"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('emu_Output')"
                      @click="updateActiveSubTab('output')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'output'">
                        <emuAnnual
                          chartByType="emu"
                          chartBySubtype="Output"
                          :matrixList="matrixList"
                          chartByModule="dqrModule"
                          :dqrResponse="dqrResponse"
                          @updatedData="updatedData"
                          :dataSetsList="dataSetsList"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </div>
            </b-card-text>
          </b-tab>
          <b-tab :title="$t('cyp')" @click="updateActiveTab('cyp')">
            <b-card-text v-if="activeTab === 'cyp'">
              <div class="md_nested_tabs accordion-delete">
                <b-card no-body>
                  <b-tabs
                    card
                    class="border"
                    nav-class="p-0 m-0"
                    nav-wrapper-class="adminConfigInner mb-3 mt-2 border-bottomgrey"
                  >
                    <b-tab
                      :title="$t('visits')"
                      active
                      @click="updateActiveSubTab('visits')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'visits'">
                        <cyp
                          type="cyp"
                          subType="Visits"
                          module="globalFactors"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('Commodities_Client')"
                      @click="updateActiveSubTab('c_client')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'c_client'">
                        <cyp
                          type="cyp"
                          module="globalFactors"
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
                          type="cyp"
                          module="globalFactors"
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
            @click="updateActiveTab('continuation')"
          >
            <b-card-text v-if="activeTab === 'continuation'">
              <div class="md_nested_tabs accordion-delete">
                <b-card no-body>
                  <b-tabs
                    card
                    class="border"
                    nav-class="p-0 m-0"
                    nav-wrapper-class="adminConfigInner mb-3 mt-2 border-bottomgrey"
                  >
                    <b-tab
                      :title="$t('visits')"
                      active
                      @click="updateActiveSubTab('visits')"
                      class="p-0"
                    >
                      <b-card-text v-if="activeSubTab === 'visits'">
                        <continuation
                          subType="Visits"
                          type="continuation"
                          module="globalFactors"
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
                          type="continuation"
                          module="globalFactors"
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
                          type="continuation"
                          module="globalFactors"
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
                          subType="User"
                          type="continuation"
                          module="globalFactors"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </div>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </template>
      <div class="text-center py-3" v-else>
        {{ $t("no_data_to_display") }}
      </div>
    </b-card>
  </div>
</template>
<script>
import service from "@/service";
import assign from "lodash/assign";
import cyp from "@/components/config/global_factors/cyp";
import continuation from "@/components/config/global_factors/continuation";
export default {
  props: [
    "matrixList",
    "dataSetsList",
    "globalMapping",
    "indicatorsList",
    "dataElementsList",
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
    return {
      dqrResponse: null,
      isDataFetched: false,
      activeSubTab: "visits",
      activeTab: "emu_monthly",
    };
  },
  computed: {
    backgroundData() {
      return this.dqrResponse?.emu?.Background_Data || null;
    },
    backgroundDataMonthly() {
      return this.dqrResponse?.emu_monthly?.Background_Data || null;
    },
  },
  methods: {
    updatedData(obj) {
      this.dqrResponse = JSON.parse(JSON.stringify(obj));
    },
    //This is to update active tab name.
    //On the base of the active tab we will render the component.
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      this.activeSubTab = "visits";
    },
    updateActiveSubTab(tab_name) {
      this.activeSubTab = tab_name;
    },
    saveBgData(p_type) {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("dqrModule");
      let saveConfig = service.getSavedConfig({ tableKey: key });
      saveConfig
        .then((res) => {
          let configData = res.data;
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
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
                });
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
              }
              this.$store.commit("setLoading", false);
            })
            .catch((err) => {
              console.log("err", err);
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.$store.commit("setLoading", false);
            });
        })
        .catch((err) => {
          console.log("err", err);
          this.sweetAlert({
            title: this.$i18n.t("error"),
          });
          this.$store.commit("setLoading", false);
        });
    },
    //This is to fetch config data on page load
    getConfigData() {
      let key = this.generateKey("dqrModule");
      let response = service.getSavedConfig({ tableKey: key });
      response
        .then((response) => {
          this.dqrResponse = response.data;
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
  },
  created() {
    this.$store.commit("setLoading", true);
    this.getConfigData();
  },
};
</script>
