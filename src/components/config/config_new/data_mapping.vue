<template>
  <div class="m-t-20px datamappingtopcar">
    <b-tabs nav-class="appCongigtabSub" lazy>
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
              :metrixList="dSourceGroupList"
              :orgList="orgList"
              :supportedLanguages="supportedLanguages"
              :changeDefaultTab="changeDefaultTab"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('ministerial')"
        :active="tab === 'nav-md-tab'"
        @click="updateActiveTab('nav-md-tab')"
        v-if="
          allowedModules.includes('ministerial') &&
          $store.getters.getNamespace !== tableName
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
              :metrixList="dSourceGroupList"
              :orgList="orgList"
              :supportedLanguages="supportedLanguages"
              moduleKey="summaryDashboard"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('analytical')"
        :active="tab === 'nav-ad-tab'"
        @click="updateActiveTab('nav-ad-tab')"
        v-if="
          allowedModules.includes('analytical') &&
          $store.getters.getNamespace !== tableName
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
              :metrixList="dSourceGroupList"
              :orgList="orgList"
              :supportedLanguages="supportedLanguages"
              moduleKey="analyticalDashboard"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title="$t('dataQuality')"
        :active="tab === 'nav-dqr-tab'"
        @click="updateActiveTab('nav-dqr-tab')"
        v-if="
          allowedModules.includes('dqr') &&
          $store.getters.getNamespace !== tableName
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
              :metrixList="dSourceGroupList"
              :orgList="orgList"
              :supportedLanguages="supportedLanguages"
              moduleKey="dqrDashboard"
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
          $store.getters.getNamespace !== tableName
        "
      >
        <b-card-text v-if="tab === 'nav-map-tab'">
          <div class="md_nested_tabs">
            <mapConfig
              chartByModule="adAnchorMapModule"
              chartByType="anchorMap"
              chartBySubtype="anchorMap"
              :defaultLevelID="defaultLevelID"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :metrixList="dSourceGroupList"
              :orgList="orgList"
              :supportedLanguages="supportedLanguages"
              v-if="
                indicatorsList &&
                dataElementsList &&
                dataSetsList &&
                orgList.length > 0 &&
                defaultLevelID
              "
            />
          </div>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
/*global settings*/
import service from "@/service";

export default {
  props: ["supportedLanguages", "modules", "orgList"],
  components: {
    SDMCHConfig: () =>
      import(
        /* webpackChunkName: "admin_SDMCHConfig"*/ "../Common/SDMCHConfig"
      ),
    gfConfig: () =>
      import(
        /* webpackChunkName: "admin_globalSettings"*/ "../global_factors/gfConfig"
      ),
    mapConfig: () =>
      import(
        /* webpackChunkName: "admin_mapVisualization"*/ "../mapViz/mapConfig"
      ),
  },
  data() {
    return {
      defaultLevelID: "",
      tab: "nav-gf-tab",
      changeDefaultTab: false,
      indicatorsList: [],
      dataElementsList: [],
      dataSetsList: [],
      dSourceGroupList: [
        {
          id: "[All metrics]",
          name: "[All metrics]",
          alias: "ALL",
        },
        {
          id: "Reporting rates",
          name: "Reporting rates",
          alias: "REPORTING_RATE",
        },
        {
          id: "Reporting rates on time",
          name: "Reporting rates on time",
          alias: "REPORTING_RATE_ON_TIME",
        },
        {
          id: "Actual reports",
          name: "Actual reports",
          alias: "ACTUAL_REPORTS",
        },
        {
          id: "Actual reporting rates on time",
          name: "Actual reporting rates on time",
          alias: "ACTUAL_REPORTS_ON_TIME",
        },
        {
          id: "Expected reports",
          name: "Expected reports",
          alias: "EXPECTED_REPORTS",
        },
      ],
      // orgList: [],
      allowedModules: ["ministerial", "analytical", "dqr", "map"],
      tableName: settings.tableName,
    };
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
    if (this.$store.getters.getApplicationModule(true)) {
      this.defaultLevelID =
        this.$store.getters.getApplicationModule(true).defaultLevelID;
    }
    if (this.$store.state.appId && this.$store.state.appUserId) {
      this.allowedModules = this.modules;
    }

    if (this.$i18n.locale === "fr") {
      this.dSourceGroupList = [
        {
          id: "[All metrics]",
          name: this.$i18n.t("allMetrics"),
          alias: "ALL",
        },
        {
          id: "Reporting rates",
          name: this.$i18n.t("reportingRates"),
          alias: "REPORTING_RATE",
        },
        {
          id: "Reporting rates on time",
          name: this.$i18n.t("reportingRatesOnTime"),
          alias: "REPORTING_RATE_ON_TIME",
        },
        {
          id: "Actual reports",
          name: this.$i18n.t("actualReports"),
          alias: "ACTUAL_REPORTS",
        },
        {
          id: "Actual reporting rates on time",
          name: this.$i18n.t("actualReportingRatesOnTime"),
          alias: "ACTUAL_REPORTS_ON_TIME",
        },
        {
          id: "Expected reports",
          name: this.$i18n.t("expectedReports"),
          alias: "EXPECTED_REPORTS",
        },
      ];
    }

    //This is to fetch list of Indicator(s)
    let indicatorsList = service.getIndicators();
    indicatorsList.then((indicatorsList) => {
      // console.log("indicatorsList",indicatorsList);
      this.indicatorsList = indicatorsList.data.indicators;
    });

    //This is to fetch list of Data Set(s)
    let dataSetsList = service.getDataSets();
    dataSetsList.then((dataSetsList) => {
      // console.log("dataSetsList",dataSetsList);
      let originalDSets = [];
      dataSetsList.data.dataSets.forEach((d) => {
        this.dSourceGroupList.forEach((ds) => {
          if (ds.alias !== "ALL") {
            originalDSets.push({
              ...d,
              id: d.id + "." + ds.alias,
              displayName: d.displayName + " (" + ds.name + ")",
              dataSourceGroup: ds.id,
            });
          }
        });
      });
      // console.log("originalDSets",originalDSets);

      this.dataSetsList = originalDSets;
    });

    //This is to fetch list of Data Element(s)
    let dataElementsList = service.getDataElements();
    dataElementsList.then((dataElementsList) => {
      // console.log("dataElementsList",dataElementsList);
      this.dataElementsList = dataElementsList.data.dataElements;
    });

    //This is to fetch list of organisationUnitLevels(s)
    // let orgLevelList = service.getOrganisationUnitLevels();
    // orgLevelList.then(orgList => {
    //   // console.log("orgList",orgList.data.organisationUnitLevels);
    //   this.orgList = orgList.data.organisationUnitLevels
    // });
  },
};
</script>