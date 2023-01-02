<template>
  <div class="admin-side mdgridviewpage-bg" id="box">
    <header-component
      @langChange="langChange"
      :subTabsBtn="showTabsBtn"
      :openTabPopUp="openTabPopUp"
      :bgDataConfig="bgDataConfig"
      
    ></header-component>
    <div class="container-fluid mt-4">
      <div class="scrollToTopDiv" v-if="lastScrollPosition > 800">
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
      >
        <div class="col-lg-12">
          <div>
            <!-- <b-tabs nav-class="appConfigtabMain"> -->
            <b-tabs nav-class="">
              <b-tab
                :title="$t('applicationSetup')"
                active
                @click="showTabsBtns(false)"
              >
                <applicationSetup
                  @isGlobalConfigSet="globalConfigSet"
                  @getModules="getModules"
                  :supportedLanguages="supportedLanguages"
                  :levelIDList="levelIDList"
                />
              </b-tab>
              <!-- v-if="
                  isGlobalConfigSet && $store.getters.getNamespace === tableName
                " -->
              <b-tab
                title="Indicator Calculator"
                id="IndicatorCalculator"
                v-if="
                  isGlobalConfigSet && $store.getters.getNamespace === tableName
                "
                @click="showTabsBtns(true)"
              >
                <indicatorCalculator :bgDataConfig="bgDataConfig" />
              </b-tab>
              <b-tab
                :title="$t('dataMapping')"
                v-if="isGlobalConfigSet"
                @click="showTabsBtns(false)"
              >
                <dataMapping
                  v-if="isGlobalConfigSet"
                  :supportedLanguages="supportedLanguages"
                  :modules="modules"
                  :orgList="orgList"
                />
              </b-tab>
              <b-tab
                :title="$t('userManagement')"
                v-if="
                  isGlobalConfigSet && $store.getters.getNamespace === tableName
                "
                @click="showTabsBtns(false)"
              >
                <userManagement
                  v-if="isGlobalConfigSet"
                  :supportedLanguages="supportedLanguages"
                  :modules="modules"
                />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*global settings*/
import service from "@/service";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import headerComponent from "@/components/config/headerComponent";
import dataMapping from "@/components/config/config_new/data_mapping";
import userManagement from "@/components/config/config_new/user_management";
import applicationSetup from "@/components/config/config_new/application_setup";
import indicatorCalculator from "@/components/config/config_new/indicator_calculator";
import bgDataConfig from "@/config/globalFactorsConfig.js";
export default {
  components: {
    headerComponent,
    applicationSetup,
    dataMapping,
    userManagement,
    indicatorCalculator,
  },
  mixins: [DocumentTitleMixin, LanguageChangeMixin],
  data() {
    return {
      bgDataConfig: bgDataConfig,
      isGlobalConfigSet: false,
      supportedLanguages: ["en", "fr"],
      modules: [],
      levelIDList: [],
      orgList: [],
      lastScrollPosition: 0,
      tableName: settings.tableName,
      showTabsBtn: false,
      openTabPopUp: false,
    };
  },
  created() {
    service.getOrganisationUnitLevels().then((orgList) => {
      // console.log("orgList",orgList.data.organisationUnitLevels);
      this.levelIDList = orgList.data.filter(
        (org) =>
          org.level >=
          this.$store.getters.getUserDetails.dataViewOrganisationUnits[0].level
      );
      this.orgList = orgList.data;
    });
    //@Keshav - Add condition here to call this API only when user selects "Default" admin
    service
      .getSavedConfig("globalFactors_en", false, "fp-dashboard")
      .then((resp) => {
        if (resp && resp.data) this.bgDataConfig = resp.data;
      //   if(!this.bgDataConfig.showingTabs){ this.bgDataConfig.showingTabs = {}
      //   this.bgDataConfig.showingTabs["ssToEmu"] = {}
      //   this.bgDataConfig.showingTabs["facilityOfferingFp"] = {}
      //   this.bgDataConfig.showingTabs["daysOfStockout"] = {}
      //   this.bgDataConfig.showingTabs["newAcceptorsLessThan20"] = {}
      //   this.bgDataConfig.showingTabs["HealthAreaOfferingCD"] = {}
        
      //     this.bgDataConfig.showingTabs["ssToEmu"]["name"] = "SS to EMU Annual-Monthly Mapping"
      //     this.bgDataConfig.showingTabs["facilityOfferingFp"]["name"] = "Facilities offering FP"
      //     this.bgDataConfig.showingTabs["daysOfStockout"]["name"] = "Days of Stockout"
      //     this.bgDataConfig.showingTabs["newAcceptorsLessThan20"]["name"] = "New Acceptors less than 20"
      //     this.bgDataConfig.showingTabs["HealthAreaOfferingCD"]["name"] = "Health Areas offering Community Distribution"
      //     this.bgDataConfig.showingTabs["ssToEmu"]["value"] = false
      //     this.bgDataConfig.showingTabs["facilityOfferingFp"]["value"] = false
      //     this.bgDataConfig.showingTabs["daysOfStockout"]["value"] = false
      //     this.bgDataConfig.showingTabs["newAcceptorsLessThan20"]["value"] = false
      //     this.bgDataConfig.showingTabs["HealthAreaOfferingCD"]["value"] = false
      // }
      });
  },
  methods: {
    globalConfigSet(value, locale) {
      this.isGlobalConfigSet = value;
      this.$root.defaultLanguageLocale = locale;
    },
    getModules(modules) {
      this.modules = modules;
    },
    scrollToTop() {
      // window.scrollTo(0, 0);
      var element = document.getElementById("box");
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    showTabsBtns(flag) {
      if (flag) {
        this.showTabsBtn = true;
        if (
          this.bgDataConfig.showingTabs.ssToEmu === false &&
          this.bgDataConfig.showingTabs.facilityOfferingFp === false &&
          this.bgDataConfig.showingTabs.daysOfStockout === false &&
          this.bgDataConfig.showingTabs.newAcceptorsLessThan20 === false &&
          this.bgDataConfig.showingTabs.HealthAreaOfferingCD === false
        ) {
          this.openTabPopUp = true;
        }
        else{
          this.openTabPopUp = false;    
        }
      } else {
        this.showTabsBtn = false;
        this.openTabPopUp = false;
      }
    },
    onScroll() {
      // Get the current scroll position
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
      if (currentScrollPosition < 0) {
        return;
      }
      // Set the current scroll position as the last scroll position
      this.lastScrollPosition = currentScrollPosition;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mdgridviewpage-bg {
  min-height: 100vh;
  // padding: 20px 40px;
  background-color: #3471ce;
}
</style>
