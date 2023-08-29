<template>
  <div class="m-t-20px datamappingtopcar">
    <b-tabs nav-class="appCongigtabSub mb-4" lazy>
      <b-tab
        :title="$t('globalSettings')"
        :active="tab === 'nav-gf-tab'"
        @click="updateActiveTab('nav-gf-tab')"
      >
        <b-card-text v-if="tab === 'nav-gf-tab'">
          <div class="md_nested_tabs">
            <gf-config
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              :changeDefaultTab="changeDefaultTab"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('summary_dashboard')"
        :active="tab === 'nav-md-tab'"
        @click="updateActiveTab('nav-md-tab')"
        v-if="
          allowedModules.includes('ministerial') &&
          $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
        "
      >
        <b-card-text v-if="tab === 'nav-md-tab'">
          <div
            class="md_nested_tabs"
            v-if="indicatorsList && dataElementsList && dataSetsList && orgList"
          >
            <SDMCHConfig
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              moduleKey="summaryDashboard"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('analytical_dashboard')"
        :active="tab === 'nav-ad-tab'"
        @click="updateActiveTab('nav-ad-tab')"
        v-if="
          allowedModules.includes('analytical') &&
          $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
        "
      >
        <b-card-text v-if="tab === 'nav-ad-tab'">
          <div
            class="md_nested_tabs"
            v-if="indicatorsList && dataElementsList && dataSetsList && orgList"
          >
            <SDMCHConfig
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              moduleKey="analyticalDashboard"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('DQR')"
        :active="tab === 'nav-dqr-tab'"
        @click="updateActiveTab('nav-dqr-tab')"
        v-if="
          allowedModules.includes('dqr') &&
          $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
        "
      >
        <b-card-text v-if="tab === 'nav-dqr-tab'">
          <div
            class="md_nested_tabs"
            v-if="indicatorsList && dataElementsList && dataSetsList && orgList"
          >
            <SDMCHConfig
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              moduleKey="dqrDashboard"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="`${$t('DQR')} - ${$t('EMU')}`"
        :active="tab === 'nav-dqr-tab-emu'"
        @click="updateActiveTab('nav-dqr-tab-emu')"
        v-if="
          allowedModules.includes('dqr') &&
          $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName &&
          $store.getters.getNamespace.includes('_fp-')
        "
      >
        <b-card-text v-if="tab === 'nav-dqr-tab-emu'">
          <div
            class="md_nested_tabs"
            v-if="indicatorsList && dataElementsList && dataSetsList && orgList"
          >
            <dqrConfig
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              @updateActiveTab="updateActiveTab"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('mapVisualization')"
        :active="tab === 'nav-map-tab'"
        @click="updateActiveTab('nav-map-tab')"
        v-if="
          allowedModules.includes('map') &&
          $store.getters.getNamespace !==
            $store.getters.getAppSettings.tableName
        "
      >
        <b-card-text v-if="tab === 'nav-map-tab'">
          <div class="md_nested_tabs">
            <mapConfig
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="dSourceGroupList"
              :orgList="orgList"
              :langList="langList"
              v-if="
                indicatorsList &&
                dataElementsList &&
                dataSetsList &&
                orgList.length > 0
              "
            />
          </div>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import service from "@/service";

export default {
  props: ["langList", "orgList"],
  components: {
    SDMCHConfig: () =>
      import(
        /* webpackChunkName: "adm_Config"*/ "@/components/config/Common/SDMCHConfig"
      ),
    gfConfig: () =>
      import(
        /* webpackChunkName: "adm_gSettings"*/ "@/components/config/global_factors/gfConfig"
      ),
    mapConfig: () =>
      import(
        /* webpackChunkName: "adm_mapViz"*/ "@/components/config/mapViz/mapConfig"
      ),
    dqrConfig: () =>
      import(
        /* webpackChunkName: "adm_dqr"*/ "@/components/config/dqr/dqrConfig"
      ),
  },
  data() {
    return {
      tab: "nav-gf-tab",
      changeDefaultTab: false,
      indicatorsList: [],
      dataElementsList: [],
      dataSetsList: [],
      allowedModules: ["ministerial", "analytical", "dqr", "map"],
    };
  },
  computed: {
    dSourceGroupList() {
      return [
        {
          id: "[All metrics]",
          displayName: this.$i18n.t("allMetrics"),
          alias: "ALL",
        },
        {
          id: "Reporting rates",
          displayName: this.$i18n.t("reportingRates"),
          alias: "REPORTING_RATE",
        },
        {
          id: "Reporting rates on time",
          displayName: this.$i18n.t("reportingRatesOnTime"),
          alias: "REPORTING_RATE_ON_TIME",
        },
        {
          id: "Actual reports",
          displayName: this.$i18n.t("actualReports"),
          alias: "ACTUAL_REPORTS",
        },
        {
          id: "Actual reporting rates on time",
          displayName: this.$i18n.t("actualReportingRatesOnTime"),
          alias: "ACTUAL_REPORTS_ON_TIME",
        },
        {
          id: "Expected reports",
          displayName: this.$i18n.t("expectedReports"),
          alias: "EXPECTED_REPORTS",
        },
      ];
    },
  },
  methods: {
    updateActiveTab(tab_name, fromDQR = false) {
      this.tab = tab_name;
      this.changeDefaultTab = false;
      if (fromDQR) {
        this.changeDefaultTab = true;
      }
    },
  },
  created() {
    //This is to fetch list of Indicator(s)
    let indicatorsList = service.getIndicators();
    indicatorsList.then((indicatorsList) => {
      this.indicatorsList = indicatorsList.data?.indicators || [];
    });

    //This is to fetch list of Data Set(s)
    let dataSetsList = service.getDataSets();
    dataSetsList.then((dataSetsList) => {
      let originalDSets = [];
      if (dataSetsList.data?.dataSets?.length) {
        dataSetsList.data.dataSets.forEach((d) => {
          this.dSourceGroupList.forEach((ds) => {
            if (ds.alias !== "ALL") {
              originalDSets.push({
                ...d,
                id: d.id + "." + ds.alias,
                displayName: d.displayName + " (" + ds.displayName + ")",
                dataSourceGroup: ds.id,
              });
            }
          });
        });
      }
      this.dataSetsList = originalDSets;
    });

    //This is to fetch list of Data Element(s)
    let dataElementsList = service.getDataElements();
    dataElementsList.then((dataElementsList) => {
      this.dataElementsList = dataElementsList.data?.dataElements || [];
    });
  },
};
</script>