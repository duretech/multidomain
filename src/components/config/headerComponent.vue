<template>
  <div class="container-fluid">
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: false,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    >
      <template v-slot:pageOptions>
        <b-button
          class="black-btn new-gradbtn btn-sm mr-2"
          @click="$bvModal.show('setSubTabsPopUp')"
          v-if="subTabsBtn"
        >
          {{ $t("setTabs") }}
        </b-button>
        <b-modal id="setSubTabsPopUp" hide-footer centered>
          <template #modal-title>{{ $t("setTabsIC") }}</template>
          <div
            v-for="(item, itemName) in bgDataConfig.showingTabs"
            :key="itemName"
          >
            <div class="row mx-2 py-2">
              <b-form-input class="col-8" v-model="item.name"></b-form-input>
              <b-form-checkbox
                class="col-4 text-right py-2"
                v-model="item.value"
                name="check-button"
                switch
              ></b-form-checkbox>
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <b-button
              class="mt-3 blue-btn w-25"
              block
              @click="$bvModal.hide('setSubTabsPopUp'), setSubTabs()"
              >{{ $t("update") }}</b-button
            >
          </div>
        </b-modal>
        <!-- <button
          type="button"
          class="btn btn-primary black-btn new-gradbtn mr-2"
          style="border: 2px solid #fff"
          @click.prevent.stop="exportLogsPopup"
        >
          {{ $t("exportLogs") }}
        </button> -->
        <button
          type="button"
          class="btn btn-primary btn-sm black-btn new-gradbtn mr-2"
          style="border: 2px solid #fff"
          @click.prevent.stop="uploadConfigPopup"
          :title="$t('uploadConfigFiles')"
          v-b-tooltip.hover
        >
          <!-- <i class="fa fa-upload" aria-hidden="true"></i> -->
          <img
            src="@/assets/images/icons/upload-icon.svg"
            :style="{ filter: filterColor }"
            class="mx-1 w-18px"
          />
          {{ $t("uploadConfig") }}
        </button>
        <UploadConfig
          :uploadConfig="uploadConfig"
          @uploadSuccess="uploadSuccess"
          @hideModal="uploadConfig = false"
        />
        <button
          type="button"
          class="btn btn-primary black-btn btn-sm new-gradbtn mr-2"
          style="border: 2px solid #fff"
          @click.prevent.stop="downloadConfig"
          :title="$t('backupDatastore')"
          v-b-tooltip.hover
        >
          <!-- <i class="fa fa-download" aria-hidden="true"></i> -->
          <img
            src="@/assets/images/icons/backup-config.svg"
            :style="{ filter: filterColor }"
            class="pr-4px w-20px"
          />
          {{ $t("backup_config") }}
        </button>
        <template v-if="$store.getters.getNamespace === `${tableName}`">
          <button
            type="button"
            class="btn btn-primary black-btn btn-sm new-gradbtn mr-2"
            style="border: 2px solid #fff"
            @click.prevent.stop="addTranslations"
            :title="$t('addTranslations')"
            v-b-tooltip.hover
          >
            <!-- <i class="fa fa-plus" aria-hidden="true"></i> -->
            <img
              src="@/assets/images/icons/plusicon.svg"
              :style="{ filter: filterColor }"
              class="pr-4px w-16px mt-lg-n1"
            />
            {{ $t("addTranslations") }}
          </button>
          <b-modal
            v-model="addTranslation"
            hide-footer
            centered
            size="xl"
            :title="$t('addTranslations')"
            :cancel-title="$t('cancelbtn')"
            no-close-on-backdrop
          >
            <div class="row mx-0">
              <div class="col-7 border-right px-0" :key="updateDOM">
                <div class="row mx-0 pb-3">
                  <div class="col offset-6 px-1">
                    <b-form-input
                      v-model="searchText"
                      :placeholder="$t('search')"
                    ></b-form-input>
                  </div>
                  <download-csv :data="translationArray" class="mx-1">
                    <b-button>
                      <img
                        :src="
                          require(`@/assets/images/icons/downloadActive.svg`)
                        "
                        :style="{ filter: filterColor }"
                        v-b-tooltip.hover
                        :title="$t('downloadIcon')"
                        class="img-fluid icon1"
                    /></b-button>
                  </download-csv>
                  <b-button @click="showUploadCsv()">
                    <img
                      :src="require(`@/assets/images/icons/UploadIcon.svg`)"
                      :style="{ filter: filterColor }"
                      v-b-tooltip.hover
                      :title="$t('UploadIcon')"
                      class="img-fluid icon1"
                  /></b-button>
                  <b-modal
                    ref="uploadCsv"
                    id="uploadCsv"
                    centered
                    :title="$t('UploadIcon')"
                    hide-footer
                  >
                    <p class="my-4">
                      <input
                        type="file"
                        id="csv-file"
                        @change="updateFileName"
                      />
                    </p>
                    <div class="text-right d-flex justify-content-end">
                    <b-button class="mt-2 blue-btn w-25" block @click="readFile()">{{
                      $t("submitbtn")
                    }}</b-button>
                  </div>
                  </b-modal>
                </div>
                <div class="row mx-0">
                  <div class="col px-1">
                    <b-table
                      id="trans-table"
                      responsive
                      sticky-header
                      bordered
                      hover
                      :empty-text="$t('no_data_to_display')"
                      :empty-filtered-text="$t('no_data_to_display')"
                      :per-page="perPage"
                      :current-page="currentPage"
                      :fields="fields"
                      :items="filteredTranslationArray"
                      show-empty
                    >
                      <template #cell()="data">
                        <span v-html="data.value"></span>
                      </template>
                      <template #cell(action)="data">
                        <!-- <i
                          class="fa fa-edit cursor-pointer"
                          v-b-tooltip.hover
                          :title="$t('edit')"
                          @click="editTranslation(data)"
                        ></i> -->
                        <img
                          :src="require('@/assets/images/icons/editActive.svg')"
                          class="img-fluid w-24 cursor-pointer mx-3"
                          v-b-tooltip.hover
                          :title="$t('edit')"
                          @click="editTranslation(data)"
                        />
                      </template>
                      <template #empty="scope">
                        <h5 class="text-center">{{ scope.emptyText }}</h5>
                      </template>
                      <template #emptyfiltered="scope">
                        <h5 class="text-center">
                          {{ scope.emptyFilteredText }}
                        </h5>
                      </template>
                    </b-table>
                    <div>
                      <b-pagination
                        v-model="currentPage"
                        :total-rows="rows"
                        :per-page="perPage"
                        aria-controls="trans-table"
                        align="center"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-5 pr-0">
                <div style="min-height: 455px">
                  <template v-if="editObj">
                    <h5 class="mb-4">
                      {{ $t("editTranslation") }}
                    </h5>
                    <div class="mb-4 small">
                      <strong>{{ $t("note") }}:&nbsp;</strong
                      >{{ $t("transNote") }}
                    </div>
                    <div v-for="(l, i) in langSequence" :key="'lang' + i">
                      <div class="pb-3">
                        <label for="translation-lang1">{{ $t(`${l}`) }}</label>
                        <template v-if="!isLangValid[i]">
                          <br />
                          <span class="small py-2 text-danger"
                            ><strong
                              >{{ $t("errorHead") }}&nbsp;{{
                                $t("transError")
                              }}</strong
                            ></span
                          >
                        </template>
                        <b-form-textarea
                          id="translation-lang1"
                          size="sm"
                          placeholder=""
                          v-model="editObj[l]"
                        ></b-form-textarea>
                        <div class="small pt-2" v-if="isLangChange[i]">
                          <div class="pb-2 small">{{ $t("ognlText") }}</div>
                          <i
                            class="fa fa-undo mr-3 cursor-pointer"
                            @click="editObj[l] = editOriginalObj[l]"
                            :title="$t('revert')"
                            v-b-tooltip.hover
                          ></i>
                          {{ editOriginalObj[l] }}
                          <div class="py-2 small">{{ $t("var") }}</div>
                          <template v-if="langVar[l] && langVar[l].length">
                            <h6 class="d-inline-block mb-0">
                              <b-badge
                                variant="secondary"
                                class="m-1 shadow-sm selection-pills"
                                v-for="(o, i) in langVar[l]"
                                :key="i"
                                >{{ "{" + o + "}" }}</b-badge
                              >
                            </h6>
                          </template>
                          <template v-else>
                            <div class="small">{{ $t("noVar") }}</div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div
                    class="h-100 d-flex justify-content-center align-items-center"
                    v-else
                  >
                    <i class="fa fa-long-arrow-left fa-2x mr-3"></i
                    >{{ $t("selectTranslation") }}
                  </div>
                </div>
                <div class="text-right mt-3" style="bottom: 0; right: 0">
                  <button
                    type="button"
                    class="btn btn-primary new-btn1 black-btn ml-3"
                    style="border: 2px solid #fff"
                    @click.prevent.stop="cancelEdit"
                  >
                    {{ $t("cancelbtn") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary new-btndisable black-btn blue-btn ml-3"
                    style="border: 2px solid #fff"
                    @click.prevent.stop="saveEdit(null)"
                    :disabled="disableEdit"
                  >
                    {{ $t("savebtn") }}
                  </button>
                </div>
              </div>
            </div>
          </b-modal>
        </template>
      </template>
    </Header>
    <b-modal
      v-model="exportPopup"
      hide-footer
      centered
      size="sm"
      :title="$t('modules')"
      :ok-title="$t('ok')"
      no-close-on-backdrop
    >
      <div class="row">
        <div class="col-12">
          <b-form-group :label="$t('select_One')">
            <b-form-radio-group
              v-model="selectedModule"
              :options="exportOptions"
              name="plain-stacked"
              plain
              stacked
            ></b-form-radio-group>
          </b-form-group>
        </div>
        <div class="col-12 text-right">
          <button
            type="button"
            class="btn btn-primary new-btn1 black-btn mr-2"
            style="border: 2px solid #fff"
            @click.prevent.stop="exportAuditLogs"
          >
            <span class="">
              <img
                :src="require('@/assets/images/icons/generateReport.svg')"
                class="img-fluid mt-xl-n1"
              />
            </span>
            <span class="mx-1"> {{ $t("exportbtn") }} </span>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
/*global settings*/
import audit from "./audit.js";
import service from "@/service";
import get from "lodash/get";
import merge from "lodash/merge";
import JSZip from "jszip";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {
    UploadConfig: () =>
      import(
        /*webpackChunkName: 'UploadConfig'*/ "@/components/config/UploadConfig"
      ),
  },
  props: ["subTabsBtn", "bgDataConfig", "openTabPopUp", "langList"],
  mixins: [DynamicImageMixin, LanguageChangeMixin, EmitTourCallbackMixin],
  data() {
    return {
      exportPopup: false,
      selectedModule: null,
      exportOptions: [],
      uploadConfig: false,
      fields: [],
      translationArray: [],
      translationObj: {},
      addTranslation: false,
      currentPage: 1,
      perPage: 100,
      rows: 0,
      langSequence: [],
      editOriginalObj: null,
      editObj: null,
      isLangValid: [],
      isLangChange: [],
      langVar: {},
      searchText: "",
      updateDOM: 0,
      config: {
        delimiter: "",
        newline: "",
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        dynamicTyping: true,
        preview: 0,
        encoding: "",
        delimitersToGuess: [",", "\t", "|", ";"],
      },
      availability: "",
      fileName: "",
    };
  },
  computed: {
    tableName() {
      return this.$store.getters.getAppSettings.tableName;
    },
    filteredTranslationArray() {
      let filteredTranslations = this.translationArray.filter(
        (t) =>
          (t.en &&
            t.en.toLowerCase().includes(this.searchText.toLowerCase())) ||
          (t.fr && t.fr.toLowerCase().includes(this.searchText.toLowerCase()))
      );
      return filteredTranslations;
    },
    disableEdit() {
      let isDisable = false;
      if (
        this.isLangChange.every((l) => !l) ||
        this.isLangValid.some((l) => !l)
      ) {
        isDisable = true;
      }

      return isDisable;
    },
  },
  watch: {
    filteredTranslationArray(newValue) {
      this.rows = newValue.length;
    },
    openTabPopUp(newValue) {
      if (newValue) {
        this.$bvModal.show("setSubTabsPopUp");
      } else {
        this.$bvModal.hide("setSubTabsPopUp");
      }
    },
    editObj: {
      handler: function (newValue) {
        if (newValue) {
          this.langSequence.forEach((l, i) => {
            let change = this.editOriginalObj[l] !== newValue[l];
            this.checkVariables(change, l, i);
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    showUploadCsv() {
      this.$refs["uploadCsv"].show();
    },
    hideUploadCsv() {
      this.$refs["uploadCsv"].hide();
    },
    updateFileName() {
      this.fileName = event.target.files[0];
    },
    readFile() {
      this.$papa.parse(this.fileName, {
        header: true,
        skipEmptyLines: true,
        complete: this.onComplete,
      });
    },
    onComplete(results) {
      let translationArray = results.data;
      this.hideUploadCsv();
      this.saveEdit(translationArray);
    },
    checkVariables(newValue, lang, i) {
      this.$set(this.isLangChange, i, newValue);
      if (newValue) {
        let isValid = true;
        if (lang) {
          let oData = this.editOriginalObj[lang];
          let oFound = this.getVariables(oData);
          this.langVar[lang] = oFound;
          if (oFound.length) {
            let nData = this.editObj[lang];
            let nFound = this.getVariables(nData);
            if (nFound.length) {
              if (oFound.sort().join(",") === nFound.sort().join(",")) {
                isValid = true;
              } else {
                isValid = false;
              }
            } else {
              isValid = false;
            }
          }
        }
        this.$set(this.isLangValid, i, isValid);
      } else {
        this.$set(this.isLangValid, i, true);
        this.langVar[lang] = [];
      }
    },
    getVariables(data) {
      let found = [], // an array to collect the strings that are found
        rxp = /{([^}]+)}/g,
        curMatch;

      if (data) {
        while ((curMatch = rxp.exec(data))) {
          found.push(curMatch[1]);
        }
      }
      return found;
    },
    exportLogsPopup() {
      this.exportPopup = true;
      this.selectedModule = null;
    },
    exportAuditLogs() {
      this.$store.state.loading = true;
      audit.downloadLogs(this.selectedModule);
      this.exportPopup = false;
    },
    uploadConfigPopup() {
      this.uploadConfig = true;
    },
    uploadSuccess() {
      this.uploadConfig = false;
    },
    generateTranslationArray(obj) {
      let lang = this.langSequence[0];
      Object.keys(obj[lang]).forEach((t) => {
        let transObj = {
          path: t,
          [lang]: obj[lang][t],
        };
        Object.keys(obj).forEach((t1) => {
          if (t1 !== lang) {
            transObj[[t1]] = get(obj[t1], t) || "";
          }
        });
        this.translationArray.push(transObj);
      });
    },
    async addTranslations() {
      this.$store.state.loading = true;
      this.fields = [];
      this.translationArray = [];
      this.langSequence = [this.$i18n.locale];
      if (this.$store.getters.getAppSettings.languageSupport) {
        this.langList.forEach((l) => {
          if (l !== this.$i18n.locale) {
            this.langSequence.push(l);
          }
        });
      }
      let allTranslations = {};
      this.langSequence.forEach((l, i) => {
        this.fields.push({ key: l, label: this.$i18n.t(`${l}`) });
        if (i === this.langSequence.length - 1) {
          this.fields.push({
            key: "action",
            label: this.$i18n.t("action"),
          });
        }
      });
      let staticData = await import(`@/locale/translations.js`),
        mergedData = staticData.default || {},
        proceed = true;
      await service
        .getSavedConfig(`translations`)
        .then(async (results) => {
          mergedData = merge(staticData.default, results.data);
        })
        .catch((res) => {
          this.$store.state.loading = false;
          if (!res.message.includes("404")) {
            proceed = false;
            this.sweetAlert({
              title: this.$i18n.t("error"),
              text: res,
            });
          }
        });
      if (proceed) {
        Object.keys(mergedData).forEach((l) => {
          allTranslations[l] = mergedData[l];
        });
        if (this.$store.getters.getAppSettings.languageSupport) {
          Object.keys(allTranslations).forEach((l) => {
            if (!this.langSequence.includes(l)) {
              this.langSequence.push(l);
              this.fields.splice(this.fields.length - 1, 0, {
                key: l,
                label: this.$i18n.t(`${l}`),
              });
            }
          });
        }
        this.generateTranslationArray(allTranslations);
        // this.translationArray = this.translationArray.filter(
        //   (t) => !t[this.$i18n.locale].includes("{")
        // );
        this.$nextTick(() => {
          this.$store.state.loading = false;
          this.addTranslation = true;
        });
      }
    },
    editTranslation(data) {
      this.editOriginalObj = JSON.parse(JSON.stringify(data.item));
      this.editObj = JSON.parse(JSON.stringify(data.item));
    },
    saveEdit(translationArray = null) {
      this.$store.state.loading = true;
      let updatedData = [];
      if (translationArray) {
        this.translationArray.forEach((t) => {
          let isFound = translationArray.find((ut) => ut.path === t.path);
          if (isFound) {
            let obj = {
              path: t.path,
            };
            this.langSequence.forEach((l) => {
              if (t[l] !== isFound[l]) {
                obj[l] = isFound[l];
              }
            });
            if (Object.keys(obj).length > 1) {
              updatedData.push(obj);
            }
          }
        });
      }
      service
        .getSavedConfig(`translations`)
        .then((results) => {
          let data = results.data;
          if (translationArray) {
            updatedData.forEach((d) => {
              let dKeys = Object.keys(d);
              this.langSequence.forEach((l) => {
                if (dKeys.includes(l) && !data[l]) {
                  data[l] = {};
                }
                if (dKeys.includes(l)) {
                  data[l][d.path] = d[l] || "";
                }
              });
            });
          } else {
            this.langSequence.forEach((l, i) => {
              if (this.isLangChange[i]) {
                if (!data[l]) {
                  data[l] = {};
                }
                data[l][this.editObj.path] = this.editObj[l] || "";
              }
            });
          }
          service
            .updateConfig(data, `translations`)
            .then((res) => {
              this.$store.state.loading = false;
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
                confirmButtonText: this.$i18n.t("ok"),
              }).then((result) => {
                if (result.value) {
                  this.addTranslations();
                  this.cancelEdit();
                }
              });
            })
            .catch((res) => {
              this.$store.state.loading = false;
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: res,
              });
            });
        })
        .catch(() => {
          let data = {};
          if (translationArray) {
            updatedData.forEach((d) => {
              let dKeys = Object.keys(d);
              this.langSequence.forEach((l) => {
                if (dKeys.includes(l) && !data[l]) {
                  data[l] = {};
                }
                if (dKeys.includes(l)) {
                  data[l][d.path] = d[l] || "";
                }
              });
            });
          } else {
            this.langSequence.forEach((l, i) => {
              if (this.isLangChange[i]) {
                if (!data[l]) {
                  data[l] = {};
                }
                data[l][this.editObj.path] = this.editObj[l] || "";
              }
            });
          }
          service
            .saveConfig(data, `translations`)
            .then((res) => {
              this.$store.state.loading = false;
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
                confirmButtonText: this.$i18n.t("ok"),
              }).then((result) => {
                if (result.value) {
                  this.addTranslations();
                  this.cancelEdit();
                }
              });
            })
            .catch((res) => {
              this.$store.state.loading = false;
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: res,
              });
            });
        });
    },
    cancelEdit() {
      this.editOriginalObj = null;
      this.editObj = null;
      this.isLangChange = [];
      this.isLangValid = [];
      this.langVar = {};
    },
    downloadConfig() {
      this.$store.state.loading = true;
      service.getAllKeys().then(async (res) => {
        let zip = new JSZip();
        for (const file of res.data) {
          const contents = await service.getSavedConfig(file);

          zip.file(`${file}.json`, JSON.stringify(contents.data));
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(
            content,
            `${this.$store.getters.getNamespace}_${this.$moment().format(
              "lll"
            )}.zip`
          );
          this.$store.state.loading = false;
          this.sweetAlert({
            title: this.$i18n.t("backupDatastoreSuccess"),
          });
        });
      });
    },
    setSubTabs() {
      let noalert = true;
      this.$store.commit("setLoading", true);
      let key = this.generateKey("globalFactors");
      service
        .updateConfig(this.bgDataConfig, key, false, "fp-dashboard")
        .then((resp) => {
          if (resp.data.status === "OK") {
            this.$store.commit("setLoading", false);
            if (noalert)
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
          }
        })
        .catch((err) => {
          service
            .saveConfig(this.bgDataConfig, key, false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.$store.commit("setLoading", false);
                if (noalert)
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
              }
            })
            .catch((er) => {
              this.$store.commit("setLoading", false);
              if (noalert)
                this.sweetAlert({
                  title: this.$i18n.t("error2"),
                });
            });
        });
    },
  },
  created() {
    this.$store.state.loading = false;
    this.exportOptions = [
      { text: this.$i18n.t("applicationSetup"), value: "app" },
      {
        text: this.$i18n.t("globalSettings"),
        value: "gf",
      },
      {
        text: this.$i18n.t("summary_dashboard"),
        value: "md",
      },
      { text: this.$i18n.t("analytical_dashboard"), value: "ad" },
      { text: this.$i18n.t("DQR"), value: "dqr" },
      { text: this.$i18n.t("mapVisualization"), value: "map" },
    ];
  },
};
</script>
<style scoped lang="scss">
.b-table-sticky-header {
  max-height: 400px;
}
</style>
