<template>
  <div>
    <div class="home-page">
      <Header
        :headerConditions="{
          home: $store.getters.getIsMultiProgram ? true : false,
          profile: false,
          pageTitle: true,
          dashboardLogo: true,
        }"
        v-if="!isFromAdmin"
        @langChange="langChange"
        @activateTour="activateTour"
      >
        <template v-slot:report>
          <b-button
            v-if="!$store.getters.getIsMultiProgram"
            size="sm"
            class="btn-bg-transparent mx-2 px-0 bg-fav"
            @click="
              goTo({
                setNamespace: true,
                routeName: 'report',
              })
            "
            >{{ $t("reports") }}</b-button
          >
        </template>
        <template v-slot:dashboardType>
          <b-dropdown
            id="dropdownhome"
            toggle-class="mx-2 px-0 bg-fav"
            v-if="$store.getters.getIsMultiProgram"
          >
            <template slot="button-content" class="header">
              <p class="dashboard">{{ $t("dashboard") }}</p>
            </template>
            <template v-for="(dashboard, i) in dashboards">
              <b-dropdown-item
                v-if="!$store.getters.getNamespace.includes(dashboard.module)"
                :key="'dashboard' + i"
                @click.prevent="
                  displayPage = false;
                  goTo({
                    module: dashboard.module,
                    setNamespace: dashboard.setNamespace,
                    routeName: dashboard.routeName,
                  });
                  checkDataStore();
                "
              >
                <img
                  :src="require(`@/assets/images/${dashboard.icon}`)"
                  class="mr-3"
                />{{ dashboard.text }}
              </b-dropdown-item>
            </template>
          </b-dropdown>
        </template>
      </Header>
      <div class="home-page-container" v-if="displayPage">
        <div class="content-wrap">
          <div class="home-banner-div">
            <div
              class="home-banner-image"
              :style="{
                backgroundImage: `url(${appData.landingPageBGImg})`,
              }"
            ></div>
          </div>
          <b-row v-if="isFromAdmin" class="mt-0">
            <b-col class="text-right" sm="12">
              <b-button
                v-b-modal.modal-bgImg
                class="black-btn bgbtn-theme m-1 mt-4 mx-4"
              >
                <img
                  src="@/assets/images/icons/admin-editicon.svg"
                  :style="{ filter: filterColor }"
                  class="text-white cursor-pointer mx-2"
                />
                {{ $t("changeBackgroundImage") }}</b-button
              >

              <b-modal
                id="modal-bgImg"
                :title="$t('uploadBackgroundImage')"
                centered
              >
                <div class="row">
                  <div class="col-lg-12">
                    <form>
                      <div class="form-group row">
                        <label
                          for="inputPassword"
                          class="col-sm-4 col-form-label"
                          >{{ $t("selectImage") }}</label
                        >
                        <div class="col-sm-8">
                          <input
                            type="file"
                            class="form-control-file p-t-4px"
                            style="font-size: 0.9375rem"
                            name="landingPageBGImg"
                            accept="image/*"
                            @change="onImgChange"
                          />
                          <div class="img-preview">
                            <img
                              alt="img"
                              v-if="appData.landingPageBGImg"
                              :src="appData.landingPageBGImg"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </b-modal>
            </b-col>
          </b-row>
          <div class="home-page-container container-fluid">
            <div class="first-content-div">
              <b-row>
                <b-col>
                  <b-button
                    v-b-modal.modal-logo
                    class="black-btn bgbtn-theme m-1"
                    style="position: absolute; top: -50px"
                    v-if="isFromAdmin"
                  >
                    <img
                      src="@/assets/images/icons/admin-editicon.svg"
                      :style="{ filter: filterColor }"
                      class="text-white cursor-pointer mx-1"
                      :title="$t('clicktoedit')"
                    />
                    <!-- <i
                    class="fa fa-edit text-white cursor-pointer"
                    :title="$t('clicktoedit')"/> -->
                    {{ $t("change_logo") }}</b-button
                  >
                  <b-modal
                    v-if="isFromAdmin"
                    id="modal-logo"
                    centered
                    :title="$t('uploadApplicationLogo')"
                  >
                    <div class="row">
                      <div class="col-lg-12">
                        <form>
                          <div class="form-group row">
                            <label
                              for="inputPassword"
                              class="col-sm-4 col-form-label"
                              >{{ $t("selectLogo") }}</label
                            >
                            <div class="col-sm-8">
                              <input
                                type="file"
                                class="form-control-file p-t-4px"
                                style="font-size: 0.9375rem"
                                name="landingPageLogo"
                                accept="image/*"
                                @change="onImgChange"
                              />
                              <div class="img-preview">
                                <img
                                  alt="img"
                                  v-if="appData.landingPageLogo"
                                  :src="appData.landingPageLogo"
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </b-modal>
                  <!-- <img
									:src="appData.landingPageLogo"
									class="img-fluid logo-img"
								/> -->
                </b-col>
              </b-row>
              <b-row class="mt-2 large-screen-mt-4 sidebar-responsive">
                <b-col sm="7">
                  <b-input-group v-if="isFromAdmin">
                    <b-form-input
                      style="
                        background: transparent;
                        border: none;
                        font-size: 1.1rem;
                      "
                      class="form-control text-white"
                      :title="$t('clicktoedit')"
                      type="text"
                      v-model="appData.landingPageTitle[$i18n.locale]"
                      disabled
                    ></b-form-input>
                    <b-input-group-append is-text>
                      <Translations
                        :transText.sync="appData.landingPageTitle"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <h2 class="home-page-heading fs-40-1920" v-else>
                    {{ appData.landingPageTitle[$i18n.locale] || $t("noData") }}
                  </h2>
                </b-col>
                <b-col sm="4">
                  <div
                    class="text-right pt-3"
                    v-if="
                      dynamicModules.length && !isFromAdmin && isLinkedModules
                    "
                  >
                    <b-button
                      class="linked-btn blue-btn"
                      size="sm"
                      @click.prevent="viewDynamicModules = true"
                    >
                      <span class="linked-img">
                        <img
                          :src="
                            require('@/assets/images/icons/Icon-material-link.svg')
                          "
                          class="img-fluid w-20px"
                        />
                      </span>

                      {{ $t("linked_modules") }}</b-button
                    >
                  </div>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="11">
                  <b-input-group v-if="isFromAdmin">
                    <textarea
                      :title="$t('clicktoedit')"
                      style="
                        background: transparent;
                        border: none;
                        font-size: 1rem;
                      "
                      maxlength="450"
                      rows="4"
                      class="form-control text-white"
                      v-model="appData.landingPageDesc[$i18n.locale]"
                      disabled
                    />
                    <b-input-group-append is-text>
                      <Translations :transText.sync="appData.landingPageDesc" />
                    </b-input-group-append>
                  </b-input-group>

                  <p class="home-page-desp fs-17-1920" v-else>
                    {{ appData.landingPageDesc[$i18n.locale] || $t("noData") }}
                  </p>
                </b-col>
              </b-row>
            </div>

            <div class="module-content-div">
              <div class="modules-wrap">
                <HomePageModules
                  :isFromAdmin="isFromAdmin"
                  v-if="showModules"
                />
              </div>
            </div>
          </div>
        </div>
        <footer v-if="!isFromAdmin">
          <div class="footer-home-div">
            <b-container fluid>
              <b-row>
                <b-col sm="3">
                  <!-- footer-img-div  -->
                  <div
                    class="pl-5 footer-img-div d-flex justify-content-center align-items-center"
                  >
                    <img
                      class="img-fluid w-75"
                      src="@/assets/images/footer-logo.png"
                    />
                  </div>
                </b-col>
                <b-col sm="5">
                  <p
                    class="align-items-center d-flex h-100 justify-content-center mb-0 text-center version-details d-none"
                    v-if="$store.getters.getAppVersion"
                  >
                    {{ $store.getters.getAppVersion }}
                  </p>
                </b-col>
                <b-col sm="4"></b-col>
              </b-row>
            </b-container>
          </div>
        </footer>
        <b-modal
          id="modal-dynamic"
          hide-footer
          centered
          v-model="viewDynamicModules"
          :title="$t('linked_modules')"
        >
          <div class="home-modules-div">
            <b-row>
              <b-col
                class="px-0"
                v-for="(module, i) in dynamicModules"
                :key="'dynamicModules' + i"
              >
                <a
                  class="module-link"
                  @click.prevent="goToDynamicModule(module.id)"
                >
                  <div class="module-div-sect summary-module">
                    <div class="module-div summary-module-div">
                      <template v-if="module.moduleLogoURL">
                        <img
                          alt="img"
                          :src="module.moduleLogoURL"
                          class="img-fluid module-icon"
                        />
                      </template>
                      <template v-else>
                        <img
                          alt="img"
                          :src="
                            require('../assets/images/home/' +
                              module.moduleLogoName)
                          "
                          class="img-fluid module-icon"
                        />
                      </template>
                    </div>
                    <div class="semi-circle"></div>
                  </div>
                  <h4 class="module-name fs-17-1920">
                    {{ module.moduleName }}
                  </h4>
                </a>
              </b-col>
            </b-row>
          </div>
        </b-modal>
      </div>
      <!-- <Chatbot v-if="!isFromAdmin" /> -->
    </div>
  </div>
</template>
<script>
import service from "@/service";
import { loadLanguage } from "@/i18n";
import config from "@/config/config.js";
import NavigationMixin from "@/helpers/NavigationMixin";
import ChangeImageMixin from "@/helpers/ChangeImageMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import DashboardListMixin from "@/helpers/DashboardListMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import HomePageModules from "@/components/Home/HomePageModules.vue";

export default {
  props: ["isFromAdmin", "updatedData", "redirectDetails"],
  mixins: [
    NavigationMixin,
    ChangeImageMixin,
    DynamicImageMixin,
    DashboardListMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  components: {
    HomePageModules,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      displayPage: false,
      showModules: false,
      dynamicModules: [],
      viewDynamicModules: false,
      appData: config.applicationModule,
    };
  },
  watch: {
    appData: {
      handler(newValue) {
        if (newValue) {
          this.$emit("updateAdmin", newValue);
        }
      },
      deep: true,
    },
    updatedData: {
      handler(newValue) {
        if (newValue) {
          this.appData = newValue;
        }
      },
      deep: true,
    },
    dTitle(newValue) {
      this.setTitle(newValue);
    },
  },
  computed: {
    isLinkedModules() {
      let show = false;
      if (this.$store.getters.getIsAdmin) {
        show = true;
      } else {
        let permission = this.$store.getters.getUserPermissions;
        if (Object.keys(permission).length) {
          permission.dashboards.forEach((d) => {
            if (this.$store.getters.getNamespace.includes(`_${d}-`)) {
              show = permission.modules.includes(`linked_modules-${d}`);
            }
          });
        }
      }
      return show;
    },
    dTitle() {
      return this.$store.getters.getNamespace;
    },
  },
  methods: {
    setTitle(newValue) {
      if (newValue.includes("_fp-dashboard")) {
        this.setDocumentTitle(this.$i18n.t("family_planning"));
      }
      if (newValue.includes("_mnch-dashboard")) {
        this.setDocumentTitle(this.$i18n.t("maternalHealth"));
      }
    },
    goToDynamicModule(id) {
      this.goTo({
        routeName: "dynamicDashboard",
        moduleId: id,
      });
    },
    /**
     * Check for the dataStore is present or not. DataStore contains all the configurations files. If not present, show appropriate popup message to set the configurations with the Admin link.
     */
    checkDataStore() {
      this.showModules = false;
      this.appData = config.applicationModule;
      if (!this.isFromAdmin) {
        this.$store.commit("setLoading", true);
      }
      if (Object.keys(this.$store.getters.getDataStoreKeys).length === 0) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("dataStoreLoadText")
          );
        }
        service
          .getAllKeys()
          .then((response) => {
            this.$store.commit("setDataStoreKeys", response.data);
          })
          .then(() => {
            this.setLocale();
            if (
              !this.$store.getters.getIsMultiProgram &&
              !this.$store.getters.getIsAdmin
            ) {
              this.setUserPermissions();
            }
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
            if (!this.isFromAdmin) {
              if (this.$store.getters.getIsAdmin) {
                // Popup message to set the configurations
                this.$swal({
                  title: this.$i18n.t("configurationnotavailable"),
                  text: this.$i18n.t("pleasesetyourconfiguration"),
                  showCancelButton: true,
                  reverseButtons: true,
                  confirmButtonText: this.$i18n.t("configureNow"),
                  cancelButtonText: this.$i18n.t("cancelbtn"),
                }).then((result) => {
                  if (result.value) {
                    this.$router.push("/admin");
                  }
                });
              } else {
                // Popup message to contact admin for the configurations
                this.sweetAlert({
                  title: this.$i18n.t("configurationnotavailable"),
                  text: this.$i18n.t("contactAdmin"),
                });
              }
            }
          });
      } else {
        this.setLocale();
        if (
          !this.$store.getters.getIsMultiProgram &&
          !this.$store.getters.getIsAdmin
        ) {
          this.setUserPermissions();
        }
      }
    },
    /**
     * To set the logged in user permissions, in case the user is non-admin.
     */
    setUserPermissions() {
      if (
        this.$store.getters.getUserPermissions &&
        Object.keys(this.$store.getters.getUserPermissions).length === 0
      ) {
        let key = this.generateKey("userManagement");
        service.getSavedConfig(key, false, "", true).then((res) => {
          let modulePermission = res?.data?.permission?.find(
            (d) =>
              d.id === this.$store.getters.getUserDetails.userCredentials.id
          );
          if (modulePermission) {
            this.$store.commit("setUserPermissions", modulePermission);
          }
        });
      }
    },
    /**
     * To set the default locale/language for the application.
     */
    setLocale() {
      if (
        Object.keys(this.$store.getters.getApplicationModule()).length === 0
      ) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("applicationLoadText")
          );
        }
        // This is to generate the key format of the configurations files for the Sandbox/standard app.
        // The "generateKey" function is coming from "@/helpers/GlobalMixin.js" file.
        let key = this.generateKey("applicationModule");
        // By default, we are calling the 'applicationSetup' config file using the local/language set in the 'this.$i18n.locale' global variable.
        service
          .getSavedConfig(key)
          .then(async (response) => {
            if (this.$store.getters.getIsMultiProgram) {
              this.appData = response.data;
              this.$store.commit("setApplicationModule", response.data);
            } else {
              if (this.$i18n.locale !== response.data.defaultLanguageLocale) {
                this.$i18n.locale = response.data.defaultLanguageLocale;
                await loadLanguage(response.data.defaultLanguageLocale);
                this.setDocumentTitle();
              }
              this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
            }
          })
          .then(() => {
            if (this.$store.getters.getIsMultiProgram) {
              this.getGlobalDynamicData();
            } else {
              this.getLocationList();
            }
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
            console.log("Failed in set locale...");
          });
      } else {
        this.appData = this.$store.getters.getApplicationModule();
        if (this.$store.getters.getIsMultiProgram) {
          this.getLocationList();
        } else {
          this.getGlobalDynamicData();
        }
      }
    },
    async getLocationList() {
      if (!this.$store.getters.getLocationList) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("locationLoadText")
          );
        }
        // Get the locationID & levelID from the 'getAllowedLocation()' function available in 'service.js' file.
        let { locationID, levelID } = service.getAllowedLocation();
        try {
          // Fetch all available locations based on the locationID & levelID. We will get the nested location list.
          let response = await service.getOrganisationChildren(
            locationID,
            levelID
          );
          // Convert the location list in the 'vue-treeselect' format
          const renamedObj = service.renameKeys(response.data);
          this.$store.commit("setLocationList", [renamedObj]); // Set the location list in store
        } catch (err) {
          console.log("Error in fetching location list...", err);
        }
      }
      this.getOrgLevels();
      if (this.isLinkedModules) {
        this.getDynamicModules();
      }
      this.getGlobalFactors();
      // Set the theme on hot-reload
      service.applyTheme();
    },
    /**
     * Get Org levels
     */
    async getOrgLevels() {
      if (!this.$store.getters.getOrgLevels) {
        let l = await service.getOrganisationUnitLevels();
        this.$store.commit("setOrgLevels", l.data);
      }
    },
    /**
     * This function calls the 'Dynamic modules' [created and made live from the Interactive Analytics module] and Global Factors.
     */
    getGlobalDynamicData() {
      if (this.isLinkedModules) {
        this.getDynamicModules();
      }
      this.getGlobalFactors();
    },
    /**
     * Get the Global Factors.
     */
    getGlobalFactors() {
      if (Object.keys(this.$store.getters.getGlobalFactors()).length === 0) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("globalFactorsLoadText")
          );
        }
        let key = this.generateKey("globalFactors");

        let response = service.getSavedConfig(key);
        response
          .then((response) => {
            this.$store.commit("setGlobalFactors", {
              payload: response.data,
            }); // Set the global factors in store
            if (!this.isFromAdmin) {
              this.$store.commit("setLoading", false);
            }
            this.$store.commit("setLoadingText", "");
            this.showModules = true;
            this.setRedirect();
          })
          .catch(() => {
            console.log("Failed in getGlobalFactors()...");
            this.$store.commit("setLoadingText", "");
            this.$store.commit("setLoading", false);
            this.setRedirect();
          });
      } else {
        this.$store.commit("setLoadingText", "");
        if (!this.isFromAdmin) {
          this.$store.commit("setLoading", false);
        }
        this.showModules = true;
        this.setRedirect();
      }
    },
    setRedirect() {
      if (this.redirectDetails) {
        this.goTo({
          routeName: this.redirectDetails.routeName,
          activeTab: this.redirectDetails.activeTab,
          IDLocationPeriod: this.redirectDetails.locationPeriod,
        });
      }
      this.displayPage = true;
    },
    /**
     * Get the Dynamic modules.
     */
    getDynamicModules() {
      if (!this.isFromAdmin) {
        this.$store.commit(
          "setLoadingText",
          this.$i18n.t("dynamicModuleLoadText")
        );
      }
      let key = this.generateKey("dynamicModules");

      let response = service.getSavedConfig(key, false, "", true);
      response.then((response) => {
        // Filter the live modules only
        this.dynamicModules = response.data
          .filter((dM) => dM.isLive && dM.locale === this.$i18n.locale)
          .filter((m) => m.selectedModule === this.$store.getters.getNamespace);
      });
    },
    /**
     * To set the applicationSetup config in the store.
     * @params 1) response = applicationSetup config file response
     */
    setApplicationDetails(response) {
      this.$store.commit("setApplicationModule", response.data);
      this.appData = response.data; // Set the response in the local variable to use further
      // Set locale/language for the moment library
      this.$moment.locale(this.$i18n.locale);
      this.$store.commit("setTheme", response.data.defaultColorTheme); // Set the theme in to store
      this.$store.commit("setLocalLang", response.data.defaultLanguageLocale); // Set the defaultLanguageLocale in to store
      // Set the theme
      service.applyTheme();
    },
  },
  created() {
    this.$store.commit("setActiveTab", "");
    this.checkDataStore();
    this.setTitle(this.$store.getters.getNamespace);
  },
};
</script>
<style></style>
