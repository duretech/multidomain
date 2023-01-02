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
          class="black-btn new-gradbtn mr-2"
          @click="$bvModal.show('setSubTabsPopUp')"
		  v-if="subTabsBtn"
        >
          Set Tabs for IC
        </b-button>
        <b-modal id="setSubTabsPopUp" hide-footer>
          <template #modal-title> Set Tabs For Indicator Calculator </template>
          <div v-for="(item , itemName) in bgDataConfig.showingTabs" :key="itemName">
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
          <b-button
            class="mt-3"
            block
            @click="$bvModal.hide('setSubTabsPopUp'), setSubTabs()"
            >Update</b-button
          >
        </b-modal>
        <button
          type="button"
          class="btn btn-primary black-btn new-gradbtn mr-2"
          style="border: 2px solid #fff"
          @click.prevent.stop="exportLogsPopup"
        >
          {{ $t("exportLogs") }}
        </button>
        <button
          type="button"
          class="btn btn-primary black-btn new-gradbtn mr-2"
          style="border: 2px solid #fff"
          @click.prevent.stop="uploadConfigPopup"
          :title="$t('uploadConfigFiles')"
          v-b-tooltip.hover
        >
          <i class="fa fa-upload" aria-hidden="true"></i>
        </button>
        <b-modal
          v-model="uploadConfig"
          hide-footer
          centered
          size="md"
          :title="$t('uploadConfigFiles')"
          no-close-on-backdrop
        >
          <div class="">
            <div class="form-group row">
              <label
                for="inputDashboardDescription"
                class="col-sm-4 col-form-label"
                >{{ $t("selectFiles") }}</label
              >
              <div class="col-sm-8 p-t-4px">
                <input
                  type="file"
                  multiple
                  class="form-control-file"
                  style="font-size: 0.9375rem"
                  name="configFile"
                  ref="configFile"
                  @change="onFileChange"
                  id="ConfigFile"
                  accept="application/JSON"
                />
              </div>
            </div>
            <div class="row m-t-20px">
              <div class="col-sm-12 text-right">
                <button
                  type="button"
                  class="btn btn-primary new-btn1 black-btn"
                  v-on:click="uploadFile"
                >
                  {{ $t("upload") }}
                </button>
              </div>
            </div>
          </div>
        </b-modal>
        <!-- <button
					type="button"
					class="btn btn-primary black-btn new-gradbtn mr-2"
					style="border: 2px solid #fff"
					@click.prevent.stop="downloadConfig"
					:title="$t('backupDatastore')"
					v-b-tooltip.hover
				>
					<i class="fa fa-download" aria-hidden="true"></i>
				</button> -->
        <template v-if="$store.getters.getNamespace === `${tableName}`">
          <button
            type="button"
            class="btn btn-primary black-btn mr-2"
            style="border: 2px solid #fff"
            @click.prevent.stop="addTranslations"
            :title="$t('addTranslations')"
            v-b-tooltip.hover
          >
            <i class="fa fa-plus" aria-hidden="true"></i>
          </button>
          <b-modal
            v-model="addTranslation"
            hide-footer
            centered
            size="xl"
            :title="$t('addTranslations')"
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
                        <i
                          class="fa fa-edit cursor-pointer"
                          v-b-tooltip.hover
                          :title="$t('edit')"
                          @click="editTranslation(data)"
                        ></i>
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
              <div
                class="col-5 position-relative pr-0"
                style="min-height: 450px"
              >
                <template v-if="editObj">
                  <h5 class="mb-4">
                    {{ $t("editTranslation") }}
                  </h5>
                  <template v-if="langSequence[0]">
                    <div class="pb-3">
                      <label for="translation-lang1">{{
                        $t(`${langSequence[0]}`)
                      }}</label>
                      <b-form-textarea
                        id="translation-lang1"
                        size="sm"
                        placeholder=""
                        v-model="editObj[langSequence[0]]"
                      ></b-form-textarea>
                      <div class="small pt-2" v-if="firstLangChange">
                        <i
                          class="fa fa-undo mr-3 cursor-pointer"
                          @click="
                            editObj[langSequence[0]] =
                              editOriginalObj[langSequence[0]]
                          "
                          :title="$t('revert')"
                          v-b-tooltip.hover
                        ></i>
                        {{ editOriginalObj[langSequence[0]] }}
                      </div>
                    </div>
                  </template>
                  <template v-if="langSequence[1]">
                    <div class="pb-3">
                      <label for="translation-lang2">{{
                        $t(`${langSequence[1]}`)
                      }}</label>
                      <b-form-textarea
                        id="translation-lang2"
                        size="sm"
                        placeholder=""
                        v-model="editObj[langSequence[1]]"
                      ></b-form-textarea>
                      <div class="small pt-2" v-if="secondLangChange">
                        <i
                          class="fa fa-undo mr-3 cursor-pointer"
                          @click="
                            editObj[langSequence[1]] =
                              editOriginalObj[langSequence[1]]
                          "
                          :title="$t('revert')"
                          v-b-tooltip.hover
                        ></i>
                        {{ editOriginalObj[langSequence[1]] }}
                      </div>
                    </div>
                  </template>
                  <div
                    class="text-right mt-4 position-absolute"
                    style="bottom: 0; right: 0"
                  >
                    <button
                      type="button"
                      class="btn btn-primary new-btndisable black-btn ml-3"
                      style="border: 2px solid #fff"
                      @click.prevent.stop="saveEdit"
                      :disabled="!firstLangChange && !secondLangChange"
                    >
                      {{ $t("savebtn") }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary new-btn1 black-btn ml-3"
                      style="border: 2px solid #fff"
                      @click.prevent.stop="cancelEdit"
                    >
                      {{ $t("cancelbtn") }}
                    </button>
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
            {{ $t("exportbtn") }}
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
import set from "lodash/set";
import merge from "lodash/merge";
import JSZip from "jszip";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";

export default {
  components: {},
  props: ["subTabsBtn","bgDataConfig","openTabPopUp"],
  mixins: [LanguageChangeMixin, EmitTourCallbackMixin],
  data() {
    return {
      exportPopup: false,
      selectedModule: null,
      exportOptions: [],
      uploadConfig: false,
      selectedFiles: {},
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
      firstLangChange: false,
      secondLangChange: false,
      searchText: "",
      updateDOM: 0,
      tableName: settings.tableName,
    };
  },
  computed: {
    filteredTranslationArray() {
      let filteredTranslations = this.translationArray.filter(
        (t) =>
          t.en.toLowerCase().includes(this.searchText.toLowerCase()) ||
          t.fr.toLowerCase().includes(this.searchText.toLowerCase())
      );
      return filteredTranslations;
    },
  },
  watch: {
    langSequence(newValue) {
      console.log("langSequence", newValue);
    },
    filteredTranslationArray(newValue) {
      this.rows = newValue.length;
    },
    openTabPopUp(newValue){
      console.log(newValue)
    if(newValue){
      this.$bvModal.show('setSubTabsPopUp')
    }
    else{
      this.$bvModal.hide('setSubTabsPopUp')
      
    }
  },
    editObj: {
      handler: function (newValue) {
        if (newValue) {
          this.firstLangChange = this.langSequence[0]
            ? this.editOriginalObj[this.langSequence[0]] !==
              newValue[this.langSequence[0]]
            : false;
          this.secondLangChange = this.langSequence[1]
            ? this.editOriginalObj[this.langSequence[1]] !==
              newValue[this.langSequence[1]]
            : false;
        }
      },
      deep: true,
    },
  },
  methods: {
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
    generateTranslationArray(lang, obj, obj1 = null, path = "") {
      Object.keys(obj).forEach((t) => {
        if (typeof obj[t] === "object") {
          this.generateTranslationArray(lang, obj[t], obj1, `${path}${t}.`);
        } else {
          let transObj = {
            path: `${path}${t}`,
            [lang[0]]: obj[t],
          };
          if (settings.languageSupport && obj1) {
            transObj[[lang[1]]] = get(obj1, `${path}${t}`) || "";
          }
          this.translationArray.push(transObj);
        }
      });
    },
    async addTranslations() {
      this.$store.state.loading = true;
      this.translationArray = [];
      this.langSequence = [this.$i18n.locale];
      if (settings.languageSupport) {
        ["en", "fr"].forEach((l) => {
          if (l !== this.$i18n.locale) {
            this.langSequence.push(l);
          }
        });
      }
      let promises = [],
        allTranslations = {};
      this.langSequence.forEach((l, i) => {
        this.fields.push({ key: l, label: this.$i18n.t(`${l}`) });
        if (i === this.langSequence.length - 1) {
          this.fields.push({
            key: "action",
            label: this.$i18n.t("action"),
          });
        }
        promises.push(service.getSavedConfig(`translations_${l}`));
      });
      await Promise.allSettled(promises)
        .then(async (results) => {
          // console.log("results", results);
          for (let i = 0; i < results.length; i++) {
            let staticData = await import(
              `@/locale/${this.langSequence[i]}.js`
            );
            if (results[i].status === "rejected") {
              allTranslations[this.langSequence[i]] = staticData.default;
            } else {
              allTranslations[this.langSequence[i]] = merge(
                staticData.default,
                results[i].value.data
              );
            }
          }
        })
        .catch((res) => {
          console.log("error", res);
          this.$store.state.loading = false;
          this.$swal({
            title: this.$i18n.t("error"),
            text: res,
          });
        });
      if (settings.languageSupport) {
        this.generateTranslationArray(
          this.langSequence,
          allTranslations[this.langSequence[0]],
          allTranslations[this.langSequence[1]]
        );
      } else {
        this.generateTranslationArray(
          this.langSequence,
          allTranslations[this.langSequence[0]]
        );
      }
      // console.log("this.translationArray", this.translationArray);
      this.translationArray = this.translationArray.filter(
        (t) => !t[this.$i18n.locale].includes("{")
      );
      // console.log("this.translationArray", this.translationArray);
      this.$nextTick(() => {
        this.$store.state.loading = false;
        this.addTranslation = true;
      });
    },
    editTranslation(data) {
      // console.log(data);
      this.editOriginalObj = JSON.parse(JSON.stringify(data.item));
      this.editObj = JSON.parse(JSON.stringify(data.item));
    },
    async saveEdit() {
      this.$store.state.loading = true;
      // console.log("this.editObj", this.editObj);
      // console.log("firstLangChange", this.firstLangChange);
      // console.log("secondLangChange", this.secondLangChange);

      let promises = [];
      if (this.firstLangChange) {
        promises.push(
          service.getSavedConfig(`translations_${this.langSequence[0]}`)
        );
      }
      if (this.secondLangChange) {
        promises.push(
          service.getSavedConfig(`translations_${this.langSequence[1]}`)
        );
      }

      await Promise.allSettled(promises)
        .then(async (results) => {
          // console.log("results", results);
          let successArr = [],
            failArr = [];
          for (let i = 0; i < results.length; i++) {
            let lang =
              i === 0 && this.firstLangChange
                ? this.langSequence[0]
                : this.langSequence[1];
            // console.log("i", i, lang);
            if (results[i].status === "rejected") {
              let obj = {};
              set(obj, this.editObj.path, this.editObj[lang]);
              // console.log("obj rejected", obj);
              await service
                .saveConfig(obj, `translations_${lang}`)
                .then((res) => {
                  // console.log("res", res);
                  // this.addTranslations();
                  successArr.push(lang);
                })
                .catch(() => {
                  failArr.push(lang);
                  console.log(lang, " failed");
                });
            } else {
              let obj = results[i].value.data;
              set(obj, this.editObj.path, this.editObj[lang]);
              // console.log("obj success", obj);
              await service
                .updateConfig(obj, `translations_${lang}`)
                .then((res) => {
                  // console.log("res", res);
                  // this.addTranslations();
                  successArr.push(lang);
                })
                .catch(() => {
                  failArr.push(lang);
                  console.log(lang, " failed");
                });
            }
          }
          // console.log("successArr", successArr);
          // console.log("failArr", failArr);
          // console.log("results", results.length);
          this.$store.state.loading = false;
          let successText = "",
            failText = "";
          if (successArr.length) {
            let transNames = "";
            for (let i = 0; i < successArr.length; i++) {
              transNames +=
                i === 0
                  ? this.$i18n.t(`${successArr[i]}`)
                  : " & " + this.$i18n.t(`${successArr[i]}`);
            }
            successText = this.$i18n.t("successTranslation", {
              languages: `<b>${transNames}</b>`,
            });
          }
          if (failArr.length) {
            let transNames = "";
            for (let i = 0; i < failArr.length; i++) {
              transNames +=
                i === 0
                  ? this.$i18n.t(`${failArr[i]}`)
                  : " & " + this.$i18n.t(`${failArr[i]}`);
            }
            failText = this.$i18n.t("failTranslation", {
              languages: `<b>${transNames}</b>`,
            });
          }
          this.$swal({
            title: this.$i18n.t("status"),
            html: `<div><div>${successText}</div><div>${failText}</div></div>`,
            showCancelButton: false,
            confirmButtonText: this.$i18n.t("ok"),
          }).then((result) => {
            if (result.value) {
              this.addTranslations();
              this.cancelEdit();
            }
          });
          // if (arr.length === results.length) {
          // } else {
          //   this.$store.state.loading = false;
          //   this.$swal({
          //     title: this.$i18n.t("error"),
          //   });
          // }
        })
        .catch((res) => {
          console.log("error", res);
          this.$store.state.loading = false;
          this.$swal({
            title: this.$i18n.t("error"),
            text: res,
          });
        });

      // if (this.firstLangChange) {
      //   console.log("in firstLangChange if");
      //   service
      //     .getSavedConfig(`translations_${this.langSequence[0]}`)
      //     .then((trans) => {
      //       console.log("first trans", trans);
      //       set(
      //         trans.data,
      //         this.editObj.path,
      //         this.editObj[this.langSequence[0]]
      //       );
      //       console.log("trans.data", trans.data);
      //       service
      //         .updateConfig(trans.data, `translations_${this.langSequence[0]}`)
      //         .then((res) => {
      //           console.log("res", res);
      //           this.addTranslations();
      //         })
      //         .catch(() => {
      //           console.log(this.langSequence[0], " failed");
      //         });
      //     })
      //     .catch(() => {
      //       let obj = {};
      //       set(obj, this.editObj.path, this.editObj[this.langSequence[0]]);
      //       console.log("obj", obj);
      //       service
      //         .saveConfig(obj, `translations_${this.langSequence[0]}`)
      //         .then((res) => {
      //           console.log("res", res);
      //           this.addTranslations();
      //         })
      //         .catch(() => {
      //           console.log(this.langSequence[0], " failed");
      //         });
      //     });
      // }
      // if (this.secondLangChange) {
      //   console.log("in secondLangChange if");
      //   service
      //     .getSavedConfig(`translations_${this.langSequence[1]}`)
      //     .then((trans) => {
      //       console.log("second trans", trans);
      //       set(
      //         trans.data,
      //         this.editObj.path,
      //         this.editObj[this.langSequence[1]]
      //       );
      //       console.log("trans.data", trans.data);
      //       service
      //         .updateConfig(trans.data, `translations_${this.langSequence[1]}`)
      //         .then((res) => {
      //           console.log("res", res);
      //           this.addTranslations();
      //         })
      //         .catch(() => {
      //           console.log(this.langSequence[1], " failed");
      //         });
      //     })
      //     .catch(() => {
      //       let obj = {};
      //       set(obj, this.editObj.path, this.editObj[this.langSequence[1]]);
      //       console.log("obj", obj);
      //       service
      //         .saveConfig(obj, `translations_${this.langSequence[1]}`)
      //         .then((res) => {
      //           console.log("res", res);
      //           this.addTranslations();
      //         })
      //         .catch(() => {
      //           console.log(this.langSequence[1], " failed");
      //         });
      //     });
      // }
    },
    cancelEdit() {
      this.editOriginalObj = null;
      this.editObj = null;
      this.firstLangChange = false;
      this.secondLangChange = false;
    },
    onFileChange(event) {
      this.$refs.configFile.files.forEach((file) => {
        const reader = new FileReader();
        let fName = file.name.split(".")[0];
        reader.onload = (res) => {
          let file = JSON.parse(res.target.result);
          console.log(fName, JSON.parse(JSON.stringify(file)));
          this.removeCID(file);
          console.log(fName, JSON.parse(JSON.stringify(file)));
          // this.selectedFiles[fName] = JSON.parse(res.target.result);
          this.selectedFiles[fName] = file;
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(file);
      });
    },
    removeCID(obj) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, "cid"))
        obj["cid"] = "";
      if (obj && Object.prototype.hasOwnProperty.call(obj, "name"))
        obj["name"] = Array.isArray(obj["name"])
          ? obj["name"][0] || ""
          : obj["name"];
      if (obj && Object.prototype.hasOwnProperty.call(obj, "static_name"))
        obj["static_name"] = Array.isArray(obj["static_name"])
          ? obj["static_name"][0] || ""
          : obj["static_name"];
      if (obj instanceof Array) obj.forEach(this.removeCID);
      else if (obj instanceof Object) for (var k in obj) this.removeCID(obj[k]);
    },
    uploadFile() {
      // console.log("this.selectedFiles", this.selectedFiles)
      this.$store.state.loading = true;
      service
        .getAllKeys()
        .then((res) => {
          // console.log("res", res)
          this.processUploadFile(res);
        })
        .catch(() => {
          this.processUploadFile();
        });
    },
    async processUploadFile(res = null) {
      let fileCount = 0,
        fileSuccess = [],
        fileDuplicate = [],
        fileError = [],
        promises = [],
        files = [];
      Object.keys(this.selectedFiles).forEach((key) => {
        if (res && res.data.includes(key)) {
          fileDuplicate.push(key);
          fileCount++;
        } else {
          files.push(key);
          promises.push(service.saveConfig(this.selectedFiles[key], key));
        }
      });
      console.log("promises", promises);
      await Promise.allSettled(promises).then((results) => {
        results.forEach((response, i) => {
          // console.log("response", response)
          // console.log("files", files)
          if (response.status === "fulfilled") {
            fileSuccess.push(files[i]);
            fileCount++;
          } else {
            fileError.push(files[i]);
            fileCount++;
          }
        });
      });
      // console.log("fileCount", fileCount)
      // console.log("Object.keys(this.selectedFiles).length", Object.keys(this.selectedFiles).length)
      // console.log("fileError", fileError)
      // console.log("fileDuplicate", fileDuplicate)
      // console.log("fileSuccess", fileSuccess)
      // if (fileCount === Object.keys(this.selectedFiles).length) {
      console.log("All files processed...");
      this.$store.state.loading = false;
      let successText = this.createStatusText(
        fileSuccess,
        "success",
        "success"
      );
      let duplicateText = this.createStatusText(
        fileDuplicate,
        "ignored",
        "info"
      );
      let errorText = this.createStatusText(fileError, "error", "danger");
      this.$swal({
        title: this.$i18n.t("status"),
        html: `<div>${successText} ${duplicateText} ${errorText}</div>`,
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("dashboard"),
        cancelButtonText: this.$i18n.t("ok"),
      }).then((result) => {
        if (result.value) {
          this.$router.push("/");
        }
      });
      this.resetFileDetails();
      // }
    },
    createStatusText(files, textType, textClass) {
      let text = "";
      if (files.length) {
        let textLI = "";
        files.forEach((f) => {
          textLI += `<li class="text-left">${f}</li>`;
        });
        text = `<div>
          <div class="text-left">
            <strong class="text-${textClass}">${this.$i18n.t(
          `${textType}Head`
        )}</strong> ${this.$i18n.t(`${textType}Text`, {
          fileLength: files.length,
        })}
          </div>
          <ul>
            ${textLI}
          </ul>
        </div>`;
      }
      return text;
    },
    resetFileDetails() {
      this.selectedFiles = {};
      this.$refs.configFile.value = null;
    },
    downloadConfig() {
      this.$store.state.loading = true;
      service.getAllKeys().then(async (res) => {
        // console.log("all keys", res.data);
        let zip = new JSZip();
        for (const file of res.data) {
          const contents = await service.getSavedConfig(file, false); //removed 3rd param to get the json only
          console.log("file", contents);
          zip.file(`${file}.json`, JSON.stringify(contents.data));
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(
            content,
            `${settings.tableName}_${this.$moment().format("lll")}.zip`
          );
          this.$store.state.loading = false;
          this.$swal({
            title: this.$i18n.t("backupDatastoreSuccess"),
          });
        });
      });
    },
    setSubTabs() {
		let noalert = true;
    console.log(this.bgDataConfig)
		this.$store.commit("setLoading", true);
      service
        .updateConfig(this.bgDataConfig, "globalFactors_en" ,false, "fp-dashboard")
        .then((resp) => {
          if (resp.data.status === "OK") {
            this.$store.commit("setLoading", false);
            if (noalert)
              this.$swal({
                title: "Data updated successfully.",
                type: "success",
              }).then(() => {});
          }
        })
        .catch((err) => {
          service
            .saveConfig(this.bgDataConfig, "globalFactors_en" , false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.$store.commit("setLoading", false);
                if (noalert)
                  this.$swal({
                    title: "Data saved successfully.",
                    type: "success",
                  }).then(() => {});
              }
            })
            .catch((er) => {
              this.$store.commit("setLoading", false);
              if (noalert)
                this.$swal({
                  title: "Something went wrong. Please try again later.",
                  type: "error",
                }).then(() => {});
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
        text: this.$i18n.t("ministerial"),
        value: "md",
      },
      { text: this.$i18n.t("analytical"), value: "ad" },
      { text: this.$i18n.t("dataQuality"), value: "dqr" },
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
