<template>
  <div class="admin-active mt-4 pt-3">
    <b-card no-body>
      <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
        <b-tab :title="$t('initialSetup')" class="pl-2 pb-0 pt-0 pr-2">
          <b-card-text>
            <div class="md_nested_tabs">
              <b-card no-body class="" style="padding-right: 5px">
                <b-tabs
                  card
                  class=""
                  nav-class="p-0 m-0 mb-3 mt-3 mx-1"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 mx-2 main-border"
                >
                  <b-tab
                    :title="$t('initialSetup')"
                    class="pl-2 pb-0 pt-0 pr-0 b-5"
                  >
                    <b-card-text>
                      <div
                        class="card m-t-20px mb-4 mapping-border"
                        v-if="
                          ($store.getters.getIsMultiProgram &&
                            $store.getters.getNamespace === `${tableName}`) ||
                          !$store.getters.getIsMultiProgram
                        "
                      >
                        <div class="card-header p-5px d-none" id="headingOne">
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
                              <span class="float-right"> </span>
                            </button>
                          </h2>
                        </div>
                        <div class="">
                          <form>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group row">
                                  <label
                                    for="inputDefaultLevelID"
                                    class="col-sm-3 col-form-label"
                                    >{{ $t("level") }}</label
                                  >
                                  <div class="col-sm-9">
                                    <div class="select-wrapper">
                                      <select
                                        class="form-control"
                                        id="inputDefaultLevelID"
                                        v-model="
                                          applicationModule.defaultLevelID
                                        "
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
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group row">
                                  <label
                                    for="inputSubLevelID"
                                    class="col-sm-3 col-form-label"
                                    >{{ $t("subLevel") }}</label
                                  >
                                  <div class="col-sm-9">
                                    <div class="select-wrapper">
                                      <select
                                        class="form-control"
                                        id="inputSubLevelID"
                                        v-model="applicationModule.subLevelID"
                                      >
                                        <option
                                          v-if="!subLevelIDList.length"
                                          disabled
                                        >
                                          {{ $t("no_data_to_display") }}
                                        </option>
                                        <option
                                          v-for="(
                                            subLevel, index
                                          ) in subLevelIDList"
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
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group row">
                                  <label
                                    for="inputDefaultLocationID"
                                    class="col-sm-3 col-form-label"
                                    >{{ $t("locationName") }}</label
                                  >
                                  <div class="col-sm-9">
                                    <div class="select-wrapper">
                                      <select
                                        class="form-control"
                                        id="inputDefaultLocationID"
                                        v-model="
                                          applicationModule.defaultLocationID
                                        "
                                      >
                                        <option
                                          v-for="(
                                            localtion, index
                                          ) in locationIDList"
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
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="form-group row">
                                  <label
                                    for="inputPeriodType"
                                    class="col-sm-3 col-form-label"
                                    >{{ $t("defaultLanguage") }}</label
                                  >
                                  <div class="col-sm-9">
                                    <div class="select-wrapper">
                                      <select
                                        class="form-control"
                                        id="inputPeriodType"
                                        v-model="
                                          applicationModule.defaultLanguageLocale
                                        "
                                        :disabled="!languageSupport"
                                      >
                                        <option
                                          :value="lang"
                                          v-for="lang in langList"
                                          :key="'lang-' + lang"
                                        >
                                          {{ $t(`${lang}`) }}
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="row">
                                  <div class="col-lg-6">
                                    <div class="form-group row">
                                      <label class="col-sm-5 col-form-label">{{
                                        $t("debuggingOptions")
                                      }}</label>

                                      <label
                                        class="col-sm-3 col-form-label ml-37px"
                                        >{{ $t("debugging") }}</label
                                      >
                                      <div class="col-sm-3 pr-0">
                                        <b-form-checkbox
                                          checked="debugging"
                                          v-model="applicationModule.debugging"
                                          name="debuggingField"
                                          switch
                                          size="lg"
                                          class="mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    class="col-lg-6"
                                    v-if="applicationModule.debugging"
                                  >
                                    <div class="form-group row">
                                      <label class="col-sm-5 col-form-label">{{
                                        $t("debuggingLevel")
                                      }}</label>
                                      <div class="col-sm-7">
                                        <div class="select-wrapper">
                                          <select
                                            class="form-control"
                                            v-model="
                                              applicationModule.debuggingLevel
                                            "
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
                            <div class="row">
                              <div class="col-lg-12">
                                <div class="row">
                                  <div class="col-lg-6">
                                    <div class="form-group row">
                                      <label class="col-sm-5 col-form-label">{{
                                        $t("logoOptions")
                                      }}</label>

                                      <label
                                        class="col-sm-3 col-form-label ml-37px"
                                        >{{ $t("footerLogo") }}</label
                                      >
                                      <div class="col-sm-3 pr-0">
                                        <b-form-checkbox
                                          checked="footerLogo"
                                          v-model="applicationModule.footerLogo"
                                          name="footerLogoField"
                                          switch
                                          size="lg"
                                          class="mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <!-- <div class="col-lg-6">
                                    <div class="form-group row">
                                      <label class="col-sm-5 col-form-label">{{
                                        $t("trackLogo")
                                      }}</label>
                                      <div class="col-sm-3 pr-0">
                                        <b-form-checkbox
                                          checked="trackLogo"
                                          v-model="applicationModule.trackLogo"
                                          name="trackLogoField"
                                          switch
                                          size="lg"
                                          class="mt-1"
                                        />
                                      </div>
                                    </div>
                                  </div> -->
                                </div>
                              </div>
                            </div>
                            <div class="row d-none">
                              <div class="col-md-12">
                                <div class="sect_de_wrap">
                                  <h5>{{ $t("debuggingOptions") }}</h5>
                                  <div class="row px-3">
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("debugging") }}</label
                                        >
                                        <div class="col-sm-7 pr-0">
                                          <b-form-checkbox
                                            checked="debugging"
                                            v-model="
                                              applicationModule.debugging
                                            "
                                            name="debuggingField"
                                            switch
                                            size="lg"
                                            class="mt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      class="col-lg-6"
                                      v-if="applicationModule.debugging"
                                    >
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("debuggingLevel") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <div class="select-wrapper">
                                            <select
                                              class="form-control"
                                              v-model="
                                                applicationModule.debuggingLevel
                                              "
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
                      <div class="card m-b-20px">
                        <div
                          class="p-5px accordion-header accordion f-s-0-875rem font-weight-bold bt-10"
                          id="headingTwo"
                        >
                          <h2 class="mb-0 mt-lg-n1">
                            <button
                              class="btn btn-link w-100 text-left color-white"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseTwo"
                              aria-expanded="true"
                              aria-controls="collapseTwo"
                            >
                              {{ $t("themeContent") }}
                              <span class="float-right"> </span>
                            </button>
                          </h2>
                        </div>
                        <div
                          id="collapseTwo"
                          class="collapse show border-module modules-collapse"
                          aria-labelledby="headingTwo"
                        >
                          <div class="card-body p-0 mb-0">
                            <div class="container-fluid pt-3">
                              <div class="row p-0-5px">
                                <div
                                  class="col-lg-12 border-bottomgrey mb-3"
                                  v-if="
                                    ($store.getters.getIsMultiProgram &&
                                      $store.getters.getNamespace ===
                                        `${tableName}`) ||
                                    !$store.getters.getIsMultiProgram
                                  "
                                >
                                  <div
                                    class="form-group mb-auto row admin-component"
                                  >
                                    <label
                                      for="colorSelect"
                                      class="col-sm-3 col-form-label"
                                      >{{ $t("select_color_theme") }}</label
                                    >
                                    <div class="col-sm-9">
                                      <b-form-group
                                        v-slot="{ ariaDescribedby }"
                                      >
                                        <b-form-radio-group
                                          id="default-theme"
                                          v-model="
                                            applicationModule.defaultColorTheme
                                          "
                                          :aria-describedby="ariaDescribedby"
                                          name="default-theme"
                                        >
                                          <b-form-radio
                                            class="mx-2"
                                            :value="t.value"
                                            v-for="t in themes"
                                            :key="'theme-' + t.value"
                                            ><div
                                              class="config-icon-container config-newcontainer"
                                            >
                                              <div
                                                class="colorBox"
                                                :class="t.color"
                                              ></div></div
                                          ></b-form-radio>
                                        </b-form-radio-group>
                                      </b-form-group>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-lg-12">
                                  <div
                                    class="form-group mb-3 row admin-component"
                                  >
                                    <label
                                      for=""
                                      class="col-sm-3 col-form-label"
                                      >{{ $t("contentManagement") }}</label
                                    >
                                  </div>
                                  <div>
                                    <DashboardNew
                                      :isFromAdmin="true"
                                      @updateAdmin="updateAdmin"
                                      :updatedData="applicationModule"
                                      v-if="
                                        $store.getters.getNamespace ===
                                        `${tableName}`
                                      "
                                    />
                                    <Dashboard
                                      v-else
                                      :isFromAdmin="true"
                                      @updateAdmin="updateAdmin"
                                      :updatedData="applicationModule"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row m-t-20px mb-4">
                        <div class="col-sm-12 text-right">
                          <button
                            type="button"
                            class="btn btn-primary black-btn save-btn"
                            v-on:click="updateGlobalConfigData"
                          >
                            {{ $t("savebtn") }}
                          </button>
                        </div>
                      </div>
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
import service from "@/service";
import assign from "lodash/assign";
import { loadLanguage } from "@/i18n";
import config from "@/config/config.js";
import DashboardNew from "@/pages/DashboardNew";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    DashboardNew,
    VueEditor,
    Dashboard: () =>
      import(/*webpackChunkName: 'FPMNCHDashboard'*/ "@/pages/Dashboard"),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  props: ["langList", "levelIDList", "preFetchData"],
  mixins: [ReFetchConfigMixin, LanguageChangeMixin],
  data() {
    return {
      organizationList: [],
      applicationModule: JSON.parse(JSON.stringify(config.applicationModule)),
    };
  },
  computed: {
    themes() {
      let t = [
        {
          value: "white",
          color: "bg-newwhite",
        },
        {
          value: "grey",
          color: "bg-newgrey",
        },
        {
          value: "dark",
          color: "bg-newblack",
        },
      ];
      return t;
    },
    subLevelIDList: function () {
      if (this.levelIDList && this.levelIDList.length) {
        return this.levelIDList.filter((item) => {
          if (
            item.level === this.applicationModule.defaultLevelID &&
            item.level === this.levelIDList.length
          ) {
            return item;
          }
          if (item.level > this.applicationModule.defaultLevelID) {
            return item;
          }
        });
      } else {
        return [];
      }
    },
    locationIDList: function () {
      if (this.organizationList && this.organizationList.length) {
        let orgList = this.organizationList.filter(
          (org) => org.level === parseInt(this.applicationModule.defaultLevelID)
        ); //.filter(o => o.id === this.defaultLocationID)
        return orgList;
      } else {
        return [];
      }
    },
    languageSupport() {
      return this.$store.getters.getAppSettings.languageSupport;
    },
    tableName() {
      return this.$store.getters.getAppSettings.tableName;
    },
  },
  watch: {},
  methods: {
    updateAdmin(newValue) {
      this.applicationModule.landingPageLogo = newValue.landingPageLogo;
      this.applicationModule.landingPageBGImg = newValue.landingPageBGImg;
      this.langList.forEach((l) => {
        if (typeof this.applicationModule.landingPageTitle === "string") {
          this.applicationModule.landingPageTitle = {
            [l]: newValue.landingPageTitle[l],
          };
        } else {
          this.applicationModule.landingPageTitle[l] =
            newValue.landingPageTitle[l];
        }
        if (typeof this.applicationModule.landingPageDesc === "string") {
          this.applicationModule.landingPageDesc = {
            [l]: newValue.landingPageDesc[l],
          };
        } else {
          this.applicationModule.landingPageDesc[l] =
            newValue.landingPageDesc[l];
        }
      });
    },
    //This is to fetch GLobal config data from datastore
    getConfigData() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("applicationModule");
      service
        .getSavedConfig({ tableKey: key })
        .then((response) => {
          let data = response.data,
            locationID = data.defaultLocationID[0],
            levelID = data.defaultLevelID,
            subLevelID = data.subLevelID,
            uData = this.$store.getters.getUserDetails,
            uLevel = uData?.dataViewOrganisationUnits?.[0]?.level || 0;
          if (uLevel && uLevel > data.defaultLevelID) {
            locationID = uData.dataViewOrganisationUnits[0].id;
            levelID = uData.dataViewOrganisationUnits[0].level;
            subLevelID = uData.dataViewOrganisationUnits[0].level * 1 + 1;
          }
          this.applicationModule = {
            ...data,
            defaultLevelID: levelID
              ? levelID
              : this.applicationModule.defaultLevelID,
            defaultLocationID: locationID
              ? locationID
              : this.applicationModule.defaultLocationID[0],
            subLevelID: subLevelID
              ? subLevelID
              : this.applicationModule.subLevelID,
          };
          this.$store.commit(
            "setApplicationModule",
            JSON.parse(JSON.stringify(data))
          );
          this.$emit("isGlobalConfigSet", true);
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          console.log("in getConfigData catch");
          this.applicationModule.defaultLanguageLocale =
            this.$store.getters.getAppSettings.defaultLocale;
          this.reFetchConfig(err);
        });
    },
    //This is to update Global Config data in datastore
    updateGlobalConfigData() {
      // return
      this.$store.commit("setLoading", true);

      let applicationModule = {
        ...this.applicationModule,
        defaultLocationID: [this.applicationModule.defaultLocationID],
      };
      let key = this.generateKey("applicationModule");

      service
        .getSavedConfig({ tableKey: key })
        .then((res) => {
          let configData = assign(res.data, applicationModule);
          let response = service.updateConfig({
            data: configData,
            tableKey: key,
          });
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.setLocale();
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
                this.$emit("isGlobalConfigSet", false);
                this.$store.commit("setLoading", false);
                return;
              }
            })
            .catch((error) => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.$emit("isGlobalConfigSet", false);
              this.$store.commit("setLoading", false);
              return;
            });
        })
        .catch((error) => {
          let response = service.saveConfig({
            data: applicationModule,
            tableKey: key,
          });
          response.then((response) => {
            if (response.data.status === "OK") {
              this.setLocale();
            } else {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$emit("isGlobalConfigSet", false);
              this.$store.commit("setLoading", false);
              return;
            }
          });
        });
    },
    setLocale() {
      this.$store.commit("setLoading", false);
      this.$emit("isGlobalConfigSet", true);
      this.$swal({
        title: this.$i18n.t("data_saved_successfully"),
        confirmButtonText: this.$i18n.t("ok"),
      }).then(async () => {
        if (
          (this.$store.getters.getIsMultiProgram &&
            this.$store.getters.getNamespace === `${this.tableName}`) ||
          !this.$store.getters.getIsMultiProgram
        ) {
          this.$store.commit(
            "setTheme",
            this.applicationModule.defaultColorTheme
          );
        }
        if (
          this.$store.getters.getLocalLang !==
          this.applicationModule.defaultLanguageLocale
        ) {
          this.$i18n.locale = this.applicationModule.defaultLanguageLocale;
          await loadLanguage(this.applicationModule.defaultLanguageLocale);
          this.$store.commit(
            "setLocalLang",
            this.applicationModule.defaultLanguageLocale
          );
        }
        this.getConfigData();
      });
    },
  },
  created() {
    if (this.preFetchData.orgList) {
      this.organizationList = this.preFetchData.orgList;
    } else {
      service.getOrganisation().then((orgList) => {
        this.organizationList = orgList.data.organisationUnits;
      });
    }
    this.getConfigData();
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.sect_de_wrap {
  position: relative;
  padding: 2% 2% 1.5%;
  border: 2px solid var(--grey-color-button);
  border-radius: 5px;
  margin-top: 3%;
  h5 {
    position: absolute;
    top: -18px;

    font-size: 1rem;
    padding: 8px;
    color: var(--text-font-color);
    border-radius: 4px;
  }
}
</style>
