<template>
  <div class="footer-buttons module-spacing mt-11px" v-if="isDataFetched">
    <b-card no-body>
      <b-tabs
        card
        lazy
        :nav-class="[isOpenTabs ? 'p-0 m-0' : 'p-0 m-0 hideTabs']"
        nav-wrapper-class="adminConfigInner main-tabsection p-0 mb-3 mt-2"
      >
        <div class="add-tabs" :class="{ rotateArrow: isOpenTabs }">
          <img
            src="@/assets/images/icons/icon-collapse.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-auto"
            @click="isOpenTabs = !isOpenTabs"
          />
        </div>
        <div class="main-border2"></div>
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab
          v-for="(tab, i) in tabs"
          :key="'dyn-tab-' + tab.id"
          class="p-0 mapping-border mt-3"
        >
          <template #title>
            <span class="main-tabs">
              <!-- <i
              class="fa fa-arrow-left mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Left"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: -1 })
              "
            ></i> -->

              <img
                src="@/assets/images/icons/admin-leftarrow.svg"
                :style="{ filter: filterColor }"
                class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                v-b-tooltip.hover
                :title="$t('moveLeft')"
                @click.prevent.stop="
                  moveItem({ type: 'tab', tInd: i, places: -1 })
                "
              />
              <!-- <i
              class="fa fa-arrow-right mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Right"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: 1 })
              "
            ></i> -->

              <img
                src="@/assets/images/icons/right-adminarrow.svg"
                :style="{ filter: filterColor }"
                class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                v-b-tooltip.hover
                :title="$t('moveRight')"
                @click.prevent.stop="
                  moveItem({ type: 'tab', tInd: i, places: 1 })
                "
              />

              <!-- <i
              class="fa fa-edit mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('edit')"
              @click="
                updateTab({
                  type: 'type11',
                  tabName: tab.tabName[$i18n.locale],
                  tInd: i,
                })
              "
            ></i> -->
              <img
                src="@/assets/images/icons/edit-adminicon.svg"
                :style="{ filter: filterColor }"
                class="mr-2 cursor-pointer f-s-0-875rem w-14"
                v-b-tooltip.hover
                :title="$t('edit')"
                @click="
                  updateTab({
                    type: 'type11',
                    tabName: tab.tabName[$i18n.locale],
                    tInd: i,
                  })
                "
              />
              <span class="mr-1 translate-icon">
                <Translations :transText.sync="tab.tabName" />
              </span>
              <!--<i
              class="fa fa-trash mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('deletebtn')"
              @click="deleteElement({ type: 'tab', dInd: i })"
            ></i> -->
              <img
                src="@/assets/images/icons/admindelete-icon.svg"
                :style="{ filter: filterColor }"
                class="mr-2 cursor-pointer f-s-0-875rem w-auto mx-1"
                v-b-tooltip.hover
                :title="$t('deletebtn')"
                @click="deleteElement({ type: 'tab', dInd: i })"
              />
            </span>
            <span class=""> {{ tab.tabName[$i18n.locale] }} </span>
          </template>

          <div
            class="accordion"
            role="tablist"
            :key="'collapse-indicator' + tab.id"
          >
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-map1 variant="info">{{
                  $t("globalMapping")
                }}</b-button>
              </b-card-header>
              <b-collapse
                id="accordion-map1"
                visible
                accordion="my-mapaccordion"
                role="tabpanel"
                class="accordion-delete"
              >
                <b-card-body class="mb-lg-n3">
                  <b-card-text>
                    <Mappings
                      :tInd="i"
                      :moveItem="moveItem"
                      :mappings="tab.mapping"
                      :addElement="addElement"
                      :matrixList="matrixList"
                      v-bind.sync="tab.mapping"
                      :dataSetsList="dataSetsList"
                      :isDataFetched="isDataFetched"
                      :deleteElement="deleteElement"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :key="'add-subIndicator' + tab.id + i"
                    />
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="text-right p-3">
            <b-button
              class="black-btn save-btn"
              @click.prevent="updateConfigData"
              >{{ $t("savebtn") }}</b-button
            >
          </div>
        </b-tab>

        <!-- New Tab Button (Using tabs-start slot) -->
        <template #tabs-start>
          <b-nav-item
            role="presentation"
            @click.prevent="updateTab({ type: 'type1' })"
            href="#"
            class="text-center add-adminbtn me-15"
            v-b-tooltip.hover
            :title="$t('addbtn')"
            ><b>+</b><span class="mx-1"> {{ $t("addbtn") }}</span></b-nav-item
          >
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            {{ $t("noOpenTabs") }}<br />
            {{ $t("openTab") }} <b>+</b> {{ $t("btn") }}
          </div>
        </template>
      </b-tabs>
    </b-card>
    <b-modal
      v-model="tabNameModal"
      :title="$t('tabName')"
      @ok="handleOk"
      :ok-title="$t('ok')"
      :cancel-title="$t('cancelbtn')"
      @hidden="resetModal('tab')"
      no-close-on-backdrop
      centered
    >
      <div>
        <b-row>
          <b-col sm="4">
            <label for="type-tabName">{{ $t("name") }}</label>
          </b-col>
          <b-col sm="8">
            <b-form-input
              id="type-tabName"
              type="text"
              v-model="updatedTabName"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>
<script>
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import { getColor, randomString } from "@/components/Common/commonFunctions";
const c = getColor();
const indicatorConfig = {
  indicator: {
    id: null,
    name: {},
    disable: false,
    static_name: "",
    subIndicator: [],
    color: c,
  },
};
const subIndicatorConfig = {
  id: null,
  name: {},
  selectedDE: [],
  static_name: "",
  color: c,
  type: "indicator",
};

export default {
  props: [
    "module",
    "type",
    "subType",
    "matrixList",
    "dataSetsList",
    "indicatorsList",
    "dataElementsList",
  ],
  mixins: [DynamicImageMixin, ReFetchConfigMixin],
  components: {
    Mappings: () =>
      import(/* webpackChunkName: "admin_Mappings"*/ "./Mappings"),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      tabs: [],
      updateType: null,
      isOpenTabs: false,
      updateIndex: null,
      updatedTabName: "",
      tabNameModal: false,
      isDataFetched: false,
      originalTabs: null,
    };
  },
  computed: {},
  methods: {
    updateTab({ type, tabName = "", tInd = null }) {
      let n = tabName;
      this.updateIndex = tInd;
      this.updateType = type;
      this.updatedTabName = n;
      this.$nextTick(() => {
        this.tabNameModal = true;
      });
    },
    resetModal(type) {
      if (type === "tab") {
        this.updateIndex = "";
        this.updateType = null;
        this.updatedTabName = "";
      }
    },
    handleOk() {
      if (this.updatedTabName.length === 0) {
        this.sweetAlert({
          title: this.$i18n.t("enterName"),
        });
        return;
      }
      if (this.updateType === "type1") {
        this.tabs.push({
          tabName: { [this.$i18n.locale]: this.updatedTabName },
          id: randomString(16),
          mapping: [],
        });
      }
      if (this.updateType === "type11") {
        this.tabs[this.updateIndex].tabName[this.$i18n.locale] =
          this.updatedTabName;
      }
    },
    //To move element up/down
    moveItem({ type, places, tInd, mInd, siInd }) {
      let target = null,
        updateInd = null;
      if (type === "tab") {
        target = this.tabs;
        updateInd = tInd;
      }
      if (type === "subMethod") {
        target = this.tabs[tInd].mapping[mInd].indicator.subIndicator;
        updateInd = siInd;
      }

      if (
        (updateInd === 0 && places === -1) ||
        (updateInd === target.length - 1 && places === 1)
      ) {
        this.sweetAlert({
          title: this.$i18n.t("CantMove"),
        });
      } else {
        let oTemp = target[updateInd];
        let nTemp = target[updateInd * 1 + places];
        this.$set(target, updateInd * 1 + places, oTemp);
        this.$set(target, updateInd, nTemp);
      }
    },
    //To delete mapping
    deleteElement({ type, tInd, mInd, dInd }) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          if (type === "tab") {
            this.tabs.splice(dInd, 1);
          }
          if (type === "method") {
            this.tabs[tInd].mapping.splice(dInd, 1);
          }
          if (type === "subMethod") {
            this.tabs[tInd].mapping[mInd].indicator.subIndicator.splice(
              dInd,
              1
            );
          }
        }
      });
    },
    //To add new mapping
    addElement({ type, tInd, mInd }) {
      let randomStr = randomString(16);
      if (type === "method") {
        let config = JSON.parse(JSON.stringify(indicatorConfig));
        this.tabs[tInd].mapping.push({
          indicator: {
            ...config.indicator,
            id: randomStr,
            static_name: randomStr,
            name: { [this.$i18n.locale]: this.$i18n.t("default") },
          },
        });
      }
      if (type === "subMethod") {
        let config = JSON.parse(JSON.stringify(subIndicatorConfig));
        config = {
          ...config,
          id: randomStr,
          static_name: randomStr,
          name: { [this.$i18n.locale]: this.$i18n.t("default") },
        };
        if (
          this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
        ) {
          config.cyp = 1;
        }
        this.tabs[tInd].mapping[mInd].indicator.subIndicator.push(config);
      }
    },
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig({ tableKey: key });
      response
        .then((response) => {
          if (response.data[this.type]) {
            this.tabs = response.data[this.type][this.subType];
            this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
          }
          this.$store.commit("setLoading", false);
          this.isDataFetched = true;
        })
        .catch((res) => {
          console.log("Config not found...", res);
          this.$store.commit("setLoading", false);
          this.isDataFetched = true;
          this.reFetchConfig();
        });
    },
    updateConfigData() {
      this.$store.commit("setLoading", true);
      let tabs = this.tabs;

      let key = this.generateKey(this.module);

      let allKeys = service.getAllKeys({});
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig({ tableKey: key });
          saveConfig.then((res) => {
            let configData = res.data;
            if (!configData[this.type]) {
              configData[this.type] = {};
            }
            configData[this.type][this.subType] = tabs;
            let configChanges = {};
            // let configChanges = audit.configAudit(
            //   this.originalTabs,
            //   configData[this.type][this.subType]
            // );
            let response = service.updateConfig({
              data: configData,
              tableKey: key,
            });
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                  this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
                  this.$store.commit("setLoading", false);
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.commit("setLoading", false);
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: error,
                });

                this.$store.commit("setLoading", false);
                return;
              });
          });
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: tabs,
            },
          };
          let response = service.saveConfig({
            data: configData,
            tableKey: key,
          });
          response.then((response) => {
            if (response.data.status === "OK") {
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.$store.commit("setGlobalFactors", {
                payload: configData,
              });
              this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
              this.$store.commit("setLoading", false);
            } else {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.commit("setLoading", false);
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.getConfigData();
  },
};
</script>
<style>
.add-tabs.rotateArrow {
  transform: rotate(180deg);
}
</style>