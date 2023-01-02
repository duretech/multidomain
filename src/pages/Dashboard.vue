<template>
  <div>
    <div class="home-page">
      <Header
        :headerConditions="{
          home: true,
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
            v-if="
              !$store.getters.getIsAdmin &&
              $store.getters.getUserPermissions.dashboards &&
              $store.getters.getUserPermissions.dashboards.length > 1
            "
            size="sm"
            class="btn-bg-transparent mx-2 px-0"
            @click="
              goTo({
                setNamespace: true,
                routeName: 'report',
              })
            "
            >Reports</b-button
          >
        </template>
        <template v-slot:dashboardType>
          <b-dropdown
            id="dropdownhome"
            toggle-class="mx-2 px-0"
            v-if="
              $store.getters.getIsAdmin ||
              ($store.getters.getUserPermissions.dashboards &&
                $store.getters.getUserPermissions.dashboards.length > 1)
            "
          >
            <template slot="button-content" class="header">
              <p class="dashboard">{{ $t("dashboard") }}</p>
            </template>
            <b-dropdown-item
              v-if="$route.name === 'fp-dashboard'"
              @click="
                goTo({
                  module: 'mnch-dashboard',
                  setNamespace: true,
                  routeName: 'mnch-dashboard',
                });
                checkDataStore();
              "
            >
              <img
                :src="require('@/assets/images/RMNCHdashsmall.png')"
                class="navdropdown-img pr-1 mr-2 ml-0"
              />{{ $t("maternal_newborn_and_child_health") }}</b-dropdown-item
            >
            <b-dropdown-item
              v-if="$route.name === 'mnch-dashboard'"
              @click="
                goTo({
                  module: 'fp-dashboard',
                  setNamespace: true,
                  routeName: 'fp-dashboard',
                });
                checkDataStore();
              "
            >
              <img
                :src="require('@/assets/images/maternal_healthicon.png')"
                class="navdropdown-img pr-1 mr-3"
              />{{ $t("family_planning") }}</b-dropdown-item
            >
          </b-dropdown>
        </template>
      </Header>
      <b-container fluid class="home-page-container">
        <b-row v-if="isFromAdmin">
          <b-col class="text-right" sm="12">
            <b-button v-b-modal.modal-bgImg class="black-btn m-1">{{
              $t("changeBackgroundImage")
            }}</b-button>

            <b-modal id="modal-bgImg" :title="$t('uploadBackgroundImage')">
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
        <div class="content-wrap">
          <div class="home-banner-div">
            <b-row>
              <b-col sm="9" class="ml-auto">
                <div
                  class="home-banner-image"
                  :style="{
                    backgroundImage: `url(${appData.landingPageBGImg})`,
                  }"
                ></div>
              </b-col>
            </b-row>
          </div>
          <div class="first-content-div">
            <b-row>
              <b-col>
                <b-button
                  v-b-modal.modal-logo
                  class="black-btn m-1"
                  style="position: absolute; top: -50px"
                  v-if="isFromAdmin"
                  ><i
                    class="fa fa-edit text-white cursor-pointer"
                    title="Edit Icon"
                /></b-button>
                <b-modal
                  v-if="isFromAdmin"
                  id="modal-logo"
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
            <b-row class="mt-2 large-screen-mt-4">
              <b-col sm="7">
                <input
                  style="
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                  "
                  class="form-control text-white"
                  :title="$t('clicktoedit')"
                  v-if="isFromAdmin"
                  v-model="appData.landingPageTitle"
                />
                <h2 class="home-page-heading fs-40-1920" v-else>
                  {{ appData.landingPageTitle }}
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
                    class="linked-btn"
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
            <b-row class="mt-0">
              <b-col sm="11">
                <textarea
                  v-if="isFromAdmin"
                  :title="$t('clicktoedit')"
                  style="background: transparent; border: none; font-size: 1rem"
                  maxlength="450"
                  rows="4"
                  class="form-control text-white"
                  v-model="appData.landingPageDesc"
                />
                <p class="home-page-desp fs-17-1920" v-else>
                  {{ appData.landingPageDesc }}
                </p>
              </b-col>
            </b-row>
          </div>
          <div class="module-content-div">
            <div class="modules-wrap">
              <HomePageModules :isFromAdmin="isFromAdmin" v-if="showModules" />
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
                    class="
                      pl-5
                      footer-img-div
                      d-flex
                      justify-content-center
                      align-items-center
                    "
                  >
                    <!-- <img
											:src="require('@/assets/images/track-20.png')"
											class="img-fluid footer-home-icon"
										/>
										<img
											:src="require('@/assets/images/avenir_health.png')"
											class="img-fluid footer-home-icon"
										/>
										<img
											:src="require('@/assets/images/DT-logo1.png')"
											class="img-fluid footer-home-icon"
										/> -->
                    <img
                      class="img-fluid w-90"
                      src="@/assets/images/footer-logo.png"
                    />
                  </div>
                </b-col>
                <b-col sm="5">
                  <p
                    class="
                      align-items-center
                      d-flex
                      h-100
                      justify-content-center
                      mb-0
                      text-center
                      version-details
                    "
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
          title="Linked Modules"
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
                            require('../assets/img/home/' +
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
      </b-container>
      <!-- <Chatbot v-if="!isFromAdmin" /> -->
    </div>
  </div>
</template>
<script>
/*global settings*/
// import { genericAlert } from "@/components/alerts.js";
import HomePageModules from "@/components/Home/HomePageModules.vue";
import config from "@/config/config.js";
import service from "@/service";
import NavigationMixin from "@/helpers/NavigationMixin";
import ChangeImageMixin from "@/helpers/ChangeImageMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  props: ["isFromAdmin", "redirectDetails"],
  mixins: [
    NavigationMixin,
    ChangeImageMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  components: {
    HomePageModules,
  },
  data() {
    return {
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
  },
  methods: {
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
      this.$store.commit("setLoading", true);
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
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
            if (!this.isFromAdmin) {
              if (this.$store.getters.getIsAdmin) {
                // Popup message to set the configurations
                this.$swal({
                  title: this.$i18n.t("noConfiguration"),
                  text: this.$i18n.t("setConfiguration"),
                  showCancelButton: true,
                  confirmButtonText: this.$i18n.t("configureNow"),
                }).then((result) => {
                  if (result.value) {
                    this.$router.push("/admin");
                  }
                });
              } else {
                // Popup message to contact admin for the configurations
                this.$swal({
                  title: this.$i18n.t("noConfiguration"),
                  text: this.$i18n.t("contactAdmin"),
                });
              }
            }
          });
      } else {
        this.setLocale();
      }
    },
    /**
     * To set the default locale/language for the application.
     */
    setLocale() {
      let appData =
        Object.keys(this.$store.getters.getApplicationModule()).length === 0;

      if (
        (appData && !this.$store.getters.getLangChanged) ||
        (!appData && this.$store.getters.getLangChanged) ||
        (appData && this.$store.getters.getLangChanged)
      ) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("defaultLangLoadText")
          );
        }
        // This is to generate the key format of the configurations files for the Sandbox/standard app.
        // The "generateKey" function is coming from "@/helpers/GlobalMixin.js" file.
        let key = this.generateKey("applicationModule");
        // By default, we are calling the 'applicationSetup' config file using the local/language set in the 'this.$i18n.locale' global variable.
        service
          .getSavedConfig(key)
          .then((response) => {
            this.appData = response.data;
            this.$store.commit("setApplicationModule", response.data);
          })
          .then(() => {
            this.getGlobalDynamicData();
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
            console.log("Failed in set locale...");
          });
      } else {
        this.appData = this.$store.getters.getApplicationModule();
        this.getGlobalDynamicData();
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
            this.$store.commit("setLoading", false);
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
        this.$store.commit("setLoading", false);
        this.showModules = true;
        this.setRedirect();
      }
    },
    setRedirect() {
      if (this.redirectDetails) {
        this.goTo({
          routeName: this.redirectDetails.routeName,
          activeTab: this.redirectDetails.activeTab,
        });
      }
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
          .filter((dM) => dM.isLive)
          .filter((m) => m.selectedModule === this.$store.getters.getNamespace);
      });
    },
  },
  created() {
    this.$store.commit("setActiveTab", "");
    this.checkDataStore();
  },
};
</script>
<style></style>
