<template>
  <div
    class="home-main position-relative"
    :style="{ backgroundImage: `url(${appData.landingPageBGImg})` }"
  >
    <Header
      :headerConditions="{
        home: false,
        profile: false,
        pageTitle: false,
        dashboardLogo: true,
      }"
      v-if="!isFromAdmin"
      @langChange="langChange"
      @reload="reload"
      @activateTour="activateTour"
    >
    </Header>
    <template v-if="displayPage">
      <b-row class="home-content mx-5 d-flex justify-content-center">
        <b-col class="text-right" sm="12" v-if="isFromAdmin">
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
        <b-col sm="6" class="landingpage-text-container">
          <div :class="isFromAdmin ? 'position-relative' : ''" class="">
            <b-button
              v-b-modal.modal-logo
              class="black-btn"
              style="position: absolute; top: -50px; left: 50%"
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
                          class="form-control-file"
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
            <img class="logo-img" :src="appData.landingPageLogo" />
          </div>
          <input
            style="background: transparent; border: none; font-size: 1.5rem"
            class="form-control text-white"
            :title="$t('clicktoedit')"
            v-if="isFromAdmin"
            v-model="appData.landingPageTitle"
          />
          <h2 class="fs-22-1920 headingText my-5" v-else>
            {{ appData.landingPageTitle }}
          </h2>
          <textarea
            v-if="isFromAdmin"
            :title="$t('clicktoedit')"
            style="background: transparent; border: none; font-size: 1rem"
            maxlength="450"
            rows="4"
            class="form-control text-white"
            v-model="appData.landingPageDesc"
          />
          <p
            class="mr-5 pr-5 dashboardSummaryText fs-17-1920"
            data-v-step="2"
            v-else
          >
            {{ appData.landingPageDesc }}
          </p>
          <div>
            <b-dropdown
              id="dropdown-1"
              :text="$t('selectDashboard')"
              class="select_dashboard_btn fs-17-1920"
              :disabled="isFromAdmin"
            >
              <b-dropdown-item-button
                v-for="(dashboard, i) in dashboards"
                :key="'dashboard' + i"
                @click.prevent="
                  goTo({
                    module: dashboard.module,
                    setNamespace: dashboard.setNamespace,
                    routeName: dashboard.routeName,
                  })
                "
                class="fs-17-1920"
                :class="{
                  dropDownBorderBottomColor: i < dashboards.length - 1,
                }"
              >
                <img
                  :src="require(`../assets/images/${dashboard.icon}`)"
                  class="mr-3"
                />{{ dashboard.text }}
              </b-dropdown-item-button>
            </b-dropdown>
          </div>
        </b-col>
        <b-col sm="6">
          <div class="page d-flex align-items-center">
            <div class="dqr-content">
              <div class="img-dqr v-step-1 p-3">
                <img
                  src="@/assets/img/home-pie.png"
                  class="d-block m-auto intImg w-100"
                />
                <div class="mt-5 d-flex justify-content-center">
                  <b-button
                    :disabled="isFromAdmin"
                    class="home-dqr p-3 px-4 purple-btn fs-17-1920 w-100"
                    @click="
                      goTo({
                        routeName: 'integrated-dashboard',
                      })
                    "
                    >{{ $t("integratedDashboard") }}</b-button
                  >
                </div>
              </div>
            </div>
            <div class="sum-content">
              <div class="sumry-content mt-4">
                <img
                  src="@/assets/img/home-chart.png"
                  class="d-block m-auto mb-lg-n2 w-100"
                />
                <div class="mt-5 d-flex justify-content-center">
                  <b-button
                    class="home-sum p-3 px-4 purple-btn w-100"
                    :disabled="isFromAdmin"
                    @click="
                      goTo({
                        routeName: 'report',
                      })
                    "
                    >{{ $t("reports") }}</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <footer class="dashboardNewFooter">
        <div class="footer-home-div">
          <b-container fluid>
            <b-row>
              <b-col sm="3" class="pl-0">
                <div
                  class="
                    footer-img-div
                    d-flex
                    justify-content-center
                    align-items-center
                  "
                >
                  <!-- <img
										class="img-fluid footer-home-icon pr-2"
										src="@/assets/images/track-20.png"
									/>
									<img
										class="img-fluid footer-home-icon pr-2"
										src="@/assets/images/avenir_health.png"
									/>
									<img
										class="img-fluid footer-home-icon"
										src="@/assets/images/DT-logo1.png"
									/> -->
                  <img
                    class="img-fluid w-90"
                    src="@/assets/images/footer-logo.png"
                  />
                </div>
              </b-col>
              <b-col sm="5" class="">
                <p
                  class="
                    align-items-end
                    text-white
                    d-flex
                    h-100
                    justify-content-center
                    mb-0
                    mt-2
                    small
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
    </template>
  </div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import config from "@/config/config.js";
import NavigationMixin from "@/helpers/NavigationMixin";
import ChangeImageMixin from "@/helpers/ChangeImageMixin";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  name: "Integrated-Dashboard",
  props: ["isFromAdmin"],
  components: {},
  mixins: [
    NavigationMixin,
    ChangeImageMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      displayPage: false,
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
    dashboards() {
      let d = [],
        programs = [];
      if (this.$store.getters.getIsAdmin) {
        programs = ["mnch", "fp"];
      } else {
        programs = this.$store.getters.getUserPermissions?.dashboards || [];
      }

      if (programs.includes("mnch")) {
        d.push({
          module: "mnch-dashboard",
          setNamespace: true,
          routeName: "mnch-dashboard",
          icon: "RMNCHdashsmall.png",
          text: this.$i18n.t("maternal_newborn_and_child_health"),
        });
      }
      if (programs.includes("fp")) {
        d.push({
          module: "fp-dashboard",
          setNamespace: true,
          routeName: "fp-dashboard",
          icon: "maternal_healthicon.png",
          text: this.$i18n.t("family_planning"),
        });
      }

      return d;
    },
  },
  methods: {
    reload() {
      this.getUserDetails();
    },
    getBaseURLFromManifest() {
      fetch("./manifest.webapp")
        .then((response) => response.json())
        .then((json) => {
          this.$store.commit("setBaseURL", json.activities.dhis.href); //Save the baseURL store
          this.$nextTick(() => {
            this.getUserDetails();
            this.$store.commit("setAppVersion", json.version); //Save the application version
          });
        });
    },
    async getUserDetails() {
      this.$store.commit("setLoading", true);
      if (!this.$store.getters.getUserDetails) {
        if (!this.isFromAdmin) {
          this.$store.commit("setLoadingText", this.$i18n.t("userLoadText")); //Setting loading text in store
        }
        try {
          let userData = await service.getLoggedInUser();
          this.$store.commit("setUserDetails", userData.data);
          this.$store.commit(
            "setLoggedInUserId",
            userData.data.userCredentials.id
          );
          // Check if the logged in user is admin user or not, based on the predefind roles from 'index.html' file
          let roles = userData.data.userCredentials.userRoles,
            rolesLength = roles.length;
          this.$store.commit("setIsAdmin", false); //for safer side
          for (let i = 0; i < rolesLength; i++) {
            if (
              settings.userRole.includes(roles[i].name) ||
              ["appAdmin"].includes(roles[i].name)
            ) {
              this.$store.commit("setIsAdmin", true);
              break;
            }
          }
          this.checkDataStore();
        } catch (e) {
          this.genericAlert("Failed in getUserDetails()...");
          this.$store.commit("setLoading", false);
        }
      } else {
        this.checkDataStore();
      }
    },
    /**
     * Check for the dataStore is present or not. DataStore contains all the configurations files. If not present, show appropriate popup message to set the configurations with the Admin link.
     */
    checkDataStore() {
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
            if (!this.$store.getters.getIsAdmin) {
              this.setUserPermissions();
            }
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
        if (!this.$store.getters.getIsAdmin) {
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
        service.getSavedConfig(key).then((res) => {
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
        let isLangSame = false;
        /* Variable to decide whether to call the 'applicationSetup' config file using the different local/language available in the 'applicationSetup' config file itself in the 'defaultLanguageLocale' key.
        E.g. Default value of 'this.$i18n.locale' is 'en' (as set in the 'index.html' file), we are calling 'applicationSetup_en' config file based on the 'this.$i18n.locale' value. In the 'applicationSetup_en' config file we found that the 'defaultLanguageLocale' is set as 'fr' (French), this means that we need to load the app in the French language. In this case we need to again call the 'applicationSetup' config file using the 'fr' locale.*/
        service
          .getSavedConfig(key)
          .then((response) => {
            // Compare the locale
            if (this.$i18n.locale === response.data.defaultLanguageLocale) {
              // If the local is same
              isLangSame = true;
              this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
            } else {
              // If the locale is not same
              // Check if the user has changed the language from the landing page. Check the 'langChange()' function.
              if (!this.$store.state.isLangChanged) {
                // Set the 'this.$i18n.locale' based on the 'defaultLanguageLocale'
                this.$i18n.locale = response.data.defaultLanguageLocale;
              } else {
                this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
              }
            }
          })
          .then(() => {
            if (isLangSame) {
              // Call the next set of config files
              // this.getGlobalDynamicData();
              this.getLocationList();
            } else {
              // Check if the user has changed the language from the landing page. Check the 'langChange()' function.
              if (!this.$store.state.isLangChanged) {
                // Again call the 'applicationSetup' config file using the other locale as set above.
                this.getApplicationModuleDetails();
              } else {
                // this.getGlobalDynamicData();
                this.getLocationList();
              }
            }
          })
          .catch(() => {
            this.$store.commit("setLoading", false);
            this.genericAlert("Failed in set locale...");
          });
      } else {
        this.appData = this.$store.getters.getApplicationModule();
        this.getLocationList();
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
        // Fetch all available locations based on the locationID & levelID. We will get the nested location list.
        let response = await service.getOrganisationChildren(
          locationID,
          levelID
        );
        // Convert the location list in the 'vue-treeselect' format
        const renamedObj = service.renameKeys(response.data);
        this.$store.commit("setLocationList", [renamedObj]); // Set the location list in store
      }
      this.getOrgLevels();
      this.getGlobalFactors();
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
            this.$store.commit("setLoadingText", "");
            this.$store.commit("setLoading", false);
            this.checkRedirection();
          })
          .catch(() => {
            console.log("Failed in getGlobalFactors()...");
            this.$store.commit("setLoadingText", "");
            this.$store.commit("setLoading", false);
          });
      } else {
        this.$store.commit("setLoadingText", "");
        if (!this.isFromAdmin) {
          this.$store.commit("setLoading", false);
        }
        this.checkRedirection();
      }
    },
    /**
     * Check redirection to specific module for non-admin user
     */
    checkRedirection() {
      if (this.$store.getters.getIsAdmin || this.dashboards.length > 1) {
        this.displayPage = true;
      } else {
        this.goTo({
          module: this.dashboards[0].module,
          setNamespace: this.dashboards[0].setNamespace,
          routeName: this.dashboards[0].routeName,
        });
      }
    },
    /**
     * This functions executes in the below conditions,
     * 1) When the default local/language set in the 'defaultLocale' of the 'index.html' file and the local/language set in the 'applicationModule' config file is not matching.
     * 2) When the language is changes from the landing page and is not matching with the local/language set in the 'applicationModule' config file.
     */
    getApplicationModuleDetails() {
      if (!this.isFromAdmin) {
        this.$store.commit(
          "setLoadingText",
          this.$i18n.t("applicationLoadText")
        );
      }
      let key = this.generateKey("applicationModule");

      service
        .getSavedConfig(key)
        .then((response) => {
          this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
        })
        .then(() => {
          // Call the next set of config files
          // this.getGlobalDynamicData();
          this.getLocationList();
        })
        .catch(() => {
          this.genericAlert("Failed in getApplicationModuleDetails()...");
          this.$store.state.loading = false;
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
      // Set the theme
      service.applyTheme();
    },
  },
  created() {
    this.$store.commit("setActiveTab", "");
    this.$store.commit("setIsClearCache", false); //Reset the value
    if (!this.isFromAdmin) {
      this.$store.commit("setLoadingText", this.$i18n.t("loadText")); //Setting loading text in store
    }
    this.$store.commit("setFinancialYear", settings.financialYear); //Setting financialYear variable defined in index.html file in a store. This is used in Toolbar to show appropriate period type
    if (process.env.NODE_ENV !== "production") {
      this.$store.commit("setBaseURL", settings.baseURL); //Save the baseURL store
      this.getUserDetails();
    } else {
      this.getBaseURLFromManifest();
    }
  },
};
</script>
<style lang="scss">
.img-preview img {
  width: 180px !important;
  margin-top: 20px;
}
</style>
