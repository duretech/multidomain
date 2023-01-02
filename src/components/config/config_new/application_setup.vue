<template>
  <div>
    <div
      class="card m-t-20px m-b-20px"
      v-if="$store.getters.getNamespace === `${tableName}`"
    >
      <div class="card-header p-5px" id="headingOne">
        <h2 class="mb-0">
          <button
            class="btn btn-link w-100 text-left color-white"
            type="button"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            {{ $t("initialSetup") }}
            <span class="float-right"><i class="fa fa-minus"></i></span>
          </button>
        </h2>
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne">
        <div class="card-body p-40px">
          <form>
            <div class="row">
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputDashboardName"
                    class="col-sm-5 col-form-label"
                    >{{ $t("applicationName") }}</label
                  >
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      id="inputDashboardName"
                      :placeholder="$t('family_planning_platform')"
                      v-model="appName"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputDashboardDescription"
                    class="col-sm-5 col-form-label"
                    >{{ $t("description") }}</label
                  >
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      id="inputDashboardDescription"
                      placeholder=""
                      v-model="appDesc"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputDefaultLevelID"
                    class="col-sm-5 col-form-label"
                    >{{ $t("level") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputDefaultLevelID"
                        v-model="defaultLevelID"
                      >
                        <option
                          v-for="(level, index) in levelIDList"
                          :key="index"
                          :value="level.level"
                        >
                          {{ level.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputSubLevelID"
                    class="col-sm-5 col-form-label"
                    >{{ $t("subLevel") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputSubLevelID"
                        v-model="subLevelID"
                      >
                        <option v-if="!subLevelIDList.length" disabled>
                          {{ $t("no_data_to_display") }}
                        </option>
                        <option
                          v-for="(subLevel, index) in subLevelIDList"
                          :key="index"
                          :value="subLevel.level"
                        >
                          {{ subLevel.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputDefaultLocationID"
                    class="col-sm-5 col-form-label"
                    >{{ $t("locationName") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputDefaultLocationID"
                        v-model="defaultLocationID"
                      >
                        <option
                          v-for="(localtion, index) in locationIDList"
                          :key="index"
                          :value="localtion.id"
                        >
                          {{ localtion.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputDashboardDescription"
                    class="col-sm-5 col-form-label"
                    >{{ $t("logo") }}</label
                  >
                  <div class="col-sm-7 p-t-4px">
                    <input
                      type="file"
                      class="form-control-file"
                      style="font-size: 0.9375rem"
                      name="appLogo"
                      accept="image/*"
                      @change="onLogoChange"
                      id="exampleFormControlFile5"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputPeriodType"
                    class="col-sm-5 col-form-label"
                    >{{ $t("initialYearOfData") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputPeriodType startingYear"
                        v-model="startingYear"
                      >
                        <option
                          v-for="(year, i) in years"
                          :key="i"
                          :value="year.value"
                        >
                          {{ year.text }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label
                    for="inputPeriodType"
                    class="col-sm-5 col-form-label"
                    >{{ $t("defaultLanguage") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputPeriodType"
                        v-model="defaultLanguageLocale"
                        :disabled="!languageSupport"
                      >
                        <option value="en">
                          {{ $t("en") }}
                        </option>
                        <option value="fr">{{ $t("fr") }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="sect_de_wrap">
                  <h5>{{ $t("debuggingOptions") }}</h5>
                  <div class="row px-3">
                    <div class="col-lg-6">
                      <div class="form-group row">
                        <label class="col-sm-5 col-form-label">{{
                          $t("debugging")
                        }}</label>
                        <div class="col-sm-7 pr-0">
                          <b-form-checkbox
                            checked="debugging"
                            v-model="debugging"
                            name="debuggingField"
                            switch
                            size="lg"
                            class="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6" v-if="debugging">
                      <div class="form-group row">
                        <label class="col-sm-5 col-form-label">{{
                          $t("debuggingLevel")
                        }}</label>
                        <div class="col-sm-7">
                          <div class="select-wrapper">
                            <select
                              class="form-control"
                              v-model="debuggingLevel"
                            >
                              <option value="API">
                                {{ $t("api") }}
                              </option>
                              <!-- <option value="APICalculation">API + Calculation</option> -->
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="card m-t-40px m-b-20px">
      <div class="card-header p-5px" id="headingTwo">
        <h2 class="mb-0">
          <button
            class="btn btn-link w-100 text-left color-white"
            type="button"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            {{ $t("websiteConfiguration") }}
            <span class="float-right"><i class="fa fa-minus"></i></span>
          </button>
        </h2>
      </div>
      <div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo">
        <div class="card-body p-0 mb-0">
          <div class="container-fluid pt-3">
            <div class="row">
              <div
                class="col-lg-12"
                v-if="$store.getters.getNamespace === `${tableName}`"
              >
                <div class="form-group mb-0 row">
                  <label
                    for="colorSelect"
                    class="col-sm-2 col-form-label d-flex align-items-center"
                    >{{ $t("selectColor") }}</label
                  >
                  <div class="col-sm-10 d-flex align-items-center">
                    <div
                      class="
                        row
                        appconfing-selectmodulecontainer
                        modRadio
                        colorSelect
                      "
                    >
                      <div class="col text-center">
                        <div class="config-icon-container">
                          <div class="colorBox bg-newdefault"></div>
                        </div>
                        <div class="form-group m-t-20px">
                          <div class="form-check">
                            <div class="pure-checkbox">
                              <input
                                id="selectColor1"
                                name="selectColor"
                                value="#3471CE"
                                type="radio"
                                :checked="defaultColorTheme == '#3471CE'"
                                v-model="defaultColorTheme"
                                @click="themeDefaultChange"
                                disabled
                              />
                              <label for="selectColor1"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col text-center">
                        <div class="config-icon-container">
                          <div class="colorBox bg-newgreen"></div>
                        </div>
                        <div class="form-group m-t-20px">
                          <div class="form-check">
                            <div class="pure-checkbox">
                              <input
                                id="selectColor2"
                                name="selectColor"
                                value="#25984b"
                                type="radio"
                                :checked="defaultColorTheme == '#25984b'"
                                v-model="defaultColorTheme"
                                @click="themeGreenChange"
                                disabled
                              />
                              <label for="selectColor2"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col text-center">
                        <div class="config-icon-container">
                          <div class="colorBox bg-newblack"></div>
                        </div>
                        <div class="form-group m-t-20px">
                          <div class="form-check">
                            <div class="pure-checkbox">
                              <input
                                id="selectColor3"
                                name="selectColor"
                                value="#212832"
                                type="radio"
                                :checked="defaultColorTheme == '#212832'"
                                v-model="defaultColorTheme"
                                @click="themeBlackChange"
                                disabled
                              />
                              <label for="selectColor3"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="
                  col-lg-12
                  card-header
                  border-radius-0
                  text-uppercase
                  f-s-0-875rem
                  m-t-10px
                "
              >
                <div class="form-group mb-0 row">
                  <label
                    for=""
                    class="
                      col-sm-4 col-form-label
                      d-flex
                      align-items-center
                      pt-0
                      pb-0
                    "
                    >{{ $t("contentManagement") }}</label
                  >
                </div>
              </div>
            </div>
          </div>
          <DashboardNew
            :isFromAdmin="true"
            @updateAdmin="updateAdmin"
            v-if="$store.getters.getNamespace === `${tableName}`"
          />
          <Dashboard :isFromAdmin="true" @updateAdmin="updateAdmin" v-else />
        </div>
      </div>
    </div>
    <div class="row m-t-20px">
      <div class="col-sm-12 text-right">
        <button
          type="button"
          class="btn btn-primary black-btn"
          v-on:click="updateGlobalConfigData"
        >
          {{ $t("savebtn") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
/*global settings*/
import config from "@/config/config.js";
import service from "@/service";
import audit from "../audit.js";
import assign from "lodash/assign";
import DashboardNew from "@/pages/DashboardNew";
const globalFactorsConfig = () =>
  import(
    /*webpackChunkName: "config_globalFactorsConfig" */ "@/config/globalFactorsConfig.js"
  );
const emuAnnualConfig = () =>
  import(
    /*webpackChunkName: "config_emuAnnualConfig" */ "@/config/emuAnnualConfig.js"
  );
const emuMonthlyConfig = () =>
  import(
    /*webpackChunkName: "config_emuMonthlyConfig" */ "@/config/emuMonthlyConfig.js"
  );
export default {
  components: {
    DashboardNew,
    Dashboard: () =>
      import(/*webpackChunkName: 'FPMNCHDashboard'*/ "@/pages/Dashboard"),
  },
  props: ["supportedLanguages", "levelIDList"],
  data() {
    return {
      defaultLevelID: config.applicationModule.defaultLevelID,
      subLevelID: config.applicationModule.subLevelID,
      defaultLocationID: config.applicationModule.defaultLocationID[0],
      defaultLanguage: config.applicationModule.defaultLanguage,
      startingYear: config.applicationModule.startingYear,
      organisationList: [],
      appName: config.applicationModule.appName,
      appDesc: config.applicationModule.appDesc,
      appLogo: config.applicationModule.appLogo,
      appLogoName: config.applicationModule.appLogoName,
      defaultColorTheme: config.applicationModule.defaultColorTheme,
      landingPageLogo: config.applicationModule.landingPageLogo
        ? config.applicationModule.landingPageLogo
        : "",
      landingPageTitle: config.applicationModule.landingPageTitle,
      landingPageDesc: config.applicationModule.landingPageDesc,
      landingPageBGImg: config.applicationModule.landingPageBGImg
        ? config.applicationModule.landingPageBGImg
        : "",
      leaderIcon: config.applicationModule.leaderIcon
        ? config.applicationModule.leaderIcon
        : "",
      leaderDesignation: config.applicationModule.leaderDesignation,
      leaderDesc: config.applicationModule.leaderDesc,
      fbLink: config.applicationModule.fbLink,
      instaLink: config.applicationModule.instaLink,
      twitterLink: config.applicationModule.twitterLink,
      youTubeLink: config.applicationModule.youTubeLink,
      debugging: config.applicationModule.debugging,
      debuggingLevel: config.applicationModule.debuggingLevel,
      defaultLanguageLocale: config.applicationModule.defaultLanguageLocale,
      isConfigSet: false,
      languageSupport: false,
      originalApplicationModule: null,
      isLangChanged: false,
      isFirstLoad: true,
      modules: ["interactive", "ministerial", "analytical", "dqr", "map"],
      years: [],
      tableName: settings.tableName,
    };
  },
  computed: {
    subLevelIDList: function () {
      if (this.levelIDList && this.levelIDList.length) {
        return this.levelIDList.filter((item) => {
          if (
            item.level === this.defaultLevelID &&
            item.level === this.levelIDList.length
          ) {
            return item;
          }
          if (item.level > this.defaultLevelID) {
            return item;
          }
        });
      } else {
        return [];
      }
    },
    locationIDList: function () {
      if (this.organisationList && this.organisationList.length) {
        // console.log("this.organisationList",this.organisationList);
        let orgList = this.organisationList.filter(
          (org) => org.level === parseInt(this.defaultLevelID)
        ); //.filter(o => o.id === this.defaultLocationID)
        // console.log(orgList)
        return orgList;
      } else {
        return [];
      }
    },
  },
  watch: {
    defaultLanguageLocale(newVal) {
      if (!this.isConfigSet) {
        this.setLanguage(this.defaultLanguageLocale);
      }
    },
  },
  methods: {
    updateAdmin(newValue) {
      // console.log("newValue", newValue);
      this.landingPageLogo = newValue.landingPageLogo;
      this.landingPageTitle = newValue.landingPageTitle;
      this.landingPageDesc = newValue.landingPageDesc;
      this.landingPageBGImg = newValue.landingPageBGImg;
    },
    checkLangChnage() {
      this.setLanguage(this.defaultLanguageLocale);
      this.isLangChanged = true;
      this.$emit("isGlobalConfigSet", false, this.defaultLanguageLocale);
      this.resetInitData();
      this.$nextTick(() => {
        this.getGlobalConfigData();
      });
    },
    resetInitData() {
      this.defaultLevelID = config.applicationModule.defaultLevelID;
      this.subLevelID = config.applicationModule.subLevelID;
      this.defaultLocationID = config.applicationModule.defaultLocationID[0];
      this.startingYear = config.applicationModule.startingYear;
      this.appName = config.applicationModule.appName;
      this.appDesc = config.applicationModule.appDesc;
      this.defaultColorTheme = config.applicationModule.defaultColorTheme;
      this.landingPageLogo = config.applicationModule.landingPageLogo
        ? config.applicationModule.landingPageLogo
        : "";
      this.landingPageTitle = config.applicationModule.landingPageTitle;
      this.landingPageDesc = config.applicationModule.landingPageDesc;
      this.landingPageBGImg = config.applicationModule.landingPageBGImg
        ? config.applicationModule.landingPageBGImg
        : "";
      this.leaderIcon = config.applicationModule.leaderIcon
        ? config.applicationModule.leaderIcon
        : "";
      this.leaderDesignation = config.applicationModule.leaderDesignation;
      this.leaderDesc = config.applicationModule.leaderDesc;
      this.fbLink = config.applicationModule.fbLink;
      this.instaLink = config.applicationModule.instaLink;
      this.twitterLink = config.applicationModule.twitterLink;
      this.youTubeLink = config.applicationModule.youTubeLink;
      this.debugging = config.applicationModule.debugging;
      this.debuggingLevel = config.applicationModule.debuggingLevel;
    },
    //This is to fetch GLobal config data from datastore
    getGlobalConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey("applicationModule");

      service
        .getSavedConfig(key)
        .then((response) => {
          this.isConfigSet = true;
          let data = response.data,
            locationID = data.defaultLocationID[0],
            levelID = data.defaultLevelID,
            subLevelID = data.subLevelID,
            userDetails =
              this.$store.getters.getUserDetails.dataViewOrganisationUnits[0];
          if (userDetails.level > data.defaultLevelID) {
            locationID = userDetails.id;
            levelID = userDetails.level;
            subLevelID = userDetails.level * 1 + 1;
          }
          // console.log(this.$i18n.locale, data)
          this.defaultLevelID = levelID ? levelID : this.defaultLevelID;
          this.defaultLocationID = locationID
            ? locationID
            : this.defaultLocationID;
          this.subLevelID = subLevelID ? subLevelID : this.subLevelID;
          this.defaultLanguage = data.defaultLanguage
            ? data.defaultLanguage
            : this.defaultLanguage;
          if (!this.isLangChanged) {
            this.defaultLanguageLocale = data.defaultLanguageLocale
              ? data.defaultLanguageLocale
              : this.defaultLanguageLocale;
            this.$watch("defaultLanguageLocale", this.checkLangChnage);
          }
          this.startingYear = data.startingYear
            ? data.startingYear
            : this.startingYear;
          this.appName = data.appName ? data.appName : this.appName;
          this.appDesc = data.appDesc ? data.appDesc : this.appDesc;
          this.defaultColorTheme = data.defaultColorTheme
            ? data.defaultColorTheme
            : this.defaultColorTheme;
          this.landingPageLogo = data.landingPageLogo
            ? data.landingPageLogo
            : this.landingPageLogo;
          this.landingPageTitle = data.landingPageTitle
            ? data.landingPageTitle
            : this.landingPageTitle;
          this.landingPageDesc = data.landingPageDesc
            ? data.landingPageDesc
            : this.landingPageDesc;
          this.landingPageBGImg = data.landingPageBGImg
            ? data.landingPageBGImg
            : this.landingPageBGImg;
          this.leaderIcon = data.leaderIcon ? data.leaderIcon : this.leaderIcon;
          this.leaderDesignation = data.leaderDesignation
            ? data.leaderDesignation
            : this.leaderDesignation;
          this.leaderDesc = data.leaderDesc ? data.leaderDesc : this.leaderDesc;
          this.fbLink = data.fbLink ? data.fbLink : this.fbLink;
          this.instaLink = data.instaLink ? data.instaLink : this.instaLink;
          this.twitterLink = data.twitterLink
            ? data.twitterLink
            : this.twitterLink;
          this.youTubeLink = data.youTubeLink
            ? data.youTubeLink
            : this.youTubeLink;
          this.debugging = data.debugging ? data.debugging : this.debugging;
          this.debuggingLevel = data.debuggingLevel
            ? data.debuggingLevel
            : this.debuggingLevel;
          this.$store.state.loading = false;
          this.originalApplicationModule = data;
          this.$emit("isGlobalConfigSet", true, this.defaultLanguageLocale);
          if (this.$store.state.appId && this.$store.state.appUserId) {
            let m = data.modules;
            // m = m.replace(/'/g, '"');
            // m = JSON.parse(m);
            this.modules = m;
            this.$emit("getModules", m);
          }
        })
        .catch(() => {
          this.$store.state.loading = false;
          console.log("in getGlobalConfigData catch");
          this.defaultLanguage = settings.defaultLocale;
          this.defaultLanguageLocale = settings.defaultLocale;
          this.isConfigSet = false;
        });
    },
    //This is to update Global Config data in datastore
    updateGlobalConfigData() {
      // console.log(this.landingPageTitle);
      // console.log(this.defaultLanguageLocale)
      // return
      this.$store.state.loading = true;

      let locale = this.$i18n.locale;

      let applicationModule = {
        ...this.originalApplicationModule,
        defaultLevelID: this.defaultLevelID,
        defaultLocationID: [this.defaultLocationID],
        subLevelID: this.subLevelID,
        startingYear: this.startingYear,
        defaultLanguage: this.defaultLanguage,
        defaultLanguageLocale: this.defaultLanguageLocale,
        appName: this.appName,
        appDesc: this.appDesc,
        defaultColorTheme: this.defaultColorTheme,
        appLogo: this.appLogo,
        appLogoName: this.appLogoName,
        landingPageLogo: this.landingPageLogo,
        landingPageTitle: this.landingPageTitle,
        landingPageDesc: this.landingPageDesc,
        landingPageBGImg: this.landingPageBGImg,
        leaderIcon: this.leaderIcon,
        leaderDesignation: this.leaderDesignation,
        leaderDesc: this.leaderDesc,
        fbLink: this.fbLink,
        instaLink: this.instaLink,
        twitterLink: this.twitterLink,
        youTubeLink: this.youTubeLink,
        debugging: this.debugging,
        debuggingLevel: this.debuggingLevel,
      };
      let configChanges = audit.configAudit(
        this.originalApplicationModule,
        applicationModule
      );
      // console.log("configChanges", configChanges)
      let key = this.generateKey("applicationModule"),
        key1 = this.generateKey("globalFactors"),
        key3 = this.generateKey("ssToEMUBgData");

      let allKeys = service.getAllKeys();
      allKeys
        .then((keys) => {
          // console.log(keys);
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig
              .then((res) => {
                let configData = assign(res.data, applicationModule);

                let response = service.updateConfig(configData, key);
                response
                  .then((response) => {
                    if (response.data.status === "OK") {
                      // console.log("response update ", response.data)
                      if (
                        this.$store.getters.getNamespace ===
                        `${settings.tableName}`
                      ) {
                        this.$store.commit(
                          "setApplicationModule",
                          applicationModule
                        );
                      }
                      this.$store.commit("setTheme", this.defaultColorTheme);
                      if (!this.$store.state.isLangChanged) {
                        this.setLanguage(this.defaultLanguageLocale);
                      }
                      this.isConfigSet = true;
                      this.isLangChanged = false;
                      if (Object.keys(configChanges).length) {
                        this.setLocale(
                          key,
                          this.defaultLanguageLocale,
                          true,
                          configChanges
                        );
                      } else {
                        this.setLocale(key, this.defaultLanguageLocale);
                      }
                      this.originalApplicationModule = configData;
                      // this.setLocale(key, this.defaultLanguageLocale)
                      // this.$swal({
                      //   title: this.$i18n.t('data_saved_successfully')
                      // })
                    } else {
                      this.$swal({
                        title: this.$i18n.t("error"),
                        text: `${response.data.message}`,
                      });
                      this.$emit(
                        "isGlobalConfigSet",
                        false,
                        this.defaultLanguageLocale
                      );
                      this.$store.state.loading = false;
                      return;
                    }
                  })
                  .catch((error) => {
                    this.$swal({
                      title: this.$i18n.t("error"),
                    });
                    this.$emit(
                      "isGlobalConfigSet",
                      false,
                      this.defaultLanguageLocale
                    );
                    this.$store.state.loading = false;
                    return;
                  });
              })
              .catch((error) => {
                this.$swal({
                  title: this.$i18n.t("error"),
                });
                this.$emit(
                  "isGlobalConfigSet",
                  false,
                  this.defaultLanguageLocale
                );
                this.$store.state.loading = false;
                return;
              });
          } else {
            let response = service.saveConfig(applicationModule, key);
            response.then((response) => {
              if (response.data.status === "OK") {
                // console.log("response save ", response.data)
                this.originalApplicationModule = applicationModule;
                if (
                  this.$store.getters.getNamespace === `${settings.tableName}`
                ) {
                  this.$store.commit("setApplicationModule", applicationModule);
                }
                this.$store.commit("setTheme", this.defaultColorTheme);
                if (!this.$store.state.isLangChanged) {
                  this.setLanguage(this.defaultLanguageLocale);
                }
                this.isConfigSet = true;
                this.isLangChanged = false;

                this.saveGlobalSettings(key1, key3);
                this.setLocale(key, this.defaultLanguageLocale);
                // this.$swal({
                //   title: this.$i18n.t('data_saved_successfully')
                // })
                // this.$emit('isGlobalConfigSet', true, this.defaultLanguageLocale);
              } else {
                this.$swal({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
                this.$emit(
                  "isGlobalConfigSet",
                  false,
                  this.defaultLanguageLocale
                );
                this.$store.state.loading = false;
                return;
              }
            });
          }
        })
        .catch((res) => {
          // console.log("catch", res);
          let response = service.saveConfig(applicationModule, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data);
              if (
                this.$store.getters.getNamespace === `${settings.tableName}`
              ) {
                this.$store.commit("setApplicationModule", applicationModule);
              }
              this.$store.commit("setTheme", this.defaultColorTheme);
              if (!this.$store.state.isLangChanged) {
                this.setLanguage(this.defaultLanguageLocale);
              }
              this.originalApplicationModule = applicationModule;
              this.saveGlobalSettings(key1, key3);
              this.isConfigSet = true;
              this.isLangChanged = false;
              this.$emit("isGlobalConfigSet", true, this.defaultLanguageLocale);
              if (settings.languageSupport) {
                let pLocale = this.supportedLanguages.filter(
                  (l) => l !== this.$i18n.locale
                );
                // console.log("pLocale", pLocale);
                let resArr = [];
                pLocale.forEach(async (l, i) => {
                  let kLen = key1.split("_"),
                    k = null;
                  if (kLen.length > 2) {
                    k = `${kLen[0]}_${kLen[1]}_${kLen[2]}`;
                  } else {
                    k = kLen[0];
                  }
                  this.saveGlobalSettings(`${k}_${l}`);
                  let appModule = JSON.parse(JSON.stringify(applicationModule));

                  appModule.defaultLanguage = l;
                  let res = await this.saveOtherLocalesConfig(l, appModule);
                  resArr.push(res);

                  if (resArr.length - 1 === i) {
                    // console.log("in if")
                    this.$swal({
                      title: this.$i18n.t("data_saved_successfully"),
                    });
                    this.$store.state.loading = false;
                  }
                });
              } else {
                this.$swal({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.$store.state.loading = false;
              }
            } else {
              this.$swal({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$emit(
                "isGlobalConfigSet",
                false,
                this.defaultLanguageLocale
              );
              this.$store.state.loading = false;
              return;
            }
          });
        });
    },
    setLocale(
      key,
      defaultLanguageLocale,
      isAudit = false,
      configChanges = null
    ) {
      // console.log("key",key)
      let pLocale = this.supportedLanguages.filter(
        (l) => l !== this.$i18n.locale
      );
      // console.log("pLocale",pLocale)
      let resArr = [];
      pLocale.forEach(async (l, i) => {
        let kLen = key.split("_"),
          k = null;
        if (kLen.length > 2) {
          k = `${kLen[0]}_${kLen[1]}_${kLen[2]}`;
        } else {
          k = kLen[0];
        }

        await service
          .getSavedConfig(`${k}_${l}`)
          .then((response) => {
            let appModule = response.data;
            appModule.defaultLanguageLocale = defaultLanguageLocale;
            service.updateConfig(appModule, `${k}_${l}`);
            resArr.push(1);
          })
          .catch(() => {
            console.log("No Config found...");
            resArr.push(1);
          });

        if (resArr.length - 1 === i) {
          this.$store.state.loading = false;
          this.$emit("isGlobalConfigSet", true, this.defaultLanguageLocale);
          this.$swal({
            title: this.$i18n.t("data_saved_successfully"),
          }).then(() => {
            if (isAudit) {
              audit.processAudit("process1", key, configChanges);
            }
          });
        }
      });
    },
    async saveOtherLocalesConfig(locale, appModule) {
      let key1 = `dqrModule_${locale}`,
        key2 = `applicationModule_${locale}`,
        key7 = `userManagement_${locale}`,
        key9 = `signOffModule_${locale}`,
        key10 = `interactive_${locale}`,
        key11 = `ssToEMUBgData_${locale}`;

      let annualConfig = await emuAnnualConfig().then((res) => res.default);
      let monthlyConfig = await emuMonthlyConfig().then((res) => res.default);
      
      await service.saveConfig(
        {
          emu: annualConfig.dqrModule.emu,
          emu_monthly: monthlyConfig.dqrModule.emu_monthly,
        },
        key1
      ); //Done
      console.log(key1, "saved");
      await service.saveConfig(appModule, key2); //Done
      console.log(key2, "saved");
      await service.saveConfig({}, key7); //Kept blank for now will discuss with Team and take discussion later
      console.log(key7, "saved");
      await service.saveConfig({}, key9); // kept blank
      console.log(key9, "saved");
      await service.saveConfig([], key10); //Done
      console.log(key10, "saved");
      await service.saveConfig({}, key11); // kept blank
      console.log(key11, "saved");

      return "Data submitted";
    },
    setLanguage(locale) {
      this.$i18n.locale = locale;
    },
    async saveGlobalSettings(key1 = null, key3 = null) {
      // console.log(key1)
      // console.log(key3)
      let gSettings = await globalFactorsConfig().then((res) => res.default),
        currentDateLong = this.$moment().format(),
        format = this.$moment(currentDateLong, "YYYYMM").format("YYYY-MM"),
        backtrackedDate = format,
        backtrackedLimitedDate = this.$moment(format, "YYYYMM")
          .subtract(gSettings.period.Period.backtrackedYearLimit, "years")
          .format("YYYY-MM"),
        yearRange = `${backtrackedLimitedDate} to ${backtrackedDate}`;

      gSettings = {
        ...gSettings,
        period: {
          Period: {
            ...gSettings.period.Period,
            backtrackedDate: backtrackedDate,
            backtrackedLimitedDate: backtrackedLimitedDate,
            yearRange: yearRange,
          },
        },
      };
      if (key1) {
        service.saveConfig(gSettings, key1);
      }
      if (key3) {
        service.saveConfig({}, key3);
      }
    },
    onImgChange(e) {
      //console.log(e);
      const file = e.target.files[0];
      const imgSrc = e.target.name;
      this.getImgBase64(file, imgSrc);
    },

    onLogoChange(e) {
      // console.log(e);
      const file = e.target.files[0];
      this.appLogoName = file.name;
      const imgSrc = e.target.name;
      this.getImgBase64(file, imgSrc);
    },
    getImgBase64(file, imgSrc) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        /*this.leaderIcon = {
            url: reader.result
        }*/
        //this.leaderIcon = reader.result;
        this[imgSrc] = reader.result;
        //console.log(this[imgSrc]);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },
    themeGreenChange() {
      this.$store.commit("setCurrentTheme", "newGreen-theme");
    },
    themeWhiteChange() {
      this.$store.commit("setCurrentTheme", "white-theme");
    },
    themeBlackChange() {
      this.$store.commit("setCurrentTheme", "newBlack-theme");
    },
    themeDefaultChange() {
      this.$store.commit("setCurrentTheme", "");
    },
  },
  created() {
    this.languageSupport = settings.languageSupport;

    let currentYear = new Date().getFullYear(),
      lastYear = 2000;
    this.years = [];
    for (let i = currentYear; i >= lastYear; i--) {
      this.years.push({ text: i, value: i });
    }

    service.getOrganisation().then((orgList) => {
      //console.log("orgList", orgList.data);
      this.organisationList = orgList.data.organisationUnits;
    });
    if (this.levelIDList && this.organisationList) {
      this.getGlobalConfigData();
    }
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.homepage-bg {
  background-size: cover;
  background-position: center;
}

.socialicons-container {
  position: absolute;
}

.config-icon-container {
  width: 100px;
  height: auto;
}

#sidebar-wrapper {
  position: relative;
}

.img-preview img {
  width: 180px !important;
  margin-top: 20px;
}

.modRadio .config-icon-container {
  width: 100px;
  height: 100px;
}

.modRadio.colorSelect {
  margin-bottom: 30px;
}

.leader-designation-text {
  background: transparent;
  font-size: 0.875em;
  border: none;
}

.leader-description-text {
  background: transparent;
  font-size: 0.875em;
  border: none;
}

.headingText {
  background: transparent;
  border: none;
  font-size: 2.5rem;
  font-weight: 100;
  font-color: #ffffff;
  padding: 0;
}

.landing-desc {
  background: transparent;
  color: #fff;
  border: none;
  width: 100%;
}

.leaderimg-edit {
  width: 55px;
  border-radius: 50%;
  height: 55px;
}
.footer-section {
  background-color: rgba(244, 244, 244, 0.83) !important;
  position: static !important;
  bottom: 0;
  width: 100%;
  padding: 0 4rem;
}
.footer-section .footerlogo {
  margin: 15px auto;
  color: #000;
  display: flex;
  justify-content: flex-end;

  font-size: 0.875rem;
}
.footer-section .footerlogo img {
  width: 30%;
  padding-left: 2%;
}
.social-media-icons {
  margin: 15px auto;
}
.social-media-icons a {
  padding: 0 12px;
  border-right: 1px solid #000;
}
.social-media-icons a:last-child {
  border-right: none;
}
.social-media-icons a span {
  color: #000;
}
.sect_de_wrap {
  position: relative;
  padding: 2% 2% 1.5%;
  border: 2px solid #64648d;
  border-radius: 5px;
  margin-top: 3%;
  h5 {
    position: absolute;
    top: -18px;
    background: #2f2d55;
    font-size: 1rem;
    padding: 8px;
    color: #d9d9d9;
  }
}
.newGreen-theme {
  .sect_de_wrap {
    position: relative;
    padding: 2% 2% 1.5%;
    border: 2px solid #64648d;
    border-radius: 5px;
    margin-top: 3%;
    h5 {
      position: absolute;
      top: -18px;
      background: #fff;
      font-size: 1rem;
      padding: 8px;
      color: #676767;
    }
  }
}
.homeblock {
  .card-header.uppercase {
    height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>