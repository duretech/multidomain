<template>
  <div class="footer-buttons" v-if="isDataFetched">
    <b-card no-body>
      <b-tabs
        card
        lazy
        nav-class="p-0 m-0"
        nav-wrapper-class="adminConfigInner p-0"
      >
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab v-for="(tab, i) in tabs" :key="'dyn-tab-' + tab.id" class="p-0">
          <template #title>
            <i
              class="fa fa-arrow-left mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Left"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: -1 })
              "
            ></i>
            <i
              class="fa fa-arrow-right mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Right"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: 1 })
              "
            ></i>
            <i
              class="fa fa-edit mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('edit')"
              @click="
                updateTab({
                  type: 'type11',
                  tabName: tab.tabName,
                  tInd: i,
                })
              "
            ></i>
            <i
              class="fa fa-trash mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('deletebtn')"
              @click="deleteElement({ type: 'tab', dInd: i })"
            ></i>
            {{ tab.tabName }}
          </template>
          <div class="border">
            <Mappings
              :tInd="i"
              :moveItem="moveItem"
              :mappings="tab.mapping"
              :addElement="addElement"
              :metrixList="metrixList"
              v-bind.sync="tab.mapping"
              :dataSetsList="dataSetsList"
              :isDataFetched="isDataFetched"
              :deleteElement="deleteElement"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
            />
          </div>
          <div class="text-right p-3">
            <b-button class="black-btn" @click.prevent="updateConfigData">{{
              $t("savebtn")
            }}</b-button>
          </div>
        </b-tab>

        <!-- New Tab Button (Using tabs-start slot) -->
        <template #tabs-start>
          <b-nav-item
            role="presentation"
            @click.prevent="updateTab({ type: 'type1' })"
            href="#"
            class="text-center"
            v-b-tooltip.hover
            :title="$t('addbtn')"
            ><b>+</b></b-nav-item
          >
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            There are no open tabs<br />
            Open a new tab using the <b>+</b> button.
          </div>
        </template>
      </b-tabs>
    </b-card>
    <b-modal
      v-model="tabNameModal"
      title="Tab Name"
      @ok="handleOk"
      @hidden="resetModal('tab')"
      no-close-on-backdrop
    >
      <div>
        <b-row>
          <b-col sm="4">
            <label for="type-tabName">Name</label>
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
import audit from "@/components/config/audit.js";
import { randomString } from "@/components/Common/commonFunctions";

const indicatorConfig = {
  indicator: {
    id: null,
    name: "",
    disable: false,
    static_name: "",
    subIndicator: [],
    color: "#000000",
  },
};
const subIndicatorConfig = {
  id: null,
  name: "",
  selectedDE: [],
  static_name: "",
  color: "#000000",
  type: "indicator",
};

export default {
  props: [
    "module",
    "type",
    "subType",
    "metrixList",
    "dataSetsList",
    "indicatorsList",
    "dataElementsList",
  ],
  components: {
    Mappings: () =>
      import(/* webpackChunkName: "admin_Mappings"*/ "./Mappings"),
  },
  data() {
    return {
      tabs: [],
      updateType: null,
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
      if (this.updateType === "type1") {
        this.tabs.push({
          tabName: this.updatedTabName,
          id: randomString(16),
          mapping: [],
        });
      }
      if (this.updateType === "type11") {
        this.tabs[this.updateIndex].tabName = this.updatedTabName;
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
        this.$swal({
          title: "Can't Move",
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
        confirmButtonText: this.$i18n.t("yes_delete_it"),
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
            name: this.$i18n.t("default"),
          },
        });
      }
      if (type === "subMethod") {
        let config = JSON.parse(JSON.stringify(subIndicatorConfig));
        config = {
          ...config,
          id: randomStr,
          static_name: randomStr,
          name: this.$i18n.t("default"),
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
      this.$store.state.loading = true;
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (response.data[this.type]) {
            this.tabs = response.data[this.type][this.subType];
            this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
          }
          this.$store.state.loading = false;
          this.isDataFetched = true;
        })
        .catch((res) => {
          console.log("Config not found...", res);
          this.$store.state.loading = false;
          this.isDataFetched = true;
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;
      let tabs = this.tabs;

      let key = this.generateKey(this.module);

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            if (!configData[this.type]) {
              configData[this.type] = {};
            }
            configData[this.type][this.subType] = tabs;
            let configChanges = audit.configAudit(
              this.originalTabs,
              configData[this.type][this.subType]
            );
            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  }).then(() => {
                    if (Object.keys(configChanges).length) {
                      audit.processAudit(
                        "process2",
                        key,
                        configChanges,
                        this.type,
                        this.subType
                      );
                    }
                  });
                  this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                  this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
                  this.$store.state.loading = false;
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  return;
                }
              })
              .catch((error) => {
                this.$swal({
                  title: this.$i18n.t("error"),
                  text: error,
                });

                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: tabs,
            },
          };
          let response = service.saveConfig(configData, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.$store.commit("setGlobalFactors", {
                payload: configData,
              });
              this.originalTabs = JSON.parse(JSON.stringify(this.tabs));
              this.$store.state.loading = false;
            } else {
              this.$swal({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.state.loading = false;
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
