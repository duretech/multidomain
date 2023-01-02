<template>
  <div class="footer-buttons" v-if="isDataFetched">
    <b-card no-body>
      <b-tabs
        vertical
        card
        lazy
        nav-class="p-0"
        nav-wrapper-class="adminConfig"
      >
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab
          v-for="(tab, i) in tabs"
          :key="'dyn-tab-' + tab.id"
          class="pl-2 pb-2 pt-0 pr-0"
        >
          <template #title>
            <i
              class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Up"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: -1 })
              "
            ></i>
            <i
              class="fa fa-arrow-down mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Down"
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
                  group: tab.group,
                  showGroups: tab.showGroups,
                })
              "
            ></i>
            <i
              class="fa fa-trash mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('deletebtn')"
              @click="deleteElement({ type: 'tab', tInd: i })"
            ></i>
            {{ tab.tabName }}
          </template>
          <div>
            <b-card no-body>
              <b-tabs
                card
                lazy
                nav-class="p-0 m-0"
                nav-wrapper-class="adminConfigInner p-0"
              >
                <!-- Render Tabs, supply a unique `key` to each tab -->
                <b-tab
                  v-for="(subTab, j) in tab.subTabs"
                  :key="'dyn-sub-tab-' + subTab.id"
                  class="border"
                >
                  <template #title>
                    <i
                      class="fa fa-arrow-left mr-2 cursor-pointer f-s-0-875rem"
                      v-b-tooltip.hover
                      title="Move Left"
                      @click.prevent.stop="
                        moveItem({
                          type: 'subTab',
                          tInd: i,
                          stInd: j,
                          places: -1,
                        })
                      "
                    ></i>
                    <i
                      class="fa fa-arrow-right mr-2 cursor-pointer f-s-0-875rem"
                      v-b-tooltip.hover
                      title="Move Right"
                      @click.prevent.stop="
                        moveItem({
                          type: 'subTab',
                          tInd: i,
                          stInd: j,
                          places: 1,
                        })
                      "
                    ></i>
                    <i
                      class="fa fa-edit mr-2 f-s-0-875rem"
                      v-b-tooltip.hover
                      :title="$t('edit')"
                      @click="
                        updateTab({
                          type: 'type21',
                          tabName: subTab.tabName,
                          tInd: i,
                          stInd: j,
                        })
                      "
                    ></i>
                    <i
                      class="fa fa-trash mr-2 f-s-0-875rem"
                      v-b-tooltip.hover
                      :title="$t('deletebtn')"
                      @click="
                        deleteElement({ type: 'subTab', tInd: i, stInd: j })
                      "
                    ></i>
                    {{ subTab.tabName }}
                  </template>
                  <b-row v-if="tab.group">
                    <b-col sm="12">
                      <b-row class="mb-3">
                        <b-col sm="5">
                          <label :for="`type-tabGroup-${i}-${j}`">Group</label>
                        </b-col>
                        <b-col sm="7">
                          <b-form-select
                            :id="`type-tabGroup-${i}-${j}`"
                            v-model="subTab.group"
                            :options="subGroups(tab.group)"
                            @change="
                              updatedBGData({
                                tInd: i,
                                stInd: j,
                                group: subTab.group,
                              })
                            "
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col sm="12">
                      <b-row class="mb-3">
                        <b-col sm="5">
                          <label :for="`type-tabSummary-${i}-${j}`">{{
                            $t("catInformation")
                          }}</label>
                        </b-col>
                        <b-col sm="7">
                          <vue-editor
                            :id="`type-tabSummary-${i}-${j}`"
                            v-model="subTab.categoryInfo"
                            :state="
                              subTab.categoryInfo &&
                              subTab.categoryInfo.length !== 0
                            "
                            :editorToolbar="customToolbar"
                            :placeholder="$t('enter_category_information')"
                          ></vue-editor>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      v-if="
                        moduleKey === 'summaryDashboard' &&
                        $store.getters.getNamespace ===
                          'multi_program_mnch-dashboard'
                      "
                    >
                      <b-row class="mb-3">
                        <b-col sm="5">
                          <label :for="`type-linkToIntegrated-${i}-${j}`"
                            >Link to Integrated Dashboard</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-form-checkbox
                            :id="`type-linkToIntegrated-${i}-${j}`"
                            class="mr-n2 mb-n1 mt-1"
                            switch
                            v-model="subTab.integrated.linked"
                          >
                          </b-form-checkbox>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <template
                    v-if="
                      moduleKey === 'summaryDashboard' &&
                      $store.getters.getNamespace ===
                        'multi_program_mnch-dashboard'
                    "
                  >
                    <transition name="slide-fade">
                      <SDIntegratedBenchmark
                        :i="i"
                        :j="j"
                        :tabId="tab.id"
                        :tabGroup="tab.group"
                        :subTabId="subTab.id"
                        :dataEntry="dataEntry"
                        :integrated="subTab.integrated"
                        v-bind.sync="subTab.integrated"
                      />
                    </transition>
                  </template>
                  <template v-if="subTab.backgroundData">
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      Background Factors
                    </div>
                    <BackgroundData
                      :i="i"
                      :j="j"
                      :moduleKey="moduleKey"
                      :subTabGroup="subTab.group"
                      :backgroundData="subTab.backgroundData"
                      v-bind.sync="subTab.backgroundData"
                    />
                  </template>
                  <template v-if="moduleKey === 'dqrDashboard'">
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      Sign Off Questions
                    </div>
                    <SignOff
                      :i="i"
                      :j="j"
                      :moveItem="moveItem"
                      :questions="subTab.questions"
                      v-bind.sync="subTab.questions"
                      :actionOnQuestion="actionOnQuestion"
                    />
                  </template>
                  <template
                    v-if="
                      moduleKey === 'analyticalDashboard' && subTab.mapSetting
                    "
                  >
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      Map Settings
                    </div>
                    <div class="p-2 border mb-3">
                      <ChartMapSettings
                        :i="i"
                        :j="j"
                        :tabs="tabs"
                        :copy="copy"
                        :tabId="tab.id"
                        :copyTo="copyTo"
                        :moveItem="moveItem"
                        :subTabId="subTab.id"
                        :moduleKey="moduleKey"
                        configKey="mapSetting"
                        :subTabGroup="subTab.group"
                        :applyPalette="applyPalette"
                        :levelsSelect="levelsSelect"
                        :settings="subTab.mapSetting"
                        :deleteElement="deleteElement"
                        v-bind.sync="subTab.mapSetting"
                        :updateBenchmarks="updateBenchmarks"
                      />
                      <b-row v-if="subTab.mapSetting.length === 0">
                        <b-col sm="12" class="text-center">
                          Settings not available.
                        </b-col>
                      </b-row>
                    </div>
                  </template>
                  <template>
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      Chart Settings
                    </div>
                    <div
                      class="p-2 border"
                      :class="{ 'mb-3': moduleKey === 'summaryDashboard' }"
                    >
                      <ChartMapSettings
                        :i="i"
                        :j="j"
                        :tabs="tabs"
                        :copy="copy"
                        :tabId="tab.id"
                        :copyTo="copyTo"
                        :moveItem="moveItem"
                        :subTabId="subTab.id"
                        :moduleKey="moduleKey"
                        configKey="chartSetting"
                        :subTabGroup="subTab.group"
                        :applyPalette="applyPalette"
                        :levelsSelect="levelsSelect"
                        :deleteElement="deleteElement"
                        :settings="subTab.chartSetting"
                        v-bind.sync="subTab.chartSetting"
                        :updateBenchmarks="updateBenchmarks"
                      />
                      <b-row v-if="subTab.chartSetting.length === 0">
                        <b-col sm="12" class="text-center">
                          Please add chart setting using <code>Add</code> button
                          below.
                        </b-col>
                      </b-row>
                      <div class="text-right pt-2">
                        <b-button
                          class="black-btn btn-sm ml-2"
                          v-on:click="
                            addElement({
                              type: 'chartSetting',
                              tInd: i,
                              stInd: j,
                            })
                          "
                          >{{ $t("addbtn") }}</b-button
                        >
                        <b-button
                          class="black-btn btn-sm ml-2 d-none"
                          v-on:click="
                            addElement({
                              type: 'mapSetting',
                              tInd: i,
                              stInd: j,
                            })
                          "
                          >{{ $t("addbtn") }} Map</b-button
                        >
                      </div>
                    </div>
                  </template>
                  <template
                    v-if="moduleKey === 'summaryDashboard' && subTab.summary"
                  >
                    <div
                      class="
                        card-header
                        color-black
                        text-uppercase
                        f-s-0-875rem
                        font-weight-bold
                      "
                    >
                      Summary
                    </div>
                    <SDNarrations
                      :i="i"
                      :j="j"
                      :tabs="tabs"
                      :subTabId="subTab.id"
                      :summary="subTab.summary"
                      :subTabGroup="subTab.group"
                      v-bind.sync="subTab.summary"
                      :allCharts="subTab.chartSetting"
                    />
                  </template>
                </b-tab>

                <!-- New Tab Button (Using tabs-start slot) -->
                <template #tabs-start>
                  <b-nav-item
                    role="presentation"
                    @click.prevent="updateTab({ type: 'type2', tInd: i })"
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
            <div class="text-right pt-2">
              <b-button class="black-btn" @click.prevent="updateConfig">{{
                $t("savebtn")
              }}</b-button>
            </div>
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
        <b-row
          v-if="updateType === 'type1' || updateType === 'type11'"
          class="pt-3"
        >
          <b-col sm="4">
            <label for="type-tabGroup">Group</label>
          </b-col>
          <b-col sm="8">
            <b-form-select
              id="type-tabGroup"
              v-model="groupName"
              :options="groups"
            ></b-form-select>
          </b-col>
        </b-row>
        <b-row
          v-if="
            (updateType === 'type1' || updateType === 'type11') &&
            moduleKey === 'dqrDashboard'
          "
          class="pt-3"
        >
          <b-col sm="4">
            <label for="type-tabShowGroups">Show Groups</label>
          </b-col>
          <b-col sm="8">
            <b-form-checkbox
              id="type-tabShowGroups"
              class="mr-n2 mb-n1"
              switch
              v-model="showGroups"
            >
            </b-form-checkbox>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      v-model="questionModel"
      :title="$t('addQuest')"
      @ok="actionOnQuestion({ type: 'update' })"
      no-close-on-backdrop
    >
      <template v-if="signOffQuestion">
        <div class="mb-3">
          {{ $t("quest") }}
          <b-form-textarea
            id="textarea"
            v-model="signOffQuestion.question"
            :placeholder="$t('enter_question')"
            rows="3"
          ></b-form-textarea>
        </div>
        <div>
          <b-form-group :label="$t('options')">
            <b-row
              class="my-1"
              v-for="(opt, i) in signOffQuestion.options"
              :key="opt.value"
            >
              <b-col sm="1">
                <label :for="'input-option' + opt.value"
                  ><i
                    class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
                    @click="actionOnOption({ type: 'delete', qInd: i })"
                    v-b-tooltip.hover
                    :title="$t('deletebtn')"
                  ></i
                ></label>
              </b-col>
              <b-col sm="11">
                <b-form-input
                  :id="'input-option' + opt.value"
                  size="sm"
                  placeholder=""
                  v-model="opt.text"
                ></b-form-input>
              </b-col>
            </b-row>
            <div
              class="text-center"
              v-if="signOffQuestion.options.length === 0"
            >
              There are no options<br />
              Add a new option using the <b>+</b> button.
            </div>
          </b-form-group>
        </div>
        <div class="pt-2">
          <b-button
            size="sm"
            class="black-btn"
            @click="actionOnOption({ type: 'add' })"
            >+</b-button
          >
        </div>
      </template>
    </b-modal>
    <dataEntryForm
      v-if="isDataEntry"
      :isDataEntry="isDataEntry"
      :dataEntryID="dataEntryID"
      @hideModal="hideModal"
    />
  </div>
</template>
<script>
import service from "@/service";
import { VueEditor } from "vue2-editor";
import dataEntryForm from "@/components/config/dqr/dataEntryForm";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
import { randomString } from "@/components/Common/commonFunctions";
import DynamicConfigOptionsMixin from "@/helpers/DynamicConfigOptionsMixin";
import SDNarrations from "@/components/config/Common/SDNarrations";
import BackgroundData from "@/components/config/Common/BackgroundData";
import SignOff from "@/components/config/Common/SignOff";
import ChartMapSettings from "@/components/config/Common/ChartMapSettings";
import SDIntegratedBenchmark from "@/components/config/Common/SDIntegratedBenchmark";
export default {
  props: [
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
    "supportedLanguages",
    "moduleKey",
    "orgList",
  ],
  mixins: [VueEditorOptionMixin, DynamicConfigOptionsMixin],
  components: {
    SignOff,
    VueEditor,
    SDNarrations,
    dataEntryForm,
    BackgroundData,
    ChartMapSettings,
    SDIntegratedBenchmark,
  },
  data() {
    let levelID = this.$store.getters.getApplicationModule().defaultLevelID;
    let levels = this.orgList
      .filter((item) => {
        if (item.level === levelID && item.level === this.orgList.length) {
          return item;
        }
        if (item.level >= levelID) {
          return item;
        }
      })
      .map((o) => ({
        level: o.level,
        levelName: o.name,
        isAutoRange: true,
        scales: [
          {
            lowScale: "0",
            highScale: "25",
            scaleColor: "#0000ff",
            scaleLabel: "Low",
          },
          {
            lowScale: "25",
            highScale: "50",
            scaleColor: "#0000ff",
            scaleLabel: "Medium",
          },
          {
            lowScale: "50",
            highScale: "75",
            scaleColor: "#0000ff",
            scaleLabel: "High",
          },
          {
            lowScale: "75",
            highScale: "100",
            scaleColor: "#0000ff",
            scaleLabel: "Very High",
          },
        ],
      }))
      .sort((a, b) => {
        return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
      });
    return {
      tabs: [],
      groups: [],
      signOffTab: 0,
      levels: levels,
      dataEntryID: "",
      groupName: null,
      signOffSubTab: 0,
      updateType: null,
      updateIndex: null,
      showGroups: false,
      isDataEntry: false,
      updatedTabName: "",
      tabNameModal: false,
      questionModel: false,
      updateSubIndex: null,
      isDataFetched: false,
      integrated: {
        color: "#000",
        linked: false,
        displayName: "",
        minThreshold: 0,
        maxThreshold: 100,
      },
      summary: {
        disable: false,
        percentageIndicator: false,
        benchmarkValue: "",
        summaryText: "",
        compareWith: null,
        primaryChart: null,
        secondaryChart: null,
        priorityIndicator: null,
      },
      signOff: {
        question: "",
        options: [
          { text: "Yes", value: "Yes" },
          { text: "No", value: "No" },
        ],
        comment: "",
        answer: "",
      },
      signOffQuestion: null,
      paletteColor: "#00ff80",
      levelsSelect: [],
      selectedLevel: null,
      selectedTreeLevel: [],
      copyLevels: [],
      selectedCopyOption: [],
      copyToKey: "",
    };
  },
  computed: {
    subGroups: function () {
      return function (group) {
        let subGroups = [];
        if (this.moduleKey === "summaryDashboard") {
          if (
            this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          ) {
            if (group === "DEFAULT") {
              subGroups = [
                {
                  value: "EMU",
                  text: "EMU",
                },
                {
                  value: "PPFP",
                  text: "PPFP",
                },
                {
                  value: "RMNCH",
                  text: "RMNCH",
                },
                {
                  value: "STOCK_OUT",
                  text: "Stock Out",
                },
                {
                  value: "ADOL_YOUTH",
                  text: "Adolescents and Youth",
                },
                {
                  value: "DEFAULT",
                  text: "Default",
                },
              ];
            } else {
              subGroups = [
                {
                  value: "VOLUME",
                  text: "Volume",
                },
                {
                  value: "REPORTING_RATE",
                  text: "Reporting Rate",
                },
                {
                  value: "DEFAULT",
                  text: "Default",
                },
              ];
            }
          } else {
            subGroups = [
              {
                value: "DEFAULT",
                text: "Default",
              },
            ];
          }
        }
        if (this.moduleKey === "analyticalDashboard") {
          if (
            this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          ) {
            if (group === "DEFAULT") {
              subGroups = [
                {
                  value: "EMU",
                  text: "EMU",
                },
                {
                  value: "PPFP",
                  text: "PPFP",
                },
                {
                  value: "DEFAULT",
                  text: "Default",
                },
                {
                  value: "SUMMARY",

                  text: "Summary",
                },
                {
                  value: "STOCK_OUT",
                  text: "Stock Out",
                },
                {
                  value: "AVAILABILITY",
                  text: "Availability",
                },
                {
                  value: "INS_REMOVAL",
                  text: "Insertion vs Removal",
                },
                {
                  value: "ADOL_YOUTH",
                  text: "Adolescents and Youth",
                },
              ];
            } else {
              subGroups = [
                {
                  value: `GEO`,
                  text: "Geographic Variation",
                },
                {
                  value: "SUMMARY",

                  text: "Summary",
                },
                {
                  value: "DEFAULT",
                  text: "Default",
                },
              ];
            }
          } else {
            subGroups = [
              {
                value: `GEO`,
                text: "Geographic Variation",
              },
              {
                value: `COMP`,
                text: "Key Components",
              },
              {
                value: `TIMING`,
                text: "By Timing",
              },
              {
                value: `AGE`,
                text: "By Age",
              },
              {
                value: "SUMMARY",

                text: "Summary",
              },
              {
                value: "DEFAULT",

                text: "Default",
              },
            ];
          }
        }
        if (this.moduleKey === "dqrDashboard") {
          // if (
          // 	this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          // ) {
          // 	subGroups = [
          // 		{
          // 			value: "DEFAULT",
          // 			text: "Default",
          // 		},
          // 	];
          // } else {
          subGroups = [
            {
              label: "Completeness and Timeliness",
              options: [
                {
                  value: `${group}-CT-actualRR`,
                  text: "Reporting Rate (Actual)",
                },
                {
                  value: `${group}-CT-onTimeRR`,
                  text: "Reporting Rate (On Time)",
                },
              ],
            },
            {
              label: "Internal Consistency",
              options: [
                {
                  value: `${group}-IC-aggregate`,
                  text: "Aggregate",
                },
                {
                  value: `${group}-IC-method`,
                  text: "Methods",
                },
              ],
            },
            {
              label: "Internal Consistency Correlation",
              options: [
                {
                  value: `${group}-CC-method`,
                  text: "Method",
                },
              ],
            },
            {
              label: "Default",
              options: [
                {
                  value: "DEFAULT",
                  text: "Default",
                },
              ],
            },
          ];
          // }
        }
        return subGroups;
      };
    },
  },
  methods: {
    updateBenchmarks({
      tInd,
      stInd,
      cInd,
      dataMapping,
      chartCategory,
      chartDataSum,
    }) {
      let remove = false;
      if (
        chartCategory !== "regional" ||
        (dataMapping.length > 1 &&
          chartCategory === "regional" &&
          !chartDataSum) ||
        (dataMapping.length > 1 && chartCategory !== "regional") ||
        (chartCategory !== "regional" && !chartDataSum)
      ) {
        remove = true;
      }
      if (remove) {
        let b =
          this.tabs[tInd].subTabs[stInd].chartSetting[cInd].chartOptions
            .benchmarks;
        this.tabs[tInd].subTabs[stInd].chartSetting[
          cInd
        ].chartOptions.benchmarks = b.filter((c) => !c.includes("national"));
      }
    },
    copyTo({ tInd, stInd, cmInd, key = "chartSetting" }) {
      this.copyToKey = key;
      this.levelsSelect = this.tabs[tInd].subTabs[stInd][key][
        cmInd
      ].chartOptions.levels.map((l) => ({
        text: l.levelName,
        value: l.level,
      }));
      this.copyLevels =
        this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions.levels;
      this.selectedLevel = null;
      this.selectedTreeLevel = [];
      this.selectedCopyOption = [];
      this.$nextTick(() => {
        this.$bvModal.show("copyToModal" + tInd + stInd + cmInd);
      });
    },
    copy({ tInd, stInd, cmInd }) {
      let mData = JSON.parse(
        JSON.stringify(this.tabs[tInd].subTabs[stInd][this.copyToKey][cmInd])
      );
      let levels = mData.chartOptions.levels,
        sourceLevel = levels.filter((l) => l.level === this.selectedLevel),
        targetLevel = levels.filter((l) =>
          this.selectedTreeLevel.includes(l.level)
        ),
        updatedTargetLevels = [],
        pendingLevel = levels.filter(
          (l) => !this.selectedTreeLevel.includes(l.level)
        );
      targetLevel.forEach((t) => {
        let updatedScale = [];
        t.scales.forEach((s, j) => {
          if (this.selectedCopyOption.includes("labels")) {
            s = { ...s, scaleLabel: sourceLevel[0].scales[j].scaleLabel };
          }
          if (this.selectedCopyOption.includes("range")) {
            s = {
              ...s,
              highScale: sourceLevel[0].scales[j].highScale,
              lowScale: sourceLevel[0].scales[j].lowScale,
            };
          }
          if (this.selectedCopyOption.includes("colors")) {
            s = { ...s, scaleColor: sourceLevel[0].scales[j].scaleColor };
          }
          updatedScale[j] = s;
        });
        updatedTargetLevels.push({ ...t, scales: updatedScale });
      });
      let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
        (a, b) => {
          return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
        }
      );
      this.tabs[tInd].subTabs[stInd][this.copyToKey][
        cmInd
      ].chartOptions.levels = finalLevels;
      this.$nextTick(() => {
        this.$bvModal.hide("copyToModal" + tInd + stInd + cmInd);
      });
    },
    applyPalette({
      tInd,
      stInd,
      cmInd,
      shades,
      levelInd = "all",
      key = "chartSetting",
    }) {
      let updatedChart = {
        chartOptions: {
          ...this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions,
          levels: this.tabs[tInd].subTabs[stInd][key][
            cmInd
          ].chartOptions.levels.map((level, lInd) => {
            if (levelInd !== "all") {
              if (lInd === levelInd) {
                return {
                  ...level,
                  scales: level.scales.map((scale, k) => ({
                    ...scale,
                    scaleColor: shades[k],
                  })),
                };
              } else {
                return level;
              }
            } else {
              return {
                ...level,
                scales: level.scales.map((scale, k) => ({
                  ...scale,
                  scaleColor: shades[k],
                })),
              };
            }
          }),
        },
      };
      this.$set(this.tabs[tInd].subTabs[stInd][key], cmInd, updatedChart);
    },
    hideModal() {
      this.dataEntryID = "";
      this.isDataEntry = false;
    },
    dataEntry(id) {
      this.dataEntryID = id;
      this.isDataEntry = true;
    },
    getConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey(this.moduleKey);

      service
        .getSavedConfig(key)
        .then((response) => {
          this.tabs = response.data;
          this.originalTabs = JSON.parse(JSON.stringify(response.data));
          this.isDataFetched = true;
          this.$store.state.loading = false;
        })
        .catch(() => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.state.loading = false;
        });
    },
    async updateConfig() {
      this.$store.state.loading = true;
      let tabs = [];
      if (this.tabs.length) {
        tabs = this.tabs.map(async (t) => {
          let subTabs = t.subTabs.map(async (st) => {
            let chartSetting = st.chartSetting.map(async (d) => {
              let cid = "";
              if (d.chartOptions && !d.chartOptions.cid) {
                try {
                  let resp = await service.createDHISChart(
                    `${randomString(16)} ${d.chartOptions.chartName}`
                  );
                  if (resp.data.status === "OK") {
                    cid = resp.data.response.uid;
                  }
                } catch (err) {
                  console.log(err);
                }
              } else {
                return d;
              }
              return {
                chartOptions: {
                  ...d.chartOptions,
                  cid,
                },
              };
            });
            chartSetting = await Promise.all(chartSetting);
            return {
              ...st,
              chartSetting: chartSetting,
            };
          });
          subTabs = await Promise.all(subTabs);
          return {
            ...t,
            subTabs: subTabs,
          };
        });
        tabs = await Promise.all(tabs);
      }
      let key = this.generateKey(this.moduleKey);
      service
        .getSavedConfig(key)
        .then((res) => {
          // let configData = assign(res.data, tabs);
          let configData = tabs;
          let response = service.updateConfig(configData, key);
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.$swal({
                  title: this.$i18n.t("data_saved_successfully"),
                }).then(() => {
                  // if (Object.keys(configChanges).length) {
                  // 	audit.processAudit(
                  // 		"process2",
                  // 		key,
                  // 		configChanges,
                  // 		this.chartByType,
                  // 		this.chartBySubtype
                  // 	);
                  // }
                });
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
            .catch(() => {
              this.$swal({
                title: this.$i18n.t("error"),
              });
              this.$store.state.loading = false;
              return;
            });
        })
        .catch(() => {
          let response = service.saveConfig(tabs, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
              });
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
        });
    },
    moveItem({ type, places, tInd, stInd, cInd, qInd }) {
      let target = null,
        updateInd = null;
      if (type === "tab") {
        target = this.tabs;
        updateInd = tInd;
      }
      if (type === "subTab") {
        target = this.tabs[tInd].subTabs;
        updateInd = stInd;
      }
      if (type === "chartSetting") {
        target = this.tabs[tInd].subTabs[stInd].chartSetting;
        updateInd = cInd;
      }
      if (type === "mapSetting") {
        target = this.tabs[tInd].subTabs[stInd].mapSetting;
        updateInd = cInd;
      }
      if (type === "question") {
        target = this.tabs[tInd].subTabs[stInd].questions;
        updateInd = qInd;
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
    resetModal({ type }) {
      if (type === "tab") {
        this.groupName = null;
        this.updateIndex = null;
        this.updateType = null;
        this.showGroups = false;
        this.updateSubIndex = null;
        this.updatedTabName = "";
      }
    },
    deleteElement({ type, tInd, stInd, delInd }) {
      if (type === "mapSetting") {
        this.$swal({
          title: "Can't delete the default setting. Please try disabling it.",
        });
      } else {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
        }).then((result) => {
          if (result.value) {
            if (type === "tab") {
              this.tabs.splice(tInd, 1);
            }
            if (type === "subTab") {
              this.tabs[tInd].subTabs.splice(stInd, 1);
            }
            if (type === "chartSetting") {
              this.tabs[tInd].subTabs[stInd].chartSetting.splice(delInd, 1);
            }
          }
        });
      }
    },
    addElement({ type, tInd, stInd, mKey = "chartSetting" }) {
      let randomStr = randomString(16);
      if (type === "chartSetting") {
        let config = JSON.parse(JSON.stringify(this.chartSettingConfig));
        this.tabs[tInd].subTabs[stInd].chartSetting.push({
          ...config,
          chartOptions: {
            ...config.chartOptions,
            id: randomStr,
          },
        });
      }
      if (type === "mapSetting") {
        let map = this.getMapConfig(randomStr);
        this.tabs[tInd].subTabs[stInd][mKey].push(map);
      }
    },
    getMapConfig(randomStr) {
      let map = JSON.parse(JSON.stringify(this.mapSettingConfig));
      map = {
        chartOptions: {
          ...map.chartOptions,
          levels: JSON.parse(JSON.stringify(this.levels)),
          id: randomStr,
        },
      };
      return map;
    },
    actionOnQuestion({ type, tInd, stInd, qInd }) {
      if (type === "add") {
        this.signOffTab = tInd;
        this.signOffSubTab = stInd;
        let signOff = JSON.parse(JSON.stringify(this.signOff));
        this.signOffQuestion = {
          ...signOff,
          id: randomString(16),
        };
        this.$nextTick(() => {
          this.questionModel = true;
        });
      }
      if (type === "edit") {
        this.signOffTab = tInd;
        this.signOffSubTab = stInd;
        this.signOffQuestion = JSON.parse(
          JSON.stringify(
            this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions[
              qInd
            ]
          )
        );
        this.$nextTick(() => {
          this.questionModel = true;
        });
      }
      if (type === "delete") {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
        }).then((result) => {
          if (result.value) {
            this.tabs[this.signOffTab].subTabs[
              this.signOffSubTab
            ].questions.splice(qInd, 1);
          }
        });
      }
      if (type === "update") {
        let que =
          this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions;
        let isFound = que.findIndex((q) => q.id === this.signOffQuestion.id);
        if (isFound >= 0) {
          que[isFound] = this.signOffQuestion;
        } else {
          que.push(this.signOffQuestion);
        }
      }
    },
    actionOnOption({ type, qInd }) {
      if (type === "add") {
        this.signOffQuestion.options.push({
          value: randomString(16),
          text: this.$i18n.t("default"),
        });
      }
      if (type === "delete") {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
        }).then((result) => {
          if (result.value) {
            this.signOffQuestion.options.splice(qInd, 1);
          }
        });
      }
    },
    handleOk() {
      if (this.updateType === "type1") {
        let mapSetting = [];
        if (this.moduleKey === "analyticalDashboard") {
          let map = this.getMapConfig(randomString(16));
          mapSetting.push(map);
        }
        this.tabs.push({
          tabName: this.updatedTabName,
          id: randomString(16),
          group: this.groupName,
          showGroups: this.showGroups,
          subTabs: [
            {
              group: null,
              mapSetting,
              signOff: [],
              questions: [],
              chartSetting: [],
              id: randomString(16),
              backgroundData: null,
              tabName: this.$i18n.t("default"),
              summary:
                this.moduleKey === "summaryDashboard"
                  ? JSON.parse(JSON.stringify(this.summary))
                  : null,
              integrated:
                this.moduleKey === "summaryDashboard" &&
                this.$store.getters.getNamespace ===
                  "multi_program_mnch-dashboard"
                  ? JSON.parse(JSON.stringify(this.integrated))
                  : null,
            },
          ],
        });
      }
      if (this.updateType === "type11") {
        this.tabs[this.updateIndex].tabName = this.updatedTabName;
        this.tabs[this.updateIndex].group = this.groupName;
        this.tabs[this.updateIndex].showGroups = this.showGroups;
      }
      if (this.updateType === "type2") {
        let mapSetting = [];
        if (this.moduleKey === "analyticalDashboard") {
          let map = this.getMapConfig(randomString(16));
          mapSetting.push(map);
        }
        this.tabs[this.updateIndex].subTabs.push({
          mapSetting,
          group: null,
          signOff: [],
          questions: [],
          chartSetting: [],
          id: randomString(16),
          backgroundData: null,
          tabName: this.updatedTabName,
          summary:
            this.moduleKey === "summaryDashboard"
              ? JSON.parse(JSON.stringify(this.summary))
              : null,
          integrated:
            this.moduleKey === "summaryDashboard" &&
            this.$store.getters.getNamespace === "multi_program_mnch-dashboard"
              ? JSON.parse(JSON.stringify(this.integrated))
              : null,
        });
      }
      if (this.updateType === "type21") {
        this.tabs[this.updateIndex].subTabs[this.updateSubIndex].tabName =
          this.updatedTabName;
      }
      //To reset modal values
      this.resetModal({ type: "tab" });
    },
    updatedBGData({ tInd, stInd, group }) {
      let bgData = JSON.parse(JSON.stringify(this.backgroundData));
      if (group.includes("-IC-")) {
        this.tabs[tInd].subTabs[stInd].backgroundData = bgData.IC;
      } else if (group.includes("-CC-")) {
        this.tabs[tInd].subTabs[stInd].backgroundData = bgData.CC;
      } else {
        this.tabs[tInd].subTabs[stInd].backgroundData = null;
      }
      if (group === "SUMMARY") {
        if (this.tabs[tInd].subTabs[stInd].mapSetting.length === 0) {
          this.addElement({
            type: "mapSetting",
            tInd: tInd,
            stInd: stInd,
            mKey: "mapSetting",
          });
        }
      }
    },
    updateTab({
      type,
      tInd = null,
      group = null,
      stInd = null,
      tabName = "",
      showGroups = false,
    }) {
      let n = tabName;
      this.updateIndex = tInd;
      this.groupName = group;
      this.updateType = type;
      this.updateSubIndex = stInd;
      this.updatedTabName = n;
      this.showGroups = showGroups;
      this.$nextTick(() => {
        this.tabNameModal = true;
      });
    },
    getGroupList() {
      let gList = [
        {
          value: "ANC",
          text: "ANC",
        },
        {
          value: "PNC",
          text: "PNC",
        },
        {
          value: "DELIVERY_CARE",
          text: "Delivery Care",
        },
        {
          value: "MAT_DEATHS",
          text: "Maternal Deaths",
        },
        {
          value: "SBN_DEATHS",
          text: "Stillbirth and Neonatal Deaths",
        },
        {
          value: "INF_HEALTH",
          text: "Infant Health Secondary",
        },
        {
          value: "DEFAULT",
          text: "Default",
        },
      ];
      if (this.$store.getters.getNamespace !== "multi_program_mnch-dashboard") {
        gList = [
          {
            value: "User",
            text: "Users",
          },
          {
            value: "Visits",
            text: "Visits",
          },
          {
            value: "Commodities_Client",
            text: "Commodities (Client)",
          },
          {
            value: "Commodities_Facilities",
            text: "Commodities (Facilities)",
          },
          {
            value: "DEFAULT",
            text: "Default",
          },
        ];
      }
      return gList;
    },
  },
  created() {
    this.groups = this.getGroupList();
    this.getConfigData();
  },
};
</script>
