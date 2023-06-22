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
                  class=""
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-3 mx-3 main-border"
                >
                  <b-tab
                    :title="$t('applicationPeriod')"
                    active
                    @click="updateActiveSubTab('app_period')"
                    class="p-0 application-border"
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
            $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
          "
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
          v-if="
            $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
          "
          :title="$t('benchmark')"
          :active="activeTab === 'allBenchmarks'"
          @click="updateActiveTab('allBenchmarks')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'allBenchmarks'">
            <div class="md_nested_tabs module-spacing">
              <b-card no-body>
                <b-tabs
                  card
                  class=""
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-11px main-border"
                >
                  <b-tab
                    :title="$t('benchmark')"
                    @click="updateActiveSubTab('benchmarks')"
                    class="p-0"
                  >
                    <b-card-text
                      v-if="activeSubTab === 'benchmarks'"
                      class="border"
                    >
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
        <b-tab
          v-if="
            $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
          "
          :title="$t('extData')"
          :active="activeTab === 'allExtData'"
          @click="updateActiveTab('allExtData')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'allExtData'">
            <div class="md_nested_tabs module-spacing">
              <b-card no-body>
                <b-tabs
                  card
                  class=""
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mt-11px main-border"
                >
                  <b-tab
                    :title="$t('extData')"
                    @click="updateActiveSubTab('extData')"
                    class="p-0"
                  >
                    <b-card-text
                      v-if="activeSubTab === 'extData'"
                      class="border"
                    >
                      <ExternalData
                        module="globalFactors"
                        type="allExtData"
                        subType="extData"
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
import period from "./period";
import MappingWrapper from "./MappingWrapper";
import Benchmark from "./Benchmark";
import ExternalData from "./ExternalData";

export default {
  props: [
    "changeDefaultTab",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
  ],
  components: {
    period,
    Benchmark,
    ExternalData,
    MappingWrapper,
  },
  data() {
    return {
      activeTab: "period",
      activeSubTab: "app_period",
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
      } else if (tab_name === "allExtData") {
        this.activeSubTab = "extData";
      } else if (
        tab_name === "globalMapping" &&
        this.$store.getters.getNamespace ===
          `${this.$store.getters.getAppSettings.tableName}_mnch-dashboard`
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
