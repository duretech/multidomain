<template>
  <div class="report mt-5 mb-0">
    <div class="report-container p-4">
      <b-collapse
        class="saved-fav-accordian mt-3"
        id="accordion-1"
        v-model="savedTemplatesVisible"
      >
        <div class="saved-report-card-border mb-3">
          <div class="title-report-card fs-19-1920">Saved Reports</div>
          <b-row class="py-3" v-if="reportTemplates.length > 0">
            <b-col
              sm="4"
              class="mb-3"
              v-for="template in reportTemplates"
              :key="template.templateId"
              ><div class="saved-report-card p-2">
                <div class="img-title-flex mt-1">
                  <div class="saved-report-card-img-container">
                    <img
                      alt="img"
                      :src="require(`@/assets/img/home/report.png`)"
                    />
                  </div>
                  <div class="saved-report-card-title fs-17-1920">
                    <span> {{ template.templateName }}</span>
                  </div>
                </div>
                <div
                  class="saved-report-card-opt"
                  v-if="template.createdByID === $store.state.loggedInUserId"
                >
                  <div
                    class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                    @click.prevent.stop="viewModule(template)"
                  >
                    <img
                      :src="require('@/assets/images/icons/preview  hover.png')"
                    /><span>{{ $t("view") }}</span>
                  </div>
                  <div
                    class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                    @click.prevent.stop="editModule(template)"
                  >
                    <img
                      :src="
                        require('@/assets/images/edit_new_active_white.png')
                      "
                    /><span>{{ $t("edit") }}</span>
                  </div>
                  <div
                    class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                    @click.prevent.stop="editModule(template, true)"
                  >
                    <img
                      :src="
                        require('@/assets/images/edit_new_active_white.png')
                      "
                    /><span>{{ $t("clone") }}</span>
                  </div>
                  <div
                    class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                    @click.prevent.stop="deleteModule(template.templateId)"
                  >
                    <img
                      :src="require('@/assets/images/icons/delete hover.png')"
                    /><span>{{ $t("deletebtn") }}</span>
                  </div>
                </div>
                <div class="saved-report-card-opt" v-else>
                  You are not owner of this report
                </div>
              </div></b-col
            >
          </b-row>
          <b-row class="py-3" v-else>
            <b-col>
              <b-alert variant="info" show>{{ $t("noReports") }}</b-alert>
            </b-col>
          </b-row>
        </div>
      </b-collapse>
      <div
        class="
          title-report-card
          fs-19-1920
          pb-2
          d-flex
          justify-content-between
          align-items-center
        "
        v-if="reportTemplates.length && isReportGenerated"
      >
        Selected Location Report
        <button
          type="button"
          class="btn btn-primary black-btn ml-3"
          @click.prevent.stop="downloadReport('myDivToPrint')"
          style="border: 2px solid #fff"
          :disabled="isGenerating"
        >
          {{ isGenerating ? $t("scorecardGenerating") : $t("generatePDF") }}
        </button>
      </div>
      <div
        class="myDivToPrint bg-white"
        ref="myDivToPrint"
        v-if="reportTemplates.length && isReportGenerated"
      >
        <template v-if="selectedTemplateObj" className="reportCards">
          <gridLayout
            :isReport="true"
            ref="gridLayout"
            :excludedHeight="55"
            :isHeaderFooter="true"
            @getPeriod="getPeriod"
            :configData="configData"
            :updatedGridLayout="{
              rowHeight: 10,
              isResizable: false,
              isDraggable: false,
            }"
            :wrapperStyle="{
              maxWidth: '790px',
              backgroundColor: '#12122A',
              margin: 'auto',
              color: '#d9d6d6',
            }"
            configKey="selectedCharts"
            :otherChartObj="otherChartObj"
            :layout.sync="selectedTemplateObj"
            @getCanvasHeight="getCanvasHeight"
            @getOtherChartObj="getOtherChartObj"
            :selectedLocation="selectedLocation"
            :selectedLocationName="selectedLocationName"
          />
        </template>
      </div>
      <div class="text-center my-2 text-white" v-else>
        <b-alert variant="info" show class="m-0" v-if="loadingText">{{
          loadingText
        }}</b-alert>
      </div>
    </div>
    <b-modal
      v-model="selectReportPopup"
      hide-footer
      centered
      :title="$t('exportbtn')"
      no-close-on-backdrop
    >
      <div class="row">
        <div class="col-12">
          <div class="form-group row">
            <label class="col-sm-6 col-form-label">
              {{ $t("location") }}
            </label>
            <div class="col-sm-6">
              <treeselect
                class="p-0"
                :options="options"
                :show-count="true"
                :load-options="loadOptions"
                :placeholder="$t('search')"
                v-model="selectedLocation"
                :flat="false"
                :default-expand-level="1"
              />
            </div>
          </div>
          <div
            class="form-group row"
            v-if="selectedLocation && filteredReportList.length"
          >
            <label class="col-sm-6 col-form-label">
              {{ $t("reports") }}
            </label>
            <div class="col-sm-6">
              <b-form-select
                v-model="selectedTemplate"
                :options="filteredReportList"
              ></b-form-select>
            </div>
          </div>
          <div
            class="form-group row"
            v-if="
              selectedTemplate &&
              selectedTemplateTempObj &&
              selectedTemplateTempObj.templateDesc
            "
          >
            <div class="col-sm-12 small">
              <strong
                ><i
                  class="fa fa-info-circle cursor-pointer chart-info mr-2"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: $t('description'),
                    title: '',
                    html: true,
                  }"
                ></i>
                {{ selectedTemplateTempObj.templateDesc }}</strong
              >
            </div>
          </div>
          <div
            class="form-group row"
            v-if="selectedLocation && filteredReportList.length === 0"
          >
            <div class="col-sm-12 text-center">
              {{ $t("noReports") }}
            </div>
          </div>
          <div
            class="form-group row"
            v-if="
              selectedLocation &&
              selectedTemplate &&
              selectedTemplateTempObj &&
              selectedTemplateTempObj.selectedCharts.length === 0
            "
          >
            <div class="col-sm-12 text-center">
              {{ $t("noCharts") }}
            </div>
          </div>
        </div>
        <div class="col-12 pt-3 text-right">
          <button
            type="button"
            class="btn btn-primary new-btn black-btn ml-3"
            @click.prevent.stop="generateReport"
            style="border: 2px solid #fff"
            :disabled="
              !selectedTemplate ||
              (selectedTemplateTempObj &&
                selectedTemplateTempObj.selectedCharts.length === 0)
            "
          >
            {{ $t("exportbtn") }}
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="createReportPopup"
      hide-footer
      centered
      :title="
        editReport
          ? $t('editReport')
          : cloneReport
          ? $t('cloneReport')
          : $t('createReport')
      "
      body-class="p-0"
      no-close-on-backdrop
    >
      <div class="row m-0 py-3 position-relative">
        <loader class="cardLoader" v-if="createReportLoader" />
        <div class="col-12 text-right pb-3">
          <small
            ><sup class="color-red">*</sup> {{ $t("mandatoryFields") }}</small
          >
        </div>
        <div class="col-12">
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label"
              >{{ $t("name") }}<sup class="color-red">*</sup></label
            >
            <div class="col-sm-6">
              <input
                class="form-control"
                type="text"
                v-model="templateObj.templateName"
              />
            </div>
          </div>
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label">
              {{ $t("description") }}
            </label>
            <div class="col-sm-6">
              <textarea
                class="form-control"
                type="text"
                v-model="templateObj.templateDesc"
              />
            </div>
          </div>
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label">
              {{ $t("orgLevel") }}<sup class="color-red">*</sup>
            </label>
            <div class="col-sm-6">
              <b-form-select
                v-model="templateObj.orgUnitLevel"
                :options="orgUnitList"
              ></b-form-select>
            </div>
          </div>
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label">
              {{ $t("updateFrequencyType") }}<sup class="color-red">*</sup>
            </label>
            <div class="col-sm-6">
              <b-form-select
                v-model="templateObj.updateFrequencyType"
                :options="periodTypeList"
              ></b-form-select>
            </div>
          </div>
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label">
              {{ $t("basePeriod") }}<sup class="color-red">*</sup>
            </label>
            <div class="col-sm-6">
              <b-form-select
                v-model="templateObj.basePeriod"
                :options="basePeriodList"
              ></b-form-select>
            </div>
          </div>
        </div>
        <div class="col-12 pt-3 text-right">
          <button
            type="button"
            class="btn btn-primary new-btndisable black-btn ml-3"
            @click.prevent.stop="createReport"
            style="border: 2px solid #fff"
            :disabled="!createReportDisabled"
          >
            {{ $t("submitbtn") }}
          </button>
          <button
            type="button"
            class="btn btn-secondary new-resetbtn ml-3"
            @click.prevent="resetValues"
          >
            {{ $t("resetbtn") }}
          </button>
        </div>
      </div>
    </b-modal>
    <ReportTemplateModals
      ref="setReportTemplate"
      @updateModule="updateModule"
      :periodTypeList="periodTypeList"
    />
  </div>
</template>

<script>
import service from "@/service";
import html2pdf from "html2pdf.js";
import { randomString } from "@/components/Common/commonFunctions";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const originalTemplateObj = {
  templateId: "",
  templateName: "",
  templateDesc: "",
  orgUnitLevel: "",
  updateFrequencyType: "monthly",
  basePeriod: "0",
  selectedCharts: [],
  details: [
    { user: true },
    { timestamp: true },
    { location: true },
    { pageCount: true },
  ],
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  createdByID: "",
};
export default {
  data() {
    return {
      options: [],
      configData: {},
      reportList: [],
      orgUnitList: [],
      loadingText: "",
      otherChartObj: [],
      editReport: false,
      cloneReport: false,
      fileName: "Report",
      periodTypeList: [],
      basePeriodList: [],
      reportTemplates: [],
      canvasHeight: 0,
      defaultPeriod: null,
      isGenerating: false,
      calculatedPeriod: null,
      selectedTemplate: null,
      selectedLocation: null,
      selectedLocationName: "",
      createReportPopup: false,
      selectReportPopup: false,
      isReportGenerated: false,
      selectedTemplateObj: null,
      savedTemplatesVisible: false,
      selectedTemplateTempObj: null,
      templateObj: { ...originalTemplateObj },
    };
  },
  mixins: [loadLocChildMixin],
  components: {
    Treeselect,
    ReportTemplateModals: () =>
      import(
        /* webpackChunkName: "ReportTemplate_ReportTemplateModals"*/ "./ReportTemplateModals"
      ),
    gridLayout: () =>
      import(
        /*webpackChunkName: 'GridLayoutComponent'*/ "@/components/ReportTemplate/GridLayoutComponent"
      ),
  },
  watch: {
    "$store.state.activeTab": function (newValue) {
      if (newValue === "create-new-report") {
        this.createReportModal(false);
      }
      if (newValue === "generate-new-report") {
        this.selectReportPopup = true;
      }
      if (newValue === "view-report") {
        this.savedTemplatesVisible = !this.savedTemplatesVisible;
      }
    },
    selectedLocation(newValue) {
      if (newValue) {
        //this.selectedLocationName = service.getLocationName(newValue.split("/")[1]);
        service
          .getIndividualOrganisation(newValue.split("/")[1])
          .then((key) => {
            this.selectedLocationName = key.data.displayName;
          });
      }
    },
    selectReportPopup(newValue) {
      if (newValue) {
        this.selectedLocation = null;
        this.selectedTemplate = null;
      }
    },
    selectedTemplate(newValue) {
      if (newValue) {
        this.selectedTemplateTempObj = this.reportTemplates.find(
          (t) => t.templateId === newValue
        );
      }
    },
    createReportPopup(newValue) {
      if (!newValue) {
        this.$store.commit("setActiveTab", "");
        this.editReport = false;
        this.cloneReport = false;
      }
    },
    reportTemplates(newValue) {
      if (newValue.length === 0) {
        this.savedTemplatesVisible = false;
        this.loadingText = this.$i18n.t("noReports");
      } else {
        this.loadingText = this.$i18n.t("selectReport");
        this.reportList = [];
        newValue.forEach((t) => {
          this.reportList.push({
            value: t.templateId,
            text: t.templateName,
            level: t.orgUnitLevel,
          });
        });
      }
    },
  },
  computed: {
    createReportDisabled() {
      return (
        this.templateObj.templateName &&
        this.templateObj.orgUnitLevel &&
        this.templateObj.updateFrequencyType &&
        this.templateObj.basePeriod >= 0
      );
    },
    createReportLoader() {
      return this.orgUnitList.length ? false : true;
    },
    filteredReportList() {
      let filteredList = this.reportList.filter(
        (l) => l.level === this.selectedLocation.split("/")[0] * 1
      );
      return filteredList;
    },
  },
  methods: {
    getCanvasHeight(h) {
      this.canvasHeight = h;
    },
    getOtherChartObj(obj) {
      this.otherChartObj.push(obj);
    },
    getPeriod(period) {
      this.defaultPeriod = period.defaultPeriod;
      this.calculatedPeriod = period.calculatedPeriod;
    },
    async downloadReport(divName) {
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<input id="fileName" class="form-control" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="' +
          this.fileName +
          '"/>',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
        preConfirm: () => {
          return [document.getElementById("fileName").value];
        },
      });

      if (formValues) {
        this.isGenerating = true;
        this.$store.state.loading = true;
        if (this.$refs[divName]) {
          setTimeout(async () => {
            let options = {
              filename:
                formValues[0] +
                "_" +
                this.$moment(new Date()).format("lll") +
                ".pdf",
              // pagebreak: { mode: "avoid-all" },
              html2canvas: {
                useCORS: true,
                height: this.canvasHeight,
              },
              jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            };
            await html2pdf()
              .set(options)
              .from(this.$refs[divName])
              .toPdf()
              .get("pdf")
              .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                  if (i === totalPages) {
                    this.isGenerating = false;
                    this.$store.state.loading = false;
                  }
                }
              })
              .save();
          }, 50);
        } else {
          console.log("printing div not found...");
        }
      }
    },
    generateReport() {
      this.selectReportPopup = false;
      this.otherChartObj = [];
      this.selectedTemplateObj = JSON.parse(
        JSON.stringify(this.selectedTemplateTempObj)
      );
      this.isReportGenerated = true;
      this.configData = {};
      // return;
      let moduleKeys = [],
        nameSpaces = [];
      this.selectedTemplateObj.selectedCharts.forEach((m) => {
        if (m.selectedModule) {
          let splitM = m.selectedModule.split("-");
          if (moduleKeys.indexOf(splitM[0]) === -1) {
            moduleKeys.push(splitM[0]);
            if (m.selectedModule.includes("interactive")) {
              nameSpaces.push("");
            } else {
              nameSpaces.push(m.selectedDashboard);
            }
          }
          if (
            splitM[2] &&
            (splitM[2] === "emu_monthly" || splitM[2] === "emu") &&
            moduleKeys.indexOf(splitM[2]) === -1
          ) {
            moduleKeys.push(splitM[2]);
            if (m.selectedModule.includes("interactive")) {
              nameSpaces.push("");
            } else {
              nameSpaces.push(m.selectedDashboard);
            }
          }
        }
      });
      let nPromises = [];
      nameSpaces.forEach((n, i) => {
        if (Object.keys(this.$store.getters.getGlobalFactors(n)).length === 0) {
          let key = this.generateKey("globalFactors");
          nPromises.push(service.getSavedConfig(key, false, nameSpaces[i]));
        }
      });
      Promise.allSettled(nPromises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            this.$store.commit("setGlobalFactors", {
              payload: response.value.data,
              namespace: nameSpaces[i],
            });
          }
        });
      });
      let promises = [];
      moduleKeys.forEach((m, i) => {
        let configKey = m;
        if (m === "emu_monthly") {
          configKey = "monthlyEMU";
        }
        if (m === "emu") {
          configKey = "annualEMU";
        }
        let key = this.generateKey(configKey);
        promises.push(service.getSavedConfig(key, false, nameSpaces[i]));
      });
      Promise.allSettled(promises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            // this.configData[moduleKeys[i]] = response.value.data; //This will not work. Learn https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
            this.$set(this.configData, moduleKeys[i], response.value.data);
            // this.$set(this.configData, moduleKeys[i], "error");//This is for testing
          } else {
            this.$set(this.configData, moduleKeys[i], "error");
          }
        });
      });
    },
    createReportModal(fromEditModule = false) {
      if (!fromEditModule) {
        this.templateObj = { ...originalTemplateObj };
      }
      this.createReportPopup = true;
      let filterLevel =
        this.$store.getters.getUserDetails.dataViewOrganisationUnits[0].level;
      if (
        filterLevel <
        this.$store.getters.getApplicationModule(true).defaultLevelID
      ) {
        filterLevel =
          this.$store.getters.getApplicationModule(true).defaultLevelID;
      }
      if (!this.orgUnitList.length) {
        service.getOrganisationUnitLevels().then((orgList) => {
          this.orgUnitList = orgList.data
            .filter((org) => org.level >= filterLevel)
            .sort((a, b) =>
              a.level < b.level ? -1 : a.level > b.level ? 1 : 0
            )
            .map((org) => ({ text: org.name, value: org.level }));
          if (!fromEditModule) {
            this.templateObj.orgUnitLevel = filterLevel;
          }
        });
      } else {
        if (!fromEditModule) {
          this.templateObj.orgUnitLevel = filterLevel;
        }
      }
    },
    createReport() {
      this.$store.state.loading = true;
      this.templateObj.templateId = this.templateObj.templateId
        ? this.templateObj.templateId
        : randomString(16);
      this.templateObj.createdAt = this.templateObj.createdAt
        ? this.templateObj.createdAt
        : this.$moment(new Date()).format("lll");
      this.templateObj.updatedAt = this.$moment(new Date()).format("lll");
      this.templateObj.createdBy = this.templateObj.createdBy
        ? this.templateObj.createdBy
        : `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`;
      this.templateObj.createdByID = this.templateObj.createdByID
        ? this.templateObj.createdByID
        : this.$store.state.loggedInUserId;
      this.templateObj.details = this.templateObj.details
        ? this.templateObj.details
        : originalTemplateObj.details;
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
            this.reportTemplates = reportTemplates;
            this.handleResponse(response);
          });
        })
        .catch(() => {
          console.log("Report templates not found, adding new...");
          service.saveConfig([this.templateObj], key).then((response) => {
            this.reportTemplates = [this.templateObj];
            this.handleResponse(response);
          });
        });
    },
    handleResponse(response) {
      this.createReportPopup = false;
      this.resetValues();
      if (response.data.status === "OK") {
        this.$swal({
          title: this.$i18n.t("data_saved_successfully"),
        });
        if (this.editReport) {
          this.editReport = false;
        }
        if (this.cloneReport) {
          this.cloneReport = false;
        }
        this.$store.state.loading = false;
      } else {
        this.$swal({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.state.loading = false;
        return;
      }
    },
    resetValues() {
      this.templateObj = { ...originalTemplateObj };
      this.templateObj.orgUnitLevel = this.orgUnitList[0]?.value;
    },
    getReportTemplates(isFirstLoad = false) {
      this.$store.commit("setLoading", true);
      this.reportTemplates = [];
      let key = this.generateKey("reportTemplates");
      service
        .getSavedConfig(key)
        .then((res) => {
          this.reportTemplates = res.data;
          if (
            !this.selectReportPopup &&
            isFirstLoad &&
            this.reportTemplates.length
          ) {
            this.selectReportPopup = true;
          }
          // this.reportTemplates.forEach((t) => {
          //   this.reportList.push({
          //     value: t.templateId,
          //     text: t.templateName,
          //     level: t.orgUnitLevel,
          //   });
          // });
          // if (this.reportTemplates.length === 0) {
          //   this.loadingText = this.$i18n.t("reportTemplate.noReports");
          // } else {
          //   this.loadingText = this.$i18n.t("reportTemplate.selectReport");
          // }
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.loadingText = this.$i18n.t("noReports");
          console.log("Report templates not found...");
          this.$store.commit("setLoading", false);
        });
    },
    updateModule(template) {
      let foundIndex = this.reportTemplates.findIndex(
        (r) => r.templateId === template.templateId
      );
      if (foundIndex >= 0) {
        this.reportTemplates[foundIndex] = JSON.parse(JSON.stringify(template));
      }
    },
    viewModule(template) {
      this.$refs.setReportTemplate.setReportModal(template);
    },
    editModule(template, isClone = false) {
      this.templateObj = isClone
        ? {
            ...template,
            createdAt: "",
            templateId: "",
            updatedAt: "",
            createdBy: "",
            createdByID: "",
          }
        : { ...template };
      if (isClone) {
        this.cloneReport = true;
      } else {
        this.editReport = true;
      }
      this.$nextTick(() => {
        this.createReportModal(true);
      });
    },
    deleteModule(id) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
      }).then((result) => {
        if (result.value) {
          this.$store.state.loading = true;
          let key = this.generateKey("reportTemplates");
          service
            .getSavedConfig(key)
            .then((res) => {
              let reportTemplates = res.data.filter((t) => t.templateId != id);
              service.updateConfig(reportTemplates, key).then((response) => {
                this.handleResponse(response);
                this.reportTemplates = reportTemplates;
                if (
                  this.selectedTemplateObj &&
                  this.selectedTemplateObj.templateId === id
                ) {
                  this.selectedTemplateObj = null;
                  this.isReportGenerated = false;
                }
              });
            })
            .catch(() => {
              console.log("Error while deleting template...");
              this.$store.state.loading = false;
            });
        }
      });
    },
  },
  created() {
    this.options = JSON.parse(
      JSON.stringify(this.$store.getters.getLocationList)
    );
    this.periodTypeList = [
      { value: "monthly", text: this.$i18n.t("monthly") },
      { value: "quarterly", text: this.$i18n.t("quarterly") },
      { value: "yearly", text: this.$i18n.t("yearly") },
    ];
    if (this.$store.state.financialYear.includes("April")) {
      this.periodTypeList.push({
        value: "financialYear",
        text: this.$i18n.t("financialYear"),
      });
    }
    if (this.$store.state.financialYear.includes("July")) {
      this.periodTypeList.push({
        value: "financialYearJuly",
        text: this.$i18n.t("financialYearJuly"),
      });
    }
    for (let i = 0; i <= 36; i++) {
      this.basePeriodList.push({
        text: -i,
        value: i,
      });
    }
    this.getReportTemplates(true);
  },
};
</script>
<style lang="scss">
.myDivToPrint {
  width: 790px;
  margin: auto;

  .card-header {
    background-color: #222143 !important;
    border-top-left-radius: 3px !important;
    border-top-right-radius: 3px !important;
  }

  .card-body {
    background-color: #181735 !important;
  }

  .b-overlay .bg-light {
    display: none;
  }
}

.new-btndisable {
  background-color: #64648d !important;
  border-color: #64648d !important;
}
</style>
