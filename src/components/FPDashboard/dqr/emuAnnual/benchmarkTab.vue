<template>
  <div class="container-fluid m-t-28px">
    <div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
      <a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a>
    </div>
    <div class="row dqr-emumonth">
      <div
        class="map-collapse-btndiv benchmarkmap-toggle"
        style="padding-left: 10px"
      >
        <a
          href="#"
          class="color-white btn-sm"
          id="benchmarkmap-toggle2"
          data-toggle="modal"
          data-target="#exampleModalScrollable"
        >
          {{ $t("introduction") }}
          <span class="hide">
            <i class="fa fa-close"></i>
          </span>
        </a>
      </div>
      <div
        class="map-collapse-btndiv benchmarkbgdata-toggle"
        style="top: 23vh; left: -19px; padding-left: 10px"
      >
        <a
          href="#"
          class="color-white btn-sm"
          id="benchmarkbgdata-toggle2"
          data-toggle="modal"
          data-target="#exampleModalScrollable2"
        >
          {{ $t("backgroundData") }}
          <span class="hide">
            <i class="fa fa-close"></i>
          </span>
        </a>
      </div>
      <div
        class="map-collapse-btndiv benchmarkbgdata-toggle"
        style="top: 44vh; left: 0px; padding-left: 10px"
      >
        <a
          href="#"
          class="color-white btn-sm"
          id="benchmarkbgdata-toggle2"
          data-toggle="modal"
          data-target="#exampleModalScrollable3"
        >
          {{ $t("fpSource") }}
          <span class="hide">
            <i class="fa fa-close"></i>
          </span>
        </a>
      </div>
    </div>
    <div class="row">
      <div
        class="modal fade"
        id="exampleModalScrollable"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalScrollableTitle"
        aria-hidden="true"
      >
        <introduction />
      </div>
      <div
        class="modal fade"
        id="exampleModalScrollable2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalScrollableTitle"
        aria-hidden="true"
      >
        <backgroundgData
          v-if="bgData && methodMixData"
          :selectedLevel="newLocVal"
          :bgData="bgData"
          :methodMixData="methodMixData"
          :dqrResponse="dqrResponse"
          :appResponse="appResponse"
          :userDetails="userDetails"
        />
      </div>
      <div
        class="modal fade"
        id="exampleModalScrollable3"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalScrollableTitle"
        aria-hidden="true"
      >
        <fpSource
          v-if="newLocVal && defaultLevelID"
          @fpSource="getFPSource"
          @adjustmentData="getAdjustedValues"
          :selectedLevel="newLocVal"
          :dqrResponse="dqrResponse"
          :appResponse="appResponse"
          :userDetails="userDetails"
          :defaultLevel="defaultLevelID"
        />
      </div>
    </div>

    <div class="row mt-2" id="benchmarking-sub-tab">
      <div class="col-lg-12 px-0">
        <div class="row">
          <div class="col-lg-12">
            <b-tabs
              v-if="categoryData && Object.keys(categoryData.emu).length"
              class="mx-1"
            >
              <template v-for="(catData, key, index) in categoryData.emu">
                <b-tab
                  :active="index == 0"
                  @click="getRecentActiveTab(key)"
                  :title="getSource(key)"
                  :key="key"
                  v-if="
                    [
                      'User',
                      'Commodities_Facilities',
                      'Visits',
                      'Commodities_Client',
                    ].includes(key) &&
                    catData.dataOnContraceptive == 'Yes' &&
                    bgData
                  "
                >
                  <div class="mt-3">
                    <TabSummary
                      v-if="
                        catData &&
                        catData['categoryInfo'] &&
                        (typeof catData['categoryInfo'] == 'object'
                          ? catData['categoryInfo'][$i18n.locale] != ''
                          : catData['categoryInfo'] != '')
                      "
                      :content="
                        typeof catData == 'object'
                          ? catData['categoryInfo'][$i18n.locale]
                          : catData['categoryInfo']
                      "
                      :contKey="'input' + key"
                    />
                  </div>
                  <benchMarkingInpOutp
                    v-if="catData && bgData && catData['reportingRate']"
                    :data="catData"
                    :emuSaveType="emuSaveType"
                    :bgData="bgData"
                    :bAllWomen="bAllWomen"
                    :repoId="
                      catData['reportingRate'][0]['indicator'][
                        'subIndicator'
                      ][0]['selectedDE']?.[0]?.['id']
                    "
                    :byPassRepoRate="
                      catData['reportingRate'][0]['indicator']['disableChart']
                    "
                    :repoColor="
                      catData['reportingRate'][0]['indicator']['chartOptions'][
                        'color'
                      ]
                    "
                    :tabName="getTabName(key)"
                    :getData="getDatafromChild"
                    :tableName="getTableName(key)"
                    :startYear="sStartYear"
                    :endYear="sRecentYear"
                    :contName="key"
                    :location="value[0]"
                    :year="filterYear"
                    @activeTabName="getActiveTab"
                    :ref="key"
                    :signOffActive="signOffActive"
                    @changeFilter="changeFilter"
                  />
                </b-tab>
              </template>
              <template v-for="(catData, key) in categoryData.emu">
                <b-tab
                  :active="recentActiveTab == 'emu'"
                  @click="getRecentActiveTab(key)"
                  :title="getSource(key)"
                  :key="key"
                  v-if="['Output'].includes(key) && bShowEmu"
                >
                  <TabSummary
                    v-if="
                      catData &&
                      catData['categoryInfo'] &&
                      (typeof catData['categoryInfo'] == 'object'
                        ? catData['categoryInfo'][$i18n.locale] != ''
                        : catData['categoryInfo'] != '')
                    "
                    :content="
                      typeof catData == 'object'
                        ? catData['categoryInfo'][$i18n.locale]
                        : catData['categoryInfo']
                    "
                    :contKey="'input' + key"
                  />
                  <emuOutput
                    v-if="
                      bShowEmu &&
                      outputData &&
                      slopeData &&
                      userTrendsData &&
                      finalMethodArr
                    "
                    :bShowEmu="bShowEmu"
                    :outputData="outputData"
                    :filter="filter"
                    :bgData="bgData"
                    :bAllWomen="bAllWomen"
                    :slopeData="slopeData"
                    :surveyData="surveyData"
                    :finalMethodArr="finalMethodArr"
                    :userTrendsData="userTrendsData"
                    :userTrendsDataByMethods="userTrendsDataByMethods"
                    :startYear="sStartYear"
                    :endYear="sRecentYear"
                    :boolVal="boolVal"
                    :location="value[0]"
                    :defaultEMU="defaultEMUSource"
                    :data="categoryData.emu"
                    :year="filterYear"
                    :signOffActive="signOffActive"
                    :defaultLevelID="defaultLevelID"
                    :userDetails="userDetails"
                    :emuOuputFinalEMu="emuOuputFinalEMu"
                    :initialYear="initialYear"
                    @saveEMUFinal="saveEMUFinal"
                  />
                  <div class="text-center" v-else>
                    <!-- <loader v-if="bShowLoader" />  //need to change css-->

                    <b-spinner type="grow" label="Spinning"></b-spinner>
                  </div>
                </b-tab>
              </template>
            </b-tabs>
            <div class="text-center" v-else>
              <b-spinner type="grow" label="Spinning"></b-spinner>
            </div>
          </div>
        </div>
      </div>
    </div>
    <autoSaveEMU
      v-if="getEMULocations.length"
      :locationVal="emuLoc"
      :userDetails="userDetails"
      :dqrResponse="dqrResponse"
      :appResponse="appResponse"
      :globalResponse="globalResponse"
      @saveEMUAuto="saveEMUAuto"
      @errorOccured="errorOccured"
      @popError="popError"
    />
    <toolbarComponent
      v-if="!isGenerating"
      :recentActiveTab="recentActiveTab"
      @location="getLocation"
      @defLevel="defLevel"
      @emuYear="getEmuYear"
      @closeToolbar="closeToolbar"
      :dqrResponse="dqrResponse"
      :showToolbarOnTablet="showToolbarOnTablet"
      @emuLocations="generateEMU"
      :generateFlag="generateFlag"
      :autoSaveSource="autoSaveSource"
      :getActiveTab="dqrResponse.emu.Background_Data['defaultEMU']"
      :allowedArray="allowedArray"
    />
  </div>
</template>

<script>
/*global settings*/
/*eslint no-undef: "error"*/
import benchMarkingInpOutp from "./benchMarkingInpOutp";
import emuOutput from "./emuOutput";
import service from "@/service";
import backgroundgData from "./bgData";
import fpSource from "./fpSource";
import introduction from "./introduction";
import dataM from "./dataMassaging";
import toolbarComponent from "./toolbarComponent.vue";
import autoSaveEMU from "../autoSaveEMUAnnual/benchmarkTab.vue";
import { decompress } from "compress-json";
export default {
  components: {
    emuOutput,
    benchMarkingInpOutp,
    backgroundgData,
    fpSource,
    introduction,
    toolbarComponent,
    autoSaveEMU,
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
  },

  mounted() {
    this.$gtag.event("tab_view", {
      value: this.tabName,
    });
    // this.autoSaveSource = tab == "Output" || tab == "emu" ? true : false;
  },
  beforeDestroy() {
    this.$store.commit("setEMUMethodTable", null);
  },
  props: [
    "locationVal",
    "signOffActive",
    "userDetails",
    "dqrResponse",
    "appResponse",
    "globalResponse",
    "tabName",
    "isGenerating",
    "allowedArray",
  ],
  computed: {
    emuOuputRender() {
      return this.$store.getters.getEMUMethodTable ? true : false;
    },
  },
  methods: {
    downloadReport() {
      this.$emit("downloadReport");
    },

    getTabName(key) {
      let sources = {
        Commodities_Client: "commoditiesToClients",
        Commodities_Facilities: "commoditiesToFacilities",
        Visits: "fp_visits",
        User: "fp_users",
      };

      return sources[key];
    },
    getSource(key) {
      let aSource = {
        Commodities_Client: this.$i18n.t("commodities_Distributed_to_Clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t(
          "commodities_Distributed_to_Facilities"
        ),
        User: this.$i18n.t("fp_users"),
        Output: this.$i18n.t("emu_Output"),
      };
      return aSource[key];
    },
    getTableName(key) {
      let aSource = {
        Commodities_Client: this.$i18n.t("commodities_to_clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t("commodities_to_facility"),
        User: this.$i18n.t("fp_users"),
      };
      return aSource[key];
    },
    generateEMU(locations) {
      if (locations) {
        this.$store.commit("setLoading", true);
        this.generateAutoEMU = true;
        this.getEMULocations = locations;
        console.log(locations, "loc list");
        this.locIndex = this.locIndex * 1 + 1;
        if (
          this.locIndex < this.getEMULocations.length &&
          this.getEMULocations.length > 0
        ) {
          this.emuLoc = this.getEMULocations[this.locIndex];
        }
      }
    },
    saveEMUFinal(val) {
      if (val) {
        this.generateFlag = false;
        // let currentTime = this.$moment(new Date()).format("DD/MM/YYYY h:mm:ss");
        let currentTime = this.$moment(new Date()).format("ll");
        let key = this.generateKey(`autoSaveEMUAnnual_${this.$i18n.locale}`);
        service.getIndividualOrganisation(val.split("/")[1]).then((keyOrg) => {
          service
            .getSavedConfig({ tableKey: key })
            .then((res) => {
              let resp = res.data;
              if (!resp[this.activeTab]) resp[this.activeTab] = {};
              resp[this.activeTab][val] = {
                name: keyOrg.data.displayName,
                time: currentTime,
              };
              let response = service.updateConfig({
                data: resp,
                tableKey: key,
              });
              response.then((response) => {
                this.generateFlag = true;
              });
            })
            .catch((err) => {
              let resp = {};
              if (!resp[this.activeTab]) resp[this.activeTab] = {};
              resp[this.activeTab][val] = {
                name: keyOrg.data.displayName,
                time: currentTime,
              };
              let response = service.saveConfig({ data: resp, tableKey: key });
              response.then((response) => {
                this.generateFlag = true;
              });
            });
        });
      }
    },
    saveEMUAuto(val) {
      console.log("saveEMUAuto ", val);
      this.generateFlag = false;
      // let currentTime = this.$moment(new Date()).format("DD/MM/YYYY h:mm:ss");
      let currentTime = this.$moment(new Date()).format("ll");
      if (val) {
        service.getIndividualOrganisation(val.split("/")[1]).then((key) => {
          let isObj = this.emuFetched.find((d) => d === val);
          if (!this.saveObj[this.defaultDDType]) {
            this.saveObj[this.defaultDDType] = {};
          }
          if (isObj) {
            let foundIndex = this.emuFetched.findIndex((d) => d === val);
            this.emuFetched[foundIndex] = val;
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: currentTime,
            };
          } else {
            this.emuFetched.push(val);
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: currentTime,
            };
          }
          if (this.emuFetched.length == this.getEMULocations.length) {
            this.updateEMU(this.saveObj);
          }
        });
      }
    },
    errorOccured(val) {
      console.log("errorOccured ", val);

      this.generateFlag = false;
      if (val) {
        service.getIndividualOrganisation(val.split("/")[1]).then((key) => {
          let isObj = this.emuFetched.find((d) => d === val);
          if (!this.saveObj[this.defaultDDType]) {
            this.saveObj[this.defaultDDType] = {};
          }
          if (isObj) {
            let foundIndex = this.emuFetched.findIndex((d) => d === val);
            this.emuFetched[foundIndex] = val;
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: false,
            };
          } else {
            this.emuFetched.push(val);
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: false,
            };
          }
          if (this.emuFetched.length == this.getEMULocations.length) {
            this.updateEMU(this.saveObj);
          }
        });
      }
    },
    popError(val) {
      console.log("popError ", val);

      // let currentTime = this.$moment(new Date()).format("DD/MM/YYYY h:mm:ss");
      let currentTime = this.$moment(new Date()).format("ll");
      this.generateFlag = false;
      if (val) {
        service.getIndividualOrganisation(val.split("/")[1]).then((key) => {
          let isObj = this.emuFetched.find((d) => d === val);
          if (!this.saveObj[this.defaultDDType]) {
            this.saveObj[this.defaultDDType] = {};
          }
          if (isObj) {
            let foundIndex = this.emuFetched.findIndex((d) => d === val);
            this.emuFetched[foundIndex] = val;
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: "Population data not found" + currentTime,
            };
          } else {
            this.emuFetched.push(val);
            this.saveObj[this.defaultDDType][val] = {
              name: key.data.displayName,
              time: "Population data not found - " + currentTime,
            };
          }
          if (this.emuFetched.length == this.getEMULocations.length) {
            this.updateEMU(this.saveObj);
          }
        });
      }
    },
    updateEMU(saveObj) {
      let key = this.generateKey(`autoSaveEMUAnnual_${this.$i18n.locale}`);
      service
        .getSavedConfig({ tableKey: key })
        .then((res) => {
          let resp = res.data;
          Object.keys(saveObj).forEach((methods) => {
            Object.keys(saveObj[methods]).forEach((keys) => {
              resp[methods] = resp?.[methods] ? resp[methods] : {};
              resp[methods][keys] = saveObj[methods][keys];
            });
          });
          let response = service.updateConfig({ data: resp, tableKey: key });
          response.then((response) => {
            this.resetAutoSaveEMU();
            this.generateFlag = true;
            this.$store.commit("setLoading", false);
            this.$store.commit("setIsAnnualEMUSet", false);
          });
        })
        .catch(() => {
          let response = service.saveConfig({ data: saveObj, tableKey: key });
          response.then((response) => {
            if (response.data.status === "OK") {
              this.resetAutoSaveEMU();
              this.generateFlag = true;
              this.$store.commit("setLoading", false);
              this.$store.commit("setIsAnnualEMUSet", false);
            } else {
              console.log("AutosaveEMU Failed!");
              return;
            }
          });
        });
    },
    resetAutoSaveEMU() {
      this.getEMULocations = [];
      this.emuFetched = [];
      this.locIndex = -1;
      this.generateAutoEMU = false;
      this.emuLoc = "";
    },
    activeSummary(tab) {
      if (tab == "client") {
        this.clientActive = !this.clientActive;
      } else if (tab == "fac") {
        this.facActive = !this.facActive;
      } else if (tab == "visit") {
        this.visitsActive = !this.visitsActive;
      } else if (tab == "user") {
        this.userActive = !this.userActive;
      } else {
        this.emuActive = !this.emuActive;
      }
    },
    // getMethodMixData(data) {
    //   this.methodMixData = data;
    // },
    getActiveTab(value) {
      this.recentActiveTab = value;
    },
    getRecentActiveTab(tab) {
      console.log(tab, "tab");
      if (tab === "Output") {
        this.recentActiveTab = "emu";
      } else {
        this.recentActiveTab = this.$refs[tab][0].activetab;
        console.log(this.$refs[tab], this.$refs, tab, "activeTab");
      }
      // this.activeTab = tab;
      // if (tab == "client") {
      //   this.recentActiveTab = this.$refs.comclientref.activetab;
      // } else if (tab == "facilities") {
      //   this.recentActiveTab = this.$refs.comfacilityref.activetab;
      // } else if (tab == "visits") {
      //   this.recentActiveTab = this.$refs.visitsref.activetab;
      // } else if (tab == "users") {
      //   this.recentActiveTab = this.$refs.usersref.activetab;
      // } else {
      //   this.recentActiveTab = tab;
      // }
      this.autoSaveSource = tab == "Output" ? true : false;
    },
    closeToolbar() {
      this.showToolbarOnTablet = false;
    },
    defLevel(newLev) {
      this.defaultLevelID = newLev;
    },
    getLocation(newLocation) {
      //let val = newLocation.split("/")
      //this.bShowLoader = true;
      this.methodMixData = null;
      this.bgData = null;
      this.value = [newLocation];
      this.bShowEmu = false;
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null;
      this.userTrendsDataByMethods = null;
      this.newLocVal = newLocation;
      //this.getConfigAccess();
    },

    getEmuYear(p) {
      setTimeout(() => {
        this.filterYear = p;
      }, 10);
    },
    /**
     * This is get banchmarking configuration.
     * Usage: `getConfigAccess()`
     * @param 'dqrModule' which is key for benchmarking config
     * @return {Object} categoryData
     */
    getFPSource(newVal) {
      if (newVal === "false") {
        return;
      }
      if (newVal) {
        this.getConfigAccess();
      }
    },
    getAdjustedValues(newVal) {
      this.adjustmentData = newVal;
    },
    async getConfigAccess() {
      this.categoryData = this.dqrResponse;
      this.emuSaveType = this.dqrResponse.emu["Background_Data"]["emuSaveType"]
        ? this.dqrResponse.emu["Background_Data"]["emuSaveType"]
        : "Custom";
      let oBechMarkModule = this.dqrResponse,
        aBackgorundIndicators = oBechMarkModule.emu["Background_Data"][
          "backgroundIndicators"
        ]
          ? oBechMarkModule.emu["Background_Data"]["backgroundIndicators"]
          : [],
        i,
        nLen = aBackgorundIndicators.length,
        oBackground = {},
        oBackgroundColor = {},
        locationID = this.newLocVal.split("/")[1],
        aSelectedDEs = [],
        sSelectedDEs = "";
      let promises = [];
      let fromDataStore = oBechMarkModule.emu["Background_Data"]["bgDataSource"]
        ? oBechMarkModule.emu["Background_Data"]["bgDataSource"]
        : false;

      // SWITCH CASE START
      this.switchCategory(this.categoryData.emu);
      // SWITCH CASE END
      //Global Period Seeting in emu annual
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
      }
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        this.sRecentYear = recentYearMonth.split("-")[0];
      else this.sRecentYear = recentYearMonth.split("-")[0] * 1 - 1;

      this.sStartYear = this.$moment(recentYearMonth, "YYYY-MM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");

      this.bAllWomen =
        this.categoryData.emu["Background_Data"]["FPWomenPopulation"] === "WRA";

      let sYear = dataM.getYearFormated(this.sStartYear, this.sRecentYear),
        aYear = sYear.split(";");
      let metaConfigData = this.$store.getters.getGlobalFactors();
      let defaultEMUSource = this.categoryData.emu["Background_Data"][
        "defaultEMU"
      ]
        ? this.categoryData.emu["Background_Data"]["defaultEMU"]
        : "Commodities_Client";

      this.defaultDDType = this.categoryData.emu["Background_Data"][
        "defaultEMU"
      ]
        ? this.categoryData.emu["Background_Data"]["defaultEMU"]
        : "Commodities_Client";
      //Setting inital Year in emu o/p as per global setting
      this.initialYear = this.sStartYear;
      //this.initialYear = this.categoryData.emu[defaultEMUSource]["initialYear"];
      let emufromDQR = this.categoryData.emu["Background_Data"]["defaultEMU"]
        ? this.categoryData.emu["Background_Data"]["defaultEMU"]
        : "Commodities_Client";
      let sourcesData = {
        Commodities_Client: this.$i18n.t("commodities_to_clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t("commodities_to_facility"),
        User: this.$i18n.t("fp_users"),
      };
      this.emuOuputFinalEMu = sourcesData[emufromDQR];
      let oAdjsData = this.adjustmentData.adjustments,
        aAdjCats = oAdjsData.cat,
        aAdjTypes = oAdjsData.data,
        oFinalAdjTypes = {};
      aAdjTypes.forEach((ele) => {
        let { _i, data } = ele;
        oFinalAdjTypes[_i] = {};
        aAdjCats.forEach((categ, jndex) => {
          oFinalAdjTypes[_i][categ] = data[jndex]
            ? data[jndex].toFixed(3) * 1
            : 0;
        });
      });
      let cypGlobal = {};
      Object.keys(metaConfigData.cyp).forEach((contName) => {
        cypGlobal[contName] = {};
        Object.keys(metaConfigData.cyp[contName].chartData).forEach((ind) => {
          let innerData = metaConfigData.cyp[contName].chartData[ind];
          innerData.indicator.subIndicator.forEach((sub) => {
            let subName = Array.isArray(sub.name)
              ? sub.name[this.$i18n.locale]
              : sub.name;
            cypGlobal[contName][subName] = sub.cyp;
          });
        });
      });
      let response = {};
      response.rows = [];
      for (i = 0; i < nLen; i++) {
        let aSubInd = aBackgorundIndicators[i].subIndicators,
          j,
          nSubLen = aSubInd.length;
        let innerDataStore = aBackgorundIndicators[i]["bgDataSource"]
          ? aBackgorundIndicators[i]["bgDataSource"]
          : fromDataStore;
        for (j = 0; j < nSubLen; j++) {
          let sName =
              typeof aSubInd[j].name == "object"
                ? aSubInd[j].name[this.$i18n.locale]
                : aSubInd[j].name,
            aSelectedDE =
              innerDataStore == "Datastore"
                ? aSubInd[j].selectedDatastoreDE
                : aSubInd[j].selectedDE;
          oBackground[sName] = aSelectedDE.map((ele) => {
            let statDispName =
              typeof ele.static_displayName == "object"
                ? ele.static_displayName[this.$i18n.locale]
                : ele.static_displayName;

            if (statDispName) {
              return ele.id + "/" + (i == 0 || i == 1 ? sName : statDispName); //need to discuss for static name
            } else {
              return ele.id + (i == 0 || i == 1 ? "/" + sName : "");
            }
          });
          oBackgroundColor[this.$i18n.t(`${sName}`)] = aSubInd[j].color;
          oBackgroundColor[sName] = aSubInd[j].color;
        }
        if (innerDataStore == "Datastore") {
          let keyName = i == 0 ? "population_" : i == 1 ? "mcpr_" : "mcmm_";
          let levelid = this.newLocVal.split("/")[0];
          let popType = this.categoryData.emu["Background_Data"][
            "FPWomenPopulation"
          ]
            ? this.categoryData.emu["Background_Data"]["FPWomenPopulation"]
            : "MWRA";
          popType = popType.toLowerCase();
          let key = `${keyName}${popType}_${levelid}`;
          if (!this.$store.getters.getAppSettings.country) {
            let appId = this.$store.getters.getAppId
                ? this.$store.getters.getAppId
                : "",
              appUserId = this.$store.getters.getAppUserId
                ? this.$store.getters.getAppUserId
                : "";
            if (appId && appUserId) {
              key = `${keyName}${popType}_${levelid}`;
            } else {
              this.showLocalStorageError();
              return;
            }
          }
          promises.push(service.getSavedConfig({ tableKey: key }));
        } else {
          let aSubInd = aBackgorundIndicators[i].subIndicators,
            j,
            nSubLen = aSubInd.length;
          for (j = 0; j < nSubLen; j++) {
            let aSelectedDE = aSubInd[j].selectedDE;
            aSelectedDE.forEach((ele) => {
              aSelectedDEs.push(ele.id);
            });
            // oBackgroundColor[this.$i18n.t(`${sName}`)] =  aSubInd[j].color
            // oBackgroundColor[sName] = aSubInd[j].color
          }
        }
      }
      if (promises.length) {
        await Promise.all(promises)
          .then((results) => {
            results.forEach((resultResponse, i) => {
              let resultRes =
                resultResponse && typeof resultResponse.data.rows == "string"
                  ? {
                      ...resultResponse.data,
                      rows: decompress(JSON.parse(resultResponse.data.rows)),
                    }
                  : resultResponse.data;
              if (i == 0) {
                response = {
                  ...resultRes.data,
                  rows: resultRes.rows.filter((arr) => arr[2] === locationID),
                };
              } else {
                resultRes.rows.forEach((arr) => {
                  if (arr[2] === locationID) {
                    response.rows.push(arr);
                  }
                });
              }
            });
          })
          .catch((res) => {
            console.log(res, "Error in fetching background data");
            //this.showAlert();
          });
      }
      if (aSelectedDEs.length) {
        sSelectedDEs = aSelectedDEs.join(";");
        await service
          .getAnalyticalIndicatorData(sSelectedDEs, locationID, sYear)
          .then((dataresponse) => {
            if (promises.length == 0) {
              response = dataresponse.data;
            } else {
              response.rows = [...response.rows, ...dataresponse.data.rows];
            }
          })
          .catch((res) => {
            console.log(res, "Error in fetching background data using api");
            //this.showAlert();
          });
      }

      if (response) {
        let oFinalData = dataM.getFormatedBackGroundData(
            response,
            oBackground,
            aYear
          ),
          oTemp = oFinalData.final,
          odata = this.adjustmentData,
          ocontdata = dataM.getComputedContFact(
            JSON.parse(JSON.stringify(metaConfigData.continuation))
          ),
          oBgdata = {
            population: oTemp["Population (MWRA)"] || oTemp.Population,
            UNPD: oTemp.UNPD,
            //PMS: oTemp['PMA/FPET'] || oTemp['FPET'],
            PMA: oTemp["PMA"],
            PMS: oTemp["PMA"],
            FPET: oTemp["FPET"],
            MICS: oTemp.MICS,
            DHS: oTemp.DHS,
            methodMix: oFinalData.methodMix,
            continuation: ocontdata,
            cyp: cypGlobal,
            adjustmentFactor: odata.adjustmentFactor,
            adjustmentFactorTypeWise: oFinalAdjTypes,
            recentYear: oFinalData.recentYear,
            defaultEMUSource: defaultEMUSource,
            bgIndColor: oBackgroundColor,
          };
        //this.getLocationList(levelID, locationID);
        //this.bShowLoader = false;
        this.bgData = oBgdata;
        let aMethodMixPie = dataM.getMethodMixPie(oFinalData.methodMix);
        this.methodMixData = aMethodMixPie;
      } else {
        console.log("in else", "this.bgdata key is not created");
        //this.showAlert();
      }
    },
    switchCategory(data) {
      let aSource = {
        Commodities_Client: this.$i18n.t("emu_output_5"),
        Visits: this.$i18n.t("emu_output_7"),
        Commodities_Facilities: this.$i18n.t("emu_output_6"),
        User: this.$i18n.t("emu_output_8"),
      };
      let preVal = "",
        preValFlag = false,
        cat = "";
      Object.keys(aSource).forEach((source) => {
        if (
          data[source]["dataOnContraceptive"] == "Yes" &&
          preValFlag == false
        ) {
          preVal = source;
          cat = aSource[source];
          preValFlag = true;
        }
      });
      this.defaultEMUSource = this.categoryData.emu["Background_Data"][
        "defaultEMU"
      ]
        ? aSource[this.categoryData.emu["Background_Data"]["defaultEMU"]]
        : cat;
      this.category = cat;
      this.activeTab = preVal;
    },
    getDatafromChild(p_tabName, p_data, p_type, filter) {
      this.boolVal = !this.boolVal;
      let sProp =
        p_type === "finalMethodArr"
          ? "finalMethodArr"
          : p_type === "surveyData"
          ? "surveyData"
          : p_type === "slope"
          ? "slopeData"
          : p_type === "output"
          ? "outputData"
          : p_type === "userT"
          ? "userTrendsData"
          : "userTrendsDataByMethods";

      if (!this[sProp]) {
        this[sProp] = {};
        this[sProp][p_tabName] = {};
      }

      if (!this["filter"]) {
        this["filter"] = {};
      }
      this[sProp][p_tabName] = p_data;
      this["filter"][p_tabName] = filter;

      if (p_type === "whole_data_empty") {
        this["slopeData"] = this["slopeData"]
          ? {
              ...this["slopeData"],
              [p_tabName]: {},
            }
          : {
              [p_tabName]: {},
            };
        this["outputData"] = this["outputData"]
          ? {
              ...this["outputData"],
              [p_tabName]: {},
            }
          : {
              [p_tabName]: {},
            };
        this["userTrendsData"] = this["userTrendsData"]
          ? {
              ...this["userTrendsData"],
              [p_tabName]: {},
            }
          : {
              [p_tabName]: {},
            };
        this["userTrendsDataByMethods"] = this["userTrendsDataByMethods"]
          ? {
              ...this["userTrendsDataByMethods"],
              [p_tabName]: {},
            }
          : {
              [p_tabName]: {},
            };
        this["filter"] = this["filter"]
          ? {
              ...this["filter"],
              [p_tabName]: filter,
            }
          : {
              [p_tabName]: filter,
            };
      }

      let count =
        (this.categoryData.emu["Commodities_Client"]["dataOnContraceptive"] ==
          "Yes" || 0) +
        (this.categoryData.emu["Commodities_Facilities"][
          "dataOnContraceptive"
        ] == "Yes" || 0) +
        (this.categoryData.emu["Visits"]["dataOnContraceptive"] == "Yes" || 0) +
        (this.categoryData.emu["User"]["dataOnContraceptive"] == "Yes" || 0);
      if (
        this.userTrendsDataByMethods &&
        Object.keys(this.userTrendsDataByMethods).length === count &&
        this.outputData &&
        Object.keys(this.outputData).length === count &&
        this.slopeData &&
        Object.keys(this.slopeData).length === count &&
        this.userTrendsData &&
        Object.keys(this.userTrendsData).length === count
      ) {
        this.$nextTick(() => {
          this.bShowLoader = false;
          this.bShowEmu = true;
        });
      }
    },
    showAlert() {
      this.sweetAlert({
        text: this.$i18n.t("somethingwentwrong"),
      });
      //this.bShowLoader = false;
    },
    getLocationList(defaultLevelID, defaultLocationID) {
      service
        .getOrganisationChildren(defaultLocationID, defaultLevelID)
        .then((loc) => {
          const renamedObj = this.renameKeys(loc.data);
          this.options = [renamedObj];
          let selected = this.options
            .flat()
            .find((o) => o.id === [this.value][0]);
          this.locationName = selected.label;
        });
    },
    renameKeys(obj) {
      const keyValues = Object.keys(obj)
        .map((key) => {
          let newKey = null;

          if (key === "displayName") {
            newKey = "label";
          } else {
            newKey = key;
          }
          if (key === "children") {
            obj[key] = obj[key]
              .map((obj) => this.renameKeys(obj))
              .sort((a, b) =>
                a.label > b.label ? 1 : a.label < b.label ? -1 : 0
              );
          }
          return {
            [newKey]: key === "id" ? obj.id : obj[key],
          };
        })
        .sort((a, b) =>
          a.displayName > b.displayName
            ? 1
            : a.displayName < b.displayName
            ? -1
            : 0
        );
      return Object.assign({}, ...keyValues);
    },
    changeFilter(val, tbName) {
      this.bShowEmu = false;
      this["filter"][tbName] = val;
      this.$nextTick(() => {
        this.bShowEmu = true;
      });
    },
  },
  data() {
    return {
      emuSaveType: "",
      initialYear: "",
      emuOuputFinalEMu: "",
      autoSaveSource: false,
      generateFlag: false,
      saveObj: {},
      emuFetched: [],
      locIndex: -1,
      generateAutoEMU: false,
      getEMULocations: [],
      emuLoc: "",
      adjustmentData: null,
      categoryData: null,
      bgData: null,
      reportingRate: {
        YEbU8pISCrn: "User",
        kCOYPAFAiQf: "Visits",
        Ps3V9QcwenT: "Commodities_Facilities",
        hSrYxoXJCNV: "Commodities_Client",
      },
      repoIds: {},
      bAllWomen: false,
      outputData: null,
      bShowEmu: false,
      slopeData: null,
      surveyData: null,
      finalMethodArr: null,
      userTrendsData: null,
      userTrendsDataByMethods: null,
      sStartYear: 2007,
      sRecentYear: "",
      bShowLoader: false,
      location: "",
      options: [],
      value: [],
      defaultExpandLevel: 1,
      category: "",
      activeTab: "",
      filter: null,
      boolVal: true,
      // emuYears: null,
      filterYear: "",
      showToolbarOnTablet: false,
      recentActiveTab: "",
      methodMixData: null,
      newLocVal: null,
      defaultLevelID: "",
      emuActive: false,
      clientActive: false,
      facActive: false,
      visitsActive: false,
      userActive: false,
      defaultEMUSource: null,
      defaultDDType: null,
    };
  },
  watch: {
    emuFetched: {
      handler(val) {
        if (val.length) {
          this.locIndex = this.locIndex * 1 + 1;
          if (
            this.locIndex < this.getEMULocations.length &&
            this.getEMULocations.length > 0
          ) {
            this.emuLoc = this.getEMULocations[this.locIndex];
          }
        }
      },
      deep: true,
    },
    filterYear() {
      this.$store.commit("setLoading", false);

      // this.bShowLoader = true;
      // this.bShowEmu = false;
      // this.outputData = null;
      // this.slopeData = null;
      // this.userTrendsData = null;
      // this.userTrendsDataByMethods = null;
    },
    value() {
      this.bShowEmu = false;
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null;
      this.userTrendsDataByMethods = null;
    },
    signOffActive() {
      this.bShowEmu = false;
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null;
      this.userTrendsDataByMethods = null;
    },
  },
};
</script>
<style scoped lang="scss">
.float-button {
  position: fixed;
  width: 119px;
  left: -18px;
  top: 200px;
  z-index: 9;
  height: 100%;
}
</style>
