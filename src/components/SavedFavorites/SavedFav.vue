<template>
  <div>
    <div class=""></div>
    <div class="saved-fav pl-4">
      <div>
        <dynamicModule
          :bookmarks="bookmarks"
          :savedModules="savedModules"
          @updateModules="updateModules"
          :savedModulesVisible="savedModulesVisible"
          ref="dynamicModule"
        />
      </div>
      <div class="fav-page" :class="{ 'favPage-theme': savedModulesVisible }">
        <b-row
          class="saved-fav-heading mr-4 pt-3"
          :class="{ 'mt-5': !savedModulesVisible }"
        >
          <b-col sm="4" lg="7" class="mt-3 px-0">
            <span class="saved-fav-heading-text fa-19-1920">{{
              $t("saved_visualisation")
            }}</span>
          </b-col>
          <b-col sm="4" lg="3" class="mt-3 px-0 saved-fav-search-container">
            <b-input-group class="mb-2">
              <b-input-group-prepend is-text class="mx-1">
                <b-form-checkbox
                  class="mr-n2"
                  v-model="myFavorites"
                  name="check-button"
                  switch
                  v-b-tooltip
                  :title="$t('myFavorites')"
                >
                </b-form-checkbox>
              </b-input-group-prepend>
              <b-input-group-prepend is-text class="ml-1 mr-0">
                <i class="fa fa-search" aria-hidden="true"></i>
              </b-input-group-prepend>
              <b-form-input
                aria-label="Text input with checkbox"
                id="email"
                type="email"
                class="email h-auto"
                :placeholder="$t('search')"
                v-model="searchName"
              ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col
            sm="4"
            lg="2"
            class="mt-3 px-0 d-flex saved-fav-show-container"
          >
            <div class="saved-fav-show-text fs-17-1920">{{ $t("show") }}</div>
            <div>
              <b-form-select
                v-model="perPage"
                :options="options"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>

        <b-skeleton-wrapper :loading="isLoading">
          <template #loading>
            <b-row>
              <b-col sm="4" v-for="i in 6" :key="'SampleChart' + i">
                <Placeholder :isFavorites="true" />
              </b-col>
            </b-row>
          </template>

          <div class="saved-fav-cards">
            <b-row>
              <template v-if="chartsFilteredList.length > 0">
                <b-col
                  sm="12"
                  lg="4"
                  v-for="(bookmark, i) in chartsFilteredList"
                  :key="i"
                >
                  <b-card class="saved-fav-card">
                    <template #header>
                      <h6 class="saved-fav-card-header fs-17-2920 mb-0">
                        {{ bookmark.name }}
                      </h6>
                    </template>
                    <b-card-text>
                      <b-row class="">
                        <b-col sm="2" class="size">
                          <img
                            class="card-image"
                            :src="
                              require(`@/assets/images/interactive/${bookmark.chartData.chart.oType}.png`)
                            "
                          />
                        </b-col>
                        <b-col sm="10" class="">
                          <b-row class="card-details fs-17-2920"
                            ><b>{{ $t("userName") }}:&nbsp;</b>
                            {{ bookmark.userName }}</b-row
                          >
                          <b-row class="card-details fs-17-2920">
                            <b>{{ $t("created") }}:&nbsp;</b>
                            {{ bookmark.createdAt }}
                          </b-row>
                          <b-row class="card-details fs-17-2920">
                            <b>{{ $t("lastUpdated") }}:&nbsp;</b>
                            {{ bookmark.updatedAt }}
                          </b-row>
                        </b-col>
                        <b-col
                          sm="12"
                          class="text-right mt-3"
                          v-if="
                            bookmark.isNotAdmin &&
                            bookmark.user === loggedInUser.userCredentials.id
                          "
                        >
                          <b-button
                            @click="grantRevokeAdminAccess(bookmark.id)"
                            size="sm"
                            >{{ bookmark.adminAccess ? "Revoke" : "Grant" }}
                            {{ $t("adminAccess") }}</b-button
                          >
                        </b-col>
                      </b-row>
                      <b-row class="onhover">
                        <b-col
                          class="onhover-icon fs-14-1920"
                          v-if="
                            bookmark.user === $store.getters.getLoggedInUserId
                          "
                          @click.prevent.stop="goToBookmark(bookmark)"
                        >
                          <img
                            class="onhover-img w-auto"
                            :src="
                              require('@/assets/images/icons/editActive.svg')
                            "
                            :style="{ filter: filterColor }"
                          />
                          <div>
                            {{ $t("edit") }}
                          </div>
                        </b-col>
                        <b-col
                          class="onhover-icon fs-14-1920 mt-1"
                          @click="
                            previewBookmark(
                              bookmark.name,
                              'previewBookmark-modal',
                              'bookmarks'
                            )
                          "
                          ><img
                            class="onhover-img w-auto"
                            :src="
                              require('@/assets/images/icons/previewActive.svg')
                            "
                            :style="{ filter: filterColor }"
                          />
                          <div>
                            {{ $t("View") }}
                          </div></b-col
                        >
                        <b-col
                          class="onhover-icon fs-14-1920 mt-1"
                          v-if="
                            bookmark.user === $store.getters.getLoggedInUserId
                          "
                          @click="deleteBookmark(bookmark.name)"
                          ><img
                            class="onhover-img w-auto"
                            :src="
                              require('@/assets/images/icons/deleteActive.svg')
                            "
                            :style="{ filter: filterColor }"
                          />{{ $t("deletebtn") }}</b-col
                        >
                      </b-row>
                    </b-card-text>
                  </b-card>
                </b-col>
                <b-col
                  sm="12"
                  class="paginaionWrap"
                  v-if="allChartsListLen > perPage"
                >
                  <div class="paginaionDiv">
                    <b-pagination
                      class="mb-0"
                      v-model="currentPage"
                      :total-rows="allChartsListLen"
                      :per-page="perPage"
                      align="center"
                    ></b-pagination>
                    <!-- first-text="First"
				prev-text="Prev"
				next-text="Next"
				last-text="Last" -->
                  </div>
                </b-col>
              </template>
              <b-col sm="12" class="m-t-20px text-center" v-else>
                <b-alert variant="info" show>{{ $t("noFavorites") }}</b-alert>
              </b-col>
            </b-row>
          </div>
          <b-modal
            id="previewBookmark-modal"
            hide-footer
            size="lg"
            :title="chartName"
            no-close-on-backdrop
          >
            <highcharts
              id="container"
              class="chartHeight h-100 align-items-center justify-content-center d-flex"
              :options="chartData"
            ></highcharts>
          </b-modal>
        </b-skeleton-wrapper>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import dynamicModule from "./dynamicModule";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
export default {
  components: {
    dynamicModule,
    Placeholder: () =>
      import(
        /* webpackChunkName: "Placeholder"*/ "@/components/Common/Placeholder"
      ),
  },
  mixins: [DynamicImageMixin, ReFetchConfigMixin],
  data() {
    return {
      chartData: {},
      chartName: "",
      bookmarks: [],
      bookmarksAccess: [],
      savedModules: [],
      canCreateModule: false,
      savedModulesVisible: false,
      searchName: "",
      perPage: 6,
      currentPage: 1,
      options: [
        // { value: null, text: "Please select an option", disabled: true },
        { value: "6", text: "6" },
        { value: "25", text: "25" },
        { value: "50", text: "50" },
        { value: "100", text: "100" },
      ],
      myFavorites: true,
      isLoading: true,
    };
  },
  watch: {
    "$store.state.activeTab": function (newValue) {
      if (newValue === "create-new-module") {
        this.$refs.dynamicModule.openCreateModal();
      }
      if (newValue === "view-module") {
        this.savedModulesVisible = !this.savedModulesVisible;
      }
    },
    searchName(newValue) {
      this.currentPage = 1;
    },
    perPage(newValue) {
      this.currentPage = 1;
    },
    myFavorites(newValue) {
      this.currentPage = 1;
    },
  },
  computed: {
    chartsList() {
      let userName = `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`;
      let filteredCharts = this.myFavorites
        ? this.bookmarks.filter((a) => a.userName === userName)
        : this.bookmarks;

      filteredCharts = filteredCharts
        .filter((c) => c.locale === this.$i18n.locale)
        .filter(
          (a) =>
            (a.name &&
              a.name.toLowerCase().includes(this.searchName.toLowerCase())) ||
            (a.userName &&
              a.userName.toLowerCase().includes(this.searchName.toLowerCase()))
        );
      // this.allChartsListLen = filteredCharts.length;
      return filteredCharts;
    },
    chartsFilteredList() {
      return this.chartsList.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    allChartsListLen() {
      return this.chartsList.length;
    },
  },
  methods: {
    updateModules(modules) {
      this.savedModules = modules;
    },
    grantRevokeAdminAccess(id) {
      this.$store.state.loading = true;
      let key = this.generateKey("interactive");

      let saveConfig = service.getSavedConfig(key);
      saveConfig.then((resp) => {
        let index = 0;
        let b = resp.data.map((d, i) => {
          if (d.id === id) {
            index = i;
            return {
              ...d,
              adminAccess: !d.adminAccess,
            };
          } else {
            return d;
          }
        });
        service.updateConfig(b, key).then(() => {
          this.$store.state.loading = false;
          let success = this.$i18n.t("accessGranted");
          let text = this.$i18n.t("grantSuccess");
          if (!b[index].adminAccess) {
            success = this.$i18n.t("accessRevoke");
            text = this.$i18n.t("revokeSuccess");
          }
          this.sweetAlert({
            title: success,
            text: text,
          });
          this.bookmarks = b;
        });
      });
    },
    //This is to get all bookmarks stored in datastore
    getConfigData() {
      let key = this.generateKey("interactive"),
        key1 = this.generateKey("dynamicModules");

      service
        .getSavedConfig(key1)
        .then((res) => {
          let programs = [],
            modules = [];
          if (
            this.$store.getters.getIsAdmin ||
            this.$store.getters.getAppSettings.bypassUser
          ) {
            programs = this.$store.getters.getAppSettings.modulesList;
          } else {
            programs = this.$store.getters.getUserPermissions?.dashboards || [];
          }
          if (this.$store.getters.getIsMultiProgram) {
            modules = res.data;
          } else {
            programs.forEach((p) => {
              res.data.forEach((m) => {
                if (m.selectedModule.includes(`_${p}-dashboard`)) {
                  modules.push(m);
                }
              });
            });
          }
          this.savedModules = modules;
        })
        .catch(() => {
          this.savedModules = [];
        });

      service
        .getSavedConfig(key)
        .then((res) => {
          let b = JSON.parse(JSON.stringify(res.data));
          b = b.filter((d) => d.user !== this.$store.getters.getLoggedInUserId);
          // this.bookmarks = res.data.filter( (d) => d.user === user.data.userCredentials.id);
          this.bookmarks = res.data;
          // this.bookmarks = res.data.filter(d => d.user === 'o1HwG2CXWLf')
          if (
            this.$store.getters.getIsAdmin ||
            this.$store.getters.getAppSettings.bypassUser
          ) {
            this.canCreateModule = true;
            this.bookmarksAccess = b.filter((d) => d.adminAccess);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.bookmarks = [];
          this.bookmarksAccess = [];
          this.isLoading = false;
          this.reFetchConfig(err);
        });
    },
    goToBookmark(bookmark) {
      localStorage.setItem("bookmarkChart", JSON.stringify(bookmark));
      this.$nextTick(() =>
        this.$router.push({
          path: "InteractiveDashboard",
          query: { bookmarkChart: bookmark.id },
        })
      );
    },
    //This is to delete bookmark from datastore
    deleteBookmark(name) {
      let key = this.generateKey("interactive");

      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.$store.state.loading = true;
          this.bookmarks = this.bookmarks.filter((d) => d.name !== name);
          let response = service.updateConfig(this.bookmarks, key);
          response.then((response) => {
            this.showAlert(response);
          });
        }
      });
    },
    previewBookmark(name, model, bookmarks) {
      this.$store.state.loading = true;
      let b = this[bookmarks].find((d) => d.name === name);
      this.chartData = b.chartData;
      this.chartName = name;
      setTimeout(() => {
        this.$bvModal.show(model);
        this.$store.state.loading = false;
      }, 100);
    },
    //This is to show success/error alert message
    showAlert(response) {
      if (response.data.status === "OK") {
        this.sweetAlert({
          title: this.$i18n.t("deleted"),
          text: this.$i18n.t("favDeleteSuccess"),
        });
        this.$store.state.loading = false;
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });

        this.$store.state.loading = false;
        return;
      }
    },
  },
  created() {
    this.$store.commit("setActiveTab", "");
    this.getConfigData();
  },
};
</script>

<style scoped>
.fav-page.favPage-theme {
  margin-top: 0px !important;
}
</style>
