<template>
  <div class="report-data">
    <b-modal
      v-model="setReportPopup"
      hide-footer
      id="setReport"
      size="xl"
      scrollable
      body-class="p-0"
      no-close-on-backdrop
      :ok-title="$t('ok')"
      :cancel-title="$t('cancelbtn')"
    >
      <template #modal-header="{ close }">
        <div
          class="
            report-modal
            align-items-center
            d-flex
            justify-content-between
            w-100
            py-2
          "
        >
          <h5 class="m-0">{{ templateObj.templateName }}</h5>
          <span>
            <button
              type="button"
              class="repBtn btn btn-sm btn-secondary ml-3"
              @click.prevent="addChartSection = true"
            >
              {{ $t("subMenu_3") }}
            </button>
            <button
              type="button"
              class="repBtn btn btn-sm btn-secondary ml-3"
              @click.prevent="showAddTextPopup(null)"
            >
              {{ $t("addtext") }}
            </button>
            <button
              type="button"
              class="repBtn btn btn-sm btn-secondary ml-3"
              @click.prevent="saveReportTemplate"
            >
              {{ $t("savebtn") }}
            </button>
            <i class="fa fa-close cursor-pointer ml-4" @click="close()"></i>
          </span>
        </div>
      </template>
      <div class="row m-0 py-3" id="addSection">
        <div class="col-12">
          <div class="mb-3" style="max-width: 790px; margin: auto">
            <label>{{ $t("headerFooter") }}</label>
            <div>
              <b-form-checkbox
                inline
                switch
                size="sm"
                className="createText"
                v-model="templateObj.details[0].user"
                v-if="
                  templateObj.details &&
                  templateObj.details.length &&
                  templateObj.details[0]
                "
                >{{ $t("createdBy") }}</b-form-checkbox
              >
              <b-form-checkbox
                inline
                switch
                size="sm"
                className="createText"
                v-model="templateObj.details[1].timestamp"
                v-if="
                  templateObj.details &&
                  templateObj.details.length &&
                  templateObj.details[1]
                "
                >{{ $t("timestamp") }}</b-form-checkbox
              >
              <b-form-checkbox
                inline
                switch
                size="sm"
                v-model="templateObj.details[2].location"
                v-if="
                  templateObj.details &&
                  templateObj.details.length &&
                  templateObj.details[2]
                "
                >{{ $t("location") }}</b-form-checkbox
              >
              <b-form-checkbox
                inline
                switch
                size="sm"
                v-model="templateObj.details[3].pageCount"
                v-if="
                  templateObj.details &&
                  templateObj.details.length &&
                  templateObj.details[3]
                "
                >{{ $t("pageCount") }}</b-form-checkbox
              >
            </div>
          </div>
        </div>
        <div class="col-12 grid-layout-section">
          <gridLayout
            :isReport="true"
            ref="gridLayout"
            :excludedHeight="55"
            :isStaticHeader="true"
            :isStaticCharts="true"
            :isHeaderFooter="true"
            :layout.sync="templateObj"
            :updatedGridLayout="{
              rowHeight: 10,
            }"
            :wrapperStyle="{
              maxWidth: '790px',
              backgroundColor: '#12122a',
              margin: 'auto',
            }"
            configKey="selectedCharts"
            @showAddTextPopup="showAddTextPopup"
            class="grid-down"
          />
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="addChartSection"
      hide-footer
      scrollable
      body-class="p-0 bg-faint-grey"
      no-close-on-backdrop
      :title="$t('subMenu_3')"
    >
      <div class="p-3">
        <div class="row mb-3">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("dashboard")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedDashboard"
              :options="dashboardList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="modulesList.length">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("module")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedModule"
              :options="modulesList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="categoryList.length">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("category")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedCategory"
              :options="categoryList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="sourceList.length">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("source")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedSource"
              :options="sourceList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="typeList.length">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("type")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedType"
              :options="typeList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="chartsList.length">
          <label class="col-lg-3 col-sm-6 col-form-label">{{
            $t("chart")
          }}</label>
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="selectedChart"
              :options="chartsList"
            ></b-form-select>
          </div>
        </div>
        <div class="row mb-3" v-if="chartsList.length === 0 && selectedSource">
          <div class="col-7 offset-3 text-center">
            {{ $t("maperror_msg") }}
          </div>
        </div>
        <div
          class="row mb-3"
          v-if="
            selectedChart &&
            !selectedModule.includes('interactive') &&
            !selectedModule.includes('emu')
          "
        >
          <label class="col-lg-3 col-sm-6 col-form-label"
            >{{ $t("period") }} {{ $t("type") }}</label
          >
          <div class="col-lg-7 col-sm-6">
            <b-form-select
              v-model="periodType"
              :options="filteredPeriodTypeList"
            ></b-form-select>
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button
              type="button"
              class="btn btn-sm btn-secondary ml-3 addgrey-report"
              @click.prevent="addChartToTemplate"
              :disabled="!selectedChart"
            >
              {{ $t("addbtn") }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary ml-3 cancelgrey-report"
              @click.prevent="cancelAddChart"
            >
              {{ $t("cancelbtn") }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="addTextSection"
      hide-footer
      scrollable
      body-class="p-0 bg-faint-grey"
      no-close-on-backdrop
      :title="$t('addtext')"
    >
      <div class="p-3">
        <div class="row">
          <div class="col-12">
            <vue-editor
              v-model="chartText"
              :state="chartText.length !== 0"
              :editorOptions="editorSettings"
              placeholder=""
              :editorToolbar="customToolbar"
            ></vue-editor>
            <!-- :text-change="calculateHeight(chart.id, i)" -->
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button
              type="button"
              class="btn btn-sm btn-secondary ml-3 addgrey-report"
              @click.prevent="addTextToTemplate"
              :disabled="!chartText"
            >
              {{ $t("addbtn") }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary ml-3 cancelgrey-report"
              @click.prevent="cancelAddText"
            >
              {{ $t("cancelbtn") }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
/*global settings*/
import service from "@/service";
import { randomString } from "@/components/Common/commonFunctions";
import { VueEditor, Quill } from "vue2-editor";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize";
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

//To adjust alignments of the images
var BaseImageFormat = Quill.import("formats/image");
const ImageFormatAttributesList = ["alt", "height", "width", "style"];

class ImageFormat extends BaseImageFormat {
  static formats(domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  format(name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(ImageFormat, true);

const chartConfig = {
  chart: {
    type: "line",
    width: 750,
    height: 455,
  },
  title: {
    text: "",
  },
  subtitle: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  series: [],
};

export default {
  props: ["periodTypeList"],
  components: {
    VueEditor,
    gridLayout: () =>
      import(
        /*webpackChunkName: 'GridLayoutComponent'*/ "@/components/ReportTemplate/GridLayoutComponent"
      ),
  },
  mixins: [VueEditorOptionMixin],
  data() {
    return {
      dashboardList: [],
      modulesObj: {},
      modulesList: [],
      categoryList: [],
      sourceList: [],
      chartsList: [],
      typeList: [],
      periodType: "",
      moduleGroup: null,
      moduleConfig: null,
      selectedSource: null,
      selectedType: null,
      selectedChart: null,
      selectedCategory: null,
      selectedModule: null,
      selectedDashboard: null,
      isEditChart: null,
      setReportPopup: false,
      templateObj: {},
      addChartSection: false,
      addTextSection: false,
      chartText: "",
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {},
        },
      },
      originalConfigs: {},
      editTextID: null,
      editChartText: false,
    };
  },
  watch: {
    selectedDashboard(newValue) {
      this.selectedModule = null;
      this.resetChartValues();
      if (newValue) {
        this.modulesList = [
          ...this.modulesObj["common"],
          ...this.modulesObj[newValue],
        ];
      } else {
        this.modulesList = [];
      }
    },
    selectedModule(newValue) {
      if (newValue) {
        this.resetChartValues("all");
        let m = newValue.split("-");
        this.moduleGroup = m[1];
        this.getModuleConfig(m[0]);
      }
    },
    selectedCategory(newValue) {
      if (newValue) {
        this.resetChartValues("category");
        if (this.moduleGroup === "G7") {
          this.getSources(newValue);
        } else {
          this.getCharts(newValue);
        }
      }
    },
    selectedSource(newValue) {
      if (newValue) {
        this.resetChartValues("source");
        this.getCharts(newValue);
      }
    },
    selectedType(newValue) {
      if (newValue) {
        this.resetChartValues("type");
        this.getCharts(newValue);
      }
    },
  },
  computed: {
    filteredPeriodTypeList() {
      let filteredList = [];
      this.periodTypeList.forEach((p) => {
        if (p.value === "monthly" || p.value === "yearly") {
          filteredList.push(p);
        } else {
          if (this.selectedSource !== "EMU") {
            filteredList.push(p);
          }
        }
      });
      return filteredList;
    },
  },
  methods: {
    showAddTextPopup(chart = null) {
      if (chart) {
        this.chartText = chart.text;
        this.editTextID = chart.id;
        this.editChartText = true;
      } else {
        this.chartText = "";
      }
      this.addTextSection = true;
    },
    saveReportTemplate() {
      this.$store.state.loading = true;
      this.templateObj.updatedAt = this.$moment(new Date()).format("lll");
      let charts = [...this.templateObj.selectedCharts];
      charts = charts.sort((a, b) => {
        let comparison = 0;
        if (a.y > b.y) {
          comparison = 1;
        } else if (a.y < b.y) {
          comparison = -1;
        }
        return comparison;
      });
      this.templateObj.selectedCharts = charts;
      let key = this.generateKey("reportTemplates");
      service
        .getSavedConfig(key)
        .then((res) => {
          let reportTemplates = res.data;
          let templateIndex = res.data.findIndex(
            (t) => t.templateId === this.templateObj.templateId
          );
          if (templateIndex >= 0) {
            reportTemplates[templateIndex] = this.templateObj;
          } else {
            reportTemplates = [...res.data, this.templateObj];
          }
          service.updateConfig(reportTemplates, key).then((response) => {
            this.handleResponse(response, this.templateObj);
          });
        })
        .catch(() => {
          console.log("Report templates not found, adding new...");
          service.saveConfig([this.templateObj], key).then((response) => {
            this.handleResponse(response, this.templateObj);
          });
        });
    },
    handleResponse(response, templateObj) {
      if (response.data.status === "OK") {
        this.sweetAlert({
          title: this.$i18n.t("data_saved_successfully"),
        });
        this.$emit("updateModule", templateObj);
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
    setReportModal(obj) {
      this.templateObj = JSON.parse(JSON.stringify(obj));
      this.$nextTick(() => {
        this.setReportPopup = true;
      });
    },
    getModuleConfig(newValue) {
      let selectedDashboard =
        newValue === "interactive" ? "" : this.selectedDashboard;
      if (this.originalConfigs[`${newValue}_${selectedDashboard}`]) {
        this.moduleConfig = this.originalConfigs[`${newValue}_${selectedDashboard}`];
        this.$nextTick(() => {
          this.processModuleConfig(newValue);
        });
      } else {
        this.$store.state.loading = true;
        let key = this.generateKey(newValue);
        service
          .getSavedConfig(key, false, selectedDashboard)
          .then((response) => {
            if (response.data) {
              this.moduleConfig = this.originalConfigs[`${newValue}_${selectedDashboard}`] =
                response.data;
              this.$nextTick(() => {
                this.processModuleConfig(newValue);
              });
            }
            this.$store.state.loading = false;
          })
          .catch((res) => {
            console.log("Config not found...");
            this.$store.state.loading = false;
          });
      }
    },
    processModuleConfig(newValue) {
      if (this.moduleGroup === "G7") {
        this.setCategoryList(newValue);
      }
      if (this.moduleGroup === "G5") {
        this.selectedCategory = this.selectedModule.split("-")[2];
      }
      if (this.moduleGroup === "G6") {
        this.getCharts(newValue);
      }
    },
    setCategoryList(newValue) {
      if (
        newValue === "summaryDashboard" ||
        newValue === "analyticalDashboard" ||
        newValue === "dqrDashboard"
      ) {
        this.moduleConfig.forEach((m) => {
          this.categoryList.push({
            value: `${m.id}`,
            text: m.tabName[this.$i18n.locale],
          });
        });
      }
    },
    getCharts(newValue) {
      if (this.moduleGroup === "G5") {
        let source =
          newValue === "emu"
            ? "Output"
            : this.moduleConfig[newValue].Background_Data.autoSaveEMU;
        let chartIndex = newValue === "emu" ? -1 : 2;
        this.moduleConfig[newValue][source].derivedCharts.forEach((c, i) => {
          if (i > chartIndex && c.chartOptions && c.chartOptions.cid) {
            if (
              newValue === "emu" &&
              i < this.moduleConfig[newValue][source].derivedCharts.length - 1
            ) {
              this.chartsList.push({
                value: c.chartOptions.cid,
                text: c.chartOptions.chartName[this.$i18n.locale],
              });
            }
            if (newValue !== "emu") {
              this.chartsList.push({
                value: c.chartOptions.cid,
                text: c.chartOptions.chartName[this.$i18n.locale],
              });
            }
          }
        });
      } else if (this.moduleGroup === "G6") {
        this.moduleConfig.forEach((c) => {
          if (c.id) {
            this.chartsList.push({
              value: c.id,
              text: c.name[this.$i18n.locale],
            });
          }
        });
      } else if (this.moduleGroup === "G7") {
        let mFound = this.moduleConfig.find(
          (m) => m.id === this.selectedCategory
        );
        if (mFound) {
          let sFound = mFound.subTabs.find((s) => s.id === newValue);
          if (sFound) {
            sFound.chartSetting.forEach((c) => {
              if (
                c.chartOptions &&
                c.chartOptions.cid &&
                c.chartOptions.chartName &&
                !c.chartOptions.isSavedData
              ) {
                this.chartsList.push({
                  value: c.chartOptions.cid,
                  text: c.chartOptions.chartName[this.$i18n.locale],
                });
              }
            });
          }
        }
      }
    },
    getSources(newValue) {
      if (this.moduleGroup === "G7") {
        let isFound = this.moduleConfig.find((m) => m.id === newValue);
        if (isFound) {
          isFound.subTabs.forEach((s) => {
            this.sourceList.push({
              value: s.id,
              text: s.tabName[this.$i18n.locale],
            });
          });
        }
      }
    },
    getTypes(newValue) {
      this.moduleConfig[this.selectedCategory][newValue].chartData.forEach(
        (c) => {
          this.typeList.push({
            value: c.indicator.static_name,
            text: this.$i18n.t(`${c.indicator.static_name}`),
          });
        }
      );
    },
    addChartToTemplate() {
      let chart = this.chartsList.find((c) => c.value === this.selectedChart);
      let id = randomString(16);
      let updatedCID = `${id}/${chart.value}`;

      let findY = 0;
      if (this.templateObj && this.templateObj.selectedCharts.length) {
        let item = null;
        this.templateObj.selectedCharts.forEach((m) => {
          if (item) {
            if (item.y < m.y) {
              item = m;
            }
          } else {
            item = m;
          }
        });
        findY = item.y + item.h;
      }
      let includeLocationPeriod =
        !this.selectedModule.includes("interactive") &&
        !this.selectedModule.includes("emu");
      let pType = null;
      let m = this.selectedModule.split("-");
      if (m.length > 2 && m[2] === "emu") {
        pType = "yearly";
      }
      if (m.length > 2 && m[2] === "emu_monthly") {
        pType = "monthly";
      }
      if (pType) {
        this.periodType = pType;
      }
      let canCallAPI = true;
      let isFound = this.templateObj.selectedCharts.find(
        (c) =>
          c.selectedModule === this.selectedModule &&
          c.selectedCategory === this.selectedCategory &&
          c.selectedSource === this.selectedSource &&
          c.selectedType === this.selectedType &&
          c.periodType === this.periodType &&
          c.canCallAPI
      );
      if (isFound) {
        canCallAPI = false;
        let isFoundIndex = this.templateObj.selectedCharts.findIndex(
          (c) =>
            c.selectedModule === this.selectedModule &&
            c.selectedCategory === this.selectedCategory &&
            c.selectedSource === this.selectedSource &&
            c.selectedType === this.selectedType &&
            c.periodType === this.periodType &&
            c.canCallAPI
        );
        if (isFoundIndex >= 0) {
          this.templateObj.selectedCharts[isFoundIndex].linkedCharts = [
            ...this.templateObj.selectedCharts[isFoundIndex].linkedCharts,
            updatedCID,
          ];
        }
      }
      let chartDetails = {
        id: id,
        i: id,
        selectedDashboard: this.selectedDashboard,
        selectedModule: this.selectedModule,
        selectedCategory: this.selectedCategory,
        selectedSource: this.selectedSource,
        selectedType: this.selectedType,
        cid: updatedCID,
        name: chart.text,
        location: includeLocationPeriod ? this.selectedLocation : null,
        periodType: includeLocationPeriod ? this.periodType : pType,
        period: includeLocationPeriod ? this.selectedPeriod : null,
        canCallAPI: canCallAPI,
        linkedCharts: [],
        chartData: JSON.parse(JSON.stringify(chartConfig)),
        x: 0,
        y: findY,
        w: 12,
        h: 26,
      };
      this.templateObj.selectedCharts.push(chartDetails);
      this.cancelAddChart();
    },
    addTextToTemplate() {
      if (this.editChartText) {
        this.templateObj.selectedCharts = this.templateObj.selectedCharts.map(
          (m) => {
            if (m.id === this.editTextID) {
              m.text = this.chartText;
            }
            return m;
          }
        );
        this.editTextID = null;
        this.editChartText = false;
        this.$refs.gridLayout.updateSetting(null);
      } else {
        let findY = 0;
        if (this.templateObj && this.templateObj.selectedCharts.length) {
          let item = null;
          this.templateObj.selectedCharts.forEach((m) => {
            if (item) {
              if (item.y < m.y) {
                item = m;
              }
            } else {
              item = m;
            }
          });
          findY = item.y + item.h;
        }
        let id = randomString(16);
        let newItem = {
          id: id,
          i: id,
          x: 0,
          y: findY,
          w: 12,
          h: 13,
          text: this.chartText,
          type: "Textarea",
          showInCard: false,
        };
        let allCharts = [...this.templateObj.selectedCharts, newItem];
        this.templateObj.selectedCharts = [];
        this.$nextTick(() => {
          this.templateObj.selectedCharts = allCharts;
        });
      }
      this.addTextSection = false;
    },
    cancelAddText() {
      this.chartText = "";
      this.addTextSection = false;
    },
    cancelAddChart() {
      this.resetChartValues("all");
      this.selectedDashboard = null;
      this.selectedModule = null;
      this.addChartSection = false;
    },
    resetChartValues(type = "all") {
      if (type === "category") {
        this.sourceList = [];
        this.selectedSource = null;
        this.chartsList = [];
        this.selectedChart = null;
      } else if (type === "source") {
        this.chartsList = [];
        this.selectedChart = null;
        this.typeList = [];
        this.selectedType = null;
      } else if (type === "type") {
        this.chartsList = [];
        this.selectedChart = null;
      } else if (type === "all") {
        this.categoryList = [];
        this.selectedCategory = null;
        this.sourceList = [];
        this.selectedSource = null;
        this.chartsList = [];
        this.selectedChart = null;
        this.typeList = [];
        this.selectedType = null;
        this.moduleConfig = null;
        this.periodType = "";
      }
    },
  },
  created() {
    let programs = [];
    if (this.$store.getters.getIsAdmin) {
      programs = this.$store.getters.getAppSettings.modulesList;
    } else {
      programs = this.$store.getters.getUserPermissions?.dashboards || [];
    }
    programs.forEach((p) => {
      let text = "";

      if (p.includes("mnch")) {
        text = this.$i18n.t("maternalHealth");
      }
      if (p.includes("fp")) {
        text = this.$i18n.t("family_planning");
      }
      this.dashboardList.push({
        text,
        value: `${p}-dashboard`,
      });
    });
    this.modulesObj = {
      common: [
        {
          value: "interactive-G6",
          text: this.$i18n.t("saved"),
        },
        {
          value: "summaryDashboard-G7",
          text: this.$i18n.t("summary_dashboard"),
        },
        {
          value: "analyticalDashboard-G7",
          text: this.$i18n.t("analytical_dashboard"),
        },
        {
          value: "dqrDashboard-G7",
          text: this.$i18n.t("DQR"),
        },
      ],
      "mnch-dashboard": [],
      "fp-dashboard": [
        {
          value: "dqrModule-G5-emu_monthly",
          text:
            this.$i18n.t("benchmarking") + " - " + this.$i18n.t("emu_monthly"),
        },
        {
          value: "dqrModule-G5-emu",
          text:
            this.$i18n.t("benchmarking") + " - " + this.$i18n.t("emu_annual"),
        },
      ],
    };
  },
};
</script>
<style lang="scss">
@media (min-width: 1200px) {
  #setReport .modal-xl {
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    .modal-content {
      max-height: 100%;
    }
  }
}
.ql-editor.resetHeight {
  min-height: 100% !important;
}
</style>
