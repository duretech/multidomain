<template>
  <!-- <div class="md_tabs"> -->
  <div class="admin-active">
    <b-card no-body>
      <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
        <b-tab
          :title="$t('applicationPeriod')"
          :active="activeTab === 'period'"
          @click="updateActiveTab('period')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'period'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0"
                >
                  <b-tab
                    :title="$t('applicationPeriod')"
                    active
                    @click="updateActiveSubTab('app_period')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'app_period'">
                      <period
                        module="globalFactors"
                        type="period"
                        subType="Period"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="
            $store.getters.getNamespace === `${tableName}_fp-dashboard` &&
            $store.getters.getNamespace !== tableName
          "
          :title="$t('cyp')"
          :active="activeTab === 'cyp'"
          @click="updateActiveTab('cyp')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'cyp'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0"
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
          v-if="
            $store.getters.getNamespace === `${tableName}_fp-dashboard` &&
            $store.getters.getNamespace !== tableName
          "
          :title="$t('continuationFactor')"
          :active="activeTab === 'continuation'"
          @click="updateActiveTab('continuation')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'continuation'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0"
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
        <b-tab
          v-if="$store.getters.getNamespace !== tableName"
          :title="$t('globalMapping')"
          :active="activeTab === 'globalMapping'"
          @click="updateActiveTab('globalMapping')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'globalMapping'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <MappingWrapper
                  module="globalFactors"
                  type="globalMappings"
                  subType="mappings"
                  :indicatorsList="indicatorsList"
                  :dataElementsList="dataElementsList"
                  :dataSetsList="dataSetsList"
                  :metrixList="metrixList"
                />
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="$store.getters.getNamespace !== tableName"
          :title="$t('benchmark')"
          :active="activeTab === 'allBenchmarks'"
          @click="updateActiveTab('allBenchmarks')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'allBenchmarks'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs
                  card
                  class="border"
                  nav-class="p-0 m-0"
                  nav-wrapper-class="adminConfigInner p-0"
                >
                  <b-tab
                    :title="$t('benchmark')"
                    @click="updateActiveSubTab('benchmarks')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'benchmarks'">
                      <Benchmark
                        module="globalFactors"
                        type="allBenchmarks"
                        subType="benchmarks"
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
/*global settings*/
import cyp from "./cyp";
import period from "./period";
import MappingWrapper from "./MappingWrapper";
import Benchmark from "./Benchmark";
import continuation from "./continuation";

export default {
  props: [
    "changeDefaultTab",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
  ],
  components: {
    cyp,
    period,
    Benchmark,
    continuation,
    MappingWrapper,
  },
  data() {
    return {
      activeTab: "period",
      activeSubTab: "app_period",
      tableName: settings.tableName,
    };
  },
  methods: {
    //This is to update active tab name.
    //On the base of the active tab we will render the component.
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      if (tab_name === "period") {
        this.activeSubTab = "app_period";
      } else if (tab_name === "reportTemplate") {
        this.activeSubTab = "app_report";
      } else if (tab_name === "allBenchmarks") {
        this.activeSubTab = "benchmarks";
      } else if (
        tab_name === "globalMapping" &&
        this.$store.getters.getNamespace === `${this.tableName}_mnch-dashboard`
      ) {
        this.activeSubTab = "mappings";
      } else {
        this.activeSubTab = "visits";
      }
    },
    updateActiveSubTab(tab_name) {
      this.activeSubTab = tab_name;
    },
  },
  created() {},
};
</script>
