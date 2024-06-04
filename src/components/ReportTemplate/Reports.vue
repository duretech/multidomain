<template>
  <div class="report mb-0 mt-5">
    <div class="report-container p-4">
      <div class="">
        <div class="d-flex justify-content-end" v-if="$store.getters?.getAppSettings?.reportVersion==='new'">
          <b-button class="h5 mb-2 info p-0">
            <b-icon
              icon="info-circle-fill"
              variant="dark"
              v-b-modal.information
            ></b-icon>
          </b-button>
        </div>
        <b-collapse
          class="saved-fav-accordian mt-3"
          id="accordion-1"
          v-model="savedTemplatesVisible"
        >
          <div class="saved-report-card-border mb-3">
            <!-- <div class="saved-fav-heading fa-19-1920">{{ $t("reports") }}</div> -->
            <div
              class="report-modal align-items-center d-flex justify-content-between w-100 py-2"
            >
              <h5 class="m-0">{{ $t("reports") }}</h5>
              <div class="d-flex align-items-center">
                <input
                  type="text"
                  class="form-control search-control"
                  :placeholder="$t('search')"
                  v-model="searchName"
                />
                <span>
                  <i
                    class="fa fa-close cursor-pointer mx-4"
                    @click="close()"
                  ></i>
                </span>
              </div>
            </div>
            <b-row class="py-3" v-if="filteredData.length > 0">
              <b-col
                sm="4"
                class="mb-3"
                v-for="template in filteredData"
                :key="template.templateId"
              >
                <b-card header-tag="header" class="saved-fav-card">
                  <template #header>
                    <h6 class="mb-0 fs-17-2920 mb-0">
                      {{ template.templateName }}
                    </h6>
                  </template>
                  <div class="saved-report-card">
                    <div class="img-title-flex">
                      <div class="saved-report-card-img-container">
                        <img
                          alt="img"
                          :style="{ filter: filterColor }"
                          :src="require(`@/assets/images/icons/report.svg`)"
                        />
                      </div>
                      <div class="saved-report-card-title fs-17-1920">
                        <!-- <span> {{ template.templateName }}</span> -->
                        <b-row class="card-details fs-17-2920"
                          ><b>{{ $t("userName") }}:&nbsp;</b>
                          <span class="fw-400"> {{ template.createdBy }} </span>
                        </b-row>
                        <b-row class="card-details fs-17-2920">
                          <b>{{ $t("created") }}:&nbsp; </b>
                          <span class="fw-400"> {{ template.createdAt }}</span>
                        </b-row>
                        <b-row class="card-details fs-17-2920">
                          <b>{{ $t("lastUpdated") }}:&nbsp; </b>
                          <span class="fw-400"> {{ template.updatedAt }} </span>
                        </b-row>
                        <b-row class="card-details fs-17-2920">
                          <b>{{ $t("orgLevel") }}:&nbsp; </b>
                          <span class="fw-400">
                            {{ getValue(template.orgUnitLevel, "orgUnitList") }}
                          </span>
                        </b-row>
                        <b-row class="card-details fs-17-2920">
                          <b>{{ $t("updateFrequencyType") }}:&nbsp; </b>
                          <span class="fw-400">
                            {{
                              getValue(
                                template.updateFrequencyType,
                                "pTypeOptions"
                              )
                            }}
                          </span>
                        </b-row>
                        <b-row class="card-details fs-17-2920">
                          <b>{{ $t("basePeriod") }}:&nbsp; </b>
                          <span class="fw-400">
                            {{
                              getValue(template.basePeriod, "basePeriodList")
                            }}
                          </span>
                        </b-row>
                      </div>
                    </div>
                    <div
                      class="saved-report-card-opt"
                      v-if="
                        template.createdByID ===
                        $store.getters.getLoggedInUserId
                      "
                    >
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                        @click.prevent.stop="viewModule(template)"
                      >
                        <img
                          :src="
                            require('@/assets/images/icons/previewActive.svg')
                          "
                          :style="{ filter: filterColor }"
                          class="mb-1"
                        /><span>{{ $t("View") }}</span>
                      </div>
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                        @click.prevent.stop="editModule(template)"
                      >
                        <img
                          :src="require('@/assets/images/icons/editActive.svg')"
                          :style="{ filter: filterColor }"
                          class="mb-1"
                        /><span>{{ $t("edit") }}</span>
                      </div>
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                        @click.prevent.stop="editModule(template, true)"
                      >
                        <img
                          :src="require('@/assets/images/icons/editActive.svg')"
                          :style="{ filter: filterColor }"
                          class="mb-1"
                        /><span>{{ $t("clone") }}</span>
                      </div>
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer mb-md-0"
                        @click.prevent.stop="deleteModule(template.templateId)"
                      >
                        <img
                          :src="
                            require('@/assets/images/icons/deleteActive.svg')
                          "
                          :style="{ filter: filterColor }"
                        /><span class="mt-1">{{ $t("deletebtn") }}</span>
                      </div>
                    </div>
                    <div class="saved-report-card-opt" v-else>
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                        @click.prevent.stop="editModule(template)"
                      >
                        <img
                          :src="require('@/assets/images/icons/editActive.svg')"
                          :style="{ filter: filterColor }"
                          class="mb-1"
                        /><span>{{ $t("edit") }}</span>
                      </div>
                      <div
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer"
                        @click.prevent.stop="editModule(template, true)"
                      >
                        <img
                          :src="require('@/assets/images/icons/editActive.svg')"
                          :style="{ filter: filterColor }"
                          class="mb-1"
                        /><span>{{ $t("clone") }}</span>
                      </div>
                      <div
                        v-if="$store.getters.getIsAdmin"
                        class="saved-report-card-opt-img fs-14-1920 cursor-pointer mb-md-0"
                        @click.prevent.stop="deleteModule(template.templateId)"
                      >
                        <img
                          :src="
                            require('@/assets/images/icons/deleteActive.svg')
                          "
                          :style="{ filter: filterColor }"
                        /><span class="mt-1">{{ $t("deletebtn") }}</span>
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>
            <b-row class="py-3" v-else>
              <b-col class="text-center">
                <b-alert variant="info" show>{{ $t("noReports") }}</b-alert>
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </div>
      <div
        class="title-report-card fs-19-1920 pb-2 d-flex justify-content-between align-items-center"
        v-if="filteredData.length && isReportGenerated"
      >
        {{ this.selectedTemplateTempObj.templateName }}
        <button
          type="button"
          class="btn btn-primary black-btn blue-btn ml-3 generate-greybtn"
          @click.prevent.stop="downloadReport()"
          style="border: 2px solid #fff"
          :disabled="isGenerating"
        >
          <img
            :src="require('@/assets/images/icons/generateReport.svg')"
            class="img-fluid mt-xl-n1"
          />
          <span class="mx-1">
            {{ isGenerating ? $t("scorecardGenerating") : $t("downloadIcon") }}
          </span>
        </button>
      </div>
      <div
        class="myDivToPrint bg-white"
        ref="printPDF"
        v-if="filteredData.length && isReportGenerated"
      >
        <template v-if="selectedTemplateObj" className="reportCards">
          <gridLayout
            :isReport="true"
            :excludedHeight="55"
            :isHeaderFooter="true"
            @getPeriod="getPeriod"
            @setLocationPeriod="setLocationPeriod"
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
            class="report-theme"
            configKey="selectedCharts"
            :otherChartObj="otherChartObj"
            :selectedPeriod="selectedPeriod"
            :layout.sync="selectedTemplateObj"
            @getCanvasHeight="getCanvasHeight"
            @getOtherChartObj="getOtherChartObj"
            :selectedLocation="selectedLocation"
            :selectedLocationName="selectedLocationName"
            :isGenerating="isGenerating"
            
          />
        </template>
      </div>
      <div class="text-center my-2 text-white" v-else>
        <b-alert variant="info" show class="m-0" v-if="loadingText"
          >{{ loadingText }}
        </b-alert>
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
          <div class="form-group row vue-color">
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
            class="form-group row vue-color"
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
            class="btn btn-primary blue-btn black-btn ml-3"
            @click.prevent.stop="generateReport"
            style="border: 2px solid #fff"
            :disabled="
              !selectedTemplate ||
              (selectedTemplateTempObj &&
                selectedTemplateTempObj.selectedCharts.length === 0)
            "
          >
            <span class="">
              <!-- <img
              :src="require('@/assets/images/icons/generateReport.svg')"
              class="img-fluid mt-xl-n1"
            />  -->
            </span>
            <span class="mx-1"> {{ $t("exportbtn") }} </span>
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
      <div class="row m-0 py-3 position-relative report-dialog">
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
                :disabled="sameUser"
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
                :disabled="sameUser"
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
                :disabled="sameUser"
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
                :options="pTypeOptions"
                :disabled="sameUser"
              ></b-form-select>
            </div>
          </div>
          <div class="form-group mb-1 row">
            <label class="col-sm-6 col-form-label">
              <sup
                ><i
                  class="fa fa-info-circle color-white cursor-pointer chart-info"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: $t('basePeriodInfo') || '',
                    title: $t('basePeriod'),
                    html: true,
                  }"
                ></i></sup
              >{{ $t("basePeriod") }}<sup class="color-red">*</sup>
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
            class="btn new-resetbtn ml-3"
            @click.prevent="resetValues"
            :class="{ 'd-none': sameUser }"
          >
            {{ $t("resetbtn") }}
          </button>
          <button
            type="button"
            class="btn btn-primary blue-btn ml-3"
            @click.prevent.stop="createReport"
            :disabled="!createReportDisabled"
          >
            {{ $t("submitbtn") }}
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal
      centered
      hide-footer
      size="xl"
      id="information"
      :title="$t('Information')"
    >
      <div>
        <h6>{{ $t("stepsReport") }}</h6>
        <h6>{{ $t("step1") }}</h6>
        <p>{{ $t("step1Exp") }}</p>
        <h6>{{ $t("step2") }}</h6>
        <p>{{ $t("step2Exp") }}</p>
        <h6>{{ $t("step3") }}</h6>
        <p>{{ $t("step3Exp") }}</p>
      </div>
    </b-modal>
    <ReportTemplateModals
      ref="setReportTemplate"
      @updateModule="updateModule"
      :periodTypeList="pTypeOptions"
    />
  </div>
</template>

<script>
import service from "@/service";
import html2pdf from "html2pdf.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import { getAllPeriodRange } from "@/components/Common/commonFunctions";
import {
  pTypeList,
  randomString,
  translateDate,
} from "@/components/Common/commonFunctions";
import GenerateReportMixin from "@/helpers/GenerateReportMixin";
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
  isAdmin: "",
};
export default {
  data() {
    return {
      options: [],
      configData: {},
      reportList: [],
      filterLevel: 0,
      orgUnitList: [],
      loadingText: "",
      otherChartObj: [],
      editReport: false,
      cloneReport: false,
      fileName: "Report",
      pTypeOptions: [],
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
      searchName: "",
    };
  },
  mixins: [
    loadLocChildMixin,
    DynamicImageMixin,
    ReFetchConfigMixin,
    GenerateReportMixin,
  ],
  components: {
    Treeselect,
    ReportTemplateModals: () =>
      import(/* webpackChunkName: "RT_RTModals"*/ "./ReportTemplateModals"),
    gridLayout: () =>
      import(
        /*webpackChunkName: 'GridLayoutComponent'*/ "@/components/ReportTemplate/GridLayoutComponent"
      ),
  },
  watch: {
    "$store.getters.getActiveTab": function (newValue) {
      if (newValue === "create-new-report") {
        this.createReportModal(false);
      }
      if (newValue === "generate-new-report") {
        this.selectReportPopup = true;
      }
      if (newValue === "view-report") {
        this.savedTemplatesVisible = !this.savedTemplatesVisible;
      } else {
        this.savedTemplatesVisible = false;
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
    filteredData() {
      let filteredD = [];
      filteredD = this.reportTemplates.filter((a) =>
        a.templateName
          ?.toLowerCase()
          .includes(this.searchName.toLowerCase())
      );
      return filteredD
    },
    sameUser() {
      return (
        this.templateObj.createdByID !==
          this.$store.getters.getLoggedInUserId &&
        this.$store.getters.getActiveTab !== "create-new-report" &&
        !this.cloneReport
      );
    },
    selectedPeriod() {
      let dType =
          this.selectedTemplateTempObj?.updateFrequencyType || "monthly",
        d = this.calculatedPeriod?.[dType] || null;
      return d && dType
        ? translateDate({
              rawDate:
                this.calculatedPeriod?.[
                  this.selectedTemplateTempObj.updateFrequencyType
                ],
              periodType: this.selectedTemplateTempObj.updateFrequencyType,
            })
        : "";
    },
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
    close() {
      this.savedTemplatesVisible = false;
    },
    getValue(data = 0, key) {
      let name = data;
      let isData = this[key].find((o) => o.value === data);
      if (isData) {
        name = isData.text;
      }
      return name;
    },
    getCanvasHeight(h) {
      this.canvasHeight = h;
    },
    getOtherChartObj(obj) {
      this.otherChartObj.push(obj);
      this.exportArrAll.push(obj);
    },
    getPeriod(period) {
      this.defaultPeriod = period.defaultPeriod;
      this.calculatedPeriod = period.calculatedPeriod;
    },
    // async downloadReport(divName) {
    //   const { value: formValues } = await this.$swal({
    //     title: this.$i18n.t("export_options"),
    //     html:
    //       '<input id="fileName" class="form-control" placeholder="' +
    //       this.$i18n.t("fileName_placeholder") +
    //       '" value="' +
    //       this.fileName +
    //       '"/>',
    //     focusConfirm: true,
    //     showCancelButton: true,
    //     reverseButtons: true,
    //     confirmButtonText: this.$i18n.t("downloadIcon"),
    //     cancelButtonText: this.$i18n.t("cancelbtn"),
    //     preConfirm: () => {
    //       return [document.getElementById("fileName").value];
    //     },
    //   });

    //   if (formValues) {
    //     this.isGenerating = true;
    //     this.$store.commit("setLoading", true);
    //     if (this.$refs[divName]) {
    //       setTimeout(async () => {
    //         let options = {
    //           filename:
    //             formValues[0] +
    //             "_" +
    //             this.$moment(new Date()).format("lll") +
    //             ".pdf",
    //           // pagebreak: { mode: "avoid-all" },
    //           html2canvas: {
    //             useCORS: true,
    //             height: this.canvasHeight,
    //           },
    //           jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    //         };
    //         await html2pdf()
    //           .set(options)
    //           .from(this.$refs[divName])
    //           .toPdf()
    //           .get("pdf")
    //           .then((pdf) => {
    //             const totalPages = pdf.internal.getNumberOfPages();
    //             for (let i = 1; i <= totalPages; i++) {
    //               if (i === totalPages) {
    //                 this.isGenerating = false;
    //                 this.$store.commit("setLoading", false);
    //               }
    //             }
    //           })
    //           .save();
    //       }, 50);
    //     } else {
    //       console.log("printing div not found...");
    //     }
    //   }
    // },
    setLocationPeriod(value) {
      this.locationPeriod = value;
    },
    async generateReport() {
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
          if (
            moduleKeys.indexOf(`${splitM[0]}/${m.selectedDashboard}`) === -1
          ) {
            moduleKeys.push(`${splitM[0]}/${m.selectedDashboard}`);
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
      let nPromises = [],
        aNamespaces = [];
      nameSpaces.forEach((n, i) => {
        if (Object.keys(this.$store.getters.getGlobalFactors(n)).length === 0) {
          aNamespaces.push(nameSpaces[i]);
          let key = this.generateKey("globalFactors");
          nPromises.push(
            service.getSavedConfig({ tableKey: key, namespace: nameSpaces[i] })
          );
        }
      });
      let pPromises = [],
        FinalPeriodArray = [];
      await Promise.allSettled(nPromises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            this.$store.commit("setGlobalFactors", {
              payload: response.value.data,
              namespace: aNamespaces[i],
            });
            FinalPeriodArray = getAllPeriodRange(
              response.value.data.period.Period,
              FinalPeriodArray
            );
            let locationID = this.selectedLocation.split("/")[1],
              des = null;
            for (let map in response.value.data.globalMappings.mappings) {
              let mappingData =
                response.value.data.globalMappings.mappings[map];
              for (let innerMap in mappingData["mapping"]) {
                let innerMapData =
                  response.value.data.globalMappings.mappings[map]["mapping"][
                    innerMap
                  ]["indicator"]["subIndicator"];
                if (
                  innerMapData[0] &&
                  innerMapData[0]["selectedDE"].length > 0
                ) {
                  des = innerMapData[0]["selectedDE"][0]["id"];
                  break;
                }
              }
              if (des != null) break;
            }
            pPromises.push(
              service.getAnalyticalIndicatorData(
                des,
                locationID,
                FinalPeriodArray.join(";"),
                false,
                true
              )
            );
          }
        });
      });
      await Promise.allSettled(pPromises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            let finalPeriodData = {};
            FinalPeriodArray.forEach((pe) => {
              finalPeriodData[pe] =
                response.value?.data?.metaData?.items?.[pe] || pe;
            });
            this.$store.commit("setPeriodData", finalPeriodData);
          } else {
            console.log("Error in fetching period data...");
          }
        });
      });

      let promises = [];
      moduleKeys.forEach((m, i) => {
        let configKey = m.split("/")[0];
        if (m === "emu_monthly") {
          configKey = `monthlyEMU_${this.$i18n.locale}`;
        }
        if (m === "emu") {
          configKey = `annualEMU_${this.$i18n.locale}`;
        }
        let key = this.generateKey(configKey);
        promises.push(
          service.getSavedConfig({ tableKey: key, namespace: nameSpaces[i] })
        );
      });
      console.log("promises", promises);
      // console.log("key",key)
      console.log("nameSpaces", nameSpaces);
      await Promise.allSettled(promises).then((results) => {
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
    async createReportModal(fromEditModule = false) {
      if (!fromEditModule) {
        this.templateObj = { ...originalTemplateObj };
      }
      this.createReportPopup = true;
      if (!this.orgUnitList.length) {
        try {
          let orgList = await service.getOrganisationUnitLevels();
          this.setOrgData(orgList.data);
        } catch (e) {
          console.log("Error in fetching org levels...", e);
        }
      }
      if (!fromEditModule) {
        this.templateObj.orgUnitLevel = this.filterLevel;
      }
    },
    createReport() {
      this.$store.commit("setLoading", true);
      this.templateObj.templateId = this.templateObj.templateId
        ? this.templateObj.templateId
        : randomString(16);
      if (this.$store.getters.getAppSettings.calendar == "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        let nepaliDate = adToBs(
          `${
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate()
          }`
        );
        let nepaliMonthYear = translateDate({
          rawDate:
            `${new Date(nepaliDate).getFullYear()}` +
            "-" +
            `${
              new Date(nepaliDate).getMonth() + 1 < 10
                ? "0" + (new Date(nepaliDate).getMonth() + 1)
                : new Date(nepaliDate).getMonth() + 1
            }`,
        });
        let nepaliDateFinal = nepaliDate.split("-")[2] + ", " + nepaliMonthYear;
        this.templateObj.updatedAt = nepaliDateFinal;
        this.templateObj.createdAt = this.templateObj.createdAt
          ? this.templateObj.createdAt
          : nepaliDateFinal;
      } else {
        this.templateObj.createdAt = this.templateObj.createdAt
          ? this.templateObj.createdAt
          : this.$moment(new Date()).format("lll");
        this.templateObj.updatedAt = this.$moment(new Date()).format("lll");
      }
      this.templateObj.createdBy = this.templateObj.createdBy
        ? this.templateObj.createdBy
        : `${this.$store.getters.getUserDetails.firstName} ${this.$store.getters.getUserDetails.surname}`;
      this.templateObj.createdByID = this.templateObj.createdByID
        ? this.templateObj.createdByID
        : this.$store.getters.getLoggedInUserId;
      this.templateObj.details = this.templateObj.details
        ? this.templateObj.details
        : originalTemplateObj.details;
      this.templateObj.locale = this.$i18n.locale;
      this.templateObj.isAdmin = this.$store.getters.getIsAdmin;

      let key = this.generateKey("reportTemplates");
      service
        .getSavedConfig({ tableKey: key })
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
          service
            .updateConfig({ data: reportTemplates, tableKey: key })
            .then((response) => {
              if (!this.$store.getters.getIsAdmin) {
                this.reportTemplates = reportTemplates.filter((r) => {
                  return (
                    r.locale === this.$i18n.locale &&
                    (r?.isAdmin
                      ? r?.isAdmin
                      : r.createdByID === this.$store.getters.getLoggedInUserId
                      ? true
                      : false)
                  );
                });
              } else {
                this.reportTemplates = reportTemplates.filter((r) => {
                  return r.locale === this.$i18n.locale;
                });
              }
              this.handleResponse(response);
            });
        })
        .catch(() => {
          console.log("Report templates not found, adding new...");
          service
            .saveConfig({ data: [this.templateObj], tableKey: key })
            .then((response) => {
              this.reportTemplates = [this.templateObj];
              this.handleResponse(response);
            });
        });
    },
    handleResponse(response) {
      this.createReportPopup = false;
      this.resetValues();
      if (response.data.status === "OK") {
        this.sweetAlert({
          title: this.$i18n.t("data_saved_successfully"),
        });
        if (this.editReport) {
          this.editReport = false;
        }
        if (this.cloneReport) {
          this.cloneReport = false;
        }
        this.$store.commit("setLoading", false);
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.commit("setLoading", false);
        return;
      }
    },
    resetValues() {
      this.templateObj = { ...originalTemplateObj };
      this.templateObj.orgUnitLevel = this.orgUnitList[0]?.value;
    },
    getConfigData(isFirstLoad = false) {
      this.$store.commit("setLoading", true);
      this.reportTemplates = [];
      let key = this.generateKey("reportTemplates");
      service
        .getSavedConfig({ tableKey: key })
        .then((res) => {
          console.log("res", res);
          if (!this.$store.getters.getIsAdmin) {
            this.reportTemplates = res.data.filter((r) => {
              return (
                r.locale === this.$i18n.locale &&
                (r?.isAdmin
                  ? r?.isAdmin
                  : r.createdByID === this.$store.getters.getLoggedInUserId
                  ? true
                  : false)
              );
            });
          } else {
            this.reportTemplates = res.data.filter((r) => {
              return r.locale === this.$i18n.locale;
            });
          }
          if (
            !this.selectReportPopup &&
            isFirstLoad &&
            this.reportTemplates.length
          ) {
            if(this.$store.getters?.getAppSettings?.reportVersion && this.$store.getters?.getAppSettings?.reportVersion==='new'){
              this.savedTemplatesVisible = true;
            }
            else{
              this.selectReportPopup = true;
            }
          }
          // this.reportTemplates.forEach((t) => {
          //   this.reportList.push({
          //     value: t.templateId,
          //     text: t.templateName,
          //     level: t.orgUnitLevel,
          //   });
          // });
          // if (this.reportTemplates.length === 0) {
          //   this.loadingText = this.$i18n.t("noReports");
          // } else {
          //   this.loadingText = this.$i18n.t("selectReport");
          // }
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          this.loadingText = this.$i18n.t("noReports");
          console.log("Report templates not found...");
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
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
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.$store.commit("setLoading", true);
          let key = this.generateKey("reportTemplates");
          service
            .getSavedConfig({ tableKey: key })
            .then((res) => {
              let reportTemplates = res.data.filter((t) => t.templateId != id);
              service
                .updateConfig({ data: reportTemplates, tableKey: key })
                .then((response) => {
                  if (!this.$store.getters.getIsAdmin) {
                    this.reportTemplates = reportTemplates.filter((r) => {
                      return (
                        r.locale === this.$i18n.locale &&
                        (r?.isAdmin
                          ? r?.isAdmin
                          : r.createdByID ===
                            this.$store.getters.getLoggedInUserId
                          ? true
                          : false)
                      );
                    });
                  } else {
                    this.reportTemplates = reportTemplates.filter((r) => {
                      return r.locale === this.$i18n.locale;
                    });
                  }
                  this.handleResponse(response);
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
              this.$store.commit("setLoading", false);
            });
        }
      });
    },
    setOrgData(orgList) {
      this.orgUnitList = orgList
        .filter((org) => org.level >= this.filterLevel)
        .sort((a, b) => (a.level < b.level ? -1 : a.level > b.level ? 1 : 0))
        .map((org) => ({ text: org.name, value: org.level }));
    },
  },
  created() {
    this.filterLevel =
      this.$store.getters.getUserDetails?.dataViewOrganisationUnits?.[0]
        ?.level || 0;
    let defaultLevelID = this.$store.getters.getApplicationModule(
      this.$store.getters.getIsMultiProgram
    ).defaultLevelID;
    if (this.filterLevel < defaultLevelID) {
      this.filterLevel = defaultLevelID;
    }
    if (this.$store.getters.getOrgLevels) {
      this.setOrgData(this.$store.getters.getOrgLevels);
    } else {
      service.getOrganisationUnitLevels().then((orgList) => {
        this.setOrgData(orgList.data);
      });
    }
    this.options = JSON.parse(
      JSON.stringify(this.$store.getters.getLocationList)
    );
    this.pTypeOptions = pTypeList({ id: "value", label: "text" });

    for (let i = 0; i <= 36; i++) {
      this.basePeriodList.push({
        text: -i,
        value: i,
      });
    }
    this.getConfigData(true);
  },
};
</script>
<style lang="scss">
.myDivToPrint {
  width: 790px;
  margin: auto;

  .card {
    background-color: transparent !important;
    border: 1px solid var(--border-grey-color) !important;
    padding: 2%;
  }

  .card-header {
    background-color: transparent !important;
    border-color: transparent !important;
    border-top-left-radius: 3px !important;
    border-top-right-radius: 3px !important;
  }

  .card-body {
    background-color: transparent !important;
  }

  .b-overlay .bg-light {
    display: none;
  }
}
.info {
  background-color: transparent !important;
  border: 0px;
}
</style>
