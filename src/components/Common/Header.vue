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
          <!-- langChange is function defined in mixin -->
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
              <div class="profilebox-upper">
                <div class="profilebox-upper-left">
                  <div class="text-body">{{ profileInitials }}</div>
                </div>
              </div>
              <!-- <b-avatar variant="primary"></b-avatar> -->
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
            <!-- <b-dropdown-item-button
              v-if="$store.getters.getIsAdmin"
              class="mx-3 font-14"
              @click="showUploadModal = true"
            >
              <img
                src="@/assets/images/icons/Icon material-refresh (1).svg"
                class="setImgclear mr-1 pr-1 w-20px"
                :style="{ filter: filterColor }"
              />
              <span class="mx-1">{{ $t("uploadAppSetting") }}</span>
            </b-dropdown-item-button> -->
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
            <AdminPopup
              :fromAdmin="
                $route.name !== 'SavedFavorites' &&
                $route.name !== 'admin' &&
                isInteractiveModules
              "
            />
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
          <template v-if="$store.getters?.getAppSettings?.commentVersion==='new'">
            <b-dropdown
              size="lg"
              class="commentList"
              no-caret
              menu-class="p-0 dropdown-home-comment"
            >
              <template #button-content>
                <div style="position: relative">
                  <div class="redNote" v-if="newNotification"></div>
                  <img
                    v-bind:src="require('@/assets/images/icons/bell-solid.svg')"
                    class="logo-img-header"
                    style="padding: 5px"
                    v-b-tooltip.hover
                    :style="{ filter: filterColor }"
                    @click="closeNotification()"
                  />
                </div>
              </template>
              <template v-for="(comment, i) in notificationList">
                <b-dropdown-item-button
                  :key="'comment' + i"
                  href="#"
                  class="mx-3 font-14"
                  :class="{
                    notificationBG: comment.newMessage,
                    noNotificationBG: !comment.newMessage,
                  }"
                >
                  <div>
                    <div
                      v-if="comment.newMessage"
                      style="position: static"
                      class="redNote"
                    ></div>
                    <div>
                      A new comment was added on
                      <span style="fontweight: 800">{{
                        comment.chartName
                      }}</span>
                      by
                      <span style="fontweight: 800">{{ comment.addedBy }}</span>
                    </div>
                    <!-- <div>
                    <strong>{{ comment.text }}</strong>
                  </div> -->
                    <div style="float: right; fontsize: small">
                      {{ comment.addedOn }}
                    </div>
                  </div>
                </b-dropdown-item-button>
                <b-dropdown-divider
                  :key="'divider' + comment"
                  v-if="i < $store.getters.getCommentNotification.length - 1"
                ></b-dropdown-divider>
              </template>
            </b-dropdown>
          </template>
          <template v-if="languageSupport">
            <LanguageChange @langChange="langChange" class="langChangeBtn" />
          </template>
          <template>
            <b-dropdown
              size="lg"
              class="mx-2 mr-3 mt-1"
              no-caret
              menu-class="p-0 dropdown-home"
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
                <div class="profilebox-upper">
                  <div class="profilebox-upper-left">
                    <div class="text-body">{{ profileInitials }}</div>
                  </div>
                </div>
                <!-- <b-avatar variant="primary"></b-avatar> -->
                <div class="text-capitalize pt-1">
                  {{ userName }}
                </div>
                <div>
                  {{ $store.getters.getAppVersion }}
                </div>
              </b-dropdown-text>

              <b-dropdown-divider></b-dropdown-divider>
              <span class="dropdown-menus">
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
                <b-dropdown-item-button
                  class="mx-3 font-14"
                  @click="showManuals = true"
                >
                  <img
                    src="@/assets/images/icons/train-icon.svg"
                    class="setImg mr-2"
                    :style="{ filter: filterColor }"
                  />
                  <span> {{ $t("trainings") }}</span>
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  class="mx-3 font-14"
                  @click="clearCache"
                >
                  <img
                    src="@/assets/images/icons/Icon material-refresh (1).svg"
                    class="setImgclear mr-1 pr-1 w-20px"
                    :style="{ filter: filterColor }"
                  />
                  <span class="mx-1">{{ $t("clearCache") }}</span>
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  v-if="$store.getters.getIsAdmin"
                  class="mx-3 font-14"
                  @click="showUploadModal = true"
                >
                  <img
                    src="@/assets/images/icons/upload-set.svg"
                    class="setImgclear mr-1 pr-1 w-20px"
                    :style="{ filter: filterColor }"
                  />
                  <span class="mx-1">{{ $t("uploadAppSetting") }}</span>
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
                    src="@/assets/images/icons/update-icon.svg"
                    class="setImgclear mr-2 pr-1 w-17px"
                    :style="{ filter: filterColor }"
                  />
                  <span class="mx-1">{{ $t("Updates") }}</span>
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  class="mx-3 font-14"
                  @click="showAnalytics = true"
                  v-if="
                    $store.getters.getAppSettings.isAnalytics &&
                    $store.getters.getIsAdmin
                  "
                >
                  <img
                    src="@/assets/images/icons/uses-analytic.svg"
                    class="setImgclear mr-2 pr-1 w-17px"
                    :style="{ filter: filterColor }"
                  />
                  <span class="mx-1">{{ $t("uAnalytics") }}</span>
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  class="mx-3 font-14"
                  @click="contactUsModal = true"
                >
                  <img
                    src="@/assets/images/icons/contact-icon.svg"
                    class="setImgclear mr-2 pr-1 w-17px"
                    :style="{ filter: filterColor }"
                  />
                  <span class="mx-1">{{ $t("contactUs") }}</span>
                </b-dropdown-item-button>
              </span>
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
    <template v-if="contactUsModal">
      <b-modal
        v-model="contactUsModal"
        size="m"
        class="modal-fullscreen1 home-popup"
        hide-footer
        centered
        :title="$t('contactUs')"
        no-close-on-backdrop
      >
        <div class="" id="modal-newcontact">
          <div class="form-group row">
            <div
              class="my-3"
              :class="{ 'text-center': contactDetails.length === 0 }"
            >
              <template v-if="contactDetails.length">
                <!-- <ul> -->
                <div
                  class="pl-md-4"
                  v-for="(m, i) in contactDetails"
                  :key="'contactDetails' + i"
                >
                  {{ m }}
                </div>
                <!-- </ul> -->
              </template>
              <template v-else>
                {{ $t("no_data_to_display") }}
              </template>
            </div>
          </div>
        </div>
      </b-modal>
    </template>
    <template v-if="showUploadModal">
      <UploadSetting
        :showModal="showUploadModal"
        @hideModal="showUploadModal = false"
      />
    </template>
    <b-modal
      :title="$t('trainings')"
      v-model="showManuals"
      hide-footer
      no-close-on-backdrop
    >
      <div class="my-3" :class="{ 'text-center': manuals.length === 0 }">
        <template v-if="manuals.length">
          <ul>
            <li v-for="(m, i) in manuals" :key="'manual' + i">
              <a rel="noreferrer" target="_blank" :href="m.link">{{
                m.text
              }}</a>
            </li>
          </ul>
        </template>
        <template v-else>
          {{ $t("no_data_to_display") }}
        </template>
      </div>
    </b-modal>
    <Analytics
      v-if="showAnalytics"
      :showModal="showAnalytics"
      @hideModal="showAnalytics = false"
    />
  </div>
</template>
<script>
import FontSize from "@/components/Common/FontSize";
import NavigationMixin from "@/helpers/NavigationMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import service from "@/service";

export default {
  props: ["displayPage", "headerConditions", "pageHeader"],
  mixins: [NavigationMixin, DynamicImageMixin, LanguageChangeMixin],
  data() {
    return {
      userShow: false,
      showModal: true,
      showUploadModal: false,
      contactUsModal: false,
      allFlashData: [],
      showManuals: false,
      showAnalytics: false,
      newNotification: false,
      notificationList: [],
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
    Analytics: () =>
      import(/*webpackChunkName: 'Analytics'*/ "@/components/Common/Analytics"),
    UploadSetting: () =>
      import(
        /*webpackChunkName: 'UploadSetting'*/ "@/components/Common/UploadSetting"
      ),
  },
  watch: {
    "$store.getters.getCommentNotification": function (newVal) {
      console.log("newVal", newVal);
      this.notificationList = newVal;
      newVal.forEach((ele) => {
        if (ele.newMessage == true) {
          this.newNotification = true;
        }
      });
    },
  },
  computed: {
    profileInitials() {
      let p = "",
        u = this.$store.getters.getUserDetails;
      if (u) {
        p = u.firstName[0].toUpperCase() + u.surname[0].toUpperCase();
      }
      return p;
    },
    manuals() {
      let m = [];
      if (this.$store.getters.getAppSettings?.userManuals?.length) {
        m = this.$store.getters.getAppSettings.userManuals;
      }
      return m;
    },
    contactDetails() {
      let arr = [];
      if (this.$store.getters.getAppSettings?.contactUs?.length) {
        arr = this.$store.getters.getAppSettings.contactUs;
      }
      return arr;
    },
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
        return this.$store.getters.getTheme;
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
      return this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser
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
    closeNotification() {
      this.newNotification = false;
      setTimeout(() => {
        this.notificationList.forEach((ele) => (ele.newMessage = false));
        console.log("this.notificationList", this.notificationList);
        service
          .updateConfig({
            data: this.notificationList,
            tableKey: "commentNotification",
            isDefault: true,
          })
          .then(() => {
            this.$store.commit("setCommentNotification", this.notificationList);
          });
      }, 3000);
    },
    getFlashData(data) {
      this.allFlashData = data;
    },
    hideModal() {
      this.userShow = false;
      this.showModal = false;
    },
    backToDHIS() {
      window.location.href = `${this.$store.getters.getBaseURL}/`;
    },
    activateTour() {
      this.$emit("activateTour");
    },
    uploadAppSetting() {
      console.log("uploadAppSetting");
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
  mounted() {
    try {
      service
        .getSavedConfig({ tableKey: "commentNotification", isDefault: true })
        .then((resp) => {
          // $store.getters.getCommentNotification = resp.data;
          this.$store.commit("setCommentNotification", resp.data);
        });
    } catch (error) {
      console.log("error", error);
    }
  },
};
</script>
<style lang="scss">
.b-dropdown-text {
  padding: 0.25rem 0 !important;
}
.profilebox-upper-left {
  display: inline-block;
  // margin: 15px 20px;
  vertical-align: top;
  width: 50px;
  font-size: 20px;
  padding: 10px 12px;
  height: 50px;
  background: var(--text-subfont-color);
  border-radius: 50%;
}
.commentList .dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
.redNote {
  position: absolute;
  top: -2px;
  right: 0px;
  background: red;
  padding: 0px 5px;
  z-index: 100;
  font-size: small;
  border-radius: 78px;
  height: 14px;
  width: 14px;
}
.explore-col .dropdown-menu .notificationBG .dropdown-item {
  background-color: black !important;
  // transition: background-color 0.5s;
}
.explore-col .dropdown-menu .noNotificationBG .dropdown-item {
  background-color: #a83a3a !important;
  // transition: background-color 0.5s;
}
</style>
