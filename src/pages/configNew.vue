<template>
  <div class="admin-side mdgridviewpage-bg" id="box">
    <header-component
      @langChange="langChange"
      :subTabsBtn="showTabsBtn"
      :openTabPopUp="openTabPopUp"
      :bgDataConfig="bgDataConfig"
      :langList="langList"
    ></header-component>
    <div class="container-fluid mt-4">
      <div class="scrollToTopDiv" v-if="lastScrollPosition > 200">
        <button
          @click.stop.prevent="scrollToTop"
          class="scrollToTopBtn btn btn-light"
          v-b-tooltip.hover
          :title="$t('backToTop')"
        >
          <i class="fa fa-chevron-up" aria-hidden="true"></i>
        </button>
      </div>
      <div
        class="row admin-sidebar dashboardchart-container globalconfigcontainer px-2"
        id="scrollBox"
      >
        <div class="col-lg-12 mt-3">
          <div>
            <b-tabs nav-class="" lazy>
              <b-tab
                :title="$t('applicationSetup')"
                active
                @click="showTabsBtns(false)"
              >
                <applicationSetup
                  @isGlobalConfigSet="globalConfigSet"
                  @langChange="langChange"
                  :langList="langList"
                  :levelIDList="levelIDList"
                  :preFetchData="preFetchData"
                />
              </b-tab>
              <b-tab
                title="Indicator Calculator"
                id="IndicatorCalculator"
                v-if="
                  isGlobalConfigSet &&
                  ((!$store.getters.getIsMultiProgram &&
                    $store.getters.getNamespace.includes('_fp-dashboard')) ||
                    ($store.getters.getIsMultiProgram &&
                      $store.getters.getNamespace ===
                        $store.getters.getAppSettings.tableName)) &&
                  $store.getters.getAppSettings.isIC
                "
                @click="showTabsBtns(true)"
              >
                <indicatorCalculator
                  v-if="bgDataConfig"
                  :bgDataConfig="bgDataConfig"
                />
              </b-tab>
              <b-tab
                :title="$t('dataMapping')"
                v-if="isGlobalConfigSet"
                @click="showTabsBtns(false)"
              >
                <dataMapping
                  v-if="isGlobalConfigSet"
                  :langList="langList"
                  :orgList="orgList"
                />
              </b-tab>
              <b-tab
                :title="$t('userManagement')"
                v-if="
                  isGlobalConfigSet &&
                  (!$store.getters.getIsMultiProgram ||
                    ($store.getters.getIsMultiProgram &&
                      $store.getters.getNamespace ===
                        $store.getters.getAppSettings.tableName)) &&
                  !$store.getters.getAppSettings.bypassUser
                "
                @click="showTabsBtns(false)"
              >
                <userManagement v-if="isGlobalConfigSet" :langList="langList" />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import UsesAnalyticsMixin from "@/helpers/UsesAnalyticsMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import headerComponent from "@/components/config/headerComponent";
import dataMapping from "@/components/config/config_new/data_mapping";
import userManagement from "@/components/config/config_new/user_management";
import applicationSetup from "@/components/config/config_new/application_setup";
import indicatorCalculator from "@/components/config/config_new/indicator_calculator";

export default {
  props: ["preFetchData"],
  components: {
    dataMapping,
    userManagement,
    headerComponent,
    applicationSetup,
    indicatorCalculator,
  },
  mixins: [DocumentTitleMixin, UsesAnalyticsMixin, LanguageChangeMixin],
  data() {
    return {
      orgList: [],
      levelIDList: [],
      showTabsBtn: false,
      lastScrollPosition: 0,
      isGlobalConfigSet: false,
      bgDataConfig: null,
    };
  },
  computed: {
    langList() {
      return this.$store.getters.getAppSettings.langList;
    },
    openTabPopUp() {
      let flag = false;
      if (
        this.showTabsBtn &&
        this.bgDataConfig &&
        this.bgDataConfig.showingTabs &&
        !this.bgDataConfig.showingTabs.ssToEmu &&
        !this.bgDataConfig.showingTabs.facilityOfferingFp &&
        !this.bgDataConfig.showingTabs.daysOfStockout &&
        !this.bgDataConfig.showingTabs.newAcceptorsLessThan20 &&
        !this.bgDataConfig.showingTabs.HealthAreaOfferingCD
      ) {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
  },
  methods: {
    globalConfigSet(value) {
      this.isGlobalConfigSet = value;
    },
    scrollToTop() {
      var element = document.getElementById("scrollBox");
      element.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    showTabsBtns(flag = false) {
      this.showTabsBtn = flag;
    },
    onScroll() {
      // Get the current scroll position
      const currentScrollPosition =
        document.getElementById("scrollBox").scrollTop;
      // window.pageYOffset || document.documentElement.scrollTop;
      // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
      if (currentScrollPosition < 0) {
        return;
      }
      // Set the current scroll position as the last scroll position
      this.lastScrollPosition = currentScrollPosition;
    },
    setOrgData(orgList) {
      let filterLevel =
          this.$store.getters.getUserDetails.dataViewOrganisationUnits[0].level,
        defaultLevelID = this.$store.getters.getApplicationModule(
          this.$store.getters.getIsMultiProgram
        ).defaultLevelID;
      if (filterLevel < defaultLevelID) {
        filterLevel = defaultLevelID;
      }
      this.levelIDList = orgList.filter((org) => org.level >= filterLevel);
      this.orgList = orgList;
    },
  },
  created() {
    //Get the organization levels from store or DHIS2 using API call
    if (this.$store.getters.getOrgLevels) {
      this.setOrgData(this.$store.getters.getOrgLevels);
    } else {
      service.getOrganisationUnitLevels().then((orgList) => {
        this.setOrgData(orgList.data);
      });
    }
    //Get global factors
    if (
      ((!this.$store.getters.getIsMultiProgram &&
        this.$store.getters.getNamespace.includes("_fp-dashboard")) ||
        (this.$store.getters.getIsMultiProgram &&
          this.$store.getters.getNamespace ===
            this.$store.getters.getAppSettings.tableName)) &&
      this.$store.getters.getAppSettings.isIC
    ) {
      let key = this.generateKey("globalFactors");
      service
        .getSavedConfig({ tableKey: key, namespace: "fp-dashboard" })
        .then((resp) => {
          if (resp && resp.data) this.bgDataConfig = resp.data;
          if (!this.bgDataConfig.showingTabs) {
            this.bgDataConfig.showingTabs = {};
            this.bgDataConfig.showingTabs["ssToEmu"] = {};
            this.bgDataConfig.showingTabs["facilityOfferingFp"] = {};
            this.bgDataConfig.showingTabs["daysOfStockout"] = {};
            this.bgDataConfig.showingTabs["newAcceptorsLessThan20"] = {};
            this.bgDataConfig.showingTabs["HealthAreaOfferingCD"] = {};

            this.bgDataConfig.showingTabs["ssToEmu"]["name"] =
              "SS to EMU Annual-Monthly Mapping";
            this.bgDataConfig.showingTabs["facilityOfferingFp"]["name"] =
              "Facilities offering FP";
            this.bgDataConfig.showingTabs["daysOfStockout"]["name"] =
              "Days of Stockout";
            this.bgDataConfig.showingTabs["newAcceptorsLessThan20"]["name"] =
              "New Acceptors less than 20";
            this.bgDataConfig.showingTabs["HealthAreaOfferingCD"]["name"] =
              "Health Areas offering Community Distribution";
            this.bgDataConfig.showingTabs["ssToEmu"]["value"] = false;
            this.bgDataConfig.showingTabs["facilityOfferingFp"][
              "value"
            ] = false;
            this.bgDataConfig.showingTabs["daysOfStockout"]["value"] = false;
            this.bgDataConfig.showingTabs["newAcceptorsLessThan20"][
              "value"
            ] = false;
            this.bgDataConfig.showingTabs["HealthAreaOfferingCD"][
              "value"
            ] = false;
          }
        });
    }
  },
  mounted() {
    //Add scroll event on page mount
    if (document.getElementById("scrollBox")) {
      document
        .getElementById("scrollBox")
        .addEventListener("scroll", this.onScroll);
    }
  },
  beforeDestroy() {
    //Remove scroll event before page destroy
    if (document.getElementById("scrollBox")) {
      document
        .getElementById("scrollBox")
        .removeEventListener("scroll", this.onScroll);
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
