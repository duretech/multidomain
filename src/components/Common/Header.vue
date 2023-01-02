<template>
  <div class="header-body">
    <b-row class="py-2 mx-0">
      <b-col lg="5" md="8" class="summary-logoimg pl-0">
        <img
          :src="require('@/assets/images/Icon ionic-md-home.png')"
          class="homelogo-img mx-3"
          v-if="headerConditions.home"
          @click="goToHome"
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
      <b-col md="4" class="profile pr-0">
        <template>
          <FontSize class="mx-2" />
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
              <span class="fa fa-cog setting-icon logo-img-header"></span>
            </template>
            <b-dropdown-text
              class="text-center color-white font-14"
              style="width: 200px"
            >
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
                src="@/assets/images/icons/tool-tip-tour-over.png"
                class="mr-3"
              />
              Tour Guide
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14">
              <img
                src="@/assets/images/icons/Icon metro-youtube-play (1).svg"
                class="mr-3"
              />
              Trainings Trainings
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14" @click="clearCache">
              <img
                src="@/assets/images/Icon material-refresh (1).svg"
                class="mr-3"
              />

              Clear Cache
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
                  >Interactive Analytics</b-button
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
                  >Save Favorites</b-button
                >
              </template>
            </b-dropdown-item-button>
            <b-dropdown-item-button class="mx-3 font-14">
              <template>
                <b-button
                  size="sm"
                  class="bg-transparent border-0 mx-2 mr-4 p-0"
                  @click="backToDHIS"
                  >DHIS 2</b-button
                >
              </template>
            </b-dropdown-item-button>
          </b-dropdown>
        </template>
      </b-col>
      <!-- This section is used for desktop devices -->
      <b-col lg="7" class="pr-0">
        <div class="explore-col mt-1">
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
              class="btn-bg-transparent mx-2 px-0"
              @click="
                goTo({
                  setNamespace: true,
                  routeName: 'InteractiveDashboard',
                })
              "
              >Interactive Analytics</b-button
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
              class="btn-bg-transparent mx-2 px-0"
              @click="
                goTo({
                  setNamespace: true,
                  routeName: 'SavedFavorites',
                })
              "
              >Save Favorites</b-button
            >
          </template>
          <template>
            <slot name="dashboardType"></slot>
          </template>
          <template v-if="$route.name !== 'admin'">
            <AdminPopup />
          </template>
          <template>
            <b-button
              size="sm"
              class="bg-transparent border-0 mx-2 mr-4 p-0"
              @click="backToDHIS"
              >DHIS 2</b-button
            >
          </template>
          <template>
            <FontSize class="mx-2" />
          </template>
          <template>
            <LanguageChange
              @langChange="langChange"
              className="langChangeBtn"
            />
          </template>
          <template>
            <b-dropdown size="lg" class="mx-2 mr-3" no-caret menu-class="p-0">
              <template #button-content>
                <span class="fa fa-cog setting-icon logo-img-header"></span>
              </template>
              <b-dropdown-text
                class="text-center color-white font-14"
                style="width: 200px"
              >
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
                  src="@/assets/images/icons/tool-tip-tour-over.png"
                  class="setImg mr-3"
                />
                Tour Guide
              </b-dropdown-item-button>
              <b-dropdown-item-button class="mx-3 font-14">
                <img
                  src="@/assets/images/icons/Icon metro-youtube-play (1).svg"
                  class="setImg"
                />
                Trainings
              </b-dropdown-item-button>
              <b-dropdown-item-button class="mx-3 font-14" @click="clearCache">
                <img
                  src="@/assets/images/Icon material-refresh (1).svg"
                  class="setImgclear mr-3 pr-1"
                />

                Clear Cache
              </b-dropdown-item-button>
            </b-dropdown>
          </template>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
/*global settings*/
import FontSize from "@/components/Common/FontSize";
import NavigationMixin from "@/helpers/NavigationMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";

export default {
  props: ["headerConditions", "pageHeader"],
  mixins: [NavigationMixin, LanguageChangeMixin],
  data() {
    return {};
  },
  components: {
    FontSize,
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
      if (this.$route.name === "mnch-dashboard") {
        logo = require("@/assets/images/mh_homelogo.png");
      } else if (this.$route.name === "fp-dashboard") {
        logo = require("@/assets/images/fp_homelogo.png");
      } else if (this.$route.name === "SummaryDashboard") {
        logo = require("@/assets/images/summary.png");
      } else if (this.$route.name === "summary-dashboard") {
        logo = require("@/assets/images/summary.png");
      } else if (this.$route.name === "analytical-dashboard") {
        logo = require("@/assets/images/analytical-dash.png");
      } else if (this.$route.name === "new-analytical-dashboard") {
        logo = require("@/assets/images/analytical-dash.png");
      } else if (this.$route.name === "dqr-dashboard") {
        logo = require("@/assets/images/data-quilty-dash.png");
      } else if (this.$route.name === "map") {
        logo = require("@/assets/images/map-dash.png");
      } else if (this.$route.name === "interactive-dashboard") {
        logo = require("@/assets/images/intractive-dash.png");
      } else if (this.$route.name === "saved-favorites") {
        logo = require("@/assets/images/savefavorites-dashb.png");
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
      } else if (this.$route.name == "SavedFavorites") {
        logo = require("@/assets/images/logo.png");
      }
      // console.log("logo", logo);
      return logo;
    },
    pageTitle() {
      let title = null;
      if (
        this.$route.name === "SummaryDashboard" ||
        this.$route.name === "summary-dashboard"
      ) {
        title = this.$i18n.t("summary_dashboard");
      } else if (
        this.$route.name === "AnalyticalDashboard" ||
        this.$route.name === "analytical-dashboard" ||
        this.$route.name === "new-analytical-dashboard"
      ) {
        title = this.$i18n.t("analytical_dashboard");
      } else if (this.$route.name === "integrated-dashboard") {
        title = "Integrated Family Planning and Maternal Health Dashboard";
      } else if (
        this.$route.name === "InteractiveDashboard" ||
        this.$route.name === "interactive-dashboard"
      ) {
        title = this.$i18n.t("interactive_dashboard");
      } else if (
        this.$route.name === "DQRDashboard" ||
        this.$route.name === "dqr-dashboard"
      ) {
        title = this.$i18n.t("DQR");
      } else if (
        this.$route.name === "SavedFavorites" ||
        this.$route.name === "saved-favorites"
      ) {
        title = this.$i18n.t("saved");
      } else if (this.$route.name === "fp-dashboard") {
        title = this.$i18n.t("family_planning");
      } else if (this.$route.name === "mnch-dashboard") {
        title = this.$i18n.t("maternal_newborn_and_child_health");
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
    backToDHIS() {
      if (process.env.NODE_ENV !== "production") {
        // window.location.href = `${settings.baseURL}/`;
      } else {
        window.location.href = `${this.$store.state.baseURL}/`;
      }
    },
    activateTour() {
      this.$emit("activateTour");
    },
    clearCache() {
      this.$store.commit("setIsClearCache", true);
      this.$store.commit("setStoreValues");
      if (this.$route.name === "Dashboard") {
        this.$emit("reload");
      } else {
        this.$router.push("/");
      }
    },
    goToHome() {
      // this.$router.push("/");
      // console.log("window.history", window.history);

      // window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
      // console.log(this.$store.getters.getNamespace);
      if (this.$store.getters.getNamespace === `${settings.tableName}`) {
        this.$router.push("/");
      }

      let key = "";
      if (this.$store.getters.getNamespace.includes("_mnch-")) {
        key = "mnch-dashboard";
      }
      if (this.$store.getters.getNamespace.includes("_fp-")) {
        key = "fp-dashboard";
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
