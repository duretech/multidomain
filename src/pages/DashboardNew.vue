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
      :displayPage="displayPage"
      @langChange="langChange"
      @reload="reload"
      @activateTour="activateTour"
    >
    </Header>
    <template v-if="displayPage">
      <b-row
        class="home-content mx-5 d-flex justify-content-center position-relative"
      >
        <b-col class="text-right" sm="12" v-if="isFromAdmin">
          <b-button v-b-modal.modal-bgImg class="black-btn bgbtn-theme m-1">
            <img
              src="@/assets/images/icons/admin-editicon.svg"
              :style="{ filter: filterColor }"
              class="text-white cursor-pointer mx-2"
            />
            {{ $t("changeBackgroundImage") }}</b-button
          >

          <b-modal
            id="modal-bgImg"
            centered
            :title="$t('uploadBackgroundImage')"
            :cancel-title="$t('cancelbtn')"
            :ok-title="$t('ok')"
            no-close-on-backdrop
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
        <b-col sm="6" class="landingpage-text-container">
          <div :class="isFromAdmin ? 'position-relative' : ''" class="  ">
            <b-button
              v-b-modal.modal-logo
              class="black-btn bgbtn-theme d-none"
              style="position: absolute; top: -50px; left: 50%"
              v-if="isFromAdmin"
            >
              <!-- <i
                class="fa fa-edit text-white cursor-pointer mx-2"
                :title="$t('clicktoedit')" /> -->
              <img
                src="@/assets/images/icons/admin-editicon.svg"
                :style="{ filter: filterColor }"
                class="text-white cursor-pointer mx-1"
                :title="$t('clicktoedit')"
              />
              {{ $t("change_logo") }}</b-button
            >
            <b-modal
              v-if="isFromAdmin"
              id="modal-logo"
              centered
              :title="$t('uploadApplicationLogo')"
              :cancel-title="$t('cancelbtn')"
              :ok-title="$t('ok')"
              no-close-on-backdrop
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
            <img v-if="logoHref" class="logo-img" :src="logoHref" />
          </div>
          <b-input-group v-if="isFromAdmin">
            <b-form-input
              style="background: transparent; border: none; font-size: 1rem"
              class="form-control text-white"
              :title="$t('clicktoedit')"
              type="text"
              v-model="appData.landingPageTitle[$i18n.locale]"
              disabled
            ></b-form-input>
            <b-input-group-append is-text>
              <Translations :transText.sync="appData.landingPageTitle" />
            </b-input-group-append>
          </b-input-group>
          <!-- v-model="appData.landingPageTitle" -->
          <h2 class="fs-22-1920 headingText my-5" v-else>
            <!-- {{ appData.landingPageTitle }} -->
            {{ appData.landingPageTitle[$i18n.locale] || $t("noData") }}
          </h2>
          <b-input-group v-if="isFromAdmin">
            <textarea
              :title="$t('clicktoedit')"
              style="background: transparent; border: none; font-size: 1rem"
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
          <!-- v-model="appData.landingPageDesc" -->
          <p
            class="mr-5 pr-5 dashboardSummaryText fs-17-1920"
            data-v-step="2"
            v-else
          >
            {{ appData.landingPageDesc[$i18n.locale] || $t("noData") }}
          </p>
          <div class="mt-4">
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
                  src="@/assets/images/home-pie.png"
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
              <div class="sumry-content">
                <img
                  src="@/assets/images/home-chart.png"
                  class="d-block m-auto w-100"
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
            <!-- <div class="pl-3"> -->
            <b-row>
              <b-col sm="3" class="pl-0" v-if="appData.footerLogo">
                <!-- footer-img-div  -->
                <div
                  class="pl-5 d-flex footer-img-div justify-content-center align-items-center"
                  v-if="appData.footerLogo"
                >
                  <img
                    class="img-fluid"
                    src="@/assets/images/footer-logo.png"
                  />
                </div>
              </b-col>
              <!-- <b-col sm="5">
                <p
                  class="align-items-end text-white d-flex h-100 justify-content-center mb-0 mt-2 small version-details d-none"
                  v-if="$store.getters.getAppVersion"
                >
                  {{ $store.getters.getAppVersion }}
                </p>
              </b-col>
              <b-col sm="4"></b-col> -->
            </b-row>
            <!-- </div> -->
          </b-container>
        </div>
      </footer>
    </template>
  </div>
</template>
<script>
/*eslint no-undef: "error"*/
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

export default {
  name: "Integrated-Dashboard",
  props: ["isFromAdmin", "updatedData"],
  components: {
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  mixins: [
    NavigationMixin,
    ChangeImageMixin,
    DynamicImageMixin,
    DashboardListMixin,
    DocumentTitleMixin,
    LanguageChangeMixin,
    EmitTourCallbackMixin,
  ],
  data() {
    return {
      displayPage: false,
      appData: config.applicationModule,
      logoHref: null,
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
  },
  methods: {
    reload() {
      this.getUserDetails();
    },
    async getUserDetails() {
      this.$store.commit("setLoading", true);
      console.log("calling getUserdetails method");
      if (!this.$store.getters.getUserDetails) {
        console.log("calling if for getting user details");
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
          console.log(
            rolesLength,
            "rolesLength",
            userData.data.userCredentials.userRoles,
            "userRoles",
            this.$store.getters.getAppSettings.adminUserRole,
            "adminUserRole"
          );
          for (let i = 0; i < rolesLength; i++) {
            if (
              this.$store.getters.getAppSettings.adminUserRole.includes(
                roles[i].name
              )
            ) {
              this.$store.commit("setIsAdmin", true);
              break;
            }
          }
          this.checkDataStore();
        } catch (e) {
          console.log(e, "error");
          this.sweetAlert({ title: "Failed in getUserDetails()..." });
          this.$store.commit("setLoading", false);
        }
      } else {
        console.log("calling else as we have userdetails");

        this.checkDataStore();
      }
    },
    /**
     * Check for the dataStore is present or not. DataStore contains all the configurations files. If not present, show appropriate popup message to set the configurations with the Admin link.
     */
    checkDataStore() {
      console.log("calling checkDatastore method", this.dashboards.length);

      if (this.dashboards.length === 1) {
        this.$store.commit("setIsMultiProgram", false); //Setting isMultiProgram variable in a store. This is used in Toolbar to show appropriate location
        this.goTo({
          module: this.dashboards[0].module,
          setNamespace: this.dashboards[0].setNamespace,
          routeName: this.dashboards[0].routeName,
        });
        return;
      }
      if (Object.keys(this.$store.getters.getDataStoreKeys()).length === 0) {
        if (!this.isFromAdmin) {
          this.$store.commit(
            "setLoadingText",
            this.$i18n.t("dataStoreLoadText")
          );
        }
        service
          .getAllKeys({})
          .then((response) => {
            this.$store.commit("setDataStoreKeys", response.data);
          })
          .then(() => {
            this.setLocale();
            if (
              !(
                this.$store.getters.getIsAdmin &&
                this.$store.getters.getAppSettings.bypassUser
              )
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
          !(
            this.$store.getters.getIsAdmin &&
            this.$store.getters.getAppSettings.bypassUser
          )
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
        service.getSavedConfig({ tableKey: key }).then((res) => {
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
        Object.keys(this.$store.getters.getApplicationModule(true)).length === 0
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
          .getSavedConfig({ tableKey: key })
          .then(async (response) => {
            if (this.$i18n.locale !== response.data.defaultLanguageLocale) {
              this.$i18n.locale = response.data.defaultLanguageLocale;
              await loadLanguage(response.data.defaultLanguageLocale);
              this.setDocumentTitle();
            }
            this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
          })
          .then(() => {
            // Call the next set of config files
            this.getLocationList();
          })
          .catch((e) => {
            this.$store.commit("setLoading", false);
            console.log("getting error for non admin user", e);
            this.sweetAlert({ title: "Failed in set locale..." });
          });
      } else {
        this.appData = this.$store.getters.getApplicationModule(true);
        // Set the theme on hot-reload
        service.applyTheme();
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

        let response = service.getSavedConfig({ tableKey: key });
        response
          .then((response) => {
            this.$store.commit("setGlobalFactors", {
              payload: response.data,
            }); // Set the global factors in store
            this.$store.commit("setLoadingText", "");
            if (!this.isFromAdmin) {
              this.$store.commit("setLoading", false);
            }
            this.checkRedirection();
          })
          .catch(() => {
            console.log("Failed in getGlobalFactors()...");
            this.$store.commit("setLoadingText", "");
            this.$store.commit("setLoading", false);
          });
      } else {
        this.$store.commit("setLoadingText", "");
        this.checkRedirection();
      }
    },
    /**
     * Check redirection to specific module
     */
    checkRedirection() {
      if (!this.isFromAdmin) {
        this.$store.commit("setLoading", false);
      }
      if (this.dashboards.length > 1) {
        this.displayPage = true;
        this.$store.commit("setIsMultiProgram", true); //Setting isMultiProgram variable in a store. This is used in Toolbar to show appropriate location
      } else {
        this.redirect();
      }
    },
    /**
     * Redirect to the specific module
     */
    redirect() {
      if (this.dashboards.length === 1) {
        this.$store.commit("setIsMultiProgram", false); //Setting isMultiProgram variable in a store. This is used in Toolbar to show appropriate location
        this.goTo({
          module: this.dashboards[0].module,
          setNamespace: this.dashboards[0].setNamespace,
          routeName: this.dashboards[0].routeName,
        });
        return;
      }
    },
    /**
     * To set the applicationSetup config in the store.
     * @params 1) response = applicationSetup config file response
     */
    setApplicationDetails(response) {
      this.$store.commit("setApplicationModule", response.data);
      this.appData = response.data; // Set the response in the local variable to use further
      // Set locale/language for the moment library
      console.log("setApplicationDetails", this.$i18n.locale);
      this.$moment.locale(this.$i18n.locale);
      this.$store.commit("setTheme", response.data.defaultColorTheme); // Set the theme in to store
      this.$store.commit("setLocalLang", response.data.defaultLanguageLocale); // Set the defaultLanguageLocale in to store
      // Set the theme
      service.applyTheme();
    },
  },
  created() {
    this.logoHref = this.$store.getters.getAppSettings.logoURL;
    this.$store.commit("setActiveTab", "");
    this.$store.commit("setIsClearCache", false); //Reset the value
    if (!this.isFromAdmin) {
      this.$store.commit("setLoadingText", this.$i18n.t("loadText")); //Setting loading text in store
    }
    this.$store.commit("setIsMultiProgram", true); //Set this here to get encrypted value. Setting isMultiProgram variable in a store. This is used in Toolbar to show appropriate location
    this.getUserDetails();
  },
  computed: {},
};
</script>
<style lang="scss">
.img-preview img {
  width: 180px !important;
  margin-top: 20px;
}
</style>
