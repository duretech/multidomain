<template>
  <div class="header-body">
    <b-row class="py-2 mx-0">
      <b-col lg="5" md="8" class="summary-logoimg pl-0">
        <img
          :src="require('@/assets/images/icons/arrow-home.svg')"
          class="homelogo-img mx-3"
          v-if="headerConditions.home"
          @click="goToHome"
          :style="{ filter: filterColor }"
        />
        <b-button
          v-b-toggle.sidebar-2
          v-if="headerConditions.profile"
          class="toggle-menu"
        >
          <i class="fa fa-bars" aria-hidden="true"></i>
        </b-button>
        <div v-if="headerConditions.dashboardLogo">
          <img class="logo-of-dashboard mx-2" :src="dashboardLogo" />
        </div>
        <h6
          v-if="headerConditions.pageTitle"
          class="fs-22-1920 title-header pl-4 pt-2px mt-1 text-center"
        >
          {{ pageHeader ? pageHeader : pageTitle }}
        </h6>
      </b-col>
      <!-- This section is used for mobile devices -->
      <b-col class="profile pr-0">
        <template>
          <!-- <FontSize class="mx-2" /> -->
        </template>
        <template>
          <LanguageChange @langChange="langChange" class="langChange" />
        </template>
        <template>
          <b-dropdown
            size="lg"
            class="mx-2 setHeader"
            no-caret
            menu-class="p-0"
          >
            <template #button-content>
              <!-- <span class="fa fa-cog setting-icon logo-img-header"></span> -->
              <span>
                <img
                  v-bind:src="require('@/assets/images/icons/setting-icon.svg')"
                  class="logo-img-header"
                  :style="{ filter: filterColor }"
                />
              </span>
            </template>
            <b-dropdown-text class="text-center font-14">
              <b-avatar variant="primary"></b-avatar>
              <div class="text-capitalize pt-1">
                {{ userName }}
              </div>
              <div>
                {{ $store.getters.getAppVersion }}
              </div>
            </b-dropdown-text>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button class="mx-3 font-14" @click="activateTour">
              <img
                src="@/assets/images/icons/tool-tip-tour-over.svg"
                class="setImg"
                :style="{ filter: filterColor }"
              />
              {{ $t("tourGuide") }}
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14">
              <img
                src="@/assets/images/icons/train-icon.svg"
                class="setImg mr-2"
                :style="{ filter: filterColor }"
              />
              {{ $t("trainings") }}
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14" @click="clearCache">
              <img
                src="@/assets/images/icons/Icon material-refresh (1).svg"
                class="setImgclear mr-1 pr-1 w-20px"
                :style="{ filter: filterColor }"
              />
              {{ $t("clearCache") }}
            </b-dropdown-item-button>
            <b-dropdown-item-button
              class="mx-3 font-14"
              @click="
                showModal = true;
                userShow = true;
              "
              v-if="$store.getters.getIsMultiProgram"
            >
              <img
                src="@/assets/images/icons/Icon material-update.svg"
                class="setImgclear mr-2 pr-1 w-17px"
                :style="{ filter: filterColor }"
              />
              <span class="mx-1">{{ $t("Updates") }}</span>
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14">
              <template>
                <b-button
                  v-if="
                    $route.name !== 'InteractiveDashboard' &&
                    $route.name !== 'admin' &&
                    isInteractiveModules
                  "
                  size="sm"
                  class="btn-bg-transparent mx-2 px-0"
                  @click="
                    goTo({
                      setNamespace: true,
                      routeName: 'InteractiveDashboard',
                    })
                  "
                  >{{ $t("interactive_dashboard") }}</b-button
                >
              </template>
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14">
              <template>
                <b-button
                  v-if="
                    $route.name !== 'SavedFavorites' &&
                    $route.name !== 'admin' &&
                    isInteractiveModules
                  "
                  size="sm"
                  class="btn-bg-transparent mx-2 px-0"
                  @click="
                    goTo({
                      setNamespace: true,
                      routeName: 'SavedFavorites',
                    })
                  "
                  >{{ $t("saved") }}</b-button
                >
              </template>
            </b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button class="mx-3 font-14 text-center">
              <span class="mx-1">{{ $t("theme") }}</span>
              <div class="admin-component mt-2">
                <b-form-group class="mb-0" v-slot="{ ariaDescribedby }">
                  <b-form-radio-group
                    id="local-theme"
                    v-model="currentTheme"
                    :aria-describedby="ariaDescribedby"
                    name="local-theme"
                  >
                    <b-form-radio
                      :value="t.value"
                      v-for="t in themes"
                      :key="'theme-' + t.value"
                      ><div
                        class="config-icon-container config-newcontainer"
                        style="width: 40px !important; height: 40px !important"
                      >
                        <div class="colorBox" :class="t.color"></div></div
                    ></b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
              </div>
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14" v-if="!isHeader">
              <template>
                <b-button
                  size="sm"
                  class="bg-transparent border-0 mx-2 mr-4 p-0"
                  @click="backToDHIS"
                  >{{ $t("DHIS2") }}</b-button
                >
              </template>
            </b-dropdown-item-button>
          </b-dropdown>
        </template>
      </b-col>
      <!-- This section is used for desktop devices -->
      <b-col lg="7" class="pr-0">
        <div class="explore-col mt-1 pt-1 mb-md-n2">
          <template>
            <slot name="report"></slot>
          </template>
          <template>
            <slot name="pageOptions"></slot>
          </template>

          <template>
            <b-button
              v-if="
                $route.name !== 'InteractiveDashboard' &&
                $route.name !== 'admin' &&
                isInteractiveModules
              "
              size="sm"
              class="btn-bg-transparent mx-2 px-0 bg-head"
              @click="
                goTo({
                  setNamespace: true,
                  routeName: 'InteractiveDashboard',
                })
              "
              >{{ $t("interactive_dashboard") }}</b-button
            >
          </template>
          <template>
            <b-button
              v-if="
                $route.name !== 'SavedFavorites' &&
                $route.name !== 'admin' &&
                isInteractiveModules
              "
              size="sm"
              class="btn-bg-transparent mx-2 px-0 bg-fav"
              @click="
                goTo({
                  setNamespace: true,
                  routeName: 'SavedFavorites',
                })
              "
              >{{ $t("saved") }}</b-button
            >
          </template>
          <!-- <template>
            <b-button
             
              size="md"
              class="btn-bg-transparent mx-2 px-0 bg-head"
              
              >
              <i class="fa fa-edit cursor-pointer home-editicon"></i>
              <span class="modify-btn mx-1"> Modify Content </span>  
              
              </b-button
            >
          </template> -->
          <template>
            <slot name="dashboardType"></slot>
          </template>
          <template v-if="$route.name !== 'admin'">
            <AdminPopup />
          </template>
          <template v-if="!isHeader">
            <b-button
              size="sm"
              class="bg-transparent border-0 mx-2 mr-4 p-0 bg-fav greydhisheader"
              @click="backToDHIS"
              >{{ $t("DHIS2") }}</b-button
            >
          </template>
          <template>
            <FontSize class="mx-2" />
          </template>
          <template v-if="languageSupport">
            <LanguageChange @langChange="langChange" class="langChangeBtn" />
          </template>
          <template>
            <b-dropdown
              size="lg"
              class="mx-2 mr-3 mt-1"
              no-caret
              menu-class="p-0"
            >
              <template #button-content>
                <!-- <span class="fa fa-cog setting-icon logo-img-header"></span> -->
                <span>
                  <img
                    v-bind:src="
                      require('@/assets/images/icons/setting-icon.svg')
                    "
                    class="logo-img-header mb-1"
                    :style="{ filter: filterColor }"
                  />
                </span>
              </template>
              <b-dropdown-text class="text-center font-14 mt-2">
                <b-avatar variant="primary"></b-avatar>
                <div class="text-capitalize pt-1">
                  {{ userName }}
                </div>
                <div>
                  {{ $store.getters.getAppVersion }}
                </div>
              </b-dropdown-text>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button
                class="mx-3 font-14"
                @click="activateTour"
              >
                <img
                  src="@/assets/images/icons/tool-tip-tour-over.svg"
                  class="setImg"
                  :style="{ filter: filterColor }"
                />
                <span>{{ $t("tourGuide") }}</span>
              </b-dropdown-item-button>
              <b-dropdown-item-button class="mx-3 font-14">
                <img
                  src="@/assets/images/icons/train-icon.svg"
                  class="setImg mr-2"
                  :style="{ filter: filterColor }"
                />
                <span> {{ $t("trainings") }}</span>
              </b-dropdown-item-button>
              <b-dropdown-item-button class="mx-3 font-14" @click="clearCache">
                <img
                  src="@/assets/images/icons/Icon material-refresh (1).svg"
                  class="setImgclear mr-1 pr-1 w-20px"
                  :style="{ filter: filterColor }"
                />
                <span class="mx-1">{{ $t("clearCache") }}</span>
              </b-dropdown-item-button>
              <b-dropdown-item-button
                class="mx-3 font-14"
                @click="
                  showModal = true;
                  userShow = true;
                "
                v-if="$store.getters.getIsMultiProgram"
              >
                <img
                  src="@/assets/images/icons/Icon material-update.svg"
                  class="setImgclear mr-2 pr-1 w-17px"
                  :style="{ filter: filterColor }"
                />
                <span class="mx-1">{{ $t("Updates") }}</span>
              </b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button class="mx-3 font-14 text-center">
                <span class="mx-1">{{ $t("theme") }}</span>
                <div class="admin-component mt-2">
                  <b-form-group class="mb-0" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                      id="local-theme"
                      v-model="currentTheme"
                      :aria-describedby="ariaDescribedby"
                      name="local-theme"
                    >
                      <b-form-radio
                        :value="t.value"
                        v-for="t in themes"
                        :key="'theme-' + t.value"
                        ><div
                          class="config-icon-container config-newcontainer"
                          style="
                            width: 40px !important;
                            height: 40px !important;
                          "
                        >
                          <div class="colorBox" :class="t.color"></div></div
                      ></b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </div>
              </b-dropdown-item-button>
            </b-dropdown>
          </template>
        </div>
      </b-col>
    </b-row>
    <template v-if="(displayPage && !isDisableFlash) || userShow">
      <FlashScreen
        :showModal="showModal"
        @hideModal="hideModal"
        @getFlashData="getFlashData"
        :allFlashData="allFlashData"
        :isDisableFlash="isDisableFlash"
      />
    </template>
  </div>
</template>
<script>
import FontSize from "@/components/Common/FontSize";
import NavigationMixin from "@/helpers/NavigationMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";

export default {
  props: ["displayPage", "headerConditions", "pageHeader"],
  mixins: [NavigationMixin, DynamicImageMixin, LanguageChangeMixin],
  data() {
    return {
      userShow: false,
      showModal: true,
      allFlashData: [],
    };
  },
  components: {
    FontSize,
    FlashScreen: () =>
      import(
        /*webpackChunkName: 'FlashScreen'*/ "@/components/Common/FlashScreen"
      ),
    LanguageChange: () =>
      import(
        /*webpackChunkName: 'LanguageChange'*/ "@/components/Common/LanguageChange"
      ),
    AdminPopup: () =>
      import(
        /*webpackChunkName: 'AdminPopup'*/ "@/components/Common/AdminPopup"
      ),
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
    isDisableFlash() {
      return this.$store.getters.getAppSettings.disableFlash.includes(
        this.$store.getters.getLoggedInUserId
      );
    },
    currentTheme: {
      get: function () {
        return this.$store.state.defaultColorTheme;
      },
      set: function (newValue) {
        this.$store.commit("setTheme", newValue);
      },
    },
    languageSupport() {
      return this.$store.getters.getAppSettings.languageSupport;
    },
    isHeader() {
      return this.$store.getters.getAppSettings.isAppHub;
    },
    isInteractiveModules() {
      return this.$store.getters.getIsAdmin
        ? true
        : this.$store.getters.getUserPermissions?.modules?.includes(
            `interactive-default`
          ) || false;
    },
    userName() {
      return this.$store.getters.getUserDetails
        ? `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`
        : "";
    },
    dashboardLogo() {
      let logo = null;
      if (this.$route.name === "dashboard") {
        if (this.$store.getters.getNamespace.includes("_fp-")) {
          logo = require("@/assets/images/mh_homelogo.png");
        }
        if (this.$store.getters.getNamespace.includes("_mnch-")) {
          logo = require("@/assets/images/fp_homelogo.png");
        }
      } else if (this.$route.name === "SummaryDashboard") {
        logo = require("@/assets/images/summary.png");
      } else if (this.$route.name === "map") {
        logo = require("@/assets/images/map-dash.png");
      } else if (this.$route.name == "AnalyticalDashboard") {
        logo = require("@/assets/images/analytical-dash.png");
      } else if (this.$route.name == "SavedFavorites") {
        logo = require("@/assets/images/savefavorites-dashb.png");
      } else if (this.$route.name == "integrated-dashboard") {
        logo = require("@/assets/images/logo.png");
      } else if (this.$route.name == "DQRDashboard") {
        logo = require("@/assets/images/data-quilty-dash.png");
      } else if (this.$route.name == "InteractiveDashboard") {
        logo = require("@/assets/images/intractive-dash.png");
      } else if (this.$route.name == "report") {
        logo = require("@/assets/images/logo.png");
      }
      return logo;
    },
    pageTitle() {
      let title = null;

      if (this.$route.name === "SummaryDashboard") {
        title = this.$i18n.t("summary_dashboard");
      } else if (this.$route.name === "AnalyticalDashboard") {
        title = this.$i18n.t("analytical_dashboard");
      } else if (this.$route.name === "integrated-dashboard") {
        title = this.$i18n.t("integratedDashboard");
      } else if (this.$route.name === "InteractiveDashboard") {
        title = this.$i18n.t("interactive_dashboard");
      } else if (this.$route.name === "DQRDashboard") {
        title = this.$i18n.t("DQR");
      } else if (this.$route.name === "SavedFavorites") {
        title = this.$i18n.t("saved");
      } else if (this.$route.name === "dashboard") {
        if (this.$store.getters.getNamespace.includes("_fp-")) {
          title = this.$i18n.t("family_planning");
        }
        if (this.$store.getters.getNamespace.includes("_mnch-")) {
          title = this.$i18n.t("maternalHealth");
        }
      } else if (this.$route.name === "map") {
        title = this.$i18n.t("mapVisualization");
      } else if (this.$route.name === "admin") {
        title = this.$i18n.t("adminTitle");
      } else if (this.$route.name === "report") {
        title = this.$i18n.t("reportTitle");
      }

      return title;
    },
  },
  methods: {
    getFlashData(data) {
      this.allFlashData = data;
    },
    hideModal() {
      this.userShow = false;
      this.showModal = false;
    },
    backToDHIS() {
      window.location.href = `${this.$store.state.baseURL}/`;
    },
    activateTour() {
      this.$emit("activateTour");
    },
    clearCache() {
      this.$store.commit("setStoreValues");
      this.$store.commit("setIsClearCache", true);
      if (this.$route.name === "Dashboard") {
        this.$emit("reload");
      } else {
        this.$router.push("/");
      }
    },
    goToHome() {
      if (
        this.$store.getters.getNamespace ===
        `${this.$store.getters.getAppSettings.tableName}`
      ) {
        this.$router.push("/");
        return;
      }

      let key = "";
      if (
        this.$store.getters.getNamespace.includes("_mnch-") ||
        this.$store.getters.getNamespace.includes("_fp-")
      ) {
        key = "dashboard";
      }

      if (key) {
        if (this.$route.name !== key && this.$route.name !== "admin") {
          this.$router.push(`/${key}`);
        } else {
          this.$router.push("/");
        }
      } else {
        this.$router.push("/");
      }
    },
  },
  created() {},
};
</script>
<style lang="scss">
.b-dropdown-text {
  padding: 0.25rem 0 !important;
}
</style>
